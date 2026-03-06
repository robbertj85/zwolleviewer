"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, RefreshCw, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EdcAsset {
  "@id": string;
  properties: Record<string, unknown>;
}

const CATEGORY_LABELS: Record<string, string> = {
  verkeer: "Verkeer & Transport",
  gebouwen: "Gebouwen & Adressen",
  "openbare-ruimte": "Openbare Ruimte",
  grenzen: "Grenzen & Gebieden",
  milieu: "Milieu & Klimaat",
  voorzieningen: "Voorzieningen",
};

export default function ProviderView() {
  const [assets, setAssets] = useState<EdcAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/edc/assets");
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/edc/sync", { method: "POST" });
      const data = await res.json();
      setSyncResult(
        `${data.assets.created} aangemaakt, ${data.assets.skipped} overgeslagen, ${data.assets.failed} mislukt`
      );
      await fetchAssets();
    } catch (err) {
      setSyncResult(err instanceof Error ? err.message : "Synchronisatie mislukt");
    } finally {
      setSyncing(false);
    }
  };

  // Collect categories from assets
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of assets) {
      const cat = (a.properties?.["zwolle:category"] as string) ?? "overig";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return Object.entries(counts).map(([id, count]) => ({
      id,
      label: CATEGORY_LABELS[id] ?? id,
      count,
    }));
  }, [assets]);

  const filtered = useMemo(() => {
    let result = assets;
    if (selectedCategory) {
      result = result.filter(
        (a) => (a.properties?.["zwolle:category"] as string) === selectedCategory
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => {
        const name = ((a.properties?.name as string) ?? "").toLowerCase();
        const desc = ((a.properties?.description as string) ?? "").toLowerCase();
        const id = (a["@id"] ?? "").toLowerCase();
        return name.includes(q) || desc.includes(q) || id.includes(q);
      });
    }
    return result;
  }, [assets, selectedCategory, search]);

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="default"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={handleSync}
          disabled={syncing}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
          Synchroniseer
        </Button>
        {syncResult && (
          <span className="text-xs text-muted-foreground">{syncResult}</span>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Zoek assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer select-none"
          onClick={() => setSelectedCategory(null)}
        >
          Alles
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            className="cursor-pointer select-none"
            onClick={() =>
              setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
            }
          >
            {cat.label}
            <span className="ml-1 opacity-60">{cat.count}</span>
          </Badge>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "asset" : "assets"}
        {loading ? " laden..." : " gevonden"}
      </p>

      {/* Asset grid */}
      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Assets laden...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Geen assets gevonden.{" "}
          {assets.length === 0 && (
            <span>Klik &quot;Synchroniseer&quot; om layers te registreren.</span>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => {
            const name = (asset.properties?.name as string) ?? asset["@id"];
            const desc = (asset.properties?.description as string) ?? "";
            const cat = (asset.properties?.["zwolle:category"] as string) ?? "";
            const catLabel = CATEGORY_LABELS[cat] ?? cat;

            return (
              <Card key={asset["@id"]} className="gap-2 py-3">
                <CardHeader className="gap-1 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {name}
                    </CardTitle>
                    {catLabel && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {catLabel}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs line-clamp-2">
                    {desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4">
                  <code className="text-[10px] text-muted-foreground">
                    {asset["@id"]}
                  </code>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
