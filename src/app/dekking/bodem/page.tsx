import Link from "next/link";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Check,
  X,
  Lock,
  MapPin,
  Layers,
  Image as ImageIcon,
  Box,
  Braces,
  Split,
  ExternalLink,
} from "lucide-react";
import { getCity } from "@/lib/cities";
import {
  buildDataSources,
  getBaselineCatalog,
  getLayerMetadata,
} from "@/lib/data-sources";
import {
  BOG_DATASETS,
  BOG_THEMAS,
  type BogDataset,
  type BogBeschikbaarheid,
} from "@/lib/bog-datasets";

export const metadata: Metadata = {
  title: "Dekking — Bodem & Ondergrond (BOG) — Basis Stadstwin",
};

/** Inclusion status of a wishlist dataset in the app catalogue. */
type BogStatus =
  | "nationaal-live"
  | "nationaal-stub"
  | "lokaal"
  | "ontbreekt";

const FOCUS_SLUGS = ["zwolle", "apeldoorn", "helmond"] as const;

interface ResolvedDataset extends BogDataset {
  status: BogStatus;
  liveInCities: string[];
}

function resolve(): {
  rows: ResolvedDataset[];
  focusCounts: { slug: string; name: string; live: number; total: number }[];
} {
  // A `national-only` city carries exactly the national + provincial baseline
  // (no municipal module), so its layer set tells us what works for all 342
  // gemeenten. Utrecht is configured as national-only.
  const nationalCity = getCity("utrecht")!;
  const national = new Map(
    getLayerMetadata(nationalCity).map((l) => [l.id, l])
  );
  const baseline = getBaselineCatalog();

  const rows: ResolvedDataset[] = BOG_DATASETS.map((d) => {
    let status: BogStatus = "ontbreekt";
    let liveInCities: string[] = [];
    if (d.mappedLayerId) {
      const nat = national.get(d.mappedLayerId);
      if (nat) {
        status =
          (nat.availability ?? "live") === "stub"
            ? "nationaal-stub"
            : "nationaal-live";
      } else {
        const base = baseline.get(d.mappedLayerId);
        if (base) {
          status = "lokaal";
          liveInCities = base.liveInCities;
        }
      }
    }
    // Landelijk beschikbaar als raster/voxel maar bewust geen kaartlaag.
    if (status === "ontbreekt" && d.landelijkRaster) status = "nationaal-stub";
    return { ...d, status, liveInCities };
  });

  const focusCounts = FOCUS_SLUGS.map((slug) => {
    const city = getCity(slug)!;
    const layers = buildDataSources(city).filter((l) => l.bog);
    const live = layers.filter((l) => (l.availability ?? "live") !== "stub");
    return { slug, name: city.name, live: live.length, total: layers.length };
  });

  return { rows, focusCounts };
}

