/**
 * Story-map registry: koppelt `DataSource.id` → `StoryDefinition`.
 *
 * Verhalen zijn generiek per laag (zelfde verhaal voor alle gemeenten); de
 * cijfers/grafieken erin worden client-side berekend uit de geladen features
 * van de actieve gemeente (zie `compute.ts` en `StoryPanel`).
 *
 * Dekt alle lagen: nationaal (per categorie gebundeld), provinciaal en
 * gemeente-specifiek (per stad, grote steden in meerdere delen).
 */

import type { StoryDefinition } from "./types";
import { stories as ovSpoor } from "./content/ov-spoor";
import { stories as laadinfra } from "./content/laadinfra";
import { stories as ndwLive } from "./content/ndw-live";
import { stories as wegennet } from "./content/wegennet";
import { stories as logistiekFiets } from "./content/logistiek-fiets";
import { stories as nationalGrenzenOmgeving } from "./content/national-grenzen-omgeving";
import { stories as nationalBodem } from "./content/national-bodem";
import { stories as nationalSociaal1 } from "./content/national-sociaal-1";
import { stories as nationalSociaal2 } from "./content/national-sociaal-2";
import { stories as nationalEnergieGebouwen } from "./content/national-energie-gebouwen";
import { stories as nationalGezondheidGroen } from "./content/national-gezondheid-groen";
import { stories as nationalVeiligheid } from "./content/national-veiligheid";
import { stories as provincialZuidHolland } from "./content/provincial-zuid-holland";
import { stories as provincialGelderlandBrabant } from "./content/provincial-gelderland-brabant";
import { stories as provincialUtrechtOverijssel } from "./content/provincial-utrecht-overijssel";
import { stories as zwolle1 } from "./content/zwolle-1";
import { stories as zwolle2 } from "./content/zwolle-2";
import { stories as zwolle3 } from "./content/zwolle-3";
import { stories as zwolle4 } from "./content/zwolle-4";
import { stories as zwolle5 } from "./content/zwolle-5";
import { stories as rotterdam1 } from "./content/rotterdam-1";
import { stories as rotterdam2 } from "./content/rotterdam-2";
import { stories as rotterdam3 } from "./content/rotterdam-3";
import { stories as rotterdam4 } from "./content/rotterdam-4";
import { stories as tilburg1 } from "./content/tilburg-1";
import { stories as tilburg2 } from "./content/tilburg-2";
import { stories as amsterdam1 } from "./content/amsterdam-1";
import { stories as amsterdam2 } from "./content/amsterdam-2";
import { stories as lochem } from "./content/lochem";
import { stories as delft } from "./content/delft";
import { stories as elburg } from "./content/elburg";
import { stories as stedenKlein } from "./content/steden-klein";

const ALL_STORIES: StoryDefinition[] = [
  ...ovSpoor,
  ...laadinfra,
  ...ndwLive,
  ...wegennet,
  ...logistiekFiets,
  ...nationalGrenzenOmgeving,
  ...nationalBodem,
  ...nationalSociaal1,
  ...nationalSociaal2,
  ...nationalEnergieGebouwen,
  ...nationalGezondheidGroen,
  ...nationalVeiligheid,
  ...provincialZuidHolland,
  ...provincialGelderlandBrabant,
  ...provincialUtrechtOverijssel,
  ...zwolle1,
  ...zwolle2,
  ...zwolle3,
  ...zwolle4,
  ...zwolle5,
  ...rotterdam1,
  ...rotterdam2,
  ...rotterdam3,
  ...rotterdam4,
  ...tilburg1,
  ...tilburg2,
  ...amsterdam1,
  ...amsterdam2,
  ...lochem,
  ...delft,
  ...elburg,
  ...stedenKlein,
];

const REGISTRY = new Map<string, StoryDefinition>(
  ALL_STORIES.map((s) => [s.layerId, s])
);

if (process.env.NODE_ENV !== "production" && REGISTRY.size !== ALL_STORIES.length) {
  const seen = new Set<string>();
  const dupes = ALL_STORIES.map((s) => s.layerId).filter((id) =>
    seen.has(id) ? true : (seen.add(id), false)
  );
  console.warn(`[stories] dubbele layerId's in registry: ${dupes.join(", ")}`);
}

export function getStory(layerId: string): StoryDefinition | undefined {
  return REGISTRY.get(layerId);
}

export function hasStory(layerId: string): boolean {
  return REGISTRY.has(layerId);
}

export type { StoryDefinition } from "./types";
