"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Send,
  Loader2,
  Wrench,
  KeyRound,
  ChevronDown,
  RefreshCw,
  MapPin,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownLite } from "@/components/markdown-lite";
import { getLiveCities } from "@/lib/cities";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Provider config — open-source LLM inference only, stored in the browser.
// ---------------------------------------------------------------------------

interface AssistantConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface Preset {
  id: string;
  label: string;
  baseUrl: string;
  model: string;
  hint: string;
}

/** Only local, open-source inference servers (OpenAI-compatible API). */
const PRESETS: Preset[] = [
  {
    id: "ollama",
    label: "Ollama",
    baseUrl: "http://localhost:11434/v1",
    model: "llama3.1",
    hint: "Lokaal, geen key. Start Ollama en pull een model dat tool-calling kan, bv. `llama3.1`, `qwen2.5` of `mistral-nemo`.",
  },
  {
    id: "lmstudio",
    label: "LM Studio",
    baseUrl: "http://localhost:1234/v1",
    model: "",
    hint: "Lokaal, geen key. Start de 'Local Server' in LM Studio en laad een model met tool-support. Het modelveld mag leeg blijven.",
  },
  {
    id: "custom",
    label: "Anders (OpenAI-compatible)",
    baseUrl: "",
    model: "",
    hint: "Een ander OpenAI-compatible endpoint dat een open model serveert (vLLM, llama.cpp, …).",
  },
];

const DEFAULT_PRESET = "ollama";
const STORAGE_KEY = "stadstwin.assistant.config.v3";
const PRESET_KEY = "stadstwin.assistant.preset.v3";

function presetToConfig(p: Preset): AssistantConfig {
  return { baseUrl: p.baseUrl, apiKey: "", model: p.model };
}

function loadConfig(): { preset: string; config: AssistantConfig } {
  if (typeof window === "undefined") return { preset: DEFAULT_PRESET, config: presetToConfig(PRESETS[0]) };
  try {
    const preset = localStorage.getItem(PRESET_KEY) ?? DEFAULT_PRESET;
    const base = presetToConfig(PRESETS.find((x) => x.id === preset) ?? PRESETS[0]);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { preset, config: { ...base, ...JSON.parse(raw) } };
    return { preset, config: base };
  } catch {
    return { preset: DEFAULT_PRESET, config: presetToConfig(PRESETS[0]) };
  }
}

/**
 * Turn raw provider/transport errors into a short, friendly Dutch hint that
 * tells a first-time user what to fix in the settings above.
 */
function friendlyError(raw: string, baseUrl: string, model: string): string {
  const s = (raw || "").toLowerCase();
  const url = baseUrl || "de ingestelde URL";
  if (/fetch failed|econnrefused|connection refused|network|enotfound|failed to fetch|socket hang up|timed out|timeout/.test(s)) {
    return `Geen verbinding met de AI-server op ${url}. Start je lokale server (Ollama: \`ollama serve\` — of zet LM Studio's "Local Server" aan) en controleer de base-URL hierboven.`;
  }
  if (/model.*(not found|does not exist|unknown)|no such model|404/.test(s) || (s.includes("model") && s.includes("not found"))) {
    return `Het model \`${model || "(leeg)"}\` is niet beschikbaar op de server. Klik op **laad modellen** hierboven om een geladen model te kiezen — of haal het eerst op (bv. \`ollama pull ${model || "llama3.1"}\`).`;
  }
  if (/401|403|unauthorized|invalid api key|incorrect api key|forbidden/.test(s)) {
    return `De server weigerde de API-key. Vul een geldige key in — of laat het veld leeg als je een lokale server zonder authenticatie gebruikt.`;
  }
  if (/tool|function.*not supported|does not support tools/.test(s)) {
    return `Dit model ondersteunt geen tool-calling, dat heeft de assistent nodig. Kies een model dat tools kan, bv. \`llama3.1\`, \`qwen2.5\` of \`mistral-nemo\`.`;
  }
  return `Er ging iets mis bij de AI-server: ${raw}`;
}

// ---------------------------------------------------------------------------

interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  ok: boolean;
}
interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  error?: boolean;
}

export type LayerApplyMode = "replace" | "add" | "remove";

export interface AssistantPanelProps {
  /** City slug for the data tools / chat context. */
  city: string;
  /** Compact layout for the map side-panel (no city picker, tighter spacing). */
  compact?: boolean;
  /** Layer ids currently visible on the map (sent to the model so it knows the state). */
  activeLayers?: string[];
  /** Called when the model asks to change which layers are shown on the map. */
  onApplyLayers?: (layerIds: string[], mode: LayerApplyMode) => void;
  /** When provided, renders a close (×) button in the header. */
  onClose?: () => void;
  className?: string;
}

const SUGGESTIONS_BASE = [
  "Welke thema's en hoeveel lagen zijn er?",
  "Welke lagen gaan over laadpalen?",
  "Wat zit er in de BAG-laag? Geef een voorbeeld.",
];
const SUGGESTIONS_MAP = [
  "Zet de fietsroutes en laadpalen op de kaart",
  "Laat alleen geluidsbelasting en luchtkwaliteit zien",
  "Verberg alle lagen",
];

