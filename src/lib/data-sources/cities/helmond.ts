/**
 * Helmond-specific layers.
 *
 * Sources:
 * 1. Open Data Helmond (data-helmond.opendata.arcgis.com) — federated ArcGIS
 *    Hub with Beheerder_Helmond_Natuur, Snoei_Helmond, etc.
 * 2. Stub layers for Zwolle-specific items not replicable for Helmond.
 *
 * Noord-Brabant provincial layers (Atlas Brabant / atlas.brabant.nl) are now
 * injected by the orchestrator via PROVINCIAL_BUILDERS["Noord-Brabant"].
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";
import { fetchArcGISQuery } from "../fetchers";

// Officiële Helmondse ArcGIS-org (eigenaar gemeente Helmond, host
// services6.arcgis.com/Z6jNDcrkDBbik5Ng). Bevat de gemeentelijke
// rioolhuisaansluitingen.
const HLM_GIS =
  "https://services6.arcgis.com/Z6jNDcrkDBbik5Ng/arcgis/rest/services";
// Org met het Helmondse warmtenet (voorheen Ennatuurlijk).
const HLM_WARMTE =
  "https://services-eu1.arcgis.com/QZSyVglN6fBie4qh/arcgis/rest/services";

export function buildHelmondLayers(_city: CityConfig): DataSource[] {
  return [
    // ─── BODEM & ONDERGROND — geverifieerde Helmondse GIS-lagen ──────────
    {
      id: "hlm-riool-huisaansluitingen",
      name: "Riolering huisaansluitingen",
      description:
        "Locaties van rioolhuisaansluitingen in Helmond (aansluitpunten van panden op het gemeentelijke rioolstelsel)",
      source: "Gemeente Helmond GIS",
      sourceUrl:
        "https://services6.arcgis.com/Z6jNDcrkDBbik5Ng/arcgis/rest/services/WS_Rioolhuisaansluiting/FeatureServer",
      endpoint:
        "services6.arcgis.com/Z6jNDcrkDBbik5Ng/arcgis/rest/services/WS_Rioolhuisaansluiting/FeatureServer/0",
      category: "bodem-ondergrond",
      color: [110, 80, 60, 200],
      icon: "CircleDot",
      visible: false,
      loading: false,
      bog: true,
      isNew: true,
      pointType: "scatterplot",
      radius: 4,
      defaultLimit: 3000,
      fetchData: async (full) =>
        fetchArcGISQuery(
          HLM_GIS,
          "WS_Rioolhuisaansluiting",
          0,
          "FeatureServer",
          3000,
          full
        ),
    },
    {
      id: "hlm-warmtenet",
      name: "Warmtenet Helmond",
      description:
        "Tracé van het Helmondse warmtenet (voorheen Ennatuurlijk, regio Helmond–Asten) — ondergrondse warmtetransportleidingen",
      source: "Warmtenet Helmond / Atlas ArcGIS",
      sourceUrl:
        "https://services-eu1.arcgis.com/QZSyVglN6fBie4qh/arcgis/rest/services/warmtenet_Helmond_Asten/FeatureServer",
      endpoint:
        "services-eu1.arcgis.com/QZSyVglN6fBie4qh/arcgis/rest/services/warmtenet_Helmond_Asten/FeatureServer/250",
      category: "bodem-ondergrond",
      color: [230, 90, 40, 220],
      icon: "Thermometer",
      visible: false,
      loading: false,
      bog: true,
      isNew: true,
      stroked: true,
      lineWidth: 3,
      defaultLimit: 500,
      fetchData: async (full) =>
        fetchArcGISQuery(
          HLM_WARMTE,
          "warmtenet_Helmond_Asten",
          250,
          "FeatureServer",
          500,
          full
        ),
    },

    // ─── STUBS — Zwolle-specific layers we cannot reproduce for Helmond ──
    // Helmond has fewer publicly-available layers than Apeldoorn (Brabant
    // geoportaal is sparser than Gelderland's), so most municipal-level
    // datasets fall back to stubs. The dekking page makes this transparent.
  ];
}

