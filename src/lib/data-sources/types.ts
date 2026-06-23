/**
 * Shared types and category metadata for data sources.
 *
 * Layers are typed once here; the per-city factories in `./national.ts`,
 * `./cities/<slug>.ts` etc. emit instances of `DataSource`.
 */

/**
 * The 10 data-bearing categories — unified scheme used everywhere a layer's
 * category is set, by the sidebar's collapsible groups, and by the API
 * gateway. Matches the user's "ziekenfonds" reference image (the 12-cat
 * `ImageCategory` is a superset that adds two Dekking-only informational
 * rows: `pdx` and `databronnen`).
 */
export type LayerCategory =
  | "bestuurlijke-grenzen"
  | "bodem-ondergrond"
  | "energie"
  | "gebouwen-infra"
  | "gezondheid-norm"
  | "groen-ecologie"
  | "mobiliteitsdiensten"
  | "omgevingsfactoren"     // Lucht, geluid, temperatuur
  | "sociaal-economisch"
  | "veiligheid"
  | "verkeer-logistiek";

/**
 * Whether a layer has live data for the active city, or is a stub
 * showing "data nog niet beschikbaar voor deze gemeente". Stubs still
 * appear in the sidebar (greyed out, with a tooltip).
 */
export type LayerAvailability = "live" | "stub";

/**
 * How a layer's per-feature color is computed:
 *
 * - `"single"` — every feature uses `DataSource.color` (the legacy default).
 * - `"auto-bucket"` — auto-detect the most varied numeric property and
 *   colour each feature from a sequential / diverging quantile ramp
 *   (see `src/lib/color-buckets.ts`).
 *
 * Layers that already declare a `colorMap` (categorical legend) ignore this
 * field — the explicit mapping always wins.
 */
export type ColorMode = "single" | "auto-bucket";

/**
 * Update cadence of the upstream data feed. Used by FeaturePanel to warn
 * users when a layer is years old vs. real-time.
 */
export type UpdateFrequency =
  | "realtime"        // < 5 min — NDW live feeds
  | "near-realtime"   // 5 min – 1 hour — NDW MSI, OCPI
  | "hourly"
  | "daily"           // PDOK BAG, BGT
  | "weekly"
  | "monthly"         // NDW WKD, kerncijfers
  | "quarterly"
  | "annual"          // CBS, BAG snapshots
  | "biennial"
  | "ad-hoc"          // RIVM Atlas, RCE
  | "static"          // Geometric reference data, never changes
  | "community"       // OSM — continuous but unscheduled
  | "unknown";

export interface FreshnessMeta {
  frequency: UpdateFrequency;
  /** Reference year/period of the dataset, e.g. "2022", "2024-Q3", "v3.0". */
  reference?: string;
  /** Free-form annotation, e.g. "rate-limited 1 req/sec" */
  note?: string;
}

export interface DataSource {
  id: string;
  name: string;
  description: string;
  source: string;
  sourceUrl?: string;
  endpoint: string;
  category: LayerCategory;
  color: [number, number, number, number];
  icon: string;
  fetchData: (full?: boolean) => Promise<GeoJSON.FeatureCollection>;
  defaultLimit?: number;
  visible: boolean;
  loading: boolean;
  pointType?: "icon" | "circle" | "scatterplot";
  radius?: number;
  lineWidth?: number;
  filled?: boolean;
  stroked?: boolean;
  extruded?: boolean;
  getElevation?: number;
  renderAs?: "msi-icon" | "speed-point";
  isNew?: boolean;
  /**
   * Marks a layer as part of the BOG-DMI subsurface programme (Bodem &
   * Ondergrond). Surfaced as a brown ◆ decal in the sidebar (next to the
   * amber ✦ "nieuw" star) and used by the /dekking/bodem coverage page.
   */
  bog?: boolean;
  accessType?: "open" | "restricted";
  /** "stub" = no data for the active city, sidebar shows greyed-out. */
  availability?: LayerAvailability;
  colorMap?: {
    property: string;
    values: Record<string, [number, number, number, number]>;
    default: [number, number, number, number];
  };
  vectorTile?: {
    tileUrl: string;
    sourceLayer: string;
    type: "line" | "fill" | "circle";
    paint: Record<string, unknown>;
  };
  /**
   * Optional default colour mode for this layer. When omitted the
   * per-layer state inherits the global default (see `useLayers`).
   */
  colorMode?: ColorMode;
  /**
   * Feature properties shown as the on-map value label for this layer (in
   * order; non-empty values joined with " · "). Example: pakketpunten use
   * ["brand", "street"] -> "DHL · Stationsweg 12". When omitted, the label
   * falls back to the coloring property or a name-like property heuristic.
   */
  labelProperties?: string[];
  /**
   * For `colorMode: "auto-bucket"` — the numeric property name to bucket on.
   * Without this hint the auto-bucket picks the property with the highest
   * cardinality, which on CBS PC4 (~150 numeric fields per polygon) is
   * almost never the field a layer name advertises (e.g. "WOZ-waarde"
   * would otherwise colour by `aantalInwoners`). Set this to the upstream
   * field name so the colouring matches the layer's intent.
   */
  bucketProperty?: string;
  /**
   * Update cadence + reference period of the upstream data feed. Surfaced in
   * the FeaturePanel footer and sidebar tooltip. When omitted, `buildDataSources`
   * fills in a default from `getFreshness(source)`.
   */
  freshness?: FreshnessMeta;
}

