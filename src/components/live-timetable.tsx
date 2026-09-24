"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NL_TIMEZONE } from "@/lib/live-mobility/service-day";

/** Timed stops of a live OV trip, as served by fleetsim's /trips/{id}. */
export interface LiveTimetable {
  stops: Array<{ name: string; platformCode: string | null; arrSec: number; depSec: number }>;
  /** Unix seconds of the service day's start; stop times are relative to it. */
  dayStartSec: number;
  /** Realtime delay of the whole trip; undefined when there is no realtime data. */
  delaySec?: number;
  /** Route colour as "#rrggbb", if the feed has one. */
  color: string;
  isRail: boolean;
}

const shortTime = new Intl.DateTimeFormat("nl-NL", {
  timeZone: NL_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Re-render interval for the "where is the vehicle now" marker. */
const TICK_MS = 15_000;

/**
 * Stop list for a selected vehicle: planned times, expected times shifted by
 * the trip's realtime delay, passed stops dimmed and the next stop marked.
 * Port of fleetsim's TripTicket stop list.
 */
export default function LiveTimetableList({ timetable }: { timetable: LiveTimetable }) {
  const { stops, dayStartSec, delaySec, color, isRail } = timetable;
  const [nowMs, setNowMs] = useState(() => Date.now());
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const delay = delaySec ?? 0;
  const rel = nowMs / 1000 - dayStartSec - delay;
  // Last stop the vehicle has reached (arrived at), -1 before the first one.
  const currentIndex = useMemo(() => {
    let k = -1;
    for (let i = 0; i < stops.length; i++) if (stops[i].arrSec <= rel) k = i;
    return k;
  }, [stops, rel]);

  useEffect(() => {
    // Centre the vehicle's position in the list without scrolling the panel.
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-stop="${Math.max(0, currentIndex)}"]`);
    if (list && el) list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2;
  }, [currentIndex]);

  const showDelay = Math.abs(delay) >= 60;

  return (
    <div className="px-4 pb-3">
      <p className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">
        Dienstregeling ({stops.length} haltes)
      </p>
      <ol ref={listRef} className="relative max-h-80 overflow-y-auto overscroll-contain pr-1">
        {stops.map((stop, i) => {
          const passed = currentIndex > i || (currentIndex === i && rel > stop.depSec);
          const atStop = currentIndex === i && rel <= stop.depSec;
          const next = currentIndex === i - 1 && !atStop;
          const last = i === stops.length - 1;
          const planned = (dayStartSec + stop.arrSec) * 1000;
          const highlight = atStop || next;
          return (
            <li key={i} data-stop={i} className="relative flex gap-2.5 pb-2">
              {!last && (
                <span
                  className="absolute left-[4px] top-3 h-full w-[2px]"
                  style={{ background: passed ? color : "var(--border)" }}
                />
              )}
              <span
                className="relative z-10 mt-[3px] h-2.5 w-2.5 shrink-0 border-2"
                style={{
                  borderColor: passed || highlight ? color : "var(--muted-foreground)",
                  background: passed || atStop ? color : "var(--background)",
                  borderRadius: highlight ? 999 : 2,
                  boxShadow: highlight ? `0 0 8px ${color}` : undefined,
                }}
              />
              <span
                className={`min-w-0 flex-1 truncate text-xs ${
                  passed ? "text-muted-foreground/60" : highlight ? "font-semibold" : "text-muted-foreground"
                }`}
                title={stop.name}
              >
                {stop.name}
                {stop.platformCode && (
                  <span className="ml-1.5 font-mono text-[10px] text-muted-foreground/70">
                    {isRail ? "spoor" : "perron"} {stop.platformCode}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-right font-mono text-[11px] leading-tight">
                <span
                  className={
                    showDelay
                      ? "text-muted-foreground/60 line-through"
                      : passed
                        ? "text-muted-foreground/60"
                        : "text-muted-foreground"
                  }
                >
                  {shortTime.format(planned)}
                </span>
                {showDelay && (
                  <span className={`block ${delay > 0 ? "text-red-500" : "text-emerald-600"}`}>
                    {shortTime.format(planned + delay * 1000)}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
        {delaySec === undefined
          ? "Geplande tijden; voor deze rit is geen realtime-data."
          : "Verwachte tijden = gepland + actuele vertraging van de rit."}
      </p>
    </div>
  );
}
