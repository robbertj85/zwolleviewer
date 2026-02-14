import { NextRequest, NextResponse } from "next/server";

const TILE_BASE = "https://maps.ndw.nu/api/v1/wkdSpeedLimits/latest/mbtiles/segments/tiles";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  // Expect path like ["14", "8466", "5372.pbf"]
  if (path.length !== 3) {
    return NextResponse.json({ error: "Expected {z}/{x}/{y}.pbf" }, { status: 400 });
  }

  const url = `${TILE_BASE}/${path.join("/")}`;

  try {
    const res = await fetch(url, {
      headers: {
        Origin: "https://wegkenmerken.ndw.nu",
        Referer: "https://wegkenmerken.ndw.nu/",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const data = await res.arrayBuffer();
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/x-protobuf",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
