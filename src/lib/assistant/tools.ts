/**
 * Shared "talk to the system" tools.
 *
 * These tool definitions are exposed two ways:
 *  - to a user-supplied LLM via `/api/assistant/chat` (OpenAI- and
 *    Anthropic-style tool calling), and
 *  - over MCP via `/api/mcp` (JSON-RPC `tools/list` / `tools/call`).
 *
 * Both surfaces call `runAssistantTool()` below so behaviour stays in sync.
 * Every tool is read-only and resolves entirely against the in-process data
 * source catalogue — no upstream calls except `get_layer_sample`, which
 * fetches a small slice of live GeoJSON.
 */

import { getCity, getLiveCities } from "@/lib/cities";
import {
  CATEGORIES,
  buildDataSources,
  type LayerCategory,
} from "@/lib/data-sources";

export interface ToolSpec {
  name: string;
  description: string;
  /** JSON Schema for the arguments object. */
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export const ASSISTANT_TOOLS: ToolSpec[] = [
  {
    name: "list_cities",
    description:
      "List the municipalities ('steden') that have a live city twin in this platform, with their province. Use this when the user mentions a city you should resolve to a slug.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_categories",
    description:
      "List the data-layer categories (themes) and how many layers each holds for a given city. Good first call to give the user an overview before drilling in.",
    inputSchema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description:
            "City slug (e.g. 'zwolle', 'rotterdam'). Defaults to 'zwolle'.",
        },
      },
    },
  },
  {
    name: "search_layers",
    description:
      "Search the GIS data-layer catalogue for a city by free-text query and/or category. Returns id, name, description, source and category for each match. This is the main way to help a user find the right layer among hundreds.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Free-text search over layer name, description and id (Dutch). Optional.",
        },
        category: {
          type: "string",
          description:
            "Restrict to one category id. One of: " +
            Object.keys(CATEGORIES).join(", "),
        },
        city: {
          type: "string",
          description: "City slug. Defaults to 'zwolle'.",
        },
        limit: {
          type: "number",
          description: "Max results (default 25, max 100).",
        },
      },
    },
  },
  {
    name: "set_active_layers",
    description:
      "Show or hide GIS layers ON THE MAP the user is looking at. Use this to act on the user's request ('zet laag X aan', 'laat laadpalen en geluidsbelasting zien', 'verberg alles'). Pass layer ids you obtained from search_layers. mode 'replace' = make exactly these layers visible (default), 'add' = also show these, 'remove' = hide these. Only works when an interactive map is present; otherwise it returns applied=false.",
    inputSchema: {
      type: "object",
      properties: {
        layerIds: {
          type: "array",
          items: { type: "string" },
          description: "Layer ids to act on.",
        },
        mode: {
          type: "string",
          enum: ["replace", "add", "remove"],
          description: "How to apply the list. Default 'replace'.",
        },
        city: { type: "string", description: "City slug. Defaults to 'zwolle'." },
      },
      required: ["layerIds"],
    },
  },
  {
    name: "get_layer_sample",
    description:
      "Fetch metadata plus a small sample of live GeoJSON features for one layer (by id). Use this to inspect what attributes a layer actually contains before recommending it. Can be slow for big upstream feeds.",
    inputSchema: {
      type: "object",
      properties: {
        layerId: { type: "string", description: "The layer id." },
        city: {
          type: "string",
          description: "City slug. Defaults to 'zwolle'.",
        },
        maxFeatures: {
          type: "number",
          description: "Number of sample features to return (default 3, max 10).",
        },
      },
      required: ["layerId"],
    },
  },
];

function resolveCity(slug: unknown) {
  const s = typeof slug === "string" && slug ? slug : "zwolle";
  return getCity(s) ?? getCity("zwolle")!;
}

export interface ToolResult {
  ok: boolean;
  /** Plain-text/JSON-stringifiable payload returned to the model. */
  data: unknown;
}

