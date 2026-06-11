import { NextRequest, NextResponse } from "next/server";
import { getCity } from "@/lib/cities";
import {
  fetchAllPdcProducts,
  fetchPdcDetails,
  getPdcProductsForCity,
  type PdcProductSummary,
} from "@/lib/pdc";

/**
 * Live view of the DMI-Ecosysteem PDC (Product Data Catalog) API, bucketed by
 * relevance to one municipality.
 *
 *   GET /api/pdc?city=zwolle
 *
 * Returns the municipality's own products + products that name it (each
 * enriched with their marketplace offers), plus the national count. The DMI
 * API has no CORS, so this server route is what makes it reachable from the
 * browser.
 */

// Cache the full catalogue briefly — it's the same for every city.
let catalogueCache: { data: PdcProductSummary[]; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

async function getCatalogue(): Promise<PdcProductSummary[]> {
  if (catalogueCache && Date.now() - catalogueCache.ts < CACHE_TTL) {
    return catalogueCache.data;
  }
  const data = await fetchAllPdcProducts();
  catalogueCache = { data, ts: Date.now() };
  return data;
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("city") ?? "zwolle";
  const city = getCity(slug) ?? getCity("zwolle")!;

  try {
    const all = await getCatalogue();
    const { municipal, mentions, national } = getPdcProductsForCity(all, city);

    // Enrich only the small city-specific set with offer URLs (the national
    // set would be 300+ extra requests).
    const cityProducts = [...municipal, ...mentions];
    const details = await fetchPdcDetails(cityProducts.map((p) => p.id));
    const enriched = cityProducts.map((p, i) => ({
      id: p.id,
      name: p.name,
      provider: p.dataProvider.name,
      relevance: i < municipal.length ? "municipal" : "mentions",
      themes: p.themes,
      offers:
        details[i]?.catalogueOffers.map((o) => ({
          marketplace: o.marketplace.name,
          url: o.url,
          fileFormats: o.fileFormats,
        })) ?? [],
    }));

    return NextResponse.json(
      {
        source: "https://pdx.dmi-ecosysteem.nl/api",
        city: { slug: city.slug, name: city.name },
        counts: {
          total: all.length,
          municipal: municipal.length,
          mentions: mentions.length,
          national: national.length,
        },
        products: enriched,
      },
      { headers: { "Cache-Control": "public, s-maxage=300" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDC fetch error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
