/// <reference lib="webworker" />
// Adapted from fleetsim (src/workers/national-trajectory.worker.ts). Keep in sync
// with the original; the stadstwin version drops replay datasets and the
// FleetSim fleet and scopes every request to a region (`query`).
/**
 * Live mobility worker: holds the GTFS day (public transport) and the
 * procedural road traffic of one region and, up to 30 times per second,
 * evaluates every vehicle at the current time into transferable typed arrays
 * for deck.gl.
 */
import { MODE_COUNT } from '@/lib/live-mobility/format';
import { addDays, localDateOf } from '@/lib/live-mobility/service-day';
import {
  rowIndex,
  rowSource,
  SOURCE_FLOW,
  SOURCE_GTFS,
  type ClockState,
  type RealtimeSnapshot,
  type StatusMessage,
  type ToWorker,
  type ViewportState,
  type WorkerOptions,
} from '@/lib/live-mobility/worker-protocol';
import { FlowSource } from './live-mobility/flow-source';
import { FrameWriter } from './live-mobility/frame-writer';
import { TrajectorySource } from './live-mobility/trajectory-source';

const ctx = self as unknown as DedicatedWorkerGlobalScope;

const TICK_MS = 16;
const ACK_TIMEOUT_MS = 500;
/** Never compute faster than 30 Hz, never slower than 5 Hz. */
const MIN_FRAME_MS = 33;
const MAX_FRAME_MS = 200;
/** Recompute only once the fastest vehicle has moved about this far on screen. */
const FRAME_STEP_PX = 0.75;
/** Fastest vehicle we model (intercity trains), m/s. */
const TOP_SPEED_MPS = 45;
const D2R = Math.PI / 180;

let apiBase = '';
let query = '';
let feedVersion = '';
let feedStart = '';
let feedEnd = '';
let clock: ClockState = { simMs: Date.now(), wallMs: Date.now(), factor: 1, paused: true };
let viewport: ViewportState | null = null;
let options: WorkerOptions = {
  enabledModes: (1 << MODE_COUNT) - 1,
  colorMode: 'mode',
  modelZoom: 99,
  live: true,
  trafficScale: 1,
  realtimeFilter: 'all',
};
let realtime: RealtimeSnapshot | null = null;
let selectedRow: number | null = null;

let gtfs: TrajectorySource | null = null;
let gtfsDate: string | null = null;
let gtfsLoadingDate: string | null = null;
let gtfsError: string | null = null;
const flows = new FlowSource();

const writer = new FrameWriter();
let awaitingAck = false;
let sentAt = 0;
let dirty = true;
let statusDirty = true;

const markDirty = () => {
  dirty = true;
  statusDirty = true;
};

const withQuery = (url: string) => (query ? `${url}&${query}` : url);

/** Frames per second worth computing at the current zoom (see the fleetsim original). */
function frameIntervalMs(): number {
  if (clock.paused) return MAX_FRAME_MS;
  const zoom = viewport?.zoom ?? 12;
  const lat = viewport ? (viewport.south + viewport.north) / 2 : 52;
  const metresPerPixel = (156543.03 * Math.cos(lat * D2R)) / 2 ** zoom;
  const speed = TOP_SPEED_MPS * Math.max(0.1, Math.abs(clock.factor));
  return Math.min(MAX_FRAME_MS, Math.max(MIN_FRAME_MS, (FRAME_STEP_PX * metresPerPixel * 1000) / speed));
}

function simNowMs(): number {
  return clock.paused ? clock.simMs : clock.simMs + (Date.now() - clock.wallMs) * clock.factor;
}

function ensureGtfsDay(simMs: number) {
  if (!feedVersion) return;
  let date = localDateOf(simMs);
  if (date < addDays(feedStart, -1)) date = addDays(feedStart, -1);
  if (date > addDays(feedEnd, 1)) date = addDays(feedEnd, 1);
  if (date === gtfsDate || date === gtfsLoadingDate) return;
  if (gtfsLoadingDate) return; // one load at a time; re-evaluated next tick
  gtfsLoadingDate = date;
  gtfsError = null;
  statusDirty = true;
  const source =
    gtfs ??
    new TrajectorySource(
      SOURCE_GTFS,
      'gtfs',
      'Openbaar vervoer',
      'gtfs',
      p => withQuery(`${apiBase}/shapes/${p}?feed=${encodeURIComponent(feedVersion)}`),
      {},
      false,
      markDirty,
    );
  gtfs = source;
  source
    .loadIndex(withQuery(`${apiBase}/days/${date}?feed=${encodeURIComponent(feedVersion)}`), date)
    .then(() => {
      gtfsDate = date;
      source.applyRealtime(realtime);
      source.prioritisePacks(source.relativeTime(simNowMs() / 1000));
    })
    .catch(err => {
      gtfsError = err instanceof Error ? err.message : String(err);
      gtfsDate = date; // do not retry in a tight loop; a new date or init retries
    })
    .finally(() => {
      gtfsLoadingDate = null;
      markDirty();
    });
}

