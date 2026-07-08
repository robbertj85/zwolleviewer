/**
 * Story maps — batch "rotterdam-1": gemeentelijke open-data lagen van Rotterdam.
 *
 * Lagen: rtd-laadpalen, rtd-metro-stops, rtd-tram-stops, rtd-metrolijnen,
 * rtd-publieke-laadpalen, rtd-fietspaden, rtd-maxsnelheden,
 * rtd-monumentale-bomen, rtd-hittestress, rtd-koele-plekken,
 * rtd-grondwaterstanden, rtd-bodemdaling, rtd-funderingstypekaart,
 * rtd-watertappunten, rtd-gasvervanging, rtd-grondgebruik.
 *
 * Dit zijn gemeentelijke lagen (alleen zichtbaar binnen {city}); de teksten
 * gebruiken toch {city}/{count} zodat naam en aantal runtime worden ingevuld.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "rtd-laadpalen",
    title: "Gemeentelijke laadpalen in {city}",
    subtitle:
      "Oplaadpunten voor elektrische auto's die de gemeente zelf beheert",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} gemeentelijke laadpalen** geladen uit de GIS-registratie van de gemeente. Het gaat om oplaadpunten in de openbare ruimte die de gemeente in eigen beheer heeft — inclusief straatnaam, wijk en buurt. Klik op een punt voor de details, zoals het paalnummer en het ambitieniveau.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Laadpalen in beeld", type: "count" },
          { label: "Wijken met laadpalen", type: "distinct", property: "WIJK" },
          { label: "Unieke straten", type: "distinct", property: "STRAAT" },
          {
            label: "In beheer bij gemeente",
            type: "count-where",
            property: "BEHEERDER",
            equals: "Gemeente Rotterdam",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Laadpalen per wijk in {city}",
        description:
          "Veld WIJK uit de gemeentelijke registratie: de wijk waarin de laadpaal staat",
        property: "WIJK",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één laadpaal (met doorgaans twee laadpunten) in beheer van de gemeente. Het veld *AMBITIENIV* geeft aan met welk ambitieniveau de plek is aangelegd; *WIJK* en *BUURT* plaatsen de paal in de bestuurlijke gebiedsindeling. Dit is de beheerdersregistratie: publieke snelladers en palen van commerciële exploitanten zitten in andere lagen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Laadinfrastructuur**: de spreiding over wijken laat zien waar het net al dicht is en waar bewoners zonder eigen oprit nog op afstand van een laadpunt wonen.\n- **Plaatsingsbeleid**: gemeenten plaatsen laadpalen vaak vraaggestuurd (op aanvraag) of proactief; de dichtheid per wijk is daarvoor een sturingsindicator.\n- **Energienet**: concentraties laadpalen zijn relevant voor de belasting van het lokale elektriciteitsnet.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-data van de gemeente en toont alleen palen binnen de kaartuitsnede van {city}. De statistieken gaan dus over dit uitsnede-gebied, niet noodzakelijk over de hele gemeente.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — open GIS-services",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Laadpalen/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-metro-stops",
    title: "Metrostations in {city}",
    subtitle: "Haltegebieden van de RET-metro als vlak per halte",
    intro:
      "Deze laag toont **{count} metrohaltegebieden** binnen het kaartgebied van {city}. Anders dan een puntlaag tekent deze laag elke halte als een *vlak* — het invloeds- of haltegebied rond het metrostation. Zo zie je niet alleen waar de metro stopt, maar ook hoe groot het bijbehorende stationsgebied is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Haltegebieden in beeld", type: "count" },
          {
            label: "Totaal haltegebied",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddeld haltegebied",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Oppervlakteverdeling van de haltegebieden",
        description:
          "Aantal metrohaltegebieden per oppervlakteklasse (Shape__Area in m²)",
        property: "Shape__Area",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is het haltegebied van een metrostation van de RET. De omvang van het vlak zegt iets over de ruimtelijke voetafdruk van de halte — een bovengronds station met stationsplein beslaat meer oppervlak dan een compacte ondergrondse halte. Deze laag bevat geen haltenaam; gebruik de metrolijnen-laag en de tramhaltes-laag voor aanvullende OV-context.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Knooppuntontwikkeling**: metrostations zijn ankers voor verdichting en voorzieningen; hun ligging bepaalt waar hoogstedelijk bouwen kansrijk is.\n- **Bereikbaarheid**: de spreiding van haltes laat zien welke wijken op loopafstand van hoogwaardig OV liggen.",
      },
      {
        heading: "Over de bron",
        body: "De haltegebieden komen uit de open GIS-data van de gemeente en zijn gefilterd op de kaartuitsnede van {city}. Omdat het om vlakken gaat, telt een halte precies één keer mee, ook als het gebied de rand van de uitsnede raakt.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Metro/Tram/Bus-haltes",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Metro_Tram_Bus_stops/FeatureServer",
      },
      { label: "RET (vervoerder)", url: "https://www.ret.nl/" },
    ],
  },
  {
    layerId: "rtd-tram-stops",
    title: "Tramhaltes in {city}",
    subtitle: "Haltegebieden van de RET-tramlijnen, met haltenaam",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} tramhaltegebieden** uit de gemeentelijke GIS-registratie. Elke halte is een vlak met een haltenaam (bijvoorbeeld ’s-Gravendijkwal). Samen tekenen ze het fijnmazige tramnet dat de metro in de stad aanvult.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Tramhaltes in beeld", type: "count" },
          { label: "Unieke haltenamen", type: "distinct", property: "name" },
          {
            label: "Totaal halteoppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddeld halteoppervlak",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Oppervlakteverdeling van de tramhaltes",
        description:
          "Aantal haltegebieden per oppervlakteklasse (Shape__Area in m²)",
        property: "Shape__Area",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is het haltegebied van een tramhalte, met de haltenaam in het veld *name*. Waar de metro een grofmazig snelnet vormt, verzorgt de tram de fijnmazige ontsluiting van wijken en het centrum. Het verschil tussen ‘tramhaltes in beeld’ en ‘unieke haltenamen’ laat zien hoe vaak dezelfde haltenaam (bijvoorbeeld voor beide rijrichtingen) terugkomt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fijnmazige bereikbaarheid**: de tram bepaalt hoe goed wijken zonder eigen auto met het OV bereikbaar zijn.\n- **Loopafstanden**: bij nieuwe woon- en werklocaties geldt vaak een norm voor de loopafstand tot de dichtstbijzijnde halte.\n- **Ketenmobiliteit**: combineer deze laag met de metro- en laadpaallagen om de kwaliteit van het lokale mobiliteitsaanbod te beoordelen.",
      },
      {
        heading: "Over de bron",
        body: "De haltegebieden komen uit de open GIS-data van de gemeente en zijn gefilterd op de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Metro/Tram/Bus-haltes",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Metro_Tram_Bus_stops/FeatureServer",
      },
      { label: "RET (vervoerder)", url: "https://www.ret.nl/" },
    ],
  },
  {
    layerId: "rtd-metrolijnen",
    title: "Metrolijnen door {city}",
    subtitle: "Het tracé van de RET-metrolijnen A t/m E",
    intro:
      "Deze laag tekent **{count} metrolijn-tracés** binnen het kaartgebied van {city}: de routes van de RET-metrolijnen A tot en met E (peiljaar 2022). Elke lijn heeft een lijnnummer, een routebeschrijving (begin- en eindpunt) en de status of er sprake is van een omleiding.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Lijn-tracés in beeld", type: "count" },
          {
            label: "Unieke lijnnummers",
            type: "distinct",
            property: "Lijnnummer",
          },
          { label: "Unieke routes", type: "distinct", property: "Route" },
          {
            label: "Met omleiding",
            type: "count-where",
            property: "Omleiding",
            equals: "Ja",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Tracés per metrolijn in {city}",
        description:
          "Veld Lijnnummer: de metrolijn (A–E) waartoe het tracé behoort",
        property: "Lijnnummer",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is het tracé van een metrolijn. De vijf RET-lijnen (A, B, C, D en E) delen op de Rotterdamse stamlijnen deels hetzelfde spoor, waardoor je op drukke corridors meerdere lijnen over elkaar ziet lopen. Het veld *Route* beschrijft het begin- en eindpunt van de lijn; *Omleiding* geeft aan of het getekende tracé een tijdelijke omlegging betreft.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruggengraat van het OV**: de metro is het hoogwaardige, hoogfrequente snelnet; de tracés laten zien welke corridors daarop aangetakt zijn.\n- **Ruimtelijke ordening**: verdichting en woningbouw worden bij voorkeur langs metrolijnen gepland.\n- **Regionaal netwerk**: lijn E loopt door tot Den Haag; de tracés tonen hoe {city} met de bredere agglomeratie is verknoopt.",
      },
      {
        heading: "Over de bron",
        body: "De tracés komen uit de open GIS-data van de gemeente (peiljaar 2022) en zijn gefilterd op de kaartuitsnede van {city}. Omdat een lijn als één doorlopend tracé is opgeslagen, kan een lijn die de uitsnede kruist met haar volledige route meetellen.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Metrolijnen",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Metrolijnen/FeatureServer",
      },
      { label: "RET (vervoerder)", url: "https://www.ret.nl/" },
    ],
  },
  {
    layerId: "rtd-publieke-laadpalen",
    title: "Publieke laadpalen in {city}",
    subtitle:
      "Openbare laadpunten van commerciële exploitanten (Esri NL-database)",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} publieke laadpunten** geladen uit de Esri NL-database. Anders dan de gemeentelijke laadpalen-laag bevat deze laag de laadlocaties van commerciële en semipublieke exploitanten (zoals EQUANS), inclusief het aantal laadpunten (EVSE's) en connectoren per locatie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Laadlocaties in beeld", type: "count" },
          {
            label: "Totaal laadpunten (EVSE)",
            type: "sum",
            property: "n_evses",
            decimals: 0,
          },
          {
            label: "Totaal connectoren",
            type: "sum",
            property: "n_connecto",
            decimals: 0,
          },
          {
            label: "Exploitanten",
            type: "distinct",
            property: "operator_n",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Laadlocaties per exploitant in {city}",
        description:
          "Veld operator_n: de exploitant/beheerder van het laadpunt",
        property: "operator_n",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een publieke laadlocatie. Een locatie bestaat vaak uit meerdere *EVSE's* (afzonderlijke laadpunten) en nog meer *connectoren* (stekkers); daarom liggen de totalen voor laadpunten en connectoren hoger dan het aantal locaties. Het veld *operator_n* toont welke partij de locatie exploiteert; *access_typ* geeft aan of het laadpunt publiek toegankelijk is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Laaddekking**: samen met de gemeentelijke laadpalen bepaalt deze laag de totale publieke laadcapaciteit; het aantal EVSE's zegt meer over de capaciteit dan het aantal locaties.\n- **Marktbeeld**: de verdeling over exploitanten laat zien welke partijen het laadnet in de stad verzorgen.\n- **Planning**: witte vlekken in de spreiding wijzen op wijken waar laadinfrastructuur nog achterblijft.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de Esri NL-database en is gefilterd op de kaartuitsnede van {city}. Zulke marktdata wordt frequent geactualiseerd; kleine afwijkingen met de actuele situatie op straat zijn mogelijk.",
      },
    ],
    links: [
      {
        label: "Publieke laadpalen Rotterdam (Esri NL)",
        url: "https://services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Publieke_Laadpalen_Rotterdam/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-fietspaden",
    title: "Fietspaden in {city}",
    subtitle: "BGT-fietspadvlakken met breedte en verhardingstype",
    intro:
      "Deze laag toont **{count} fietspadvlakken** binnen het kaartgebied van {city}, gebaseerd op de Basisregistratie Grootschalige Topografie (BGT). Elk vlak is een stuk fietspad met een gemeten breedte en een verhardingstype. Zo ontstaat een gedetailleerd beeld van het fietsnetwerk, tot op het niveau van individuele padvlakken.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Fietspadvlakken in beeld", type: "count" },
          {
            label: "Totaal fietspadoppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Mediane breedte",
            type: "median",
            property: "Breedte",
            unit: "m",
            decimals: 1,
          },
          {
            label: "Gemiddelde breedte",
            type: "avg",
            property: "Breedte",
            unit: "m",
            decimals: 1,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Verhardingstype van de fietspaden in {city}",
        description:
          "BGT-veld FYSIEKVK: het type verharding van het fietspadvlak",
        property: "FYSIEKVK",
        valueLabels: {
          "gesloten verharding": "Gesloten verharding (asfalt/beton)",
          "open verharding": "Open verharding (tegels/klinkers)",
        },
      },
      {
        kind: "histogram",
        title: "Breedteverdeling van de fietspaden",
        description:
          "Aantal fietspadvlakken per breedteklasse (veld Breedte, in meters)",
        property: "Breedte",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een stuk fietspad uit de BGT. De **breedte** is een gemeten waarde; de **verharding** onderscheidt gesloten verharding (asfalt of beton, comfortabel en snel) van open verharding (tegels of klinkers). Omdat de BGT een fietspad in meerdere vlakken kan opdelen, telt een lange route mee als meerdere features.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fietscomfort en -veiligheid**: bredere paden met gesloten verharding zijn veiliger en comfortabeler; smalle, oneffen paden zijn knelpunten.\n- **Ontwerpnormen**: richtlijnen (bijv. CROW) hanteren minimumbreedtes voor eenrichtings- en tweerichtingsfietspaden; de breedteverdeling laat zien hoe het net zich daartoe verhoudt.\n- **Onderhoud**: verhardingstype en oppervlak zijn direct bruikbaar voor onderhoudsplanning en areaalbeheer.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag is BGT-gebaseerd en komt uit de open GIS-data van de gemeente. Let op: de breedte is per vlak gemeten en kan bij korte of onregelmatige vlakken vertekenen. De statistieken gaan over de kaartuitsnede van {city}, niet per se over het hele fietsnet.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Fietspaden",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Fietspaden/FeatureServer",
      },
      { label: "Over de BGT", url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-" },
    ],
  },
  {
    layerId: "rtd-maxsnelheden",
    title: "Maximumsnelheden in {city}",
    subtitle: "Wegvakken uit het NWB met hun geldende maximumsnelheid",
    intro:
      "Deze laag kleurt **{count} wegvakken** binnen het kaartgebied van {city} naar hun maximumsnelheid, op basis van het Nationaal Wegenbestand (NWB). Zo zie je in één beeld waar de 30-, 50-, 70- en 100-km/u-regimes gelden en hoe het snelheidsbeleid over de stad is verdeeld.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegvakken in beeld", type: "count" },
          {
            label: "Totale weglengte",
            type: "sum",
            property: "LENGTE",
            unit: "m",
            decimals: 0,
          },
          {
            label: "30 km/u (aandeel)",
            type: "count-where",
            property: "Max_Snelheid",
            equals: "30",
            asShare: true,
          },
          {
            label: "Unieke straatnamen",
            type: "distinct",
            property: "STT_NAAM",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Wegvakken per snelheidsregime in {city}",
        description:
          "Veld Max_Snelheid (km/u); wegvakken zonder ingevulde snelheid worden overgeslagen",
        property: "Max_Snelheid",
        valueLabels: {
          "12": "Stapvoets (12 km/u)",
          "30": "30 km/u",
          "50": "50 km/u",
          "60": "60 km/u",
          "70": "70 km/u",
          "80": "80 km/u",
          "100": "100 km/u",
        },
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk lijnstuk is een wegvak uit het NWB, met de geldende maximumsnelheid in het veld *Max_Snelheid*. Binnen de bebouwde kom domineren 30 en 50 km/u; hogere regimes horen bij gebiedsontsluitings- en stroomwegen. Een deel van de wegvakken heeft geen ingevulde snelheid — die worden in de grafiek automatisch weggelaten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: veel gemeenten voeren *30 als de norm* in de bebouwde kom in; het aandeel 30 km/u laat de voortgang daarvan zien.\n- **Leefbaarheid**: lagere snelheden betekenen minder geluid en een veiliger straatbeeld voor fietsers en voetgangers.\n- **Netwerkstructuur**: de verdeling van snelheidsregimes onthult de wegcategorisering — welke straten stromen door en welke zijn verblijfsgebied.",
      },
      {
        heading: "Over de bron",
        body: "De laag is afgeleid van het Nationaal Wegenbestand, aangevuld door de gemeente, en gefilterd op de kaartuitsnede van {city}. Een enkel wegvak kan de rand van de uitsnede kruisen; de weglengte telt dan met de volledige geregistreerde lengte mee.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Maximumsnelheden (NWB)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/NWB_Rotterdam_WegenMaxSnelheden/FeatureServer",
      },
      {
        label: "PDOK: Nationaal Wegenbestand",
        url: "https://www.pdok.nl/introductie/-/article/nationaal-wegenbestand-nwb-",
      },
    ],
  },
  {
    layerId: "rtd-monumentale-bomen",
    title: "Monumentale bomen in {city}",
    subtitle:
      "Het gemeentelijke register van bijzondere en beschermde bomen",
    intro:
      "Binnen het kaartgebied van {city} staan **{count} monumentale bomen** in het gemeentelijke register. Elke boom is vastgelegd met soort, stamdiameter, kroondiameter en aanlegjaar. Deze bomen genieten extra bescherming vanwege hun leeftijd, omvang, zeldzaamheid of cultuurhistorische waarde.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Monumentale bomen in beeld", type: "count" },
          {
            label: "Verschillende boomsoorten",
            type: "distinct",
            property: "BOOMSORT00",
          },
          {
            label: "Gemiddelde stamdiameter",
            type: "avg",
            property: "STAMDIAMET",
            unit: "cm",
            decimals: 0,
          },
          {
            label: "Grootste kroondiameter",
            type: "max",
            property: "KROONDIAME",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten in {city}",
        description:
          "Veld BOOMSORT00: de Nederlandse soortnaam van de monumentale boom",
        property: "BOOMSORT00",
        maxCategories: 8,
      },
      {
        kind: "histogram",
        title: "Verdeling van de stamdiameter",
        description:
          "Aantal bomen per stamdiameterklasse (veld STAMDIAMET, in cm)",
        property: "STAMDIAMET",
        unit: "cm",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één monumentale boom. De **stamdiameter** en **kroondiameter** zeggen iets over de omvang en dus vaak de leeftijd van de boom; *AANLEGJAAR* geeft het (geschatte) plantjaar. Het veld *BOOMSORT00* bevat de Nederlandse soortnaam, *BOOMSORTIM* de wetenschappelijke (Latijnse) naam.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Groen erfgoed**: monumentale bomen zijn nauwelijks vervangbaar; verlies betekent tientallen jaren teruggeworpen worden in kroonvolume en ecologische waarde.\n- **Bescherming bij bouwplannen**: rond monumentale bomen gelden vaak strengere kapregels en beschermingszones; deze registratie is daarvoor het vertrekpunt.\n- **Klimaatadaptatie**: grote, oude bomen leveren veel schaduw en verkoeling — direct relevant voor hittestress in de stad.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit het gemeentelijke bomenregister (open GIS-data) en is gefilterd op de kaartuitsnede van {city}. De diameters zijn registratiewaarden en kunnen per meetmoment iets afwijken van de actuele situatie.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Monumentale bomen",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Monumentale_bomen_Rotterdam/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-hittestress",
    title: "Hittestress in {city}",
    subtitle: "Gemodelleerde hitte-indexwaarden op gridniveau",
    intro:
      "Deze laag toont **{count} gridcellen** binnen het kaartgebied van {city}, elk met een gemodelleerde hitte-indexwaarde (veld *gridcode*). De cellen vormen samen een fijnmazige kaart van waar het in de stad relatief warm wordt — een van de bouwstenen voor het hitte- en klimaatadaptatiebeleid.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gridcellen in beeld", type: "count" },
          {
            label: "Gemiddelde indexwaarde",
            type: "avg",
            property: "gridcode",
            decimals: 1,
          },
          {
            label: "Hoogste indexwaarde",
            type: "max",
            property: "gridcode",
            decimals: 0,
          },
          {
            label: "Totaal gridoppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de hitte-indexwaarden in {city}",
        description:
          "Aantal gridcellen per klasse van de indexwaarde (veld gridcode)",
        property: "gridcode",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De stad is opgedeeld in een raster van gelijke gridcellen. Elke cel heeft een *gridcode*: een gemodelleerde indexwaarde voor hitte. Door de cellen naast elkaar te leggen ontstaat een warmtekaart waarop stenige, dicht bebouwde gebieden zich onderscheiden van groene, koelere zones.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: hittestress raakt vooral kwetsbare bewoners (ouderen, jonge kinderen); de kaart helpt prioriteren waar vergroening en schaduw het hardst nodig zijn.\n- **Ontwerpkeuzes**: hete zones vragen om andere inrichting — meer bomen, minder verharding, lichtere materialen.\n- **Koppeling met andere lagen**: leg deze laag naast de koele verblijfsplekken en monumentale bomen om te zien waar verkoeling ontbreekt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de open hitte-/klimaatdata van de gemeente en is gefilterd op de kaartuitsnede van {city}. Let op: het is een **modelresultaat**, geen meting, en de exacte eenheid en berekeningswijze achter *gridcode* worden in de open laag niet meegeleverd — lees de waarden daarom relatief (welke gebieden warmer zijn ten opzichte van elkaar), niet als absolute temperatuur.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Hitte, warme nachten en hittestress",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Hitte_Warme_Nachten_en_hittestress_WFL1/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-koele-plekken",
    title: "Koele verblijfsplekken in {city}",
    subtitle:
      "Bestaande koele plekken buiten: parken, pleinen en waterpartijen",
    intro:
      "Deze laag toont **{count} bestaande koele verblijfsplekken** binnen het kaartgebied van {city}: buitenruimtes zoals parken, groene pleinen en waterpartijen die op warme dagen verkoeling bieden. Ze vormen de tegenhanger van de hittekaart — plekken waar mensen tijdens hitte prettig kunnen verblijven.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Koele plekken in beeld", type: "count" },
          {
            label: "Totaal koel oppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde oppervlakte",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Benoemde plekken",
            type: "distinct",
            property: "Naam",
          },
        ],
      },
      {
        kind: "histogram",
        title: "Oppervlakteverdeling van de koele plekken in {city}",
        description:
          "Aantal koele plekken per oppervlakteklasse (Shape__Area in m²)",
        property: "Shape__Area",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een bestaande koele verblijfsplek buiten, vaak met een naam in het veld *Naam* (bijvoorbeeld Lijnbaan). Grote parken beslaan veel oppervlak; kleine schaduwrijke pleinen tellen ook mee. Samen laten ze zien waar de stad al verkoeling biedt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hittebestendige stad**: iedereen zou binnen korte loopafstand een koele plek moeten kunnen bereiken; deze laag maakt zichtbaar waar dat lukt en waar niet.\n- **Sociale functie**: koele plekken zijn ontmoetingsplekken; hun spreiding raakt aan gezondheid én leefbaarheid.\n- **Beleid**: leg deze laag over de hittekaart om ‘hitte-eilanden zonder verkoeling’ op te sporen — precies de plekken voor extra groen of schaduw.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open klimaatdata van de gemeente en toont de reeds bestaande koele plekken binnen de kaartuitsnede van {city}. Het gaat om een selectie van als koel aangemerkte buitenruimtes, niet om elke schaduwplek in de stad.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bestaande koele plekken buiten",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Bestaande_koele_plekken_buiten/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-grondwaterstanden",
    title: "Grondwaterstanden in {city}",
    subtitle:
      "Meetpunten met zomer- en wintergrondwaterstand en historische statistieken",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} grondwatermeetpunten** uit het gemeentelijke meetnet. Per peilbuis zijn de gemeten grondwaterstanden vastgelegd, inclusief de diepte onder maaiveld en historische statistieken (minimum, maximum en percentielen). Zo ontstaat een beeld van hoe hoog het grondwater in de stad staat.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetpunten in beeld", type: "count" },
          {
            label: "Gemiddelde grondwaterdiepte",
            type: "avg",
            property: "diepte",
            unit: "m -mv",
            decimals: 2,
          },
          {
            label: "Gemiddelde zomerstand",
            type: "avg",
            property: "Z_gem",
            unit: "m NAP",
            decimals: 2,
          },
          {
            label: "Laagst gemeten stand",
            type: "min",
            property: "tot_min",
            unit: "m NAP",
            decimals: 2,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de grondwaterdiepte in {city}",
        description:
          "Aantal meetpunten per diepteklasse (veld diepte: grondwaterstand onder maaiveld, in meters)",
        property: "diepte",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een peilbuis. Het veld *diepte* geeft de grondwaterstand onder het maaiveld (hoe kleiner, hoe dichter het water onder de oppervlakte staat); *Z_gem* is de gemiddelde zomerstand in meters ten opzichte van NAP. De velden *tot_min*, *tot_max* en de percentielen (*tot_per_50* enzovoort) vatten de meetreeks per punt samen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Funderingen**: te lage grondwaterstanden kunnen houten paalfunderingen laten droogvallen en rotten — een direct risico voor oudere panden.\n- **Wateroverlast en droogte**: hoge standen vergroten de kans op grondwateroverlast in kelders; lage standen wijzen op verdrogingsrisico.\n- **Klimaatadaptatie**: het grondwaterpeil is een sleutelvariabele bij het inrichten van een klimaatbestendige, ‘sponzige’ stad.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het gemeentelijke grondwatermeetnet (open GIS-data) en is gefilterd op de kaartuitsnede van {city}. De statistieken per punt beslaan verschillende meetperioden (velden *eerste_m* en *laatste_m*); vergelijk waarden daarom met enige voorzichtigheid. NAP-waarden zijn negatief onder zeeniveau.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Grondwaterstanden zomer/winter",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Grondwaterstanden_zomerwinter_Rotterdam/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-bodemdaling",
    title: "Bodemdaling in {city}",
    subtitle: "Achtergrondzetting per (sub)buurt, in mm per jaar",
    intro:
      "Deze laag toont **{count} gebiedjes** binnen het kaartgebied van {city}, elk gekleurd naar de verwachte achtergrondzetting — de langzame, autonome bodemdaling. Het veld *pc25* geeft per subbuurt het 25e percentiel van de zettingssnelheid in millimeter per jaar. Zo zie je waar de bodem het snelst zakt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebieden in beeld", type: "count" },
          {
            label: "Gemiddelde zetting",
            type: "avg",
            property: "pc25",
            unit: "mm/jaar",
            decimals: 1,
          },
          {
            label: "Snelste zetting (gebied)",
            type: "min",
            property: "pc25",
            unit: "mm/jaar",
            decimals: 1,
          },
          {
            label: "Buurten in beeld",
            type: "distinct",
            property: "BUURTNAAM",
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de zettingssnelheid in {city}",
        description:
          "Aantal gebieden per klasse van de achtergrondzetting (veld pc25, in mm/jaar; negatiever = sneller dalen)",
        property: "pc25",
        unit: "mm/jaar",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een (sub)buurt met een berekende achtergrondzetting. De waarde *pc25* is het 25e percentiel van de zettingssnelheid: een voorzichtige (relatief snelle) inschatting van hoeveel de bodem daalt. Negatievere waarden betekenen een snellere daling. De achtergrondzetting is de autonome daling door bodemsamenstelling, los van lokale belasting.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Funderings- en schaderisico**: bodemdaling veroorzaakt scheefstand, scheuren en schade aan panden, wegen en leidingen.\n- **Beheerkosten**: dalende gebieden vragen vaker ophoging van straten en herstel van riolering en kabels.\n- **Ruimtelijke keuzes**: bij nieuwbouw en herinrichting is de te verwachten zetting een belangrijke ontwerpparameter.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open bodemdalingsdata van de gemeente en is gefilterd op de kaartuitsnede van {city}. Het gaat om een modelmatige inschatting per gebied; werkelijke zetting kan lokaal afwijken, bijvoorbeeld door bebouwing of ophogingen.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bodemdaling (achtergrondzetting)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Bodemdaling_Achtergrondzetting/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-funderingstypekaart",
    title: "Funderingstypen in {city}",
    subtitle: "Het (indicatieve) funderingstype per pand",
    intro:
      "Deze laag toont **{count} panden** binnen het kaartgebied van {city}, elk met een geschat of vastgesteld funderingstype: op betonpalen, op houten palen (al dan niet met oplanger), niet-onderheid of overig. Samen met het bouwjaar geeft dit een indicatie van het funderingsrisico per pand.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Panden in beeld", type: "count" },
          {
            label: "Op houten palen",
            type: "count-where",
            property: "Funderingstype",
            equals: [
              "Funderingstype Indicatief - Houten Palen",
              "Funderingstype Vastgesteld - Houten Palen",
              "Funderingstype Indicatief - Houten Palen met oplanger",
              "Funderingstype Vastgesteld - Houten Palen met oplanger",
            ],
          },
          {
            label: "Op betonpalen",
            type: "count-where",
            property: "Funderingstype",
            equals: [
              "Funderingstype Indicatief - Beton palen",
              "Funderingstype Vastgesteld - Beton palen",
            ],
          },
          {
            label: "Oudste bouwjaar",
            type: "min",
            property: "bouwjaar",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Funderingstype van de panden in {city}",
        description:
          "Veld Funderingstype: indicatief (afgeleid) of vastgesteld (onderzocht) type fundering",
        property: "Funderingstype",
        valueLabels: {
          "Funderingstype Indicatief - Beton palen": "Betonpalen (indicatief)",
          "Funderingstype Vastgesteld - Beton palen": "Betonpalen (vastgesteld)",
          "Funderingstype Indicatief - Houten Palen": "Houten palen (indicatief)",
          "Funderingstype Vastgesteld - Houten Palen": "Houten palen (vastgesteld)",
          "Funderingstype Indicatief - Houten Palen met oplanger":
            "Houten palen + oplanger (indicatief)",
          "Funderingstype Vastgesteld - Houten Palen met oplanger":
            "Houten palen + oplanger (vastgesteld)",
          "Funderingstype Indicatief - Niet onderheid":
            "Niet onderheid (indicatief)",
          "Funderingstype Vastgesteld - Niet onderheid":
            "Niet onderheid (vastgesteld)",
          "Funderingstype Vastgesteld - Overig": "Overig (vastgesteld)",
        },
        maxCategories: 9,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een BAG-pand met een funderingstype. De typen zijn ofwel **indicatief** (afgeleid uit bouwjaar, ligging en bodem) ofwel **vastgesteld** (op basis van feitelijk onderzoek). Vooral panden op **houten palen** zijn kwetsbaar: bij te lage grondwaterstanden kunnen die palen droogvallen en aangetast raken. *Niet onderheid* betekent dat het pand op staal (direct op de grond) is gefundeerd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Funderingsproblematiek**: in slappe bodems is funderingsschade een groeiend, kostbaar probleem; het type fundering bepaalt het risico.\n- **Koppeling met grondwater**: leg deze laag naast de grondwaterstanden om houten-palenpanden in droogtegevoelige gebieden te herkennen.\n- **Eigenaren en beleid**: de kaart helpt de gemeente en eigenaren om preventief onderzoek en herstel te prioriteren.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Dit is de **publieke** versie van de funderingstypekaart uit de open GIS-data van de gemeente, gefilterd op de kaartuitsnede van {city}. Een indicatief type is een inschatting, geen garantie; alleen een vastgesteld type is op onderzoek gebaseerd. Voor individuele panden blijft nader onderzoek nodig.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Funderingstypekaart (publiek)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Funderingstypekaart_V5_publiek/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-watertappunten",
    title: "Watertappunten in {city}",
    subtitle: "Openbare drinkwatertappunten in de openbare ruimte",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} openbare watertappunten** geladen uit de gemeentelijke registratie. Het gaat om drinkwaterpunten (zoals ‘Join the Pipe’-tappunten van Evides) in de openbare ruimte, waar iedereen gratis water kan tappen. Klik op een punt voor de locatie en het type.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Watertappunten in beeld", type: "count" },
          { label: "Wijken met een tappunt", type: "distinct", property: "WIJK" },
          { label: "Types tappunt", type: "distinct", property: "TYPE" },
          { label: "Unieke straten", type: "distinct", property: "STRAAT" },
        ],
      },
      {
        kind: "category-bar",
        title: "Watertappunten per wijk in {city}",
        description: "Veld WIJK: de wijk waarin het tappunt staat",
        property: "WIJK",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een openbaar drinkwatertappunt. Het veld *TYPE* geeft het soort tappunt aan (bijvoorbeeld ‘Join the Pipe’); *WIJK*, *BUURT* en *STRAAT* plaatsen het punt in de stad. Het is een relatief kleine, maar zichtbare voorziening in de openbare ruimte.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid en hitte**: gratis drinkwaterpunten helpen mensen gehydrateerd te blijven, juist op hete dagen — een concrete klimaatadaptatiemaatregel.\n- **Duurzaamheid**: tappunten verminderen het gebruik van plastic flesjes.\n- **Spreiding**: de verdeling over wijken laat zien waar de voorziening al aanwezig is en waar uitbreiding zinvol kan zijn, bijvoorbeeld bij drukke looproutes en verblijfsplekken.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-data van de gemeente en is gefilterd op de kaartuitsnede van {city}. Het aantal is klein; kleine verschillen met de situatie op straat (nieuw geplaatste of verwijderde punten) zijn mogelijk.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Watertappunten",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/WaterTappunt_gemeente_Rotterdam/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-gasvervanging",
    title: "Gasvervanging in {city}",
    subtitle:
      "Gastransportleidingen die netbeheerder Stedin gaat vervangen",
    intro:
      "Deze laag toont **{count} leidingsegmenten** binnen het kaartgebied van {city}: gastransportleidingen die netbeheerder Stedin gaat vervangen. Elk segment is ingedeeld naar leeftijd — jonger of ouder dan 30 jaar — wat een indicatie geeft van de urgentie en fasering van de vervangingsopgave.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Leidingsegmenten in beeld", type: "count" },
          {
            label: "Totale leidinglengte",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Ouder dan 30 jaar",
            type: "count-where",
            property: "Categorie",
            equals: "Ouder dan 30 jaar",
            asShare: true,
          },
          {
            label: "Gemiddelde segmentlengte",
            type: "avg",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Leidingsegmenten per leeftijdscategorie in {city}",
        description:
          "Veld Categorie: leeftijd van de te vervangen gasleiding",
        property: "Categorie",
        maxCategories: 4,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk lijnstuk is een gastransportleiding die op de nominatie staat om vervangen te worden. De **leeftijdscategorie** (jonger of ouder dan 30 jaar) is een eenvoudige risico-indicator: oudere leidingen zijn doorgaans dringender aan vervanging toe. De totale lengte geeft de omvang van de opgave binnen de uitsnede.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Veiligheid en betrouwbaarheid**: verouderde gasleidingen worden vervangen om lekkages en storingen te voorkomen.\n- **Werk-met-werk**: vervangingswerk aan het gasnet valt vaak samen met andere ingrepen in de ondergrond (riool, kabels) en met de herinrichting van straten.\n- **Energietransitie**: waar wijken van het gas af gaan, verandert de afweging tussen vervangen en verwijderen; deze laag is daarvoor een startpunt.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-data van de gemeente (bron: netbeheerder Stedin) en is gefilterd op de kaartuitsnede van {city}. De planning van vervangingen kan wijzigen; de leeftijdsindeling is indicatief.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Gasvervanging",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/GasvervangingRotterdam/FeatureServer",
      },
      { label: "Stedin (netbeheerder)", url: "https://www.stedin.net/" },
    ],
  },
  {
    layerId: "rtd-grondgebruik",
    title: "Functioneel grondgebruik in {city}",
    subtitle:
      "Aandeel groen, water, bebouwing en infrastructuur per buurt (2017)",
    intro:
      "Deze laag toont **{count} buurten** binnen het kaartgebied van {city}, elk met de verdeling van het grondgebruik op maaiveldniveau: welk percentage van de buurt bestaat uit groen, water, bebouwing en verschillende soorten infrastructuur (peiljaar 2017). Zo zie je in één beeld hoe ‘groen’ of ‘steens’ een buurt is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gemiddeld aandeel groen",
            type: "avg",
            property: "perc_groen",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Gemiddeld aandeel bebouwing",
            type: "avg",
            property: "perc_bebouwing",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Totaal gebiedsoppervlak",
            type: "sum",
            property: "opp_gebied_ha",
            unit: "ha",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het groenaandeel per buurt in {city}",
        description:
          "Aantal buurten per klasse van het percentage groen (veld perc_groen)",
        property: "perc_groen",
        unit: "%",
        bins: 8,
      },
      {
        kind: "histogram",
        title: "Verdeling van het bebouwingsaandeel per buurt in {city}",
        description:
          "Aantal buurten per klasse van het percentage bebouwing (veld perc_bebouwing)",
        property: "perc_bebouwing",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een CBS-buurt met de gemeten verdeling van het maaiveld over functies. Naast *perc_groen*, *perc_water* en *perc_bebouwing* is de infrastructuur verder uitgesplitst (auto, OV, fiets, voetgangers, parkeren). Naast percentages bevat de laag ook de absolute oppervlakten in hectare (*opp_..._ha*). Groene buurten aan de rand contrasteren met steenrijke buurten in het centrum.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vergroening en klimaat**: het groen- en verhardingsaandeel is een directe indicator voor hittestress, wateroverlast en leefbaarheid.\n- **Ruimtegebruik**: de verdeling laat zien hoeveel ruimte naar de auto gaat versus naar groen, fiets en voetganger — relevant voor herinrichting.\n- **Monitoring**: door buurten te vergelijken zie je waar vergroening het meest kan opleveren.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het open-dataportaal van de gemeente (Rotterdam Open Data) en beschrijft de situatie in **2017**; het is een momentopname en kan afwijken van de actuele inrichting. De statistieken gaan over de buurten binnen de kaartuitsnede van {city}. Omdat percentages per buurt zijn berekend, wegen grote en kleine buurten in de gemiddelden even zwaar mee.",
      },
    ],
    links: [
      {
        label:
          "Rotterdam Open Data — Functioneel stedelijk grondgebruik op maaiveldniveau",
        url: "https://data.rotterdam.nl/explore/dataset/functioneel-stedelijk-grondgebruik-op-maaiveldniveau",
      },
    ],
  },
];
