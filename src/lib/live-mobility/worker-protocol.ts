// Vendored from fleetsim (src/lib/national/worker-protocol.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
/**
 * Message protocol between the Nederland 3D page and its trajectory worker.
 */

export type ColorMode = 'mode' | 'line' | 'speed' | 'delay';
/** all = everything; realtime = only trips with live GTFS-RT data; gps = only trips with a recent GPS fix. */
export type RealtimeFilter = 'all' | 'realtime' | 'gps';
export type Lod = 'dots' | 'models';

/** Where a drawn position comes from; reported for the selected vehicle. */
export const POSITION_SOURCE = {
  SCHEDULE: 0,
  DELAY: 1,
  GPS: 2,
  MODEL: 3,
  RECORDED: 4,
  FLEET: 5,
} as const;
export type PositionSource = (typeof POSITION_SOURCE)[keyof typeof POSITION_SOURCE];

export interface ClockState {
  /** Simulated unix ms at `wallMs`. */
  simMs: number;
  /** Date.now() at which simMs was valid. */
  wallMs: number;
  factor: number;
  paused: boolean;
}

export interface ViewportState {
  west: number;
  south: number;
  east: number;
  north: number;
  zoom: number;
}

export interface RealtimeTrip {
  /** Delay in seconds (positive = late). */
  d?: number;
  lat?: number;
  lng?: number;
  /** Unix seconds of the reported position. */
  ts?: number;
  /** 1 when the trip is cancelled. */
  c?: 1;
}

export interface RealtimeSnapshot {
  feedVersion: string;
  revision: number;
  feedTs: number;
  trips: Record<string, RealtimeTrip>;
}

export interface ReplaySourceSpec {
  id: string;
  name: string;
  /** URL of the binary index; shape packs are fetched from `${packBaseUrl}/${pack}`. */
  indexUrl: string;
  packBaseUrl: string;
  headers?: Record<string, string>;
  /** When true, the dataset loops over the day instead of playing once at its absolute time. */
  loopDaily?: boolean;
}

export interface LiveVehicle {
  id: string;
  lat: number;
  lng: number;
  heading?: number;
  speedKph?: number;
  /** Unix ms of the fix. */
  ts: number;
  mode: number;
  label?: string;
}

export interface FlowSectionsPayload {
  /** Flat lon,lat per section, offsets into coords by point. */
  coords: Float64Array;
  offsets: Uint32Array;
  /** Vehicles per hour per section per hour-of-day per class: [section*24*3]. */
  flows: Float32Array;
  /** Free-flow speed km/h per section. */
  speeds: Float32Array;
  /** Live speed multiplier per section (1 = free flow). */
  liveSpeedFactor?: Float32Array;
  /** Live flow multiplier per section. */
  liveFlowFactor?: Float32Array;
}

export interface WorkerOptions {
  enabledModes: number;
  colorMode: ColorMode;
  /** Zoom from which vehicles become 3D models. */
  modelZoom: number;
  /** RGB per routeIdx. */
  routeColors?: Uint8Array;
  live: boolean;
  /** Fraction of real traffic volume rendered by procedural flows (0-1). */
  trafficScale: number;
  realtimeFilter: RealtimeFilter;
}

export type ToWorker =
  /** stadstwin: `query` (e.g. `bbox=w,s,e,n`) is appended to every day-index and shape-pack URL. */
  | { type: 'init'; apiBase: string; feedVersion: string; feedStart: string; feedEnd: string; query?: string }
  | { type: 'clock'; clock: ClockState }
  | { type: 'viewport'; viewport: ViewportState }
  | { type: 'options'; options: Partial<WorkerOptions> }
  | { type: 'realtime'; snapshot: RealtimeSnapshot | null }
  | { type: 'select'; row: number | null }
  | { type: 'addReplay'; source: ReplaySourceSpec }
  | { type: 'removeReplay'; id: string }
  | { type: 'liveVehicles'; vehicles: LiveVehicle[] }
  | { type: 'flows'; payload: FlowSectionsPayload | null }
  /** Live NDW factors per corridor index (NaN where not measured). */
  | { type: 'flowLive'; speed: Float32Array | null; flow: Float32Array | null }
  /** Acknowledges the newest frame and hands the previous frame's buffers back for reuse. */
  | { type: 'frameAck'; recycle?: ArrayBuffer[] };

