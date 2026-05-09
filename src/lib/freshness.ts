/**
 * Freshness registry — maps a data source's display name to its update
 * cadence and reference period. Consumed by `buildDataSources` to auto-fill
 * `DataSource.freshness` for any layer that doesn't declare it explicitly,
 * and by the FeaturePanel/sidebar UI to render a coloured badge so users can
 * see at a glance whether a layer is realtime or years out of date.
 *
 * Per-layer overrides live in the layer definition files (e.g. `cbs-pc4-*`
 * referencing 2022 data). When in doubt, the registry falls back to
 * `{ frequency: "unknown" }` and the badge is rendered muted.
 */

import type { FreshnessMeta, UpdateFrequency } from "./data-sources/types";

/**
 * Display-friendly Dutch label for an UpdateFrequency, optionally combined
 * with a `reference` (year / period) string.
 *
 * Examples:
 *   formatFreshness({ frequency: "annual", reference: "2022" })
 *     -> "Jaarlijks · 2022"
 *   formatFreshness({ frequency: "realtime" })
 *     -> "Realtime"
 *   formatFreshness({ frequency: "community" })
 *     -> "OSM (continu)"
 */
export function formatFreshness(f: FreshnessMeta): string {
  const base = FREQUENCY_LABEL[f.frequency];
  if (f.reference) return `${base} · ${f.reference}`;
  return base;
}

const FREQUENCY_LABEL: Record<UpdateFrequency, string> = {
  realtime: "Realtime",
  "near-realtime": "Bijna realtime",
  hourly: "Per uur",
  daily: "Dagelijks",
  weekly: "Wekelijks",
  monthly: "Maandelijks",
  quarterly: "Per kwartaal",
  annual: "Jaarlijks",
  biennial: "Tweejaarlijks",
  "ad-hoc": "Ad-hoc",
  static: "Statisch",
  community: "OSM (continu)",
  unknown: "Onbekend",
};

/**
 * Tailwind colour token for the badge. Kept aligned with the spec in the
 * task brief: realtime/community → emerald, daily/weekly → blue,
 * monthly/quarterly → indigo, annual/biennial → amber (warns: stale),
 * ad-hoc/unknown → muted, static → gray.
 */
export const FRESHNESS_COLORS: Record<
  UpdateFrequency,
  { bg: string; text: string; border: string }
> = {
  realtime: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/30",
  },
  "near-realtime": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/25",
  },
  hourly: {
    bg: "bg-sky-500/15",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-500/30",
  },
  daily: {
    bg: "bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/30",
  },
  weekly: {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/25",
  },
  monthly: {
    bg: "bg-indigo-500/15",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-500/30",
  },
  quarterly: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-500/25",
  },
  annual: {
    bg: "bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/30",
  },
  biennial: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/25",
  },
  "ad-hoc": {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  },
  static: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-600 dark:text-zinc-400",
    border: "border-zinc-500/25",
  },
  community: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/25",
  },
  unknown: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  },
};

/**
 * Lucide icon name for the badge. The FeaturePanel maps this to the actual
 * component; sidebar tooltip uses the human label only.
 */
export const FRESHNESS_ICON: Record<UpdateFrequency, string> = {
  realtime: "Zap",
  "near-realtime": "Activity",
  hourly: "Clock",
  daily: "Calendar",
  weekly: "Calendar",
  monthly: "Calendar",
  quarterly: "Calendar",
  annual: "CalendarClock",
  biennial: "CalendarClock",
  "ad-hoc": "CircleDashed",
  static: "Anchor",
  community: "Users",
  unknown: "HelpCircle",
};

/**
 * Lookup table keyed by exact `source` display name. Patterns starting with
 * `*` are matched as a string-prefix in `getFreshness`.
 */
