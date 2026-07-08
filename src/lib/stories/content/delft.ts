/**
 * Story maps — gemeentelijke open-data lagen van Delft.
 *
 * Deze lagen komen uit de open-data omgeving van de gemeente Delft
 * (ArcGIS Hub, services3.arcgis.com/j07voPd56xoB4c87) en zijn alleen in
 * Delft zichtbaar. Property-namen zijn geverifieerd via live samples van de
 * FeatureServer-endpoints (2026-07).
 *
 * Lagen: delft-archeologie, delft-beplantingen, delft-bomen,
 * delft-buurtpreventie, delft-corporatiebezit, delft-drinkwaterpunten,
 * delft-energielabels, delft-fietsenstallingen, delft-geologie, delft-hagen,
 * delft-milieuzone, delft-monumenten, delft-parkeerautomaten,
 * delft-parkeergebieden, delft-speelplekken, delft-stadsgezichten,
 * delft-voetgangersnetwerk, delft-zonnepanelen.
 */

import type { StoryDefinition } from "../types";

const OPEN_DATA_DELFT = "https://data.delft.nl/";

export const stories: StoryDefinition[] = [
  {
    layerId: "delft-archeologie",
    title: "Archeologische beleidsadvieskaart van {city}",
    subtitle:
      "Verwachtingszones en bijbehorende onderzoeksdrempels voor de ondergrond",
    intro:
      "Deze laag toont **{count} beleidszones** uit de archeologische beleidsadvieskaart van {city}. Elke zone koppelt een geologische eenheid aan een archeologische *verwachtingswaarde* (van geen tot zeer hoog) en een *vrijstellingsgrens*: het oppervlak en de diepte waaronder een ingreep zonder archeologisch onderzoek mag plaatsvinden. Klik op een vlak voor de eenheid en de bijbehorende drempel.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Beleidszones in beeld", type: "count" },
          { label: "Geologische eenheden", type: "distinct", property: "EENHEID" },
          {
            label: "Hoge / zeer hoge verwachting",
            type: "count-where",
            property: "VERWACHTIN",
            equals: ["Hoog", "Zeer hoog"],
          },
          {
            label: "Vrijstellingsklassen",
            type: "distinct",
            property: "VRIJSTELLI",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Archeologische verwachtingswaarde in {city}",
        description:
          "Veld VERWACHTIN: hoe kansrijk archeologische resten in een zone zijn",
        property: "VERWACHTIN",
        valueLabels: {
          Geen: "Geen verwachting",
          Laag: "Lage verwachting",
          Middelhoog: "Middelhoge verwachting",
          Hoog: "Hoge verwachting",
          "Zeer hoog": "Zeer hoge verwachting",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De kaart deelt het grondgebied op in zones met een archeologische verwachting. Die verwachting hangt samen met de ondergrond: op oude, hoger gelegen afzettingen (bijvoorbeeld geulruggen) is de kans op bewoningssporen groter dan in laaggelegen veengebied. Bij elke zone hoort een **vrijstellingsgrens** (veld *VRIJSTELLI*), zoals \"200 m² + 40 cm -mv\": is de ingreep kleiner dan dat oppervlak of ondieper dan die diepte, dan is geen archeologisch onderzoek nodig.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vergunningen**: bij bouw- en graafwerk bepaalt de zone of archeologisch vooronderzoek verplicht is — dit is de eerste kaart die een initiatiefnemer raadpleegt.\n- **Planvorming**: zones met een hoge verwachting sturen de fasering en het budget van gebiedsontwikkeling.\n- **Erfgoed**: de kaart borgt dat het bodemarchief van {city} niet ongezien verdwijnt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De beleidsadvieskaart is vastgesteld beleid van de gemeente {city} en wordt via de open-data omgeving ontsloten. De statistieken gaan over de zones binnen de kaartuitsnede; de vrijstellingsgrenzen zijn indicatief — de vastgestelde regels in de omgevingsverordening zijn altijd leidend.",
      },
    ],
    links: [
      {
        label: "Open data Delft",
        url: OPEN_DATA_DELFT,
      },
    ],
  },
  {
    layerId: "delft-beplantingen",
    title: "Beplantingsvakken in {city}",
    subtitle: "Het gemeentelijke groenareaal per beheergroep",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} beplantingsvakken** geladen uit de groenbeheerregistratie van de gemeente. Elk vak — van heestervak tot boomspiegel — heeft een *beheergroep*, een *ambitieniveau* voor het onderhoud en een oppervlakte. Samen vormen ze het beeld van het openbaar groen dat de gemeente actief onderhoudt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Beplantingsvakken in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "OPPERVLAK",
            unit: "m²",
            decimals: 0,
          },
          { label: "Beheergroepen", type: "distinct", property: "BEHEERGROEP" },
          { label: "Wijken", type: "distinct", property: "WIJK" },
        ],
      },
      {
        kind: "category-bar",
        title: "Beplantingsvakken per beheergroep in {city}",
        description:
          "Veld BEHEERGROEP: het type beplanting dat het onderhoudsregime bepaalt",
        property: "BEHEERGROEP",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk polygoon is een beheerbaar groenvak. De **beheergroep** (veld *BEHEERGROEP*) bepaalt hoe het vak wordt onderhouden: een *boomspiegel* rond een straatboom vraagt ander werk dan een *heestervak* of *bosplantsoen*. Het **ambitieniveau** geeft aan hoe intensief dat gebeurt, van hoogwaardig tot sober.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheerbudget**: het areaal per beheergroep is de basis voor onderhoudsbestekken en kosten.\n- **Klimaat en biodiversiteit**: het aandeel heesters, vaste planten en bosplantsoen zegt iets over verkoeling, waterberging en ecologische waarde.\n- **Leefomgeving**: groen in de directe woonomgeving draagt aantoonbaar bij aan gezondheid en woontevredenheid.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de groenbeheerregistratie (BOR) van de gemeente {city}. Grote lagen worden op de kaart tot een maximum aantal vakken geladen; de statistieken en de grafiek gaan dus over de geladen selectie binnen de kaartuitsnede, niet per se over het volledige areaal. Het veld *AANLEGJAAR* bevat bij oudere vakken vaak de plaatswaarde 1900 en is daarom hier niet als grafiek opgenomen.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-bomen",
    title: "Bomen in beheer van {city}",
    subtitle: "De gemeentelijke bomenkaart met soort, hoogte en plantjaar",
    intro:
      "Deze laag toont **{count} bomen** die de gemeente {city} beheert (van in totaal circa 37.000). Elke boom heeft een *boomsortiment* (soort), een *hoogteklasse*, een aanlegjaar en een beheergroep. Klik op een stip voor de details van die ene boom. Omdat de volledige bomenkaart erg groot is, laadt de kaart een selectie; de cijfers hieronder gaan over die geladen bomen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          {
            label: "Verschillende soorten",
            type: "distinct",
            property: "BOOMSORTIMENT",
          },
          { label: "Wijken", type: "distinct", property: "WIJK" },
          { label: "Hoogteklassen", type: "distinct", property: "HOOGTE" },
        ],
      },
      {
        kind: "category-bar",
        title: "Bomen per hoogteklasse in {city}",
        description:
          "Veld HOOGTE: de geschatte hoogteklasse van de boom",
        property: "HOOGTE",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten in {city}",
        description:
          "Veld BOOMSORTIMENT: de botanische soort/cultivar van de boom",
        property: "BOOMSORTIMENT",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één geregistreerde boom in gemeentelijk beheer, met soort (*BOOMSORTIMENT*), hoogteklasse (*HOOGTE*, in banden zoals \"<6 m.\" of \"18-24 m.\") en aanlegjaar. Grote, oude bomen en jonge straatbomen staan zo naast elkaar op de kaart. Bomen op particuliere grond staan er niet in.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: bomen geven schaduw en verkoeling; het aandeel grote kroonbomen bepaalt hoeveel hitte een straat opvangt.\n- **Soortenspreiding**: een gevarieerd bomenbestand is robuuster tegen ziekten en plagen — een dominante soort is juist kwetsbaar.\n- **Beheer en veiligheid**: leeftijd en hoogte sturen de snoei- en controlecyclus.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De bomenkaart komt uit de beheerregistratie van {city}. De kaart laadt een deel van het totale bestand, dus de soorten- en hoogteverdeling hieronder is een indicatie op basis van de geladen selectie, niet de volledige boominventaris. De hoogteklasse is een schatting, geen exacte meting.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-buurtpreventie",
    title: "Buurtpreventieteams in {city}",
    subtitle: "Werkgebieden van vrijwillige buurtpreventiegroepen",
    intro:
      "Deze laag toont **{count} werkgebieden** van buurtpreventieteams in {city}. Buurtpreventie is bewonersinitiatief: vrijwilligers houden samen een oogje op hun buurt en werken samen met gemeente, politie en handhaving. Elk vlak is het gebied waarbinnen een team actief is; klik erop voor de naam en contactgegevens.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Werkgebieden in beeld", type: "count" },
          { label: "Teams (unieke namen)", type: "distinct", property: "NAAM" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk polygoon markeert het gebied van één buurtpreventieteam, met de teamnaam (*NAAM*) en een contact-e-mailadres. De teams dekken samen de buurten waar bewoners zich hebben georganiseerd; witte plekken op de kaart zijn buurten zonder (geregistreerd) team.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sociale veiligheid**: actieve buurtpreventie verlaagt gevoelens van onveiligheid en versnelt meldingen.\n- **Samenwerking**: de gebieden helpen gemeente en politie om contactpersonen per buurt te vinden.\n- **Participatie**: de dekkingsgraad laat zien waar bewonersbetrokkenheid sterk is en waar ondersteuning kan helpen.",
      },
      {
        heading: "Over de bron",
        body: "De werkgebieden worden bijgehouden door de gemeente {city} in samenspraak met de teams. Omdat het om vrijwilligersgroepen gaat, wisselt de dekking in de tijd. Deze laag toont gebieden, geen individuele deelnemers.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-corporatiebezit",
    title: "Corporatiebezit in {city}",
    subtitle: "Woningen in eigendom van woningcorporaties",
    intro:
      "Deze laag toont **{count} objecten** die in {city} eigendom zijn van woningcorporaties. Sociale huurwoningen vormen een belangrijk deel van de woningvoorraad; deze kaart laat zien waar dat corporatiebezit ruimtelijk geconcentreerd is. Klik op een vlak om de locatie te bekijken.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Objecten in corporatiebezit", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een pand of woningobject dat aan een woningcorporatie toebehoort. De laag bevat de geometrie zonder verdere kenmerken per woning; de waarde zit in het ruimtelijke patroon — waar clusteren sociale huurwoningen en waar juist niet.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Volkshuisvesting**: de spreiding van corporatiebezit is een kernindicator voor de betaalbare woningvoorraad en gemengde wijken.\n- **Prestatieafspraken**: gemeente en corporaties maken jaarlijks afspraken over nieuwbouw, verduurzaming en verkoop; deze kaart is daarvoor een feitelijke basis.\n- **Wijkaanpak**: concentraties sociale huur wijzen vaak op wijken waar leefbaarheid en verduurzaming extra aandacht krijgen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de open-data omgeving van {city}. De laag bevat geen woningkenmerken (zoals corporatienaam of woningtype), dus deze storymap beperkt zich tot het aantal en de ligging binnen de kaartuitsnede.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-drinkwaterpunten",
    title: "Openbare drinkwaterpunten in {city}",
    subtitle: "Watertappunten in de openbare ruimte",
    intro:
      "In {city} zijn **{count} openbare drinkwaterpunten** in beeld: watertappunten waar iedereen gratis vers drinkwater kan tappen. Elk punt heeft een korte beschrijving van de locatie en een type dat aangeeft of het punt altijd of alleen overdag bereikbaar is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Drinkwaterpunten in beeld", type: "count" },
          {
            label: "24/7 bereikbaar",
            type: "count-where",
            property: "TYPE",
            equals: "Regulier, 24-7 open",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bereikbaarheid van de drinkwaterpunten in {city}",
        description: "Veld TYPE: wanneer het tappunt toegankelijk is",
        property: "TYPE",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een openbaar tappunt met vers drinkwater. Het veld *TYPE* onderscheidt punten die dag en nacht open zijn van punten die alleen overdag bereikbaar zijn (bijvoorbeeld binnen een gebouw of afgesloten terrein). Het veld *BESCHRIJVI* geeft een herkenbare locatieomschrijving.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid en hitte**: bij warm weer helpen tappunten mensen om gehydrateerd te blijven — relevant voor het hittebeleid.\n- **Plastic reductie**: gratis kraanwater vermindert het gebruik van wegwerpflesjes.\n- **Voorzieningenspreiding**: de kaart laat zien of tappunten goed verdeeld zijn over drukke plekken, parken en routes.",
      },
      {
        heading: "Over de bron",
        body: "De drinkwaterpunten worden door de gemeente {city} bijgehouden en via open data ontsloten. De kaart toont de punten binnen de kaartuitsnede.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-energielabels",
    title: "Energielabels van gebouwen in {city}",
    subtitle: "Geregistreerde energieprestatie per pand (EP-online)",
    intro:
      "Deze laag toont **{count} panden met een energielabel** in {city} (uit een totaal van circa 42.000). Het energielabel loopt van **G** (zeer onzuinig) tot **A en hoger** (zeer zuinig, tot A+++++). Omdat het volledige bestand groot is, laadt de kaart een selectie; de verdeling hieronder gaat over die geladen panden.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Panden met label in beeld", type: "count" },
          {
            label: "Verschillende labelklassen",
            type: "distinct",
            property: "ENERGIEKLASSE",
          },
          {
            label: "Label A of groener (aandeel)",
            type: "count-where",
            property: "ENERGIEKLASSE",
            equals: ["A", "A+", "A++", "A+++", "A++++", "A+++++"],
            asShare: true,
          },
          {
            label: "Label F of G",
            type: "count-where",
            property: "ENERGIEKLASSE",
            equals: ["F", "G"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Verdeling van energielabels in {city}",
        description:
          "Veld ENERGIEKLASSE: het geregistreerde energielabel van het pand",
        property: "ENERGIEKLASSE",
        maxCategories: 12,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een pand met een geldig, geregistreerd energielabel. Het label (*ENERGIEKLASSE*) drukt de energieprestatie uit: hoe zuiniger het gebouw, hoe hoger de letter, met meerdere plus-klassen (A+ t/m A+++++) voor de zuinigste nieuwbouw en gerenoveerde panden. Panden zónder geregistreerd label ontbreken op de kaart.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verduurzaming**: het aandeel slechte labels (F en G) laat zien waar de grootste winst met isolatie en warmtemaatregelen te halen is.\n- **Woonlasten**: een beter label betekent doorgaans lagere energierekeningen — relevant voor betaalbaarheid en energiearmoede.\n- **Wijkaanpak**: clustering van slechte labels helpt bij het prioriteren van buurten voor de warmtetransitie.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De labels zijn afkomstig uit EP-online, het landelijke register van energielabels, ontsloten via de open-data omgeving van {city}. De kaart laadt een deel van het volledige bestand; de labelverdeling hieronder is daarom een indicatie op basis van de geladen panden. Een label geldt een aantal jaren en beschrijft de situatie op het moment van afgifte.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-fietsenstallingen",
    title: "Bewaakte fietsenstallingen in {city}",
    subtitle: "Locaties waar je je fiets bewaakt kunt stallen",
    intro:
      "Deze laag toont **{count} bewaakte fietsenstallingen** in {city}: plekken waar fietsers hun fiets onder toezicht kunnen achterlaten. Elke stalling heeft een naam en een volledig adres. Klik op een punt voor de locatiegegevens.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bewaakte stallingen in beeld", type: "count" },
          { label: "Verschillende stallingen", type: "distinct", property: "NAAM" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een bewaakte fietsenstalling met een naam (*NAAM*) en adres. Bewaakte stallingen bieden meer zekerheid tegen diefstal dan open fietsklemmen en liggen vooral in en rond het centrum en bij drukke bestemmingen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fietsbeleid**: goede stallingsvoorzieningen stimuleren fietsgebruik en houden de openbare ruimte vrij van gestalde fietsen.\n- **Binnenstad**: bewaakte stallingen verminderen fietsdiefstal en wildparkeren in het kernwinkelgebied.\n- **Ketenmobiliteit**: combineer deze laag met OV-haltes om de fiets-OV-overstap te beoordelen.",
      },
      {
        heading: "Over de bron",
        body: "De gemeente {city} houdt de bewaakte stallingen bij en ontsluit ze via open data. De kaart toont de stallingen binnen de kaartuitsnede.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-geologie",
    title: "Geologie van {city}",
    subtitle: "Bodemeenheden aan of nabij het oppervlak",
    intro:
      "Deze laag verdeelt {city} in **{count} geologische eenheden**: gebieden met een vergelijkbare opbouw van de ondergrond, zoals klei-, veen- of zandpakketten. Elke eenheid heeft een korte omschrijving en een uitgebreidere bodemtypering. Klik op een vlak voor de eenheid en de bijbehorende beschrijving.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Geologische eenheden in beeld", type: "count" },
          { label: "Verschillende omschrijvingen", type: "distinct", property: "Omschrijvi" },
          { label: "Bodemtyperingen", type: "distinct", property: "Soort_bode" },
        ],
      },
      {
        kind: "category-bar",
        title: "Geologische eenheden in {city}",
        description:
          "Veld Omschrijvi: de korte typering van de bodemeenheid",
        property: "Omschrijvi",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk polygoon is een gebied met een bepaalde opbouw van de ondergrond. Het veld *Omschrijvi* geeft de korte naam (bijvoorbeeld \"Water\"), en *Soort_bode* beschrijft de bodemopbouw uitgebreider — zoals kleipakketten door overstromingen afgezet, of veen dat soms met een dun laagje klei is afgedekt. Zo lees je af waar de ondergrond zandig, kleiig of venig is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bodemdaling**: veengronden klinken in en zijn zettingsgevoelig — bepalend voor funderingen, wegen en riolering.\n- **Water**: de bodemopbouw stuurt de infiltratie en waterberging, relevant bij klimaatadaptatie.\n- **Bouwen**: draagkracht en grondwaterstand verschillen sterk per eenheid en beïnvloeden bouwkosten en funderingskeuze.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De geologische kaart komt uit onderzoek dat via de open-data omgeving van {city} wordt ontsloten (met verwijzing naar het onderliggende rapport per eenheid). Het is een gegeneraliseerd beeld op gebiedsniveau; voor een concrete locatie blijft lokaal grondonderzoek nodig.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-hagen",
    title: "Hagen in {city}",
    subtitle: "Gemeentelijk beheerde hagen naar hoogteklasse",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} hagen** geladen uit de groenbeheerregistratie. Hagen zijn groene lijnelementen die de gemeente knipt en onderhoudt; ze worden ingedeeld naar hoogteklasse. Klik op een haag voor de beheergroep en het onderhoudsregime.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Hagen in beeld", type: "count" },
          {
            label: "Totaal knipoppervlak",
            type: "sum",
            property: "KNIPOPPERVLAK",
            unit: "m²",
            decimals: 0,
          },
          { label: "Wijken", type: "distinct", property: "WIJK" },
          { label: "Hoogteklassen", type: "distinct", property: "BEHEERGROEP" },
        ],
      },
      {
        kind: "category-bar",
        title: "Hagen per hoogteklasse in {city}",
        description:
          "Veld BEHEERGROEP: de hoogtecategorie die het knipwerk bepaalt",
        property: "BEHEERGROEP",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk element is een geregistreerde haag in gemeentelijk beheer. De **beheergroep** (*BEHEERGROEP*) deelt hagen in naar hoogte — tot 1 meter, van 1 tot 1,5 meter, en hoger dan 1,5 meter — omdat dat bepaalt hoe vaak en hoe intensief er geknipt wordt. Het *knipoppervlak* is het te onderhouden bladoppervlak.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheerkosten**: het totale knipoppervlak per hoogteklasse is direct te vertalen naar onderhoudsinzet.\n- **Groenstructuur**: hagen begeleiden zichtlijnen, schermen af en verbinden groenelementen tot een netwerk.\n- **Biodiversiteit**: hagen bieden dekking en voedsel voor vogels en insecten in de stad.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de groenbeheerregistratie (BOR) van {city}. Grote lagen worden tot een maximum geladen; de cijfers gaan over de geladen selectie binnen de kaartuitsnede. Niet bij elke haag is een lengte of knipoppervlak ingevuld — ontbrekende waarden tellen niet mee in de som.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-milieuzone",
    title: "Milieuzone in {city}",
    subtitle: "Het gebied met toegangsregels voor vervuilende voertuigen",
    intro:
      "Deze laag toont de **milieuzone** van {city}: het afgebakende gebied waarbinnen toegangsregels gelden voor vervuilende voertuigen. Binnen de zone mogen bepaalde (oudere, meer uitstotende) voertuigen niet of beperkt rijden, om de luchtkwaliteit in het drukke centrumgebied te verbeteren. Op de kaart staan **{count} zonevlakken**.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Zonevlakken in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het gekleurde vlak is de begrenzing van de milieuzone. De laag bevat de geometrie van de zone; welke voertuigcategorieën precies geweerd worden en welke uitzonderingen gelden, staat in de bijbehorende verkeersbesluiten van {city}.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Luchtkwaliteit**: milieuzones weren de meest vervuilende voertuigen uit het drukste gebied en verlagen zo de uitstoot van fijnstof en stikstofoxiden.\n- **Handhaving en communicatie**: de exacte grens is nodig voor bebording, camerahandhaving en heldere informatie aan bezoekers en ondernemers.\n- **Mobiliteitsbeleid**: de zone hangt samen met bredere keuzes over autoluwe binnensteden en schoon vervoer.",
      },
      {
        heading: "Over de bron",
        body: "De milieuzone wordt door de gemeente {city} vastgesteld en via open data ontsloten. Voor de actuele toegangsvoorwaarden zijn de gemeentelijke verkeersbesluiten leidend.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-monumenten",
    title: "Monumenten in {city}",
    subtitle: "Rijks- en gemeentelijke monumenten",
    intro:
      "Deze laag toont **{count} monumenten** in {city}: beschermde objecten met een bijzondere cultuurhistorische waarde. Ze zijn opgesplitst in **rijksmonumenten** (landelijk beschermd) en **gemeentelijke monumenten** (door de gemeente aangewezen). Klik op een object voor de naam en het adres.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Monumenten in beeld", type: "count" },
          {
            label: "Rijksmonumenten",
            type: "count-where",
            property: "TYPE",
            equals: "Rijks",
          },
          {
            label: "Gemeentelijke monumenten",
            type: "count-where",
            property: "TYPE",
            equals: "Gemeente",
          },
          {
            label: "Monumentale bruggen",
            type: "count-where",
            property: "BRUG",
            equals: "ja",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Monumenten naar beschermingsstatus in {city}",
        description: "Veld TYPE: rijks- versus gemeentelijke bescherming",
        property: "TYPE",
        valueLabels: {
          Rijks: "Rijksmonument",
          Gemeente: "Gemeentelijk monument",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk object is een beschermd monument met een naam (*OBJECTNAAM*) en adres. Het veld *TYPE* onderscheidt rijksmonumenten van gemeentelijke monumenten; het veld *BRUG* markeert monumentale bruggen. In de historische binnenstad van {city} liggen de monumenten dicht op elkaar.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Erfgoedbescherming**: de status bepaalt welke ingrepen vergunningplichtig zijn en hoe streng ze worden getoetst.\n- **Ruimtelijke kwaliteit**: de dichtheid aan monumenten typeert het historische karakter van een gebied en stuurt welstands- en restauratiebeleid.\n- **Toerisme en identiteit**: monumenten zijn dragers van de lokale identiteit en een economische trekpleister.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De monumentengegevens worden door de gemeente {city} bijgehouden en via open data ontsloten (rijksmonumenten sluiten aan op het landelijke Rijksmonumentenregister). De statistieken gaan over de objecten binnen de kaartuitsnede.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-parkeerautomaten",
    title: "Parkeerautomaten in {city}",
    subtitle: "Locaties van betaalautomaten voor straatparkeren",
    intro:
      "Deze laag toont **{count} parkeerautomaten** in {city}: de betaalautomaten waar automobilisten hun straatparkeren afrekenen. Elke automaat heeft een omschrijving van de standplaats (meestal de straat of kruising). Klik op een punt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Parkeerautomaten in beeld", type: "count" },
          { label: "Verschillende standplaatsen", type: "distinct", property: "OMS" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een fysieke parkeerautomaat met een locatieomschrijving (*OMS*), zoals een straatnaam of kruising. De automaten staan in de gebieden waar betaald parkeren geldt; hun spreiding volgt dus de gereguleerde parkeergebieden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Parkeerbeleid**: de dichtheid en ligging van automaten laten zien waar betaald straatparkeren wordt gehandhaafd.\n- **Dienstverlening**: bij storing of onderhoud is de exacte locatie van elke automaat nodig.\n- **Transitie naar digitaal**: het aantal fysieke automaten daalt naarmate betalen via app toeneemt — de kaart maakt die ontwikkeling zichtbaar.",
      },
      {
        heading: "Over de bron",
        body: "De parkeerautomaten worden door de gemeente {city} beheerd en via open data ontsloten. De kaart toont de automaten binnen de kaartuitsnede.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-parkeergebieden",
    title: "Gereguleerde parkeergebieden in {city}",
    subtitle: "Vergunningzones voor straatparkeren",
    intro:
      "Deze laag toont **{count} parkeergebieden** in {city}: de zones waarbinnen straatparkeren gereguleerd is via vergunningen en betaald parkeren. Elk gebied heeft een eigen zonecode. Klik op een vlak voor de code van die zone.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Parkeergebieden in beeld", type: "count" },
          { label: "Zonecodes", type: "distinct", property: "roof_id" },
          { label: "Gebiedscodes", type: "distinct", property: "GEBIED_COD" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk polygoon is een gereguleerd parkeergebied met een zonecode (*roof_id*, bijvoorbeeld A, B of C) en een gebiedscode (*GEBIED_COD*). Binnen zo'n zone gelden specifieke regels voor bewoners- en bezoekersvergunningen en tarieven. De zones bepalen samen waar in {city} betaald of met vergunning geparkeerd wordt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Parkeerdruk**: het reguleren van zones stuurt de parkeerdruk en voorkomt uitwijkgedrag naar aangrenzende buurten.\n- **Vergunningbeleid**: de zone-indeling is de basis voor welke vergunning waar geldig is.\n- **Ruimtegebruik**: minder zoekverkeer en dubbelgeparkeerde auto's maken de straat veiliger en aangenamer.",
      },
      {
        heading: "Over de bron",
        body: "De parkeergebieden worden door de gemeente {city} vastgesteld en via open data ontsloten. Voor de exacte regels en tarieven per zone zijn de gemeentelijke parkeerverordening en -besluiten leidend.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-speelplekken",
    title: "Speelplekken in {city}",
    subtitle: "Openbare speel-, trap- en sportvoorzieningen",
    intro:
      "Deze laag toont **{count} speelplekken** in {city}: openbare plekken waar kinderen en jongeren kunnen spelen en sporten, van speelplaatsen en trapvelden tot skateparken en fitnesspunten. Elke plek heeft een naam en een aanduiding van het type voorziening.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Speelplekken in beeld", type: "count" },
          {
            label: "Reguliere speelplaatsen",
            type: "count-where",
            property: "Aanduiding",
            equals: "Speelplaats",
          },
          { label: "Types voorziening", type: "distinct", property: "Aanduiding" },
        ],
      },
      {
        kind: "category-bar",
        title: "Speelplekken per type in {city}",
        description: "Veld Aanduiding: het type speel- of sportvoorziening",
        property: "Aanduiding",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een openbare speel- of sportplek. Het veld *Aanduiding* geeft het type: de meeste plekken zijn reguliere *speelplaatsen*, daarnaast zijn er *trapvelden*, *speel/trap*-combinaties, basketbal- en korfbalvelden, een skatepark en enkele fitnessplekken. Waar bekend staat ook het bouw- of renovatiejaar geregistreerd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Leefbaarheid voor gezinnen**: een goede spreiding van speelplekken maakt buurten aantrekkelijk voor gezinnen met kinderen.\n- **Bewegen en gezondheid**: trapvelden, sport- en fitnessplekken stimuleren bewegen in de buurt.\n- **Onderhoud en vervanging**: bouw- en renovatiejaren helpen om verouderde toestellen tijdig te vervangen.",
      },
      {
        heading: "Over de bron",
        body: "De speelplekken worden door de gemeente {city} beheerd en via open data ontsloten. De kaart toont de plekken binnen de kaartuitsnede.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-stadsgezichten",
    title: "Beschermde stadsgezichten in {city}",
    subtitle: "Gebieden met een beschermd historisch karakter",
    intro:
      "Deze laag toont **{count} beschermde stadsgezichten** in {city}: samenhangende gebieden waarvan het historische karakter — de structuur van straten, water en bebouwing — als geheel beschermd is. Anders dan een los monument gaat het hier om het beeld van een héél gebied. Klik op een vlak voor de naam.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Beschermde stadsgezichten in beeld", type: "count" },
          { label: "Verschillende gebieden", type: "distinct", property: "NAAM" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak begrenst een beschermd stadsgezicht met een eigen naam (*NAAM*), zoals een historische wijk of buurt. De bescherming richt zich op het samenhangende beeld: het stratenpatroon, de gracht- en pleinstructuur en de schaal van de bebouwing, meer nog dan op afzonderlijke panden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke kwaliteit**: binnen een beschermd stadsgezicht toetst de gemeente ingrepen strenger, zodat het historische beeld behouden blijft.\n- **Planvorming**: de begrenzing is nodig om te weten waar aangescherpte regels voor verbouw en nieuwbouw gelden.\n- **Identiteit**: de historische structuur van {city} is een belangrijke drager van de aantrekkelijkheid van de stad.",
      },
      {
        heading: "Over de bron",
        body: "De beschermde stadsgezichten worden door de gemeente {city} vastgesteld en via open data ontsloten. Voor de precieze bescherming en regels zijn de aanwijzingsbesluiten en het omgevingsplan leidend.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-voetgangersnetwerk",
    title: "Voetgangersnetwerk (hoofdnet) in {city}",
    subtitle: "De belangrijkste looproutes van de stad",
    intro:
      "Deze laag tekent **{count} schakels** van het hoofdnet voor voetgangers in {city}: de belangrijkste, samenhangende looproutes die de stad voor voetgangers ontsluiten. Waar het volledige stoepennet fijnmazig is, richt het hoofdnet zich op de dragende routes tussen buurten en bestemmingen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Schakels in beeld", type: "count" },
          {
            label: "Totale lengte hoofdnet",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gemiddelde schakellengte",
            type: "avg",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Lengteverdeling van de schakels in {city}",
        description:
          "Korte schakels horen bij kruisingen en oversteken, lange bij doorgaande looproutes",
        property: "Shape__Length",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een schakel in het voetgangershoofdnet: een stuk looproute tussen twee knooppunten. Samen vormen de schakels het geraamte waarlangs voetgangers zich door {city} bewegen. De lengte per schakel (*Shape__Length*) laat zien of het om een korte oversteek of een lange doorgaande route gaat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toegankelijkheid**: een compleet en logisch hoofdnet is essentieel voor voetgangers, en zeker voor mensen met een beperking.\n- **Verkeersveiligheid**: het netwerk laat zien waar veilige oversteken en obstakelvrije routes nodig zijn.\n- **Gezonde stad**: comfortabel lopen stimuleert bewegen en ondersteunt levendige, autoluwe straten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Het hoofdnet wordt door de gemeente {city} vastgesteld en via open data ontsloten. De lengtes zijn de geregistreerde geometrische lengtes; schakels die de rand van de kaartuitsnede kruisen tellen mee met hun volledige lengte, waardoor het totaal iets kan afwijken van de lengte strikt binnen het beeld.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
  {
    layerId: "delft-zonnepanelen",
    title: "Zonnepanelen in {city}",
    subtitle: "Uit luchtfoto's gedetecteerde zonnepanelen",
    intro:
      "Deze laag toont **{count} gedetecteerde zonnepanelen** in {city} (uit een totaal van circa 157.000). De panelen zijn automatisch herkend op luchtfoto's; bij elk paneel hoort het *jaar* waarin het op de luchtfoto is vastgesteld. Omdat het volledige bestand enorm groot is, laadt de kaart een selectie; de cijfers hieronder gaan over die geladen panelen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Panelen in beeld", type: "count" },
          {
            label: "Vroegste detectiejaar",
            type: "min",
            property: "JAAR",
            decimals: 0,
          },
          {
            label: "Recentste detectiejaar",
            type: "max",
            property: "JAAR",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zonnepanelen per detectiejaar in {city}",
        description:
          "Veld JAAR: het jaar van de luchtfoto waarop het paneel is herkend",
        property: "JAAR",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één op een luchtfoto herkend zonnepaneel. Het veld *JAAR* geeft het jaar van de luchtfoto waarop het paneel is gedetecteerd — een indicatie van wanneer het paneel er (uiterlijk) lag, niet noodzakelijk het exacte plaatsingsjaar. Op daken met veel panelen liggen de stippen dicht opeen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energietransitie**: de dichtheid en groei van zonnepanelen laten zien hoe snel {city} verduurzaamt.\n- **Netcapaciteit**: veel opwek op één plek belast het elektriciteitsnet; de kaart helpt knelpunten in beeld te brengen.\n- **Beleid en monitoring**: de detectie per jaar maakt de toename van zon-op-dak meetbaar zonder afhankelijk te zijn van aanmeldingen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De panelen komen uit een automatische beelddetectie op luchtfoto's, ontsloten via de open-data omgeving van {city}. De kaart laadt slechts een deel van het zeer grote bestand; de verdeling per detectiejaar is daarom een indicatie op basis van de geladen selectie. Beelddetectie kan panelen missen of dakramen en lichtkoepels voor panelen aanzien — zie de cijfers als een goede benadering, geen exacte telling.",
      },
    ],
    links: [{ label: "Open data Delft", url: OPEN_DATA_DELFT }],
  },
];
