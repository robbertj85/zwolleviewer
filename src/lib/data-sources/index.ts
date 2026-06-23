/**
 * Per-city data-source factory + metadata accessors.
 *
 * `buildDataSources(city)` returns a fresh array of `DataSource` for the
 * given city, composed of national, provincial and municipal layers.
 *
 * For UI/API code that previously relied on `DATA_SOURCES` and
 * `LAYER_METADATA` as static values, see the re-export shim in
 * `src/lib/data-sources.ts` which exposes `getDataSources(city)` /
 * `getLayerMetadata(city)`.
 */

import { getCity, type CityConfig } from "../cities";
import { buildNationalLayers } from "./national";
import { buildZwolleLayers } from "./cities/zwolle";
import { buildHelmondLayers } from "./cities/helmond";
import { buildApeldoornLayers } from "./cities/apeldoorn";
import { buildElburgLayers } from "./cities/elburg";
import { buildTilburgLayers } from "./cities/tilburg";
import { buildAmersfoortLayers } from "./cities/amersfoort";
import { buildRotterdamLayers } from "./cities/rotterdam";
import { buildAmsterdamLayers } from "./cities/amsterdam";
import { buildLochemLayers } from "./cities/lochem";
import { PROVINCIAL_BUILDERS } from "./provincial";
import { getFreshness } from "../freshness";
import type { DataSource, LayerMetadata } from "./types";

export type {
  DataSource,
  LayerMetadata,
  LayerCategory,
  ImageCategory,
  FreshnessMeta,
  UpdateFrequency,
} from "./types";
export { CATEGORIES, IMAGE_CATEGORIES } from "./types";

const SOURCE_URLS: Record<string, string> = {
  "Gemeente Zwolle GIS": "https://gisservices.zwolle.nl/ArcGIS/rest/services",
  "Gemeente Zwolle GIS (NDW)": "https://gisservices.zwolle.nl/ArcGIS/rest/services",
  "Gemeente Zwolle GIS (EP-online RVO)":
    "https://gisservices.zwolle.nl/ArcGIS/rest/services",
  "Gemeente Zwolle GIS / Enexis": "https://gisservices.zwolle.nl/ArcGIS/rest/services",
  PDOK: "https://www.pdok.nl",
  "PDOK (BGT)":
    "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
  "PDOK / CBS":
    "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart-2024",
  "PDOK / ProRail": "https://www.prorail.nl",
  "PDOK / Rijkswaterstaat": "https://www.rijkswaterstaat.nl",
  "PDOK / RWS (WKD)": "https://www.rijkswaterstaat.nl",
  "PDOK / RVO": "https://www.rvo.nl/onderwerpen/natura-2000",
  "PDOK / Kadaster": "https://www.kadaster.nl",
  "PDOK / BAG": "https://www.kadaster.nl/zakelijk/registraties/basisregistraties/bag",
  "PDOK / LVNL": "https://www.lvnl.nl",
  "PDOK / BRO": "https://www.broloket.nl",
  "RVO / BRO": "https://www.rvo.nl/onderwerpen/bodemenergie",
  "Bodemloket / bevoegd gezag": "https://www.bodemloket.nl",
  "PDOK / Waterschappen": "https://www.pdok.nl",
  "RIVM / Atlas Leefomgeving": "https://www.atlasleefomgeving.nl",
  "RIVM Atlas Leefomgeving": "https://www.atlasleefomgeving.nl",
  "BZK Leefbaarometer": "https://www.leefbaarometer.nl",
  "Stichting Landelijk Fietsplatform": "https://www.fietsplatform.nl",
  "Stichting RIONED": "https://www.riool.net/gwsw",
  "PDOK AHN": "https://www.ahn.nl",
  Telraam: "https://telraam.net/nl",
  "RCE / Cultureelerfgoed": "https://www.cultureelerfgoed.nl",
  "DSO / Omgevingsloket": "https://omgevingswet.overheid.nl",
  "Geoportaal Overijssel": "https://www.geodataoverijssel.nl",
  "Geoportaal Gelderland": "https://geoportaal.gelderland.nl",
  "Atlas Brabant": "https://atlas.brabant.nl",
  OpenStreetMap: "https://www.openstreetmap.org",
  NDW: "https://opendata.ndw.nu",
  "NDW (Open Charge Point Interface 2.2.1)": "https://opendata.ndw.nu",
  "NDW (DATEX II)": "https://opendata.ndw.nu",
  "NDW (DATEX II v3)": "https://opendata.ndw.nu",
  "NDW (WKD / DATEX II v3)": "https://opendata.ndw.nu",
  "NDW (RWS MSI)": "https://opendata.ndw.nu",
  "NDW Wegkenmerken (WKD)": "https://wegkenmerken.ndw.nu",
  "verkeerslichtenviewer.nl": "https://verkeerslichtenviewer.nl",
  "pakketpuntenviewer.nl": "https://pakketpuntenviewer.nl",
  "BCI Global / Laadkaart Bouw":
    "https://bciglobal.maps.arcgis.com/apps/instant/basic/index.html?appid=cdb5ce9509f24ee1838ab43ffd4c0e6c",
  "Gemeente Elburg GIS":
    "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
  "Open Data Helmond": "https://data-helmond.opendata.arcgis.com",
  "Staat van Apeldoorn": "https://staatvan-apeldoorn.opendata.arcgis.com",
  "OVapi GTFS": "https://gtfs.ovapi.nl/nl/",
  "Esri NL / Rijkswaterstaat (BRON)":
    "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
  "KRO-NCRV Pointer": "https://pointer.kro-ncrv.nl",
  "Gemeente Rotterdam GIS": "https://www.rotterdam.nl",
  "Esri NL / Gemeente Rotterdam": "https://services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Publieke_Laadpalen_Rotterdam",
  "Rotterdam Open Data": "https://data.rotterdam.nl",
  "Gemeente Amersfoort GIS": "https://amersfoort.maps.arcgis.com",
  "Provincie Utrecht GIS": "https://gis.provincie-utrecht.nl",
  "Datalab Gelderland Oost":
    "https://services-eu1.arcgis.com/VV2g0JnRRF5xL5uh/arcgis/rest/services",
  CirculusBeheer:
    "https://services-eu1.arcgis.com/7Hne9Ajbj36KaHMj/arcgis/rest/services",
  "Waterschap Rijn en IJssel via Datalab Gelderland Oost":
    "https://services-eu1.arcgis.com/VV2g0JnRRF5xL5uh/arcgis/rest/services",
};

