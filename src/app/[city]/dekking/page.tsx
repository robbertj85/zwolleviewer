import { notFound } from "next/navigation";
import {
  getLayerAvailabilityNote,
  getAllAvailabilityNotes,
} from "@/lib/layer-availability-notes";
import { getCity, ALL_CITIES } from "@/lib/cities";
import {
  buildDataSources,
  getBaselineCatalog,
  IMAGE_CATEGORIES,
  CATEGORIES,
  type ImageCategory,
  type LayerCategory,
} from "@/lib/data-sources";
import type { Metadata } from "next";
import DekkingClient from "./dekking-client";

export function generateStaticParams() {
  return ALL_CITIES.filter((c) => c.status === "live").map((c) => ({ city: c.slug }));
}

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  return {
    title: `Dekking — ${city?.name ?? "?"} — Basis Stadstwin`,
  };
}

/**
 * Optional curated additions to each ImageCategory beyond what's auto-discovered
 * via the LayerCategory→ImageCategory identity map. Most layers fall under
 * their declared `LayerCategory` automatically (same key as ImageCategory for
 * the 10 data-bearing categories), so this only seeds extra cross-category
 * appearances (e.g. `ndw-laadpunten-ocpi` shows up under both
 * `mobiliteitsdiensten` (its primary category) and `energie` (charging =
 * energy infrastructure too).
 */
const CATEGORY_LAYER_MAP: Record<ImageCategory, string[]> = {
  "bestuurlijke-grenzen": [],
  omgevingsfactoren: [],
  "gezondheid-norm": [],
  "groen-ecologie": [],
  "sociaal-economisch": [],
  veiligheid: ["bodem-verontreinigingen"],
  mobiliteitsdiensten: [],
  "verkeer-logistiek": [],
  energie: ["ndw-laadpunten-ocpi"],
  "gebouwen-infra": [],
  "bodem-ondergrond": [],
  pdx: [],
  databronnen: [],
};

/**
 * Build per-category rows where each row contains one entry per layer
 * known to ANY live city (the "baseline aggregate") — even if the active
 * city doesn't have it. Status per layer:
 *   - "live"    → active city has this layer
 *   - "missing" → active city doesn't have it; another city does. Waar bekend
 *                 komt er een toelichting bij uit `layer-availability-notes`
 *                 (waarom niet, en wat je in plaats daarvan kunt gebruiken).
 */
export interface DekkingLayerRow {
  id: string;
  name: string;
  description: string;
  source: string;
  category: string;
  categoryLabel: string;
  status: "live" | "missing";
  liveInCities: string[];
  /** Waarom deze laag hier ontbreekt, incl. alternatief. Alleen bij "missing". */
  note?: string;
}

export interface DekkingCategoryRow {
  cat: ImageCategory;
  label: string;
  description: string;
  layers: DekkingLayerRow[];
  liveCount: number;
  missingCount: number;
}

export default async function DekkingPage({ params }: PageProps) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  if (city.status === "coming-soon") notFound();

  const sources = buildDataSources(city);
  const layerIdsInCity = new Set(sources.map((s) => s.id));

  const baseline = getBaselineCatalog();

  // After the LayerCategory unification, ImageCategory's first 10 keys are
  // identical to LayerCategory, so the auto-discovery becomes an identity
  // match on `cat`. The two informational rows (pdx, databronnen) have no
  // matching layers and stay empty.
  const rows: DekkingCategoryRow[] = (
    Object.keys(IMAGE_CATEGORIES) as ImageCategory[]
  ).map((cat) => {
    const meta = IMAGE_CATEGORIES[cat];
    const seedIds = new Set(CATEGORY_LAYER_MAP[cat]);
    // Identity self-discovery: every catalog layer with category `cat` rolls
    // into this Dekking row. Skips `pdx` / `databronnen` which aren't
    // LayerCategory values.
    if (cat !== "pdx" && cat !== "databronnen") {
      for (const [, entry] of baseline) {
        if (entry.category === cat) seedIds.add(entry.id);
      }
    }

    const layerRows: DekkingLayerRow[] = [];
    for (const id of seedIds) {
      const entry = baseline.get(id);
      if (!entry) continue; // Catalog has no metadata for this id (typo / removed)
      const status: DekkingLayerRow["status"] = layerIdsInCity.has(id)
        ? "live"
        : "missing";
      layerRows.push({
        id: entry.id,
        name: entry.name,
        description: entry.description,
        source: entry.source,
        category: entry.category,
        categoryLabel:
          CATEGORIES[entry.category as LayerCategory]?.label ?? entry.category,
        status,
        liveInCities: entry.liveInCities,
        note:
          status === "missing"
            ? getLayerAvailabilityNote(city.slug, city.province, id)?.reden
            : undefined,
      });
    }
    layerRows.sort((a, b) => {
      // Live first, then stub, then missing
      const order: Record<DekkingLayerRow["status"], number> = {
        live: 0,
        missing: 1,
      };
      const d = order[a.status] - order[b.status];
      if (d !== 0) return d;
      return a.name.localeCompare(b.name, "nl");
    });

    return {
      cat,
      label: meta.label,
      description: meta.description,
      layers: layerRows,
      liveCount: layerRows.filter((l) => l.status === "live").length,
      missingCount: layerRows.filter((l) => l.status === "missing").length,
    };
  });

  const totalLive = sources.length;
  const totalBaseline = baseline.size;

  // Bekende hiaten die géén catalogus-laag zijn: datasets die nergens bestaan,
  // dus ook niet in de baseline zitten. Zonder dit blok zouden ze samen met de
  // stubs verdwijnen — terwijl juist die reden nuttig is.
  const knownGaps = getAllAvailabilityNotes(city.slug, city.province).filter(
    (g) => !baseline.has(g.id)
  );

  return (
    <DekkingClient
      cityName={city.name}
      citySlug={city.slug}
      cityProvince={city.province}
      totalLive={totalLive}
      knownGaps={knownGaps}
      totalBaseline={totalBaseline}
      rows={rows}
    />
  );
}
