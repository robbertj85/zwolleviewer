"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Server, Check, Copy } from "lucide-react";

function CopyBox({ text, language }: { text: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => {
          navigator.clipboard?.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-2 top-2 flex items-center gap-1 rounded border bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-accent"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "gekopieerd" : "kopieer"}
      </button>
      {language && (
        <span className="absolute left-2 top-2 text-[10px] uppercase tracking-wide text-muted-foreground/60">
          {language}
        </span>
      )}
      <pre className="overflow-x-auto rounded-md bg-muted p-3 pt-7 text-[11px] leading-relaxed">{text}</pre>
    </div>
  );
}

interface ClientExample {
  name: string;
  blurb: string;
  language: string;
  snippet: (url: string) => string;
  path?: string;
}

const CLIENTS: ClientExample[] = [
  {
    name: "Claude Desktop",
    blurb:
      "Claude Desktop praat lokaal via stdio, dus brug de HTTP-server met het npx-pakket mcp-remote. Plak dit in claude_desktop_config.json (Settings → Developer → Edit Config) en herstart Claude.",
    path: "claude_desktop_config.json",
    language: "json",
    snippet: (url) =>
      `{
  "mcpServers": {
    "stadstwin": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${url}"]
    }
  }
}`,
  },
  {
    name: "Claude Code (CLI)",
    blurb: "Eén commando — Claude Code spreekt streamable-HTTP rechtstreeks aan.",
    language: "bash",
    snippet: (url) => `claude mcp add --transport http stadstwin ${url}`,
  },
  {
    name: "Cursor",
    blurb:
      "Maak (of bewerk) ~/.cursor/mcp.json voor alle projecten, of .cursor/mcp.json in je projectmap. Daarna verschijnt 'stadstwin' onder Settings → MCP.",
    path: "~/.cursor/mcp.json",
    language: "json",
    snippet: (url) =>
      `{
  "mcpServers": {
    "stadstwin": { "url": "${url}" }
  }
}`,
  },
  {
    name: "VS Code (GitHub Copilot / agent mode)",
    blurb: "Zet dit in .vscode/mcp.json in je workspace, of voeg het toe via 'MCP: Add Server'.",
    path: ".vscode/mcp.json",
    language: "json",
    snippet: (url) =>
      `{
  "servers": {
    "stadstwin": { "type": "http", "url": "${url}" }
  }
}`,
  },
  {
    name: "Windsurf",
    blurb: "Bewerk ~/.codeium/windsurf/mcp_config.json (of via Settings → Cascade → MCP Servers).",
    path: "~/.codeium/windsurf/mcp_config.json",
    language: "json",
    snippet: (url) =>
      `{
  "mcpServers": {
    "stadstwin": { "serverUrl": "${url}" }
  }
}`,
  },
  {
    name: "Cline / Continue / overige clients",
    blurb:
      "De meeste MCP-clients accepteren een 'streamable HTTP'- of 'SSE'-server met enkel een URL — geen API-key nodig. Gebruik onderstaande waarden.",
    language: "text",
    snippet: (url) =>
      `Naam:       stadstwin
Transport:  Streamable HTTP
URL:        ${url}
Auth:       geen`,
  },
];

const TOOLS = [
  ["list_cities", "Welke steden hebben een live city-twin (slug + provincie)."],
  ["list_categories", "Thema's + aantal lagen per thema voor een stad."],
  ["search_layers", "Zoek lagen op vrije tekst en/of categorie — id, naam, beschrijving, bron, API-endpoint."],
  ["get_layer_sample", "Metadata + een paar voorbeeld-GeoJSON-features van één laag, om de attributen te zien."],
];

export default function McpPage() {
  const [origin, setOrigin] = useState("https://<host>");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);
  const url = `${origin}/api/mcp`;

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Server className="h-6 w-6" /> MCP-server
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
            Liever vanuit je eigen AI-tool werken met de cataloguskennis van dit platform? Dit platform
            draait een <strong>Model Context Protocol</strong>-server (streamable HTTP, read-only, geen
            API-key). Verbind Claude Desktop, Claude Code, Cursor, VS Code, Windsurf of een andere
            MCP-client met onderstaande URL.
          </p>
        </div>

        <section className="rounded-lg border p-4 space-y-3">
          <h2 className="text-sm font-semibold">Server-URL</h2>
          <CopyBox text={url} />
          <div className="text-xs text-muted-foreground">
            Snelle test vanaf de commandoregel:
          </div>
          <CopyBox
            language="bash"
            text={`curl -s ${url} \\
  -H 'content-type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold">Voorbeelden per client</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {CLIENTS.map((c) => (
              <div key={c.name} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold">{c.name}</h3>
                  {c.path && (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {c.path}
                    </code>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.blurb}</p>
                <CopyBox text={c.snippet(url)} language={c.language} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border p-4 space-y-3">
          <h2 className="text-sm font-semibold">Beschikbare tools</h2>
          <table className="w-full text-xs">
            <tbody>
              {TOOLS.map(([name, desc]) => (
                <tr key={name} className="border-b last:border-0">
                  <td className="py-1.5 pr-3 align-top font-mono whitespace-nowrap">{name}</td>
                  <td className="py-1.5 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-muted-foreground">
            Alle tools zijn read-only en draaien tegen dezelfde catalogus als de{" "}
            <Link href="/assistent" className="text-primary hover:underline">AI-assistent</Link> en de{" "}
            <Link href="/api-gateway" className="text-primary hover:underline">API Gateway</Link>. Layer-data
            zelf haal je op via <code className="rounded bg-muted px-1">/api/v1/layers/&lt;id&gt;?city=&lt;slug&gt;</code> (GeoJSON).
          </p>
        </section>
      </div>
    </div>
  );
}
