/**
 * PDC — Product Data Catalog (https://pdx.dmi-ecosysteem.nl) client + per-city
 * matcher.
 *
 * The PDC is the DMI-Ecosysteem catalogue of data products/services. It exposes
 * an unauthenticated JSON REST API under `/api`:
 *
 *   GET /api/filters
 *     → { activeDataProviders, inactiveDataProviders, themes, locations,
 *         productTypes, participantRatings }  (each as { value, name })
 *
 *   GET /api/data-products?page&pageSize&search&themes&dataProviders&common
 *     → { dataProducts: PdcProductSummary[], totalCount }
 *       NB: use `page`/`pageSize` (NOT limit/offset → 400), `search` (NOT q),
 *           `themes`/`dataProviders` (NOT theme/provider). pageSize=500 returns
 *           the whole catalogue (~307) in one call.
 *
 *   GET /api/data-products/{id}
 *     → PdcProductDetail (adds externalId, license, catalogueOffers[])
 *       `catalogueOffers[].url` is the actual data-service link on a
 *       marketplace (e.g. WeCity data-market) — this is where the data lives.
 *
 * The API sends no CORS headers, so it must be called server-side (a Next route
 * handler or the `scripts/fetch-pdc.ts` snapshot script) — never from the
 * browser bundle.
 *
 * ── Municipality matching ──────────────────────────────────────────────────
 * IMPORTANT: PDC products carry NO usable geography. The `locations` field is
 * empty on every product and the `locations` filter facet is empty too. So a
 * product cannot be bound to a municipality by location. The only municipal
 * signals available are:
 *   1. the data provider being a municipality ("Gemeente <X>")  → "municipal"
 *   2. the municipality named in the product name/description    → "mentions"
 * Everything else is nationally applicable                       → "national"
 * `getPdcProductsForCity` returns all three buckets so callers can show
 * city-specific products distinctly from the (large) nationwide set.
 */

import type { CityConfig } from "./cities";

export const PDC_BASE_URL = "https://pdx.dmi-ecosysteem.nl";
export const PDC_API_BASE = `${PDC_BASE_URL}/api`;

/** PDC product types, from GET /api/filters → productTypes. */
export type PdcProductType =
  | "Consultancy"
  | "Dataset"
  | "Service"
  | "Productgroup"
  | "Application";

export interface PdcDataProviderRef {
  id: string;
  name: string;
  imageURL?: string;
}

/** A marketplace offer — the concrete place/way to obtain the data product. */
export interface PdcCatalogueOffer {
  id: string;
  url: string;
  fileFormats: string[];
  prices: unknown[];
  pricingDescription: string | null;
  updatedAt: string;
  marketplace: { id: string; name: string };
}

/** Item shape from GET /api/data-products. */
export interface PdcProductSummary {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  rating: number;
  common: boolean;
  imageURL: string;
  dataProvider: PdcDataProviderRef;
  locations: unknown[];
  themes: string[];
}

/** Item shape from GET /api/data-products/{id}. */
export interface PdcProductDetail extends Omit<PdcProductSummary, "updatedAt"> {
  externalId: string;
  license: string;
  catalogueOffers: PdcCatalogueOffer[];
}

export interface PdcListResponse {
  dataProducts: PdcProductSummary[];
  totalCount: number;
}

export interface PdcFacet {
  value: string;
  name: string;
}

export interface PdcFilters {
  activeDataProviders: PdcFacet[];
  inactiveDataProviders: PdcFacet[];
  themes: PdcFacet[];
  locations: PdcFacet[];
  productTypes: PdcFacet[];
  participantRatings: PdcFacet[];
}

export interface PdcListParams {
  page?: number;
  /** Page size. The server caps the response at the catalogue size. */
  pageSize?: number;
  /** Full-text search across products. */
  search?: string;
  /** Theme `value`s (from filters.themes). */
  themes?: string[];
  /** Data-provider `value`s/ids (from filters.*DataProviders). */
  dataProviders?: string[];
  /** Only "common" products. */
  common?: boolean;
}

function buildQuery(params: PdcListParams): string {
  const q = new URLSearchParams();
  if (params.page != null) q.set("page", String(params.page));
  if (params.pageSize != null) q.set("pageSize", String(params.pageSize));
  if (params.search) q.set("search", params.search);
  if (params.common) q.set("common", "true");
  for (const t of params.themes ?? []) q.append("themes", t);
  for (const dp of params.dataProviders ?? []) q.append("dataProviders", dp);
  const s = q.toString();
  return s ? `?${s}` : "";
}

