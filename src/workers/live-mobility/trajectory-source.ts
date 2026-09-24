// Vendored from fleetsim (src/workers/national/trajectory-source.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
import {
  COORD_BASE_LAT,
  COORD_BASE_LON,
  decodeDayIndex,
  decodeShapePack,
  MODE,
  SHAPE_PACK_SHIFT,
  SHAPE_PACKS,
  type DayIndex,
  type ShapePack,
} from '@/lib/live-mobility/format';
import { DEFAULT_RAMP_SEC, distanceAtTime, flatBearingDeg, pointAlongShape, projectOntoShape } from '@/lib/live-mobility/trajectory-math';
import { encodeRow, POSITION_SOURCE, type RealtimeSnapshot, type SelectionMessage, type WorkerOptions } from '@/lib/live-mobility/worker-protocol';
import type { FrameWriter } from './frame-writer';
import { delayColor, MODE_COLORS, speedColor } from './palette';

/** Number of instanced cars and their length (m) per mode when rendering models. */
const CARS: Record<number, [number, number]> = {
  [MODE.RAIL]: [5, 26.5],
  [MODE.METRO]: [4, 21],
  [MODE.TRAM]: [2, 16],
};

/** Rail shapes follow one centre line; spread trains over parallel tracks near stations. */
const TRACK_SPACING_M = 4.5;
const TRACK_SLOTS = 7;
const TRACK_FULL_WITHIN_M = 250;
const TRACK_FADE_M = 900;
const D2R = Math.PI / 180;

function trackSlot(i: number): number {
  let h = Math.imul(i ^ 0x5bd1e995, 0x27d4eb2d);
  h ^= h >>> 15;
  return ((h >>> 0) % TRACK_SLOTS) - (TRACK_SLOTS >> 1);
}

/** A GPS fix younger than this counts as a live position. */
const GPS_FRESH_SEC = 180;
const MAX_DELAY_SEC = 3600;
const MAX_EARLY_SEC = 600;
const REPORT_MAX_PERP_M = 250;
const REPORT_BLEND_MS = 2000;
const REPORT_FADE_START_S = 120;
const REPORT_FADE_SPAN_S = 300;

interface RtEntry {
  d: number;
  cancelled: boolean;
  lat?: number;
  lng?: number;
  ts?: number;
  offset: number | null;
  prevOffset: number;
  changedAt: number;
}

function lowerBound(a: Int32Array, v: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] < v) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(a: Int32Array, v: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] <= v) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * A set of timed trajectories (a GTFS day or a replay dataset) plus the shape
 * packs its trips reference. Computes instance positions for a moment in time.
 */
export class TrajectorySource {
  index: DayIndex | null = null;
  packs: Array<ShapePack | null> = new Array(SHAPE_PACKS).fill(null);
  packsLoaded = 0;
  label: string | null = null;
  error: string | null = null;
  private packState = new Uint8Array(SHAPE_PACKS); // 0 idle, 1 loading, 2 loaded, 3 failed
  private tripIdToIdx: Map<string, number> | null = null;
  private rt = new Map<number, RtEntry>();
  private rtSnapshot: RealtimeSnapshot | null = null;
  private readonly tmp4 = new Float64Array(4);
  private readonly tmp3 = new Float64Array(3);
  private readonly tmpA = new Float64Array(3);
  private readonly tmpB = new Float64Array(3);
  private readonly color = new Uint8Array(4);
  private inflight = 0;
  private queue: number[] = [];
  /** 99th percentile trip duration; the scan window for active trips. */
  private windowSec = 0;
  /** Trips longer than `windowSec`, scanned separately so one night train does not widen the window. */
  private longTrips = new Int32Array(0);
  /** stadstwin: shape packs referenced by at least one trip of the index. */
  private referencedPacks: number[] = [];
  /** Timetables get acceleration ramps between stops; measured GPS samples are interpolated linearly. */
  private readonly rampSec: number;

