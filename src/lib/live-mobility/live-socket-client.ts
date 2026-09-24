// Adapted from fleetsim (src/lib/national/live-socket-client.ts). Keep in sync
// with the original; the stadstwin version connects to a configurable fleetsim
// origin instead of the page's own host and subscribes for one region (`bbox`).
/**
 * Browser side of fleetsim's `/ws/national`.
 *
 * One connection per region, opened when the first channel is subscribed and
 * closed when the last one leaves. Reconnects with backoff. Realtime deltas
 * are applied to a local copy of the snapshot, so subscribers always receive a
 * complete snapshot; a delta for another revision triggers a resync.
 */

import type { RealtimeSnapshot, RealtimeTrip } from './worker-protocol';

export type LiveStatus = 'connecting' | 'open' | 'closed';

export interface RtFullSnapshot extends RealtimeSnapshot {
  generatedAt: number;
  stats: { vehicles: number; tripUpdates: number; trainUpdates: number; matched: number; unmatched: number };
}

export interface TrafficLive {
  version: string;
  publicationTime: string | null;
  generatedAt: number;
  sitesMeasured: number;
  corridors: Array<[number, number, number | null]>;
  /** stadstwin: set by fleetsim when the corridors are renumbered for a region. */
  region?: string;
}

type ServerMessage =
  | { type: 'rt-full'; snapshot: RtFullSnapshot }
  | ({ type: 'rt-delta'; base: number; set: Record<string, RealtimeTrip>; del: string[] } & Omit<RtFullSnapshot, 'trips'>)
  | { type: 'traffic'; snapshot: TrafficLive }
  | { type: 'error'; channel: 'rt' | 'traffic'; error: string };

export interface LiveListener {
  rt?: (snapshot: RtFullSnapshot) => void;
  traffic?: (snapshot: TrafficLive) => void;
  error?: (channel: 'rt' | 'traffic', error: string) => void;
  status?: (status: LiveStatus) => void;
}

const MAX_BACKOFF_MS = 30_000;

class LiveSocketClient {
  private ws: WebSocket | null = null;
  private listeners = new Set<LiveListener>();
  private status: LiveStatus = 'closed';
  private backoff = 1_000;
  private retry: ReturnType<typeof setTimeout> | null = null;
  private rt: RtFullSnapshot | null = null;
  private traffic: TrafficLive | null = null;

  constructor(
    private readonly url: string,
    private readonly bbox: string,
  ) {}

  subscribe(listener: LiveListener): () => void {
    this.listeners.add(listener);
    listener.status?.(this.status);
    // A late subscriber starts from what the page already has.
    if (listener.rt && this.rt) listener.rt(this.rt);
    if (listener.traffic && this.traffic) listener.traffic(this.traffic);
    if (!this.ws && !this.retry) this.connect();
    else this.sendSubscription();
    return () => {
      this.listeners.delete(listener);
      if (!this.listeners.size) this.close();
      else this.sendSubscription();
    };
  }

  get idle() {
    return this.listeners.size === 0;
  }

  private connect() {
    this.retry = null;
    if (typeof WebSocket === 'undefined') return;
    this.setStatus('connecting');
    const ws = new WebSocket(this.url);
    this.ws = ws;
    ws.onopen = () => {
      this.backoff = 1_000;
      this.setStatus('open');
      this.sendSubscription();
    };
    ws.onmessage = ev => this.onMessage(ev.data);
    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      this.setStatus('closed');
      if (this.listeners.size) {
        this.retry = setTimeout(() => this.connect(), this.backoff);
        this.backoff = Math.min(MAX_BACKOFF_MS, this.backoff * 2);
      }
    };
  }

  private close() {
    if (this.retry) clearTimeout(this.retry);
    this.retry = null;
    const ws = this.ws;
    this.ws = null;
    ws?.close();
    this.rt = null;
    this.traffic = null;
    this.setStatus('closed');
  }

  private sendSubscription() {
    const wants = { rt: false, traffic: false };
    for (const l of this.listeners) {
      if (l.rt) wants.rt = true;
      if (l.traffic) wants.traffic = true;
    }
    if (!wants.rt) this.rt = null;
    if (!wants.traffic) this.traffic = null;
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({ type: 'subscribe', bbox: this.bbox, ...wants }));
  }

  private onMessage(data: unknown) {
    if (typeof data !== 'string') return;
    let msg: ServerMessage;
    try {
      msg = JSON.parse(data);
    } catch {
      return;
    }
    if (msg.type === 'rt-full') {
      this.rt = msg.snapshot;
      this.emitRt();
    } else if (msg.type === 'rt-delta') {
      const cur = this.rt;
      if (!cur || cur.revision !== msg.base || cur.feedVersion !== msg.feedVersion) {
        this.ws?.send(JSON.stringify({ type: 'resync' }));
        return;
      }
      const trips = { ...cur.trips, ...msg.set };
      for (const id of msg.del) delete trips[id];
      this.rt = {
        feedVersion: msg.feedVersion,
        revision: msg.revision,
        feedTs: msg.feedTs,
        generatedAt: msg.generatedAt,
        stats: msg.stats,
        trips,
      };
      this.emitRt();
    } else if (msg.type === 'traffic') {
      this.traffic = msg.snapshot;
      for (const l of this.listeners) l.traffic?.(msg.snapshot);
    } else if (msg.type === 'error') {
      for (const l of this.listeners) l.error?.(msg.channel, msg.error);
    }
  }

  private emitRt() {
    for (const l of this.listeners) if (this.rt) l.rt?.(this.rt);
  }

  private setStatus(status: LiveStatus) {
    this.status = status;
    for (const l of this.listeners) l.status?.(status);
  }
}

const clients = new Map<string, LiveSocketClient>();

/** WebSocket URL of fleetsim's live hub for an API base such as `https://fleetsim.nl/api/v1/public/national`. */
export function liveSocketUrl(apiBase: string): string {
  const u = new URL(apiBase, typeof location === 'undefined' ? 'http://localhost' : location.href);
  return `${u.protocol === 'https:' ? 'wss' : 'ws'}://${u.host}/ws/national`;
}

/** Subscribe to live channels for one region over a shared socket; returns the unsubscribe function. */
export function subscribeLive(apiBase: string, bbox: string, listener: LiveListener): () => void {
  const url = liveSocketUrl(apiBase);
  const key = `${url}|${bbox}`;
  let client = clients.get(key);
  if (!client) {
    client = new LiveSocketClient(url, bbox);
    clients.set(key, client);
  }
  const unsubscribe = client.subscribe(listener);
  const c = client;
  return () => {
    unsubscribe();
    if (c.idle && clients.get(key) === c) clients.delete(key);
  };
}
