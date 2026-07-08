/**
 * Story maps — batch "national-gezondheid-groen".
 * Lagen: cbs-nabijheid-huisarts, cbs-nabijheid-ziekenhuis, cbs-nabijheid-apotheek,
 * cbs-nabijheid-onderwijs, cbs-nabijheid-voorzieningen, cbs-wijken-gezondheid,
 * osm-aed, osm-scholen, osm-zorg, rivm-geluid-combinatie-lden,
 * rivm-windturbines-geluid, bgt-begroeidterreindeel, bgt-onbegroeidterreindeel,
 * natura2000, pdok-zwemwater.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "cbs-nabijheid-huisarts",
    title: "Nabijheid van de huisarts in {city}",
    subtitle:
      "Gemiddelde afstand tot huisartsenpraktijk en -post per buurt (CBS)",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} op de gemiddelde afstand van hun inwoners tot de dichtstbijzijnde huisartsenpraktijk, berekend door het CBS. Donkerder betekent verder van de huisarts. Zo zie je in één oogopslag in welke buurten eerstelijnszorg om de hoek zit en welke buurten voor de huisarts een eind moeten reizen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. afstand tot huisartsenpraktijk",
            type: "avg",
            property: "huisartsenpraktijkGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Grootste afstand (buurt)",
            type: "max",
            property: "huisartsenpraktijkGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Gem. afstand tot huisartsenpost",
            type: "avg",
            property: "huisartsenpostGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de afstand tot de huisartsenpraktijk in {city}",
        description:
          "Aantal buurten per afstandsklasse tot de dichtstbijzijnde huisartsenpraktijk",
        property: "huisartsenpraktijkGemiddeldeAfstandInKm",
        unit: "km",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elke buurt berekent het CBS de gemiddelde afstand van de inwoners tot de dichtstbijzijnde huisartsenpraktijk — over de weg, niet hemelsbreed. Het is één cijfer per buurt: binnen een grote, dunbevolkte buurt kunnen de werkelijke afstanden flink uiteenlopen. Naast de reguliere praktijk toont deze laag ook de afstand tot de huisartsenpost (spoedzorg buiten kantooruren), die doorgaans veel groter is omdat er per regio maar één of enkele posten zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toegankelijke eerstelijnszorg**: nabijheid van de huisarts is een kernindicator voor een gezonde leefomgeving; grote afstanden treffen vooral ouderen en mensen zonder auto.\n- **Voorzieningenplanning**: bij nieuwe woonwijken en vergrijzende buurten is het de vraag of het bestaande zorgaanbod meegroeit.\n- **Vergelijkbaarheid**: het CBS hanteert dezelfde methodiek in heel Nederland, dus je kunt {city} eerlijk naast andere gemeenten leggen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistiek *Nabijheid voorzieningen* in de dataset Wijken en Buurten 2024, ontsloten via PDOK. Let op:\n- De kaartuitsnede van {city} kan ook buurten van buurgemeenten bevatten.\n- Buurten zonder (geregistreerde) inwoners of met te weinig waarnemingen krijgen geen betrouwbaar cijfer en worden automatisch uit de statistieken weggelaten.\n- Een afstandscijfer zegt niets over wachttijden of of een praktijk nog patiënten aanneemt.",
      },
    ],
    links: [
      {
        label: "CBS: Wijken en Buurten (nabijheid voorzieningen)",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/wijk-en-buurtstatistieken",
      },
      {
        label: "PDOK: dataset Wijken en Buurten",
        url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
      },
    ],
  },
  {
    layerId: "cbs-nabijheid-ziekenhuis",
    title: "Nabijheid van het ziekenhuis in {city}",
    subtitle:
      "Gemiddelde afstand tot ziekenhuis (incl. buitenpolikliniek) per buurt (CBS)",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} op de gemiddelde afstand tot het dichtstbijzijnde ziekenhuis, inclusief buitenpoliklinieken, zoals berekend door het CBS. Ziekenhuizen liggen veel schaarser dan huisartsen, dus de afstanden — en de verschillen tussen buurten — zijn hier groter. Donkerder betekent verder van het ziekenhuis.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. afstand (incl. buitenpoli)",
            type: "avg",
            property: "ziekenhuisInclBuitenpolikliniekGemAfstInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Gem. afstand (excl. buitenpoli)",
            type: "avg",
            property: "ziekenhuisExclBuitenpolikliniekGemAfstInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Grootste afstand (buurt)",
            type: "max",
            property: "ziekenhuisInclBuitenpolikliniekGemAfstInKm",
            unit: "km",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de afstand tot het ziekenhuis in {city}",
        description:
          "Aantal buurten per afstandsklasse tot het dichtstbijzijnde ziekenhuis, inclusief buitenpolikliniek",
        property: "ziekenhuisInclBuitenpolikliniekGemAfstInKm",
        unit: "km",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het CBS berekent per buurt de gemiddelde afstand van de inwoners tot het dichtstbijzijnde ziekenhuis, over de weg. Er zijn twee varianten: **inclusief buitenpolikliniek** (ook kleinere poli-locaties tellen mee) en **exclusief buitenpolikliniek** (alleen volwaardige ziekenhuizen). Het verschil tussen die twee laat zien hoeveel dichterbij een buurt een poli heeft dan een volledig ziekenhuis.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Acute zorg en spreiding**: de reistijd naar een ziekenhuis is een terugkerend thema in het debat over concentratie van (spoed)zorg.\n- **Kwetsbare groepen**: grote afstanden wegen zwaarder voor chronisch zieken, ouderen en mensen die afhankelijk zijn van openbaar vervoer.\n- **Regionale samenhang**: ziekenhuizen bedienen een groter gebied dan één gemeente; deze laag laat zien waar {city} in dat regionale patroon ligt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de CBS-statistiek *Nabijheid voorzieningen* (Wijken en Buurten 2024) via PDOK. De afstanden zijn over-de-weg-afstanden, geen reistijden — files, veerdiensten of ontbrekend OV zijn er niet in verwerkt. Buurten zonder betrouwbaar cijfer worden automatisch weggelaten, en de kaartuitsnede kan buurten van buurgemeenten meenemen.",
      },
    ],
    links: [
      {
        label: "CBS: Wijken en Buurten (nabijheid voorzieningen)",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/wijk-en-buurtstatistieken",
      },
      {
        label: "PDOK: dataset Wijken en Buurten",
        url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
      },
    ],
  },
  {
    layerId: "cbs-nabijheid-apotheek",
    title: "Nabijheid van de apotheek in {city}",
    subtitle: "Gemiddelde afstand tot de dichtstbijzijnde apotheek per buurt (CBS)",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} op de gemiddelde afstand tot de dichtstbijzijnde apotheek, berekend door het CBS. De apotheek is een dagelijkse zorgvoorziening: samen met de huisarts bepaalt de nabijheid ervan hoe makkelijk bewoners hun medicijnen kunnen ophalen. Donkerder betekent verder van de apotheek.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. afstand tot apotheek",
            type: "avg",
            property: "apotheekGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Kortste afstand (buurt)",
            type: "min",
            property: "apotheekGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Grootste afstand (buurt)",
            type: "max",
            property: "apotheekGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de afstand tot de apotheek in {city}",
        description:
          "Aantal buurten per afstandsklasse tot de dichtstbijzijnde apotheek",
        property: "apotheekGemiddeldeAfstandInKm",
        unit: "km",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elke buurt toont deze laag de gemiddelde afstand van de inwoners tot de dichtstbijzijnde apotheek, over de weg gemeten. In stedelijke buurten is dat vaak enkele honderden meters; in het buitengebied loopt het op tot meerdere kilometers. Het is één gemiddelde per buurt, dus binnen een grote buurt kan de spreiding groot zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toegang tot medicatie**: nabijheid van de apotheek is vooral belangrijk voor mensen die regelmatig medicijnen ophalen, zoals ouderen en chronisch zieken.\n- **Voorzieningenniveau**: apotheken clusteren vaak met huisartsen in gezondheidscentra; deze laag helpt zulke zorgconcentraties te herkennen.\n- **Leefbaarheid van kernen**: het verdwijnen van een apotheek uit een dorp of wijk raakt de dagelijkse zelfredzaamheid direct.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistiek *Nabijheid voorzieningen* (Wijken en Buurten 2024) via PDOK. Het gaat om afstanden over de weg, niet om reistijden of openingstijden. Buurten zonder betrouwbaar cijfer worden automatisch weggelaten en de kaartuitsnede kan ook buurten van buurgemeenten bevatten.",
      },
    ],
    links: [
      {
        label: "CBS: Wijken en Buurten (nabijheid voorzieningen)",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/wijk-en-buurtstatistieken",
      },
      {
        label: "PDOK: dataset Wijken en Buurten",
        url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
      },
    ],
  },
  {
    layerId: "cbs-nabijheid-onderwijs",
    title: "Nabijheid van onderwijs in {city}",
    subtitle:
      "Gemiddelde afstand tot basis- en voortgezet onderwijs per buurt (CBS)",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} op de gemiddelde afstand tot de dichtstbijzijnde school, berekend door het CBS. Basisscholen liggen dicht bij huis en fijnmazig verspreid; middelbare scholen zijn schaarser en dus verder weg. Donkerder betekent verder van de school.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. afstand tot basisschool",
            type: "avg",
            property: "basisonderwijsGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Gem. afstand tot voortgezet onderwijs",
            type: "avg",
            property: "voortgezetOnderwijsGemAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Grootste afstand tot basisschool",
            type: "max",
            property: "basisonderwijsGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de afstand tot de basisschool in {city}",
        description:
          "Aantal buurten per afstandsklasse tot de dichtstbijzijnde basisschool",
        property: "basisonderwijsGemiddeldeAfstandInKm",
        unit: "km",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het CBS berekent per buurt de gemiddelde afstand van de inwoners tot de dichtstbijzijnde basisschool en tot het dichtstbijzijnde voortgezet onderwijs, over de weg. Omdat basisscholen fijnmazig verspreid liggen, zijn die afstanden meestal klein; middelbare scholen bedienen een groter gebied en liggen daardoor verder weg. Het verschil tussen beide cijfers laat zien hoe veel verder kinderen voor de middelbare school moeten reizen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Zelfstandig naar school**: de loop- en fietsafstand tot de basisschool bepaalt of jonge kinderen veilig en zelfstandig naar school kunnen.\n- **Voorzieningen bij nieuwbouw**: bij nieuwe woonwijken is tijdige realisatie van onderwijs een bekend knelpunt; deze laag maakt zichtbaar waar het aanbod dun is.\n- **Krimp en clustering**: in vergrijzende of krimpende gebieden sluiten kleine scholen, waardoor de afstanden toenemen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de CBS-statistiek *Nabijheid voorzieningen* (Wijken en Buurten 2024) via PDOK. Het gaat om afstanden over de weg, niet om schoolkeuze, capaciteit of wachtlijsten. Buurten zonder betrouwbaar cijfer worden weggelaten en de kaartuitsnede kan buurten van buurgemeenten bevatten.",
      },
    ],
    links: [
      {
        label: "CBS: Wijken en Buurten (nabijheid voorzieningen)",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/wijk-en-buurtstatistieken",
      },
      {
        label: "PDOK: dataset Wijken en Buurten",
        url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
      },
    ],
  },
  {
    layerId: "cbs-nabijheid-voorzieningen",
    title: "Nabijheid van dagelijkse voorzieningen in {city}",
    subtitle:
      "Gemiddelde afstand tot supermarkt, horeca, bibliotheek en meer per buurt (CBS)",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} op de nabijheid van dagelijkse voorzieningen: supermarkten, horeca, bibliotheek, kinderopvang en meer, berekend door het CBS. Het beeld is standaard ingekleurd op de afstand tot de grote supermarkt — de meest dagelijkse voorziening. Donkerder betekent verder weg.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. afstand tot grote supermarkt",
            type: "avg",
            property: "groteSupermarktGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Gem. afstand tot restaurant",
            type: "avg",
            property: "restaurantGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Gem. afstand tot bibliotheek",
            type: "avg",
            property: "bibliotheekGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de afstand tot de grote supermarkt in {city}",
        description:
          "Aantal buurten per afstandsklasse tot de dichtstbijzijnde grote supermarkt",
        property: "groteSupermarktGemiddeldeAfstandInKm",
        unit: "km",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het CBS berekent per buurt de gemiddelde afstand van de inwoners tot een reeks voorzieningen. Deze storymap licht er drie uit: de **grote supermarkt** (de belangrijkste dagelijkse boodschap), het **restaurant** (een maat voor levendigheid en horeca-aanbod) en de **bibliotheek** (een culturele en maatschappelijke basisvoorziening). Samen schetsen ze hoe compleet het voorzieningenniveau van een buurt is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Boodschappen zonder auto**: de afstand tot de supermarkt bepaalt of ouderen en mensen zonder auto zelfstandig hun boodschappen kunnen doen.\n- **Leefbaarheid en levendigheid**: horeca en een bibliotheek in de buurt dragen bij aan ontmoeting en sociale samenhang.\n- **Complete wijken**: gemeenten streven vaak naar wijken waar de dagelijkse voorzieningen op loop- of fietsafstand liggen; deze laag laat zien waar dat (nog) niet zo is.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistiek *Nabijheid voorzieningen* (Wijken en Buurten 2024) via PDOK. Het zijn afstanden over de weg, geen reistijden of een oordeel over kwaliteit en assortiment. Buurten zonder betrouwbaar cijfer worden weggelaten; de kaartuitsnede kan buurten van buurgemeenten bevatten.",
      },
    ],
    links: [
      {
        label: "CBS: Wijken en Buurten (nabijheid voorzieningen)",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/wijk-en-buurtstatistieken",
      },
      {
        label: "PDOK: dataset Wijken en Buurten",
        url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
      },
    ],
  },
  {
    layerId: "cbs-wijken-gezondheid",
    title: "Gezondheid & nabijheid per wijk in {city}",
    subtitle:
      "Nabijheid van zorg, onderwijs en voorzieningen samengevat op wijkniveau (CBS)",
    intro:
      "Deze laag toont **{count} wijken** in en rond {city} met de CBS-nabijheidscijfers samengevat op wijkniveau. Waar de buurtlagen inzoomen op één voorziening, geeft deze wijklaag het totaalbeeld: hoe dicht zitten zorg, onderwijs en dagelijkse voorzieningen bij elkaar? Wijken zijn grover dan buurten, dus dit is de blik op hoofdlijnen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wijken in beeld", type: "count" },
          {
            label: "Gem. afstand tot huisartsenpraktijk",
            type: "avg",
            property: "huisartsenpraktijkGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Gem. afstand tot basisschool",
            type: "avg",
            property: "basisonderwijsGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Gem. afstand tot grote supermarkt",
            type: "avg",
            property: "groteSupermarktGemiddeldeAfstandInKm",
            unit: "km",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de afstand tot de huisartsenpraktijk per wijk in {city}",
        description:
          "Aantal wijken per afstandsklasse tot de dichtstbijzijnde huisartsenpraktijk",
        property: "huisartsenpraktijkGemiddeldeAfstandInKm",
        unit: "km",
        bins: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke polygoon is een CBS-wijk met daaraan gekoppeld de gemiddelde afstanden tot een reeks voorzieningen. Een wijk bundelt meerdere buurten, dus de cijfers zijn gladder en minder gedetailleerd dan op buurtniveau: uitschieters in losse buurten middelen weg. Deze laag is vooral handig om wijken onderling te vergelijken en de grote lijnen te zien.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Integraal beeld**: door zorg, onderwijs én voorzieningen naast elkaar te zetten, zie je welke wijken op meerdere fronten goed of juist minder goed bedeeld zijn.\n- **Beleid op wijkniveau**: veel gemeentelijk beleid (wijkaanpak, leefbaarheid, vergrijzing) wordt op wijkniveau gevoerd; deze indeling sluit daarbij aan.\n- **Signaalfunctie**: wijken die op alle indicatoren ongunstig scoren, verdienen een nadere blik met de gedetailleerde buurtlagen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-dataset Wijken en Buurten 2024 (nabijheid voorzieningen) via PDOK. Het zijn afstanden over de weg, geaggregeerd tot wijkgemiddelden. Wijken zonder betrouwbaar cijfer worden weggelaten; de kaartuitsnede kan wijken van buurgemeenten bevatten. Voor detail per voorziening zijn de afzonderlijke buurtlagen (huisarts, ziekenhuis, apotheek, onderwijs, voorzieningen) beschikbaar.",
      },
    ],
    links: [
      {
        label: "CBS: Wijken en Buurten (nabijheid voorzieningen)",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/wijk-en-buurtstatistieken",
      },
      {
        label: "PDOK: dataset Wijken en Buurten",
        url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
      },
    ],
  },
  {
    layerId: "osm-aed",
    title: "AED's in {city}",
    subtitle:
      "Openbaar geregistreerde automatische externe defibrillatoren (OpenStreetMap)",
    intro:
      "Binnen het kaartgebied van {city} staan **{count} AED's** die in OpenStreetMap zijn geregistreerd: automatische externe defibrillatoren die bij een hartstilstand levens kunnen redden. Elke stip is een geregistreerde AED; klik erop voor details zoals de locatieomschrijving, of het apparaat binnen of buiten hangt en of het vrij toegankelijk is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "AED's in beeld", type: "count" },
          {
            label: "Buiten (24/7 bereikbaar)",
            type: "count-where",
            property: "indoor",
            equals: "no",
          },
          {
            label: "Met locatieomschrijving",
            type: "distinct",
            property: "defibrillator:location",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Binnen of buiten geplaatst in {city}",
        description:
          "OSM-veld indoor: hangt de AED binnen (vaak gebonden aan openingstijden) of buiten aan de gevel",
        property: "indoor",
        valueLabels: {
          no: "Buiten (aan de gevel)",
          yes: "Binnen (in een pand)",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een AED zoals vrijwilligers die in OpenStreetMap hebben vastgelegd. Belangrijk voor de inzetbaarheid is of het apparaat **binnen** of **buiten** hangt: een AED buiten aan de gevel is doorgaans dag en nacht bereikbaar, terwijl een AED binnen een bedrijf of sporthal alleen tijdens openingstijden bruikbaar is. Het veld *defibrillator:location* beschrijft waar het apparaat precies hangt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Overlevingskans**: bij een hartstilstand telt elke minuut; een AED binnen zes minuten bereikbaar vergroot de overlevingskans aanzienlijk.\n- **Dekking in beeld**: door de spreiding te bekijken zie je witte vlekken waar een 24/7-bereikbare AED ontbreekt.\n- **Burgerhulpverlening**: AED's werken samen met reanimatie-oproepsystemen; een goede, actuele registratie is daarvoor cruciaal.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De AED's komen uit OpenStreetMap, dat door vrijwilligers wordt bijgehouden. Dat betekent dat de dekking niet volledig is: niet elke geregistreerde AED staat erin, en niet elk apparaat in OSM is nog aanwezig of gebruiksklaar. Voor een reanimatie geldt altijd het officiële oproepsysteem (zoals HartslagNu) als leidend. De aantallen betreffen het kaartgebied van {city}.",
      },
    ],
    links: [
      { label: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
      {
        label: "HartslagNu — landelijk AED-netwerk",
        url: "https://www.hartslagnu.nl/",
      },
    ],
  },
  {
    layerId: "osm-scholen",
    title: "Scholen in {city}",
    subtitle: "Onderwijslocaties uit OpenStreetMap",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} scholen** die in OpenStreetMap als onderwijslocatie zijn getagd — van basisscholen tot voortgezet onderwijs en beroepsonderwijs. Elke stip is een schoollocatie; klik erop voor de naam en beschikbare details. Waar de CBS-onderwijslaag afstanden per buurt toont, geeft deze laag de scholen zelf als punten op de kaart.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Scholen in beeld", type: "count" },
          { label: "Unieke schoolnamen", type: "distinct", property: "name" },
        ],
      },
      {
        kind: "category-bar",
        title: "Scholen per naam in {city}",
        description:
          "OSM-veld name: schoollocaties gegroepeerd op naam (grote scholen met meerdere vestigingen tellen vaker mee)",
        property: "name",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een locatie die in OpenStreetMap met *amenity=school* is getagd. Dat omvat basisscholen, middelbare scholen en vaak ook praktijk- en speciaal onderwijs. OSM maakt niet altijd een scherp onderscheid tussen onderwijstypen, dus deze laag is vooral een overzicht van *waar* scholen liggen, niet een sluitende telling per onderwijssoort.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke spreiding**: de puntenkaart laat direct zien in welke wijken scholen geconcentreerd zijn en waar ze ontbreken.\n- **Veilige schoolomgeving**: scholocaties zijn ankerpunten voor verkeersveiligheid, breng- en haalverkeer en schoolzones.\n- **Combineren loont**: leg deze laag over de CBS-onderwijsafstanden om te zien of gebieden met grote afstanden ook echt weinig scholen in de buurt hebben.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De scholen komen uit OpenStreetMap en worden door vrijwilligers bijgehouden. De registratie is niet gegarandeerd volledig of actueel: een school kan ontbreken, dubbel staan of onder een verouderde naam bekend zijn. Voor officiële onderwijsgegevens is DUO (Dienst Uitvoering Onderwijs) de gezaghebbende bron. De aantallen betreffen het kaartgebied van {city}.",
      },
    ],
    links: [
      { label: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
      {
        label: "OSM-wiki: amenity=school",
        url: "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dschool",
      },
    ],
  },
  {
    layerId: "osm-zorg",
    title: "Zorgvoorzieningen in {city}",
    subtitle:
      "Ziekenhuizen, klinieken, huisartsen, apotheken en tandartsen uit OpenStreetMap",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} zorgvoorzieningen** die in OpenStreetMap zijn getagd: ziekenhuizen, klinieken, huisartsen (*doctors*), apotheken en tandartsen. Elke stip is één voorziening; klik erop voor de naam en het type. Deze laag toont de zorgpunten zelf — een aanvulling op de CBS-lagen die per buurt de afstand tot zorg berekenen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zorgvoorzieningen in beeld", type: "count" },
          {
            label: "Huisartsen (doctors)",
            type: "count-where",
            property: "amenity",
            equals: "doctors",
          },
          {
            label: "Apotheken",
            type: "count-where",
            property: "amenity",
            equals: "pharmacy",
          },
          {
            label: "Tandartsen",
            type: "count-where",
            property: "amenity",
            equals: "dentist",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zorgvoorzieningen per type in {city}",
        description: "OSM-veld amenity: het type zorgvoorziening",
        property: "amenity",
        valueLabels: {
          hospital: "Ziekenhuis",
          clinic: "Kliniek / gezondheidscentrum",
          doctors: "Huisarts",
          pharmacy: "Apotheek",
          dentist: "Tandarts",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een zorgvoorziening uit OpenStreetMap, ingedeeld op het *amenity*-type: een **ziekenhuis** (volledige klinische zorg), een **kliniek** of gezondheidscentrum, een **huisarts**, een **apotheek** of een **tandarts**. De staafgrafiek laat de samenstelling zien; in de meeste gemeenten vormen tandartsen en huisartsen het grootste deel, met een handvol ziekenhuizen en klinieken.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fijnmazig zorgaanbod**: deze puntenkaart toont concreet wáár de eerstelijnszorg zit, als aanvulling op de gemiddelde afstanden van het CBS.\n- **Clustering**: huisartsen, apotheken en tandartsen zitten vaak samen in gezondheidscentra; die concentraties worden hier zichtbaar.\n- **Planning en spreiding**: bij vergrijzing of nieuwbouw is het de vraag of het zorgaanbod meegroeit met de bevolking.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit OpenStreetMap en wordt door vrijwilligers onderhouden. De dekking is niet gegarandeerd compleet en de typering (*doctors*, *clinic*, *hospital*) kan per invoerder verschillen. OSM registreert bovendien locaties, geen capaciteit of of een praktijk nog patiënten aanneemt. De aantallen betreffen het kaartgebied van {city}.",
      },
    ],
    links: [
      { label: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
      {
        label: "OSM-wiki: gezondheidszorg (healthcare)",
        url: "https://wiki.openstreetmap.org/wiki/Healthcare",
      },
    ],
  },
  {
    layerId: "rivm-geluid-combinatie-lden",
    title: "Cumulatief omgevingsgeluid (Lden) in {city}",
    subtitle:
      "Geluidbelasting van alle bronnen samen — RIVM 2020 (rasterlaag)",
    intro:
      "Deze laag toont de **cumulatieve geluidbelasting Lden** in en rond {city}: het geluid van weg-, rail-, lucht- en industrieel verkeer samengeteld, berekend door het RIVM voor 2020. Het is een landsdekkende rasterkaart (geen losse objecten), waarmee je in één oogopslag ziet welke delen van de gemeente het zwaarst worden belast door omgevingsgeluid.",
    charts: [],
    sections: [
      {
        heading: "Wat is Lden?",
        body: "**Lden** (Level day-evening-night) is de Europese standaardmaat voor de gemiddelde geluidbelasting over een etmaal, met een strafcorrectie voor de avond (+5 dB) en de nacht (+10 dB), omdat geluid dan als hinderlijker wordt ervaren. De *combinatiekaart* telt alle bronnen bij elkaar op: wegverkeer, spoor, luchtvaart en industrie. Zo krijg je het totale geluidsklimaat op een plek, in plaats van per bron afzonderlijk.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: langdurige blootstelling aan omgevingsgeluid hangt samen met slaapverstoring, stress en hart- en vaatziekten.\n- **Ruimtelijke ordening**: bij woningbouw langs drukke wegen of het spoor gelden geluidnormen; de cumulatieve kaart helpt knelpunten vroeg te herkennen.\n- **Gezonde leefomgeving**: geluid is samen met luchtkwaliteit een kernindicator in het gezondheidsbeleid en de Omgevingswet.",
      },
      {
        heading: "Over de bron en weergave",
        body: "De kaart komt uit de **Atlas Leefomgeving** van het RIVM en is een raster­product (referentiejaar 2020). In deze viewer is de laag daarom nog niet als klikbare kaartobjecten beschikbaar — er worden geen losse features geladen en er zijn dus geen buurtstatistieken te tonen. De rechtstreekse WMS-overlay wordt later toegevoegd; raadpleeg tot die tijd de Atlas Leefomgeving voor de volledige kaart.",
      },
    ],
    links: [
      {
        label: "Atlas Leefomgeving — geluid",
        url: "https://www.atlasleefomgeving.nl/geluid",
      },
      {
        label: "RIVM over omgevingsgeluid",
        url: "https://www.rivm.nl/geluid",
      },
    ],
  },
  {
    layerId: "rivm-windturbines-geluid",
    title: "Windturbinegeluid (Lden) in {city}",
    subtitle:
      "Geluidbelasting door windturbines, geaggregeerd per buurt — RIVM 2024",
    intro:
      "Deze laag toont voor **{count} buurten** in en rond {city} de gemiddelde geluidbelasting **Lden door windturbines**, berekend door het RIVM voor 2024. Anders dan de cumulatieve geluidkaart is dit een echte buurtlaag: elke polygoon draagt een cijfer voor het windturbinegeluid. In buurten zonder windturbines in de omgeving is dat cijfer (vrijwel) nul.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. windturbinegeluid (Lden)",
            type: "avg",
            property: "b_gel_wtn",
            unit: "dB",
            decimals: 1,
          },
          {
            label: "Hoogste waarde (buurt)",
            type: "max",
            property: "b_gel_wtn",
            unit: "dB",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het windturbinegeluid per buurt in {city}",
        description:
          "Aantal buurten per klasse van gemiddelde Lden-belasting door windturbines (0 dB = geen turbines in de omgeving)",
        property: "b_gel_wtn",
        unit: "dB",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elke buurt heeft het RIVM de gemiddelde geluidbelasting **Lden** afkomstig van bestaande windturbines berekend en samengevat (veld *b_gel_wtn*). Lden is de etmaalgemiddelde maat met extra weging voor avond en nacht. In de meeste stedelijke buurten staan geen windturbines in de directe omgeving, waardoor de waarde daar rond nul ligt; buurten nabij windparken springen eruit met hogere waarden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hinderbeleving**: windturbinegeluid heeft een kenmerkend, laagfrequent karakter dat door omwonenden vaak als hinderlijk wordt ervaren, ook bij relatief lage niveaus.\n- **Normering**: rond windturbines gelden landelijke geluidnormen; deze kaart helpt zien waar bewoners geluid van turbines ondervinden.\n- **Energietransitie met draagvlak**: bij het plannen van nieuwe windprojecten is inzicht in de bestaande geluidsituatie van belang voor een zorgvuldige afweging.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de **Atlas Leefomgeving** van het RIVM (referentiejaar 2024), geaggregeerd per buurt. Het gaat om *bestaande* turbines; geplande of net verwijderde turbines kunnen afwijken. Buurtgemiddelden verhullen lokale pieken vlak bij een turbine. De kaartuitsnede van {city} kan ook buurten van buurgemeenten bevatten, en buurten zonder betrouwbaar cijfer worden weggelaten.",
      },
    ],
    links: [
      {
        label: "Atlas Leefomgeving — geluid",
        url: "https://www.atlasleefomgeving.nl/geluid",
      },
      {
        label: "RIVM over windturbines en geluid",
        url: "https://www.rivm.nl/windenergie/geluid",
      },
    ],
  },
  {
    layerId: "bgt-begroeidterreindeel",
    title: "Groen en begroeid terrein in {city}",
    subtitle:
      "Gras, bos, struiken en overig begroeid terrein uit de BGT",
    intro:
      "Deze laag toont **{count} begroeide terreindelen** binnen het kaartgebied van {city}: alle gras, bosschages, struiken en overig groen zoals vastgelegd in de Basisregistratie Grootschalige Topografie (BGT). Elk vlak heeft een fysiek voorkomen (het type begroeiing). Samen vormen ze de fijnmazige groenkaart van de openbare ruimte — tot op de individuele grasberm nauwkeurig.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Begroeide vlakken in beeld", type: "count" },
          {
            label: "Soorten begroeiing",
            type: "distinct",
            property: "fysiek_voorkomen",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Begroeide terreindelen per type in {city}",
        description:
          "BGT-veld fysiek_voorkomen: het waargenomen type begroeiing (gras, bomen, struiken, heide, …)",
        property: "fysiek_voorkomen",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De BGT legt de fysieke inrichting van Nederland vlakdekkend vast; deze laag toont daarvan de **begroeide terreindelen**. Het veld *fysiek_voorkomen* beschrijft het type: *grasland*, *loofbos*, *naaldbos*, *struiken*, *heide*, *bouwland* en meer. Omdat de BGT tot op de meter nauwkeurig is, versplintert het groen in veel kleine vlakken — een enkele wegberm of plantsoen is al een apart terreindeel.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Groen in de stad**: de hoeveelheid en spreiding van openbaar groen hangt samen met hittestress, waterberging, biodiversiteit en leefbaarheid.\n- **Beheer**: gras, struiken en bos vragen elk ander onderhoud; deze indeling is de basis voor groenbeheerplannen.\n- **Klimaatadaptatie**: bij vergroening en ontharding is een precieze nulmeting van het bestaande groen onmisbaar.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de **Basisregistratie Grootschalige Topografie (BGT)** via PDOK, bijgehouden door gemeenten, provincies, waterschappen en Rijk. De laag toont het fysieke voorkomen, niet het gebruik of eigendom: een begroeid vlak kan openbaar groen zijn maar ook een particuliere tuin of berm. Vanwege de detaillering worden grote gebieden in delen geladen; de statistieken gaan over de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "PDOK: Basisregistratie Grootschalige Topografie (BGT)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
      {
        label: "Over de BGT",
        url: "https://www.geobasisregistraties.nl/basisregistraties/grootschalige-topografie",
      },
    ],
  },
  {
    layerId: "bgt-onbegroeidterreindeel",
    title: "Onbegroeid terrein in {city}",
    subtitle:
      "Verharde en onverharde terreindelen (zand, klinkers, asfalt) uit de BGT",
    intro:
      "Deze laag toont **{count} onbegroeide terreindelen** binnen het kaartgebied van {city}: alle niet-begroeide oppervlakken uit de Basisregistratie Grootschalige Topografie (BGT), van verharde pleinen en parkeerterreinen tot open zand en onverharde paden. Elk vlak heeft een fysiek voorkomen dat aangeeft of het verhard of onverhard is en van welk materiaal.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Onbegroeide vlakken in beeld", type: "count" },
          {
            label: "Soorten oppervlak",
            type: "distinct",
            property: "fysiek_voorkomen",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Onbegroeide terreindelen per type in {city}",
        description:
          "BGT-veld fysiek_voorkomen: het waargenomen oppervlaktetype (open verharding, gesloten verharding, zand, …)",
        property: "fysiek_voorkomen",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Waar de begroeidterreindeel-laag het groen toont, laat deze laag het **onbegroeide** deel van de openbare ruimte zien. Het veld *fysiek_voorkomen* onderscheidt onder meer *open verharding* (klinkers, tegels), *gesloten verharding* (asfalt, beton), *half verhard*, *zand* en *onverhard*. Samen met het groen en het water vormt dit een vlakdekkend beeld van hoe elk stukje grond is ingericht.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verharding en klimaat**: het aandeel verhard oppervlak bepaalt hoeveel regenwater kan wegzakken en hoe sterk een gebied opwarmt; ontharding is een centraal thema in klimaatadaptatie.\n- **Materiaalkeuze en beheer**: het onderscheid tussen open en gesloten verharding is bepalend voor waterinfiltratie, onderhoud en herbestrating.\n- **Nulmeting vergroening**: om verhard oppervlak om te zetten in groen, is een precies overzicht van de bestaande verharding het vertrekpunt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de **Basisregistratie Grootschalige Topografie (BGT)** via PDOK. De laag beschrijft het fysieke voorkomen van het oppervlak, niet de functie (een verhard vlak kan een parkeerterrein, plein of erf zijn). Door de hoge detaillering worden grote gebieden in delen geladen; de statistieken betreffen de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "PDOK: Basisregistratie Grootschalige Topografie (BGT)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
      {
        label: "Over de BGT",
        url: "https://www.geobasisregistraties.nl/basisregistraties/grootschalige-topografie",
      },
    ],
  },
  {
    layerId: "natura2000",
    title: "Natura 2000-gebieden bij {city}",
    subtitle:
      "Europees beschermde natuurgebieden onder de Vogel- en Habitatrichtlijn",
    intro:
      "Deze laag toont **{count} Natura 2000-gebieden** in en rond {city}: de Europees beschermde natuurgebieden die deel uitmaken van het Natura 2000-netwerk. Elk gebied heeft een naam en een beschermingsregime (Vogelrichtlijn, Habitatrichtlijn of beide). Klik op een gebied voor de details, zoals de officiële naam en de sitecode.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebieden in beeld", type: "count" },
          { label: "Unieke gebiedsnamen", type: "distinct", property: "naamN2K" },
        ],
      },
      {
        kind: "category-bar",
        title: "Beschermingsregime van de gebieden bij {city}",
        description:
          "Veld beschermin: onder welke Europese richtlijn(en) het gebied is aangewezen",
        property: "beschermin",
        valueLabels: {
          HR: "Habitatrichtlijn",
          VR: "Vogelrichtlijn",
          "HR+VR": "Habitat- én Vogelrichtlijn",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een Natura 2000-gebied: een natuurgebied dat op grond van de Europese **Vogelrichtlijn** (VR), de **Habitatrichtlijn** (HR) of beide is aangewezen om specifieke soorten en leefgebieden te beschermen. Het veld *naamN2K* geeft de officiële gebiedsnaam, *beschermin* het regime. Deze gebieden vormen samen een Europees ecologisch netwerk dat de achteruitgang van biodiversiteit moet keren.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vergunningen en stikstof**: activiteiten die Natura 2000-gebieden kunnen beïnvloeden — zoals stikstofdepositie — vallen onder strikte toetsing; de gebiedsgrenzen zijn daarvoor bepalend.\n- **Ruimtelijke ordening**: rond deze gebieden gelden beperkingen voor bouwen, landbouw en recreatie; nabijheid is een harde randvoorwaarde bij plannen.\n- **Natuurwaarde**: de gebieden herbergen vaak de meest bijzondere natuur van de regio en zijn ankerpunten voor natuurbeleid en -herstel.",
      },
      {
        heading: "Over de bron",
        body: "De begrenzingen komen uit de officiële Natura 2000-registratie van de **Rijksdienst voor Ondernemend Nederland (RVO)**, ontsloten via PDOK. Het zijn de juridisch vastgestelde gebiedsgrenzen. De kaartuitsnede van {city} toont ook gebieden die net over de gemeentegrens liggen; een groot gebied kan zich ver buiten de uitsnede uitstrekken.",
      },
    ],
    links: [
      {
        label: "Natura 2000 (RVO)",
        url: "https://www.natura2000.nl/",
      },
      {
        label: "PDOK: dataset Natura 2000",
        url: "https://www.pdok.nl/introductie/-/article/natura-2000",
      },
    ],
  },
  {
    layerId: "pdok-zwemwater",
    title: "Officiële zwemwaterlocaties bij {city}",
    subtitle:
      "Aangewezen zwemplekken uit het Zwemwaterregister (rasterlaag)",
    intro:
      "Deze laag toont de **officieel aangewezen zwemwaterlocaties** in en rond {city}: de plekken in provinciale wateren en rijkswateren waar in het badseizoen op waterkwaliteit wordt gecontroleerd, afkomstig uit het landelijke Zwemwaterregister. Het is een landsdekkende kaartlaag die laat zien waar veilig en gecontroleerd gezwommen kan worden.",
    charts: [],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Alleen op **officieel aangewezen zwemwaterlocaties** houden de provincies en Rijkswaterstaat in het badseizoen de waterkwaliteit in de gaten: ze meten op bacteriën en blauwalg en geven waarschuwingen of zwemverboden af. Deze locaties zijn wettelijk aangewezen onder de Europese Zwemwaterrichtlijn en gebundeld in het nationale Zwemwaterregister. Zwemmen buiten deze plekken kan, maar gebeurt op eigen risico en zonder controle.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Volksgezondheid**: gecontroleerd zwemwater beschermt tegen maag-darmklachten en blootstelling aan giftige blauwalg.\n- **Recreatie en leefomgeving**: veilige zwemplekken zijn een gewaardeerde voorziening, zeker tijdens hitteperioden.\n- **Waterbeheer**: de kwaliteit van zwemwater is een zichtbare graadmeter voor de bredere toestand van het oppervlaktewater.",
      },
      {
        heading: "Over de bron en weergave",
        body: "De locaties komen uit het **Zwemwaterregister** (provincies en Rijkswaterstaat), ontsloten via PDOK als INSPIRE-dataset. In deze viewer wordt de laag nog als rasterkaart aangeboden; er worden geen losse, klikbare kaartobjecten geladen en dus geen lokale statistieken berekend. De rechtstreekse WMS-overlay volgt later. Actuele metingen, waarschuwingen en zwemverboden staan op zwemwater.nl.",
      },
    ],
    links: [
      {
        label: "Zwemwater.nl — actuele kwaliteit en waarschuwingen",
        url: "https://www.zwemwater.nl/",
      },
      {
        label: "PDOK: zwemwater (provinciaal + rijkswateren)",
        url: "https://www.pdok.nl/introductie/-/article/zwemwater",
      },
    ],
  },
];