function postStatus() {
  const sources: StatusMessage['sources'] = [];
  if (gtfs) sources.push({ id: 'gtfs', name: gtfs.name, kind: 'gtfs', ready: !!gtfs.index, count: gtfs.index?.tripCount ?? 0, error: gtfsError ?? gtfs.error ?? undefined });
  if (flows.sectionCount) sources.push({ id: 'flows', name: 'Wegverkeer', kind: 'flow', ready: true, count: flows.sectionCount });
  const msg: StatusMessage = {
    type: 'status',
    phase: gtfsError ? 'error' : gtfsLoadingDate && !gtfs?.index ? 'loading-day' : gtfs?.index ? 'ready' : 'idle',
    date: gtfsDate ?? undefined,
    tripCount: gtfs?.index?.tripCount,
    packsLoaded: gtfs?.packsLoaded ?? 0,
    packsTotal: 64,
    message: gtfsError ?? (gtfsLoadingDate ? `Dienstregeling ${gtfsLoadingDate} laden…` : undefined),
    sources,
  };
  ctx.postMessage(msg);
  statusDirty = false;
}

let lastFrameAt = 0;

function tick() {
  if (statusDirty) postStatus();
  const wallNow = Date.now();
  if (awaitingAck && wallNow - sentAt < ACK_TIMEOUT_MS) return;
  if (!dirty && clock.paused) return;
  if (!dirty && wallNow - lastFrameAt < frameIntervalMs()) return;
  lastFrameAt = wallNow;
  const started = performance.now();
  const simMs = simNowMs();
  ensureGtfsDay(simMs);

  const lod = viewport && viewport.zoom >= options.modelZoom ? 'models' : 'dots';
  writer.begin(lod, viewport, selectedRow);
  gtfs?.emit(writer, simMs / 1000, options);
  flows.emit(writer, simMs, options);

  const { message, transfer } = writer.finish(simMs, performance.now() - started);
  ctx.postMessage(message, transfer);
  awaitingAck = true;
  sentAt = Date.now();
  dirty = false;
}

function selectionFor(row: number) {
  const source = rowSource(row);
  const index = rowIndex(row);
  if (source === SOURCE_GTFS) return gtfs?.selection(index) ?? null;
  if (source === SOURCE_FLOW) return flows.selection(index);
  return null;
}

ctx.onmessage = (event: MessageEvent<ToWorker>) => {
  const msg = event.data;
  switch (msg.type) {
    case 'init':
      apiBase = msg.apiBase;
      feedStart = msg.feedStart;
      feedEnd = msg.feedEnd;
      if (msg.feedVersion !== feedVersion || (msg.query ?? '') !== query) {
        feedVersion = msg.feedVersion;
        query = msg.query ?? '';
        gtfs = null;
        gtfsDate = null;
      }
      break;
    case 'clock':
      clock = msg.clock;
      if (gtfs?.index) gtfs.prioritisePacks(gtfs.relativeTime(simNowMs() / 1000));
      break;
    case 'viewport':
      viewport = msg.viewport;
      break;
    case 'options':
      options = { ...options, ...msg.options };
      break;
    case 'realtime':
      realtime = msg.snapshot;
      gtfs?.applyRealtime(realtime);
      break;
    case 'select': {
      selectedRow = msg.row;
      if (msg.row !== null) {
        const sel = selectionFor(msg.row);
        if (sel) ctx.postMessage(sel);
      }
      break;
    }
    case 'flows':
      flows.setPayload(msg.payload);
      break;
    case 'flowLive':
      flows.setLive(msg.speed, msg.flow);
      break;
    case 'frameAck':
      awaitingAck = false;
      // The main thread hands the previous frame's buffers back for reuse.
      if (msg.recycle?.length) writer.recycle(msg.recycle);
      return;
    default:
      return;
  }
  markDirty();
};

setInterval(tick, TICK_MS);
