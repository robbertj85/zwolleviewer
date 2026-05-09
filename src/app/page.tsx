import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { ALL_CITIES } from "@/lib/cities";

export const metadata = {
  title: "Basis Stadstwin — Kies een stad",
  description:
    "Een minimale digitale tweeling voor elke Nederlandse gemeente. Kies een gemeente om de open data op de kaart te zien.",
};

export default function CitySelectorPage() {
  const cities = ALL_CITIES;
  const liveCount = cities.filter((c) => c.status === "live").length;
  const fullCount = cities.filter(
    (c) => c.status === "live" && c.coverage === "full"
  ).length;
  const nationalOnlyCount = cities.filter(
    (c) => c.status === "live" && c.coverage === "national-only"
  ).length;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Basis Stadstwin
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
            Een digitale tweeling voor elke Nederlandse gemeente
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
            De &quot;ziekenfonds&quot; van digital twins — minimale, open
            basisdekking voor alle {cities.length} Nederlandse gemeenten.
            Lucht, geluid, mobiliteit, veiligheid, energie, gebouwen,
            ondergrond — bij elkaar op één interactieve kaart, voor iedereen
            toegankelijk.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="rounded-full border px-3 py-1">
              <span className="text-emerald-600 dark:text-emerald-400">●</span>{" "}
              {fullCount} met lokale GIS-data
            </span>
            <span className="rounded-full border px-3 py-1">
              <span className="text-sky-600 dark:text-sky-400">●</span>{" "}
              {nationalOnlyCount} met landelijke baseline
            </span>
            <span className="rounded-full border px-3 py-1">
              Open data — PDOK · CBS · NDW · OSM · RIVM · RCE
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Kies een gemeente
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {cities.map((city) => {
            const live = city.status === "live";
            const fullCoverage = live && city.coverage === "full";
            const nationalOnly = live && city.coverage === "national-only";
            const recentlyPromoted =
              live &&
              city.promotedAt &&
              Date.now() - new Date(city.promotedAt).getTime() <
                30 * 24 * 60 * 60 * 1000;
            const card = (
              <div
                key={city.slug}
                className={[
                  "group relative flex h-28 flex-col justify-between rounded-lg border p-3 transition-all",
                  live
                    ? "cursor-pointer hover:border-primary hover:shadow-md hover:-translate-y-0.5"
                    : "cursor-not-allowed opacity-40 hover:opacity-50",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <div className="text-sm font-semibold leading-tight">
                    {city.name}
                  </div>
                  {live ? (
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground">
                    {city.province}
                  </div>
                  <div
                    title={
                      fullCoverage
                        ? "Landelijke baseline + provinciale + gemeentespecifieke GIS-lagen"
                        : nationalOnly
                        ? "Landelijke baseline + provinciale datasets — geen gemeentespecifieke lagen"
                        : undefined
                    }
                    className={[
                      "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                      !live
                        ? "bg-muted text-muted-foreground"
                        : fullCoverage
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : nationalOnly
                        ? "bg-muted/60 text-muted-foreground/80"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {!live
                      ? "Binnenkort"
                      : fullCoverage
                      ? "Lokaal"
                      : nationalOnly
                      ? "Nationaal"
                      : "Beschikbaar"}
                  </div>
                  {recentlyPromoted && (
                    <span
                      title={`Onlangs verwerkt door /promote-city (${city.promotedAt})`}
                      className="ml-1 inline-block align-middle rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 dark:text-amber-400"
                    >
                      ✦ nieuw
                    </span>
                  )}
                </div>
              </div>
            );
            return live ? (
              <Link key={city.slug} href={`/${city.slug}`} className="block">
                {card}
              </Link>
            ) : (
              <div key={city.slug} aria-disabled="true">
                {card}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-lg border bg-muted/30 px-5 py-4 text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">Hoe werkt dit?</strong>{" "}
            Basis Stadstwin biedt voor elke Nederlandse gemeente dezelfde
            minimale set datalagen op de kaart, gebouwd op nationale open
            data (PDOK, CBS, RIVM, RCE) aangevuld met provinciale bronnen.
            Voor {fullCount} gemeenten ({" "}
            {cities
              .filter((c) => c.status === "live" && c.coverage === "full")
              .map((c) => c.name)
              .join(", ")}{" "}
            ) bieden we daarbovenop de gemeentespecifieke GIS-lagen aan; de
            andere {nationalOnlyCount} steden draaien op de landelijke
            baseline. Alle {liveCount} kaarten zijn nu beschikbaar.
          </p>
        </div>
      </div>
    </div>
  );
}
