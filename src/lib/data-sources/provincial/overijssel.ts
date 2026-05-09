/**
 * Overijssel provincial layers — shared by all Overijssel municipalities.
 *
 * Source: Geoportaal Overijssel (services.geodataoverijssel.nl)
 * Extracted from cities/zwolle.ts — layer IDs are unchanged.
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";
import { fetchOverijsselWFS } from "../fetchers";

export function buildOverijsselLayers(city: CityConfig): DataSource[] {
  const bboxWFS = city.bboxWFS;

  return [
    {
      id: "ov-fietsnetwerk",
      name: "Hartlijnen Wegen (NWB Overijssel)",
      endpoint: "services.geodataoverijssel.nl/geoserver/B22_wegen/wfs",
      source: "Geoportaal Overijssel",
      description: "Hartlijnen wegennetwerk NWB in Overijssel",
      category: "verkeer-logistiek",
      color: [0, 200, 200, 140],
      icon: "Route",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 500,
      fetchData: async (full) =>
        fetchOverijsselWFS(
          "B22_wegen",
          "B22_wegen:B2_Hartlijnen_wegen_NWB",
          bboxWFS,
          500,
          full
        ),
    },
    {
      id: "ov-gastankstations",
      name: "Gas/Groengas Tankstations",
      endpoint: "services.geodataoverijssel.nl/geoserver/B42_energie/wfs",
      source: "Geoportaal Overijssel",
      description: "Aardgas en groengas tankstations in Overijssel",
      category: "mobiliteitsdiensten",
      color: [0, 200, 80, 200],
      icon: "Gauge",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 6,
      defaultLimit: 100,
      fetchData: async (full) =>
        fetchOverijsselWFS(
          "B42_energie",
          "B42_energie:B4_aardgas_en_groengas_tankstations_in_Overijssel",
          bboxWFS,
          100,
          full
        ),
    },
    {
      id: "ov-vaarwegen",
      name: "Provinciale Vaarwegen",
      endpoint: "services.geodataoverijssel.nl/geoserver/B23_waterwegen/wfs",
      source: "Geoportaal Overijssel",
      description: "Vaarroutes van provinciale vaarwegen",
      category: "mobiliteitsdiensten",
      color: [40, 120, 200, 160],
      icon: "Ship",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 200,
      fetchData: async (full) =>
        fetchOverijsselWFS(
          "B23_waterwegen",
          "B23_waterwegen:B23_Vaarwegen_beroepsvaart",
          bboxWFS,
          200,
          full
        ),
    },
  ];
}
