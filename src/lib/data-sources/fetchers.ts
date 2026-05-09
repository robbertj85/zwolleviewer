import type { CityConfig } from "../cities";

/**
 * City-aware fetch helpers. Every helper takes either a `CityConfig` or
 * the bbox/area-name fields it needs, and returns a GeoJSON
 * FeatureCollection bounded to that city's footprint.
 */

export async function fetchGeoJSON(
  url: string
): Promise<GeoJSON.FeatureCollection> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fout bij laden: ${res.status}`);
  const data = await res.json();
  if (data.type === "FeatureCollection") return data;
  if (data.features) return data as GeoJSON.FeatureCollection;
  return { type: "FeatureCollection", features: [] };
}

/**
 * ArcGIS REST FeatureServer/MapServer query — pulls layer data from any
 * municipal or provincial ArcGIS instance.
 */
export async function fetchArcGISQuery(
  baseUrl: string,
  service: string,
  layerId: number,
  serverType: "FeatureServer" | "MapServer" = "FeatureServer",
  maxFeatures = 2000,
  full = false
): Promise<GeoJSON.FeatureCollection> {
  const count = full ? 50000 : maxFeatures;
  const url = `${baseUrl}/${service}/${serverType}/${layerId}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultRecordCount=${count}`;
  return fetchGeoJSON(url);
}

/** OGC WFS 2.0 with bbox filter */
export async function fetchPDOKWFS(
  typeName: string,
  serviceUrl: string,
  bboxWFS: string,
  maxFeatures = 1000,
  full = false
): Promise<GeoJSON.FeatureCollection> {
  if (!full) {
    const url = `${serviceUrl}?service=WFS&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=json&count=${maxFeatures}&srsName=EPSG:4326&bbox=${bboxWFS}`;
    return fetchGeoJSON(url);
  }
  // PDOK WFS silently caps at ~995-1000 features per request regardless of
  // `count=`. Paginate via WFS 2.0 `startIndex` until an empty page comes
  // back (using `length < pageSize` would break too early, since PDOK can
  // return 995 on a full page).
  const pageSize = 1000;
  const maxPages = 100;
  const all: GeoJSON.Feature[] = [];
  for (let page = 0; page < maxPages; page++) {
    const url = `${serviceUrl}?service=WFS&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=json&count=${pageSize}&startIndex=${page * pageSize}&srsName=EPSG:4326&bbox=${bboxWFS}`;
    const fc = await fetchGeoJSON(url);
    if (fc.features.length === 0) break;
    all.push(...fc.features);
  }
  return { type: "FeatureCollection", features: all };
}

/** OGC API Features with bbox filter — paginated via the response's `links.next` cursor. */
export async function fetchPDOKOGCAPI(
  baseUrl: string,
  collection: string,
  bbox: string,
  limit = 1000,
  full = false
): Promise<GeoJSON.FeatureCollection> {
  const pageSize = Math.min(full ? 1000 : limit, 1000);
  let url: string | null = `${baseUrl}/collections/${collection}/items?limit=${pageSize}&bbox=${bbox}&f=json`;
  const features: GeoJSON.Feature[] = [];
  const maxPages = full ? 50 : 1;
  for (let page = 0; page < maxPages && url; page++) {
    const fc: GeoJSON.FeatureCollection & {
      links?: Array<{ rel?: string; href?: string }>;
    } = await fetchGeoJSON(url);
    features.push(...fc.features);
    if (!full) break;
    // PDOK OGC API uses cursor-based pagination — `offset=` is silently
    // ignored. Follow the `links.next.href` URL when present; absence of a
    // next link is the only reliable end-of-stream signal (the response
    // page can be < pageSize and still have a continuation).
    const next = fc.links?.find((l) => l.rel === "next")?.href;
    url = next ?? null;
  }
  return { type: "FeatureCollection", features };
}

/** Geoportaal Overijssel (B22_wegen, B23_waterwegen, B42_energie, etc.) */
export async function fetchOverijsselWFS(
  workspace: string,
  typeName: string,
  bboxWFS: string,
  maxFeatures = 1000,
  full = false
): Promise<GeoJSON.FeatureCollection> {
  const count = full ? 50000 : maxFeatures;
  const url = `https://services.geodataoverijssel.nl/geoserver/${workspace}/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=json&count=${count}&srsName=EPSG:4326&bbox=${bboxWFS}`;
  return fetchGeoJSON(url);
}