export interface FrameMessage {
  type: 'frame';
  lod: Lod;
  count: number;
  /**
   * lon, lat, alt per instance. Float32 keeps the buffers small and skips deck.gl's
   * double-precision split; in `models` frames the values are offsets from
   * (originLon, originLat) so centimetre precision survives at street zoom.
   */
  positions: Float32Array;
  /** Longitude/latitude the positions are relative to; 0 for absolute `dots` frames. */
  originLon: number;
  originLat: number;
  /** Compass heading in degrees per instance (0 = north, clockwise). */
  headings: Float32Array;
  /** deck.gl instance model matrices (12 floats each); only for `models` frames. */
  matrices: Float32Array | null;
  colors: Uint8Array;
  /** Encoded row: (sourceNo << 24) | index. */
  rows: Uint32Array;
  speeds: Float32Array;
  /** GTFS routeIdx per instance, 0xffffffff when not a GTFS vehicle. */
  routeIdx: Uint32Array;
  /** [start, count] per mode into the instance arrays. */
  modeRanges: Uint32Array;
  /** Vehicles active per mode (before culling, cars not expanded). */
  activeByMode: Uint32Array;
  simMs: number;
  selectedIndex: number;
  /** Speed of the selected vehicle in km/h, as drawn this frame. */
  selectedSpeedKph: number;
  /** POSITION_SOURCE value for the selected vehicle. */
  selectedSource: number;
  /** Age of the GPS fix behind the selected vehicle in seconds, -1 when not applicable. */
  selectedAgeSec: number;
  frameMs: number;
  /** Active timetable trips that currently have live GTFS-RT data (delay and/or GPS). */
  realtimeActive: number;
  /** Active trips whose position comes from a GPS fix of the last few minutes. */
  gpsActive: number;
}

export interface SelectionMessage {
  type: 'selection';
  row: number;
  kind: 'gtfs' | 'replay' | 'live' | 'flow';
  tripId?: string;
  sourceName?: string;
  routeIdx?: number;
  mode: number;
  /** Absolute lon/lat interleaved of the trip's shape (for the route line). */
  path?: Float64Array;
  /** Distances and times of stops relative to the trip's day start. */
  stops?: { dist: Float32Array; arr: Int32Array; dep: Int32Array };
  dayStartSec?: number;
  delaySec?: number;
  label?: string;
}

export interface StatusMessage {
  type: 'status';
  phase: 'idle' | 'loading-day' | 'ready' | 'error';
  date?: string;
  tripCount?: number;
  packsLoaded: number;
  packsTotal: number;
  /** Trips running at half past each local hour of the loaded service day (24 values). */
  hourly?: number[];
  message?: string;
  sources: Array<{ id: string; name: string; kind: string; ready: boolean; count: number; error?: string }>;
}

export type FromWorker = FrameMessage | SelectionMessage | StatusMessage;

export const SOURCE_GTFS = 0;
export const SOURCE_LIVE = 1;
export const SOURCE_FLOW = 2;
export const SOURCE_REPLAY_BASE = 8;

/** Absolute longitude of instance `i` (frame positions may be origin-relative). */
export const frameLon = (frame: FrameMessage, i: number) => frame.originLon + frame.positions[3 * i];
/** Absolute latitude of instance `i`. */
export const frameLat = (frame: FrameMessage, i: number) => frame.originLat + frame.positions[3 * i + 1];

/** The frame's transferable buffers, to hand back to the worker for reuse. */
export function frameBuffers(frame: FrameMessage): ArrayBuffer[] {
  const buffers = [
    frame.positions.buffer,
    frame.headings.buffer,
    frame.colors.buffer,
    frame.rows.buffer,
    frame.speeds.buffer,
    frame.routeIdx.buffer,
  ];
  if (frame.matrices) buffers.push(frame.matrices.buffer);
  return buffers.filter(b => b.byteLength > 0) as ArrayBuffer[];
}

export const encodeRow = (sourceNo: number, index: number) => ((sourceNo << 24) | (index & 0xffffff)) >>> 0;
export const rowSource = (row: number) => row >>> 24;
export const rowIndex = (row: number) => row & 0xffffff;
