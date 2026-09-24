// Vendored from fleetsim (src/workers/national/flow-source.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
import { MODE } from '@/lib/live-mobility/format';
import { timezoneOffsetMinutes } from '@/lib/live-mobility/service-day';
import { buildCumDist, flatBearingDeg, pointAlongShape } from '@/lib/live-mobility/trajectory-math';
import { encodeRow, POSITION_SOURCE, SOURCE_FLOW, type FlowSectionsPayload, type SelectionMessage, type WorkerOptions } from '@/lib/live-mobility/worker-protocol';
import type { FrameWriter } from './frame-writer';
import { MODE_COLORS, speedColor } from './palette';

/**
 * Procedural road traffic from hourly flows per road corridor (INWEVA).
 *
 * Vehicle j of (corridor, class) enters the corridor at the exact inverse of the
 * cumulative flow F(t) (hourly piecewise-constant flow, integrated with prefix
 * sums), and then drives at the corridor speed. Positions are deterministic,
 * continuous in time and need no storage. Live NDW speeds slow vehicles down,
 * which raises density on congested corridors just like a real queue. The
 * volume slider (and live flow factors) thin vehicles with a stride.
 */

const CLASSES = 3; // light, medium, heavy
const CLASS_MODE = [MODE.CAR, MODE.VAN, MODE.TRUCK];
const CLASS_NAMES = ['Personenauto', 'Bestelwagen / middelzwaar', 'Vrachtwagen'];
const CLASS_MAX_KPH = [130, 95, 85];
const LANE_WIDTH_M = 3.5;
const DAY = 86400;
const SPEED_SMOOTHING = 0.03;
const D2R = Math.PI / 180;

/** Approximate paint colour mix of the Dutch passenger car fleet, weighted (RGB, cumulative weight). */
const CAR_PAINT: Array<[number, number, number, number]> = [
  [96, 100, 106, 25], [22, 24, 28, 45], [236, 238, 240, 62], [38, 70, 130, 75],
  [176, 180, 186, 83], [150, 28, 30, 88], [90, 60, 40, 92], [52, 92, 64, 95], [210, 180, 60, 97], [120, 40, 80, 100],
];
/** Truck and van bodies: mostly white or silver with some fleet liveries. */
const COMMERCIAL_PAINT: Array<[number, number, number, number]> = [
  [240, 240, 238, 45], [180, 184, 190, 60], [24, 26, 30, 70], [196, 40, 36, 78], [30, 80, 160, 86], [230, 170, 30, 92], [40, 110, 60, 100],
];

function paint(table: Array<[number, number, number, number]>, h: number, out: Uint8Array) {
  const roll = h % 100;
  for (const [r, g, b, w] of table) {
    if (roll < w) {
      out[0] = r; out[1] = g; out[2] = b; out[3] = 255;
      return;
    }
  }
}

function hash32(a: number, b: number, c: number): number {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35) ^ Math.imul(c + 0x27d4eb2f, 0x165667b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  h = Math.imul(h, 0x297a2d39);
  h ^= h >>> 15;
  return h >>> 0;
}

export class FlowSource {
  private p: FlowSectionsPayload | null = null;
  private cum: Float64Array[] = [];
  /** Per-corridor coordinate views, aligned with `cum` (index 0 = corridor start). */
  private coords: Float64Array[] = [];
  /** Per corridor×class: 25 prefix sums of hourly flow (vehicles since local midnight at each hour). */
  private prefix = new Float64Array(0);
  private speedNow = new Float32Array(0);
  private liveSpeed: Float32Array | null = null;
  private liveFlow: Float32Array | null = null;
  private bbox = new Float64Array(0);
  private readonly pt = new Float64Array(3);
  private readonly pt2 = new Float64Array(3);
  private readonly color = new Uint8Array(4);
  private lookup = new Map<number, [number, number, number]>();

  get sectionCount() {
    return this.p ? this.p.offsets.length - 1 : 0;
  }

