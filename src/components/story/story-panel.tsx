"use client";

/**
 * StoryPanel — storymap-verhaalpagina voor één datalaag.
 *
 * Het verhaal (StoryDefinition) is per laag hetzelfde voor alle gemeenten;
 * alle statistieken en grafieken worden hier live berekend uit de geladen
 * features van de actieve gemeente, zodat elke gemeente z'n eigen cijfers
 * ziet. Geopend vanuit het FeaturePanel na klik op een feature.
 */

import { useMemo } from "react";
import { BookOpen, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarkdownLite } from "@/components/markdown-lite";
import type { StoryDefinition, ChartSpec } from "@/lib/stories/types";
import {
  computeStat,
  computeCategoryBar,
  computeHistogram,
  interpolate,
  formatNumber,
} from "@/lib/stories/compute";
import {
  StatRow,
  CategoryBarChart,
  HistogramChart,
  layerSeriesColor,
} from "@/components/story/story-charts";
import type { LayerState } from "@/lib/use-layers";
import type { CityConfig } from "@/lib/cities";

interface StoryPanelProps {
  story: StoryDefinition;
  layer: LayerState;
  city: CityConfig;
  onClose: () => void;
}

function RenderChart({
  spec,
  features,
  vars,
  color,
}: {
  spec: ChartSpec;
  features: GeoJSON.Feature[];
  vars: { city: string; count: number };
  /** Seriekleur, gesynchroniseerd met de laagkleur uit de sidebar. */
  color: string;
}) {
  switch (spec.kind) {
    case "stat-row": {
      const stats = spec.stats
        .map((s) => computeStat(features, s))
        .filter((s): s is NonNullable<typeof s> => s !== null);
      return stats.length > 0 ? <StatRow stats={stats} /> : null;
    }
    case "category-bar": {
      const data = computeCategoryBar(features, spec);
      return data ? (
        <CategoryBarChart
          title={interpolate(spec.title, vars)}
          description={spec.description}
          data={data}
          color={color}
        />
      ) : null;
    }
    case "histogram": {
      const data = computeHistogram(features, spec);
      return data ? (
        <HistogramChart
          title={interpolate(spec.title, vars)}
          description={spec.description}
          unit={spec.unit}
          data={data}
          color={color}
        />
      ) : null;
    }
  }
}

export default function StoryPanel({
  story,
  layer,
  city,
  onClose,
}: StoryPanelProps) {
  const features = useMemo(
    () => layer.data?.features ?? [],
    [layer.data]
  );
  const vars = useMemo(
    () => ({ city: city.name, count: features.length }),
    [city.name, features.length]
  );
  const seriesColor = useMemo(() => layerSeriesColor(layer.color), [layer.color]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">
                <BookOpen className="mr-1 h-3 w-3" />
                Storymap
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {layer.name}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold leading-tight">
              {interpolate(story.title, vars)}
            </h2>
            {story.subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {interpolate(story.subtitle, vars)}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollbare verhaalinhoud */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
          <MarkdownLite
            text={interpolate(story.intro, vars)}
            className="text-sm leading-relaxed text-foreground/90"
          />

          <div className="mt-4 space-y-3">
            {story.charts.map((spec, i) => (
              <RenderChart
                key={i}
                spec={spec}
                features={features}
                vars={vars}
                color={seriesColor}
              />
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {story.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="mb-1.5 text-sm font-semibold">
                  {interpolate(section.heading, vars)}
                </h3>
                <MarkdownLite
                  text={interpolate(section.body, vars)}
                  className="text-[13px] leading-relaxed text-foreground/85"
                />
              </section>
            ))}
          </div>

          {story.links && story.links.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Bronnen &amp; verder lezen
                </p>
                {story.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {link.label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer: databasis-verantwoording */}
        <div className="shrink-0 border-t px-5 py-2.5 text-[10px] leading-snug text-muted-foreground">
          Statistieken berekend uit {formatNumber(features.length)} geladen{" "}
          {features.length === 1 ? "object" : "objecten"} van de laag &ldquo;
          {layer.name}&rdquo; binnen het kaartgebied van {city.name}
          {layer.fetchMode === "limited"
            ? " (beperkte lading — activeer 'alles laden' voor het volledige beeld)"
            : ""}
          . Bron: {layer.source}.
        </div>
    </div>
  );
}
