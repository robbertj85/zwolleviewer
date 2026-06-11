/**
 * Ingest the PDC (Product Data Catalog, https://pdx.dmi-ecosysteem.nl) into a
 * local snapshot and report how many products bind to each live municipality.
 *
 * Run: npx tsx scripts/fetch-pdc.ts        (or: npm run pdc:fetch)
 *      npx tsx scripts/fetch-pdc.ts zwolle  → also dump that city's breakdown
 *
 * Writes src/lib/data-sources/pdc-catalogue.json:
 *   { fetchedAt, totalCount, filters, products[] }   (products incl. offers)
 *
 * Per-municipality binding is heuristic by necessity — PDC products carry no
 * geography (empty `locations`), so a product is tied to a city only by its
 * provider being "Gemeente <X>" or by naming the city in its text. See
 * src/lib/pdc.ts for the matcher.
 */

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  fetchAllPdcProducts,
  fetchPdcDetails,
  fetchPdcFilters,
  getPdcProductsForCity,
  type PdcProductDetail,
} from "../src/lib/pdc";
import { getLiveCities, getCity } from "../src/lib/cities";

const OUT_PATH = join(
  process.cwd(),
  "src/lib/data-sources/pdc-catalogue.json"
);

async function main() {
  const focusSlug = process.argv[2];

  console.log("Fetching PDC filters + catalogue …");
  const [filters, summaries] = await Promise.all([
    fetchPdcFilters(),
    fetchAllPdcProducts(),
  ]);
  console.log(
    `  ${summaries.length} products, ` +
      `${filters.activeDataProviders.length} active providers, ` +
      `${filters.themes.length} themes`
  );

  console.log("Fetching per-product details (offers, license) …");
  const details = await fetchPdcDetails(summaries.map((p) => p.id));
  const ok = details.filter((d): d is PdcProductDetail => d != null);
  console.log(`  ${ok.length}/${summaries.length} details fetched`);

  // Snapshot uses the full details (they superset the summaries + offers).
  const snapshot = {
    fetchedAt: new Date().toISOString(),
    source: "https://pdx.dmi-ecosysteem.nl/api",
    totalCount: summaries.length,
    filters,
    products: ok,
  };
  await writeFile(OUT_PATH, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`Wrote ${OUT_PATH}`);

  // Per-municipality binding report over the live cities.
  console.log("\nPer-municipality binding (municipal / mentions):");
  const rows = getLiveCities()
    .map((city) => {
      const b = getPdcProductsForCity(ok, city);
      return { city, m: b.municipal.length, x: b.mentions.length };
    })
    .filter((r) => r.m + r.x > 0)
    .sort((a, b) => b.m + b.x - (a.m + a.x));

  for (const r of rows) {
    console.log(
      `  ${r.city.name.padEnd(24)} municipal=${r.m}  mentions=${r.x}`
    );
  }
  console.log(
    `\n  ${rows.length} of ${getLiveCities().length} live cities have city-specific products; ` +
      `the rest of the ${ok.length} products are nationally applicable.`
  );

  if (focusSlug) {
    const city = getCity(focusSlug);
    if (!city) {
      console.log(`\nUnknown city slug "${focusSlug}".`);
      return;
    }
    const b = getPdcProductsForCity(ok, city);
    console.log(`\n── ${city.name} ──────────────────────────────`);
    console.log(
      `municipal=${b.municipal.length}  mentions=${b.mentions.length}  national=${b.national.length}`
    );
    for (const p of [...b.municipal, ...b.mentions]) {
      const offer = p.catalogueOffers?.[0];
      console.log(
        `  • ${p.name}  [${p.dataProvider.name}]` +
          (offer ? `\n      ↳ ${offer.marketplace.name}: ${offer.url}` : "")
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
