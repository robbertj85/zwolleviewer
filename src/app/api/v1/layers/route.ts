import { NextRequest, NextResponse } from "next/server";
import { LAYER_METADATA, CATEGORIES, type LayerCategory } from "@/lib/data-sources";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") as LayerCategory | null;
  const search = searchParams.get("search")?.toLowerCase();

  let layers = LAYER_METADATA;

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
    apiEndpoint: `/api/v1/layers/${l.id}`,
    downloadUrl: `/api/v1/layers/${l.id}?download=true`,
  }));

  return NextResponse.json({
    count: result.length,
    layers: result,
  });
}
