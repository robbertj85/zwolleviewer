/**
 * Resolves a layer's `source` (and optional `endpoint`) to an upstream
 * documentation URL where users can look up what each property means.
 *
 * Returns `null` when no documentation pointer is mapped — the FeaturePanel
 * footer hides the docs row in that case.
 */

export interface SourceDocLink {
  url: string;
  label: string;
}

/**
 * Map a layer's `source` display name (and optional `endpoint`) to an
 * upstream documentation URL. Order of the rules matters: the most
 * specific source names are matched before the catch-all "PDOK" prefix.
 */
export function getSourceDocsLink(
  source: string,
  endpoint?: string
): SourceDocLink | null {
  // Specific PDOK sub-registries first
  if (source === "PDOK / CBS") {
    // Route CBS PC6 docs to the CBS PC6 page
    if (endpoint && /postcode6/i.test(endpoint)) {
      return {
        url: "https://www.cbs.nl/nl-nl/longread/diversen/2025/statistische-gegevens-per-vierkant-en-postcode-2022-2023-2024",
        label: "CBS Postcode6 statistieken",
      };
    }
    return {
      url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart-2024",
      label: "CBS Wijk- en Buurtkaart",
    };
  }
  if (source === "PDOK (BGT)") {
    return {
      url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      label: "PDOK BGT",
    };
  }
  if (source === "PDOK / BAG" || (endpoint && /bag/i.test(endpoint))) {
    return {
      url: "https://www.kadaster.nl/zakelijk/registraties/basisregistraties/bag",
      label: "Kadaster BAG",
    };
  }
  // Catch-all PDOK prefix ("PDOK", "PDOK / Kadaster", "PDOK / ProRail", ...)
  if (source === "PDOK" || source.startsWith("PDOK / ") || source.startsWith("PDOK ")) {
    return { url: "https://www.pdok.nl/geo-services", label: "PDOK Geo-services" };
  }

  // NDW family ("NDW", "NDW (DATEX II)", "NDW Wegkenmerken (WKD)", ...)
  if (source === "NDW" || source.startsWith("NDW ") || source.startsWith("NDW(")) {
    return { url: "https://docs.ndw.nu/", label: "NDW documentatie" };
  }

  // RIVM / Atlas Leefomgeving (incl. nieuwe display-naam "RIVM Atlas Leefomgeving")
  if (
    source === "RIVM" ||
    source.startsWith("RIVM ") ||
    source.startsWith("RIVM /")
  ) {
    return { url: "https://www.atlasleefomgeving.nl/", label: "Atlas Leefomgeving" };
  }

  // BZK Leefbaarometer
  if (source === "BZK Leefbaarometer" || source.startsWith("BZK Leefbaarometer")) {
    return {
      url: "https://www.leefbaarometer.nl",
      label: "Leefbaarometer (BZK)",
    };
  }

  // Stichting Landelijk Fietsplatform
  if (source.startsWith("Stichting Landelijk Fietsplatform")) {
    return {
      url: "https://www.fietsplatform.nl",
      label: "Stichting Landelijk Fietsplatform",
    };
  }

  // Stichting RIONED — Gegevenswoordenboek Stedelijk Water
  if (source === "Stichting RIONED" || source.startsWith("Stichting RIONED")) {
    return {
      url: "https://www.riool.net/gwsw",
      label: "Stichting RIONED — GWSW",
    };
  }

  // PDOK AHN — actuele hoogtekaart
  if (source === "PDOK AHN") {
    return { url: "https://www.ahn.nl", label: "Actueel Hoogtebestand Nederland" };
  }

  // Telraam — citizen traffic counts
  if (source === "Telraam" || source.startsWith("Telraam")) {
    return { url: "https://telraam.net/nl", label: "Telraam" };
  }

  // RCE / Cultureelerfgoed
  if (source === "RCE" || source.startsWith("RCE ") || source.startsWith("RCE /")) {
    return {
      url: "https://www.cultureelerfgoed.nl/onderwerpen/erfgoed-vrijheid-vrede/handelsmissies",
      label: "Rijksdienst voor het Cultureel Erfgoed",
    };
  }

  // Gemeente Zwolle GIS family (incl. NDW/Enexis/EP-online variants)
  if (source.startsWith("Gemeente Zwolle GIS")) {
    return { url: "https://www.zwolle.nl/open-data", label: "Open Data Zwolle" };
  }

  // OVapi GTFS (national stop / route / trip feed)
  if (source === "OVapi GTFS") {
    return {
      url: "https://gtfs.ovapi.nl/nl/",
      label: "OVapi GTFS-feed",
    };
  }

  // Esri NL mirror van het BRON-bestand van Rijkswaterstaat
  if (source.startsWith("Esri NL") || source.includes("BRON")) {
    return {
      url: "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron/Documentatie/Handleiding%20product%20Bestand%20geRegistreerde%20Ongevallen%20Nederland.pdf",
      label: "BRON-handleiding (RWS)",
    };
  }

  // KRO-NCRV Pointer — burgermeldingen en onderzoeksjournalistiek
  if (source === "KRO-NCRV Pointer" || source.startsWith("KRO-NCRV")) {
    return {
      url: "https://pointer.kro-ncrv.nl",
      label: "Pointer (KRO-NCRV)",
    };
  }

  return null;
}
