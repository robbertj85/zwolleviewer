/**
 * Story maps — batch "ndw-live": realtime verkeersdata (NDW & UDAP).
 * Lagen: traffic-lights, ndw-incidenten, ndw-actueel, ndw-brugopeningen,
 * ndw-maxsnelheden, ndw-msi, ndw-trafficspeed.
 */

import type { StoryDefinition } from "../types";

/** Nettere labels voor DATEX II situationRecord-typen (property `type`). */
const SITUATION_TYPE_LABELS: Record<string, string> = {
  "sit:Accident": "Ongeval",
  "sit:AbnormalTraffic": "File / abnormaal verkeer",
  "sit:VehicleObstruction": "Voertuigobstructie",
  brokenDownVehicle: "Pechgeval",
  abandonedVehicle: "Achtergelaten voertuig",
  other: "Voertuigobstructie (overig)",
  "sit:GeneralObstruction": "Obstakel op de weg",
  "sit:RoadOrCarriagewayOrLaneManagement": "Weg- of rijstrookmaatregel",
  "sit:SpeedManagement": "Snelheidsmaatregel",
  "sit:ReroutingManagement": "Omleiding",
  "sit:GeneralNetworkManagement": "Netwerkbeheer (o.a. brugopening)",
  "sit:MaintenanceWorks": "Wegwerkzaamheden",
  "sit:PublicEvent": "Evenement",
  "sit:EnvironmentalObstruction": "Natuurlijke obstructie",
};

/** Nettere labels voor DATEX II overallSeverity (property `severity`). */
const SEVERITY_LABELS: Record<string, string> = {
  highest: "Zeer hoog",
  high: "Hoog",
  medium: "Gemiddeld",
  low: "Laag",
  lowest: "Zeer laag",
  none: "Geen",
  unknown: "Onbekend",
};