  constructor(
    readonly sourceNo: number,
    readonly id: string,
    readonly name: string,
    readonly kind: 'gtfs' | 'replay',
    private readonly packUrl: (pack: number) => string,
    private readonly headers: Record<string, string> = {},
    readonly loopDaily = false,
    private readonly onChange: () => void = () => undefined,
  ) {
    this.rampSec = kind === 'gtfs' ? DEFAULT_RAMP_SEC : 0;
  }

  async loadIndex(url: string, label: string): Promise<void> {
    const res = await fetch(url, { headers: this.headers });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        message = body?.error || message;
      } catch { /* binary or empty body */ }
      throw new Error(message);
    }
    this.index = decodeDayIndex(await res.arrayBuffer());
    this.computeWindow();
    this.label = label;
    this.tripIdToIdx = null;
    this.error = null;
    if (this.rtSnapshot) this.applyRealtime(this.rtSnapshot);
    this.onChange();
  }

  /**
   * A handful of very long trips (night trains, ferries) make `maxDuration` a
   * poor scan window: at 14.8 h every frame walks 25k trips to find 5k active
   * ones. Scan the 99th percentile window instead and keep the rest in a list.
   */
  private computeWindow() {
    const idx = this.index;
    const packs = new Set<number>();
    if (idx) for (let i = 0; i < idx.tripCount; i++) packs.add(idx.shape[i] % SHAPE_PACKS);
    this.referencedPacks = [...packs].sort((a, b) => a - b);
    if (!idx || !idx.tripCount) {
      this.windowSec = 0;
      this.longTrips = new Int32Array(0);
      return;
    }
    const durations = new Int32Array(idx.tripCount);
    for (let i = 0; i < idx.tripCount; i++) durations[i] = idx.end[i] - idx.start[i];
    const sorted = durations.slice().sort();
    this.windowSec = sorted[Math.min(idx.tripCount - 1, Math.floor(idx.tripCount * 0.99))];
    let long = 0;
    for (let i = 0; i < idx.tripCount; i++) if (durations[i] > this.windowSec) long++;
    this.longTrips = new Int32Array(long);
    let k = 0;
    for (let i = 0; i < idx.tripCount; i++) if (durations[i] > this.windowSec) this.longTrips[k++] = i;
  }

  /** Queue the packs needed around time t first, then everything else. */
  prioritisePacks(tRel: number) {
    const idx = this.index;
    if (!idx) return;
    const wanted = new Set<number>();
    const lower = lowerBound(idx.start, tRel - idx.maxDuration);
    const upper = upperBound(idx.start, tRel + 1800);
    for (let i = lower; i < upper; i++) if (idx.end[i] >= tRel) wanted.add(idx.shape[i] % SHAPE_PACKS);
    const order = [...wanted];
    // Devices with little memory fetch other packs only when a trip needs them (ensurePack).
    const deviceMemory = (self.navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowMemory = deviceMemory !== undefined && deviceMemory <= 4;
    // stadstwin: only packs some trip of the index uses; a regional index leaves most of them empty.
    if (!lowMemory) for (const p of this.referencedPacks) if (!wanted.has(p)) order.push(p);
    this.queue = order.filter(p => this.packState[p] === 0);
    this.pump();
  }

  private pump() {
    while (this.inflight < 6 && this.queue.length) {
      const p = this.queue.shift()!;
      if (this.packState[p] !== 0) continue;
      this.loadPack(p);
    }
  }

  private loadPack(p: number) {
    this.packState[p] = 1;
    this.inflight++;
    fetch(this.packUrl(p), { headers: this.headers })
      .then(res => {
        if (!res.ok) throw new Error(`pack ${p}: HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then(buf => {
        this.packs[p] = decodeShapePack(buf);
        this.packState[p] = 2;
        this.packsLoaded++;
        this.onChange();
      })
      .catch(err => {
        this.packState[p] = 3;
        this.error = err instanceof Error ? err.message : String(err);
        this.onChange();
      })
      .finally(() => {
        this.inflight--;
        this.pump();
      });
  }

  private ensurePack(p: number) {
    if (this.packState[p] === 0) {
      this.queue.unshift(p);
      this.pump();
    }
  }

  /** Seconds relative to the index day start. */
  relativeTime(simSec: number): number {
    const idx = this.index!;
    const rel = simSec - idx.dayStart;
    return this.loopDaily ? ((rel % 86400) + 86400) % 86400 : rel;
  }

  applyRealtime(snapshot: RealtimeSnapshot | null) {
    this.rtSnapshot = snapshot;
    const idx = this.index;
    if (!idx) return;
    const now = Date.now();
    const next = new Map<number, RtEntry>();
    if (snapshot) {
      if (!this.tripIdToIdx) this.tripIdToIdx = new Map(idx.tripIds.map((id, i) => [id, i]));
      for (const [tripId, t] of Object.entries(snapshot.trips)) {
        const i = this.tripIdToIdx.get(tripId);
        if (i === undefined) continue;
        const prev = this.rt.get(i);
        const prevOffset = prev ? this.currentOffset(prev, now) : 0;
        next.set(i, { d: t.d ?? prev?.d ?? 0, cancelled: t.c === 1, lat: t.lat, lng: t.lng, ts: t.ts, offset: null, prevOffset, changedAt: now });
      }
    }
    this.rt = next;
  }

  get realtimeMatched(): number {
    return this.rt.size;
  }

  private currentOffset(e: RtEntry, now: number): number {
    const target = e.offset ?? e.prevOffset;
    const blend = Math.min(1, (now - e.changedAt) / REPORT_BLEND_MS);
    let v = e.prevOffset + (target - e.prevOffset) * blend;
    if (e.ts !== undefined) {
      const age = now / 1000 - e.ts;
      if (age > REPORT_FADE_START_S) v *= Math.max(0, 1 - (age - REPORT_FADE_START_S) / REPORT_FADE_SPAN_S);
    }
    return v;
  }

  /** Distance correction so the timetable position agrees with the last reported GPS fix. */
  private resolveOffset(i: number, e: RtEntry, pack: ShapePack, pOff: number, pCnt: number) {
    e.offset = 0;
    if (e.lat === undefined || e.lng === undefined || e.ts === undefined) return;
    const idx = this.index!;
    const tAt = e.ts - idx.dayStart - e.d;
    if (!distanceAtTime(idx.arr, idx.dep, idx.dist, idx.stopsOffset[i], idx.stopCount[i], Math.min(Math.max(tAt, idx.start[i]), idx.end[i]), this.tmp4)) return;
    const expected = this.tmp4[0];
    projectOntoShape(
      pack.coords.subarray(2 * pOff, 2 * (pOff + pCnt)),
      pack.cum.subarray(pOff, pOff + pCnt),
      pCnt,
      e.lng - COORD_BASE_LON,
      e.lat - COORD_BASE_LAT,
      0,
      this.tmp3,
      e.lat,
    );
    if (this.tmp3[2] > REPORT_MAX_PERP_M) return;
    e.offset = Math.max(-5000, Math.min(5000, this.tmp3[0] - expected));
  }

  private headingAt(pack: ShapePack, pOff: number, pCnt: number, d: number): number {
    pointAlongShape(pack.coords, pack.cum, pOff, pCnt, d - 4, this.tmpA, COORD_BASE_LON, COORD_BASE_LAT, false);
    pointAlongShape(pack.coords, pack.cum, pOff, pCnt, d + 4, this.tmpB, COORD_BASE_LON, COORD_BASE_LAT, false);
    if (this.tmpA[0] === this.tmpB[0] && this.tmpA[1] === this.tmpB[1]) {
      pointAlongShape(pack.coords, pack.cum, pOff, pCnt, d, this.tmpA, COORD_BASE_LON, COORD_BASE_LAT);
      return this.tmpA[2];
    }
    return flatBearingDeg(this.tmpA[0], this.tmpA[1], this.tmpB[0], this.tmpB[1]);
  }

  emit(writer: FrameWriter, simSec: number, opts: WorkerOptions) {
    const idx = this.index;
    if (!idx) return;
    const t = this.relativeTime(simSec);
    const useRt = opts.live && this.rt.size > 0;
    const filter = opts.realtimeFilter ?? 'all';
    // Realtime filters only keep timetable trips with live data; replays are recorded, not live.
    if (filter !== 'all' && (this.kind !== 'gtfs' || !useRt)) return;
    const nowSec = Date.now() / 1000;
    const lower = lowerBound(idx.start, t - this.windowSec - (useRt ? MAX_DELAY_SEC : 0));
    const upper = upperBound(idx.start, t + (useRt ? MAX_EARLY_SEC : 0));
    const scanned = upper - lower;
    const models = writer.lod === 'models';
    const now = Date.now();
    const out = this.tmp4;
    const pt = this.tmp3;
    const color = this.color;

    for (let n = 0; n < scanned + this.longTrips.length; n++) {
      let i: number;
      if (n < scanned) i = lower + n;
      else {
        i = this.longTrips[n - scanned];
        if (i >= lower && i < upper) continue; // already covered by the window
      }
      const mode = idx.mode[i];
      if (!(opts.enabledModes & (1 << mode))) continue;
      const rt = useRt ? this.rt.get(i) : undefined;
      if (rt?.cancelled) continue;
      const te = rt ? t - rt.d : t;
      if (te < idx.start[i] || te > idx.end[i]) continue;
      const hasGps = !!rt && rt.ts !== undefined && nowSec - rt.ts < GPS_FRESH_SEC;
      if (rt) writer.realtimeActive++;
      if (hasGps) writer.gpsActive++;
      if ((filter === 'realtime' && !rt) || (filter === 'gps' && !hasGps)) continue;
      writer.activeByMode[mode]++;
      // Report to the panel where this vehicle's position actually comes from.
      writer.source = hasGps
        ? POSITION_SOURCE.GPS
        : rt
          ? POSITION_SOURCE.DELAY
          : this.kind === 'replay'
            ? POSITION_SOURCE.RECORDED
            : POSITION_SOURCE.SCHEDULE;
      writer.sourceAgeSec = hasGps ? Math.round(nowSec - rt!.ts!) : -1;

      const shapeIdx = idx.shape[i];
      const p = shapeIdx % SHAPE_PACKS;
      const pack = this.packs[p];
      if (!pack) {
        this.ensurePack(p);
        continue;
      }
      const slot = shapeIdx >>> SHAPE_PACK_SHIFT;
      const pOff = pack.offsets[slot];
      const pCnt = pack.offsets[slot + 1] - pOff;
      if (pCnt === 0) continue;
      if (models) {
        const bb = 4 * slot;
        // Whole shape outside the view: no interpolation needed at all.
        if (!writer.intersects(pack.bbox[bb] + COORD_BASE_LON, pack.bbox[bb + 1] + COORD_BASE_LAT, pack.bbox[bb + 2] + COORD_BASE_LON, pack.bbox[bb + 3] + COORD_BASE_LAT)) continue;
      }

      distanceAtTime(idx.arr, idx.dep, idx.dist, idx.stopsOffset[i], idx.stopCount[i], te, out, this.rampSec);
      let d = out[0];
      const speedKph = out[1] * 3.6;
      if (rt) {
        if (rt.offset === null) this.resolveOffset(i, rt, pack, pOff, pCnt);
        d = Math.max(0, Math.min(pack.cum[pOff + pCnt - 1], d + this.currentOffset(rt, now)));
      }

      const row = encodeRow(this.sourceNo, i);
      switch (opts.colorMode) {
        case 'line': {
          const rc = opts.routeColors;
          const r = idx.routeIdx[i];
          if (rc && rc.length >= 3 * (r + 1) && (rc[3 * r] | rc[3 * r + 1] | rc[3 * r + 2])) {
            color[0] = rc[3 * r]; color[1] = rc[3 * r + 1]; color[2] = rc[3 * r + 2]; color[3] = 255;
          } else color.set(MODE_COLORS[mode]);
          break;
        }
        case 'speed':
          speedColor(speedKph, color, 0);
          break;
        case 'delay':
          delayColor(rt?.d, color, 0);
          break;
        default:
          color.set(MODE_COLORS[mode]);
      }

      if (!models) {
        pointAlongShape(pack.coords, pack.cum, pOff, pCnt, d, pt, COORD_BASE_LON, COORD_BASE_LAT, false);
        writer.push(mode, pt[0], pt[1], 0, 0, color[0], color[1], color[2], color[3], row, speedKph, this.kind === 'gtfs' ? idx.routeIdx[i] : 0xffffffff);
        continue;
      }

      pointAlongShape(pack.coords, pack.cum, pOff, pCnt, d, pt, COORD_BASE_LON, COORD_BASE_LAT, false);
      if (!writer.inView(pt[0], pt[1])) continue;
      const [cars, carLen] = CARS[mode] ?? [1, 0];
      let lateral = 0;
      if (mode === MODE.RAIL) {
        const so = idx.stopsOffset[i];
        const k = so + out[2];
        const last = so + idx.stopCount[i] - 1;
        const near = Math.min(Math.abs(d - idx.dist[k]), k < last ? Math.abs(idx.dist[k + 1] - d) : Infinity);
        const w = near <= TRACK_FULL_WITHIN_M ? 1 : Math.max(0, 1 - (near - TRACK_FULL_WITHIN_M) / TRACK_FADE_M);
        const eased = w * w * (3 - 2 * w);
        lateral = trackSlot(i) * TRACK_SPACING_M * eased;
      }
      for (let c = 0; c < cars; c++) {
        const dc = Math.max(0, d - carLen * (c + 0.5));
        if (c > 0 && d - carLen * c <= 0) break;
        const heading = this.headingAt(pack, pOff, pCnt, dc);
        pointAlongShape(pack.coords, pack.cum, pOff, pCnt, dc, pt, COORD_BASE_LON, COORD_BASE_LAT, false);
        if (lateral !== 0) {
          const right = (heading + 90) * D2R;
          pt[1] += (lateral * Math.cos(right)) / 111320;
          pt[0] += (lateral * Math.sin(right)) / (111320 * Math.cos(pt[1] * D2R));
        }
        writer.push(mode, pt[0], pt[1], 0, heading, color[0], color[1], color[2], color[3], row, speedKph, this.kind === 'gtfs' ? idx.routeIdx[i] : 0xffffffff);
      }
    }
  }

  /** Trips running at half past each local hour, for the timeline histogram. */
  hourlyActivity(localMidnightSec: number): number[] {
    const idx = this.index;
    if (!idx) return [];
    const out = new Array(24).fill(0);
    for (let h = 0; h < 24; h++) {
      const t = localMidnightSec + h * 3600 + 1800 - idx.dayStart;
      const lower = lowerBound(idx.start, t - idx.maxDuration);
      const upper = upperBound(idx.start, t);
      let n = 0;
      for (let i = lower; i < upper; i++) if (idx.end[i] >= t) n++;
      out[h] = n;
    }
    return out;
  }

  selection(i: number): SelectionMessage | null {
    const idx = this.index;
    if (!idx || i >= idx.tripCount) return null;
    const shapeIdx = idx.shape[i];
    const pack = this.packs[shapeIdx % SHAPE_PACKS];
    let path: Float64Array | undefined;
    if (pack) {
      const slot = shapeIdx >>> SHAPE_PACK_SHIFT;
      const pOff = pack.offsets[slot];
      const pCnt = pack.offsets[slot + 1] - pOff;
      path = new Float64Array(2 * pCnt);
      for (let k = 0; k < pCnt; k++) {
        path[2 * k] = pack.coords[2 * (pOff + k)] + COORD_BASE_LON;
        path[2 * k + 1] = pack.coords[2 * (pOff + k) + 1] + COORD_BASE_LAT;
      }
    }
    const o = idx.stopsOffset[i];
    const n = idx.stopCount[i];
    return {
      type: 'selection',
      row: encodeRow(this.sourceNo, i),
      kind: this.kind,
      tripId: idx.tripIds[i],
      sourceName: this.name,
      routeIdx: idx.routeIdx[i],
      mode: idx.mode[i],
      path,
      stops: { dist: idx.dist.slice(o, o + n), arr: idx.arr.slice(o, o + n), dep: idx.dep.slice(o, o + n) },
      dayStartSec: idx.dayStart,
      delaySec: this.rt.get(i)?.d,
    };
  }
}
