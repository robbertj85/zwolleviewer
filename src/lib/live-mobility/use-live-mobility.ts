"use client";

/**
 * Drives the live mobility worker for one region: loads the fleetsim feed
 * metadata, keeps the worker on live time, feeds it GTFS-Realtime snapshots
 * and NDW road-traffic factors (WebSocket first, HTTP polling as fallback),
 * and hands its frames to the map. Adapted from fleetsim's
 * useNationalWorker / useNationalRealtime / useTrafficFlows hooks.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MODE } from "./format";
import { localDateOf } from "./service-day";
import { decodeTrafficPayload, dayTypeFor } from "./traffic-format";
import { subscribeLive, type TrafficLive } from "./live-socket-client";
import type {
  ColorMode,
  FrameMessage,
  FromWorker,
  RealtimeSnapshot,
  SelectionMessage,
  StatusMessage,
  ToWorker,
  ViewportState,
} from "./worker-protocol";

export const OV_MODES = [MODE.RAIL, MODE.METRO, MODE.TRAM, MODE.BUS, MODE.FERRY] as const;
export const ROAD_MODES = [MODE.CAR, MODE.VAN, MODE.TRUCK] as const;

const RT_POLL_MS = 20_000;
const TRAFFIC_POLL_MS = 60_000;
/** Without socket data for this long the HTTP poll takes over again. */
const SOCKET_STALE_MS = 180_000;
/** An open socket gets this long to deliver its first message. */
const SOCKET_FIRST_MS = 20_000;

export interface RouteInfo {
  shortName: string | null;
  longName: string | null;
  color: [number, number, number] | null;
  mode: number;
  agency: string | null;
}

export interface LiveMobilityOptions {
  apiBase: string;
  bbox: string;
  ov: boolean;
  road: boolean;
  /** OV modes the user has switched off in the legend. */
  hiddenModes: ReadonlySet<number>;
  colorMode: Extract<ColorMode, "mode" | "delay">;
  realtimeOnly: boolean;
}

export interface LiveMobilityState {
  status: StatusMessage | null;
  selection: SelectionMessage | null;
  routes: RouteInfo[];
  /** Trips with live GTFS-RT data in the region, and when the newest snapshot was made. */
  realtime: { trips: number; feedTs: number | null; via: "socket" | "http" | null; error: string | null };
  traffic: { corridors: number; liveCorridors: number | null; error: string | null };
  error: string | null;
}

interface FeedResponse {
  feed: { version: string; startDate: string; endDate: string };
  routes: Array<[string | null, string | null, string | null, string | null, number, number]>;
  agencies: Array<{ name: string }>;
}

