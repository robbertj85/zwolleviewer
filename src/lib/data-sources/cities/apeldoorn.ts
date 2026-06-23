/**
 * Apeldoorn-specific layers.
 *
 * Sources:
 * 1. Staat van Apeldoorn (staatvan-apeldoorn.opendata.arcgis.com) — federated
 *    ArcGIS Hub with Landgebruikkaart_Apeldoorn and Apeldoorn_Object_<year>.
 * 2. Stub layers for Zwolle-specific items that have no public Apeldoorn
 *    equivalent (lichtmasten, civiele kunstwerken, riolering, etc.).
 *
 * Gelderland provincial layers (Geoportaal Gelderland / geoportaal.gelderland.nl)
 * are now injected by the orchestrator via PROVINCIAL_BUILDERS["Gelderland"].
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";
import { fetchEmpty, fetchGeoJSON } from "../fetchers";

/**
 * Apeldoorns eigen ArcGIS Server. De Staat-van-Apeldoorn Hub
 * (staatvan-apeldoorn.opendata.arcgis.com, org opdkkCIhDCDBYN1c) is federatief
 * en publiceert nauwelijks BOG-data zelf; de echte bodem- & ondergrond-lagen
 * staan op gis.apeldoorn.nl. Onderstaande services zijn één voor één
 * geverifieerd op niet-lege features mét geometrie binnen de Apeldoorn-bbox
 * ([5.7264, 52.0733, 6.0785, 52.2857]).
 */
const APD_GIS = "https://gis.apeldoorn.nl/arcgis/rest/services";

function fetchApd(
  service: string,
  layerId: number,
  serverType: "FeatureServer" | "MapServer" = "MapServer",
  maxFeatures = 2000,
  full?: boolean
): Promise<GeoJSON.FeatureCollection> {
  const count = full ? 50000 : maxFeatures;
  const url = `${APD_GIS}/${service}/${serverType}/${layerId}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultRecordCount=${count}`;
  return fetchGeoJSON(url);
}

