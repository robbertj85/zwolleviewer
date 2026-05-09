"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ArrowDownAZ,
  ArrowUpZA,
  ArrowDown01,
  ArrowUp01,
  Plug,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CityCoverageRow, ApiSourceRow } from "./page";

type SortKey =
  | "tier"
  | "name"
  | "province"
  | "available"
  | "unavailable"
  | "total";
type SortDir = "asc" | "desc";

interface DekkingOverviewClientProps {
  cityRows: CityCoverageRow[];
  apiRows: ApiSourceRow[];
  totals: {
    totalCities: number;
    lokaalCities: number;
    nationaalCities: number;
    totalReferences: number;
    uniqueConnections: number;
    uniqueSources: number;
    uniqueHosts: number;
  };
}

export default function DekkingOverviewClient({
  cityRows,
  apiRows,
  totals,
}: DekkingOverviewClientProps) {
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "Lokaal" | "Nationaal">(
    "all"
  );
  const [sortKey, setSortKey] = useState<SortKey>("tier");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = cityRows;
    if (tierFilter !== "all") rows = rows.filter((r) => r.tier === tierFilter);
    if (q)
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.province.toLowerCase().includes(q)
      );
    const sorted = [...rows].sort((a, b) => {
      let cmp: number;
      switch (sortKey) {
        case "tier":
          // Lokaal < Nationaal so ascending puts Lokaal first
          if (a.tier === b.tier) cmp = a.name.localeCompare(b.name, "nl");
          else cmp = a.tier === "Lokaal" ? -1 : 1;
          break;
        case "name":
          cmp = a.name.localeCompare(b.name, "nl");
          break;
        case "province":
          cmp = a.province.localeCompare(b.province, "nl");
          break;
        case "available":
          cmp = a.available - b.available;
          break;
        case "unavailable":
          cmp = a.unavailable - b.unavailable;
          break;
        case "total":
          cmp = a.total - b.total;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [cityRows, query, tierFilter, sortKey, sortDir]);

  const onHeaderClick = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "available" || key === "total" ? "desc" : "asc");
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Terug naar landingspagina
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Dekking — overzicht
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Status per gemeente over alle 12 thema&apos;s, plus een
            systeemoverzicht van de actieve API-koppelingen die de Basis
            Stadstwin voedt.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full border bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-400">
              <Building2 className="inline h-3 w-3 mr-1" />
              {totals.lokaalCities} Lokaal
            </span>
            <span className="rounded-full border bg-muted/60 px-2.5 py-1 text-muted-foreground">
              <Building2 className="inline h-3 w-3 mr-1" />
              {totals.nationaalCities} Nationaal
            </span>
            <span className="rounded-full border px-2.5 py-1">
              {totals.totalCities} live
            </span>
            <span className="rounded-full border px-2.5 py-1">
              <Plug className="inline h-3 w-3 mr-1" />
              {totals.uniqueConnections} unieke API-koppelingen
            </span>
            <span className="rounded-full border px-2.5 py-1">
              {totals.totalReferences.toLocaleString("nl-NL")} laagverbindingen totaal
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-10">
        {/* ─── Per-city table ─────────────────────────────────────── */}
        <section className="space-y-3">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Lagen per stad
              </h2>
              <p className="text-xs text-muted-foreground">
                Beschikbare en niet-beschikbare lagen per gemeente, met
                tier-classificatie. Stub-lagen zitten wel in de catalogus maar
                hebben geen data voor die stad (bijv. raster/WMS-only).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Zoek stad of provincie..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs w-56"
                />
              </div>
              <div className="inline-flex items-center gap-1 rounded-md border bg-background p-0.5 text-[11px]">
                {(["all", "Lokaal", "Nationaal"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    aria-pressed={tierFilter === t}
                    className={`rounded px-2 py-1 transition-colors ${
                      tierFilter === t
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {t === "all" ? "Alle" : t}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <Th
                    label="Stad"
                    sortKey="name"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={onHeaderClick}
                  />
                  <Th
                    label="Provincie"
                    sortKey="province"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={onHeaderClick}
                  />
                  <Th
                    label="Tier"
                    sortKey="tier"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={onHeaderClick}
                  />
                  <ThNum
                    label="Beschikbaar"
                    sortKey="available"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={onHeaderClick}
                  />
                  <ThNum
                    label="Niet besch."
                    sortKey="unavailable"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={onHeaderClick}
                  />
                  <ThNum
                    label="Totaal"
                    sortKey="total"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={onHeaderClick}
                  />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCities.map((row) => (
                  <tr
                    key={row.slug}
                    className="hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-3 py-2">
                      <Link
                        href={`/${row.slug}/dekking`}
                        className="font-medium hover:underline"
                      >
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {row.province}
                    </td>
                    <td className="px-3 py-2">
                      <TierPill tier={row.tier} />
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                      {row.available}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {row.unavailable > 0 ? row.unavailable : "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {row.total}
                    </td>
                  </tr>
                ))}
                {filteredCities.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-muted-foreground"
                    >
                      Geen steden gevonden voor &quot;{query}&quot;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {filteredCities.length} van {totals.totalCities} steden zichtbaar.
            Klik op een stadsnaam voor de gedetailleerde dekking.
          </p>
        </section>

        {/* ─── System / API connections ───────────────────────────── */}
        <section className="space-y-3">
          <header>
            <h2 className="text-lg font-semibold tracking-tight">
              Systeem — actieve API-koppelingen
            </h2>
            <p className="text-xs text-muted-foreground">
              Welke externe API&apos;s voeden de Basis Stadstwin? Een
              &quot;unieke koppeling&quot; is één combinatie van bron × host
              (dezelfde PDOK-WFS gebruikt door 342 gemeenten telt als één
              koppeling).
            </p>
          </header>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard
              icon={<Plug className="h-4 w-4" />}
              label="Unieke koppelingen"
              value={totals.uniqueConnections.toLocaleString("nl-NL")}
              description="bron × host combinaties"
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Unieke databronnen"
              value={totals.uniqueSources.toLocaleString("nl-NL")}
              description="bv. PDOK, CBS, gemeente"
            />
            <StatCard
              icon={<AlertCircle className="h-4 w-4" />}
              label="Unieke hosts"
              value={totals.uniqueHosts.toLocaleString("nl-NL")}
              description="distincte API-domeinen"
            />
            <StatCard
              icon={<Building2 className="h-4 w-4" />}
              label="Laagverbindingen totaal"
              value={totals.totalReferences.toLocaleString("nl-NL")}
              description="alle stad × laag-paren"
            />
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Databron</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Voorbeeld-host
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Unieke hosts
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    Laagverbindingen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {apiRows.map((row) => (
                  <tr
                    key={row.source}
                    className="hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-3 py-2 font-medium">{row.source}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground truncate max-w-[20em]">
                      {row.exampleHost}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {row.uniqueHosts}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {row.totalReferences.toLocaleString("nl-NL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {apiRows.length} unieke databronnen. Een PDOK-host die door 342
            gemeenten gebruikt wordt telt eenmaal in &quot;unieke
            koppelingen&quot; en 342× in &quot;laagverbindingen&quot;.
          </p>
        </section>
      </div>
    </div>
  );
}

function Th({
  label,
  sortKey,
  activeKey,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = activeKey === sortKey;
  return (
    <th className="px-3 py-2 text-left font-medium">
      <button
        type="button"
        onClick={() => onClick(sortKey)}
        className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${
          active ? "text-foreground" : ""
        }`}
      >
        {label}
        {active &&
          (dir === "asc" ? (
            <ArrowDownAZ className="h-3 w-3" />
          ) : (
            <ArrowUpZA className="h-3 w-3" />
          ))}
      </button>
    </th>
  );
}

function ThNum({
  label,
  sortKey,
  activeKey,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = activeKey === sortKey;
  return (
    <th className="px-3 py-2 text-right font-medium">
      <button
        type="button"
        onClick={() => onClick(sortKey)}
        className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${
          active ? "text-foreground" : ""
        }`}
      >
        {label}
        {active &&
          (dir === "asc" ? (
            <ArrowUp01 className="h-3 w-3" />
          ) : (
            <ArrowDown01 className="h-3 w-3" />
          ))}
      </button>
    </th>
  );
}

function TierPill({ tier }: { tier: "Lokaal" | "Nationaal" }) {
  if (tier === "Lokaal") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
        Lokaal
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/80">
      Nationaal
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{description}</div>
    </div>
  );
}
