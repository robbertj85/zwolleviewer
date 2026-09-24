// Adapted from fleetsim (src/components/national/layers.ts and the trail
// builder in NationalMap.tsx). The stadstwin version draws vehicles as dots
// only; 3D vehicle models are a possible later step.

import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import type { Layer } from "@deck.gl/core";
import { MODE } from "./format";
import { haversineM } from "./trajectory-math";
import type { FrameMessage, SelectionMessage } from "./worker-protocol";

/** Layer ids whose picked index maps onto the frame's instance arrays. */
export const LIVE_PICK_LAYER = "live-mobility-dots";
export const LIVE_LAYER_PREFIX = "live-mobility-";

/** Additive blending for glows. */
const ADDITIVE = {
  blend: true,
  blendColorOperation: "add",
  blendColorSrcFactor: "src-alpha",
  blendColorDstFactor: "one",
  blendAlphaOperation: "add",
  blendAlphaSrcFactor: "one",
  blendAlphaDstFactor: "one",
  depthWriteEnabled: false,
  depthCompare: "always",
} as const;

export interface SelectedTrail {
  color: [number, number, number];
  /** Stable identities: deck.gl re-tessellates a path whenever its `data` changes. */
  pathData: Array<{ path: [number, number][] }>;
  trailData: Array<{ path: [number, number][]; timestamps: number[] }> | null;
  stops: Array<{ lon: number; lat: number }>;
  dayStartSec: number | null;
  delaySec: number;
}

/** Route line, timed trail and stop positions of a selected vehicle. */
export function buildTrail(sel: SelectionMessage, color: [number, number, number]): SelectedTrail | null {
  if (!sel.path || sel.path.length < 4) return null;
  const n = sel.path.length / 2;
  const path: [number, number][] = new Array(n);
  const cum = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    path[i] = [sel.path[2 * i], sel.path[2 * i + 1]];
    if (i > 0) cum[i] = cum[i - 1] + haversineM(path[i - 1][0], path[i - 1][1], path[i][0], path[i][1]);
  }
  const base = { color, pathData: [{ path }], dayStartSec: sel.dayStartSec ?? null, delaySec: sel.delaySec ?? 0 };
  if (!sel.stops || sel.stops.dist.length < 2) return { ...base, trailData: null, stops: [] };

  const { dist, arr, dep } = sel.stops;
  const m = dist.length;
  // Stop distances come from the feed; rescale onto the measured polyline length.
  const scale = dist[m - 1] > 0 ? cum[n - 1] / dist[m - 1] : 1;
  const timestamps = new Array<number>(n);
  let k = 0;
  for (let i = 0; i < n; i++) {
    const x = cum[i] / scale;
    while (k < m - 2 && dist[k + 1] < x) k++;
    const span = dist[k + 1] - dist[k];
    const f = span > 0 ? Math.min(1, Math.max(0, (x - dist[k]) / span)) : 0;
    timestamps[i] = dep[k] + f * (arr[k + 1] - dep[k]);
  }
  const stops: SelectedTrail["stops"] = [];
  let seg = 0;
  for (let s = 0; s < m; s++) {
    const x = dist[s] * scale;
    while (seg < n - 2 && cum[seg + 1] < x) seg++;
    const span = cum[seg + 1] - cum[seg];
    const f = span > 0 ? Math.min(1, Math.max(0, (x - cum[seg]) / span)) : 0;
    stops.push({
      lon: path[seg][0] + (path[seg + 1][0] - path[seg][0]) * f,
      lat: path[seg][1] + (path[seg + 1][1] - path[seg][1]) * f,
    });
  }
  return { ...base, trailData: [{ path, timestamps }], stops };
}

export interface LiveLayerContext {
  frame: FrameMessage | null;
  zoom: number;
  /** 0 on a light basemap … 1 on a dark one: drives glow strength and outlines. */
  night: number;
  opacity: number;
  selected: SelectedTrail | null;
}

