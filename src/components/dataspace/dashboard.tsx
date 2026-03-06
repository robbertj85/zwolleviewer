"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw, Package, FileCheck, Handshake, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusData {
  connected: boolean;
  assets: number;
  agreements: number;
  negotiations: number;
  transfers: number;
}

export default function Dashboard() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/edc/status");
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const stats = [
    { label: "Gepubliceerde assets", value: status?.assets ?? 0, icon: Package },
    { label: "Contracten", value: status?.agreements ?? 0, icon: FileCheck },
    { label: "Onderhandelingen", value: status?.negotiations ?? 0, icon: Handshake },
    { label: "Transfers", value: status?.transfers ?? 0, icon: ArrowRightLeft },
  ];

  return (
    <div className="space-y-6">
      {/* Connection status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              loading
                ? "bg-yellow-500 animate-pulse"
                : status?.connected
                  ? "bg-green-500"
                  : "bg-red-500"
            )}
          />
          <span className="text-sm font-medium">
            {loading
              ? "Verbinding controleren..."
              : status?.connected
                ? "EDC Connector verbonden"
                : "EDC Connector niet bereikbaar"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={fetchStatus}
          disabled={loading}
        >
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          Vernieuwen
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="py-4">
            <CardHeader className="flex flex-row items-center justify-between px-4 pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4">
              <div className="text-2xl font-bold">{loading ? "–" : value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info box */}
      {!loading && !status?.connected && (
        <Card className="border-dashed py-4">
          <CardContent className="px-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">EDC Connector starten</p>
            <p>
              Start de EDC containers met{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run edc:up</code>
              {" "}en registreer de assets met{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run edc:register</code>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
