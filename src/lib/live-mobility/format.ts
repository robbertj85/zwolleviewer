// Vendored from fleetsim (src/lib/national/format.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
/**
 * Binary formats for the Nederland 3D view.
 *
 * Shared by the import scripts (Node), the API routes (Node) and the browser
 * worker, so this module must stay dependency-free (no Buffer, no Prisma).
 * All multi-byte values are little endian and every array section is aligned
 * to 4 bytes so typed-array views can be created without copying.
 *
 * Trip record (GtfsTrip.traj)          8 + 16n bytes
 *   u32 shapeIdx | u32 n | f32 dist[n] | i32 arr[n] | i32 dep[n] | u32 stopIdx[n]
 *
 * Shape pack (shapes/NN.bin)           pack = shapeIdx % 64, slot = shapeIdx >> 6
 *   header 16 | u32 offsets[slots+1] | i32 Δcoords[2 * points] (µ°) | i32 Δcum[points] (dm)
 *   coords are relative to (COORD_BASE_LON, COORD_BASE_LAT); decoded to Float32 for the worker.
 *
 * Day index (days/YYYY-MM-DD.bin)      trips sorted by startSec, times relative to dayStart
 *   header 48 | i32 start[t] | i32 end[t] | u32 shape[t] | u32 stopsOffset[t]
 *   | u32 stopCount[t] | u32 routeIdx[t] | u32 mode[t]
 *   | f32 dist[s] | i32 arr[s] | i32 dep[s] | utf8 JSON string[] tripIds
 */

export const MODE = {
  BUS: 0,
  TRAM: 1,
  METRO: 2,
  RAIL: 3,
  FERRY: 4,
  CAR: 5,
  VAN: 6,
  TRUCK: 7,
  OTHER: 8,
} as const;

export type ModeId = (typeof MODE)[keyof typeof MODE];
export const MODE_COUNT = 9;
export const MODE_NAMES = ['bus', 'tram', 'metro', 'rail', 'ferry', 'car', 'van', 'truck', 'other'] as const;
export type ModeName = (typeof MODE_NAMES)[number];

export const SHAPE_PACKS = 64;
export const SHAPE_PACK_SHIFT = 6;
export const COORD_BASE_LON = 5;
export const COORD_BASE_LAT = 52;

const SHAPE_PACK_MAGIC = 0x50534c4e; // "NLSP"
const DAY_INDEX_MAGIC = 0x49444c4e; // "NLDI"
const FORMAT_VERSION = 1;
const SHAPE_PACK_VERSION = 2;
const SHAPE_PACK_HEADER = 16;
const DAY_INDEX_HEADER = 48;

/** Map a GTFS (basic or extended) route_type onto a render mode. */
export function modeFromRouteType(routeType: number): ModeId {
  if (routeType === 0 || routeType === 5 || (routeType >= 900 && routeType < 1000)) return MODE.TRAM;
  if (routeType === 1 || routeType === 12 || (routeType >= 400 && routeType < 500)) return MODE.METRO;
  if (routeType === 2 || routeType === 7 || (routeType >= 100 && routeType < 200) || routeType === 1400) return MODE.RAIL;
  if (routeType === 4 || (routeType >= 1000 && routeType < 1100) || routeType === 1200) return MODE.FERRY;
  if (routeType === 3 || routeType === 11 || (routeType >= 200 && routeType < 300) || (routeType >= 700 && routeType < 800)) return MODE.BUS;
  return MODE.OTHER;
}

export function shapePackOf(shapeIdx: number): number {
  return shapeIdx % SHAPE_PACKS;
}

export function shapeSlotOf(shapeIdx: number): number {
  return shapeIdx >>> SHAPE_PACK_SHIFT;
}

function pad4(n: number): number {
  return (n + 3) & ~3;
}

/** Copy a (possibly unaligned, possibly pooled) byte view into its own ArrayBuffer. */
export function toAlignedBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(pad4(bytes.byteLength));
  copy.set(bytes);
  return copy.buffer;
}

// ---------------------------------------------------------------------------
// Trip record
// ---------------------------------------------------------------------------

export interface TripRecord {
  shapeIdx: number;
  dist: Float32Array;
  arr: Int32Array;
  dep: Int32Array;
  stopIdx: Uint32Array;
}

