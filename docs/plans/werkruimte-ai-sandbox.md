# Plan: Werkruimte — a sandbox per user for AI analysis in the Basis Stadstwin

## Context

The assistant we have now (`src/lib/assistant/*`, commit 51093a7) needs one of two things: Ollama or LM Studio on the user's laptop, or an API key that the user pastes in. It also has only five read-only catalogue tools: list, search, sample and switch layers. Government employees have neither a local model nor an API key. They also cannot do real analysis today, for example "how many charging points are within 400 m of a school, per neighbourhood".

**Goal:** each logged-in user gets their own isolated server environment, a "personal VPS". An AI harness uses it to write and run Python, reach the stadstwin data (the `/api/v1/layers` GeoJSON gateway) and send results back to the map, as tables, charts or new map layers. It should feel like having your own VPS with an agent installed, but without the user managing any infrastructure.

What we have today, from the exploration:
- Next.js 16 on Vercel. There is no login and no Python.
- `chat-loop.ts` is an OpenAI-compatible tool loop that runs in the browser or on the server. It allows at most 6 rounds and does not stream.
- `tools.ts` holds `ASSISTANT_TOOLS` and `runAssistantTool`. They run in Node, and `/api/mcp` uses them too.
- The REST gateway `src/app/api/v1/layers/[layerId]/route.ts` returns GeoJSON through `source.fetchData()`. It calls it without `full`, so some layers come back truncated or paged.
- The storymap compute engine (`src/lib/stories/compute.ts`) is pure TypeScript and runs only in the browser.
- Vercel cannot host long-running per-user sandboxes, so the new backend has to run somewhere else.

---

## Answers to your two questions

### Open-weight models vs. US frontier models for tool calling (as of mid-2026)

The gap has narrowed a lot. The GLM-4.5/4.6+ generation, Qwen3 (including Qwen3-Coder), Kimi K2 and DeepSeek V3.x do tool calling reliably on single-step and short multi-step tasks, close to frontier level on BFCL- and τ-bench-style tests. I can't vouch for the exact scores of "Qwen 3.8" specifically. The weak points that remain:

1. **Long agentic runs.** Over 10 to 30 steps, and when recovering after an error (a traceback, an empty result), frontier models such as Claude and GPT are still clearly more robust. In practice open-weight models are more likely to stop early, repeat themselves or keep working from a wrong assumption.
2. **Serving is often the problem, not the model.** Tool calling can break because of a wrong chat template or tool-call parser in vLLM or SGLang, or because the model is heavily quantised (Q4). With the recommended parser and FP8 or BF16 weights, a large share of those "tool calling problems" disappear.
3. **Size costs GPUs.** GLM-4.6 (about 355B MoE) and Qwen3-235B need roughly 4 to 8 H100/H200-class GPUs. Qwen3-Coder-30B-A3B and similar mid-size MoE models fit on a single 80 GB GPU and are good enough for "write pandas/geopandas code".

**What this means for the design:** we reduce how much the model has to get right.
- **Code-as-action.** The model writes one Python cell instead of chaining 15 fine-grained tool calls.
- **A typed `stadstwin` Python SDK** handles data loading, CRS conversion and output (`st.load_layer`, `st.add_map_layer`), so the model mostly writes domain logic.
- **An eval suite of Zwolle tasks** with checkable answers, so you can measure which model is good enough instead of guessing (phase 2).
- **Model gateway (LiteLLM).** Open-weight models on your own GPU are primary, with an EU API as fallback, per your choice. Switching is a config change, not a code change.

### The infrastructure alternatives explained

