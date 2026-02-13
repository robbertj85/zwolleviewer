import { NextResponse } from "next/server";
import { gunzipSync } from "zlib";

interface OCPIConnector {
  standard: string;
  format: string;
  power_type: string;
  max_electric_power?: number;
}

interface OCPIEVSE {
  uid: string;
  evse_id: string;
  status: string;
  connectors: OCPIConnector[];
}

interface OCPILocation {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  coordinates: { latitude: string; longitude: string };
  parking_type: string;
  evses: OCPIEVSE[];
  operator: { name: string };
  opening_times?: { twentyfourseven: boolean };
  last_updated: string;
}

// Cache the processed result for 5 minutes
let cache: { data: GeoJSON.FeatureCollection; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=300" },
    });
  }

  try {
    const res = await fetch(
      "https://opendata.ndw.nu/charging_point_locations_ocpi.json.gz"
    );
    if (!res.ok) throw new Error(`NDW fetch failed: ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const decompressed = gunzipSync(buffer);
    const locations: OCPILocation[] = JSON.parse(decompressed.toString("utf-8"));

    const features: GeoJSON.Feature[] = [];

    for (const loc of locations) {
      const lat = parseFloat(loc.coordinates.latitude);
      const lng = parseFloat(loc.coordinates.longitude);
      if (lng < 6.04 || lng > 6.16 || lat < 52.48 || lat > 52.55) continue;

      const evseStatuses = loc.evses.map((e) => e.status);
      const available = evseStatuses.filter((s) => s === "AVAILABLE").length;
      const charging = evseStatuses.filter((s) => s === "CHARGING").length;
      const occupied = evseStatuses.filter(
        (s) => s === "BLOCKED" || s === "OCCUPIED"
      ).length;
      const total = loc.evses.length;

      const connectorTypes = [
        ...new Set(
          loc.evses.flatMap((e) => e.connectors.map((c) => c.standard))
        ),
      ];
      const maxPower = Math.max(
        0,
        ...loc.evses.flatMap((e) =>
          e.connectors.map((c) => c.max_electric_power ?? 0)
        )
      );

      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lng, lat] },
        properties: {
          name: loc.name || loc.address,
          adres: loc.address,
          stad: loc.city,
          postcode: loc.postal_code,
          operator: loc.operator?.name ?? "Onbekend",
          parkeertype: loc.parking_type,
          "24/7": loc.opening_times?.twentyfourseven ? "Ja" : "Nee",
          evses_totaal: total,
          evses_beschikbaar: available,
          evses_laden: charging,
          evses_bezet: occupied,
          connector_types: connectorTypes.join(", "),
          max_vermogen_kW: maxPower > 0 ? (maxPower / 1000).toFixed(1) : "-",
          laatste_update: loc.last_updated,
        },
      });
    }

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features,
    };

    cache = { data: geojson, ts: Date.now() };

    return NextResponse.json(geojson, {
      headers: { "Cache-Control": "public, s-maxage=300" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "OCPI fetch error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
