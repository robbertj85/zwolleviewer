# Plan: Werkruimte — a sandbox per user for AI analysis in the Basis Stadstwin

Drafted 24 Sep 2026, updated the same day with the model, hosting and pricing decisions. Status: parked.

## Context

The assistant we have now (`src/lib/assistant/*`, commit 51093a7) needs one of two things: Ollama or LM Studio on the user's laptop, or an API key that the user pastes in. It also has only five read-only catalogue tools: list, search, sample and switch layers. Government employees have neither a local model nor an API key. They also cannot do real analysis today, for example "how many charging points are within 400 m of a school, per neighbourhood".

**Goal:** each logged-in user gets their own isolated server environment, a "personal VPS". An AI harness uses it to write and run Python, reach the stadstwin data and send results back to the map, as tables, charts or new map layers. No local model, no API key and no GPUs: models come from an EU-hosted API, and everything else runs on one own EU VPS.

What we have today, from the exploration:
- Next.js 16 on Vercel. There is no login and no Python.
- `chat-loop.ts` is an OpenAI-compatible tool loop that runs in the browser or on the server. It allows at most 6 rounds and does not stream.
- `tools.ts` holds `ASSISTANT_TOOLS` and `runAssistantTool`. They run in Node, and `/api/mcp` uses them too.
- The REST gateway `src/app/api/v1/layers/[layerId]/route.ts` returns GeoJSON through `source.fetchData()`. It calls it without `full`, so some layers come back truncated or paged.
- The storymap compute engine (`src/lib/stories/compute.ts`) is pure TypeScript and runs only in the browser.
- Vercel cannot host long-running per-user sandboxes. **Decision:** move the whole Basis Stadstwin to an own EU VPS, next to the Werkruimte services.

## Decisions of 24 Sep

- **No own GPUs.** The model comes from an EU-hosted, OpenAI-compatible API behind a small model router.
- **The agent checks its own work**: data facts through `st.validate()`, and a screenshot of the real map through a headless-Chrome check browser.
- **The whole stadstwin moves to the own VPS**: one domain, no CORS, no Vercel size or time limits on data, and the sandboxes read layers over the internal network.
- **Per-seat pricing** for municipalities, on one company API account.

## How it works for an employee

The HTML version of this plan (`.doc-tmp/plans/werkruimte-ai-sandbox.html`) has a sequence diagram. In short:

1. The employee opens the Werkruimte in the stadstwin and logs in with their municipal account (Keycloak → Entra ID).
2. The browser sends the question, login token and visible layers to the agent service. The agent service starts the user's sandbox if needed.
3. Loop, until done (≤ 30 rounds):
   - The agent sends prompt + tools to the model API.
   - The model returns `run_python(code)`.
   - The sandbox runs it and loads layers from the local stadstwin over the internal network.
   - Output and `st.validate()` facts go back to the agent, and the code cell streams live to the browser.
4. Self-check: the model calls `preview_on_map()`. The check browser renders the local app with the result layer, and the screenshot goes to the model to judge and fix.
5. The final answer, table and `map_action` stream to the browser, and an "Analyse" layer appears on the map.
6. After 30 minutes idle the container stops. The files are kept.

| Part | Runs on | Sees / may reach |
|---|---|---|
| Employee's browser | Employee's laptop | Only the stadstwin on the VPS (one domain, one login) |
| Stadstwin app (viewer + `/api/v1`) | Own EU VPS: Next.js container + GeoParquet cache | PDOK, CBS and other public sources; sandboxes reach it over the internal network |
| Login (Keycloak) | Own EU VPS, federated to Entra ID | Issues the token; the password never reaches our services |
| Agent service (harness) | Own EU VPS, same domain as the app | Holds the model API key, audit log and metering; the only part that talks to the model, sandbox and check browser |
| Model | EU provider API, pay per token | Only the text the agent sends it |
| Personal sandbox | Own EU VPS: container per user, gVisor, persistent `/home/user` | `/api/v1` on the internal network; outside only via the egress proxy |
| Check browser | Own EU VPS: one shared headless Chrome (Puppeteer) | Only the local stadstwin app |

---

## Model choice

The harness talks to a model router, so switching provider or model is configuration, not code. Which model is good enough is decided by the phase 0 eval, not by vendor benchmarks.

### Candidates (research of 24 Sep 2026)

