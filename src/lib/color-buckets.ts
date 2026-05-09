/**
 * Auto-color-bucket utilities for the Basis Stadstwin viewer.
 *
 * Used to colour layers by an automatically-chosen numeric property when a
 * layer has no explicit `colorMap`. The pipeline is:
 *
 *   1. `pickBucketProperty(features)` — scan feature properties, score each
 *      candidate, and return the most "interesting" numeric key (or null).
 *   2. `computeQuantileBuckets(values, n)` — derive n+1 quantile boundaries
 *      from the observed values; fewer if the cardinality is low.
 *   3. `bucketIndex(value, boundaries)` — O(log n) lookup mapping a value to
 *      the bucket [0..buckets.length-1].
 *   4. `interpolateColor(t, ramp)` — linear interpolation along a list of
 *      RGB anchor stops, returning an RGBA tuple.
 *
 * The ramps are inline so we don't need a heavy color library.
 */
export type RGBA = [number, number, number, number];
export type RGB = [number, number, number];

/** Sequential blue ramp (light → dark), CARTO-style. */
export const RAMP_BLUES: RGB[] = [
  [247, 251, 255],
  [222, 235, 247],
  [198, 219, 239],
  [158, 202, 225],
  [107, 174, 214],
  [66, 146, 198],
  [33, 113, 181],
  [8, 81, 156],
  [8, 48, 107],
];

/** Viridis-like sequential ramp, perceptually uniform. */
export const RAMP_VIRIDIS: RGB[] = [
  [68, 1, 84],
  [72, 40, 120],
  [62, 73, 137],
  [49, 104, 142],
  [38, 130, 142],
  [31, 158, 137],
  [53, 183, 121],
  [109, 205, 89],
  [180, 222, 44],
  [253, 231, 37],
];

/** Diverging Red-Yellow-Green ramp for negative-to-positive ranges. */
export const RAMP_RDYLGN: RGB[] = [
  [165, 0, 38],
  [215, 48, 39],
  [244, 109, 67],
  [253, 174, 97],
  [254, 224, 139],
  [255, 255, 191],
  [217, 239, 139],
  [166, 217, 106],
  [102, 189, 99],
  [26, 152, 80],
  [0, 104, 55],
];

/**
 * Return true if a value is a finite number (or a numeric string).
 * Strings like "12,5" are parsed leniently (Dutch decimal comma allowed).
 */
function toNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.length > 0) {
    const normalised = v.replace(",", ".").trim();
    if (normalised === "") return null;
    const n = Number(normalised);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Heuristic: skip key if it looks like an identifier rather than data. */
function isIdLikeKey(key: string): boolean {
  if (key.startsWith("_")) return true;
  const lower = key.toLowerCase();
  if (lower === "id" || lower === "objectid" || lower === "fid" || lower === "uuid")
    return true;
  if (lower.endsWith("_id")) return true;
  if (lower.endsWith("id") && lower.length <= 6) return true; // bagid, pandid, …
  // identifier-like fields
  if (lower === "identificatie" || lower === "code" || lower === "nummer") return true;
  return false;
}

interface PropertyStats {
  key: string;
  cardinality: number;
  count: number;
  variance: number;
}

/**
 * Walk the feature collection and pick the numeric property with the highest
 * cardinality (number of distinct values), skipping ID-like and underscored
 * keys, requiring at least 3 distinct values, and preferring properties that
 * appear on many features.
 *
 * Returns null if no suitable property was found (e.g. all string/categorical
 * properties or vector tile / empty data).
 */
export function pickBucketProperty(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: readonly any[] | null | undefined
): string | null {
  if (!features || features.length === 0) return null;

  // Scan a bounded sample for performance — 1k features is plenty to detect
  // numeric structure without iterating gigantic GeoJSON in main thread.
  const SAMPLE_SIZE = 1000;
  const sample =
    features.length <= SAMPLE_SIZE
      ? features
      : features.slice(0, SAMPLE_SIZE);

  const stats = new Map<string, { values: Set<number>; sum: number; sumSq: number; count: number }>();

  for (const f of sample) {
    const props = (f && f.properties) ?? null;
    if (!props || typeof props !== "object") continue;
    for (const [key, raw] of Object.entries(props)) {
      if (isIdLikeKey(key)) continue;
      const num = toNumber(raw);
      if (num === null) continue;
      let s = stats.get(key);
      if (!s) {
        s = { values: new Set<number>(), sum: 0, sumSq: 0, count: 0 };
        stats.set(key, s);
      }
      s.values.add(num);
      s.sum += num;
      s.sumSq += num * num;
      s.count += 1;
    }
  }

  const candidates: PropertyStats[] = [];
  for (const [key, s] of stats) {
    if (s.values.size < 3) continue; // not interesting
    if (s.count < Math.min(5, sample.length)) continue;
    const mean = s.sum / s.count;
    const variance = s.sumSq / s.count - mean * mean;
    if (!Number.isFinite(variance) || variance <= 0) continue;
    candidates.push({ key, cardinality: s.values.size, count: s.count, variance });
  }

  if (candidates.length === 0) return null;

  // Highest cardinality wins; tie-break on coverage (count) then variance.
  candidates.sort((a, b) => {
    if (b.cardinality !== a.cardinality) return b.cardinality - a.cardinality;
    if (b.count !== a.count) return b.count - a.count;
    return b.variance - a.variance;
  });
  return candidates[0].key;
}

/**
 * Read all numeric values for a property from features. Use this to feed
 * `computeQuantileBuckets`. Returns an empty array if no values found.
 */
export function extractNumericValues(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: readonly any[] | null | undefined,
  property: string
): number[] {
  if (!features || features.length === 0) return [];
  const out: number[] = [];
  for (const f of features) {
    const v = toNumber(f?.properties?.[property]);
    if (v !== null) out.push(v);
  }
  return out;
}

export interface BucketScale {
  /** The property used for bucketing. */
  property: string;
  /** Sorted boundary values: bucket[i] = [boundaries[i], boundaries[i+1]). */
  boundaries: number[];
  /** Pre-computed RGBA colors, one per bucket (length = boundaries.length-1). */
  colors: RGBA[];
  /** Min / max for legend rendering. */
  min: number;
  max: number;
  /** Which ramp was picked. */
  ramp: "blues" | "viridis" | "rdylgn";
}

/**
 * Compute n quantile buckets for a list of numeric values.
 *
 * - Skips NaN / non-finite values.
 * - Falls back to fewer buckets if the input has very low cardinality.
 * - Picks `RAMP_RDYLGN` when values span both negative and positive
 *   (diverging), otherwise `RAMP_VIRIDIS` for sequential.
 */
export function computeQuantileBuckets(
  values: readonly number[],
  property: string,
  n = 7,
  alpha = 200
): BucketScale | null {
  if (values.length === 0) return null;

  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return null;

  const sorted = [...finite].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  if (min === max) return null; // no variance, nothing to colour by

  // If cardinality is low, drop to that many buckets so we don't get
  // duplicate boundaries.
  const distinct = new Set(sorted).size;
  const numBuckets = Math.max(2, Math.min(n, distinct - 1, 9));

  const boundaries: number[] = [];
  for (let i = 0; i <= numBuckets; i++) {
    const t = i / numBuckets;
    const idx = Math.min(sorted.length - 1, Math.floor(t * (sorted.length - 1)));
    boundaries.push(sorted[idx]);
  }
  // Force endpoints to true min/max and dedupe duplicate boundaries.
  boundaries[0] = min;
  boundaries[boundaries.length - 1] = max;
  for (let i = 1; i < boundaries.length; i++) {
    if (boundaries[i] <= boundaries[i - 1]) {
      // Nudge upward by a tiny epsilon — still monotonic, no duplicate
      // boundary errors during binary search.
      boundaries[i] = boundaries[i - 1] + Number.EPSILON;
    }
  }

  const isDiverging = min < 0 && max > 0;
  const ramp: BucketScale["ramp"] = isDiverging ? "rdylgn" : "viridis";
  const rampStops = isDiverging ? RAMP_RDYLGN : RAMP_VIRIDIS;

  const colors: RGBA[] = [];
  for (let i = 0; i < numBuckets; i++) {
    const t = numBuckets === 1 ? 0.5 : i / (numBuckets - 1);
    colors.push(interpolateColor(t, rampStops, alpha));
  }

  return { property, boundaries, colors, min, max, ramp };
}

/**
 * Linear-interpolate a color along a list of RGB anchor stops at evenly
 * spaced positions in [0,1]. Returns an RGBA tuple with `alpha` (0–255).
 */
export function interpolateColor(t: number, ramp: RGB[], alpha = 200): RGBA {
  if (ramp.length === 0) return [0, 0, 0, alpha];
  if (ramp.length === 1) return [ramp[0][0], ramp[0][1], ramp[0][2], alpha];
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * (ramp.length - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;
  if (i >= ramp.length - 1) {
    const last = ramp[ramp.length - 1];
    return [last[0], last[1], last[2], alpha];
  }
  const a = ramp[i];
  const b = ramp[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * frac),
    Math.round(a[1] + (b[1] - a[1]) * frac),
    Math.round(a[2] + (b[2] - a[2]) * frac),
    alpha,
  ];
}

/**
 * Binary-search the bucket index for a value. Returns 0..colors.length-1.
 * Values below min are clamped to bucket 0; above max to last bucket.
 */
export function bucketIndex(value: number, boundaries: readonly number[]): number {
  // boundaries.length = numBuckets + 1
  const last = boundaries.length - 2;
  if (last < 0) return 0;
  if (!Number.isFinite(value)) return 0;
  if (value <= boundaries[0]) return 0;
  if (value >= boundaries[boundaries.length - 1]) return last;
  let lo = 0;
  let hi = boundaries.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (boundaries[mid] <= value && value < boundaries[mid + 1]) return mid;
    if (value < boundaries[mid]) hi = mid;
    else lo = mid + 1;
  }
  return Math.min(lo, last);
}

/**
 * Convenience: compute the bucket scale for a feature collection by picking
 * the property automatically (unless one is provided).
 */
export function computeAutoBucketScale(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: readonly any[] | null | undefined,
  options?: { property?: string; n?: number; alpha?: number }
): BucketScale | null {
  if (!features || features.length === 0) return null;
  const prop = options?.property ?? pickBucketProperty(features);
  if (!prop) return null;
  const values = extractNumericValues(features, prop);
  return computeQuantileBuckets(values, prop, options?.n ?? 7, options?.alpha ?? 200);
}

/**
 * Look up the RGBA color for a single feature's value against a scale.
 * Returns the bucket color, or `fallback` if the property is missing /
 * non-numeric on this feature.
 */
export function colorForValue(
  scale: BucketScale,
  rawValue: unknown,
  fallback: RGBA
): RGBA {
  const num = toNumber(rawValue);
  if (num === null) return fallback;
  const idx = bucketIndex(num, scale.boundaries);
  return scale.colors[idx] ?? fallback;
}
