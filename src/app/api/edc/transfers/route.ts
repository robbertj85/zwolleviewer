import { NextRequest, NextResponse } from "next/server";
import { edcTransfers } from "@/lib/edc-client";

export async function GET(request: NextRequest) {
  try {
    const offset = Number(request.nextUrl.searchParams.get("offset") ?? 0);
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
    const transfers = await edcTransfers.list(offset, limit);
    return NextResponse.json(transfers);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to list transfers";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await edcTransfers.initiate(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to initiate transfer";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
