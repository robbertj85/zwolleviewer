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
import { fetchEmpty } from "../fetchers";

export function buildApeldoornLayers(_city: CityConfig): DataSource[] {
  return [
    // ─── STUBS — Zwolle-specific layers we cannot reproduce for Apeldoorn ─
    ...stubLayers([
      ["wegwerkzaamheden", "Wegwerkzaamheden", "verkeer-logistiek", "Lokale wegwerkzaamheden niet via openbaar Apeldoorns GIS te ontsluiten"],
      ["parkeerautomaten", "Parkeerautomaten", "verkeer-logistiek", "Geen openbare dataset voor Apeldoorn"],
      ["laadpalen", "Laadpalen (lokaal)", "mobiliteitsdiensten", "Voor Apeldoorn: zie Laadpunten OCPI (NDW) — landelijke set"],
      ["civiele-kunstwerken", "Civiele Kunstwerken", "gebouwen-infra", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["lichtmasten", "Lichtmasten", "gebouwen-infra", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["riolering-putten", "Riolering Putten", "bodem-ondergrond", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["riolering-strengen", "Riolering Leidingen", "bodem-ondergrond", "Lokale gemeente-asset, niet openbaar ontsloten"],
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
