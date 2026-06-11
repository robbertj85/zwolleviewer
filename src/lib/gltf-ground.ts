// Ground PDOK 3D tiles onto the flat basemap.
//
// PDOK tile geometry lives at real ellipsoidal heights: NAP terrain height
// plus the ~43 m geoid undulation of the Netherlands. deck.gl draws the
// basemap plane at z = 0, so untreated tiles float ~45 m in the air. Each
// tile is anchored at content.cartographicOrigin ([lng, lat, height]) with
// vertex offsets relative to it, so grounding is a matter of finding the
// tile's lowest vertex in world space and moving the origin height such
// that this point lands on z = 0.

import { Matrix4 } from "@math.gl/core";

interface GroundNode {
  matrix?: number[];
  translation?: number[];
  rotation?: number[];
  scale?: number[];
  mesh?: { primitives?: { attributes?: { POSITION?: { value?: unknown } } }[] };
  children?: GroundNode[];
}

interface GroundContent {
  cartographicOrigin?: number[];
  modelMatrix?: number[];
  gltf?: {
    scene?: { nodes?: GroundNode[] };
    scenes?: { nodes?: GroundNode[] }[];
    nodes?: GroundNode[];
  };
}

function nodeMatrix(node: GroundNode, parent: Matrix4): Matrix4 {
  if (node.matrix) {
    return new Matrix4(parent).multiplyRight(node.matrix);
  }
  if (node.translation || node.rotation || node.scale) {
    const local = new Matrix4().identity();
    if (node.translation) local.translate(node.translation as [number, number, number]);
    if (node.rotation) {
      local.multiplyRight(new Matrix4().fromQuaternion(node.rotation as [number, number, number, number]));
    }
    if (node.scale) local.scale(node.scale as [number, number, number]);
    return new Matrix4(parent).multiplyRight(local);
  }
  return parent;
}

/**
 * Shift the tile's cartographic origin so its lowest vertex sits at z = 0.
 * Call after dequantizeGLTF (positions must be float32). Mutates content.
 */
export function groundTileToZero(content: GroundContent | undefined): void {
  const origin = content?.cartographicOrigin;
  const gltf = content?.gltf;
  if (!origin || !gltf) return;

  const roots =
    gltf.scene?.nodes ?? gltf.scenes?.[0]?.nodes ?? gltf.nodes ?? [];
  const base = content.modelMatrix
    ? new Matrix4(content.modelMatrix)
    : new Matrix4().identity();
  let minZ = Infinity;

  const visit = (node: GroundNode, parent: Matrix4) => {
    const m = nodeMatrix(node, parent);
    for (const primitive of node.mesh?.primitives ?? []) {
      const positions = primitive.attributes?.POSITION?.value;
      if (!(positions instanceof Float32Array)) continue;
      // z-component of (m * [x, y, z, 1]) for a column-major matrix
      const zx = m[2];
      const zy = m[6];
      const zz = m[10];
      const zw = m[14];
      for (let i = 0; i + 2 < positions.length; i += 3) {
        const z = zx * positions[i] + zy * positions[i + 1] + zz * positions[i + 2] + zw;
        if (z < minZ) minZ = z;
      }
    }
    for (const child of node.children ?? []) visit(child, m);
  };
  for (const node of roots) visit(node, base);

  if (!Number.isFinite(minZ)) return;
  origin[2] = -minZ;
}
