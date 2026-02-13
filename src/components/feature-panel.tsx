"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
// Using native scroll instead of ScrollArea for reliable scrolling
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { FeatureInfo } from "./map-view";

interface FeaturePanelProps {
  feature: FeatureInfo;
  onClose: () => void;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Ja" : "Nee";
  if (typeof value === "number") {
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

export default function FeaturePanel({ feature, onClose }: FeaturePanelProps) {
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

  return (
    <div className="absolute bottom-4 right-4 z-20 w-80 rounded-lg border bg-background/95 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <Badge variant="secondary" className="mb-1 text-[10px]">
            {feature.layerName}
          </Badge>
          <h3 className="text-sm font-semibold">Feature Details</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <div className="max-h-72 overflow-y-auto overscroll-contain">
        <div className="px-4 py-2 space-y-1">
          {entries.map(([key, val]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-2 py-1 text-xs"
            >
              <span className="text-muted-foreground shrink-0 max-w-[40%] truncate">
                {formatKey(key)}
              </span>
              <span className="text-right font-medium break-all">
                {formatValue(val)}
              </span>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Geen eigenschappen beschikbaar
            </p>
          )}
        </div>
      </div>
      <Separator />
      <div className="px-4 py-2 text-[10px] text-muted-foreground">
        {feature.coordinates[1].toFixed(5)}, {feature.coordinates[0].toFixed(5)}
      </div>
    </div>
  );
}
