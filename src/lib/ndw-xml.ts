import { XMLParser } from "fast-xml-parser";
import { gunzipSync } from "zlib";

/**
 * Bbox filter for NDW data — parameterized so any G40-city's bbox can be
 * applied. The default expands the city's tight municipal bbox to also
 * include surrounding highways (NDW data is highway-oriented), via a 0.15°
 * lat / 0.20° lon padding (~17 km / 14 km).
 */
export interface NdwBbox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function expandBboxForNdw(
  bbox: [number, number, number, number]
): NdwBbox {
  const [lonMin, latMin, lonMax, latMax] = bbox;
  return {
    minLat: latMin - 0.15,
    maxLat: latMax + 0.15,
    minLng: lonMin - 0.20,
    maxLng: lonMax + 0.20,
  };
}

// Default bbox = wider Zwolle area, kept for backward-compat.
const DEFAULT_BBOX: NdwBbox = {
  minLat: 52.35,
  maxLat: 52.65,
  minLng: 5.85,
  maxLng: 6.35,
};

function inBbox(lat: number, lng: number, bbox: NdwBbox = DEFAULT_BBOX): boolean {
  return (
    lat >= bbox.minLat &&
    lat <= bbox.maxLat &&
    lng >= bbox.minLng &&
    lng <= bbox.maxLng
  );
}

// Extract text from DATEX II internationalized string values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textVal(v: any): string {
  if (typeof v === "string") return v;
  if (v?.["#text"]) return String(v["#text"]);
  if (Array.isArray(v)) {
    const first = v[0];
    return first?.["#text"] ? String(first["#text"]) : String(first ?? "");
  }
  if (v && typeof v === "object") return JSON.stringify(v);
  return String(v ?? "");
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  isArray: (_name: string, jpath: string) => {
    // Use exact endsWith matching only — includes() causes nested elements to
    // also match when their jpath contains an array path as a prefix substring.
    const arrayPaths = [
      // DATEX II v2 (legacy)
      "Envelope.Body.d2LogicalModel.payloadPublication.situation",
      "Envelope.Body.d2LogicalModel.payloadPublication.situation.situationRecord",
      "Envelope.Body.d2LogicalModel.payloadPublication.vmsUnitTable.vmsUnitRecord",
      "Envelope.Body.d2LogicalModel.payloadPublication.siteMeasurements",
      "Envelope.Body.d2LogicalModel.payloadPublication.measurementSiteTable.measurementSiteRecord",
      "d2LogicalModel.payloadPublication.genericPublicationExtension.parkingTablePublication.parkingTable.parkingRecord",
      "payload.parkingRecordStatus",
      // DATEX II v3 (NDW migration 2025-2026)
      "messageContainer.payload.situation",
      "messageContainer.payload.situation.situationRecord",
      "messageContainer.payload.controlledZoneTable.urbanVehicleAccessRegulation",
      "messageContainer.payload.vmsControllerTable.vmsController",
      "messageContainer.payload.vmsControllerTable.vmsController.vms",
      "messageContainer.payload.measurementSiteTable.measurementSiteRecord",
    ];
    return arrayPaths.some((p) => jpath === p || jpath.endsWith("." + p));
  },
});

/**
 * Strip XML-illegal control characters (everything below 0x20 except tab/LF/CR).
 * NDW occasionally publishes feeds (notably the wegwerkzaamheden planningsfeed)
 * with stray ASCII 0x0B/0x0C bytes inside text nodes; once these are present
 * in a parsed string they break JSON.stringify on the response. Stripping them
 * up-front lets fast-xml-parser produce a valid object tree.
 */
