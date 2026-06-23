/**
 * Canonical BOG-DMI wishlist — the desired subsurface ("Bodem & Ondergrond")
 * datasets for the Basis Stadstwin, transcribed from the source material in
 * `/temp`:
 *   - "Gewenste datasets ondergrond DMI V0.1.xlsx"
 *   - "Opzet Inventarisatie Datalandschap Lianne.xlsx" (BRO node/edge graph)
 *   - "Resultaten eerste analyse Zoë.xlsx" (NORA / FAIR per dataset)
 *   - "Gewenste assetdata ondergrond gem Amsterdam v13042026.xlsx"
 *
 * Each entry links (via `mappedLayerId`) to a real `DataSource.id` when the app
 * already carries that dataset. The /dekking/bodem page joins this list against
 * the live layer catalogue to compute inclusion status — so this file stays the
 * single source of truth for "what we want", and the catalogue stays the source
 * of truth for "what we have".
 */

/** Openness of the upstream source (FAIR — Toegankelijkheid). */
export type BogBeschikbaarheid = "open" | "besloten" | "hiaat";

export interface BogDataset {
  /** Stable key — usually the BRO registratieobject / domain code. */
  key: string;
  thema: string;
  /** Human-readable dataset name. */
  naam: string;
  /** Formal bronhouder / register. */
  bron: string;
  beschikbaarheid: BogBeschikbaarheid;
  /**
   * The `DataSource.id` this dataset maps to in the app catalogue, when present.
   * Omit when there is no corresponding layer yet (a data hiaat / roadmap item).
   */
  mappedLayerId?: string;
  /**
   * Landelijk beschikbaar, maar alléén als WMS-raster / voxelmodel — dus géén
   * kaartlaag in de Basis Stadstwin (de deck.gl-pijplijn rendert vectoren).
   * Toont op /dekking/bodem als "raster/stub" zonder dat er een map-layer is.
   */
  landelijkRaster?: boolean;
  /**
   * Externe viewer/kaart om de dataset toch te bekijken (vooral voor
   * `landelijkRaster`-datasets die geen kaartlaag in de app zijn). Getoond als
   * "Bekijk landelijke kaart ↗" op /dekking/bodem.
   */
  viewerUrl?: string;
  /** Short note (e.g. why it's a gap, or what's restricted). */
  toelichting?: string;
}

/** Ordered thema groups for the coverage page. */
export const BOG_THEMAS = [
  "Bodemopbouw & geotechniek (BRO-SR)",
  "Grondwatermonitoring (BRO-GM)",
  "Grondwatergebruik & bodemenergie (BRO-GU)",
  "Bodemkwaliteit & milieuhygiëne (BRO-SQ)",
  "Ondergrondmodellen (BRO-MM)",
  "Mijnbouw & diepe ondergrond (BRO-EP)",
  "Hoogte & maaiveld",
  "Kabels, leidingen & ondergrondse assets",
  "Archeologie & erfgoed",
  "Water & keringen",
] as const;

