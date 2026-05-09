import { NextRequest, NextResponse } from "next/server";
import { getAllowedHosts } from "@/lib/cities";

const ALLOWED_HOSTS = getAllowedHosts();

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    const allowed = ALLOWED_HOSTS.some((h) => parsed.hostname.endsWith(h));
    if (!allowed) {
      return NextResponse.json(
        { error: "Host not allowed" },
        { status: 403 }
      );
    }

    const res = await fetch(url, {
      headers: { Accept: "application/json, application/geo+json, */*" },
      next: { revalidate: 300 },
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