function stripXmlControlChars(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

export async function fetchNdwGz(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NDW fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const raw = url.endsWith(".gz")
    ? gunzipSync(buf).toString("utf-8")
    : buf.toString("utf-8");
  return stripXmlControlChars(raw);
}

export function parseXml(xml: string) {
  return parser.parse(xml);
}

// Extract lat/lng from various DATEX II location structures
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractCoord(loc: any): [number, number] | null {
  // Try locationForDisplay (DATEX II v2)
  const lfd =
    loc?.locationForDisplay ??
    loc?.groupOfLocations?.locationForDisplay;
  if (lfd?.latitude && lfd?.longitude) {
    return [Number(lfd.longitude), Number(lfd.latitude)];
  }
  // Try pointByCoordinates (DATEX II v2 & v3)
  const pbc =
    loc?.pointByCoordinates?.pointCoordinates ??
    loc?.groupOfLocations?.pointByCoordinates?.pointCoordinates ??
    loc?.locationReference?.pointByCoordinates?.pointCoordinates;
  if (pbc?.latitude && pbc?.longitude) {
    return [Number(pbc.longitude), Number(pbc.latitude)];
  }
  // Try linear location display point
  const linear =
    loc?.groupOfLocations?.locationForDisplay ??
    loc?.locationReference?.locationForDisplay;
  if (linear?.latitude && linear?.longitude) {
    return [Number(linear.longitude), Number(linear.latitude)];
  }
  // Try direct lat/lng
  if (loc?.latitude && loc?.longitude) {
    return [Number(loc.longitude), Number(loc.latitude)];
  }
  // ItineraryByIndexedLocations / linear DATEX II locations
  const itinerary = loc?.locationContainedInItinerary;
  const items = Array.isArray(itinerary) ? itinerary : itinerary ? [itinerary] : [];
  for (const item of items) {
    const sub = item?.location ?? item;
    // (a) locationForDisplay (DATEX II v2 itinerary — used by traveltime &
    //     trafficspeed measurement sites)
    const lfdIti = sub?.locationForDisplay;
    if (lfdIti?.latitude && lfdIti?.longitude) {
      return [Number(lfdIti.longitude), Number(lfdIti.latitude)];
    }
    // (b) linearExtension start point coordinates
    const lcs =
      sub?.linearExtension?.linearByCoordinatesExtension
        ?.linearCoordinatesStartPoint?.pointCoordinates;
    if (lcs?.latitude && lcs?.longitude) {
      return [Number(lcs.longitude), Number(lcs.latitude)];
    }
    // (c) gmlLineString posList (DATEX II v3) — use midpoint
    const posList = sub?.gmlLineString?.posList;
    if (posList) {
      const nums = String(posList).trim().split(/\s+/).map(Number);
      if (nums.length >= 2) {
        const mid = Math.floor(nums.length / 4) * 2; // middle pair
        return [nums[mid + 1], nums[mid]]; // posList is lat lng
      }
    }
  }
  return null;
}

// ──────────────────────────────────────
// INCIDENTS & ACTUEEL BEELD
// ──────────────────────────────────────
export function parseSituations(
  parsed: any,
  dataset: string,
  bbox: NdwBbox = DEFAULT_BBOX
): GeoJSON.FeatureCollection {
  // DATEX II v2 (SOAP) or v3 (messageContainer)
  const situations: any[] =
    parsed?.Envelope?.Body?.d2LogicalModel?.payloadPublication?.situation ??
    parsed?.messageContainer?.payload?.situation ??
    [];

  const features: GeoJSON.Feature[] = [];
  for (const sit of Array.isArray(situations) ? situations : [situations]) {
    if (!sit) continue;
    const records = Array.isArray(sit.situationRecord)
      ? sit.situationRecord
      : sit.situationRecord
        ? [sit.situationRecord]
        : [sit];

    for (const rec of records) {
      const locSource = rec.groupOfLocations ?? rec.locationReference ?? rec;
      const coord = extractCoord(locSource);
      if (!coord) continue;
      if (!inBbox(coord[1], coord[0], bbox)) continue;

      const recType =
        rec["@_xsi:type"] ?? rec["@_type"] ?? "";
      const severity = sit.overallSeverity ?? "unknown";
      const status =
        rec.validity?.validityStatus ?? rec.validity?.validityTimeSpecification?.overallStartTime ?? "";
      const source = textVal(
        rec.source?.sourceName?.values?.value ??
        rec.source?.sourceName?.value
      );
      const comment = textVal(
        rec.generalPublicComment?.comment?.values?.value
      );
      const startTime =
        rec.validity?.validityTimeSpecification?.overallStartTime ?? "";
      const endTime =
        rec.validity?.validityTimeSpecification?.overallEndTime ?? "";
      const mgmtType = rec.generalNetworkManagementType ?? "";
      const obstType = rec.vehicleObstructionType ?? recType;

      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: coord },
        properties: {
          id: sit["@_id"] ?? rec["@_id"] ?? "",
          dataset,
          type: obstType || recType,
          severity,
          status: typeof status === "string" ? status : "",
          source,
          comment,
          start: startTime,
          end: endTime,
          managementType: mgmtType,
        },
      });
    }
  }
  return { type: "FeatureCollection", features };
}

