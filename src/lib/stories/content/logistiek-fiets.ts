/**
 * Story maps — logistiek & fiets.
 * Lagen: pakketpunten, pakketpunten-300m, pakketpunten-400m, ndw-truckparking,
 * pdok-fietsnetwerk-regionaal, telraam-segments, osm-supermarkten,
 * cbs-pc4-supermarkten-1km.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "pakketpunten",
    title: "Pakketpunten in {city}",
    subtitle:
      "Alle afhaal- en inleverpunten voor pakketten, van alle vervoerders op één kaart",
    intro:
      "In {city} zijn **{count} pakketpunten** geladen uit de dataset van pakketpuntenviewer.nl — afhaalpunten, pakketautomaten en servicebalies van vervoerders als PostNL, DHL, DPD, Amazon, GLS en VintedGo. Elke stip is één punt waar bewoners een pakket kunnen ophalen of versturen; klik erop voor de vervoerder en het adres.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Pakketpunten in beeld", type: "count" },
          { label: "Verschillende vervoerders", type: "distinct", property: "vervoerder" },
          {
            label: "Ophalen mogelijk (aandeel)",
            type: "count-where",
            property: "canPickup",
            equals: "true",
            asShare: true,
          },
          {
            label: "Inleveren mogelijk (aandeel)",
            type: "count-where",
            property: "canDropoff",
            equals: "true",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Pakketpunten per vervoerder in {city}",
        description:
          "Aantal punten per netwerk — één winkel kan voor meerdere vervoerders punt zijn en telt dan meerdere keren",
        property: "vervoerder",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een locatie waar één vervoerder pakketten aanneemt of uitgeeft: een servicepunt in een winkel, een pakketautomaat of een eigen balie. Dezelfde supermarkt of tabakszaak kan voor méérdere vervoerders punt zijn — die telt dan als meerdere stippen op (vrijwel) dezelfde plek. De velden *canPickup* en *canDropoff* geven aan of je er pakketten kunt **ophalen**, **inleveren**, of allebei.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Stadslogistiek**: hoe dichter het netwerk van pakketpunten, hoe minder mislukte thuisbezorgingen en hoe minder bestelbus-kilometers in woonwijken.\n- **Zero-emissiezones**: veel gemeenten voeren vanaf 2025 zero-emissiezones voor stadslogistiek in; pakketpunten en automaten zijn een belangrijke bouwsteen om het aantal ritten te beperken.\n- **Gelijke spreiding**: de staafgrafiek per vervoerder laat zien welke netwerken sterk of juist dun vertegenwoordigd zijn — handig bij gesprekken met vervoerders over witte vlekken.",
      },
      {
        heading: "Over de bron",
        body: "De data komt van **pakketpuntenviewer.nl**, dat de openbare locatiegegevens van de vervoerders bundelt tot één GeoJSON-bestand per gemeente. De dataset is een momentopname: punten openen en sluiten regelmatig, en niet elke vervoerder publiceert even volledig. De statistieken gaan over de geladen kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Pakketpuntenviewer (brondata)",
        url: "https://pakketpuntenviewer.nl",
      },
      {
        label: "Rijksoverheid — zero-emissiezones stadslogistiek",
        url: "https://www.opwegnaarzes.nl",
      },
    ],
  },

  {
    layerId: "pakketpunten-300m",
    title: "Loopbereik van pakketpunten in {city}: 300 meter",
    subtitle:
      "Het gebied dat binnen zo'n 4 minuten lopen van een pakketpunt ligt",
    intro:
      "Deze laag toont het samengevoegde gebied binnen **300 meter** rondom alle pakketpunten in {city} — geladen als {count} aaneengesloten bereikvlak(ken). Alles wat binnen het gekleurde vlak valt, ligt op hooguit een paar minuten lopen van een plek waar je een pakket kunt ophalen of wegbrengen.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Bereikvlakken geladen", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Hoe lees je deze kaart?",
        body: "Rond elk pakketpunt is een cirkel van 300 meter getrokken; overlappende cirkels zijn samengevoegd tot één vlak (*buffer union*). 300 meter komt overeen met ongeveer **4 minuten lopen**. Gebieden búiten het vlak liggen dus verder dan die loopafstand van het dichtstbijzijnde pakketpunt. Zet deze laag samen aan met de puntenlaag **Pakketpunten** om te zien welke punten het bereik bepalen.",
      },
      {
        heading: "Waarom 300 meter?",
        body: "Loopafstand is dé maat voor de **15-minutenstad**: voorzieningen die je te voet bereikt, vervangen autoritjes. Voor pakketpunten geldt: hoe korter de loop, hoe groter de kans dat bewoners kiezen voor afhalen in plaats van thuisbezorging — en dat scheelt bestelbus-bewegingen in de wijk. 300 meter is een strenge norm; de zusterlaag met **400 meter** toont een ruimhartiger bereik.",
      },
      {
        heading: "Kanttekeningen",
        body: "- De buffer is **hemelsbreed**: barrières zoals water, spoor of drukke wegen maken de werkelijke looproute vaak langer.\n- De laag zegt niets over openingstijden of drukte van de punten.\n- Het vlak is berekend over de punten in de dataset van pakketpuntenviewer.nl; ontbrekende punten betekenen een te klein getekend bereik.",
      },
    ],
    links: [
      {
        label: "Pakketpuntenviewer (brondata)",
        url: "https://pakketpuntenviewer.nl",
      },
    ],
  },

  {
    layerId: "pakketpunten-400m",
    title: "Loopbereik van pakketpunten in {city}: 400 meter",
    subtitle:
      "Het gebied dat binnen zo'n 5 minuten lopen van een pakketpunt ligt",
    intro:
      "Deze laag toont het samengevoegde gebied binnen **400 meter** rondom alle pakketpunten in {city} — geladen als {count} aaneengesloten bereikvlak(ken). 400 meter is een veelgebruikte planologische norm voor acceptabele loopafstand, dezelfde orde van grootte als de norm voor bushaltes.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Bereikvlakken geladen", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Hoe lees je deze kaart?",
        body: "Rond elk pakketpunt is een cirkel van 400 meter getrokken en zijn overlappende cirkels samengevoegd tot één vlak. 400 meter is ongeveer **5 minuten lopen**. Vergelijk deze laag met de strengere **300 meter**-variant: het verschil tussen beide vlakken laat zien welke randgebieden nét binnen of nét buiten comfortabele loopafstand vallen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Voorzieningen-nabijheid**: witte vlekken in het bereikvlak zijn wijken waar afhalen te voet geen reëel alternatief is voor thuisbezorging.\n- **Locatiekeuze**: bij het plaatsen van nieuwe pakketautomaten (bijvoorbeeld in de openbare ruimte) helpt deze kaart om gaten in het netwerk te vinden in plaats van bestaande clusters te verdichten.\n- **Minder ritten**: een dekkend afhaalnetwerk beperkt het aantal bestelbus-stops per straat — relevant voor verkeersveiligheid én de zero-emissiezone.",
      },
      {
        heading: "Kanttekeningen",
        body: "De buffer is hemelsbreed getekend en houdt geen rekening met barrières of daadwerkelijke looproutes. De onderliggende puntenset van pakketpuntenviewer.nl is een momentopname; het werkelijke bereik verschuift wanneer punten openen of sluiten.",
      },
    ],
    links: [
      {
        label: "Pakketpuntenviewer (brondata)",
        url: "https://pakketpuntenviewer.nl",
      },
    ],
  },

  {
    layerId: "ndw-truckparking",
    title: "Truckparkings rond {city}",
    subtitle:
      "Vrachtwagenparkeerplaatsen met realtime bezetting uit het NDW-open-dataplatform",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} truckparkings** geladen uit de open data van het **Nationaal Dataportaal Wegverkeer (NDW)**. Elke stip is een parkeerterrein voor vrachtwagens; de bijbehorende status toont hoeveel plekken er op dit moment vrij en bezet zijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Truckparkings in beeld", type: "count" },
          { label: "Vrije plekken (totaal, nu)", type: "sum", property: "vacant", decimals: 0 },
          { label: "Bezette plekken (totaal, nu)", type: "sum", property: "occupied", decimals: 0 },
          {
            label: "Gratis parkeren",
            type: "count-where",
            property: "freeOfCharge",
            equals: "true",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "NDW publiceert twee bestanden: een **parkeertabel** met de vaste gegevens (naam, locatie, wel/niet gratis) en een **statusbestand** met de actuele bezetting per terrein. Deze laag combineert beide: per locatie zie je *vacant* (vrije plekken), *occupied* (bezette plekken) en waar bekend een bezettingspercentage. De cijfers zijn een momentopname van het laatste laadmoment.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: bij een tekort aan truckparkings parkeren chauffeurs in de berm, op industrieterreinen of in woonwijken — met overlast en onveilige situaties tot gevolg.\n- **Rij- en rusttijden**: chauffeurs zijn wettelijk verplicht te rusten; voldoende beveiligde parkeercapaciteit langs corridors is daarom een logistieke basisvoorziening.\n- **Beleid**: gemeenten en provincies gebruiken bezettingsdata om te bepalen of uitbreiding of betere spreiding van capaciteit nodig is.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit het open-dataplatform van NDW in het Europese **DATEX II**-formaat en wordt bij het laden gefilterd op het kaartgebied van {city}. Truckparkings liggen vooral langs snelwegen en op bedrijventerreinen; in een compacte kaartuitsnede kan het aantal daardoor klein zijn of zelfs nul. Niet elk terrein levert (actuele) bezettingscijfers — ontbrekende waarden blijven leeg.",
      },
    ],
    links: [
      { label: "NDW open data (brondata)", url: "https://opendata.ndw.nu" },
      {
        label: "NDW — over het Nationaal Dataportaal Wegverkeer",
        url: "https://www.ndw.nu",
      },
    ],
  },

  {
    layerId: "pdok-fietsnetwerk-regionaal",
    title: "Regionale fietsnetwerken rond {city}",
    subtitle:
      "Knooppuntroutes en LF-routes van het Landelijk Fietsplatform, via PDOK",
    intro:
      "Deze laag toont de **recreatieve fietsnetwerken**: de knooppuntroutes en de landelijke LF-routes zoals bijgehouden door Stichting Landelijk Fietsplatform en gepubliceerd via PDOK. Het is een **raster-overlay (WMS)** — er worden geen losse kaartobjecten geladen ({count} vector-features), dus statistieken en grafieken zijn hier niet van toepassing.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Vector-features geladen", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat is dit netwerk?",
        body: "Nederland kent twee lagen recreatieve fietsroutes:\n- **Fietsknooppuntennetwerk**: genummerde knooppunten die je zelf tot een rondje combineert — regionaal beheerd, landelijk dekkend.\n- **LF-routes (LF-icoonroutes)**: lange-afstandsroutes zoals de Zuiderzeeroute of Maasroute, bedoeld voor meerdaagse tochten.\nBeide worden door het Landelijk Fietsplatform samen met regionale routebureaus actueel gehouden en als open data via PDOK ontsloten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Recreatie en toerisme**: fietsrecreatie is een grote economische factor; routekwaliteit en bewegwijzering bepalen mede hoe aantrekkelijk een regio is.\n- **Samenhang met utilitair fietsbeleid**: recreatieve routes en doorfietsroutes delen vaak dezelfde infrastructuur — bij wegwerkzaamheden of herinrichting is het handig beide netwerken in beeld te hebben.\n- **Omleidingen**: het Fietsplatform verwerkt ook tijdelijke omleidingen, waardoor de kaart de actuele situatie benadert.",
      },
      {
        heading: "Technische kanttekening",
        body: "PDOK biedt dit bestand aan als **WMS-kaartlaag** (afbeeldingstegels) en niet als downloadbare vector-features per gemeente. In deze viewer is de laag daarom (nog) een placeholder zonder aanklikbare objecten; ondersteuning voor WMS-overlays volgt. De routegegevens zelf zijn wél openbaar raadpleegbaar via de routeplanner van het Fietsplatform.",
      },
    ],
    links: [
      {
        label: "Landelijk Fietsplatform (bronhouder)",
        url: "https://www.fietsplatform.nl",
      },
      {
        label: "PDOK — regionale fietsnetwerken",
        url: "https://www.pdok.nl/introductie/-/article/landelijk-fietsplatform",
      },
    ],
  },

  {
    layerId: "telraam-segments",
    title: "Telraam-verkeerstellingen in {city}",
    subtitle:
      "Straatsegmenten waar bewoners zélf het verkeer tellen met een sensor achter het raam",
    intro:
      "Op de kaart staan **{count} actieve Telraam-segmenten** in en rond {city}. Telraam is een netwerk van kleine sensoren die bewoners achter hun raam hangen; het apparaat telt continu passerende **auto's, vrachtwagens, fietsers en voetgangers** op het straatsegment ervoor. Elke lijn is zo'n gemeten straat.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Actieve segmenten in beeld", type: "count" },
          { label: "Unieke straatsegmenten", type: "distinct", property: "segment_id" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een straatsegment met minstens één actieve Telraam-sensor. Deze basislaag toont de **locaties** van de meetpunten; de eigenlijke telcijfers (aantallen per uur, per vervoerwijze, rijrichting en zelfs V85-snelheid) zijn per segment op te vragen via de Telraam-website en -API.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Onderbouwing met cijfers**: klachten over sluipverkeer of hardrijden zijn met Telraam-data te toetsen — vóór en ná een ingreep (knip, 30 km/u, schoolstraat).\n- **Fiets- en loopdata**: klassieke tellussen meten vooral auto's; Telraam telt óók fietsers en voetgangers en vult zo een groot gat in de data.\n- **Participatie**: bewoners die zelf meten, zijn betrokken bewoners — veel gemeenten delen sensoren uit als onderdeel van mobiliteitsprojecten.",
      },
      {
        heading: "Kanttekeningen bij community-data",
        body: "Telraam is **burgerwetenschap**: de sensoren hangen waar vrijwilligers wonen, dus het netwerk is niet representatief gespreid over de stad. Tellingen lopen alleen bij daglicht (het cameraatje heeft licht nodig) en de kwaliteit hangt af van de montage en het zicht op straat. Gebruik de cijfers als **indicatie en trendmeter**, niet als officiële verkeerstelling. Deze laag vereist bovendien een (gratis) Telraam-API-sleutel; zonder sleutel blijft de kaart leeg.",
      },
    ],
    links: [
      { label: "Telraam (brondata en kaart)", url: "https://telraam.net/nl" },
      {
        label: "Telraam API-documentatie",
        url: "https://telraam-api.net",
      },
    ],
  },

  {
    layerId: "osm-supermarkten",
    title: "Supermarkten in {city}",
    subtitle:
      "Alle supermarktlocaties uit OpenStreetMap, de vrij bewerkbare wereldkaart",
    intro:
      "In {city} zijn **{count} supermarkten** geladen uit **OpenStreetMap** (OSM), opgevraagd via de Overpass-API met het kenmerk `shop=supermarket`. Elke stip is een supermarkt; klik erop voor naam en — waar ingevuld — keten, adres en openingstijden.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Supermarkten in beeld", type: "count" },
          { label: "Verschillende ketens (ingevuld)", type: "distinct", property: "brand" },
          { label: "Unieke winkelnamen", type: "distinct", property: "name" },
        ],
      },
      {
        kind: "category-bar",
        title: "Supermarkten per keten in {city}",
        description:
          "OSM-veld brand — alleen winkels waar mappers de keten hebben ingevuld tellen mee",
        property: "brand",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "OpenStreetMap-vrijwilligers (\"mappers\") leggen winkels vast met gestandaardiseerde kenmerken: `shop=supermarket` voor het type, *name* voor de winkelnaam en *brand* voor de keten. De staafgrafiek per keten geeft een beeld van de marktverdeling — al telt hij alleen winkels waar het *brand*-veld daadwerkelijk is ingevuld, dus de aantallen zijn een ondergrens.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Dagelijkse voorzieningen**: de supermarkt is dé ankervoorziening van de 15-minutenstad; loopafstand tot een supermarkt bepaalt sterk hoe autonoom ouderen en mensen zonder auto kunnen leven.\n- **Bevoorradingslogistiek**: elke supermarkt genereert dagelijks vrachtverkeer; de spreiding van winkels bepaalt mede de routes van bevoorradend verkeer door de stad.\n- **Combineer met CBS**: de laag *Grote Supermarkten Binnen 1 km (PC4)* toont dezelfde vraag vanuit de statistiek — deze OSM-laag laat zien wáár die winkels precies zitten.",
      },
      {
        heading: "Over de bron",
        body: "OpenStreetMap is een open databank die door vrijwilligers wordt bijgehouden. De volledigheid is in Nederland hoog maar niet gegarandeerd: een net geopende of gesloten winkel kan achterlopen, en de laag bevat alleen als punt (node) gemapte winkels — een supermarkt die als gebouwvlak is ingetekend, kan buiten deze selectie vallen. De selectie is gefilterd op het gemeentegebied van {city}.",
      },
    ],
    links: [
      {
        label: "OpenStreetMap (brondata)",
        url: "https://www.openstreetmap.org",
      },
      {
        label: "OSM-wiki: shop=supermarket",
        url: "https://wiki.openstreetmap.org/wiki/Tag:shop%3Dsupermarket",
      },
    ],
  },

  {
    layerId: "cbs-pc4-supermarkten-1km",
    title: "Grote supermarkten binnen 1 km in {city}",
    subtitle:
      "CBS-statistiek per postcodegebied: hoeveel grote supermarkten liggen er binnen een kilometer?",
    intro:
      "Deze laag kleurt de **{count} postcodegebieden (PC4)** in het kaartgebied van {city} naar het aantal **grote supermarkten binnen 1 kilometer** van het zwaartepunt van het gebied, zoals berekend door het CBS. Hoe hoger het getal, hoe meer keuze bewoners op korte afstand hebben.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddeld aantal binnen 1 km",
            type: "avg",
            property: "groteSupermarktAantalBinnen1Km",
            decimals: 1,
          },
          {
            label: "Maximum in één gebied",
            type: "max",
            property: "groteSupermarktAantalBinnen1Km",
            decimals: 0,
          },
          {
            label: "Inwoners in beeld (som PC4)",
            type: "sum",
            property: "aantalInwoners",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling: grote supermarkten binnen 1 km per PC4-gebied",
        description:
          "Aantal postcodegebieden per klasse — links de gebieden met weinig, rechts met veel supermarkten nabij",
        property: "groteSupermarktAantalBinnen1Km",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Hoe lees je deze kaart?",
        body: "Het CBS berekent per PC4-gebied hoeveel **grote supermarkten** (naar CBS-definitie, op basis van winkeloppervlak) er binnen 1 kilometer *over de weg* van het bewoonde zwaartepunt liggen. Een waarde van 0 betekent niet dat er helemaal geen winkel is — kleinere buurtsupers tellen niet mee — maar wél dat een volwaardige supermarkt verder weg ligt. Klik op een gebied voor de postcode en het exacte aantal.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **15-minutenstad**: nabijheid van dagelijkse boodschappen is een kernindicator voor een stad van korte afstanden.\n- **Kwetsbare groepen**: voor ouderen en huishoudens zonder auto is de afstand tot de supermarkt bepalend voor zelfredzaamheid; gebieden met lage waarden verdienen aandacht bij detailhandels- en woonbeleid.\n- **Minder autoritten**: hoe meer huishoudens op loop- of fietsafstand van een supermarkt wonen, hoe minder korte autoritten voor boodschappen.",
      },
      {
        heading: "Over de bron",
        body: "De cijfers komen uit de **CBS-statistieken per postcode (PC4)**, ontsloten als open data via PDOK. Het is een modelmatige nabijheidsstatistiek op gebiedsniveau: binnen één PC4-gebied kan de werkelijke afstand per adres flink verschillen. De kaart toont de PC4-vlakken die het kaartgebied van {city} snijden — randgebieden kunnen deels buiten de gemeente liggen. Vergelijk met de OSM-laag *Supermarkten* om de individuele winkellocaties te zien.",
      },
    ],
    links: [
      {
        label: "CBS — gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK — CBS postcodestatistieken (brondata)",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
];