| Model | What it is | Independent score (Artificial Analysis) | Best EU route | Price per 1M in / out (excl. VAT) | Watch out for |
|---|---|---|---|---|---|
| **Qwen3.8-27B** (primary) | Dense 27B, Apache 2.0, reads images, 262K context | 34 | Scaleway; OVH as failover (IONOS serves INT4) | €0.60 / €3.30 (Scaleway), €0.40 / €2.70 (OVH) | A tier below the big models; test long tool loops |
| **GLM-5.3** (strongest) | Z.ai, open weights, best open model for agent work | 45 | Melious only (Scaleway has GLM-5.2 at €1.80 / €5.50) | €1 / €3, cached €0.20 | Melious terms block resale without written consent |
| **DeepSeek V4.1 Flash** (cheapest) | Released 10 Sep 2026, MIT, reads images, 1M context | 39–40 | Melious only (Scaleway has the older V4 Flash at €0.40 / €0.80) | €0.20 / €1.00, cached €0.01 | Tool-call format bugs only just fixed; forced `tool_choice` fails on Melious; very verbose |
| Qwen3.8-2.4T (open Qwen3.8-Max) | 2.4T MoE, custom licence, text only | 40 | Melious only | €2.35 / €5.55 | Twice GLM-5.3's price for a lower score; Alibaba's Terminal-Bench 86.6 was measured at 67.4 by Vals AI |

Most published benchmark numbers come from the model makers themselves. The Artificial Analysis index is the only independent comparison found for all four.

**Making the model's job easier:**
- **Code-as-action.** The model writes one Python cell instead of chaining 15 fine-grained tool calls.
- **A typed `stadstwin` Python SDK** handles data loading, CRS and output.
- **Self-check** through `st.validate()` and `preview_on_map()`.
- **Pass `reasoning_content` back** between tool calls for thinking models (GLM, DeepSeek, Qwen in thinking mode).

### Providers

| Provider | Seat / certification | Relevant models | Limits (one account) | Serving our customers |
|---|---|---|---|---|
| **Scaleway** (primary) | Paris (Iliad group); ISO 27001, HDS; no prompt storage except ≤ 2 weeks for abuse checks | Qwen3.8-27B, Qwen3.5-397B, GLM-5.2, DeepSeek V4 Flash | 600 req/min per model; 1M tokens/min (GLM-5.2), 2M (Qwen3.5-397B); 100 concurrent; 99.9% SLA; raise via volume contract or Dedicated Deployment | No resale ban in the terms |
| **OVHcloud** (failover) | France; ISO 27001 (SecNumCloud does not cover AI Endpoints) | Qwen3.8-27B, Qwen3.5-397B, gpt-oss-120b | 400 req/min per model per project; token/concurrency limits not published; 99.98% SLA | Allowed; our customers must accept OVH's terms (pass-through clause) |
| **Melious** (blocked for now) | Saarbrücken broker, founded 2025; routes to ~11 EU hosts; ISO 27001 in progress | GLM-5.3, DeepSeek V4.1 Flash, Kimi K2.6/K3, Qwen3.8 27B/Max | Per account, numbers not published; flat plans are single-user ("Unlimited" €499 = 1 concurrent GLM-5.3 request) | **Forbidden without written consent** (terms §02(2), §03(2), §04(3)); provider per model not disclosed |
| IONOS | Germany; ISO 27001; strongest no-logging statement | Qwen3.8-27B (INT4), Qwen3.5-397B | ~300 req/min per contract | Not verified |

Not recommended:
- **Nebius** serves its newest models from US/UK regions.
- **Mistral**'s sub-processors are unverified (US hyperscalers are reported, and there's a Microsoft partnership).
- **Claude on AWS/Azure EU regions** is still subject to the US CLOUD Act, so it's a benchmark reference only.

**Governance:** GLM (Z.ai), DeepSeek and Qwen (Alibaba) are Chinese models. Open weights served by an EU host send no data to China, but the DPIA must say so explicitly. It needs to cover who processes the data and where, zero retention, the model's origin and bias risk, and that the sandbox limits what generated code can do. In Feb 2025 the Dutch government banned civil servants from using the DeepSeek *app*.

---

## Commercial model: per-seat pricing

Municipalities pay us per employee per month. We pay the model provider per token on **one company account**, plus a fixed VPS cost. The provider never sees our customers, so usage risk and margin sit with us. **Only our harness knows who used what**: none of the providers reports usage per end user.

Token cost per employee, assuming one question ≈ 8 model calls × (20k input + 1.5k output), which is ≈ 160k input and 12k output tokens. List prices, no caching:

