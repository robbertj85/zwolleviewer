import { NextRequest, NextResponse } from "next/server";
import { inflateRawSync } from "zlib";
import { tmpdir } from "os";
import { join } from "path";
import { promises as fs } from "fs";
import { getCity } from "@/lib/cities";

/**
 * OVapi GTFS — landelijke statische dienstregeling (stations, haltes,
 * lijnen, ritten). We hebben alleen stops.txt nodig om haltes als
 * GeoJSON Points terug te geven, bbox-gefilterd op de gevraagde stad.
 *
 * Strategy:
 *   - Cache de hele gtfs-nl.zip in os.tmpdir() (≈230 MB) voor 24 uur.
 *   - Bij elke request: parse de ZIP End-of-Central-Directory + central
 *     directory zelf, zoek het entry stops.txt op, en `inflateRawSync`
 *     alleen die compressed bytes — geen externe ZIP-dependency nodig.
 *   - In-memory cache van de geparseerde stops voor zelfs snellere
 *     herhaalde aanroepen.
 *
 * Returns FeatureCollection of Point features met properties:
 *   stop_id, stop_code, stop_name, location_type, parent_station,
 *   wheelchair_boarding, platform_code (waar beschikbaar).
 */

const GTFS_URL = "https://gtfs.ovapi.nl/nl/gtfs-nl.zip";
const CACHE_FILE = join(tmpdir(), "basis-stadstwin-gtfs-nl.zip");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// In-memory cache of all parsed stops (national, ~70k entries) — re-used
// across city requests so we only parse the ZIP once per process lifetime.
let cachedStops: GtfsStop[] | null = null;
let cachedAt = 0;

interface GtfsStop {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  location_type: string;
  parent_station: string;
  wheelchair_boarding: string;
  platform_code: string;
}

