/**
 * Story maps — batch "national-sociaal-1": sociaal domein & wonen (CBS Wijken
 * en Buurten 2024, CBS Vierkantstatistieken 2024) + openbare toiletten (OSM).
 *
 * Lagen: cbs-buurten, cbs-wmo, cbs-jeugdzorg, cbs-bijstand,
 * cbs-sociaal-minimum, cbs-arbeidsparticipatie, cbs-wijken-sociaal, cbs-woz,
 * cbs-woningvoorraad, cbs-huur-koop, cbs-wijken-wonen, cbs-vierkant-100m,
 * cbs-vierkant-500m, osm-toiletten.
 */

import type { StoryDefinition } from "../types";

/** Standaardcodering CBS-stedelijkheidsklasse (adressen per km²). */
const STEDELIJKHEID_LABELS: Record<string, string> = {
  "1": "Zeer sterk stedelijk",
  "2": "Sterk stedelijk",
  "3": "Matig stedelijk",
  "4": "Weinig stedelijk",
  "5": "Niet stedelijk",
};

const CBS_WB_LINKS = [
  {
    label: "CBS: Kerncijfers wijken en buurten 2024",
    url: "https://www.cbs.nl/nl-nl/reeksen/kerncijfers-wijken-en-buurten-2004-2024",
  },
  {
    label: "PDOK: Wijk- en buurtkaart (CBS)",
    url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
  },
];