/** Geoportaal Gelderland REST */
export async function fetchGelderlandQuery(
  service: string,
  layerId: number,
  bbox: string,
  serverType: "FeatureServer" | "MapServer" = "MapServer",
  maxFeatures = 1000,
  full = false
): Promise<GeoJSON.FeatureCollection> {
  const count = full ? 50000 : maxFeatures;
  const url = `https://geoportaal.gelderland.nl/gisserver/rest/services/${service}/${serverType}/${layerId}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultRecordCount=${count}&geometry=${encodeURIComponent(
    bbox
  )}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects`;
  return fetchGeoJSON(url);
}

/** OSM Overpass query (bbox + admin area) */
export async function fetchOverpassGeoJSON(
  query: string
): Promise<GeoJSON.FeatureCollection> {
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  if (!res.ok) throw new Error(`Overpass fout: ${res.status}`);
  const data = await res.json();
  const features: GeoJSON.Feature[] = [];
  for (const el of data.elements || []) {
    if (el.type === "node" && el.lat && el.lon) {
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [el.lon, el.lat] },
        properties: el.tags || {},
      });
    }
  }
  return { type: "FeatureCollection", features };
}

/** Build an Overpass query for nodes in a named admin-level-8 area. */
export function overpassNodesInArea(
  city: CityConfig,
  selector: string
): string {
  return `[out:json][timeout:25];area["name"="${city.overpassArea}"]["admin_level"="8"]->.searchArea;node${selector}(area.searchArea);out body;`;
}

const CBS_SENTINELS = new Set([-99995, -99997, -99998, -99999]);

export function cleanCBSProperties(
  fc: GeoJSON.FeatureCollection
): GeoJSON.FeatureCollection {
  return {
    ...fc,
    features: fc.features.map((f) => ({
      ...f,
      properties: Object.fromEntries(
        Object.entries(f.properties || {}).map(([k, v]) => [
          k,
          typeof v === "number" && CBS_SENTINELS.has(v) ? null : v,
        ])
      ),
    })),
  };
}

/** CBS Wijken & Buurten — filtered by gemeentecode. */
export async function fetchCBSBuurten(
  city: CityConfig,
  full = false
): Promise<GeoJSON.FeatureCollection> {
  const code = city.cbsCode;
  const cql = code ? `&CQL_FILTER=gemeentecode='${code}'` : "";
  const count = full ? 5000 : 200;
  // bbox keeps us safe even when CQL is unsupported
  const url = `https://service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0?service=WFS&version=2.0.0&request=GetFeature&typeName=wijkenbuurten:buurten&outputFormat=json&count=${count}&srsName=EPSG:4326&bbox=${city.bboxWFS}${cql}`;
  const data = await fetchGeoJSON(url);
  return cleanCBSProperties(data);
}

export async function fetchCBSWijken(
  city: CityConfig,
  full = false
): Promise<GeoJSON.FeatureCollection> {
  const code = city.cbsCode;
  const cql = code ? `&CQL_FILTER=gemeentecode='${code}'` : "";
  const count = full ? 1000 : 100;
  const url = `https://service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0?service=WFS&version=2.0.0&request=GetFeature&typeName=wijkenbuurten:wijken&outputFormat=json&count=${count}&srsName=EPSG:4326&bbox=${city.bboxWFS}${cql}`;
  const data = await fetchGeoJSON(url);
  return cleanCBSProperties(data);
}

/**
 * Default release year used by `fetchCBSPC4`. PDOK ships PC4 datasets per
 * jaar; structurele velden (inwoners, woningvoorraad, stedelijkheid,
 * omgevingsadressendichtheid, afstanden tot voorzieningen) zijn in de
 * meest recente release direct beschikbaar.
 */
