import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { getCity, ALL_CITIES } from "@/lib/cities";
import CityMap from "./city-map";
import type { Metadata } from "next";

export function generateStaticParams() {
  return ALL_CITIES.map((c) => ({ city: c.slug }));
}

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "Onbekende stad — Basis Stadstwin" };
  return {
    title: `${city.name} — Basis Stadstwin`,
    description: `Open data en datalagen voor de gemeente ${city.name} op een interactieve kaart.`,
  };
}

export default async function CityPage({ params }: PageProps) {
  const { city: slug } = await params;
  const city = getCity(slug);

  if (!city) notFound();

  if (city.status === "coming-soon") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background p-6">
        <div className="max-w-md space-y-4 text-center">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">{city.name} volgt later</h1>
          <p className="text-sm text-muted-foreground">
            De digitale tweeling voor {city.name} ({city.province}) is nog in
            ontwikkeling. Op dit moment zijn alleen Zwolle, Helmond en Apeldoorn
            beschikbaar als pilotstad voor de Basis Stadstwin.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Terug naar stedenoverzicht
          </Link>
        </div>
      </div>
    );
  }

  // key={city.slug} ensures useLayers state resets cleanly on city change.
  return <CityMap key={city.slug} city={city} />;
}
