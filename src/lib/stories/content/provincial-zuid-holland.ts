/**
 * Story maps — provinciale lagen Zuid-Holland (Geodata Zuid-Holland,
 * GeoServer WFS). Alleen zichtbaar in Zuid-Hollandse gemeenten.
 *
 * Lagen: zh-aardwarmteprojecten, zh-bedrijventerreinen-woz, zh-bodemkaart,
 * zh-bodemsanering-spoedlocaties, zh-bomen-provinciale-wegen,
 * zh-bushaltes-provinciale-wegen, zh-carpoolplaatsen,
 * zh-elektriciteitsstations, zh-fiets-verkeersongevallen, zh-fietstellingen,
 * zh-geluidcontouren-wegen, zh-grondwaterbescherming, zh-hectometrering,
 * zh-kunstwerken, zh-lichtmasten, zh-luchtkwaliteit-wegen,
 * zh-netcapaciteit-afname, zh-provinciale-wegen, zh-stiltegebieden.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "zh-aardwarmteprojecten",
    title: "Aardwarmteprojecten in en rond {city}",
    subtitle:
      "Geothermie-installaties die warmte uit de diepe ondergrond winnen",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} aardwarmteprojecten** uit de dataset van de provincie Zuid-Holland. Aardwarmte (geothermie) haalt warmte uit watervoerende lagen op typisch twee kilometer diepte en voedt daarmee warmtenetten, glastuinbouw en gebouwen. Elk punt is een project met een status, een winningsdiepte en een thermisch vermogen; klik erop voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Projecten in beeld", type: "count" },
          {
            label: "Gerealiseerd",
            type: "count-where",
            property: "Status",
            equals: "Gerealiseerd",
          },
          {
            label: "Gemiddelde winningsdiepte",
            type: "avg",
            property: "Diepte_m",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Totaal thermisch vermogen",
            type: "sum",
            property: "Vermogen_MWth",
            unit: "MWth",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Status van de aardwarmteprojecten in en rond {city}",
        description:
          "Veld Status: is het project al in bedrijf of nog in ontwikkeling?",
        property: "Status",
        maxCategories: 5,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is één geothermieproject. Het veld *Status* onderscheidt gerealiseerde (in bedrijf zijnde) installaties van projecten die nog in ontwikkeling zijn. Andere velden beschrijven de winning zelf: *Diepte_m* is de diepte waarop het warme water wordt opgepompt, *Temperatuur* de bron­temperatuur in graden Celsius, en *Vermogen_MWth* het thermisch vermogen in megawatt. Het jaar *InWerkingSinds* geeft aan sinds wanneer een gerealiseerd project levert.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Warmtetransitie**: aardwarmte is een van de weinige duurzame bronnen die grootschalig hoge-temperatuurwarmte kan leveren — cruciaal voor het aardgasvrij maken van glastuinbouw, warmtenetten en bestaande wijken.\n- **Ondergrondbeleid**: winning raakt de diepe ondergrond en grondwater; provincie en SodM stellen eisen aan boringen en monitoring.\n- **Ruimtelijke koppeling**: een project is pas nuttig met afnemers in de buurt; de ligging laat zien welke wijken of kassengebieden op een warmtebron kunnen aansluiten.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de energiedataset van Geodata Zuid-Holland. De statistieken gaan over de kaartuitsnede van {city}, die ook projecten van buurgemeenten kan bevatten. Het is een provinciaal overzicht en geen vergunningenregister — voor de juridische status van een winning is de omgevingsdienst of het SodM leidend.",
      },
    ],
    links: [
      {
        label: "Geodata Zuid-Holland",
        url: "https://geodata.zuid-holland.nl/",
      },
      {
        label: "Aardwarmte in Nederland (SodM)",
        url: "https://www.sodm.nl/onderwerpen/aardwarmte",
      },
    ],
  },
  {
    layerId: "zh-bedrijventerreinen-woz",
    title: "Bedrijventerreinen in en rond {city}",
    subtitle:
      "Bedrijventerreinen met hun WOZ-waarde, uit de economie-dataset van Zuid-Holland",
    intro:
      "Deze laag toont **{count} bedrijventerreinen** binnen het kaartgebied van {city}, zoals de provincie Zuid-Holland ze registreert. Elk vlak is een (deel van een) terrein met een naam, de gemeente waarin het ligt en gegevens over de vastgoedvoorraad en de bijbehorende WOZ-waarde. Zo zie je waar de werklocaties van de regio liggen en hoe ze onderling verschillen in omvang.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Terreinen in beeld", type: "count" },
          { label: "Gemeenten", type: "distinct", property: "Gemeentenaam" },
          {
            label: "Totale vastgoedvoorraad",
            type: "sum",
            property: "Totale_voorraad",
            decimals: 0,
          },
          {
            label: "Gemiddelde voorraad per terrein",
            type: "avg",
            property: "Totale_voorraad",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bedrijventerreinen per gemeente in en rond {city}",
        description: "Veld Gemeentenaam: waar liggen de terreinen in de uitsnede?",
        property: "Gemeentenaam",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een bedrijventerrein of een deel daarvan (*Onderverdeling*), met een eigen code en naam. *Totale_voorraad* telt het aantal objecten (vastgoedeenheden) op het terrein; de bijbehorende WOZ-velden geven de totale en gemiddelde Waarde Onroerende Zaken. Let op: de WOZ-bedragen zijn niet voor elk terrein ingevuld — waar ze ontbreken, worden ze automatisch uit de statistieken weggelaten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Economisch beleid**: bedrijventerreinen huisvesten een groot deel van de werkgelegenheid; provincie en gemeenten sturen op zorgvuldig ruimtegebruik, herstructurering en verduurzaming van bestaande terreinen (het principe 'eerst bestaand, dan nieuw').\n- **Vastgoedwaarde**: de WOZ-waarde is een indicator voor de economische intensiteit en de investeringsbereidheid op een terrein.\n- **Ruimtelijke afweging**: nieuwe uitgifte van bedrijventerrein wordt provinciaal getoetst; dit overzicht laat de bestaande voorraad zien.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de economie-dataset van Geodata Zuid-Holland (peiljaar 2022). De cijfers gaan over de kaartuitsnede van {city}, inclusief terreinen van buurgemeenten. Het veld *Gemeentenaam* laat per terrein zien onder welke gemeente het valt.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Bedrijventerreinen — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/economie/bedrijventerreinen/",
      },
    ],
  },
  {
    layerId: "zh-bodemkaart",
    title: "Bodemkaart in en rond {city}",
    subtitle:
      "Bodemtypen van Zuid-Holland (uitgave 2021): van zeeklei tot veen",
    intro:
      "Deze laag kleurt **{count} bodemvlakken** binnen het kaartgebied van {city} naar bodemtype, volgens de Bodemkaart van Zuid-Holland (2021). Elk vlak heeft een bodemcode met een uitgebreide omschrijving en een indeling in hoofdgroepen — van zeekleigronden en veengronden tot bebouwing en water. Zo zie je in één beeld waar de ondergrond van klei, veen of zand is opgebouwd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          { label: "Bodemtypen (hoofdgroep)", type: "distinct", property: "groep1" },
          {
            label: "Aandeel zeekleigronden",
            type: "count-where",
            property: "groep1",
            equals: "Zeekleigronden",
            asShare: true,
          },
          {
            label: "Aandeel veengronden",
            type: "count-where",
            property: "groep1",
            equals: "Veengronden",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemtypen in en rond {city}",
        description: "Veld groep1: de hoofdgroep waartoe het bodemvlak behoort",
        property: "groep1",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De Bodemkaart deelt de bovengrond in naar ontstaanswijze en samenstelling. Het veld *groep1* geeft de hoofdgroep (bijvoorbeeld *Zeekleigronden*, *Veengronden*, *Moerige gronden*), terwijl *letter1_oms* de fijnere bodemklasse omschrijft (zoals 'Kalkrijke poldervaaggronden' of 'Koopveengronden'). In West-Nederland domineren klei- en veengronden — precies de bodems die gevoelig zijn voor daling en zetting.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bodemdaling**: veen- en moerige gronden klinken in en oxideren bij ontwatering; ze zijn bepalend voor onderhoudslasten aan wegen, riolering en funderingen én voor CO₂-uitstoot uit de bodem.\n- **Bouwen en funderen**: het bodemtype bepaalt draagkracht en zettingsgevoeligheid en dus de fundering die nodig is.\n- **Water en natuur**: bodemtype stuurt waterberging, drooglegging en welke natuur- en landbouwvormen passen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De Bodemkaart van Zuid-Holland (2021) is een generalisatie op basis van veldopnames; ze beschrijft de bovenste bodemlagen op kaartschaal en niet de situatie op elk perceel. De statistieken gaan over de kaartuitsnede van {city}, inclusief vlakken die de gemeentegrens kruisen. Voor een concrete bouwlocatie blijft aanvullend bodemonderzoek nodig.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Bodem — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/landschap/bodem/",
      },
    ],
  },
  {
    layerId: "zh-bodemsanering-spoedlocaties",
    title: "Spoedlocaties bodemsanering in en rond {city}",
    subtitle:
      "Ernstig verontreinigde locaties met een spoedeisend risico",
    intro:
      "Binnen het kaartgebied van {city} registreert de provincie **{count} spoedlocaties bodemsanering**: plekken waar de bodemverontreiniging zó ernstig is dat er een onaanvaardbaar risico kan bestaan voor mens, verspreiding of ecologie. Per locatie is vastgelegd of het risico onderzocht is, of er een beschikking ligt en of de sanering al is gestart of afgerond. Klik op een punt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Spoedlocaties in beeld", type: "count" },
          {
            label: "Sanering gestart",
            type: "count-where",
            property: "Sanering_gestart",
            equals: "Ja",
          },
          {
            label: "Sanering gereed",
            type: "count-where",
            property: "Sanering_gereed",
            equals: "Ja",
          },
          {
            label: "Betrokken gemeenten",
            type: "distinct",
            property: "Gemeente",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Uitvoerende omgevingsdienst in en rond {city}",
        description:
          "Veld Omgevingsdienst: welke dienst voert de aanpak van de locatie uit",
        property: "Omgevingsdienst",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een locatie die als *spoedlocatie* is aangemerkt. De aanleiding staat in aparte velden: *Risico_humaan* (gevaar voor mensen), *Risico_verspreiding* (verontreiniging die zich verplaatst, bijvoorbeeld via grondwater) en *Risico_ecologie* (schade aan natuur). De velden *Onderzocht*, *Beschikt*, *Sanering_gestart* en *Sanering_gereed* laten zien hoe ver de aanpak is gevorderd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid en veiligheid**: spoedlocaties zijn de urgentste gevallen in het bodembeleid; het wegnemen of beheersen van het risico heeft prioriteit.\n- **Ruimtelijke ontwikkeling**: een verontreinigde bodem beperkt wat je op een locatie mag bouwen of hoe je hem mag gebruiken; sanering is vaak voorwaarde voor herontwikkeling.\n- **Grondwater**: verspreidingsrisico's raken drinkwater- en grondwaterlichamen; de laag koppelt locaties aan het betrokken grondwaterlichaam.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de bodemdataset van Geodata Zuid-Holland; de uitvoering ligt bij de regionale omgevingsdiensten (zoals DCMR en ODH). De aantallen gaan over de kaartuitsnede van {city} en kunnen locaties van buurgemeenten bevatten. Het is een beleidsregistratie op hoofdlijnen; voor de actuele saneringsstatus van een specifieke locatie is de omgevingsdienst leidend.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Bodemsanering — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/landschap/bodem/bodemsanering/",
      },
    ],
  },
  {
    layerId: "zh-bomen-provinciale-wegen",
    title: "Bomen langs provinciale wegen in en rond {city}",
    subtitle:
      "Bomen in beheer van de provincie langs provinciale wegen en vaarwegen",
    intro:
      "Deze laag toont **{count} bomen** binnen het kaartgebied van {city} die de provincie Zuid-Holland zelf beheert langs haar wegen en vaarwegen. Elke stip is één boom, met soort, hoogteklasse, aanlegjaar en beheergegevens. Samen vormen ze het laanbomenbestand dat de provincie onderhoudt — los van de bomen die bij gemeenten in beheer zijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          { label: "Boomsoorten", type: "distinct", property: "Boomsortiment" },
          {
            label: "Wegtrajecten",
            type: "distinct",
            property: "Traject",
          },
          {
            label: "Bomen in gras (aandeel)",
            type: "count-where",
            property: "beheergroep",
            equals: "Bomen in gras",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten in en rond {city}",
        description:
          "Veld Boomsortiment: de botanische soort van de boom",
        property: "Boomsortiment",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Hoogteklassen van de bomen",
        description: "Veld Hoogte: de gemeten hoogteklasse van de boom",
        property: "Hoogte",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een individuele boom uit het beheerbestand. Het veld *Boomsortiment* geeft de botanische soort (bijvoorbeeld *Populus x canadensis* of *Fraxinus excelsior*), *Hoogte* een hoogteklasse en *beheergroep* de context waarin de boom staat (bomen in gras, in beplanting, in bos). Populieren en essen — klassieke Hollandse laan- en polderbomen — domineren doorgaans het bestand.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Groenbeheer en veiligheid**: laanbomen langs provinciale wegen vragen periodieke controle (VTA-inspectie) op takbreuk en stabiliteit; een soort- en leeftijdsopbouw helpt bij onderhoudsplanning.\n- **Biodiversiteit en klimaat**: wegbeplanting levert schaduw, koelte en een ecologische verbindingsroute door het open landschap.\n- **Soortdiversiteit**: een bestand dat op één soort leunt (zoals populier of es) is kwetsbaar voor ziekten zoals essentaksterfte; de soortverdeling laat die kwetsbaarheid zien.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en betreft uitsluitend bomen in provinciaal beheer (*BEHEERDER = Provincie Zuid-Holland*). Bomen langs gemeentelijke straten of rijkswegen zitten er niet in. De aantallen gaan over de kaartuitsnede van {city}; de provinciale wegen in beeld bepalen dus welke bomen meetellen.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Provinciale wegen — Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/verkeer-vervoer/wegen/",
      },
    ],
  },
  {
    layerId: "zh-bushaltes-provinciale-wegen",
    title: "Bushaltes langs provinciale wegen in en rond {city}",
    subtitle:
      "Haltes langs de provinciale wegen, met hun voorzieningen",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} bushaltes** langs de provinciale wegen van Zuid-Holland. Anders dan de landelijke OV-haltekaart toont deze laag alleen de haltes waar de provincie als wegbeheerder verantwoordelijk is, mét gegevens over de voorzieningen: is er een abri (wachthuisje), een prullenbak of een fietsenstalling? Klik op een halte voor naam en richting.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bushaltes in beeld", type: "count" },
          {
            label: "Met abri",
            type: "count-where",
            property: "Abri",
            equals: "ja",
          },
          {
            label: "Met fietsenstalling",
            type: "count-where",
            property: "Fietsen",
            equals: "ja",
          },
          {
            label: "Met prullenbak",
            type: "count-where",
            property: "Prullen",
            equals: "ja",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Wachthuisje (abri) bij de haltes in en rond {city}",
        description: "Veld Abri: is er een overdekt wachthuisje aanwezig?",
        property: "Abri",
        valueLabels: {
          ja: "Abri aanwezig",
          nee: "Geen abri",
          "-": "Onbekend / niet geregistreerd",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een bushalte langs een provinciale weg, met een *Haltenaam* en *Richting*. De voorzieningenvelden zijn eenvoudige ja/nee-vlaggen: *Abri* (wachthuisje), *Prullen* (prullenbak) en *Fietsen* (fietsenstalling). Een streepje ('-') betekent dat de voorziening niet is geregistreerd, niet per se dat hij ontbreekt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Reizigerscomfort**: een abri en een fietsenstalling maken het verschil tussen een kale paal en een volwaardige overstaphalte; de voorzieningen zijn een directe maat voor haltekwaliteit.\n- **Toegankelijk en ketengericht OV**: fietsenstallingen bij haltes ondersteunen het fiets-bus-natransport, juist in het buitengebied waar haltes ver uit elkaar liggen.\n- **Beheer**: als wegbeheerder is de provincie verantwoordelijk voor deze halte-inrichting; het overzicht helpt bij onderhouds- en verbeterprogramma's.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en bevat alleen haltes langs provinciale wegen — bushaltes op gemeentelijke wegen ontbreken. De aantallen gaan over de kaartuitsnede van {city}. Voor de actuele dienstregeling en het volledige haltenetwerk is de landelijke OV-haltekaart de bredere bron.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Openbaar vervoer — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/verkeer-vervoer/openbaar-vervoer/",
      },
    ],
  },
  {
    layerId: "zh-carpoolplaatsen",
    title: "Parkeer- en carpoolplaatsen in en rond {city}",
    subtitle:
      "Parkeerterreinen en carpoolplaatsen langs de provinciale wegen",
    intro:
      "Deze laag toont **{count} parkeer- en carpoolplaatsen** langs de provinciale wegen binnen het kaartgebied van {city}. Het gaat om de voorzieningen die de provincie Zuid-Holland als wegbeheerder aanlegt: carpoolterreinen bij op- en afritten en parkeergelegenheid langs de weg. Elk vlak is zo'n voorziening, met een aanduiding van het objecttype en het wegtraject.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Voorzieningen in beeld", type: "count" },
          {
            label: "Objecttypen",
            type: "distinct",
            property: "Objecttype",
          },
          { label: "Wegtrajecten", type: "distinct", property: "Traject" },
        ],
      },
      {
        kind: "category-bar",
        title: "Type voorziening in en rond {city}",
        description:
          "Veld Objecttype: gaat het om een parkeerterrein of een carpoolplaats?",
        property: "Objecttype",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een parkeer- of carpoolvoorziening langs een provinciale weg. Het veld *Objecttype* onderscheidt de soort voorziening (bijvoorbeeld parkeerterrein of carpoolplaats) en *Traject* geeft het bijbehorende wegvak. Carpoolplaatsen liggen strategisch bij aansluitingen zodat automobilisten er kunnen samenrijden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Duurzame mobiliteit**: carpoolplaatsen ondersteunen samen reizen en overstappen op OV of fiets, en verlagen zo het aantal solo-autoritten op drukke corridors.\n- **Knooppunten**: deze plekken zijn potentiële mini-hubs voor deelmobiliteit, laadpalen of P+R-uitbreiding.\n- **Beheer**: als eigenaar en beheerder houdt de provincie deze terreinen in stand; het overzicht is het vertrekpunt voor onderhoud en herinrichting.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en betreft uitsluitend voorzieningen langs provinciale wegen. Parkeerterreinen in gemeentelijk beheer of bij stations zitten er niet in. De aantallen gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Verkeer en vervoer — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/verkeer-vervoer/",
      },
    ],
  },
  {
    layerId: "zh-elektriciteitsstations",
    title: "Elektriciteitsstations in en rond {city}",
    subtitle:
      "Onderstations en hoogspanningsstations van TenneT en de regionale netbeheerders (2024)",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} elektriciteitsstations** uit de inventarisatie van TenneT en de regionale netbeheerders in Zuid-Holland (2024). Dit zijn de knooppunten van het stroomnet: hoogspanningsstations waar het landelijke net op het regionale net wordt gekoppeld, en onderstations die de spanning verder omlaag transformeren richting wijken en bedrijven. Klik op een station voor beheerder en type.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stations in beeld", type: "count" },
          {
            label: "Netbeheerders",
            type: "distinct",
            property: "station_beheerder",
          },
          {
            label: "Hoogspanningsstations",
            type: "count-where",
            property: "type_station",
            equals: "Hoogspanningsstation",
          },
          {
            label: "Onderstations",
            type: "count-where",
            property: "type_station",
            equals: "Onderstation",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Stations per netbeheerder in en rond {city}",
        description:
          "Veld station_beheerder: wie beheert het station (TenneT of een regionale netbeheerder)?",
        property: "station_beheerder",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Type station",
        description:
          "Veld type_station: de functie van het station in het netwerk",
        property: "type_station",
        maxCategories: 5,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een elektriciteitsstation. Het veld *type_station* onderscheidt *hoogspanningsstations* (de zware koppelpunten tussen landelijk en regionaal net) van *onderstations* die de spanning verder verlagen. *station_beheerder* geeft de eigenaar: TenneT beheert het landelijke hoogspanningsnet, regionale netbeheerders zoals Stedin, Liander en Westland Infra het net daaronder.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Netcongestie**: het aantal en de capaciteit van stations bepaalt hoeveel extra vraag (warmtepompen, laadpalen, bedrijven) en opwek (zon, wind) een gebied aankan. Waar stations vol zitten, ontstaat een wachtrij voor nieuwe aansluitingen.\n- **Ruimtelijke reservering**: nieuwe of uit te breiden stations vragen fors ruimte; ze op tijd inpassen in ruimtelijke plannen is een sleutel voor de energietransitie.\n- **Samenhang**: combineer deze laag met de capaciteitskaart om te zien waar het net krap is en waar uitbreiding nodig is.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de energiedataset van Geodata Zuid-Holland (2024). Veel detailvelden staan op 'Niet onderzocht' — de inventarisatie richt zich vooral op locatie, beheerder en type. De aantallen gaan over de kaartuitsnede van {city} en kunnen stations van buurgemeenten bevatten.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Energie — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/energie/",
      },
    ],
  },
  {
    layerId: "zh-fiets-verkeersongevallen",
    title: "Fietsongevallen in en rond {city}",
    subtitle:
      "Geregistreerde verkeersongevallen met fietsers en (brom)fietsers (NDW, 2024)",
    intro:
      "Deze laag toont **{count} verkeersongevallen** met fietsers en gemotoriseerde tweewielers binnen het kaartgebied van {city}, uit de landelijke ongevallenregistratie (NDW/BRON, jaar 2024). Elk punt is een geregistreerd ongeval, met de ernst (van uitsluitend materiële schade tot dodelijk) en het type tweewieler dat erbij betrokken was. Zo worden risicoplekken voor fietsers zichtbaar.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Ongevallen in beeld", type: "count" },
          {
            label: "Met letsel",
            type: "count-where",
            property: "Ongeval_ty",
            equals: "Letsel",
          },
          {
            label: "Dodelijk",
            type: "count-where",
            property: "Ongeval_ty",
            equals: "Dodelijk",
          },
          {
            label: "Fiets betrokken (aandeel)",
            type: "count-where",
            property: "OTE_ID",
            equals: "Fiets",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Ernst van de ongevallen in en rond {city}",
        description:
          "Veld Ongeval_ty: de afloop van het ongeval",
        property: "Ongeval_ty",
        maxCategories: 4,
      },
      {
        kind: "category-bar",
        title: "Type tweewieler bij het ongeval",
        description:
          "Veld OTE_ID: het bij het ongeval betrokken tweewielertype",
        property: "OTE_ID",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een ongeval uit de politie- en NDW-registratie waarbij een fiets, e-bike, snorfiets of bromfiets betrokken was. Het veld *Ongeval_ty* geeft de ernst: *Uitsluitend materiele schade*, *Letsel* of *Dodelijk*. Het veld *OTE_ID* geeft het tweewielertype. De opkomst van de e-bike en snorfiets is een belangrijke factor achter de fietsveiligheidscijfers van de laatste jaren.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: fietsers zijn oververtegenwoordigd in de ongevalscijfers; clusters van ongevallen wijzen op onveilige kruisingen of oversteken die aanpak verdienen.\n- **Risicogestuurd beleid**: het landelijke Strategisch Plan Verkeersveiligheid stuurt op het proactief aanpakken van risicolocaties in plaats van wachten op slachtoffers.\n- **Infrastructuur**: de spreiding helpt bij het prioriteren van vrijliggende fietspaden, veilige oversteken en snelheidsremmende maatregelen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en is gebaseerd op de landelijke ongevallenregistratie (NDW/BRON) voor 2024. Let op: niet elk ongeval wordt geregistreerd — met name lichte fietsongevallen zijn ondervertegenwoordigd, en de registratiegraad verschilt per jaar en regio. De cijfers gaan over de kaartuitsnede van {city}; het veld *Gemeente* laat per ongeval de gemeente zien.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Verkeersveiligheid — NDW",
        url: "https://www.ndw.nu/",
      },
    ],
  },
  {
    layerId: "zh-fietstellingen",
    title: "Fietstellingen in en rond {city}",
    subtitle:
      "Permanente fietstelpunten met jaargemiddelden (2024)",
    intro:
      "Deze laag toont **{count} fietstelpunten** binnen het kaartgebied van {city}, uit het meetnet van de provincie Zuid-Holland (jaargemiddelden 2024). Elk punt is een permanente teller die dag in dag uit passerende fietsers registreert. Het jaargemiddelde geeft het gemiddelde aantal fietsers per etmaal — een harde meting van hoe druk een fietsroute is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Telpunten in beeld", type: "count" },
          {
            label: "Gemiddeld aantal fietsers/etmaal",
            type: "avg",
            property: "etmaal_som",
            decimals: 0,
          },
          {
            label: "Drukste telpunt (etmaal)",
            type: "max",
            property: "etmaal_som",
            decimals: 0,
          },
          {
            label: "Mediane etmaalintensiteit",
            type: "median",
            property: "etmaal_som",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van etmaalintensiteiten in en rond {city}",
        description:
          "Aantal telpunten per klasse van gemiddeld aantal fietsers per etmaal (veld etmaal_som)",
        property: "etmaal_som",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een permanente fietsteller (*loc_type = PERMANENT*). Het veld *etmaal_som* is het jaargemiddelde van het totaal aantal fietsers per etmaal, in beide richtingen samen; *etmaal_to* en *etmaal_from* splitsen dat naar rijrichting. Omdat het permanente tellers zijn, is het cijfer een betrouwbaar jaargemiddelde en geen momentopname.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fietsbeleid**: harde tellingen laten zien welke routes echt druk zijn en waar investeringen in bredere paden, voorrang of doorfietsroutes het meeste rendement hebben.\n- **Effectmeting**: door dezelfde punten over de jaren te vergelijken, kun je het effect van nieuwe infrastructuur of maatregelen aantonen.\n- **Netwerkkeuzes**: de intensiteiten helpen bij het bepalen van de hoofdfietsstructuur en het prioriteren van onderhoud.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en bevat de provinciale fietstelpunten met jaargemiddelden over 2024. Het is een steekproef van vaste meetlocaties, geen dekkend beeld van elke fietsroute. De cijfers gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Fiets — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/verkeer-vervoer/fiets/",
      },
    ],
  },
  {
    layerId: "zh-geluidcontouren-wegen",
    title: "Geluidcontouren van provinciale wegen in en rond {city}",
    subtitle:
      "Geluidsbelasting (etmaalwaarde) langs de provinciale wegen, contouren 2022",
    intro:
      "Deze laag toont **{count} geluidscontouren** langs de provinciale wegen binnen het kaartgebied van {city} (berekening 2022). Elke zone is een band met een bepaalde geluidsbelasting in decibel, van het wegverkeer op de provinciale wegen. Hoe dichter bij de weg, hoe hoger de belasting; de contouren maken zichtbaar hoe ver het verkeerslawaai de omgeving in reikt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Contourvlakken in beeld", type: "count" },
          {
            label: "Geluidklassen (dB)",
            type: "distinct",
            property: "LOW_VAL",
          },
          {
            label: "Zwaarst belast (≥70 dB)",
            type: "count-where",
            property: "LOW_VAL",
            equals: ["70", "75"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Geluidsbelastingklassen in en rond {city}",
        description:
          "Veld LOW_VAL: de ondergrens van de contourband in decibel (etmaalwaarde)",
        property: "LOW_VAL",
        valueLabels: {
          "55": "55–60 dB",
          "60": "60–65 dB",
          "65": "65–70 dB",
          "70": "70–75 dB",
          "75": "≥ 75 dB",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke zone is een contourband met een ondergrens (*LOW_VAL*) en bovengrens (*HIGH_VAL*) in decibel. Zo omsluit de band '55–60 dB' het gebied waar de etmaal-geluidsbelasting tussen 55 en 60 dB ligt. De banden liggen als schillen om de weg: de hoogste waarden zitten pal langs de rijbaan, de lichtste banden reiken het verst het achterland in.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: langdurige blootstelling aan verkeerslawaai geeft slaapverstoring en gezondheidsrisico's; de contouren laten zien welke woningen in de zwaarst belaste zones liggen.\n- **Ruimtelijke ordening en de Omgevingswet**: bij bouwen langs een provinciale weg gelden geluidsnormen; de contouren zijn de basis voor toetsing en voor het bepalen of geluidwerende maatregelen nodig zijn.\n- **Maatregelen**: stil asfalt, schermen of een lagere snelheid verschuiven de contouren; ze zijn dus ook een instrument om effect te meten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de milieudataset van Geodata Zuid-Holland en betreft berekende contouren voor 2022, uitsluitend voor de **provinciale** wegen. Geluid van rijkswegen, spoor, gemeentelijke wegen of industrie zit er niet in; de werkelijke geluidsbelasting op een plek kan door die andere bronnen hoger liggen. De cijfers gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Geluid — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/milieu/geluid/",
      },
    ],
  },
  {
    layerId: "zh-grondwaterbescherming",
    title: "Grondwaterbeschermingsgebieden in en rond {city}",
    subtitle:
      "Beschermingszones rond drinkwaterwinningen",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} grondwaterbeschermingsgebieden** uit de waterdataset van de provincie Zuid-Holland. Dit zijn de zones rond drinkwaterwinningen waar extra regels gelden om het grondwater — de bron van ons drinkwater — schoon te houden. Elk vlak hoort bij een winning van een drinkwaterbedrijf en heeft een beschermingscategorie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Beschermingsgebieden in beeld", type: "count" },
          {
            label: "Drinkwaterbedrijven",
            type: "distinct",
            property: "Drinkwaterbedrijf",
          },
          {
            label: "Zonetypen",
            type: "distinct",
            property: "Legenda",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Type beschermingszone in en rond {city}",
        description:
          "Veld Legenda: het type zone (bijvoorbeeld boringsvrije zone of waterwingebied)",
        property: "Legenda",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een beschermingszone rond een drinkwaterwinning. Het veld *Legenda* geeft het type zone — een *boringsvrije zone* beschermt bijvoorbeeld een afsluitende kleilaag tegen doorboring, terwijl een waterwin- of grondwaterbeschermingsgebied de directe omgeving van de put beschermt. *Drinkwaterbedrijf* geeft de winning waartoe de zone hoort (zoals Oasen of Dunea).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Drinkwaterveiligheid**: binnen deze zones gelden strengere regels voor bodemenergie, boringen, opslag en risicovolle activiteiten om verontreiniging van de winning te voorkomen.\n- **Ruimtelijke plannen**: een beschermingsgebied beperkt wat er mag; het is een harde randvoorwaarde bij bouwen, aanleg van warmte-koudeopslag en bodemsanering.\n- **Lange termijn**: grondwater herstelt traag — bescherming nu voorkomt onomkeerbare vervuiling van een strategische drinkwaterbron.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de waterdataset van Geodata Zuid-Holland; de zones zijn vastgelegd in de provinciale omgevingsverordening. De aantallen gaan over de kaartuitsnede van {city} en kunnen zones van buurgemeenten bevatten. Voor de exacte regels per zone is de omgevingsverordening leidend.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Grondwater en drinkwater — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/landschap/water/",
      },
    ],
  },
  {
    layerId: "zh-hectometrering",
    title: "Hectometrering van provinciale wegen in en rond {city}",
    subtitle:
      "Hectometerpunten langs de provinciale wegen en vaarwegen",
    intro:
      "Deze laag toont **{count} hectometerpunten** langs de provinciale wegen en vaarwegen binnen het kaartgebied van {city}. Het zijn de referentiepunten die om de honderd meter de plaats langs een weg of vaarweg markeren — de basis waarop de provincie de ligging van objecten, meldingen en incidenten vastlegt. Elk punt heeft een traject en een positieaanduiding.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Hectometerpunten in beeld", type: "count" },
          { label: "Trajecten", type: "distinct", property: "Traject" },
          {
            label: "Langs wegen",
            type: "count-where",
            property: "Type",
            equals: "Hecto wegen",
          },
          {
            label: "Langs vaarwegen",
            type: "count-where",
            property: "Type",
            equals: "Hecto vaarwegen",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Type hectometrering in en rond {city}",
        description:
          "Veld Type: langs welk soort infrastructuur ligt het punt?",
        property: "Type",
        valueLabels: {
          "Hecto wegen": "Provinciale weg",
          "Hecto vaarwegen": "Vaarweg",
          "Hecto fietspad": "Fietspad",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een hectometerreferentie langs een provinciaal wegvak of vaarweg. Het veld *Traject* geeft de weg (bijvoorbeeld *N470B*), *Tekst* de kilometrering en zijde (bijvoorbeeld '11.4 Li' voor kilometer 11,4 links). Het veld *Type* onderscheidt hectometrering langs wegen, vaarwegen en fietspaden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en meldingen**: de hectometrering is het adressysteem van de weg. Storingen, incidenten en onderhoud worden op deze punten gelokaliseerd, zodat iedereen dezelfde plek bedoelt.\n- **Data-koppeling**: veel andere wegdata (ongevallen, kunstwerken, verlichting) verwijst naar de kilometrering; deze punten zijn de gemeenschappelijke ruggengraat.\n- **Hulpdiensten**: bij een melding langs een provinciale weg helpt de hectometeraanduiding om snel de juiste locatie te vinden.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en betreft uitsluitend de provinciale wegen en vaarwegen. Rijkswegen (met hun eigen hectometrering) en gemeentelijke wegen zitten er niet in. De aantallen gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Verkeer en vervoer — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/verkeer-vervoer/",
      },
    ],
  },
  {
    layerId: "zh-kunstwerken",
    title: "Kunstwerken van provinciale wegen in en rond {city}",
    subtitle:
      "Bruggen, tunnels, viaducten, duikers en sluizen in provinciaal beheer",
    intro:
      "Binnen het kaartgebied van {city} beheert de provincie Zuid-Holland **{count} civiele kunstwerken**: bruggen, viaducten, tunnels, duikers en sluizen langs haar wegen en vaarwegen. In de civiele techniek is een 'kunstwerk' elk gebouwd object dat een obstakel overbrugt of doorkruist. Elk punt heeft een soort, een naam en een aanlegjaar. Klik erop voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kunstwerken in beeld", type: "count" },
          { label: "Soorten", type: "distinct", property: "Soort" },
          {
            label: "Bruggen (vast + beweegbaar)",
            type: "count-where",
            property: "Soort",
            equals: ["Vaste brug", "Beweegbare brug"],
          },
          {
            label: "Tunnels & viaducten",
            type: "count-where",
            property: "Soort",
            equals: ["Tunnel", "Viaduct"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Soort kunstwerk in en rond {city}",
        description: "Veld Soort: het type civiele kunstwerk",
        property: "Soort",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een kunstwerk in provinciaal beheer. Het veld *Soort* geeft het type: een *duiker* laat water onder de weg door, een *vaste* of *beweegbare brug* overspant water, een *viaduct* een andere weg, en een *tunnel* voert de weg eronderdoor. *Naam*, *Aanlegjaar* en *Beheerder* geven de context; het veld *Mandaat_RDW* bevat informatie over de toegestane belasting.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Instandhouding**: bruggen en viaducten uit de jaren '60–'70 naderen het einde van hun technische levensduur; het landelijke vervangings- en renovatieopgave (VenR) speelt ook op provinciaal niveau.\n- **Bereikbaarheid**: kunstwerken zijn schakels die bij onderhoud of storing hele routes kunnen blokkeren; hun spreiding is relevant voor omleidings- en calamiteitenplannen.\n- **Vaarwegen**: beweegbare bruggen en sluizen koppelen weg- en waterverkeer; hun bediening beïnvloedt zowel de doorstroming op de weg als op het water.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en betreft kunstwerken langs provinciale wegen en vaarwegen. Het veld *Aanlegjaar* kan een plaatshouderwaarde bevatten waar het bouwjaar niet bekend is. De aantallen gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Wegen en kunstwerken — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/verkeer-vervoer/wegen/",
      },
    ],
  },
  {
    layerId: "zh-lichtmasten",
    title: "Lichtmasten langs provinciale wegen in en rond {city}",
    subtitle:
      "Openbare verlichting in beheer van de provincie",
    intro:
      "Deze laag toont **{count} lichtmasten** langs de provinciale wegen binnen het kaartgebied van {city}. Elke stip is een mast van de openbare verlichting die de provincie Zuid-Holland beheert, met gegevens over masttype, materiaal, lamptype en armatuur. Samen vormen ze het verlichtingsareaal langs de provinciale wegen — een van de grootste energieverbruikers in het wegbeheer.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Lichtmasten in beeld", type: "count" },
          {
            label: "Led-verlichting (aandeel)",
            type: "count-where",
            property: "Lamptype",
            equals: "LED",
            asShare: true,
          },
          {
            label: "Masttypen",
            type: "distinct",
            property: "Masttype",
          },
          {
            label: "Wegtrajecten",
            type: "distinct",
            property: "Traject",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Mastmateriaal in en rond {city}",
        description: "Veld Materiaal: waarvan is de lichtmast gemaakt?",
        property: "Materiaal",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende lamptypen",
        description:
          "Veld Lamptype: de toegepaste lichtbron (led vervangt in rap tempo de oude gasontladingslampen)",
        property: "Lamptype",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een lichtmast. Het veld *Lamptype* geeft de lichtbron: het moderne *LED* naast oudere types als *SON-T* (hogedruknatrium), *SOX* (laagdruknatrium) en *CPO*. *Materiaal* geeft de mastconstructie (meestal aluminium of staal) en *Masttype* de vorm. Het aandeel led is een directe maat voor hoe ver de verlichting al verduurzaamd is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energie en klimaat**: openbare verlichting is een forse energiepost; de overgang naar led en slimme (dimbare) verlichting bespaart fors op stroomverbruik en CO₂.\n- **Verkeersveiligheid en donkerte**: verlichting draagt bij aan veiligheid, maar te veel licht verstoort natuur en nachtrust; de provincie zoekt de balans, ook richting stiltegebieden en donkere zones.\n- **Beheer**: type, materiaal en leeftijd sturen de vervangings- en onderhoudsplanning van het verlichtingsareaal.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en betreft uitsluitend masten langs provinciale wegen. Verlichting in gemeentelijk beheer of langs rijkswegen zit er niet in. De aantallen gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Wegen — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/verkeer-vervoer/wegen/",
      },
    ],
  },
  {
    layerId: "zh-luchtkwaliteit-wegen",
    title: "Luchtkwaliteit langs wegen in en rond {city}",
    subtitle:
      "Berekende concentraties NO₂ en fijnstof langs wegen (rekenjaar 2024)",
    intro:
      "Deze laag toont **{count} rekenpunten** langs wegen binnen het kaartgebied van {city}, uit de landelijke luchtkwaliteitsmonitoring (CIMLK, rekenjaar 2024). Op elk punt is de concentratie stikstofdioxide (NO₂) en fijnstof (PM10 en PM2.5) berekend. Zo wordt zichtbaar waar de luchtkwaliteit langs drukke wegen onder druk staat en hoe dat zich verhoudt tot de wettelijke grenswaarden.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Rekenpunten in beeld", type: "count" },
          {
            label: "Gemiddelde NO₂-concentratie",
            type: "avg",
            property: "no2Conc",
            unit: "µg/m³",
            decimals: 1,
          },
          {
            label: "Hoogste NO₂-concentratie",
            type: "max",
            property: "no2Conc",
            unit: "µg/m³",
            decimals: 1,
          },
          {
            label: "Gemiddelde PM10-concentratie",
            type: "avg",
            property: "pm10Conc",
            unit: "µg/m³",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van NO₂-concentraties in en rond {city}",
        description:
          "Aantal rekenpunten per NO₂-klasse (veld no2Conc); de wettelijke jaargrenswaarde is 40 µg/m³",
        property: "no2Conc",
        unit: "µg/m³",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een rekenpunt langs een weg met berekende jaargemiddelde concentraties: *no2Conc* (stikstofdioxide, sterk verkeersgebonden), *pm10Conc* en *pm25Conc* (fijnstof). De wettelijke jaargrenswaarde voor NO₂ en PM10 ligt op 40 µg/m³; de strengere WHO-advieswaarden liggen daar ruim onder. Rond drukke stedelijke wegen liggen de waarden doorgaans hoger dan in het buitengebied.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: langdurige blootstelling aan NO₂ en fijnstof geeft luchtweg- en hart- en vaatklachten; luchtkwaliteit is een van de grootste milieugerelateerde gezondheidsrisico's.\n- **Schone Lucht Akkoord**: Rijk, provincies en gemeenten werken toe naar de WHO-advieswaarden; deze rekenpunten zijn de meetlat voor de voortgang.\n- **Beleidskeuzes**: milieuzones, snelheidsverlaging en schoner OV/vervoer verlagen de concentraties; de kaart laat zien waar de opgave het grootst is.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de milieudataset van Geodata Zuid-Holland en bevat berekende (gemodelleerde) waarden uit de Centrale Instrumenten Monitoring Luchtkwaliteit (CIMLK), monitoringsronde 2025 voor rekenjaar 2024 — geen directe metingen. Het veld *toetsSoort* geeft aan of een punt in de formele toetsing valt. De cijfers gaan over de kaartuitsnede van {city}; het veld *gemeente* laat per punt de gemeente zien.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Monitoring luchtkwaliteit (CIMLK)",
        url: "https://www.cimlk.nl/",
      },
    ],
  },
  {
    layerId: "zh-netcapaciteit-afname",
    title: "Netcapaciteit voor afname in en rond {city}",
    subtitle:
      "Beschikbare capaciteit op het elektriciteitsnet om stroom af te nemen",
    intro:
      "Deze laag kleurt **{count} voedingsgebieden** in en rond {city} naar de beschikbare capaciteit op het elektriciteitsnet om stroom *af te nemen* (te verbruiken). Het is de provinciale weergave van de landelijke capaciteitskaart van de netbeheerders: waar is nog ruimte voor nieuwe of zwaardere aansluitingen, en waar zit het net vol? Elk vlak hoort bij een voedingsgebied van een regionale netbeheerder.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Voedingsgebieden in beeld", type: "count" },
          {
            label: "Netbeheerders",
            type: "distinct",
            property: "RNB",
          },
          {
            label: "Met wachtrij voor afname",
            type: "count-where",
            property: "afname",
            equals: ["1", "2", "3"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Voedingsgebieden per netbeheerder in en rond {city}",
        description:
          "Veld RNB: de regionale netbeheerder die het voedingsgebied verzorgt",
        property: "RNB",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een voedingsgebied met een status voor *afname* (het afnemen van stroom uit het net). Het veld *afname* geeft een statuscode voor de beschikbare capaciteit — van ruimte tot volledig bezet — en *wachtrij_afname* de omvang van de wachtrij aan verzoeken die nog niet aangesloten kunnen worden. *RNB* geeft de netbeheerder (zoals Stedin of Liander). Waar de capaciteit op is, ontstaat *netcongestie*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijk-economische ontwikkeling**: geen netcapaciteit betekent dat nieuwe woningen, bedrijven, laadpleinen of warmtepompen niet (op tijd) aangesloten kunnen worden; netcongestie is een rem op de energietransitie en de woningbouw geworden.\n- **Prioritering**: de kaart helpt gemeenten en provincie om ontwikkelingen te sturen naar plekken waar het net het aankan, en om samen met netbeheerders uitbreidingen te plannen.\n- **Samenhang**: combineer deze laag met de elektriciteitsstations om te zien waar netverzwaring nodig is.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de energiedataset van Geodata Zuid-Holland en is gebaseerd op de capaciteitskaart van de gezamenlijke netbeheerders (Netbeheer Nederland). De statuscodes zijn een momentopname die regelmatig verandert; voor de actuele situatie is de landelijke capaciteitskaart leidend. De cijfers gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Capaciteitskaart — Netbeheer Nederland",
        url: "https://capaciteitskaart.netbeheernederland.nl/",
      },
    ],
  },
  {
    layerId: "zh-provinciale-wegen",
    title: "Provinciale wegen in en rond {city}",
    subtitle:
      "De trajectindeling van de provinciale wegen, inclusief provinciale fietspaden",
    intro:
      "Deze laag tekent **{count} wegtrajecten** binnen het kaartgebied van {city}: de provinciale wegen (de N-wegen) in beheer van de provincie Zuid-Holland, inclusief bijbehorende fietspaden. Elk lijnstuk is een traject met een wegnummer en een trajectcode. Zo zie je precies welke doorgaande verbindingen door de gemeente lopen en onder provinciaal beheer vallen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Trajecten in beeld", type: "count" },
          { label: "Wegnummers", type: "distinct", property: "WEGEN" },
          { label: "Trajectcodes", type: "distinct", property: "TRAJECT" },
        ],
      },
      {
        kind: "category-bar",
        title: "Trajecten per wegnummer in en rond {city}",
        description: "Veld WEGEN: het wegnummer (N-weg) waartoe het traject behoort",
        property: "WEGEN",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk lijnstuk is een traject uit de wegregistratie van de provincie. Het veld *WEGEN* geeft het wegnummer (bijvoorbeeld *N467*) en *TRAJECT* de fijnere trajectcode (bijvoorbeeld *N467B*). Een N-weg is opgeknipt in trajecten omdat beheer, snelheid en inrichting per wegvak kunnen verschillen. Ook fietspaden die de provincie beheert, zitten in deze indeling.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid**: provinciale wegen zijn de ruggengraat van het regionale wegennet en verbinden kernen met de snelwegen en met elkaar.\n- **Beheer en veiligheid**: de trajectindeling is de eenheid waarop de provincie onderhoud, snelheid, verlichting en veiligheidsmaatregelen organiseert.\n- **Ruimtelijke afweging**: ontwikkelingen langs een provinciale weg raken doorstroming, geluid en veiligheid; het traject is daarbij de referentie.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeersdataset van Geodata Zuid-Holland en bevat uitsluitend wegen in provinciaal beheer. Rijkswegen (A-wegen) en gemeentelijke wegen zitten er niet in. De aantallen gaan over de kaartuitsnede van {city}; trajecten die de gemeentegrens kruisen tellen mee.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Provinciale wegen — Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/verkeer-vervoer/wegen/",
      },
    ],
  },
  {
    layerId: "zh-stiltegebieden",
    title: "Stiltegebieden in en rond {city}",
    subtitle:
      "Milieubeschermingsgebieden waar rust en natuurlijke geluiden centraal staan",
    intro:
      "Deze laag toont **{count} stiltegebieden** binnen het kaartgebied van {city}: milieubeschermingsgebieden die de provincie Zuid-Holland heeft aangewezen om de natuurlijke rust te beschermen. In een stiltegebied horen vooral de geluiden van de natuur te overheersen en gelden regels tegen verstorend lawaai. Elk vlak is een aangewezen gebied met een naam en een omschrijving.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stiltegebieden in beeld", type: "count" },
          { label: "Aangewezen gebieden", type: "distinct", property: "KAARTNAAM" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een aangewezen stiltegebied, met een naam (*KAARTNAAM*), een oppervlakte (*HECTARE*) en een beschrijvende toelichting. Het gaat vaak om grotere natuur- en landschapsgebieden — duinen, veenweiden, plassen — waar de provincie de akoestische rust wil bewaren. Omdat het om enkele grote gebieden gaat, telt deze laag doorgaans maar een handvol vlakken.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Leefomgeving en natuur**: rust is een schaarse kwaliteit in het drukke Zuid-Holland; stiltegebieden beschermen zowel de natuur (broedende vogels, foeragerende dieren) als de belevingswaarde voor mensen.\n- **Ruimtelijke afweging**: binnen en rond een stiltegebied gelden beperkingen voor geluidmakende activiteiten en ontwikkelingen; het is een randvoorwaarde bij plannen.\n- **Samenhang**: leg deze laag over geluidcontouren en wegen om te zien waar rust onder druk staat.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de milieudataset van Geodata Zuid-Holland; de stiltegebieden zijn vastgelegd in de provinciale omgevingsverordening. De aantallen gaan over de kaartuitsnede van {city}; een gebied dat net buiten de uitsnede ligt telt niet mee, en een groot gebied kan buiten beeld doorlopen. Voor de exacte begrenzing en regels is de omgevingsverordening leidend.",
      },
    ],
    links: [
      { label: "Geodata Zuid-Holland", url: "https://geodata.zuid-holland.nl/" },
      {
        label: "Stiltegebieden — provincie Zuid-Holland",
        url: "https://www.zuid-holland.nl/onderwerpen/milieu/",
      },
    ],
  },
];