  setPayload(payload: FlowSectionsPayload | null) {
    this.p = payload;
    this.lookup.clear();
    this.liveSpeed = null;
    this.liveFlow = null;
    if (!payload) return;
    const n = payload.offsets.length - 1;
    this.cum = new Array(n);
    this.coords = new Array(n);
    this.prefix = new Float64Array(n * CLASSES * 25);
    this.speedNow = new Float32Array(n).fill(1);
    this.bbox = new Float64Array(n * 4);
    for (let s = 0; s < n; s++) {
      const a = payload.offsets[s];
      const b = payload.offsets[s + 1];
      const coords = payload.coords.subarray(2 * a, 2 * b);
      this.coords[s] = coords;
      this.cum[s] = buildCumDist(coords, b - a);
      let w = 180, so = 90, e = -180, no = -90;
      for (let k = 0; k < b - a; k++) {
        w = Math.min(w, coords[2 * k]); e = Math.max(e, coords[2 * k]);
        so = Math.min(so, coords[2 * k + 1]); no = Math.max(no, coords[2 * k + 1]);
      }
      this.bbox.set([w, so, e, no], 4 * s);
      for (let c = 0; c < CLASSES; c++) {
        const base = (s * CLASSES + c) * 25;
        for (let h = 0; h < 24; h++) this.prefix[base + h + 1] = this.prefix[base + h] + payload.flows[(s * 24 + h) * CLASSES + c];
      }
    }
  }

  /** Live factors per corridor (NaN = no measurement). */
  setLive(speed: Float32Array | null, flow: Float32Array | null) {
    this.liveSpeed = speed;
    this.liveFlow = flow;
  }

  /** Vehicles of (s, c) that entered since local midnight of day 0 until (day, secOfDay). */
  private cumulative(s: number, c: number, day: number, secOfDay: number): number {
    while (secOfDay < 0) { secOfDay += DAY; day -= 1; }
    while (secOfDay >= DAY) { secOfDay -= DAY; day += 1; }
    const base = (s * CLASSES + c) * 25;
    const hour = Math.min(23, Math.floor(secOfDay / 3600));
    const perDay = this.prefix[base + 24];
    return day * perDay + this.prefix[base + hour] + (this.prefix[base + hour + 1] - this.prefix[base + hour]) * ((secOfDay - hour * 3600) / 3600);
  }