export function encodeTripRecord(rec: {
  shapeIdx: number;
  dist: ArrayLike<number>;
  arr: ArrayLike<number>;
  dep: ArrayLike<number>;
  stopIdx: ArrayLike<number>;
}): Uint8Array {
  const n = rec.dist.length;
  const buf = new ArrayBuffer(8 + 16 * n);
  const view = new DataView(buf);
  view.setUint32(0, rec.shapeIdx, true);
  view.setUint32(4, n, true);
  new Float32Array(buf, 8, n).set(rec.dist);
  new Int32Array(buf, 8 + 4 * n, n).set(rec.arr);
  new Int32Array(buf, 8 + 8 * n, n).set(rec.dep);
  new Uint32Array(buf, 8 + 12 * n, n).set(rec.stopIdx);
  return new Uint8Array(buf);
}

export function decodeTripRecord(bytes: Uint8Array): TripRecord {
  const buf = toAlignedBuffer(bytes);
  const view = new DataView(buf);
  const shapeIdx = view.getUint32(0, true);
  const n = view.getUint32(4, true);
  if (8 + 16 * n > bytes.byteLength) throw new Error('Trip record truncated');
  return {
    shapeIdx,
    dist: new Float32Array(buf, 8, n),
    arr: new Int32Array(buf, 8 + 4 * n, n),
    dep: new Int32Array(buf, 8 + 8 * n, n),
    stopIdx: new Uint32Array(buf, 8 + 12 * n, n),
  };
}

// ---------------------------------------------------------------------------
// Shape pack
// ---------------------------------------------------------------------------

export interface ShapeInput {
  /** Absolute lon/lat interleaved. */
  coords: ArrayLike<number>;
  /** Cumulative distance in metres, one per point. */
  cum: ArrayLike<number>;
}

export interface ShapePack {
  pack: number;
  slotCount: number;
  /** offsets[slot]..offsets[slot+1] is the point range of that slot (empty when equal). */
  offsets: Uint32Array;
  /** Relative lon/lat interleaved; add COORD_BASE_LON / COORD_BASE_LAT. */
  coords: Float32Array;
  cum: Float32Array;
  /** [west, south, east, north] per slot in relative coordinates; empty slots are +/-Infinity. */
  bbox: Float32Array;
}

/**
 * Shape pack v2: coordinates as Int32 micro-degree deltas and cumulative distance as
 * Int32 decimetre deltas (both per slot, first value absolute). Small integers gzip
 * about 3x better than floats while keeping ~0.1 m precision. v1 packs (Float32)
 * are still decoded.
 */
export function encodeShapePack(pack: number, slots: Array<ShapeInput | null | undefined>): Uint8Array {
  const slotCount = slots.length;
  let points = 0;
  for (const s of slots) points += s ? s.cum.length : 0;
  const offsetsBytes = 4 * (slotCount + 1);
  const size = SHAPE_PACK_HEADER + offsetsBytes + 8 * points + 4 * points;
  const buf = new ArrayBuffer(size);
  const view = new DataView(buf);
  view.setUint32(0, SHAPE_PACK_MAGIC, true);
  view.setUint16(4, SHAPE_PACK_VERSION, true);
  view.setUint16(6, pack, true);
  view.setUint32(8, slotCount, true);
  view.setUint32(12, points, true);
  const offsets = new Uint32Array(buf, SHAPE_PACK_HEADER, slotCount + 1);
  const coords = new Int32Array(buf, SHAPE_PACK_HEADER + offsetsBytes, 2 * points);
  const cum = new Int32Array(buf, SHAPE_PACK_HEADER + offsetsBytes + 8 * points, points);
  let p = 0;
  for (let i = 0; i < slotCount; i++) {
    offsets[i] = p;
    const s = slots[i];
    if (!s) continue;
    const n = s.cum.length;
    let prevLon = 0, prevLat = 0, prevCum = 0;
    for (let k = 0; k < n; k++) {
      const lon = Math.round((s.coords[2 * k] - COORD_BASE_LON) * 1e6);
      const lat = Math.round((s.coords[2 * k + 1] - COORD_BASE_LAT) * 1e6);
      const dm = Math.round(s.cum[k] * 10);
      coords[2 * (p + k)] = lon - prevLon;
      coords[2 * (p + k) + 1] = lat - prevLat;
      cum[p + k] = dm - prevCum;
      prevLon = lon;
      prevLat = lat;
      prevCum = dm;
    }
    p += n;
  }
  offsets[slotCount] = p;
  return new Uint8Array(buf);
}