| Usage profile | Questions / month | Qwen3.8-27B (Scaleway) | GLM-5.3 (Melious) | DeepSeek V4.1 Flash (Melious) |
|---|---|---|---|---|
| Occasional | ~20 | ~€3 | ~€4 | ~€1 |
| Regular | ~100 | ~€14 | ~€20 | ~€4 |
| Power user | ~400 | ~€54 | ~€78 | ~€18 |
| **Pilot total** (40M in + 4M out) | 20 users | ~€37 (OVH ~€27) | ~€52 | ~€12 |

- A **fair-use limit per seat**, enforced by the harness. One analyst can use as much as 20 colleagues.
- A **token and wall-clock budget per question**, so a runaway loop can't cost euros.
- **Prompt caching** of the fixed system prompt and SDK docs, where the provider offers it.
- **Metering:** log the `usage` of every model call per user and per municipality.
- **Customer terms** need a pass-through clause for the model provider's terms (OVH requires it).

### How many users one account carries

Assumption: 20% of logged-in employees are running an analysis at any moment. One active agent turn ≈ 2 requests/min and ≈ 43k tokens/min.

| Provider | Limit that binds first | Logged-in users (ceiling) |
|---|---|---|
| Scaleway | tokens per minute | ~115 on GLM-5.2, ~230 on large Qwen |
| OVHcloud | 400 req/min per model | ~1,000 in theory; token limit unknown, load-test |
| IONOS | ~300 req/min per contract | ~750 |
| Melious Unlimited | 1 concurrent GLM-5.3 request | ~5 |

Plan for about half of each ceiling, because everyone starts at 09:00. For a pilot of 20–50 employees, one Scaleway or OVH account is plenty, and the router fails over to the other provider on errors or 429s.

---

## Infrastructure

| | What it is | Pros | Cons |
|---|---|---|---|
| **One own EU VPS + Docker** (now) | One large CPU VM running the whole Basis Stadstwin plus the Werkruimte services; one container per user sandbox. | Simple and cheap; one domain, no CORS, no Vercel limits on data. | Single machine: no failover, limited scale; we manage the host. |
| **Kubernetes / Haven** (later) | A cluster; each sandbox is a pod with its own PVC, limits and gVisor. Haven is the VNG standard for Kubernetes at Dutch municipalities (Common Ground). | Scales out, failover, fits how municipalities procure. | More operational know-how; higher starting cost. |
| **Managed sandbox SaaS** (E2B, Modal, Daytona), rejected | A company runs the sandboxes for us. | No infrastructure. | Mostly US-hosted: municipal data and code leave our control. |

The sandbox manager sits behind a driver interface, so a later `KubernetesDriver` needs no change in the harness or the frontend.

## Target architecture

```
Employee's browser
  └─ HTTPS, one domain, login token ─────────────┐
                                                 ▼
Own EU VPS (docker-compose, behind Caddy)
  • Stadstwin app (Next.js, moved off Vercel): viewer + /api/v1 + GeoParquet cache
  • Keycloak (OIDC) ── federates to the municipality's Entra ID
  • Agent service (Node/TS): harness loop, tools, metering, audit log (Postgres)
        │                    │                         │
        ▼                    ▼                         ▼
  Model router (LiteLLM)  Sandbox manager          Check browser
  Scaleway → OVH          DockerDriver →           headless Chrome (Puppeteer),
  (→ Melious w/ consent)  K8sDriver later          renders the local app + result layer
        │                    │
        ▼                    ▼
  EU model APIs         Sandbox per user (gVisor, non-root, limits, /home/user volume)
                        • runner (FastAPI): /exec, /bash, /files
                        • geopandas, shapely, pyproj, duckdb-spatial, pandas, matplotlib …
                        • stadstwin SDK: load_layer, validate, show_table, add_map_layer
                             │ internal network → stadstwin /api/v1
                             │ outside only via
                             ▼
                        Egress proxy (allowlist): PDOK, CBS, own PyPI mirror
```

**Main design decisions:**
- **The harness runs outside the sandbox.** Model keys, policies, metering and the audit log never sit in the container that runs model-written code.
- **Our own harness in TypeScript.** The value is in the map integration and in reusing `tools.ts` and the layer registry with any OpenAI-compatible model.
- **Data comes from the local app.** The SDK calls `/api/v1/layers/<id>` on the internal network, backed by a GeoParquet cache.
- **Structured output only.** The panel renders JSON tables, PNG and sanitised GeoJSON, never raw HTML from the sandbox in the app's origin.

