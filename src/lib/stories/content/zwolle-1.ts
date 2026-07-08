/**
 * Story maps — batch "zwolle-1": gemeentelijke ArcGIS-lagen van gemeente Zwolle.
 *
 * Lagen: wegwerkzaamheden, wegwerkzaamheden-omleiding, hoofdfietsroutes,
 * strooiroute-fiets, strooiroute-weg, parkeerautomaten, parkeer-invaliden,
 * parkeer-zones, parkeer-betaald, parkeervakken, laadpalen,
 * laadpalen-aangevraagd, bag-zwolle, energielabels, erfgoed-rijksmonumenten,
 * erfgoed-gemeentemonumenten, beschermd-stadsgezicht.
 *
 * Deze lagen komen rechtstreeks uit de gemeentelijke ArcGIS-services
 * (gisservices.zwolle.nl) en worden gemeentebreed geladen (geen kaartuitsnede);
 * grote lagen worden gefaseerd geladen tot een limiet, met "laad meer" voor het
 * volledige beeld. Alle grafiek-properties zijn geverifieerd tegen een live
 * sample van de betreffende FeatureServer/MapServer-laag.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "wegwerkzaamheden",
    title: "Wegwerkzaamheden in {city}",
    subtitle:
      "Actuele wegwerkzaamheden en verkeersmaatregelen uit de NDW-melddienst",
    intro:
      "Op dit moment staan er **{count} wegwerkzaamheden** op de kaart van {city}, afkomstig uit de landelijke NDW-database en ontsloten via de gemeentelijke GIS-server. Elke lijn is een locatie waar gewerkt wordt of waar een verkeersmaatregel geldt — van een kleine snelheidsbeperking tot een volledige afsluiting. Klik op een lijn voor het traject, het type maatregel en de verwachte hinder.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meldingen in beeld", type: "count" },
          {
            label: "Afsluitingen",
            type: "count-where",
            property: "TYPE",
            equals: "Afsluiting",
          },
          {
            label: "Grote hinder (aandeel)",
            type: "count-where",
            property: "IMPACT",
            equals: ["Grote hinder", "HUGE"],
            asShare: true,
          },
          {
            label: "Getroffen trajecten",
            type: "distinct",
            property: "LOCATIONROAD",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Verwachte hinder van de werkzaamheden in {city}",
        description:
          "NDW-veld IMPACT: de ingeschatte impact op het wegverkeer per melding",
        property: "IMPACT",
        valueLabels: {
          "Kleine hinder": "Kleine hinder",
          "Matige hinder": "Matige hinder",
          "Grote hinder": "Grote hinder",
          HUGE: "Zeer grote hinder",
        },
      },
      {
        kind: "category-bar",
        title: "Aard van de melding",
        description:
          "NDW-veld ACTIVITYTYPE: gaat het om werkzaamheden, een evenement of vaarwegen?",
        property: "ACTIVITYTYPE",
        valueLabels: {
          Werk: "Wegwerkzaamheden",
          Evenement: "Evenement",
          Vaarwegen: "Vaarwegen",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is één actuele situatie uit de NDW-database: het traject waarop gewerkt wordt of waar een maatregel geldt. Het veld *TYPE* onderscheidt onder meer **afsluitingen** van **snelheidsbeperkingen**, en het veld *IMPACT* geeft de ingeschatte hinder voor het verkeer. Omdat dit een actuele registratie is, verandert het beeld van dag tot dag — meldingen verschijnen en verdwijnen zodra werk begint of klaar is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid**: opeenstapeling van werkzaamheden in één gebied kan de doorstroming en de bereikbaarheid van hulpdiensten flink raken.\n- **Communicatie**: bewoners en ondernemers willen weten waar en hoe lang hun straat op de schop gaat.\n- **Planning**: door lopende maatregelen te overzien kan de gemeente nieuwe opbrekingen beter faseren en conflicten voorkomen.",
      },
      {
        heading: "Over de bron",
        body: "De meldingen komen uit de **NDW** (Nationaal Dataportaal Wegverkeer), waar wegbeheerders hun werkzaamheden en evenementen aanleveren. Ze worden via de gemeentelijke GIS-server van {city} getoond. Let op: de dekking hangt af van wat wegbeheerders melden; kleine of last-minute klussen kunnen ontbreken, en een deel van de meldingen betreft evenementen in plaats van fysiek wegwerk.",
      },
    ],
    links: [
      { label: "NDW — Nationaal Dataportaal Wegverkeer", url: "https://www.ndw.nu/" },
      { label: "Gemeente Zwolle — werk aan de weg", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "wegwerkzaamheden-omleiding",
    title: "Omleidingsroutes in {city}",
    subtitle: "Aangewezen omleidingen bij wegwerkzaamheden (NDW)",
    intro:
      "Deze laag toont **{count} omleidingsroutes** in {city}: de routes die het verkeer volgt wanneer wegen door werkzaamheden of evenementen zijn afgesloten. Ze horen bij de wegwerkzaamheden-meldingen uit de NDW en laten zien langs welke wegen het omgeleide verkeer wordt geleid. Klik op een lijn voor het bijbehorende traject.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Omleidingen in beeld", type: "count" },
          {
            label: "Betrokken trajecten",
            type: "distinct",
            property: "LOCATIONROAD",
          },
          {
            label: "Bij grote hinder (aandeel)",
            type: "count-where",
            property: "IMPACT",
            equals: ["Grote hinder", "HUGE"],
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bijbehorende hinderklasse van de omleidingen in {city}",
        description:
          "NDW-veld IMPACT van de werkzaamheid waar de omleiding bij hoort",
        property: "IMPACT",
        valueLabels: {
          "Kleine hinder": "Kleine hinder",
          "Matige hinder": "Matige hinder",
          "Grote hinder": "Grote hinder",
          HUGE: "Zeer grote hinder",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Waar de wegwerkzaamheden-laag de *afsluitingen* toont, tekent deze laag de **uitwijkroutes**: de omleiding die weggebruikers wordt geadviseerd of opgelegd. Eén afsluiting kan meerdere omleidingen hebben (bijvoorbeeld per rijrichting), dus het aantal omleidingen hoeft niet één-op-één te sporen met het aantal afsluitingen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersdruk verplaatst zich**: een omleiding leidt extra verkeer over wegen die daar niet altijd op berekend zijn — relevant voor geluid, veiligheid en slijtage.\n- **Woonstraten en scholen**: omleidingsroutes langs kwetsbare locaties vragen om extra aandacht of tijdelijke maatregelen.\n- **Samenhang**: bekijk deze laag samen met de wegwerkzaamheden om afsluiting én uitwijkroute in één beeld te zien.",
      },
      {
        heading: "Over de bron",
        body: "De omleidingen komen net als de werkzaamheden uit de **NDW** en worden via de GIS-server van {city} ontsloten. Ze zijn zo actueel als de wegbeheerder ze aanlevert; na afronding van het werk verdwijnen ze weer van de kaart.",
      },
    ],
    links: [
      { label: "NDW — Nationaal Dataportaal Wegverkeer", url: "https://www.ndw.nu/" },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "hoofdfietsroutes",
    title: "Hoofdfietsroutes in {city}",
    subtitle: "Het hoofdnet voor de fiets: stads-, doorfiets- en recreatieve routes",
    intro:
      "Deze laag tekent het **hoofdfietsnetwerk** van {city}: **{count} routesegmenten** die samen de belangrijkste fietsverbindingen vormen. De gemeente onderscheidt drie soorten: snelle *doorfietsroutes* tussen wijken en kernen, *stadsroutes* voor het dagelijkse verkeer binnen de stad, en *recreatieve fietsroutes* door het groen. Klik op een segment voor de straatnaam en het routetype.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Routesegmenten in beeld", type: "count" },
          { label: "Straten in het netwerk", type: "distinct", property: "STRAATNAAM" },
          {
            label: "Doorfietsroute (aandeel)",
            type: "count-where",
            property: "TYPE_FIETSROUTE",
            equals: "Doorfietsroute",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Type fietsroute in {city}",
        description:
          "Gemeentelijk veld TYPE_FIETSROUTE: de functie van elk segment in het fietsnetwerk",
        property: "TYPE_FIETSROUTE",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het fietsnetwerk is opgeknipt in korte segmenten (meestal per straat of straatdeel); veel losse segmenten vormen samen één doorgaande route. Het onderscheid tussen de typen is beleidsmatig: een **doorfietsroute** is ingericht op snelheid en comfort over langere afstanden, een **stadsroute** verbindt wijken binnen de stad, en een **recreatieve route** is vooral bedoeld voor het ommetje of de fietstocht.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fietsstimulering**: een samenhangend, comfortabel hoofdnet is de ruggengraat van fietsbeleid en de overstap van auto naar fiets.\n- **Prioritering onderhoud**: hoofdroutes verdienen bij gladheid, onderhoud en herinrichting voorrang; zie ook de strooiroutelaag voor fietspaden.\n- **Ontbrekende schakels**: door het netwerk in kaart te brengen worden hiaten en onlogische omwegen zichtbaar.",
      },
      {
        heading: "Over de bron",
        body: "De hoofdfietsroutes worden beheerd door de gemeente {city} en via de eigen GIS-server ontsloten. Alle getoonde segmenten hebben status *Huidig* (bestaande routes); geplande uitbreidingen zitten er in deze weergave niet bij.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — fietsen", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "strooiroute-fiets",
    title: "Strooiroutes voor fietspaden in {city}",
    subtitle: "Welke fietspaden worden bij gladheid als eerste sneeuw- en ijsvrij gehouden",
    intro:
      "Bij gladheid strooit {city} niet overal tegelijk: eerst de belangrijkste routes. Deze laag toont de **{count} fietspadsegmenten** die tot de gestrooide fietsroutes horen. Zo zie je precies welke fietsverbindingen bij sneeuw en ijzel prioriteit krijgen, en wie de strooironde uitvoert. Klik op een segment voor de straatnaam en de uitvoerder.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Fietspadsegmenten in beeld", type: "count" },
          { label: "Straten op de route", type: "distinct", property: "STRAATNAAM" },
          {
            label: "Door de gemeente gestrooid (aandeel)",
            type: "count-where",
            property: "UITVOERDER_STROOIROUTE",
            equals: "Gemeente",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Uitvoerder van de strooiroute in {city}",
        description:
          "Gemeentelijk veld UITVOERDER_STROOIROUTE: wie het betreffende fietspad strooit",
        property: "UITVOERDER_STROOIROUTE",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk segment is een stuk fietspad dat bij gladheid wordt gestrooid. Fietspaden vragen aparte, smallere strooimaterieel dan wegen, en daarom is er een eigen fietsstrooiroute. Het veld *UITVOERDER_STROOIROUTE* laat zien of de gemeente strooit of dat een andere wegbeheerder (provincie, Rijkswaterstaat) of een derde partij dat doet op hun deel.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fietsveiligheid in de winter**: gladde fietspaden zijn een belangrijke oorzaak van winterse valpartijen; de keuze wélke paden gestrooid worden is dus direct veiligheidsbeleid.\n- **Verwachtingsmanagement**: bewoners kunnen zien of hún fietsroute op de strooiroute ligt.\n- **Samenhang met het hoofdfietsnet**: idealiter overlappen de gestrooide routes met de hoofdfietsroutes uit de vorige laag.",
      },
      {
        heading: "Over de bron",
        body: "De strooiroutes worden beheerd door {city} en via de gemeentelijke GIS-server ontsloten. De feitelijke inzet hangt af van de weersverwachting en het gladheidsbeleid; deze kaart toont het *voorgenomen* routenetwerk, niet een specifieke strooironde.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — gladheidsbestrijding", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "strooiroute-weg",
    title: "Strooiroutes voor wegen in {city}",
    subtitle: "De wegen die bij gladheid als eerste worden gestrooid",
    intro:
      "Deze laag toont de **{count} wegsegmenten** die {city} bij gladheid strooit: de hoofdroutes voor het autoverkeer die als eerste sneeuw- en ijsvrij worden gehouden. Samen vormen ze het strooinetwerk voor wegen. Klik op een segment voor de straatnaam en de uitvoerder van de strooironde.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegsegmenten in beeld", type: "count" },
          { label: "Straten op de route", type: "distinct", property: "STRAATNAAM" },
          {
            label: "Door de gemeente gestrooid (aandeel)",
            type: "count-where",
            property: "UITVOERDER_STROOIROUTE",
            equals: "Gemeente",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Uitvoerder van de strooiroute in {city}",
        description:
          "Gemeentelijk veld UITVOERDER_STROOIROUTE: wie de betreffende weg strooit",
        property: "UITVOERDER_STROOIROUTE",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk segment is een stuk weg dat bij gladheid wordt gestrooid. Deze route bestaat uit de wegen met de grootste verkeers- en veiligheidsbelangen — doorgaande wegen, busroutes en toegangen tot voorzieningen. Woonstraten en doodlopende wegen liggen meestal níet op de strooiroute. Het veld *UITVOERDER_STROOIROUTE* onderscheidt gemeentelijke wegen van provinciale wegen en rijkswegen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid en veiligheid**: gestrooide hoofdwegen houden hulpdiensten, openbaar vervoer en dagelijks verkeer op gang tijdens winterweer.\n- **Keuzes in beeld**: de kaart maakt inzichtelijk welke straten wél en niet worden gestrooid — nuttig bij vragen en klachten.\n- **Afstemming met buurbeheerders**: op provinciale en rijkswegen strooit een andere partij; de laag laat die overgangen zien.",
      },
      {
        heading: "Over de bron",
        body: "De strooiroutes voor wegen worden beheerd door {city} en via de gemeentelijke GIS-server ontsloten. De kaart toont het voorgenomen strooinetwerk; of en wanneer daadwerkelijk wordt uitgerukt hangt af van de gladheidsverwachting.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — gladheidsbestrijding", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "parkeerautomaten",
    title: "Parkeerautomaten in {city}",
    subtitle: "Locaties van de parkeerautomaten in het betaald-parkerengebied",
    intro:
      "Deze laag toont **{count} parkeerautomaten** in {city}. Elke stip is een automaat waar bezoekers hun parkeergeld voldoen; samen markeren ze het gebied waar betaald parkeren geldt. Klik op een automaat voor de straat en het automaattype.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Automaten in beeld", type: "count" },
          { label: "Straten met een automaat", type: "distinct", property: "STRAAT" },
          { label: "Automaattypen", type: "distinct", property: "TYPE" },
        ],
      },
      {
        kind: "category-bar",
        title: "Type parkeerautomaat in {city}",
        description:
          "Gemeentelijk veld TYPE: het model/merk van de automaat",
        property: "TYPE",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Iedere stip is een fysieke parkeerautomaat. Het veld *TYPE* verwijst naar het model of merk van de automaat (bijvoorbeeld *Strada* of *CCT S5*); de gemeente beheert verschillende generaties automaten naast elkaar. De spreiding van de stippen geeft een goed beeld van waar in de stad betaald parkeren wordt gehandhaafd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en onderhoud**: het automatentype bepaalt onderhoud, betaalmogelijkheden en vervangingsplanning.\n- **Dienstverlening**: steeds meer betalingen lopen via kentekenparkeren en apps; het aantal fysieke automaten kan daardoor in de tijd afnemen.\n- **Context**: combineer deze laag met de parkeerzones en betaald-parkerenvlakken voor het complete beeld van het parkeerregime.",
      },
      {
        heading: "Over de bron",
        body: "De parkeerautomaten worden beheerd door {city} en via de gemeentelijke GIS-server ontsloten. Automaten die net zijn geplaatst of verwijderd kunnen kortstondig afwijken van de situatie op straat.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — parkeren", url: "https://www.zwolle.nl/parkeren" },
    ],
  },
  {
    layerId: "parkeer-invaliden",
    title: "Gehandicaptenparkeerplaatsen in {city}",
    subtitle: "Openbare invalidenparkeerplaatsen op straat",
    intro:
      "Deze laag toont **{count} gehandicaptenparkeerplaatsen** in {city}: parkeervakken die zijn gereserveerd voor mensen met een gehandicaptenparkeerkaart. Klik op een locatie voor de straat en omschrijving. Het gaat om de algemeen toegankelijke plekken, niet om plaatsen op kenteken.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Plaatsen in beeld", type: "count" },
          { label: "Verschillende locaties", type: "distinct", property: "LOCATIE" },
          {
            label: "Openbaar toegankelijk",
            type: "count-where",
            property: "SOORT",
            equals: "Openbaar",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een gehandicaptenparkeerplaats in de openbare ruimte. Het veld *SOORT* geeft aan of het om een algemeen toegankelijke (openbare) plek gaat, en *LOCATIE* beschrijft waar de plaats zich bevindt (bijvoorbeeld ter hoogte van een adres). Het gaat om een klein, overzichtelijk aantal plekken, verspreid over de stad.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toegankelijkheid**: voldoende en goed gespreide invalidenparkeerplaatsen zijn essentieel voor de zelfstandigheid van mensen met een beperking.\n- **Voorzieningen**: nabijheid van winkels, zorg en publieke gebouwen bepaalt of het aanbod aansluit bij de vraag.\n- **Aanvragen**: naast deze openbare plekken kent de gemeente ook plekken op kenteken toe; die vallen buiten deze laag.",
      },
      {
        heading: "Over de bron",
        body: "De gehandicaptenparkeerplaatsen worden beheerd door {city} en via de gemeentelijke GIS-server ontsloten. De registratie kan iets achterlopen op recent aangelegde of opgeheven plekken.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — gehandicaptenparkeren", url: "https://www.zwolle.nl/parkeren" },
    ],
  },
  {
    layerId: "parkeer-zones",
    title: "Parkeerzones in {city}",
    subtitle: "De reguleringsgebieden voor parkeren",
    intro:
      "Deze laag toont de **{count} parkeerzones** van {city}: de gebieden waarbinnen een bepaald parkeerregime geldt. De zones bakenen af waar en onder welke voorwaarden je mag parkeren, en vormen de basis voor tarieven en vergunningen. Klik op een zone voor de naam en meer informatie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zones in beeld", type: "count" },
          { label: "Verschillende zones", type: "distinct", property: "NAAM" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke vlak is een parkeerzone met een eigen naam (bijvoorbeeld *Zone I* tot en met *Zone IV*). De zones lopen doorgaans van het centrum naar buiten toe, waarbij het centrum het strengste regime en de hoogste tarieven kent. De zone-indeling bepaalt onder meer welke bewonersvergunning waar geldig is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Parkeerbeleid in één beeld**: de zones vertalen abstract beleid naar concrete gebieden op de kaart.\n- **Vergunningen**: bewoners- en bedrijfsvergunningen zijn aan een zone gekoppeld; de grenzen bepalen wie waar mag staan.\n- **Sturing**: door tarieven en regimes per zone te variëren stuurt de gemeente op parkeerdruk en doorstroming.",
      },
      {
        heading: "Over de bron",
        body: "De parkeerzones worden beheerd door {city} en via de gemeentelijke GIS-server ontsloten. Bekijk deze laag samen met de betaald-parkerenvlakken en parkeerautomaten voor het volledige regime.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — parkeren", url: "https://www.zwolle.nl/parkeren" },
    ],
  },
  {
    layerId: "parkeer-betaald",
    title: "Betaald parkeren in {city}",
    subtitle: "De vlakken waar op straat betaald parkeren geldt",
    intro:
      "Deze laag toont **{count} gebieden** met betaald parkeren in {city}, inclusief het aantal betaalde parkeerplaatsen per vlak. Samen geven ze een beeld van de omvang van het gereguleerde straatparkeren. Klik op een vlak voor het type regime en het aantal plaatsen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vlakken in beeld", type: "count" },
          {
            label: "Betaalde plaatsen (totaal)",
            type: "sum",
            property: "P_BS_AANT",
            decimals: 0,
          },
          {
            label: "Plaatsen per vlak (gemiddeld)",
            type: "avg",
            property: "P_BS_AANT",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Grootte van de betaald-parkerenvlakken in {city}",
        description:
          "Aantal betaalde parkeerplaatsen (P_BS_AANT) per vlak",
        property: "P_BS_AANT",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een aaneengesloten gebied waar op straat betaald parkeren geldt. Het veld *P_BS_AANT* telt het aantal betaalde plaatsen binnen dat vlak, zodat je niet alleen de ligging maar ook de capaciteit ziet. Kleine vlakken zijn losse straatdelen; grote vlakken beslaan hele blokken of pleinen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Capaciteit en inkomsten**: het totale aantal betaalde plaatsen bepaalt zowel de parkeerruimte als de parkeeropbrengsten.\n- **Parkeerdruk**: waar betaald parkeren begint en eindigt, verschuift vaak de druk naar aangrenzende gratis straten.\n- **Samenhang**: leg deze laag over de parkeerzones om regime én capaciteit in één beeld te zien.",
      },
      {
        heading: "Over de bron",
        body: "De betaald-parkerenvlakken worden beheerd door {city} en via de gemeentelijke GIS-server ontsloten. Het aantal plaatsen is een registratiewaarde en kan bij herinrichting van straten iets afwijken van de actuele situatie.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — parkeren", url: "https://www.zwolle.nl/parkeren" },
    ],
  },
  {
    layerId: "parkeervakken",
    title: "Parkeervakken in {city}",
    subtitle: "Individuele parkeervakken op straat, met hun functie",
    intro:
      "Deze laag brengt losse **parkeervakken** in {city} in beeld — hier **{count} vakken** geladen. Elk vlak is één parkeerplaats op straat, met een functie zoals vrij parkeren, vergunninghouders, laden en lossen of invalidenparkeren. Het is een grote laag; standaard wordt een deel getoond, gebruik *laad meer* voor het volledige beeld.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Parkeervakken in beeld", type: "count" },
          {
            label: "Vrij parkeren (aandeel)",
            type: "count-where",
            property: "TYPEVLAK",
            equals: "Vrij parkeren",
            asShare: true,
          },
          {
            label: "Met laadplek",
            type: "count-where",
            property: "OPLAADPLAATS",
            equals: "Ja",
          },
          {
            label: "Op een parkeerterrein",
            type: "count-where",
            property: "PARKEERTERREIN",
            equals: "Ja",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Functie van de parkeervakken in {city}",
        description:
          "Gemeentelijk veld TYPEVLAK: waarvoor het parkeervak bestemd is",
        property: "TYPEVLAK",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is één parkeerplek. Het veld *TYPEVLAK* geeft de functie: van gewoon **vrij parkeren** tot plaatsen voor **vergunninghouders**, **invalidenparkeren**, **laden en lossen**, **taxi**, **autodelen** en meer. De laag laat daarmee heel fijnmazig zien hoe de openbare parkeerruimte is verdeeld — iets wat op zone- of vlakniveau verborgen blijft.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtegebruik**: parkeervakken beslaan een aanzienlijk deel van de openbare ruimte; inzicht helpt bij herinrichting en vergroening.\n- **Doelgroepen**: het aandeel vergunning-, invaliden- en laadplekken laat zien hoe de gemeente ruimte reserveert voor specifieke behoeften.\n- **Laadinfrastructuur**: het veld *OPLAADPLAATS* koppelt parkeervakken aan laadpalen — samen te lezen met de laadpalen-laag.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De parkeervakken worden beheerd door {city} en via de gemeentelijke GIS-server ontsloten. Dit is een omvangrijke laag met tienduizenden vakken: standaard wordt slechts een deel geladen, dus de cijfers gaan over de **geladen selectie**, niet automatisch over de hele gemeente. Gebruik *laad meer* voor het complete beeld. Het veld *OPLAADPLAATS* is niet overal ingevuld.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — parkeren", url: "https://www.zwolle.nl/parkeren" },
    ],
  },
  {
    layerId: "laadpalen",
    title: "Laadpalen in {city}",
    subtitle: "Bestaande openbare laadlocaties voor elektrische auto's",
    intro:
      "Deze laag toont **{count} bestaande laadpaallocaties** in {city}: de plekken in de openbare ruimte waar elektrische auto's kunnen laden. Elke stip is een laadlocatie, met waar bekend de exploitant en het laadvermogen. Klik op een paal voor de straat en de eigenaar.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Laadlocaties in beeld", type: "count" },
          { label: "Straten met een laadpaal", type: "distinct", property: "STRAAT" },
          { label: "Verschillende exploitanten", type: "distinct", property: "EIGENAAR" },
        ],
      },
      {
        kind: "category-bar",
        title: "Exploitant van de laadpalen in {city}",
        description:
          "Gemeentelijk veld EIGENAAR: de partij die de laadpaal beheert",
        property: "EIGENAAR",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een bestaande openbare laadlocatie. Het veld *EIGENAAR* verwijst naar de exploitant/beheerder (zoals *Allego* of *EVnetNL*); bij een deel van de palen is dat veld niet ingevuld. Waar bekend staat ook het *VERMOGEN* geregistreerd. De spreiding van de stippen laat zien hoe de laadinfrastructuur over de wijken is verdeeld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energietransitie**: een dekkend laadnetwerk is een voorwaarde voor de overstap naar elektrisch rijden, zeker voor bewoners zonder eigen oprit.\n- **Plaatsingsbeleid**: de gemeente plaatst laadpalen deels op basis van aanvragen en deels proactief; de spreiding laat witte vlekken zien.\n- **Samenhang**: combineer met de laag *laadpalen (aangevraagd)* om te zien waar het netwerk binnenkort groeit.",
      },
      {
        heading: "Over de bron",
        body: "De laadpalen worden beheerd/geregistreerd door {city} en via de gemeentelijke GIS-server ontsloten. Omdat het netwerk snel groeit, kan de registratie iets achterlopen op recent geplaatste palen; het veld *EIGENAAR* en *VERMOGEN* is niet altijd volledig ingevuld.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — elektrisch laden", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "laadpalen-aangevraagd",
    title: "Aangevraagde laadpalen in {city}",
    subtitle: "Laadlocaties die zijn aangevraagd maar nog niet gerealiseerd",
    intro:
      "Deze laag toont **{count} aangevraagde laadpaallocaties** in {city}: plekken waarvoor een laadpaal is aangevraagd maar die nog niet (volledig) in gebruik zijn. Samen geven ze een blik op de groei van het laadnetwerk. Klik op een locatie voor de straat en, waar bekend, de aanvragende partij.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Aanvragen in beeld", type: "count" },
          { label: "Betrokken straten", type: "distinct", property: "STRAAT" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een aangevraagde laadlocatie: een plek die in de pijplijn zit om een laadpaal te krijgen. Voor deze locaties zijn velden als *EIGENAAR* en *VERMOGEN* nog grotendeels leeg — die worden pas ingevuld zodra de paal daadwerkelijk wordt geplaatst en overgaat naar de laag met bestaande laadpalen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vooruitblik**: de aanvragen laten zien waar het laadnetwerk op korte termijn wordt verdicht.\n- **Vraaggestuurd beleid**: veel palen worden geplaatst na een aanvraag van een bewoner met een elektrische auto; de spreiding van aanvragen weerspiegelt de vraag.\n- **Samenhang**: leg deze laag over de bestaande laadpalen om huidige dekking en toekomstige groei samen te zien.",
      },
      {
        heading: "Over de bron",
        body: "De aangevraagde laadpalen worden geregistreerd door {city} en via de gemeentelijke GIS-server ontsloten. Een aanvraag is geen garantie: locaties kunnen alsnog verschuiven of afvallen in het vergunnings- en plaatsingsproces.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — elektrisch laden", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "bag-zwolle",
    title: "Panden in {city} (BAG)",
    subtitle: "Alle geregistreerde panden met bouwjaar en status uit de lokale BAG",
    intro:
      "Deze laag toont de **panden** van {city} uit de Basisregistratie Adressen en Gebouwen (BAG), via de gemeentelijke GIS-server — hier **{count} panden** geladen. Elk vlak is één pand met een oorspronkelijk bouwjaar en een status. Het is een zeer grote laag; standaard wordt een deel geladen, gebruik *laad meer* voor het volledige beeld.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Panden in beeld", type: "count" },
          {
            label: "In gebruik (aandeel)",
            type: "count-where",
            property: "STATUS",
            equals: "Pand in gebruik",
            asShare: true,
          },
          {
            label: "Mediaan bouwjaar",
            type: "median",
            property: "OORSPRONKELIJK_BOUWJAAR",
            decimals: 0,
          },
          {
            label: "In aanbouw",
            type: "count-where",
            property: "STATUS",
            equals: ["Bouw gestart", "Bouwvergunning verleend"],
          },
        ],
      },
      {
        kind: "histogram",
        title: "Bouwjaar van de panden in {city}",
        description:
          "BAG-veld OORSPRONKELIJK_BOUWJAAR: het oorspronkelijke bouwjaar per pand",
        property: "OORSPRONKELIJK_BOUWJAAR",
        bins: 10,
      },
      {
        kind: "category-bar",
        title: "Status van de panden in {city}",
        description:
          "BAG-veld STATUS: de levenscyclusstatus van het pand",
        property: "STATUS",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een pand zoals geregistreerd in de BAG. Het **oorspronkelijk bouwjaar** vertelt uit welke bouwperiode een pand stamt (let op: bij grondige verbouwingen blijft het oorspronkelijke jaar staan). De **status** loopt van *Pand in gebruik* tot statussen als *Bouw gestart* of *Sloopvergunning verleend* — zo zie je zowel de bestaande voorraad als wat er verandert.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woningvoorraad en verduurzaming**: de bouwjaarverdeling is een sterke indicator voor isolatie- en energieopgaven; vooroorlogse en naoorlogse wijken hebben elk hun eigen aanpak.\n- **Ontwikkeling in beeld**: statussen als *bouw gestart* laten zien waar de stad fysiek groeit of transformeert.\n- **Basisregistratie**: de BAG is dé wettelijke bron voor panden en adressen en de basis voor tal van andere registraties.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Dit is de BAG zoals ontsloten via de GIS-server van {city}. Het is een zeer grote laag: standaard wordt een deel van de panden geladen, dus de cijfers gaan over de **geladen selectie**. Gebruik *laad meer* voor het volledige beeld. Een enkel pand kan een onbekend of afwijkend bouwjaar hebben; zulke waarden vertekenen de uiterste bins van het histogram.",
      },
    ],
    links: [
      { label: "Over de BAG (Kadaster)", url: "https://www.kadaster.nl/zakelijk/registraties/basisregistraties/bag" },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "energielabels",
    title: "Energielabels in {city}",
    subtitle: "Geregistreerde energielabels van gebouwen (bron: EP-online, RVO)",
    intro:
      "Deze laag toont geregistreerde **energielabels** van gebouwen in {city} — hier **{count} labels** geladen. Elk punt is een pand met een definitief energielabel, van het zeer zuinige *A++++* tot het slechte *G*. Het is een grote laag; standaard wordt een deel geladen, gebruik *laad meer* voor het volledige beeld. Klik op een punt voor het label, gebouwtype en adres.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Labels in beeld", type: "count" },
          {
            label: "Woningen (aandeel)",
            type: "count-where",
            property: "GEBRUIKSDOEL",
            equals: "woonfunctie",
            asShare: true,
          },
          {
            label: "Groen label A–B (aandeel)",
            type: "count-where",
            property: "ENERGIELABEL",
            equals: ["A", "A+", "A++", "A+++", "A++++", "A+++++", "B"],
            asShare: true,
          },
          {
            label: "Wijken in beeld",
            type: "distinct",
            property: "WIJKNAAM",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Verdeling van de energielabels in {city}",
        description:
          "Veld ENERGIELABEL uit EP-online; van A++++ (zeer zuinig) tot G",
        property: "ENERGIELABEL",
        maxCategories: 12,
      },
      {
        kind: "category-bar",
        title: "Gebouwtype van de gelabelde panden in {city}",
        description:
          "Veld GEBOUWTYPE: het type woning of gebouw waarvoor het label geldt",
        property: "GEBOUWTYPE",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een pand met een **definitief energielabel** uit de landelijke registratie EP-online van de RVO. Het label loopt van *A++++* (uiterst zuinig) tot *G* (zeer onzuinig) en wordt bepaald volgens de NTA 8800-methodiek. Naast het label bevat elk punt onder meer het *gebouwtype*, het *gebruiksdoel* (woon-, winkel-, kantoorfunctie) en de energiebehoefte.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verduurzamingsopgave**: de labelverdeling laat zien hoeveel panden nog een slechte energieprestatie hebben en dus prioriteit verdienen bij isolatie en verduurzaming.\n- **Wijkaanpak**: door labels met wijk en gebouwtype te combineren kun je gericht wijken of woningtypen selecteren voor programma's.\n- **Monitoring**: het aandeel groene labels is een tastbare graadmeter voor de voortgang van de energietransitie.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De labels komen uit **EP-online** (RVO) en worden via de GIS-server van {city} getoond. Belangrijke kanttekeningen:\n- Alleen panden met een **geregistreerd** label staan erin; panden zonder afgemeld label ontbreken volledig.\n- Dit is een grote laag: standaard wordt een deel geladen, dus de cijfers gaan over de geladen selectie. Gebruik *laad meer* voor het volledige beeld.\n- Het label geldt per registratie, niet per se voor elk zelfstandig adres in een pand.",
      },
    ],
    links: [
      { label: "EP-online (RVO) — energielabels", url: "https://www.ep-online.nl/" },
      { label: "RVO — energielabel gebouwen", url: "https://www.rvo.nl/onderwerpen/energielabel" },
    ],
  },
  {
    layerId: "erfgoed-rijksmonumenten",
    title: "Rijksmonumenten in {city}",
    subtitle: "Door het Rijk beschermde monumenten",
    intro:
      "Deze laag toont **{count} rijksmonumenten** in {city}: gebouwen en objecten die door het Rijk zijn aangewezen vanwege hun nationale cultuurhistorische waarde. Elk vlak is een beschermd monument met een monumentnummer en een korte omschrijving. Klik op een monument voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Rijksmonumenten in beeld", type: "count" },
          {
            label: "Verschillende omschrijvingen",
            type: "distinct",
            property: "KORTE_OMSCHRIJVING",
          },
          {
            label: "Monumentnummers",
            type: "distinct",
            property: "MONUMENTCODE",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een rijksmonument: een object dat op de landelijke monumentenlijst staat en daarmee wettelijke bescherming geniet. Het veld *KORTE_OMSCHRIJVING* typeert het monument (bijvoorbeeld een specifiek gebouw of bouwwerk) en *MONUMENTCODE* is het unieke rijksmonumentnummer waaronder het is ingeschreven. Rijksmonumenten concentreren zich sterk in de historische binnenstad.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bescherming**: voor wijzigingen aan een rijksmonument gelden strenge regels en is vaak een omgevingsvergunning nodig.\n- **Ruimtelijke plannen**: bij herontwikkeling en verduurzaming moet met de monumentale status rekening worden gehouden.\n- **Identiteit**: rijksmonumenten dragen sterk bij aan het karakter en de aantrekkelijkheid van de stad.",
      },
      {
        heading: "Over de bron",
        body: "De rijksmonumenten worden via de gemeentelijke erfgoed-GIS van {city} ontsloten en zijn gebaseerd op het landelijke rijksmonumentenregister. Bekijk deze laag samen met de gemeentelijke monumenten en het beschermd stadsgezicht voor het volledige erfgoedbeeld. Een deel van de aanvullende velden (zoals bouwstijl of bouwjaar) is niet voor elk monument ingevuld.",
      },
    ],
    links: [
      { label: "Rijksdienst voor het Cultureel Erfgoed — monumentenregister", url: "https://www.monumentenregister.cultureelerfgoed.nl/" },
      { label: "Gemeente Zwolle — monumenten", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "erfgoed-gemeentemonumenten",
    title: "Gemeentelijke monumenten in {city}",
    subtitle: "Door de gemeente aangewezen monumenten",
    intro:
      "Deze laag toont **{count} gemeentelijke monumenten** in {city}: panden en objecten die de gemeente zelf heeft aangewezen vanwege hun lokale cultuurhistorische waarde. Ze vullen de rijksmonumenten aan met erfgoed dat vooral voor de stad zelf betekenisvol is. Klik op een monument voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gemeentelijke monumenten in beeld", type: "count" },
          {
            label: "Verschillende omschrijvingen",
            type: "distinct",
            property: "KORTE_OMSCHRIJVING",
          },
          {
            label: "Monumentnummers",
            type: "distinct",
            property: "MONUMENTCODE",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gemeentelijk monument: aangewezen door de gemeente {city} op grond van de lokale erfgoedverordening. Waar rijksmonumenten van nationaal belang zijn, gaat het hier om objecten die vooral voor de geschiedenis en het aanzien van de stad zelf waardevol zijn. Het veld *MONUMENTCODE* bevat het gemeentelijke monumentnummer.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Lokale bescherming**: ook voor gemeentelijke monumenten gelden regels bij verbouwing of sloop, zij het minder streng dan bij rijksmonumenten.\n- **Compleet erfgoedbeeld**: samen met de rijksmonumenten vormen ze de volledige beschermde monumentenvoorraad van de stad.\n- **Beleid**: de lijst is de basis voor subsidies, advies en handhaving rond gemeentelijk erfgoed.",
      },
      {
        heading: "Over de bron",
        body: "De gemeentelijke monumenten worden via de erfgoed-GIS van {city} ontsloten. Aanvullende velden zoals *BOUWSTIJL* en *BOUWJAAR* zijn als vrije tekst ingevuld en niet gestandaardiseerd, waardoor ze zich minder goed lenen voor statistiek; daarom tonen we hier vooral de aantallen en het aantal unieke omschrijvingen.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — monumenten", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "beschermd-stadsgezicht",
    title: "Beschermd stadsgezicht in {city}",
    subtitle: "Het gebied met een beschermde historische structuur",
    intro:
      "Deze laag toont het **beschermd stadsgezicht** van {city}: het samenhangende gebied — de historische binnenstad — waarvan de stedenbouwkundige structuur en het karakter wettelijk worden beschermd. Anders dan bij losse monumenten gaat het hier om het **geheel**: het stratenpatroon, de bebouwing en de ruimtelijke opzet samen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Beschermde gebieden in beeld", type: "count" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het vlak markeert de begrenzing van het beschermd stadsgezicht (de *Historische binnenstad*). Binnen deze grens is niet één gebouw beschermd, maar de **samenhang**: het historische stratenpatroon, de schaal van de bebouwing en de karakteristieke ruimtelijke opbouw. Nieuwe ontwikkelingen moeten zich naar dat karakter voegen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke kwaliteit**: binnen het beschermd stadsgezicht gelden extra eisen aan nieuwbouw, verbouw en inrichting van de openbare ruimte.\n- **Vergunningen**: plannen worden getoetst aan het behoud van het historische karakter, vaak met advies van een monumenten- of welstandscommissie.\n- **Context**: leg deze laag over de rijks- en gemeentelijke monumenten om te zien hoe de losse monumenten in het beschermde geheel liggen.",
      },
      {
        heading: "Over de bron",
        body: "Het beschermd stadsgezicht wordt via de erfgoed-GIS van {city} ontsloten en is gebaseerd op de rijksaanwijzing van beschermde stads- en dorpsgezichten. Het betreft één samenhangend gebied; de statistiek beperkt zich daarom tot de aanwezigheid en begrenzing ervan.",
      },
    ],
    links: [
      { label: "Rijksdienst voor het Cultureel Erfgoed — stads- en dorpsgezichten", url: "https://www.cultureelerfgoed.nl/onderwerpen/stads-en-dorpsgezichten" },
      { label: "Gemeente Zwolle — binnenstad", url: "https://www.zwolle.nl/" },
    ],
  },
];
