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
  mesh?: {
    primitives?: {
      attributes?: {
        POSITION?: { value?: unknown };
        _FEATURE_ID_0?: { value?: unknown };
      };
    }[];
  };
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

export interface BuildingFootprint {
  /** Footprint centroid (x, y) and roof top (z), meter offsets from origin */
  anchor: [number, number, number];
  /** Convex hull of the footprint, meter offsets from origin */
  hull: [number, number][];
}

/** Andrew's monotone chain convex hull (2D). Mutates/sorts the input. */
function convexHull(points: [number, number][]): [number, number][] {
  if (points.length <= 3) return points;
  points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/**
 * Per-building label anchors and footprint hulls, in meter offsets relative
 * to the tile's cartographic origin. Indexed by featureId; entries without
 * geometry are null. Call after dequantizeGLTF.
 */
export function computeBuildingFootprints(
  content: GroundContent | undefined
): (BuildingFootprint | null)[] {
  const gltf = content?.gltf;
  if (!gltf) return [];

  const roots = gltf.scene?.nodes ?? gltf.scenes?.[0]?.nodes ?? gltf.nodes ?? [];
  const base = content?.modelMatrix
    ? new Matrix4(content.modelMatrix)
    : new Matrix4().identity();
  const sums: { x: number; y: number; n: number; top: number }[] = [];
  const points: [number, number][][] = [];

  const visit = (node: GroundNode, parent: Matrix4) => {
    const m = nodeMatrix(node, parent);
    for (const primitive of node.mesh?.primitives ?? []) {
      const positions = primitive.attributes?.POSITION?.value;
      const featureIds = primitive.attributes?._FEATURE_ID_0?.value;
      if (!(positions instanceof Float32Array) || !(featureIds instanceof Float32Array)) continue;
      for (let v = 0, i = 0; i + 2 < positions.length; v++, i += 3) {
        const px = positions[i];
        const py = positions[i + 1];
        const pz = positions[i + 2];
        const x = m[0] * px + m[4] * py + m[8] * pz + m[12];
        const y = m[1] * px + m[5] * py + m[9] * pz + m[13];
        const z = m[2] * px + m[6] * py + m[10] * pz + m[14];
        const f = featureIds[v];
        let s = sums[f];
        if (!s) {
          s = sums[f] = { x: 0, y: 0, n: 0, top: -Infinity };
          points[f] = [];
        }
        s.x += x;
        s.y += y;
        s.n++;
        if (z > s.top) s.top = z;
        points[f].push([x, y]);
      }
    }
    for (const child of node.children ?? []) visit(child, m);
  };
  for (const node of roots) visit(node, base);

  return Array.from(sums, (s, f) =>
    s && s.n > 0
      ? {
          anchor: [s.x / s.n, s.y / s.n, s.top] as [number, number, number],
          hull: convexHull(points[f] ?? []),
        }
      : null
  );
}
