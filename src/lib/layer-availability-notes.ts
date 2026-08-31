/**
 * Bekende hiaten: datasets die een gemeente wél zou willen hebben, maar die
 * niet (open) beschikbaar zijn — met de reden en, waar mogelijk, een werkend
 * alternatief.
 *
 * Deze informatie stond tot 31-08-2026 als `availability: "stub"`-lagen in de
 * catalogus: grijze, niet-aanklikbare rijen in de sidebar. Dat was de verkeerde
 * plek — je kunt er niets mee op een kaart. De dekkingspagina is dat wel, en
 * die kende het onderscheid al: `/[city]/dekking` leidt de status `missing` af
 * uit de baseline-catalogus en toont er `liveInCities` bij.
 *
 * Twee soorten entry:
 *
 *  1. De laag bestaat elders wél (bv. `bomen` is live in Zwolle). Dan staat hij
 *     al als `missing` op de dekkingspagina en hangt `reden` daar als
 *     toelichting onder.
 *  2. De laag bestaat nergens (bv. `erfpacht`, `ams-kabels-leidingen`). Die
 *     zou zonder deze lijst helemaal verdwijnen; hij verschijnt daarom in het
 *     blok "Bekende hiaten" onderaan de dekkingspagina.
 *
 * `naam` is daarom verplicht: bij soort 2 is dit de enige plek waar de
 * leesbare naam van de dataset nog staat.
 */

import type { Province } from "./cities";

export interface AvailabilityNote {
  /** Leesbare naam van de dataset. */
  naam: string;
  /** Waarom hij hier niet beschikbaar is, en zo mogelijk het alternatief. */
  reden: string;
}

