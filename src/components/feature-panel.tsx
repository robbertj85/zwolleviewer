"use client";

import {
  Activity,
  Anchor,
  Calendar,
  CalendarClock,
  CircleDashed,
  Clock,
  ExternalLink,
  HelpCircle,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { FeatureInfo } from "./map-view";
import type { LayerState } from "@/lib/use-layers";
import { getSourceDocsLink } from "@/lib/source-docs";
import {
  formatFreshness,
  FRESHNESS_COLORS,
  FRESHNESS_ICON,
} from "@/lib/freshness";
import type { FreshnessMeta } from "@/lib/data-sources/types";

const FRESHNESS_ICON_COMPONENT: Record<string, LucideIcon> = {
  Zap,
  Activity,
  Clock,
  Calendar,
  CalendarClock,
  CircleDashed,
  Anchor,
  Users,
  HelpCircle,
};

function FreshnessBadge({ freshness }: { freshness: FreshnessMeta }) {
  const colors = FRESHNESS_COLORS[freshness.frequency];
  const Icon =
    FRESHNESS_ICON_COMPONENT[FRESHNESS_ICON[freshness.frequency]] ?? HelpCircle;
  const label = formatFreshness(freshness);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none ${colors.bg} ${colors.text} ${colors.border}`}
      title={
        freshness.note
          ? `${label} — ${freshness.note}`
          : `Update-frequentie: ${label}`
      }
    >
      <Icon className="h-2.5 w-2.5" />
      {label}
    </span>
  );
}

interface FeaturePanelProps {
  feature: FeatureInfo;
  /** The matching layer for this feature, used to render source/docs metadata.
   *  Pass `null` if the layer can no longer be resolved — the footer falls
   *  back to showing only the layer name. */
  layer?: LayerState | null;
  onClose: () => void;
}

const DATE_KEY_RE = /datum|date|tijd|time/i;

function isEpochMs(value: number): boolean {
  return value > 946684800000 && value < 4102444800000;
}

function formatValue(value: unknown, key?: string): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Ja" : "Nee";
  if (typeof value === "number") {
    if (Number.isInteger(value) && key && DATE_KEY_RE.test(key) && isEpochMs(value)) {
      return new Date(value).toLocaleDateString("nl-NL", {
        day: "numeric", month: "short", year: "numeric",
      });
    }
    if (Number.isInteger(value)) return value.toLocaleString("nl-NL");
    return value.toLocaleString("nl-NL", { maximumFractionDigits: 4 });
  }
  if (typeof value === "string" && value.length === 0) return "-";
  return String(value);
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (s) => s.toUpperCase());
}

function endpointAsUrl(endpoint: string): string {
  return endpoint.startsWith("http") ? endpoint : `https://${endpoint}`;
}

export default function FeaturePanel({ feature, layer, onClose }: FeaturePanelProps) {
  const entries = Object.entries(feature.properties).filter(
    ([key, val]) =>
      val !== null &&
      val !== undefined &&
      val !== "" &&
      !key.startsWith("_") &&
      key !== "SHAPE" &&
      key !== "shape" &&
      typeof val !== "object"
  );

  const docsLink = layer ? getSourceDocsLink(layer.source, layer.endpoint) : null;
  const hasFooterMeta = Boolean(
    layer && (layer.description || layer.source || layer.endpoint || docsLink)
  );

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 flex items-start justify-between gap-2 px-4 py-3 border-b">
        <div className="min-w-0 flex-1">
          <Badge variant="secondary" className="mb-1 text-[10px]">
            {feature.layerName}
          </Badge>
          <h3 className="text-sm font-semibold leading-tight">Feature Details</h3>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {entries.length} eigenschappen
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Properties — full-height scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="px-4 py-2">
          {entries.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Geen eigenschappen beschikbaar
            </p>
          ) : (
            <dl className="space-y-2">
              {entries.map(([key, val]) => (
                <div
                  key={key}
                  className="border-b border-border/40 pb-2 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {formatKey(key)}
                  </dt>
                  <dd className="mt-0.5 text-xs font-medium break-words">
                    {formatValue(val, key)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* Footer with coordinates */}
      <Separator />
      <div className="shrink-0 px-4 py-2 text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Coördinaten</span>
          <span className="font-mono">
            {feature.coordinates[1].toFixed(5)}, {feature.coordinates[0].toFixed(5)}
          </span>
        </div>
      </div>

      {/* Footer: source + documentation pointers */}
      {hasFooterMeta && (
        <>
          <Separator />
          <div className="shrink-0 px-4 py-2.5 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Bron &amp; documentatie
            </p>
            {layer?.description && (
              <p className="text-[11px] italic leading-snug text-muted-foreground">
                {layer.description}
              </p>
            )}
            {layer?.source && (
              <div className="flex items-start justify-between gap-2 text-[11px]">
                {layer.sourceUrl ? (
                  <a
                    href={layer.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {layer.source}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="font-medium text-foreground">{layer.source}</span>
                )}
                {layer.freshness && layer.freshness.frequency !== "unknown" && (
                  <FreshnessBadge freshness={layer.freshness} />
                )}
              </div>
            )}
            {layer?.endpoint && (
              <a
                href={endpointAsUrl(layer.endpoint)}
                target="_blank"
                rel="noopener noreferrer"
                title={layer.endpoint}
                className="block truncate font-mono text-[10px] text-muted-foreground/80 hover:text-primary transition-colors"
              >
                {layer.endpoint}
              </a>
            )}
            {docsLink && (
              <a
                href={docsLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {docsLink.label}
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
