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
  Wind,
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
  PaintBucket,
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
  Truck,
  Mountain,
  Pipette,
  Smile,
  Activity,
  Spline,
  Globe2,
  Mailbox,
  Hourglass,
  Building,
  Hash,
  Type,
  AlertTriangle,
  X,
  ChevronsUpDown,
  ChevronsDownUp,
  ArrowDownAZ,
  ArrowUpZA,
  Download,
  CheckCircle2,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { Lock, Unlock, Lock as LockIcon } from "lucide-react";
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
import type { ColorMode } from "@/lib/data-sources/types";
import type { CityConfig } from "@/lib/cities";
import { formatFreshness, FRESHNESS_COLORS } from "@/lib/freshness";

const ICON_MAP: Record<string, LucideIcon> = {
  TrafficCone,
  Building2,
  TreePine,
  MapPin,
  Leaf,
  Store,
  Home,
  Landmark,
  Layers,
  Wind,
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
  Truck,
  Mountain,
  Pipette,
  Smile,
  Activity,
  Spline,
  Globe2,
  Mailbox,
  Hourglass,
  Building,
  Hash,
  Type,
  AlertTriangle,
  Lock: LockIcon,
};

interface SidebarProps {
  layers: LayerState[];
  toggleLayer: (id: string, opts?: { full?: boolean }) => void;
  fetchFullLayer: (id: string) => void;
  cycleColorMode: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  stats: {
    total: number;
    active: number;
    loaded: number;
    loading: number;
    features: number;
  };
  city: CityConfig;
}

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

function footerSources(city: CityConfig): string {
  const base = ["PDOK", "CBS", "ProRail", "OSM", "NDW", "RIVM", "RCE"];
  if (city.slug === "zwolle") {
    return `Bronnen: Gemeente Zwolle GIS, ${base.join(", ")}, Geoportaal Overijssel, pakketpuntenviewer.nl`;
  }
  if (city.slug === "helmond") {
    return `Bronnen: Open Data Helmond, ${base.join(", ")}, Atlas Brabant`;
  }
  if (city.slug === "apeldoorn") {
    return `Bronnen: Staat van Apeldoorn, ${base.join(", ")}, Geoportaal Gelderland`;
  }
  return `Bronnen: ${base.join(", ")}`;
}