/** Make sure /tmp/basis-stadstwin-gtfs-nl.zip is present and fresh. */
async function ensureZipCached(): Promise<Buffer> {
  try {
    const stat = await fs.stat(CACHE_FILE);
    if (Date.now() - stat.mtimeMs < CACHE_TTL_MS) {
      return await fs.readFile(CACHE_FILE);
    }
  } catch {
    // not cached yet
  }
  const res = await fetch(GTFS_URL);
  if (!res.ok) throw new Error(`GTFS download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(CACHE_FILE, buf);
  return buf;
}

/**
 * Locate stops.txt in a ZIP archive (no external dep) and inflate it.
 *
 * Implements just enough of the PKZip spec:
 *   1. Find End-of-Central-Directory Record (signature 0x06054b50) by
 *      scanning the last 64 KiB of the file.
 *   2. Read the central directory: each entry has a fixed 46-byte header
 *      followed by file name, extra and comment.
 *   3. For the entry named "stops.txt" (or path-suffixed), read the local
 *      file header at the recorded offset, skip the variable-length name
 *      and extra fields, then inflate the compressed bytes (method 8 =
 *      deflate; method 0 = stored).
 */
function extractStopsTxt(zip: Buffer): string {
  const EOCD_SIG = 0x06054b50;
  const CD_SIG = 0x02014b50;
  const LFH_SIG = 0x04034b50;

  // 1. Scan tail for EOCD
  let eocdOffset = -1;
  const scanFrom = Math.max(0, zip.length - 0x10000);
  for (let i = zip.length - 22; i >= scanFrom; i--) {
    if (zip.readUInt32LE(i) === EOCD_SIG) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error("ZIP EOCD not found");

  const cdOffset = zip.readUInt32LE(eocdOffset + 16);
  const cdEntries = zip.readUInt16LE(eocdOffset + 10);

  // 2. Walk central directory
  let p = cdOffset;
  for (let i = 0; i < cdEntries; i++) {
    if (zip.readUInt32LE(p) !== CD_SIG)
      throw new Error(`ZIP CD entry signature mismatch @ ${p}`);
    const nameLen = zip.readUInt16LE(p + 28);
    const extraLen = zip.readUInt16LE(p + 30);
    const commentLen = zip.readUInt16LE(p + 32);
    const localOffset = zip.readUInt32LE(p + 42);
    const name = zip.slice(p + 46, p + 46 + nameLen).toString("utf-8");
    p += 46 + nameLen + extraLen + commentLen;
    if (name === "stops.txt" || name.endsWith("/stops.txt")) {
      // 3. Local file header for this entry (compressed size lives here too)
      if (zip.readUInt32LE(localOffset) !== LFH_SIG)
        throw new Error("ZIP LFH signature mismatch");
      const method = zip.readUInt16LE(localOffset + 8);
      const compressedSize = zip.readUInt32LE(localOffset + 18);
      const lfhNameLen = zip.readUInt16LE(localOffset + 26);
      const lfhExtraLen = zip.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + lfhNameLen + lfhExtraLen;
      const dataEnd = dataStart + compressedSize;
      const compressed = zip.slice(dataStart, dataEnd);
      if (method === 0) return compressed.toString("utf-8"); // stored
      if (method === 8) return inflateRawSync(compressed).toString("utf-8");
      throw new Error(`ZIP unsupported compression method ${method}`);
    }
  }
  throw new Error("stops.txt not found in GTFS archive");
}

/**
 * Tiny CSV parser sufficient for GTFS stops.txt (comma-separated, optional
 * double-quoted fields with "" as escape). We avoid pulling in a CSV
 * library for one file.
 */
function parseStopsCsv(text: string): GtfsStop[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = splitCsvLine(lines[0]);
  const idx = (key: string) => header.indexOf(key);
  const iId = idx("stop_id");
  const iCode = idx("stop_code");
  const iName = idx("stop_name");
  const iLat = idx("stop_lat");
  const iLon = idx("stop_lon");
  const iLoc = idx("location_type");
  const iParent = idx("parent_station");
  const iWheel = idx("wheelchair_boarding");
  const iPlatform = idx("platform_code");
  const out: GtfsStop[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const c = splitCsvLine(line);
    const lat = parseFloat(c[iLat] ?? "");
    const lon = parseFloat(c[iLon] ?? "");
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    out.push({
      stop_id: c[iId] ?? "",
      stop_code: iCode >= 0 ? c[iCode] ?? "" : "",
      stop_name: c[iName] ?? "",
      stop_lat: lat,
      stop_lon: lon,
      location_type: iLoc >= 0 ? c[iLoc] ?? "" : "",
      parent_station: iParent >= 0 ? c[iParent] ?? "" : "",
      wheelchair_boarding: iWheel >= 0 ? c[iWheel] ?? "" : "",
      platform_code: iPlatform >= 0 ? c[iPlatform] ?? "" : "",
    });
  }
  return out;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else cur += ch;
    } else {
      if (ch === ",") {
        out.push(cur);
        cur = "";
      } else if (ch === '"') inQuotes = true;
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}

async function getStops(): Promise<GtfsStop[]> {
  if (cachedStops && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedStops;
  }
  const zip = await ensureZipCached();
  const csv = extractStopsTxt(zip);
  const stops = parseStopsCsv(csv);
  cachedStops = stops;
  cachedAt = Date.now();
  return stops;
}

/**
 * Heuristic: is this stop a treinhalte (NS/IFF station)?
 *
 * The OVapi GTFS uses agency-prefixed stop_ids. NS stations are typically
 * prefixed `IFF:` or `nsr:` and a station-level entry has location_type="1".
 * We also include named platforms via `parent_station` matching a station
 * stop_id, plus a fallback that the name contains "Station" / "Centraal".
 */
function isTrainStop(s: GtfsStop): boolean {
  const id = s.stop_id || "";
  if (id.startsWith("IFF:") || id.startsWith("iff:")) return true;
  if (id.startsWith("nsr:") || id.startsWith("NS:")) return true;
  if (id.startsWith("NL:S")) return true;
  const name = (s.stop_name || "").toLowerCase();
  if (/(centraal|station|sloterdijk|amsterdam zuid|den haag hs|cs$)/.test(name))
    return true;
  return false;
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("city") ?? "zwolle";
  const filter = (request.nextUrl.searchParams.get("filter") ?? "").toLowerCase();
  const city = getCity(slug) ?? getCity("zwolle")!;
  const [lonMin, latMin, lonMax, latMax] = city.bbox;
  try {
    const stops = await getStops();
    const inBbox = stops.filter(
      (s) =>
        s.stop_lon > lonMin &&
        s.stop_lon < lonMax &&
        s.stop_lat > latMin &&
        s.stop_lat < latMax
    );
    const filtered = filter === "trein" ? inBbox.filter(isTrainStop) : inBbox;
    const features: GeoJSON.Feature[] = filtered.map((s) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [s.stop_lon, s.stop_lat],
      },
      properties: {
        stop_id: s.stop_id,
        stop_code: s.stop_code,
        stop_name: s.stop_name,
        location_type: s.location_type,
        parent_station: s.parent_station,
        wheelchair_boarding: s.wheelchair_boarding,
        platform_code: s.platform_code,
        is_train: isTrainStop(s) ? 1 : 0,
      },
    }));
    const fc: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features,
    };
    return NextResponse.json(fc, {
      headers: {
        "Cache-Control": `public, s-maxage=${24 * 3600}`,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "GTFS error";
    console.error(`OV-haltes (${city.slug}) error:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
