import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const DSO_API_KEY = process.env.DSO_API_KEY || "";
const DSO_BASE =
  "https://service.omgevingswet.overheid.nl/publiek/omgevingsinformatie/api/ontsluiten/v2";
const GEOM_BASE =
  "https://service.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/geometrieopvragen/v1";

// Grid of sample points across Zwolle in RD (EPSG:28992) coordinates
const ZWOLLE_SAMPLE_POINTS: [number, number][] = [
  [199500, 501500], [200000, 501500], [200500, 501500], [201000, 501500],
  [199500, 502000], [200000, 502000], [200500, 502000], [201000, 502000],
  [199500, 502500], [200000, 502500], [200500, 502500], [201000, 502500],
  [200000, 503000], [200500, 503000], [201000, 503000], [201500, 503000],
  [200500, 503500], [201000, 503500],
];

// Approximate RD -> WGS84 for Zwolle area
function rdToWgs84(x: number, y: number): [number, number] {
  const lon = 6.1 + ((x - 200500) / 111320) * (1 / Math.cos(52.51 * Math.PI / 180));
  const lat = 52.51 + (y - 502500) / 111320;
  return [lon, lat];
}

interface DSODocument {
  identificatie: string;
  titel: string;
  type: string;
  geometrieIdentificaties?: string[];
  imroDocumentMetadata?: {
    regelStatus?: string;
    planstatusInfo?: { planstatus?: string; datum?: string };
    isHistorisch?: boolean;
  };
  aangeleverdDoorEen?: { naam?: string; code?: string };
  geldigVanaf?: string;
}

async function fetchGeometry(geometrieId: string): Promise<GeoJSON.Geometry | null> {
  try {
    const res = await fetch(
      `${GEOM_BASE}/geometrieen/${encodeURIComponent(geometrieId)}?crs=${encodeURIComponent("http://www.opengis.net/def/crs/EPSG/0/4258")}`,
      { headers: { "X-Api-Key": DSO_API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    // The API returns { geometrie: { type, coordinates } } or { type, coordinates } directly
    const geom = data.geometrie || data;
    if (geom?.type && geom?.coordinates) return geom as GeoJSON.Geometry;
    return null;
  } catch {
    return null;
  }
}

/**
 * Proxy for DSO Omgevingsinformatie Ontsluiten API.
 * Searches for bestemmingsplannen covering Zwolle via sample points.
 * Fetches actual polygon geometry where available (OW plans).
 */
export async function GET() {
  if (!DSO_API_KEY) {
    return NextResponse.json(
      { type: "FeatureCollection", features: [] },
      { headers: { "Cache-Control": "public, max-age=3600" } }
    );
  }

  try {
    const planMap = new Map<string, { doc: DSODocument; rdPoint: [number, number] }>();

    const fetchPoint = async (coords: [number, number]) => {
      const res = await fetch(`${DSO_BASE}/documenten/_zoek?size=50`, {
        method: "POST",
        headers: {
          "X-Api-Key": DSO_API_KEY,
          "Content-Type": "application/json",
          "Content-Crs": "http://www.opengis.net/def/crs/EPSG/0/28992",
        },
        body: JSON.stringify({
          bestuurslaag: "GEMEENTE",
          regelgevingOfOverig: "REGELGEVING",
          geometrie: { type: "Point", coordinates: coords },
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const docs = (data?._embedded?.documenten || []) as DSODocument[];
      for (const doc of docs) {
        if (!planMap.has(doc.identificatie)) {
          planMap.set(doc.identificatie, { doc, rdPoint: coords });
        }
      }
    };

    // Batch 3 at a time
    for (let i = 0; i < ZWOLLE_SAMPLE_POINTS.length; i += 3) {
      const batch = ZWOLLE_SAMPLE_POINTS.slice(i, i + 3);
      await Promise.all(batch.map(fetchPoint));
    }

    const features: GeoJSON.Feature[] = [];

    for (const [, { doc, rdPoint }] of planMap) {
      if (doc.imroDocumentMetadata?.isHistorisch) continue;

      // Try to fetch actual geometry for non-IMRO plans (OW geometry IDs)
      let geometry: GeoJSON.Geometry | null = null;
      const geomIds = doc.geometrieIdentificaties || [];
      for (const gid of geomIds) {
        if (!gid.startsWith("NL.IMRO")) {
          geometry = await fetchGeometry(gid);
          if (geometry) break;
        }
      }

      // Fall back to sample point location
      if (!geometry) {
        const [lon, lat] = rdToWgs84(rdPoint[0], rdPoint[1]);
        geometry = { type: "Point", coordinates: [lon, lat] };
      }

      features.push({
        type: "Feature",
        geometry,
        properties: {
          naam: doc.titel,
          identificatie: doc.identificatie,
          type: doc.type,
          status: doc.imroDocumentMetadata?.regelStatus || "",
          planstatus: doc.imroDocumentMetadata?.planstatusInfo?.planstatus || "",
          datum: doc.imroDocumentMetadata?.planstatusInfo?.datum || "",
          bevoegdGezag: doc.aangeleverdDoorEen?.naam || "",
          geldigVanaf: doc.geldigVanaf || "",
          hasGeometry: geometry.type !== "Point",
        },
      });
    }

    return NextResponse.json(
      { type: "FeatureCollection" as const, features },
      { headers: { "Cache-Control": "no-cache" } }
    );
  } catch (err) {
    console.error("DSO API error:", err);
    return NextResponse.json(
      { type: "FeatureCollection", features: [] },
      { headers: { "Cache-Control": "public, max-age=60" } }
    );
  }
}
