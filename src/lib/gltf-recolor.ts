// Per-building coloring for PDOK 3D tiles.
//
// luma.gl's glTF pipeline has no vertex-color (COLOR_0) support, so coloring
// individual buildings is done by regrouping triangles: every primitive is
// split into one primitive per distinct color, each sharing the original
// vertex accessors but carrying its own index accessor and a material clone
// with that color as baseColorFactor. Features without a color stay on the
// original (default) material.

export type RGB = [number, number, number];

interface RecolorAccessor {
  value: Float32Array | Uint16Array | Uint32Array;
  count: number;
  componentType?: number;
  type?: string;
  components?: number;
  size?: number;
  min?: number[];
  max?: number[];
}

interface RecolorPrimitive {
  attributes?: Record<string, RecolorAccessor>;
  indices?: RecolorAccessor;
  material?: {
    id?: string;
    pbrMetallicRoughness?: { baseColorFactor?: number[] };
  } & Record<string, unknown>;
}

interface RecolorGLTF {
  meshes?: { primitives?: RecolorPrimitive[] }[];
  extras?: { pdokBuildings?: { ids?: string[]; years?: (number | null)[] } };
}

const GL_UNSIGNED_INT = 5125;

/**
 * Split primitives so each building renders in the color returned by
 * `getColor(featureIndex)`; `null` keeps the tileset's default material.
 * Mutates the post-processed glTF in place.
 */
export function recolorBuildings(
  gltf: RecolorGLTF,
  getColor: (featureIndex: number) => RGB | null
): void {
  for (const mesh of gltf?.meshes ?? []) {
    if (!mesh.primitives) continue;
    const result: RecolorPrimitive[] = [];
    for (const primitive of mesh.primitives) {
      const featureIds = primitive.attributes?._FEATURE_ID_0?.value;
      const indices = primitive.indices?.value;
      if (!featureIds || !indices) {
        result.push(primitive);
        continue;
      }

      const groups = new Map<string, { color: RGB | null; indices: number[] }>();
      for (let t = 0; t + 2 < indices.length; t += 3) {
        const color = getColor(featureIds[indices[t]]);
        const key = color ? color.join(",") : "default";
        let group = groups.get(key);
        if (!group) {
          group = { color, indices: [] };
          groups.set(key, group);
        }
        group.indices.push(indices[t], indices[t + 1], indices[t + 2]);
      }

      if (groups.size === 1 && groups.has("default")) {
        result.push(primitive);
        continue;
      }

      for (const [key, group] of groups) {
        const splitIndices: RecolorAccessor = {
          ...primitive.indices,
          value: new Uint32Array(group.indices),
          count: group.indices.length,
          componentType: GL_UNSIGNED_INT,
        };
        let material = primitive.material;
        if (group.color && material) {
          material = {
            ...material,
            id: `${material.id ?? "material"}-${key}`,
            pbrMetallicRoughness: {
              ...material.pbrMetallicRoughness,
              baseColorFactor: [
                group.color[0] / 255,
                group.color[1] / 255,
                group.color[2] / 255,
                1,
              ],
            },
          };
        }
        result.push({ ...primitive, indices: splitIndices, material });
      }
    }
    mesh.primitives = result;
  }
}