export async function runAssistantTool(
  name: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  try {
    switch (name) {
      case "list_cities": {
        return {
          ok: true,
          data: getLiveCities().map((c) => ({
            slug: c.slug,
            name: c.name,
            province: c.province,
          })),
        };
      }

      case "list_categories": {
        const city = resolveCity(args.city);
        const layers = buildDataSources(city);
        const counts = new Map<string, number>();
        for (const l of layers) counts.set(l.category, (counts.get(l.category) ?? 0) + 1);
        return {
          ok: true,
          data: {
            city: city.slug,
            categories: Object.entries(CATEGORIES).map(([id, meta]) => ({
              id,
              label: meta.label,
              layerCount: counts.get(id) ?? 0,
            })),
          },
        };
      }

      case "search_layers": {
        const city = resolveCity(args.city);
        const q =
          typeof args.query === "string" ? args.query.toLowerCase().trim() : "";
        const cat =
          typeof args.category === "string" && args.category in CATEGORIES
            ? (args.category as LayerCategory)
            : null;
        const limit = Math.min(
          Math.max(Number(args.limit) || 25, 1),
          100
        );
        let layers = buildDataSources(city);
        if (cat) layers = layers.filter((l) => l.category === cat);
        if (q) {
          layers = layers.filter(
            (l) =>
              l.name.toLowerCase().includes(q) ||
              l.description.toLowerCase().includes(q) ||
              l.id.toLowerCase().includes(q) ||
              l.source.toLowerCase().includes(q)
          );
        }
        const total = layers.length;
        return {
          ok: true,
          data: {
            city: city.slug,
            total,
            returned: Math.min(total, limit),
            layers: layers.slice(0, limit).map((l) => ({
              id: l.id,
              name: l.name,
              description: l.description,
              category: l.category,
              categoryLabel: CATEGORIES[l.category].label,
              source: l.source,
              availability: l.availability ?? "live",
              apiEndpoint: `/api/v1/layers/${l.id}?city=${city.slug}`,
            })),
          },
        };
      }

      case "set_active_layers": {
        const city = resolveCity(args.city);
        const wanted = Array.isArray(args.layerIds) ? args.layerIds.map(String) : [];
        const mode =
          args.mode === "add" || args.mode === "remove" ? args.mode : "replace";
        const catalogue = buildDataSources(city);
        const byId = new Map(catalogue.map((l) => [l.id, l]));
        const valid = wanted.filter((id) => byId.has(id) && byId.get(id)!.availability !== "stub");
        const invalid = wanted.filter((id) => !valid.includes(id));
        // The browser performs the actual mutation (it owns the map state);
        // here we just validate and echo so the model has accurate feedback.
        return {
          ok: valid.length > 0 || wanted.length === 0,
          data: {
            applied: true,
            mode,
            city: city.slug,
            layerIds: valid,
            names: valid.map((id) => ({ id, name: byId.get(id)!.name })),
            ...(invalid.length ? { ignoredUnknownIds: invalid } : {}),
          },
        };
      }

      case "get_layer_sample": {
        const city = resolveCity(args.city);
        const layerId = String(args.layerId ?? "");
        const max = Math.min(Math.max(Number(args.maxFeatures) || 3, 1), 10);
        const source = buildDataSources(city).find((s) => s.id === layerId);
        if (!source) {
          return { ok: false, data: { error: `No layer '${layerId}' for city '${city.slug}'` } };
        }
        if (source.availability === "stub") {
          return {
            ok: false,
            data: {
              error: `Layer '${layerId}' has no data for '${city.slug}' yet`,
              metadata: { id: source.id, name: source.name, source: source.source },
            },
          };
        }
        const fc = await source.fetchData();
        const features = Array.isArray(fc?.features) ? fc.features : [];
        return {
          ok: true,
          data: {
            metadata: {
              id: source.id,
              name: source.name,
              description: source.description,
              category: source.category,
              categoryLabel: CATEGORIES[source.category].label,
              source: source.source,
              sourceUrl: source.sourceUrl,
              accessType: source.accessType,
              freshness: source.freshness,
              apiEndpoint: `/api/v1/layers/${source.id}?city=${city.slug}`,
            },
            featureCount: features.length,
            sample: features.slice(0, max),
          },
        };
      }

      default:
        return { ok: false, data: { error: `Unknown tool '${name}'` } };
    }
  } catch (e) {
    return {
      ok: false,
      data: { error: e instanceof Error ? e.message : String(e) },
    };
  }
}