export const CBS_PC4_LATEST_YEAR = 2024;

/**
 * CBS-PC4 jaar voor inkomenslagen. Inkomensvelden lopen ~1,5 jaar achter
 * op de structurele data; in zowel 2023 als 2024 staan ze nog op de
 * sentinelwaarde -99995. 2022 is de laatste release met populated
 * `gemiddeldInkomenHuishouden`, `percentageLaagInkomenHuishouden`,
 * `percentageHoogInkomenHuishouden`.
 */
export const CBS_PC4_INCOME_YEAR = 2022;

/**
 * CBS-PC4 jaar voor WOZ-lagen. WOZ loopt iets minder achter dan inkomen:
 * 2023 heeft `gemiddeldeWozWaardeWoning` gevuld, 2024 nog niet.
 */
export const CBS_PC4_WOZ_YEAR = 2023;

/**
 * CBS Postcode 4 (PC4) statistics — bbox-filtered to the city's footprint.
 * Iedere PDOK-release levert ~150 numerieke properties per PC4-polygoon:
 * inkomen, WOZ, stedelijkheid, omgevingsadressendichtheid, woning­voorraad,
 * eenpersoonshuishoudens, leeftijdsverdeling, en afstanden tot
 * voorzieningen (treinstations, snelwegopritten, supermarkten, horeca).
 *
 * Default jaar: `CBS_PC4_LATEST_YEAR` (=2024). Voor inkomen- en WOZ-lagen
 * geef je `year = CBS_PC4_INCOME_YEAR` (=2022) door, omdat die velden in
 * 2024 nog niet gepubliceerd zijn (CBS sentinel -99995).
 *
 * Fields commonly used in the Stadstwin viewer:
 *   - postcode (string PC4)
 *   - aantalInwoners, aantalWoningen
 *   - gemiddeldInkomenHuishouden (× €1000) — 2022
 *   - percentageLaagInkomenHuishouden, percentageHoogInkomenHuishouden — 2022
 *   - gemiddeldeWozWaardeWoning (× €1000) — 2023 (en 2022)
 *   - stedelijkheid (1–5, ordinaal)
 *   - omgevingsadressendichtheid (adressen/km²)
 *   - aantalInwoners25Tot45Jaar (numerator for % 25–45 jaar)
 *   - aantalEenpersoonshuishoudens, aantalMeergezinsWoningen
 *   - aantalHuurwoningenInBezitWoningcorporaties
 *   - percentageHuurwoningen, percentageKoopwoningen
 *   - dichtstbijzijndeTreinstationAfstandInKm
 *   - dichtstbijzijndeOpritHoofdverkeerswegAfstandInKm
 *   - dichtstbijzijndeCafeAfstandInKm, dichtstbijzijndeRestaurantAfstandInKm
 *   - groteSupermarktAantalBinnen1Km
 */
export async function fetchCBSPC4(
  city: CityConfig,
  full = false,
  year: number = CBS_PC4_LATEST_YEAR
): Promise<GeoJSON.FeatureCollection> {
  // Reuse the shared WFS helper so PC4 thematic layers paginate when the
  // user clicks "Volledig laden" (large cities like Rotterdam, Amsterdam,
  // Utrecht have more PC4-vlakken intersecting the bbox than PDOK's silent
  // 1000-feature per-request cap; without pagination the WOZ/inkomen lagen
  // would be missing the bottom half of the city).
  const data = await fetchPDOKWFS(
    "postcode4:postcode4",
    `https://service.pdok.nl/cbs/postcode4/${year}/wfs/v1_0`,
    city.bboxWFS,
    full ? 2000 : 500,
    full
  );
  // Add a derived percentage of koopwoningen for layers that prefer a
  // single computed key over flipping between huur/koop columns.
  const enriched = withDerivedPC4Properties(data);
  return cleanCBSProperties(enriched);
}

