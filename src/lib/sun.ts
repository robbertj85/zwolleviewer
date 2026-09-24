// Copied from fleetsim (src/lib/national/sun.ts); keep in sync.
/**
 * Approximate solar position (accurate to well under a degree), used to drive
 * basemap palettes, MapLibre extrusion light and deck.gl lighting intensity.
 */

const D2R = Math.PI / 180;

export interface SunPosition {
  /** Degrees clockwise from north. */
  azimuthDeg: number;
  /** Degrees above the horizon (negative at night). */
  elevationDeg: number;
}

export function sunPosition(unixMs: number, lat = 52.2, lon = 5.3): SunPosition {
  const d = unixMs / 86400000 + 2440587.5 - 2451545.0;
  const g = (357.529 + 0.98560028 * d) * D2R;
  const q = 280.459 + 0.98564736 * d;
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * D2R;
  const e = (23.439 - 0.00000036 * d) * D2R;
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const gmst = (18.697374558 + 24.06570982441908 * d) % 24;
  const lst = (gmst * 15 + lon) * D2R;
  const h = lst - ra;
  const phi = lat * D2R;
  const elevation = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(h));
  const azimuth = Math.atan2(-Math.sin(h), Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(h));
  return { azimuthDeg: ((azimuth / D2R) + 360) % 360, elevationDeg: elevation / D2R };
}