export function buildApeldoornLayers(_city: CityConfig): DataSource[] {
  return [
    // ═══════════════════════════════════════════════════════════════════
    // BODEM & ONDERGROND (BOG) — geverifieerd via gis.apeldoorn.nl
    // ═══════════════════════════════════════════════════════════════════
    {
      id: "apd-bodemkwaliteit",
      name: "Bodemkwaliteitskaart (functieklassen)",
      description:
        "Bodemfunctieklassen en bodemkwaliteitszones (boven-, tussen- en ondergrond) volgens de regionale bodemkwaliteitskaart OVIJ 2022. Bevat ontgravings-, toepassings- en toetsingsklassen per zone.",
      source: "Gemeente Apeldoorn GIS — Bodemkwaliteitskaart OVIJ 2022",
      sourceUrl:
        "https://gis.apeldoorn.nl/arcgis/rest/services/Bodemkwaliteitskaart_OVIJ_2022/FeatureServer",
      endpoint:
        "gis.apeldoorn.nl/…/Bodemkwaliteitskaart_OVIJ_2022/FeatureServer/0",
      category: "bodem-ondergrond",
      color: [150, 110, 60, 140],
      icon: "Layers",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      bog: true,
      isNew: true,
      defaultLimit: 2000,
      colorMap: {
        property: "FUNCTIE",
        values: {
          Wonen: [120, 180, 90, 150],
          Industrie: [180, 90, 60, 160],
          "Landbouw/natuur": [90, 160, 70, 150],
          Overig: [150, 150, 150, 130],
        },
        default: [150, 110, 60, 140],
      },
      fetchData: (full) =>
        fetchApd("Bodemkwaliteitskaart_OVIJ_2022", 0, "FeatureServer", 2000, full),
    },
    {
      id: "apd-bodemkwaliteit-zone-bovengrond",
      name: "Bodemkwaliteitszones bovengrond",
      description:
        "Bodemkwaliteitszonekaart van de bovengrond (regionale bodemkwaliteitskaart OVIJ 2022): indeling in zones B1/B2/… met bijbehorende ontgravings- en toepassingseisen.",
      source: "Gemeente Apeldoorn GIS — Bodemkwaliteitskaart OVIJ 2022",
      sourceUrl:
        "https://gis.apeldoorn.nl/arcgis/rest/services/Bodemkwaliteitskaart_OVIJ_2022/FeatureServer",
      endpoint:
        "gis.apeldoorn.nl/…/Bodemkwaliteitskaart_OVIJ_2022/FeatureServer/4",
      category: "bodem-ondergrond",
      color: [170, 130, 80, 130],
      icon: "Layers",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      bog: true,
      isNew: true,
      defaultLimit: 2000,
      colorMap: {
        property: "ZONE_BG",
        values: {
          B1: [120, 180, 90, 150],
          B2: [220, 200, 100, 150],
          B3: [200, 120, 70, 160],
        },
        default: [170, 130, 80, 130],
      },
      fetchData: (full) =>
        fetchApd("Bodemkwaliteitskaart_OVIJ_2022", 4, "FeatureServer", 2000, full),
    },
    {
      id: "apd-ondergrond-percelen",
      name: "Meldingen ondergrond (percelen)",
      description:
        "Percelen met geregistreerde meldingen rond de ondergrond (EPR — eigendom/registratie ondergrond) in Apeldoorn. Toont per perceel de eigenaar.",
      source: "Gemeente Apeldoorn GIS — EPR meldingen ondergrond",
      sourceUrl:
        "https://gis.apeldoorn.nl/arcgis/rest/services/EPR_meldingen_ondergrond/FeatureServer",
      endpoint:
        "gis.apeldoorn.nl/…/EPR_meldingen_ondergrond/FeatureServer/1",
      category: "bodem-ondergrond",
      color: [140, 90, 160, 150],
      icon: "Layers",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      bog: true,
      isNew: true,
      defaultLimit: 2000,
      labelProperties: ["EIGENAAR"],
      fetchData: (full) =>
        fetchApd("EPR_meldingen_ondergrond", 1, "FeatureServer", 2000, full),
    },
    {
      id: "apd-peilbuizen",
      name: "Grondwater peilbuizen",
      description:
        "Peilbuizen van het Apeldoornse grondwatermeetnet, met laatst gemeten grondwaterniveau (cmNAP), daggemiddelde en meetdatum per buis.",
      source: "Gemeente Apeldoorn GIS — Peilbuizen",
      sourceUrl:
        "https://gis.apeldoorn.nl/arcgis/rest/services/Peilbuizen_intern/FeatureServer",
      endpoint: "gis.apeldoorn.nl/…/Peilbuizen_intern/FeatureServer/1",
      category: "bodem-ondergrond",
      color: [40, 120, 200, 220],
      icon: "Droplets",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      bog: true,
      isNew: true,
      defaultLimit: 2000,
      labelProperties: ["ID", "GRONDWATERNIVEAU"],
      fetchData: (full) =>
        fetchApd("Peilbuizen_intern", 1, "FeatureServer", 2000, full),
    },
    {
      id: "apd-riool-putten",
      name: "Rioolputten",
      description:
        "Inspectie- en rioolputten van het gemeentelijke rioolstelsel van Apeldoorn (ondergrondse infra).",
      source: "Gemeente Apeldoorn GIS — Leidingen Riool",
      sourceUrl:
        "https://gis.apeldoorn.nl/arcgis/rest/services/BR_Leidingen_Riool/MapServer",
      endpoint: "gis.apeldoorn.nl/…/BR_Leidingen_Riool/MapServer/1",
      category: "bodem-ondergrond",
      color: [90, 90, 90, 220],
      icon: "Circle",
      visible: false,
      loading: false,
      pointType: "circle",
      radius: 3,
      bog: true,
      isNew: true,
      defaultLimit: 5000,
      fetchData: (full) =>
        fetchApd("BR_Leidingen_Riool", 1, "MapServer", 5000, full),
    },
    {
      id: "apd-riool-vrijverval",
      name: "Riolering (vrij verval)",
      description:
        "Vrijvervalleidingen van het Apeldoornse rioolstelsel — de ondergrondse afvoerleidingen die op natuurlijk verhang afwateren.",
      source: "Gemeente Apeldoorn GIS — Leidingen Riool",
      sourceUrl:
        "https://gis.apeldoorn.nl/arcgis/rest/services/BR_Leidingen_Riool/MapServer",
      endpoint: "gis.apeldoorn.nl/…/BR_Leidingen_Riool/MapServer/3",
      category: "bodem-ondergrond",
      color: [110, 80, 50, 220],
      icon: "GitBranch",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 1,
      bog: true,
      isNew: true,
      defaultLimit: 10000,
      fetchData: (full) =>
        fetchApd("BR_Leidingen_Riool", 3, "MapServer", 10000, full),
    },
    {
      id: "apd-riool-persleiding",
      name: "Riolering persleidingen",
      description:
        "Persleidingen van het Apeldoornse rioolstelsel — onder druk staande ondergrondse leidingen (incl. diameter en type).",
      source: "Gemeente Apeldoorn GIS — Leidingen Riool",
      sourceUrl:
        "https://gis.apeldoorn.nl/arcgis/rest/services/BR_Leidingen_Riool/MapServer",
      endpoint: "gis.apeldoorn.nl/…/BR_Leidingen_Riool/MapServer/2",
      category: "bodem-ondergrond",
      color: [200, 120, 40, 230],
      icon: "GitBranch",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      bog: true,
      isNew: true,
      defaultLimit: 5000,
      fetchData: (full) =>
        fetchApd("BR_Leidingen_Riool", 2, "MapServer", 5000, full),
    },
    {
      id: "apd-kabel-laagspanning",
      name: "Laagspanningskabels (ondergronds)",
      description:
        "Ondergrondse laagspanningskabels in beheer/registratie van de gemeente Apeldoorn. Onderdeel van de kabels- & leidingen-infra.",
      source: "Gemeente Apeldoorn GIS — Leidingen Kabel",
      sourceUrl:
        "https://gis.apeldoorn.nl/arcgis/rest/services/BR_Leidingen_Kabel/MapServer",
      endpoint: "gis.apeldoorn.nl/…/BR_Leidingen_Kabel/MapServer/2",
      category: "gebouwen-infra",
      color: [230, 180, 30, 220],
      icon: "Zap",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 1,
      bog: true,
      isNew: true,
      defaultLimit: 10000,
      fetchData: (full) =>
        fetchApd("BR_Leidingen_Kabel", 2, "MapServer", 10000, full),
    },

    // ─── STUBS — Zwolle-specific layers we cannot reproduce for Apeldoorn ─
    ...stubLayers([
      ["wegwerkzaamheden", "Wegwerkzaamheden", "verkeer-logistiek", "Lokale wegwerkzaamheden niet via openbaar Apeldoorns GIS te ontsluiten"],
      ["parkeerautomaten", "Parkeerautomaten", "verkeer-logistiek", "Geen openbare dataset voor Apeldoorn"],
      ["laadpalen", "Laadpalen (lokaal)", "mobiliteitsdiensten", "Voor Apeldoorn: zie Laadpunten OCPI (NDW) — landelijke set"],
      ["civiele-kunstwerken", "Civiele Kunstwerken", "gebouwen-infra", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["lichtmasten", "Lichtmasten", "gebouwen-infra", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["klimaat-koelteplekken", "Koele Verblijfsplekken", "omgevingsfactoren", "Lokale gemeente-analyse, niet openbaar"],
      ["regenbui-stroombanen", "Regenbui Stroombanen", "veiligheid", "Lokale gemeente-analyse, niet openbaar"],
      ["bomen", "Bomen (lokaal)", "groen-ecologie", "Bomenkaart Apeldoorn niet openbaar; gebruik BGT Begroeid Terreindeel"],
      ["energielabels", "Energielabels", "energie", "Voor Apeldoorn: zie BAG Panden + CBS Energieverbruik"],
      ["enexis-elektra-kabel", "Enexis Elektriciteitskabels", "energie", "Geen openbare DSO-dataset voor heel NL"],
      ["enexis-gas-hoofdleiding", "Enexis Gas Hoofdleidingen", "energie", "Geen openbare DSO-dataset voor heel NL"],
      ["geluid-wegverkeer", "Geluid Wegverkeer (lokaal)", "omgevingsfactoren", "Voor Apeldoorn: zie RIVM Geluidhinder Wegverkeer"],
      ["bodem-verontreinigingen", "Bodemverontreinigingen", "bodem-ondergrond", "Lokale dataset, niet openbaar"],
      ["gemeentelijk-eigendom", "Gemeentelijk Eigendom", "gebouwen-infra", "Lokale gemeente-asset — percelen in eigendom van de gemeente, niet openbaar ontsloten voor Apeldoorn"],
      ["erfpacht", "Erfpachtpercelen", "gebouwen-infra", "Lokale gemeente-asset — erfpachtpercelen gemeentelijk uitgegeven, niet openbaar ontsloten voor Apeldoorn"],
    ]),
  ];
}

function stubLayers(
  entries: Array<[id: string, name: string, category: DataSource["category"], reason: string]>
): DataSource[] {
  return entries.map(([id, name, category, reason]) => ({
    id,
    name,
    description: `${reason}. Beschikbaar voor Zwolle (gemeentelijke GIS), niet voor deze stad.`,
    source: "—",
    endpoint: "",
    category,
    color: [120, 120, 120, 80],
    icon: "Lock",
    visible: false,
    loading: false,
    availability: "stub",
    fetchData: fetchEmpty,
  }));
}
