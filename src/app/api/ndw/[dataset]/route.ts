import { NextResponse } from "next/server";
import {
  fetchNdwGz,
  parseXml,
  parseSituations,
  parseEmissiezones,
  parseVmsTable,
  parseTruckParkingTable,
  parseTruckParkingStatus,
  parseMeasurementSiteTable,
  parseTrafficSpeedFast,
  parseTravelTimeFast,
  parseMSIEvents,
  matchMSIToDrips,
  expandBboxForNdw,
  type NdwBbox,
} from "@/lib/ndw-xml";
import { getCity } from "@/lib/cities";

// In-memory caches per (dataset, citySlug)
const cache = new Map<string, { data: GeoJSON.FeatureCollection; ts: number }>();
const CACHE_TTL: Record<string, number> = {
  incidents: 60_000,
  actueel: 60_000,
  srti: 60_000,
  brugopeningen: 60_000,
  afsluitingen: 60_000,
  wegwerkzaamheden: 300_000,
  trafficspeed: 60_000,
  msi: 60_000,
  truckparking: 120_000,
  maxsnelheden: 300_000,
  emissiezones: 3600_000,
  drips: 3600_000,
  traveltime: 60_000,
};

// Measurement site table cache (large, rarely changes) — keyed per city
const siteTableCaches = new Map<
  string,
  { sites: Map<string, [number, number]>; ts: number }
>();
const SITE_TABLE_TTL = 24 * 3600_000;

// All URLs updated 2026-05 to match NDW's DATEX II v3 file names.
// See https://docs.ndw.nu/dataformaten/datex2-v2.3/conversie-naar-v3/ for the
// rename table. Old names (incidents.xml.gz, srti.xml.gz, brugopeningen.xml.gz,
// LocatietabelDRIPS.xml.gz) now return 404.
const NDW_URLS: Record<string, string | string[]> = {
  // "incidents" no longer has a standalone feed — actueel_beeld carries them.
  // Kept as an alias so existing layer ids keep resolving.
  incidents: "https://opendata.ndw.nu/actueel_beeld.xml.gz",
  actueel: "https://opendata.ndw.nu/actueel_beeld.xml.gz",
  srti: "https://opendata.ndw.nu/veiligheidsgerelateerde_berichten_srti.xml.gz",
  brugopeningen:
    "https://opendata.ndw.nu/planningsfeed_brugopeningen.xml.gz",
  afsluitingen:
    "https://opendata.ndw.nu/tijdelijke_verkeersmaatregelen_afsluitingen.xml.gz",
  wegwerkzaamheden:
    "https://opendata.ndw.nu/planningsfeed_wegwerkzaamheden_en_evenementen.xml.gz",
  emissiezones: "https://opendata.ndw.nu/emissiezones.xml.gz",
  maxsnelheden:
    "https://opendata.ndw.nu/tijdelijke_verkeersmaatregelen_maximum_snelheden.xml.gz",
  drips: "https://opendata.ndw.nu/dynamische_route_informatie_paneel.xml.gz",
  msi: [
    "https://opendata.ndw.nu/dynamische_route_informatie_paneel.xml.gz",
    "https://opendata.ndw.nu/Matrixsignaalinformatie.xml.gz",
  ],
  truckparking: [
    "https://opendata.ndw.nu/Truckparking_Parking_Table.xml",
    "https://opendata.ndw.nu/Truckparking_Parking_Status.xml",
  ],
  trafficspeed: [
    "https://opendata.ndw.nu/measurement.xml.gz",
    "https://opendata.ndw.nu/trafficspeed.xml.gz",
  ],
  traveltime: "https://opendata.ndw.nu/traveltime.xml.gz",
};

