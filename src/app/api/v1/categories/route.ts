import { NextResponse } from "next/server";
import { CATEGORIES, LAYER_METADATA, type LayerCategory } from "@/lib/data-sources";

export async function GET() {
  const categories = (Object.entries(CATEGORIES) as [LayerCategory, { label: string; icon: string }][]).map(
    ([id, { label, icon }]) => ({
      id,
      label,
      icon,
      layerCount: LAYER_METADATA.filter((l) => l.category === id).length,
    })
  );

  return NextResponse.json({ count: categories.length, categories });
}
