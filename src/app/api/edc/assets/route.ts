import { NextRequest, NextResponse } from "next/server";
import { edcAssets } from "@/lib/edc-client";

export async function GET(request: NextRequest) {
  try {
    const offset = Number(request.nextUrl.searchParams.get("offset") ?? 0);
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 200);
    const assets = await edcAssets.list(offset, limit);
    return NextResponse.json(assets);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to list assets";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await edcAssets.create(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create asset";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