async function getMeasurementSites(bbox: NdwBbox, citySlug: string) {
  const cached = siteTableCaches.get(citySlug);
  if (cached && Date.now() - cached.ts < SITE_TABLE_TTL) return cached.sites;
  const xml = await fetchNdwGz("https://opendata.ndw.nu/measurement.xml.gz");
  const parsed = parseXml(xml);
  const sites = parseMeasurementSiteTable(parsed, bbox);
  siteTableCaches.set(citySlug, { sites, ts: Date.now() });
  return sites;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dataset: string }> }
) {
  const { dataset } = await params;
  const url = new URL(request.url);
  const slug = url.searchParams.get("city") ?? "zwolle";
  const city = getCity(slug) ?? getCity("zwolle")!;
  const bbox = expandBboxForNdw(city.bbox);
  const cacheKey = `${dataset}:${city.slug}`;

  const urls = NDW_URLS[dataset];
  if (!urls) {
    return NextResponse.json(
      {
        error: `Unknown dataset: ${dataset}`,
        available: Object.keys(NDW_URLS),
      },
      { status: 404 }
    );
  }

  const ttl = CACHE_TTL[dataset] ?? 300_000;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < ttl) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": `public, s-maxage=${Math.floor(ttl / 1000)}`,
      },
    });
  }

  try {
    let geojson: GeoJSON.FeatureCollection;

    switch (dataset) {
      case "incidents":
      case "actueel":
      case "srti":
      case "brugopeningen":
      case "afsluitingen":
      case "wegwerkzaamheden":
      case "maxsnelheden": {
        const xml = await fetchNdwGz(urls as string);
        const parsed = parseXml(xml);
        geojson = parseSituations(parsed, dataset, bbox);
        break;
      }
      case "emissiezones": {
        const xml = await fetchNdwGz(urls as string);
        const parsed = parseXml(xml);
        geojson = parseEmissiezones(parsed, bbox);
        break;
      }
      case "drips": {
        const xml = await fetchNdwGz(urls as string);
        const parsed = parseXml(xml);
        geojson = parseVmsTable(parsed, bbox);
        break;
      }
      case "msi": {
        const [dripsUrl, msiUrl] = urls as string[];
        const [dripsXml, msiXml] = await Promise.all([
          fetchNdwGz(dripsUrl),
          fetchNdwGz(msiUrl),
        ]);
        const dripsParsed = parseXml(dripsXml);
        const dripsGeo = parseVmsTable(dripsParsed, bbox);
        const msiSigns = parseMSIEvents(msiXml);
        geojson = matchMSIToDrips(msiSigns, dripsGeo.features);
        break;
      }
      case "truckparking": {
        const [tableUrl, statusUrl] = urls as string[];
        const [tableXml, statusXml] = await Promise.all([
          fetchNdwGz(tableUrl),
          fetchNdwGz(statusUrl),
        ]);
        const tableParsed = parseXml(tableXml);
        const statusParsed = parseXml(statusXml);
        const table = parseTruckParkingTable(tableParsed);
        geojson = parseTruckParkingStatus(statusParsed, table, bbox);
        break;
      }
      case "trafficspeed": {
        const [, speedUrl] = urls as string[];
        const [sites, speedXml] = await Promise.all([
          getMeasurementSites(bbox, city.slug),
          fetchNdwGz(speedUrl),
        ]);
        geojson = parseTrafficSpeedFast(speedXml, sites);
        break;
      }
      case "traveltime": {
        // Travel time is a DATEX II MeasuredDataPublication keyed against the
        // measurement site table — same as trafficspeed but with
        // TravelTimeData (duration in seconds). The traveltime sites are
        // itinerary-coded (city-street segments), so the measurement-site map
        // must include those; extractCoord handles the itinerary path.
        const [sites, xml] = await Promise.all([
          getMeasurementSites(bbox, city.slug),
          fetchNdwGz(urls as string),
        ]);
        geojson = parseTravelTimeFast(xml, sites);
        if (geojson.features.length === 0 && sites.size === 0) {
          console.error(
            `NDW traveltime (${city.slug}): measurement site table returned 0 sites in bbox`
          );
        }
        break;
      }
      default:
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
    }

    // Tighten error reporting: warn when a parser returned zero features but
    // the source dataset is one that should normally have global coverage.
    // This catches schema drift early without breaking the response.
    if (geojson.features.length === 0) {
      const expectGlobal = new Set([
        "incidents",
        "actueel",
        "srti",
        "wegwerkzaamheden",
        "trafficspeed",
        "traveltime",
        "msi",
        "drips",
      ]);
      if (expectGlobal.has(dataset)) {
        console.warn(
          `NDW ${dataset} (${city.slug}): parser returned 0 features — possible schema drift or empty bbox`
        );
      }
    }

    cache.set(cacheKey, { data: geojson, ts: Date.now() });

    return NextResponse.json(geojson, {
      headers: {
        "Cache-Control": `public, s-maxage=${Math.floor(ttl / 1000)}`,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "NDW fetch error";
    console.error(`NDW ${dataset} (${city.slug}) error:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