  /** Entry time (seconds relative to local midnight of `day`) of the vehicle with cumulative index j. */
  private entryTime(s: number, c: number, day: number, j: number): number {
    const base = (s * CLASSES + c) * 25;
    const perDay = this.prefix[base + 24];
    if (perDay <= 0) return -Infinity;
    const dayIndex = Math.floor(j / perDay);
    const rest = j - dayIndex * perDay;
    let lo = 0, hi = 23;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (this.prefix[base + mid] <= rest) lo = mid;
      else hi = mid - 1;
    }
    const q = this.prefix[base + lo + 1] - this.prefix[base + lo];
    const within = q > 0 ? ((rest - this.prefix[base + lo]) / q) * 3600 : 0;
    return (dayIndex - day) * DAY + lo * 3600 + within;
  }

  emit(writer: FrameWriter, simMs: number, opts: WorkerOptions) {
    const p = this.p;
    // Road traffic is modelled from counts, never an observed vehicle: hidden by realtime filters.
    if (!p || opts.trafficScale <= 0 || (opts.realtimeFilter ?? 'all') !== 'all') return;
    const modeMask = (1 << MODE.CAR) | (1 << MODE.VAN) | (1 << MODE.TRUCK);
    if (!(opts.enabledModes & modeMask)) return;
    const localSec = simMs / 1000 + timezoneOffsetMinutes(simMs) * 60;
    const day = Math.floor(localSec / DAY);
    const secOfDay = localSec - day * DAY;
    const useLive = opts.live;
    const models = writer.lod === 'models';
    const n = p.offsets.length - 1;
    if (models) this.lookup.clear();

    writer.source = POSITION_SOURCE.MODEL;
    writer.sourceAgeSec = -1;
    const realOnRoad = [0, 0, 0];
    for (let s = 0; s < n; s++) {
      let culled = false;
      if (models) {
        const b = 4 * s;
        culled = !writer.intersects(this.bbox[b], this.bbox[b + 1], this.bbox[b + 2], this.bbox[b + 3]);
      }
      const liveS = useLive && this.liveSpeed ? this.liveSpeed[s] : NaN;
      const target = Number.isFinite(liveS) ? liveS : 1;
      this.speedNow[s] += (target - this.speedNow[s]) * SPEED_SMOOTHING;
      const liveF = useLive && this.liveFlow ? this.liveFlow[s] : NaN;
      const flowFactor = Number.isFinite(liveF) ? liveF : 1;
      // Close-ups show all real traffic (cheap after culling); the slider thins the national overview.
      const scale = models ? 1 : opts.trafficScale;
      const stride = Math.max(1, Math.round(1 / Math.min(1, scale * flowFactor)));
      const cum = this.cum[s];
      const pc = cum.length;
      const length = cum[pc - 1];
      if (length <= 1) continue;
      const coords = this.coords[s];

      for (let c = 0; c < CLASSES; c++) {
        if (!(opts.enabledModes & (1 << CLASS_MODE[c]))) continue;
        const kph = Math.max(6, Math.min(CLASS_MAX_KPH[c], p.speeds[s] * this.speedNow[s]));
        const v = kph / 3.6;
        const travel = length / v;
        const fNow = this.cumulative(s, c, day, secOfDay);
        const fThen = this.cumulative(s, c, day, secOfDay - travel);
        // Legend counts are the estimated real number of vehicles on the network, independent of thinning and culling.
        realOnRoad[c] += (fNow - fThen) * flowFactor;
        if (culled) continue;
        const phase = hash32(s, c, 7) % stride;
        const first = Math.ceil((fThen - phase) / stride) * stride + phase;
        if (first > fNow) continue;
        for (let j = first; j <= fNow; j += stride) {
          const h = hash32(s, c, j);
          const jitter = ((h & 0xffff) / 0xffff - 0.5) * 0.4;
          const along = v * (secOfDay - this.entryTime(s, c, day, j + jitter));
          if (along < 0 || along > length) continue;
          if (!models) {
            // Country scale: lanes and headings are sub-pixel, so only the position matters.
            pointAlongShape(coords, cum, 0, pc, along, this.pt, 0, 0, false);
            if (opts.colorMode === 'speed') speedColor(kph, this.color, 0);
            else this.color.set(MODE_COLORS[CLASS_MODE[c]]);
            writer.push(CLASS_MODE[c], this.pt[0], this.pt[1], 0, 0, this.color[0], this.color[1], this.color[2], 255, encodeRow(SOURCE_FLOW, 0), kph);
            continue;
          }
          pointAlongShape(coords, cum, 0, pc, along, this.pt, 0, 0, false);
          if (!writer.inView(this.pt[0], this.pt[1])) continue;
          // Heading from a point a few metres further along (or behind, at the very end).
          const ahead = along + 6 <= length;
          pointAlongShape(coords, cum, 0, pc, ahead ? along + 6 : Math.max(0, along - 6), this.pt2, 0, 0, false);
          const heading = ahead
            ? flatBearingDeg(this.pt[0], this.pt[1], this.pt2[0], this.pt2[1])
            : flatBearingDeg(this.pt2[0], this.pt2[1], this.pt[0], this.pt[1]);
          // Keep right: heavy vehicles in the right lane, others spread over two or three lanes.
          const lane = c === 2 ? 0 : (h >>> 16) % (c === 1 ? 2 : 3);
          const offset = (lane + 0.5) * LANE_WIDTH_M;
          const right = (heading + 90) * D2R;
          const lat = this.pt[1] + (offset * Math.cos(right)) / 111320;
          const lon = this.pt[0] + (offset * Math.sin(right)) / (111320 * Math.cos(this.pt[1] * D2R));
          let row = 0;
          if (models) {
            row = hash32(s * 3 + c, j, 11) & 0xffffff;
            this.lookup.set(row, [s, c, j]);
          }
          if (opts.colorMode === 'speed') speedColor(kph, this.color, 0);
          else paint(c === 0 ? CAR_PAINT : COMMERCIAL_PAINT, (h >>> 8) & 0xffff, this.color);
          writer.push(CLASS_MODE[c], lon, lat, 0, heading, this.color[0], this.color[1], this.color[2], 255, encodeRow(SOURCE_FLOW, row), kph);
        }
      }
    }
    for (let c = 0; c < CLASSES; c++) writer.activeByMode[CLASS_MODE[c]] += Math.round(realOnRoad[c]);
  }

  selection(id: number): SelectionMessage | null {
    const hit = this.lookup.get(id);
    if (!hit || !this.p) return null;
    const [s, c] = hit;
    const a = this.p.offsets[s];
    const b = this.p.offsets[s + 1];
    // No speed in the label: the ticket shows the live speed, a speed frozen
    // at the moment of the click would contradict it a second later.
    return {
      type: 'selection',
      row: encodeRow(SOURCE_FLOW, id),
      kind: 'flow',
      mode: CLASS_MODE[c],
      label: CLASS_NAMES[c],
      sourceName: 'Wegverkeer (INWEVA / NDW)',
      path: this.p.coords.slice(2 * a, 2 * b),
    };
  }
}
