import { NextRequest, NextResponse } from "next/server";
import { edcCatalog } from "@/lib/edc-client";

export async function POST(request: NextRequest) {
  try {
    const { counterPartyAddress, counterPartyId } = await request.json();
    if (!counterPartyAddress) {
      return NextResponse.json(
        { error: "counterPartyAddress is required" },
        { status: 400 }
      );
    }
    const catalog = await edcCatalog.query(counterPartyAddress, counterPartyId);
    return NextResponse.json(catalog);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to query catalog";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