function hexToRgb(hex: string | null): [number, number, number] | null {
  if (!hex || !/^[0-9a-f]{6}$/i.test(hex)) return null;
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function useLiveMobility(opts: LiveMobilityOptions) {
  const { apiBase, bbox, ov, road, hiddenModes, colorMode, realtimeOnly } = opts;
  const active = ov || road;
  const query = `bbox=${bbox}`;

  const workerRef = useRef<Worker | null>(null);
  const listeners = useRef(new Set<(frame: FrameMessage) => void>());
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [selection, setSelection] = useState<SelectionMessage | null>(null);
  const [feed, setFeed] = useState<{ key: string; data: FeedResponse } | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [realtime, setRealtime] = useState<LiveMobilityState["realtime"]>({ trips: 0, feedTs: null, via: null, error: null });
  const [traffic, setTraffic] = useState<LiveMobilityState["traffic"]>({ corridors: 0, liveCorridors: null, error: null });
  const [flowsReady, setFlowsReady] = useState(false);

  const send = useCallback((msg: ToWorker, transfer?: Transferable[]) => {
    workerRef.current?.postMessage(msg, transfer ?? []);
  }, []);

  // Worker lifetime: only while a live layer is visible.
  useEffect(() => {
    if (!active) return;
    const worker = new Worker(new URL("../../workers/live-mobility.worker.ts", import.meta.url), {
      type: "module",
      name: "live-mobility",
    });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<FromWorker>) => {
      const msg = event.data;
      if (msg.type === "frame") {
        if (listeners.current.size === 0) worker.postMessage({ type: "frameAck" } satisfies ToWorker);
        for (const cb of listeners.current) cb(msg);
      } else if (msg.type === "status") setStatus(msg);
      else if (msg.type === "selection") setSelection(msg);
    };
    worker.onerror = (event) => {
      console.error("[live-mobility] worker error", event.message);
      setStatus({ type: "status", phase: "error", message: event.message || "Worker error", packsLoaded: 0, packsTotal: 64, sources: [] });
    };
    const now = Date.now();
    worker.postMessage({ type: "clock", clock: { simMs: now, wallMs: now, factor: 1, paused: false } } satisfies ToWorker);
    // A hidden tab draws nothing; stop computing frames until it is visible again.
    const onVisibility = () => {
      const t = Date.now();
      worker.postMessage({ type: "clock", clock: { simMs: t, wallMs: t, factor: 1, paused: document.hidden } } satisfies ToWorker);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      worker.terminate();
      workerRef.current = null;
      setStatus(null);
      setSelection(null);
      setFlowsReady(false);
    };
  }, [active]);

  // Feed metadata (version, validity, route table) — once per API base.
  const hasFeed = feed?.key === apiBase;
  useEffect(() => {
    if (!active || hasFeed) return;
    let cancelled = false;
    fetch(`${apiBase}/feed`)
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok || !body?.success) throw new Error(body?.error ?? `HTTP ${res.status}`);
        if (!cancelled) {
          setFeed({ key: apiBase, data: body.data as FeedResponse });
          setFeedError(null);
        }
      })
      .catch((err) => !cancelled && setFeedError(err instanceof Error ? err.message : String(err)));
    return () => {
      cancelled = true;
    };
  }, [active, apiBase, hasFeed]);

  const routes = useMemo<RouteInfo[]>(() => {
    if (!feed) return [];
    const agencies = feed.data.agencies;
    return feed.data.routes.map(([shortName, longName, color, , mode, agencyIdx]) => ({
      shortName,
      longName,
      color: hexToRgb(color),
      mode,
      agency: agencies[agencyIdx]?.name ?? null,
    }));
  }, [feed]);

  // Init: which feed and which region the worker loads.
  useEffect(() => {
    if (!active || !feed) return;
    const f = feed.data.feed;
    send({ type: "init", apiBase, feedVersion: f.version, feedStart: f.startDate, feedEnd: f.endDate, query });
  }, [active, feed, apiBase, query, send]);

  // Options: which modes are drawn and how they are coloured.
  const routeColors = useMemo(() => {
    const rc = new Uint8Array(3 * routes.length);
    routes.forEach((r, i) => r.color && rc.set(r.color, 3 * i));
    return rc;
  }, [routes]);
  useEffect(() => {
    if (!active) return;
    let enabledModes = 0;
    if (ov) for (const m of OV_MODES) if (!hiddenModes.has(m)) enabledModes |= 1 << m;
    if (road) for (const m of ROAD_MODES) enabledModes |= 1 << m;
    send({
      type: "options",
      options: {
        enabledModes,
        colorMode,
        realtimeFilter: realtimeOnly ? "realtime" : "all",
        routeColors,
        live: true,
        trafficScale: 1,
        // Dots only: 3D vehicle models are a later step.
        modelZoom: 99,
      },
    });
  }, [active, ov, road, hiddenModes, colorMode, realtimeOnly, routeColors, send]);

  // GTFS-Realtime: socket push, HTTP poll when the socket is down or silent.
  useEffect(() => {
    if (!active || !ov) {
      send({ type: "realtime", snapshot: null });
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let current: RealtimeSnapshot | null = null;
    let socketOpenAt = 0;
    let socketDataAt = 0;
    const accept = (snapshot: RealtimeSnapshot, via: "socket" | "http") => {
      if (current && current.feedVersion === snapshot.feedVersion && current.revision >= snapshot.revision) return;
      current = snapshot;
      send({ type: "realtime", snapshot });
      setRealtime({ trips: Object.keys(snapshot.trips).length, feedTs: snapshot.feedTs, via, error: null });
    };
    const unsubscribe = subscribeLive(apiBase, bbox, {
      rt: (snapshot) => {
        if (cancelled) return;
        socketDataAt = Date.now();
        accept(snapshot, "socket");
      },
      error: (channel, error) => channel === "rt" && !cancelled && setRealtime((s) => ({ ...s, error })),
      status: (st) => {
        socketOpenAt = st === "open" ? Date.now() : 0;
      },
    });
    const socketLive = () =>
      socketOpenAt > 0 && (Date.now() - socketDataAt < SOCKET_STALE_MS || Date.now() - socketOpenAt < SOCKET_FIRST_MS);
    const poll = async () => {
      if (!socketLive()) {
        try {
          // No If-None-Match: a custom header would force a CORS preflight;
          // the browser cache revalidates with the ETag on its own.
          const res = await fetch(`${apiBase}/rt?${query}`);
          const body = await res.json().catch(() => null);
          if (cancelled) return;
          if (res.ok && body?.success) accept(body.data as RealtimeSnapshot, "http");
          else setRealtime((s) => ({ ...s, error: body?.error ?? `HTTP ${res.status}` }));
        } catch (error) {
          if (!cancelled) setRealtime((s) => ({ ...s, error: error instanceof Error ? error.message : String(error) }));
        }
      }
      if (!cancelled) timer = setTimeout(poll, RT_POLL_MS);
    };
    timer = setTimeout(poll, 3_000);
    return () => {
      cancelled = true;
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [active, ov, apiBase, bbox, query, send]);

  // Road traffic: regional corridor payload for today's day type.
  const dayType = dayTypeFor(localDateOf(Date.now()));
  const corridorCount = useRef(0);
  /** Region the corridor payload is numbered for (fleetsim `X-Region`), null for national numbering. */
  const corridorRegion = useRef<string | null>(null);
  useEffect(() => {
    if (!active || !road) {
      send({ type: "flows", payload: null });
      setFlowsReady(false);
      return;
    }
    let cancelled = false;
    fetch(`${apiBase}/traffic/flows/${localDateOf(Date.now())}?${query}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? `HTTP ${res.status}`);
        }
        corridorRegion.current = res.headers.get("X-Region");
        return res.arrayBuffer();
      })
      .then((buf) => {
        if (cancelled) return;
        const payload = decodeTrafficPayload(buf);
        corridorCount.current = payload.offsets.length - 1;
        send({ type: "flows", payload });
        setFlowsReady(true);
        setTraffic((s) => ({ ...s, corridors: corridorCount.current, error: null }));
      })
      .catch((err) => !cancelled && setTraffic((s) => ({ ...s, error: err instanceof Error ? err.message : String(err) })));
    return () => {
      cancelled = true;
    };
  }, [active, road, apiBase, query, dayType, send]);

  // Live NDW factors for the regional corridors.
  useEffect(() => {
    if (!active || !road || !flowsReady) {
      send({ type: "flowLive", speed: null, flow: null });
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastAt = 0;
    let socketOpenAt = 0;
    let socketDataAt = 0;
    const accept = (live: TrafficLive) => {
      // Live factors are indexed by corridor: only apply them when they are numbered like the payload.
      if ((live.region ?? null) !== corridorRegion.current) return;
      if (live.generatedAt <= lastAt) return;
      lastAt = live.generatedAt;
      const n = corridorCount.current;
      const speed = new Float32Array(n).fill(NaN);
      const flow = new Float32Array(n).fill(NaN);
      for (const [idx, s, f] of live.corridors) {
        if (idx >= n) continue;
        speed[idx] = s;
        if (f !== null) flow[idx] = f;
      }
      send({ type: "flowLive", speed, flow });
      setTraffic((st) => ({ ...st, liveCorridors: live.corridors.length, error: null }));
    };
    const unsubscribe = subscribeLive(apiBase, bbox, {
      traffic: (live) => {
        if (cancelled) return;
        // A socket that ignores the region (an older fleetsim) does not count: the HTTP poll takes over.
        if ((live.region ?? null) === corridorRegion.current) socketDataAt = Date.now();
        accept(live);
      },
      error: (channel, error) => channel === "traffic" && !cancelled && setTraffic((st) => ({ ...st, error })),
      status: (st) => {
        socketOpenAt = st === "open" ? Date.now() : 0;
      },
    });
    const socketLive = () =>
      socketOpenAt > 0 && (Date.now() - socketDataAt < SOCKET_STALE_MS || Date.now() - socketOpenAt < SOCKET_FIRST_MS * 2);
    const poll = async () => {
      if (!socketLive()) {
        try {
          const res = await fetch(`${apiBase}/traffic/live?${query}`);
          const body = await res.json().catch(() => null);
          if (cancelled) return;
          if (res.ok && body?.success) accept(body.data as TrafficLive);
          else setTraffic((st) => ({ ...st, error: body?.error ?? `HTTP ${res.status}` }));
        } catch (error) {
          if (!cancelled) setTraffic((st) => ({ ...st, error: error instanceof Error ? error.message : String(error) }));
        }
      }
      if (!cancelled) timer = setTimeout(poll, TRAFFIC_POLL_MS);
    };
    timer = setTimeout(poll, 3_000);
    return () => {
      cancelled = true;
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [active, road, flowsReady, apiBase, bbox, query, send]);

  const subscribeFrame = useCallback((cb: (frame: FrameMessage) => void) => {
    listeners.current.add(cb);
    return () => {
      listeners.current.delete(cb);
    };
  }, []);

  const setViewport = useCallback((viewport: ViewportState) => send({ type: "viewport", viewport }), [send]);
  const select = useCallback(
    (row: number | null) => {
      if (row === null) setSelection(null);
      send({ type: "select", row });
    },
    [send]
  );

  const state: LiveMobilityState = {
    status,
    selection,
    routes,
    realtime,
    traffic,
    error: feedError ?? (status?.phase === "error" ? status.message ?? "Fout" : null),
  };
  return { ...state, active, send, subscribeFrame, setViewport, select };
}

export type LiveMobility = ReturnType<typeof useLiveMobility>;