/** Toelichting per gemeente, gekeyed op `DataSource.id`. */
const BY_CITY: Record<string, Record<string, AvailabilityNote>> = {
  zwolle: {
    "tor-stadsdelen": {
      naam: "TOR Incidenten (Stadsdelen)",
      reden:
        "De TOR_stadsdelen-service is van gisservices.zwolle.nl verwijderd; wacht op herpublicatie door de gemeente.",
    },
    "gemeentelijk-eigendom": {
      naam: "Gemeentelijk Eigendom",
      reden:
        "Percelen in eigendom van de gemeente — niet als open dataset ontsloten.",
    },
    erfpacht: {
      naam: "Erfpachtpercelen",
      reden:
        "Gemeentelijk uitgegeven erfpacht — niet als open dataset ontsloten.",
    },
  },

  apeldoorn: {
    wegwerkzaamheden: {
      naam: "Wegwerkzaamheden",
      reden:
        "Niet via het openbare Apeldoornse GIS te ontsluiten.",
    },
    parkeerautomaten: {
      naam: "Parkeerautomaten",
      reden: "Geen openbare dataset voor Apeldoorn.",
    },
    laadpalen: {
      naam: "Laadpalen (lokaal)",
      reden: "Gebruik de landelijke laag Laadpunten OCPI (NDW).",
    },
    "civiele-kunstwerken": {
      naam: "Civiele Kunstwerken",
      reden: "Lokale gemeente-asset, niet openbaar ontsloten.",
    },
    lichtmasten: {
      naam: "Lichtmasten",
      reden: "Lokale gemeente-asset, niet openbaar ontsloten.",
    },
    "klimaat-koelteplekken": {
      naam: "Koele Verblijfsplekken",
      reden: "Lokale gemeente-analyse, niet openbaar.",
    },
    "regenbui-stroombanen": {
      naam: "Regenbui Stroombanen",
      reden: "Lokale gemeente-analyse, niet openbaar.",
    },
    bomen: {
      naam: "Bomen (lokaal)",
      reden:
        "Bomenkaart Apeldoorn niet openbaar; gebruik BGT Begroeid Terreindeel.",
    },
    energielabels: {
      naam: "Energielabels",
      reden: "Gebruik BAG Panden gecombineerd met CBS Energieverbruik.",
    },
    "enexis-elektra-kabel": {
      naam: "Enexis Elektriciteitskabels",
      reden: "Geen openbare netbeheerdersdataset voor heel Nederland.",
    },
    "enexis-gas-hoofdleiding": {
      naam: "Enexis Gas Hoofdleidingen",
      reden: "Geen openbare netbeheerdersdataset voor heel Nederland.",
    },
    "geluid-wegverkeer": {
      naam: "Geluid Wegverkeer (lokaal)",
      reden: "Gebruik RIVM Geluidhinder Wegverkeer.",
    },
    "bodem-verontreinigingen": {
      naam: "Bodemverontreinigingen",
      reden:
        "Lokale dataset, niet openbaar. Landelijk deels gedekt door BRO SAD.",
    },
    "gemeentelijk-eigendom": {
      naam: "Gemeentelijk Eigendom",
      reden: "Lokale gemeente-asset — niet openbaar ontsloten voor Apeldoorn.",
    },
    erfpacht: {
      naam: "Erfpachtpercelen",
      reden: "Lokale gemeente-asset — niet openbaar ontsloten voor Apeldoorn.",
    },
  },

  helmond: {
    wegwerkzaamheden: {
      naam: "Wegwerkzaamheden",
      reden: "Niet via het openbare Helmondse GIS te ontsluiten.",
    },
    parkeerautomaten: {
      naam: "Parkeerautomaten",
      reden: "Geen openbare dataset voor Helmond.",
    },
    "parkeer-zones": {
      naam: "Parkeerzones",
      reden: "Geen openbare dataset voor Helmond.",
    },
    laadpalen: {
      naam: "Laadpalen (lokaal)",
      reden: "Gebruik de landelijke laag Laadpunten OCPI (NDW).",
    },
    "civiele-kunstwerken": {
      naam: "Civiele Kunstwerken",
      reden: "Lokale gemeente-asset, niet openbaar ontsloten.",
    },
    lichtmasten: {
      naam: "Lichtmasten",
      reden: "Lokale gemeente-asset, niet openbaar ontsloten.",
    },
    "riolering-putten": {
      naam: "Riolering Putten",
      reden: "Lokale gemeente-asset, niet openbaar ontsloten.",
    },
    "riolering-strengen": {
      naam: "Riolering Leidingen",
      reden: "Lokale gemeente-asset, niet openbaar ontsloten.",
    },
    "klimaat-koelteplekken": {
      naam: "Koele Verblijfsplekken",
      reden: "Lokale gemeente-analyse, niet openbaar.",
    },
    "regenbui-stroombanen": {
      naam: "Regenbui Stroombanen",
      reden: "Lokale gemeente-analyse, niet openbaar.",
    },
    bomen: {
      naam: "Bomen (lokaal)",
      reden:
        "Bomenkaart Helmond niet openbaar; gebruik BGT Begroeid Terreindeel.",
    },
    energielabels: {
      naam: "Energielabels",
      reden: "Gebruik BAG Panden gecombineerd met CBS Energieverbruik.",
    },
    "geluid-wegverkeer": {
      naam: "Geluid Wegverkeer (lokaal)",
      reden: "Gebruik RIVM Geluidhinder Wegverkeer.",
    },
    "bodem-verontreinigingen": {
      naam: "Bodemverontreinigingen",
      reden:
        "Lokale dataset, niet openbaar. Landelijk deels gedekt door BRO SAD.",
    },
    "enexis-elektra-kabel": {
      naam: "Enexis Elektriciteitskabels",
      reden: "Geen openbare netbeheerdersdataset voor heel Nederland.",
    },
    "enexis-gas-hoofdleiding": {
      naam: "Enexis Gas Hoofdleidingen",
      reden: "Geen openbare netbeheerdersdataset voor heel Nederland.",
    },
    "luchtkwaliteit-pm10": {
      naam: "Fijnstof PM10",
      reden:
        "Niet via Atlas Brabant ontsloten; wel beschikbaar via RIVM Atlas Leefomgeving.",
    },
    "gemeentelijk-eigendom": {
      naam: "Gemeentelijk Eigendom",
      reden: "Lokale gemeente-asset — niet openbaar ontsloten voor Helmond.",
    },
    erfpacht: {
      naam: "Erfpachtpercelen",
      reden: "Lokale gemeente-asset — niet openbaar ontsloten voor Helmond.",
    },
  },

  tilburg: {
    "tlb-afvalcontainers": {
      naam: "Afvalcontainers Openbaar",
      reden: "De Tilburgse containerservice geeft 400 zonder authenticatie.",
    },
    "tlb-water-op-straat": {
      naam: "Water op Straat Risicopanden",
      reden: "WaterOpStraat_RisicoPanden geeft 400 zonder authenticatie.",
    },
    "tlb-onderwijs-kindvoorzieningen": {
      naam: "Onderwijs & Kindervoorzieningen",
      reden:
        "Onderwijs_en_kindervoorzieningen vereist een token — niet langer publiek.",
    },
    "tlb-warmtetransitie-wijken": {
      naam: "Wijkpaspoort Warmtetransitie",
      reden:
        "WijkpaspoortWarmtetransitieVNG vereist een token — niet langer publiek.",
    },
  },

  amsterdam: {
    "ams-meldingen": {
      naam: "Meldingen Openbare Ruimte (MORA)",
      reden:
        "app:meldingen-geometrie geeft 403 op een directe WFS-aanroep; vereist vermoedelijk authenticatie.",
    },
    "ams-kabels-leidingen": {
      naam: "KLIC Kabels & Leidingen",
      reden:
        "KLIC-netwerkinformatie is gevoelig en vereist KLIC-autorisatie (WIBON); alleen op te vragen bij grondroering.",
    },
  },
};

