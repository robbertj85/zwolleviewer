/**
 * Provincial layer registry.
 *
 * Maps every Province value to a builder function. The orchestrator in
 * `data-sources/index.ts` calls `PROVINCIAL_BUILDERS[city.province]`
 * to inject the right provincial layers for any city.
 *
 * Provinces with real data: Gelderland, Overijssel, Utrecht (Noord-Brabant
 * heeft een module maar staat volledig op stub sinds Atlas Brabant offline
 * ging). All others export empty stubs -- the slot exists for future
 * contribution.
 */

import type { Province } from "../../cities";
import type { CityConfig } from "../../cities";
import type { DataSource } from "../types";

import { buildGelderlandLayers } from "./gelderland";
import { buildNoordBrabantLayers } from "./noord-brabant";
import { buildOverijsselLayers } from "./overijssel";
import { buildDrentheLayers } from "./drenthe";
import { buildFlevolandLayers } from "./flevoland";
import { buildFrieslandLayers } from "./friesland";
import { buildGroningenLayers } from "./groningen";
import { buildLimburgLayers } from "./limburg";
import { buildNoordHollandLayers } from "./noord-holland";
import { buildUtrechtLayers } from "./utrecht";
import { buildZeelandLayers } from "./zeeland";
import { buildZuidHollandLayers } from "./zuid-holland";

export const PROVINCIAL_BUILDERS: Record<
  Province,
  (city: CityConfig) => DataSource[]
> = {
  Drenthe: buildDrentheLayers,
  Flevoland: buildFlevolandLayers,
  Friesland: buildFrieslandLayers,
  Gelderland: buildGelderlandLayers,
  Groningen: buildGroningenLayers,
  Limburg: buildLimburgLayers,
  "Noord-Brabant": buildNoordBrabantLayers,
  "Noord-Holland": buildNoordHollandLayers,
  Overijssel: buildOverijsselLayers,
  Utrecht: buildUtrechtLayers,
  Zeeland: buildZeelandLayers,
  "Zuid-Holland": buildZuidHollandLayers,
};
