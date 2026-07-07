/**
 * Story-map registry: koppelt `DataSource.id` → `StoryDefinition`.
 *
 * Verhalen zijn generiek per laag (zelfde verhaal voor alle gemeenten); de
 * cijfers/grafieken erin worden client-side berekend uit de geladen features
 * van de actieve gemeente (zie `compute.ts` en `StoryPanel`).
 *
 * Proof of concept: alleen de mobiliteits-/verkeerslagen (categorieën
 * `mobiliteitsdiensten` en `verkeer-logistiek`, nationale lagen).
 */

import type { StoryDefinition } from "./types";
import { stories as ovSpoor } from "./content/ov-spoor";
import { stories as laadinfra } from "./content/laadinfra";
import { stories as ndwLive } from "./content/ndw-live";
import { stories as wegennet } from "./content/wegennet";
import { stories as logistiekFiets } from "./content/logistiek-fiets";

const ALL_STORIES: StoryDefinition[] = [
  ...ovSpoor,
  ...laadinfra,
  ...ndwLive,
  ...wegennet,
  ...logistiekFiets,
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
