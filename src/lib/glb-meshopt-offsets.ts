// EXT_meshopt_compression compatibility patch for loaders.gl.
//
// PDOK / 3DBAG glb tiles declare their meshopt-compressed bufferViews
// without `byteOffset`, all pointing into one shared fallback buffer. That
// is valid glTF (a conforming loader allocates storage per bufferView), but
// loaders.gl materializes the fallback buffer as a single arena and writes
// every decoded bufferView at its declared offset — so with implicit
// offset 0 they all overwrite each other and indices read vertex data.
//
// This patch rewrites the GLB JSON chunk before parsing: each meshopt
// bufferView that lacks a byteOffset gets the next sequential, 4-byte
// aligned offset in its target buffer, and the buffer's byteLength is grown
// to fit if alignment padding pushed past the declared size.

interface GlbBufferView {
  buffer: number;
  byteLength: number;
  byteOffset?: number;
  extensions?: { EXT_meshopt_compression?: object };
}

const GLB_MAGIC = 0x46546c67; // 'glTF'
const CHUNK_JSON = 0x4e4f534a; // 'JSON'

export function patchMeshoptByteOffsets(glb: ArrayBuffer): ArrayBuffer {
  if (glb.byteLength < 20) return glb;
  const dv = new DataView(glb);
  if (dv.getUint32(0, true) !== GLB_MAGIC) return glb;
  const jsonLength = dv.getUint32(12, true);
  if (dv.getUint32(16, true) !== CHUNK_JSON) return glb;

  const json = JSON.parse(
    new TextDecoder().decode(new Uint8Array(glb, 20, jsonLength))
  ) as {
    buffers?: { byteLength: number }[];
    bufferViews?: GlbBufferView[];
  };

  const cursors = new Map<number, number>();
  let changed = false;
  for (const bv of json.bufferViews ?? []) {
    if (!bv.extensions?.EXT_meshopt_compression) continue;
    const cursor = cursors.get(bv.buffer) ?? 0;
    if (bv.byteOffset === undefined) {
      bv.byteOffset = cursor;
      changed = true;
    }
    // Keep offsets 4-byte aligned so typed-array views over the decoded
    // arena (e.g. Float32Array) remain constructible.
    const next = bv.byteOffset + bv.byteLength;
    cursors.set(bv.buffer, next + ((4 - (next % 4)) % 4));
  }
  if (!changed) return glb;

  // Grow fallback buffers if alignment padding exceeded the declared size.
  for (const [bufferIndex, end] of cursors) {
    const buffer = json.buffers?.[bufferIndex];
    if (buffer && buffer.byteLength < end) buffer.byteLength = end;
  }

  // Rebuild the GLB: new JSON chunk (space-padded to 4 bytes), BIN chunk(s)
  // copied verbatim.
  const jsonBytes = new TextEncoder().encode(JSON.stringify(json));
  const paddedJsonLength = Math.ceil(jsonBytes.length / 4) * 4;
  const rest = new Uint8Array(glb, 20 + jsonLength);
  const out = new Uint8Array(20 + paddedJsonLength + rest.length);
  const outDv = new DataView(out.buffer);
  outDv.setUint32(0, GLB_MAGIC, true);
  outDv.setUint32(4, dv.getUint32(4, true), true); // glTF version
  outDv.setUint32(8, out.length, true);
  outDv.setUint32(12, paddedJsonLength, true);
  outDv.setUint32(16, CHUNK_JSON, true);
  out.fill(0x20, 20, 20 + paddedJsonLength); // pad JSON with spaces
  out.set(jsonBytes, 20);
  out.set(rest, 20 + paddedJsonLength);
  return out.buffer;
}
