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
import { fetchEmpty } from "../fetchers";

export function buildHelmondLayers(_city: CityConfig): DataSource[] {
  return [
    // ─── STUBS — Zwolle-specific layers we cannot reproduce for Helmond ──
    // Helmond has fewer publicly-available layers than Apeldoorn (Brabant
    // geoportaal is sparser than Gelderland's), so most municipal-level
    // datasets fall back to stubs. The dekking page makes this transparent.
    ...stubLayers([
      ["wegwerkzaamheden", "Wegwerkzaamheden", "verkeer-logistiek", "Lokale wegwerkzaamheden niet via openbaar Helmonds GIS te ontsluiten"],
      ["parkeerautomaten", "Parkeerautomaten", "verkeer-logistiek", "Geen openbare dataset voor Helmond"],
      ["parkeer-zones", "Parkeerzones", "verkeer-logistiek", "Geen openbare dataset voor Helmond"],
      ["laadpalen", "Laadpalen (lokaal)", "mobiliteitsdiensten", "Voor Helmond: zie Laadpunten OCPI (NDW) — landelijke set"],
      ["civiele-kunstwerken", "Civiele Kunstwerken", "gebouwen-infra", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["lichtmasten", "Lichtmasten", "gebouwen-infra", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["riolering-putten", "Riolering Putten", "bodem-ondergrond", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["riolering-strengen", "Riolering Leidingen", "bodem-ondergrond", "Lokale gemeente-asset, niet openbaar ontsloten"],
      ["klimaat-koelteplekken", "Koele Verblijfsplekken", "omgevingsfactoren", "Lokale gemeente-analyse, niet openbaar"],
      ["regenbui-stroombanen", "Regenbui Stroombanen", "veiligheid", "Lokale gemeente-analyse, niet openbaar"],
      ["bomen", "Bomen (lokaal)", "groen-ecologie", "Bomenkaart Helmond niet openbaar; gebruik BGT Begroeid Terreindeel"],
      ["energielabels", "Energielabels", "energie", "Voor Helmond: zie BAG Panden + CBS Energieverbruik"],
      ["geluid-wegverkeer", "Geluid Wegverkeer (lokaal)", "omgevingsfactoren", "Voor Helmond: zie RIVM Geluidhinder Wegverkeer"],
      ["bodem-verontreinigingen", "Bodemverontreinigingen", "bodem-ondergrond", "Lokale dataset, niet openbaar"],
      ["enexis-elektra-kabel", "Enexis Elektriciteitskabels", "energie", "Geen openbare DSO-dataset voor heel NL"],
      ["enexis-gas-hoofdleiding", "Enexis Gas Hoofdleidingen", "energie", "Geen openbare DSO-dataset voor heel NL"],
      ["luchtkwaliteit-pm10", "Fijnstof PM10", "omgevingsfactoren", "Voor Brabant niet via Atlas Brabant ontsloten — wel beschikbaar via RIVM Atlas Leefomgeving (zie Geluidhinder)"],
      ["gemeentelijk-eigendom", "Gemeentelijk Eigendom", "gebouwen-infra", "Lokale gemeente-asset — percelen in eigendom van de gemeente, niet openbaar ontsloten voor Helmond"],
      ["erfpacht", "Erfpachtpercelen", "gebouwen-infra", "Lokale gemeente-asset — erfpachtpercelen gemeentelijk uitgegeven, niet openbaar ontsloten voor Helmond"],
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
