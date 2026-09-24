/**
 * Live public transport and road traffic come from fleetsim's public national
 * API ("Nederland in beweging"): GTFS timetables corrected with OVapi GTFS-RT,
 * and INWEVA road flows slowed by live NDW speeds. Everything is requested for
 * the city's bbox only (fleetsim `?bbox=`), so a city view downloads a few
 * hundred kB instead of the whole country.
 */
export const LIVE_MOBILITY_API =
  process.env.NEXT_PUBLIC_LIVE_MOBILITY_API?.replace(/\/$/, "") ||
  "https://fleetsim.nl/api/v1/public/national";

/** Query value for fleetsim's `?bbox=` (west,south,east,north). */
export function bboxParam(bbox: [number, number, number, number]): string {
  return bbox.map((v) => v.toFixed(4)).join(",");
}

/** Reachability check used as the layers' `fetchData`, so an outage shows as a layer error in the sidebar. */
export async function checkLiveMobilityApi(): Promise<GeoJSON.FeatureCollection> {
  let res: Response;
  try {
    res = await fetch(`${LIVE_MOBILITY_API}/feed`);
  } catch {
    throw new Error("Live-mobiliteitsdienst (fleetsim.nl) is niet bereikbaar");
  }
  if (!res.ok) throw new Error(`Live-mobiliteitsdienst: HTTP ${res.status}`);
  return { type: "FeatureCollection", features: [] };
}