export function decodeShapePack(buffer: ArrayBuffer): ShapePack {
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== SHAPE_PACK_MAGIC) throw new Error('Not a shape pack');
  const version = view.getUint16(4, true);
  if (version !== 1 && version !== 2) throw new Error(`Unsupported shape pack version ${version}`);
  const pack = view.getUint16(6, true);
  const slotCount = view.getUint32(8, true);
  const points = view.getUint32(12, true);
  const offsetsBytes = 4 * (slotCount + 1);
  const offsets = new Uint32Array(buffer, SHAPE_PACK_HEADER, slotCount + 1);
  const bbox = new Float32Array(4 * slotCount);
  if (version === 1) {
    const coords = new Float32Array(buffer, SHAPE_PACK_HEADER + offsetsBytes, 2 * points);
    for (let i = 0; i < slotCount; i++) {
      let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
      for (let k = offsets[i]; k < offsets[i + 1]; k++) {
        const lon = coords[2 * k], lat = coords[2 * k + 1];
        if (lon < w) w = lon;
        if (lon > e) e = lon;
        if (lat < s) s = lat;
        if (lat > n) n = lat;
      }
      bbox[4 * i] = w; bbox[4 * i + 1] = s; bbox[4 * i + 2] = e; bbox[4 * i + 3] = n;
    }
    return {
      pack,
      slotCount,
      offsets,
      coords,
      cum: new Float32Array(buffer, SHAPE_PACK_HEADER + offsetsBytes + 8 * points, points),
      bbox,
    };
  }
  const dCoords = new Int32Array(buffer, SHAPE_PACK_HEADER + offsetsBytes, 2 * points);
  const dCum = new Int32Array(buffer, SHAPE_PACK_HEADER + offsetsBytes + 8 * points, points);
  const coords = new Float32Array(2 * points);
  const cum = new Float32Array(points);
  for (let i = 0; i < slotCount; i++) {
    let lon = 0, lat = 0, dm = 0;
    // The bounding box comes free with the delta decode; the worker culls trips with it.
    let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
    for (let k = offsets[i]; k < offsets[i + 1]; k++) {
      lon += dCoords[2 * k];
      lat += dCoords[2 * k + 1];
      dm += dCum[k];
      const flon = lon / 1e6;
      const flat = lat / 1e6;
      coords[2 * k] = flon;
      coords[2 * k + 1] = flat;
      cum[k] = dm / 10;
      if (flon < w) w = flon;
      if (flon > e) e = flon;
      if (flat < s) s = flat;
      if (flat > n) n = flat;
    }
    bbox[4 * i] = w; bbox[4 * i + 1] = s; bbox[4 * i + 2] = e; bbox[4 * i + 3] = n;
  }
  return { pack, slotCount, offsets, coords, cum, bbox };
}

// ---------------------------------------------------------------------------
// Day index
// ---------------------------------------------------------------------------

export interface DayIndexTripInput {
  tripId: string;
  routeIdx: number;
  mode: number;
  shapeIdx: number;
  /** Seconds relative to the index's dayStart. */
  arr: ArrayLike<number>;
  dep: ArrayLike<number>;
  dist: ArrayLike<number>;
}

export interface DayIndex {
  /** Unix seconds of the service day start (local noon minus 12 hours). */
  dayStart: number;
  /** Service date as YYYYMMDD. */
  date: number;
  tripCount: number;
  stopTotal: number;
  /** Longest trip duration in seconds; bounds the active-trip search window. */
  maxDuration: number;
  start: Int32Array;
  end: Int32Array;
  shape: Uint32Array;
  stopsOffset: Uint32Array;
  stopCount: Uint32Array;
  routeIdx: Uint32Array;
  mode: Uint32Array;
  dist: Float32Array;
  arr: Int32Array;
  dep: Int32Array;
  tripIds: string[];
}

