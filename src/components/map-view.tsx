"use client";

import { useMemo, useCallback, useRef, useEffect } from "react";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type { Layer } from "@deck.gl/core";
import { LayerState } from "@/lib/use-layers";
import {
  generateMSIGroupSVG,
  svgToDataUrl,
  type MSIDisplayState,
} from "@/lib/msi-utils";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface BasemapDef {
  id: string;
  label: string;
  style: string | maplibregl.StyleSpecification;
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
  {
    id: "osm",
    label: "OpenStreetMap",
    style: "https://tiles.openfreemap.org/styles/liberty",
  },
  {
    id: "satellite",
    label: "Satelliet (PDOK)",
    style: {
      version: 8,
      sources: {
        "pdok-luchtfoto": {
          type: "raster",
          tiles: [
            "https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg",
          ],
          tileSize: 256,
          attribution:
            '&copy; <a href="https://www.pdok.nl">PDOK</a> / Beeldmateriaal Nederland',
        },
      },
      layers: [
        {
          id: "pdok-luchtfoto-layer",
          type: "raster" as const,
          source: "pdok-luchtfoto",
        },
      ],
    },
  },
  {
    id: "satellite-hr",
    label: "Satelliet HR (PDOK)",
    style: {
      version: 8,
      sources: {
        "pdok-luchtfoto-hr": {
          type: "raster",
          tiles: [
            "https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:3857/{z}/{x}/{y}.jpeg",
          ],
          tileSize: 256,
          attribution:
            '&copy; <a href="https://www.pdok.nl">PDOK</a> / Beeldmateriaal Nederland',
        },
      },
      layers: [
        {
          id: "pdok-luchtfoto-hr-layer",
          type: "raster" as const,
          source: "pdok-luchtfoto-hr",
        },
      ],
    },
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
];

export type BasemapId = string;

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

const INITIAL_VIEW = {
  center: [6.0983, 52.5168] as [number, number],
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

interface MapViewProps {
  visibleLayers: LayerState[];
  basemapId: BasemapId;
  onFeatureClick?: (info: FeatureInfo | null) => void;
}

export interface FeatureInfo {
  layerName: string;
  properties: Record<string, unknown>;
  coordinates: [number, number];
}

export default function MapView({
  visibleLayers,
  basemapId,
  onFeatureClick,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef(visibleLayers);
  layersRef.current = visibleLayers;
  const clickRef = useRef(onFeatureClick);
  clickRef.current = onFeatureClick;

  // Build deck.gl layers — MSI layers use IconLayer, others use GeoJsonLayer
  const deckLayers = useMemo(() => {
    const layers: Layer[] = [];
    for (const layer of visibleLayers) {
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
        layers.push(
          new GeoJsonLayer({
            id: layer.id,
            data: layer.data!,
            pickable: true,
            stroked: layer.stroked ?? true,
            filled: layer.filled ?? true,
            extruded: layer.extruded ?? false,
            pointType: "circle",
            lineWidthMinPixels: layer.lineWidth ?? 1,
            getLineColor: layer.color,
            getFillColor: layer.color,
            getPointRadius: layer.radius ?? 4,
            pointRadiusMinPixels: layer.radius ?? 4,
            pointRadiusMaxPixels: (layer.radius ?? 4) * 3,
            getElevation: layer.getElevation ?? 0,
          })
        );
      }
    }
    return layers;
  }, [visibleLayers]);


  // Init map + overlay once
  useEffect(() => {
    if (!containerRef.current) return;

    const basemap = BASEMAPS.find((b) => b.id === basemapId) ?? BASEMAPS[0];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: basemap.style,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      pitch: INITIAL_VIEW.pitch,
      bearing: INITIAL_VIEW.bearing,
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

    map.on("load", () => {
      const overlay = new MapboxOverlay({
        interleaved: false,
        layers: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onHover: (info: any) => {
          const el = tooltipRef.current;
          if (!el) return;
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
            el.style.display = "none";
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick: (info: any) => {
          if (info.object && info.coordinate) {
            const parentLayer = layersRef.current.find(
              (l) => l.id === info.layer?.id
            );
            clickRef.current?.({
              layerName: parentLayer?.name ?? "Onbekend",
              properties: (info.object.properties ?? {}) as Record<
                string,
                unknown
              >,
              coordinates: info.coordinate as [number, number],
            });
          } else {
            clickRef.current?.(null);
          }
        },
      });

      map.addControl(overlay);
      overlayRef.current = overlay;
    });

    mapRef.current = map;

    return () => {
      overlayRef.current = null;
      map.remove();
    };
    // Only re-create on basemap change
  }, [basemapId]);

  // Sync deck layers
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setProps({ layers: deckLayers });
    }
  }, [deckLayers]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 hidden rounded-md bg-black/80 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm"
      />
    </div>
  );
}
