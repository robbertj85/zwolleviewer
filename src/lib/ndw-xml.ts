import { XMLParser } from "fast-xml-parser";
import { gunzipSync } from "zlib";

// Wider bbox for NDW highway data (Zwolle + surrounding highways)
const ZWOLLE_BBOX = { minLat: 52.35, maxLat: 52.65, minLng: 5.85, maxLng: 6.35 };

function inBbox(lat: number, lng: number): boolean {
  return (
    lat >= ZWOLLE_BBOX.minLat &&
    lat <= ZWOLLE_BBOX.maxLat &&
    lng >= ZWOLLE_BBOX.minLng &&
    lng <= ZWOLLE_BBOX.maxLng
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
      "messageContainer.payload.situation",
      "messageContainer.payload.controlledZoneTable.urbanVehicleAccessRegulation",
      "Envelope.Body.d2LogicalModel.payloadPublication.situation",
      "Envelope.Body.d2LogicalModel.payloadPublication.vmsUnitTable.vmsUnitRecord",
      "Envelope.Body.d2LogicalModel.payloadPublication.siteMeasurements",
      "Envelope.Body.d2LogicalModel.payloadPublication.measurementSiteTable.measurementSiteRecord",
      "d2LogicalModel.payloadPublication.genericPublicationExtension.parkingTablePublication.parkingTable.parkingRecord",
      "payload.parkingRecordStatus",
      "messageContainer.payload.situation.situationRecord",
      "Envelope.Body.d2LogicalModel.payloadPublication.situation.situationRecord",
    ];
    return arrayPaths.some((p) => jpath === p || jpath.endsWith("." + p));
  },
});

export async function fetchNdwGz(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NDW fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (url.endsWith(".gz")) {
    return gunzipSync(buf).toString("utf-8");
  }
  return buf.toString("utf-8");
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
  // Try gmlLineString posList (DATEX II v3 linear locations) — use midpoint
  const itinerary = loc?.locationContainedInItinerary;
  const items = Array.isArray(itinerary) ? itinerary : itinerary ? [itinerary] : [];
  for (const item of items) {
    const posList = item?.location?.gmlLineString?.posList;
    if (!posList) continue;
    const nums = String(posList).trim().split(/\s+/).map(Number);
    if (nums.length >= 2) {
      const mid = Math.floor(nums.length / 4) * 2; // middle pair
      return [nums[mid + 1], nums[mid]]; // posList is lat lng
    }
  }
  return null;
}

// ──────────────────────────────────────
// INCIDENTS & ACTUEEL BEELD
// ──────────────────────────────────────
export function parseSituations(
  parsed: any,
  dataset: string
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
      if (!inBbox(coord[1], coord[0])) continue;

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
export function parseEmissiezones(parsed: any): GeoJSON.FeatureCollection {
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
        const anyInBbox = coords.some(([lng, lat]) => inBbox(lat, lng));
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
export function parseVmsTable(parsed: any): GeoJSON.FeatureCollection {
  const records: any[] =
    parsed?.Envelope?.Body?.d2LogicalModel?.payloadPublication?.vmsUnitTable
      ?.vmsUnitRecord ?? [];

  const features: GeoJSON.Feature[] = [];
  for (const unit of Array.isArray(records) ? records : [records]) {
    if (!unit) continue;
    // XML structure: <vmsRecord vmsIndex="1"><vmsRecord>…data…</vmsRecord></vmsRecord>
    // The outer vmsRecord has @_vmsIndex + inner vmsRecord; can be array or single
    const outerArr = Array.isArray(unit.vmsRecord)
      ? unit.vmsRecord
      : unit.vmsRecord
        ? [unit.vmsRecord]
        : [];

    for (const outer of outerArr) {
      // The inner vmsRecord contains the actual VMS data
      const rec = outer?.vmsRecord ?? outer;
      if (!rec?.vmsLocation) continue;

      const coord = extractCoord(rec.vmsLocation);
      if (!coord) continue;
      if (!inBbox(coord[1], coord[0])) continue;

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
  table: Map<string, any>
): GeoJSON.FeatureCollection {
  const statuses: any[] = parsed?.payload?.parkingRecordStatus ?? [];
  const features: GeoJSON.Feature[] = [];

  for (const st of Array.isArray(statuses) ? statuses : [statuses]) {
    if (!st) continue;
    const refId =
      st.parkingRecordReference?.["@_id"] ?? "";
    const info = table.get(refId);
    if (!info) continue;
    if (!inBbox(info.lat, info.lng)) continue;

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
export function parseMeasurementSiteTable(parsed: any): Map<string, [number, number]> {
  const sites: Map<string, [number, number]> = new Map();
  const table =
    parsed?.Envelope?.Body?.d2LogicalModel?.payloadPublication?.measurementSiteTable ??
    parsed?.d2LogicalModel?.payloadPublication?.measurementSiteTable;
  if (!table) return sites;
  const records = table?.measurementSiteRecord ?? [];
  for (const rec of Array.isArray(records) ? records : [records]) {
    if (!rec) continue;
    const id = rec["@_id"] ?? "";
    const loc = rec.measurementSiteLocation;
    const coord = loc ? extractCoord(loc) : null;
    if (coord && inBbox(coord[1], coord[0])) {
      sites.set(id, coord);
    }
  }
  return sites;
}

export function parseTrafficSpeed(
  parsed: any,
  sites: Map<string, [number, number]>
): GeoJSON.FeatureCollection {
  const measurements: any[] =
    parsed?.Envelope?.Body?.d2LogicalModel?.payloadPublication?.siteMeasurements ?? [];
  const features: GeoJSON.Feature[] = [];

  for (const m of Array.isArray(measurements) ? measurements : [measurements]) {
    if (!m) continue;
    const siteId = m.measurementSiteReference?.["@_id"] ?? "";
    const coord = sites.get(siteId);
    if (!coord) continue;

    const time = m.measurementTimeDefault ?? "";
    const values = Array.isArray(m.measuredValue) ? m.measuredValue : m.measuredValue ? [m.measuredValue] : [];

    let speed = -1;
    let flow = -1;
    for (const v of values) {
      const bd = v?.measuredValue?.basicData;
      if (!bd) continue;
      const type = bd["@_xsi:type"] ?? bd["@_type"] ?? "";
      if (type.includes("TrafficSpeed") && bd.averageVehicleSpeed?.speed > 0) {
        speed = Math.max(speed, Number(bd.averageVehicleSpeed.speed));
      }
      if (type.includes("TrafficFlow") && bd.vehicleFlow?.vehicleFlowRate >= 0) {
        flow = Math.max(flow, Number(bd.vehicleFlow.vehicleFlowRate));
      }
    }
    if (speed < 0 && flow < 0) continue;

    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: coord },
      properties: {
        id: siteId,
        time,
        speed_kmh: speed >= 0 ? Math.round(speed) : null,
        flow_veh_h: flow >= 0 ? flow : null,
      },
    });
  }
  return { type: "FeatureCollection", features };
}
