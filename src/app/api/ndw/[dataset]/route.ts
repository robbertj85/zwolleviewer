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
  parseMSIEvents,
  matchMSIToDrips,
} from "@/lib/ndw-xml";

// In-memory caches per dataset
const cache = new Map<string, { data: GeoJSON.FeatureCollection; ts: number }>();
const CACHE_TTL: Record<string, number> = {
  incidents: 60_000, // 1 min - real-time
  actueel: 60_000,
  srti: 60_000,
  brugopeningen: 60_000,
  trafficspeed: 60_000,
  msi: 60_000, // 1 min - real-time sign states
  truckparking: 120_000, // 2 min
  maxsnelheden: 300_000, // 5 min
  emissiezones: 3600_000, // 1 hour - static
  drips: 3600_000,
};

// Measurement site table cache (large, rarely changes)
let siteTableCache: {
  sites: Map<string, [number, number]>;
  ts: number;
} | null = null;
const SITE_TABLE_TTL = 24 * 3600_000; // 24h

const NDW_URLS: Record<string, string | string[]> = {
  incidents: "https://opendata.ndw.nu/incidents.xml.gz",
  actueel: "https://opendata.ndw.nu/actueel_beeld.xml.gz",
  srti: "https://opendata.ndw.nu/srti.xml.gz",
  brugopeningen: "https://opendata.ndw.nu/brugopeningen.xml.gz",
  emissiezones: "https://opendata.ndw.nu/emissiezones.xml.gz",
  maxsnelheden:
    "https://opendata.ndw.nu/tijdelijke_verkeersmaatregelen_maximum_snelheden.xml.gz",
  drips: "https://opendata.ndw.nu/LocatietabelDRIPS.xml.gz",
  msi: [
    "https://opendata.ndw.nu/LocatietabelDRIPS.xml.gz",
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
};

async function getMeasurementSites(): Promise<Map<string, [number, number]>> {
  if (siteTableCache && Date.now() - siteTableCache.ts < SITE_TABLE_TTL) {
    return siteTableCache.sites;
  }
  const xml = await fetchNdwGz("https://opendata.ndw.nu/measurement.xml.gz");
  const parsed = parseXml(xml);
  const sites = parseMeasurementSiteTable(parsed);
  siteTableCache = { sites, ts: Date.now() };
  return sites;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dataset: string }> }
) {
  const { dataset } = await params;
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

  // Check cache
  const ttl = CACHE_TTL[dataset] ?? 300_000;
  const cached = cache.get(dataset);
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
      case "maxsnelheden": {
        const xml = await fetchNdwGz(urls as string);
        const parsed = parseXml(xml);
        geojson = parseSituations(parsed, dataset);
        break;
      }
      case "emissiezones": {
        const xml = await fetchNdwGz(urls as string);
        const parsed = parseXml(xml);
        geojson = parseEmissiezones(parsed);
        break;
      }
      case "drips": {
        const xml = await fetchNdwGz(urls as string);
        const parsed = parseXml(xml);
        geojson = parseVmsTable(parsed);
        break;
      }
      case "msi": {
        const [dripsUrl, msiUrl] = urls as string[];
        const [dripsXml, msiXml] = await Promise.all([
          fetchNdwGz(dripsUrl),
          fetchNdwGz(msiUrl),
        ]);
        const dripsParsed = parseXml(dripsXml);
        const dripsGeo = parseVmsTable(dripsParsed);
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
        geojson = parseTruckParkingStatus(statusParsed, table);
        break;
      }
      case "trafficspeed": {
        const [_siteUrl, speedUrl] = urls as string[];
        const [sites, speedXml] = await Promise.all([
          getMeasurementSites(),
          fetchNdwGz(speedUrl),
        ]);
        // Use fast regex parser — skips building full XML DOM tree
        geojson = parseTrafficSpeedFast(speedXml, sites);
        break;
      }
      default:
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
    }

    cache.set(dataset, { data: geojson, ts: Date.now() });

    return NextResponse.json(geojson, {
      headers: {
        "Cache-Control": `public, s-maxage=${Math.floor(ttl / 1000)}`,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "NDW fetch error";
    console.error(`NDW ${dataset} error:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
