// Vendored from fleetsim (src/workers/national/palette.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
import { MODE, MODE_COUNT } from '@/lib/live-mobility/format';

/** RGBA per mode, tuned for a dark basemap. */
export const MODE_COLORS: Array<[number, number, number, number]> = (() => {
  const c: Array<[number, number, number, number]> = new Array(MODE_COUNT).fill([170, 170, 180, 255]);
  c[MODE.BUS] = [0, 214, 170, 255];
  c[MODE.TRAM] = [255, 84, 142, 255];
  c[MODE.METRO] = [84, 170, 255, 255];
  c[MODE.RAIL] = [255, 204, 0, 255];
  c[MODE.FERRY] = [178, 140, 255, 255];
  c[MODE.CAR] = [226, 232, 240, 255];
  c[MODE.VAN] = [148, 196, 222, 255];
  c[MODE.TRUCK] = [255, 132, 52, 255];
  return c;
})();

export function speedColor(kph: number, out: Uint8Array | number[], o: number) {
  // 0 km/h red → 40 amber → 90+ green.
  const t = Math.max(0, Math.min(1, kph / 90));
  if (t < 0.45) {
    const f = t / 0.45;
    out[o] = 255; out[o + 1] = Math.round(60 + 150 * f); out[o + 2] = 60;
  } else {
    const f = (t - 0.45) / 0.55;
    out[o] = Math.round(255 - 205 * f); out[o + 1] = Math.round(210 + 10 * f); out[o + 2] = Math.round(60 + 60 * f);
  }
  out[o + 3] = 255;
}

export function delayColor(delaySec: number | undefined, out: Uint8Array | number[], o: number) {
  if (delaySec === undefined) {
    out[o] = 120; out[o + 1] = 128; out[o + 2] = 140;
  } else if (delaySec < -60) {
    out[o] = 90; out[o + 1] = 170; out[o + 2] = 255;
  } else if (delaySec <= 120) {
    out[o] = 40; out[o + 1] = 220; out[o + 2] = 120;
  } else if (delaySec <= 300) {
    out[o] = 255; out[o + 1] = 190; out[o + 2] = 40;
  } else {
    out[o] = 255; out[o + 1] = 70; out[o + 2] = 70;
  }
  out[o + 3] = 255;
}
