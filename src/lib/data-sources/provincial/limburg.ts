/**
 * limburg provincial layers.
 *
 * TODO: Investigate provincial open data endpoints:
 *   - https://services.limburg.nl/geoserver, https://geo.prvlimburg.nl
 * No confirmed public WFS/REST endpoints found yet -- stub in place.
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";

export function buildLimburgLayers(_city: CityConfig): DataSource[] {
  return [];
}
