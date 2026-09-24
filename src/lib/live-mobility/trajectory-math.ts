// Vendored from fleetsim (src/lib/national/trajectory-math.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
/**
 * Allocation-free trajectory interpolation used by the national worker, the
 * GTFS importer and the tests. Dependency-free.
 */

const R = 6371008.8;
const D2R = Math.PI / 180;

export function haversineM(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const dLat = (lat2 - lat1) * D2R;
  const dLon = (lon2 - lon1) * D2R;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * D2R) * Math.cos(lat2 * D2R) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Initial bearing in degrees clockwise from north. */
export function bearingDeg(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const y = Math.sin((lon2 - lon1) * D2R) * Math.cos(lat2 * D2R);
  const x = Math.cos(lat1 * D2R) * Math.sin(lat2 * D2R) - Math.sin(lat1 * D2R) * Math.cos(lat2 * D2R) * Math.cos((lon2 - lon1) * D2R);
  return (Math.atan2(y, x) / D2R + 360) % 360;
}

/**
 * Bearing on a local flat plane: within a few kilometres this matches
 * `bearingDeg` to well under a degree, at a fraction of the cost (one atan2
 * and one cosine instead of six trigonometric calls). Used in the render hot
 * path, where headings only have to look right.
 */
export function flatBearingDeg(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const x = (lon2 - lon1) * Math.cos(((lat1 + lat2) * 0.5) * D2R);
  const y = lat2 - lat1;
  if (x === 0 && y === 0) return 0;
  return (Math.atan2(x, y) / D2R + 360) % 360;
}

/** Cumulative haversine distance for interleaved lon/lat coordinates. */
export function buildCumDist(coords: ArrayLike<number>, pointCount = coords.length / 2): Float64Array {
  const cum = new Float64Array(pointCount);
  for (let i = 1; i < pointCount; i++) {
    cum[i] = cum[i - 1] + haversineM(coords[2 * i - 2], coords[2 * i - 1], coords[2 * i], coords[2 * i + 1]);
  }
  return cum;
}

/**
 * Normalised distance fraction for normalised time u in [0,1] on a trapezoidal
 * velocity profile: accelerate, cruise, decelerate. `ramp` is the fraction of
 * the segment spent accelerating (and decelerating), capped at 0.45.
 */
export function motionFraction(u: number, ramp: number): number {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  const r = Math.min(0.45, Math.max(0, ramp));
  if (r === 0) return u;
  const vmax = 1 / (1 - r);
  if (u < r) return (0.5 * vmax * u * u) / r;
  if (u > 1 - r) return 1 - (0.5 * vmax * (1 - u) * (1 - u)) / r;
  return 0.5 * vmax * r + vmax * (u - r);
}

/** Derivative of motionFraction with respect to u. */
export function motionVelocity(u: number, ramp: number): number {
  if (u <= 0 || u >= 1) return 0;
  const r = Math.min(0.45, Math.max(0, ramp));
  if (r === 0) return 1;
  const vmax = 1 / (1 - r);
  if (u < r) return (vmax * u) / r;
  if (u > 1 - r) return (vmax * (1 - u)) / r;
  return vmax;
}

/** Seconds a vehicle needs to reach cruise speed (and brake) on an inter-stop segment. */
export const DEFAULT_RAMP_SEC = 15;

/**
 * Distance along the shape at time t for one timed stop list.
 * Writes [distanceM, speedMps, stopIndex, dwelling(0|1)] into `out`.
 * Returns false when t is outside the trip.
 */
export function distanceAtTime(
  arr: ArrayLike<number>,
  dep: ArrayLike<number>,
  dist: ArrayLike<number>,
  offset: number,
  count: number,
  t: number,
  out: Float64Array,
  rampSec = DEFAULT_RAMP_SEC,
): boolean {
  if (count === 0) return false;
  const last = offset + count - 1;
  if (t < dep[offset] || t > arr[last]) return false;
  // Largest k with arr[k] <= t (the stop the vehicle has most recently reached).
  let lo = offset;
  let hi = last;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (arr[mid] <= t) lo = mid;
    else hi = mid - 1;
  }
  const k = lo;
  if (t <= dep[k] || k === last) {
    out[0] = dist[k];
    out[1] = 0;
    out[2] = k - offset;
    out[3] = 1;
    return true;
  }
  const T = arr[k + 1] - dep[k];
  const D = dist[k + 1] - dist[k];
  if (T <= 0) {
    out[0] = dist[k + 1];
    out[1] = 0;
    out[2] = k + 1 - offset;
    out[3] = 0;
    return true;
  }
  const u = (t - dep[k]) / T;
  const ramp = rampSec / T;
  out[0] = dist[k] + D * motionFraction(u, ramp);
  out[1] = (D / T) * motionVelocity(u, ramp);
  out[2] = k - offset;
  out[3] = 0;
  return true;
}