// ──────────────────────────────────────
// EMISSIEZONES
// ──────────────────────────────────────
export function parseEmissiezones(
  parsed: any,
  bbox: NdwBbox = DEFAULT_BBOX
): GeoJSON.FeatureCollection {
  const zones: any[] =
    parsed?.messageContainer?.payload?.controlledZoneTable
      ?.urbanVehicleAccessRegulation ?? [];

  const features: GeoJSON.Feature[] = [];
  for (const zone of Array.isArray(zones) ? zones : [zones]) {
    if (!zone) continue;
    // Find polygon coordinates in the regulation
    const regs = zone.trafficRegulationOrder?.trafficRegulation;
    const regArr = Array.isArray(regs) ? regs : regs ? [regs] : [];

    for (const reg of regArr) {
      const conditions = reg?.condition?.conditions;
      const condArr = Array.isArray(conditions)
        ? conditions
        : conditions
          ? [conditions]
          : [];

      for (const cond of condArr) {
        const loc = cond?.locationByOrder;
        const posListStr =
          loc?.gmlMultiPolygon?.gmlPolygon?.exterior?.posList ??
          loc?.gmlPolygon?.exterior?.posList;
        if (!posListStr) continue;

        const nums = String(posListStr).trim().split(/\s+/).map(Number);
        const coords: [number, number][] = [];
        for (let i = 0; i < nums.length - 1; i += 2) {
          coords.push([nums[i + 1], nums[i]]); // posList is lat lng
        }
        if (coords.length < 3) continue;

        // Check if any vertex is in bbox
        const anyInBbox = coords.some(([lng, lat]) => inBbox(lat, lng, bbox));
        if (!anyInBbox) continue;

        // Close polygon if needed
        if (
          coords[0][0] !== coords[coords.length - 1][0] ||
          coords[0][1] !== coords[coords.length - 1][1]
        ) {
          coords.push(coords[0]);
        }

        const name = textVal(zone.name?.values?.value ?? zone.name?.value);
        features.push({
          type: "Feature",
          geometry: { type: "Polygon", coordinates: [coords] },
          properties: {
            name,
            type: zone.controlledZoneType ?? "",
            status: zone.status ?? "",
            url: zone.urlForFurtherInformation ?? "",
          },
        });
      }
    }
  }
  return { type: "FeatureCollection", features };
}

