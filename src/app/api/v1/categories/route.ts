import { NextRequest, NextResponse } from "next/server";
import {
  CATEGORIES,
  buildDataSourcesForSlug,
  type LayerCategory,
} from "@/lib/data-sources";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("city");
  const layers = buildDataSourcesForSlug(slug);
  const categories = (
    Object.entries(CATEGORIES) as [LayerCategory, { label: string; icon: string }][]
  ).map(([id, { label, icon }]) => ({
    id,
    label,
    icon,
    layerCount: layers.filter((l) => l.category === id).length,
  }));

  return NextResponse.json({ count: categories.length, categories });
}
