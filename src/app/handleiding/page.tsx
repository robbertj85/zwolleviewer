import { MapIcon } from "lucide-react";

export default function HandleidingPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-10">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Handleiding</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gebruikershandleiding voor de Zwolle Data Viewer
          </p>
        </div>

        {/* Inhoudsopgave */}
        <nav className="rounded-lg border p-4 space-y-1.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inhoudsopgave</h2>
          <ol className="text-sm space-y-1 list-decimal pl-5">
            {[
              { href: "#introductie", label: "Wat is de Zwolle Data Viewer?" },
              { href: "#datalagen", label: "Beschikbare datalagen" },
              { href: "#lagen-activeren", label: "Lagen activeren" },
              { href: "#achtergrondkaart", label: "Achtergrondkaart wisselen" },
              { href: "#api-gateway", label: "API Gateway & data downloaden" },
              { href: "#beperkingen", label: "Beperkingen" },
              { href: "#databronnen", label: "Databronnen" },
            ].map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="text-primary hover:underline underline-offset-2">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Introductie */}
        <section id="introductie" className="space-y-3 scroll-mt-16">
          <h2 className="text-lg font-semibold">Wat is de Zwolle Data Viewer?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            De Zwolle Data Viewer is een interactieve kaartapplicatie waarmee je open
            geodata van de gemeente Zwolle en andere overheidsbronnen kunt verkennen.
            Met meer dan 100 datalagen kun je in een oogopslag zien waar zich
            verkeerslichten, bomen, laadpalen, monumenten, milieuzones en tientallen
            andere objecten bevinden.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            De applicatie werkt bijzonder goed voor Zwolle omdat de gemeente een
            uitzonderlijk uitgebreide GIS-server aanbiedt. Zwolle stelt via{" "}
            <a
              href="https://gisservices.zwolle.nl/ArcGIS/rest/services"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              gisservices.zwolle.nl
            </a>{" "}
            tientallen ArcGIS Feature Services beschikbaar &mdash; van parkeerautomaten
            tot bodemverontreiniging, van strooiroutes tot artistieke kunstwerken.
            Gecombineerd met landelijke bronnen als PDOK, NDW, CBS en ProRail levert
            dit een rijke dataset op die ideaal is voor data-exploratie en
            stadsanalyse.
          </p>
        </section>

        {/* Overzicht screenshot */}
        <figure className="space-y-2">
          <img
            src="/handleiding/kaart-overzicht.png"
            alt="Overzicht van de Zwolle Data Viewer"
            className="w-full rounded-lg border shadow-sm"
          />
          <figcaption className="text-xs text-muted-foreground text-center">
            De Zwolle Data Viewer bij het opstarten &mdash; links de sidebar met alle beschikbare lagen,
            rechts de interactieve kaart.
          </figcaption>
        </figure>

        {/* Datalagen */}
        <section id="datalagen" className="space-y-3 scroll-mt-16">
          <h2 className="text-lg font-semibold">Beschikbare datalagen</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            De lagen zijn onderverdeeld in zes categorieen:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Verkeer & Transport",
                desc: "Verkeerslichten (iVRI), wegwerkzaamheden, fietsroutes, strooiroutes, parkeerautomaten, parkeerzones, laadpalen, pakketpunten, treinstations, spoorlijnen, maximumsnelheden, NDW verkeersdata (actuele snelheden, incidenten, matrixborden, brugopeningen) en meer.",
              },
              {
                title: "Gebouwen & Adressen",
                desc: "BAG panden, energielabels, rijksmonumenten, gemeentelijke monumenten en beschermd stadsgezicht.",
              },
              {
                title: "Openbare Ruimte",
                desc: "Bomen (incl. bijzondere bomen, snoei, herplant, wildplukkaart), hagen, beplantingen, grassen, sportvelden, water, afvalbakken, lichtmasten, artistieke kunstwerken en Japanse duizendknoop.",
              },
              {
                title: "Grenzen & Gebieden",
                desc: "Gemeentegrens, stadsdelen, wijken, buurten, bebouwde kom, archeologische waarderingskaart, sociaal wijkteam gebieden, CBS demografie, kadastrale percelen en drone no-fly zones.",
              },
              {
                title: "Milieu & Klimaat",
                desc: "Koele verblijfsplekken, milieubeschermingsgebieden, waterdelen, bodemverontreinigingen, geluidszones (weg, trein, industrie), wateroverlast, Natura 2000 gebieden en emissiezones.",
              },
              {
                title: "Voorzieningen",
                desc: "Horeca, terrassen, AED defibrillatoren, openbare toiletten, drinkwaterpunten, speeltuinen, scholen, zorgvoorzieningen, supermarkten, riolering, Enexis gas- en elektranetten en meer.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-lg border p-3 space-y-1">
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lagen activeren */}
        <section id="lagen-activeren" className="space-y-3 scroll-mt-16">
          <h2 className="text-lg font-semibold">Lagen activeren</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In de sidebar aan de linkerkant vind je alle beschikbare lagen, gegroepeerd per
            categorie. Klik op een categorie om deze uit of in te klappen. Gebruik de
            schakelaar naast een laagnaam om deze op de kaart te tonen of te verbergen.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Zodra je een laag activeert, worden de gegevens opgehaald bij de bronserver
            en als punten, lijnen of vlakken op de kaart getekend. Het aantal geladen
            features verschijnt naast de laagnaam. Je kunt de zoekbalk bovenaan
            gebruiken om snel een specifieke laag te vinden, en de A-Z / Z-A knoppen
            om de volgorde aan te passen.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hover over een feature op de kaart om een tooltip met de naam te zien.
            Klik op een feature om het detailpaneel te openen met alle beschikbare
            eigenschappen.
          </p>
        </section>

        {/* Actieve lagen screenshot */}
        <figure className="space-y-2">
          <img
            src="/handleiding/lagen-actief.png"
            alt="Kaart met actieve datalagen"
            className="w-full rounded-lg border shadow-sm"
          />
          <figcaption className="text-xs text-muted-foreground text-center">
            Meerdere lagen tegelijk actief: verkeerslichten, laadpalen en bomen zichtbaar op de kaart.
          </figcaption>
        </figure>

        {/* Achtergrondkaart */}
        <section id="achtergrondkaart" className="space-y-3 scroll-mt-16">
          <h2 className="text-lg font-semibold">Achtergrondkaart wisselen</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Linksonder op de kaart vind je een kaartknop waarmee je de achtergrondkaart
            kunt wisselen. Er zijn acht opties beschikbaar:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li><strong>Donker</strong> &mdash; CARTO Dark Matter (standaard, ideaal voor datavisualisatie)</li>
            <li><strong>Licht</strong> &mdash; CARTO Positron</li>
            <li><strong>Voyager</strong> &mdash; CARTO Voyager (kleurrijke stratenkaart)</li>
            <li><strong>OpenStreetMap</strong> &mdash; OpenFreeMap Liberty stijl</li>
            <li><strong>Satelliet (PDOK)</strong> &mdash; Luchtfoto via PDOK</li>
            <li><strong>Satelliet HR (PDOK)</strong> &mdash; Hoge-resolutie luchtfoto via PDOK</li>
            <li><strong>BRT Topografisch</strong> &mdash; Kadaster BRT achtergrondkaart</li>
            <li><strong>BRT Donker</strong> &mdash; Kadaster BRT in donkere stijl</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Actieve datalagen blijven behouden bij het wisselen van achtergrondkaart.
          </p>
        </section>

        {/* Basemap comparison side-by-side */}
        <figure className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <img
                src="/handleiding/basemap-donker.png"
                alt="Donkere achtergrondkaart (CARTO Dark Matter)"
                className="w-full rounded-lg border shadow-sm"
              />
              <p className="text-[10px] text-muted-foreground text-center font-medium">Donker (standaard)</p>
            </div>
            <div className="space-y-1.5">
              <img
                src="/handleiding/basemap-licht.png"
                alt="Lichte achtergrondkaart (CARTO Positron)"
                className="w-full rounded-lg border shadow-sm"
              />
              <p className="text-[10px] text-muted-foreground text-center font-medium">Licht</p>
            </div>
          </div>
          <figcaption className="text-xs text-muted-foreground text-center">
            Dezelfde datalagen op een donkere en lichte achtergrondkaart.
          </figcaption>
        </figure>

        {/* Basemap picker instruction */}
        <div className="flex items-start gap-3 rounded-lg border p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary shadow-sm">
            <MapIcon className="h-4 w-4" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Klik op de{" "}
            <span className="inline-flex items-center align-middle gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-xs font-medium text-foreground">
              <MapIcon className="h-3 w-3" />
            </span>{" "}
            knop linksonder op de kaart om het keuzemenu te openen.
            Selecteer een van de acht achtergrondkaarten. De actieve
            keuze is gemarkeerd. Je datalagen blijven intact bij het wisselen.
          </p>
        </div>

        {/* API Gateway */}
        <section id="api-gateway" className="space-y-3 scroll-mt-16">
          <h2 className="text-lg font-semibold">API Gateway &amp; data downloaden</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Naast de kaartweergave biedt de applicatie een API Gateway pagina. Hier kun
            je alle beschikbare datasets doorzoeken en de bijbehorende API-endpoints
            bekijken. De API Gateway fungeert als een uniforme toegangslaag tot alle
            onderliggende databronnen.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Elke dataset is direct downloadbaar als <strong>GeoJSON FeatureCollection</strong> via
            een RESTful API-endpoint. Dit maakt het eenvoudig om de data te gebruiken in
            externe systemen en applicaties:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>
              <strong>GIS-software</strong> &mdash; Importeer de GeoJSON-bestanden in QGIS,
              ArcGIS of andere GIS-tools voor verdere analyse en visualisatie.
            </li>
            <li>
              <strong>Data-analyse</strong> &mdash; Laad de data in Python (GeoPandas),
              R of Jupyter Notebooks voor statistische analyse.
            </li>
            <li>
              <strong>Eigen applicaties</strong> &mdash; Gebruik de API-endpoints om
              real-time data op te halen in je eigen webapplicaties of dashboards.
            </li>
            <li>
              <strong>Rapportages</strong> &mdash; Exporteer datasets voor gebruik in
              rapporten, presentaties of beleidsonderbouwing.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Op de API Gateway pagina vind je per dataset een directe download-link
            en het volledige API-endpoint. Filter op categorie of zoek op naam om snel
            de juiste dataset te vinden.
          </p>
        </section>

        {/* Beperkingen */}
        <section id="beperkingen" className="space-y-3 scroll-mt-16">
          <h2 className="text-lg font-semibold">Beperkingen</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            De Zwolle Data Viewer is een demonstratieproject en heeft een aantal
            beperkingen:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>
              <strong>Niet altijd de volledige featureset</strong> &mdash; Sommige lagen
              bevatten duizenden objecten. Om de prestaties te waarborgen wordt standaard
              een gelimiteerde set geladen (bijv. de eerste 1.000 features). Bij lagen
              met een afgekapte set verschijnt een oranje indicator met een download-knop
              om de volledige dataset alsnog op te halen. Je kunt ook Shift+klik
              gebruiken om direct de volledige dataset te laden.
            </li>
            <li>
              <strong>Alleen live fetches, geen opgeslagen historie</strong> &mdash; Alle
              data wordt bij activering real-time opgehaald bij de bronserver. Er wordt
              geen data lokaal opgeslagen of gecached tussen sessies. Dit betekent dat je
              bij elke sessie opnieuw de gewenste lagen moet activeren.
            </li>
            <li>
              <strong>Geen digital twin simulaties</strong> &mdash; De viewer toont
              uitsluitend de huidige staat van de data. Er zijn (nog) geen mogelijkheden
              voor simulatie, what-if scenario&apos;s of tijdreeksanalyse. Dit is puur
              een read-only viewer.
            </li>
            <li>
              <strong>Demodoeleinden</strong> &mdash; De applicatie is bedoeld als
              demonstratie van wat er mogelijk is met open geodata. Gebruik de data niet
              voor kritische beslissingen zonder verificatie bij de oorspronkelijke bron.
            </li>
          </ul>
        </section>

        {/* Bronnen */}
        <section id="databronnen" className="space-y-3 scroll-mt-16">
          <h2 className="text-lg font-semibold">Databronnen</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            De data in deze viewer wordt opgehaald uit de volgende bronnen:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>
              <a href="https://gisservices.zwolle.nl/ArcGIS/rest/services" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                Gemeente Zwolle GIS
              </a>{" "}
              &mdash; ArcGIS Feature Services van de gemeente
            </li>
            <li>
              <a href="https://www.pdok.nl" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                PDOK
              </a>{" "}
              &mdash; Publieke Dienstverlening Op de Kaart (BAG, BRT, BGT, luchtfoto&apos;s)
            </li>
            <li>
              <a href="https://www.ndw.nu" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                NDW
              </a>{" "}
              &mdash; Nationale Databank Wegverkeersgegevens (verkeersdata, incidenten, matrixborden)
            </li>
            <li>
              <a href="https://www.cbs.nl" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                CBS
              </a>{" "}
              &mdash; Centraal Bureau voor de Statistiek (demografische gegevens)
            </li>
            <li>
              <a href="https://www.prorail.nl" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                ProRail
              </a>{" "}
              &mdash; Spoorinfrastructuur (stations, spoorlijnen, overwegen)
            </li>
            <li>
              <a href="https://geoportaal.overijssel.nl" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                Geoportaal Overijssel
              </a>{" "}
              &mdash; Provinciale geodata (wegen, vaarwegen)
            </li>
            <li>OpenStreetMap &mdash; Achtergrondkaarten en basisgeografie</li>
            <li>pakketpuntenviewer.nl &mdash; Pakketpunten locaties</li>
          </ul>
        </section>

        {/* Footer */}
        <div className="border-t pt-6 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            Zwolle Data Viewer &mdash; een open data demonstratieproject
          </p>
        </div>
      </div>
    </div>
  );
}
