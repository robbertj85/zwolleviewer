"use client";

import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { GeoJsonLayer, IconLayer, TextLayer, SolidPolygonLayer } from "@deck.gl/layers";
import { CollisionFilterExtension } from "@deck.gl/extensions";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type { Layer } from "@deck.gl/core";
import { LayerState } from "@/lib/use-layers";
import {
  generateMSIGroupSVG,
  svgToDataUrl,
  type MSIDisplayState,
} from "@/lib/msi-utils";
import { colorForValue } from "@/lib/color-buckets";
import { dequantizeGLTF } from "@/lib/gltf-dequantize";
import { patchMeshoptByteOffsets } from "@/lib/glb-meshopt-offsets";
import { sunPosition } from "@/lib/sun";
import { embedBuildingMetadata, type PdokBuildingMetadata } from "@/lib/pdok-3d-buildings";
import { recolorBuildings, type RGB } from "@/lib/gltf-recolor";
import { groundTileToZero, computeBuildingFootprints } from "@/lib/gltf-ground";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LIVE_MOBILITY_API, bboxParam } from "@/lib/live-mobility/config";
import { useLiveMobility, type LiveMobilityState } from "@/lib/live-mobility/use-live-mobility";
import { buildLiveLayers, buildTrail, LIVE_PICK_LAYER, modeLabel, type SelectedTrail } from "@/lib/live-mobility/layers";
import { frameBuffers, rowSource, SOURCE_FLOW, type FrameMessage } from "@/lib/live-mobility/worker-protocol";
import { MODE_COLORS } from "@/workers/live-mobility/palette";
import type { LiveTimetable } from "@/components/live-timetable";
import { MODE } from "@/lib/live-mobility/format";
import LiveMobilityLegend, { type LiveLegendSettings } from "@/components/live-mobility-legend";

interface BasemapDef {
  id: string;
  label: string;
  style: string | maplibregl.StyleSpecification;
}

function pdokWmtsStyle(
  service: "luchtfotorgb" | "luchtfotocir",
  identifier: string
): maplibregl.StyleSpecification {
  const sourceId = `pdok-${service}-${identifier}`;
  return {
    version: 8,
    sources: {
      [sourceId]: {
        type: "raster",
        tiles: [
          `https://service.pdok.nl/hwh/${service}/wmts/v1_0/${identifier}/EPSG:3857/{z}/{x}/{y}.jpeg`,
        ],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.pdok.nl">PDOK</a> / Beeldmateriaal Nederland',
      },
    },
    layers: [{ id: `${sourceId}-layer`, type: "raster" as const, source: sourceId }],
  };
}

export const BASEMAPS: BasemapDef[] = [
  {
    id: "dark",
    label: "Donker",
    style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  },
  {
    id: "light",
    label: "Licht",
    style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  },
  {
    id: "voyager",
    label: "Voyager",
    style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  },
  // ─── OpenFreeMap (OSM vector tiles) ────────────────────
  {
    id: "osm",
    label: "OpenFreeMap Liberty",
    style: "https://tiles.openfreemap.org/styles/liberty",
  },
  {
    id: "ofm-positron",
    label: "OpenFreeMap Positron",
    style: "https://tiles.openfreemap.org/styles/positron",
  },
  {
    id: "ofm-bright",
    label: "OpenFreeMap Bright",
    style: "https://tiles.openfreemap.org/styles/bright",
  },
  {
    id: "ofm-dark",
    label: "OpenFreeMap Donker",
    style: "https://tiles.openfreemap.org/styles/dark",
  },
  {
    id: "brt",
    label: "BRT Topografisch",
    style:
      "https://api.pdok.nl/kadaster/brt-achtergrondkaart/ogc/v1/styles/standaard__webmercatorquad?f=mapbox",
  },
  {
    id: "brt-dark",
    label: "BRT Donker",
    style:
      "https://api.pdok.nl/kadaster/brt-achtergrondkaart/ogc/v1/styles/darkmode__webmercatorquad?f=mapbox",
  },
  // ─── PDOK Luchtfoto — current ─────────────────────────
  {
    id: "satellite",
    label: "Luchtfoto Actueel 25cm (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "Actueel_ortho25"),
  },
  {
    id: "satellite-hr",
    label: "Luchtfoto Actueel 8cm HR (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "Actueel_orthoHR"),
  },
  // ─── PDOK Luchtfoto — multi-year archive ──────────────
  {
    id: "lufo-2026q",
    label: "Luchtfoto 2026 Quick (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2026_quickorthoHR"),
  },
  {
    id: "lufo-2025-hr",
    label: "Luchtfoto 2025 8cm HR (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2025_orthoHR"),
  },
  {
    id: "lufo-2025",
    label: "Luchtfoto 2025 25cm (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2025_ortho25"),
  },
  {
    id: "lufo-2024-hr",
    label: "Luchtfoto 2024 8cm HR (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2024_orthoHR"),
  },
  {
    id: "lufo-2024",
    label: "Luchtfoto 2024 25cm (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2024_ortho25"),
  },
  {
    id: "lufo-2023-hr",
    label: "Luchtfoto 2023 8cm HR (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2023_orthoHR"),
  },
  {
    id: "lufo-2023",
    label: "Luchtfoto 2023 25cm (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2023_ortho25"),
  },
  {
    id: "lufo-2022-hr",
    label: "Luchtfoto 2022 8cm HR (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2022_orthoHR"),
  },
  {
    id: "lufo-2022",
    label: "Luchtfoto 2022 25cm (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2022_ortho25"),
  },
  {
    id: "lufo-2021-hr",
    label: "Luchtfoto 2021 8cm HR (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2021_orthoHR"),
  },
  {
    id: "lufo-2020",
    label: "Luchtfoto 2020 25cm (PDOK)",
    style: pdokWmtsStyle("luchtfotorgb", "2020_ortho25"),
  },
  // ─── PDOK Luchtfoto — Infrarood (CIR) ─────────────────
  {
    id: "lufo-ir-actueel-hr",
    label: "Luchtfoto Actueel 8cm IR (PDOK)",
    style: pdokWmtsStyle("luchtfotocir", "Actueel_orthoHRIR"),
  },
  {
    id: "lufo-ir-2025-hr",
    label: "Luchtfoto 2025 8cm IR (PDOK)",
    style: pdokWmtsStyle("luchtfotocir", "2025_orthoHRIR"),
  },
  {
    id: "lufo-ir-2024",
    label: "Luchtfoto 2024 25cm IR (PDOK)",
    style: pdokWmtsStyle("luchtfotocir", "2024_ortho25IR"),
  },
];

export type BasemapId = string;

// PDOK 3D Basisvoorziening (Kadaster) — nationwide LoD 2.2 buildings as
// OGC 3D Tiles (CC BY 4.0). Streams on demand, so it works for every
// municipality without preprocessing.
const PDOK_3D_GEBOUWEN_TILESET =
  "https://api.pdok.nl/kadaster/3d-basisvoorziening/ogc/v1/collections/gebouwen/3dtiles/tileset.json";
const PDOK_3D_TERREIN_TILESET =
  "https://api.pdok.nl/kadaster/3d-basisvoorziening/ogc/v1/collections/terreinen/3dtiles/tileset.json";
// 3DBAG (TU Delft / 3DGI) — LoD 2.2 buildings from BAG + AHN, same Tyler
// glb layout as PDOK. `latest` follows each release (CC BY 4.0).
const DDDBAG_GEBOUWEN_TILESET =
  "https://data.3dbag.nl/latest/cesium3dtiles/lod22/tileset.json";

const BUILDING_TILESETS: Record<View3DSource, { url: string; attribution: string }> = {
  "3dbag": {
    url: DDDBAG_GEBOUWEN_TILESET,
    attribution: '&copy; <a href="https://3dbag.nl">3DBAG</a> by tudelft3d and 3DGI',
  },
  pdok: {
    url: PDOK_3D_GEBOUWEN_TILESET,
    attribution: '&copy; <a href="https://www.pdok.nl">Kadaster / PDOK</a> 3D Basisvoorziening',
  },
};

/**
 * "city" is the Stad 3D preset: OpenFreeMap basemap, 3DBAG, sky, steeper tilt.
 * "blokken" is the light variant (as in fleetsim's Nederland view): the same
 * basemap with its own OSM building blocks, lit by the current sun, no 3D Tiles.
 */
export type View3DMode = "off" | "buildings" | "twin" | "city" | "blokken";

/** 3D modes that stream 3D Tiles buildings. */
export function uses3DTiles(mode: View3DMode): boolean {
  return mode === "buildings" || mode === "twin" || mode === "city";
}
/** 3D presets with their own OpenFreeMap basemap, sky and steeper tilt. */
export function isScenePreset(mode: View3DMode): boolean {
  return mode === "city" || mode === "blokken";
}
export type View3DSource = "3dbag" | "pdok";
export type View3DColorMode = "standaard" | "bouwjaar" | "energielabel";

