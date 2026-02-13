import { LAYER_METADATA, CATEGORIES, type LayerCategory } from "./data-sources";

export function generateOpenAPISpec() {
  const layerPaths: Record<string, object> = {};

  for (const layer of LAYER_METADATA) {
    layerPaths[`/api/v1/layers/${layer.id}`] = {
      get: {
        summary: layer.name,
        description: `${layer.description} (bron: ${layer.source})`,
        tags: [CATEGORIES[layer.category].label],
        parameters: [
          {
            name: "download",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["true"] },
            description: "Set to true to download as .geojson file",
          },
        ],
        responses: {
          "200": {
            description: "GeoJSON FeatureCollection",
            headers: {
              "X-Layer-Id": { schema: { type: "string" } },
              "X-Layer-Name": { schema: { type: "string" } },
              "X-Layer-Category": { schema: { type: "string" } },
              "X-Layer-Source": { schema: { type: "string" } },
              "X-Feature-Count": { schema: { type: "string" } },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FeatureCollection" },
              },
            },
          },
          "404": {
            description: "Layer not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "502": {
            description: "Upstream data source error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    };
  }

  const categoryIds = Object.keys(CATEGORIES) as LayerCategory[];
  const tags = categoryIds.map((id) => ({
    name: CATEGORIES[id].label,
    description: `${CATEGORIES[id].label} — ${LAYER_METADATA.filter((l) => l.category === id).length} layers`,
  }));

  return {
    openapi: "3.0.3",
    info: {
      title: "Zwolle Data Viewer API",
      description:
        "RESTful API for accessing GIS open data layers from the municipality of Zwolle. All data is returned as GeoJSON FeatureCollections.",
      version: "1.0.0",
      contact: {
        name: "Zwolle Data Viewer",
      },
    },
    servers: [{ url: "/", description: "Current server" }],
    tags,
    paths: {
      "/api/v1/layers": {
        get: {
          summary: "List all layers",
          description: "Returns metadata for all available GIS layers. Supports filtering by category and search.",
          tags: ["Catalog"],
          parameters: [
            {
              name: "category",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: categoryIds,
              },
              description: "Filter layers by category",
            },
            {
              name: "search",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "Search layers by name or description",
            },
          ],
          responses: {
            "200": {
              description: "Layer catalog",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LayerCatalog" },
                },
              },
            },
          },
        },
      },
      "/api/v1/categories": {
        get: {
          summary: "List all categories",
          description: "Returns all layer categories with their layer counts.",
          tags: ["Catalog"],
          responses: {
            "200": {
              description: "Category list",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CategoryList" },
                },
              },
            },
          },
        },
      },
      ...layerPaths,
    },
    components: {
      schemas: {
        FeatureCollection: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["FeatureCollection"] },
            features: {
              type: "array",
              items: { $ref: "#/components/schemas/Feature" },
            },
          },
        },
        Feature: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["Feature"] },
            geometry: { type: "object" },
            properties: { type: "object" },
          },
        },
        LayerCatalog: {
          type: "object",
          properties: {
            count: { type: "integer" },
            layers: {
              type: "array",
              items: { $ref: "#/components/schemas/LayerMetadata" },
            },
          },
        },
        LayerMetadata: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            source: { type: "string" },
            endpoint: { type: "string" },
            category: { type: "string" },
            icon: { type: "string" },
            categoryLabel: { type: "string" },
            apiEndpoint: { type: "string" },
            downloadUrl: { type: "string" },
          },
        },
        CategoryList: {
          type: "object",
          properties: {
            count: { type: "integer" },
            categories: {
              type: "array",
              items: { $ref: "#/components/schemas/Category" },
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            label: { type: "string" },
            icon: { type: "string" },
            layerCount: { type: "integer" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            layerId: { type: "string" },
            details: { type: "string" },
          },
        },
      },
    },
  };
}