| | What it is | Pros | Cons |
|---|---|---|---|
| **Single VPS + Docker** (you know this one) | One large VM. Each user gets a Docker container, which we start and stop. | Simple, cheap, quick to build. | Everything on one machine, so no failover and limited scale. You manage the host yourself. |
| **Kubernetes / Haven** | A cluster of machines. Each user sandbox is a pod with its own disk (PVC), CPU and memory limits, and an extra isolation layer (gVisor or Kata, a "mini-VM" around the container). **Haven** is the VNG standard for Kubernetes at Dutch municipalities, part of Common Ground. It fixes how a cluster must be set up, so an application runs the same at any municipality or on any Dutch cloud (Cyso, Previder, SURF, a municipality's own cluster). | Scales out, handles failover, a GPU node pool for vLLM fits in the same cluster, and it lines up with how municipalities procure. | More operational knowledge needed, and more expensive to start. |
| **Managed sandbox SaaS** (E2B, Modal, Daytona) | A company runs the sandboxes for you. You call an API ("start a sandbox, run this code") and pay per second. | No infrastructure to manage; up and running in a day. | Mostly US-hosted, so municipal data and code leave your control. That is hard to justify under the BIO, the AVG and a DPIA. |

**Recommendation:** a PoC on **a single VPS with Docker**, with the sandbox manager built behind a **driver interface**. A later `KubernetesDriver` (Haven) then needs no change in the harness or the frontend. We leave out managed SaaS because of data sovereignty.

---

## Target architecture

```
Browser (Next.js, existing)
  └─ AssistantPanel, new mode "Werkruimte (server)"  ──SSE──┐
                                                            ▼
                                         Agent service (Node/TS, new)  ◄── OIDC JWT
                                         • harness loop (streaming, 30+ rounds)
                                         • tools: catalogue (reused from tools.ts)
                                           + run_python / bash / files / map-output
                                         • audit log (Postgres)
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
          Model gateway (LiteLLM)     Sandbox manager               Keycloak (OIDC)
          primary: vLLM (open-weight)  DockerDriver → K8sDriver      federates to Entra ID
          fallback: EU API             1 container per user              of the municipality
                                            │
                                            ▼
                           Sandbox (gVisor, no root, CPU/mem limits,
                           persistent /home/user volume)
                           • runner (FastAPI): /exec (stateful ipykernel), /bash, /files
                           • Python: geopandas, shapely, pyproj, duckdb-spatial,
                             pandas, matplotlib, rasterio, scipy, sklearn
                           • `stadstwin` SDK (load_layer → GeoDataFrame, add_map_layer…)
                                            │  (only outbound route)
                                            ▼
                           Egress proxy (allowlist): stadstwin /api/v1, PDOK,
                           CBS, own PyPI mirror. No internet otherwise.
```

**Main design decisions:**
- **The harness runs outside the sandbox. The sandbox is the VPS it controls.** The model key, policies and audit log therefore never sit inside the container that runs code the model wrote. If a data attribute carries a prompt injection, it can do no more than the sandbox and the egress allowlist allow. The user still gets the full VPS experience: shell, files, persistent scripts, `pip install` from the mirror.
- **Our own harness in TypeScript, not an off-the-shelf one** (OpenHands, opencode). The value is in the map integration: switching layers, drawing results as a layer, the storymap context. We also want to reuse `tools.ts` and the layer registry, and to support any OpenAI-compatible model. The loop grows out of `chat-loop.ts`.
- **Data goes through the existing REST gateway.** The Python SDK calls `/api/v1/layers/<id>?city=` and gets GeoJSON. There is no second implementation of the 429+ fetchers.

---

## Phase 1: working PoC (docker-compose on a single VPS)

### 1a. Sandbox image and runner (`services/sandbox/`)
- `Dockerfile` based on Python 3.12-slim with the geo stack listed above plus `ipykernel` and `jupyter_client`. It runs as a non-root user. The rootfs is read-only except `/home/user` and `/tmp`.
- `runner/app.py` (FastAPI):
  - `POST /exec {code}` runs the code in a persistent kernel per sandbox and returns stdout, stderr, the error with traceback, and display data (PNG, HTML tables, GeoJSON outputs).
  - `POST /bash {cmd}`, and `GET/PUT /files/*` restricted to `/home/user`.
  - Timeout per call is 120 s by default. Authentication uses a per-sandbox bearer token.
- `stadstwin_sdk/`, a pip package baked into the image:
  - `st.list_layers(query)`, `st.load_layer(id, city="zwolle") -> GeoDataFrame` (converts to EPSG:28992 on request) and `st.layer_info(id)`.
  - `st.show_table(df)`, `st.show_chart(fig)` and `st.add_map_layer(gdf, name, color_by=None)`. These write to `/home/user/outputs/` along with a manifest, which the runner returns as display data.

### 1b. Sandbox manager (`services/agent/src/sandbox/`)
- `driver.ts` defines the interface `SandboxDriver { ensure(userId), exec(), bash(), files(), stop(), destroy() }`.
- `docker-driver.ts` uses the Docker Engine API through `dockerode`.
  - It creates a container and volume `stw-home-<userId>`, sets `--runtime=runsc` (gVisor) when available, applies CPU and memory limits and a pids limit, and attaches only to the internal `sandboxes` network.
  - Idle reaper: stop after 30 minutes idle, keep the volume. Retention: delete volumes after N days without use (configurable).

### 1c. Agent service and harness (`services/agent/`)
- Node with Hono and an SSE endpoint `POST /v1/sessions/:id/messages`, plus `GET /v1/sessions` and `GET /v1/files`.
- `harness.ts` is an extended version of the `chat-loop.ts` pattern:
  - Streaming, with a round limit of about 30 and a budget based on tokens and wall-clock time.
  - Context compaction for long sessions.
  - It emits events: `text`, `tool_call`, `tool_result`, `code_cell`, `display`, `map_action`.
- Tools:
  - The existing five catalogue tools, imported from `src/lib/assistant/tools.ts` through a tsconfig path alias.
  - New: `run_python`, `bash`, `read_file`, `write_file`, `list_files`, and `show_on_map(outputPath)`.
- System prompt: the stadstwin context plus SDK documentation and working rules: "use the SDK, work in EPSG:28992 for distances, check the result".
- Auth for the PoC: the service validates the Keycloak JWT. `userId` is the token's `sub`.

### 1d. Model gateway (`deploy/litellm.yaml`)
- Model alias `stadstwin-agent`. Primary is vLLM with an open-weight model, for example a Qwen3-Coder or GLM variant, with the correct `--tool-call-parser`. Fallback is an EU API.
- For local development the primary points at Ollama, so the PoC runs without a GPU.

### 1e. Deployment (`deploy/docker-compose.werkruimte.yml`)
- Services: `agent`, `litellm`, `keycloak` with a dev realm, `postgres` for sessions and the audit log, `egress-proxy` (Squid with an allowlist), `vllm` (profile `gpu`), and the `sandboxes` network (internal, reachable only through `egress-proxy`).
- The Next.js app can stay on Vercel. The agent service gets its own domain, with CORS for the app origin only.

### 1f. Frontend changes (existing repo)
- **`src/components/assistant/assistant-panel.tsx`**: a third provider mode, "Werkruimte (server)", next to local and OpenAI-compatible.
  - It shows a login button (OIDC through Auth.js or `oidc-client-ts`) and consumes SSE.
  - It renders code cells collapsed, with output below, tables and images.
  - It adds a small "Bestanden" tab listing `/home/user`.
- **`src/app/[city]/city-map.tsx`**: support for **result layers**.
  - A `map_action`/`display` event carrying GeoJSON becomes an ephemeral `DataSource` (category "Analyse", `fetchData` returns the in-memory FeatureCollection) and is added through the same path as `handleApplyLayers`.
  - `FeaturePanel` and the legend then work unchanged.
- **`src/app/api/v1/layers/[layerId]/route.ts`**: support `?full=true`, which calls `fetchData(true)`, so the SDK gets complete datasets. Also return a clear 4xx for vector-tile-only and WMS layers ("not available as GeoJSON").
- **`src/lib/assistant/chat-loop.ts`** and **`tools.ts`**: move the tool definitions so the agent service can import them without Next-specific code. The behaviour of the current modes stays the same.

## Phase 2: hardening and model choice
- gVisor required, plus a seccomp profile. Egress allowlist in enforce mode. PyPI mirror (devpi) with a package allowlist.
- Quotas per user: CPU minutes, tokens, disk. Rate limiting.
- Audit log: store every prompt, tool call, executed cell and output hash, with retention per the archiving policy. Export for the CISO.
- **Eval suite** `services/agent/evals/`: about 30 Zwolle questions with reference answers, for example "number of trees per neighbourhood", "share of homes with energy label E–G within 1 km of the station", or "charging points within 400 m of schools". A runner scores each model on the answer and the number of steps, which gives an empirical answer to open-weight vs. frontier.
- Keycloak federation with the municipality's Entra ID, and groups for authorisation (who may use the werkruimte).
- Governance documents: DPIA, a BIO mapping, and an entry in the algorithm register or an EU AI Act transparency note.

## Phase 3: scale and extras
- A `KubernetesDriver`: pod plus PVC plus `RuntimeClass: gvisor` plus a NetworkPolicy per user, on a Haven cluster, with a GPU node pool for vLLM.
- Multiple municipalities as tenants, where each tenant gets its own namespace, egress allowlist and model policy.
- Save scripts as "analysis recipes" and share them with colleagues. Scheduled runs.
- Optional: a Python port of the storymap compute engine, or an endpoint for it, so the agent can generate storymap charts.

---

## Critical files

**New**
- `services/sandbox/{Dockerfile, runner/app.py, stadstwin_sdk/}`
- `services/agent/src/{server.ts, harness.ts, tools/*.ts, sandbox/{driver,docker-driver}.ts, auth.ts, audit.ts}`
- `deploy/docker-compose.werkruimte.yml`, `deploy/litellm.yaml`, `deploy/squid-allowlist.conf`
- `docs/werkruimte-architectuur.md`: the architecture above plus the decisions, for the municipality or the CISO.

**Modified**
- `src/components/assistant/assistant-panel.tsx`
- `src/app/[city]/city-map.tsx`
- `src/app/api/v1/layers/[layerId]/route.ts`
- `src/lib/assistant/{tools,chat-loop}.ts`

**Reused**
- `ASSISTANT_TOOLS` and `runAssistantTool` from `src/lib/assistant/tools.ts`
- `buildDataSourcesForSlug` from `src/lib/data-sources`
- `systemPrompt` in `chat-loop.ts` as the basis
- `handleApplyLayers` in `city-map.tsx`

## Verification
1. `docker compose -f deploy/docker-compose.werkruimte.yml up` with Ollama as the primary model.
2. Sandbox unit check: `curl` the runner's `/exec` with `import stadstwin as st; st.load_layer('<laadpalen-id>').shape` and get a sensible number of rows.
3. Isolation checks from inside the sandbox:
   - `curl https://example.com` fails, and `st.load_layer` works.
   - The container runs as non-root.
   - `runsc` is active (`dmesg` shows gVisor).
   - It cannot reach `litellm` or `postgres` on the network.
4. End-to-end in the browser with `npm run dev` and the panel in "Werkruimte" mode. Ask: "Hoeveel laadpalen liggen binnen 400 m van een school, per wijk? Zet het resultaat op de kaart." Expect to see a code cell, a table and a new "Analyse" layer on the map, with a working FeaturePanel.
5. Persistence: log out and back in, and the script is still in the Files tab. After 30 minutes idle the container is stopped and the volume remains.
6. Run the eval suite (phase 2) against at least two models and compare their scores.