// Construction-year color ramp (upper bound exclusive per bucket).
const BOUWJAAR_BUCKETS: [number, RGB][] = [
  [1900, [106, 61, 154]],
  [1945, [227, 26, 28]],
  [1970, [255, 127, 0]],
  [1990, [255, 217, 47]],
  [2005, [166, 217, 106]],
  [2015, [51, 160, 44]],
];
const BOUWJAAR_NEWEST: RGB = [31, 120, 180];

function bouwjaarColor(year: number): RGB {
  for (const [end, color] of BOUWJAAR_BUCKETS) {
    if (year < end) return color;
  }
  return BOUWJAAR_NEWEST;
}

// Legend entries for the picker panel; kept in sync with the ramps above.
export const BOUWJAAR_LEGEND: { label: string; color: RGB }[] = [
  { label: "voor 1900", color: [106, 61, 154] },
  { label: "1900 – 1944", color: [227, 26, 28] },
  { label: "1945 – 1969", color: [255, 127, 0] },
  { label: "1970 – 1989", color: [255, 217, 47] },
  { label: "1990 – 2004", color: [166, 217, 106] },
  { label: "2005 – 2014", color: [51, 160, 44] },
  { label: "2015 en later", color: [31, 120, 180] },
  { label: "Onbekend", color: [236, 183, 169] },
];

export const ENERGY_LABEL_LEGEND: { label: string; color: RGB }[] = [
  { label: "A+ en beter", color: [28, 82, 2] },
  { label: "A", color: [38, 115, 0] },
  { label: "B", color: [111, 166, 0] },
  { label: "C", color: [230, 230, 0] },
  { label: "D", color: [230, 149, 0] },
  { label: "E", color: [255, 170, 0] },
  { label: "F", color: [255, 85, 0] },
  { label: "G", color: [255, 0, 0] },
  { label: "Geen label", color: [236, 183, 169] },
];

// Same palette as the 2D Energielabels layer legend.
const ENERGY_LABEL_COLORS: Record<string, RGB> = {
  "A+++++": [28, 82, 2],
  "A++++": [28, 82, 2],
  "A+++": [28, 82, 2],
  "A++": [28, 82, 2],
  "A+": [28, 82, 2],
  A: [38, 115, 0],
  B: [111, 166, 0],
  C: [230, 230, 0],
  D: [230, 149, 0],
  E: [255, 170, 0],
  F: [255, 85, 0],
  G: [255, 0, 0],
};

// PDOK glb tiles carry EXT_structural_metadata with BOOLEAN class properties,
// which loaders.gl 4.3 can't parse — skip the extension (we only visualize).
// Repair meshopt bufferView offsets in glb tiles before loaders.gl parses
// them (see glb-meshopt-offsets.ts); other requests pass through untouched.
async function fetch3DTile(url: string, options?: RequestInit): Promise<Response> {
  const response = await fetch(url, options);
  if (!response.ok || !url.split("?")[0].endsWith(".glb")) return response;
  // Decode per-building metadata into extras, then repair meshopt offsets.
  const patched = patchMeshoptByteOffsets(
    await embedBuildingMetadata(await response.arrayBuffer())
  );
  return new Response(patched, { status: 200, headers: response.headers });
}