export default function DekkingBodemPage() {
  const { rows, focusCounts } = resolve();

  const totals = {
    nationaalLive: rows.filter((r) => r.status === "nationaal-live").length,
    nationaalStub: rows.filter((r) => r.status === "nationaal-stub").length,
    lokaal: rows.filter((r) => r.status === "lokaal").length,
    ontbreekt: rows.filter((r) => r.status === "ontbreekt").length,
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link
            href="/dekking"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Terug naar dekking
          </Link>
          <h1 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight md:text-3xl">
            <span className="text-amber-700 dark:text-amber-600">◆</span>
            Bodem &amp; Ondergrond (BOG)
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            De gewenste datasets uit het BOG-DMI programma (Datalandschap Bodem
            &amp; Ondergrond), afgezet tegen wat de Basis Stadstwin nu bevat.
            Datasets met een landelijke bron (BRO/PDOK/RVO) werken voor alle 342
            gemeenten; lagen met het{" "}
            <span className="text-amber-700 dark:text-amber-600">◆</span>-merkje
            in de kaart-zijbalk horen bij dit programma.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full border bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-400">
              ✓ {totals.nationaalLive} landelijk live
            </span>
            <span className="rounded-full border bg-sky-500/10 px-2.5 py-1 text-sky-700 dark:text-sky-400">
              ▦ {totals.nationaalStub} landelijk (raster/stub)
            </span>
            <span className="rounded-full border bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-400">
              ⌖ {totals.lokaal} alleen lokaal
            </span>
            <span className="rounded-full border bg-red-500/10 px-2.5 py-1 text-red-700 dark:text-red-400">
              ✗ {totals.ontbreekt} ontbreekt / hiaat
            </span>
            <span className="rounded-full border px-2.5 py-1">
              {BOG_DATASETS.length} gewenste datasets
            </span>
          </div>

          {/* Focus cities */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {focusCounts.map((f) => (
              <Link
                key={f.slug}
                href={`/${f.slug}`}
                className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-accent/40"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {f.name}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    BOG-lagen in de kaart
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold tabular-nums">
                    {f.live}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{f.total}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">live / totaal</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Apeldoorn en Helmond draaien op de landelijke BOG-basislijn; lokale
            verrijking (bv. gemeentelijke bodemonderzoeken/saneringen, zoals in
            Zwolle) is een vervolgstap via <code>/promote-city</code>.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="space-y-6">
          {BOG_THEMAS.map((thema) => {
            const items = rows.filter((r) => r.thema === thema);
            if (items.length === 0) return null;
            const live = items.filter(
              (i) => i.status === "nationaal-live"
            ).length;
            return (
              <section
                key={thema}
                className="overflow-hidden rounded-lg border"
              >
                <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
                  <h2 className="flex items-center gap-2 font-semibold">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    {thema}
                  </h2>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {live}/{items.length} landelijk live
                  </span>
                </div>
                <ul className="divide-y">
                  {items.map((item) => (
                    <DatasetRow key={item.key} item={item} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/* Why some datasets are not live yet */}
        <section className="mt-8 overflow-hidden rounded-lg border">
          <div className="border-b bg-muted/30 px-4 py-3">
            <h2 className="font-semibold">
              Waarom zijn sommige BOG-datasets nog niet beschikbaar?
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              De Basis Stadstwin laadt elke laag <strong>per gemeente</strong>{" "}
              op met een bbox-query (alleen objecten binnen de stadsgrens) en
              tekent die als <strong>vectorlaag</strong> — punten, lijnen of
              vlakken die je kunt aanklikken, kleuren en filteren. Datasets die
              niet in die vorm beschikbaar zijn, staan daarom op{" "}
              <em>raster/stub</em>, <em>ontbreekt</em> of <em>hiaat</em>.
            </p>
          </div>
          <ul className="divide-y">
            <ReasonRow
              icon={<ImageIcon className="h-4 w-4" />}
              title="Alleen WMS-kaartbeeld of landelijke bulk-download (ATOM)"
              affects="Sondeeronderzoek (CPT), Bodemkundig booronderzoek (BHR-P), Geomorfologische kaart"
            >
              PDOK ontsluit deze alléén als kant-en-klaar kaartbeeld (WMS) of als
              één landsdekkend downloadbestand (ATOM/GML van heel Nederland). Er
              is geen bbox-bevraagbare vectorservice (WFS / OGC API Features).
              Een WMS-plaatje bevat geen los te bevragen objecten, en een
              landsdekkende download (honderdduizenden boringen/sonderingen) is
              te groot om per stad in de browser te laden. Zodra PDOK hiervoor
              een vectorservice publiceert, kan de laag direct live.
            </ReasonRow>
            <ReasonRow
              icon={<Box className="h-4 w-4" />}
              title="Raster- en voxelmodellen (geen vectorobjecten)"
              affects="GeoTOP, REGIS II, Bodemkaart, AHN (DSM/DTM)"
            >
              Dit zijn rekenmodellen en rasters: GeoTOP is een 3D-voxelmodel,
              REGIS II een lagenmodel, de bodemkaart en AHN zijn vlak-/hoogte­
              rasters. Ze bestaan uit cel- of beelddata, niet uit punten/lijnen/
              vlakken. De kaartmotor (deck.gl) tekent vectorlagen; een
              raster-overlaypad — zoals de luchtfoto-achtergrond al gebruikt —
              bestaat voor dátalagen nog niet. Eén gedeelde uitbreiding zou al
              deze lagen tegelijk ontsluiten.
            </ReasonRow>
            <ReasonRow
              icon={<Braces className="h-4 w-4" />}
              title="Complexe INSPIRE-GML, diepe ondergrond"
              affects="Mijnbouwwetvergunning (EPL), Mijnbouwconstructie (EPC)"
            >
              Mijnbouwdata (NLOG / Geologische Dienst Nederland) is alleen
              beschikbaar als INSPIRE-geharmoniseerde WFS met een complexe,
              geneste GML-structuur — geen platte GeoJSON die de kaart direct kan
              tekenen. Het betreft bovendien de diepe ondergrond, zeer dun bezet,
              en is daardoor weinig relevant op gemeenteschaal.
            </ReasonRow>
            <ReasonRow
              icon={<Split className="h-4 w-4" />}
              title="Versnipperd per bevoegd gezag (geen uniforme landelijke bron)"
              affects="Bodemkwaliteit / saneringen (SAD), Waterschapslegger, KLIC"
            >
              Deze data wordt per gemeente, omgevingsdienst of waterschap
              beheerd, zonder uniforme open landelijke service (en KLIC is
              wettelijk besloten — alleen via een graafmelding). Lokaal is het er
              soms wél: bv. de bodemonderzoeken en saneringen van Zwolle staan
              live. Landelijke dekking vergt koppelingen per bronhouder of een
              toekomstige BRO-tranche.
            </ReasonRow>
          </ul>
        </section>

        <div className="mt-6 rounded-lg border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Bron:</strong> BOG-DMI
          inventarisatie (DMI V0.1, datalandschap-graaf, NORA/FAIR-analyse,
          Amsterdam assetlijst). Status afgeleid uit de live laag-catalogus van
          de Basis Stadstwin.
        </div>
      </div>
    </div>
  );
}

function ReasonRow({
  icon,
  title,
  affects,
  children,
}: {
  icon: ReactNode;
  title: string;
  affects: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {children}
        </p>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          <span className="text-foreground/70">Betreft:</span> {affects}
        </p>
      </div>
    </li>
  );
}

function DatasetRow({ item }: { item: ResolvedDataset }) {
  const dimmed = item.status === "ontbreekt";
  return (
    <li
      className={`flex items-start justify-between gap-3 px-4 py-2.5 ${
        dimmed ? "opacity-60" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-sm">{item.naam}</span>
          <code className="rounded bg-muted px-1 py-0.5 text-[9px] font-mono text-muted-foreground">
            {item.key}
          </code>
          <OpennessPill openness={item.beschikbaarheid} />
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Bron: {item.bron}
          {item.status === "lokaal" && item.liveInCities.length > 0 && (
            <>
              {" "}· Live in:{" "}
              <strong className="text-foreground">
                {item.liveInCities.join(", ")}
              </strong>
            </>
          )}
          {item.toelichting && <> · {item.toelichting}</>}
        </p>
        {item.viewerUrl && (
          <a
            href={item.viewerUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 hover:underline dark:text-sky-400"
          >
            <ExternalLink className="h-3 w-3" />
            Bekijk landelijke kaart
          </a>
        )}
      </div>
      <StatusPill status={item.status} />
    </li>
  );
}

function StatusPill({ status }: { status: BogStatus }) {
  if (status === "nationaal-live") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
        <Check className="h-3 w-3" /> landelijk live
      </span>
    );
  }
  if (status === "nationaal-stub") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-400">
        <Layers className="h-3 w-3" /> raster/stub
      </span>
    );
  }
  if (status === "lokaal") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
        <MapPin className="h-3 w-3" /> lokaal
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:text-red-400">
      <X className="h-3 w-3" /> ontbreekt
    </span>
  );
}

function OpennessPill({ openness }: { openness: BogBeschikbaarheid }) {
  if (openness === "open") {
    return (
      <span className="rounded-full border border-emerald-500/30 px-1.5 py-0.5 text-[9px] text-emerald-700 dark:text-emerald-400">
        open
      </span>
    );
  }
  if (openness === "besloten") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full border border-red-500/30 px-1.5 py-0.5 text-[9px] text-red-700 dark:text-red-400">
        <Lock className="h-2.5 w-2.5" /> besloten
      </span>
    );
  }
  return (
    <span className="rounded-full border border-amber-500/30 px-1.5 py-0.5 text-[9px] text-amber-700 dark:text-amber-400">
      hiaat
    </span>
  );
}