const CITY_BUILDERS: Record<string, (city: CityConfig) => DataSource[]> = {
  zwolle: buildZwolleLayers,
  helmond: buildHelmondLayers,
  apeldoorn: buildApeldoornLayers,
  elburg: buildElburgLayers,
  amersfoort: buildAmersfoortLayers,
  rotterdam: buildRotterdamLayers,
  tilburg: buildTilburgLayers,
  amsterdam: buildAmsterdamLayers,
  lochem: buildLochemLayers,
};

export function buildDataSources(city: CityConfig): DataSource[] {
  const layers: DataSource[] = [];

  // National layers — work for any city
  layers.push(...buildNationalLayers(city));

  // Provincial layers — shared by all cities in the province
  const provBuilder = PROVINCIAL_BUILDERS[city.province];
  if (provBuilder) layers.push(...provBuilder(city));

  // City-specific layers
  const cityBuilder = CITY_BUILDERS[city.slug];
  if (cityBuilder) layers.push(...cityBuilder(city));

  // Annotate availability (default "live" — only stub modules emit "stub")
  // and auto-fill freshness from the per-source registry when a layer
  // doesn't declare it explicitly. Per-layer overrides win — this hook
  // only fills the gaps so newly-added layers get sane defaults for free.
  for (const l of layers) {
    if (!l.availability) l.availability = "live";
    if (!l.sourceUrl) l.sourceUrl = SOURCE_URLS[l.source];
    if (!l.freshness) l.freshness = getFreshness(l.source);
  }
  return layers;
}

export function getLayerMetadata(city: CityConfig): LayerMetadata[] {
  return buildDataSources(city).map(
    ({ id, name, description, source, sourceUrl, endpoint, category, icon, isNew, bog, accessType, availability, freshness }) => ({
      id,
      name,
      description,
      source,
      sourceUrl,
      endpoint,
      category,
      icon,
      isNew,
      bog,
      accessType,
      availability,
      freshness,
    })
  );
}

/** Helper for API routes that take a `?city=…` query parameter. */
export function buildDataSourcesForSlug(slug: string | null): DataSource[] {
  const city = (slug && getCity(slug)) || getCity("zwolle")!;
  return buildDataSources(city);
}

/**
 * Aggregate "baseline" catalog of every layer that any live city offers.
 * Used by the Dekking page to show users which layers other cities have
 * that the active city does not. Each entry is keyed by layer ID; if two
 * cities expose the same ID with different metadata, the first one wins
 * (deterministic — driven by city sort order in cities.ts).
 */
import { getLiveCities } from "../cities";

export interface BaselineLayerEntry extends LayerMetadata {
  /** The slug(s) of cities that expose this layer as live (not a stub). */
  liveInCities: string[];
}

let baselineCache: Map<string, BaselineLayerEntry> | null = null;

export function getBaselineCatalog(): Map<string, BaselineLayerEntry> {
  if (baselineCache) return baselineCache;
  const map = new Map<string, BaselineLayerEntry>();
  for (const city of getLiveCities()) {
    const layers = buildDataSources(city);
    for (const l of layers) {
      const isLive = (l.availability ?? "live") === "live";
      const existing = map.get(l.id);
      if (existing) {
        if (isLive) existing.liveInCities.push(city.slug);
        continue;
      }
      map.set(l.id, {
        id: l.id,
        name: l.name,
        description: l.description,
        source: l.source,
        sourceUrl: l.sourceUrl,
        endpoint: l.endpoint,
        category: l.category,
        icon: l.icon,
        isNew: l.isNew,
        bog: l.bog,
        accessType: l.accessType,
        availability: l.availability,
        freshness: l.freshness,
        liveInCities: isLive ? [city.slug] : [],
      });
    }
  }
  baselineCache = map;
  return map;
}