const TILES_3D_LOAD_OPTIONS = {
  fetch: fetch3DTile,
  gltf: {
    excludeExtensions: {
      EXT_structural_metadata: false,
      EXT_feature_metadata: false,
      EXT_mesh_features: false,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onTile3DLoad(tileHeader: any) {
  if (tileHeader?.content?.gltf) {
    dequantizeGLTF(tileHeader.content.gltf);
    groundTileToZero(tileHeader.content);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onTileset3DLoad(tileset: any) {
  // The PDOK tilesets only carry content at leaf level, so when the default
  // 32 MB GPU budget overflows, the adaptive screen-space error coarsens the
  // traversal and whole areas render nothing. Give it room for a city view.
  tileset.options.maximumMemoryUsage = 512;
  tileset._cacheBytes = 512 * 1024 * 1024;
}

/** Map MSI display string from NDW data to our MSIDisplayState enum */
function mapMSIState(display: string): MSIDisplayState {
  switch (display) {
    case "speedlimit":
      return "speed_limit";
    case "lane_closed":
      return "lane_closed";
    case "lane_open":
      return "lane_open";
    case "restriction_end":
      return "restriction_end";
    case "blank":
      return "blank";
    default:
      return "unknown";
  }
}

/** Map speed (km/h) to a traffic-flow color: red → orange → yellow → green */
function speedToColor(speed: number | null): [number, number, number, number] {
  if (speed === null || speed <= 0) return [128, 128, 128, 180]; // gray — no data
  if (speed <= 20) return [180, 20, 20, 230]; // dark red — standstill
  if (speed <= 40) {
    const t = (speed - 20) / 20;
    return [
      Math.round(180 + t * 60),
      Math.round(20 + t * 100),
      20,
      230,
    ]; // red → orange
  }
  if (speed <= 60) {
    const t = (speed - 40) / 20;
    return [
      Math.round(240 - t * 20),
      Math.round(120 + t * 80),
      Math.round(20 + t * 10),
      220,
    ]; // orange → yellow
  }
  if (speed <= 80) {
    const t = (speed - 60) / 20;
    return [
      Math.round(220 - t * 180),
      Math.round(200 + t * 20),
      Math.round(30 + t * 50),
      220,
    ]; // yellow → green
  }
  // 80+ km/h: free flow green
  return [30, 200, 80, 220];
}

export interface FlyTarget {
  lng: number;
  lat: number;
  zoom: number;
}

/** Beschrijving van een WMS-bron zoals `DataSource.wms` die levert. */
type WmsSpec = NonNullable<LayerState["wms"]>;

/**
 * Bouwt de MapLibre raster-tile-URL voor een WMS-laag. MapLibre vult
 * `{bbox-epsg-3857}` per tegel in; alle BRO-services ondersteunen EPSG:3857
 * en `image/png` met transparantie.
 */
function wmsTileUrl(wms: WmsSpec): string {
  const version = wms.version ?? "1.3.0";
  // WMS 1.3.0 noemt de parameter CRS, 1.1.1 nog SRS.
  const crsParam = version === "1.3.0" ? "crs" : "srs";
  const params = [
    "service=WMS",
    `version=${version}`,
    "request=GetMap",
    `layers=${encodeURIComponent(wms.layers)}`,
    "styles=",
    `${crsParam}=EPSG:3857`,
    "bbox={bbox-epsg-3857}",
    "width=256",
    "height=256",
    "format=image/png",
    "transparent=true",
  ];
  return `${wms.url}?${params.join("&")}`;
}

/**
 * Bouwt een WMS GetFeatureInfo-URL voor één klikpositie. WMS werkt met
 * pixelcoördinaten binnen een bbox, dus we geven de huidige viewport-bbox en
 * canvasgrootte mee en daarbinnen het aangeklikte pixel.
 */
function wmsFeatureInfoUrl(
  wms: WmsSpec,
  map: maplibregl.Map,
  pixel: [number, number]
): string {
  const version = wms.version ?? "1.3.0";
  const is130 = version === "1.3.0";
  const bounds = map.getBounds();
  const sw = maplibregl.MercatorCoordinate.fromLngLat(bounds.getSouthWest());
  const ne = maplibregl.MercatorCoordinate.fromLngLat(bounds.getNorthEast());
  // MercatorCoordinate is genormaliseerd 0..1; terug naar EPSG:3857 meters.
  const S = 20037508.342789244;
  const toM = (v: number) => (v - 0.5) * 2 * S;
  const bbox = [toM(sw.x), -toM(sw.y), toM(ne.x), -toM(ne.y)].join(",");
  const canvas = map.getCanvas();
  const width = Math.round(canvas.clientWidth);
  const height = Math.round(canvas.clientHeight);
  const params = [
    "service=WMS",
    `version=${version}`,
    "request=GetFeatureInfo",
    `layers=${encodeURIComponent(wms.layers)}`,
    `query_layers=${encodeURIComponent(wms.layers)}`,
    "styles=",
    `${is130 ? "crs" : "srs"}=EPSG:3857`,
    `bbox=${bbox}`,
    `width=${width}`,
    `height=${height}`,
    "format=image/png",
    "info_format=application/json",
    "feature_count=5",
    `${is130 ? "i" : "x"}=${Math.round(pixel[0])}`,
    `${is130 ? "j" : "y"}=${Math.round(pixel[1])}`,
  ];
  return `${wms.url}?${params.join("&")}`;
}

interface MapViewProps {
  visibleLayers: LayerState[];
  basemapId: BasemapId;
  onFeatureClick?: (info: FeatureInfo | null) => void;
  flyTarget?: FlyTarget | null;
  /** [lng, lat] center of the city's footprint */
  initialCenter: [number, number];
  /** Map zoom level on first render */
  initialZoom: number;
  /** Global opacity multiplier for data layers (0..1). Default 1. */
  layerOpacity?: number;
  /**
   * 3D digital twin mode: "buildings" streams PDOK LoD 2.2 buildings on top
   * of the active basemap; "twin" additionally streams the 3D terrain tiles
   * (BGT surfaces) so the whole background is a 3D scene.
   */
  view3D?: View3DMode;
  /** Which 3D Tiles dataset supplies the buildings. */
  view3DSource?: View3DSource;
  /** Per-building color mode for the 3D buildings. */
  view3DColor?: View3DColorMode;
  /** BAG pand id -> energy label, required for the "energielabel" mode. */
  energyLabelsByPand?: Record<string, string> | null;
  /**
   * Show feature values as text labels: the coloring property (or name) next
   * to every data-layer feature, and bouwjaar / energielabel on 3D buildings.
   */
  showValues?: boolean;
  /** City bbox [w, s, e, n]; scopes the live mobility layers (fleetsim) to the region. */
  liveBbox?: [number, number, number, number];
  /** Layer of the feature shown in the side panel; closing it clears a selected live vehicle. */
  selectedLayerId?: string | null;
}

/** Basemaps on which the live vehicle dots get their night-time glow. */
const DARK_BASEMAPS = new Set(["dark", "brt-dark", "ofm-dark"]);

/** Mode of instance `i` of a live frame (frames are grouped per mode). */
function frameMode(frame: FrameMessage, i: number): number {
  for (let m = 0; m < frame.modeRanges.length / 2; m++) {
    const start = frame.modeRanges[2 * m];
    if (i >= start && i < start + frame.modeRanges[2 * m + 1]) return m;
  }
  return -1;
}

function modeCss(mode: number): string {
  const [r, g, b] = MODE_COLORS[mode] ?? [170, 170, 180];
  return `rgb(${r}, ${g}, ${b})`;
}

function formatDelay(delaySec: number | undefined): string {
  if (delaySec === undefined) return "Geen realtime-data (dienstregeling)";
  const min = Math.round(delaySec / 60);
  if (min === 0) return "Op tijd";
  return min > 0 ? `+${min} min` : `${-min} min te vroeg`;
}

interface TripDetails {
  headsign: string | null;
  shortName: string | null;
  route: { shortName: string | null; longName: string | null; color: string | null } | null;
  agency: { name: string } | null;
  stops: Array<{ name: string; platformCode: string | null; arrSec: number; depSec: number }>;
}

interface BuildingLabel {
  position: [number, number, number];
  year: number | null;
  id: string | null;
  /** Convex footprint hull in [lng, lat] */
  hull: [number, number][];
  /** Roof top height in meters above the basemap plane */
  top: number;
}

/** Ray-casting point-in-polygon test ([lng, lat]). */
function pointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > point[1] !== yj > point[1]) {
      const x = ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
      if (point[0] < x) inside = !inside;
    }
  }
  return inside;
}

// ~110 m grid cells for matching points to building footprints
const HIGHLIGHT_GRID_CELL = 0.001;

interface BuildingHighlight {
  polygon: [number, number][];
  elevation: number;
  color: [number, number, number, number];
}

// ─── Feature value labels ────────────────────────────────────────────
// One label per feature, showing the value that the layer is colored by
// (colorMap / bucket property), the speed for traffic layers, or a name.

/**
 * Sanitize a raw property value into label text. Rejects values that are
 * never informative on a map: coordinates (floats with many decimals),
 * URLs, GUID-ish ids, booleans, and very long strings.
 */
function sanitizeLabelValue(value: unknown): string | null {
  if (value == null || value === "" || typeof value === "boolean") return null;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    if (!Number.isInteger(value)) {
      const decimals = String(value).split(".")[1]?.length ?? 0;
      if (decimals >= 5) return null; // lon/lat/RD coordinate
      return value.toFixed(1);
    }
    return String(value);
  }
  const s = String(value).trim();
  if (!s || s.length > 48) return null;
  if (/^https?:/i.test(s)) return null;
  if (/^[0-9a-f][0-9a-f-]{19,}$/i.test(s)) return null; // GUID-ish
  return s;
}

// Keys that never make a good label, even when a priority pattern matches.
const LABEL_KEY_SKIP =
  /(^|_)(lat|lon|lng|latitude|longitude|x|y)(_|$)|coord|geometr|^shape|guid|globalid|objectid|^fid$|datum|date|tijd|time/i;

// Property-name patterns in priority order; first sane value wins.
const LABEL_KEY_PRIORITY: RegExp[] = [
  /^(naam|name|titel|title|label)$/i,
  /(naam|name|titel|title|label)/i,
  /(merk|brand|operator|exploitant|aanbieder|beheerder|eigenaar)/i,
  /(straatnaam|straat|adres|address)/i,
  /(type|soort|categorie|category|functie|klasse)/i,
  /(nummer|code|ident)/i,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function smartLabelFallback(props: any): string | null {
  if (!props) return null;
  const keys = Object.keys(props);
  for (const pattern of LABEL_KEY_PRIORITY) {
    for (const key of keys) {
      if (LABEL_KEY_SKIP.test(key) || !pattern.test(key)) continue;
      const v = sanitizeLabelValue(props[key]);
      if (v) return v;
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function featureLabelText(layer: LayerState, props: any): string | null {
  // 1) Curated label fields from the layer config
  if (layer.labelProperties?.length) {
    const parts = layer.labelProperties
      .map((p) => sanitizeLabelValue(props?.[p]))
      .filter((v): v is string => v != null);
    if (parts.length > 0) return parts.join(" · ");
  }
  // 2) The property the layer is colored by
  if (layer.colorMap) {
    const v = sanitizeLabelValue(props?.[layer.colorMap.property]);
    if (v) return v;
  } else if (layer.colorMode === "auto-bucket" && layer.bucketScale) {
    const v = sanitizeLabelValue(props?.[layer.bucketScale.property]);
    if (v) return v;
  }
  if (layer.renderAs === "speed-point") {
    const v = sanitizeLabelValue(props?.speed_kmh);
    return v ? `${v} km/h` : null;
  }
  // 3) Best-effort name/brand/type heuristic
  return smartLabelFallback(props);
}

/** Cheap label anchor for any GeoJSON geometry (centroid-ish). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function featureLabelAnchor(geometry: any): [number, number] | null {
  const type = geometry?.type;
  const coords = geometry?.coordinates;
  if (!type || !coords) return null;
  switch (type) {
    case "Point":
      return [coords[0], coords[1]];
    case "MultiPoint":
      return coords[0] ?? null;
    case "LineString":
      return coords[Math.floor(coords.length / 2)] ?? null;
    case "MultiLineString": {
      const line = coords[0];
      return line?.[Math.floor(line.length / 2)] ?? null;
    }
    case "Polygon":
    case "MultiPolygon": {
      const ring = type === "Polygon" ? coords[0] : coords[0]?.[0];
      if (!ring?.length) return null;
      let x = 0;
      let y = 0;
      for (const c of ring) {
        x += c[0];
        y += c[1];
      }
      return [x / ring.length, y / ring.length];
    }
    default:
      return null;
  }
}

const VALUE_LABEL_STYLE = {
  getColor: [255, 255, 255, 255] as [number, number, number, number],
  outlineWidth: 5,
  outlineColor: [0, 0, 0, 220] as [number, number, number, number],
  fontSettings: { sdf: true },
  billboard: true,
  characterSet: "auto" as const,
  extensions: [new CollisionFilterExtension()],
  collisionTestProps: { sizeScale: 2.5 },
};

export interface FeatureInfo {
  layerId: string;
  layerName: string;
  properties: Record<string, unknown>;
  coordinates: [number, number];
  /** Stop list of a selected live OV vehicle, shown below the properties. */
  timetable?: LiveTimetable;
}

// Sky + horizon fog for the Stad 3D preset (fog only affects MapLibre layers).
const CITY_SKY_LIGHT: maplibregl.SkySpecification = {
  "sky-color": "#8fc1ec",
  "horizon-color": "#e6edf2",
  "fog-color": "#e6edf2",
  "sky-horizon-blend": 0.6,
  "horizon-fog-blend": 0.7,
  "fog-ground-blend": 0.6,
  "atmosphere-blend": 0,
};
const CITY_SKY_DARK: maplibregl.SkySpecification = {
  "sky-color": "#0b1424",
  "horizon-color": "#1e2a3c",
  "fog-color": "#161f2d",
  "sky-horizon-blend": 0.6,
  "horizon-fog-blend": 0.7,
  "fog-ground-blend": 0.6,
  "atmosphere-blend": 0,
};
const CITY_MAX_PITCH = 75;
const DEFAULT_MAX_PITCH = 60;
const SCENE_ATTRIBUTION_ID = "scene-3d-attribution";
const BLOKKEN_LAYER_ID = "scene-3d-blokken";
// MapLibre's default light, restored when leaving the blokken preset.
const DEFAULT_LIGHT: maplibregl.LightSpecification = {
  anchor: "viewport",
  position: [1.15, 210, 30],
  color: "#ffffff",
  intensity: 0.5,
};

/**
 * Light the building blocks from where the sun is now (after fleetsim's
 * Nederland basemap); at night a soft light from straight above.
 */
function sunLight(dark: boolean): maplibregl.LightSpecification {
  const sun = sunPosition(Date.now());
  const up = sun.elevationDeg > 0;
  const polar = up ? Math.max(15, Math.min(80, 90 - sun.elevationDeg)) : 20;
  return {
    anchor: "map",
    position: [1.4, up ? sun.azimuthDeg : 0, polar],
    color: up ? (sun.elevationDeg < 12 ? "#ffd9a8" : "#fff6e8") : "#aab8d8",
    intensity: up && !dark ? 0.45 : 0.4,
  };
}

/**
 * Building blocks for the blokken preset, from the OpenMapTiles `building`
 * layer every OpenFreeMap style carries.
 */
function blokkenLayer(source: string, dark: boolean): maplibregl.FillExtrusionLayerSpecification {
  return {
    id: BLOKKEN_LAYER_ID,
    type: "fill-extrusion",
    source,
    "source-layer": "building",
    minzoom: 13,
    paint: {
      "fill-extrusion-color": dark ? "#66728a" : "#dcd5ca",
      "fill-extrusion-height": ["coalesce", ["get", "render_height"], 6],
      "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
      "fill-extrusion-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 14.5, 0.94],
      "fill-extrusion-vertical-gradient": true,
    },
  };
}

/**
 * Basemap side of the 3D scene; setStyle drops all of it, so this runs on
 * every style load as well as on 3D changes.
 * - Hides the style's own (OSM) building extrusions whenever 3D is on:
 *   under 3D tiles they would double up, and blokken draws its own.
 * - Adds the lit building blocks for the blokken preset.
 * - Sets the preset sky.
 * - Credits the building dataset: an empty source carrying the attribution
 *   plus a layer that marks it used, so the attribution control lists it.
 */
function applyScene3D(
  map: maplibregl.Map,
  view3D: View3DMode,
  source: View3DSource,
  dark: boolean
) {
  const on = view3D !== "off";
  for (const layer of map.getStyle().layers) {
    if (
      layer.type === "fill-extrusion" &&
      layer.id !== SCENE_ATTRIBUTION_ID &&
      layer.id !== BLOKKEN_LAYER_ID
    ) {
      map.setLayoutProperty(layer.id, "visibility", on ? "none" : "visible");
    }
  }

  // Blokken: own lit extrusions when the style has OpenMapTiles buildings.
  if (map.getLayer(BLOKKEN_LAYER_ID)) map.removeLayer(BLOKKEN_LAYER_ID);
  const omtSource = Object.entries(map.getStyle().sources).find(
    ([id, src]) => src.type === "vector" && id === "openmaptiles"
  )?.[0];
  if (view3D === "blokken" && omtSource) {
    // Below the first label layer, so street and place names stay on top.
    const firstSymbol = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
    map.addLayer(blokkenLayer(omtSource, dark), firstSymbol);
  }
  map.setLight(view3D === "blokken" ? sunLight(dark) : DEFAULT_LIGHT);

  // Style.setSky accepts undefined (back to the spec defaults); Map's typing doesn't.
  map.setSky(
    (isScenePreset(view3D) ? (dark ? CITY_SKY_DARK : CITY_SKY_LIGHT) : undefined) as maplibregl.SkySpecification
  );

  const attribution = uses3DTiles(view3D) ? BUILDING_TILESETS[source].attribution : null;
  const current = map.getSource(SCENE_ATTRIBUTION_ID) as
    | (maplibregl.GeoJSONSource & { attribution?: string })
    | undefined;
  if (current?.attribution === attribution) return;
  if (map.getLayer(SCENE_ATTRIBUTION_ID)) map.removeLayer(SCENE_ATTRIBUTION_ID);
  if (current) map.removeSource(SCENE_ATTRIBUTION_ID);
  if (!attribution) return;
  map.addSource(SCENE_ATTRIBUTION_ID, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
    attribution,
  });
  map.addLayer({ id: SCENE_ATTRIBUTION_ID, type: "circle", source: SCENE_ATTRIBUTION_ID });
}

export default function MapView({
  visibleLayers,
  basemapId,
  onFeatureClick,
  flyTarget,
  initialCenter,
  initialZoom,
  layerOpacity = 1,
  view3D = "off",
  view3DSource = "3dbag",
  view3DColor = "standaard",
  energyLabelsByPand = null,
  showValues = false,
  liveBbox,
  selectedLayerId = null,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef(visibleLayers);
  layersRef.current = visibleLayers;
  const clickRef = useRef(onFeatureClick);
  clickRef.current = onFeatureClick;
  const deckLayersRef = useRef<Layer[]>([]);

  // Per-tile building label anchors (for the value-on-building TextLayer).
  // Filled on tile load; the version counter triggers a layer rebuild.
  const buildingLabelsRef = useRef<Map<string, BuildingLabel[]>>(new Map());
  const [buildingLabelsVersion, setBuildingLabelsVersion] = useState(0);
  const onGebouwenTileUnload = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tileHeader: any) => {
      if (tileHeader?.id && buildingLabelsRef.current.delete(String(tileHeader.id))) {
        setBuildingLabelsVersion((v) => v + 1);
      }
    },
    []
  );

  // Recolor 3D buildings on tile load according to the active color mode.
  // The metadata comes from glTF extras planted by the fetch interceptor.
  const onGebouwenTileLoad = useMemo(() => {
    const mode = view3DColor;
    const labels = energyLabelsByPand;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tileHeader: any) => {
      const gltf = tileHeader?.content?.gltf;
      if (!gltf) return;
      dequantizeGLTF(gltf);
      groundTileToZero(tileHeader.content);
      const meta = gltf.extras?.pdokBuildings as PdokBuildingMetadata | undefined;
      if (!meta) return;

      // Collect label anchors + footprint hulls regardless of the active
      // color mode, so the values toggle and data-layer building highlights
      // work without reloading tiles.
      const origin = tileHeader.content?.cartographicOrigin;
      if (origin && tileHeader.id) {
        const footprints = computeBuildingFootprints(tileHeader.content);
        const mPerDegLat = 111320;
        const mPerDegLng = 111320 * Math.cos((origin[1] * Math.PI) / 180);
        const entries: BuildingLabel[] = [];
        for (let f = 0; f < footprints.length; f++) {
          const fp = footprints[f];
          if (!fp) continue;
          entries.push({
            position: [
              origin[0] + fp.anchor[0] / mPerDegLng,
              origin[1] + fp.anchor[1] / mPerDegLat,
              origin[2] + fp.anchor[2] + 1.5,
            ],
            year: meta.years?.[f] ?? null,
            id: meta.ids?.[f] ?? null,
            hull: fp.hull.map(([x, y]) => [
              origin[0] + x / mPerDegLng,
              origin[1] + y / mPerDegLat,
            ]),
            top: origin[2] + fp.anchor[2],
          });
        }
        buildingLabelsRef.current.set(String(tileHeader.id), entries);
        setBuildingLabelsVersion((v) => v + 1);
      }

      if (mode === "standaard") return;
      if (mode === "bouwjaar") {
        const years = meta.years ?? [];
        recolorBuildings(gltf, (f) => {
          const year = years[f];
          return year == null ? null : bouwjaarColor(year);
        });
      } else if (mode === "energielabel" && labels) {
        const ids = meta.ids ?? [];
        recolorBuildings(gltf, (f) => {
          const label = labels[ids[f]];
          return label ? (ENERGY_LABEL_COLORS[label] ?? null) : null;
        });
      }
    };
  }, [view3DColor, energyLabelsByPand]);

  // Match visible point features against 3D building footprints: a building
  // containing a data point gets a translucent extruded shell in that
  // layer's color, so the data shows on the 3D model instead of hiding
  // underneath it.
  const buildingHighlights = useMemo(() => {
    if (!uses3DTiles(view3D)) return [];
    const grid = new Map<string, BuildingLabel[]>();
    for (const entries of buildingLabelsRef.current.values()) {
      for (const e of entries) {
        if (e.hull.length < 3) continue;
        const key = `${Math.floor(e.position[0] / HIGHLIGHT_GRID_CELL)}:${Math.floor(e.position[1] / HIGHLIGHT_GRID_CELL)}`;
        let bucket = grid.get(key);
        if (!bucket) grid.set(key, (bucket = []));
        bucket.push(e);
      }
    }
    if (grid.size === 0) return [];

    const matches = new Map<BuildingLabel, [number, number, number, number]>();
    for (const layer of visibleLayers) {
      if (layer.vectorTile || !layer.data?.features) continue;
      for (const feature of layer.data.features) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geometry = (feature as any).geometry;
        if (geometry?.type !== "Point") continue;
        const p: [number, number] = [geometry.coordinates[0], geometry.coordinates[1]];
        const cx = Math.floor(p[0] / HIGHLIGHT_GRID_CELL);
        const cy = Math.floor(p[1] / HIGHLIGHT_GRID_CELL);
        outer: for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const bucket = grid.get(`${cx + dx}:${cy + dy}`);
            if (!bucket) continue;
            for (const building of bucket) {
              if (matches.has(building)) continue;
              if (pointInPolygon(p, building.hull)) {
                matches.set(building, layer.color);
                break outer;
              }
            }
          }
        }
      }
    }

    // Inflate the hull a little so the shell doesn't z-fight the walls.
    return [...matches.entries()].map(([building, color]): BuildingHighlight => {
      let cx = 0;
      let cy = 0;
      for (const [x, y] of building.hull) {
        cx += x;
        cy += y;
      }
      cx /= building.hull.length;
      cy /= building.hull.length;
      return {
        polygon: building.hull.map(
          ([x, y]): [number, number] => [cx + (x - cx) * 1.08, cy + (y - cy) * 1.08]
        ),
        elevation: building.top + 1.5,
        color,
      };
    });
    // buildingLabelsVersion is the change signal for buildingLabelsRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLayers, view3D, buildingLabelsVersion]);

  // Build deck.gl layers — MSI layers use IconLayer, others use GeoJsonLayer
  // Vector tile layers are handled separately via MapLibre native layers
  const deckLayers = useMemo(() => {
    const layers: Layer[] = [];
    // 3D digital twin background — rendered first so data layers draw on top
    // (with depth testing, so features behind buildings occlude naturally).
    if (uses3DTiles(view3D)) {
      if (view3D === "twin") {
        layers.push(
          new Tile3DLayer({
            id: "pdok-3d-terrein",
            data: PDOK_3D_TERREIN_TILESET,
            loadOptions: TILES_3D_LOAD_OPTIONS,
            onTileLoad: onTile3DLoad,
            onTilesetLoad: onTileset3DLoad,
            pickable: false,
          })
        );
      }
      // Coloring happens at tile load, so the layer id encodes the color
      // mode (and, for energy labels, data readiness) to force a reload
      // when it changes; tiles come back instantly from the HTTP cache.
      const colorKey =
        view3DColor === "energielabel" && !energyLabelsByPand
          ? "standaard"
          : view3DColor;
      layers.push(
        new Tile3DLayer({
          id: `3d-gebouwen-${view3DSource}-${colorKey}`,
          data: BUILDING_TILESETS[view3DSource].url,
          loadOptions: TILES_3D_LOAD_OPTIONS,
          onTileLoad: onGebouwenTileLoad,
          onTileUnload: onGebouwenTileUnload,
          onTilesetLoad: onTileset3DLoad,
          pickable: false,
        })
      );
      if (buildingHighlights.length > 0) {
        layers.push(
          new SolidPolygonLayer<BuildingHighlight>({
            id: "pdok-3d-building-highlights",
            data: buildingHighlights,
            extruded: true,
            getPolygon: (d) => d.polygon,
            getElevation: (d) => d.elevation,
            getFillColor: (d) =>
              [d.color[0], d.color[1], d.color[2], 130] as [number, number, number, number],
            pickable: false,
          })
        );
      }
    }
    for (const layer of visibleLayers) {
      // Skip vector tile layers — rendered natively by MapLibre
      if (layer.vectorTile) continue;
      if (layer.renderAs === "msi-icon") {
        // Generate SVG data-URL icons per feature based on MSI sign state
        const ICON_SCALE = 4;
        const BASE_SIGN = 22;
        const BASE_GAP = 2;
        const MAX_LANES = 5;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msiData = layer.data!.features.map((f: any) => {
          const props = f.properties ?? {};
          const lanes: { state: MSIDisplayState; speedLimit?: number }[] =
            (props.lanes ?? []).map(
              (l: { display: string; speedLimit?: number }) => ({
                state: mapMSIState(l.display),
                speedLimit: l.speedLimit,
              })
            );
          // If no lanes, show a single blank sign
          if (lanes.length === 0) {
            lanes.push({ state: "blank" });
          }

          const { svg, width, height } = generateMSIGroupSVG(
            { state: lanes[0].state, lanes },
            ICON_SCALE,
            MAX_LANES
          );
          const displayCount = Math.min(lanes.length, MAX_LANES);
          return {
            coordinates: f.geometry.coordinates,
            properties: props,
            icon: svgToDataUrl(svg),
            iconWidth: width,
            iconHeight: height,
            displayCount,
          };
        });

        layers.push(
          new IconLayer({
            id: layer.id,
            data: msiData,
            opacity: (layer.opacity ?? 1) * layerOpacity,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getPosition: (d: any) => d.coordinates,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getIcon: (d: any) => ({
              url: d.icon,
              width: d.iconWidth,
              height: d.iconHeight,
              anchorY: d.iconHeight / 2,
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getSize: (d: any) => {
              const baseH = 26;
              const count = d.displayCount;
              const aspect =
                (count * BASE_SIGN + (count - 1) * BASE_GAP + 4) / baseH;
              return 40 * aspect;
            },
            sizeUnits: "meters" as const,
            sizeMinPixels: 20,
            sizeMaxPixels: 200,
            pickable: true,
          })
        );
      } else if (layer.renderAs === "speed-point") {
        layers.push(
          new GeoJsonLayer({
            id: layer.id,
            data: layer.data!,
            opacity: (layer.opacity ?? 1) * layerOpacity,
            pickable: true,
            stroked: true,
            filled: true,
            pointType: "circle",
            lineWidthMinPixels: 1,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getLineColor: (f: any) => {
              const c = speedToColor(f.properties?.speed_kmh);
              return [c[0], c[1], c[2], 255] as [number, number, number, number];
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getFillColor: (f: any) => speedToColor(f.properties?.speed_kmh),
            getPointRadius: layer.radius ?? 5,
            pointRadiusMinPixels: 3,
            pointRadiusMaxPixels: 14,
          })
        );
      } else {
        // Color resolution priority:
        //   1) categorical colorMap (legend-defined, always wins)
        //   2) auto-bucket scale (numeric quantile coloring, when enabled)
        //   3) layer.color (single fallback)
        let colorAccessor:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          | ((f: any) => [number, number, number, number])
          | [number, number, number, number];
        if (layer.colorMap) {
          const cm = layer.colorMap;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          colorAccessor = (f: any) =>
            cm.values[f.properties?.[cm.property]] ?? cm.default;
        } else if (layer.colorMode === "auto-bucket" && layer.bucketScale) {
          const scale = layer.bucketScale;
          const fallback = layer.color;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          colorAccessor = (f: any) =>
            colorForValue(scale, f.properties?.[scale.property], fallback);
        } else {
          colorAccessor = layer.color;
        }
        // Trigger key — change whenever the resolved colour resolution
        // strategy changes, so deck.gl re-evaluates the accessor.
        const colorTrigger = layer.colorMap
          ? `cmap:${layer.colorMap.property}`
          : layer.colorMode === "auto-bucket" && layer.bucketScale
            ? `bucket:${layer.bucketScale.property}:${layer.bucketScale.colors.length}:${layer.bucketScale.boundaries[0]}:${layer.bucketScale.boundaries[layer.bucketScale.boundaries.length - 1]}`
            : `single:${layer.color.join(",")}`;
        layers.push(
          new GeoJsonLayer({
            id: layer.id,
            data: layer.data!,
            opacity: (layer.opacity ?? 1) * layerOpacity,
            pickable: true,
            stroked: layer.stroked ?? true,
            filled: layer.filled ?? true,
            extruded: layer.extruded ?? false,
            pointType: "circle",
            lineWidthMinPixels: layer.lineWidth ?? 1,
            getLineColor: colorAccessor,
            getFillColor: colorAccessor,
            getPointRadius: layer.radius ?? 4,
            pointRadiusMinPixels: layer.radius ?? 4,
            pointRadiusMaxPixels: (layer.radius ?? 4) * 3,
            getElevation: layer.getElevation ?? 0,
            updateTriggers: {
              getFillColor: colorTrigger,
              getLineColor: colorTrigger,
            },
          })
        );
      }

      // Value label next to every feature of this layer
      if (showValues && layer.data?.features && layer.renderAs !== "msi-icon") {
        const labelData: { position: [number, number]; text: string }[] = [];
        for (const f of layer.data.features) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const text = featureLabelText(layer, (f as any).properties);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const position = text ? featureLabelAnchor((f as any).geometry) : null;
          if (text && position) labelData.push({ position, text });
        }
        if (labelData.length > 0) {
          layers.push(
            new TextLayer({
              id: `${layer.id}-values`,
              data: labelData,
              getPosition: (d: { position: [number, number] }) => d.position,
              getText: (d: { text: string }) => d.text,
              getSize: 12,
              sizeUnits: "pixels" as const,
              getPixelOffset: [0, -12],
              ...VALUE_LABEL_STYLE,
            })
          );
        }
      }
    }
    // Value labels on top of the 3D buildings (drawn last, above data layers)
    if (uses3DTiles(view3D) && showValues && view3DColor !== "standaard") {
      const isYear = view3DColor === "bouwjaar";
      const data: BuildingLabel[] = [];
      for (const entries of buildingLabelsRef.current.values()) {
        for (const e of entries) {
          if (isYear ? e.year != null : e.id != null && energyLabelsByPand?.[e.id]) {
            data.push(e);
          }
        }
      }
      layers.push(
        new TextLayer({
          id: "pdok-3d-building-values",
          data,
          getPosition: (d: BuildingLabel) => d.position,
          getText: (d: BuildingLabel) =>
            isYear ? String(d.year) : energyLabelsByPand![d.id!],
          getSize: isYear ? 9 : 11,
          sizeUnits: "meters" as const,
          sizeMaxPixels: 14,
          getTextAnchor: "middle" as const,
          getAlignmentBaseline: "bottom" as const,
          updateTriggers: { getText: view3DColor },
          ...VALUE_LABEL_STYLE,
        })
      );
    }
    return layers;
    // buildingLabelsVersion is the change signal for the mutable
    // buildingLabelsRef store filled during tile loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visibleLayers,
    layerOpacity,
    view3D,
    view3DSource,
    view3DColor,
    energyLabelsByPand,
    onGebouwenTileLoad,
    onGebouwenTileUnload,
    showValues,
    buildingLabelsVersion,
    buildingHighlights,
  ]);
  deckLayersRef.current = deckLayers;

  // ─── Live mobility (fleetsim "Nederland in beweging") ─────────────────
  // Vehicles are computed in a worker and drawn as extra deck layers on top of
  // the memoised data layers, re-pushed on every worker frame.
  const ovLayer = visibleLayers.find((l) => l.live?.kind === "ov");
  const roadLayer = visibleLayers.find((l) => l.live?.kind === "wegverkeer");
  const [liveSettings, setLiveSettings] = useState<LiveLegendSettings>(() => ({
    hiddenModes: new Set<number>(),
    colorMode: "mode",
    realtimeOnly: false,
  }));
  const live = useLiveMobility({
    apiBase: LIVE_MOBILITY_API,
    bbox: liveBbox ? bboxParam(liveBbox) : "",
    ov: !!liveBbox && !!ovLayer,
    road: !!liveBbox && !!roadLayer,
    ...liveSettings,
  });
  const liveRef = useRef(live);
  liveRef.current = live;
  const liveFrameRef = useRef<FrameMessage | null>(null);
  const liveRenderedRef = useRef<FrameMessage | null>(null);
  const liveRafRef = useRef(0);
  const [liveCounts, setLiveCounts] = useState<Uint32Array | null>(null);
  const liveCountsAtRef = useRef(0);
  const liveStyleRef = useRef({ night: 0, opacity: 1 });
  liveStyleRef.current = {
    night: DARK_BASEMAPS.has(basemapId) ? 1 : /^(satellite|lufo)/.test(basemapId) ? 0.8 : 0,
    opacity: Math.max(ovLayer?.opacity ?? 0, roadLayer?.opacity ?? 0) * layerOpacity,
  };

  const liveTrail = useMemo<SelectedTrail | null>(() => {
    const sel = live.selection;
    if (!sel || sel.kind !== "gtfs") return null;
    const route = sel.routeIdx !== undefined ? live.routes[sel.routeIdx] : undefined;
    const c = MODE_COLORS[sel.mode] ?? [255, 201, 23, 255];
    return buildTrail(sel, route?.color ?? [c[0], c[1], c[2]]);
  }, [live.selection, live.routes]);
  const liveTrailRef = useRef(liveTrail);
  liveTrailRef.current = liveTrail;

  /** Push the data layers plus the current live layers to the overlay. */
  const pushLayers = useCallback(() => {
    liveRafRef.current = 0;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const lm = liveRef.current;
    const frame = lm.active ? liveFrameRef.current : null;
    const liveLayers = lm.active
      ? buildLiveLayers({
          frame,
          zoom: mapRef.current?.getZoom() ?? 12,
          ...liveStyleRef.current,
          selected: liveTrailRef.current,
        })
      : [];
    overlay.setProps({ layers: [...deckLayersRef.current, ...liveLayers] });
    const previous = liveRenderedRef.current;
    liveRenderedRef.current = frame;
    if (frame) {
      // The previous frame is no longer referenced by any layer: hand its buffers back to the worker.
      const recycle = previous && previous !== frame ? frameBuffers(previous) : [];
      lm.send({ type: "frameAck", recycle }, recycle);
    }
  }, []);

  const scheduleLive = useCallback(() => {
    if (!liveRafRef.current) liveRafRef.current = requestAnimationFrame(pushLayers);
  }, [pushLayers]);

  const { subscribeFrame } = live;
  useEffect(
    () =>
      subscribeFrame((frame) => {
        liveFrameRef.current = frame;
        // Legend counts: a React update per second is plenty.
        if (Date.now() - liveCountsAtRef.current > 1000) {
          liveCountsAtRef.current = Date.now();
          setLiveCounts(frame.activeByMode);
        }
        scheduleLive();
      }),
    [subscribeFrame, scheduleLive]
  );

  useEffect(() => {
    if (!live.active) {
      liveFrameRef.current = null;
      liveRenderedRef.current = null;
      setLiveCounts(null);
    } else {
      // Tell a fresh worker where the camera is (drives its frame rate).
      const map = mapRef.current;
      if (map) {
        const b = map.getBounds();
        live.setViewport({ west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth(), zoom: map.getZoom() });
      }
    }
    scheduleLive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live.active, scheduleLive]);

  useEffect(() => {
    scheduleLive();
  }, [liveTrail, basemapId, layerOpacity, ovLayer?.opacity, roadLayer?.opacity, scheduleLive]);

  useEffect(() => () => cancelAnimationFrame(liveRafRef.current), []);

  // Closing the side panel (or selecting another feature) drops the selected vehicle.
  const { select: selectLive } = live;
  const hasLiveSelection = live.selection !== null;
  useEffect(() => {
    if (hasLiveSelection && !selectedLayerId?.startsWith("live-")) selectLive(null);
  }, [selectedLayerId, hasLiveSelection, selectLive]);

  /** Vehicle clicked: show what we know right away, enrich with trip details once the worker selected it. */
  const pendingLiveClickRef = useRef<{ row: number; coordinates: [number, number]; base: Record<string, unknown> } | null>(null);
  const handleLivePick = useCallback((index: number, coordinates: [number, number]) => {
    const frame = liveRenderedRef.current;
    const lm = liveRef.current;
    if (!frame || index >= frame.count) return;
    const row = frame.rows[index];
    const mode = frameMode(frame, index);
    const speed = Math.round(frame.speeds[index]);
    if (rowSource(row) === SOURCE_FLOW) {
      pendingLiveClickRef.current = null;
      lm.select(null);
      clickRef.current?.({
        layerId: "live-wegverkeer",
        layerName: layersRef.current.find((l) => l.id === "live-wegverkeer")?.name ?? "Wegverkeer",
        properties: {
          Voertuigtype: modeLabel(mode),
          "Snelheid (km/u)": speed,
          Herkomst: "Gemodelleerd voertuig: INWEVA-uurtelling van dit wegvak, vertraagd met live NDW-snelheden",
        },
        coordinates,
      });
      return;
    }
    const route = lm.routes[frame.routeIdx[index]];
    const base: Record<string, unknown> = {
      Modaliteit: modeLabel(mode),
      Lijn: route?.shortName || route?.longName || null,
      Vervoerder: route?.agency ?? null,
      "Snelheid (km/u)": speed,
    };
    pendingLiveClickRef.current = { row, coordinates, base };
    lm.select(row);
    clickRef.current?.({
      layerId: "live-ov-voertuigen",
      layerName: layersRef.current.find((l) => l.id === "live-ov-voertuigen")?.name ?? "Live OV",
      properties: base,
      coordinates,
    });
  }, []);
  const handleLivePickRef = useRef(handleLivePick);
  handleLivePickRef.current = handleLivePick;

  useEffect(() => {
    const sel = live.selection;
    const pending = pendingLiveClickRef.current;
    if (!sel || !pending || sel.row !== pending.row || !sel.tripId) return;
    let cancelled = false;
    fetch(`${LIVE_MOBILITY_API}/trips/${encodeURIComponent(sel.tripId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (cancelled || pendingLiveClickRef.current !== pending) return;
        const trip = body?.data as TripDetails | undefined;
        const nowRel = Date.now() / 1000 - (sel.dayStartSec ?? 0) - (sel.delaySec ?? 0);
        const next = trip?.stops.find((s) => s.depSec > nowRel);
        clickRef.current?.({
          layerId: "live-ov-voertuigen",
          layerName: layersRef.current.find((l) => l.id === "live-ov-voertuigen")?.name ?? "Live OV",
          properties: {
            ...pending.base,
            Lijn: pending.base.Lijn ?? trip?.route?.shortName ?? trip?.shortName ?? null,
            Richting: trip?.headsign ?? trip?.stops.at(-1)?.name ?? null,
            Vervoerder: pending.base.Vervoerder ?? trip?.agency?.name ?? null,
            Vertraging: formatDelay(sel.delaySec),
            "Volgende halte": next?.name ?? null,
            Eindhalte: trip?.stops.at(-1)?.name ?? null,
            Rit: sel.tripId,
          },
          coordinates: pending.coordinates,
          timetable:
            trip && trip.stops.length > 0 && sel.dayStartSec !== undefined
              ? {
                  stops: trip.stops,
                  dayStartSec: sel.dayStartSec,
                  delaySec: sel.delaySec,
                  color: trip.route?.color ? `#${trip.route.color}` : modeCss(sel.mode),
                  isRail: sel.mode === MODE.RAIL,
                }
              : undefined,
        });
      })
      .catch(() => {
        /* keep the basic info already shown */
      });
    return () => {
      cancelled = true;
    };
  }, [live.selection]);

  /** Tooltip text for a hovered vehicle. */
  const liveHoverLabelRef = useRef((index: number): string | null => {
    const frame = liveRenderedRef.current;
    if (!frame || index >= frame.count) return null;
    const mode = frameMode(frame, index);
    if (rowSource(frame.rows[index]) === SOURCE_FLOW) return `${modeLabel(mode)} · ${Math.round(frame.speeds[index])} km/u`;
    const route = liveRef.current.routes[frame.routeIdx[index]];
    const line = route?.shortName || route?.longName;
    return line ? `${modeLabel(mode)} ${line}` : modeLabel(mode);
  });

  // Init map + overlay once (never re-created)
  useEffect(() => {
    if (!containerRef.current) return;

    const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? BASEMAPS[0];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: basemap.style,
      center: initialCenter,
      zoom: initialZoom,
      pitch: 0,
      bearing: 0,
      maxZoom: 19,
      minZoom: 10,
      attributionControl: { compact: true },
      scrollZoom: true,
      dragPan: true,
      dragRotate: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    // Fires for the first style and after every basemap switch.
    map.on("style.load", () => scene3DRef.current());

    map.on("load", () => {
      const overlay = new MapboxOverlay({
        interleaved: false,
        layers: deckLayersRef.current,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onHover: (info: any) => {
          const el = tooltipRef.current;
          if (!el) return;
          if (info.layer?.id === LIVE_PICK_LAYER && info.index >= 0) {
            const label = liveHoverLabelRef.current(info.index);
            if (label) {
              el.textContent = label;
              el.style.left = `${info.x + 12}px`;
              el.style.top = `${info.y - 12}px`;
              el.style.display = "block";
              return;
            }
          }
          if (info.object) {
            const props = info.object.properties || {};
            // Show speed info for traffic speed layer
            let label: string;
            if (props.speed_kmh !== undefined && props.speed_kmh !== null) {
              label = `${props.speed_kmh} km/h`;
              if (props.flow_veh_h != null) label += ` · ${props.flow_veh_h} voertuigen/u`;
            } else {
              const name =
                props.name ||
                props.naam ||
                props.STRAATNAAM ||
                props.NAAMNL ||
                props.identificatie ||
                props.OBJECTID ||
                props.id ||
                "";
              label = String(name) || "Feature";
            }
            el.textContent = label;
            el.style.left = `${info.x + 12}px`;
            el.style.top = `${info.y - 12}px`;
            el.style.display = "block";
          } else {
            // Check vector tile layers for hover
            const vtIds = Array.from(vtLayerIdsRef.current).filter((id) => map.getLayer(id));
            if (vtIds.length > 0 && info.pixel) {
              const vtFeatures = map.queryRenderedFeatures(
                [info.pixel[0], info.pixel[1]] as [number, number],
                { layers: vtIds }
              );
              if (vtFeatures.length > 0) {
                const props = vtFeatures[0].properties || {};
                const speed = props.speedLimit;
                const street = props.streetName || props.townName || "";
                el.textContent = speed
                  ? `${speed} km/h${street ? ` · ${street}` : ""}`
                  : String(street || "Feature");
                el.style.left = `${info.x + 12}px`;
                el.style.top = `${info.y - 12}px`;
                el.style.display = "block";
                return;
              }
            }
            el.style.display = "none";
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick: (info: any) => {
          if (info.layer?.id === LIVE_PICK_LAYER && info.index >= 0 && info.coordinate) {
            handleLivePickRef.current(info.index, info.coordinate as [number, number]);
            return;
          }
          if (info.object && info.coordinate) {
            const parentLayer = layersRef.current.find(
              (l) => l.id === info.layer?.id
            );
            clickRef.current?.({
              layerId: parentLayer?.id ?? (info.layer?.id as string) ?? "",
              layerName: parentLayer?.name ?? "Onbekend",
              properties: (info.object.properties ?? {}) as Record<
                string,
                unknown
              >,
              coordinates: info.coordinate as [number, number],
            });
          } else {
            // Check if a vector tile feature was clicked before dismissing
            const vtIds = Array.from(vtLayerIdsRef.current).filter((id) => map.getLayer(id));
            if (vtIds.length > 0 && info.pixel) {
              const vtFeatures = map.queryRenderedFeatures(
                [info.pixel[0], info.pixel[1]] as [number, number],
                { layers: vtIds }
              );
              if (vtFeatures.length > 0) {
                const f = vtFeatures[0];
                const parentLayer = layersRef.current.find((l) => l.id === f.layer.id);
                const lngLat = map.unproject([info.pixel[0], info.pixel[1]]);
                clickRef.current?.({
                  layerId: parentLayer?.id ?? f.layer.id,
                  layerName: parentLayer?.name ?? "Onbekend",
                  properties: (f.properties ?? {}) as Record<string, unknown>,
                  coordinates: [lngLat.lng, lngLat.lat],
                });
                return;
              }
            }

            // WMS-rasters dragen geen client-side features; vraag de service
            // via GetFeatureInfo. Async — daarom eerst het panel sluiten en
            // pas bijwerken zodra er een treffer binnenkomt.
            const wmsLayers = layersRef.current.filter(
              (l) => l.wms && (l.wms.queryable ?? true)
            );
            clickRef.current?.(null);
            if (wmsLayers.length > 0 && info.pixel) {
              const pixel: [number, number] = [info.pixel[0], info.pixel[1]];
              const lngLat = map.unproject(pixel);
              void (async () => {
                for (const layer of wmsLayers) {
                  try {
                    const res = await fetch(
                      wmsFeatureInfoUrl(layer.wms!, map, pixel)
                    );
                    if (!res.ok) continue;
                    const fc = await res.json();
                    const first = fc?.features?.[0];
                    if (!first) continue;
                    clickRef.current?.({
                      layerId: layer.id,
                      layerName: layer.name,
                      properties: (first.properties ?? {}) as Record<
                        string,
                        unknown
                      >,
                      coordinates: [lngLat.lng, lngLat.lat],
                    });
                    return;
                  } catch {
                    // Service onbereikbaar of geen JSON — volgende laag.
                  }
                }
              })();
            }
          }
        },
      });

      map.addControl(overlay);
      overlayRef.current = overlay;
    });

    // The live worker paces its frame rate on the zoom level.
    let lastViewportAt = 0;
    const sendViewport = () => {
      if (!liveRef.current.active) return;
      lastViewportAt = Date.now();
      const b = map.getBounds();
      liveRef.current.setViewport({ west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth(), zoom: map.getZoom() });
    };
    map.on("move", () => {
      if (Date.now() - lastViewportAt > 150) sendViewport();
    });
    map.on("moveend", sendViewport);

    mapRef.current = map;

    return () => {
      overlayRef.current = null;
      vtLayerIdsRef.current.clear();
      wmsLayerIdsRef.current.clear();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch basemap style without destroying the map
  const prevBasemapRef = useRef(basemapId);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || basemapId === prevBasemapRef.current) return;
    prevBasemapRef.current = basemapId;

    const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? BASEMAPS[0];

    // Clear tracked native layer IDs — setStyle removes all sources/layers
    vtLayerIdsRef.current.clear();
    wmsLayerIdsRef.current.clear();

    map.setStyle(basemap.style);

    // After the new style loads, re-add the native (non-deck.gl) layers
    map.once("style.load", () => {
      // WMS rasters first, so the vector tiles below land on top of them
      const wmsLayers = layersRef.current.filter((l) => l.wms);
      for (const layer of wmsLayers) {
        if (!map.getSource(layer.id)) {
          map.addSource(layer.id, {
            type: "raster",
            tiles: [wmsTileUrl(layer.wms!)],
            tileSize: 256,
            attribution: layer.source,
          });
        }
        if (!map.getLayer(layer.id)) {
          map.addLayer({
            id: layer.id,
            type: "raster",
            source: layer.id,
            paint: { "raster-opacity": layer.opacity * layerOpacity },
          });
          wmsLayerIdsRef.current.add(layer.id);
        }
      }

      const vtLayers = layersRef.current.filter((l) => l.vectorTile);
      for (const layer of vtLayers) {
        const vt = layer.vectorTile!;
        if (!map.getSource(layer.id)) {
          map.addSource(layer.id, {
            type: "vector",
            tiles: [window.location.origin + vt.tileUrl],
            minzoom: 4,
            maxzoom: 20,
          });
        }
        if (!map.getLayer(layer.id)) {
          map.addLayer({
            id: layer.id,
            type: vt.type,
            source: layer.id,
            "source-layer": vt.sourceLayer,
            paint: vt.paint as Record<string, unknown>,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
          vtLayerIdsRef.current.add(layer.id);
        }
      }
    });
    // `layerOpacity` wordt hier alleen als startwaarde gebruikt; het
    // opacity-effect hieronder corrigeert bij elke wijziging.
  }, [basemapId, layerOpacity]);

  // Sync deck layers (the live layers ride along, see pushLayers)
  useEffect(() => {
    pushLayers();
  }, [deckLayers, pushLayers]);

  // Basemap side of the 3D scene (see applyScene3D)
  const dark3D = DARK_BASEMAPS.has(basemapId);
  const scene3DRef = useRef(() => {});
  scene3DRef.current = () => {
    const map = mapRef.current;
    if (map) applyScene3D(map, view3D, view3DSource, dark3D);
  };
  useEffect(() => {
    try {
      scene3DRef.current();
    } catch {
      // Style still loading ("Style is not done loading"); the style.load
      // hook applies the scene once it is.
    }
  }, [view3D, view3DSource, dark3D]);
  // Let the sun move on while the blokken preset is open.
  useEffect(() => {
    if (view3D !== "blokken") return;
    const timer = setInterval(() => {
      mapRef.current?.setLight(sunLight(dark3D));
    }, 5 * 60_000);
    return () => clearInterval(timer);
  }, [view3D, dark3D]);

  // Tilt the camera when entering/leaving 3D mode; the Stad 3D preset
  // looks further towards the horizon.
  const prevView3DRef = useRef(view3D);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || view3D === prevView3DRef.current) return;
    const prev = prevView3DRef.current;
    prevView3DRef.current = view3D;
    if (isScenePreset(view3D)) {
      map.setMaxPitch(CITY_MAX_PITCH);
      if (!isScenePreset(prev)) map.easeTo({ pitch: 65, duration: 1200 });
    } else if (view3D === "off") {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else if (prev === "off" || isScenePreset(prev)) {
      map.easeTo({ pitch: 55, duration: prev === "off" ? 1200 : 600 });
    }
    // Lower the limit only once the camera is back under it.
    if (!isScenePreset(view3D) && isScenePreset(prev)) {
      map.once("moveend", () => {
        if (!isScenePreset(prevView3DRef.current)) map.setMaxPitch(DEFAULT_MAX_PITCH);
      });
    }
  }, [view3D]);

  // Manage MapLibre vector tile layers
  const vtLayerIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const wantedVt = visibleLayers.filter((l) => l.vectorTile);
    const wantedIds = new Set(wantedVt.map((l) => l.id));

    // Remove layers that are no longer visible
    for (const id of vtLayerIdsRef.current) {
      if (!wantedIds.has(id)) {
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(id)) map.removeSource(id);
        vtLayerIdsRef.current.delete(id);
      }
    }

    // Add or update layers
    for (const layer of wantedVt) {
      const vt = layer.vectorTile!;
      if (!map.getSource(layer.id)) {
        map.addSource(layer.id, {
          type: "vector",
          tiles: [window.location.origin + vt.tileUrl],
          minzoom: 4,
          maxzoom: 20,
        });
      }
      if (!map.getLayer(layer.id)) {
        map.addLayer({
          id: layer.id,
          type: vt.type,
          source: layer.id,
          "source-layer": vt.sourceLayer,
          paint: vt.paint as Record<string, unknown>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        vtLayerIdsRef.current.add(layer.id);
      }
    }
  }, [visibleLayers]);

  // Manage MapLibre WMS raster overlays. Same add/remove diff as the vector
  // tile effect above — WMS layers carry no client-side feature data, so the
  // map is the only place they exist.
  const wmsLayerIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const wantedWms = visibleLayers.filter((l) => l.wms);
    const wantedIds = new Set(wantedWms.map((l) => l.id));

    for (const id of wmsLayerIdsRef.current) {
      if (!wantedIds.has(id)) {
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(id)) map.removeSource(id);
        wmsLayerIdsRef.current.delete(id);
      }
    }

    for (const layer of wantedWms) {
      if (!map.getSource(layer.id)) {
        map.addSource(layer.id, {
          type: "raster",
          tiles: [wmsTileUrl(layer.wms!)],
          tileSize: 256,
          attribution: layer.source,
        });
      }
      if (!map.getLayer(layer.id)) {
        // Rasters zijn dekkende vlakken — onder de vector tile-lagen houden,
        // zodat lijnwerk zichtbaar blijft. Deck.gl tekent sowieso bovenop.
        const beforeId = Array.from(vtLayerIdsRef.current).find((id) =>
          map.getLayer(id)
        );
        map.addLayer(
          {
            id: layer.id,
            type: "raster",
            source: layer.id,
            paint: { "raster-opacity": layer.opacity * layerOpacity },
          },
          beforeId
        );
        wmsLayerIdsRef.current.add(layer.id);
      }
    }
  }, [visibleLayers, layerOpacity]);

  // Apply (per-layer × global) opacity to vector tile and WMS raster layers.
  // Deck.gl layers handle their own opacity via the constructor prop; native
  // MapLibre layers need paint properties.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const byId = new Map(visibleLayers.map((l) => [l.id, l] as const));
      const ids = [
        ...vtLayerIdsRef.current,
        ...wmsLayerIdsRef.current,
      ];
      for (const id of ids) {
        const lyr = map.getLayer(id);
        if (!lyr) continue;
        const t = lyr.type;
        const prop =
          t === "fill" ? "fill-opacity"
          : t === "line" ? "line-opacity"
          : t === "circle" ? "circle-opacity"
          : t === "symbol" ? "icon-opacity"
          : t === "raster" ? "raster-opacity"
          : null;
        if (!prop) continue;
        const perLayer = byId.get(id)?.opacity ?? 1;
        map.setPaintProperty(id, prop, perLayer * layerOpacity);
      }
    };
    if (map.isStyleLoaded()) apply();
    else map.once("style.load", apply);
  }, [layerOpacity, visibleLayers]);

  // Fly to target and show marker
  const markerRef = useRef<maplibregl.Marker | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove previous marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (!flyTarget) return;

    map.flyTo({
      center: [flyTarget.lng, flyTarget.lat],
      zoom: flyTarget.zoom,
      duration: 1500,
    });

    markerRef.current = new maplibregl.Marker({ color: "#3b82f6" })
      .setLngLat([flyTarget.lng, flyTarget.lat])
      .addTo(map);
  }, [flyTarget]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0" />
      {live.active && (
        <div className="absolute bottom-8 left-16 z-10">
          <LiveMobilityLegend
            ov={!!ovLayer}
            road={!!roadLayer}
            state={live as LiveMobilityState}
            counts={liveCounts}
            settings={liveSettings}
            onChange={setLiveSettings}
          />
        </div>
      )}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 hidden rounded-md bg-black/80 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm"
      />
    </div>
  );
}
