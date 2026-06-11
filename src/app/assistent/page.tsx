"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import AssistantPanel from "@/components/assistant/assistant-panel";

export default function AssistentPage() {
  return (
    <div className="flex h-full flex-col">
      {/* intro — scrolls on its own if the window is short */}
      <div className="shrink overflow-y-auto border-b px-4 py-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Bot className="h-6 w-6" /> AI inference — bring your own (open-source) AI
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Honderden datalagen per stad — makkelijk om het overzicht te verliezen. Koppel je{" "}
            <em>eigen</em> open-source LLM (lokaal via <strong>Ollama</strong> of{" "}
            <strong>LM Studio</strong>) en stel het systeem vragen in natuurlijke taal. Geen
            OpenAI/Anthropic — alleen open modellen op jouw machine. Op de{" "}
            <Link href="/zwolle" className="text-primary hover:underline">kaart</Link> verschijnt
            dezelfde assistent als zijpaneel en kan hij rechtstreeks lagen aan- en uitzetten. Liever
            vanuit je eigen tool werken? Zie het{" "}
            <Link href="/assistent/mcp" className="text-primary hover:underline">MCP-tabblad</Link>.
          </p>
        </div>
      </div>

      {/* panel fills the remaining height */}
      <div className="min-h-0 flex-1 p-4">
        <div className="mx-auto flex h-full max-w-3xl overflow-hidden rounded-lg border">
          <AssistantPanel city="zwolle" className="flex-1" />
        </div>
      </div>
    </div>
  );
}
