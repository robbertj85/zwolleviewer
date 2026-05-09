/**
 * Backward-compatibility re-export shim. The implementation now lives in
 * `./data-sources/`. New code should import from `@/lib/data-sources/index`
 * directly; this file keeps existing call sites (`@/lib/data-sources`)
 * working.
 */

export type {
  DataSource,
  LayerMetadata,
  LayerCategory,
  ImageCategory,
} from "./data-sources/index";

export {
  CATEGORIES,
  IMAGE_CATEGORIES,
  buildDataSources,
  getLayerMetadata,
  buildDataSourcesForSlug,
  getBaselineCatalog,
} from "./data-sources/index";

export type { BaselineLayerEntry } from "./data-sources/index";
