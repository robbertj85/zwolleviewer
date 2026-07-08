/**
 * Story maps — batch "rotterdam-2".
 *
 * Gemeentelijke open-datalagen van de gemeente Rotterdam (services.arcgis.com
 * zP1tGdLpGvt2qNJ6 en data.rotterdam.nl). Deze lagen zijn alleen in Rotterdam
 * zichtbaar; de verhalen gebruiken toch {city}/{count}-placeholders zodat ze
 * consistent met de rest van de app renderen.
 *
 * Lagen: rtd-hoogbouwvisie, rtd-buurten, rtd-wijken, rtd-groenvlakken,
 * rtd-groene-daken, rtd-natuurkaart, rtd-snellaadpunten,
 * rtd-gehandicaptenparkeren, rtd-rijwegmateriaal, rtd-letselongevallen,
 * rtd-horeca, rtd-woningbouw, rtd-drinkwaterlocaties, rtd-scholen-zorg,
 * rtd-aardwarmte, rtd-primaire-waterkeringen.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "rtd-hoogbouwvisie",
    title: "Hoogbouwvisie in {city}",
    subtitle:
      "Zones uit de gemeentelijke Hoogbouwvisie 2019 waar hoog bouwen is toegestaan of gewenst",
    intro:
      "Deze laag toont **{count} hoogbouwzones** uit de Hoogbouwvisie 2019 van {city}: de begrensde gebieden waar de gemeente nieuwbouw hoger dan 70 meter beleidsmatig mogelijk of wenselijk acht. Het is geen inventarisatie van bestaande torens, maar een *beleidskaart* — een ruimtelijke uitspraak over waar de skyline mag doorgroeien en waar juist niet.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Hoogbouwzones in beeld", type: "count" },
          { label: "Benoemde gebieden", type: "distinct", property: "naam" },
          {
            label: "Totaal zoneoppervlak",
            type: "sum",
            property: "shape_area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een aangewezen hoogbouwzone met een eigen naam, zoals *Centrum*, *Kop van Zuid*, *Hart van Zuid*, *Feyenoord City* of *Alexanderknoop*. Binnen deze zones concentreert {city} de verticale verdichting; buiten de zones geldt de reguliere (lagere) maatvoering. Het aantal zones is klein en bewust selectief — hoogbouw is in de visie een uitzondering die op zorgvuldig gekozen plekken wordt gebundeld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sturing op de skyline**: door hoogbouw te clusteren rond knooppunten (stations, metro, de rivieroevers) blijft de rest van de stad in maat en schaal behouden.\n- **Verdichtingsopgave**: hoog bouwen op weinig grondoppervlak levert veel woningen en werkplekken zonder extra ruimtebeslag — cruciaal in een dichtbebouwde stad.\n- **Toetsingskader**: initiatiefnemers en stedenbouwkundigen gebruiken deze zones om vroeg in te schatten of een hoogbouwplan kansrijk is.",
      },
      {
        heading: "Over de bron",
        body: "De zones komen uit het open-dataportaal van {city} (*Hoogbouwvisie 2019*). Het is een vastgesteld beleidsdocument uit 2019; de exacte begrenzing en hoogteambities kunnen bij latere gebiedsvisies of het omgevingsplan zijn bijgesteld. Raadpleeg voor een concreet plan altijd het geldende ruimtelijke kader.",
      },
    ],
    links: [
      {
        label: "Rotterdam Open Data: Hoogbouwvisie 2019",
        url: "https://data.rotterdam.nl/explore/dataset/hoogbouwvisie-2019",
      },
    ],
  },
  {
    layerId: "rtd-buurten",
    title: "Buurten in {city}",
    subtitle: "Bestuurlijke buurtindeling volgens de CBS-codering",
    intro:
      "Deze laag tekent **{count} buurten** binnen het kaartgebied van {city}: de kleinste bestuurlijke gebiedsindeling die de gemeente hanteert, met de officiële CBS-codering. Elke buurt heeft een buurtcode, valt onder een wijk en draagt de gemeentecode GM0599. Buurten zijn de bouwstenen waarmee de meeste gemeentelijke statistieken en beleidsdoelen worden opgebouwd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          { label: "Wijken", type: "distinct", property: "wijknaam" },
          {
            label: "Totaal landoppervlak",
            type: "sum",
            property: "SHAPE__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Aantal buurten per wijk in {city}",
        description:
          "Buurten gegroepeerd naar de wijk waar ze onder vallen (veld wijknaam)",
        property: "wijknaam",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke vlak is één buurt met een landelijk unieke *buurtcode* (bijvoorbeeld BU05990110 voor Stadsdriehoek). Buurten liggen genest binnen wijken, die op hun beurt onder de gemeente vallen — de codering (BU / WK / GM) maakt die hiërarchie expliciet. Let op: de indeling bevat ook een buurt \"Buitenwater\" voor het open water, die statistisch nauwelijks inwoners telt maar wel een groot oppervlak beslaat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Referentiekader**: vrijwel alle demografische, sociale en fysieke cijfers worden op buurtniveau samengesteld; deze grenzen zijn de sleutel om die data ruimtelijk te koppelen.\n- **Gebiedsgericht werken**: {city} stuurt op veel dossiers (leefbaarheid, energie, groen) per buurt of wijk; de indeling bepaalt hoe budgetten en programma's worden verdeeld.\n- **Vergelijkbaarheid**: doordat de CBS-codering landelijk uniform is, kun je buurten van {city} één-op-één naast CBS-statistieken leggen.",
      },
      {
        heading: "Over de bron",
        body: "De grenzen komen uit de dataset *Bestuurlijke Grenzen* van de gemeente {city}. De kaartuitsnede kan buurten van aangrenzende gebieden bevatten; het veld *gemeentenaam* geeft uitsluitsel. Grenzen worden doorgaans jaarlijks geactualiseerd.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bestuurlijke Grenzen (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/BestuurlijkeGrenzen/FeatureServer",
      },
      {
        label: "CBS: wijk- en buurtindeling",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart",
      },
    ],
  },
  {
    layerId: "rtd-wijken",
    title: "Wijken in {city}",
    subtitle: "Bestuurlijke wijkindeling volgens de CBS-codering",
    intro:
      "Deze laag toont **{count} wijken** binnen het kaartgebied van {city}: het niveau tussen buurt en gemeente in de CBS-gebiedsindeling. Elke wijk heeft een wijkcode (zoals WK059901 voor Rotterdam Centrum) en bundelt meerdere buurten. Wijken zijn de gebruikelijke schaal voor gebiedsgericht beleid, gebiedscommissies en veel monitoringcijfers.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wijken in beeld", type: "count" },
          { label: "Unieke wijknamen", type: "distinct", property: "wijknaam" },
          {
            label: "Totaal oppervlak",
            type: "sum",
            property: "SHAPE__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddeld wijkoppervlak",
            type: "avg",
            property: "SHAPE__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is één wijk met een eigen naam en code. Waar de buurtenlaag inzoomt op de fijnmazige indeling, geeft deze wijkenlaag het overzicht: een handvol grotere gebieden die samen de gemeente vormen. De wijk \"Groot water\" vertegenwoordigt het open water (rivier en havens) en is daardoor qua oppervlak veel groter dan de bebouwde wijken.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gebiedsbestuur**: in {city} zijn wijken en gebieden het schaalniveau van gebiedscommissies en wijkraden; deze grenzen bepalen hun werkgebied.\n- **Beleidsmonitoring**: leefbaarheids- en veiligheidsindexen worden vaak per wijk gerapporteerd, waardoor deze indeling het natuurlijke aggregatieniveau is.\n- **Communicatie**: wijknamen zijn voor bewoners herkenbaarder dan buurtcodes, en daarom handig als kapstok bij participatie en publieksinformatie.",
      },
      {
        heading: "Over de bron",
        body: "De grenzen komen uit de dataset *Bestuurlijke Grenzen* van de gemeente {city} (laag Wijken). De kaartuitsnede kan wijken van aangrenzende gebieden meetellen. De indeling volgt de landelijke CBS-systematiek en wordt periodiek geactualiseerd.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bestuurlijke Grenzen (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/BestuurlijkeGrenzen/FeatureServer",
      },
      {
        label: "CBS: wijk- en buurtindeling",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart",
      },
    ],
  },
  {
    layerId: "rtd-groenvlakken",
    title: "Groenvlakken in {city}",
    subtitle:
      "Groen in de openbare ruimte, ingedeeld naar bestemming (BGT-basis)",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} groenvlakken** geladen: de percelen openbaar groen die de gemeente beheert, afgeleid uit de Basisregistratie Grootschalige Topografie (BGT). Elk vlak heeft een *bestemming* die aangeeft welke functie het groen heeft — van buurtgroen tot stedelijk structuurgroen. Samen vormen ze de groene onderlegger van de stad.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Groenvlakken in beeld", type: "count" },
          {
            label: "Bestemmingstypen",
            type: "distinct",
            property: "BESTEMMING",
          },
          {
            label: "Totaal groenoppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Groenvlakken per bestemming in {city}",
        description: "Indeling naar functie (veld BESTEMMING)",
        property: "BESTEMMING",
        valueLabels: {
          buurtgroen: "Buurtgroen",
          "stedelijk groen": "Stedelijk groen",
          singel: "Singel / watergroen",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een aaneengesloten stuk openbaar groen. De **bestemming** onderscheidt bijvoorbeeld *buurtgroen* (kleinschalig groen in woonstraten en plantsoenen) van *stedelijk groen* (grotere parken en groenstructuren) en *singel* (groen langs water). Het gemiddelde oppervlak per vlak zegt iets over de schaal: veel kleine buurtgroenvlakken tegenover enkele grote structuurgroenvlakken.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: groen koelt, vangt regenwater op en dempt hittestress; de totale groenoppervlakte is een directe indicator voor de klimaatbestendigheid van een wijk.\n- **Leefbaarheid en gezondheid**: nabijheid van groen hangt samen met bewegen, ontmoeten en welbevinden — de spreiding van buurtgroen laat zien waar de openbare ruimte groen genoeg is.\n- **Beheer**: de bestemming stuurt het onderhoudsregime (maaien, snoeien, ecologisch beheer) en daarmee de beheerkosten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De vlakken komen uit de beheerregistratie van {city}, gebaseerd op de BGT. Statistieken gaan over de kaartuitsnede, niet per se over de hele gemeente. Bij grote groenlagen wordt bovendien een deel van de features geladen; het getoonde aantal is dus een steekproef van het totaal, geen volledige telling.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Groenvlakken (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Groenvlakken/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-groene-daken",
    title: "Groene daken in {city}",
    subtitle:
      "Sedum- en andere begroeide daken per pand, met groen oppervlak en percentage",
    intro:
      "Deze laag toont **{count} panden met een groen dak** in {city}, uit de gemeentelijke groene-dakenmonitor. Per BAG-pand is geregistreerd hoeveel vierkante meter dak begroeid is (*GREEN_AREA*) en welk aandeel van het dak dat is (*PERC_GREEN*). Groene daken zijn een zichtbare bouwsteen van de klimaatbestendige, sponsachtige stad.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Groene daken in beeld", type: "count" },
          {
            label: "Totaal groen dakoppervlak",
            type: "sum",
            property: "GREEN_AREA",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddeld groen aandeel",
            type: "avg",
            property: "PERC_GREEN",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Gebieden met groene daken",
            type: "distinct",
            property: "GEBDNAAM",
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het groene dakaandeel in {city}",
        description:
          "Aantal panden per klasse van PERC_GREEN — welk deel van het dak is begroeid",
        property: "PERC_GREEN",
        unit: "%",
        bins: 8,
      },
      {
        kind: "category-bar",
        title: "Groene daken per gebied in {city}",
        description: "Aantal geregistreerde groene daken per gebied (GEBDNAAM)",
        property: "GEBDNAAM",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een pand waarvan (een deel van) het dak begroeid is. Het **groen oppervlak** en het **percentage** samen laten zien of het om een volledig sedumdak gaat of om een gedeeltelijke vergroening. Het veld *JAARMETING* geeft aan uit welk meetjaar de registratie stamt — de monitor wordt periodiek geactualiseerd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Waterberging**: een groen dak houdt regenwater vast en vertraagt de afvoer, wat piekbelasting op het riool verlaagt — direct relevant bij hoosbuien.\n- **Hitte en biodiversiteit**: begroeide daken koelen het gebouw, verlagen de stedelijke hitte en bieden leefruimte voor insecten en vogels.\n- **Subsidie en monitoring**: {city} stimuleert groene daken met subsidies; deze monitor maakt zichtbaar waar de opgave al slaagt en waar nog kansen liggen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de *Groene Daken Monitor* van {city}, gekoppeld aan BAG-panden. De laag registreert alleen daken die als groen zijn gedetecteerd; witte, grijze of blauwe daken vallen erbuiten. Statistieken gaan over de kaartuitsnede en over de geladen selectie van panden.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Groene Daken Monitor (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/GroeneDakenRotterdamMonitor/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-natuurkaart",
    title: "Ecologische kerngebieden in {city}",
    subtitle: "Natuurkaart 2018 — de kern van de stedelijke natuurstructuur",
    intro:
      "Deze laag toont **{count} ecologische kerngebieden** uit de Natuurkaart {city} 2018: de plekken met de hoogste natuurwaarde in en om de stad. Elk vlak is getypeerd naar het natuurtype — van getijdennatuur en duin tot parkbos en polder met natuurbeheer. Samen vormen de kerngebieden het raamwerk waaraan de gemeente haar natuur- en biodiversiteitsbeleid ophangt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kerngebieden in beeld", type: "count" },
          { label: "Natuurtypen", type: "distinct", property: "Laag_naam" },
          {
            label: "Totaal natuuroppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kerngebieden per natuurtype in {city}",
        description: "Indeling naar ecologisch type (veld Laag_naam)",
        property: "Laag_naam",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een ecologisch kerngebied met een natuurtype. In {city} loopt dat uiteen van *polder met natuurbeheer* (extensief beheerde graslanden, vaak talrijk) en *waternetwerk* (sloten en singels met ecologische waarde) tot bijzondere types als *getijdennatuur*, *duin* en *duinbos* langs de rivier en de kust. Het aantal vlakken per type zegt iets over hoe fijnmazig of juist grootschalig dat natuurtype in de stad voorkomt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Biodiversiteit**: kerngebieden zijn de brongebieden van waaruit soorten zich door de stad verspreiden; behoud ervan is de basis van het natuurnetwerk.\n- **Ruimtelijke afweging**: bij bouwplannen en herinrichting fungeert de Natuurkaart als toetsingskader — raakt een plan een kerngebied, dan gelden extra afwegingen.\n- **Beheer op maat**: het natuurtype bepaalt het gewenste beheer (ecologisch maaien, getijdenwerking, bosbeheer) en helpt versnippering tegen te gaan.",
      },
      {
        heading: "Over de bron",
        body: "De gebieden komen uit de *Natuurkaart {city} 2018* (kerngebieden). Het is een beleidsmatige kartering uit 2018; de werkelijke natuurwaarde kan sindsdien zijn veranderd door beheer of ontwikkeling. De kaartuitsnede kan gebieden net buiten de gemeentegrens tonen. Bij grote lagen wordt een selectie van de vlakken geladen.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Natuurkaart 2018, Kerngebieden (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Natuurkaart_Rotterdam_2018_Kerngebieden/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-snellaadpunten",
    title: "Snellaadpunten in {city}",
    subtitle: "Openbare DC-snelladers (50 kW en hoger) met exploitant en vermogen",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} snellaadpunten**: openbare DC-snelladers waarmee elektrische auto's in minuten in plaats van uren bijladen. Per locatie is de exploitant (CPO), het maximale vermogen en het aantal laadpunten geregistreerd. Deze laag laat zien hoe fijnmazig het snellaadnetwerk voor onderweg en logistiek is opgebouwd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Snellaadlocaties in beeld", type: "count" },
          { label: "Exploitanten (CPO's)", type: "distinct", property: "cpo" },
          {
            label: "Totaal aantal laadpunten",
            type: "sum",
            property: "nrotlts",
            decimals: 0,
          },
          {
            label: "Type Fastcharger",
            type: "count-where",
            property: "chrgr_t",
            equals: "Fastcharger",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Snellaadlocaties per exploitant in {city}",
        description:
          "Aantal locaties per laadpuntexploitant (veld cpo): Shell Recharge, Fastned, bp pulse e.a.",
        property: "cpo",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een snellaadlocatie. Het veld *cpo* geeft de exploitant, *max_pwr* het maximale vermogen (in watt, dus 300000 = 300 kW) en *nrotlts* het aantal laadpunten (outlets) op die locatie. Één locatie kan dus meerdere auto's tegelijk bedienen. Het verschil tussen het aantal locaties en het totaal aantal laadpunten laat zien hoe groot de laadpleinen gemiddeld zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Laadinfrastructuur**: snelladers zijn onmisbaar voor bewoners zonder eigen oprit, taxi's, deelauto's en stadslogistiek die geen uren kan stilstaan.\n- **Netimpact**: hoge vermogens vragen zwaardere netaansluitingen; de spreiding en het totale vermogen zijn relevant voor de netbeheerder bij verzwaring.\n- **Marktordening**: de verdeling over exploitanten toont hoe concurrerend en dekkend het aanbod is en waar witte vlekken zitten.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de dataset *Snellaadpunten* van {city} en wordt maandelijks geactualiseerd. Alleen openbaar toegankelijke DC-snelladers zijn opgenomen; reguliere (langzame) laadpalen staan in een aparte laag. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Snellaadpunten (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Snellaadpunten/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-gehandicaptenparkeren",
    title: "Gehandicaptenparkeerplaatsen in {city}",
    subtitle:
      "Algemene gehandicaptenparkeerplaatsen (GPP) in de openbare ruimte",
    intro:
      "Deze laag toont **{count} algemene gehandicaptenparkeerplaatsen** binnen het kaartgebied van {city}: parkeervakken met bord E6 die zijn gereserveerd voor houders van een gehandicaptenparkeerkaart, zonder aan één persoon te zijn gekoppeld. Per plaats is de straat, wijk en buurt vastgelegd. De spreiding laat zien hoe toegankelijk de openbare ruimte is voor mensen met een beperking.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "GPP's in beeld", type: "count" },
          { label: "Straten met een GPP", type: "distinct", property: "STRAAT" },
          { label: "Wijken", type: "distinct", property: "WIJK" },
        ],
      },
      {
        kind: "category-bar",
        title: "Gehandicaptenparkeerplaatsen per wijk in {city}",
        description: "Aantal algemene GPP's per wijk (veld WIJK)",
        property: "WIJK",
        maxCategories: 10,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een *algemene* gehandicaptenparkeerplaats: bedoeld voor iedere kaarthouder, bijvoorbeeld bij voorzieningen, winkels en openbare gebouwen. Dat is iets anders dan een *gereserveerde* GPP op kenteken, die bij een specifieke woning hoort. Het modelnummer (meestal E6) verwijst naar het bijbehorende verkeersbord.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toegankelijkheid**: voldoende algemene GPP's bij voorzieningen bepalen of mensen met een beperking zelfstandig kunnen deelnemen aan het stadsleven.\n- **Spreiding**: de verdeling over wijken laat zien waar het aanbod ruim is en waar mogelijk knelpunten zitten, bijvoorbeeld in drukke centrum- of winkelgebieden.\n- **Inclusief beleid**: de laag is een concrete indicator bij het monitoren van een toegankelijke gemeente conform het VN-verdrag Handicap.",
      },
      {
        heading: "Over de bron",
        body: "De plaatsen komen uit de dataset *Algemene Gehandicaptenparkeerplaatsen* van {city}. Persoonsgebonden GPP's op kenteken vallen buiten deze laag. De statistieken gaan over de kaartuitsnede en worden doorgaans jaarlijks geactualiseerd.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Algemene GPP's (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/AlgemeneGehandicaptenParkeerplaatsenRotterdam/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-rijwegmateriaal",
    title: "Materialisatie van rijwegen in {city}",
    subtitle:
      "Wegvakonderdelen met verharding, aanlegjaar en gebruiksfunctie (beheerregister)",
    intro:
      "Deze laag toont **{count} wegvakonderdelen** binnen het kaartgebied van {city}, afkomstig uit het beheerregister van de openbare ruimte. Per stukje rijweg is vastgelegd wat de gebruiksfunctie is (woonstraat, hoofdweg, industrieweg …), welke verharding is toegepast en in welk jaar het is aangelegd. Samen vormen ze de fysieke onderlaag waar het wegbeheer op stuurt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegvakonderdelen in beeld", type: "count" },
          {
            label: "Gebruiksfuncties",
            type: "distinct",
            property: "GEBRUIKSFU",
          },
          {
            label: "Totaal wegoppervlak",
            type: "sum",
            property: "OPPERVLAKT",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Totale lengte",
            type: "sum",
            property: "LENGTE",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Wegvakonderdelen per gebruiksfunctie in {city}",
        description: "Indeling naar wegfunctie (veld GEBRUIKSFU)",
        property: "GEBRUIKSFU",
        maxCategories: 8,
      },
      {
        kind: "histogram",
        title: "Aanlegjaar van rijwegonderdelen in {city}",
        description:
          "Aantal onderdelen per aanlegjaar (veld AANLEGJAAR) — een indicatie van de leeftijdsopbouw",
        property: "AANLEGJAAR",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een *wegvakonderdeel*: een klein stuk rijweg met homogene eigenschappen, zoals een rijbaan, een verkeersdrempel of een middenstrook. Het veld *GEBRUIKSFU* zegt welke functie het heeft (de meeste onderdelen zijn woonstraat), en *AANLEGJAAR* wanneer het is aangelegd of gereconstrueerd. De verharding is in deze selectie overwegend betonsteen (klinkers), maar het register bevat ook asfalt- en tegelverhardingen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Onderhoudsplanning**: het aanlegjaar bepaalt mede wanneer groot onderhoud of vervanging nodig is; de leeftijdsopbouw is de basis voor meerjarige beheerbegrotingen.\n- **Kabels- en leidingenwerk**: bij graafwerk telt de verharding — betonstraatsteen is herbruikbaar, asfalt niet — wat het onderscheid beleidsmatig relevant maakt.\n- **Klimaat en water**: het onderscheid open (waterdoorlatende) versus gesloten verharding speelt bij het vergroten van de infiltratiecapaciteit van de stad.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het beheerregister *Materialisatie Rijwegen* van {city}. Het register is fijnmazig: één straat bestaat uit vele onderdelen, dus het aantal features is groot terwijl er maar een selectie wordt geladen. Statistieken gaan over de kaartuitsnede en over die geladen selectie, niet over de volledige gemeente.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Materialisatie Rijwegen (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Materialisatie_Rijwegen_WFL1/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-letselongevallen",
    title: "Letselongevallen in {city}",
    subtitle:
      "Geregistreerde verkeersongevallen met letsel, met gewonden en dodelijke slachtoffers",
    intro:
      "Deze laag toont **{count} locaties met letselongevallen** binnen het kaartgebied van {city}: plekken waar een geregistreerd verkeersongeval tot gewonden of dodelijke slachtoffers heeft geleid. Per locatie is het aantal slachtoffers en doden vastgelegd. Zo wordt zichtbaar waar de verkeersveiligheid in de stad onder druk staat.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Ongevalslocaties in beeld", type: "count" },
          {
            label: "Ongevallen met letsel",
            type: "sum",
            property: "ONG_LET",
            decimals: 0,
          },
          {
            label: "Gewonden (totaal)",
            type: "sum",
            property: "SLA",
            decimals: 0,
          },
          {
            label: "Dodelijke slachtoffers (totaal)",
            type: "sum",
            property: "DOD",
            decimals: 0,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een locatie waar een of meer letselongevallen zijn geregistreerd. De laag onderscheidt per punt het aantal ongevallen (*ONG_TOT*), het deel met uitsluitend materiële schade (*ONG_UMS*), met letsel (*ONG_LET*) en met dodelijke afloop (*ONG_DOD*), plus het aantal gewonden (*SLA*) en doden (*DOD*). De optelling van die velden geeft het totaalbeeld voor de kaartuitsnede.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Risicogestuurd beleid**: concentraties van letselongevallen wijzen de kruispunten en wegvakken aan waar maatregelen het meeste effect hebben.\n- **Strategisch Plan Verkeersveiligheid**: gemeenten werken toe naar nul verkeersdoden; deze registratie maakt de opgave concreet en meetbaar.\n- **Kwetsbare verkeersdeelnemers**: fietsers en voetgangers lopen bij een ongeval meer risico op letsel — locatiegegevens helpen bij het veiliger inrichten van hun routes.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de dataset *Letselongevallen* van {city}, gebaseerd op politie- en ongevallenregistraties (BRON). Onderregistratie is een bekend aandachtspunt: met name fietsongevallen zonder politie-inzet ontbreken vaak. De cijfers zijn dus een ondergrens en gaan over de geladen kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Letselongevallen (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Letselongevallen/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-horeca",
    title: "Horeca en fastfood in {city}",
    subtitle:
      "Horeca- en fastfoodvestigingen uit het gemeentelijk bedrijvenregister (peiljaar 2018)",
    intro:
      "Deze laag toont **{count} horeca- en fastfoodvestigingen** binnen het kaartgebied van {city}, uit het gemeentelijk bedrijvenregister (peiljaar 2018). Per vestiging is de naam, het adres, de SBI-sector en de BAG-koppeling vastgelegd. Van restaurants en cafés tot cafetaria's en ijssalons: de laag brengt de horecastructuur van de stad in kaart.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vestigingen in beeld", type: "count" },
          { label: "Horecatypen (SBI)", type: "distinct", property: "sbi2008" },
          {
            label: "Fastfood / cafetaria e.d.",
            type: "count-where",
            property: "sbi2008",
            equals: "Fastfoodrestaurants, cafetaria's,  ijssalons, eetkramen e.d.",
          },
          { label: "Gebieden", type: "distinct", property: "gebied" },
        ],
      },
      {
        kind: "category-bar",
        title: "Vestigingen per horecatype in {city}",
        description: "Indeling naar SBI-omschrijving (veld sbi2008)",
        property: "sbi2008",
        maxCategories: 7,
      },
      {
        kind: "category-bar",
        title: "Horecavestigingen per gebied in {city}",
        description: "Spreiding over de stadsgebieden (veld gebied)",
        property: "gebied",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een horeca- of fastfoodvestiging. Het veld *sbi2008* typeert de zaak volgens de standaard bedrijfsindeling: *Restaurants*, *Cafés*, *Fastfoodrestaurants/cafetaria's/ijssalons*, *Hotels* en *Hotel-restaurants*. Via de BAG-koppeling (*bagna_id*, *BAG_verbli*) is elke vestiging aan een pand en verblijfsobject gekoppeld, inclusief het gebruiksoppervlak.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijk-economisch beleid**: de dichtheid en het type horeca kenmerken een gebied — een levendig centrum, een uitgaanskern of een fastfoodconcentratie langs uitvalswegen.\n- **Gezondheid**: de spreiding van fastfoodaanbod is een aandachtspunt in het gezondheidsbeleid, zeker rond scholen en in kwetsbare wijken.\n- **Vergunningen en toezicht**: het register is een basis voor horecavergunningen, terrasbeleid en handhaving.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het *Bedrijvenregister horeca en fastfood* van {city} met peiljaar 2018. Sindsdien zijn zaken geopend en gesloten, dus het beeld is een momentopname en niet de actuele situatie. De statistieken gaan over de kaartuitsnede; bij grote aantallen wordt een selectie geladen.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bedrijvenregister horeca en fastfood (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Bedrijvenregister_horeca_en_fastfood/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-woningbouw",
    title: "Woningbouwprogramma in {city}",
    subtitle:
      "Geplande en lopende woningbouwlocaties met aantal woningen en planstatus",
    intro:
      "Deze laag toont **{count} woningbouwlocaties** binnen het kaartgebied van {city}: projecten uit het gemeentelijke woningbouwprogramma, van eerste studie tot in aanbouw. Per locatie is de naam, het bouwplannummer, het aantal woningen en de planstatus vastgelegd. Samen geven ze het ruimtelijke beeld van de woningbouwopgave.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bouwlocaties in beeld", type: "count" },
          {
            label: "Woningen in programma",
            type: "sum",
            property: "aantal_woningen",
            decimals: 0,
          },
          {
            label: "Locaties in aanbouw",
            type: "count-where",
            property: "status",
            equals: "GESTART",
          },
          {
            label: "Harde planvoorraad",
            type: "count-where",
            property: "status",
            equals: "HARDE_PLANVOORRAAD",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Woningbouwlocaties per planstatus in {city}",
        description:
          "Van zachte plannen tot gestarte bouw (veld status)",
        property: "status",
        valueLabels: {
          STUDIE: "Studie",
          ZACHTE_PLANVOORRAAD: "Zachte planvoorraad",
          HARDE_PLANVOORRAAD: "Harde planvoorraad",
          GESTART: "Gestart / in aanbouw",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een woningbouwlocatie met een verwacht aantal woningen. De **planstatus** geeft de hardheid van het plan aan: van een vrijblijvende *studie* via *zachte* en *harde planvoorraad* tot *gestart* (in aanbouw). Hoe harder de status, hoe groter de kans dat de woningen daadwerkelijk worden opgeleverd. De velden *datum_start_bouw* en *jaar_oplevering* geven de beoogde planning, al zijn opleverjaren voor vroege plannen vaak nog leeg.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woningbouwopgave**: het totaal aantal geprogrammeerde woningen laat zien hoe {city} bijdraagt aan de regionale en landelijke bouwambitie.\n- **Faseren en voorzieningen**: de spreiding en planning bepalen waar en wanneer scholen, groen, wegen en OV moeten meegroeien.\n- **Realisatierisico**: het onderscheid tussen zachte en harde plannen maakt inzichtelijk hoeveel van de opgave nog onzeker is.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het *Woningbouwprogramma* van {city} en wordt elk kwartaal geactualiseerd. Aantallen en planning zijn prognoses die met de tijd verschuiven; met name zachte plannen en studies kunnen vervallen of van omvang veranderen. De statistieken gaan over de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Woningbouwprogramma (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Woningbouw_Programma/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-drinkwaterlocaties",
    title: "Drinkwaterlocaties in {city}",
    subtitle:
      "Waterpunten en drinkwatervoorzieningen van Evides in de regio",
    intro:
      "Deze laag toont **{count} drinkwaterlocaties** binnen het kaartgebied van {city}: publieke waterpunten en aan drinkwater gerelateerde voorzieningen van waterbedrijf Evides in de regio. Per locatie is een naam en een toelichting vastgelegd. De laag laat zien waar in de openbare ruimte gratis kraanwater beschikbaar is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Drinkwaterlocaties in beeld", type: "count" },
          { label: "Unieke locatienamen", type: "distinct", property: "Name" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een drinkwaterlocatie, meestal een openbaar *waterpunt* (type WPT) waar voorbijgangers hun fles kunnen bijvullen. Het veld *Comment* beschrijft vaak de precieze plek (bijvoorbeeld een plein of straat). Naast waterpunten kan de laag ook andere Evides-voorzieningen bevatten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid en hitte**: gratis drinkwaterpunten helpen mensen gehydrateerd te blijven, vooral tijdens hittegolven en voor mensen die veel buiten zijn.\n- **Minder wegwerpplastic**: openbare tappunten verminderen de behoefte aan flesjes water en dragen bij aan afvalreductie.\n- **Toegankelijke openbare ruimte**: een fijnmazig netwerk van waterpunten maakt de stad prettiger en gastvrijer om in te verblijven en te bewegen.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de dataset *Drinkwaterlocaties Rotterdam en omstreken*, gebaseerd op gegevens van Evides. Omdat het om de regio gaat, kan de kaartuitsnede ook punten in buurgemeenten tonen. Het aantal is beperkt, dus dit verhaal richt zich op de aanwezigheid en spreiding van de locaties.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Drinkwaterlocaties (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Drinkwaterlocaties_Rotterdam_en_Omstreken/FeatureServer",
      },
      { label: "Evides Waterbedrijf", url: "https://www.evides.nl/" },
    ],
  },
  {
    layerId: "rtd-scholen-zorg",
    title: "Scholen en zorglocaties in {city}",
    subtitle:
      "Onderwijs-, woon- en gezondheidszorggebouwen met prioriteitsclassificatie",
    intro:
      "Deze laag toont **{count} kwetsbare-functiegebouwen** binnen het kaartgebied van {city}: scholen, verzorgings- en verpleeghuizen en gezondheidszorggebouwen. Per locatie is de gebouwklasse, een omschrijving en een prioriteit vastgelegd. Deze functies huisvesten mensen die zich bij een calamiteit minder makkelijk zelf in veiligheid brengen, en krijgen daarom extra aandacht in de veiligheidsplanning.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Locaties in beeld", type: "count" },
          {
            label: "Onderwijsgebouwen",
            type: "count-where",
            property: "Klasse",
            equals: "Gebouwen met een onderwijsfunctie",
          },
          {
            label: "Gezondheidszorggebouwen",
            type: "count-where",
            property: "Klasse",
            equals: "Gebouwen met een gezondheidszorgfunctie",
          },
          {
            label: "Woonzorggebouwen",
            type: "count-where",
            property: "Klasse",
            equals: "Gebouwen met een woonfunctie",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Locaties per gebouwklasse in {city}",
        description:
          "Indeling naar functie (veld Klasse): onderwijs, zorg of wonen",
        property: "Klasse",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een gebouw met een kwetsbare functie. De **klasse** onderscheidt onderwijs-, gezondheidszorg- en woonfuncties; de **omschrijving** (*Omschrijvi*) preciseert het type, zoals een basisschool, een kliniek of een verzorgingshuis. Het veld *Prioriteit* geeft een risicoprioriteit aan, waarbij prioriteit 1 zwaarder weegt dan prioriteit 2.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Externe veiligheid**: bij ruimtelijke plannen rond risicobronnen (transport, industrie) tellen locaties met verminderd zelfredzame mensen extra mee.\n- **Rampenbestrijding**: hulpdiensten gebruiken deze objecten om ontruimings- en zorgcontinuïteitsplannen op af te stemmen.\n- **Voorzieningenspreiding**: de kaart laat ook zien hoe onderwijs en zorg over de stad verdeeld zijn — relevant bij groei van wijken en vergrijzing.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de dataset *bejaardenoorden, verzorgingshuizen en scholen* van {city}. De classificatie is bedoeld voor veiligheids- en risicoanalyse, niet als volledige adressengids; individuele gebouwen kunnen inmiddels een andere functie hebben. De statistieken gaan over de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Scholen en zorglocaties (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/bejaardenoorden_verzorgingshuizen_scholen_rotterdam/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-aardwarmte",
    title: "Aardwarmtepotentieel in {city}",
    subtitle:
      "Potentieel voor bodemenergie (WKO) per buurt, in warmte-extractie per hectare",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} op hun potentieel voor bodemenergie: hoeveel warmte er via warmte-koudeopslag (WKO) uit de ondiepe ondergrond kan worden gehaald. De waarden staan in gigajoule per hectare per jaar, voor een basisscenario (*WV_Basis*) en een intensiever \"plus\"-scenario (*WV_Plus*). Zo wordt zichtbaar waar de bodem de warmtetransitie kan versnellen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gemiddeld potentieel (basis)",
            type: "avg",
            property: "WV_Basis",
            unit: "GJ/ha/jr",
            decimals: 2,
          },
          {
            label: "Gemiddeld potentieel (plus)",
            type: "avg",
            property: "WV_Plus",
            unit: "GJ/ha/jr",
            decimals: 2,
          },
          {
            label: "Hoogste potentieel (plus)",
            type: "max",
            property: "WV_Plus",
            unit: "GJ/ha/jr",
            decimals: 2,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het WKO-pluspotentieel in {city}",
        description:
          "Aantal buurten per klasse van WV_Plus (warmte-extractie in GJ/ha/jaar)",
        property: "WV_Plus",
        unit: "GJ/ha/jr",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een buurt met een berekend bodemenergiepotentieel. *WV_Basis* is de warmte die met een standaard WKO-systeem verantwoord aan de bodem te onttrekken is; *WV_Plus* gaat uit van intensievere benutting. Beide zijn genormeerd per hectare, zodat buurten van verschillende omvang vergelijkbaar zijn. Het onderliggende bestand is landelijk opgezet, waardoor je in de kaartuitsnede naast Rotterdamse buurten ook buurten net buiten de gemeente kunt tegenkomen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Warmtetransitie**: waar het bodempotentieel hoog is, ligt een aardgasvrije wijk via WKO en warmtenetten meer voor de hand dan elders.\n- **Wijk-uitvoeringsplannen**: gemeenten wijzen per wijk de kansrijkste warmtebron aan; dit potentieel is daarvoor een kerngegeven.\n- **Ordening van de ondergrond**: hoge WKO-dichtheid vraagt om afstemming zodat systemen elkaar niet thermisch in de weg zitten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de dataset *Aardwarmtepotentieel* van {city}. Het gaat om modelmatig berekend potentieel op buurtniveau, geen gegarandeerde opbrengst: lokale bodemopbouw, grondwaterstroming en bestaande systemen bepalen de werkelijke haalbaarheid. De statistieken gaan over de geladen kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Aardwarmtepotentieel (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Aardwarmte_Potentiel/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-primaire-waterkeringen",
    title: "Primaire waterkeringen in {city}",
    subtitle:
      "Kern- en beschermingszones van dijken, kaden en dammen die tegen buitenwater beschermen",
    intro:
      "Deze laag toont **{count} waterkerende zones** binnen het kaartgebied van {city}: de kern- en beschermingszones van de primaire waterkeringen die de stad beschermen tegen het buitenwater van rivier en zee. Elke zone heeft een kenmerk (kernzone of beschermingszone) en, waar bekend, een beoordelingsstatus. In een laaggelegen rivierstad zijn dit letterlijk de levenslijnen van de veiligheid.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kerende zones in beeld", type: "count" },
          {
            label: "Kernzones",
            type: "count-where",
            property: "KENMERK",
            equals: "Kernzone",
          },
          {
            label: "Beschermingszones",
            type: "count-where",
            property: "KENMERK",
            equals: "Beschermingszone",
          },
          {
            label: "Totale lengte zonegrenzen",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Waterkerende zones per type in {city}",
        description:
          "Kernzone (de kering zelf) versus beschermingszone (bufferstrook), veld KENMERK",
        property: "KENMERK",
        valueLabels: {
          Kernzone: "Kernzone",
          Beschermingszone: "Beschermingszone",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een zone rond een primaire waterkering. De **kernzone** is de kering zelf (dijk, kade of dam) met de directe waterkerende functie; de **beschermingszone** is de bufferstrook ernaast waar beperkingen gelden om de stabiliteit van de kering niet te ondermijnen. Het veld *StatusNorm* geeft aan of het betreffende dijkvak al is beoordeeld op de wettelijke veiligheidsnorm.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hoogwaterveiligheid**: primaire keringen beschermen tegen overstroming vanuit de grote wateren; hun ligging bepaalt welk gebied \"binnendijks\" veilig is.\n- **Ruimtelijke beperkingen**: in kern- en beschermingszones geldt de keur van de waterbeheerder — graven, bouwen en beplanten zijn er aan strenge regels gebonden.\n- **Klimaatadaptatie**: met stijgende zeespiegel en hogere rivierafvoeren worden keringen periodiek getoetst en waar nodig versterkt (HWBP).",
      },
      {
        heading: "Over de bron",
        body: "De zones komen uit de dataset *Primaire Waterkering* van {city}, afgeleid uit de legger van de waterbeheerder. De kaartuitsnede kan zones net buiten de gemeentegrens tonen. De grenzen zijn juridisch-technisch bepaald; raadpleeg voor concrete plannen altijd de actuele legger en keur van het bevoegde waterschap.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Primaire Waterkering (GIS)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Primaire_waterkering/FeatureServer",
      },
    ],
  },
];