/**
 * Add derived per-feature properties to a CBS PC4 collection that the raw
 * WFS response does not expose directly:
 *   - percentageInwoners25Tot45Jaar = aantalInwoners25Tot45Jaar / aantalInwoners × 100
 *   - percentageEenpersoonshuishoudens = aantalEenpersoons / aantalPartHuishoudens × 100
 *   - percentageMeergezinsWoningen = aantalMeergezinsWoningen / aantalWoningen × 100
 *   - percentageKoopwoningenDerived = (aantalWoningen − huurwoningen) / aantalWoningen × 100
 *     (kept alongside the upstream `percentageKoopwoningen` for layers that
 *     want to fall back on the corporation-bezit numerator only.)
 *   - dichtstbijzijndeHorecaAfstandInKm = min(cafe, restaurant)
 */
function withDerivedPC4Properties(
  fc: GeoJSON.FeatureCollection
): GeoJSON.FeatureCollection {
  const safePct = (num: unknown, den: unknown): number | null => {
    if (typeof num !== "number" || typeof den !== "number") return null;
    if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0) return null;
    return Math.round((num / den) * 1000) / 10; // one decimal
  };
  const safeMin = (a: unknown, b: unknown): number | null => {
    const aN = typeof a === "number" && Number.isFinite(a) ? a : null;
    const bN = typeof b === "number" && Number.isFinite(b) ? b : null;
    if (aN === null && bN === null) return null;
    if (aN === null) return bN;
    if (bN === null) return aN;
    return Math.min(aN, bN);
  };
  return {
    ...fc,
    features: fc.features.map((f) => {
      const p = (f.properties as Record<string, unknown>) || {};
      const aantalWoningen = p.aantalWoningen;
      const huur = p.aantalHuurwoningenInBezitWoningcorporaties;
      const koopFromCorporaties =
        typeof aantalWoningen === "number" && typeof huur === "number"
          ? safePct(aantalWoningen - huur, aantalWoningen)
          : null;
      return {
        ...f,
        properties: {
          ...p,
          percentageInwoners25Tot45Jaar: safePct(
            p.aantalInwoners25Tot45Jaar,
            p.aantalInwoners
          ),
          percentageEenpersoonshuishoudens: safePct(
            p.aantalEenpersoonshuishoudens,
            p.aantalPartHuishoudens
          ),
          percentageMeergezinsWoningen: safePct(
            p.aantalMeergezinsWoningen,
            p.aantalWoningen
          ),
          percentageKoopwoningenDerived: koopFromCorporaties,
          dichtstbijzijndeHorecaAfstandInKm: safeMin(
            p.dichtstbijzijndeCafeAfstandInKm,
            p.dichtstbijzijndeRestaurantAfstandInKm
          ),
        },
      };
    }),
  };
}

/**
 * Esri NL "Verkeersongevallen" FeatureServer — public mirror of the
 * Rijkswaterstaat BRON registratie van politie-geregistreerde ongevallen.
 * Updated jaarlijks (laatste augustus 2025, met 2024 erbij).
 *
 * `where` is an optional ArcGIS where-clause that lets us filter on JAAR_VKL
 * (jaar van ongeval), AP3_CODE ("Letsel" / "Dodelijk" / "Uitsluitend
 * materiele schade") or AOL_ID (aard van het ongeval).
 */
export async function fetchBronOngevallen(
  city: CityConfig,
  where = "1=1",
  full = false
): Promise<GeoJSON.FeatureCollection> {
  const [lonMin, latMin, lonMax, latMax] = city.bbox;
  const count = full ? 50000 : 2000;
  const params = new URLSearchParams({
    where,
    geometry: `${lonMin},${latMin},${lonMax},${latMax}`,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields:
      "JAAR_VKL,GME_NAAM,AP3_CODE,AOL_ID,MAXSNELHD,DAGTYPE,BEBKOM,WSE_ID,LGD_ID,WGD_CODE_1,ANTL_PTJ",
    outSR: "4326",
    f: "geojson",
    resultRecordCount: String(count),
  });
  const url = `https://services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Verkeersongevallen/FeatureServer/0/query?${params.toString()}`;
  return fetchGeoJSON(url);
}

