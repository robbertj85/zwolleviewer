"use client";

import { useState } from "react";
import { AlertCircle, ChevronDown, Loader2, Radio } from "lucide-react";
import { MODE_LABELS } from "@/lib/live-mobility/layers";
import { MODE_COLORS } from "@/workers/live-mobility/palette";
import type { LiveMobilityState } from "@/lib/live-mobility/use-live-mobility";

export interface LiveLegendSettings {
  hiddenModes: ReadonlySet<number>;
  colorMode: "mode" | "delay";
  realtimeOnly: boolean;
}

/** Mirrors `delayColor` in the worker palette. */
const DELAY_LEGEND: Array<{ label: string; color: [number, number, number] }> = [
  { label: "Te vroeg (> 1 min)", color: [90, 170, 255] },
  { label: "Op tijd (≤ 2 min)", color: [40, 220, 120] },
  { label: "2–5 min vertraging", color: [255, 190, 40] },
  { label: "> 5 min vertraging", color: [255, 70, 70] },
  { label: "Geen realtime", color: [120, 128, 140] },
];

interface Props {
  ov: boolean;
  road: boolean;
  state: LiveMobilityState;
  /** Vehicles currently on the map per mode (from the newest frame). */
  counts: ArrayLike<number> | null;
  settings: LiveLegendSettings;
  onChange: (settings: LiveLegendSettings) => void;
}

function rgb(c: ArrayLike<number>) {
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function formatClock(unixSec: number | null) {
  if (!unixSec) return null;
  return new Date(unixSec * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

export default function LiveMobilityLegend({ ov, road, state, counts, settings, onChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const loading = state.status?.phase === "loading-day" || (!state.status && !state.error);
  const rows = MODE_LABELS.filter((m) => (m.group === "ov" ? ov : road));

  const toggleMode = (id: number) => {
    const next = new Set(settings.hiddenModes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ ...settings, hiddenModes: next });
  };

  return (
    <div className="w-60 max-w-[calc(100vw-5rem)] rounded-lg border bg-background/95 p-3 text-[11px] shadow-xl backdrop-blur-md">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className={`flex w-full items-center gap-1.5 text-xs font-semibold ${collapsed ? "" : "mb-2"}`}
        aria-expanded={!collapsed}
      >
        <Radio className="h-3.5 w-3.5 text-emerald-500" />
        Live mobiliteit
        {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
        <ChevronDown className={`ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform ${collapsed ? "-rotate-90" : ""}`} />
      </button>
      {!collapsed && (
      <>

      {state.error && (
        <div className="mb-2 flex items-start gap-1.5 rounded-md bg-destructive/10 p-2 text-destructive">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {settings.colorMode === "mode" || !ov ? (
        <div className="flex flex-col gap-1">
          {rows.map((m) => {
            const hidden = m.group === "ov" && settings.hiddenModes.has(m.id);
            return (
              <label key={m.id} className={`flex items-center gap-2 ${m.group === "ov" ? "cursor-pointer" : ""}`}>
                {m.group === "ov" && (
                  <input
                    type="checkbox"
                    checked={!hidden}
                    onChange={() => toggleMode(m.id)}
                    className="accent-primary"
                  />
                )}
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: rgb(MODE_COLORS[m.id]), opacity: hidden ? 0.3 : 1 }}
                />
                <span className={`flex-1 ${hidden ? "text-muted-foreground line-through" : ""}`}>{m.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {counts ? (counts[m.id] ?? 0).toLocaleString("nl-NL") : "–"}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {DELAY_LEGEND.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: rgb(d.color) }} />
              {d.label}
            </div>
          ))}
        </div>
      )}

      {ov && (
        <div className="mt-2 flex flex-col gap-1.5 border-t pt-2">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Kleur:</span>
            {(["mode", "delay"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChange({ ...settings, colorMode: mode })}
                className={`rounded px-1.5 py-0.5 transition-colors ${
                  settings.colorMode === mode ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                {mode === "mode" ? "Modaliteit" : "Vertraging"}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={settings.realtimeOnly}
              onChange={(e) => onChange({ ...settings, realtimeOnly: e.target.checked })}
              className="accent-primary"
            />
            Alleen ritten met realtime-data
          </label>
          <div className="text-muted-foreground">
            {state.realtime.feedTs
              ? `${state.realtime.trips.toLocaleString("nl-NL")} ritten met realtime · ${formatClock(state.realtime.feedTs)}`
              : state.realtime.error
                ? `Realtime niet beschikbaar: ${state.realtime.error}`
                : "Realtime-data laden…"}
          </div>
        </div>
      )}

      {road && (
        <div className="mt-2 border-t pt-2 text-muted-foreground">
          {state.traffic.error
            ? `Wegverkeer: ${state.traffic.error}`
            : state.traffic.corridors
              ? `${state.traffic.corridors} wegvakken (rijkswegen)${
                  state.traffic.liveCorridors !== null ? ` · ${state.traffic.liveCorridors} met live NDW-snelheid` : ""
                }. Aantallen zijn een schatting uit INWEVA-tellingen.`
              : "Wegverkeer laden…"}
        </div>
      )}

      <div className="mt-2 border-t pt-2 text-[10px] text-muted-foreground">
        Bron: OVapi GTFS(-RT), NDW, RWS INWEVA via{" "}
        <a href="https://fleetsim.nl/nederland" target="_blank" rel="noreferrer" className="underline">
          fleetsim.nl
        </a>
      </div>
      </>
      )}
    </div>
  );
}