export function buildLiveLayers(ctx: LiveLayerContext): Layer[] {
  const layers: Layer[] = [];
  const { frame, zoom, night, opacity } = ctx;
  const glow = 0.35 + 0.65 * night;

  if (ctx.selected) {
    const s = ctx.selected;
    layers.push(
      new PathLayer({
        id: `${LIVE_LAYER_PREFIX}route-glow`,
        data: s.pathData,
        getPath: (d: { path: [number, number][] }) => d.path,
        getColor: [...s.color, Math.round(40 + 60 * night)],
        getWidth: 12,
        widthUnits: "pixels",
        jointRounded: true,
        capRounded: true,
        parameters: ADDITIVE,
      }),
      new PathLayer({
        id: `${LIVE_LAYER_PREFIX}route`,
        data: s.pathData,
        getPath: (d: { path: [number, number][] }) => d.path,
        getColor: [...s.color, 230],
        getWidth: 3,
        widthUnits: "pixels",
        jointRounded: true,
        capRounded: true,
      })
    );
    if (s.trailData && s.dayStartSec !== null) {
      const simSec = (frame?.simMs ?? Date.now()) / 1000;
      const currentTime = simSec - s.dayStartSec - s.delaySec;
      layers.push(
        new TripsLayer({
          id: `${LIVE_LAYER_PREFIX}trail`,
          data: s.trailData,
          getPath: (d: { path: [number, number][] }) => d.path,
          getTimestamps: (d: { timestamps: number[] }) => d.timestamps,
          getColor: night > 0.5 ? [255, 255, 255] : [20, 24, 32],
          widthMinPixels: 5,
          trailLength: 600,
          fadeTrail: true,
          currentTime,
          capRounded: true,
          jointRounded: true,
        })
      );
    }
    if (s.stops.length) {
      layers.push(
        new ScatterplotLayer({
          id: `${LIVE_LAYER_PREFIX}stops`,
          data: s.stops,
          getPosition: (d: SelectedTrail["stops"][number]) => [d.lon, d.lat],
          getFillColor: [255, 255, 255, 255],
          getLineColor: [...s.color, 255],
          stroked: true,
          lineWidthMinPixels: 2,
          radiusMinPixels: 3.5,
          radiusMaxPixels: 6,
          getRadius: 15,
        })
      );
    }
  }

  if (!frame || frame.count === 0) return layers;
  const all = {
    length: frame.count,
    attributes: {
      getPosition: { value: frame.positions, size: 3 },
      getFillColor: { value: frame.colors, size: 4 },
    },
  };
  // Pixel sizes that grow gently with zoom: fine grain for a region, readable in a street.
  const dot = Math.max(2.2, Math.min(5, 2.2 + (zoom - 11) * 0.55));
  layers.push(
    new ScatterplotLayer({
      id: `${LIVE_LAYER_PREFIX}halo`,
      data: all,
      getRadius: dot * 2.4,
      radiusUnits: "pixels",
      opacity: 0.14 * glow * opacity,
      parameters: ADDITIVE,
      updateTriggers: { getRadius: [dot] },
    }),
    new ScatterplotLayer({
      id: LIVE_PICK_LAYER,
      data: all,
      getRadius: dot,
      radiusUnits: "pixels",
      opacity,
      // On a light basemap a thin dark rim keeps small dots visible.
      stroked: true,
      getLineColor: night > 0.5 ? [5, 8, 14, 140] : [20, 24, 32, 220],
      lineWidthUnits: "pixels",
      getLineWidth: 0.8,
      pickable: true,
      parameters: { depthCompare: "always" },
      updateTriggers: { getLineColor: [night > 0.5], getRadius: [dot] },
    })
  );

  // Ring around the selected vehicle.
  if (frame.selectedIndex >= 0) {
    const i = frame.selectedIndex;
    layers.push(
      new ScatterplotLayer({
        id: `${LIVE_LAYER_PREFIX}selected-ring`,
        data: [0],
        getPosition: () => [frame.originLon + frame.positions[3 * i], frame.originLat + frame.positions[3 * i + 1]],
        getRadius: dot + 5,
        radiusUnits: "pixels",
        filled: false,
        stroked: true,
        getLineColor: ctx.selected ? [...ctx.selected.color, 240] : [255, 201, 23, 240],
        lineWidthUnits: "pixels",
        getLineWidth: 2,
        updateTriggers: { getPosition: [frame.simMs] },
      })
    );
  }
  return layers;
}

/** Dutch labels per mode, in legend order. */
export const MODE_LABELS: Array<{ id: number; label: string; group: "ov" | "road" }> = [
  { id: MODE.RAIL, label: "Trein", group: "ov" },
  { id: MODE.METRO, label: "Metro", group: "ov" },
  { id: MODE.TRAM, label: "Tram", group: "ov" },
  { id: MODE.BUS, label: "Bus", group: "ov" },
  { id: MODE.FERRY, label: "Veerboot", group: "ov" },
  { id: MODE.CAR, label: "Personenauto", group: "road" },
  { id: MODE.VAN, label: "Bestel / middelzwaar", group: "road" },
  { id: MODE.TRUCK, label: "Vrachtwagen", group: "road" },
];

export function modeLabel(mode: number): string {
  return MODE_LABELS.find((m) => m.id === mode)?.label ?? "Voertuig";
}
