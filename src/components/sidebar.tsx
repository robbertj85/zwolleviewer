"use client";

import {
  TrafficCone,
  Building2,
  TreePine,
  MapPin,
  Leaf,
  Store,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Layers,
  Database,
  Info,
  Home,
  Landmark,
  Route,
  Waves,
  Map,
  LayoutGrid,
  ShieldAlert,
  ParkingCircle,
  Zap,
  Bike,
  Snowflake,
  Construction,
  ArrowRightLeft,
  CreditCard,
  Gauge,
  Castle,
  Dumbbell,
  Trash2,
  Palette,
  Bug,
  Search,
  Thermometer,
  ShieldCheck,
  UtensilsCrossed,
  CircleDot,
  Apple,
  Flame,
  Accessibility,
  Lightbulb,
  Droplets,
  Volume2,
  Users,
  Flag,
  TrainFront,
  HeartPulse,
  GlassWater,
  Wheat,
  Ship,
  GraduationCap,
  ShoppingCart,
  X,
  ChevronsUpDown,
  ChevronsDownUp,
  Download,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { memo, useState, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayerState } from "@/lib/use-layers";
import { CATEGORIES, LayerCategory } from "@/lib/data-sources";

const ICON_MAP: Record<string, LucideIcon> = {
  TrafficCone,
  Building2,
  TreePine,
  MapPin,
  Leaf,
  Store,
  Home,
  Landmark,
  Route,
  Waves,
  Map,
  LayoutGrid,
  ShieldAlert,
  ParkingCircle,
  Zap,
  Bike,
  Snowflake,
  Construction,
  ArrowRightLeft,
  CreditCard,
  Gauge,
  Castle,
  Dumbbell,
  Trash2,
  Palette,
  Bug,
  Search,
  Thermometer,
  ShieldCheck,
  UtensilsCrossed,
  CircleDot,
  Apple,
  Flame,
  Accessibility,
  Lightbulb,
  Droplets,
  Volume2,
  Users,
  Flag,
  TrainFront,
  HeartPulse,
  GlassWater,
  Wheat,
  Ship,
  GraduationCap,
  ShoppingCart,
};

interface SidebarProps {
  layers: LayerState[];
  toggleLayer: (id: string, opts?: { full?: boolean }) => void;
  fetchFullLayer: (id: string) => void;
  stats: {
    total: number;
    active: number;
    loaded: number;
    loading: number;
    features: number;
  };
}

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

// Memoized layer row to avoid re-rendering all rows on any state change
const LayerRow = memo(function LayerRow({
  layer,
  onToggle,
  onFetchFull,
}: {
  layer: LayerState;
  onToggle: (id: string, opts?: { full?: boolean }) => void;
  onFetchFull: (id: string) => void;
}) {
  const LayerIcon = ICON_MAP[layer.icon] || Layers;

  const isTruncated =
    layer.visible &&
    layer.defaultLimit != null &&
    layer.featureCount === layer.defaultLimit &&
    layer.fetchMode !== "full";

  const isFullLoaded = layer.fetchMode === "full" && layer.featureCount > 0;

  return (
    <div
      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={(e) => {
        if (e.shiftKey && !layer.visible) {
          onToggle(layer.id, { full: true });
        } else {
          onToggle(layer.id);
        }
      }}
    >
      <div
        className="h-2.5 w-2.5 rounded-full shrink-0"
        style={{
          backgroundColor: `rgba(${layer.color.join(",")})`,
        }}
      />
      <LayerIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex-1 truncate text-xs cursor-default">
            {layer.name}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={16}
          align="start"
          hideArrow
          className="max-w-sm bg-background text-foreground border border-border shadow-xl p-0"
        >
          <div className="px-3 py-2">
            <p className="text-xs font-semibold leading-snug">{layer.description}</p>
          </div>
          <div className="border-t border-border/50 px-3 py-2 space-y-1">
            <p className="text-[10px] text-muted-foreground">
              {layer.source}
            </p>
            {layer.endpoint && (
              <p className="text-[10px] text-muted-foreground/60 truncate">
                {layer.endpoint}
              </p>
            )}
            {layer.featureCount > 0 && (
              <p className="text-[10px] text-muted-foreground">
                {layer.featureCount.toLocaleString("nl-NL")} features
                {isTruncated && " (afgekapt)"}
                {isFullLoaded && " (volledig)"}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>

      {layer.loading && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
      {layer.error && (
        <Tooltip>
          <TooltipTrigger>
            <AlertCircle className="h-3 w-3 text-destructive" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs text-destructive">{layer.error}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Feature count with truncation indicator */}
      {layer.featureCount > 0 && !isTruncated && !isFullLoaded && (
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {formatCount(layer.featureCount)}
        </span>
      )}
      {isTruncated && !layer.loading && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center gap-0.5 text-[10px] tabular-nums text-amber-500 hover:text-amber-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onFetchFull(layer.id);
              }}
            >
              {formatCount(layer.featureCount)}+
              <Download className="h-2.5 w-2.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">
              Mogelijk niet alle data geladen. Klik om alles op te halen.
            </p>
          </TooltipContent>
        </Tooltip>
      )}
      {isFullLoaded && (
        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground tabular-nums">
          {formatCount(layer.featureCount)}
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
        </span>
      )}

      <Switch
        checked={layer.visible}
        onCheckedChange={() => onToggle(layer.id)}
        onClick={(e) => e.stopPropagation()}
        className="scale-75"
      />
    </div>
  );
});

export default function Sidebar({ layers, toggleLayer, fetchFullLayer, stats }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Set<LayerCategory>
  >(new Set(Object.keys(CATEGORIES) as LayerCategory[]));
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = useCallback((cat: LayerCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(new Set(Object.keys(CATEGORIES) as LayerCategory[]));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  const allCategories = Object.keys(CATEGORIES) as LayerCategory[];

  const grouped = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return allCategories.map((cat) => {
      const catLayers = layers.filter((l) => l.category === cat);
      const filteredLayers = query
        ? catLayers.filter(
            (l) =>
              l.name.toLowerCase().includes(query) ||
              l.description.toLowerCase().includes(query)
          )
        : catLayers;
      return {
        category: cat,
        ...CATEGORIES[cat],
        layers: filteredLayers,
      };
    });
  }, [layers, searchQuery, allCategories]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">
            Zwolle Data Viewer
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Open data op de kaart
        </p>
      </div>

      {/* Stats */}
      <div className="shrink-0 grid grid-cols-3 gap-2 border-b px-4 py-3">
        <div className="text-center">
          <div className="text-lg font-bold">{stats.active}</div>
          <div className="text-[10px] text-muted-foreground">Actief</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{stats.total}</div>
          <div className="text-[10px] text-muted-foreground">Lagen</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">
            {stats.features > 1000
              ? `${(stats.features / 1000).toFixed(1)}k`
              : stats.features}
          </div>
          <div className="text-[10px] text-muted-foreground">Features</div>
        </div>
      </div>

      {/* Search & Expand/Collapse controls */}
      <div className="shrink-0 border-b px-3 py-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Zoek lagen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 pr-8 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={expandAll}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <ChevronsUpDown className="h-3 w-3" />
                <span>Alles uitklappen</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Alle categorieën uitklappen</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={collapseAll}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <ChevronsDownUp className="h-3 w-3" />
                <span>Alles inklappen</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Alle categorieën inklappen</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Layers - native scroll for reliable scrolling */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="px-2 py-2">
          {grouped.map(({ category, label, icon, layers: catLayers }) => {
            if (isSearching && catLayers.length === 0) return null;

            const CatIcon = ICON_MAP[icon] || Layers;
            const expanded = isSearching || expandedCategories.has(category);
            const activeCount = catLayers.filter((l) => l.visible).length;

            return (
              <div key={category} className="mb-1">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
                >
                  {expanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <CatIcon className="h-4 w-4" />
                  <span className="flex-1 text-left">{label}</span>
                  {activeCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px]"
                    >
                      {activeCount}
                    </Badge>
                  )}
                </button>

                {expanded && (
                  <div className="ml-3 space-y-0.5 pb-1">
                    {catLayers.map((layer) => (
                      <LayerRow
                        key={layer.id}
                        layer={layer}
                        onToggle={toggleLayer}
                        onFetchFull={fetchFullLayer}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <Separator className="shrink-0" />
      <div className="shrink-0 px-4 py-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Info className="h-3 w-3" />
          <span>
            Bronnen: Gemeente Zwolle GIS, PDOK, CBS, ProRail, Geoportaal
            Overijssel, OSM, pakketpuntenviewer.nl
          </span>
        </div>
      </div>
    </div>
  );
}