export const stories: StoryDefinition[] = [
  {
    layerId: "cbs-buurten",
    title: "Buurten en demografie in {city}",
    subtitle:
      "De CBS-buurtindeling met kerncijfers over bevolking, huishoudens en stedelijkheid",
    intro:
      "Deze laag toont **{count} buurten** in en rond {city} uit de landelijke Wijk- en buurtkaart 2024 van het CBS. Elke buurt is een vlak met tientallen kerncijfers: inwonertal, leeftijdsopbouw, huishoudens, woningvoorraad en meer. De kleur geeft een indicatie van de bevolkingsdichtheid; klik op een buurt voor de onderliggende cijfers.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          { label: "Inwoners totaal", type: "sum", property: "aantalInwoners", decimals: 0 },
          { label: "Huishoudens totaal", type: "sum", property: "aantalHuishoudens", decimals: 0 },
          {
            label: "Gem. huishoudensgrootte",
            type: "avg",
            property: "gemiddeldeHuishoudsgrootte",
            decimals: 1,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Buurten per stedelijkheidsklasse in {city}",
        description:
          "CBS-veld stedelijkheidAdressenPerKm2: de omgevingsadressendichtheid vertaald naar vijf klassen",
        property: "stedelijkheidAdressenPerKm2",
        valueLabels: STEDELIJKHEID_LABELS,
      },
      {
        kind: "histogram",
        title: "Verdeling van de bevolkingsdichtheid",
        description:
          "Aantal buurten per klasse inwoners per km² (bevolkingsdichtheidInwonersPerKm2)",
        property: "bevolkingsdichtheidInwonersPerKm2",
        unit: "inw./km²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een **buurt** is de fijnste gebiedsindeling die het CBS jaarlijks van kerncijfers voorziet; meerdere buurten vormen samen een wijk. De cijfers zijn een momentopname (peildatum 1 januari) en beschrijven de hele buurt als één geheel. De stedelijkheidsklasse is afgeleid van de *omgevingsadressendichtheid* — het gemiddeld aantal adressen binnen een straal van één kilometer — en loopt van *zeer sterk stedelijk* tot *niet stedelijk*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Basiskaart voor beleid**: vrijwel elke gebiedsanalyse begint bij de buurt- en wijkindeling; deze laag is de ruggengraat waarop je andere thema's (zorg, wonen, inkomen) legt.\n- **Vergelijkbaarheid**: doordat het CBS dezelfde methodiek landelijk toepast, kun je buurten in {city} één-op-één met elkaar en met andere gemeenten vergelijken.\n- **Dichtheid stuurt voorzieningen**: de stedelijkheidsklasse hangt sterk samen met het draagvlak voor OV, winkels en zorg in de buurt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* van het CBS, ontsloten via PDOK. Let op:\n- Het CBS onderdrukt cijfers voor kleine aantallen (privacy); die velden zijn hier leeg en tellen niet mee in gemiddelden of grafieken.\n- Buiten de bebouwde kom bestaan grote 'verspreide huizen'-buurten met weinig inwoners — die drukken de gemiddelde dichtheid.\n- De kaartuitsnede kan buurten van buurgemeenten bevatten.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-wmo",
    title: "Wmo-cliënten per buurt in {city}",
    subtitle:
      "Gebruik van maatschappelijke ondersteuning (Wmo) per CBS-buurt",
    intro:
      "Deze laag kleurt **{count} buurten** in {city} op het aantal Wmo-cliënten per 1.000 inwoners. De Wet maatschappelijke ondersteuning (Wmo) is een gemeentelijke taak: van huishoudelijke hulp tot begeleiding en woningaanpassingen. Waar het aandeel cliënten hoog is, ligt de vraag naar ondersteuning bovengemiddeld. Klik op een buurt voor de aantallen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten met een cijfer", type: "count" },
          {
            label: "Gem. Wmo-cliënten per 1.000 inw.",
            type: "avg",
            property: "aantalWmoClientenPer1000Inwoners",
            decimals: 0,
          },
          {
            label: "Hoogste (buurt)",
            type: "max",
            property: "aantalWmoClientenPer1000Inwoners",
            decimals: 0,
          },
          {
            label: "Wmo-cliënten totaal",
            type: "sum",
            property: "aantalWmoClienten",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de Wmo-intensiteit per buurt in {city}",
        description:
          "Aantal buurten per klasse Wmo-cliënten per 1.000 inwoners",
        property: "aantalWmoClientenPer1000Inwoners",
        unit: "per 1.000 inw.",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het CBS telt per buurt hoeveel inwoners in een verslagperiode ten minste één Wmo-maatwerkvoorziening ontvingen, en zet dat af tegen het inwonertal (*aantalWmoClientenPer1000Inwoners*). Zo zijn grote en kleine buurten eerlijk te vergelijken. Een hoog cijfer betekent niet automatisch 'een probleem': het weerspiegelt vooral de bevolkingssamenstelling — met name het aandeel ouderen en alleenstaanden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Zorgplanning**: buurten met veel Wmo-gebruik zijn logische plekken voor laagdrempelige voorzieningen, dagbesteding en wijkteams.\n- **Vroegsignalering**: een combinatie van veel ouderen, veel eenpersoonshuishoudens en veel Wmo-gebruik wijst op kwetsbaarheid.\n- **Budgettering**: de Wmo drukt zwaar op de gemeentebegroting; de spreiding helpt bij het richten van preventie.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK). Het CBS onderdrukt aantallen voor kleine buurten; die buurten hebben geen cijfer en vallen weg uit de statistieken hierboven. Het gaat om maatwerkvoorzieningen — algemene voorzieningen (zoals een buurtcentrum) tellen niet mee.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-jeugdzorg",
    title: "Jeugdzorg per buurt in {city}",
    subtitle:
      "Aandeel jongeren met jeugdzorg in natura per CBS-buurt",
    intro:
      "Deze laag toont **{count} buurten** in {city}, gekleurd op het percentage jongeren met jeugdzorg in natura. Sinds 2015 zijn gemeenten verantwoordelijk voor de jeugdzorg; deze cijfers laten zien in welke buurten relatief veel jongeren gebruikmaken van jeugdhulp, jeugdbescherming of jeugdreclassering. Klik op een buurt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten met een cijfer", type: "count" },
          {
            label: "Gem. jongeren met jeugdzorg",
            type: "avg",
            property: "percentageJongerenMetJeugdzorgInNatura",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Hoogste (buurt)",
            type: "max",
            property: "percentageJongerenMetJeugdzorgInNatura",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Jongeren met jeugdzorg totaal",
            type: "sum",
            property: "aantalJongerenMetJeugdzorgInNatura",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het jeugdzorgaandeel per buurt in {city}",
        description:
          "Aantal buurten per klasse percentage jongeren met jeugdzorg in natura",
        property: "percentageJongerenMetJeugdzorgInNatura",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het CBS berekent per buurt welk aandeel van de jongeren (tot 18 jaar, deels tot 23) in de verslagperiode jeugdzorg *in natura* ontving — dus zorg die de gemeente heeft ingekocht, niet via een persoonsgebonden budget. Het is een percentage van alle jongeren in de buurt, wat grote en kleine buurten vergelijkbaar maakt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Preventie loont**: buurten met veel jeugdzorg zijn kansrijke plekken voor laagdrempelige opvoedondersteuning en schoolmaatschappelijk werk.\n- **Samenhang met andere thema's**: jeugdzorggebruik hangt vaak samen met inkomen, schulden en eenoudergezinnen; leg deze laag over de sociaal-minimum-laag voor een rijker beeld.\n- **Kostenbeheersing**: jeugdzorg is een van de grootste en snelst groeiende uitgavenposten van gemeenten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK). Aantallen in kleine buurten worden onderdrukt en ontbreken hier. Jeugdzorg via een pgb en landelijk gefinancierde specialistische zorg vallen buiten dit 'in natura'-cijfer, dus het werkelijke gebruik ligt iets hoger.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-bijstand",
    title: "Bijstand en uitkeringen per buurt in {city}",
    subtitle:
      "Personen met een bijstands-, arbeidsongeschiktheids- of WW-uitkering per CBS-buurt",
    intro:
      "Deze laag toont **{count} buurten** in {city} met het aantal inwoners dat een uitkering ontvangt. Het gaat om de algemene bijstand (Participatiewet), arbeidsongeschiktheidsuitkeringen (AO) en werkloosheidsuitkeringen (WW). Samen schetsen deze cijfers waar de afstand tot de arbeidsmarkt het grootst is. Klik op een buurt voor de aantallen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten met een cijfer", type: "count" },
          {
            label: "Bijstandsontvangers totaal",
            type: "sum",
            property: "aantalPersonenMetEenAlgBijstandsuitkeringTot",
            decimals: 0,
          },
          {
            label: "AO-uitkeringen totaal",
            type: "sum",
            property: "aantalPersonenMetEenAoUitkeringTotaal",
            decimals: 0,
          },
          {
            label: "WW-uitkeringen totaal",
            type: "sum",
            property: "aantalPersonenMetEenWwUitkeringTotaal",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van bijstandsontvangers per buurt in {city}",
        description:
          "Aantal buurten per klasse personen met een algemene bijstandsuitkering",
        property: "aantalPersonenMetEenAlgBijstandsuitkeringTot",
        unit: "personen",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Per buurt telt het CBS het aantal inwoners met een lopende uitkering, uitgesplitst naar soort: **bijstand** (Participatiewet, uitgevoerd door de gemeente), **AO** (arbeidsongeschiktheid, zoals WIA/WAO/Wajong) en **WW** (werkloosheid). Dit zijn absolute aantallen, geen percentages: grote buurten hebben logischerwijs meer ontvangers. Voor een eerlijke vergelijking tussen buurten kijk je naar de verhouding met het inwonertal.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Participatiebeleid**: de bijstand is een directe gemeentelijke taak; de spreiding helpt bij het gericht inzetten van re-integratie en schuldhulp.\n- **Stapeling van problematiek**: buurten met veel uitkeringen kennen vaker ook armoede, gezondheidsachterstand en jeugdzorg — een signaal voor een integrale wijkaanpak.\n- **Conjunctuurgevoelig**: het WW-cijfer beweegt mee met de economie, terwijl bijstand en AO structureler zijn.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK). Kleine aantallen worden onderdrukt en ontbreken; het buurttotaal kan daardoor iets lager uitvallen dan het werkelijke aantal. De AOW (ouderdomspensioen) valt hier buiten — dat is een aparte categorie.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-sociaal-minimum",
    title: "Huishoudens rond het sociaal minimum in {city}",
    subtitle:
      "Aandeel huishoudens met een laag inkomen per CBS-buurt",
    intro:
      "Deze laag kleurt **{count} buurten** in {city} op het percentage huishoudens onder of rond het sociaal minimum — kortweg: hoe geconcentreerd armoede in een buurt is. Het sociaal minimum is het wettelijke bestaansminimum (bijstandsniveau). Donkerder gekleurde buurten kennen relatief veel huishoudens met een laag inkomen. Klik op een buurt voor de cijfers.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten met een cijfer", type: "count" },
          {
            label: "Gem. onder/rond sociaal minimum",
            type: "avg",
            property: "percentageHuishoudensOnderOfRondSociaalMinimum",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Hoogste (buurt)",
            type: "max",
            property: "percentageHuishoudensOnderOfRondSociaalMinimum",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Huishoudens tot 120% minimum",
            type: "sum",
            property: "huishoudensTot120PercentVanSociaalMinimum",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het armoedeaandeel per buurt in {city}",
        description:
          "Aantal buurten per klasse percentage huishoudens onder of rond het sociaal minimum",
        property: "percentageHuishoudensOnderOfRondSociaalMinimum",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het CBS bepaalt per buurt welk deel van de particuliere huishoudens een besteedbaar inkomen heeft *onder of rond* het sociaal minimum. Daarnaast zijn er tellingen tot **110%** en **120%** van het sociaal minimum — ruimere armoedegrenzen die gemeenten vaak gebruiken voor minimaregelingen (zoals kwijtschelding of een stadspas). Het gaat om een meerjarig, laag inkomen, niet om een tijdelijke terugval.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Armoedebeleid**: de 110%- en 120%-grenzen bepalen wie recht heeft op gemeentelijke ondersteuning; deze kaart laat zien waar het bereik het grootst moet zijn.\n- **Bestaanszekerheid**: concentraties van lage inkomens vragen om extra aandacht voor schulden, energiearmoede en voedselhulp.\n- **Kansengelijkheid**: inkomensarmoede werkt door in onderwijs, gezondheid en jeugdzorg van de volgende generatie.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK), gebaseerd op integrale inkomensdata van het CBS. Voor kleine buurten worden de percentages onderdrukt en ontbreken ze hier. De inkomenscijfers lopen doorgaans één à twee jaar achter op het verslagjaar.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-arbeidsparticipatie",
    title: "Arbeidsparticipatie per buurt in {city}",
    subtitle:
      "Netto arbeidsparticipatie en het aandeel werknemers en zelfstandigen per CBS-buurt",
    intro:
      "Deze laag toont **{count} buurten** in {city}, gekleurd op de netto arbeidsparticipatie: het aandeel van de bevolking (15–75 jaar) met betaald werk. Het is een kernindicator voor economische zelfredzaamheid van een buurt. Klik op een buurt om ook het aandeel werknemers en zelfstandigen te zien.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten met een cijfer", type: "count" },
          {
            label: "Gem. netto arbeidsparticipatie",
            type: "avg",
            property: "nettoArbeidsparticipatie",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Gem. aandeel werknemers",
            type: "avg",
            property: "percentageWerknemers",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Gem. aandeel zelfstandigen",
            type: "avg",
            property: "percentageZelfstandigen",
            unit: "%",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de arbeidsparticipatie per buurt in {city}",
        description:
          "Aantal buurten per klasse netto arbeidsparticipatie",
        property: "nettoArbeidsparticipatie",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De **netto arbeidsparticipatie** is het percentage van de bevolking van 15 tot 75 jaar dat betaald werk heeft (minstens één uur per week). Het CBS splitst de werkenden verder in *werknemers* (in loondienst) en *zelfstandigen*. Een lage participatie kan wijzen op veel gepensioneerden, studenten of juist op werkloosheid — de leeftijdsopbouw van de buurt bepaalt mede hoe je het cijfer leest.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Economische veerkracht**: buurten met lage arbeidsparticipatie zijn kwetsbaarder bij economische tegenwind en vragen om gerichte activering.\n- **Samenhang met inkomen**: participatie en inkomen hangen sterk samen; leg deze laag over de bijstands- of sociaal-minimum-laag.\n- **Ondernemerschap**: het aandeel zelfstandigen laat zien waar veel zzp'ers en kleine ondernemers wonen — relevant voor lokaal economisch beleid.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK). Voor kleine buurten worden de percentages onderdrukt en ontbreken ze hier. De cijfers betreffen de woonbuurt van werkenden, niet de plek waar zij werken.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-wijken-sociaal",
    title: "Sociaal domein per wijk in {city}",
    subtitle:
      "Wmo, jeugdzorg, uitkeringen en inkomen geaggregeerd op wijkniveau",
    intro:
      "Deze laag toont **{count} wijken** in {city} met de belangrijkste cijfers uit het sociaal domein. Waar de buurtlagen fijnmazig zijn (en vaak onderdrukte cijfers kennen), geeft de wijkindeling een robuuster beeld: door de grotere aantallen zijn minder waarden geheim. Handig voor een eerste overzicht per stadsdeel. Klik op een wijk voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wijken in beeld", type: "count" },
          { label: "Inwoners totaal", type: "sum", property: "aantalInwoners", decimals: 0 },
          {
            label: "Bijstandsontvangers totaal",
            type: "sum",
            property: "aantalPersonenMetEenAlgBijstandsuitkeringTot",
            decimals: 0,
          },
          {
            label: "Wmo-cliënten totaal",
            type: "sum",
            property: "aantalWmoClienten",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van bijstandsontvangers per wijk in {city}",
        description:
          "Aantal wijken per klasse personen met een algemene bijstandsuitkering",
        property: "aantalPersonenMetEenAlgBijstandsuitkeringTot",
        unit: "personen",
        bins: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een **wijk** bundelt meerdere buurten. Het CBS levert op wijkniveau dezelfde thema's als op buurtniveau — Wmo, jeugdzorg, uitkeringen, sociaal minimum — maar omdat de aantallen groter zijn, worden minder cijfers onderdrukt. Deze laag is daarom vaak completer dan de losse buurtlagen, ten koste van detail.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Stadsdeelsturing**: veel gemeenten organiseren wijkteams en gebiedsbudgetten op wijkniveau; deze indeling sluit daarop aan.\n- **Betrouwbaarder beeld**: door minder onderdrukte cijfers is een wijkvergelijking robuuster dan een buurtvergelijking.\n- **Integraal**: één laag brengt zorg, inkomen en participatie samen — ideaal om achterstandswijken te herkennen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK), hier op de wijkindeling. Ook op wijkniveau kan het CBS afzonderlijke velden onderdrukken; die tellen niet mee in de statistieken hierboven. Wijkgrenzen kunnen tussen jaargangen verschuiven bij gemeentelijke herindelingen.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-woz",
    title: "WOZ-woningwaarde per buurt in {city}",
    subtitle:
      "Gemiddelde WOZ-waarde van woningen per CBS-buurt",
    intro:
      "Deze laag kleurt **{count} buurten** in {city} op de gemiddelde WOZ-waarde van de woningen. De WOZ-waarde (Waardering onroerende zaken) is de door de gemeente vastgestelde marktwaarde die de basis vormt voor onder meer de onroerendezaakbelasting. Zo zie je in één beeld waar de woningen het meest en het minst waard zijn. Klik op een buurt voor de waarde.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten met een cijfer", type: "count" },
          {
            label: "Gem. WOZ-waarde",
            type: "avg",
            property: "gemiddeldeWoningwaarde",
            unit: "× €1.000",
            decimals: 0,
          },
          {
            label: "Hoogste (buurt)",
            type: "max",
            property: "gemiddeldeWoningwaarde",
            unit: "× €1.000",
            decimals: 0,
          },
          {
            label: "Laagste (buurt)",
            type: "min",
            property: "gemiddeldeWoningwaarde",
            unit: "× €1.000",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de WOZ-waarde per buurt in {city}",
        description:
          "Aantal buurten per klasse gemiddelde woningwaarde (× €1.000)",
        property: "gemiddeldeWoningwaarde",
        unit: "× €1.000",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elke buurt geeft het CBS de **gemiddelde WOZ-waarde** van de woningen, uitgedrukt in duizenden euro's (een waarde van 350 betekent dus € 350.000). De WOZ-waarde loopt doorgaans een jaar achter op de peildatum en volgt de marktontwikkeling met vertraging. Het is een gemiddelde: binnen een gemengde buurt kunnen de waarden flink uiteenlopen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sociaal-economische kaart**: WOZ-waarde is een goede benadering van de welvaart in een buurt en correleert met inkomen en eigendomsverhouding.\n- **Gemeentefinanciën**: de WOZ-waarde is de grondslag voor de OZB en werkt door in het gemeentefonds.\n- **Woningmarkt**: verschillen tussen buurten laten zien waar betaalbaarheid onder druk staat en waar starters nog terechtkunnen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK). Buurten zonder (voldoende) woningen krijgen geen waarde en ontbreken hier. Omdat het CBS de waarde afrondt op duizendtallen, is de kaart bedoeld voor vergelijking tussen buurten, niet voor een exacte taxatie.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-woningvoorraad",
    title: "Woningvoorraad per buurt in {city}",
    subtitle:
      "Aantal woningen, woningtype en leegstand per CBS-buurt",
    intro:
      "Deze laag toont **{count} buurten** in {city} met de samenstelling van de woningvoorraad: hoeveel woningen er staan, welk aandeel eengezins- of meergezinswoning is, en hoeveel woningen leegstaan. Samen schetsen deze cijfers het karakter van de buurt — van laagbouwwijk tot appartementenblok. Klik op een buurt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Woningen totaal",
            type: "sum",
            property: "woningvoorraad",
            decimals: 0,
          },
          {
            label: "Gem. aandeel eengezinswoning",
            type: "avg",
            property: "percentageEengezinswoning",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Gem. aandeel onbewoond",
            type: "avg",
            property: "percentageOnbewoond",
            unit: "%",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het aandeel meergezinswoningen per buurt in {city}",
        description:
          "Aantal buurten per klasse percentage meergezinswoningen (appartementen)",
        property: "percentageMeergezinswoning",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De **woningvoorraad** is het totaal aantal woningen in een buurt. Het CBS splitst dat naar **eengezinswoningen** (grondgebonden: rijtjes, twee-onder-een-kap, vrijstaand) en **meergezinswoningen** (appartementen, flats, portiekwoningen). Het aandeel *onbewoonde* woningen wijst op leegstand, tweede woningen of woningen in transactie. Samen typeren deze cijfers de bebouwing van de buurt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woningbouwopgave**: de bestaande mix bepaalt waar verdichting (meer appartementen) of juist grondgebonden woningen passen.\n- **Doelgroepen**: eengezinswoningen trekken gezinnen, appartementen jonge en oudere een- en tweepersoonshuishoudens — dit stuurt voorzieningenbeleid.\n- **Leegstand**: structurele leegstand is een signaal voor herbestemming of een kwetsbare woningmarkt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK), gebaseerd op de Basisregistratie Adressen en Gebouwen (BAG). Voor kleine buurten worden sommige percentages onderdrukt en ontbreken ze hier. Het onderscheid eengezins/meergezins volgt de BAG-typering en kan bij bijzondere gebouwen (zoals zorgcomplexen) afwijken van de dagelijkse perceptie.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-huur-koop",
    title: "Huur versus koop per buurt in {city}",
    subtitle:
      "Aandeel koop- en huurwoningen en corporatiebezit per CBS-buurt",
    intro:
      "Deze laag kleurt **{count} buurten** in {city} op de eigendomsverhouding van de woningen: het aandeel koopwoningen tegenover huurwoningen, en binnen de huur het deel dat van woningcorporaties is. Zo zie je waar de sociale huur geconcentreerd is en waar de koopsector overheerst. Klik op een buurt voor de percentages.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten met een cijfer", type: "count" },
          {
            label: "Gem. aandeel koopwoningen",
            type: "avg",
            property: "percentageKoopwoningen",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Gem. aandeel huurwoningen",
            type: "avg",
            property: "percentageHuurwoningen",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Gem. corporatiebezit (van huur)",
            type: "avg",
            property: "percHuurwoningenInBezitWoningcorporaties",
            unit: "%",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het koopaandeel per buurt in {city}",
        description:
          "Aantal buurten per klasse percentage koopwoningen",
        property: "percentageKoopwoningen",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Per buurt geeft het CBS welk deel van de bewoonde woningen **koop** is en welk deel **huur**. De huur wordt verder gesplitst naar woningen *in bezit van woningcorporaties* (de sociale huur) en *overige verhuurders* (particuliere en institutionele beleggers). Koop- en huurpercentages tellen samen op tot ongeveer 100%; kleine afwijkingen ontstaan door woningen met onbekend eigendom.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Volkshuisvesting**: het aandeel corporatiebezit bepaalt hoeveel sociale huur een buurt biedt — kern van de lokale woonvisie en prestatieafspraken.\n- **Gemengde wijken**: een evenwichtige mix van huur en koop wordt vaak nagestreefd om segregatie te voorkomen.\n- **Verduurzaming**: corporatiebezit is via prestatieafspraken sneller te verduurzamen dan versnipperd particulier bezit.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK). Voor kleine buurten worden percentages onderdrukt en ontbreken ze hier. De eigendomsverhouding betreft alleen bewoonde woningen; leegstaande en niet-woningen tellen niet mee.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-wijken-wonen",
    title: "Wonen en woningwaarde per wijk in {city}",
    subtitle:
      "WOZ-waarde, woningvoorraad en eigendomsverhouding geaggregeerd op wijkniveau",
    intro:
      "Deze laag toont **{count} wijken** in {city} met de belangrijkste wooncijfers samengevat per stadsdeel: WOZ-waarde, woningvoorraad en het aandeel koop en huur. Door het grotere schaalniveau zijn minder cijfers onderdrukt dan op buurtniveau, wat een completer overzicht geeft. Klik op een wijk voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wijken in beeld", type: "count" },
          {
            label: "Woningen totaal",
            type: "sum",
            property: "woningvoorraad",
            decimals: 0,
          },
          {
            label: "Gem. WOZ-waarde",
            type: "avg",
            property: "gemiddeldeWoningwaarde",
            unit: "× €1.000",
            decimals: 0,
          },
          {
            label: "Gem. aandeel koopwoningen",
            type: "avg",
            property: "percentageKoopwoningen",
            unit: "%",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de WOZ-waarde per wijk in {city}",
        description:
          "Aantal wijken per klasse gemiddelde woningwaarde (× €1.000)",
        property: "gemiddeldeWoningwaarde",
        unit: "× €1.000",
        bins: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Deze laag bundelt de woonthema's — WOZ-waarde, aantal woningen, aandeel eengezins/meergezins en huur/koop — op **wijkniveau**. Een wijk omvat meerdere buurten, waardoor de cijfers robuuster zijn en minder vaak worden onderdrukt. De WOZ-waarde staat in duizenden euro's (350 = € 350.000).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woonvisie**: de wijkindeling sluit aan bij hoe gemeenten hun woonbeleid en prestatieafspraken met corporaties organiseren.\n- **Snel overzicht**: één blik laat zien welke wijken duur of goedkoop, koop- of huurgedomineerd zijn.\n- **Betrouwbaarder dan buurt**: door minder onderdrukte cijfers zijn wijken beter onderling vergelijkbaar.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *Kerncijfers wijken en buurten 2024* (CBS, via PDOK), hier op de wijkindeling. Ook op wijkniveau kunnen afzonderlijke velden onderdrukt zijn. De WOZ-waarde is afgerond op duizendtallen en bedoeld voor vergelijking, niet als taxatie.",
      },
    ],
    links: CBS_WB_LINKS,
  },
  {
    layerId: "cbs-vierkant-100m",
    title: "Bevolking per 100-meterhok in {city}",
    subtitle:
      "Zeer fijnmazige CBS-vierkantstatistiek: inwoners en woningen per 100×100 m",
    intro:
      "Deze laag legt een raster van **100 bij 100 meter** over {city} en toont per hokje het aantal inwoners en woningen. In beeld zijn nu **{count} gridcellen** — het fijnste ruimtelijke detail dat het CBS publiceert, veel scherper dan buurten. Zo zie je de bebouwing en bevolkingsspreiding tot op straatniveau. Klik op een cel voor de aantallen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gridcellen in beeld", type: "count" },
          { label: "Inwoners totaal", type: "sum", property: "aantalInwoners", decimals: 0 },
          { label: "Woningen totaal", type: "sum", property: "aantalWoningen", decimals: 0 },
          {
            label: "Gem. inwoners per cel",
            type: "avg",
            property: "aantalInwoners",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het aantal inwoners per 100-meterhok in {city}",
        description:
          "Aantal gridcellen per klasse inwoners — laat de bebouwingsdichtheid zien",
        property: "aantalInwoners",
        unit: "inwoners",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Anders dan de buurt- en wijklagen volgt deze laag geen bestuurlijke grenzen maar een strak **vierkantsraster** van 100 m. Elk hokje bevat de inwoners en woningen die er fysiek staan. Lege hokken (water, landbouw, bedrijventerrein) worden niet getoond. Het raster is ideaal om te zien waar mensen écht wonen, los van hoe buurtgrenzen lopen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fijnmazige analyse**: voor loopafstanden, voorzieningenbereik en hittestress is 100 m veel bruikbaarder dan een hele buurt.\n- **Nauwkeurige dichtheid**: het raster laat verdichting en open plekken binnen één buurt zien.\n- **Koppelbaar**: het vierkantsraster is een landelijke standaard waarop je andere fijnmazige data kunt leggen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de *Vierkantstatistieken 100 m 2024* van het CBS (via PDOK). Belangrijke kanttekeningen:\n- **Privacy weegt zwaar**: op dit schaalniveau onderdrukt het CBS veel cijfers en rondt aantallen af op vijftallen. Inhoudelijke velden (inkomen, eigendom) zijn vaak leeg; inwoners en woningen zijn het meest gevuld.\n- **Kaartuitsnede**: bij een groot kaartgebied worden niet alle cellen tegelijk geladen — de aantallen gaan over de nu geladen cellen.\n- Lees de kaart als een dichtheidspatroon, niet als een exacte telling per hokje.",
      },
    ],
    links: [
      {
        label: "CBS: kaart van 100 × 100 meter met statistieken",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/kaart-van-100-meter-bij-100-meter-met-statistieken",
      },
      {
        label: "PDOK: CBS Vierkantstatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-vierkantstatistieken",
      },
    ],
  },
  {
    layerId: "cbs-vierkant-500m",
    title: "Bevolking en voorzieningen per 500-meterhok in {city}",
    subtitle:
      "CBS-vierkantstatistiek op 500×500 m: inwoners, woningen en nabijheid van voorzieningen",
    intro:
      "Deze laag legt een raster van **500 bij 500 meter** over {city}. In beeld zijn **{count} gridcellen** met per hokje het aantal inwoners en woningen, plus een schat aan nabijheidscijfers: de afstand tot supermarkt, school, huisarts, station en meer. Grover dan het 100-meterraster, maar met veel meer gevulde velden. Klik op een cel voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gridcellen in beeld", type: "count" },
          { label: "Inwoners totaal", type: "sum", property: "aantalInwoners", decimals: 0 },
          { label: "Woningen totaal", type: "sum", property: "aantalWoningen", decimals: 0 },
          {
            label: "Gem. inwoners per cel",
            type: "avg",
            property: "aantalInwoners",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Gridcellen per stedelijkheidsklasse in {city}",
        description:
          "CBS-veld stedelijkheid: omgevingsadressendichtheid vertaald naar vijf klassen",
        property: "stedelijkheid",
        valueLabels: STEDELIJKHEID_LABELS,
      },
      {
        kind: "histogram",
        title: "Verdeling van het aantal inwoners per 500-meterhok in {city}",
        description:
          "Aantal gridcellen per klasse inwoners",
        property: "aantalInwoners",
        unit: "inwoners",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Dit raster van 500 m is de grotere broer van het 100-meterhok. Omdat elke cel meer inwoners bundelt, hoeft het CBS minder cijfers te onderdrukken en zijn er extra velden beschikbaar: naast inwoners en woningen ook de **nabijheid van voorzieningen** (afstand tot en aantal binnen 1/3/5 km van supermarkt, school, huisarts, horeca) en de **stedelijkheidsklasse**. Zo combineert deze laag bevolkingsspreiding met bereikbaarheid.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Voorzieningenbeleid**: de nabijheidscijfers laten zien welke gebieden ver van dagelijkse voorzieningen liggen — relevant voor leefbaarheid en het 15-minuten-stadidee.\n- **Balans detail vs. dekking**: 500 m is fijn genoeg voor gebiedsanalyse en toch robuust genoeg om de meeste velden gevuld te houden.\n- **Landelijke standaard**: het vierkantsraster is koppelbaar aan andere datasets zonder afhankelijkheid van buurtgrenzen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de *Vierkantstatistieken 500 m 2024* van het CBS (via PDOK). Kanttekeningen:\n- Ook hier onderdrukt het CBS cijfers voor dunbevolkte cellen en rondt het aantallen af; lege velden tellen niet mee in de grafieken.\n- Nabijheidsafstanden zijn over de weg berekend (CBS-nabijheidsmethodiek), niet hemelsbreed.\n- De statistieken gaan over de nu geladen gridcellen binnen het kaartgebied.",
      },
    ],
    links: [
      {
        label: "CBS: kaart van 500 × 500 meter met statistieken",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/kaart-van-500-meter-bij-500-meter-met-statistieken",
      },
      {
        label: "PDOK: CBS Vierkantstatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-vierkantstatistieken",
      },
    ],
  },
  {
    layerId: "osm-toiletten",
    title: "Openbare toiletten in {city}",
    subtitle:
      "Openbaar toegankelijke toiletten uit OpenStreetMap, met toegankelijkheid en kosten",
    intro:
      "Deze laag toont **{count} openbare toiletten** in {city} zoals vrijwilligers ze in OpenStreetMap hebben vastgelegd. Per punt is vaak bekend of het gratis is, of het rolstoeltoegankelijk is en wie het beheert. Een 'toiletkaart' is klein maar praktisch: voor ouderen, mensen met een beperking, gezinnen met kinderen en toeristen bepaalt het mede hoe prettig de openbare ruimte is. Klik op een punt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Toiletten in beeld", type: "count" },
          {
            label: "Gratis toegankelijk (aandeel)",
            type: "count-where",
            property: "fee",
            equals: "no",
            asShare: true,
          },
          {
            label: "Rolstoeltoegankelijk (aandeel)",
            type: "count-where",
            property: "wheelchair",
            equals: ["yes", "designated"],
            asShare: true,
          },
          {
            label: "Met naam/aanduiding",
            type: "distinct",
            property: "name",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rolstoeltoegankelijkheid van toiletten in {city}",
        description:
          "OSM-tag wheelchair, zoals ingevoerd door de kaartmakers",
        property: "wheelchair",
        valueLabels: {
          yes: "Toegankelijk",
          designated: "Speciaal ingericht",
          limited: "Beperkt toegankelijk",
          no: "Niet toegankelijk",
        },
      },
      {
        kind: "category-bar",
        title: "Betaald of gratis?",
        description:
          "OSM-tag fee: is er een gebruiksvergoeding voor het toilet?",
        property: "fee",
        valueLabels: {
          no: "Gratis",
          yes: "Betaald",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een locatie die in OpenStreetMap als *amenity=toilets* is getagd: van een vrijstaand openbaar toilet tot een toiletvoorziening bij een station, park of horecagelegenheid. De kaartmakers voegen waar mogelijk kenmerken toe zoals **fee** (gratis of betaald), **wheelchair** (rolstoeltoegankelijkheid) en **access** (voor iedereen of alleen voor klanten). Niet elk toilet heeft al deze tags — 'onbekend' betekent simpelweg dat het veld nog niet is ingevuld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toegankelijke stad**: een fijnmazig netwerk van (rolstoeltoegankelijke) toiletten is essentieel voor ouderen, mensen met een beperking of chronische aandoening en gezinnen met jonge kinderen.\n- **Aantrekkelijke binnenstad**: voldoende voorzieningen verlengen de verblijfsduur van bezoekers en winkelend publiek.\n- **Signaal voor witte vlekken**: lege gebieden op deze kaart kunnen wijzen op een tekort — of op ontbrekende registratie, wat een reden is om lokaal aan te vullen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt van **OpenStreetMap**, een vrij en door vrijwilligers onderhouden wereldwijd kaartproject. De dekking en kwaliteit variëren daardoor: goed onderhouden binnensteden zijn vrijwel compleet, terwijl in andere gebieden toiletten kunnen ontbreken. De laag is een momentopname van de kaartuitsnede van {city} en wordt live opgehaald, dus hij groeit mee met wat vrijwilligers toevoegen.",
      },
    ],
    links: [
      {
        label: "OpenStreetMap: tag amenity=toilets",
        url: "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dtoilets",
      },
      { label: "OpenStreetMap", url: "https://www.openstreetmap.org" },
    ],
  },
];
