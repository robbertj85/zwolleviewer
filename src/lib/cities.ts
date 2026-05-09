/**
 * All 342 Dutch municipalities (alphabetical) for Basis Stadstwin.
 *
 * Each city declares the geographic + GIS metadata the data-source factory
 * needs to bbox-bind PDOK/CBS/RIVM/RCE/OSM/NDW queries to that city.
 *
 * `status: "live"` cities are clickable from the entrance grid and load a
 * full per-city map. `status: "coming-soon"` cities render a locked card.
 *
 * The bbox/center/cbsCode for the 342 entries comes from PDOK Kadaster
 * `bestuurlijkegebieden:Gemeentegebied` (see scripts/all-gemeenten.py).
 */

import { ALL_GEMEENTEN, type GemeenteSeed } from "./gemeenten";

export type CityStatus = "live" | "coming-soon";

export type Province =
  | "Drenthe"
  | "Flevoland"
  | "Friesland"
  | "Gelderland"
  | "Groningen"
  | "Limburg"
  | "Noord-Brabant"
  | "Noord-Holland"
  | "Overijssel"
  | "Utrecht"
  | "Zeeland"
  | "Zuid-Holland";

export interface CityConfig {
  slug: string;
  name: string;
  nameLong?: string;
  province: Province;
  cbsCode?: string;
  bbox: [number, number, number, number];
  bboxWFS: string;
  center: [number, number];
  initialZoom: number;
  overpassArea: string;
  pakketpuntenSlug?: string;
  municipalGIS?: {
    kind: "arcgis-rest" | "arcgis-hub";
    baseUrl: string;
  };
  status: CityStatus;
  /**
   * Depth of curation for live cities:
   * - `"full"` — has a dedicated `cities/<slug>.ts` module with municipal data
   *   and/or curated stubs (Zwolle/Helmond/Apeldoorn).
   * - `"national-only"` — relies entirely on national + provincial layers
   *   (no per-city module). Cards/nav show a "Nationaal" pill.
   * Undefined = treated as `"full"` for backward compatibility.
   */
  coverage?: CityCoverage;
  /**
   * ISO date (YYYY-MM-DD) the city was promoted from `national-only` → `full`
   * by the `/promote-city` skill. Drives the "✦ nieuw" decal on the landing
   * page; the decal auto-hides after 30 days. Cities that were full from
   * day one (Zwolle/Helmond/Apeldoorn) leave this undefined.
   */
  promotedAt?: string;
}

export type CityCoverage = "full" | "national-only";

function bboxWFSFromBBox(b: [number, number, number, number]): string {
  return `${b[1]},${b[0]},${b[3]},${b[2]},urn:ogc:def:crs:EPSG::4326`;
}

/**
 * Per-slug overrides for the live (pilot) cities — adds municipalGIS,
 * pakketpuntenSlug and a custom initialZoom on top of the auto-generated
 * gemeenten data.
 */
const LIVE_OVERRIDES: Record<
  string,
  Partial<CityConfig> & { status: "live" }
> = {
  zwolle: {
    status: "live",
    coverage: "full",
    initialZoom: 13,
    municipalGIS: {
      kind: "arcgis-rest" as const,
      baseUrl: "https://gisservices.zwolle.nl/ArcGIS/rest/services",
    },
  },
  helmond: {
    status: "live",
    coverage: "full",
    promotedAt: "2026-05-08",
    initialZoom: 13,
    municipalGIS: {
      kind: "arcgis-hub" as const,
      baseUrl: "https://data-helmond.opendata.arcgis.com",
    },
  },
  apeldoorn: {
    status: "live",
    coverage: "full",
    promotedAt: "2026-05-08",
    initialZoom: 12,
    municipalGIS: {
      kind: "arcgis-hub" as const,
      baseUrl: "https://staatvan-apeldoorn.opendata.arcgis.com",
    },
  },
  elburg: {
    status: "live",
    coverage: "national-only",
    promotedAt: "2026-05-08",
  },
  rotterdam: {
    status: "live",
    coverage: "full",
    promotedAt: "2026-05-08",
    initialZoom: 13,
    municipalGIS: {
      kind: "arcgis-rest" as const,
      baseUrl: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services",
    },
  },
  tilburg: {
    status: "live",
    coverage: "full",
    promotedAt: "2026-05-08",
    municipalGIS: {
      kind: "arcgis-rest" as const,
      baseUrl: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services",
    },
  },
  amsterdam: {
    status: "live",
    coverage: "full",
    promotedAt: "2026-05-08",
    initialZoom: 13,
    municipalGIS: {
      kind: "arcgis-rest" as const,
      baseUrl: "https://api.data.amsterdam.nl/v1/wfs",
    },
  },
  utrecht: {
    status: "live",
    coverage: "national-only",
  },
  lochem: {
    status: "live",
    coverage: "full",
    promotedAt: "2026-05-09",
    initialZoom: 12,
    municipalGIS: {
      kind: "arcgis-rest" as const,
      baseUrl: "https://services-eu1.arcgis.com/VV2g0JnRRF5xL5uh/arcgis/rest/services",
    },
  },
};

