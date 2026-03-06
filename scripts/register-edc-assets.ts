/**
 * Standalone script to register all Zwolle layers as EDC assets.
 * Run: npx tsx scripts/register-edc-assets.ts
 *
 * Requires EDC_MANAGEMENT_URL and EDC_API_AUTH_KEY env vars (or defaults).
 */

const EDC_URL = process.env.EDC_MANAGEMENT_URL ?? "http://localhost:8181/management";
const API_KEY = process.env.EDC_API_AUTH_KEY ?? "password";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const EDC_CONTEXT = { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" };
const OPEN_POLICY_ID = "open-data-policy";

async function edcPost(path: string, body: unknown) {
  const res = await fetch(`${EDC_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.text() };
}

async function main() {
  // Dynamically import the layer metadata
  const { LAYER_METADATA, CATEGORIES } = await import("../src/lib/data-sources");

  console.log(`\nRegistering ${LAYER_METADATA.length} layers to EDC at ${EDC_URL}`);
  console.log(`Categories: ${Object.keys(CATEGORIES).join(", ")}\n`);

  // 1. Create open data policy
  console.log("Creating open data policy...");
  const policyRes = await edcPost("/v2/policydefinitions", {
    "@context": EDC_CONTEXT,
    "@id": OPEN_POLICY_ID,
    policy: {
      "@context": "http://www.w3.org/ns/odrl.jsonld",
      "@type": "Set",
      permission: [{ action: "use", constraint: [] }],
    },
  });
  if (policyRes.status === 200 || policyRes.status === 201) {
    console.log("  Policy created");
  } else if (policyRes.status === 409) {
    console.log("  Policy already exists");
  } else {
    console.error(`  Failed: ${policyRes.status} ${policyRes.body}`);
  }

  // 2. Register assets + contract definitions
  let created = 0;
  let skipped = 0;
  let failed = 0;

  const CATEGORY_THEME: Record<string, string> = {
    verkeer: "TRAN",
    gebouwen: "GOVE",
    "openbare-ruimte": "ENVI",
    grenzen: "REGI",
    milieu: "ENVI",
    voorzieningen: "EDUC",
  };

  for (const layer of LAYER_METADATA) {
    const assetId = `zwolle-${layer.id}`;

    // Create asset (v2 API requires wrapping in "asset" key)
    const assetRes = await edcPost("/v2/assets", {
      "@context": EDC_CONTEXT,
      asset: {
        "@id": assetId,
        properties: {
          name: layer.name,
          description: layer.description,
          contenttype: "application/geo+json",
          version: "1.0",
          theme: CATEGORY_THEME[layer.category] ?? "GOVE",
          category: layer.category,
          source: layer.source,
          icon: layer.icon,
        },
      },
      dataAddress: {
        "@type": "DataAddress",
        type: "HttpData",
        baseUrl: `${APP_URL}/api/v1/layers/${layer.id}`,
        proxyPath: "true",
        proxyQueryParams: "true",
      },
    });

    if (assetRes.status === 200 || assetRes.status === 201) {
      // Create contract definition
      const cdRes = await edcPost("/v2/contractdefinitions", {
        "@context": EDC_CONTEXT,
        "@id": `cd-zwolle-${layer.id}`,
        accessPolicyId: OPEN_POLICY_ID,
        contractPolicyId: OPEN_POLICY_ID,
        assetsSelector: {
          "@type": "CriterionDto",
          operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
          operator: "=",
          operandRight: assetId,
        },
      });

      if (cdRes.status === 200 || cdRes.status === 201) {
        created++;
        process.stdout.write(".");
      } else {
        failed++;
        console.error(`\n  Contract def failed for ${layer.id}: ${cdRes.status}`);
      }
    } else if (assetRes.status === 409) {
      skipped++;
      process.stdout.write("s");
    } else {
      failed++;
      console.error(`\n  Asset failed for ${layer.id}: ${assetRes.status}`);
    }
  }

  console.log(`\n\nDone: ${created} created, ${skipped} skipped, ${failed} failed`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
