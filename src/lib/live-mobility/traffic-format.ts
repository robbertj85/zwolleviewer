// Vendored from fleetsim (src/lib/national/traffic-format.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
/**
 * Binary payload for procedural road traffic (INWEVA corridors). Dependency-free.
 *
 *   header 32: u32 magic "NLTF" | u16 version | u16 dayType (0 werkdag, 1 weekend)
 *              | u32 corridors | u32 points | u32 reserved ×3
 *   u32 offsets[corridors+1]            point offsets
 *   f64 coords[2 * points]              lon, lat
 *   f32 flows[corridors * 24 * 3]       vehicles/hour per hour per class (light, medium, heavy)
 *   f32 speeds[corridors]               free-flow speed km/h
 */

import type { FlowSectionsPayload } from './worker-protocol';

const MAGIC = 0x46544c4e; // "NLTF"
const VERSION = 1;
const HEADER = 32;

export const TRAFFIC_CLASSES = ['light', 'medium', 'heavy'] as const;
export type DayType = 'werkdag' | 'weekend';

export interface CorridorInput {
  coords: ArrayLike<number>;
  /** 24 values per class. */
  flows: { light: ArrayLike<number>; medium: ArrayLike<number>; heavy: ArrayLike<number> };
  freeFlowKph: number;
}

function pad8(n: number) {
  return (n + 7) & ~7;
}

export function encodeTrafficPayload(dayType: DayType, corridors: CorridorInput[]): Uint8Array {
  const c = corridors.length;
  let points = 0;
  for (const k of corridors) points += k.coords.length / 2;
  const offsetsBytes = 4 * (c + 1);
  const coordsStart = pad8(HEADER + offsetsBytes);
  const flowsStart = coordsStart + 16 * points;
  const speedsStart = flowsStart + 4 * c * 72;
  const size = speedsStart + 4 * c;
  const buf = new ArrayBuffer(size);
  const view = new DataView(buf);
  view.setUint32(0, MAGIC, true);
  view.setUint16(4, VERSION, true);
  view.setUint16(6, dayType === 'weekend' ? 1 : 0, true);
  view.setUint32(8, c, true);
  view.setUint32(12, points, true);
  const offsets = new Uint32Array(buf, HEADER, c + 1);
  const coords = new Float64Array(buf, coordsStart, 2 * points);
  const flows = new Float32Array(buf, flowsStart, c * 72);
  const speeds = new Float32Array(buf, speedsStart, c);
  let p = 0;
  corridors.forEach((k, i) => {
    offsets[i] = p;
    coords.set(Array.from(k.coords), 2 * p);
    p += k.coords.length / 2;
    for (let h = 0; h < 24; h++) {
      flows[(i * 24 + h) * 3] = k.flows.light[h] ?? 0;
      flows[(i * 24 + h) * 3 + 1] = k.flows.medium[h] ?? 0;
      flows[(i * 24 + h) * 3 + 2] = k.flows.heavy[h] ?? 0;
    }
    speeds[i] = k.freeFlowKph;
  });
  offsets[c] = p;
  return new Uint8Array(buf);
}

export function decodeTrafficPayload(buffer: ArrayBuffer): FlowSectionsPayload & { dayType: DayType } {
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== MAGIC) throw new Error('Not a traffic payload');
  if (view.getUint16(4, true) !== VERSION) throw new Error('Unsupported traffic payload version');
  const dayType: DayType = view.getUint16(6, true) === 1 ? 'weekend' : 'werkdag';
  const c = view.getUint32(8, true);
  const points = view.getUint32(12, true);
  const offsetsBytes = 4 * (c + 1);
  const coordsStart = pad8(HEADER + offsetsBytes);
  const flowsStart = coordsStart + 16 * points;
  const speedsStart = flowsStart + 4 * c * 72;
  return {
    dayType,
    offsets: new Uint32Array(buffer, HEADER, c + 1),
    coords: new Float64Array(buffer, coordsStart, 2 * points),
    flows: new Float32Array(buffer, flowsStart, c * 72),
    speeds: new Float32Array(buffer, speedsStart, c),
  };
}

/** Werkdag (Mon–Fri) or weekend profile for a local date; public holidays are treated as weekend. */
export function dayTypeFor(date: string, holidays: ReadonlySet<string> = DUTCH_HOLIDAYS_2026): DayType {
  const [y, m, d] = date.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return dow === 0 || dow === 6 || holidays.has(date) ? 'weekend' : 'werkdag';
}

/** National public holidays that fall on weekdays in 2026–2027 (traffic behaves like a weekend day). */
export const DUTCH_HOLIDAYS_2026: ReadonlySet<string> = new Set([
  '2026-01-01', '2026-04-06', '2026-04-27', '2026-05-05', '2026-05-14', '2026-05-25', '2026-12-25',
  '2027-01-01', '2027-03-29', '2027-04-27', '2027-05-05', '2027-05-06', '2027-05-17',
]);
