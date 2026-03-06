/**
 * Server-side EDC Management API v2 client.
 * Wraps authentication, URL construction, and error handling.
 */

const EDC_MANAGEMENT_URL =
  process.env.EDC_MANAGEMENT_URL ?? "http://localhost:8181/management";
const EDC_API_KEY = process.env.EDC_API_AUTH_KEY ?? "password";

// ── helpers ──────────────────────────────────────────────────────────

async function edcFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${EDC_MANAGEMENT_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": EDC_API_KEY,
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`EDC ${init?.method ?? "GET"} ${path} → ${res.status}: ${body}`);
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
}

function post<T = unknown>(path: string, body: unknown) {
  return edcFetch<T>(path, { method: "POST", body: JSON.stringify(body) });
}

function del(path: string) {
  return edcFetch<void>(path, { method: "DELETE" });
}

// ── EDC request body builders ────────────────────────────────────────

function querySpec(
  offset = 0,
  limit = 50,
  filterExpression?: Array<{ operandLeft: string; operator: string; operandRight: unknown }>
) {
  return {
    "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
    "@type": "QuerySpec",
    offset,
    limit,
    ...(filterExpression ? { filterExpression } : {}),
  };
}

// ── Assets ───────────────────────────────────────────────────────────

export interface EdcAsset {
  "@id": string;
  "@type": string;
  properties: Record<string, unknown>;
  dataAddress: Record<string, unknown>;
}

export const edcAssets = {
  list: (offset = 0, limit = 200) =>
    post<EdcAsset[]>("/v2/assets/request", querySpec(offset, limit)),

  get: (id: string) => edcFetch<EdcAsset>(`/v2/assets/${encodeURIComponent(id)}`),

  create: (asset: Record<string, unknown>) =>
    post<EdcAsset>("/v2/assets", asset),

  delete: (id: string) => del(`/v2/assets/${encodeURIComponent(id)}`),
};

// ── Catalog ──────────────────────────────────────────────────────────

export interface CatalogDataset {
  "@id": string;
  "@type": string;
  [key: string]: unknown;
}

export interface CatalogResponse {
  "@type": string;
  "dcat:dataset": CatalogDataset | CatalogDataset[];
  [key: string]: unknown;
}

export const edcCatalog = {
  query: (counterPartyAddress: string, counterPartyId?: string) =>
    post<CatalogResponse>("/v2/catalog/request", {
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@type": "CatalogRequest",
      counterPartyAddress,
      ...(counterPartyId ? { counterPartyId } : {}),
      protocol: "dataspace-protocol-http",
      querySpec: { offset: 0, limit: 500 },
    }),
};

// ── Contract Negotiations ────────────────────────────────────────────

export interface EdcNegotiation {
  "@id": string;
  "@type": string;
  state: string;
  counterPartyAddress: string;
  contractAgreementId?: string;
  [key: string]: unknown;
}

export const edcNegotiations = {
  list: (offset = 0, limit = 50) =>
    post<EdcNegotiation[]>("/v2/contractnegotiations/request", querySpec(offset, limit)),

  get: (id: string) =>
    edcFetch<EdcNegotiation>(`/v2/contractnegotiations/${encodeURIComponent(id)}`),

  initiate: (body: {
    counterPartyAddress: string;
    counterPartyId?: string;
    protocol?: string;
    policy: Record<string, unknown>;
  }) =>
    post<{ "@id": string }>("/v2/contractnegotiations", {
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@type": "ContractRequest",
      counterPartyAddress: body.counterPartyAddress,
      ...(body.counterPartyId ? { counterPartyId: body.counterPartyId } : {}),
      protocol: body.protocol ?? "dataspace-protocol-http",
      policy: body.policy,
    }),
};

// ── Transfers ────────────────────────────────────────────────────────

export interface EdcTransfer {
  "@id": string;
  "@type": string;
  state: string;
  [key: string]: unknown;
}

export const edcTransfers = {
  list: (offset = 0, limit = 50) =>
    post<EdcTransfer[]>("/v2/transferprocesses/request", querySpec(offset, limit)),

  get: (id: string) =>
    edcFetch<EdcTransfer>(`/v2/transferprocesses/${encodeURIComponent(id)}`),

  initiate: (body: {
    counterPartyAddress: string;
    contractId: string;
    assetId: string;
    protocol?: string;
    transferType?: string;
    dataDestination?: Record<string, unknown>;
  }) =>
    post<{ "@id": string }>("/v2/transferprocesses", {
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@type": "TransferRequestDto",
      counterPartyAddress: body.counterPartyAddress,
      contractId: body.contractId,
      assetId: body.assetId,
      protocol: body.protocol ?? "dataspace-protocol-http",
      transferType: body.transferType ?? "HttpData-PULL",
      dataDestination: body.dataDestination ?? { "@type": "DataAddress", type: "HttpProxy" },
    }),
};

// ── Contract Agreements ──────────────────────────────────────────────

export interface EdcAgreement {
  "@id": string;
  "@type": string;
  assetId: string;
  [key: string]: unknown;
}

export const edcAgreements = {
  list: (offset = 0, limit = 50) =>
    post<EdcAgreement[]>("/v2/contractagreements/request", querySpec(offset, limit)),

  get: (id: string) =>
    edcFetch<EdcAgreement>(`/v2/contractagreements/${encodeURIComponent(id)}`),
};

// ── Policy Definitions ───────────────────────────────────────────────

export interface EdcPolicy {
  "@id": string;
  "@type": string;
  policy: Record<string, unknown>;
  [key: string]: unknown;
}

export const edcPolicies = {
  list: (offset = 0, limit = 50) =>
    post<EdcPolicy[]>("/v2/policydefinitions/request", querySpec(offset, limit)),

  get: (id: string) =>
    edcFetch<EdcPolicy>(`/v2/policydefinitions/${encodeURIComponent(id)}`),

  create: (policyDef: Record<string, unknown>) =>
    post<EdcPolicy>("/v2/policydefinitions", policyDef),
};

// ── Contract Definitions ─────────────────────────────────────────────

export interface EdcContractDef {
  "@id": string;
  "@type": string;
  [key: string]: unknown;
}

export const edcContractDefs = {
  list: (offset = 0, limit = 50) =>
    post<EdcContractDef[]>("/v2/contractdefinitions/request", querySpec(offset, limit)),

  create: (contractDef: Record<string, unknown>) =>
    post<EdcContractDef>("/v2/contractdefinitions", contractDef),
};

// ── Health / status ──────────────────────────────────────────────────

export async function edcHealthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${EDC_MANAGEMENT_URL}/v2/assets/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": EDC_API_KEY,
      },
      body: JSON.stringify({
        "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
        "@type": "QuerySpec",
        offset: 0,
        limit: 1,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