export function encodeDayIndex(dayStart: number, date: number, trips: DayIndexTripInput[]): Uint8Array {
  const sorted = trips.slice().sort((a, b) => a.dep[0] - b.dep[0]);
  const t = sorted.length;
  let s = 0;
  let maxDuration = 0;
  for (const trip of sorted) {
    s += trip.arr.length;
    const n = trip.arr.length;
    maxDuration = Math.max(maxDuration, trip.arr[n - 1] - trip.dep[0]);
  }
  const strings = new TextEncoder().encode(JSON.stringify(sorted.map(x => x.tripId)));
  const size = DAY_INDEX_HEADER + 28 * t + 12 * s + pad4(strings.byteLength);
  const buf = new ArrayBuffer(size);
  const view = new DataView(buf);
  view.setUint32(0, DAY_INDEX_MAGIC, true);
  view.setUint16(4, FORMAT_VERSION, true);
  view.setUint32(8, t, true);
  view.setUint32(12, s, true);
  view.setFloat64(16, dayStart, true);
  view.setUint32(24, maxDuration, true);
  view.setUint32(28, strings.byteLength, true);
  view.setUint32(32, date, true);

  let o = DAY_INDEX_HEADER;
  const start = new Int32Array(buf, o, t); o += 4 * t;
  const end = new Int32Array(buf, o, t); o += 4 * t;
  const shape = new Uint32Array(buf, o, t); o += 4 * t;
  const stopsOffset = new Uint32Array(buf, o, t); o += 4 * t;
  const stopCount = new Uint32Array(buf, o, t); o += 4 * t;
  const routeIdx = new Uint32Array(buf, o, t); o += 4 * t;
  const mode = new Uint32Array(buf, o, t); o += 4 * t;
  const dist = new Float32Array(buf, o, s); o += 4 * s;
  const arr = new Int32Array(buf, o, s); o += 4 * s;
  const dep = new Int32Array(buf, o, s); o += 4 * s;
  new Uint8Array(buf, o, strings.byteLength).set(strings);

  let so = 0;
  sorted.forEach((trip, i) => {
    const n = trip.arr.length;
    start[i] = trip.dep[0];
    end[i] = trip.arr[n - 1];
    shape[i] = trip.shapeIdx;
    stopsOffset[i] = so;
    stopCount[i] = n;
    routeIdx[i] = trip.routeIdx;
    mode[i] = trip.mode;
    for (let k = 0; k < n; k++) {
      dist[so + k] = trip.dist[k];
      arr[so + k] = trip.arr[k];
      dep[so + k] = trip.dep[k];
    }
    so += n;
  });
  return new Uint8Array(buf);
}

export function decodeDayIndex(buffer: ArrayBuffer): DayIndex {
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== DAY_INDEX_MAGIC) throw new Error('Not a day index');
  const version = view.getUint16(4, true);
  if (version !== FORMAT_VERSION) throw new Error(`Unsupported day index version ${version}`);
  const t = view.getUint32(8, true);
  const s = view.getUint32(12, true);
  const dayStart = view.getFloat64(16, true);
  const maxDuration = view.getUint32(24, true);
  const stringsLength = view.getUint32(28, true);
  const date = view.getUint32(32, true);
  let o = DAY_INDEX_HEADER;
  const start = new Int32Array(buffer, o, t); o += 4 * t;
  const end = new Int32Array(buffer, o, t); o += 4 * t;
  const shape = new Uint32Array(buffer, o, t); o += 4 * t;
  const stopsOffset = new Uint32Array(buffer, o, t); o += 4 * t;
  const stopCount = new Uint32Array(buffer, o, t); o += 4 * t;
  const routeIdx = new Uint32Array(buffer, o, t); o += 4 * t;
  const mode = new Uint32Array(buffer, o, t); o += 4 * t;
  const dist = new Float32Array(buffer, o, s); o += 4 * s;
  const arr = new Int32Array(buffer, o, s); o += 4 * s;
  const dep = new Int32Array(buffer, o, s); o += 4 * s;
  const tripIds = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, o, stringsLength))) as string[];
  return { dayStart, date, tripCount: t, stopTotal: s, maxDuration, start, end, shape, stopsOffset, stopCount, routeIdx, mode, dist, arr, dep, tripIds };
}
