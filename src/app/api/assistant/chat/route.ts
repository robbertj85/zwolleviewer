/**
 * Bring-your-own-inference chat endpoint — open-source models only.
 *
 * The browser POSTs the conversation here together with the OpenAI-compatible
 * endpoint config it has stored locally; this route runs the tool-calling loop
 * against `runAssistantTool()` and returns the final assistant message plus a
 * trace of the tool calls that were made. Talking to the model server-side
 * keeps the key out of cross-origin browser requests and sidesteps CORS.
 *
 * Any OpenAI-compatible `/chat/completions` server works: Ollama, llama.cpp,
 * LM Studio, vLLM, text-generation-webui, Groq, Together AI, Fireworks,
 * DeepInfra, Hugging Face TGI, ... Nothing is persisted server-side.
 */

import { NextRequest, NextResponse } from "next/server";
import { ASSISTANT_TOOLS, runAssistantTool } from "@/lib/assistant/tools";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TOOL_ROUNDS = 6;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ProviderConfig {
  baseUrl: string;
  apiKey?: string;
  model: string;
}

interface ToolTraceEntry {
  name: string;
  args: Record<string, unknown>;
  ok: boolean;
}

function systemPrompt(city: string, opts: { hasMap?: boolean; activeLayers?: string[] }) {
  const lines = [
    "You are the integration assistant for a Dutch 'stadstwin' (city digital twin) platform.",
    "The platform aggregates hundreds of GIS data layers per municipality across themes like mobility, energy, environment, buildings, soil and demographics.",
    "Users come here because the catalogue is large and they get lost. Help them find the right layers, explain what a layer contains, and point them at the REST API endpoint (`/api/v1/layers/<id>?city=<slug>`, GeoJSON).",
    "Always use the provided tools to ground your answers — never invent layer ids, names or counts. Prefer `list_categories` / `search_layers` first; only call `get_layer_sample` when the user needs to know the actual attributes.",
    `The user is currently looking at city '${city}'. Default to that city unless they say otherwise.`,
    "Answer in the user's language (Dutch unless they write English). Be concise; use short bullet lists of layers with their id in backticks.",
  ];
  if (opts.hasMap) {
    lines.push(
      "An interactive map is open next to this chat. When the user asks to show/hide/select layers, CALL `set_active_layers` with the relevant layer ids — don't just describe what to click. After acting, briefly confirm what is now shown."
    );
    lines.push(
      `Layers currently visible on the map: ${opts.activeLayers && opts.activeLayers.length ? opts.activeLayers.join(", ") : "(none)"}.`
    );
  } else {
    lines.push("No interactive map is open here; `set_active_layers` will not take visible effect.");
  }
  return lines.join(" ");
}

interface OAIToolCall {
  id: string;
  function: { name: string; arguments: string };
}

async function runChat(
  cfg: ProviderConfig,
  messages: ChatMessage[],
  city: string,
  trace: ToolTraceEntry[],
  ctx: { hasMap?: boolean; activeLayers?: string[] }
): Promise<string> {
  const url = cfg.baseUrl.replace(/\/+$/, "") + "/chat/completions";
  const tools = ASSISTANT_TOOLS.map((t) => ({
    type: "function" as const,
    function: { name: t.name, description: t.description, parameters: t.inputSchema },
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convo: any[] = [
    { role: "system", content: systemPrompt(city, ctx) },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: convo,
        tools,
        tool_choice: "auto",
        temperature: 0.2,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Inference server error ${res.status}: ${body.slice(0, 500)}`);
    }
    const json = await res.json();
    const msg = json.choices?.[0]?.message;
    if (!msg) throw new Error("Inference server returned no message");
    convo.push(msg);
    const calls: OAIToolCall[] = msg.tool_calls ?? [];
    if (!calls.length) return msg.content ?? "";
    for (const call of calls) {
      let args: Record<string, unknown> = {};
      try {
        args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
      } catch {
        args = {};
      }
      const result = await runAssistantTool(call.function.name, args);
      trace.push({ name: call.function.name, args, ok: result.ok });
      convo.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result.data).slice(0, 24000),
      });
    }
  }
  return "(De assistent bleef te lang gereedschappen aanroepen — probeer je vraag specifieker te stellen.)";
}

export async function POST(req: NextRequest) {
  let body: {
    config?: ProviderConfig;
    messages?: ChatMessage[];
    city?: string;
    hasMap?: boolean;
    activeLayers?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const cfg = body.config;
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const city = typeof body.city === "string" && body.city ? body.city : "zwolle";
  const ctx = {
    hasMap: !!body.hasMap,
    activeLayers: Array.isArray(body.activeLayers) ? body.activeLayers.map(String) : [],
  };

  if (!cfg || !cfg.baseUrl || !cfg.model) {
    return NextResponse.json(
      { error: "Missing inference config (baseUrl, model)" },
      { status: 400 }
    );
  }
  if (!messages.length) {
    return NextResponse.json({ error: "No messages" }, { status: 400 });
  }

  const trace: ToolTraceEntry[] = [];
  try {
    const reply = await runChat(cfg, messages, city, trace, ctx);
    return NextResponse.json({ reply, toolCalls: trace });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e), toolCalls: trace },
      { status: 502 }
    );
  }
}
