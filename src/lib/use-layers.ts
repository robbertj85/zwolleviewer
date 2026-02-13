"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { DATA_SOURCES, DataSource } from "./data-sources";

export interface LayerState extends DataSource {
  data: GeoJSON.FeatureCollection | null;
  error: string | null;
  featureCount: number;
}

export function useLayers() {
  const [layers, setLayers] = useState<LayerState[]>(() =>
    DATA_SOURCES.map((ds) => ({
      ...ds,
      data: null,
      error: null,
      featureCount: 0,
    }))
  );

  const fetchedRef = useRef<Set<string>>(new Set());

  const toggleLayer = useCallback(async (id: string) => {
    const layer = DATA_SOURCES.find((d) => d.id === id);
    if (!layer) return;

    // Check if we need to fetch
    const needsFetch = !fetchedRef.current.has(id);

    setLayers((prev) => {
      const current = prev.find((l) => l.id === id);
      if (!current) return prev;

      // If turning ON and need to fetch, set loading + visible
      if (!current.visible && needsFetch) {
        return prev.map((l) =>
          l.id === id ? { ...l, visible: true, loading: true } : l
        );
      }
      // Otherwise just toggle visibility
      return prev.map((l) =>
        l.id === id ? { ...l, visible: !l.visible } : l
      );
    });

    if (!needsFetch) return;

    fetchedRef.current.add(id);
    try {
      const data = await layer.fetchData();
      setLayers((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                data,
                loading: false,
                featureCount: data.features.length,
                error: null,
              }
            : l
        )
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Fout bij laden";
      fetchedRef.current.delete(id);
      setLayers((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, loading: false, error: msg, data: null }
            : l
        )
      );
    }
  }, []);

  // Stable reference: only changes when the actual visible+loaded set changes
  const visibleLayers = useMemo(
    () => layers.filter((l) => l.visible && l.data),
    [layers]
  );

  const stats = useMemo(
    () => ({
      total: layers.length,
      active: layers.filter((l) => l.visible).length,
      loaded: layers.filter((l) => l.data !== null).length,
      loading: layers.filter((l) => l.loading).length,
      features: layers.reduce((sum, l) => sum + l.featureCount, 0),
    }),
    [layers]
  );

  return { layers, toggleLayer, visibleLayers, stats };
}
