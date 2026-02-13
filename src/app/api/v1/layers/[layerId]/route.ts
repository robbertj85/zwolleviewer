import { NextRequest, NextResponse } from "next/server";
import { DATA_SOURCES } from "@/lib/data-sources";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ layerId: string }> }
) {
  const { layerId } = await params;
  const source = DATA_SOURCES.find((s) => s.id === layerId);

  if (!source) {
    return NextResponse.json(
      { error: "Layer not found", layerId },
      { status: 404 }
    );
  }

  try {
    const data = await source.fetchData();
    const isDownload = request.nextUrl.searchParams.get("download") === "true";

    const headers: Record<string, string> = {
      "X-Layer-Id": source.id,
      "X-Layer-Name": source.name,
      "X-Layer-Category": source.category,
      "X-Layer-Source": source.source,
      "X-Feature-Count": String(data.features?.length ?? 0),
    };

    if (isDownload) {
      headers["Content-Disposition"] = `attachment; filename="${source.id}.geojson"`;
    }

    return NextResponse.json(data, { headers });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch layer data", layerId, details: message },
      { status: 502 }
    );
  }
}