// ──────────────────────────────────────
// VMS / DRIPs
// ──────────────────────────────────────
export function parseVmsTable(
  parsed: any,
  bbox: NdwBbox = DEFAULT_BBOX
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  // DATEX II v2 path (legacy)
  const v2Records: any[] =
    parsed?.Envelope?.Body?.d2LogicalModel?.payloadPublication?.vmsUnitTable
      ?.vmsUnitRecord ?? [];
  for (const unit of Array.isArray(v2Records) ? v2Records : [v2Records]) {
    if (!unit) continue;
    const outerArr = Array.isArray(unit.vmsRecord)
      ? unit.vmsRecord
      : unit.vmsRecord
        ? [unit.vmsRecord]
        : [];
    for (const outer of outerArr) {
      const rec = outer?.vmsRecord ?? outer;
      if (!rec?.vmsLocation) continue;
      const coord = extractCoord(rec.vmsLocation);
      if (!coord) continue;
      if (!inBbox(coord[1], coord[0], bbox)) continue;
      const desc = textVal(rec.vmsDescription?.values?.value ?? rec.vmsDescription?.value);
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: coord },
        properties: {
          id: unit["@_id"] ?? "",
          name: desc,
          type: rec.vmsType ?? "",
          mounting: rec.vmsPhysicalMounting ?? "",
        },
      });
    }
  }

  // DATEX II v3 path (NDW migration 2025-2026)
  // Structure (after removeNSPrefix):
  //   messageContainer.payload (may be a single object OR an array — the DRIP
  //     feed bundles both VmsTablePublication and VmsControllerStatus, so the
  //     XML parser exposes payload as an array when there are multiple payloads)
  //   .vmsControllerTable.vmsController[]
  //     .vms[] (outer with @_vmsIndex)
  //       .vms (inner with description / vmsType / vmsLocation)
  const rawPayload = parsed?.messageContainer?.payload;
  const payloadArr = Array.isArray(rawPayload)
    ? rawPayload
    : rawPayload
      ? [rawPayload]
      : [];
  for (const pl of payloadArr) {
    const ctrlRaw = pl?.vmsControllerTable?.vmsController;
    if (!ctrlRaw) continue;
    const ctrlArr = Array.isArray(ctrlRaw) ? ctrlRaw : [ctrlRaw];
    for (const ctrl of ctrlArr) {
      if (!ctrl) continue;
      const outerArr = Array.isArray(ctrl.vms)
        ? ctrl.vms
        : ctrl.vms
          ? [ctrl.vms]
          : [];
      for (const outer of outerArr) {
        const rec = outer?.vms ?? outer;
        if (!rec?.vmsLocation) continue;
        const coord = extractCoord(rec.vmsLocation);
        if (!coord) continue;
        if (!inBbox(coord[1], coord[0], bbox)) continue;
        const desc = textVal(
          rec.description?.values?.value ?? rec.description?.value
        );
        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: coord },
          properties: {
            id: ctrl["@_id"] ?? "",
            vmsIndex: outer?.["@_vmsIndex"] ?? "",
            name: desc,
            type: rec.vmsType ?? "",
            mounting: rec.physicalSupport ?? "",
          },
        });
      }
    }
  }

  return { type: "FeatureCollection", features };
}

// ──────────────────────────────────────
// TRUCK PARKING
// ──────────────────────────────────────
export function parseTruckParkingTable(parsed: any): Map<string, any> {
  const parkingTable =
    parsed?.d2LogicalModel?.payloadPublication?.genericPublicationExtension
      ?.parkingTablePublication?.parkingTable;
  const records: any[] = parkingTable?.parkingRecord ?? [];
  const map = new Map<string, any>();
  for (const rec of Array.isArray(records) ? records : [records]) {
    if (!rec) continue;
    const id = rec["@_id"] ?? "";
    const loc =
      rec.parkingLocation?.pointByCoordinates?.pointCoordinates;
    if (!loc) continue;
    const lat = Number(loc.latitude);
    const lng = Number(loc.longitude);
    const name = textVal(rec.parkingName?.values?.value ?? rec.parkingName?.value);
    map.set(id, {
      lat,
      lng,
      name,
      freeOfCharge: rec.tariffsAndPayment?.freeOfCharge ?? null,
    });
  }
  return map;
}