async function pdcGet<T>(path: string): Promise<T> {
  const res = await fetch(`${PDC_API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`PDC ${path} → ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

/** GET /api/filters — all facets (providers, themes, product types, …). */
export function fetchPdcFilters(): Promise<PdcFilters> {
  return pdcGet<PdcFilters>("/filters");
}

/** GET /api/data-products — one page. */
export function fetchPdcProducts(
  params: PdcListParams = {}
): Promise<PdcListResponse> {
  return pdcGet<PdcListResponse>(`/data-products${buildQuery(params)}`);
}

/** GET /api/data-products/{id} — full detail incl. catalogueOffers. */
export function fetchPdcProductDetail(id: string): Promise<PdcProductDetail> {
  return pdcGet<PdcProductDetail>(`/data-products/${id}`);
}

/**
 * Fetch the entire catalogue (all pages). One `pageSize=500` call already
 * returns everything today, but this loops on `totalCount` so it keeps working
 * if the catalogue grows past a single page.
 */
export async function fetchAllPdcProducts(
  filter: Omit<PdcListParams, "page" | "pageSize"> = {}
): Promise<PdcProductSummary[]> {
  const pageSize = 500;
  const first = await fetchPdcProducts({ ...filter, page: 1, pageSize });
  const all = [...first.dataProducts];
  const pages = Math.ceil(first.totalCount / pageSize);
  for (let page = 2; page <= pages; page++) {
    const next = await fetchPdcProducts({ ...filter, page, pageSize });
    all.push(...next.dataProducts);
  }
  return all;
}

/**
 * Fetch full details for many products with bounded concurrency. Returns the
 * details in input order; products whose detail call fails resolve to `null`.
 */
export async function fetchPdcDetails(
  ids: string[],
  concurrency = 8
): Promise<(PdcProductDetail | null)[]> {
  const out: (PdcProductDetail | null)[] = new Array(ids.length).fill(null);
  let cursor = 0;
  async function worker() {
    while (cursor < ids.length) {
      const i = cursor++;
      try {
        out[i] = await fetchPdcProductDetail(ids[i]);
      } catch {
        out[i] = null;
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, ids.length) }, worker)
  );
  return out;
}

// ── Municipality matching ──────────────────────────────────────────────────

/** How strongly a product is tied to a given municipality. */
export type PdcRelevance = "municipal" | "mentions" | "national";

/** The minimal product shape the matcher needs (summary and detail both fit). */
export type PdcMatchable = Pick<
  PdcProductSummary,
  "name" | "description" | "dataProvider"
>;

/** Diacritic-fold + lowercase + collapse whitespace for robust comparison. */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Official `CityConfig.name` ↔ the name a municipality publishes under in PDC,
 * where they differ. PDC uses the colloquial provider name "Gemeente Den Haag"
 * while our config carries the formal "'s-Gravenhage".
 */
const PROVIDER_NAME_ALIASES: Record<string, string[]> = {
  "'s-gravenhage": ["den haag"],
  "'s-hertogenbosch": ["den bosch"],
};

/** The strings that, prefixed with "gemeente ", identify this city's provider. */
function municipalProviderNames(city: CityConfig): string[] {
  const base = normalize(city.name);
  const aliases = PROVIDER_NAME_ALIASES[base] ?? [];
  return [base, ...aliases].map((n) => `gemeente ${n}`);
}

/**
 * City names too short or too common to safely match inside free text (they'd
 * collide with ordinary words or other places). For these we only trust the
 * provider signal, never a text mention.
 */
function isAmbiguousName(city: CityConfig): boolean {
  const n = normalize(city.name);
  if (n.length < 5) return true;
  const COMMON = new Set([
    "best",
    "beek",
    "buren",
    "bergen",
    "laren",
    "wijk",
    "stein",
    "ommen",
    "epe",
  ]);
  return COMMON.has(n);
}

/** Whole-word, diacritic-insensitive test for `needle` inside `haystack`. */
function mentionsWord(haystack: string, needle: string): boolean {
  const n = normalize(needle);
  if (!n) return false;
  // Build a word-boundary regex on the normalized haystack.
  const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`).test(
    normalize(haystack)
  );
}

/**
 * Classify a single product's relevance to a city, or `null` if it is neither
 * municipally published by nor textually about that city (i.e. it's national).
 *
 * - "municipal": the data provider IS this municipality.
 * - "mentions": the city is named in the product name/description.
 *
 * `null` does NOT mean "irrelevant" — nationally-applicable products simply
 * aren't pinned to any one city. Use `getPdcProductsForCity` for the full,
 * bucketed view.
 */
export function classifyProductForCity(
  product: PdcMatchable,
  city: CityConfig
): Exclude<PdcRelevance, "national"> | null {
  const providerNames = municipalProviderNames(city);
  if (providerNames.includes(normalize(product.dataProvider.name))) {
    return "municipal";
  }
  if (!isAmbiguousName(city)) {
    const haystack = `${product.name}\n${product.description}`;
    const names = [city.name, ...(PROVIDER_NAME_ALIASES[normalize(city.name)] ?? [])];
    if (names.some((n) => mentionsWord(haystack, n))) {
      return "mentions";
    }
  }
  return null;
}

export interface PdcCityProducts<T extends PdcMatchable = PdcProductSummary> {
  city: CityConfig;
  /** Products published by this municipality itself. */
  municipal: T[];
  /** Products that name this municipality in their text. */
  mentions: T[];
  /** Everything else — nationally applicable, not pinned to any city. */
  national: T[];
}

/**
 * Bucket an already-fetched catalogue by relevance to one municipality.
 *
 * The total of the three buckets always equals the input length — every
 * product is accounted for exactly once (municipal > mentions > national).
 */
export function getPdcProductsForCity<T extends PdcMatchable>(
  products: T[],
  city: CityConfig
): PdcCityProducts<T> {
  const municipal: T[] = [];
  const mentions: T[] = [];
  const national: T[] = [];
  for (const p of products) {
    const rel = classifyProductForCity(p, city);
    if (rel === "municipal") municipal.push(p);
    else if (rel === "mentions") mentions.push(p);
    else national.push(p);
  }
  return { city, municipal, mentions, national };
}