export const BOG_DATASETS: BogDataset[] = [
  // ─── Bodemopbouw & geotechniek (BRO-SR) ───────────────────────────
  {
    key: "CPT",
    thema: "Bodemopbouw & geotechniek (BRO-SR)",
    naam: "Geotechnisch sondeeronderzoek (CPT)",
    bron: "BRO / TNO (DINOloket)",
    beschikbaarheid: "open",
    landelijkRaster: true,
    viewerUrl: "https://www.dinoloket.nl/ondergrondgegevens",
    toelichting: "Landelijk via BRO; alleen als WMS-raster ontsloten.",
  },
  {
    key: "BHR-GT",
    thema: "Bodemopbouw & geotechniek (BRO-SR)",
    naam: "Geotechnisch booronderzoek (BHR-GT)",
    bron: "BRO / TNO",
    beschikbaarheid: "open",
    toelichting: "Boormonsterbeschrijving/-analyse; nog geen laag.",
  },
  {
    key: "BHR-G",
    thema: "Bodemopbouw & geotechniek (BRO-SR)",
    naam: "Geologisch booronderzoek (BHR-G)",
    bron: "BRO / TNO",
    beschikbaarheid: "open",
    toelichting: "Nog geen laag.",
  },
  {
    key: "BHR-P",
    thema: "Bodemopbouw & geotechniek (BRO-SR)",
    naam: "Bodemkundig booronderzoek (BHR-P)",
    bron: "BRO / WUR",
    beschikbaarheid: "open",
    landelijkRaster: true,
    viewerUrl: "https://www.dinoloket.nl/ondergrondgegevens",
    toelichting: "Landelijk via BRO; alleen als WMS-raster ontsloten.",
  },
  {
    key: "SFR",
    thema: "Bodemopbouw & geotechniek (BRO-SR)",
    naam: "Bodemkundig wandonderzoek (SFR)",
    bron: "BRO / WUR",
    beschikbaarheid: "open",
    toelichting: "Nog geen laag.",
  },

  // ─── Grondwatermonitoring (BRO-GM) ────────────────────────────────
  {
    key: "GMW",
    thema: "Grondwatermonitoring (BRO-GM)",
    naam: "Grondwatermonitoringput (GMW)",
    bron: "BRO / PDOK",
    beschikbaarheid: "open",
    mappedLayerId: "bro-grondwaterput",
  },
  {
    key: "GLD",
    thema: "Grondwatermonitoring (BRO-GM)",
    naam: "Grondwaterstandonderzoek (GLD)",
    bron: "BRO / PDOK",
    beschikbaarheid: "open",
    mappedLayerId: "bro-grondwaterstand",
  },
  {
    key: "GAR",
    thema: "Grondwatermonitoring (BRO-GM)",
    naam: "Grondwatersamenstellingsonderzoek (GAR)",
    bron: "BRO / PDOK",
    beschikbaarheid: "open",
    mappedLayerId: "bro-grondwatersamenstelling",
  },
  {
    key: "GMN",
    thema: "Grondwatermonitoring (BRO-GM)",
    naam: "Grondwatermonitoringnet (GMN)",
    bron: "BRO / PDOK",
    beschikbaarheid: "open",
    mappedLayerId: "bro-grondwatermonitoringnet",
  },

  // ─── Grondwatergebruik & bodemenergie (BRO-GU) ────────────────────
  {
    key: "GU-OBES",
    thema: "Grondwatergebruik & bodemenergie (BRO-GU)",
    naam: "Open bodemenergiesystemen (WKO)",
    bron: "RVO / BRO",
    beschikbaarheid: "open",
    mappedLayerId: "bodemenergie-open",
  },
  {
    key: "GU-GBES",
    thema: "Grondwatergebruik & bodemenergie (BRO-GU)",
    naam: "Gesloten bodemenergiesystemen (WKO)",
    bron: "RVO / BRO",
    beschikbaarheid: "open",
    mappedLayerId: "bodemenergie-gesloten",
  },
  {
    key: "GUF",
    thema: "Grondwatergebruik & bodemenergie (BRO-GU)",
    naam: "Grondwateronttrekkingen & -infiltraties (GUF)",
    bron: "RVO / LGR / BRO",
    beschikbaarheid: "open",
    mappedLayerId: "grondwateronttrekking",
  },
  {
    key: "GPD",
    thema: "Grondwatergebruik & bodemenergie (BRO-GU)",
    naam: "Grondwaterproductiedossier (GPD)",
    bron: "BRO",
    beschikbaarheid: "besloten",
    toelichting: "Onttrokken hoeveelheden; nog geen laag.",
  },

  // ─── Bodemkwaliteit & milieuhygiëne (BRO-SQ) ──────────────────────
  {
    key: "SAD",
    thema: "Bodemkwaliteit & milieuhygiëne (BRO-SQ)",
    naam: "Milieuhygiënisch bodemonderzoek / saneringen (SAD)",
    bron: "Bodemloket / bevoegd gezag",
    beschikbaarheid: "hiaat",
    toelichting:
      "Versnipperd per gemeente/provincie/omgevingsdienst; geen uniforme open service. Lokaal wél (bv. Zwolle).",
  },
  {
    key: "SLD",
    thema: "Bodemkwaliteit & milieuhygiëne (BRO-SQ)",
    naam: "Overheidsbesluit bodemverontreiniging (SLD)",
    bron: "Bevoegd gezag / BRO tranche 2",
    beschikbaarheid: "hiaat",
    toelichting: "Besluiten/contouren; nog geen laag.",
  },
  {
    key: "PFAS",
    thema: "Bodemkwaliteit & milieuhygiëne (BRO-SQ)",
    naam: "PFAS, lood & asbest in de bodem",
    bron: "Bevoegd gezag / omgevingsdiensten",
    beschikbaarheid: "hiaat",
    toelichting: "Indicatoren gezonde bodem; nog geen landelijke laag.",
  },

  // ─── Ondergrondmodellen (BRO-MM) ──────────────────────────────────
  {
    key: "GeoTOP",
    thema: "Ondergrondmodellen (BRO-MM)",
    naam: "GeoTOP 3D-voxelmodel (tot 50 m)",
    bron: "BRO / TNO",
    beschikbaarheid: "open",
    landelijkRaster: true,
    viewerUrl: "https://www.dinoloket.nl/ondergrondmodellen",
    toelichting: "WMS-raster; 3D-overlay nog niet ondersteund.",
  },
  {
    key: "REGIS",
    thema: "Ondergrondmodellen (BRO-MM)",
    naam: "REGIS II hydrogeologisch model",
    bron: "BRO / TNO",
    beschikbaarheid: "open",
    landelijkRaster: true,
    viewerUrl: "https://www.dinoloket.nl/ondergrondmodellen",
    toelichting: "WMS-raster.",
  },
  {
    key: "Bodemkaart",
    thema: "Ondergrondmodellen (BRO-MM)",
    naam: "Bodemkaart van Nederland (1:50.000)",
    bron: "BRO / WUR",
    beschikbaarheid: "open",
    landelijkRaster: true,
    viewerUrl: "https://bodemdata.nl/",
    toelichting: "WMS-raster.",
  },
  {
    key: "DGM",
    thema: "Ondergrondmodellen (BRO-MM)",
    naam: "Digitaal Geologisch Model (DGM)",
    bron: "BRO / TNO",
    beschikbaarheid: "open",
    toelichting: "Nog geen laag.",
  },
  {
    key: "GKN",
    thema: "Ondergrondmodellen (BRO-MM)",
    naam: "Geomorfologische kaart (GKN)",
    bron: "BRO / WUR",
    beschikbaarheid: "open",
    toelichting: "Nog geen laag.",
  },
  {
    key: "GWSD",
    thema: "Ondergrondmodellen (BRO-MM)",
    naam: "Model grondwaterspiegeldiepte (GWSD)",
    bron: "BRO / TNO",
    beschikbaarheid: "open",
    toelichting: "Nog geen laag.",
  },

  // ─── Mijnbouw & diepe ondergrond (BRO-EP) ─────────────────────────
  {
    key: "EPL",
    thema: "Mijnbouw & diepe ondergrond (BRO-EP)",
    naam: "Mijnbouwwetvergunning (EPL)",
    bron: "NLOG / EZK",
    beschikbaarheid: "open",
    toelichting: "Diepe ondergrond; nog geen laag.",
  },
  {
    key: "EPC",
    thema: "Mijnbouw & diepe ondergrond (BRO-EP)",
    naam: "Mijnbouwconstructie (boorgat, zoutcaverne) (EPC)",
    bron: "NLOG / EZK",
    beschikbaarheid: "open",
    toelichting: "Nog geen laag.",
  },

  // ─── Hoogte & maaiveld ────────────────────────────────────────────
  {
    key: "AHN-DSM",
    thema: "Hoogte & maaiveld",
    naam: "AHN DSM 0.5m (hoogte oppervlak)",
    bron: "PDOK / AHN",
    beschikbaarheid: "open",
    landelijkRaster: true,
    viewerUrl: "https://www.ahn.nl/ahn-viewer",
    toelichting: "WMS-raster.",
  },
  {
    key: "AHN-DTM",
    thema: "Hoogte & maaiveld",
    naam: "AHN DTM 0.5m (maaiveld)",
    bron: "PDOK / AHN",
    beschikbaarheid: "open",
    landelijkRaster: true,
    viewerUrl: "https://www.ahn.nl/ahn-viewer",
    toelichting: "WMS-raster.",
  },

  // ─── Kabels, leidingen & ondergrondse assets ──────────────────────
  {
    key: "KLIC",
    thema: "Kabels, leidingen & ondergrondse assets",
    naam: "Kabels & leidingen (KLIC / IMKL)",
    bron: "Kadaster (WIBON) / netbeheerders",
    beschikbaarheid: "besloten",
    toelichting: "Alleen via KLIC-melding bij grondroering; niet als open laag.",
  },
  {
    key: "RIOOL",
    thema: "Kabels, leidingen & ondergrondse assets",
    naam: "Riolering (putten & strengen)",
    bron: "Gemeente / GWSW (RIONED)",
    beschikbaarheid: "open",
    mappedLayerId: "riolering-putten",
    toelichting: "Lokaal beheerd (bv. Zwolle); geen landelijke uniforme bron.",
  },
  {
    key: "BRANDKRANEN",
    thema: "Kabels, leidingen & ondergrondse assets",
    naam: "Brandkranen, riool-/inspectieputten & kolken",
    bron: "PDOK (BGT) — put",
    beschikbaarheid: "open",
    mappedLayerId: "bgt-put",
    toelichting:
      "Landelijk via de BGT put-laag (brandkraan, inspectie-/rioolput, kolk).",
  },

  // ─── Archeologie & erfgoed ────────────────────────────────────────
  {
    key: "AMK",
    thema: "Archeologie & erfgoed",
    naam: "Archeologische monumenten (AMK/ARCHIS)",
    bron: "RCE",
    beschikbaarheid: "open",
    mappedLayerId: "rce-archeologie",
  },
  {
    key: "OO",
    thema: "Archeologie & erfgoed",
    naam: "Ontplofbare oorlogsresten (OO)",
    bron: "Gemeente / opsporingsbureaus",
    beschikbaarheid: "hiaat",
    toelichting: "Deels commercieel; geen uniforme open service.",
  },

  // ─── Water & keringen ─────────────────────────────────────────────
  {
    key: "KERINGEN",
    thema: "Water & keringen",
    naam: "Waterkeringen (IMWA)",
    bron: "PDOK / Waterschappen",
    beschikbaarheid: "open",
    mappedLayerId: "waterkeringen",
  },
  {
    key: "LEGGER",
    thema: "Water & keringen",
    naam: "Waterschapslegger (watergangen, kunstwerken)",
    bron: "Waterschappen (Aquo/IMWA)",
    beschikbaarheid: "open",
    toelichting: "Deels via PDOK; nog geen laag.",
  },
];
