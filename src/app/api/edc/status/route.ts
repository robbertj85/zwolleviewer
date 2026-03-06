import { NextResponse } from "next/server";
import {
  edcHealthCheck,
  edcAssets,
  edcAgreements,
  edcNegotiations,
  edcTransfers,
} from "@/lib/edc-client";

export async function GET() {
  const healthy = await edcHealthCheck();

  if (!healthy) {
    return NextResponse.json({
      connected: false,
      assets: 0,
      agreements: 0,
      negotiations: 0,
      transfers: 0,
    });
  }

  try {
    const [assets, agreements, negotiations, transfers] = await Promise.all([
      edcAssets.list(0, 1).then((a) => (Array.isArray(a) ? a : [])),
      edcAgreements.list(0, 1).then((a) => (Array.isArray(a) ? a : [])),
      edcNegotiations.list(0, 1).then((n) => (Array.isArray(n) ? n : [])),
      edcTransfers.list(0, 1).then((t) => (Array.isArray(t) ? t : [])),
    ]);

    // EDC query endpoints don't return total count directly;
    // do a larger fetch to count published assets
    const allAssets = await edcAssets.list(0, 500).then((a) => (Array.isArray(a) ? a : []));
    const allAgreements = await edcAgreements.list(0, 500).then((a) => (Array.isArray(a) ? a : []));
    const allNegotiations = await edcNegotiations.list(0, 500).then((n) => (Array.isArray(n) ? n : []));
    const allTransfers = await edcTransfers.list(0, 500).then((t) => (Array.isArray(t) ? t : []));

    return NextResponse.json({
      connected: true,
      assets: allAssets.length,
      agreements: allAgreements.length,
      negotiations: allNegotiations.length,
      transfers: allTransfers.length,
    });
  } catch {
    return NextResponse.json({
      connected: true,
      assets: 0,
      agreements: 0,
      negotiations: 0,
      transfers: 0,
    });
  }
}
