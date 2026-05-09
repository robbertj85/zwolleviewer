"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import type { CityConfig } from "./cities";
import type { DataSource } from "./data-sources";
import type { ColorMode } from "./data-sources/types";
import { buildDataSources } from "./data-sources";
import {
  computeAutoBucketScale,
  type BucketScale,
} from "./color-buckets";

export interface LayerState extends DataSource {
  data: GeoJSON.FeatureCollection | null;
  error: string | null;
  featureCount: number;
  fetchMode: "limited" | "full";
  /** Per-layer opacity (0..1). Default 1. Multiplied with the global layerOpacity. */
  opacity: number;
  /** Resolved colour mode (per-layer override OR inherited global default). */
  colorMode: ColorMode;
  /** Whether the user has explicitly set this layer's colour mode (overrides global). */
  colorModeOverridden: boolean;
  /**
   * Auto-computed bucket scale for the current feature data. Recomputed when
   * `data` changes; null when the layer is on `single` mode, has a
   * categorical `colorMap`, or no suitable numeric property was found.
   */
  bucketScale: BucketScale | null;
  /** The numeric property currently used for bucketing (mirrors bucketScale.property). */
  bucketProperty?: string;
}

function freshLayerState(
  sources: DataSource[],
  globalDefault: ColorMode
): LayerState[] {
  return sources.map((ds) => ({
    ...ds,
    data: null,
    error: null,
    featureCount: 0,
    fetchMode: "limited" as const,
    opacity: 1,
    colorMode: ds.colorMode ?? globalDefault,
    colorModeOverridden: ds.colorMode != null,
    bucketScale: null,
    bucketProperty: ds.bucketProperty,
  }));
}

/**
 * State for one city's layers. The consuming component MUST pass
 * `key={city.slug}` so React remounts the component (and the hook) on
 * city changes — that's how we cleanly drop the previous city's caches
 * without a setState-in-effect.
 */
