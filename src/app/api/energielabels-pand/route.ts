import { NextRequest, NextResponse } from "next/server";

// Pand-level energy labels for 3D building coloring.
//
// The municipal energy label service is keyed by verblijfsobject, while the
// PDOK 3D tiles are keyed by BAG pand. This route joins the two via the
// municipal BAG verblijfsobject layer (which carries the pand reference) and
// aggregates labels per pand: the most frequent label wins, ties go to the
// worst label (apartments share one building shell).
//
// Sources are per-municipality; currently only Zwolle exposes both layers.

interface CitySources {
  labels: { url: string; idField: string; labelField: string };
  vbo: { url: string; idField: string; pandField: string };
}

const SOURCES: Record<string, CitySources> = {
  zwolle: {
    labels: {
      url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Energielabels/FeatureServer/0/query",
      idField: "IDENTIFICATIE",
      labelField: "ENERGIELABEL",
    },
    vbo: {
      url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/BAG/FeatureServer/3/query",
      idField: "IDENTIFICATIE",
      pandField: "PAND",
    },
  },
};

const LABEL_ORDER = ["A+++++", "A++++", "A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"];

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: Record<string, string> }>();
const inflight = new Map<string, Promise<Record<string, string>>>();

/** Page through an ArcGIS query endpoint, returning the requested fields. */
async function fetchAllFeatures(
  url: string,
  outFields: string[]
): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = [];
  let offset = 0;
  for (let page = 0; page < 100; page++) {
    const params = new URLSearchParams({
      where: "1=1",
      outFields: outFields.join(","),
      returnGeometry: "false",
      resultOffset: String(offset),
      f: "json",
    });
    const res = await fetch(`${url}?${params}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`ArcGIS query failed: ${res.status}`);
    const data = (await res.json()) as {
      features?: { attributes: Record<string, unknown> }[];
      exceededTransferLimit?: boolean;
      error?: { message?: string };
    };
    if (data.error) throw new Error(`ArcGIS error: ${data.error.message}`);
    const features = data.features ?? [];
    for (const f of features) rows.push(f.attributes);
    if (!data.exceededTransferLimit || features.length === 0) break;
    offset += features.length;
  }
  return rows;
}

async function buildPandLabels(city: string): Promise<Record<string, string>> {
  const sources = SOURCES[city];
  const [labelRows, vboRows] = await Promise.all([
    fetchAllFeatures(sources.labels.url, [sources.labels.idField, sources.labels.labelField]),
    fetchAllFeatures(sources.vbo.url, [sources.vbo.idField, sources.vbo.pandField]),
  ]);

  const vboToPand = new Map<string, string>();
  for (const row of vboRows) {
    const vbo = row[sources.vbo.idField];
    const pand = row[sources.vbo.pandField];
    if (typeof vbo === "string" && typeof pand === "string" && pand) {
      vboToPand.set(vbo, pand);
    }
  }

  // pand -> label -> count
  const tallies = new Map<string, Map<string, number>>();
  for (const row of labelRows) {
    const vbo = row[sources.labels.idField];
    const label = row[sources.labels.labelField];
    if (typeof vbo !== "string" || typeof label !== "string" || !label) continue;
    const pand = vboToPand.get(vbo);
    if (!pand) continue;
    let tally = tallies.get(pand);
    if (!tally) {
      tally = new Map();
      tallies.set(pand, tally);
    }
    tally.set(label, (tally.get(label) ?? 0) + 1);
  }

  const result: Record<string, string> = {};
  for (const [pand, tally] of tallies) {
    let best: string | null = null;
    let bestCount = -1;
    for (const [label, count] of tally) {
      const wins =
        count > bestCount ||
        (count === bestCount &&
          best !== null &&
          LABEL_ORDER.indexOf(label) > LABEL_ORDER.indexOf(best));
      if (wins) {
        best = label;
        bestCount = count;
      }
    }
    if (best) result[pand] = best;
  }
  return result;
}

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city") ?? "";
  if (!SOURCES[city]) {
    return NextResponse.json(
      { error: `Geen energielabel-bron geconfigureerd voor '${city}'` },
      { status: 404 }
    );
  }

  const cached = cache.get(city);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(
      { pandLabels: cached.data },
      { headers: { "Cache-Control": "public, max-age=3600" } }
    );
  }

  let promise = inflight.get(city);
  if (!promise) {
    promise = buildPandLabels(city).finally(() => inflight.delete(city));
    inflight.set(city, promise);
  }
  try {
    const data = await promise;
    cache.set(city, { at: Date.now(), data });
    return NextResponse.json(
      { pandLabels: data },
      { headers: { "Cache-Control": "public, max-age=3600" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Onbekende fout" },
      { status: 502 }
    );
  }
}
