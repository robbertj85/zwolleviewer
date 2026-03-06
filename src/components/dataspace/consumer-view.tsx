"use client";

import { useState, useEffect } from "react";
import { Search, ArrowRight, RefreshCw, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CatalogDataset {
  "@id": string;
  "@type"?: string;
  name?: string;
  description?: string;
  "odrl:hasPolicy"?: Record<string, unknown> | Record<string, unknown>[];
  [key: string]: unknown;
}

interface Negotiation {
  "@id": string;
  state: string;
  counterPartyAddress: string;
  contractAgreementId?: string;
}

const STATE_CONFIG: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  FINALIZED: { icon: CheckCircle2, color: "text-green-500", label: "Afgerond" },
  VERIFIED: { icon: CheckCircle2, color: "text-green-500", label: "Geverifieerd" },
  AGREED: { icon: CheckCircle2, color: "text-green-500", label: "Akkoord" },
  REQUESTED: { icon: Clock, color: "text-yellow-500", label: "Aangevraagd" },
  OFFERING: { icon: Clock, color: "text-yellow-500", label: "Aanbod" },
  ACCEPTED: { icon: Clock, color: "text-blue-500", label: "Geaccepteerd" },
  TERMINATED: { icon: XCircle, color: "text-red-500", label: "Beëindigd" },
  ERROR: { icon: XCircle, color: "text-red-500", label: "Fout" },
};

export default function ConsumerView() {
  const [connectorUrl, setConnectorUrl] = useState("http://localhost:8282/protocol");
  const [datasets, setDatasets] = useState<CatalogDataset[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [negotiating, setNegotiating] = useState<Set<string>>(new Set());
  const [transferring, setTransferring] = useState<Set<string>>(new Set());

  // Fetch negotiations on mount
  useEffect(() => {
    fetchNegotiations();
  }, []);

  const fetchNegotiations = async () => {
    try {
      const res = await fetch("/api/edc/negotiations");
      const data = await res.json();
      setNegotiations(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  };

  const queryCatalog = async () => {
    if (!connectorUrl.trim()) return;
    setCatalogLoading(true);
    setCatalogError(null);
    setDatasets([]);
    try {
      const res = await fetch("/api/edc/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counterPartyAddress: connectorUrl }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const catalog = await res.json();
      const ds = catalog["dcat:dataset"];
      if (Array.isArray(ds)) {
        setDatasets(ds);
      } else if (ds) {
        setDatasets([ds]);
      } else {
        setDatasets([]);
      }
    } catch (err) {
      setCatalogError(err instanceof Error ? err.message : "Catalogus ophalen mislukt");
    } finally {
      setCatalogLoading(false);
    }
  };

  const negotiate = async (dataset: CatalogDataset) => {
    const id = dataset["@id"];
    setNegotiating((prev) => new Set(prev).add(id));

    try {
      // Extract policy from dataset
      const policies = dataset["odrl:hasPolicy"];
      const policy = Array.isArray(policies) ? policies[0] : policies;
      if (!policy) throw new Error("Geen beleid gevonden in dataset");

      await fetch("/api/edc/negotiations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          counterPartyAddress: connectorUrl,
          policy: {
            ...policy,
            "@type": "odrl:Offer",
            "odrl:target": id,
          },
        }),
      });

      // Refresh negotiations list
      await fetchNegotiations();
    } catch {
      // Error handled by UI showing negotiation didn't appear
    } finally {
      setNegotiating((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const initiateTransfer = async (negotiation: Negotiation) => {
    if (!negotiation.contractAgreementId) return;
    const id = negotiation["@id"];
    setTransferring((prev) => new Set(prev).add(id));

    try {
      await fetch("/api/edc/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          counterPartyAddress: negotiation.counterPartyAddress,
          contractId: negotiation.contractAgreementId,
          assetId: id,
        }),
      });
    } catch {
      // ignore
    } finally {
      setTransferring((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Catalog query */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Externe catalogus ophalen</h3>
        <div className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Connector DSP URL..."
              value={connectorUrl}
              onChange={(e) => setConnectorUrl(e.target.value)}
              className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={queryCatalog}
            disabled={catalogLoading || !connectorUrl.trim()}
          >
            {catalogLoading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" />
            )}
            Catalogus ophalen
          </Button>
        </div>
        {catalogError && (
          <p className="text-xs text-red-500">{catalogError}</p>
        )}
      </div>

      {/* Catalog results */}
      {datasets.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Catalogus resultaten
            <span className="ml-2 text-muted-foreground font-normal">
              {datasets.length} datasets
            </span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {datasets.map((ds) => {
              const name =
                (ds.name as string) ??
                (ds["https://w3id.org/edc/v0.0.1/ns/name"] as string) ??
                ds["@id"];
              const desc =
                (ds.description as string) ??
                (ds["https://w3id.org/edc/v0.0.1/ns/description"] as string) ??
                "";
              const isNegotiating = negotiating.has(ds["@id"]);

              return (
                <Card key={ds["@id"]} className="gap-2 py-3">
                  <CardHeader className="gap-1 px-4">
                    <CardTitle className="text-sm">{name}</CardTitle>
                    {desc && (
                      <CardDescription className="text-xs line-clamp-2">
                        {desc}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="px-4 flex items-center justify-between">
                    <code className="text-[10px] text-muted-foreground truncate mr-2">
                      {ds["@id"]}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1 shrink-0"
                      onClick={() => negotiate(ds)}
                      disabled={isNegotiating}
                    >
                      {isNegotiating ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <ArrowRight className="h-3 w-3" />
                      )}
                      Negotiate
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Active negotiations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Onderhandelingen</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={fetchNegotiations}
          >
            <RefreshCw className="h-3 w-3" />
            Vernieuwen
          </Button>
        </div>
        {negotiations.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Nog geen onderhandelingen gestart.
          </p>
        ) : (
          <div className="space-y-2">
            {negotiations.map((neg) => {
              const cfg = STATE_CONFIG[neg.state] ?? {
                icon: Clock,
                color: "text-muted-foreground",
                label: neg.state,
              };
              const StateIcon = cfg.icon;
              const canTransfer =
                (neg.state === "FINALIZED" || neg.state === "VERIFIED") &&
                !!neg.contractAgreementId;

              return (
                <Card key={neg["@id"]} className="py-2">
                  <CardContent className="px-4 flex items-center gap-3">
                    <StateIcon className={cn("h-4 w-4 shrink-0", cfg.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{neg["@id"]}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {neg.counterPartyAddress}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {cfg.label}
                    </Badge>
                    {canTransfer && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] gap-1 shrink-0"
                        onClick={() => initiateTransfer(neg)}
                        disabled={transferring.has(neg["@id"])}
                      >
                        {transferring.has(neg["@id"]) ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <ArrowRight className="h-3 w-3" />
                        )}
                        Transfer
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
