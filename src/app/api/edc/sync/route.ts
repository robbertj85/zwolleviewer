import { NextResponse } from "next/server";
import { LAYER_METADATA } from "@/lib/data-sources";
import { edcAssets, edcPolicies, edcContractDefs } from "@/lib/edc-client";
import {
  layerToEdcAsset,
  layerToEdcContractDef,
  createOpenDataPolicy,
} from "@/lib/edc-asset-mapper";

export async function POST() {
  const results = {
    policy: { success: false, error: null as string | null },
    assets: { created: 0, skipped: 0, failed: 0, errors: [] as string[] },
    contractDefs: { created: 0, skipped: 0, failed: 0, errors: [] as string[] },
  };

  // 1. Create open data policy (ignore if already exists)
  try {
    await edcPolicies.create(createOpenDataPolicy());
    results.policy.success = true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("409") || msg.includes("already exists") || msg.includes("duplicate")) {
      results.policy.success = true; // already exists
    } else {
      results.policy.error = msg;
    }
  }

  // 2. Register each layer as an asset + contract definition
  for (const layer of LAYER_METADATA) {
    // Asset
    try {
      await edcAssets.create(layerToEdcAsset(layer));
      results.assets.created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("409") || msg.includes("already exists") || msg.includes("duplicate")) {
        results.assets.skipped++;
      } else {
        results.assets.failed++;
        results.assets.errors.push(`${layer.id}: ${msg}`);
      }
    }

    // Contract definition
    try {
      await edcContractDefs.create(layerToEdcContractDef(layer));
      results.contractDefs.created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("409") || msg.includes("already exists") || msg.includes("duplicate")) {
        results.contractDefs.skipped++;
      } else {
        results.contractDefs.failed++;
        results.contractDefs.errors.push(`${layer.id}: ${msg}`);
      }
    }
  }

  const total = LAYER_METADATA.length;
  return NextResponse.json({
    total,
    ...results,
  });
}
