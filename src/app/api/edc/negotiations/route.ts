import { NextRequest, NextResponse } from "next/server";
import { edcNegotiations } from "@/lib/edc-client";

export async function GET(request: NextRequest) {
  try {
    const offset = Number(request.nextUrl.searchParams.get("offset") ?? 0);
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
    const negotiations = await edcNegotiations.list(offset, limit);
    return NextResponse.json(negotiations);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to list negotiations";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await edcNegotiations.initiate(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to initiate negotiation";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
