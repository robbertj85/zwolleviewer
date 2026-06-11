// Per-building metadata for PDOK 3D Basisvoorziening glb tiles.
//
// Each tile carries an EXT_structural_metadata property table with one row
// per BAG pand, indexed by the _FEATURE_ID_0 vertex attribute. loaders.gl
// can't parse the table (BOOLEAN columns) and drops the extension JSON, so
// we decode the two columns we need here — pand id and construction year —
// and smuggle them through the loader as glTF root `extras`, which survives
// parsing and postprocessing intact.

export interface PdokBuildingMetadata {
  /** BAG pand identificatie per featureId */
  ids: string[];
  /** oorspronkelijkBouwjaar per featureId; null = noData */
  years: (number | null)[];
}

interface GlbJson {
  buffers?: { byteLength: number }[];
  bufferViews?: { buffer: number; byteLength: number; byteOffset?: number }[];
  extensions?: {
    EXT_structural_metadata?: {
      propertyTables?: {
        class: string;
        count: number;
        properties?: Record<string, { values: number; stringOffsets?: number }>;
      }[];
    };
  };
  extras?: Record<string, unknown>;
}

const GLB_MAGIC = 0x46546c67;
const CHUNK_JSON = 0x4e4f534a;
const CHUNK_BIN = 0x004e4942;
const INT32_NODATA = 2147483647;

function readGlb(glb: ArrayBuffer): { json: GlbJson; jsonLength: number; bin: Uint8Array | null } | null {
  if (glb.byteLength < 20) return null;
  const dv = new DataView(glb);
  if (dv.getUint32(0, true) !== GLB_MAGIC) return null;
  const jsonLength = dv.getUint32(12, true);
  if (dv.getUint32(16, true) !== CHUNK_JSON) return null;
  const json = JSON.parse(new TextDecoder().decode(new Uint8Array(glb, 20, jsonLength)));
  let bin: Uint8Array | null = null;
  const binHeader = 20 + jsonLength;
  if (binHeader + 8 <= glb.byteLength && dv.getUint32(binHeader + 4, true) === CHUNK_BIN) {
    bin = new Uint8Array(glb, binHeader + 8, dv.getUint32(binHeader, true));
  }
  return { json, jsonLength, bin };
}

function viewBytes(json: GlbJson, bin: Uint8Array, index: number): Uint8Array | null {
  const bv = json.bufferViews?.[index];
  // Metadata columns live in the uncompressed BIN chunk (buffer 0).
  if (!bv || bv.buffer !== 0) return null;
  return bin.subarray(bv.byteOffset ?? 0, (bv.byteOffset ?? 0) + bv.byteLength);
}

/**
 * Decode the building property table and return a glb with the metadata
 * embedded under `extras.pdokBuildings`. Tiles without a building table
 * (e.g. terrain) are returned unchanged.
 */
export function embedBuildingMetadata(glb: ArrayBuffer): ArrayBuffer {
  const parsed = readGlb(glb);
  if (!parsed?.bin) return glb;
  const { json, jsonLength, bin } = parsed;

  const table = json.extensions?.EXT_structural_metadata?.propertyTables?.find(
    (t) => t.class === "building"
  );
  const idProp = table?.properties?.identificatie;
  const yearProp = table?.properties?.oorspronkelijkBouwjaar;
  if (!table) return glb;

  const count = table.count;
  const ids: string[] = [];
  const years: (number | null)[] = [];

  if (idProp && idProp.stringOffsets !== undefined) {
    const offsetBytes = viewBytes(json, bin, idProp.stringOffsets);
    const valueBytes = viewBytes(json, bin, idProp.values);
    if (offsetBytes && valueBytes && offsetBytes.byteOffset % 4 === 0) {
      const offsets = new Uint32Array(
        offsetBytes.buffer,
        offsetBytes.byteOffset,
        count + 1
      );
      const decoder = new TextDecoder();
      for (let i = 0; i < count; i++) {
        const id = decoder.decode(valueBytes.subarray(offsets[i], offsets[i + 1]));
        // Normalize "NL.IMBAG.Pand.0193100000063910" to the bare BAG pand id
        // used by municipal services and the rest of the app.
        ids.push(id.startsWith("NL.IMBAG.Pand.") ? id.slice(14) : id);
      }
    }
  }
  if (yearProp) {
    const valueBytes = viewBytes(json, bin, yearProp.values);
    if (valueBytes && valueBytes.byteOffset % 4 === 0) {
      const values = new Int32Array(valueBytes.buffer, valueBytes.byteOffset, count);
      for (let i = 0; i < count; i++) {
        years.push(values[i] === INT32_NODATA ? null : values[i]);
      }
    }
  }
  if (ids.length === 0 && years.length === 0) return glb;

  json.extras = {
    ...json.extras,
    pdokBuildings: { ids, years } satisfies PdokBuildingMetadata,
  };

  // Re-encode with the enlarged JSON chunk; binary chunks follow verbatim.
  const dv = new DataView(glb);
  const jsonBytes = new TextEncoder().encode(JSON.stringify(json));
  const paddedJsonLength = Math.ceil(jsonBytes.length / 4) * 4;
  const rest = new Uint8Array(glb, 20 + jsonLength);
  const out = new Uint8Array(20 + paddedJsonLength + rest.length);
  const outDv = new DataView(out.buffer);
  outDv.setUint32(0, GLB_MAGIC, true);
  outDv.setUint32(4, dv.getUint32(4, true), true);
  outDv.setUint32(8, out.length, true);
  outDv.setUint32(12, paddedJsonLength, true);
  outDv.setUint32(16, CHUNK_JSON, true);
  out.fill(0x20, 20, 20 + paddedJsonLength);
  out.set(jsonBytes, 20);
  out.set(rest, 20 + paddedJsonLength);
  return out.buffer;
}
