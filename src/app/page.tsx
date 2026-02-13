"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  PanelLeftOpen,
  PanelLeftClose,
  Layers,
  Loader2,
  MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import FeaturePanel from "@/components/feature-panel";
import { useLayers } from "@/lib/use-layers";
import type { FeatureInfo, BasemapId } from "@/components/map-view";
import { BASEMAPS } from "@/components/map-view";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

export default function Home() {
  const { layers, toggleLayer, visibleLayers, stats } = useLayers();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<FeatureInfo | null>(
    null
  );
  const [basemapId, setBasemapId] = useState<BasemapId>("dark");
  const [showBasemapPicker, setShowBasemapPicker] = useState(false);

  const handleFeatureClick = useCallback(
    (info: FeatureInfo | null) => setSelectedFeature(info),
    []
  );

  const stableVisibleLayers = useMemo(() => visibleLayers, [visibleLayers]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar */}
      <div
        className={`shrink-0 border-r transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-80" : "w-0"
        } overflow-hidden`}
      >
        <Sidebar layers={layers} toggleLayer={toggleLayer} stats={stats} />
      </div>

      {/* Map */}
      <div className="relative flex-1 min-w-0">
        {/* Sidebar toggle */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-3 top-3 z-10 h-9 w-9 shadow-md"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        {/* Active layers indicator */}
        {stats.loading > 0 && (
          <div className="absolute left-14 top-3 z-10 flex items-center gap-2 rounded-md bg-background/90 px-3 py-1.5 text-xs shadow-md backdrop-blur-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Laden...</span>
          </div>
        )}

        {/* Layer count badge */}
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md bg-background/90 px-3 py-1.5 text-xs shadow-md backdrop-blur-sm">
          <Layers className="h-3.5 w-3.5" />
          <span>
            {stats.active} / {stats.total} lagen
          </span>
        </div>

        {/* Basemap switcher */}
        <div className="absolute left-3 bottom-8 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 shadow-md"
            onClick={() => setShowBasemapPicker((o) => !o)}
          >
            <MapIcon className="h-4 w-4" />
          </Button>
          {showBasemapPicker && (
            <div className="absolute bottom-11 left-0 flex flex-col gap-1 rounded-lg bg-background/95 p-2 shadow-xl backdrop-blur-md border">
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

        <MapView
          visibleLayers={stableVisibleLayers}
          basemapId={basemapId}
          onFeatureClick={handleFeatureClick}
        />

        {/* Feature detail panel */}
        {selectedFeature && (
          <FeaturePanel
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </div>
    </div>
  );
}
