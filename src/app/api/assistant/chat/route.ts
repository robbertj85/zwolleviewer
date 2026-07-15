/**
 * Bring-your-own-inference chat endpoint — open-source models only.
 *
 * The browser POSTs the conversation here together with the OpenAI-compatible
 * endpoint config it has stored locally; this route runs the tool-calling loop
 * against `runAssistantTool()` and returns the final assistant message plus a
 * trace of the tool calls that were made. Talking to the model server-side
 * keeps the key out of cross-origin browser requests and sidesteps CORS.
 *
 * This route is only used for non-local (hosted) endpoints — the assistant
 * panel talks to `localhost` inference servers directly from the browser
 * instead (see `runChatLoop` in `@/lib/assistant/chat-loop`), because a
 * server-side proxy can never reach the *user's* localhost.
 *
 * Any OpenAI-compatible `/chat/completions` server works: Ollama, llama.cpp,
 * LM Studio, vLLM, text-generation-webui, Groq, Together AI, Fireworks,
 * DeepInfra, Hugging Face TGI, ... Nothing is persisted server-side.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  runChatLoop,
  type ChatMessage,
  type ProviderConfig,
  type ToolTraceEntry,
} from "@/lib/assistant/chat-loop";

export const runtime = "nodejs";
export const maxDuration = 60;

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
    const reply = await runChatLoop(cfg, messages, city, trace, ctx);
    return NextResponse.json({ reply, toolCalls: trace });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e), toolCalls: trace },
      { status: 502 }
    );
  }
}
