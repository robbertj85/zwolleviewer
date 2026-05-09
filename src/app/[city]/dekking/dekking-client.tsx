"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  ChevronsUpDown,
  ChevronsDownUp,
  ChevronDown,
  ChevronRight,
  ArrowDownAZ,
  ArrowUpZA,
} from "lucide-react";
import type {
  DekkingCategoryRow,
  DekkingLayerRow,
} from "./page";

type SortMode = "default" | "az" | "za";

interface DekkingClientProps {
  cityName: string;
  citySlug: string;
  cityProvince: string;
  totalLive: number;
  totalStub: number;
  totalBaseline: number;
  rows: DekkingCategoryRow[];
}

export default function DekkingClient({
  cityName,
  citySlug,
  cityProvince,
  totalLive,
  totalStub,
  totalBaseline,
  rows,
}: DekkingClientProps) {
  const [showMissing, setShowMissing] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(rows.map((r) => r.cat))
  );

  const toggleSection = useCallback((cat: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedSections(new Set(rows.map((r) => r.cat)));
  }, [rows]);

  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  const filteredRows = useMemo(() => {
    return rows.map((r) => {
      let layers = showMissing
        ? r.layers
        : r.layers.filter((l) => l.status !== "missing");
      if (sortMode === "az") {
        layers = [...layers].sort((a, b) => a.name.localeCompare(b.name, "nl"));
      } else if (sortMode === "za") {
        layers = [...layers].sort((a, b) => b.name.localeCompare(a.name, "nl"));
      }
      return { ...r, layers };
    });
  }, [rows, showMissing, sortMode]);

  const totalMissing = rows.reduce((sum, r) => sum + r.missingCount, 0);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/${citySlug}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Terug naar kaart
            </Link>
            <Link
              href="/dekking"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Vergelijk alle steden
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Dekking — {cityName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Welke datalagen heeft deze stad voor de 12 thema&apos;s uit de
            integrale gegevenshuishouding (statisch + dynamisch, met uniforme
            locatiereferentie)? De &quot;basislijn&quot; is de combinatie van
            alle lagen die welke pilotstad dan ook beschikbaar maakt — zo zie je
            wat een andere stad heeft dat deze stad mist.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full border bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-400">
              ✓ {totalLive} live
            </span>
            {totalStub > 0 && (
              <span className="rounded-full border bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-400">
                ⚠ {totalStub} stub
              </span>
            )}
            {totalMissing > 0 && (
              <span className="rounded-full border bg-red-500/10 px-2.5 py-1 text-red-700 dark:text-red-400">
                ✗ {totalMissing} ontbreekt
              </span>
            )}
            <span className="rounded-full border px-2.5 py-1">
              Basislijn: {totalBaseline} unieke lagen over alle pilotsteden
            </span>
            <span className="rounded-full border px-2.5 py-1">
              Provincie: {cityProvince}
            </span>

            <button
              onClick={() => setShowMissing((v) => !v)}
              className={`ml-auto inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                showMissing
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {showMissing ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
              {showMissing
                ? "Toon ontbrekende lagen"
                : "Verberg ontbrekende lagen"}
            </button>
          </div>

          {/* Controls row: expand/collapse + sort */}
          <div className="mt-3 flex flex-wrap items-center gap-1 text-[11px]">
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              title="Alle categorieën uitklappen"
              aria-label="Alle categorieën uitklappen"
            >
              <ChevronsUpDown className="h-3 w-3" />
              <span>Alles uitklappen</span>
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              title="Alle categorieën inklappen"
              aria-label="Alle categorieën inklappen"
            >
              <ChevronsDownUp className="h-3 w-3" />
              <span>Alles inklappen</span>
            </button>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-muted-foreground/70 mr-1">Sorteren:</span>
              <button
                onClick={() =>
                  setSortMode((s) => (s === "az" ? "default" : "az"))
                }
                aria-pressed={sortMode === "az"}
                title="A-Z sorteren binnen elke categorie"
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
                  sortMode === "az"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <ArrowDownAZ className="h-3 w-3" />
              </button>
              <button
                onClick={() =>
                  setSortMode((s) => (s === "za" ? "default" : "za"))
                }
                aria-pressed={sortMode === "za"}
                title="Z-A sorteren binnen elke categorie"
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors ${
                  sortMode === "za"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <ArrowUpZA className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="space-y-6">
          {filteredRows.map((row) => {
            if (row.layers.length === 0 && !showMissing) return null;
            const expanded = expandedSections.has(row.cat);
            return (
              <section
                key={row.cat}
                className="overflow-hidden rounded-lg border"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(row.cat)}
                  className="flex w-full items-start gap-3 border-b bg-muted/30 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                  aria-expanded={expanded}
                  aria-controls={`dekking-section-${row.cat}`}
                >
                  <span className="mt-0.5 shrink-0 text-muted-foreground">
                    {expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                  <div className="flex flex-1 items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold">{row.label}</h2>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {row.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-[10px]">
                      {row.liveCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-700 dark:text-emerald-400">
                          <Check className="h-3 w-3" />
                          {row.liveCount} live
                        </span>
                      )}
                      {row.stubCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3" />
                          {row.stubCount} stub
                        </span>
                      )}
                      {row.missingCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 font-medium text-red-700 dark:text-red-400">
                          <X className="h-3 w-3" />
                          {row.missingCount} ontbreekt
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {expanded &&
                  (row.layers.length === 0 ? (
                    <p
                      id={`dekking-section-${row.cat}`}
                      className="px-4 py-6 text-center text-xs text-muted-foreground"
                    >
                      Nog geen datalagen aangesloten voor dit thema in de basislijn.
                    </p>
                  ) : (
                    <ul
                      id={`dekking-section-${row.cat}`}
                      className="divide-y"
                    >
                      {row.layers.map((layer) => (
                        <LayerRow key={layer.id} layer={layer} />
                      ))}
                    </ul>
                  ))}
              </section>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Datalagen en inhoud:</strong>{" "}
          integrale gegevenshuishouding. Zowel statisch als dynamisch, met
          gemarkeerde status (historisch/actueel). Met uniforme
          locatiereferentie. PDX (registerfunctie + transactiegrootboek) en
          databronnen-overzicht (open / half open / gesloten) zijn nog niet
          geïmplementeerd in deze pilot.
        </div>
      </div>
    </div>
  );
}

function LayerRow({ layer }: { layer: DekkingLayerRow }) {
  const dimmed = layer.status === "missing";
  return (
    <li
      className={`flex items-start justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-accent/30 ${
        dimmed ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{layer.name}</span>
          <code className="rounded bg-muted px-1 py-0.5 text-[9px] font-mono text-muted-foreground">
            {layer.id}
          </code>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {layer.description}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Bron: {layer.source} · Categorie: {layer.categoryLabel}
          {layer.status !== "live" && layer.liveInCities.length > 0 && (
            <>
              {" "}· Wel beschikbaar in:{" "}
              <strong className="text-foreground">
                {layer.liveInCities.join(", ")}
              </strong>
            </>
          )}
        </p>
      </div>
      <StatusPill status={layer.status} />
    </li>
  );
}

function StatusPill({ status }: { status: DekkingLayerRow["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
        <Check className="h-3 w-3" /> live
      </span>
    );
  }
  if (status === "stub") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3" /> stub
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:text-red-400">
      <X className="h-3 w-3" /> ontbreekt
    </span>
  );
}
