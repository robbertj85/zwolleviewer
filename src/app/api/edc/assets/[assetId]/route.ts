import { NextRequest, NextResponse } from "next/server";
import { edcAssets } from "@/lib/edc-client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;
    const asset = await edcAssets.get(assetId);
    return NextResponse.json(asset);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to get asset";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const { assetId } = await params;
    await edcAssets.delete(assetId);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete asset";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
