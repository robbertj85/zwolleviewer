/**
 * Noord-Brabant provincial layers — shared by all Noord-Brabant municipalities.
 *
 * Source was Atlas Brabant (atlas.brabant.nl/arcgis/rest/services), but die
 * ArcGIS-server is medio 2026 uit de lucht gehaald: de servicescatalogus is
 * leeg en elke service geeft "Service … not started". De provincie publiceert
 * nu via het Data Portaal Noord-Brabant
 * (data-portaal-noord-brabant.hub.arcgis.com, ArcGIS-org
 * services-eu1.arcgis.com/QZSyVglN6fBie4qh), maar daar is (nog) geen
 * provinciale-wegen/hectometrering-dataset gevonden. De drie weglagen staan
 * daarom op stub; landelijke dekking blijft beschikbaar via de nationale
 * NWB-laag (nwb-wegvakken, wegbeheerder-attribuut).
 *
 * Layer IDs zijn ongewijzigd (oorspronkelijk geëxtraheerd uit cities/helmond.ts).
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";
import { fetchEmpty } from "../fetchers";

export function buildNoordBrabantLayers(_city: CityConfig): DataSource[] {
  return [
    {
      id: "br-provinciale-wegen",
      name: "Provinciale Wegen (Brabant)",
      endpoint: "atlas.brabant.nl/arcgis/rest/services/Provinciale_wegen/MapServer/0",
      source: "Atlas Brabant",
      description:
        "Provinciale wegen in Noord-Brabant. Atlas Brabant (ArcGIS) is uit de lucht — stub tot de provincie een vervangend open eindpunt publiceert; zie ook de nationale NWB-laag.",
      category: "verkeer-logistiek",
      color: [200, 140, 60, 200],
      icon: "Route",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 500,
      availability: "stub",
      fetchData: fetchEmpty,
    },
    {
      id: "br-hectometrering",
      name: "Hectometrering Provinciale Wegen",
      endpoint: "atlas.brabant.nl/arcgis/rest/services/Provinciale_wegen/MapServer/1",
      source: "Atlas Brabant",
      description:
        "Hectometerpalen langs provinciale wegen. Atlas Brabant (ArcGIS) is uit de lucht — stub tot de provincie een vervangend open eindpunt publiceert.",
      category: "verkeer-logistiek",
      color: [180, 120, 40, 180],
      icon: "MapPin",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 3,
      defaultLimit: 1000,
      availability: "stub",
      fetchData: fetchEmpty,
    },
    {
      id: "br-wegassen",
      name: "Wegassen Provinciale Wegen",
      endpoint: "atlas.brabant.nl/arcgis/rest/services/Provinciale_wegen/MapServer/2",
      source: "Atlas Brabant",
      description:
        "Wegassen van provinciale wegen. Atlas Brabant (ArcGIS) is uit de lucht — stub tot de provincie een vervangend open eindpunt publiceert.",
      category: "verkeer-logistiek",
      color: [220, 160, 80, 160],
      icon: "Route",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      availability: "stub",
      fetchData: fetchEmpty,
    },
  ];
}
