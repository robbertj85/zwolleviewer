/**
 * Story maps — batch "rotterdam-4": gemeentelijke open-data lagen van
 * gemeente Rotterdam (ArcGIS FeatureServers).
 *
 * Lagen: rtd-riool-putten, rtd-kademuren, rtd-zettingenkaart,
 * rtd-bodemfunctie, rtd-grondwateroverlast-aandachtsgebieden,
 * rtd-drooglegging, rtd-warmteleidingen-eneco, rtd-luchtmeetpunten,
 * rtd-deelmobiliteit-hubs, rtd-voetpaden, rtd-wegonderhoud,
 * rtd-winkelcentra, rtd-beschermd-wonen, rtd-stedin-stations,
 * rtd-gasvervanging-versnelling.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "rtd-riool-putten",
    title: "Rioolputten in {city}",
    subtitle:
      "Inspectie-, knoop- en kolkputten van het gemeentelijke rioolstelsel",
    intro:
      "Deze laag toont **{count} rioolputten** binnen het kaartgebied van {city}, uit de beheerregistratie van het gemeentelijke riool. Elke put is een knooppunt in het ondergrondse netwerk — van gewone rioolknopen tot uitstroompunten en persleidingknopen. Klik op een put voor details zoals de putcode, putfunctie en (waar bekend) maaiveldhoogte en aanlegjaar. Het is een zeer grote laag; de kaart laadt een deel ervan, dus de aantallen hieronder gaan over wat er nú in beeld staat.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Putten in beeld", type: "count" },
          {
            label: "Rioolknooppunten",
            type: "count-where",
            property: "PUTFUNCT_2",
            equals: "Knooppunt Riolering",
          },
          {
            label: "Persleidingknopen",
            type: "count-where",
            property: "PUTFUNCT_2",
            equals: "Knooppunt Persleiding",
          },
          { label: "Putfuncties (soorten)", type: "distinct", property: "PUTFUNCT_2" },
        ],
      },
      {
        kind: "category-bar",
        title: "Putten naar functie in {city}",
        description:
          "Veld PUTFUNCT_2: de functie van de put in het rioolstelsel",
        property: "PUTFUNCT_2",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een put: een toegankelijk of verborgen knooppunt in het rioolnet. Het veld *PUTFUNCT_2* onderscheidt de functie — een **Knooppunt Riolering** is een gewone rioolknoop, een **Knooppunt Persleiding** hoort bij een leiding die onder druk staat, een **Uitstroompunt** loost op open water, en een **Berrie** (verreweg de grootste groep) is een straatkolk waarlangs regenwater het riool in stroomt. Zo lees je in één beeld hoe fijnmazig het stelsel onder de straat vertakt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en onderhoud**: putten zijn de toegangspunten voor inspectie, reiniging en reparatie; hun ligging bepaalt de bereikbaarheid van het net.\n- **Klimaatadaptatie**: kolken en uitstroompunten zijn cruciaal bij hevige buien; knelpunten hier vertalen zich direct in straat- en tuinwateroverlast.\n- **Graafwerk**: bij herinrichting of kabels-en-leidingenwerk is het puttennet de eerste referentie om schade aan het riool te voorkomen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de GIS-beheerregistratie van {city} (ArcGIS FeatureServer). Let op:\n- Het volledige bestand telt meer dan honderdduizend putten; de kaart laadt een deel, dus tellingen zijn een steekproef van het gebied in beeld.\n- Velden als *AANLEGJAAR* en *MAAIVELD* zijn lang niet overal ingevuld (vaak 0 of leeg) en zijn daarom niet als grafiek opgenomen.\n- Fictieve punten en \"nog te verwerken\" records komen in de registratie voor en tellen mee in de aantallen.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Riool_putten/FeatureServer",
      },
      { label: "Rotterdam Open Data", url: "https://rotterdam.dataplatform.nl/" },
    ],
  },
  {
    layerId: "rtd-kademuren",
    title: "Kademuren langs de Maas in {city}",
    subtitle: "Kademuren en oeverconstructies langs Nieuwe Maas en Waterweg",
    intro:
      "Deze laag tekent **{count} kademuren en oeverconstructies** binnen het kaartgebied van {city}: de keermuren en beschoeiingen langs de Nieuwe Maas en de Nieuwe Waterweg. Elke lijn is een geregistreerd kadevak met een eigenaar en een indicatie of er wel of niet afgemeerd mag worden. Klik op een muur voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kadevakken in beeld", type: "count" },
          {
            label: "Totale kadelengte",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          { label: "Eigenaren (soorten)", type: "distinct", property: "Eigenaar" },
          {
            label: "Afmeren niet mogelijk",
            type: "count-where",
            property: "afmeren",
            equals: "afmeren niet mmogelijk",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kademuren naar eigenaar in {city}",
        description:
          "Veld Eigenaar: wie het kadevak in beheer/eigendom heeft",
        property: "Eigenaar",
        valueLabels: {
          HBR: "Havenbedrijf Rotterdam (HBR)",
          "HBR en Rotterdam": "HBR én gemeente",
          "Gem Rotterdam": "Gemeente Rotterdam",
          Derden: "Derden",
          " ": "Onbekend",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een kademuur of oeverconstructie langs het water. Het **eigendom** is verdeeld over de gemeente, het **Havenbedrijf Rotterdam (HBR)**, combinaties daarvan en derden — dat bepaalt wie verantwoordelijk is voor inspectie en vervanging. Het veld *afmeren* markeert vakken waar (bijvoorbeeld door de constructie of de vaargeul) niet mag worden afgemeerd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Areaalbeheer**: kademuren zijn kapitaalintensieve kunstwerken met een lange, maar eindige levensduur; hun ligging en eigendom bepalen de vervangingsopgave.\n- **Veiligheid**: falende kademuren kunnen straten en kades laten verzakken — een thema dat in grote binnensteden hoog op de agenda staat.\n- **Ruimtegebruik aan het water**: afmeer- en aanlegmogelijkheden sturen waar bedrijvigheid, recreatie en woonboten een plek kunnen krijgen.",
      },
      {
        heading: "Over de bron",
        body: "De kademuren komen uit de GIS-registratie van {city} (ArcGIS FeatureServer). Het is een compact bestand van enkele honderden vakken; de totale lengte hierboven is de som van de geregistreerde vaklengtes binnen de kaartuitsnede. Het veld *afmeren* is spaarzaam ingevuld — alleen expliciet gemarkeerde vakken tellen mee.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Kades_Rotterdam/FeatureServer",
      },
      { label: "Havenbedrijf Rotterdam", url: "https://www.portofrotterdam.com/" },
    ],
  },
  {
    layerId: "rtd-zettingenkaart",
    title: "Bodemzetting in {city} (2004–2021)",
    subtitle: "Gemeten bodemdaling per buurt over ruim vijftien jaar",
    intro:
      "Deze laag toont **{count} buurtvlakken** binnen het kaartgebied van {city} met de gemeten bodemzetting over de periode 2004–2021. In het slappe Hollandse veen- en kleigebied zakt de bodem langzaam weg; deze kaart classificeert per (sub)buurt hoe sterk dat gebeurt. Klik op een vlak voor de buurtnaam en de zettingsklasse.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurtvlakken in beeld", type: "count" },
          { label: "Buurten (namen)", type: "distinct", property: "BUURTNAAM" },
          {
            label: "Zettingsklasse ingevuld",
            type: "count-where",
            property: "code123",
            equals: ["1", "2", "3"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Buurtvlakken naar zettingsklasse in {city}",
        description:
          "Veld code123: de groepsindeling naar zettingssnelheid (klasse 1–3; hogere klasse = sterkere zetting)",
        property: "code123",
        valueLabels: {
          "1": "Klasse 1 (minste zetting)",
          "2": "Klasse 2",
          "3": "Klasse 3 (meeste zetting)",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een (sub)buurt, gekleurd naar hoeveel de bodem er tussen 2004 en 2021 is gedaald. De indeling *code123* groepeert buurten in klassen: hoe hoger de klasse, hoe sneller de bodem er zakt. Niet elk vlak heeft een klasse — waar geen betrouwbare meting is, blijft de indeling leeg.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Funderingen en gebouwen**: ongelijkmatige zetting veroorzaakt scheuren, klemmende deuren en op termijn funderingsschade — vooral bij oudere panden op houten palen.\n- **Riool en leidingen**: meebewegende ondergrond breekt buizen en verstoort het afschot van het riool.\n- **Klimaat en waterbeheer**: dalende bodem verkleint de drooglegging en vergroot het risico op water-op-straat; deze kaart helpt prioriteren waar maatregelen het hardst nodig zijn.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De zettingenkaart komt uit de GIS-registratie van {city} (ArcGIS FeatureServer) en beslaat een vaste meetperiode (2004–2021). Het is een historische momentopname, geen live meting. De cijfers gelden per buurtvlak: binnen één vlak kan de werkelijke zetting van plek tot plek verschillen. Vlakken zonder ingevulde klasse (*code123*) zijn buiten de grafiek gelaten.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Zettingenkaart20042021/FeatureServer",
      },
      {
        label: "Bodemdalingskaart Nederland",
        url: "https://bodemdalingskaart.nl/",
      },
    ],
  },
  {
    layerId: "rtd-bodemfunctie",
    title: "Bodemfunctieklassen in {city}",
    subtitle: "Bodemfunctieklassenkaart 2014: het kader voor grondverzet",
    intro:
      "Deze laag deelt {city} in naar **bodemfunctie**: {count} gebieden binnen de kaartuitsnede, elk met een functieklasse uit de gemeentelijke bodemfunctieklassenkaart van 2014. De klasse (wonen, industrie, landbouw of natuur) bepaalt welke bodemkwaliteit vereist is en of grond ergens mag worden toegepast. Klik op een vlak voor de wijknaam en de functie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          {
            label: "Woonfunctie (aandeel)",
            type: "count-where",
            property: "Functie",
            equals: "Wonen (Licht verontreinigd)",
            asShare: true,
          },
          {
            label: "Industriefunctie",
            type: "count-where",
            property: "Functie",
            equals: "Industrie (Matig verontreinigd)",
          },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemfunctieklassen in {city}",
        description:
          "Veld Functie: de bodemfunctieklasse met bijbehorende referentiekwaliteit",
        property: "Functie",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak heeft één bodemfunctieklasse. De klasse koppelt een gebruiksfunctie aan een verwachte bodemkwaliteit: **Wonen** (licht verontreinigd) is verreweg de grootste categorie, gevolgd door **Industrie** (matig verontreinigd) en kleine oppervlaktes **Landbouw** en **Natuur** (schoon). Die kwaliteitseis geldt als toetsingskader bij het toepassen van grond op de betreffende plek.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Grondverzet**: bij ontgraven en aanvullen moet de aangevoerde grond passen bij de functieklasse; de kaart bepaalt wat waar mag.\n- **Ruimtelijke plannen**: een functiewijziging (bijvoorbeeld industrie naar wonen) kan bodemsanering of aanvullend onderzoek nodig maken.\n- **Gezondheid**: strengere klassen bij wonen, spelen en moestuinen beschermen kwetsbaar gebruik tegen bodemverontreiniging.",
      },
      {
        heading: "Over de bron",
        body: "De bodemfunctieklassenkaart 2014 komt uit de GIS-registratie van {city} (ArcGIS FeatureServer). Het is een beleidskaart met een vaste peildatum; nieuwere inzichten of lokale saneringen zijn er niet automatisch in verwerkt. De oppervlakte hierboven is de som van de vlakken binnen de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/BKK_2014_Bodemfunctie/FeatureServer",
      },
      {
        label: "Bodem+ — Besluit bodemkwaliteit",
        url: "https://www.bodemplus.nl/onderwerpen/wet-regelgeving/bbk/",
      },
    ],
  },
  {
    layerId: "rtd-grondwateroverlast-aandachtsgebieden",
    title: "Aandachtsgebieden grondwater & bodemdaling in {city}",
    subtitle:
      "Zones waar grondwateroverlast en bodemdaling samenvallen",
    intro:
      "Deze laag toont **{count} aandachtsgebieden** binnen het kaartgebied van {city}: zones waar grondwateroverlast en bodemdaling elkaar versterken. Het is een klein, gericht bestand — geen dekkende kaart, maar een selectie van gebieden die de gemeente als prioritair heeft aangemerkt voor monitoring en maatregelen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Aandachtsgebieden in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde omvang",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gebied waar twee problemen samenkomen: een **hoge grondwaterstand** die tot vocht- en wateroverlast leidt, én **bodemdaling** die de situatie verergert. Doordat beide factoren elkaar in deze zones versterken, krijgen ze extra aandacht in het waterbeheer. De laag bevat geen inhoudelijke kenmerken per vlak; het gaat puur om de afbakening van de zones.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Prioritering**: met beperkte middelen kiest de gemeente hier eerst voor grondwater- en zettingsmaatregelen.\n- **Kruisbestuiving met andere lagen**: combineer deze zones met de zettingenkaart, de drooglegging en het funderingsbeeld om de onderliggende oorzaken te duiden.\n- **Communicatie met bewoners**: in aandachtsgebieden is voorlichting over kruipruimtes, funderingen en tuinvergroening extra waardevol.",
      },
      {
        heading: "Over de bron",
        body: "De aandachtsgebieden komen uit de GIS-registratie van {city} (ArcGIS FeatureServer). Het is een beleidsmatige selectie, geen meetreeks — de begrenzing markeert wáár de aandacht nodig is, niet de exacte ernst per punt. Buiten de gemarkeerde zones kunnen lokaal ook problemen voorkomen.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Aandachtsgebieden_grondwateroverlast_en_bodemdaling/FeatureServer",
      },
      {
        label: "Rotterdams Weerwoord (klimaatadaptatie)",
        url: "https://www.rotterdamsweerwoord.nl/",
      },
    ],
  },
  {
    layerId: "rtd-drooglegging",
    title: "Drooglegging in {city}",
    subtitle:
      "Uitgiftepeil minus maaiveldhoogte per straatvak: hoe droog ligt de straat?",
    intro:
      "Deze laag kleurt **{count} straatvakken** binnen het kaartgebied van {city} op de **drooglegging**: het verschil tussen het gewenste waterpeil en de maaiveldhoogte. Een grotere drooglegging betekent meer marge boven het water; een kleine of negatieve waarde wijst op natte, zettingsgevoelige straten. Klik op een vak voor de gemeten waarde.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Straatvakken in beeld", type: "count" },
          {
            label: "Gemiddelde drooglegging",
            type: "avg",
            property: "MEAN_UGPminMVH",
            unit: "m",
            decimals: 2,
          },
          {
            label: "Kleinste (natste) waarde",
            type: "min",
            property: "MEAN_UGPminMVH",
            unit: "m",
            decimals: 2,
          },
          {
            label: "Grootste (droogste) waarde",
            type: "max",
            property: "MEAN_UGPminMVH",
            unit: "m",
            decimals: 2,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de drooglegging in {city}",
        description:
          "Veld MEAN_UGPminMVH: gemiddeld uitgiftepeil minus maaiveldhoogte per straatvak (meter)",
        property: "MEAN_UGPminMVH",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elk straatvak is de gemiddelde drooglegging berekend als *uitgiftepeil minus maaiveldhoogte* (veld **MEAN_UGPminMVH**, in meters). Positieve waarden betekenen dat het maaiveld ruim boven het streefpeil ligt — droog en stabiel. Waarden rond nul of negatief duiden op lage, natte straten waar grondwater dicht onder het oppervlak staat. Het histogram laat zien hoe die waarden over de stad verdeeld zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Wateroverlast**: bij weinig drooglegging staat regenwater sneller op straat en loopt grondwater eerder kruipruimtes in.\n- **Bodemdaling**: lage drooglegging en zetting versterken elkaar; deze kaart wijst de gevoelige straten aan.\n- **Peilbeheer**: het is een directe onderbouwing voor keuzes over drainage, ophoging en het (lokaal) aanpassen van streefpeilen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De drooglegging komt uit de GIS-registratie van {city} (ArcGIS FeatureServer) en is een afgeleide (gemodelleerde) waarde per straatvak, gebaseerd op hoogte- en peilgegevens. Het is een momentopname: peilbesluiten en ophogingen kunnen het beeld na de peildatum veranderen. Extreme uitschieters (ver boven of onder nul) horen vaak bij bijzondere locaties zoals kades en taluds.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Drooglegging_en_ontwateringsdiepte/FeatureServer",
      },
      {
        label: "Rotterdams Weerwoord (klimaatadaptatie)",
        url: "https://www.rotterdamsweerwoord.nl/",
      },
    ],
  },
  {
    layerId: "rtd-warmteleidingen-eneco",
    title: "Warmteleidingen (Eneco) in {city}",
    subtitle:
      "Geplande en bestaande stadsverwarmingsleidingen met planjaar en type",
    intro:
      "Deze laag toont **{count} warmteleiding-segmenten** van Eneco binnen het kaartgebied van {city}: de ondergrondse buizen van het stadsverwarmingsnet, met per segment een planjaar en een type ingreep. Zo zie je waar het warmtenet ligt en wanneer er aan gewerkt wordt. Klik op een leiding voor naam, planjaar en type.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Leidingsegmenten in beeld", type: "count" },
          {
            label: "Vervanging (aandeel)",
            type: "count-where",
            property: "type",
            equals: "vervanging",
            asShare: true,
          },
          { label: "Planjaren", type: "distinct", property: "jaar" },
          { label: "Projecten (plan-id's)", type: "distinct", property: "plan_id" },
        ],
      },
      {
        kind: "category-bar",
        title: "Warmteleidingwerk naar planjaar in {city}",
        description: "Veld jaar: het jaar waarin de ingreep is gepland",
        property: "jaar",
        maxCategories: 9,
      },
      {
        kind: "category-bar",
        title: "Type ingreep",
        description: "Veld type: vervanging versus inspectie",
        property: "type",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een segment van het warmtenet met een gepland **jaar** en een **type**: verreweg de meeste segmenten betreffen **vervanging** van bestaande leidingen, een kleiner deel is **inspectie**. De planjaren lopen enkele jaren vooruit, met duidelijke pieken in bepaalde jaren — dat zijn de momenten waarop grotere delen van het net worden aangepakt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Werk-met-werk maken**: als de gemeente tóch de straat openbreekt, is het efficiënt dat te combineren met gepland leidingwerk.\n- **Warmtetransitie**: het bestaande warmtenet is een bouwsteen voor het aardgasvrij maken van wijken; zien waar het ligt helpt bij de afweging warmtenet versus alternatieven.\n- **Overlastplanning**: geplande vervangingen betekenen tijdelijke opbrekingen; de planjaren maken die voorspelbaar.",
      },
      {
        heading: "Over de bron",
        body: "De leidingen komen als open data uit de GIS-registratie van {city} (ArcGIS FeatureServer), met Eneco als netbeheerder. Het is een planbestand: de jaartallen zijn voornemens en kunnen schuiven. De kaart laadt de segmenten binnen de uitsnede; grote leidingen zijn vaak in meerdere korte segmenten opgeknipt.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Eneco_plannen_leidingen/FeatureServer",
      },
      { label: "Eneco warmte", url: "https://www.eneco.nl/duurzame-energie/warmte/" },
    ],
  },
  {
    layerId: "rtd-luchtmeetpunten",
    title: "Luchtmeetpunten rond {city}",
    subtitle: "Vaste meetstations voor luchtkwaliteit (peiljaar 2021)",
    intro:
      "Deze laag toont **{count} luchtmeetpunten** binnen het kaartgebied van {city}: vaste meetstations waar de luchtkwaliteit wordt gemeten, beheerd door onder andere DCMR, RIVM en regionale omgevingsdiensten. Elk punt heeft een meetpuntnummer, een beheerder en een status (actief of vervallen). Klik op een station voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetpunten in beeld", type: "count" },
          {
            label: "Actief (aandeel)",
            type: "count-where",
            property: "Actief",
            equals: "ja",
            asShare: true,
          },
          {
            label: "RIVM-stations",
            type: "count-where",
            property: "Beheer",
            equals: "RIVM",
          },
          { label: "Beheerders", type: "distinct", property: "Beheer" },
        ],
      },
      {
        kind: "category-bar",
        title: "Meetpunten naar beheerder rond {city}",
        description: "Veld Beheer: de organisatie die het meetpunt beheert",
        property: "Beheer",
        valueLabels: {
          vervallen: "Vervallen / niet meer in beheer",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een vast meetstation dat stoffen als stikstofdioxide en fijnstof meet. Het veld **Beheer** laat zien welke organisatie het meetpunt onderhoudt — voor de regio Rijnmond is dat vooral **DCMR** en het landelijke **RIVM**. Het veld **Actief** onderscheidt stations die nog meten van punten die inmiddels zijn vervallen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: luchtkwaliteit is een van de grootste omgevingsgebonden gezondheidsrisico's; meetpunten leveren de feitelijke onderbouwing.\n- **Beleidstoetsing**: de metingen toetsen of maatregelen (milieuzones, snelheidsverlaging, haveningrepen) daadwerkelijk effect hebben.\n- **Ruimtelijke keuzes**: bij scholen, woningen en sportvelden nabij drukke wegen of industrie is de gemeten belasting een belangrijk afwegingsargument.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De meetpunten komen uit de GIS-registratie van {city} (ArcGIS FeatureServer, peiljaar 2021). Het referentiebestand bevat ook stations van omgevingsdiensten buiten de directe regio; de kaartuitsnede van {city} bepaalt welke daarvan in beeld komen. De laag geeft de *locaties* en beheerstatus — niet de actuele meetwaarden. Kijk voor live concentraties op het Landelijk Meetnet Luchtkwaliteit.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Meetpunten2021_luchtmeetnet/FeatureServer",
      },
      { label: "DCMR Milieudienst Rijnmond", url: "https://www.dcmr.nl/" },
      {
        label: "Luchtmeetnet.nl (actuele waarden)",
        url: "https://www.luchtmeetnet.nl/",
      },
    ],
  },
  {
    layerId: "rtd-deelmobiliteit-hubs",
    title: "Deelmobiliteit-hubs in {city}",
    subtitle: "Aangewezen zones voor deelauto's, -bakfietsen en -scooters",
    intro:
      "Deze laag toont **{count} deelmobiliteit-hubs** binnen het kaartgebied van {city}: aangewezen zones waar gedeelde voertuigen — deelauto's, deelbakfietsen en deelscooters — geparkeerd mogen worden. Door deelvoertuigen te bundelen op vaste plekken houdt de gemeente de openbare ruimte overzichtelijk. Klik op een hub voor de zonecodes.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Hubs in beeld", type: "count" },
          { label: "Zone-id's (uniek)", type: "distinct", property: "zone_id" },
          { label: "Gebieden", type: "distinct", property: "gebied_id" },
          {
            label: "Gemiddelde hubgrootte",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een hub: een afgebakende zone in de openbare ruimte waar deelvoertuigen thuishoren. De laag bevat vooral de begrenzing en de administratieve codes (*zone_id*, *gebied_id*) — het type voertuig staat er niet expliciet bij, maar de hubs zijn bedoeld voor de mix van deelauto, deelbakfiets en deelscooter die in {city} wordt aangeboden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ordelijke straat**: vaste hubs voorkomen rondslingerende deelfietsen en -scooters op stoepen en in plantsoenen.\n- **Autoluwe wijken**: een goed hubnetwerk maakt het makkelijker om zonder eigen auto te leven, wat parkeerdruk en ruimtebeslag verlaagt.\n- **Vergunningen en spreiding**: de gemeente stuurt via de hubs op een evenwichtige verdeling van deelaanbod over wijken.",
      },
      {
        heading: "Over de bron",
        body: "De hubs komen uit de GIS-registratie van {city} (ArcGIS FeatureServer) en worden regelmatig geactualiseerd naarmate het deelmobiliteitsbeleid zich ontwikkelt. Doordat inhoudelijke kenmerken per hub beperkt zijn, tonen we hier vooral aantallen en de gemiddelde omvang van een hub binnen de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Deelmobiliteit_Hubs/FeatureServer",
      },
      {
        label: "Rotterdam over deelmobiliteit",
        url: "https://www.rotterdam.nl/deelvervoer",
      },
    ],
  },
  {
    layerId: "rtd-voetpaden",
    title: "Voetpaden in {city}",
    subtitle: "BGT-voetpadvlakken met verhardingstype en herkomst",
    intro:
      "Deze laag toont **{count} voetpadvlakken** binnen het kaartgebied van {city}, afgeleid uit de Basisregistratie Grootschalige Topografie (BGT). Elk vlak is een stuk voetpad met een verhardingstype en een breedte. Het is een fijnmazige laag — de kaart laadt een deel ervan, dus de aantallen gaan over het gebied dat nu in beeld staat. Klik op een vlak voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Voetpadvlakken in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde breedte",
            type: "avg",
            property: "Breedte",
            unit: "m",
            decimals: 1,
          },
          {
            label: "Voetpad op trap",
            type: "count-where",
            property: "KLASSE",
            equals: "Voetpad op Trap",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Voetpaden naar verhardingstype in {city}",
        description: "Veld FYSIEKVK: het fysieke verhardingstype van het pad",
        property: "FYSIEKVK",
      },
      {
        kind: "category-bar",
        title: "Herkomst van de voetpadgeometrie",
        description:
          "Veld HERKOMST: hoe de geometrie is ingewonnen (ingemeten, geconstrueerd, onbekend, …)",
        property: "HERKOMST",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een voetpad uit de BGT. Het veld **FYSIEKVK** geeft de verharding: de meeste paden hebben **open verharding** (tegels, klinkers), een kleiner deel **gesloten verharding** (asfalt). Het veld **KLASSE** onderscheidt gewone voetpaden van *voetpaden op een trap*, en **HERKOMST** vertelt hoe nauwkeurig de geometrie is ingewonnen — van precies *ingemeten* tot *onbekend*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toegankelijkheid**: breedte en verhardingstype bepalen of een pad begaanbaar is met rollator, rolstoel of kinderwagen.\n- **Beheer**: het voetpadareaal is de basis voor onderhoudsbudgetten en voor het plannen van herbestrating.\n- **Loopnetwerk**: samen vormen deze vlakken het fijnmazige voetgangersnet dat bepaalt hoe prettig en veilig mensen zich te voet verplaatsen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De voetpaden komen uit de GIS-registratie van {city} (ArcGIS FeatureServer), gebaseerd op de landelijke BGT. Het is een groot bestand; de kaart laadt een deel, dus oppervlakte en gemiddelden gelden voor het gebied in beeld. Het veld *Breedte* is een afgeleide waarde en kan bij grillige vlakken afwijken van de gevoelsmatige padbreedte.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Voetpaden/FeatureServer",
      },
      { label: "Over de BGT", url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-" },
    ],
  },
  {
    layerId: "rtd-wegonderhoud",
    title: "Wegonderhoud in {city}",
    subtitle: "Periodiek en groot onderhoud van wegen en buitenruimte",
    intro:
      "Deze laag toont **{count} onderhoudsprojecten** aan wegen en openbare buitenruimte binnen het kaartgebied van {city}. Elk vlak is een project met een stadium (van planvorming tot technisch gereed), een gebied en een aanspreekpunt. Zo zie je waar en in welke fase er aan de weg wordt gewerkt. Klik op een project voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Projecten in beeld", type: "count" },
          {
            label: "Technisch gereed",
            type: "count-where",
            property: "Stadium",
            equals: "Technisch_Gereed",
          },
          {
            label: "In uitvoering",
            type: "count-where",
            property: "Stadium",
            equals: "Uitvoering",
          },
          { label: "Gebieden", type: "distinct", property: "Gebied" },
        ],
      },
      {
        kind: "category-bar",
        title: "Projecten naar stadium in {city}",
        description: "Veld Stadium: de fase waarin het onderhoudsproject verkeert",
        property: "Stadium",
        valueLabels: {
          Technisch_Gereed: "Technisch gereed",
          Planvorming: "Planvorming",
          Voorbereiding: "Voorbereiding",
          Uitvoering: "In uitvoering",
          Geannuleerd: "Geannuleerd",
        },
      },
      {
        kind: "category-bar",
        title: "Projecten per gebied",
        description: "Veld Gebied: het stadsgebied waarin het project ligt",
        property: "Gebied",
        maxCategories: 7,
        valueLabels: {
          Centrum_Delfshaven: "Centrum-Delfshaven",
          Prins_Alexander: "Prins Alexander",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een onderhoudsproject aan de weg of de buitenruimte. Het veld **Stadium** laat de fase zien: veel projecten staan op **technisch gereed** of in **planvorming**, en een deel is in **voorbereiding** of **uitvoering**. Het veld **Gebied** verdeelt de projecten over de stadsgebieden, zodat je ziet waar de onderhoudsdruk zit.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Werk-met-werk**: gepland wegonderhoud is hét moment om ook te vergroenen, klimaatmaatregelen te nemen of kabels en leidingen te vernieuwen.\n- **Bereikbaarheid**: projecten in uitvoering betekenen omleidingen en overlast; het overzicht helpt bij het plannen van routes.\n- **Verwachtingenmanagement**: bewoners en ondernemers kunnen zien welke ingreep in hun buurt op stapel staat en in welke fase die verkeert.",
      },
      {
        heading: "Over de bron",
        body: "De projecten komen uit de GIS-registratie van {city} (ArcGIS FeatureServer) en worden periodiek bijgewerkt. Het stadium is een momentopname van de projectadministratie; een deel van de records heeft geen ingevuld stadium of gebied en telt dan niet mee in de betreffende grafiek.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Periodiek_en_groot_onderhoud_wegen_raadplegen/FeatureServer",
      },
      {
        label: "Rotterdam — werk aan de weg",
        url: "https://www.rotterdam.nl/werkzaamheden",
      },
    ],
  },
  {
    layerId: "rtd-winkelcentra",
    title: "Winkelcentra in {city}",
    subtitle: "Winkelconcentraties ingedeeld naar type en verzorgingsniveau",
    intro:
      "Deze laag toont **{count} winkelconcentraties** binnen het kaartgebied van {city}: van grote knooppuntcentra tot kleine buurthubs. Elke locatie heeft een naam en een klasse die het verzorgingsniveau aangeeft. Zo zie je de winkelstructuur van de stad in één oogopslag. Klik op een punt voor naam en klasse.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Winkelcentra in beeld", type: "count" },
          { label: "Klassen (soorten)", type: "distinct", property: "klasse" },
          {
            label: "Buurthubs",
            type: "count-where",
            property: "klasse",
            equals: "Buurthub",
          },
          {
            label: "Wijkcentra",
            type: "count-where",
            property: "klasse",
            equals: "Wijkcentrum",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Winkelcentra naar klasse in {city}",
        description: "Veld klasse: het type en verzorgingsniveau van de winkelconcentratie",
        property: "klasse",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een aangewezen winkelconcentratie. De **klasse** ordent ze naar schaal en functie: van kleine **buurthubs** en **buurtcentra** voor de dagelijkse boodschappen, via **wijkcentra**, tot grotere **knooppuntcentra** en een **binnenstadsrandgebied**. Zo lees je af welke centra een lokale rol spelen en welke een bredere regiofunctie hebben.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Voorzieningenniveau**: de nabijheid van een winkelcentrum bepaalt hoe zelfstandig bewoners in hun dagelijkse behoeften kunnen voorzien.\n- **Detailhandelsbeleid**: de gemeente concentreert winkels bewust om leegstand te beperken en levendige centra overeind te houden.\n- **Bereikbaarheid**: winkelcentra zijn belangrijke bestemmingen voor OV, fiets en bevoorrading; hun ligging stuurt verkeers- en parkeerkeuzes.",
      },
      {
        heading: "Over de bron",
        body: "De winkelcentra komen uit de GIS-registratie van {city} (ArcGIS FeatureServer). Het is een beleidsmatige indeling van winkelconcentraties, geen uitputtende lijst van alle individuele winkels. De kaartuitsnede van {city} bepaalt welke centra worden getoond.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Winkelcentra_Rotterdam/FeatureServer",
      },
      { label: "Rotterdam Open Data", url: "https://rotterdam.dataplatform.nl/" },
    ],
  },
  {
    layerId: "rtd-beschermd-wonen",
    title: "Beschermd wonen — zoekzones in {city}",
    subtitle: "Onderzochte locaties voor beschermde woonvormen (GGZ)",
    intro:
      "Deze laag toont **{count} zoekzones** binnen het kaartgebied van {city}: locaties die zijn onderzocht op geschiktheid voor **beschermd wonen** — woonvormen met begeleiding voor mensen met een psychische kwetsbaarheid. Elke zone heeft een eerste conclusie over de geschiktheid en een score op factoren als geluid, veiligheid en bereikbaarheid. Klik op een zone voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zoekzones in beeld", type: "count" },
          {
            label: "Positief beoordeeld",
            type: "count-where",
            property: "Eerste_conclusie_locaties",
            equals: "Positief",
          },
          {
            label: "Gemiddelde geschiktheidsscore",
            type: "avg",
            property: "Score",
            decimals: 1,
          },
          { label: "Gebieden", type: "distinct", property: "Gebiednaam" },
        ],
      },
      {
        kind: "category-bar",
        title: "Zoekzones naar eerste conclusie in {city}",
        description:
          "Veld Eerste_conclusie_locaties: de voorlopige beoordeling van de geschiktheid",
        property: "Eerste_conclusie_locaties",
        valueLabels: {
          "Lange Termijn": "Kansrijk op lange termijn",
          "Middellange Termijn": "Kansrijk op middellange termijn",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een onderzochte locatie, geen bestaande voorziening. De **eerste conclusie** vat de beoordeling samen: van **positief** en kansrijk op korte of langere termijn, via **misschien**, tot **negatief**. Die conclusie volgt uit een samengestelde **score** op factoren als geluidbelasting, externe veiligheid, nabijheid van OV en de aard van het woongebied.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Zorg en huisvesting**: gemeenten hebben de opgave om voldoende beschermde woonplekken te realiseren; deze zoektocht maakt dat proces navolgbaar.\n- **Leefbaarheid**: een goede locatie balanceert de behoeften van bewoners van de voorziening met die van de omliggende buurt.\n- **Transparantie**: door de afwegingscriteria expliciet te maken, wordt zichtbaar waaróm een locatie wel of niet geschikt is bevonden.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De zoekzones komen uit de GIS-registratie van {city} (ArcGIS FeatureServer). Belangrijk: dit zijn **onderzochte kandidaat-locaties**, geen definitieve plannen of bestaande voorzieningen — een positieve conclusie betekent niet dat er ook daadwerkelijk gebouwd wordt. De scores zijn een hulpmiddel bij de afweging, geen eindoordeel.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Locaties_Beschermd_wonen_area/FeatureServer",
      },
      {
        label: "Rijksoverheid — beschermd wonen",
        url: "https://www.rijksoverheid.nl/onderwerpen/beschermd-wonen-en-maatschappelijke-opvang",
      },
    ],
  },
  {
    layerId: "rtd-stedin-stations",
    title: "Stedin-stations in {city}",
    subtitle: "Midden- en hoogspanningsstations van de netbeheerder",
    intro:
      "Deze laag toont **{count} elektriciteitsstations** van netbeheerder Stedin binnen het kaartgebied van {city}: de midden- en hoogspanningsstations die stroom van het hoogspanningsnet naar wijk- en straatniveau transformeren. Het is een fijnmazige laag; de kaart laadt een deel, dus de aantallen gaan over het gebied dat nu in beeld staat. Klik op een station voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stations in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde stationsgrootte",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 1,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een elektriciteitsstation van Stedin: meestal een compact **middenspanningsverdeelstation** (een kast of klein gebouwtje in de wijk), soms een groter **onderstation**. Samen vormen ze de knooppunten waar de spanning stapsgewijs wordt teruggebracht tot het niveau dat huizen en bedrijven gebruiken. De laag bevat vooral de ligging en omvang; inhoudelijke kenmerken per station zijn beperkt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Netcapaciteit**: de dichtheid en omvang van stations bepalen mede hoeveel extra vraag (warmtepompen, laadpalen) en aanbod (zon op dak) een wijk aankan.\n- **Energietransitie**: verzwaring van het net vraagt vaak om nieuwe of grotere stations; hun ligging is het vertrekpunt voor die planning.\n- **Ruimtebeslag**: stations claimen ruimte in de openbare ruimte; vroegtijdig meedenken voorkomt conflicten met andere functies.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De stations komen uit de GIS-registratie van {city} (ArcGIS FeatureServer), met Stedin als netbeheerder. Het is een groot bestand; de kaart laadt een deel, dus oppervlakte en gemiddelden gelden voor het gebied in beeld. Inhoudelijke velden (zoals spanningsniveau) zijn in deze open dataset niet betrouwbaar gevuld en daarom niet als grafiek opgenomen.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Stedin_midden_en_hoogspanningsstations/FeatureServer",
      },
      { label: "Stedin", url: "https://www.stedin.net/" },
    ],
  },
  {
    layerId: "rtd-gasvervanging-versnelling",
    title: "Versnelde gasvervanging in {city}",
    subtitle: "Gebieden waar Stedin gasleidingen versneld vervangt",
    intro:
      "Deze laag toont **{count} projectgebieden** waar netbeheerder Stedin de gasleidingen **versneld** vervangt, binnen het kaartgebied van {city}. Elk gebied heeft een projectcode, een discipline en een fasestatus. Het versnellingsprogramma richt zich op oude of risicovolle leidingen. Klik op een gebied voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Projectgebieden in beeld", type: "count" },
          {
            label: "Alleen gas",
            type: "count-where",
            property: "DISCIPLINE",
            equals: "Gas",
          },
          {
            label: "Gas én elektra",
            type: "count-where",
            property: "DISCIPLINE",
            equals: "Elektra en Gas",
          },
          { label: "Projectcodes (uniek)", type: "distinct", property: "PROJECTCOD" },
        ],
      },
      {
        kind: "category-bar",
        title: "Gasvervangingsprojecten naar discipline in {city}",
        description:
          "Veld DISCIPLINE: alleen gasleidingen of gecombineerd gas- en elektrawerk",
        property: "DISCIPLINE",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gebied waar Stedin gasleidingen versneld vervangt. Het veld **DISCIPLINE** onderscheidt projecten die **alleen gas** aanpakken (verreweg de meeste) van gecombineerd **gas- en elektrawerk**. Elk gebied hoort bij een project met een eigen code (*PROJECTCOD*) en een fasestatus die aangeeft hoe ver de uitvoering is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Veiligheid**: oude, kwetsbare gasleidingen vervangen verlaagt het risico op lekkages en storingen.\n- **Werk-met-werk**: versnelde vervanging is een natuurlijk koppelmoment voor straatvernieuwing, vergroening en de warmtetransitie.\n- **Planbaarheid**: het overzicht maakt duidelijk waar en wanneer opbrekingen te verwachten zijn, zodat bewoners en gemeente zich kunnen voorbereiden.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De gebieden komen uit de GIS-registratie van {city} (ArcGIS FeatureServer), met Stedin als netbeheerder. Let op: het versnellingsprogramma beslaat het hele Stedin-gebied, dus het bestand bevat ook projectgebieden in andere gemeenten binnen dezelfde regio. De kaartuitsnede van {city} bepaalt welke gebieden hier in beeld komen; de fasestatus is een momentopname van de projectadministratie.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — GIS open data",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Stedin_versnelling_gasvervanging/FeatureServer",
      },
      { label: "Stedin", url: "https://www.stedin.net/" },
    ],
  },
];
