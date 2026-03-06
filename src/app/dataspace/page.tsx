"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Dashboard from "@/components/dataspace/dashboard";
import ProviderView from "@/components/dataspace/provider-view";
import ConsumerView from "@/components/dataspace/consumer-view";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "provider", label: "Provider" },
  { id: "consumer", label: "Consumer" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function DataspacePage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dataspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Eclipse Dataspace Connector — publiceer datasets en consumeer data
            van externe connectors via het Dataspace Protocol.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <Badge
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Badge>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "provider" && <ProviderView />}
        {activeTab === "consumer" && <ConsumerView />}
      </div>
    </div>
  );
}