export interface LayerMetadata {
  id: string;
  name: string;
  description: string;
  source: string;
  sourceUrl?: string;
  endpoint: string;
  category: LayerCategory;
  icon: string;
  isNew?: boolean;
  bog?: boolean;
  accessType?: "open" | "restricted";
  availability?: LayerAvailability;
  freshness?: FreshnessMeta;
}

export const CATEGORIES: Record<
  LayerCategory,
  { label: string; icon: string }
> = {
  "bestuurlijke-grenzen": {
    label: "Bestuurlijke grenzen",
    icon: "Map",
  },
  "bodem-ondergrond": {
    label: "Bodem & ondergrond / hoogtekaarten",
    icon: "Layers",
  },
  energie: { label: "Energie", icon: "Zap" },
  "gebouwen-infra": {
    label: "Gebouwen, infrastructuur, installaties, kabels",
    icon: "Building2",
  },
  "gezondheid-norm": { label: "Gezondheid", icon: "HeartPulse" },
  "groen-ecologie": { label: "Groen & ecologie", icon: "TreePine" },
  mobiliteitsdiensten: { label: "Mobiliteitsdiensten", icon: "Bike" },
  omgevingsfactoren: { label: "Omgevingsfactoren", icon: "Wind" },
  "sociaal-economisch": {
    label: "Sociaal-economisch-demografisch",
    icon: "Users",
  },
  veiligheid: { label: "Veiligheid", icon: "ShieldAlert" },
  "verkeer-logistiek": { label: "Verkeer & logistiek", icon: "TrafficCone" },
};

/**
 * Superset of `LayerCategory` adding two Dekking-only informational rows
 * (`pdx`, `databronnen`). Used by /[city]/dekking to render a coverage
 * matrix per city. The first 10 keys are identical to LayerCategory so
 * sidebar groups, Dekking sections and API categories stay 1:1.
 */
export type ImageCategory =
  | LayerCategory
  | "pdx"
  | "databronnen";

export const IMAGE_CATEGORIES: Record<
  ImageCategory,
  { label: string; description: string }
> = {
  "bestuurlijke-grenzen": {
    label: "Bestuurlijke grenzen",
    description: "Landsgrens, provincie-, gemeente-, kadastrale en postcodegrenzen",
  },
  "bodem-ondergrond": {
    label: "Bodem & ondergrond / hoogtekaarten",
    description: "Samenstelling, kwaliteit, grondwaterstanden, netwerkinfra",
  },
  databronnen: {
    label: "Databronnen",
    description: "Open, half-open, gesloten — overzicht maken",
  },
  energie: {
    label: "Energie",
    description: "Capaciteit, soort, gebruik, contractwaarden, piek-dal",
  },
  "gebouwen-infra": {
    label: "Gebouwen, infrastructuur, installaties, kabels",
    description: "Locatie, omvang, functies, eigenaren; gebruik, kosten, assetmanagement",
  },
  "gezondheid-norm": {
    label: "Gezondheid",
    description: "WHO-normen, nabijheid van zorg en onderwijs",
  },
  "groen-ecologie": {
    label: "Groen & ecologie",
    description: "Soort, omvang, functie, diversiteit; toe- en afname; kwaliteit",
  },
  mobiliteitsdiensten: {
    label: "Mobiliteitsdiensten",
    description: "OV, Wmo, taxi, deelmobiliteit, OV-fiets, bewonerscoöperaties",
  },
  omgevingsfactoren: {
    label: "Omgevingsfactoren",
    description: "Lucht, geluid, temperatuur — grenswaarden en actuele waarden",
  },
  pdx: {
    label: "PDX",
    description: "Registerfunctie & PDC, app store, transactiegrootboek",
  },
  "sociaal-economisch": {
    label: "Sociaal-economisch-demografisch",
    description: "Inkomen, opleiding, leeftijd, werk, productie, zorg, onderwijs",
  },
  veiligheid: {
    label: "Veiligheid",
    description: "Verkeer, criminaliteit, overstromingsrisico, sociale veiligheid",
  },
  "verkeer-logistiek": {
    label: "Verkeer & logistiek",
    description: "Modaliteiten, parkeren, opslag/overslag, ontkoppelpunten",
  },
};
