/**
 * MSI (Matrix Signal Indicators) — SVG icon generation for map rendering
 * Generates data URL icons that look like real Dutch highway matrix signs
 */

export type MSIDisplayState =
  | "blank"
  | "speed_limit"
  | "lane_open"
  | "lane_closed"
  | "lane_closed_ahead"
  | "restriction_end"
  | "unknown";

/**
 * Generate SVG for a single MSI sign panel
 */
function msiInnerSVG(
  state: MSIDisplayState,
  speedLimit?: number,
  size: number = 22
): string {
  const bg = "#1a1a1a";
  const r = 2;
  const s = size / 28;

  switch (state) {
    case "lane_closed":
      return `<rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
        <line x1="${5 * s}" y1="${5 * s}" x2="${23 * s}" y2="${23 * s}" stroke="#ef4444" stroke-width="${3 * s}" stroke-linecap="round"/>
        <line x1="${23 * s}" y1="${5 * s}" x2="${5 * s}" y2="${23 * s}" stroke="#ef4444" stroke-width="${3 * s}" stroke-linecap="round"/>`;

    case "lane_closed_ahead":
      return `<rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
        <line x1="${5 * s}" y1="${5 * s}" x2="${23 * s}" y2="${23 * s}" stroke="#f97316" stroke-width="${3 * s}" stroke-linecap="round"/>
        <line x1="${23 * s}" y1="${5 * s}" x2="${5 * s}" y2="${23 * s}" stroke="#f97316" stroke-width="${3 * s}" stroke-linecap="round"/>`;

    case "speed_limit": {
      const spd = speedLimit ?? "?";
      const fs = speedLimit && speedLimit >= 100 ? 7 * s : 9 * s;
      return `<rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${8 * s}" fill="none" stroke="#ef4444" stroke-width="${2 * s}"/>
        <text x="${size / 2}" y="${size / 2 + 3 * s}" font-family="Arial,sans-serif" font-size="${fs}" font-weight="bold" fill="#fff" text-anchor="middle">${spd}</text>`;
    }

    case "lane_open":
      return `<rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
        <path d="M${size / 2} ${4 * s}L${size / 2} ${16 * s}M${6 * s} ${12 * s}L${size / 2} ${20 * s}L${22 * s} ${12 * s}" stroke="#22c55e" stroke-width="${2.5 * s}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

    case "restriction_end":
      return `<rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${7 * s}" fill="none" stroke="#9ca3af" stroke-width="${1.5 * s}"/>
        <line x1="${5 * s}" y1="${23 * s}" x2="${23 * s}" y2="${5 * s}" stroke="#9ca3af" stroke-width="${1.5 * s}" stroke-linecap="round"/>`;

    case "blank":
      return `<rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${1.5 * s}" fill="#4b5563"/>`;

    default:
      return `<rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
        <text x="${size / 2}" y="${size / 2 + 4 * s}" font-family="Arial" font-size="${10 * s}" font-weight="bold" fill="#6b7280" text-anchor="middle">?</text>`;
  }
}

export interface MSIIconInput {
  state: MSIDisplayState;
  speedLimit?: number;
  lanes?: { state: MSIDisplayState; speedLimit?: number }[];
}

/**
 * Generate a multi-lane MSI group icon SVG.
 * Returns an SVG string for up to `maxLanes` sign panels side by side.
 */
export function generateMSIGroupSVG(
  input: MSIIconInput,
  scale: number = 4,
  maxLanes: number = 5
): { svg: string; width: number; height: number } {
  const lanes = input.lanes ?? [
    { state: input.state, speedLimit: input.speedLimit },
  ];
  const display = lanes.slice(0, maxLanes);
  const signSize = 22 * scale;
  const gap = 2 * scale;
  const pad = 2 * scale;
  const totalW = display.length * signSize + (display.length - 1) * gap + pad * 2;
  const totalH = signSize + pad * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">`;
  svg += `<rect width="${totalW}" height="${totalH}" rx="${4 * scale}" fill="#0d0d0d" stroke="#444" stroke-width="${scale}"/>`;

  display.forEach((lane, i) => {
    const x = pad + i * (signSize + gap);
    svg += `<g transform="translate(${x},${pad})">${msiInnerSVG(lane.state, lane.speedLimit, signSize)}</g>`;
  });

  if (lanes.length > maxLanes) {
    svg += `<text x="${totalW - 8 * scale}" y="${totalH - 4 * scale}" font-family="Arial" font-size="${8 * scale}" fill="#888">+${lanes.length - maxLanes}</text>`;
  }

  svg += "</svg>";
  return { svg, width: totalW, height: totalH };
}

/**
 * Generate a single MSI sign SVG (for standalone use)
 */
export function generateMSISignSVG(
  state: MSIDisplayState,
  speedLimit?: number,
  size: number = 28
): string {
  const bg = "#1a1a1a";
  const r = 3;

  let inner: string;
  switch (state) {
    case "lane_closed":
      inner = `<line x1="7" y1="7" x2="21" y2="21" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
        <line x1="21" y1="7" x2="7" y2="21" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>`;
      break;
    case "lane_closed_ahead":
      inner = `<line x1="7" y1="7" x2="21" y2="21" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>
        <line x1="21" y1="7" x2="7" y2="21" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>`;
      break;
    case "speed_limit": {
      const spd = speedLimit ?? "?";
      const fs = speedLimit && speedLimit >= 100 ? 9 : 11;
      inner = `<circle cx="14" cy="14" r="10" fill="none" stroke="#ef4444" stroke-width="2.5"/>
        <text x="14" y="18" font-family="Arial,sans-serif" font-size="${fs}" font-weight="bold" fill="#fff" text-anchor="middle">${spd}</text>`;
      break;
    }
    case "lane_open":
      inner = `<path d="M14 6L14 18M8 14L14 22L20 14" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
      break;
    case "restriction_end":
      inner = `<circle cx="14" cy="14" r="9" fill="none" stroke="#9ca3af" stroke-width="2"/>
        <line x1="7" y1="21" x2="21" y2="7" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>`;
      break;
    case "blank":
      inner = `<circle cx="14" cy="14" r="2" fill="#4b5563"/>`;
      break;
    default:
      inner = `<text x="14" y="19" font-family="Arial" font-size="14" font-weight="bold" fill="#6b7280" text-anchor="middle">?</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 28 28">
    <rect x="1" y="1" width="26" height="26" rx="${r}" fill="${bg}" stroke="#333" stroke-width="1"/>${inner}</svg>`;
}

/**
 * Convert an SVG string to a data: URL for use as an icon
 */
export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Get the display state color for styling
 */
export function getMSIStateColor(state: MSIDisplayState): [number, number, number, number] {
  switch (state) {
    case "lane_closed":
      return [239, 68, 68, 255];
    case "lane_closed_ahead":
      return [249, 115, 22, 255];
    case "speed_limit":
      return [234, 179, 8, 255];
    case "lane_open":
      return [34, 197, 94, 255];
    case "restriction_end":
      return [34, 197, 94, 255];
    case "blank":
      return [107, 114, 128, 200];
    default:
      return [156, 163, 175, 200];
  }
}
