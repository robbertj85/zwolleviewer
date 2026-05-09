---
title: "Basis Stadstwin — wijzigingen mei 2026"
subtitle: "DMI · Ecosysteem"
author: "robbert.janssen@transportbeat.nl"
date: "8 mei 2026 · interne notitie"
geometry: "margin=2cm"
fontsize: 10pt
mainfont: "Helvetica Neue"
monofont: "Menlo"
linkcolor: "[HTML]{0066cc}"
urlcolor: "[HTML]{0066cc}"
header-includes:
  - \usepackage{xcolor}
  - \usepackage{fancyhdr}
  - \definecolor{dmi}{HTML}{0066cc}
  - \definecolor{tierLokaal}{HTML}{059669}
  - \definecolor{tierNationaal}{HTML}{6b7280}
  - \pagestyle{fancy}
  - \fancyhf{}
  - \renewcommand{\headrulewidth}{0pt}
  - \fancyfoot[L]{\textcolor{dmi}{\textbf{DMI · Ecosysteem}} · Basis Stadstwin}
  - \fancyfoot[R]{\thepage}
  - \usepackage{enumitem}
  - \setlist{nosep,leftmargin=1.4em}
  - \usepackage[normalem]{ulem}
  - \usepackage{tcolorbox}
  - \tcbuselibrary{skins,breakable}
  - \newtcolorbox{callout}{colback=dmi!5!white,colframe=dmi!60!white,boxrule=0.4pt,arc=2pt,left=8pt,right=8pt,top=4pt,bottom=4pt}
---

