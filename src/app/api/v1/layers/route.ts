import { NextRequest, NextResponse } from "next/server";
import {
  CATEGORIES,
  getLayerMetadata,
  type LayerCategory,
} from "@/lib/data-sources";
import { getCity } from "@/lib/cities";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("city") ?? "zwolle";
  const city = getCity(slug) ?? getCity("zwolle")!;
  const category = searchParams.get("category") as LayerCategory | null;
  const search = searchParams.get("search")?.toLowerCase();

  let layers = getLayerMetadata(city);

  if (category && category in CATEGORIES) {
    layers = layers.filter((l) => l.category === category);
  }

  if (search) {
    layers = layers.filter(
      (l) =>
        l.name.toLowerCase().includes(search) ||
        l.description.toLowerCase().includes(search) ||
        l.id.toLowerCase().includes(search)
    );
  }

  const result = layers.map((l) => ({
    ...l,
    categoryLabel: CATEGORIES[l.category].label,
    apiEndpoint: `/api/v1/layers/${l.id}?city=${city.slug}`,
    downloadUrl: `/api/v1/layers/${l.id}?city=${city.slug}&download=true`,
  }));

  return NextResponse.json({
    count: result.length,
    city: city.slug,
    layers: result,
  });
}
