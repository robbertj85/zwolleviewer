/**
 * Story maps — openbaar vervoer & spoor.
 * Lagen: ov-haltes, ov-haltes-trein, treinstations, spooras, overwegen,
 * cbs-pc4-afstand-treinstation.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "ov-haltes",
    title: "OV-haltes in {city}",
    subtitle:
      "Alle bus-, tram-, metro-, trein- en veerhaltes uit de landelijke GTFS-feed",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} OV-haltes** geladen uit de landelijke OVapi GTFS-feed — dezelfde brondata die reisplanners als 9292 en Google Maps gebruiken. Elke stip is een halte of perron; klik erop voor halte-details zoals naam, haltecode en rolstoeltoegankelijkheid.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Haltes in beeld", type: "count" },
          { label: "Unieke haltenamen", type: "distinct", property: "stop_name" },
          {
            label: "Rolstoeltoegankelijk (aandeel)",
            type: "count-where",
            property: "wheelchair_boarding",
            equals: "1",
            asShare: true,
          },
          {
            label: "Treinhaltes",
            type: "count-where",
            property: "is_train",
            equals: "1",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rolstoeltoegankelijkheid van haltes in {city}",
        description:
          "GTFS-veld wheelchair_boarding, zoals aangeleverd door de vervoerders",
        property: "wheelchair_boarding",
        valueLabels: {
          "0": "Onbekend / niet opgegeven",
          "1": "Toegankelijk",
          "2": "Niet toegankelijk",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke halte in de feed is één punt, inclusief losse perrons van hetzelfde station (een stationsgebied telt dus vaak meerdere punten). Het veld *stop_name* groepeert perrons onder één haltenaam; het verschil tussen “haltes in beeld” en “unieke haltenamen” laat zien hoeveel perrons/haltekommen er gemiddeld per halte zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid**: haltedichtheid bepaalt hoe goed wijken zonder auto bereikbaar zijn.\n- **Toegankelijkheid**: het aandeel rolstoeltoegankelijke haltes is een directe indicator voor inclusieve mobiliteit; “onbekend” betekent meestal dat de vervoerder het nog niet heeft geregistreerd.\n- **Beleid**: bij nieuwe woonwijken geldt vaak een norm voor loopafstand tot de dichtstbijzijnde halte (typisch 400–800 m).",
      },
      {
        heading: "Over de bron",
        body: "De OVapi GTFS-feed bundelt dagelijks de dienstregelingsdata van alle Nederlandse OV-vervoerders. De haltes op deze kaart zijn gefilterd op het kaartgebied van {city}; statistieken gaan dus over dit uitsnede-gebied, niet per se over de hele gemeente.",
      },
    ],
    links: [
      { label: "OVapi GTFS-feed (brondata)", url: "https://gtfs.ovapi.nl/nl/" },
      {
        label: "GTFS-referentie: wheelchair_boarding",
        url: "https://gtfs.org/documentation/schedule/reference/#stopstxt",
      },
    ],
  },
  {
    layerId: "ov-haltes-trein",
    title: "Treinhaltes en perrons in {city}",
    subtitle:
      "De trein-subset van de landelijke GTFS-feed: stations en hun perrons",
    intro:
      "Deze laag toont **{count} treinhaltes** binnen het kaartgebied van {city}: de haltepunten uit de landelijke OVapi GTFS-feed die als treinstation of stationsperron herkend zijn. Waar de algemene OV-haltelaag alle bus-, tram- en veerhaltes bevat, zoomt deze laag in op het spoor — handig om stationslocaties en het aantal perrons per station in één oogopslag te zien.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Treinhaltes in beeld", type: "count" },
          {
            label: "Unieke stationsnamen",
            type: "distinct",
            property: "stop_name",
          },
          {
            label: "Stationslocaties (GTFS-niveau)",
            type: "count-where",
            property: "location_type",
            equals: "1",
          },
          {
            label: "Rolstoeltoegankelijk (aandeel)",
            type: "count-where",
            property: "wheelchair_boarding",
            equals: "1",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Haltepunten per station in {city}",
        description:
          "Aantal GTFS-haltepunten (perrons en stationslocaties) per stationsnaam",
        property: "stop_name",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een haltepunt uit de GTFS-feed dat als trein is herkend. Een station bestaat in GTFS meestal uit meerdere punten: één overkoepelende stationslocatie (*location_type* = 1) plus losse perrons die daaraan hangen via *parent_station*. Grote stations tellen daardoor veel punten, kleine voorstadstations vaak maar één of twee. Het verschil tussen “treinhaltes in beeld” en “unieke stationsnamen” laat zien hoeveel perrons er gemiddeld per station zijn.",
      },
      {
        heading: "Hoe wordt ‘trein’ bepaald?",
        body: "De GTFS-feed markeert vervoerswijzen niet per halte. De selectie gebeurt daarom heuristisch: haltepunten met een NS/IFF-prefix in het *stop_id*, punten die aan zo'n station gekoppeld zijn, en namen die duidelijk naar een station verwijzen. Dat werkt in de praktijk goed, maar het blijft een benadering — een enkel punt kan onterecht wel of niet meegenomen zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Knooppuntbeleid**: stations zijn de ankers van het regionale OV-netwerk; woningbouw en voorzieningen worden steeds vaker rond stations gepland.\n- **Toegankelijkheid**: het aandeel rolstoeltoegankelijke perrons is een directe indicator voor inclusieve treinreizen; “onbekend” betekent meestal dat de vervoerder het veld niet heeft ingevuld.\n- **Ketenmobiliteit**: combineer deze laag met bushaltes, fietsenstallingen of P+R om de kwaliteit van de overstapketen rond stations te beoordelen.",
      },
      {
        heading: "Over de bron",
        body: "De OVapi GTFS-feed bundelt dagelijks de dienstregelingsdata van alle Nederlandse OV-vervoerders. De punten zijn gefilterd op het kaartgebied van {city}; net buiten de uitsnede gelegen stations tellen niet mee.",
      },
    ],
    links: [
      { label: "OVapi GTFS-feed (brondata)", url: "https://gtfs.ovapi.nl/nl/" },
      {
        label: "GTFS-referentie: stops.txt",
        url: "https://gtfs.org/documentation/schedule/reference/#stopstxt",
      },
    ],
  },
  {
    layerId: "treinstations",
    title: "Treinstations rond {city}",
    subtitle:
      "Officiële stationslocaties uit de spoorwegenregistratie van ProRail",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} treinstations** volgens de spoorwegendataset van ProRail, ontsloten via PDOK. Dit is de beheerdersregistratie van het spoor zelf: elk station staat er precies één keer in, met officiële naam, stationsafkorting en het spoortraject waaraan het ligt. Klik op een station voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stations in beeld", type: "count" },
          { label: "Unieke stationsnamen", type: "distinct", property: "naam" },
          {
            label: "Spoortrajecten",
            type: "distinct",
            property: "kmlint_omschrijving",
          },
          {
            label: "Evenementenstations",
            type: "count-where",
            property: "evenement",
            equals: "Ja",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Stations per spoortraject rond {city}",
        description:
          "ProRail-veld kmlint_omschrijving: het kilometerlint (traject) waaraan het station ligt",
        property: "kmlint_omschrijving",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Anders dan de GTFS-haltelagen (waar elk perron een eigen punt is) toont deze laag één punt per station: de officiële stationslocatie zoals ProRail die als spoorbeheerder registreert. Elk station heeft een landelijk unieke afkorting (bijvoorbeeld *Zl* of *Asd*) en ligt aan een **kilometerlint** — het traject waarlangs ProRail alle spoorobjecten van een kilometrering voorziet. Een “evenementenstation” is een locatie die alleen bij evenementen wordt bediend.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke ordening**: stationsomgevingen zijn dé plekken voor verdichting; het Rijk en provincies sturen actief op woningbouw rond stations.\n- **Bereikbaarheidsanalyses**: dit is de meest zuivere stationslocatie om loop- en fietsafstanden vanaf te rekenen — één punt per station, zonder perron-duplicaten.\n- **Netwerkperspectief**: de trajectindeling laat zien aan welke corridors een gemeente ligt en dus van welke lijnvoering ze afhankelijk is.",
      },
      {
        heading: "Over de bron",
        body: "De dataset *Spoorwegen* van ProRail wordt via PDOK als open data aangeboden en periodiek geactualiseerd vanuit de beheerregistratie. De kaart toont alleen stations binnen de kaartuitsnede van {city}; stations van buurgemeenten kunnen dus meetellen, en een station nét buiten de uitsnede juist niet.",
      },
    ],
    links: [
      {
        label: "PDOK: dataset Spoorwegen (ProRail)",
        url: "https://www.pdok.nl/introductie/-/article/spoorwegen",
      },
      { label: "ProRail", url: "https://www.prorail.nl/" },
    ],
  },
  {
    layerId: "spooras",
    title: "Het spoornetwerk in {city}",
    subtitle: "Spoorassen (hartlijnen van het spoor) uit de ProRail-registratie",
    intro:
      "Deze laag tekent **{count} spoortakken** binnen het kaartgebied van {city}: de hartlijnen van elk afzonderlijk spoor uit de spoorwegendataset van ProRail. Niet één lijn per verbinding, maar elk spoor apart — inclusief wissels, inhaalsporen en emplacementen. Zo zie je precies waar het spoor door de gemeente loopt en waar het netwerk zich vertakt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Spoortakken in beeld", type: "count" },
          {
            label: "Totale lengte",
            type: "sum",
            property: "lengte",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gemiddelde taklengte",
            type: "avg",
            property: "lengte",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Spoortrajecten",
            type: "distinct",
            property: "kmlint_omschrijving_begin",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Spoortakken per traject in {city}",
        description:
          "ProRail-veld kmlint_omschrijving_begin: het kilometerlint waar de spoortak begint",
        property: "kmlint_omschrijving_begin",
        maxCategories: 6,
      },
      {
        kind: "histogram",
        title: "Lengteverdeling van spoortakken",
        description:
          "Korte takken horen meestal bij emplacementen en wisselzones; lange takken zijn vrije baan",
        property: "lengte",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een **spooras** is de hartlijn van één doorlopend stuk spoor tussen twee begrenzingen (zoals wissels). Rond stations en rangeerterreinen versplintert het netwerk daardoor in veel korte takken, terwijl de vrije baan uit lange, ononderbroken lijnen bestaat. Het aantal takken zegt dus vooral iets over de *complexiteit* van de spoorinfrastructuur, de totale lengte over de *omvang* ervan.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Barrièrewerking**: het spoor deelt veel gemeenten in tweeën; deze laag laat exact zien waar, en waar onderdoorgangen of overwegen nodig zijn.\n- **Omgevingseffecten**: geluid, trillingen en externe veiligheid (vervoer gevaarlijke stoffen) spelen langs elke spoortak; de lijnen zijn de basis voor contour- en zoneringsanalyses.\n- **Ruimtelijke plannen**: bij bouwen nabij het spoor gelden afstands- en veiligheidseisen van ProRail; de hartlijnen zijn daarvoor de referentie.",
      },
      {
        heading: "Over de bron",
        body: "De dataset *Spoorwegen* van ProRail (via PDOK) komt rechtstreeks uit de beheerregistratie van de spoorbeheerder en bevat ook geplande situaties: het veld *levenscyclus_status* onderscheidt bestaande sporen van definitieve ontwerpen. De statistieken gaan over de kaartuitsnede van {city} — takken die de rand kruisen tellen mee met hun volledige geregistreerde lengte, waardoor de totale lengte iets kan afwijken van de lengte binnen de gemeentegrens.",
      },
    ],
    links: [
      {
        label: "PDOK: dataset Spoorwegen (ProRail)",
        url: "https://www.pdok.nl/introductie/-/article/spoorwegen",
      },
      { label: "ProRail", url: "https://www.prorail.nl/" },
    ],
  },
  {
    layerId: "overwegen",
    title: "Spoorwegovergangen in {city}",
    subtitle:
      "Gelijkvloerse kruisingen van weg en spoor, met hun beveiligingstype",
    intro:
      "Binnen het kaartgebied van {city} registreert ProRail **{count} overwegen**: plekken waar wegen, paden of overpaden het spoor gelijkvloers kruisen. Elke overweg heeft een beveiligingstype (van volautomatische bomen tot geen actieve beveiliging) en een karakter (openbaar, particulier of dienstoverpad). Klik op een punt voor de details, zoals de locatieaanduiding en het aantal sporen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Overwegen in beeld", type: "count" },
          {
            label: "Met AHOB-beveiliging",
            type: "count-where",
            property: "overweg_type",
            equals: ["AHOB", "AHOB-MINI"],
          },
          {
            label: "Zonder actieve beveiliging",
            type: "count-where",
            property: "overweg_type",
            equals: "Geen",
          },
          {
            label: "Openbare overwegen",
            type: "count-where",
            property: "karakter",
            equals: "Openbare overweg",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Beveiligingstype van overwegen in {city}",
        description:
          "ProRail-veld overweg_type: de aanwezige overweginstallatie",
        property: "overweg_type",
        valueLabels: {
          AHOB: "AHOB (automatische halve overwegbomen)",
          "AHOB-MINI": "Mini-AHOB",
          Geen: "Geen actieve beveiliging",
          WILO: "WILO (waarschuwingsinstallatie)",
        },
      },
      {
        kind: "category-bar",
        title: "Karakter van de overwegen",
        description:
          "Openbaar toegankelijke kruisingen versus particuliere overwegen en dienstoverpaden",
        property: "karakter",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een gelijkvloerse kruising van weg en spoor. Het **beveiligingstype** zegt hoe de kruising is beveiligd: een *AHOB* sluit de weg met automatische halve bomen af, een *mini-AHOB* is de compacte variant voor fiets- en voetpaden, en bij *geen actieve beveiliging* moet de gebruiker zelf kijken en luisteren. Het **karakter** onderscheidt openbare overwegen van particuliere overwegen en dienstoverpaden die alleen voor spoorpersoneel bedoeld zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: overwegen zijn de risicovolste punten van het spoorsysteem; landelijk beleid stuurt op het opheffen of beter beveiligen van (met name onbeveiligde) overwegen.\n- **Doorstroming en barrièrewerking**: dichte bomen betekenen wachtende auto's, fietsers en hulpdiensten — relevant bij het plannen van routes en nieuwe wijken aan de 'andere kant' van het spoor.\n- **Programma's en subsidies**: het landelijke Programma Overwegen financiert aanpak van specifieke overwegen; deze registratie is daarvoor het vertrekpunt.",
      },
      {
        heading: "Over de bron",
        body: "De overwegen komen uit de dataset *Spoorwegen* van ProRail via PDOK. De kaartuitsnede van {city} kan ook overwegen van buurgemeenten bevatten — het veld *gemeente* per overweg geeft uitsluitsel. Ook niet-openbare overpaden en overwegen in geplande situaties (*levenscyclus_status*) tellen mee in de aantallen.",
      },
    ],
    links: [
      {
        label: "PDOK: dataset Spoorwegen (ProRail)",
        url: "https://www.pdok.nl/introductie/-/article/spoorwegen",
      },
      {
        label: "ProRail over overwegen",
        url: "https://www.prorail.nl/programmas/overwegen",
      },
    ],
  },
  {
    layerId: "cbs-pc4-afstand-treinstation",
    title: "Afstand tot het treinstation in {city}",
    subtitle:
      "CBS-nabijheidscijfers per postcodegebied (PC4): hoe ver is het dichtstbijzijnde station?",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op de afstand tot het dichtstbijzijnde treinstation, berekend door het CBS. Donkerder betekent verder van het spoor. Zo zie je in één beeld welke delen van de gemeente op loop- of fietsafstand van een station liggen en welke wijken voor de trein afhankelijk zijn van voor- en natransport.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddelde afstand tot station",
            type: "avg",
            property: "dichtstbijzijndeTreinstationAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Grootste afstand (PC4)",
            type: "max",
            property: "dichtstbijzijndeTreinstationAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Inwoners in deze gebieden",
            type: "sum",
            property: "aantalInwoners",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van stationsafstanden per PC4 in {city}",
        description:
          "Aantal postcodegebieden per afstandsklasse tot het dichtstbijzijnde treinstation",
        property: "dichtstbijzijndeTreinstationAfstandInKm",
        unit: "km",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elk viercijferig postcodegebied berekent het CBS de gemiddelde afstand van de inwoners tot het dichtstbijzijnde treinstation. Het is dus één cijfer per gebied: binnen een groot buitengebied-PC4 kunnen de werkelijke afstanden flink uiteenlopen. De afstand volgt de CBS-nabijheidsmethodiek en is niet hemelsbreed maar via het wegennet bepaald.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **OV-bereikbaarheid**: gebieden op meer dan enkele kilometers van een station zijn voor treingebruik afhankelijk van bus, fiets of auto — precies daar loont investeren in voortransport en stallingen.\n- **Woningbouwlocaties**: nabijheid van een station is een belangrijk criterium bij het kiezen van verdichtingslocaties en het beperken van autoafhankelijkheid.\n- **Vergelijkbaarheid**: doordat het CBS dezelfde methodiek landelijk toepast, kun je {city} eerlijk vergelijken met andere gemeenten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistieken *Gegevens per postcode* (PC4), ontsloten via PDOK. Let op:\n- CBS publiceert velden gefaseerd; in de nieuwste jaargang kunnen afstandsvelden nog ontbreken. Ontbrekende waarden worden hier automatisch weggelaten uit de statistieken en grafiek.\n- De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten.\n- Een PC4-gebied zonder (geregistreerde) inwoners krijgt geen cijfer.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
];
