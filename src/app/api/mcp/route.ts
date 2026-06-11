/**
 * Minimal MCP (Model Context Protocol) server over Streamable HTTP.
 *
 * Lets users point their own MCP-capable client (Claude Desktop, Cursor,
 * Continue, an Ollama front-end, ...) at this platform and query the GIS
 * layer catalogue from there:
 *
 *   {
 *     "mcpServers": {
 *       "stadstwin": { "url": "https://<host>/api/mcp" }
 *     }
 *   }
 *
 * Implements just enough of the spec for stateless tool use: `initialize`,
 * `tools/list`, `tools/call`, `ping`. Notifications are accepted and
 * acknowledged with `202`. No session header is required.
 */

import { NextRequest, NextResponse } from "next/server";
import { ASSISTANT_TOOLS, runAssistantTool } from "@/lib/assistant/tools";

export const runtime = "nodejs";

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "basis-stadstwin", version: "1.0.0" };

type JsonRpcId = string | number | null;

function rpcResult(id: JsonRpcId, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}
function rpcError(id: JsonRpcId, code: number, message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } });
}

export async function GET() {
  // Convenience: a plain description for humans hitting the URL in a browser.
  return NextResponse.json({
    server: SERVER_INFO,
    protocol: PROTOCOL_VERSION,
    transport: "streamable-http",
    note: "POST JSON-RPC 2.0 requests here (MCP). Tools: " + ASSISTANT_TOOLS.map((t) => t.name).join(", "),
  });
}

export async function POST(req: NextRequest) {
  let msg: { jsonrpc?: string; id?: JsonRpcId; method?: string; params?: Record<string, unknown> };
  try {
    msg = await req.json();
  } catch {
    return rpcError(null, -32700, "Parse error");
  }

  const { id = null, method, params = {} } = msg;

  // Notifications (no `id`) — just acknowledge.
  if (id === null && typeof method === "string" && method.startsWith("notifications/")) {
    return new NextResponse(null, { status: 202 });
  }

  switch (method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Read-only access to the city-twin GIS layer catalogue. Use search_layers to find layers among hundreds, list_categories for an overview, get_layer_sample to inspect a layer's attributes.",
      });

    case "ping":
      return rpcResult(id, {});

    case "tools/list":
      return rpcResult(id, {
        tools: ASSISTANT_TOOLS.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
        })),
      });

    case "tools/call": {
      const name = params.name as string;
      const args = (params.arguments as Record<string, unknown>) ?? {};
      if (!name || !ASSISTANT_TOOLS.some((t) => t.name === name)) {
        return rpcError(id, -32602, `Unknown tool: ${name}`);
      }
      const result = await runAssistantTool(name, args);
      return rpcResult(id, {
        content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }],
        isError: !result.ok,
      });
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}