export function parseTruckParkingStatus(
  parsed: any,
  table: Map<string, any>,
  bbox: NdwBbox = DEFAULT_BBOX
): GeoJSON.FeatureCollection {
  const statuses: any[] =
    parsed?.payload?.parkingRecordStatus ??
    parsed?.messageContainer?.payload?.parkingRecordStatus ??
    [];
  const features: GeoJSON.Feature[] = [];

  for (const st of Array.isArray(statuses) ? statuses : [statuses]) {
    if (!st) continue;
    const refId =
      st.parkingRecordReference?.["@_id"] ?? "";
    const info = table.get(refId);
    if (!info) continue;
    if (!inBbox(info.lat, info.lng, bbox)) continue;

    const occ = st.parkingOccupancy;
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [info.lng, info.lat] },
      properties: {
        id: refId,
        name: info.name,
        status: st.parkingSiteStatus ?? "",
        vacant: occ?.parkingNumberOfVacantSpaces ?? null,
        occupied: occ?.parkingNumberOfOccupiedSpaces ?? null,
        occupancy_pct: occ?.parkingOccupancy ?? null,
        freeOfCharge: info.freeOfCharge,
      },
    });
  }
  return { type: "FeatureCollection", features };
}

// ──────────────────────────────────────
// TRAFFIC SPEED (needs measurement site table)
// ──────────────────────────────────────
export function parseMeasurementSiteTable(
  parsed: any,
  bbox: NdwBbox = DEFAULT_BBOX
): Map<string, [number, number]> {
  const sites: Map<string, [number, number]> = new Map();
  const table =
    parsed?.Envelope?.Body?.d2LogicalModel?.payloadPublication?.measurementSiteTable ??
    parsed?.d2LogicalModel?.payloadPublication?.measurementSiteTable ??
    parsed?.messageContainer?.payload?.measurementSiteTable;
  if (!table) return sites;
  const records = table?.measurementSiteRecord ?? [];
  for (const rec of Array.isArray(records) ? records : [records]) {
    if (!rec) continue;
    const id = rec["@_id"] ?? "";
    const loc = rec.measurementSiteLocation;
    const coord = loc ? extractCoord(loc) : null;
    if (coord && inBbox(coord[1], coord[0], bbox)) {
      sites.set(id, coord);
    }
  }
  return sites;
}

/**
 * Fast regex-based traffic speed parser.
 * Avoids building a full XML DOM tree for the large (~100K measurements) file.
 * Only extracts data for sites in the Zwolle area (pre-filtered in `sites` map).
 */
export function parseTrafficSpeedFast(
  xml: string,
  sites: Map<string, [number, number]>
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  // Match each siteMeasurements block (handles optional namespace prefixes)
  const smRegex = /<(?:\w+:)?siteMeasurements\b[^>]*>([\s\S]*?)<\/(?:\w+:)?siteMeasurements>/g;
  let smMatch;

  while ((smMatch = smRegex.exec(xml)) !== null) {
    const block = smMatch[1];

    // Extract site reference ID (attribute on measurementSiteReference)
    const siteIdMatch = block.match(/measurementSiteReference[^>]*\bid="([^"]+)"/);
    if (!siteIdMatch) continue;

    const siteId = siteIdMatch[1];
    const coord = sites.get(siteId);
    if (!coord) continue; // Not in Zwolle area — skip immediately

    // Extract speed (averageVehicleSpeed > speed)
    const speedMatch = block.match(/<(?:\w+:)?speed>([^<]+)<\//);
    const speed = speedMatch ? Number(speedMatch[1]) : -1;

    // Extract flow rate (vehicleFlow > vehicleFlowRate)
    const flowMatch = block.match(/<(?:\w+:)?vehicleFlowRate>([^<]+)<\//);
    const flow = flowMatch ? Number(flowMatch[1]) : -1;

    if (speed <= 0 && flow < 0) continue;

    // Extract timestamp
    const timeMatch = block.match(/<(?:\w+:)?measurementTimeDefault>([^<]+)<\//);

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: coord },
      properties: {
        id: siteId,
        time: timeMatch?.[1] ?? "",
        speed_kmh: speed > 0 ? Math.round(speed) : null,
        flow_veh_h: flow >= 0 ? Math.round(flow) : null,
      },
    });
  }
  return { type: "FeatureCollection", features };
}

