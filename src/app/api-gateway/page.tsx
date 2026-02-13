"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import CategoryFilter from "@/components/api-gateway/category-filter";
import LayerCatalog from "@/components/api-gateway/layer-catalog";
import LayerCard from "@/components/api-gateway/layer-card";

interface LayerInfo {
  id: string;
  name: string;
  description: string;
  source: string;
  endpoint: string;
  category: string;
  icon: string;
  categoryLabel: string;
  apiEndpoint: string;
  downloadUrl: string;
}

interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  layerCount: number;
}

export default function ApiGatewayPage() {
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/v1/layers")
      .then((r) => r.json())
      .then((d) => setLayers(d.layers));
    fetch("/api/v1/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories));
  }, []);

  const filtered = useMemo(() => {
    let result = layers;
    if (selectedCategory) {
      result = result.filter((l) => l.category === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [layers, selectedCategory, search]);

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Gateway</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Toegang tot {layers.length} GIS datasets via RESTful API endpoints.
            Alle data wordt geretourneerd als GeoJSON FeatureCollections.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Zoek datasets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Category filter */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "dataset" : "datasets"} gevonden
        </p>

        {/* Layer grid */}
        <LayerCatalog>
          {filtered.map((layer) => (
            <LayerCard key={layer.id} layer={layer} />
          ))}
        </LayerCatalog>
      </div>
    </div>
  );
}
