import { ALL_CITIES } from "@/lib/cities";
import { buildDataSources } from "@/lib/data-sources";
import type { Metadata } from "next";
import DekkingOverviewClient from "./dekking-overview-client";

export const metadata: Metadata = {
  title: "Dekking — alle steden — Basis Stadstwin",
};

export interface CityCoverageRow {
  slug: string;
  name: string;
  province: string;
  tier: "Lokaal" | "Nationaal";
  available: number;
  unavailable: number;
  total: number;
}

export interface ApiSourceRow {
  /** Display name from DataSource.source */
  source: string;
  /** Sample endpoint host (the most common one for this source) */
  exampleHost: string;
  /** Number of unique endpoint hosts used by this source */
  uniqueHosts: number;
  /** Total layer references across all cities */
  totalReferences: number;
}

export default function DekkingOverviewPage() {
  const live = ALL_CITIES.filter((c) => c.status === "live");

  // Per-city coverage rows
  const cityRows: CityCoverageRow[] = live
    .map((city) => {
      const sources = buildDataSources(city);
      const available = sources.filter((s) => s.availability !== "stub").length;
      const unavailable = sources.filter((s) => s.availability === "stub").length;
      return {
        slug: city.slug,
        name: city.name,
        province: city.province,
        tier: city.coverage === "full" ? ("Lokaal" as const) : ("Nationaal" as const),
        available,
        unavailable,
        total: sources.length,
      };
    })
    .sort((a, b) => {
      // Lokaal first (descending available), then Nationaal alphabetically
      if (a.tier !== b.tier) return a.tier === "Lokaal" ? -1 : 1;
      if (a.tier === "Lokaal") return b.available - a.available;
      return a.name.localeCompare(b.name, "nl");
    });

  // System-wide API connection counts
  const hostsBySource = new Map<string, Map<string, number>>();
  let totalReferences = 0;
  // Sample one Lokaal city per province to avoid double-counting nationale lagen
  // 342 keer; we only need the unique source/endpoint set across the catalogue.
  const seenLayerKey = new Set<string>();
  for (const city of live) {
    const sources = buildDataSources(city);
    for (const s of sources) {
      totalReferences += 1;
      // Deduplicate per (source, endpoint) to compute "unique connections"
      // — same source × same host = one connection, even if 50 cities use it.
      const host = extractHost(s.endpoint);
      const key = `${s.source}|||${host}`;
      seenLayerKey.add(key);
      let m = hostsBySource.get(s.source);
      if (!m) {
        m = new Map();
        hostsBySource.set(s.source, m);
      }
      m.set(host, (m.get(host) ?? 0) + 1);
    }
  }

  const apiRows: ApiSourceRow[] = Array.from(hostsBySource.entries())
    .map(([source, hostMap]) => {
      // Pick the most-referenced host as the display example
      let exampleHost = "—";
      let max = -1;
      let totalRefs = 0;
      for (const [host, count] of hostMap.entries()) {
        totalRefs += count;
        if (count > max) {
          max = count;
          exampleHost = host;
        }
      }
      return {
        source,
        exampleHost,
        uniqueHosts: hostMap.size,
        totalReferences: totalRefs,
      };
    })
    .sort((a, b) => b.totalReferences - a.totalReferences);

  const totalUniqueConnections = seenLayerKey.size;
  const totalUniqueSources = hostsBySource.size;
  const totalUniqueHosts = new Set(
    Array.from(hostsBySource.values()).flatMap((m) => Array.from(m.keys()))
  ).size;

  return (
    <DekkingOverviewClient
      cityRows={cityRows}
      apiRows={apiRows}
      totals={{
        totalCities: live.length,
        lokaalCities: cityRows.filter((c) => c.tier === "Lokaal").length,
        nationaalCities: cityRows.filter((c) => c.tier === "Nationaal").length,
        totalReferences,
        uniqueConnections: totalUniqueConnections,
        uniqueSources: totalUniqueSources,
        uniqueHosts: totalUniqueHosts,
      }}
    />
  );
}

/**
 * Pull the hostname from a `DataSource.endpoint`. The endpoint field is free-
 * form (sometimes a full URL, sometimes a path or service name) so we degrade
 * gracefully: full URLs → host, paths → first segment, blank → "—".
 */
function extractHost(endpoint: string): string {
  if (!endpoint) return "—";
  const trimmed = endpoint.trim();
  if (!trimmed) return "—";
  // Try URL parsing first
  try {
    const url = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    );
    return url.host;
  } catch {
    // Fallback: strip leading "/" and use first path segment
    return trimmed.replace(/^\//, "").split(/[\/?#]/)[0] || "—";
  }
}