\begin{center}
\vspace*{2cm}
{\Huge\bfseries Basis Stadstwin}\\[0.5em]
{\Large\textcolor{dmi}{Wijzigingen — mei 2026}}\\[2em]
\rule{8cm}{0.4pt}\\[1em]
{\large Maandrapportage · DMI · Ecosysteem}\\[0.5em]
\textit{robbert.janssen@transportbeat.nl}\\[3em]
\textcolor{dmi}{\textbf{Productie:}} \texttt{https://basis-stadstwin.vercel.app}\\[0.3em]
\textcolor{dmi}{\textbf{Repository:}} \texttt{github.com/robbertj85/zwolleviewer}
\end{center}

\vfill

\begin{callout}
\textbf{Samenvatting van deze maand.} De landelijke baseline van 342 gemeenten staat live; zes steden hebben nu Lokaal-tier (Zwolle, Helmond, Apeldoorn, Tilburg, Rotterdam, Amsterdam). Drie nieuwe data\-bronnen zijn overal beschikbaar: \textbf{NDW Maximumsnelheden (WKD)}, \textbf{OV-haltes GTFS} en \textbf{Natura 2000}. De map-UI is herontworpen met een verticale knoppenstrip linksonder, per-laag opaciteit-controle, en een \textbf{Luchtfoto Actueel 8cm HR} satellietkaart als achtergrond. Deze notitie demonstreert de drie hoogtepunt-lagen op Helmond en Apeldoorn.
\end{callout}

\clearpage

# 1. Productieomgeving

De Basis Stadstwin is bereikbaar op \href{https://basis-stadstwin.vercel.app}{\texttt{https://basis-stadstwin.vercel.app}}. Alle 342 Nederlandse gemeenten staan live, met twee tier-classificaties:

\begin{itemize}
  \item \textcolor{tierLokaal}{\textbf{Lokaal}} (6 steden) — landelijke baseline + provinciale + gemeentespecifieke GIS-lagen
  \item \textcolor{tierNationaal}{\textbf{Nationaal}} (336 steden) — alleen landelijke + provinciale datasets
\end{itemize}

Een oranje "✦ nieuw"-badge markeert steden die in mei 2026 door \texttt{/promote-city} zijn verwerkt: Helmond, Apeldoorn, Rotterdam, Tilburg, Amsterdam en Elburg. De badge verdwijnt automatisch 30 dagen na de promotie-datum.

![Landingspagina met de stedengrid. De groene Lokaal-pills springen visueel naar voren, de gedempte grijze Nationaal-pills wachten passief op activatie.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-landing.png){ width=100% }

\clearpage

# 2. Helmond — een Lokaal-stad

Helmond is een van de drie originele Lokaal-pilotsteden (sinds april 2026). De stad gebruikt **134 lagen** in totaal: de landelijke baseline van ~110 lagen, de Brabant-provinciale set van 3 lagen, plus ~20 Helmond-specifieke lagen via Open Data Helmond en Atlas Brabant.

![Helmond bij eerste opening. Linker zijbalk toont de 12 thematische categorieën — bodem, energie, gebouwen-infra, gezondheid, groen, mobiliteit, omgevingsfactoren, sociaal-economisch, veiligheid, verkeer-logistiek. Geen lagen actief.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-helmond-overview.png){ width=100% }

\clearpage

## 2.1 NDW Maximumsnelheden (WKD)

Een van de drie hoogtepunten van mei: de **NDW Wegkenmerken Database** is nu een standaard-laag voor alle 342 gemeenten. WKD levert maandelijks bijgewerkte maximumsnelheden per wegvak — als vector tiles, dus zonder client-side feature-cap. De kleur per wegvak is gekoppeld aan de toegestane snelheid: blauw 30, geel 50, oranje 70, rood 80+.

\begin{callout}
\textbf{Bron:} \texttt{maps.ndw.nu/api/v1/wkdSpeedLimits} (vector tile)\\
\textbf{Update-frequentie:} maandelijks\\
\textbf{Gebruikt door:} alle 342 gemeenten (landelijke baseline)
\end{callout}

![Helmond met Maximumsnelheden (WKD) actief. Het complete wegennet binnen de gemeentegrens kleurt naar maximumsnelheid — een snelle visuele check voor verkeersveiligheid en 30-zones.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-helmond-snelheden.png){ width=100% }

\clearpage

## 2.2 OV-haltes (OVapi GTFS)

De tweede mei-hoogtepunt-laag: een uniforme OV-haltes-feed gebaseerd op de **OVapi GTFS** dataset. Deze laag toont alle bus-, tram-, metro- en treinhaltes binnen de gemeentebbox in één weergave — zonder per-vervoerder afzonderlijke API-aanroepen. De backend op `/api/ov-haltes` filtert GTFS-stops met een ruimtelijke query, deduplicates op halte-naam, en levert GeoJSON terug.

\begin{callout}
\textbf{Bron:} OVapi GTFS via \texttt{/api/ov-haltes?city=<slug>}\\
\textbf{Modaliteiten:} bus, tram, metro, trein\\
\textbf{Aanvullende laag:} \emph{OV-haltes — Trein (NS/IFF)} voor alleen NS-stations
\end{callout}

![Helmond met OV-haltes-laag actief. Elk punt is één halte; klik op een punt voor halte-naam, modaliteit en lijnen die er stoppen. Bus-dichte gebieden zoals het stationsgebied vallen direct op.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-helmond-ovhaltes.png){ width=100% }

\clearpage

## 2.3 Natura 2000

De derde mei-hoogtepunt-laag: **Natura 2000** beschermde natuurgebieden via de PDOK WFS. Voor Helmond-omgeving zijn de relevante gebieden Strabrechtse Heide, Groote Peel en Deurnsche Peel — overlappend met de zuidoostelijke gemeentegrens. Belangrijk voor RO-projecten en stikstofbeoordelingen.

\begin{callout}
\textbf{Bron:} \texttt{service.pdok.nl/rvo/natura2000/wfs/v1\_0}\\
\textbf{Beheerder:} RVO (Rijksdienst voor Ondernemend Nederland)\\
\textbf{Update-frequentie:} jaarlijks (na ministeriële wijziging)
\end{callout}

![Helmond met Natura 2000-gebieden als groen vlakken-overlay. De Strabrechtse Heide-grens loopt aan de zuidoostkant van Helmond door — in beeld als het groene polygoon richting Geldrop.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-helmond-natura.png){ width=100% }

\clearpage

# 3. Apeldoorn — een Lokaal-stad

Apeldoorn is een van de drie originele Lokaal-pilotsteden, met **142 lagen** totaal. De Gelderland-provinciale set is rijk gevuld (13 echte lagen: zonneparken, recreatiezonering Veluwe, faunapassages, groen-blauwe dooradering, fijnstof PM10/PM2.5/NO₂ per buurt) bovenop de landelijke baseline en ~25 Apeldoorn-specifieke lagen via Staat van Apeldoorn.

![Apeldoorn bij eerste opening. Geen lagen actief — de stedelijke kern + Veluwe-uitlopers zichtbaar.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-apeldoorn-overview.png){ width=100% }

\clearpage

## 3.1 NDW Maximumsnelheden (WKD) — Apeldoorn

Apeldoorn heeft een uitgesproken contrast tussen 50-zones in de stedelijke kern en 30/60-zones op de Veluwerand. WKD-data laat dit duidelijk zien — handig voor verkeers\-monitoring en het vergelijken met geluidsmodellering of verkeers\-ongevallen-data uit BRON.

![Apeldoorn met Maximumsnelheden (WKD) actief. Het stedelijke wegennet kleurt op snelheidsregime; de groene corridors langs de Veluwe zijn snel herkenbaar als 60/80-zones.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-apeldoorn-snelheden.png){ width=100% }

\clearpage

## 3.2 OV-haltes — Apeldoorn

Apeldoorn heeft een dichter OV-netwerk dan Helmond door de NS-knoop op Apeldoorn Centraal en de regio-busverbindingen naar Deventer, Zwolle, Ede. Met de uniforme OV-haltes-laag is direct zichtbaar welke wijken OV-bediening hebben en welke achterblijven.

![Apeldoorn met OV-haltes (alle modaliteiten). Stations Centraal, De Maten, Apeldoorn Osseveld als grotere knopen herkenbaar; bushaltes vullen het straatraster.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-apeldoorn-ovhaltes.png){ width=100% }

\clearpage

## 3.3 Natura 2000 — Apeldoorn

Apeldoorn grenst direct aan de Veluwe — een van de grootste Natura 2000-gebieden van Nederland. Bijna de hele westelijke gemeentegrens is Natura 2000, met directe gevolgen voor stikstof- en RO-besluiten. De PDOK-laag visualiseert de exacte begrenzing.

\begin{callout}
\textbf{Praktijkimpact:} bouwprojecten in Apeldoorn-West vallen vrijwel altijd binnen de \emph{stikstofgevoelige zone} (afstand $<$ 2 km tot Natura 2000-grens). De laag laat dit in één oogopslag zien — geen losse PDF-kaarten meer nodig.
\end{callout}

![Apeldoorn met Natura 2000 als donkergroen vlakken-overlay. De Veluwe-grens loopt strak langs de westkant van de stad door (Kroondomeinen, Hoog Soeren, Beekbergerwoud).](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-apeldoorn-natura.png){ width=100% }

\clearpage

# 4. Satelliet-achtergrond — Luchtfoto Actueel 8cm HR

Naast de standaard CARTO-vector-basemaps is er een nieuwe set van **17 PDOK luchtfoto-basemaps** beschikbaar (RGB en infrarood, 2020–2026, 8 cm en 25 cm resolutie). De hoogste resolutie is **Luchtfoto Actueel 8cm HR (PDOK)** — uitstekend om data\-lagen te valideren tegen de fysieke werkelijkheid.

Praktijkvoorbeeld: Natura 2000-grenzen op de luchtfoto leggen meteen bloot waar de PDOK-polygoon afwijkt van de werkelijke vegetatiegrens (handig bij twijfel\-gevallen aan de rand). Hieronder Apeldoorn-Veluwe met Natura 2000-overlay op luchtfoto-achtergrond.

\begin{callout}
\textbf{Bron:} \texttt{service.pdok.nl/hwh/luchtfotorgb/wmts/v1\_0} laag \texttt{Actueel\_orthoHR}\\
\textbf{Resolutie:} 8 cm/pixel\\
\textbf{Bedekking:} heel Nederland, jaarlijkse update
\end{callout}

![Apeldoorn-Veluwe met Natura 2000 polygoon op luchtfoto-achtergrond. De donkergroene heide- en bostextuur op de luchtfoto valt samen met de Natura 2000-vlakgrens — visuele bevestiging van de polygoon-precisie.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-apeldoorn-satellite.png){ width=100% }

\clearpage

# 5. Nieuwe map-UI

De rechterbovenhoek heeft minder visuele clutter, en alle map-controls leven nu in één verticale strip linksonder boven de bestaande basemap-knop. Drie knoppen, allemaal pop-overs:

\begin{enumerate}
  \item \textbf{Laagdekking} (\texttt{Droplets}-icoon) — globale opaciteit-slider 0–100\%, in één keer toegepast op alle actieve datalagen.
  \item \textbf{Kleurmodus} (\texttt{PaintBucket}-icoon) — \emph{Eén kleur} of \emph{Op waarde}, als globale standaard.
  \item \textbf{Achtergrondkaart} (\texttt{MapIcon}) — bestaande basemap-picker met de 17 PDOK luchtfoto's en CARTO-vector-stijlen.
\end{enumerate}

Daarnaast: per laag in de zijbalk een \texttt{SlidersHorizontal}-icoon dat een inline pop-over opent met een per-laag opaciteit-slider én per-laag kleurmodus-toggle. Globale × per-laag opaciteit wordt vermenigvuldigd, zodat snelle finetuning van één laag mogelijk is zonder het globaal niveau te raken.

![Nieuwe verticale knoppenstrip linksonder. De opaciteit-popover (Droplets) staat hier open. Daaronder de kleurmodus-knop (PaintBucket) en de basemap-knop (MapIcon). De rechterbovenhoek toont alleen nog het laag-aantal.](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-mapcontrols.png){ width=100% }

\clearpage

# 6. Dekking-overzichtspagina

Nieuwe sectie onder \texttt{/dekking}: een cross-city overzicht van alle 342 gemeenten met laag-aantallen en API-koppelingen. Voor elke stad: tier (Lokaal/Nationaal), aantal beschikbare lagen, aantal stub-lagen (in catalogus aanwezig maar geen data voor die specifieke stad), en totaal.

Daaronder een **systeem-sectie** met API-koppeling-statistieken:

\begin{itemize}
  \item \textbf{Unieke koppelingen} — distincte combinaties van bron × host (PDOK-WFS gebruikt door 342 gemeenten = 1 koppeling)
  \item \textbf{Unieke databronnen} — bv. PDOK, CBS, NDW, RVO, gemeentelijk
  \item \textbf{Unieke hosts} — distincte API-domeinen
  \item \textbf{Laagverbindingen totaal} — som van alle stad × laag-paren ($\approx$ 39.665)
\end{itemize}

![Dekking-overzicht: stedentabel met sortering en filter (boven), systeemstatistieken met vier stat-cards (midden), per-bron uitsplitsing (onder).](/Users/robbertjanssen/Documents/dev/zwolle/.tmp/v2-dekking-overview.png){ width=100% }

\clearpage

# 7. Mei-overzicht

Wijzigingen die in mei 2026 zijn opgeleverd, gegroepeerd naar thema:

## 7.1 Nieuwe Lokaal-steden

Drie steden zijn van Nationaal naar Lokaal gepromoveerd via een geautomatiseerde \texttt{/promote-city}-batch:

\begin{itemize}
  \item \textbf{Rotterdam} — +15 live lagen via \texttt{services.arcgis.com/zP1tGdLpGvt2qNJ6} (700+ services beschikbaar). Hittestress, koele verblijfsplekken, bodemdaling, grondwaterstanden, fundering, gasvervanging, monumentale bomen, laadpalen, metro-/tram-infrastructuur, fietspaden, maximumsnelheden.
  \item \textbf{Tilburg} — +21 live lagen via \texttt{services-eu1.arcgis.com/CQPBPtVdeDfydflM}. Bodemkwaliteit, milieuzone, fietsenstallingen, snelfietsroutes, betaald-parkerenzones, geluidsprognose 2030, hoogspanning, kunst in de openbare ruimte.
  \item \textbf{Amsterdam} — +17 lagen na recovery van een mid-batch geannuleerde agent. Via \texttt{api.data.amsterdam.nl}.
\end{itemize}

Helmond en Elburg liepen ook door de batch maar zijn geskipt — hun open-data ArcGIS heeft enkel gearchiveerde data of geen publiek portaal. Beide hebben wel een log-entry in \texttt{promote-log/} en een "✦ nieuw"-badge gekregen.

## 7.2 Nieuwe nationale datalagen

\begin{itemize}
  \item \textbf{NDW Wegkenmerken (WKD) — Maximumsnelheden} — vector tile, alle 342 gemeenten (sectie 2.1 / 3.1)
  \item \textbf{OVapi GTFS — OV-haltes} — alle modaliteiten + alleen-trein variant (sectie 2.2 / 3.2)
  \item \textbf{PDOK RVO — Natura 2000} — beschermde natuurgebieden (sectie 2.3 / 3.3)
  \item \textbf{17 PDOK luchtfoto-basemaps} — RGB en IR, 2020–2026, 8/25 cm (sectie 4)
  \item \textbf{NDW BRON Verkeersongevallen} — totaal / met letsel / dodelijk / met voetganger
  \item \textbf{RIVM Windturbinegeluid Lden 2024} — per buurt
  \item \textbf{BZK Leefbaarometer 3.1} — per buurt, peiljaar 2024
\end{itemize}

## 7.3 Provinciale module Utrecht

\texttt{provincial/utrecht.ts} ging van stub naar **11 echte lagen** via \texttt{gis.provincie-utrecht.nl}: geomorfologie, bodemkwaliteit, WKO-grondwateronttrekkingen, NNN-natuurnetwerk, groene contour, cumulatief geluid (WHO), NO\textsubscript{2}, PM10, overstromings\-gevoelige gebieden, bushalte-buffers. Profiteert iedere Utrechtse gemeente, niet alleen Amersfoort.

## 7.4 Map-UI redesign

\begin{itemize}
  \item Top-right kleurmodus-segment verwijderd
  \item Bottom-left verticale knoppenstrip toegevoegd: opaciteit / kleur / basemap
  \item Per-laag \texttt{SlidersHorizontal}-popover met opaciteit-slider en kleurmodus-toggle (sectie 5)
  \item Sidebar's globale "Standaardkleur"-toggle verwijderd
  \item Nationaal-badge gedempt naar grijs, Lokaal-badge blijft groen, "✦ nieuw" oranje (sectie 1)
\end{itemize}

## 7.5 Cross-city Dekking-overzicht

Nieuwe \texttt{/dekking} pagina met stedentabel + API-koppeling-statistieken (sectie 6). Iedere stadsnaam linkt door naar de bestaande per-stad \texttt{/[city]/dekking}-detailpagina.

\clearpage

# 8. Bug fixes

\begin{itemize}
  \item \textbf{PDOK BAG/BGT 1.000-feature cap} — paginatielogica gefixt; voor Zwolle bbox: 995 → 49.847 features.
  \item \textbf{Auto-bucket kleurde op verkeerde kolom} — \texttt{bucketProperty} expliciet ingesteld voor 15 lagen (CBS PC4, RIVM windturbinegeluid, BZK Leefbaarometer).
  \item \textbf{HTTP-header crash op Unicode} — laagnamen met en-dash of subscript crashten Node; \texttt{encodeURIComponent} toegevoegd.
\end{itemize}

# 9. Nog te doen

\begin{itemize}
  \item Provinciale modules voor de overige 7 provincies (Drenthe, Flevoland, Friesland, Groningen, Limburg, Noord-Holland, Zeeland)
  \item Zuid-Holland portaal vereist token — alternatief portaal of API-key-flow nodig
  \item Per-laag opaciteit persisteren in URL state zodat shareable links de view exact reproduceren
  \item Overzicht-pagina voor recent gepromote steden (nu alleen via "✦ nieuw"-badge)
\end{itemize}

\vfill

\begin{center}
\rule{8cm}{0.4pt}\\[0.5em]
\textit{Gegenereerd 8 mei 2026 · screenshots via Chrome DevTools MCP op localhost dev-build (productie: \href{https://basis-stadstwin.vercel.app}{basis-stadstwin.vercel.app}) · 12 figuren · DMI · Ecosysteem stijl}
\end{center}