export const stories: StoryDefinition[] = [
  // ─── Verkeerslichten (iVRI) ────────────────────────────────
  {
    layerId: "traffic-lights",
    title: "Intelligente verkeerslichten in {city}",
    subtitle:
      "iVRI's uit het landelijke UDAP-netwerk, via verkeerslichtenviewer.nl",
    intro:
      "Binnen het kaartgebied van {city} staan **{count} intelligente verkeersregelinstallaties (iVRI's)** die zijn aangesloten op het landelijke UDAP-platform. Een iVRI is een verkeerslicht dat realtime data uitwisselt met voertuigen en apps: het “ziet” aankomend verkeer en kan prioriteit geven aan bijvoorbeeld hulpdiensten, bussen of vrachtverkeer. Klik op een punt voor de naam, de wegbeheerder en de ingestelde prioriteitsklassen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "iVRI's in beeld", type: "count" },
          {
            label: "Met hulpdienst-prioriteit",
            type: "count-where",
            property: "has_emergency",
            equals: "true",
            asShare: true,
          },
          {
            label: "Met OV-prioriteit",
            type: "count-where",
            property: "has_public_transport",
            equals: "true",
            asShare: true,
          },
          {
            label: "Gem. prioriteitsklassen",
            type: "avg",
            property: "priority_count",
            decimals: 1,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Leveranciers van de verkeersregelinstallaties in {city}",
        description:
          "Veld tlc_organization: de partij die de traffic light controller (TLC) levert en beheert",
        property: "tlc_organization",
      },
      {
        kind: "category-bar",
        title: "Aantal prioriteitsklassen per iVRI",
        description:
          "Hoeveel doelgroepen (hulpdiensten, OV, logistiek, landbouw, wegbeheerder) prioriteit kunnen aanvragen",
        property: "priority_count",
        valueLabels: {
          "0": "Geen prioriteit ingesteld",
          "1": "1 doelgroep",
          "2": "2 doelgroepen",
          "3": "3 doelgroepen",
          "4": "4 doelgroepen",
          "5": "5 doelgroepen",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één iVRI: een kruispunt waarvan het verkeerslicht is aangesloten op het **UDAP-netwerk** (Urban Data Access Platform, onderdeel van het landelijke Talking Traffic-programma). Per installatie is zichtbaar welke *prioriteitsklassen* actief zijn:\n\n- **Hulpdiensten** — ambulance, brandweer en politie krijgen sneller groen bij een spoedrit.\n- **Openbaar vervoer** — bussen melden zich aan en hoeven minder vaak te stoppen.\n- **Logistiek** — vrachtverkeer op corridors kan een groengolf aanvragen.\n- **Wegbeheerder / landbouw** — voor beheerdoeleinden of langzaam landbouwverkeer.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "iVRI's zijn een kernonderdeel van **smart mobility**: ze verbeteren de doorstroming zonder extra asfalt. Voor {city} laat deze kaart zien welk deel van de kruispunten al “slim” is en welke doelgroepen daar baat bij hebben. Een hoog aandeel OV-prioriteit betekent bijvoorbeeld betrouwbaardere busdiensten; hulpdienst-prioriteit verkort aanrijtijden meetbaar. Kruispunten die hier *niet* op de kaart staan, hebben (nog) een klassieke verkeersregelinstallatie.",
      },
      {
        heading: "Over de bron",
        body: "De data komt van **verkeerslichtenviewer.nl**, dat het actuele iVRI-bestand uit UDAP ontsluit. De kaart toont alleen installaties binnen de kaartuitsnede van {city}; de aantallen gaan dus over dit gebied, niet exact over de gemeentegrens. De configuratie (welke prioriteiten aanstaan) wordt door de wegbeheerder ingesteld en kan wijzigen.",
      },
    ],
    links: [
      {
        label: "Verkeerslichtenviewer (brondata)",
        url: "https://verkeerslichtenviewer.nl",
      },
      {
        label: "Talking Traffic — over iVRI's",
        url: "https://www.talking-traffic.com",
      },
    ],
  },

  // ─── NDW Incidenten ────────────────────────────────────────
  {
    layerId: "ndw-incidenten",
    title: "Verkeersincidenten rond {city}",
    subtitle:
      "Actuele incidenten, pechgevallen en situatieberichten uit het NDW Actueel Beeld",
    intro:
      "Op dit moment zijn er **{count} actuele incidentmeldingen** in beeld rond {city} — denk aan ongevallen, pechgevallen, obstakels op de weg en verkeersmaatregelen. De data komt live uit het *Actueel Beeld* van het Nationaal Dataportaal Wegverkeer (NDW) en ververst elke minuut. Geen stippen op de kaart? Dan is het op dit moment gewoon rustig op de weg.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meldingen in beeld", type: "count" },
          {
            label: "Ongevallen",
            type: "count-where",
            property: "type",
            equals: "sit:Accident",
          },
          {
            label: "Pech & voertuigobstructies",
            type: "count-where",
            property: "type",
            equals: ["brokenDownVehicle", "other", "sit:VehicleObstruction"],
          },
          { label: "Verschillende typen", type: "distinct", property: "type" },
        ],
      },
      {
        kind: "category-bar",
        title: "Actuele meldingen rond {city}, per type",
        description:
          "DATEX II situationRecord-typen zoals aangeleverd door wegbeheerders en weginspecteurs",
        property: "type",
        valueLabels: SITUATION_TYPE_LABELS,
      },
      {
        kind: "category-bar",
        title: "Ernst van de meldingen",
        description:
          "Veld overallSeverity — de door de melder ingeschatte impact op het verkeer",
        property: "severity",
        valueLabels: SEVERITY_LABELS,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één *situationRecord* uit het DATEX II-bericht van NDW: een gebeurtenis op of langs de weg met een locatie, een type en een geldigheidsperiode. De meest voorkomende categorieën:\n\n- **Ongevallen en pechgevallen** — gemeld door weginspecteurs, politie of via voertuigdata.\n- **Obstakels** — verloren lading, objecten op de rijbaan.\n- **Verkeersmaatregelen** — rijstrookafzettingen, omleidingen en snelheidsbeperkingen die met een incident samenhangen.",
      },
      {
        heading: "Hoe lees je dit als momentopname?",
        body: "Dit is een **realtime momentopname**: de teller kan legitiem op nul staan als er niets aan de hand is, en tijdens een avondspits of storm juist oplopen. NDW-data is sterk gericht op het hoofdwegennet; de kaartuitsnede is daarom iets ruimer genomen dan de gemeente zelf, zodat ook de snelwegen en N-wegen rond {city} meetellen. Meldingen binnen de bebouwde kom (gemeentelijke wegen) zijn dunner gezaaid in deze bron.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "Voor verkeersmanagement en incident management (IM) is dit de operationele bron: wegverkeersleiders, bergers en weginspecteurs werken met exact dezelfde meldingen. Voor een gemeente is het patroon interessanter dan de losse melding — terugkerende incidentlocaties zijn kandidaten voor infrastructurele maatregelen.",
      },
    ],
    links: [
      { label: "NDW Open Data (brondata)", url: "https://opendata.ndw.nu/" },
      {
        label: "NDW documentatie dataformaten (DATEX II)",
        url: "https://docs.ndw.nu/",
      },
    ],
  },

  // ─── NDW Actueel Beeld ─────────────────────────────────────
  {
    layerId: "ndw-actueel",
    title: "Actueel verkeersbeeld rond {city}",
    subtitle:
      "Files, maatregelen, omleidingen en incidenten — het complete NDW Actueel Beeld",
    intro:
      "Het *Actueel Beeld* van NDW bundelt alle actuele verkeerssituaties in één feed: files, ongevallen, weg- en rijstrookmaatregelen, omleidingen en brugopeningen. Rond {city} zijn op dit moment **{count} situaties** in beeld. De laag ververst elke minuut en is daarmee een live dwarsdoorsnede van wat er nu op de weg gebeurt — een leeg beeld betekent simpelweg een rustig moment.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Situaties in beeld", type: "count" },
          {
            label: "Files / abnormaal verkeer",
            type: "count-where",
            property: "type",
            equals: "sit:AbnormalTraffic",
          },
          {
            label: "Weg-/rijstrookmaatregelen",
            type: "count-where",
            property: "type",
            equals: "sit:RoadOrCarriagewayOrLaneManagement",
          },
          {
            label: "Omleidingen",
            type: "count-where",
            property: "type",
            equals: "sit:ReroutingManagement",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Samenstelling van het actuele beeld rond {city}",
        description:
          "Alle situatietypen in de NDW-feed binnen de kaartuitsnede, op dit moment",
        property: "type",
        valueLabels: SITUATION_TYPE_LABELS,
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Waar de incidentenlaag inzoomt op ongevallen en pech, toont deze laag het **volledige operationele plaatje**. Elke stip is een situatie met een DATEX II-type:\n\n- *Files / abnormaal verkeer* — langzaam rijdend of stilstaand verkeer.\n- *Weg- of rijstrookmaatregelen* — afzettingen en versmalde rijstroken, vaak door werkzaamheden.\n- *Snelheidsmaatregelen en omleidingen* — tijdelijke verkeersmanagement-ingrepen.\n- *Netwerkbeheer* — onder meer brugopeningen.\n\nKlik op een stip voor het type, de ernst en (waar beschikbaar) een toelichting van de wegbeheerder.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "Dit is dezelfde bron die navigatiesystemen, verkeerscentrales en reisinformatiediensten voeden. Voor {city} geeft het beeld antwoord op operationele vragen: *waar staat het nu vast, welke maatregelen zijn actief, en stapelen situaties zich ergens op?* Structureel terugkerende drukte op dezelfde plekken is input voor het gemeentelijk verkeer- en vervoerbeleid.",
      },
      {
        heading: "Kanttekeningen bij de data",
        body: "- **Momentopname**: het beeld verandert continu; aantallen van nu zeggen niets over morgen.\n- **Focus op hoofdwegennet**: de dekking is het best op snelwegen en provinciale wegen. De kaartuitsnede is daarom ruimer dan de gemeentegrens, zodat de ringen en snelwegen rond {city} meetellen.\n- **Ernst “onbekend”** komt veel voor: niet elke melder vult dit veld in.",
      },
    ],
    links: [
      { label: "NDW Open Data (brondata)", url: "https://opendata.ndw.nu/" },
      {
        label: "NDW documentatie dataformaten (DATEX II)",
        url: "https://docs.ndw.nu/",
      },
      { label: "Over het NDW", url: "https://www.ndw.nu/" },
    ],
  },

  // ─── NDW Brugopeningen ─────────────────────────────────────
  {
    layerId: "ndw-brugopeningen",
    title: "Brugopeningen rond {city}",
    subtitle: "Geplande en actuele openingen van beweegbare bruggen (NDW)",
    intro:
      "Deze laag toont de **planningsfeed brugopeningen** van NDW: momenten waarop beweegbare bruggen voor de scheepvaart worden geopend en het wegverkeer kort moet wachten. Rond {city} zijn op dit moment **{count} brugopeningen** (actueel of gepland) in beeld. Staat de teller op nul, dan zijn er in dit gebied momenteel geen openingen aangekondigd — of liggen er simpelweg geen beweegbare bruggen in de kaartuitsnede.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Brugopeningen in beeld", type: "count" },
          { label: "Unieke meldingen", type: "distinct", property: "id" },
          {
            label: "Type: brug in bediening",
            type: "count-where",
            property: "managementType",
            equals: "bridgeSwingInOperation",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een brugopening zoals de brugbeheerder die aan NDW doorgeeft, met een start- en (verwachte) eindtijd. In DATEX II heet dit *bridgeSwingInOperation*: de brug is of gaat in bediening. Klik op een punt voor de tijdvakken van de opening. Eén brug kan meerdere keren per dag in de feed staan — elke opening is een aparte melding.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "Brugopeningen zijn korte maar voorspelbare verstoringen van het wegverkeer:\n\n- **Doorstroming**: op drukke corridors veroorzaakt een opening van enkele minuten al een file-golf; afstemming met spitsuren is een klassiek verkeersmanagement-thema.\n- **Hulpdiensten**: aanrijroutes moeten rekening houden met geopende bruggen; deze feed voedt daarvoor de routeringssystemen.\n- **Scheepvaart vs. wegverkeer**: de data maakt de belangenafweging tussen vaarweg en weg zichtbaar en meetbaar.",
      },
      {
        heading: "Over de bron",
        body: "De planningsfeed wordt gevuld door brug- en vaarwegbeheerders (o.a. Rijkswaterstaat, provincies en gemeenten) en via NDW als open data gepubliceerd. Niet elke beheerder levert (even ver vooruit) aan: een lege kaart betekent dus *geen aangekondigde openingen in deze bron*, niet per se dat alle bruggen dicht blijven. De kaartuitsnede is iets ruimer dan de gemeente {city} zelf.",
      },
    ],
    links: [
      { label: "NDW Open Data (brondata)", url: "https://opendata.ndw.nu/" },
      {
        label: "NDW documentatie dataformaten",
        url: "https://docs.ndw.nu/",
      },
    ],
  },

  // ─── NDW Tijdelijke maximumsnelheden ───────────────────────
  {
    layerId: "ndw-maxsnelheden",
    title: "Tijdelijke snelheidsbeperkingen rond {city}",
    subtitle:
      "Tijdelijke maximumsnelheden door werkzaamheden of incidenten (NDW / WKD)",
    intro:
      "Deze laag toont locaties waar tijdelijk een **lagere maximumsnelheid** geldt dan normaal — meestal vanwege wegwerkzaamheden, soms vanwege een incident of wegdekschade. Rond {city} zijn op dit moment **{count} tijdelijke snelheidsmaatregelen** in beeld. Een lege kaart is goed nieuws: dan gelden hier momenteel gewoon de reguliere limieten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Maatregelen in beeld", type: "count" },
          { label: "Unieke maatregelen", type: "distinct", property: "id" },
          {
            label: "Type: snelheidsmaatregel",
            type: "count-where",
            property: "type",
            equals: "sit:SpeedManagement",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip markeert een wegvak met een tijdelijke snelheidsbeperking uit de NDW-feed *tijdelijke verkeersmaatregelen — maximumsnelheden*. In de praktijk gaat het vaak om limieten van 30, 50, 70 of 90 km/u op plekken waar normaal harder gereden mag worden. Klik op een punt voor de geldigheidsperiode en, waar beschikbaar, een toelichting van de wegbeheerder.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: bij wegwerkzaamheden beschermt een lagere limiet wegwerkers én weggebruikers.\n- **Handhaving en navigatie**: deze feed voedt navigatiesystemen en (traject)controlesystemen, zodat de getoonde limiet klopt met de situatie op de weg.\n- **Werk in uitvoering in beeld**: voor {city} is dit een snelle indicator van waar aan de weg gewerkt wordt, ook net buiten de gemeentegrens op het omliggende hoofdwegennet.",
      },
      {
        heading: "Kanttekeningen",
        body: "De feed is onderdeel van de **Wegkenmerken Database (WKD)**-keten van NDW en wordt gevuld door wegbeheerders; de volledigheid verschilt per beheerder. De data ververst circa elke vijf minuten en betreft een momentopname. De kaartuitsnede rond {city} is ruimer dan de gemeentegrens, zodat maatregelen op snelwegen en N-wegen rond de stad zichtbaar zijn.",
      },
    ],
    links: [
      { label: "NDW Open Data (brondata)", url: "https://opendata.ndw.nu/" },
      {
        label: "NDW documentatie dataformaten",
        url: "https://docs.ndw.nu/",
      },
    ],
  },

  // ─── NDW MSI Matrixborden ──────────────────────────────────
  {
    layerId: "ndw-msi",
    title: "Matrixborden boven de snelweg rond {city}",
    subtitle:
      "Actuele rijstrooksignalering (MSI): rode kruizen, snelheidslimieten en pijlen",
    intro:
      "Boven de rijstroken van snelwegen hangen **matrixsignaalgevers (MSI's)**: de borden die een rood kruis, een tijdelijke snelheidslimiet of een pijl tonen. Deze laag toont per signaalportaal (de portalen over de weg) de actuele stand rond {city} — op dit moment **{count} portalen** in beeld. Toont alles “blanco”, dan is er niets aan de hand op de weg.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Signaalportalen in beeld", type: "count" },
          {
            label: "Met afgekruiste rijstrook",
            type: "count-where",
            property: "hasLaneClosed",
            equals: "true",
          },
          {
            label: "Met snelheidsbeperking",
            type: "count-where",
            property: "hasSpeedLimit",
            equals: "true",
          },
          {
            label: "Gem. rijstroken per portaal",
            type: "avg",
            property: "laneCount",
            decimals: 1,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Actuele signaalstand van de portalen rond {city}",
        description:
          "Dominante stand per portaal: een rood kruis weegt zwaarder dan een snelheidslimiet",
        property: "dominantState",
        valueLabels: {
          blank: "Blanco (geen signaal)",
          lane_closed: "Rijstrook afgekruist",
          speed_limit: "Snelheidsbeperking",
          lane_open: "Rijstrook open (pijl)",
          restriction_end: "Einde beperking",
        },
      },
      {
        kind: "category-bar",
        title: "Portalen per weg",
        description: "Aantal signaalportalen in beeld, per rijksweg",
        property: "road",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk icoon is één **signaalportaal**: een rij matrixborden over alle rijstroken van één rijbaan, op één kilometrering. Per portaal is de stand van elke rijstrook bekend:\n\n- **Rood kruis** — rijstrook dicht, bijvoorbeeld bij een pechgeval of berging op de vluchtstrook.\n- **Snelheidslimiet** (50/70/90) — verkeer wordt afgeremd vóór een file of incident.\n- **Pijl** — verkeer moet naar een naastgelegen rijstrook.\n- **Blanco** — geen beperking.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "MSI's zijn het zichtbaarste instrument van **verkeersmanagement op het hoofdwegennet**: Rijkswaterstaat gebruikt ze om ongevalslocaties af te schermen en file-golven te dempen (verkeerssignalering/AID). Voor {city} laat deze laag direct zien of er op de omliggende snelwegen wordt ingegrepen — een cluster kruizen of limieten wijst op een actueel incident of drukte, nog vóór het in filelijsten verschijnt.",
      },
      {
        heading: "Over de bron en de plaatsbepaling",
        body: "De signaalstanden komen uit de NDW-feed *Matrixsignaalinformatie* (RWS). Die feed bevat wegnummer en kilometrering maar **geen coördinaten**; de posities op deze kaart zijn benaderd door te interpoleren langs bekende locaties van informatiepanelen (DRIP's) op dezelfde weg en rijrichting. De positie kan daardoor tientallen meters afwijken — de signaalstand zelf is wél exact en ververst elke minuut.",
      },
    ],
    links: [
      { label: "NDW Open Data (brondata)", url: "https://opendata.ndw.nu/" },
      {
        label: "NDW documentatie dataformaten",
        url: "https://docs.ndw.nu/",
      },
      {
        label: "Rijkswaterstaat — verkeerssignalering",
        url: "https://www.rijkswaterstaat.nl/wegen/wegbeheer/verkeersmanagement",
      },
    ],
  },

  // ─── NDW Actuele snelheden ─────────────────────────────────
  {
    layerId: "ndw-trafficspeed",
    title: "Actuele verkeerssnelheden rond {city}",
    subtitle:
      "Realtime gemeten snelheid en intensiteit op vaste NDW-meetlocaties",
    intro:
      "Onder en langs de belangrijkste wegen liggen meetlussen en staan camera's en radars die continu meten hoe hard er wordt gereden en hoeveel voertuigen passeren. Rond {city} leveren op dit moment **{count} meetlocaties** een actuele waarneming. De kleur van elk punt volgt de gemeten snelheid: zo zie je in één oogopslag waar het vlot rijdt en waar het stroperig wordt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetlocaties in beeld", type: "count" },
          {
            label: "Gemiddelde snelheid",
            type: "avg",
            property: "speed_kmh",
            unit: "km/u",
            decimals: 0,
          },
          {
            label: "Mediane snelheid",
            type: "median",
            property: "speed_kmh",
            unit: "km/u",
            decimals: 0,
          },
          {
            label: "Gem. intensiteit",
            type: "avg",
            property: "flow_veh_h",
            unit: "vtg/u",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de gemeten snelheden rond {city}",
        description:
          "Actuele gemiddelde snelheid per meetlocatie (km/u), op dit moment",
        property: "speed_kmh",
        unit: "km/u",
      },
      {
        kind: "histogram",
        title: "Verkeersintensiteit per meetlocatie",
        description:
          "Aantal passerende voertuigen per uur, omgerekend uit de actuele meting",
        property: "flow_veh_h",
        unit: "vtg/u",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een **meetlocatie** uit het NDW-meetnet: meestal inductielussen in het wegdek, aangevuld met camera- en radarsystemen. Per locatie worden getoond:\n\n- `speed_kmh` — de actuele gemiddelde snelheid van passerende voertuigen;\n- `flow_veh_h` — de intensiteit, omgerekend naar voertuigen per uur.\n\nLage snelheden op een snelwegtraject wijzen op filevorming; lage intensiteit *én* lage snelheid kan ook simpelweg een rustig moment op een lokale weg zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "Dit meetnet is de ruggengraat van het Nederlandse verkeersmanagement: file-informatie, spitsstroken en toeritdosering draaien op deze metingen. Voor {city} is de laag bruikbaar om **doorstroming live te volgen** — bijvoorbeeld tijdens evenementen, wegwerkzaamheden of een avondspits — en om te zien welke corridors structureel zwaar belast zijn. Verkeersmodellen en evaluaties van maatregelen gebruiken dezelfde brondata, maar dan als lange tijdreeks.",
      },
      {
        heading: "Kanttekeningen bij de meting",
        body: "- **Momentopname**: elke minuut verschijnt een nieuwe waarneming; het beeld van nu is over vijf minuten achterhaald.\n- **Dekking**: het meetnet is het dichtst op snelwegen en drukke provinciale en stedelijke hoofdwegen; woonstraten worden niet gemeten. De kaartuitsnede is ruimer dan de gemeentegrens van {city}.\n- **Gemiddelden**: de snelheid is een gemiddelde over de meetperiode en over rijstroken — individuele voertuigen kunnen (veel) sneller of langzamer rijden.",
      },
    ],
    links: [
      { label: "NDW Open Data (brondata)", url: "https://opendata.ndw.nu/" },
      { label: "Over het NDW-meetnet", url: "https://www.ndw.nu/" },
      {
        label: "NDW documentatie dataformaten",
        url: "https://docs.ndw.nu/",
      },
    ],
  },
];
