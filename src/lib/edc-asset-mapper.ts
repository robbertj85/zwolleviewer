/**
 * Pure functions mapping LayerMetadata → EDC Management API payloads.
 */

import type { LayerMetadata, LayerCategory } from "./data-sources";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const EDC_CONTEXT = { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" } as const;
const OPEN_POLICY_ID = "open-data-policy";
const CONTRACT_DEF_PREFIX = "cd-zwolle-";

// ── Category → DCAT theme mapping ────────────────────────────────────

const CATEGORY_THEME: Record<LayerCategory, string> = {
  verkeer: "TRAN",
  gebouwen: "GOVE",
  "openbare-ruimte": "ENVI",
  grenzen: "REGI",
  milieu: "ENVI",
  voorzieningen: "EDUC",
  sociaal: "SOCI",
  wonen: "GOVE",
  gezondheid: "HEAL",
};

// ── Asset creation ───────────────────────────────────────────────────

export function layerToEdcAsset(layer: LayerMetadata) {
  return {
    "@context": EDC_CONTEXT,
    "@id": `zwolle-${layer.id}`,
    properties: {
      name: layer.name,
      description: layer.description,
      contenttype: "application/geo+json",
      version: "1.0",
      "dcat:theme": CATEGORY_THEME[layer.category] ?? "GOVE",
      "zwolle:category": layer.category,
      "zwolle:source": layer.source,
      "zwolle:icon": layer.icon,
    },
    dataAddress: {
      "@type": "DataAddress",
      type: "HttpData",
      baseUrl: `${APP_URL}/api/v1/layers/${layer.id}`,
      proxyPath: "true",
      proxyQueryParams: "true",
    },
  };
}

// ── Open data policy ─────────────────────────────────────────────────

export function createOpenDataPolicy() {
  return {
    "@context": EDC_CONTEXT,
    "@id": OPEN_POLICY_ID,
    policy: {
      "@context": "http://www.w3.org/ns/odrl.jsonld",
      "@type": "Set",
      permission: [
        {
          action: "use",
          constraint: [],
        },
      ],
    },
  };
}

// ── Contract definition ──────────────────────────────────────────────

export function layerToEdcContractDef(layer: LayerMetadata) {
  const assetId = `zwolle-${layer.id}`;
  return {
    "@context": EDC_CONTEXT,
    "@id": `${CONTRACT_DEF_PREFIX}${layer.id}`,
    accessPolicyId: OPEN_POLICY_ID,
    contractPolicyId: OPEN_POLICY_ID,
    assetsSelector: {
      "@type": "CriterionDto",
      operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
      operator: "=",
      operandRight: assetId,
    },
  };
}

// ── Batch helpers ────────────────────────────────────────────────────

export function layersToEdcAssets(layers: LayerMetadata[]) {
  return layers.map(layerToEdcAsset);
}

export function layersToEdcContractDefs(layers: LayerMetadata[]) {
  return layers.map(layerToEdcContractDef);
}
