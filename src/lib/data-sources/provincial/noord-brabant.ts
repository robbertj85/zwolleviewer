/**
 * Noord-Brabant provincial layers — shared by all Noord-Brabant municipalities.
 *
 * Source: Atlas Brabant (atlas.brabant.nl/arcgis/rest/services)
 * Extracted from cities/helmond.ts — layer IDs are unchanged.
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";
import { fetchArcGISQuery } from "../fetchers";

const BRABANT_GIS = "https://atlas.brabant.nl/arcgis/rest/services";

function brabant(
  service: string,
  layerId: number,
  serverType: "FeatureServer" | "MapServer" = "MapServer",
  maxFeatures = 2000,
  full = false
) {
  return fetchArcGISQuery(BRABANT_GIS, service, layerId, serverType, maxFeatures, full);
}

export function buildNoordBrabantLayers(_city: CityConfig): DataSource[] {
  return [
    {
      id: "br-provinciale-wegen",
      name: "Provinciale Wegen (Brabant)",
      endpoint: "atlas.brabant.nl/arcgis/rest/services/Provinciale_wegen/MapServer/0",
      source: "Atlas Brabant",
      description: "Provinciale wegen in Noord-Brabant",
      category: "verkeer-logistiek",
      color: [200, 140, 60, 200],
      icon: "Route",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) => brabant("Provinciale_wegen", 0, "MapServer", 500, full),
    },
    {
      id: "br-hectometrering",
      name: "Hectometrering Provinciale Wegen",
      endpoint: "atlas.brabant.nl/arcgis/rest/services/Provinciale_wegen/MapServer/1",
      source: "Atlas Brabant",
      description: "Hectometerpalen langs provinciale wegen",
      category: "verkeer-logistiek",
      color: [180, 120, 40, 180],
      icon: "MapPin",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 3,
      defaultLimit: 1000,
      isNew: true,
      fetchData: async (full) => brabant("Provinciale_wegen", 1, "MapServer", 1000, full),
    },
    {
      id: "br-wegassen",
      name: "Wegassen Provinciale Wegen",
      endpoint: "atlas.brabant.nl/arcgis/rest/services/Provinciale_wegen/MapServer/2",
      source: "Atlas Brabant",
      description: "Wegassen van provinciale wegen",
      category: "verkeer-logistiek",
      color: [220, 160, 80, 160],
      icon: "Route",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) => brabant("Provinciale_wegen", 2, "MapServer", 500, full),
    },
  ];
}
