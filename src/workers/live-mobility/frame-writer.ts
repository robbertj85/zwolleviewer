// Vendored from fleetsim (src/workers/national/frame-writer.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
import { MODE_COUNT } from '@/lib/live-mobility/format';
import { POSITION_SOURCE, type FrameMessage, type Lod, type ViewportState } from '@/lib/live-mobility/worker-protocol';

class ModeLane {
  n = 0;
  cap = 0;
  pos = new Float32Array(0);
  heading = new Float32Array(0);
  color = new Uint8Array(0);
  rows = new Uint32Array(0);
  speed = new Float32Array(0);
  route = new Uint32Array(0);

  ensure(extra: number) {
    const need = this.n + extra;
    if (need <= this.cap) return;
    const cap = Math.max(need, this.cap * 2, 256);
    const grow = <T extends Float32Array | Uint8Array | Uint32Array>(a: T, size: number): T => {
      const b = new (a.constructor as { new (n: number): T })(cap * size);
      b.set(a.subarray(0, this.n * size) as never);
      return b;
    };
    this.pos = grow(this.pos, 3);
    this.heading = grow(this.heading, 1);
    this.color = grow(this.color, 4);
    this.rows = grow(this.rows, 1);
    this.speed = grow(this.speed, 1);
    this.route = grow(this.route, 1);
    this.cap = cap;
  }
}

/**
 * Recycles the transferable buffers the main thread hands back with `frameAck`,
 * so a steady stream of frames stops allocating megabytes per second.
 */
class BufferPool {
  private free: ArrayBuffer[] = [];

  release(buffers: ArrayBuffer[]) {
    for (const b of buffers) {
      if (b.byteLength > 0 && this.free.length < 32) this.free.push(b);
    }
  }

  /** A buffer of at least `bytes`, sized to a power of two so sizes repeat. */
  take(bytes: number): ArrayBuffer {
    const want = Math.max(64, 1 << (32 - Math.clz32(Math.max(bytes - 1, 1))));
    for (let i = 0; i < this.free.length; i++) {
      if (this.free[i].byteLength === want) {
        const buf = this.free[i];
        this.free.splice(i, 1);
        return buf;
      }
    }
    // Drop buffers that have become far too small to be useful again.
    if (this.free.length >= 32) this.free.shift();
    return new ArrayBuffer(want);
  }
}

const DEG = Math.PI / 180;

/** Accumulates instances per mode and emits mode-contiguous transferable buffers. */
export class FrameWriter {
  private lanes = Array.from({ length: MODE_COUNT }, () => new ModeLane());
  private pool = new BufferPool();
  lod: Lod = 'dots';
  activeByMode = new Uint32Array(MODE_COUNT);
  realtimeActive = 0;
  gpsActive = 0;
  selectedRow: number | null = null;
  /** Set by each source before pushing, so the selected vehicle can report its origin. */
  source: number = POSITION_SOURCE.SCHEDULE;
  /** Age of the GPS fix behind the vehicles being pushed, -1 when there is none. */
  sourceAgeSec = -1;
  private selectedSpeedKph = 0;
  private selectedSource: number = POSITION_SOURCE.SCHEDULE;
  private selectedAgeSec = -1;
  /** Origin the pushed positions are stored relative to (0 for absolute frames). */
  originLon = 0;
  originLat = 0;
  private selectedMode = -1;
  private selectedLaneIndex = -1;
  private west = -180;
  private south = -90;
  private east = 180;
  private north = 90;

  /** Take back the buffers of a frame the main thread has finished with. */
  recycle(buffers: ArrayBuffer[]) {
    this.pool.release(buffers);
  }

  begin(lod: Lod, viewport: ViewportState | null, selectedRow: number | null) {
    this.lod = lod;
    this.selectedRow = selectedRow;
    this.selectedMode = -1;
    this.selectedLaneIndex = -1;
    this.selectedSpeedKph = 0;
    this.selectedSource = POSITION_SOURCE.SCHEDULE;
    this.selectedAgeSec = -1;
    this.activeByMode.fill(0);
    this.realtimeActive = 0;
    this.gpsActive = 0;
    for (const lane of this.lanes) lane.n = 0;
    if (viewport && lod === 'models') {
      const padX = (viewport.east - viewport.west) * 0.25;
      const padY = (viewport.north - viewport.south) * 0.25;
      this.west = viewport.west - padX;
      this.east = viewport.east + padX;
      this.south = viewport.south - padY;
      this.north = viewport.north + padY;
      // Float32 positions relative to the viewport centre stay accurate to millimetres.
      this.originLon = (viewport.west + viewport.east) / 2;
      this.originLat = (viewport.south + viewport.north) / 2;
    } else {
      this.west = -180; this.east = 180; this.south = -90; this.north = 90;
      this.originLon = 0;
      this.originLat = 0;
    }
  }