/**
 * Point at distance d along a shape stored as interleaved lon/lat plus
 * cumulative distances. Coordinates are offset by (baseLon, baseLat).
 * Writes [lon, lat, bearingDeg] into `out`.
 */
export function pointAlongShape(
  coords: ArrayLike<number>,
  cum: ArrayLike<number>,
  offset: number,
  count: number,
  d: number,
  out: Float64Array,
  baseLon = 0,
  baseLat = 0,
  /** Skip the bearing (out[2] = 0) when only the position is needed. */
  withBearing = true,
): void {
  if (count === 1) {
    out[0] = coords[2 * offset] + baseLon;
    out[1] = coords[2 * offset + 1] + baseLat;
    out[2] = 0;
    return;
  }
  const last = offset + count - 1;
  let i: number;
  if (d <= cum[offset]) i = offset;
  else if (d >= cum[last]) i = last - 1;
  else {
    // Largest i with cum[i] <= d, bounded so that i + 1 exists.
    let lo = offset;
    let hi = last - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (cum[mid] <= d) lo = mid;
      else hi = mid - 1;
    }
    i = lo;
  }
  const seg = cum[i + 1] - cum[i];
  const f = seg > 0 ? Math.min(1, Math.max(0, (d - cum[i]) / seg)) : 0;
  const lon1 = coords[2 * i] + baseLon;
  const lat1 = coords[2 * i + 1] + baseLat;
  const lon2 = coords[2 * i + 2] + baseLon;
  const lat2 = coords[2 * i + 3] + baseLat;
  out[0] = lon1 + (lon2 - lon1) * f;
  out[1] = lat1 + (lat2 - lat1) * f;
  if (!withBearing) {
    out[2] = 0;
    return;
  }
  // Zero-length segments keep the bearing of the next real segment.
  let j = i;
  while (j < last - 1 && cum[j + 1] - cum[j] <= 0.01) j++;
  out[2] = bearingDeg(coords[2 * j] + baseLon, coords[2 * j + 1] + baseLat, coords[2 * j + 2] + baseLon, coords[2 * j + 3] + baseLat);
}

/**
 * Project a point onto a polyline, searching only forward from `fromSegment`
 * so successive stops of one trip never run backwards on loops.
 * Returns [distanceAlong, segmentIndex, perpendicularMetres].
 */
export function projectOntoShape(
  coords: ArrayLike<number>,
  cum: ArrayLike<number>,
  pointCount: number,
  lon: number,
  lat: number,
  fromSegment: number,
  out: Float64Array,
  /** Latitude used for the metric scale when coordinates are base-relative. */
  scaleLat = lat,
): void {
  const kx = Math.cos(scaleLat * D2R) * D2R * R;
  const ky = D2R * R;
  let bestD2 = Infinity;
  let bestAlong = cum[Math.min(fromSegment, pointCount - 1)] ?? 0;
  let bestSeg = fromSegment;
  for (let i = Math.max(0, fromSegment); i < pointCount - 1; i++) {
    // Once a close match exists, do not wander into a later pass of a looping route.
    if (bestD2 < 150 * 150 && cum[i] - bestAlong > 2000) break;
    const ax = (coords[2 * i] - lon) * kx;
    const ay = (coords[2 * i + 1] - lat) * ky;
    const bx = (coords[2 * i + 2] - lon) * kx;
    const by = (coords[2 * i + 3] - lat) * ky;
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let f = len2 > 0 ? -(ax * dx + ay * dy) / len2 : 0;
    f = f < 0 ? 0 : f > 1 ? 1 : f;
    const px = ax + dx * f;
    const py = ay + dy * f;
    const d2 = px * px + py * py;
    if (d2 < bestD2) {
      bestD2 = d2;
      bestSeg = i;
      bestAlong = cum[i] + (cum[i + 1] - cum[i]) * f;
    }
  }
  if (pointCount === 1) {
    const dx = (coords[0] - lon) * kx;
    const dy = (coords[1] - lat) * ky;
    bestD2 = dx * dx + dy * dy;
    bestAlong = 0;
    bestSeg = 0;
  }
  out[0] = bestAlong;
  out[1] = bestSeg;
  out[2] = Math.sqrt(bestD2);
}