---

## Phase 0: eval first (about a week)

Answer the biggest unknown before building infrastructure: can an affordable EU-hosted model reliably do Zwolle analyses?

- The sandbox image and `stadstwin` SDK (1a), run locally with Docker.
- A thin command-line harness against the model router, with `run_python`, `validate` and `preview_on_map`.
- `services/agent/evals/`: 15–20 Zwolle questions with reference answers, answered in Dutch, some needing 10–30 rounds.
- Run it against:
  - **Qwen3.8-27B** on Scaleway and OVH
  - **GLM-5.3** and **DeepSeek V4.1 Flash** on a Melious trial account
  - one frontier model as a quality baseline

  Score correctness, rounds, tokens, cost and Dutch quality.
- The outcome settles three things:
  - which model is primary
  - whether a cheap tier works (cheap model first, escalating when it's stuck or the self-check fails)
  - whether the Melious consent is worth pursuing

## Phase 1: working PoC on the own VPS

### 1a. Sandbox image, runner and SDK (`services/sandbox/`)
- `Dockerfile`: Python 3.12-slim + the geo stack + `ipykernel`; non-root; read-only rootfs except `/home/user` and `/tmp`.
- `runner/app.py` (FastAPI):
  - `POST /exec` runs code in a persistent kernel.
  - `POST /bash`, and `GET/PUT /files/*` restricted to `/home/user`.
  - Timeout is 120 s per call; auth uses a per-sandbox bearer token.
- `stadstwin_sdk/`:
  - `st.list_layers(query)`, `st.layer_info(id)`, and `st.load_layer(id, city="zwolle", crs=28992) -> GeoDataFrame`, which returns the full dataset from the cache.
  - `st.validate(gdf)` checks the CRS, the bounding box against the city boundary, empty or invalid geometries and row counts, and returns the results as text facts.
  - `st.show_table(df)`, `st.show_chart(fig)` and `st.add_map_layer(gdf, name, color_by=None)` write to `/home/user/outputs/` along with a manifest.

### 1b. Sandbox manager (`services/agent/src/sandbox/`)
- `driver.ts`: `SandboxDriver { ensure(userId), exec(), bash(), files(), stop(), destroy() }`.
- `docker-driver.ts` (`dockerode`): container + volume `stw-home-<userId>`, `--runtime=runsc`, CPU/memory/pids limits, only on the internal `sandboxes` network.
- Idle reaper: stop after 30 min idle and keep the volume; delete volumes after N days unused.

### 1c. Agent service and harness (`services/agent/`)
- Node with Hono. SSE endpoint `POST /v1/sessions/:id/messages`, plus `GET /v1/sessions` and `GET /v1/files`. Served under the app's own domain.
- `harness.ts`, grown from `chat-loop.ts`:
  - streaming, ≤ 30 rounds, and a token and wall-clock budget per question
  - context compaction
  - `reasoning_content` passed back between tool calls
  - emits the events `text`, `tool_call`, `tool_result`, `code_cell`, `display` and `map_action`
- Tools:
  - the five catalogue tools from `tools.ts`
  - new: `run_python`, `bash`, `read_file`, `write_file`, `list_files`, `show_on_map(outputPath)` and `preview_on_map(outputPath)`
- Check browser (`services/check-browser/`):
  - One headless Chrome through Puppeteer, with a page pool.
  - It opens the local app with the result layer and returns screenshots of the map, legend and charts.
  - If the primary model is text-only, the screenshot goes to Qwen3.8-27B for a written verdict.
- Metering: the `usage` of every model call is stored per user and municipality, and a fair-use limit applies per seat.
- Auth: the service validates the Keycloak JWT; `userId` is the token's `sub`.

### 1d. Model router (`deploy/litellm.yaml`)
- The alias `stadstwin-agent` points to the phase 0 winner at Scaleway, failing over to OVH on errors or 429s.
- The alias `stadstwin-vision` points to Qwen3.8-27B.
- Melious entries are added only after written consent to serve our customers.
- Local development can point at Ollama.

### 1e. Deployment (`deploy/docker-compose.werkruimte.yml`)
- Services:
  - `caddy` (TLS, one domain)
  - `stadstwin` (the Next.js app, moved off Vercel)
  - `agent`, `check-browser`, `litellm`, `keycloak`
  - `postgres` (sessions, audit log, metering)
  - `egress-proxy` (Squid allowlist)
- Networks: `sandboxes` is internal and reaches only `stadstwin` and `egress-proxy`; `backend` is for the rest.

### 1f. Frontend changes (existing repo)
- **`src/components/assistant/assistant-panel.tsx`**: a third mode, "Werkruimte", with login.
  - It renders code cells collapsed with their output, tables and images.
  - It adds a "Bestanden" tab listing `/home/user`.
- **`src/app/[city]/city-map.tsx`**: result layers.
  - A `map_action` with GeoJSON becomes a `DataSource` in category "Analyse", added via the `handleApplyLayers` path.
  - Result layers reload from `outputs/`, so they survive a page reload.
- **`src/app/api/v1/layers/[layerId]/route.ts`**: `?full=true` calls `fetchData(true)`, backed by the cache. Vector-tile-only and WMS layers get a clear 4xx.
- **`src/lib/assistant/{tools,chat-loop}.ts`**: move the tool definitions into a small shared package so the agent service can import them. The current modes behave the same.

## Phase 2: hardening and contracts
- gVisor mandatory with a seccomp profile. Egress allowlist enforced. PyPI mirror (devpi) with a package allowlist.
- Quotas per user (CPU minutes, tokens, disk), rate limiting, and fair-use limits per seat.
- Audit log: every prompt, tool call, executed cell and output hash, with retention per the archiving policy, plus an export for the CISO.
- Keycloak federation with the municipality's Entra ID, and groups that decide who may use the Werkruimte.
- Contracts: a Scaleway volume commitment if needed, OVH as failover, and customer terms with a pass-through clause.
- Governance: a DPIA including the model-origin section, a BIO mapping, and an algorithm-register entry or EU AI Act transparency note.
- Re-run the eval whenever a provider adds a model.

## Phase 3: scale and extras
- `KubernetesDriver`: a pod plus PVC plus `RuntimeClass: gvisor` plus a NetworkPolicy per user, on a Haven cluster.
- Multiple municipalities as tenants, each with its own namespace, egress allowlist, model policy and billing.
- "Analysis recipes": save scripts and share them with colleagues, and run them on a schedule.
- Optional: a Python port of, or an endpoint for, the storymap compute engine.

## Open actions
1. **Email Melious.** Ask for:
   - written consent to serve municipal employees from one account (an enterprise agreement)
   - which host serves GLM-5.3 and DeepSeek V4.1 Flash, and where (Nebius?)
   - their rate limits and ISO 27001 timeline
   - a DPA that says "EU/EEA only"
2. Confirm Scaleway's model id, context length and rate limits for Qwen3.8-27B. It isn't in their quota table yet.
3. Load-test OVH, because its token and concurrency limits aren't published.
4. Confirm VAT reverse charge on Melious invoices. Prices exclude VAT, and the seller is a German GmbH.
5. Plan the move of the Basis Stadstwin from Vercel to the own VPS.

## Critical files

**New**
- `services/sandbox/{Dockerfile, runner/app.py, stadstwin_sdk/}`
- `services/agent/src/{server.ts, harness.ts, tools/*.ts, sandbox/{driver,docker-driver}.ts, auth.ts, audit.ts, metering.ts}`
- `services/agent/evals/`
- `services/check-browser/`
- `deploy/docker-compose.werkruimte.yml`, `deploy/litellm.yaml`, `deploy/Caddyfile`, `deploy/squid-allowlist.conf`
- `docs/werkruimte-architectuur.md`

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
1. Phase 0: the eval runs against at least three models and produces a score table (correctness, rounds, tokens, cost).
2. `docker compose -f deploy/docker-compose.werkruimte.yml up` on the VPS. The stadstwin and the Werkruimte answer on one domain.
3. Sandbox check: `/exec` with `st.load_layer('<laadpalen-id>').shape` returns the full dataset.
4. Isolation checks from inside the sandbox:
   - `curl https://example.com` fails, while `st.load_layer` works.
   - The container runs as non-root, with gVisor active.
   - `litellm`, `postgres` and `keycloak` are unreachable.
5. End to end: ask "Hoeveel laadpalen liggen binnen 400 m van een school, per wijk? Zet het resultaat op de kaart." Expect a code cell, a table, a `preview_on_map` step, and a new "Analyse" layer with a working FeaturePanel.
6. Failover: block Scaleway in the router, and the same question completes via OVH.
7. Metering: the question's tokens appear under the right user and municipality.
8. Persistence: log out and back in. The script is still in Bestanden and the result layer reloads. After 30 minutes idle the container stops and the volume remains.
