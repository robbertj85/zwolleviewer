/**
 * Pure berekeningen voor story-map grafieken: van GeoJSON-features naar
 * geaggregeerde, direct-renderbare data. Geen React, geen fetches — zodat de
 * aggregatie los testbaar is en de grafiekcomponenten dom kunnen blijven.
 */

import type { StatSpec, ChartSpec } from "./types";

type Feature = GeoJSON.Feature;

/** Minimum aandeel features dat een property moet hebben om te renderen. */
const MIN_PROPERTY_COVERAGE = 0.05;

function propValues(features: Feature[], property: string): unknown[] {
  const out: unknown[] = [];
  for (const f of features) {
    const v = f.properties?.[property];
    if (v !== null && v !== undefined && v !== "") out.push(v);
  }
  return out;
}

function numericValues(features: Feature[], property: string): number[] {
  const out: number[] = [];
  for (const v of propValues(features, property)) {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) out.push(n);
  }
  return out;
}

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("nl-NL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export interface ComputedStat {
  label: string;
  value: string;
  unit?: string;
}

export function computeStat(
  features: Feature[],
  spec: StatSpec
): ComputedStat | null {
  switch (spec.type) {
    case "count":
      return { label: spec.label, value: formatNumber(features.length), unit: spec.unit };
    case "count-where": {
      const wanted = Array.isArray(spec.equals) ? spec.equals : [spec.equals];
      const wantedSet = new Set(wanted.map((w) => w.toLowerCase()));
      const values = propValues(features, spec.property);
      if (values.length / Math.max(1, features.length) < MIN_PROPERTY_COVERAGE)
        return null;
      const hits = values.filter((v) =>
        wantedSet.has(String(v).toLowerCase())
      ).length;
      if (spec.asShare) {
        const pct = (hits / Math.max(1, values.length)) * 100;
        return { label: spec.label, value: `${formatNumber(pct, 1)}%`, unit: spec.unit };
      }
      return { label: spec.label, value: formatNumber(hits), unit: spec.unit };
    }
    case "distinct": {
      const values = propValues(features, spec.property);
      if (values.length === 0) return null;
      return {
        label: spec.label,
        value: formatNumber(new Set(values.map(String)).size),
        unit: spec.unit,
      };
    }
    case "avg":
    case "sum":
    case "min":
    case "max":
    case "median": {
      const nums = numericValues(features, spec.property);
      if (nums.length / Math.max(1, features.length) < MIN_PROPERTY_COVERAGE)
        return null;
      let v: number;
      if (spec.type === "avg") v = nums.reduce((a, b) => a + b, 0) / nums.length;
      else if (spec.type === "sum") v = nums.reduce((a, b) => a + b, 0);
      else if (spec.type === "min") v = Math.min(...nums);
      else if (spec.type === "max") v = Math.max(...nums);
      else {
        const s = [...nums].sort((a, b) => a - b);
        const mid = Math.floor(s.length / 2);
        v = s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
      }
      return {
        label: spec.label,
        value: formatNumber(v, spec.decimals ?? 1),
        unit: spec.unit,
      };
    }
  }
}

export interface CategoryBarDatum {
  label: string;
  count: number;
}

/**
 * Telt features per waarde van `property`, gesorteerd op aantal (hoog→laag),
 * met een "Overig"-staart boven `maxCategories`. Null wanneer de property
 * op te weinig features voorkomt of er maar één waarde is (geen verhaal).
 */
export function computeCategoryBar(
  features: Feature[],
  spec: Extract<ChartSpec, { kind: "category-bar" }>
): CategoryBarDatum[] | null {
  const values = propValues(features, spec.property).map(String);
  if (values.length / Math.max(1, features.length) < MIN_PROPERTY_COVERAGE)
    return null;

  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  if (counts.size < 2) return null;

  const max = spec.maxCategories ?? 7;
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const head = sorted.slice(0, max);
  const tail = sorted.slice(max);

  const data: CategoryBarDatum[] = head.map(([raw, count]) => ({
    label: spec.valueLabels?.[raw] ?? prettifyValue(raw),
    count,
  }));
  if (tail.length > 0) {
    data.push({
      label: `Overig (${tail.length})`,
      count: tail.reduce((sum, [, c]) => sum + c, 0),
    });
  }
  return data;
}

export interface HistogramDatum {
  /** Onderkant van de bin, bv. "0–50". */
  label: string;
  count: number;
  x0: number;
  x1: number;
}

export function computeHistogram(
  features: Feature[],
  spec: Extract<ChartSpec, { kind: "histogram" }>
): HistogramDatum[] | null {
  const nums = numericValues(features, spec.property);
  if (nums.length / Math.max(1, features.length) < MIN_PROPERTY_COVERAGE)
    return null;

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return null;

  const binCount = spec.bins ?? 8;
  const step = niceStep((max - min) / binCount);
  const start = Math.floor(min / step) * step;
  const bins: HistogramDatum[] = [];
  for (let x0 = start; x0 < max; x0 += step) {
    const x1 = x0 + step;
    bins.push({
      label: `${formatNumber(x0, 1)}–${formatNumber(x1, 1)}`,
      count: 0,
      x0,
      x1,
    });
  }
  for (const n of nums) {
    const idx = Math.min(bins.length - 1, Math.floor((n - start) / step));
    if (idx >= 0) bins[idx].count += 1;
  }
  // Lege staart-bins weglaten houdt de grafiek compact.
  while (bins.length > 2 && bins[bins.length - 1].count === 0) bins.pop();
  while (bins.length > 2 && bins[0].count === 0) bins.shift();
  return bins.length >= 2 ? bins : null;
}

/** Rond een ruwe stapgrootte af op 1/2/2.5/5 × 10^k voor leesbare bin-grenzen. */
function niceStep(raw: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / pow;
  const nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10;
  return nice * pow;
}

/** "PARKEREN_BETAALD" → "Parkeren betaald"; laat korte codes met rust. */
function prettifyValue(raw: string): string {
  if (raw.length <= 3) return raw;
  if (raw === raw.toUpperCase() && /[A-Z]/.test(raw)) {
    const lower = raw.toLowerCase().replace(/_/g, " ");
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return raw.replace(/_/g, " ");
}

/** Interpoleer {city}/{count} placeholders in verhaalteksten. */
export function interpolate(
  text: string,
  vars: { city: string; count: number }
): string {
  return text
    .replaceAll("{city}", vars.city)
    .replaceAll("{count}", formatNumber(vars.count));
}
