"use client";

import { useState } from "react";
import { Eye, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResponsePreviewProps {
  apiEndpoint: string;
  layerName: string;
}

export default function ResponsePreview({ apiEndpoint, layerName }: ResponsePreviewProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async () => {
    if (open) {
      setOpen(false);
      return;
    }

    if (data) {
      setOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiEndpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // Truncate to 3 features
      if (json.features && json.features.length > 3) {
        json.features = json.features.slice(0, 3);
        json._truncated = `Showing 3 of ${res.headers.get("X-Feature-Count") || "many"} features`;
      }

      setData(JSON.stringify(json, null, 2));
      setOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs gap-1.5"
        onClick={handlePreview}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : open ? (
          <X className="h-3 w-3" />
        ) : (
          <Eye className="h-3 w-3" />
        )}
        {open ? "Sluiten" : "Preview"}
      </Button>

      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}

      {open && data && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Response — {layerName}
            </span>
          </div>
          <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-[11px] leading-relaxed">
            {data}
          </pre>
        </div>
      )}
    </div>
  );
}