const pakketpuntenCache = new Map<string, GeoJSON.FeatureCollection>();
export async function fetchPakketpunten(
  citySlug: string
): Promise<GeoJSON.FeatureCollection> {
  const cached = pakketpuntenCache.get(citySlug);
  if (cached) return cached;
  try {
    const res = await fetch(
      `https://pakketpuntenviewer.nl/data/${citySlug}.geojson`
    );
    if (!res.ok) {
      const empty: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [],
      };
      pakketpuntenCache.set(citySlug, empty);
      return empty;
    }
    const data: GeoJSON.FeatureCollection = await res.json();
    pakketpuntenCache.set(citySlug, data);
    return data;
  } catch {
    const empty: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    pakketpuntenCache.set(citySlug, empty);
    return empty;
  }
}

/** Empty FeatureCollection for stub layers. */
export async function fetchEmpty(): Promise<GeoJSON.FeatureCollection> {
  return { type: "FeatureCollection", features: [] };
}

/**
 * Telraam citizen-traffic counters — bbox-filtered active segments.
 *
 * Telraam exposes burger-getelde verkeerstellingen (auto, vracht, fiets,
 * voetganger) per straatsegment. De API verlangt een `X-Api-Key` header
 * (gratis na aanmelden op telraam.net). Als `process.env.TELRAAM_API_KEY`
 * niet gezet is loggen we een waarschuwing en retourneren we een lege
 * FeatureCollection — de laag verschijnt dan wel in de UI maar zonder data.
 *
 * Endpoint: GET https://telraam-api.net/v1/segments/active
 *   → returns ALL active NL segments; we filter client-side per city bbox.
 *
 * Properties per feature: `segment_id`, `last_data_package` (ISO),
 * `oidn_drager`, `geometry` (LineString WGS84). Counts per uur worden via
 * /reports/traffic_snapshot_live opgevraagd; voor de basis-laag tonen we
 * alleen de actieve sensors zelf.
 */
export async function fetchTelraamSegments(
  bbox: [number, number, number, number]
): Promise<GeoJSON.FeatureCollection> {
  const apiKey = process.env.TELRAAM_API_KEY;
  if (!apiKey) {
    console.warn(
      "[telraam] TELRAAM_API_KEY niet gezet — laag retourneert leeg. Vraag een sleutel aan via https://telraam.net en zet hem in .env.local."
    );
    return { type: "FeatureCollection", features: [] };
  }
  try {
    const res = await fetch("https://telraam-api.net/v1/segments/active", {
      headers: { "X-Api-Key": apiKey },
    });
    if (!res.ok) {
      console.warn(`[telraam] API-fout ${res.status} — leeg resultaat`);
      return { type: "FeatureCollection", features: [] };
    }
    const data = await res.json();
    const fc: GeoJSON.FeatureCollection =
      data?.features && Array.isArray(data.features)
        ? (data as GeoJSON.FeatureCollection)
        : { type: "FeatureCollection", features: [] };
    const [lonMin, latMin, lonMax, latMax] = bbox;
    return {
      type: "FeatureCollection",
      features: fc.features.filter((f) => {
        const g = f.geometry;
        if (!g) return false;
        // LineString segments — check if any vertex is in bbox
        if (g.type === "LineString") {
          return g.coordinates.some(
            ([lng, lat]) =>
              lng > lonMin && lng < lonMax && lat > latMin && lat < latMax
          );
        }
        if (g.type === "MultiLineString") {
          return g.coordinates.some((line) =>
            line.some(
              ([lng, lat]) =>
                lng > lonMin && lng < lonMax && lat > latMin && lat < latMax
            )
          );
        }
        if (g.type === "Point") {
          const [lng, lat] = g.coordinates;
          return lng > lonMin && lng < lonMax && lat > latMin && lat < latMax;
        }
        return false;
      }),
    };
  } catch (err) {
    console.warn("[telraam] fout bij ophalen segments/active:", err);
    return { type: "FeatureCollection", features: [] };
  }
}
