import { NextRequest, NextResponse } from "next/server";
import { edcNegotiations } from "@/lib/edc-client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ negotiationId: string }> }
) {
  try {
    const { negotiationId } = await params;
    const negotiation = await edcNegotiations.get(negotiationId);
    return NextResponse.json(negotiation);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to get negotiation";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