export default function AssistantPanel({
  city,
  compact = false,
  activeLayers = [],
  onApplyLayers,
  onClose,
  className,
}: AssistantPanelProps) {
  const liveCities = useMemo(() => getLiveCities(), []);
  const hasMap = !!onApplyLayers;

  const [cityCtx, setCityCtx] = useState(city);
  useEffect(() => setCityCtx(city), [city]);

  const [presetId, setPresetId] = useState(DEFAULT_PRESET);
  const [config, setConfig] = useState<AssistantConfig>(() => presetToConfig(PRESETS[0]));
  const [showKey, setShowKey] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(!compact);
  const [models, setModels] = useState<string[]>([]);
  const [modelsState, setModelsState] = useState<"idle" | "loading" | "error">("idle");
  const [modelsErr, setModelsErr] = useState("");

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { preset, config } = loadConfig();
    setPresetId(preset);
    setConfig(config);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    localStorage.setItem(PRESET_KEY, presetId);
  }, [config, presetId]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const isLocal = preset.id !== "custom" || /localhost|127\.0\.0\.1/.test(config.baseUrl);
  const ready = !!config.baseUrl.trim();

  function applyPreset(id: string) {
    setPresetId(id);
    setModels([]);
    setModelsState("idle");
    const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0];
    setConfig((c) => ({ baseUrl: p.baseUrl, model: p.model, apiKey: c.apiKey }));
  }

  async function loadModels() {
    if (!config.baseUrl.trim()) return;
    setModelsState("loading");
    setModelsErr("");
    try {
      const res = await fetch("/api/assistant/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: config.baseUrl, apiKey: config.apiKey }),
      });
      const data = await res.json();
      const list: string[] = Array.isArray(data.models) ? data.models : [];
      setModels(list);
      if (!res.ok || list.length === 0) {
        setModelsState("error");
        setModelsErr(data.error || "Geen modellen ontvangen — vul het modelveld handmatig in.");
      } else {
        setModelsState("idle");
        if (!config.model && list.length) setConfig((c) => ({ ...c, model: list[0] }));
      }
    } catch (e) {
      setModelsState("error");
      setModelsErr(e instanceof Error ? e.message : String(e));
    }
  }

  function applyMapToolCalls(calls: ToolCall[]) {
    if (!onApplyLayers) return;
    for (const tc of calls) {
      if (tc.name !== "set_active_layers") continue;
      const ids = Array.isArray(tc.args.layerIds) ? tc.args.layerIds.map(String) : [];
      const mode: LayerApplyMode =
        tc.args.mode === "add" || tc.args.mode === "remove" ? tc.args.mode : "replace";
      onApplyLayers(ids, mode);
    }
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy || !ready) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: { ...config, model: config.model.trim() || "default" },
          city: cityCtx,
          hasMap,
          activeLayers,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const toolCalls: ToolCall[] = Array.isArray(data.toolCalls) ? data.toolCalls : [];
      if (hasMap) applyMapToolCalls(toolCalls);
      if (!res.ok) {
        setSettingsOpen(true);
        setMessages([
          ...next,
          { role: "assistant", content: friendlyError(String(data.error ?? res.statusText), config.baseUrl, config.model), error: true, toolCalls },
        ]);
      } else {
        setMessages([...next, { role: "assistant", content: data.reply || "(leeg antwoord)", toolCalls }]);
      }
    } catch (e) {
      setSettingsOpen(true);
      setMessages([
        ...next,
        { role: "assistant", content: friendlyError(e instanceof Error ? e.message : String(e), config.baseUrl, config.model), error: true },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = hasMap ? [...SUGGESTIONS_MAP, ...SUGGESTIONS_BASE] : SUGGESTIONS_BASE;

  return (
    <div className={cn("relative flex h-full flex-col", className)}>
      {/* ---- header ---- */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Bot className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate text-xs font-semibold">Praat met het systeem</span>
        {hasMap && (
          <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" aria-label="bestuurt de kaart" />
        )}
        <div className="ml-auto flex items-center gap-1">
          {messages.length > 0 && (
            <Button variant="ghost" size="xs" onClick={() => setMessages([])}>wissen</Button>
          )}
          <button
            onClick={() => setSettingsOpen((o) => !o)}
            title="AI-instellingen"
            className={cn(
              "relative rounded-md p-1 transition-colors hover:bg-accent",
              settingsOpen && "bg-accent"
            )}
          >
            <Settings className="h-3.5 w-3.5" />
            {!ready && (
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
            )}
          </button>
          {onClose && (
            <button onClick={onClose} title="Sluiten" className="rounded-md p-1 transition-colors hover:bg-accent">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ---- settings overlay (cog-wheel) ---- */}
      {settingsOpen && (
        <div className="absolute inset-0 z-20 flex flex-col bg-background">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold">AI-inferentie instellen</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                ready
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
              )}
            >
              {ready ? "klaar" : "incompleet"}
            </span>
            <Button variant="ghost" size="icon-xs" className="ml-auto" onClick={() => setSettingsOpen(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
            <p className="text-xs text-muted-foreground">
              Alleen open-source modellen, lokaal op jouw machine. Kies je server:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={cn(
                    "rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                    presetId === p.id ? "bg-accent border-foreground/30" : "hover:bg-accent/50"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{preset.hint}</p>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">API base-URL</span>
              <Input
                value={config.baseUrl}
                onChange={(e) => setConfig((c) => ({ ...c, baseUrl: e.target.value }))}
                placeholder="http://localhost:11434/v1"
                className="h-8 text-sm font-mono"
              />
            </label>
            <label className="block space-y-1">
              <span className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                Model
                <button
                  type="button"
                  onClick={loadModels}
                  disabled={!config.baseUrl.trim() || modelsState === "loading"}
                  className="flex items-center gap-1 text-[10px] text-primary hover:underline disabled:opacity-40"
                >
                  {modelsState === "loading" ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  laad modellen{models.length ? ` (${models.length})` : ""}
                </button>
              </span>
              <div className="flex gap-1">
                <Input
                  list="assistant-panel-models"
                  value={config.model}
                  onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
                  placeholder="(leeg = geladen model)"
                  className="h-8 text-sm font-mono"
                />
                {models.length > 0 && (
                  <div className="relative">
                    <select
                      value={models.includes(config.model) ? config.model : ""}
                      onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
                      className="h-8 w-8 appearance-none rounded-md border bg-background pl-1.5 pr-4 text-xs outline-none focus:ring-2 focus:ring-ring"
                      title="Kies een model"
                    >
                      <option value="">…</option>
                      {models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                  </div>
                )}
              </div>
              <datalist id="assistant-panel-models">
                {models.map((m) => (<option key={m} value={m} />))}
              </datalist>
              {modelsState === "error" && <span className="block text-[10px] text-amber-600 dark:text-amber-400">{modelsErr}</span>}
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">API-key (optioneel)</span>
              <div className="flex gap-1">
                <Input
                  type={showKey ? "text" : "password"}
                  value={config.apiKey}
                  onChange={(e) => setConfig((c) => ({ ...c, apiKey: e.target.value }))}
                  placeholder="niet nodig voor lokale servers"
                  className="h-8 text-sm font-mono"
                  autoComplete="off"
                />
                <Button type="button" variant="outline" size="sm" className="h-8 shrink-0 text-xs" onClick={() => setShowKey((s) => !s)}>
                  {showKey ? "verberg" : "toon"}
                </Button>
              </div>
            </label>
            {!compact && (
              <label className="block space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Stad-context</span>
                <div className="relative">
                  <select
                    value={cityCtx}
                    onChange={(e) => setCityCtx(e.target.value)}
                    className="h-8 w-full appearance-none rounded-md border bg-background px-2 pr-7 text-xs outline-none focus:ring-2 focus:ring-ring"
                  >
                    {liveCities.map((c) => (<option key={c.slug} value={c.slug}>{c.name}</option>))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>
            )}
            <p className="text-[10px] text-muted-foreground">
              {isLocal
                ? "Lokale inferentie — draait op jouw machine. De app stuurt je chats via zijn server door naar deze URL."
                : "De app stuurt je chats via zijn server door naar deze URL; de key blijft in deze browser."}
            </p>
            <Button size="sm" className="h-8 w-full text-sm" onClick={() => setSettingsOpen(false)}>
              Klaar
            </Button>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              {ready
                ? hasMap
                  ? "Vraag om lagen te zoeken én op de kaart te zetten."
                  : "Stel een vraag over de datalagen — de assistent zoekt in de catalogus."
                : "Configureer hierboven een lokale AI-server (Ollama / LM Studio)."}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  disabled={!ready}
                  onClick={() => send(s)}
                  className="rounded-full border px-2 py-0.5 text-[11px] hover:bg-accent/50 disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[88%] rounded-lg px-2.5 py-1.5 text-xs",
                m.role === "user"
                  ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                  : m.error
                  ? "border border-destructive/30 bg-destructive/10 text-destructive"
                  : "bg-muted"
              )}
            >
              {m.toolCalls && m.toolCalls.length > 0 && (
                <div className="mb-1.5 space-y-0.5 border-b border-foreground/10 pb-1.5">
                  {m.toolCalls.map((tc, j) => (
                    <div key={j} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      {tc.name === "set_active_layers" ? <MapPin className="h-2.5 w-2.5" /> : <Wrench className="h-2.5 w-2.5" />}
                      <span className="font-mono">{tc.name}</span>
                      <span className="truncate opacity-70">{JSON.stringify(tc.args)}</span>
                      {!tc.ok && <span className="text-destructive">✗</span>}
                    </div>
                  ))}
                </div>
              )}
              {m.role === "assistant" ? <MarkdownLite text={m.content} /> : m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> denkt na…
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex shrink-0 gap-1.5 border-t p-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={ready ? "Vraag iets…" : "Configureer eerst een server"}
          disabled={!ready || busy}
          className="h-8 text-xs"
        />
        <Button type="submit" size="sm" className="h-8" disabled={!ready || busy || !input.trim()}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