/** Toelichting die geldt voor élke gemeente in een provincie. */
const BY_PROVINCE: Partial<Record<Province, Record<string, AvailabilityNote>>> = {
  "Noord-Brabant": {
    "br-provinciale-wegen": {
      naam: "Provinciale Wegen (Brabant)",
      reden:
        "Atlas Brabant (ArcGIS) is uit de lucht; gebruik de landelijke NWB-wegenlaag.",
    },
    "br-hectometrering": {
      naam: "Hectometrering Provinciale Wegen",
      reden:
        "Atlas Brabant (ArcGIS) is uit de lucht; gebruik de landelijke Hectometerpalen (NWB).",
    },
    "br-wegassen": {
      naam: "Wegassen Provinciale Wegen",
      reden:
        "Atlas Brabant (ArcGIS) is uit de lucht; gebruik de landelijke NWB-wegenlaag.",
    },
  },
};

/**
 * Toelichting bij één laag die in deze gemeente ontbreekt. De gemeente-eigen
 * tekst wint van de provinciale.
 */
export function getLayerAvailabilityNote(
  citySlug: string,
  province: Province,
  layerId: string
): AvailabilityNote | undefined {
  return BY_CITY[citySlug]?.[layerId] ?? BY_PROVINCE[province]?.[layerId];
}

/**
 * Alle bekende hiaten voor een gemeente (gemeentelijk + provinciaal), gekeyed
 * op layer-id. De dekkingspagina splitst deze in twee groepen: ids die in de
 * baseline-catalogus zitten (die krijgen hun toelichting inline op de
 * `missing`-rij) en ids die nergens bestaan (die vormen het blok
 * "Bekende hiaten").
 */
export function getAllAvailabilityNotes(
  citySlug: string,
  province: Province
): Array<{ id: string } & AvailabilityNote> {
  const merged = { ...(BY_PROVINCE[province] ?? {}), ...(BY_CITY[citySlug] ?? {}) };
  return Object.entries(merged)
    .map(([id, n]) => ({ id, ...n }))
    .sort((a, b) => a.naam.localeCompare(b.naam, "nl"));
}
