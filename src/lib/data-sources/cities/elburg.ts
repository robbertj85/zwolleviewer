/**
 * Elburg-specific layers.
 *
 * Elburg is a small historic gemeente (~23k inhabitants) in Gelderland,
 * known for the well-preserved Vesting Elburg (fortified town, 14th c.).
 *
 * Provincial layers (Gelderland geoportaal) are injected by the orchestrator
 * via PROVINCIAL_BUILDERS["Gelderland"] -- no need to repeat them here.
 *
 * Municipal open data investigation:
 *   - data-elburg.opendata.arcgis.com  -> no public hub found
 *   - gis.elburg.nl / geo.elburg.nl    -> no public endpoint found
 *   - elburg.maps.arcgis.com           -> no public service found
 *   - PDOK NGR search for GM0230       -> national layers only (covered by national.ts)
 *
 * Result: no Elburg-specific open GIS layers discoverable within scope.
 * The Gelderland provincial layers (gld-* IDs) already cover the province-wide
 * environmental, water and nature data. Rijksmonumenten (including Vesting Elburg)
 * are covered by the national RCE layer in national.ts.
 */

import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function buildElburgLayers(_city: CityConfig): DataSource[] {
  return [];
}
