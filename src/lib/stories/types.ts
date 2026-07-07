/**
 * Story maps — verhaalpagina's (storymaps) per datalaag.
 *
 * Een `StoryDefinition` is één keer per laag geschreven (zelfde verhaal voor
 * alle gemeenten); alle cijfers en grafieken worden client-side berekend uit
 * de daadwerkelijk geladen features van de actieve gemeente. Zo toont
 * hetzelfde verhaal automatisch de lokale situatie.
 *
 * In alle tekstvelden (title, subtitle, section bodies, chart titles) worden
 * placeholders geïnterpoleerd:
 *   {city}  — naam van de actieve gemeente ("Zwolle")
 *   {count} — aantal geladen features van de laag
 */

/** Eén verhaalblok: kop + markdown-body (gerenderd met MarkdownLite). */
export interface StorySection {
  heading: string;
  /** Markdown (MarkdownLite-subset: koppen, lijsten, **bold**, links). */
  body: string;
}

/** Eén statistiek-tegel, berekend uit de geladen features. */
export type StatSpec =
  | { label: string; type: "count"; unit?: string }
  | {
      /** Aantal features waar `property` gelijk is aan (één van) `equals`. */
      label: string;
      type: "count-where";
      property: string;
      equals: string | string[];
      unit?: string;
      /** Toon als percentage van het totaal i.p.v. absoluut aantal. */
      asShare?: boolean;
    }
  | {
      label: string;
      type: "avg" | "sum" | "min" | "max" | "median";
      property: string;
      unit?: string;
      decimals?: number;
    }
  | { label: string; type: "distinct"; property: string; unit?: string };

/**
 * Grafiekspecificaties. Alle grafieken worden defensief gerenderd: als de
 * benodigde property op (vrijwel) geen enkele feature voorkomt, wordt de
 * grafiek stilletjes overgeslagen — nooit een lege of kapotte grafiek.
 */
export type ChartSpec =
  | {
      /** Rij statistiek-tegels (KPI-row). */
      kind: "stat-row";
      stats: StatSpec[];
    }
  | {
      /** Horizontale staafgrafiek: aantal features per waarde van `property`. */
      kind: "category-bar";
      title: string;
      property: string;
      /** Onderschrift onder de titel. */
      description?: string;
      /** Max. aantal categorieën; de rest wordt "Overig". Default 7. */
      maxCategories?: number;
      /** Nettere labels voor ruwe waarden, bv. { "1": "Ja" }. */
      valueLabels?: Record<string, string>;
    }
  | {
      /** Histogram (kolommen) van een numerieke property. */
      kind: "histogram";
      title: string;
      property: string;
      description?: string;
      unit?: string;
      /** Aantal bins. Default 8. */
      bins?: number;
    };

/** Bron- of leeslink onderaan het verhaal. */
export interface StoryLink {
  label: string;
  url: string;
}

export interface StoryDefinition {
  /** Moet exact overeenkomen met `DataSource.id` van de laag. */
  layerId: string;
  /** Verhaaltitel, bv. "OV-haltes in {city}". */
  title: string;
  subtitle?: string;
  /** Inleidende alinea (markdown), boven de eerste grafiek. */
  intro: string;
  /**
   * Grafieken, in volgorde. Conventie: begin met een `stat-row`, daarna
   * hooguit 2–3 inhoudelijke grafieken.
   */
  charts: ChartSpec[];
  /** Verhaalblokken onder de grafieken: duiding, context, gebruik. */
  sections: StorySection[];
  /** Externe bronnen / verder lezen. */
  links?: StoryLink[];
}
