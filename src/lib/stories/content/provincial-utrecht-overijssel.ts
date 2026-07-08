/**
 * Story maps — provinciale lagen Utrecht & Overijssel.
 *
 * Utrecht (ut-prov-*): ArcGIS REST van Provincie Utrecht — bodem & ondergrond,
 * groen & ecologie, omgevingsfactoren (geluid/lucht), veiligheid en OV-bereik.
 * Overijssel (ov-*): Geoportaal Overijssel WFS — wegennet (NWB), gas/groengas-
 * tankstations en provinciale vaarwegen.
 *
 * Alle grafieken gebruiken uitsluitend geverifieerde feature-properties
 * (uit de laagcode of een live endpoint-sample, mei/juli 2026).
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  // ─── UTRECHT · BODEM & ONDERGROND ──────────────────────────────────────────
  {
    layerId: "ut-prov-geomorfologie",
    title: "Geomorfologie in en rond {city}",
    subtitle:
      "Landvormen van de Geomorfologische Kaart 1:50.000 (BRO) — dekzandruggen, stuifzanden, rivier- en beekdalen",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} geomorfologische vlakken** geladen uit de Geomorfologische Kaart 1:50.000, ontsloten door de Provincie Utrecht. Elk vlak is een stukje landschap met een eigen ontstaanswijze en reliëfvorm — van dekzandruggen en landduinen tot dalvormige laagten en droogdalen. Klik op een vlak voor de omschrijving en de bijbehorende legenda-eenheid.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Landvormen in beeld", type: "count" },
          {
            label: "Verschillende vormtypen",
            type: "distinct",
            property: "omschrijving",
          },
          {
            label: "Met actief vormingsproces",
            type: "count-where",
            property: "active_process",
            equals: "ja",
          },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Landvormen per type in {city}",
        description:
          "Veld omschrijving: de geomorfologische eenheid volgens de landelijke legenda",
        property: "omschrijving",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De geomorfologische kaart beschrijft de *vorm* van het landschap en hoe die is ontstaan — niet de bodemsoort zelf, maar het reliëf en het proces erachter. Een **dekzandrug** is bijvoorbeeld door de wind afgezet in de laatste ijstijd, een **dalvormige laagte** of **droogdal** is door water uitgesleten, en *open water en waterlopen van geomorfologisch belang* markeert beken en rivierlopen. Het veld *active_process* geeft aan of de vorm nog steeds wordt gevormd (bijvoorbeeld stuivend zand) of dat het een fossiel, afgerond landschapselement is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ondergrond en water**: landvormen bepalen mede hoe water infiltreert en afstroomt; dekzandruggen zijn droog en hoog, laagten juist nat.\n- **Archeologie en cultuurhistorie**: hogere, droge ruggen waren van oudsher aantrekkelijk om te wonen — de kaart is een eerste indicatie voor archeologische verwachtingswaarde.\n- **Ruimtelijke inpassing**: bij natuurontwikkeling, waterberging en bouwlocaties helpt de landvorm om ingrepen op het natuurlijke reliëf af te stemmen.",
      },
      {
        heading: "Over de bron",
        body: "De kaart komt uit de Basisregistratie Ondergrond (BRO) en wordt door de Provincie Utrecht via ArcGIS ontsloten. De statistieken gaan over de kaartuitsnede van {city}; vlakken die de rand kruisen tellen mee met hun volledige geregistreerde oppervlakte, waardoor de totale oppervlakte iets kan afwijken van het gebied binnen de gemeentegrens.",
      },
    ],
    links: [
      {
        label: "Legenda geomorfologie (WUR)",
        url: "https://legendageomorfologie.wur.nl/",
      },
      {
        label: "BRO — Basisregistratie Ondergrond",
        url: "https://basisregistratieondergrond.nl/",
      },
    ],
  },
  {
    layerId: "ut-prov-bodemkwaliteit",
    title: "Bodemkwaliteitszones in en rond {city}",
    subtitle:
      "Bodemfunctieklassen uit de Utrechtse bodemkwaliteitskaart — de basis voor grondverzet",
    intro:
      "Deze laag toont **{count} bodemkwaliteitsvlakken** binnen het kaartgebied van {city}, afkomstig uit de Tygron-basisdata van de Provincie Utrecht. Elk vlak is ingedeeld naar bodemfunctie (wonen, industrie, landbouw/natuur, water of wegen), wat samen met de gemeten bodemkwaliteit bepaalt of en hoe grond kan worden hergebruikt. De kaart heeft niet overal in de provincie dekking; waar {city} buiten de gekarteerde zones valt, blijft de kaart hier leeg.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          {
            label: "Verschillende functies",
            type: "distinct",
            property: "functie",
          },
          {
            label: "Functie industrie",
            type: "count-where",
            property: "industrie",
            equals: "1",
          },
          {
            label: "Functie wonen",
            type: "count-where",
            property: "wonen",
            equals: "1",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemfunctie per vlak in {city}",
        description:
          "Veld functie: de toegekende bodemfunctieklasse van elk vlak",
        property: "functie",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De bodemkwaliteitskaart deelt het gebied op in **bodemfunctieklassen**. Die klasse geeft aan waarvoor de grond bestemd is en welke kwaliteitseisen er gelden: grond met een woonfunctie moet schoner zijn dan grond met een industriefunctie. Bij grondverzet — het afgraven en elders toepassen van grond — bepaalt de combinatie van herkomst- en ontvangstklasse of dat zonder aanvullend onderzoek mag. De vlakken *wonen*, *industrie*, *landb_nat*, *water* en *wegen* zijn de indicatorvelden per functie.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Grondverzet en hergebruik**: de kaart is het wettelijke vertrekpunt om te bepalen of vrijkomende grond binnen de gemeente kan worden hergebruikt.\n- **Kostenbeheersing**: functieklassen voorkomen onnodig (duur) laboratoriumonderzoek bij standaardsituaties.\n- **Gezondheid en veiligheid**: strengere eisen bij woon- en moestuinfuncties beschermen bewoners tegen blootstelling aan bodemverontreiniging.",
      },
      {
        heading: "Over de bron en dekking",
        body: "De vlakken komen uit de Tygron-basisdata van de Provincie Utrecht (ArcGIS). Let op: de bodemkwaliteitskaart is een *zoneringskaart*, geen puntmeting — binnen één vlak geldt één functieklasse als gemiddelde. Niet elke gemeente-uitsnede is volledig gekarteerd; ontbreekt de laag hier, raadpleeg dan de gemeentelijke bodemloketten voor de actuele situatie.",
      },
    ],
    links: [
      {
        label: "Provincie Utrecht — bodem & ondergrond",
        url: "https://www.provincie-utrecht.nl/onderwerpen/bodem-en-ondergrond",
      },
      { label: "Landelijk Bodemloket", url: "https://www.bodemloket.nl/" },
    ],
  },
  {
    layerId: "ut-prov-wko-grondwater",
    title: "Warmte-koudeopslag (WKO) in en rond {city}",
    subtitle:
      "Vergunde en gemelde grondwateronttrekkingen voor bodemenergie in de provincie Utrecht",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} WKO-punten**: locaties waar grondwater wordt onttrokken en teruggebracht voor warmte-koudeopslag, de meest gebruikte vorm van bodemenergie. Elk punt heeft een status (vergund of gemeld), een systeemtype en een vergund debiet. Klik op een punt voor het watervoerende pakket en de onttrekkingsgegevens.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "WKO-punten in beeld", type: "count" },
          {
            label: "Verschillende systemen",
            type: "distinct",
            property: "systeem",
          },
          {
            label: "Vergund",
            type: "count-where",
            property: "legenda",
            equals: "vergund",
          },
          {
            label: "Gemeld",
            type: "count-where",
            property: "legenda",
            equals: "gemeld",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Status van WKO-punten in {city}",
        description:
          "Veld legenda: vergunde installaties versus (kleinere) gemelde installaties",
        property: "legenda",
      },
      {
        kind: "category-bar",
        title: "Type onttrekking / brontype in {city}",
        description:
          "Veld bron: onder meer koude bronnen (K), warme bronnen (W), monobronnen en (in)filtratie",
        property: "bron",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een **WKO-systeem** slaat 's zomers warmte en 's winters koude op in het grondwater om gebouwen energiezuinig te verwarmen en te koelen. Open systemen werken met aparte **koude bronnen** (*K*) en **warme bronnen** (*W*), soms gecombineerd in een **monobron** waarin beide functies boven elkaar zitten. Grote installaties zijn **vergund** door de provincie; kleinere gesloten of gemelde systemen staan als **gemeld** in de registratie. Het *vergund debiet* (m³/uur en m³/jaar) begrenst hoeveel grondwater rondgepompt mag worden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energietransitie**: WKO is een sleuteltechniek om wijken van het aardgas te halen; de dichtheid van bestaande systemen laat zien waar de ondergrond al benut wordt.\n- **Ordening van de ondergrond**: bronnen mogen elkaar niet 'wegkoelen'; de provincie stuurt op interferentie en op bodemenergieplannen in drukke gebieden.\n- **Grondwaterbescherming**: rond drinkwaterwinningen en kwetsbare pakketten gelden extra voorwaarden — de puntenkaart is daarvoor het vertrekpunt.",
      },
      {
        heading: "Over de bron",
        body: "De punten komen uit de Tygron-basisdata van de Provincie Utrecht (ArcGIS) en combineren vergunde en gemelde onttrekkingen. De aantallen gaan over de kaartuitsnede van {city}; net buiten de uitsnede gelegen systemen tellen niet mee. Voor de juridisch geldende situatie is het provinciale vergunningenregister leidend.",
      },
    ],
    links: [
      {
        label: "Provincie Utrecht — bodemenergie & WKO",
        url: "https://www.provincie-utrecht.nl/onderwerpen/bodem-en-ondergrond/bodemenergie",
      },
      {
        label: "RVO — bodemenergie",
        url: "https://www.rvo.nl/onderwerpen/bodemenergie",
      },
    ],
  },
  // ─── UTRECHT · GROEN & ECOLOGIE ────────────────────────────────────────────
  {
    layerId: "ut-prov-nnn",
    title: "Natuurnetwerk Nederland in en rond {city}",
    subtitle:
      "NNN-gebieden uit de Omgevingsverordening van de Provincie Utrecht — het beschermde natuurnetwerk",
    intro:
      "Deze laag toont **{count} NNN-vlakken** binnen het kaartgebied van {city}: gebieden die in de Omgevingsverordening van de Provincie Utrecht zijn aangewezen als **Natuurnetwerk Nederland**. Het NNN is het samenhangende stelsel van beschermde natuurgebieden en verbindingen daartussen. Klik op een vlak voor de juridische identificatie en de verwijzing naar de regels op de kaart.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "NNN-vlakken in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde vlakgrootte",
            type: "avg",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Grootste vlak",
            type: "max",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Grootteverdeling van NNN-vlakken in {city}",
        description:
          "Aantal natuurvlakken per oppervlakteklasse — veel kleine snippers of een paar grote kerngebieden?",
        property: "st_area(shape)",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het **Natuurnetwerk Nederland** (voorheen de Ecologische Hoofdstructuur) verbindt bestaande natuurgebieden tot één robuust netwerk, zodat planten en dieren zich kunnen verplaatsen. Binnen het NNN geldt een strikt beschermingsregime: ontwikkelingen die de wezenlijke kenmerken en waarden aantasten zijn in principe niet toegestaan (het 'nee, tenzij'-principe). De vlakken op deze kaart zijn de exacte begrenzing zoals vastgelegd in de provinciale Omgevingsverordening.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toetsingskader**: elk ruimtelijk plan nabij of binnen het NNN moet aan het beschermingsregime worden getoetst.\n- **Natuurdoelen**: het netwerk is de ruggengraat van het provinciale natuur- en biodiversiteitsbeleid en van de stikstofaanpak.\n- **Groen-blauwe dooradering**: de ligging van NNN-vlakken helpt bij het plannen van recreatieroutes, waterberging en klimaatadaptatie in het buitengebied.",
      },
      {
        heading: "Over de bron",
        body: "De vlakken komen uit de dataset IKN/WFS van de Provincie Utrecht en zijn een directe weergave van de Omgevingsverordening. De statistieken gaan over de kaartuitsnede van {city}; grote aaneengesloten natuurgebieden kunnen deels buiten de uitsnede vallen, waardoor de getoonde oppervlakte een ondergrens is voor het volledige gebied.",
      },
    ],
    links: [
      {
        label: "Omgevingsverordening Utrecht — regels op de kaart",
        url: "https://omgevingswet.overheid.nl/regels-op-de-kaart/",
      },
      {
        label: "Provincie Utrecht — natuur",
        url: "https://www.provincie-utrecht.nl/onderwerpen/natuur",
      },
    ],
  },
  {
    layerId: "ut-prov-groene-contour",
    title: "Groene Contour in en rond {city}",
    subtitle:
      "Overgangszones rond het Natuurnetwerk Nederland — kansrijke plekken voor nieuwe natuur",
    intro:
      "Deze laag toont **{count} vlakken** van de **Groene Contour** binnen het kaartgebied van {city}: overgangszones rondom het Natuurnetwerk Nederland waar de provincie nieuwe natuur en verbindingen wil laten ontstaan. Anders dan het NNN zelf is dit geen bestaande natuur, maar begrensd gebied met natuurpotentie. Klik op een vlak voor de identificatie en de bijbehorende regels.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Contourvlakken in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde vlakgrootte",
            type: "avg",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Grootste vlak",
            type: "max",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Grootteverdeling van Groene-Contourvlakken in {city}",
        description:
          "Aantal overgangszones per oppervlakteklasse",
        property: "st_area(shape)",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De **Groene Contour** is de zone waarbinnen de Provincie Utrecht op vrijwillige basis natuur wil toevoegen om het Natuurnetwerk te versterken en te verbinden. Zolang de natuur er nog niet is gerealiseerd blijft het bestaande (vaak agrarische) gebruik toegestaan, maar de provincie stimuleert omvorming naar natuur — bijvoorbeeld via subsidies of grondruil. Het is dus een *ontwikkelopgave*, geen bescherming van wat er al staat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verbindingszones**: de contour vult de gaten in het natuurnetwerk en maakt het robuuster tegen versnippering.\n- **Kansen voor gemeenten**: hier liggen mogelijkheden om natuur, recreatie en klimaatadaptatie te koppelen aan gebiedsontwikkeling.\n- **Grondbeleid**: de begrenzing helpt bij het richten van grondaankopen, functieverandering en compensatieopgaven.",
      },
      {
        heading: "Over de bron",
        body: "De vlakken komen uit de dataset IKN/WFS van de Provincie Utrecht en volgen de Omgevingsverordening. De cijfers gaan over de kaartuitsnede van {city}; contourzones lopen vaak door tot in buurgemeenten, dus de getoonde oppervlakte betreft alleen het deel binnen deze uitsnede.",
      },
    ],
    links: [
      {
        label: "Omgevingsverordening Utrecht — regels op de kaart",
        url: "https://omgevingswet.overheid.nl/regels-op-de-kaart/",
      },
      {
        label: "Provincie Utrecht — natuur",
        url: "https://www.provincie-utrecht.nl/onderwerpen/natuur",
      },
    ],
  },
  {
    layerId: "ut-prov-tygron-nnn",
    title: "Natuurnetwerk (Tygron-basiskaart) in en rond {city}",
    subtitle:
      "NNN-vlakken uit de Tygron-basisdata — de natuurlaag voor gebieds- en ontwerpmodellen",
    intro:
      "Deze laag toont **{count} natuurvlakken** binnen het kaartgebied van {city}, afkomstig uit de **Tygron-basisdata** van de Provincie Utrecht. Het is een tweede weergave van het Natuurnetwerk Nederland, geoptimaliseerd voor gebruik in Tygron-gebiedsmodellen en ruimtelijke simulaties. Klik op een vlak voor de oppervlakte en de natuurnetwerk-markering.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Natuurvlakken in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde vlakgrootte",
            type: "avg",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Grootste vlak",
            type: "max",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Grootteverdeling van natuurvlakken in {city}",
        description:
          "Aantal vlakken per oppervlakteklasse — versnippering versus aaneengesloten natuur",
        property: "st_area(shape)",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Deze laag bevat dezelfde natuurgebieden als de NNN-laag, maar dan als onderdeel van de **Tygron-basisdata**: een samenhangende set basiskaarten die de provincie gebruikt in digitale gebiedsmodellen. Het veld *natuurnetwerk_nederland* markeert elk vlak als onderdeel van het netwerk. Voor het juridische toetsingskader is de reguliere NNN-laag (uit de Omgevingsverordening) leidend; deze Tygron-variant is vooral handig voor analyse en visualisatie.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Modelmatige analyses**: de Tygron-laag sluit aan op simulaties van water, hitte, stikstof en ruimtegebruik.\n- **Snelle oppervlaktecijfers**: handig om in één oogopslag te zien hoeveel natuur er binnen een projectgebied ligt.\n- **Consistentie**: door dezelfde basiskaart te gebruiken als de provincie voorkom je afwijkingen tussen analyses.",
      },
      {
        heading: "Over de bron",
        body: "De vlakken komen uit de Tygron-basisdata van de Provincie Utrecht (ArcGIS). De cijfers gaan over de kaartuitsnede van {city}. Omdat dit een afgeleide, voor modellen geoptimaliseerde laag is, kunnen de begrenzingen minimaal afwijken van de officiële NNN-laag.",
      },
    ],
    links: [
      {
        label: "Provincie Utrecht — natuur",
        url: "https://www.provincie-utrecht.nl/onderwerpen/natuur",
      },
      { label: "Tygron", url: "https://www.tygron.com/nl/" },
    ],
  },
  // ─── UTRECHT · OMGEVINGSFACTOREN ───────────────────────────────────────────
  {
    layerId: "ut-prov-geluid-cumulatief",
    title: "Cumulatieve geluidbelasting in en rond {city}",
    subtitle:
      "Gestapelde geluidbelasting (Lden) van alle bronnen samen, in WHO-klassen",
    intro:
      "Deze laag kleurt **{count} geluidvlakken** binnen het kaartgebied van {city} op de **gecumuleerde geluidbelasting**: het geluid van weg-, spoor- en industriebronnen bij elkaar opgeteld, uitgedrukt in de etmaalmaat Lden en ingedeeld in klassen die aansluiten op de gezondheidsadviezen van de WHO. Donkerder betekent een hogere blootstelling. Klik op een vlak voor de klasse.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Geluidvlakken in beeld", type: "count" },
          {
            label: "Verschillende klassen",
            type: "distinct",
            property: "gel_cum_klasse",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Geluidklassen in {city}",
        description:
          "Veld gel_cum_klasse: de gecumuleerde Lden-klasse (ruwe codering uit de bron; hogere waarden = hogere belasting)",
        property: "gel_cum_klasse",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Waar losse geluidkaarten alleen naar één bron kijken (bijvoorbeeld alleen de snelweg), telt deze **cumulatieve** kaart alle bronnen bij elkaar op. Dat sluit aan op hoe mensen geluid werkelijk ervaren: naast een drukke weg én een spoorlijn stapelt de hinder zich op. De klassen zijn geënt op de **WHO-richtlijnen**, die lagere grenswaarden hanteren dan de wettelijke normen omdat ze uitgaan van gezondheidseffecten zoals slaapverstoring en hart- en vaatziekten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezonde leefomgeving**: cumulatief geluid is een kernindicator in de Omgevingswet; bij nieuwe woningen moet de totale geluidsituatie worden meegewogen.\n- **Prioritering**: de kaart laat zien waar meerdere bronnen samenkomen — precies de plekken waar bronmaatregelen of geluidsschermen het meeste opleveren.\n- **Communicatie**: één cumulatief beeld is voor bewoners begrijpelijker dan losse bronkaarten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De vlakken komen uit de Tygron-basisdata van de Provincie Utrecht (ArcGIS). De klasse-codering is zoals de bron die levert; gebruik de kaart als **indicatief** beeld, niet als juridische geluidberekening voor een concrete situatie. De cijfers gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "WHO — Environmental Noise Guidelines",
        url: "https://www.who.int/europe/publications/i/item/9789289053563",
      },
      {
        label: "Provincie Utrecht — geluid",
        url: "https://www.provincie-utrecht.nl/onderwerpen/geluid",
      },
    ],
  },
  {
    layerId: "ut-prov-no2",
    title: "Luchtkwaliteit NO₂ in en rond {city}",
    subtitle:
      "Stikstofdioxide-concentraties per klasse (µg/m³) in de provincie Utrecht",
    intro:
      "Deze laag kleurt **{count} vlakken** binnen het kaartgebied van {city} op de gemodelleerde jaargemiddelde concentratie **stikstofdioxide (NO₂)**, ingedeeld in klassen van enkele µg/m³. NO₂ komt vooral uit verkeer en verbranding; de concentratie is daardoor het hoogst langs drukke wegen. Klik op een vlak voor de concentratieklasse.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "NO₂-vlakken in beeld", type: "count" },
          {
            label: "Verschillende klassen",
            type: "distinct",
            property: "klasse",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "NO₂-concentratieklassen in {city}",
        description:
          "Veld klasse: jaargemiddelde NO₂ in µg/m³ (van <10 tot de hoogste klassen)",
        property: "klasse",
        maxCategories: 12,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een concentratieklasse voor **stikstofdioxide**, een gas dat vrijkomt bij verbranding — vooral in uitlaatgassen van auto's en vrachtwagens. De klassen lopen van *<10* µg/m³ (schone lucht) tot de hoogste waarden langs snelwegen en drukke stedelijke assen. De Europese grenswaarde voor het jaargemiddelde ligt op 40 µg/m³; de WHO adviseert sinds 2021 een veel strengere waarde van 10 µg/m³.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: NO₂ is een directe indicator voor verkeersgerelateerde luchtvervuiling en hangt samen met luchtwegklachten.\n- **Schone Lucht Akkoord**: gemeenten en provincies werken toe naar de WHO-advieswaarden; deze kaart laat zien waar de opgave het grootst is.\n- **Ruimtelijke afweging**: bij gevoelige bestemmingen (scholen, zorg, woningen) langs drukke wegen is de NO₂-belasting een belangrijk aandachtspunt.",
      },
      {
        heading: "Over de bron",
        body: "De vlakken komen uit de Tygron-basisdata van de Provincie Utrecht (ArcGIS) en zijn gebaseerd op modelberekeningen, niet op meetstations. Gebruik de kaart als gebiedsdekkend, indicatief beeld. De cijfers gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "RIVM — luchtkwaliteit (NO₂)",
        url: "https://www.rivm.nl/stikstof/stikstofdioxide",
      },
      {
        label: "Schone Lucht Akkoord",
        url: "https://www.schoneluchtakkoord.nl/",
      },
    ],
  },
  {
    layerId: "ut-prov-pm10",
    title: "Luchtkwaliteit PM10 in en rond {city}",
    subtitle:
      "Fijnstof (PM10) concentraties per klasse (µg/m³) in de provincie Utrecht",
    intro:
      "Deze laag kleurt **{count} vlakken** binnen het kaartgebied van {city} op de gemodelleerde jaargemiddelde concentratie **fijnstof PM10** — deeltjes kleiner dan 10 micrometer — ingedeeld in klassen van enkele µg/m³. PM10 komt van verkeer, industrie, landbouw en houtstook, met ook een flinke aangevoerde achtergrondbijdrage. Klik op een vlak voor de concentratieklasse.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PM10-vlakken in beeld", type: "count" },
          {
            label: "Verschillende klassen",
            type: "distinct",
            property: "klasse",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "PM10-concentratieklassen in {city}",
        description:
          "Veld klasse: jaargemiddelde PM10 in µg/m³ (klassen zoals 12-14, 14-16, …)",
        property: "klasse",
        maxCategories: 12,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een concentratieklasse voor **fijnstof PM10**. Anders dan NO₂ is fijnstof veel gelijkmatiger over een gebied verdeeld: een groot deel is *achtergrondconcentratie* die van elders wordt aangevoerd, waar lokaal weinig aan te doen is. Lokale bronnen als verkeer, veehouderij en houtkachels leggen daar bovenop een extra bijdrage. De Europese grenswaarde voor het jaargemiddelde is 40 µg/m³; de WHO adviseert 15 µg/m³.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: fijnstof is landelijk een van de grootste milieugerelateerde gezondheidsrisico's; er is geen veilige ondergrens.\n- **Bronbeleid**: omdat de achtergrond hoog is, telt elke lokale bron — van houtstook tot stallen — extra mee.\n- **Monitoring**: de kaart helpt bij het volgen van de voortgang richting de WHO-advieswaarden.",
      },
      {
        heading: "Over de bron",
        body: "De vlakken komen uit de Tygron-basisdata van de Provincie Utrecht (ArcGIS), gebaseerd op modelberekeningen. Gebruik de kaart als gebiedsdekkend, indicatief beeld en niet als exacte meetwaarde. De cijfers gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "RIVM — fijnstof (PM10/PM2.5)",
        url: "https://www.rivm.nl/fijn-stof",
      },
      {
        label: "Schone Lucht Akkoord",
        url: "https://www.schoneluchtakkoord.nl/",
      },
    ],
  },
  // ─── UTRECHT · VEILIGHEID ──────────────────────────────────────────────────
  {
    layerId: "ut-prov-overstroombaar",
    title: "Overstroombaar gebied in en rond {city}",
    subtitle:
      "Zones die bij falen van waterkeringen kunnen overstromen, provincie Utrecht",
    intro:
      "Deze laag toont **{count} vlakken** binnen het kaartgebied van {city} die als **overstroombaar** zijn aangemerkt: gebieden die bij een doorbraak of overslag van waterkeringen onder water kunnen komen te staan. Het is een grofmazige risicokaart die laat zien welke delen van {city} binnen de invloedssfeer van het watersysteem liggen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Overstroombare vlakken in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Grootste vlak",
            type: "max",
            property: "st_area(shape)",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Nederland ligt grotendeels achter dijken; grote delen van het land zijn in theorie **overstroombaar** als een kering het begeeft. Deze laag begrenst die zones op provinciaal niveau. Het zegt níét dat een overstroming waarschijnlijk is — de kans is dankzij de keringen klein — maar het laat zien wáár de gevolgen zouden neerslaan. Vaak bestaat de laag uit enkele zeer grote, aaneengesloten vlakken; de totale oppervlakte is daardoor een globale maat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Waterrobuust bouwen**: de Omgevingswet vraagt om overstromingsrisico's mee te wegen bij nieuwe ontwikkelingen — ophogen, vluchtroutes, nooddrainage.\n- **Vitale functies**: ziekenhuizen, energievoorziening en hoofdinfrastructuur in overstroombaar gebied verdienen extra aandacht.\n- **Risicocommunicatie**: de kaart is een basis om bewoners te informeren over wat te doen bij hoogwater.",
      },
      {
        heading: "Over de bron",
        body: "De vlakken komen uit de Tygron-basisdata van de Provincie Utrecht (ArcGIS). Voor gedetailleerde overstromingsdieptes en -kansen is de **Landelijke Risicokaart** en het Landelijk Informatiesysteem Water en Overstromingen (LIWO) de aangewezen bron. De cijfers gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Overstroomik.nl — risico op jouw locatie",
        url: "https://www.overstroomik.nl/",
      },
      {
        label: "Risicokaart Nederland",
        url: "https://www.risicokaart.nl/",
      },
    ],
  },
  // ─── UTRECHT · MOBILITEITSDIENSTEN ─────────────────────────────────────────
  {
    layerId: "ut-prov-bushalte-buffer",
    title: "Bereik van bushaltes in en rond {city}",
    subtitle:
      "Loopcirkels van 400 meter rond bushaltes — indicatie van OV-bereikbaarheid",
    intro:
      "Deze laag toont **{count} buffervlakken** binnen het kaartgebied van {city}: cirkels van **400 meter** rond elke bushalte in de provincie Utrecht. Alles binnen zo'n vlak ligt op comfortabele loopafstand van een bushalte; gebieden erbuiten zijn voor de bus afhankelijk van fiets, auto of langere loopafstanden. Zo zie je in één beeld welke delen van {city} goed door de bus worden ontsloten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Loopcirkels in beeld", type: "count" },
          {
            label: "Loopafstand per cirkel",
            type: "max",
            property: "distance_to_bushalte",
            unit: "m",
            decimals: 0,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een **loopcirkel van 400 meter** rondom een bushalte — de afstand die als vuistregel geldt voor een aanvaardbare loopafstand tot stads- en streekbussen (voor treinstations wordt vaak een ruimere norm gehanteerd). Waar cirkels elkaar overlappen is de haltedichtheid hoog; witte plekken op de kaart zijn gebieden buiten comfortabele loopafstand van het busnetwerk. Het veld *distance_to_bushalte* bevestigt de gehanteerde straal.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **OV-bereikbaarheid**: de dekkingsgraad is een directe maat voor hoe goed wijken zonder auto ontsloten zijn.\n- **Woningbouw**: bij nieuwe wijken is nabijheid van een halte een criterium om autoafhankelijkheid te beperken.\n- **Netwerkkeuzes**: witte plekken maken zichtbaar waar een nieuwe halte, buurtbus of hubvoorziening het meeste toevoegt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De buffers komen uit de Tygron-basisdata van de Provincie Utrecht (ArcGIS). Het zijn **hemelsbrede** cirkels: de werkelijke loopafstand via straten en oversteken is altijd wat langer, en barrières als spoorlijnen of water worden niet meegewogen. Gebruik de kaart daarom als indicatief bereik. De cijfers gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Provincie Utrecht — openbaar vervoer",
        url: "https://www.provincie-utrecht.nl/onderwerpen/openbaar-vervoer",
      },
      { label: "U-OV / Regio Utrecht (reisinformatie)", url: "https://www.u-ov.info/" },
    ],
  },
  // ─── OVERIJSSEL ────────────────────────────────────────────────────────────
  {
    layerId: "ov-fietsnetwerk",
    title: "Wegennetwerk (NWB) in en rond {city}",
    subtitle:
      "Hartlijnen van alle wegen uit het Nationaal Wegenbestand, filiaal Overijssel",
    intro:
      "Deze laag tekent **{count} wegvakken** binnen het kaartgebied van {city}: de hartlijnen van elke weg uit het **Nationaal Wegenbestand (NWB)**, ontsloten via het Geoportaal Overijssel. Van rijksweg tot woonstraat — elk wegvak is een aparte lijn met wegbeheerder, wegnummer en functionele wegklasse. Klik op een lijn voor straatnaam, wegnummer en beheerder.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegvakken in beeld", type: "count" },
          {
            label: "Gemeenten in beeld",
            type: "distinct",
            property: "GME_NAAM",
          },
          {
            label: "In beheer bij provincie",
            type: "count-where",
            property: "WEGBEHSRT",
            equals: "P",
          },
          {
            label: "In beheer bij het Rijk",
            type: "count-where",
            property: "WEGBEHSRT",
            equals: "R",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Wegvakken per wegbeheerder in {city}",
        description:
          "Veld WEGBEHSRT: de soort wegbeheerder van elk wegvak",
        property: "WEGBEHSRT",
        valueLabels: {
          R: "Rijk",
          P: "Provincie",
          G: "Gemeente",
          W: "Waterschap",
          T: "Overig / particulier",
        },
      },
      {
        kind: "category-bar",
        title: "Wegvakken per functionele wegklasse in {city}",
        description:
          "Veld FRC (functional road class): 0 = hoofdweg/autosnelweg … 7 = kleinste lokale weg",
        property: "FRC",
        maxCategories: 8,
        valueLabels: {
          "0": "0 · autosnelweg",
          "1": "1 · hoofdverbinding",
          "2": "2 · belangrijke weg",
          "3": "3 · regionale verbinding",
          "4": "4 · lokale verbinding",
          "5": "5 · lokale weg",
          "6": "6 · woonstraat",
          "7": "7 · kleinste weg",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het **Nationaal Wegenbestand** is de landelijke referentie van alle rijdbare wegen, opgebouwd uit **wegvakken**: stukjes weg tussen twee kruispunten. Elk wegvak weet wie de **beheerder** is (Rijk, provincie, gemeente of waterschap) en welke **functionele wegklasse** (FRC) het heeft — een maat voor het belang in het netwerk, van autosnelweg (0) tot de kleinste woonstraat (7). Verreweg de meeste vakken in een gemeente zijn gemeentelijke woonstraten; de enkele provinciale en rijkswegen vormen de doorgaande ruggengraat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en onderhoud**: de beheerderssoort laat direct zien welk wegdeel van wie is — cruciaal bij werkzaamheden, afsluitingen en meldingen.\n- **Netwerkanalyse**: de functionele wegklasse is de basis voor routering, bereikbaarheids- en verkeersmodellen.\n- **Koppeling met andere data**: het NWB is de landelijke 'kapstok' waaraan ongevallen, snelheden, wegkenmerken en verkeerstellingen worden gehangen.",
      },
      {
        heading: "Over de bron",
        body: "De hartlijnen komen uit het Nationaal Wegenbestand (Rijkswaterstaat), hier gepubliceerd via het Geoportaal Overijssel als open WFS. De statistieken gaan over de kaartuitsnede van {city}; wegvakken van buurgemeenten in de uitsnede tellen mee — het veld *GME_NAAM* per vak geeft uitsluitsel.",
      },
    ],
    links: [
      {
        label: "Nationaal Wegenbestand (NWB) — Rijkswaterstaat",
        url: "https://www.rijkswaterstaat.nl/zakelijk/open-data/nationaal-wegenbestand",
      },
      {
        label: "Geoportaal Overijssel",
        url: "https://geoportaal.overijssel.nl/",
      },
    ],
  },
  {
    layerId: "ov-gastankstations",
    title: "Gas- en groengastankstations in en rond {city}",
    subtitle:
      "Tankpunten voor aardgas (CNG/LNG) en groengas in de provincie Overijssel",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} tankstations** voor **aardgas en groengas**, volgens het Geoportaal Overijssel. Deze stations leveren gasvormige (CNG) en soms vloeibare (LNG) brandstof, waaronder groengas dat uit biovergisting wordt gewonnen — een alternatief voor diesel bij bussen en vrachtverkeer. Klik op een punt voor naam, type en status.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Tankstations in beeld", type: "count" },
          {
            label: "Verschillende locaties",
            type: "distinct",
            property: "NAAM",
          },
          {
            label: "Gerealiseerd",
            type: "count-where",
            property: "STATUS",
            equals: "gerealiseerd",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Tankstations per type in {city}",
        description:
          "Veld TYPE: aardgas- versus groengastankstations",
        property: "TYPE",
        maxCategories: 5,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een tankstation dat **gas** levert als motorbrandstof. Bij *aardgas* gaat het om CNG (samengeperst) of LNG (vloeibaar gemaakt); *groengas* is chemisch gelijk maar duurzaam opgewekt uit onder meer mest en gft. Het veld *STATUS* onderscheidt gerealiseerde stations van geplande of vervallen locaties. Voor {city} gaat het doorgaans om een handvol punten — het netwerk is veel dunner dan dat van reguliere brandstof of van laadpalen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verduurzaming zwaar verkeer**: groengas is een van de weinige alternatieven voor diesel bij vrachtwagens en bussen die (nog) lastig te elektrificeren zijn.\n- **Tankinfrastructuur**: de beschikbaarheid van tankpunten bepaalt of vervoerders op groengas kunnen overstappen.\n- **Regionale energie**: lokaal geproduceerd groengas koppelt landbouw, afvalverwerking en mobiliteit aan elkaar.",
      },
      {
        heading: "Over de bron",
        body: "De punten komen uit de energiedataset van het Geoportaal Overijssel (WFS). De aantallen gaan over de kaartuitsnede van {city}; stations net buiten de uitsnede tellen niet mee. Controleer actuele openingstijden en beschikbaarheid altijd bij de exploitant.",
      },
    ],
    links: [
      {
        label: "Geoportaal Overijssel",
        url: "https://geoportaal.overijssel.nl/",
      },
      {
        label: "Groengas — informatie",
        url: "https://www.rvo.nl/onderwerpen/duurzame-energie-opwekken/groengas",
      },
    ],
  },
  {
    layerId: "ov-vaarwegen",
    title: "Provinciale vaarwegen in en rond {city}",
    subtitle:
      "Vaarroutes voor de beroepsvaart met afmetingen (diepgang, breedte, lengte)",
    intro:
      "Deze laag tekent **{count} vaarwegvakken** binnen het kaartgebied van {city}: de provinciale **vaarwegen voor de beroepsvaart** in Overijssel, zoals het Zwarte Water, het Zwolle-IJsselkanaal en de Geldersche IJssel. Elk vak draagt de maximale afmetingen voor schepen — diepgang, breedte en lengte. Klik op een lijn voor de vaarwegnaam en de maatvoering.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vaarwegvakken in beeld", type: "count" },
          {
            label: "Verschillende vaarwegen",
            type: "distinct",
            property: "VWG_NAAM",
          },
          {
            label: "Max. diepgang (grootste)",
            type: "max",
            property: "MAX_DIEPG",
            unit: "m",
            decimals: 2,
          },
          {
            label: "Max. scheepslengte (grootste)",
            type: "max",
            property: "MAX_LENGTE",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Vaarwegvakken per vaarweg in {city}",
        description:
          "Veld VWG_NAAM: de naam van de vaarweg waartoe elk vak behoort",
        property: "VWG_NAAM",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een vak van een **provinciale vaarweg** die geschikt is voor de beroepsvaart. De bijbehorende afmetingen — *MAX_DIEPG* (maximale diepgang), *MAX_BREED* (breedte) en *MAX_LENGTE* (scheepslengte) — bepalen welke scheepsklasse er kan varen. Op sommige vakken staat de diepgang op 0: daar is geen maat vastgelegd of geldt een afwijkende situatie. De genoemde vaarwegen (Zwarte Water, Zwolle-IJsselkanaal, Geldersche IJssel) verbinden de regio met de grote rivieren en het landelijke vaarwegennet.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Goederenvervoer over water**: binnenvaart is energiezuinig en houdt vrachtverkeer van de weg; de maatvoering bepaalt welke ladingen mogelijk zijn.\n- **Bereikbaarheid bedrijventerreinen**: watergebonden kavels ontlenen hun waarde aan de bevaarbaarheid van de aangrenzende vaarweg.\n- **Beheer en veiligheid**: de provincie is vaarwegbeheerder; afmetingen, bruggen en sluizen bepalen de doorvaart en het onderhoudsprogramma.",
      },
      {
        heading: "Over de bron",
        body: "De vaarroutes komen uit de waterwegen-dataset van het Geoportaal Overijssel (WFS). De statistieken gaan over de kaartuitsnede van {city}; een vaarweg loopt vaak door tot ver buiten de uitsnede, dus het aantal vakken zegt vooral iets over dit deel van de route.",
      },
    ],
    links: [
      {
        label: "Geoportaal Overijssel",
        url: "https://geoportaal.overijssel.nl/",
      },
      {
        label: "Provincie Overijssel — vaarwegen",
        url: "https://www.overijssel.nl/onderwerpen/verkeer-vervoer/vaarwegen/",
      },
    ],
  },
];
