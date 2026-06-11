// KHR_mesh_quantization support shim for deck.gl ScenegraphLayer.
//
// PDOK / 3DBAG 3D Tiles store vertex attributes quantized (e.g. snorm16 VEC3
// positions + normals). luma.gl 9 has no 16-bit x3 vertex formats and its
// glTF parser drops the `normalized` accessor flag, so quantized tiles throw
// "Error: size: 3" when the model is built. Expanding the post-processed
// accessor values to float32 on tile load sidesteps both limitations; the
// glTF node matrices then de-scale the normalized values to meters as usual.

interface QuantizedAccessor {
  value?: Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array;
  componentType?: number;
  normalized?: boolean;
  min?: number[];
  max?: number[];
}

const GL_FLOAT = 5126;

function toFloat32(value: NonNullable<QuantizedAccessor["value"]>, normalized: boolean): Float32Array {
  const out = new Float32Array(value.length);
  let scale = 1;
  let signed = false;
  if (value instanceof Int16Array) {
    scale = 32767;
    signed = true;
  } else if (value instanceof Uint16Array) {
    scale = 65535;
  } else if (value instanceof Int8Array) {
    scale = 127;
    signed = true;
  } else if (value instanceof Uint8Array) {
    scale = 255;
  }
  if (!normalized) scale = 1;
  for (let i = 0; i < value.length; i++) {
    const v = value[i] / scale;
    out[i] = signed && v < -1 ? -1 : v;
  }
  return out;
}

/**
 * Convert all non-float32 vertex attributes of a loaders.gl post-processed
 * glTF to float32, in place. Indices are left untouched.
 */
export function dequantizeGLTF(gltf: {
  meshes?: { primitives?: { attributes?: Record<string, QuantizedAccessor> }[] }[];
}): void {
  const seen = new Set<QuantizedAccessor>();
  for (const mesh of gltf?.meshes ?? []) {
    for (const primitive of mesh.primitives ?? []) {
      for (const accessor of Object.values(primitive.attributes ?? {})) {
        if (!accessor || seen.has(accessor)) continue;
        seen.add(accessor);
        const value = accessor.value;
        if (!value || value instanceof Float32Array) continue;
        const normalized = accessor.normalized === true;
        accessor.value = toFloat32(value, normalized);
        // Keep declared bounds consistent with the converted values
        // (luma.gl derives model bounds from accessor.min/max).
        if (normalized) {
          const scale =
            value instanceof Int16Array ? 32767
            : value instanceof Uint16Array ? 65535
            : value instanceof Int8Array ? 127
            : value instanceof Uint8Array ? 255
            : 1;
          if (accessor.min) accessor.min = accessor.min.map((v) => Math.max(v / scale, -1));
          if (accessor.max) accessor.max = accessor.max.map((v) => Math.max(v / scale, -1));
        }
        accessor.componentType = GL_FLOAT;
        accessor.normalized = false;
      }
    }
  }
}