const FRESHNESS_BY_SOURCE: Record<string, FreshnessMeta> = {
  // ─── PDOK / CBS — Wijk- en Buurtkaart 2024 (annual) ──
  "PDOK / CBS": { frequency: "annual", reference: "2024" },

  // ─── PDOK base registries (BAG/BGT/Kadaster — daily mutations) ──
  PDOK: { frequency: "daily" },
  "PDOK (BGT)": { frequency: "daily" },
  "PDOK / BAG": { frequency: "daily" },
  "PDOK / Kadaster": { frequency: "daily" },
  "PDOK / BRO": { frequency: "daily" },

  // ─── PDOK / monthly-ish provincial / national bestanden ──
  "PDOK / ProRail": { frequency: "monthly" },
  "PDOK / Rijkswaterstaat": { frequency: "monthly" },
  "PDOK / RWS (WKD)": { frequency: "monthly" },
  "PDOK / Waterschappen": { frequency: "monthly" },
  "PDOK / LVNL": { frequency: "monthly" },
  // Kadaster bestuurlijkegebieden: auto-updated maandelijks door PDOK
  // (per-layer freshness override takes priority — registry entry as fallback)
  // "PDOK / Kadaster" already maps to daily via the catch-all below; the
  // bestuurlijkegebieden layers carry their own freshness: { monthly, "2026" }.

  // ─── PDOK / RVO Natura 2000 — annual revision cycle ──
  "PDOK / RVO": { frequency: "annual" },

  // ─── NDW family ──
  NDW: { frequency: "realtime" },
  "NDW (DATEX II)": { frequency: "realtime" },
  "NDW (DATEX II v3)": { frequency: "realtime" },
  "NDW (RWS MSI)": { frequency: "realtime" },
  "NDW (Open Charge Point Interface 2.2.1)": { frequency: "near-realtime" },
  "NDW (WKD / DATEX II v3)": { frequency: "realtime" },
  "NDW Wegkenmerken (WKD)": { frequency: "monthly" },

  // ─── Other national ─────────────────────────────
  OpenStreetMap: { frequency: "community" },
  "verkeerslichtenviewer.nl": { frequency: "daily" },
  "pakketpuntenviewer.nl": { frequency: "weekly" },
  "BCI Global / Laadkaart Bouw": { frequency: "monthly" },
  "RIVM / Atlas Leefomgeving": { frequency: "ad-hoc", reference: "2020" },
  "RIVM Atlas Leefomgeving": { frequency: "ad-hoc", reference: "2024" },
  "BZK Leefbaarometer": { frequency: "biennial", reference: "3.1 (2024)" },
  "Stichting Landelijk Fietsplatform": { frequency: "quarterly" },
  "Stichting RIONED": { frequency: "annual" },
  "PDOK AHN": { frequency: "ad-hoc", reference: "AHN3/4" },
  Telraam: { frequency: "realtime", note: "sensor live counts" },
  "RCE / Cultureelerfgoed": { frequency: "monthly" },
  "DSO / Omgevingsloket": { frequency: "daily" },

  // ─── Municipal / provincial ArcGIS Hub ──────────
  "Gemeente Zwolle GIS": { frequency: "daily" },
  "Gemeente Zwolle GIS (NDW)": { frequency: "daily" },
  "Gemeente Zwolle GIS (EP-online RVO)": { frequency: "daily" },
  "Gemeente Zwolle GIS / Enexis": { frequency: "daily" },
  "Geoportaal Overijssel": { frequency: "monthly" },
  "Geoportaal Gelderland": { frequency: "monthly" },
  "Atlas Brabant": { frequency: "monthly" },
  "Open Data Helmond": { frequency: "quarterly" },
  "Staat van Apeldoorn": { frequency: "quarterly" },

  // ─── Other federated feeds added by sibling agents ────
  // OVapi publishes the daily GTFS-NL bundle each morning around 04:00 CET.
  "OVapi GTFS": { frequency: "daily" },
  // Esri NL/RWS BRON (BAG-related geometries via DMC) — monthly mutations.
  "Esri NL / Rijkswaterstaat (BRON)": { frequency: "monthly" },

  // ─── KRO-NCRV Pointer — burgermeldingen, ad-hoc ──────────────────────
  "KRO-NCRV Pointer": { frequency: "ad-hoc" },
};

/**
 * Resolve a layer's `source` string to its default freshness metadata.
 * Returns `{ frequency: "unknown" }` for anything not in the registry —
 * the UI then renders a muted badge rather than misleading the user.
 */
export function getFreshness(source: string): FreshnessMeta {
  // Skip the dash placeholder used by stub layers.
  if (!source || source === "—") return { frequency: "unknown" };

  // Exact match first.
  const exact = FRESHNESS_BY_SOURCE[source];
  if (exact) return { ...exact };

  // NDW prefix fallback — covers exotic suffixes we haven't enumerated.
  if (source === "NDW" || source.startsWith("NDW ") || source.startsWith("NDW(")) {
    return { frequency: "realtime" };
  }

  // PDOK prefix fallback — anything starting with "PDOK / X" defaults to daily.
  if (source.startsWith("PDOK ")) return { frequency: "daily" };

  // Gemeente Zwolle GIS variants — daily by default.
  if (source.startsWith("Gemeente Zwolle GIS")) return { frequency: "daily" };

  return { frequency: "unknown" };
}
