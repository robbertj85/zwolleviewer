/**
 * noord-holland provincial layers.
 *
 * TODO: Investigate provincial open data endpoints:
 *   - https://geo.noord-holland.nl, https://services.noord-holland.nl/geoserver
 * No confirmed public WFS/REST endpoints found yet -- stub in place.
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";

export function buildNoordHollandLayers(_city: CityConfig): DataSource[] {
  return [];
}
