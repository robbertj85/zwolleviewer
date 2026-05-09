/**
 * Drenthe provincial layers.
 *
 * TODO: Investigate provincial open data endpoints:
 *   - https://geoportaal.drenthe.nl (ArcGIS portal)
 *   - https://www.drenthe.nl/actueel/open-data
 * No confirmed public WFS/REST endpoints found yet -- stub in place.
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";

export function buildDrentheLayers(_city: CityConfig): DataSource[] {
  return [];
}