function bboxFromSeed(seed: GemeenteSeed): [number, number, number, number] {
  // Use the seed bbox unless it's degenerate (fall back to center ± padding)
  const [a, b, c, d] = seed.bbox;
  if (c - a > 0.005 && d - b > 0.005) return [a, b, c, d];
  const [lon, lat] = seed.center;
  return [lon - 0.06, lat - 0.04, lon + 0.06, lat + 0.04];
}

function makeCity(seed: GemeenteSeed): CityConfig {
  const bb = bboxFromSeed(seed);
  const base: CityConfig = {
    slug: seed.slug,
    name: seed.name,
    province: seed.province,
    cbsCode: seed.cbsCode,
    bbox: bb,
    bboxWFS: bboxWFSFromBBox(bb),
    center: seed.center,
    initialZoom: 12,
    // pakketpuntenviewer.nl uses our exact slug format; coverage is broad
    // across NL gemeenten. The fetch helper falls back to empty on 404, so
    // setting this for every city is safe.
    pakketpuntenSlug: seed.slug,
    overpassArea: seed.name,
    // Default: every gemeente is live with the national + provincial baseline.
    // LIVE_OVERRIDES upgrades a small set to `coverage: "full"` (per-city
    // module with municipal GIS layers).
    status: "live",
    coverage: "national-only",
  };
  const override = LIVE_OVERRIDES[seed.slug];
  if (override) return { ...base, ...override };
  return base;
}

export const ALL_CITIES: CityConfig[] = ALL_GEMEENTEN.map(makeCity);

export function getCity(slug: string): CityConfig | undefined {
  return ALL_CITIES.find((c) => c.slug === slug);
}

export function getLiveCities(): CityConfig[] {
  return ALL_CITIES.filter((c) => c.status === "live");
}

/** Hostnames the proxy route is allowed to fetch from, derived from city configs. */
export function getAllowedHosts(): string[] {
  const base = [
    "data.ndw.nu",
    "opendata.ndw.nu",
    "geodata.nationaalgeoregister.nl",
    "service.pdok.nl",
    "api.pdok.nl",
    "services.arcgis.com",
    "services1.arcgis.com",
    "services2.arcgis.com",
    "services4.arcgis.com",
    "services8.arcgis.com",
    "services9.arcgis.com",
    "services-eu1.arcgis.com",
    "verkeerslichtenviewer.nl",
    "services.geodataoverijssel.nl",
    "geoportaal.gelderland.nl",
    "atlas.brabant.nl",
    "geoportaal.brabant.nl",
    "data.rivm.nl",
    "data.geo.cultureelerfgoed.nl",
    "overpass-api.de",
    "opendata.cbs.nl",
    "pakketpuntenviewer.nl",
    "data.rotterdam.nl",
    "gis.provincie-utrecht.nl",
  ];
  const cityHosts = ALL_CITIES.flatMap((c) => {
    const hosts: string[] = [];
    if (c.municipalGIS?.baseUrl) {
      try {
        hosts.push(new URL(c.municipalGIS.baseUrl).hostname);
      } catch {}
    }
    return hosts;
  });
  return Array.from(new Set([...base, ...cityHosts]));
}
