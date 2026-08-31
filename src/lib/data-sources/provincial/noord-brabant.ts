/**
 * Noord-Brabant provincial layers — shared by all Noord-Brabant municipalities.
 *
 * Source was Atlas Brabant (atlas.brabant.nl/arcgis/rest/services), maar die
 * ArcGIS-server is medio 2026 uit de lucht gehaald: de servicescatalogus is
 * leeg en elke service geeft "Service … not started". De provincie publiceert
 * nu via het Data Portaal Noord-Brabant
 * (data-portaal-noord-brabant.hub.arcgis.com, ArcGIS-org
 * services-eu1.arcgis.com/QZSyVglN6fBie4qh), maar daar is (nog) geen
 * provinciale-wegen/hectometrering-dataset gevonden.
 *
 * De drie weglagen (br-provinciale-wegen, br-hectometrering, br-wegassen)
 * stonden hier als `availability: "stub"` en zijn op 31-08-2026 verwijderd:
 * een grijze, niet-aanklikbare rij in elke Brabantse gemeente voegde niets toe
 * boven wat `/[city]/dekking` al toont. De toelichting per laag staat nu in
 * `src/lib/layer-availability-notes.ts`. Landelijke dekking blijft beschikbaar
 * via de nationale NWB-laag (nwb-wegvakken, wegbeheerder-attribuut).
 *
 * Zodra de provincie een vervangend open eindpunt publiceert, komen de lagen
 * hier terug — daarom blijft deze builder bestaan.
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";

export function buildNoordBrabantLayers(_city: CityConfig): DataSource[] {
  return [];
}
