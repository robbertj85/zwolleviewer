/**
 * flevoland provincial layers.
 *
 * TODO: Investigate provincial open data endpoints:
 *   - https://services.flevoland.nl/geoserver, https://geo.flevoland.nl
 * No confirmed public WFS/REST endpoints found yet -- stub in place.
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";

export function buildFlevolandLayers(_city: CityConfig): DataSource[] {
  return [];
}
