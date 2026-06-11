"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  PanelLeftOpen,
  PanelLeftClose,
  Layers,
  Loader2,
  MapIcon,
  Palette,
  PaintBucket,
  Droplets,
  Bot,
  Box,
  Building2,
  Mountain,
  Square,
  CalendarDays,
  Zap,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import FeaturePanel from "@/components/feature-panel";
import AssistantPanel, { type LayerApplyMode } from "@/components/assistant/assistant-panel";
import { useLayers } from "@/lib/use-layers";
import { useIsMobile } from "@/lib/use-mobile";
import type {
  FeatureInfo,
  BasemapId,
  FlyTarget,
  View3DMode,
  View3DColorMode,
} from "@/components/map-view";
import { BASEMAPS, BOUWJAAR_LEGEND, ENERGY_LABEL_LEGEND } from "@/components/map-view";
import AddressSearch from "@/components/address-search";
import type { CityConfig } from "@/lib/cities";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface CityMapProps {
  city: CityConfig;
}

export default function CityMap({ city }: CityMapProps) {
  const {
    layers,
    toggleLayer,
    fetchFullLayer,
    visibleLayers,
    stats,
    cycleColorMode,
    setLayerOpacity: setPerLayerOpacity,
    globalDefaultColorMode,
    setGlobalDefaultColorMode,
  } = useLayers(city);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<FeatureInfo | null>(null);
  const [basemapId, setBasemapId] = useState<BasemapId>("dark");
  const [showBasemapPicker, setShowBasemapPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOpacityPicker, setShowOpacityPicker] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(1);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [view3D, setView3D] = useState<View3DMode>("off");
  const [view3DColor, setView3DColor] = useState<View3DColorMode>("standaard");
  const [show3DPicker, setShow3DPicker] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const [energyLabels, setEnergyLabels] = useState<Record<string, string> | null>(null);
  const [energyLabelsLoading, setEnergyLabelsLoading] = useState(false);
  // Cities with a pand-level energy label source (see /api/energielabels-pand).
  const supportsEnergyLabels = city.slug === "zwolle";

  // Lazily fetch the pand -> energy label map the first time the mode is
  // selected. The first call can take a while (the API joins two municipal
  // ArcGIS services); afterwards it is served from the server-side cache.
  const energyLabelsRequestedRef = useRef(false);
  useEffect(() => {
    if (view3DColor !== "energielabel" || energyLabelsRequestedRef.current) return;
    energyLabelsRequestedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnergyLabelsLoading(true);
    fetch(`/api/energielabels-pand?city=${city.slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => setEnergyLabels(d.pandLabels ?? {}))
      .catch(() => setEnergyLabels({}))
      .finally(() => setEnergyLabelsLoading(false));
  }, [view3DColor, city.slug]);
  const isMobile = useIsMobile();

  const visibleLayerIds = useMemo(
    () => layers.filter((l) => l.visible).map((l) => l.id),
    [layers]
  );

  const handleApplyLayers = useCallback(
    (ids: string[], mode: LayerApplyMode) => {
      const wanted = new Set(ids);
      for (const l of layers) {
        if (l.availability === "stub") continue;
        const shouldBeOn =
          mode === "replace" ? wanted.has(l.id) : mode === "add" ? wanted.has(l.id) || l.visible : l.visible && !wanted.has(l.id);
        if (shouldBeOn !== l.visible) void toggleLayer(l.id);
      }
    },
    [layers, toggleLayer]
  );

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && isMobile) {
      // Sidebar starts closed on mobile; preserved from the original Zwolle viewer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
      initializedRef.current = true;
    }
  }, [isMobile]);

  const handleFeatureClick = useCallback(
    (info: FeatureInfo | null) => setSelectedFeature(info),
    []
  );

  const stableVisibleLayers = useMemo(() => visibleLayers, [visibleLayers]);

  // Resolve the active layer for the selected feature, so the feature panel
  // can show source / endpoint / description metadata. Falls back to the
  // layerName already on the feature if the lookup fails.
  const activeLayer = useMemo(() => {
    if (!selectedFeature) return null;
    return (
      layers.find((l) => l.id === selectedFeature.layerId) ??
      layers.find((l) => l.name === selectedFeature.layerName) ??
      null
    );
  }, [selectedFeature, layers]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {!isMobile && (
        <div
          className={`shrink-0 border-r transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          <Sidebar
            layers={layers}
            toggleLayer={toggleLayer}
            fetchFullLayer={fetchFullLayer}
            cycleColorMode={cycleColorMode}
            setLayerOpacity={setPerLayerOpacity}
            stats={stats}
            city={city}
          />
        </div>
      )}

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" showCloseButton={false} className="w-[85vw] max-w-80 p-0">
            <SheetTitle className="sr-only">Lagen</SheetTitle>
            <Sidebar
              layers={layers}
              toggleLayer={toggleLayer}
              fetchFullLayer={fetchFullLayer}
              cycleColorMode={cycleColorMode}
              setLayerOpacity={setPerLayerOpacity}
              stats={stats}
              city={city}
            />
          </SheetContent>
        </Sheet>
      )}

      <div className="relative flex-1 min-w-0">
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-3 top-3 z-10 h-9 w-9 shadow-md"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          {sidebarOpen && !isMobile ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        {stats.loading > 0 && (
          <div className="absolute left-14 top-3 z-10 flex items-center gap-2 rounded-md bg-background/90 px-3 py-1.5 text-xs shadow-md backdrop-blur-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Laden...</span>
          </div>
        )}

        <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
          <AddressSearch
            onSelect={(lng, lat) => setFlyTarget({ lng, lat, zoom: 17 })}
            onClear={() => setFlyTarget(null)}
          />
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md bg-background/90 px-3 py-1.5 text-xs shadow-md backdrop-blur-sm">
            <Layers className="h-3.5 w-3.5" />
            <span>
              {stats.active} / {stats.total} lagen
            </span>
          </div>
          <Button
            variant={assistantOpen ? "default" : "secondary"}
            size="sm"
            className="h-8 shadow-md"
            onClick={() => setAssistantOpen((o) => !o)}
            title="AI-assistent"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Assistent</span>
          </Button>
        </div>

        <div className="absolute left-3 bottom-8 z-10 flex flex-col gap-2">
          {/* Toggle value labels next to every feature on the map */}
          <Button
            variant={showValues ? "default" : "secondary"}
            size="icon"
            className="h-9 w-9 shadow-md"
            title="Waarden op de kaart"
            onClick={() => setShowValues((v) => !v)}
          >
            <Tags className="h-4 w-4" />
          </Button>

          {/* 3D digital twin picker — PDOK 3D tiles cover all of NL */}
          <div className="relative">
              <Button
                variant={view3D !== "off" ? "default" : "secondary"}
                size="icon"
                className="h-9 w-9 shadow-md"
                title="3D weergave"
                onClick={() => {
                  setShow3DPicker((o) => !o);
                  setShowOpacityPicker(false);
                  setShowColorPicker(false);
                  setShowBasemapPicker(false);
                }}
              >
                <Box className="h-4 w-4" />
              </Button>
              {show3DPicker && (
                <div className="absolute bottom-0 left-11 flex flex-col gap-1 rounded-lg bg-background/95 p-2 shadow-xl backdrop-blur-md border whitespace-nowrap">
                  {(
                    [
                      { mode: "off", label: "2D kaart", icon: Square },
                      { mode: "buildings", label: "3D gebouwen", icon: Building2 },
                      { mode: "twin", label: "Digital twin (gebouwen + terrein)", icon: Mountain },
                    ] as const
                  ).map(({ mode, label, icon: Icon }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setView3D(mode);
                        setShow3DPicker(false);
                      }}
                      aria-pressed={view3D === mode}
                      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-left transition-colors ${
                        view3D === mode
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                  {view3D !== "off" && (
                    <>
                      <div className="mt-1 border-t pt-1.5 px-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Inkleuring gebouwen
                      </div>
                      {(
                        [
                          { mode: "standaard", label: "Standaard", icon: Palette, show: true },
                          { mode: "bouwjaar", label: "Bouwjaar", icon: CalendarDays, show: true },
                          {
                            mode: "energielabel",
                            label: energyLabelsLoading ? "Energielabel (laden...)" : "Energielabel",
                            icon: Zap,
                            show: supportsEnergyLabels,
                          },
                        ] as const
                      )
                        .filter((o) => o.show)
                        .map(({ mode, label, icon: Icon }) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setView3DColor(mode)}
                            aria-pressed={view3DColor === mode}
                            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-left transition-colors ${
                              view3DColor === mode
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </button>
                        ))}
                    </>
                  )}
                </div>
              )}
          </div>

          {/* Opacity slider — controls global multiplier on data layers */}
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 shadow-md"
              title="Laagdekking"
              onClick={() => {
                setShowOpacityPicker((o) => !o);
                setShowColorPicker(false);
                setShowBasemapPicker(false);
                setShow3DPicker(false);
              }}
            >
              <Droplets className="h-4 w-4" />
            </Button>
            {showOpacityPicker && (
              <div className="absolute bottom-0 left-11 flex items-center gap-2 rounded-lg bg-background/95 p-3 shadow-xl backdrop-blur-md border whitespace-nowrap">
                <span className="text-[11px] text-muted-foreground">0%</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={layerOpacity}
                  onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                  className="w-40 accent-primary"
                  aria-label="Laagdekking"
                />
                <span className="text-[11px] tabular-nums w-9 text-right">
                  {Math.round(layerOpacity * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Color-mode picker — submenu with Single / On-value */}
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 shadow-md"
              title="Kleurmodus"
              onClick={() => {
                setShowColorPicker((o) => !o);
                setShowOpacityPicker(false);
                setShowBasemapPicker(false);
                setShow3DPicker(false);
              }}
            >
              <PaintBucket className="h-4 w-4" />
            </Button>
            {showColorPicker && (
              <div className="absolute bottom-0 left-11 flex flex-col gap-1 rounded-lg bg-background/95 p-2 shadow-xl backdrop-blur-md border whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    setGlobalDefaultColorMode("single");
                    setShowColorPicker(false);
                  }}
                  aria-pressed={globalDefaultColorMode === "single"}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-left transition-colors ${
                    globalDefaultColorMode === "single"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <Palette className="h-3.5 w-3.5" />
                  Eén kleur
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGlobalDefaultColorMode("auto-bucket");
                    setShowColorPicker(false);
                  }}
                  aria-pressed={globalDefaultColorMode === "auto-bucket"}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-left transition-colors ${
                    globalDefaultColorMode === "auto-bucket"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <PaintBucket className="h-3.5 w-3.5" />
                  Op waarde
                </button>
              </div>
            )}
          </div>

          {/* Basemap picker */}
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 shadow-md"
              title="Achtergrondkaart"
              onClick={() => {
                setShowBasemapPicker((o) => !o);
                setShowColorPicker(false);
                setShowOpacityPicker(false);
                setShow3DPicker(false);
              }}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
            {showBasemapPicker && (
              <div className="absolute bottom-0 left-11 flex flex-col gap-1 rounded-lg bg-background/95 p-2 shadow-xl backdrop-blur-md border max-h-80 overflow-y-auto">
                {BASEMAPS.map((bm) => (
                  <button
                    key={bm.id}
                    onClick={() => {
                      setBasemapId(bm.id);
                      setShowBasemapPicker(false);
                    }}
                    className={`rounded-md px-3 py-1.5 text-xs text-left transition-colors whitespace-nowrap ${
                      basemapId === bm.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {bm.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend for the active 3D color mode, with value-labels toggle */}
        {view3D !== "off" && view3DColor !== "standaard" && (
          <div className="absolute bottom-8 right-14 z-10 w-44 rounded-lg border bg-background/95 p-3 shadow-xl backdrop-blur-md">
            <div className="mb-2 text-xs font-semibold">
              {view3DColor === "bouwjaar" ? "Bouwjaar" : "Energielabel"}
            </div>
            <div className="flex flex-col gap-1">
              {(view3DColor === "bouwjaar" ? BOUWJAAR_LEGEND : ENERGY_LABEL_LEGEND).map(
                (entry) => (
                  <div key={entry.label} className="flex items-center gap-2 text-[11px]">
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: `rgb(${entry.color.join(",")})` }}
                    />
                    {entry.label}
                  </div>
                )
              )}
            </div>
            <label className="mt-2 flex cursor-pointer items-center gap-2 border-t pt-2 text-[11px]">
              <input
                type="checkbox"
                checked={showValues}
                onChange={(e) => setShowValues(e.target.checked)}
                className="accent-primary"
              />
              Waarden op de kaart
            </label>
          </div>
        )}

        <MapView
          visibleLayers={stableVisibleLayers}
          basemapId={basemapId}
          onFeatureClick={handleFeatureClick}
          flyTarget={flyTarget}
          initialCenter={city.center}
          initialZoom={city.initialZoom}
          layerOpacity={layerOpacity}
          view3D={view3D}
          view3DColor={view3DColor}
          energyLabelsByPand={energyLabels}
          showValues={showValues}
        />

        {/* AI assistant — small floating panel; sits above all map controls. */}
        {assistantOpen && (
          <div className="absolute right-3 top-3 bottom-3 z-40 flex w-[19rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-lg border bg-background shadow-2xl">
            <AssistantPanel
              compact
              city={city.slug}
              activeLayers={visibleLayerIds}
              onApplyLayers={handleApplyLayers}
              onClose={() => setAssistantOpen(false)}
            />
          </div>
        )}

        {/* Mobile: feature details overlay from the bottom */}
        {selectedFeature && isMobile && (
          <div className="absolute bottom-0 left-0 right-0 z-20 max-h-[60vh] rounded-t-lg border-t bg-background/95 shadow-xl backdrop-blur-md">
            <FeaturePanel
              feature={selectedFeature}
              layer={activeLayer}
              onClose={() => setSelectedFeature(null)}
            />
          </div>
        )}
      </div>

      {/* Desktop: feature details as a fixed-width right side panel */}
      {!isMobile && (
        <div
          className={`shrink-0 border-l transition-all duration-300 ease-in-out overflow-hidden ${
            selectedFeature ? "w-96" : "w-0"
          }`}
        >
          {selectedFeature && (
            <FeaturePanel
              feature={selectedFeature}
              layer={activeLayer}
              onClose={() => setSelectedFeature(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