/**
 * Fast regex-based travel-time parser.
 *
 * The traveltime feed is a DATEX II MeasuredDataPublication keyed against the
 * measurement site table — same shape as trafficspeed but with TravelTimeData
 * payloads (a `<duration>` in seconds) instead of speed/flow. Sites for the
 * traveltime feed are *itinerary-coded* (city-street segments), so the
 * measurement site map must include those (extractCoord now handles
 * `locationContainedInItinerary[].location.locationForDisplay`).
 */
export function parseTravelTimeFast(
  xml: string,
  sites: Map<string, [number, number]>
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  const smRegex =
    /<(?:\w+:)?siteMeasurements\b[^>]*>([\s\S]*?)<\/(?:\w+:)?siteMeasurements>/g;
  let smMatch;

  while ((smMatch = smRegex.exec(xml)) !== null) {
    const block = smMatch[1];

    const siteIdMatch = block.match(
      /measurementSiteReference[^>]*\bid="([^"]+)"/
    );
    if (!siteIdMatch) continue;

    const siteId = siteIdMatch[1];
    const coord = sites.get(siteId);
    if (!coord) continue; // Not in city area — skip immediately

    // Extract first <duration> (the live travel time, in seconds)
    const durMatch = block.match(/<(?:\w+:)?duration>([^<]+)<\//);
    const duration = durMatch ? Number(durMatch[1]) : -1;
    if (!(duration >= 0)) continue;

    // Reference duration (free-flow), if present (second <duration>)
    let refDuration: number | null = null;
    if (durMatch) {
      const after = block.slice(durMatch.index! + durMatch[0].length);
      const refMatch = after.match(/<(?:\w+:)?duration>([^<]+)<\//);
      if (refMatch) {
        const v = Number(refMatch[1]);
        if (v >= 0) refDuration = v;
      }
    }

    const timeMatch = block.match(/<(?:\w+:)?measurementTimeDefault>([^<]+)<\//);

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: coord },
      properties: {
        id: siteId,
        time: timeMatch?.[1] ?? "",
        duration_s: Math.round(duration * 10) / 10,
        ref_duration_s:
          refDuration === null ? null : Math.round(refDuration * 10) / 10,
        delay_factor:
          refDuration !== null && refDuration > 0
            ? Math.round((duration / refDuration) * 100) / 100
            : null,
      },
    });
  }
  return { type: "FeatureCollection", features };
}

// ──────────────────────────────────────
// MSI (Matrix Signal Indicators)
// ──────────────────────────────────────
interface MSIEvent {
  signId: string;
  road?: string;
  carriageway?: string;
  lane?: number;
  km?: number;
  display?: string;
  speedLimit?: number;
  flashing?: boolean;
  tsState?: string;
}

/**
 * Parse MSI XML (Matrixsignaalinformatie) using regex — the XML uses a
 * custom RWS schema, so we extract events directly from the text.
 */
export function parseMSIEvents(xml: string): Map<string, MSIEvent> {
  const signs = new Map<string, MSIEvent>();
  const eventRegex = /<event>([\s\S]*?)<\/event>/g;
  let match;
  while ((match = eventRegex.exec(xml)) !== null) {
    const ev = match[1];
    const signId = ev.match(/<uuid>([^<]+)<\/uuid>/)?.[1];
    if (!signId) continue;

    if (!signs.has(signId)) signs.set(signId, { signId });
    const sign = signs.get(signId)!;

    // Location event
    const road = ev.match(/<road>([^<]+)<\/road>/)?.[1];
    if (road) {
      sign.road = road;
      sign.carriageway = ev.match(/<carriageway>([^<]+)<\/carriageway>/)?.[1];
      const lane = ev.match(/<lane>(\d+)<\/lane>/)?.[1];
      if (lane) sign.lane = Number(lane);
      const km = ev.match(/<km>([^<]+)<\/km>/)?.[1];
      if (km) sign.km = Number(km);
    }

    // Display event
    const displayMatch = ev.match(/<display>\s*<(\w+)([^>]*)>?\s*([^<]*)/);
    if (displayMatch) {
      sign.display = displayMatch[1];
      sign.flashing = displayMatch[2].includes('flashing="true"');
      const speedText = displayMatch[3]?.trim();
      if (speedText && !isNaN(Number(speedText))) {
        sign.speedLimit = Number(speedText);
      }
    }

    const ts = ev.match(/<ts_state>([^<]+)<\/ts_state>/)?.[1];
    if (ts) sign.tsState = ts;
  }
  return signs;
}

