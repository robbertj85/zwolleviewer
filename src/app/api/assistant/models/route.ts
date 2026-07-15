/**
 * List the models a user's OpenAI-compatible inference server exposes.
 *
 * Proxied server-side for hosted providers (same reasons as the chat route —
 * CORS + not sending the key cross-origin from the browser). Local endpoints
 * (`localhost`/`127.0.0.1`) skip this route and are queried directly from
 * the browser instead, since a server-side proxy can't reach the user's own
 * loopback. POST `{ baseUrl, apiKey }`, get back `{ models: string[] }`.
 * Best-effort: servers that don't expose `/models` just return an empty
 * array and the UI falls back to a free-text field.
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { baseUrl?: string; apiKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { baseUrl, apiKey } = body;
  if (!baseUrl) return NextResponse.json({ error: "Missing baseUrl" }, { status: 400 });

  const url = baseUrl.replace(/\/+$/, "") + "/models";
  const headers: Record<string, string> = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json(
        { error: `Inference server error ${res.status}: ${t.slice(0, 300)}`, models: [] },
        { status: 502 }
      );
    }
    const json = await res.json();
    // OpenAI-compatible: { data: [{ id }] }. Some servers: { models: [...] }.
    const list: unknown[] = Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.models)
      ? json.models
      : [];
    const models = list
      .map((m) =>
        typeof m === "string"
          ? m
          : m && typeof m === "object" && "id" in m
          ? String((m as { id: unknown }).id)
          : m && typeof m === "object" && "name" in m
          ? String((m as { name: unknown }).name)
          : ""
      )
      .filter(Boolean)
      .sort();
    return NextResponse.json({ models });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e), models: [] },
      { status: 502 }
    );
  }
}