// Memoized layer row to avoid re-rendering all rows on any state change
const LayerRow = memo(function LayerRow({
  layer,
  onToggle,
  onFetchFull,
  onCycleColorMode,
  onSetOpacity,
}: {
  layer: LayerState;
  onToggle: (id: string, opts?: { full?: boolean }) => void;
  onFetchFull: (id: string) => void;
  onCycleColorMode: (id: string) => void;
  onSetOpacity: (id: string, opacity: number) => void;
}) {
  const [controlsOpen, setControlsOpen] = useState(false);
  const LayerIcon = ICON_MAP[layer.icon] || Layers;

  const isTruncated =
    layer.visible &&
    layer.defaultLimit != null &&
    layer.featureCount >= layer.defaultLimit &&
    layer.fetchMode !== "full";

  const isFullLoaded = layer.fetchMode === "full" && layer.featureCount > 0;
  const isStub = layer.availability === "stub";

  // Categorical layers with explicit colorMap always render via the legend —
  // no point in offering an auto-bucket toggle.
  const hasCategoricalMap = !!layer.colorMap;
  // Vector tiles have no client-side feature data; auto-bucket can't run.
  const isVectorTile = !!layer.vectorTile;
  const colorModeAvailable = !hasCategoricalMap && !isVectorTile && !isStub;
  const inBucketMode = layer.colorMode === "auto-bucket";
  const bucketActive = colorModeAvailable && inBucketMode && !!layer.bucketScale;

  let colorBtnTitle: string;
  if (hasCategoricalMap) {
    colorBtnTitle = "Vaste legenda (categorisch)";
  } else if (isVectorTile) {
    colorBtnTitle = "Vector tile — geen automatische kleur mogelijk";
  } else if (bucketActive) {
    colorBtnTitle = `Kleur op waarde: ${layer.bucketScale!.property}`;
  } else if (inBucketMode) {
    colorBtnTitle = "Kleur op waarde (geen geschikte numerieke kolom)";
  } else {
    colorBtnTitle = "Klik om op waarde te kleuren";
  }

  return (
    <>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
            isStub
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-accent/50 cursor-pointer"
          }`}
          onClick={(e) => {
            if (isStub) return;
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
          <span className="flex-1 truncate text-xs">
            {layer.name}
            {layer.isNew && (
              <span className="ml-1 text-amber-400 font-bold" title="Nieuw (MiniGIM)">✦</span>
            )}
          </span>

          {layer.loading && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
          {layer.error && (
            <AlertCircle className="h-3 w-3 text-destructive" />
          )}

          {/* Feature count with truncation indicator */}
          {layer.featureCount > 0 && !isTruncated && !isFullLoaded && (
            <span className={`text-[10px] tabular-nums ${layer.visible ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
              {formatCount(layer.featureCount)}
            </span>
          )}
          {isTruncated && !layer.loading && (
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
          )}
          {isFullLoaded && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground tabular-nums">
              {formatCount(layer.featureCount)}
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
            </span>
          )}

          {/* Per-layer controls toggle (opacity + colour mode) */}
          <button
            type="button"
            disabled={isStub}
            onClick={(e) => {
              e.stopPropagation();
              if (isStub) return;
              setControlsOpen((o) => !o);
            }}
            title="Laaginstellingen (opaciteit, kleur)"
            aria-label="Laaginstellingen"
            aria-expanded={controlsOpen}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors ${
              isStub
                ? "opacity-30 cursor-not-allowed"
                : controlsOpen
                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                  : bucketActive || layer.opacity < 1
                    ? "bg-primary/10 text-primary/80 hover:bg-primary/20"
                    : "text-muted-foreground/60 hover:bg-accent hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-3 w-3" />
          </button>

          {isStub ? (
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground border rounded px-1 py-0.5">
              Stub
            </span>
          ) : (
            <Switch
              checked={layer.visible}
              onCheckedChange={() => onToggle(layer.id)}
              onClick={(e) => e.stopPropagation()}
              className="scale-75"
            />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        align="start"
        arrowClassName="bg-background fill-background"
        className="max-w-sm bg-background text-foreground border border-border shadow-xl p-0"
      >
        <div className="px-3 py-2">
          <p className="text-xs font-semibold leading-snug">{layer.description}</p>
        </div>
        <div className="border-t border-border/50 px-3 py-2 space-y-1">
          {layer.sourceUrl ? (
            <a
              href={layer.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              {layer.source}
            </a>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              {layer.source}
            </p>
          )}
          {layer.endpoint && (
            <a
              href={layer.endpoint.startsWith("http") ? layer.endpoint : `https://${layer.endpoint}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block text-[10px] text-muted-foreground/60 truncate hover:text-primary transition-colors"
            >
              {layer.endpoint}
            </a>
          )}
          {layer.freshness && layer.freshness.frequency !== "unknown" && (
            <p
              className={`inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none ${
                FRESHNESS_COLORS[layer.freshness.frequency].bg
              } ${FRESHNESS_COLORS[layer.freshness.frequency].text} ${
                FRESHNESS_COLORS[layer.freshness.frequency].border
              }`}
            >
              {formatFreshness(layer.freshness)}
            </p>
          )}
          {layer.featureCount > 0 && (
            <p className="text-[10px] text-muted-foreground">
              {layer.featureCount.toLocaleString("nl-NL")} features
              {isTruncated && " (afgekapt)"}
              {isFullLoaded && " (volledig)"}
            </p>
          )}
          {bucketActive && layer.bucketScale && (
            <p className="text-[10px] text-primary/80">
              Kleur op:{" "}
              <span className="font-mono">{layer.bucketScale.property}</span>{" "}
              ({layer.bucketScale.colors.length} buckets)
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
    {controlsOpen && !isStub && (
      <div className="ml-7 mr-2 mb-1 rounded-md border bg-muted/30 px-3 py-2 space-y-2 text-[11px]">
        {/* Opacity */}
        <div className="flex items-center gap-2">
          <Droplets className="h-3 w-3 shrink-0 text-muted-foreground" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={layer.opacity}
            onChange={(e) => onSetOpacity(layer.id, parseFloat(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 accent-primary"
            aria-label="Laagdekking"
          />
          <span className="tabular-nums w-9 text-right text-muted-foreground">
            {Math.round(layer.opacity * 100)}%
          </span>
        </div>

        {/* Colour mode */}
        <div className="flex items-center gap-1.5">
          <Palette className="h-3 w-3 shrink-0 text-muted-foreground" />
          <div className="flex flex-1 items-center gap-1 rounded-md bg-background p-0.5">
            <button
              type="button"
              disabled={!colorModeAvailable}
              onClick={(e) => {
                e.stopPropagation();
                if (colorModeAvailable && layer.colorMode !== "single") {
                  onCycleColorMode(layer.id);
                }
              }}
              aria-pressed={layer.colorMode === "single"}
              className={`flex flex-1 items-center justify-center gap-1 rounded px-2 py-0.5 transition-colors ${
                !colorModeAvailable
                  ? "opacity-30 cursor-not-allowed"
                  : layer.colorMode === "single"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Eén kleur
            </button>
            <button
              type="button"
              disabled={!colorModeAvailable}
              title={colorBtnTitle}
              onClick={(e) => {
                e.stopPropagation();
                if (colorModeAvailable && layer.colorMode !== "auto-bucket") {
                  onCycleColorMode(layer.id);
                }
              }}
              aria-pressed={bucketActive}
              className={`flex flex-1 items-center justify-center gap-1 rounded px-2 py-0.5 transition-colors ${
                !colorModeAvailable
                  ? "opacity-30 cursor-not-allowed"
                  : bucketActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <PaintBucket className="h-2.5 w-2.5" />
              Op waarde
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
});

export default function Sidebar({
  layers,
  toggleLayer,
  fetchFullLayer,
  cycleColorMode,
  setLayerOpacity,
  stats,
  city,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Set<LayerCategory>
  >(new Set(Object.keys(CATEGORIES) as LayerCategory[]));
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"default" | "az" | "za">("default");
  const [accessFilter, setAccessFilter] = useState<"all" | "open" | "restricted">("all");

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
      let catLayers = layers.filter((l) => l.category === cat);
      if (accessFilter !== "all") {
        catLayers = catLayers.filter((l) =>
          accessFilter === "restricted"
            ? l.accessType === "restricted"
            : (l.accessType ?? "open") === "open"
        );
      }
      const filteredLayers = query
        ? catLayers.filter(
            (l) =>
              l.name.toLowerCase().includes(query) ||
              l.description.toLowerCase().includes(query)
          )
        : catLayers;
      const sortedLayers = sortOrder === "default"
        ? filteredLayers
        : [...filteredLayers].sort((a, b) =>
            sortOrder === "az"
              ? a.name.localeCompare(b.name, "nl")
              : b.name.localeCompare(a.name, "nl")
          );
      return {
        category: cat,
        ...CATEGORIES[cat],
        layers: sortedLayers,
      };
    });
  }, [layers, searchQuery, allCategories, sortOrder, accessFilter]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">
            {city.name}
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Basis Stadstwin — open data op de kaart
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
          <div className="ml-auto flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSortOrder((s) => s === "az" ? "default" : "az")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] transition-colors ${sortOrder === "az" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                >
                  <ArrowDownAZ className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">A-Z sorteren</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSortOrder((s) => s === "za" ? "default" : "za")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] transition-colors ${sortOrder === "za" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                >
                  <ArrowUpZA className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Z-A sorteren</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Access type filter */}
      <div className="shrink-0 border-b px-3 py-2">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
          {([
            { value: "all", label: "Alle", icon: null },
            { value: "open", label: "Open", icon: Unlock },
            { value: "restricted", label: "API-key", icon: Lock },
          ] as const).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setAccessFilter(value)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                accessFilter === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {label}
            </button>
          ))}
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
                        onCycleColorMode={cycleColorMode}
                        onSetOpacity={setLayerOpacity}
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
          <span>{footerSources(city)}</span>
        </div>
      </div>
    </div>
  );
}
