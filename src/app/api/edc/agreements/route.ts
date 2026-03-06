import { NextRequest, NextResponse } from "next/server";
import { edcAgreements } from "@/lib/edc-client";

export async function GET(request: NextRequest) {
  try {
    const offset = Number(request.nextUrl.searchParams.get("offset") ?? 0);
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
    const agreements = await edcAgreements.list(offset, limit);
    return NextResponse.json(agreements);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to list agreements";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
