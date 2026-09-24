// Vendored from fleetsim (src/lib/national/service-day.ts @ 6475556). Keep in sync with the original;
// local changes are marked "stadstwin:".
/**
 * GTFS service-day arithmetic for Europe/Amsterdam.
 *
 * GTFS times are "noon minus 12h" based: a time of 25:30:00 on service day D
 * means 25.5 hours after (local noon of D − 12 h). On DST change days that
 * reference is 23:00 or 01:00 local, not midnight, which is why the start is
 * derived from local noon. Dependency-free so it also runs in a Web Worker.
 */

export const NL_TIMEZONE = 'Europe/Amsterdam';

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    formatterCache.set(timeZone, f);
  }
  return f;
}

function localParts(unixMs: number, timeZone: string) {
  const parts: Record<string, number> = {};
  for (const p of formatter(timeZone).formatToParts(new Date(unixMs))) {
    if (p.type !== 'literal') parts[p.type] = Number(p.value);
  }
  return parts as { year: number; month: number; day: number; hour: number; minute: number; second: number };
}

/** Offset of local time from UTC in minutes at the given instant (e.g. +120 in CEST). */
export function timezoneOffsetMinutes(unixMs: number, timeZone = NL_TIMEZONE): number {
  const p = localParts(unixMs, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(unixMs / 1000) * 1000) / 60000);
}

/** Accepts "YYYY-MM-DD" or "YYYYMMDD". */
export function parseServiceDate(date: string): { year: number; month: number; day: number } {
  const m = /^(\d{4})-?(\d{2})-?(\d{2})$/.exec(date.trim());
  if (!m) throw new Error(`Invalid service date: ${date}`);
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

export function formatServiceDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function serviceDateToNumber(date: string): number {
  const { year, month, day } = parseServiceDate(date);
  return year * 10000 + month * 100 + day;
}

/** Unix milliseconds of GTFS time 00:00:00 on the given service date. */
export function serviceDayStartMs(date: string, timeZone = NL_TIMEZONE): number {
  const { year, month, day } = parseServiceDate(date);
  const noonAsUtc = Date.UTC(year, month - 1, day, 12, 0, 0);
  // Two passes: the first offset guess can straddle a DST change, the second cannot (noon never does).
  let offset = timezoneOffsetMinutes(noonAsUtc, timeZone);
  offset = timezoneOffsetMinutes(noonAsUtc - offset * 60000, timeZone);
  const localNoonMs = noonAsUtc - offset * 60000;
  return localNoonMs - 12 * 3600 * 1000;
}

/** Local calendar date ("YYYY-MM-DD") of an instant. */
export function localDateOf(unixMs: number, timeZone = NL_TIMEZONE): string {
  const p = localParts(unixMs, timeZone);
  return formatServiceDate(p.year, p.month, p.day);
}

export function addDays(date: string, days: number): string {
  const { year, month, day } = parseServiceDate(date);
  const d = new Date(Date.UTC(year, month - 1, day + days));
  return formatServiceDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** Parse "HH:MM:SS" (hours may exceed 24) into seconds. Returns NaN for empty input. */
export function parseGtfsTime(value: string): number {
  if (!value) return NaN;
  const a = value.split(':');
  if (a.length !== 3) return NaN;
  return Number(a[0]) * 3600 + Number(a[1]) * 60 + Number(a[2]);
}

/** Unix ms for a local wall-clock time on a calendar date (used by the time controls). */
export function localTimeToUnixMs(date: string, secondsAfterMidnight: number, timeZone = NL_TIMEZONE): number {
  const { year, month, day } = parseServiceDate(date);
  const guess = Date.UTC(year, month - 1, day) + secondsAfterMidnight * 1000;
  let offset = timezoneOffsetMinutes(guess, timeZone);
  offset = timezoneOffsetMinutes(guess - offset * 60000, timeZone);
  return guess - offset * 60000;
}
