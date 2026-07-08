"use client";

/**
 * Grafiekcomponenten voor story maps. Bewust klein en dom: alle aggregatie
 * gebeurt in `src/lib/stories/compute.ts`; hier alleen rendering.
 *
 * Kleurgebruik volgt de dataviz-richtlijn: magnitude-vergelijkingen in één
 * sequentiële hue (blauw, gevalideerd op de donkere achtergrond), tekst in
 * tekstkleuren (nooit in de seriekleur), hairline gridlijnen, dunne staven
 * met afgeronde data-uiteinden en directe waardelabels.
 */

import type {
  ComputedStat,
  CategoryBarDatum,
  HistogramDatum,
} from "@/lib/stories/compute";
import { formatNumber } from "@/lib/stories/compute";

/** Fallback-seriekleur — gevalideerd (contrast + CVD) op de donkere achtergrond. */
const SERIES = "#3987e5";

/** Donkere paneelachtergrond waarop de grafieken renderen (≈ --background). */
const SURFACE_LUM = relativeLuminance([27, 27, 27]);

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/**
 * Seriekleur afgeleid van de laagkleur (het gekleurde bolletje in de
 * sidebar), zodat grafieken visueel aan hun datalaag gekoppeld zijn.
 * Donkere laagkleuren worden stapsgewijs richting wit gemengd tot ze
 * minimaal 3:1 contrast halen op de donkere paneelachtergrond.
 */
export function layerSeriesColor(
  color?: [number, number, number, number]
): string {
  if (!color) return SERIES;
  let [r, g, b] = color;
  for (let i = 0; i < 20; i++) {
    const lum = relativeLuminance([r, g, b]);
    const contrast =
      (Math.max(lum, SURFACE_LUM) + 0.05) / (Math.min(lum, SURFACE_LUM) + 0.05);
    if (contrast >= 3) break;
    r = Math.min(255, r + (255 - r) * 0.12);
    g = Math.min(255, g + (255 - g) * 0.12);
    b = Math.min(255, b + (255 - b) * 0.12);
  }
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function StatRow({ stats }: { stats: ComputedStat[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border bg-card px-3 py-2.5"
        >
          <div className="text-xl font-semibold leading-tight">
            {s.value}
            {s.unit && (
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {s.unit}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChartFrameProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function ChartFrame({ title, description, children }: ChartFrameProps) {
  return (
    <figure className="rounded-lg border bg-card px-4 py-3">
      <figcaption>
        <div className="text-sm font-semibold">{title}</div>
        {description && (
          <div className="mt-0.5 text-[11px] text-muted-foreground">
            {description}
          </div>
        )}
      </figcaption>
      <div className="mt-3">{children}</div>
    </figure>
  );
}

interface CategoryBarChartProps {
  title: string;
  description?: string;
  data: CategoryBarDatum[];
  /** Seriekleur (van de laag); fallback is het standaardblauw. */
  color?: string;
}

/** Horizontale staafgrafiek: één hue, directe waardelabels, geen legenda. */
export function CategoryBarChart({
  title,
  description,
  data,
  color = SERIES,
}: CategoryBarChartProps) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <ChartFrame title={title} description={description}>
      <div className="space-y-2">
        {data.map((d) => {
          const isOther = d.label.startsWith("Overig");
          return (
            <div key={d.label} title={`${d.label}: ${formatNumber(d.count)}`}>
              <div className="mb-0.5 flex items-baseline justify-between gap-2 text-[11px]">
                <span className="truncate text-muted-foreground">{d.label}</span>
                <span className="shrink-0 font-medium tabular-nums">
                  {formatNumber(d.count)}
                </span>
              </div>
              <div className="h-2 w-full rounded-sm bg-muted/40">
                <div
                  className="h-2 rounded-sm transition-[width] duration-300"
                  style={{
                    width: `${Math.max(1.5, (d.count / max) * 100)}%`,
                    backgroundColor: isOther ? "#6b6b66" : color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartFrame>
  );
}

interface HistogramChartProps {
  title: string;
  description?: string;
  unit?: string;
  data: HistogramDatum[];
  /** Seriekleur (van de laag); fallback is het standaardblauw. */
  color?: string;
}

/** Kolommen-histogram in SVG: hairline baseline, per-kolom hover-tooltip. */
export function HistogramChart({
  title,
  description,
  unit,
  data,
  color = SERIES,
}: HistogramChartProps) {
  const W = 560;
  const H = 140;
  const PAD_BOTTOM = 18;
  const max = Math.max(...data.map((d) => d.count));
  const n = data.length;
  const gap = 2;
  const barW = (W - gap * (n - 1)) / n;

  return (
    <ChartFrame
      title={title}
      description={description ?? (unit ? `Verdeling in ${unit}` : undefined)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={title}
      >
        {data.map((d, i) => {
          const h = max > 0 ? (d.count / max) * (H - PAD_BOTTOM - 8) : 0;
          const x = i * (barW + gap);
          const y = H - PAD_BOTTOM - h;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, d.count > 0 ? 2 : 0)}
                rx={2}
                fill={color}
                className="hover:opacity-80"
              >
                <title>
                  {d.label}
                  {unit ? ` ${unit}` : ""}: {formatNumber(d.count)} objecten
                </title>
              </rect>
            </g>
          );
        })}
        {/* Baseline */}
        <line
          x1={0}
          y1={H - PAD_BOTTOM}
          x2={W}
          y2={H - PAD_BOTTOM}
          stroke="#383835"
          strokeWidth={1}
        />
        {/* As-labels: alleen eerste en laatste bin-grens (selectief labelen) */}
        <text
          x={0}
          y={H - 4}
          fontSize={11}
          fill="#898781"
        >
          {formatNumber(data[0].x0, 1)}
          {unit ? ` ${unit}` : ""}
        </text>
        <text
          x={W}
          y={H - 4}
          fontSize={11}
          fill="#898781"
          textAnchor="end"
        >
          {formatNumber(data[n - 1].x1, 1)}
          {unit ? ` ${unit}` : ""}
        </text>
      </svg>
    </ChartFrame>
  );
}
