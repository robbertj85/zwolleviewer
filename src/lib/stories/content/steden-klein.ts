/**
 * Story maps — batch "steden-klein".
 *
 * Gemeentelijke lagen van Apeldoorn (apd-*), Helmond (hlm-*) en Amersfoort
 * (amf-*). Elke laag is alleen zichtbaar in de eigen gemeente; de teksten
 * gebruiken {city}/{count} zodat hetzelfde verhaal automatisch de lokale
 * situatie toont.
 *
 * Lagen: apd-bodemkwaliteit, apd-bodemkwaliteit-zone-bovengrond,
 * apd-ondergrond-percelen, apd-peilbuizen, apd-riool-putten,
 * apd-riool-vrijverval, apd-riool-persleiding, apd-kabel-laagspanning,
 * hlm-riool-huisaansluitingen, hlm-warmtenet, amf-snoeproutes.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "apd-bodemkwaliteit",
    title: "Bodemkwaliteitskaart van {city}",
    subtitle:
      "Bodemfunctieklassen en toepassingseisen uit de regionale bodemkwaliteitskaart OVIJ 2022",
    intro:
      "Deze laag deelt {city} op in **{count} bodemvlakken** volgens de regionale bodemkwaliteitskaart (OVIJ 2022). Elk vlak heeft een bodemfunctieklasse — *Wonen*, *Industrie*, *Landbouw-natuur* of *Water* — en per bodemlaag (boven-, tussen- en ondergrond) de ontgravings-, toepassings- en toetsingsklasse. Zo zie je in één beeld welke grondkwaliteit waar geldt en welke eisen gelden als je grond wilt hergebruiken.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          {
            label: "Woonfunctie (aandeel)",
            type: "count-where",
            property: "FUNCTIE",
            equals: "Wonen",
            asShare: true,
          },
          {
            label: "Industriefunctie",
            type: "count-where",
            property: "FUNCTIE",
            equals: "Industrie",
          },
          {
            label: "Bodemkwaliteitszones",
            type: "distinct",
            property: "NAAM_ZONE_BG",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemfunctieklassen in {city}",
        description:
          "Veld FUNCTIE: de bodemfunctie waarvoor het vlak is ingedeeld",
        property: "FUNCTIE",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Toepassingseis bovengrond (gebiedsspecifiek)",
        description:
          "Veld TOE_GEB_BG: de gebiedsspecifieke toepassingsklasse voor de bovengrond",
        property: "TOE_GEB_BG",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een **bodemkwaliteitszone**: een gebied waarbinnen de bodem gemiddeld een vergelijkbare kwaliteit heeft. De *functieklasse* (FUNCTIE) beschrijft waarvoor de bodem geschikt geacht wordt, terwijl de *ontgravings-* en *toepassingsklassen* per bodemlaag (bovengrond BG, tussenlaag TL, ondergrond OG) bepalen hoe schone of licht verontreinigde grond hergebruikt mag worden. De kaart onderscheidt de generieke landelijke normen van *gebiedsspecifieke* Lokale Maximale Waarden die de regio zelf heeft vastgesteld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Grondverzet**: bij bouw- en infraprojecten bepaalt de bodemkwaliteitskaart of vrijkomende grond ter plaatse hergebruikt mag worden of moet worden afgevoerd — dat scheelt fors in kosten.\n- **Vergunningen**: de kaart is het wettelijke bewijsmiddel onder het Besluit bodemkwaliteit; toepassen van grond wordt eraan getoetst.\n- **Ruimtelijke plannen**: de functieklasse laat zien of de bodem past bij een beoogd gebruik (bijvoorbeeld wonen op een voormalig industrieterrein).",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de *Regionale bodemkwaliteitskaart OVIJ 2022* van de gemeente {city}, ontsloten via haar eigen ArcGIS. Enkele kanttekeningen:\n- De kwaliteitskaart is een **statistisch gemiddelde** per zone: een individuele locatie kan afwijken, bij twijfel is bodemonderzoek leidend.\n- De statistieken gaan over de kaartuitsnede; zones aan de rand kunnen buurgemeenten raken.\n- Zones die vooral tot naburige gemeenten behoren, dragen hun eigen naam (veld NAAM_ZONE_BG).",
      },
    ],
    links: [
      {
        label: "{city}: Besluit bodemkwaliteit",
        url: "https://www.apeldoorn.nl/wonen-en-leven/verbouwen-en-milieu/milieu/besluit-bodemkwaliteit",
      },
      {
        label: "Regionale nota bodembeheer (OVIJ)",
        url: "https://www.apeldoorn.nl/fl-regionale-nota-bodembeheer",
      },
    ],
  },
  {
    layerId: "apd-bodemkwaliteit-zone-bovengrond",
    title: "Bodemkwaliteitszones bovengrond in {city}",
    subtitle:
      "Zone-indeling van de bovengrond (B1, B2, …) met bijbehorende ontgravings- en toepassingseisen",
    intro:
      "Deze laag toont de **bovengrond-zonekaart** van {city}: **{count} vlakken** die de bovenste bodemlaag indelen in kwaliteitszones (B1, B2, B3, …). Waar de algemene bodemkwaliteitskaart vooral de functie laat zien, zoomt deze laag in op de zonecode van de bovengrond — de laag die je als eerste raakt bij graven en waar hergebruik van grond het vaakst speelt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zonevlakken in beeld", type: "count" },
          { label: "Unieke zonecodes", type: "distinct", property: "ZONE_BG" },
          {
            label: "Woonfunctie",
            type: "count-where",
            property: "FUNCTIE",
            equals: "Wonen",
          },
          {
            label: "Bodemkwaliteitszones",
            type: "distinct",
            property: "NAAM_ZONE_BG",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zonecodes bovengrond in {city}",
        description:
          "Veld ZONE_BG: de kwaliteitszone-code van de bovengrond (B1, B2, …)",
        property: "ZONE_BG",
        maxCategories: 10,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak draagt een **zonecode** (ZONE_BG) die staat voor een gemiddelde kwaliteit van de bovengrond binnen dat gebied. Een lage code hoort meestal bij schonere zones (natuur, jongere woonwijken), hogere codes bij oudere bebouwing of (voormalige) bedrijvigheid. Aan elke zone hangen vaste ontgravings- en toepassingsklassen, zodat de kaart direct antwoord geeft op de vraag: mag grond uit deze zone elders worden toegepast?",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Praktisch grondverzet**: de bovengrond is de laag die bij nagenoeg elk graafwerk vrijkomt; de zonecode bepaalt of die grond hergebruikt of afgevoerd wordt.\n- **Kostenraming**: vroeg weten in welke zone je zit, voorkomt verrassingen in het budget van een project.\n- **Beheer**: het aantal en de spreiding van zones zegt iets over de historische diversiteit van het bodemgebruik in de gemeente.",
      },
      {
        heading: "Over de bron",
        body: "De zonekaart is onderdeel van de *Regionale bodemkwaliteitskaart OVIJ 2022* van {city}. De zone-indeling is een generalisatie: ze beschrijft de gemiddelde situatie, geen perceelscherpe waarheid. De statistieken gaan over de kaartuitsnede en kunnen zones van buurgemeenten meenemen.",
      },
    ],
    links: [
      {
        label: "{city}: Besluit bodemkwaliteit",
        url: "https://www.apeldoorn.nl/wonen-en-leven/verbouwen-en-milieu/milieu/besluit-bodemkwaliteit",
      },
      {
        label: "Regionale nota bodembeheer (OVIJ)",
        url: "https://www.apeldoorn.nl/fl-regionale-nota-bodembeheer",
      },
    ],
  },
  {
    layerId: "apd-ondergrond-percelen",
    title: "Eigendom van de ondergrond in {city}",
    subtitle:
      "Percelen met geregistreerde eigenaar rond meldingen over de ondergrond (EPR)",
    intro:
      "Deze laag toont **{count} percelen** in {city} met hun geregistreerde eigenaar, gekoppeld aan de meldingenregistratie over de ondergrond (EPR). Elke kleurvlek is een kadastraal perceel; het veld *EIGENAAR* laat zien wie de grond bezit — van particulieren en woningcorporaties tot de gemeente, het waterschap en het Rijk. Zo zie je in één beeld hoe het grondeigendom onder de stad verdeeld is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Percelen in beeld", type: "count" },
          {
            label: "Particulier bezit (aandeel)",
            type: "count-where",
            property: "EIGENAAR",
            equals: "Particulier bezit",
            asShare: true,
          },
          {
            label: "Gemeentelijk bezit",
            type: "count-where",
            property: "EIGENAAR",
            equals: "Gemeente Apeldoorn",
          },
          {
            label: "Type eigenaren",
            type: "distinct",
            property: "EIGENAAR",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Grondeigendom naar type eigenaar in {city}",
        description:
          "Veld EIGENAAR: de geregistreerde eigenaarscategorie per perceel",
        property: "EIGENAAR",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een **perceel** met één eigenaarscategorie. De registratie onderscheidt onder meer *particulier bezit*, *gemeente*, *woningbouwvereniging*, *de staat*, het *waterschap* en de *provincie*. De laag is bedoeld voor vraagstukken rond de ondergrond (kabels, leidingen, bodemenergie, grondwater): wie eigenaar is, bepaalt met wie je moet afstemmen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Regie op de ondergrond**: de ondergrond raakt steeds voller (warmtenetten, kabels, bodemenergie); weten wie de grond bezit is de eerste stap in het ordenen daarvan.\n- **Verwerving en ontwikkeling**: het aandeel gemeentelijk bezit laat zien hoeveel sturingsruimte de gemeente zelf heeft bij gebiedsontwikkeling.\n- **Beheer**: de mix van corporatie-, particulier en publiek bezit typeert een wijk en de wijze waarop je bewoners bereikt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De percelen komen uit de EPR-registratie ondergrond van de gemeente {city}. Let op:\n- Dit is een **grote laag**; in de standaardweergave wordt een deel van de percelen geladen. Gebruik *Volledig laden* voor het complete beeld — de aandelen hierboven gaan over de nu geladen selectie.\n- De eigenaarscategorie is een momentopname uit de bronregistratie en kan achterlopen op recente transacties.\n- De kaartuitsnede kan percelen van buurgemeenten bevatten.",
      },
    ],
    links: [
      {
        label: "Gemeente {city} — open GIS",
        url: "https://gis.apeldoorn.nl/arcgis/rest/services/EPR_meldingen_ondergrond/FeatureServer",
      },
    ],
  },
  {
    layerId: "apd-peilbuizen",
    title: "Grondwater-peilbuizen in {city}",
    subtitle:
      "Het gemeentelijke grondwatermeetnet met laatst gemeten grondwaterniveaus",
    intro:
      "Deze laag toont **{count} peilbuizen** van het grondwatermeetnet van {city}. Elke buis meet automatisch de grondwaterstand; per punt zie je het laatst gemeten niveau (in cmNAP), de temperatuur en meerjarige kengetallen zoals de gemiddelde hoogste en laagste grondwaterstand. Zo maakt het meetnet zichtbaar hoe diep het grondwater onder de stad staat en hoe sterk het fluctueert.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Peilbuizen in beeld", type: "count" },
          {
            label: "Gem. grondwaterniveau",
            type: "median",
            property: "GRONDWATERNIVEAU",
            unit: "cmNAP",
            decimals: 0,
          },
          {
            label: "Gem. watertemperatuur",
            type: "avg",
            property: "TEMPERATUUR",
            unit: "°C",
            decimals: 1,
          },
          {
            label: "Gem. fluctuatie (8 jr)",
            type: "avg",
            property: "BEREIK_GRONDWATERSTAND_8JR",
            unit: "cm",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het grondwaterniveau in {city}",
        description:
          "Veld GRONDWATERNIVEAU: het laatst gemeten niveau per buis in cmNAP — de spreiding weerspiegelt het hoogteverschil binnen de gemeente",
        property: "GRONDWATERNIVEAU",
        unit: "cmNAP",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een **peilbuis**: een verticale buis met een filter waarin de grondwaterstand wordt gemeten, uitgedrukt in **cmNAP** (centimeters ten opzichte van Normaal Amsterdams Peil). Omdat {city} deels op de flank van een stuwwal ligt, lopen de gemeten niveaus sterk uiteen — hoog op de hogere gronden, lager in de beekdalen. Het veld *bereik grondwaterstand (8 jaar)* geeft per buis aan hoeveel het grondwater over acht jaar heeft geschommeld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: grondwaterstanden bepalen mede de kans op wateroverlast (te hoog) én droogteschade en funderingsproblemen (te laag).\n- **Bouwen en beheer**: bij nieuwbouw, kelders en ondergrondse infra is de grondwaterstand een harde ontwerpparameter.\n- **Monitoring**: een dicht meetnet maakt trends vroeg zichtbaar, bijvoorbeeld structurele daling in droge jaren.",
      },
      {
        heading: "Over de bron",
        body: "De peilbuizen komen uit het meetnet van de gemeente {city} (laag *Peilbuizen*). De getoonde niveaus zijn de meest recente automatische metingen; losse buizen kunnen door onderhoud of storing tijdelijk afwijken. De statistieken gaan over de peilbuizen binnen de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente {city} — open GIS",
        url: "https://gis.apeldoorn.nl/arcgis/rest/services/Peilbuizen_intern/FeatureServer",
      },
    ],
  },
  {
    layerId: "apd-riool-putten",
    title: "Rioolputten in {city}",
    subtitle:
      "Inspectie-, gemaal- en bijzondere putten van het gemeentelijke rioolstelsel",
    intro:
      "Deze laag toont **{count} rioolputten** van het gemeentelijke rioolstelsel van {city}. Putten zijn de knooppunten van het ondergrondse net: inspectieputten voor onderhoud, drukrioolgemalen die afvalwater verpompen, overstorten en uitlaten, en talrijke bijzondere voorzieningen voor infiltratie en drainage. Klik op een punt voor het puttype, de wijk en de straat.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Putten in beeld", type: "count" },
          {
            label: "Inspectieputten (aandeel)",
            type: "count-where",
            property: "RIOOLPUTTYPE",
            equals: "inspectieput",
            asShare: true,
          },
          {
            label: "Type putten",
            type: "distinct",
            property: "RIOOLPUTTYPE",
          },
          { label: "Wijken", type: "distinct", property: "WIJK" },
        ],
      },
      {
        kind: "category-bar",
        title: "Putten naar type in {city}",
        description:
          "Veld RIOOLPUTTYPE: de functie van de put in het rioolstelsel",
        property: "RIOOLPUTTYPE",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een **put** in het rioolstelsel. Verreweg de meeste zijn *inspectieputten*: toegangspunten waar het riool kan worden geïnspecteerd en gereinigd, meestal op elke knik of aansluiting van een leiding. Daarnaast zie je *drukrioolgemalen* (die afvalwater onder druk verder pompen, vooral in het buitengebied), *overstorten* en *uitlaten* (die bij hevige regen ontlasten op oppervlaktewater) en diverse *infiltratie-* en *drainageputten* die hemelwater in de bodem brengen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en onderhoud**: putten zijn de plekken waar het riool wordt geïnspecteerd; hun aantal en type bepalen de onderhoudsinspanning.\n- **Klimaatbestendigheid**: het aandeel infiltratie- en drainagevoorzieningen laat zien hoeveel de gemeente inzet op het lokaal vasthouden van hemelwater.\n- **Milieu**: overstorten en uitlaten zijn de punten waar het stelsel op piekmomenten loost — relevant voor waterkwaliteit.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De putten komen uit het beheerbestand *Leidingen Riool* van de gemeente {city}. Dit is een **omvangrijke laag**: in de standaardweergave wordt een deel geladen; gebruik *Volledig laden* voor het hele stelsel. De aandelen gaan over de nu geladen selectie binnen de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente {city} — open GIS",
        url: "https://gis.apeldoorn.nl/arcgis/rest/services/BR_Leidingen_Riool/MapServer",
      },
    ],
  },
  {
    layerId: "apd-riool-vrijverval",
    title: "Vrijvervalriolering in {city}",
    subtitle:
      "De ondergrondse afvoerleidingen die op natuurlijk verhang afwateren",
    intro:
      "Deze laag tekent **{count} vrijvervalleidingen** van het rioolstelsel van {city}: de buizen die afvalwater en/of hemelwater puur op natuurlijk verhang wegvoeren, zonder pomp. Per leiding ken je de diameter, het materiaal, het aanlegjaar en het stelseltype (gemengd, vuilwater of hemelwater). Samen vormen ze het grootste deel van het riool onder de stad.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Leidingen in beeld", type: "count" },
          {
            label: "Totale lengte",
            type: "sum",
            property: "LENGTE",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gem. diameter",
            type: "median",
            property: "DIAMETER",
            unit: "mm",
            decimals: 0,
          },
          {
            label: "Stelseltypes",
            type: "distinct",
            property: "STD_STELSELTYPE",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Leidingmateriaal in {city}",
        description:
          "Veld STD_MATERIAAL_RIOOLLEIDING: het gestandaardiseerde buismateriaal",
        property: "STD_MATERIAAL_RIOOLLEIDING",
        maxCategories: 7,
      },
      {
        kind: "category-bar",
        title: "Stelseltype van de leidingen",
        description:
          "Veld STD_STELSELTYPE: gemengd (afval- én hemelwater), vuilwater of hemelwater",
        property: "STD_STELSELTYPE",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een **vrijvervalleiding**: een buis die op afschot ligt zodat het water vanzelf naar een gemaal of overstort stroomt. Het *stelseltype* laat zien hoe het water gescheiden wordt: bij een *gemengd* stelsel gaan afval- en regenwater door dezelfde buis, terwijl *hemelwater-* en *vuilwater*-leidingen die stromen juist scheiden. Het materiaal (van beton tot PVC) en het aanlegjaar zeggen iets over de leeftijd en de onderhoudsbehoefte van het net.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vervangingsopgave**: riolen gaan tientallen jaren mee; de mix van materialen en aanlegjaren bepaalt de vervangingspiek en de investeringen die daarbij horen.\n- **Klimaat en waterkwaliteit**: het aandeel gescheiden (hemelwater-)stelsel laat zien hoever de gemeente is met het afkoppelen van regenwater om overstorten te beperken.\n- **Capaciteit**: diameters en lengtes zijn de basis voor hydraulische berekeningen bij nieuwe wijken of bij toenemende neerslagpieken.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De leidingen komen uit het beheerbestand *Leidingen Riool* van de gemeente {city}. Dit is een **grote laag**; standaard wordt een deel geladen — gebruik *Volledig laden* voor het complete stelsel. De totale lengte hierboven telt de nu geladen leidingen binnen de kaartuitsnede; leidingen die de rand kruisen tellen mee met hun volledige geregistreerde lengte.",
      },
    ],
    links: [
      {
        label: "Gemeente {city} — open GIS",
        url: "https://gis.apeldoorn.nl/arcgis/rest/services/BR_Leidingen_Riool/MapServer",
      },
    ],
  },
  {
    layerId: "apd-riool-persleiding",
    title: "Rioolpersleidingen in {city}",
    subtitle:
      "Onder druk staande leidingen die afvalwater omhoog en verder pompen",
    intro:
      "Deze laag toont **{count} persleidingen** van het rioolstelsel van {city}: leidingen die niet op natuurlijk verhang werken, maar waar afvalwater onder druk doorheen wordt gepompt. Ze overbruggen hoogteverschillen en grote afstanden — vooral in het buitengebied, waar drukriolering losse panden op het stelsel aansluit. Per leiding zie je de diameter en het materiaal.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Persleidingen in beeld", type: "count" },
          {
            label: "Totale lengte",
            type: "sum",
            property: "LENGTE",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gem. diameter",
            type: "median",
            property: "DIAMETER",
            unit: "mm",
            decimals: 0,
          },
          {
            label: "Materialen",
            type: "distinct",
            property: "STD_MATERIAAL_RIOOLLEIDING",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Leidingmateriaal van persleidingen in {city}",
        description:
          "Veld STD_MATERIAAL_RIOOLLEIDING: kunststof (PE, PVC, HPE) overheerst bij persleidingen",
        property: "STD_MATERIAAL_RIOOLLEIDING",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een **persleiding**: een gesloten, onder druk staande buis. Anders dan vrijvervalriolen liggen ze niet per se op afschot en zijn ze doorgaans van diameter kleiner en van kunststof (PE, PVC, HPE), passend bij de druk die de pompen leveren. Persleidingen vormen de ruggengraat van de drukriolering en de transportverbindingen tussen gemalen en de rioolwaterzuivering.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Buitengebied**: drukriolering maakt het mogelijk om verspreid liggende woningen en bedrijven op het riool aan te sluiten; deze leidingen laten zien waar dat gebeurt.\n- **Kwetsbaarheid**: persleidingen zijn afhankelijk van pompen en stroom; storing heeft direct effect, wat ze belangrijk maakt in beheer en calamiteitenplannen.\n- **Beheer**: materiaal en diameter bepalen de levensduur en de onderhoudsstrategie.",
      },
      {
        heading: "Over de bron",
        body: "De persleidingen komen uit het beheerbestand *Leidingen Riool* van de gemeente {city}. De totale lengte gaat over de leidingen binnen de kaartuitsnede; leidingen die de gemeentegrens kruisen tellen mee met hun volledige geregistreerde lengte.",
      },
    ],
    links: [
      {
        label: "Gemeente {city} — open GIS",
        url: "https://gis.apeldoorn.nl/arcgis/rest/services/BR_Leidingen_Riool/MapServer",
      },
    ],
  },
  {
    layerId: "apd-kabel-laagspanning",
    title: "Ondergrondse laagspanningskabels in {city}",
    subtitle:
      "Het fijnmazige laagspanningsnet in beheer/registratie van de gemeente",
    intro:
      "Deze laag tekent **{count} laagspanningskabels** die ondergronds door {city} lopen. Laagspanning is het laatste, fijnmazige stuk van het elektriciteitsnet dat woningen, winkels en straatverlichting van stroom voorziet. Per kabel ken je de straat en de wijk waar hij ligt; samen laten ze zien hoe dicht het ondergrondse elektranet onder de stad geweven is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kabelsegmenten in beeld", type: "count" },
          {
            label: "Totale kabellengte",
            type: "sum",
            property: "LENGTE",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gem. segmentlengte",
            type: "avg",
            property: "LENGTE",
            unit: "m",
            decimals: 1,
          },
          { label: "Wijken", type: "distinct", property: "WIJK" },
        ],
      },
      {
        kind: "category-bar",
        title: "Laagspanningskabels per wijk in {city}",
        description:
          "Veld WIJK: het aantal geregistreerde kabelsegmenten per wijk",
        property: "WIJK",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een geregistreerd **laagspanningskabel-segment** (WION-thema *laagspanning*). Het net is opgeknipt in korte stukken tussen aftakkingen, dus het aantal segmenten zegt vooral iets over de fijnmazigheid, terwijl de totale lengte de omvang van het net weergeeft. De kabels liggen onder straten en trottoirs; het veld *openbare ruimte* koppelt elk segment aan de straat waar het ligt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Graafwerk en KLIC**: wie in de openbare ruimte graaft, moet weten waar kabels liggen; deze registratie is daarvoor de basis.\n- **Energietransitie**: de druk op het laagspanningsnet neemt toe door warmtepompen, laadpalen en zonnepanelen; inzicht in het bestaande net helpt knelpunten te lokaliseren.\n- **Beheer**: de spreiding over wijken laat zien waar het net het dichtst is en waar beheer- en vervangingsinspanningen zich concentreren.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De kabels komen uit het beheerbestand *Leidingen Kabel* van de gemeente {city}. Dit betreft de bij de gemeente geregistreerde laagspanning; het volledige net wordt mede door de netbeheerder beheerd. Het is een **grote laag** — gebruik *Volledig laden* voor het complete beeld. De statistieken gaan over de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente {city} — open GIS",
        url: "https://gis.apeldoorn.nl/arcgis/rest/services/BR_Leidingen_Kabel/MapServer",
      },
    ],
  },
  {
    layerId: "hlm-riool-huisaansluitingen",
    title: "Rioolhuisaansluitingen in {city}",
    subtitle:
      "De aansluitpunten waar panden op het gemeentelijke rioolstelsel aankoppelen",
    intro:
      "Deze laag toont **{count} rioolhuisaansluitingen** in {city}: de punten waar de riolering van een pand aansluit op het gemeentelijke stelsel. Elk punt is gekoppeld aan een straatnaam en huisnummer en verwijst naar de bijbehorende aansluittekening. Samen brengen ze in beeld hoe fijnmazig het riool de bebouwing bedient.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Aansluitingen in beeld", type: "count" },
          {
            label: "Actieve aansluitingen",
            type: "count-where",
            property: "VERVAL",
            equals: "N",
          },
          {
            label: "Unieke straten",
            type: "distinct",
            property: "STRAATNAAM",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Aansluitingen per straat in {city}",
        description:
          "Veld STRAATNAAM: het aantal geregistreerde huisaansluitingen per straat",
        property: "STRAATNAAM",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een **huisaansluiting**: het punt waar de perceelriolering van een woning of bedrijf overgaat in het openbare rioolstelsel. Het veld *VERVAL* geeft aan of de aansluiting nog actueel is (waarde N) of is komen te vervallen. Aan elke aansluiting hangt een gescande aansluittekening (het veld *FILENAAM*), die bij graaf- en onderhoudswerk wordt geraadpleegd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en storingen**: bij verstoppingen of wateroverlast is de exacte plek van de aansluiting nodig om snel te kunnen ingrijpen.\n- **Vergunningen en bouw**: bij verbouw of nieuwbouw moet duidelijk zijn waar en hoe een pand op het riool aansluit.\n- **Compleetheid van het net**: de dichtheid van aansluitingen weerspiegelt de mate waarin de bebouwing op het stelsel is aangesloten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De aansluitingen komen uit het GIS van de gemeente {city} (laag *Rioolhuisaansluiting*). Dit is een **omvangrijke laag**; standaard wordt een deel geladen — gebruik *Volledig laden* voor het complete beeld. De aantallen gaan over de nu geladen selectie binnen de kaartuitsnede. De onderliggende aansluittekeningen zijn gescande documenten en kunnen in ouderdom en detail variëren.",
      },
    ],
    links: [
      {
        label: "Gemeente {city} — open data (ArcGIS)",
        url: "https://services6.arcgis.com/Z6jNDcrkDBbik5Ng/arcgis/rest/services/WS_Rioolhuisaansluiting/FeatureServer",
      },
    ],
  },
  {
    layerId: "hlm-warmtenet",
    title: "Warmtenet van {city}",
    subtitle:
      "Het tracé van de ondergrondse warmtetransportleidingen (regio Helmond–Asten)",
    intro:
      "Deze laag tekent het **warmtenet** in en rond {city}: **{count} tracédelen** van de ondergrondse leidingen die warm water naar woningen en gebouwen transporteren (het voormalige Ennatuurlijk-net, regio Helmond–Asten). Waar het net loopt, kunnen panden op stadswarmte worden aangesloten in plaats van op een individuele gasketel.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Tracédelen in beeld", type: "count" },
          {
            label: "Totale tracélengte",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Nettypes",
            type: "distinct",
            property: "toelichtin",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een stuk **warmtetransportleiding**. Het net op deze kaart is een hoge-temperatuurnet (het veld *toelichtin* markeert de delen als *HT-net*): warm water wordt vanaf een centrale bron rondgepompt en geeft via warmtewisselaars zijn warmte af aan aangesloten panden. De laag toont het tracé, niet de individuele aansluitingen — hij laat dus vooral zien wélke straten en wijken binnen bereik van het warmtenet liggen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Warmtetransitie**: het warmtenet is een van de alternatieven voor aardgas; het tracé bepaalt waar aansluiten op stadswarmte kansrijk is.\n- **Ruimtelijke ordening**: bij nieuwe woonwijken en renovaties weegt de nabijheid van het net mee in de keuze voor een warmtebron.\n- **Ondergrondse drukte**: warmteleidingen concurreren met kabels, riool en andere leidingen om de ruimte onder de straat; het tracé is nodig om die ruimte te ordenen.",
      },
      {
        heading: "Over de bron",
        body: "Het tracé is afkomstig uit de ArcGIS-registratie van het warmtenet Helmond–Asten. De weergegeven lengte is de som van de tracédelen binnen de kaartuitsnede; delen die de rand kruisen tellen mee met hun volledige geregistreerde lengte. Het gaat om de ligging van het transportnet, niet om de exacte capaciteit of het aantal aangesloten woningen.",
      },
    ],
    links: [
      {
        label: "Warmtenet {city} — tracé (ArcGIS)",
        url: "https://services-eu1.arcgis.com/QZSyVglN6fBie4qh/arcgis/rest/services/warmtenet_Helmond_Asten/FeatureServer",
      },
    ],
  },
  {
    layerId: "amf-snoeproutes",
    title: "Snoeiroutes in {city}",
    subtitle:
      "Gemeentelijke routes voor het periodiek onderhoud van bomen en beplanting",
    intro:
      "Deze laag toont **{count} snoeiroutes** in {city}: de routes die de gemeente aanhoudt bij het periodiek snoeien en onderhouden van bomen en beplanting per buurt. Elke lijn is een route langs het groen dat in een onderhoudsronde wordt meegenomen. Zo wordt zichtbaar hoe het groenonderhoud over de stad is georganiseerd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Snoeiroutes in beeld", type: "count" },
          { label: "Buurten met routes", type: "distinct", property: "Buurt" },
          {
            label: "Totale routelengte",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Snoeiroutes per buurt in {city}",
        description:
          "Veld Buurt: het aantal geregistreerde snoeiroutes per buurt",
        property: "Buurt",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een **snoeiroute**: een vastgelegd traject dat een ploeg volgt om de bomen en beplanting langs die route te onderhouden. De routes zijn per *buurt* georganiseerd, zodat het onderhoud planbaar en herhaalbaar is. De laag toont het traject van de route, niet de individuele bomen die worden gesnoeid.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Groenbeheer**: routes maken het onderhoud van het openbaar groen planbaar en controleerbaar, en helpen de inzet van mensen en materieel te verdelen.\n- **Transparantie richting bewoners**: de kaart laat zien welk groen op welke route wordt meegenomen, wat vragen over onderhoud makkelijker te beantwoorden maakt.\n- **Klimaat en leefbaarheid**: goed onderhouden bomen en beplanting dragen bij aan schaduw, koelte en biodiversiteit in de wijk.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De snoeiroutes komen uit het GIS van de gemeente {city} (laag *Snoeproutes*). Dit is een compacte, thematische laag: niet elk stuk groen ligt op een expliciete route en de dekking kan per buurt verschillen. De statistieken gaan over de routes binnen de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente {city} — open data (ArcGIS)",
        url: "https://services-eu1.arcgis.com/xJqVgvX1Tdd3h0YB/arcgis/rest/services/Snoeproutes/FeatureServer",
      },
    ],
  },
];
