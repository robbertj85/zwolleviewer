import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getCity } from "@/lib/cities";
import {
  fetchAllPdcProducts,
  fetchPdcDetails,
  getPdcProductsForCity,
} from "@/lib/pdc";
import { Badge } from "@/components/ui/badge";
import CitySelect from "./city-select";

export const metadata = {
  title: "PDC — DMI Product Data Catalog",
  description:
    "Live overzicht van de DMI-Ecosysteem Product Data Catalog (pdx.dmi-ecosysteem.nl), gefilterd per gemeente.",
};

// Always render against the live DMI API.
export const dynamic = "force-dynamic";

export default async function PdcPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city: citySlug } = await searchParams;
  const city = getCity(citySlug ?? "zwolle") ?? getCity("zwolle")!;

  const all = await fetchAllPdcProducts();
  const { municipal, mentions, national } = getPdcProductsForCity(all, city);

  // Enrich the small city-specific set with marketplace offers.
  const cityProducts = [...municipal, ...mentions];
  const details = await fetchPdcDetails(cityProducts.map((p) => p.id));
  const enriched = cityProducts.map((p, i) => ({
    product: p,
    relevance: i < municipal.length ? "municipal" : "mentions",
    offers: details[i]?.catalogueOffers ?? [],
  }));

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              PDC — DMI Product Data Catalog
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live data van{" "}
              <a
                href="https://pdx.dmi-ecosysteem.nl"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                pdx.dmi-ecosysteem.nl
              </a>{" "}
              — {all.length} dataproducten in het DMI-Ecosysteem, gefilterd per
              gemeente.
            </p>
          </div>
          <CitySelect value={city.slug} />
        </div>

        {/* Counts */}
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="default">
            {municipal.length} door {city.name}
          </Badge>
          <Badge variant="secondary">{mentions.length} noemen {city.name}</Badge>
          <Badge variant="outline">{national.length} landelijk</Badge>
        </div>

        {enriched.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Geen dataproducten specifiek gekoppeld aan {city.name}. PDC-producten
            bevatten geen geografie, dus koppeling gebeurt op aanbieder
            (&ldquo;Gemeente {city.name}&rdquo;) of vermelding in de tekst. De{" "}
            {national.length} landelijke producten zijn ook voor {city.name} van
            toepassing.
          </p>
        ) : (
          <ul className="space-y-3">
            {enriched.map(({ product, relevance, offers }) => (
              <li key={product.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{product.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {product.dataProvider.name}
                    </p>
                  </div>
                  <Badge
                    variant={relevance === "municipal" ? "default" : "secondary"}
                  >
                    {relevance === "municipal"
                      ? "eigen aanbod"
                      : "vermelding"}
                  </Badge>
                </div>
                {product.themes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.themes.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
                {offers.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {offers.map((o) => (
                      <a
                        key={o.id}
                        href={o.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {o.marketplace.name}
                        {o.fileFormats.length > 0 &&
                          ` · ${o.fileFormats.join(", ")}`}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="pt-4 text-xs text-muted-foreground">
          Raw API:{" "}
          <Link href={`/api/pdc?city=${city.slug}`} className="underline">
            /api/pdc?city={city.slug}
          </Link>
        </p>
      </div>
    </div>
  );
}