/**
 * Match MSI signs to DRIPs locations by road + km.
 *
 * MSI XML carries per-sign road+km but no coordinates; the DRIP feed carries
 * coordinates. We extract road+carriageway+km from DRIP descriptions
 * (e.g. "A28 Li 87,050") and use those points as anchors. Each MSI gantry
 * (one cross-section over all lanes, identified by road+carriageway+km) gets
 * its own feature, positioned by interpolating between the two nearest DRIP
 * anchors on the same road+direction. If only one anchor is within range we
 * fall back to that anchor's coordinates.
 *
 * Returns GeoJSON with per-gantry MSI states; each feature's `lanes` array
 * holds the lane-by-lane display state.
 */
export function matchMSIToDrips(
  msiSigns: Map<string, MSIEvent>,
  dripFeatures: GeoJSON.Feature[]
): GeoJSON.FeatureCollection {
  // Parse road+km from DRIP names: "A28 Li 87,050" or "A28-Li-87,3"
  type DripLoc = {
    road: string;
    carriageway: string;
    km: number;
    coords: [number, number];
    name: string;
    id: string;
  };
  const dripLocs: DripLoc[] = [];
  // Be permissive about separators (space, multiple spaces, dashes, NBSP) and
  // about km format (one or two decimals, comma or dot). Some DRIPs are named
  // by location only ("A50 Li Waterberg Noord") and won't match — those are
  // dropped from the anchor list but still rendered as blank signs.
  const dripRe = /([AN]\d+)[\s\-]+(Li|Re|Links|Rechts)[\s\-]+(\d+(?:[.,]\d+)?)/i;

  for (const f of dripFeatures) {
    const name = String(f.properties?.name ?? "");
    const coords = (f.geometry as GeoJSON.Point).coordinates as [number, number];
    const m = name.match(dripRe);
    if (!m) continue;
    dripLocs.push({
      road: m[1].toUpperCase(),
      carriageway: m[2].toLowerCase().startsWith("l") ? "L" : "R",
      km: Number(m[3].replace(",", ".")),
      coords,
      name,
      id: String(f.properties?.id ?? ""),
    });
  }

  // Index DRIPs by road+carriageway, sorted by km, for interpolation.
  const dripsByLine = new Map<string, DripLoc[]>();
  for (const d of dripLocs) {
    const key = `${d.road}|${d.carriageway}`;
    if (!dripsByLine.has(key)) dripsByLine.set(key, []);
    dripsByLine.get(key)!.push(d);
  }
  for (const arr of dripsByLine.values()) arr.sort((a, b) => a.km - b.km);

  // For an MSI sign at km `targetKm` on road+direction `key`, return the
  // best-effort coords by linearly interpolating between the two nearest
  // DRIP anchors on the same line. Returns null when no DRIP on that line is
  // within `maxDist` km.
  function locateOnLine(
    key: string,
    targetKm: number,
    maxDist = 8
  ): { coords: [number, number]; nearestDripId: string } | null {
    const arr = dripsByLine.get(key);
    if (!arr || arr.length === 0) return null;

    // Find lower (largest km <= target) and upper (smallest km >= target)
    let lower: DripLoc | null = null;
    let upper: DripLoc | null = null;
    for (const d of arr) {
      if (d.km <= targetKm && (!lower || d.km > lower.km)) lower = d;
      if (d.km >= targetKm && (!upper || d.km < upper.km)) upper = d;
    }

    // Both sides present → linear interpolation by km
    if (lower && upper && lower !== upper) {
      const span = upper.km - lower.km;
      const t = span > 0 ? (targetKm - lower.km) / span : 0;
      const lng = lower.coords[0] + t * (upper.coords[0] - lower.coords[0]);
      const lat = lower.coords[1] + t * (upper.coords[1] - lower.coords[1]);
      const nearest = Math.abs(targetKm - lower.km) < Math.abs(targetKm - upper.km) ? lower : upper;
      return { coords: [lng, lat], nearestDripId: nearest.id };
    }

    // Only one side → snap to that DRIP if within maxDist
    const single = lower ?? upper;
    if (!single) return null;
    if (Math.abs(single.km - targetKm) > maxDist) return null;
    return { coords: single.coords, nearestDripId: single.id };
  }

  // Group MSI signs by gantry (road+carriageway+km). Each gantry = one icon.
  const gantries = new Map<string, {
    road: string;
    carriageway: string;
    km: number;
    coords: [number, number];
    nearestDripId: string;
    lanes: { lane: number; display: string; speedLimit?: number; flashing?: boolean }[];
    lastUpdate: string;
  }>();

  for (const sign of msiSigns.values()) {
    if (!sign.road || sign.km === undefined || !sign.display) continue;
    const road = sign.road.toUpperCase();
    const cw = sign.carriageway ?? "";
    if (!cw) continue;
    const lineKey = `${road}|${cw}`;

    const located = locateOnLine(lineKey, sign.km);
    if (!located) continue;

    const gantryKey = `${road}|${cw}|${sign.km.toFixed(3)}`;
    if (!gantries.has(gantryKey)) {
      gantries.set(gantryKey, {
        road,
        carriageway: cw,
        km: sign.km,
        coords: located.coords,
        nearestDripId: located.nearestDripId,
        lanes: [],
        lastUpdate: sign.tsState ?? "",
      });
    }
    const g = gantries.get(gantryKey)!;
    g.lanes.push({
      lane: sign.lane ?? 0,
      display: sign.display,
      speedLimit: sign.speedLimit,
      flashing: sign.flashing,
    });
    if (sign.tsState && sign.tsState > g.lastUpdate) g.lastUpdate = sign.tsState;
  }

  const features: GeoJSON.Feature[] = [];
  for (const [key, g] of gantries) {
    g.lanes.sort((a, b) => a.lane - b.lane);
    const hasLaneClosed = g.lanes.some((l) => l.display === "lane_closed");
    const hasSpeedLimit = g.lanes.some((l) => l.display === "speedlimit");
    const allBlank = g.lanes.every((l) => l.display === "blank");
    const speeds = g.lanes
      .filter((l) => l.display === "speedlimit" && l.speedLimit)
      .map((l) => l.speedLimit!);
    const minSpeed = speeds.length > 0 ? Math.min(...speeds) : null;

    let dominantState = "blank";
    if (hasLaneClosed) dominantState = "lane_closed";
    else if (hasSpeedLimit) dominantState = "speed_limit";
    else if (g.lanes.some((l) => l.display === "lane_open")) dominantState = "lane_open";
    else if (g.lanes.some((l) => l.display === "restriction_end")) dominantState = "restriction_end";

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: g.coords },
      properties: {
        id: key,
        name: `${g.road} ${g.carriageway === "L" ? "Li" : "Re"} ${g.km.toFixed(3)}`,
        road: g.road,
        km: g.km,
        carriageway: g.carriageway,
        laneCount: g.lanes.length,
        dominantState,
        hasLaneClosed,
        hasSpeedLimit,
        allBlank,
        minSpeedLimit: minSpeed,
        lastUpdate: g.lastUpdate,
        nearestDripId: g.nearestDripId,
        lanes: g.lanes,
      },
    });
  }

  return { type: "FeatureCollection", features };
}