  /** True when a lon/lat bounding box overlaps the padded viewport. */
  intersects(west: number, south: number, east: number, north: number): boolean {
    return west <= this.east && east >= this.west && south <= this.north && north >= this.south;
  }

  inView(lon: number, lat: number): boolean {
    return lon >= this.west && lon <= this.east && lat >= this.south && lat <= this.north;
  }

  push(mode: number, lon: number, lat: number, alt: number, heading: number, r: number, g: number, b: number, a: number, row: number, speedKph: number, routeIdx = 0xffffffff) {
    const lane = this.lanes[mode];
    lane.ensure(1);
    const i = lane.n++;
    lane.pos[3 * i] = lon - this.originLon;
    lane.pos[3 * i + 1] = lat - this.originLat;
    lane.pos[3 * i + 2] = alt;
    lane.heading[i] = heading;
    lane.color[4 * i] = r;
    lane.color[4 * i + 1] = g;
    lane.color[4 * i + 2] = b;
    lane.color[4 * i + 3] = a;
    lane.rows[i] = row;
    lane.speed[i] = speedKph;
    lane.route[i] = routeIdx;
    if (row === this.selectedRow && this.selectedLaneIndex < 0) {
      this.selectedMode = mode;
      this.selectedLaneIndex = i;
      this.selectedSpeedKph = speedKph;
      this.selectedSource = this.source;
      this.selectedAgeSec = this.sourceAgeSec;
    }
  }

  finish(simMs: number, frameMs: number): { message: FrameMessage; transfer: Transferable[] } {
    let count = 0;
    for (const lane of this.lanes) count += lane.n;
    const models = this.lod === 'models';
    const positions = new Float32Array(this.pool.take(12 * count), 0, 3 * count);
    const headings = new Float32Array(this.pool.take(4 * count), 0, count);
    const colors = new Uint8Array(this.pool.take(4 * count), 0, 4 * count);
    const rows = new Uint32Array(this.pool.take(4 * count), 0, count);
    const speeds = new Float32Array(this.pool.take(4 * count), 0, count);
    const routeIdx = new Uint32Array(this.pool.take(4 * count), 0, count);
    // Model matrices are what deck.gl's ScenegraphLayer actually uploads; building
    // them here keeps the main thread out of a per-instance accessor call.
    const matrices = models ? new Float32Array(this.pool.take(48 * count), 0, 12 * count) : null;
    const modeRanges = new Uint32Array(2 * MODE_COUNT);
    let o = 0;
    let selectedIndex = -1;
    this.lanes.forEach((lane, mode) => {
      modeRanges[2 * mode] = o;
      modeRanges[2 * mode + 1] = lane.n;
      if (!lane.n) return;
      positions.set(lane.pos.subarray(0, 3 * lane.n), 3 * o);
      headings.set(lane.heading.subarray(0, lane.n), o);
      colors.set(lane.color.subarray(0, 4 * lane.n), 4 * o);
      rows.set(lane.rows.subarray(0, lane.n), o);
      speeds.set(lane.speed.subarray(0, lane.n), o);
      routeIdx.set(lane.route.subarray(0, lane.n), o);
      if (matrices) {
        for (let i = 0; i < lane.n; i++) {
          // Yaw only (deck.gl orientation [pitch, yaw, roll] with unit scale):
          // columns 0-2 of the rotation, then a zero translation.
          const yaw = (90 - lane.heading[i]) * DEG;
          const cw = Math.cos(yaw);
          const sw = Math.sin(yaw);
          const m = 12 * (o + i);
          matrices[m] = cw; matrices[m + 1] = sw; matrices[m + 2] = 0;
          matrices[m + 3] = -sw; matrices[m + 4] = cw; matrices[m + 5] = 0;
          matrices[m + 6] = 0; matrices[m + 7] = 0; matrices[m + 8] = 1;
          matrices[m + 9] = 0; matrices[m + 10] = 0; matrices[m + 11] = 0;
        }
      }
      if (mode === this.selectedMode) selectedIndex = o + this.selectedLaneIndex;
      o += lane.n;
    });
    const activeByMode = this.activeByMode.slice();
    const transfer: Transferable[] = [
      positions.buffer,
      headings.buffer,
      colors.buffer,
      rows.buffer,
      speeds.buffer,
      routeIdx.buffer,
      modeRanges.buffer,
      activeByMode.buffer,
    ];
    if (matrices) transfer.push(matrices.buffer);
    return {
      message: {
        type: 'frame',
        lod: this.lod,
        count,
        positions,
        originLon: this.originLon,
        originLat: this.originLat,
        headings,
        matrices,
        colors,
        rows,
        speeds,
        routeIdx,
        modeRanges,
        activeByMode,
        simMs,
        selectedIndex,
        selectedSpeedKph: this.selectedSpeedKph,
        selectedSource: this.selectedSource,
        selectedAgeSec: this.selectedAgeSec,
        frameMs,
        realtimeActive: this.realtimeActive,
        gpsActive: this.gpsActive,
      },
      transfer,
    };
  }
}