export function useLayers(city: CityConfig) {
  const sources = useMemo(() => buildDataSources(city), [city]);

  const [globalDefaultColorMode, setGlobalDefaultColorMode] =
    useState<ColorMode>("single");

  const [layers, setLayers] = useState<LayerState[]>(() =>
    freshLayerState(sources, "single")
  );

  const fetchedRef = useRef<Set<string>>(new Set());
  const fullFetchedRef = useRef<Set<string>>(new Set());

  /**
   * Recompute the auto-bucket scale for a given layer state. Skip when:
   *  - mode is "single"
   *  - layer has a categorical colorMap (categorical wins)
   *  - layer is a vector tile (no client-side feature data)
   *  - layer has no data yet
   */
  const computeScale = useCallback((layer: LayerState): BucketScale | null => {
    if (layer.colorMode !== "auto-bucket") return null;
    if (layer.colorMap) return null;
    if (layer.vectorTile) return null;
    if (!layer.data || !layer.data.features) return null;
    return computeAutoBucketScale(layer.data.features, {
      property: layer.bucketProperty,
    });
  }, []);

  const toggleLayer = useCallback(
    async (id: string, opts?: { full?: boolean }) => {
      const layer = sources.find((d) => d.id === id);
      if (!layer) return;
      if (layer.availability === "stub") return; // stubs are not toggleable

      const full = opts?.full ?? false;
      const needsFetch = !fetchedRef.current.has(id);

      setLayers((prev) => {
        const current = prev.find((l) => l.id === id);
        if (!current) return prev;
        if (!current.visible && needsFetch) {
          return prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  visible: true,
                  loading: true,
                  fetchMode: full ? ("full" as const) : ("limited" as const),
                }
              : l
          );
        }
        return prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l));
      });

      if (!needsFetch) return;

      fetchedRef.current.add(id);
      if (full) fullFetchedRef.current.add(id);
      try {
        const data = await layer.fetchData(full);
        setLayers((prev) =>
          prev.map((l) => {
            if (l.id !== id) return l;
            const next: LayerState = {
              ...l,
              data,
              loading: false,
              featureCount: data.features.length,
              error: null,
              fetchMode: full ? ("full" as const) : ("limited" as const),
            };
            next.bucketScale = computeScale(next);
            if (next.bucketScale) next.bucketProperty = next.bucketScale.property;
            return next;
          })
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Fout bij laden";
        fetchedRef.current.delete(id);
        if (full) fullFetchedRef.current.delete(id);
        setLayers((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, loading: false, error: msg, data: null } : l
          )
        );
      }
    },
    [sources, computeScale]
  );

  const fetchFullLayer = useCallback(
    async (id: string) => {
      if (fullFetchedRef.current.has(id)) return;

      const layer = sources.find((d) => d.id === id);
      if (!layer) return;
      if (layer.availability === "stub") return;

      fullFetchedRef.current.add(id);
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, loading: true } : l))
      );

      try {
        const data = await layer.fetchData(true);
        setLayers((prev) =>
          prev.map((l) => {
            if (l.id !== id) return l;
            const next: LayerState = {
              ...l,
              data,
              loading: false,
              featureCount: data.features.length,
              error: null,
              fetchMode: "full" as const,
            };
            next.bucketScale = computeScale(next);
            if (next.bucketScale) next.bucketProperty = next.bucketScale.property;
            return next;
          })
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Fout bij laden";
        fullFetchedRef.current.delete(id);
        setLayers((prev) =>
          prev.map((l) => (l.id === id ? { ...l, loading: false, error: msg } : l))
        );
      }
    },
    [sources, computeScale]
  );

  /**
   * Set the colour mode for a single layer. `null` clears the per-layer
   * override and re-inherits the current global default.
   */
  const setColorMode = useCallback(
    (id: string, mode: ColorMode | null) => {
      setLayers((prev) =>
        prev.map((l) => {
          if (l.id !== id) return l;
          const overridden = mode != null;
          const nextMode: ColorMode = mode ?? globalDefaultColorMode;
          const next: LayerState = {
            ...l,
            colorMode: nextMode,
            colorModeOverridden: overridden,
          };
          next.bucketScale = computeScale(next);
          if (next.bucketScale) next.bucketProperty = next.bucketScale.property;
          return next;
        })
      );
    },
    [computeScale, globalDefaultColorMode]
  );

  /**
   * Cycle colour modes per-layer ("single" → "auto-bucket" → back to global).
   * Designed for a single-button UI: each click toggles between the modes,
   * and consistently sets `colorModeOverridden=true`.
   */
  const cycleColorMode = useCallback(
    (id: string) => {
      setLayers((prev) =>
        prev.map((l) => {
          if (l.id !== id) return l;
          const nextMode: ColorMode =
            l.colorMode === "single" ? "auto-bucket" : "single";
          const next: LayerState = {
            ...l,
            colorMode: nextMode,
            colorModeOverridden: true,
          };
          next.bucketScale = computeScale(next);
          if (next.bucketScale) next.bucketProperty = next.bucketScale.property;
          return next;
        })
      );
    },
    [computeScale]
  );

  /**
   * Set per-layer opacity (0..1). Clamped on the spot.
   */
  const setLayerOpacity = useCallback((id: string, opacity: number) => {
    const clamped = Math.max(0, Math.min(1, opacity));
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity: clamped } : l))
    );
  }, []);

  /**
   * Flip the global default. Layers without an explicit per-layer override
   * inherit the new mode immediately; explicitly-overridden layers stay put.
   */
  const setGlobalDefaultColorModeAndApply = useCallback(
    (mode: ColorMode) => {
      setGlobalDefaultColorMode(mode);
      setLayers((prev) =>
        prev.map((l) => {
          if (l.colorModeOverridden) return l;
          if (l.colorMode === mode) return l;
          const next: LayerState = { ...l, colorMode: mode };
          next.bucketScale = computeScale(next);
          if (next.bucketScale) next.bucketProperty = next.bucketScale.property;
          return next;
        })
      );
    },
    [computeScale]
  );

  const visibleLayers = useMemo(
    () => layers.filter((l) => l.visible && (l.data || l.vectorTile)),
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

  return {
    layers,
    toggleLayer,
    fetchFullLayer,
    visibleLayers,
    stats,
    setColorMode,
    cycleColorMode,
    setLayerOpacity,
    globalDefaultColorMode,
    setGlobalDefaultColorMode: setGlobalDefaultColorModeAndApply,
  };
}
