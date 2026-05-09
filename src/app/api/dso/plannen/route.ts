import { NextResponse } from "next/server";
import { getCity } from "@/lib/cities";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const DSO_API_KEY = process.env.DSO_API_KEY || "";
const DSO_BASE =
  "https://service.omgevingswet.overheid.nl/publiek/omgevingsinformatie/api/ontsluiten/v2";
const GEOM_BASE =
  "https://service.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/geometrieopvragen/v1";

/** Approximate WGS84 → RD (EPSG:28992) for a single point near a given anchor. */
function wgs84ToRdApprox(
  lon: number,
  lat: number,
  anchorLon: number,
  anchorLat: number,
  anchorRdX: number,
  anchorRdY: number
): [number, number] {
  const x = anchorRdX + (lon - anchorLon) * 111320 * Math.cos((anchorLat * Math.PI) / 180);
  const y = anchorRdY + (lat - anchorLat) * 111320;
  return [x, y];
}

function rdToWgs84(
  x: number,
  y: number,
  anchorLon: number,
  anchorLat: number,
  anchorRdX: number,
  anchorRdY: number
): [number, number] {
  const lon =
    anchorLon + ((x - anchorRdX) / 111320) * (1 / Math.cos((anchorLat * Math.PI) / 180));
  const lat = anchorLat + (y - anchorRdY) / 111320;
  return [lon, lat];
}

/**
 * Build a sparse grid of sample points across a city's bbox in RD coordinates.
 * Approximates RD using the city's center as anchor — accurate to ~1 km
 * which is sufficient for spatial intersection with bestemmingsplan polygons.
 */
function buildSamplePoints(
  bbox: [number, number, number, number],
  center: [number, number],
  anchorRdX: number,
  anchorRdY: number,
  spacingMeters = 500
): { rd: [number, number]; latlon: [number, number] }[] {
  const [lonMin, latMin, lonMax, latMax] = bbox;
  const [centerLon, centerLat] = center;
  const [rdMinX, rdMinY] = wgs84ToRdApprox(lonMin, latMin, centerLon, centerLat, anchorRdX, anchorRdY);
  const [rdMaxX, rdMaxY] = wgs84ToRdApprox(lonMax, latMax, centerLon, centerLat, anchorRdX, anchorRdY);

  const points: { rd: [number, number]; latlon: [number, number] }[] = [];
  for (let x = Math.round(rdMinX / spacingMeters) * spacingMeters; x <= rdMaxX; x += spacingMeters) {
    for (let y = Math.round(rdMinY / spacingMeters) * spacingMeters; y <= rdMaxY; y += spacingMeters) {
      points.push({
        rd: [x, y],
        latlon: rdToWgs84(x, y, centerLon, centerLat, anchorRdX, anchorRdY),
      });
    }
  }
  // Cap at 25 points per call — DSO is rate-limited
  return points.slice(0, 25);
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
      `${GEOM_BASE}/geometrieen/${encodeURIComponent(geometrieId)}?crs=${encodeURIComponent(
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      )}`,
      { headers: { "X-Api-Key": DSO_API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const geom = data.geometrie || data;
    if (geom?.type && geom?.coordinates) return geom as GeoJSON.Geometry;
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("city") ?? "zwolle";
  const city = getCity(slug) ?? getCity("zwolle")!;

  if (!DSO_API_KEY) {
    return NextResponse.json(
      { type: "FeatureCollection", features: [] },
      { headers: { "Cache-Control": "public, max-age=3600" } }
    );
  }

  // RD anchor: empirically pre-computed for each city. For Zwolle:
  //   center (6.1, 52.51) ≈ RD (200500, 502500)
  // For others we derive from PROJ's center conversion (approx). As a fallback,
  // use a pure WGS84→RD approximation anchored at the city center with a
  // pre-known RD center for Zwolle, scaled by latitude.
  const RD_ANCHORS: Record<string, [number, number]> = {
    zwolle: [200500, 502500],
    helmond: [171500, 387500],
    apeldoorn: [194000, 469000],
  };
  const [anchorRdX, anchorRdY] = RD_ANCHORS[city.slug] ?? [
    155000 + (city.center[0] - 5.39) * 111320,
    463000 + (city.center[1] - 52.16) * 111320,
  ];

  const samplePoints = buildSamplePoints(city.bbox, city.center, anchorRdX, anchorRdY);

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

    for (let i = 0; i < samplePoints.length; i += 3) {
      const batch = samplePoints.slice(i, i + 3);
      await Promise.all(batch.map((p) => fetchPoint(p.rd)));
    }

    const features: GeoJSON.Feature[] = [];

    for (const [, { doc, rdPoint }] of planMap) {
      if (doc.imroDocumentMetadata?.isHistorisch) continue;

      let geometry: GeoJSON.Geometry | null = null;
      const geomIds = doc.geometrieIdentificaties || [];
      for (const gid of geomIds) {
        if (!gid.startsWith("NL.IMRO")) {
          geometry = await fetchGeometry(gid);
          if (geometry) break;
        }
      }

      if (!geometry) {
        const [lon, lat] = rdToWgs84(rdPoint[0], rdPoint[1], city.center[0], city.center[1], anchorRdX, anchorRdY);
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
