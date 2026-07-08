/**
 * Story maps — gemeentelijke lagen Zwolle (batch "zwolle-4").
 *
 * Lagen uit de ArcGIS-services van gemeente Zwolle (gisservices.zwolle.nl).
 * Deze lagen zijn alleen in Zwolle zichtbaar, maar de teksten gebruiken
 * bewust {city}/{count}-placeholders — nooit een gemeentenaam of getal
 * hardcoden.
 *
 * Lagen: riolering-drainage, riolering-stroomrichting,
 * enexis-gas-stations-lagedruk, enexis-elektra-stations-laagspanning,
 * bijzondere-bomen-particulier, bijzondere-bomen-gemeentelijk,
 * civiele-kunstwerken, lichtmasten, regenbui-stroombanen, regenbui-t100-wegen,
 * wolk-stroombanen, geluid-wegverkeer, geluid-treinverkeer, geluid-industrie,
 * swt-locaties, swt-gebieden, toegankelijkheid.
 */

import type { StoryDefinition } from "../types";

/** dB-klassen komen in meerdere geluidslagen terug in dezelfde volgorde. */
const dbNoiseCategoryBar = (title: string, description: string) =>
  ({
    kind: "category-bar" as const,
    title,
    description,
    property: "LEGENDA",
    maxCategories: 6,
  });

export const stories: StoryDefinition[] = [
  {
    layerId: "riolering-drainage",
    title: "Drainage van de riolering in {city}",
    subtitle:
      "Ondergrondse drainageleidingen en -putten voor grondwaterbeheersing",
    intro:
      "Deze laag toont **{count} drainage-objecten** binnen het kaartgebied van {city}: de ondergrondse drainageleidingen, drainageputten en afvoerleidingen die de gemeente aanlegt om het grondwater onder straten en wijken te beheersen. Het is een technische beheerlaag uit het riooldatabestand — elk object hoort bij een subcategorie (het veld *LAAG*), van drainageputten tot losse afvoerleidingen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Drainage-objecten in beeld", type: "count" },
          {
            label: "Drainageputten",
            type: "count-where",
            property: "LAAG",
            equals: "drainage_put_bor",
          },
          {
            label: "Drainageleidingen",
            type: "count-where",
            property: "LAAG",
            equals: "drainage_bor",
          },
          { label: "Soorten objecten", type: "distinct", property: "LAAG" },
        ],
      },
      {
        kind: "category-bar",
        title: "Type drainage-object in {city}",
        description:
          "Het veld LAAG uit het beheerbestand groepeert de objecten naar functie",
        property: "LAAG",
        maxCategories: 7,
        valueLabels: {
          drainage_put_bor: "Drainageput",
          drainage_bor: "Drainageleiding",
          drainage_afvoerleiding_bor: "Afvoerleiding",
          hulplijn_tekst_bor: "Hulplijn / tekst",
          drainage_tekst_bor: "Tekstobject",
          uitlegger_RWA_bor: "Uitlegger (regenwater)",
          mantelbuis_bor: "Mantelbuis",
          duiker_bor: "Duiker",
          overig_bor: "Overig",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Drainage is het onzichtbare deel van de waterhuishouding: een stelsel van geperforeerde leidingen en putten dat overtollig grondwater opvangt en gecontroleerd afvoert. Zo blijft de grondwaterstand onder wegen, funderingen en tuinen binnen de gewenste marges. De laag bestaat vooral uit **drainageputten** en **drainageleidingen**; daarnaast staan er hulp- en tekstobjecten in die bij het beheerbestand horen maar geen fysieke buis zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: bij toenemende neerslag én langere droogteperiodes is grondwaterbeheersing cruciaal om zowel wateroverlast als paalrot en verzakkingen te voorkomen.\n- **Beheer en onderhoud**: drainage slibt dicht en moet periodiek worden doorgespoten; een compleet leidingbestand is daarvoor de basis.\n- **Bouwprojecten**: bij graafwerk en nieuwbouw moet bekend zijn waar drainage ligt, zodat het systeem niet wordt beschadigd of onbedoeld wordt afgekoppeld.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de service *Riolering_openbaar* van Gemeente Zwolle GIS. Dit is een grote beheerlaag; de kaart laadt een uitsnede binnen een maximum, dus bij inzoomen kunnen meer of andere objecten in beeld komen dan het getal hierboven suggereert. De statistieken gaan over de op dat moment geladen features, niet per se over het volledige stelsel in de gemeente.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Riolering_openbaar/FeatureServer",
      },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "riolering-stroomrichting",
    title: "Stroomrichting van het riool in {city}",
    subtitle:
      "Richtingspunten van het rioolstelsel, ingedeeld naar leidingtype",
    intro:
      "Deze laag plaatst **{count} stroomrichtingspunten** binnen het kaartgebied van {city}: pijlsymbolen die aangeven welke kant het afvalwater in het rioolstelsel op stroomt. Elk punt hoort bij een leidingtype — vuilwater, gemengd of hemelwater — zodat in één oogopslag te zien is hoe het stelsel is opgebouwd en waar het water naartoe loopt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Richtingspunten in beeld", type: "count" },
          {
            label: "Vuilwaterriool",
            type: "count-where",
            property: "LEIDINGTYPE",
            equals: "Vuilwaterriool",
          },
          {
            label: "Gemengd riool",
            type: "count-where",
            property: "LEIDINGTYPE",
            equals: "Gemengd riool",
          },
          {
            label: "Hemelwaterriool",
            type: "count-where",
            property: "LEIDINGTYPE",
            equals: "Hemelwaterriool",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Leidingtype van de stroomrichtingspunten in {city}",
        description:
          "Het veld LEIDINGTYPE onderscheidt de drie hoofdtypen rioolleiding",
        property: "LEIDINGTYPE",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een rioolstelsel is een netwerk dat onder vrij verval (of via gemalen) afstroomt naar een zuivering. De **stroomrichtingspunten** maken die logica zichtbaar. Het onderscheid in leidingtype is beleidsmatig belangrijk:\n- **Vuilwaterriool** voert alleen afvalwater af.\n- **Gemengd riool** voert vuilwater én regenwater samen af — de klassieke, oudere aanpak.\n- **Hemelwaterriool** voert alleen regenwater af, onderdeel van het afkoppelen van verhard oppervlak.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Afkoppelen en klimaat**: de verhouding tussen gemengd en gescheiden stelsel laat zien hoe ver een wijk is met het scheiden van regen- en afvalwater — bepalend voor overstortproblematiek en waterkwaliteit.\n- **Storingen opsporen**: bij verstoppingen of stankoverlast helpt de stroomrichting om bovenstrooms de oorzaak te vinden.\n- **Beheer**: de indeling stuurt reiniging, inspectie en vervangingsplanning van het riool.",
      },
      {
        heading: "Over de bron",
        body: "De punten komen uit de service *Riolering_openbaar* van Gemeente Zwolle GIS. De kaart toont een uitsnede binnen een maximum aantal objecten; de aantallen gaan over de geladen features in het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Riolering_openbaar/FeatureServer",
      },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "enexis-gas-stations-lagedruk",
    title: "Enexis-gasstations (lage druk) in {city}",
    subtitle:
      "Technische gebouwen van het lagedruk-gasnet uit de Enexis-assets",
    intro:
      "Deze laag toont **{count} technische gasgebouwen** (lage druk) binnen het kaartgebied van {city}: de stationsobjecten waarmee netbeheerder Enexis het gasnet op wijkniveau bedrijft. Het zijn de bovengronds vaak nauwelijks opvallende kastjes en gebouwtjes die de gasdruk regelen richting woningen en bedrijven. De data komt uit de gedeelde assetregistratie \"Energie in Beeld\".",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gasstations in beeld", type: "count" },
          {
            label: "In bedrijf (aandeel)",
            type: "count-where",
            property: "CURRENTSTATUS",
            equals: "functional",
            asShare: true,
          },
          {
            label: "Gepland / in ontwerp",
            type: "count-where",
            property: "CURRENTSTATUS",
            equals: "projected",
          },
          {
            label: "Bovengronds zichtbaar",
            type: "count-where",
            property: "BOVENGRONDSZICHTBAAR",
            equals: "true",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een **technisch gebouw** in het lagedruk-gasnet: het schakel- en regelpunt tussen het hogere-drukdeel van het net en de aansluitingen in de straat. Vrijwel alle objecten hebben de status *functional* (in bedrijf); een enkel object kan *projected* zijn, wat op een geplande of nog niet gerealiseerde situatie duidt. Het veld *bovengronds zichtbaar* geeft aan of de installatie aan de oppervlakte staat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energietransitie**: bij het van het gas af halen van wijken (\"aardgasvrij\") is inzicht in de gasinfrastructuur onmisbaar om de fasering en de ontmanteling te plannen.\n- **Graafwerk en veiligheid**: gasstations zijn kwetsbare en risicovolle objecten; hun ligging is essentieel bij werkzaamheden in de openbare ruimte.\n- **Afstemming met de gemeente**: netbeheer en gemeentelijke plannen (herinrichting, nieuwbouw) moeten op elkaar aansluiten.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de service *Energie_in_Beeld_Enexis_Assets*, ontsloten via Gemeente Zwolle GIS in samenwerking met Enexis. Het is een netbeheerregistratie; ligging en status worden door de netbeheerder onderhouden. De kaart toont de objecten binnen het uitsnede-gebied van {city}.",
      },
    ],
    links: [
      { label: "Enexis Netbeheer", url: "https://www.enexis.nl/" },
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer",
      },
    ],
  },
  {
    layerId: "enexis-elektra-stations-laagspanning",
    title: "Enexis-elektrastations (laagspanning) in {city}",
    subtitle:
      "Netstations en klantstations van het laagspanningsnet uit de Enexis-assets",
    intro:
      "Deze laag toont **{count} elektrastations** (laagspanning) binnen het kaartgebied van {city}: de transformator- en verdeelstations waarmee netbeheerder Enexis stroom vanuit het middenspanningsnet naar de aansluitingen in wijken en bij bedrijven brengt. Elk station heeft een omschrijving die het type aangeeft — van gewone netstations tot klantstations en grotere transportverdeelstations.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Elektrastations in beeld", type: "count" },
          {
            label: "Netstations",
            type: "count-where",
            property: "OMSCHRIJVING",
            equals: "Netstation",
          },
          {
            label: "Klantstations",
            type: "count-where",
            property: "OMSCHRIJVING",
            equals: ["Klantstation", "Klantstation met medegebruik"],
          },
          {
            label: "In bedrijf (aandeel)",
            type: "count-where",
            property: "CURRENTSTATUS",
            equals: "functional",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Type elektrastation in {city}",
        description:
          "Het veld OMSCHRIJVING onderscheidt net-, klant- en verdeelstations",
        property: "OMSCHRIJVING",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een station in het laagspanningsnet:\n- **Netstations** transformeren middenspanning naar de laagspanning die bij woningen binnenkomt; ze staan verspreid door de wijken.\n- **Klantstations** (al dan niet met medegebruik) horen bij één grootverbruiker, zoals een bedrijf of instelling.\n- **Transportverdeel- en hoofdstations** zijn zwaardere knooppunten hoger in het net.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Netcapaciteit en netcongestie**: de dichtheid en het type stations vertellen iets over de belastbaarheid van het net — een actueel thema nu zon, warmtepompen en laadpalen de vraag opstuwen.\n- **Energietransitie**: verzwaring van het net begint vaak bij het bijplaatsen of vergroten van netstations; hun ligging bepaalt waar ruimte in de openbare ruimte nodig is.\n- **Planvorming**: bij nieuwbouw en herinrichting moet de elektra-infrastructuur worden meegenomen.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de service *Energie_in_Beeld_Enexis_Assets*, ontsloten via Gemeente Zwolle GIS in samenwerking met Enexis. Het betreft een netbeheerregistratie voor het uitsnede-gebied van {city}; ligging en typering worden door de netbeheerder bijgehouden.",
      },
    ],
    links: [
      { label: "Enexis Netbeheer", url: "https://www.enexis.nl/" },
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer",
      },
    ],
  },
  {
    layerId: "bijzondere-bomen-particulier",
    title: "Bijzondere bomen in particulier bezit in {city}",
    subtitle:
      "Monumentale en waardevolle bomen op grond van particulieren en derden",
    intro:
      "Deze laag toont **{count} bijzondere bomen** in particulier bezit binnen het kaartgebied van {city}: monumentale, waardevolle en herinneringsbomen die op grond van bewoners, bedrijven of andere derden staan. Ze zijn opgenomen op de gemeentelijke Groenekaart vanwege hun leeftijd, omvang, zeldzaamheid of cultuurhistorische betekenis. Klik op een boom voor de soort, status en het aanlegjaar.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          {
            label: "Monumentaal",
            type: "count-where",
            property: "BOOMSTATUS",
            equals: "monumentaal",
          },
          { label: "Boomsoorten (NL)", type: "distinct", property: "NAAMNL" },
          {
            label: "Mediane aanlegjaar",
            type: "median",
            property: "AANLEGJAAR",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten in {city}",
        description:
          "Het veld NAAMNL: de Nederlandse soortnaam van de particuliere bijzondere bomen",
        property: "NAAMNL",
        maxCategories: 8,
      },
      {
        kind: "histogram",
        title: "Aanlegjaar van de particuliere bijzondere bomen",
        description:
          "Verdeling van het geregistreerde aanlegjaar (AANLEGJAAR) — oudere bomen tellen vaak als monumentaal",
        property: "AANLEGJAAR",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één bijzondere boom op particuliere grond. De **boomstatus** onderscheidt *monumentale* bomen (meestal ouder dan ongeveer 50 jaar en van bijzondere waarde), *waardevolle* bomen en *herinneringsbomen*. Het veld *NAAMNL* geeft de soort; in {city} domineren van oudsher zomereiken, linden en beuken. Het **aanlegjaar** is een indicatie van de leeftijd — hoe verder terug, hoe zwaarder de boom doorgaans meetelt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bescherming**: voor monumentale en waardevolle bomen geldt vaak een strenger kapregime; de registratie is het vertrekpunt voor vergunningverlening en handhaving.\n- **Groen en klimaat**: oude, grote bomen leveren onevenredig veel schaduw, koelte, waterberging en biodiversiteit — juist in versteende omgeving.\n- **Particulier eigenaarschap**: omdat deze bomen op privéterrein staan, is samenwerking met eigenaren cruciaal; de gemeente kan adviseren en soms meebetalen aan onderhoud.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de service *Groenekaart* van Gemeente Zwolle GIS (laag particuliere bomen). Registraties worden bijgehouden op basis van inventarisaties en meldingen; velden als *STANDPLAATS* en *OMGEVINGSRISCICOKLASSE* zijn niet altijd ingevuld. De aantallen gaan over het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — bomen en groen",
        url: "https://www.zwolle.nl/bomen",
      },
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Groenekaart/MapServer",
      },
    ],
  },
  {
    layerId: "bijzondere-bomen-gemeentelijk",
    title: "Bijzondere gemeentelijke bomen in {city}",
    subtitle:
      "Monumentale en waardevolle bomen in eigendom en beheer van de gemeente",
    intro:
      "Deze laag toont **{count} bijzondere bomen** in gemeentelijk bezit binnen het kaartgebied van {city}: monumentale, waardevolle en herinneringsbomen langs straten, in parken en op andere openbare grond. Het is de tegenhanger van de particuliere-bomenlaag, maar dan voor bomen die de gemeente zelf bezit en onderhoudt. Klik op een boom voor de soort, boomstatus en het aanlegjaar.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          {
            label: "Monumentaal",
            type: "count-where",
            property: "BOOMSTATUS",
            equals: "monumentaal",
          },
          {
            label: "Herinneringsbomen",
            type: "count-where",
            property: "BOOMSTATUS",
            equals: "herinneringsboom",
          },
          { label: "Boomsoorten (NL)", type: "distinct", property: "NAAMNL" },
        ],
      },
      {
        kind: "category-bar",
        title: "Boomstatus van de gemeentelijke bijzondere bomen in {city}",
        description:
          "Het veld BOOMSTATUS onderscheidt monumentale, waardevolle en herinneringsbomen",
        property: "BOOMSTATUS",
        maxCategories: 4,
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten in {city}",
        description:
          "Het veld NAAMNL: de Nederlandse soortnaam van de gemeentelijke bijzondere bomen",
        property: "NAAMNL",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een bijzondere boom die de gemeente in eigendom en beheer heeft. De **boomstatus** loopt van *monumentaal* (de zwaarst beschermde categorie) via *waardevol* naar *herinneringsboom*, bijvoorbeeld bomen die bij een gebeurtenis zijn geplant. De soortenlijst wordt in {city} sterk gedomineerd door de zomereik, met daarnaast veel beuken en linden — kenmerkend voor het Overijsselse landschap.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Zorgplicht**: als eigenaar heeft de gemeente een wettelijke zorgplicht; monumentale bomen vragen extra inspectie (boomveiligheidscontrole) en gericht onderhoud.\n- **Leefbaarheid**: het bomenbestand bepaalt straatbeeld, schaduw en verkoeling; bij hittegolven maken volwassen bomen een meetbaar verschil.\n- **Beleidskeuzes**: bij herinrichting en kap-herplant staat behoud van bijzondere bomen hoog op de agenda; deze laag maakt afwegingen concreet.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de service *Groenekaart* van Gemeente Zwolle GIS (laag gemeentelijke bomen). Dit is een groot bestand; de kaart laadt een uitsnede binnen een maximum, dus het getal hierboven kan lager zijn dan het totaal in de hele gemeente. De statistieken gaan over de geladen bomen in het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — bomen en groen",
        url: "https://www.zwolle.nl/bomen",
      },
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Groenekaart/MapServer",
      },
    ],
  },
  {
    layerId: "civiele-kunstwerken",
    title: "Civiele kunstwerken in {city}",
    subtitle:
      "Bruggen, tunnels, duikers en viaducten uit het gemeentelijk beheerbestand",
    intro:
      "Deze laag toont **{count} civiele kunstwerken** binnen het kaartgebied van {city}: bruggen, tunnels, duikers, viaducten en andere door mensen gebouwde infrastructuur die de gemeente beheert. \"Kunstwerk\" is hier de civieltechnische term voor een constructie in de openbare ruimte, niet een kunstobject. Elk kunstwerk heeft een type, bouwmateriaal en (waar bekend) een aanlegjaar.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kunstwerken in beeld", type: "count" },
          { label: "Soorten kunstwerk", type: "distinct", property: "BORNAME" },
          {
            label: "Betonnen constructies",
            type: "count-where",
            property: "BOUWMATERIAAL",
            equals: ["beton", "Beton", "beton/metselwerk", "beton/staal"],
          },
          {
            label: "Mediane bouwjaar",
            type: "median",
            property: "AANLEGJAAR",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Type kunstwerk in {city}",
        description:
          "Het veld BORNAME: de civieltechnische typering uit het beheerbestand",
        property: "BORNAME",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Bouwmateriaal van de kunstwerken in {city}",
        description:
          "Het veld BOUWMATERIAAL (schrijfwijzen variëren in de brondata)",
        property: "BOUWMATERIAAL",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk object is een civiel kunstwerk uit het beheerbestand. De typering (*BORNAME*) loopt uiteen van **liggerbruggen** en **plaatbruggen** tot **duikers en kokers** (buizen waar water onder een weg door loopt) en **tunnels**. Een deel is nog als *Uitzoeken* gemarkeerd — objecten waarvan de typering nog niet is vastgesteld. Het **bouwmateriaal** is overwegend beton, met daarnaast veel houten en stalen constructies; let op dat schrijfwijzen (\"beton\" vs \"Beton\") in de brondata door elkaar lopen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vervangingsopgave**: veel naoorlogse kunstwerken naderen het einde van hun technische levensduur; landelijk speelt een grote vervangings- en renovatieopgave. Het bouwjaar helpt die planning te onderbouwen.\n- **Bereikbaarheid en veiligheid**: bruggen en tunnels zijn schakels in het netwerk; onderhoud of afsluiting heeft directe gevolgen voor verkeer en hulpdiensten.\n- **Beheerbudget**: type en materiaal bepalen sterk de inspectie- en onderhoudskosten.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de service *Kunstwerken* van Gemeente Zwolle GIS. Sommige velden (zoals *AANLEGJAAR*, *MONUMENT* en *STATUS*) zijn niet voor elk object ingevuld; ontbrekende waarden worden automatisch uit de statistieken gelaten. Een enkel bouwjaar kan in de toekomst liggen wanneer het om een gepland kunstwerk gaat. De aantallen betreffen het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Kunstwerken/MapServer",
      },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "lichtmasten",
    title: "Lichtmasten in {city}",
    subtitle:
      "Gemeentelijke straatverlichting met mast-, armatuur- en lamptype",
    intro:
      "Deze laag toont **{count} lichtmasten** binnen het kaartgebied van {city}: de openbare straatverlichting die de gemeente beheert, tot in detail met masttype, armatuur en lamptype. Van elke lichtmast is bekend aan welke straat hij staat en met welk volgnummer. Klik op een punt voor de technische specificaties.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Lichtmasten in beeld", type: "count" },
          { label: "Straten", type: "distinct", property: "STRAAT" },
          { label: "Masttypen", type: "distinct", property: "MASTTYPE" },
          { label: "Lamptypen", type: "distinct", property: "LAMPTYPE" },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende masttypen in {city}",
        description: "Het veld MASTTYPE: de constructie en hoogte van de mast",
        property: "MASTTYPE",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende lamptypen in {city}",
        description:
          "Het veld LAMPTYPE: de toegepaste lichtbron (overwegend LED)",
        property: "LAMPTYPE",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één lichtmast. De laag is opvallend gedetailleerd: naast de locatie zijn het **masttype** (bijvoorbeeld een aluminium mast van 4 meter), het **armatuurtype** en het **lamptype** vastgelegd. Aan de lamptypen is de energietransitie in de verlichting goed af te lezen — de meest voorkomende bronnen zijn LED-armaturen, terwijl oudere gasontladingslampen steeds verder worden uitgefaseerd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energie en duurzaamheid**: openbare verlichting is een substantiële post op de gemeentelijke energierekening; verLEDding en dimmen verlagen verbruik en lichthinder fors.\n- **Sociale veiligheid**: goede verlichting op de juiste plekken vergroot het veiligheidsgevoel; gaten in het net zijn hiermee op te sporen.\n- **Beheer en storingen**: een compleet mastenbestand met type-informatie is de basis voor onderhoud, vervanging en het afhandelen van storingsmeldingen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de service *Lichtmasten* van Gemeente Zwolle GIS. Het volledige bestand bevat tienduizenden masten; de kaart laadt een uitsnede binnen een maximum, dus het getal en de \"top\"-typen hierboven gaan over de geladen masten in het kaartgebied van {city}, niet over de hele gemeente.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Lichtmasten/MapServer",
      },
      {
        label: "Gemeente Zwolle — straatverlichting",
        url: "https://www.zwolle.nl/",
      },
    ],
  },
  {
    layerId: "regenbui-stroombanen",
    title: "Stroombanen bij zware regen in {city}",
    subtitle:
      "Gemodelleerde afstroomroutes van hemelwater over het maaiveld",
    intro:
      "Deze laag tekent **{count} stroombanen** binnen het kaartgebied van {city}: de routes waarlangs regenwater over het maaiveld naar beneden stroomt bij een zware bui. Ze komen uit een hydrologisch model dat het hoogteverloop van straten en terreinen volgt. Zo wordt zichtbaar waar water zich verzamelt en welke kant het op loopt voordat het het riool of een laagte bereikt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stroombanen in beeld", type: "count" },
          {
            label: "Belangrijke afstroomlijnen",
            type: "count-where",
            property: "class",
            equals: ["3", "4", "4.7"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zwaarte van de stroombanen in {city}",
        description:
          "Het veld class ordent de banen naar hoeveelheid afstromend water (hoger = meer accumulatie)",
        property: "class",
        maxCategories: 5,
        valueLabels: {
          "2": "Klasse 2 — fijnmazig",
          "3": "Klasse 3",
          "4": "Klasse 4",
          "4.7": "Klasse 4,7 — hoofdbaan",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Bij hevige neerslag kan het riool de hoeveelheid water niet direct verwerken; het overschot stroomt dan bovengronds langs de laagste route. Deze **stroombanen** maken die routes zichtbaar. Het veld *class* geeft een indicatie van de zwaarte: fijnmazige banen (de laagste klasse) vertakken overal, terwijl de hogere klassen de hoofdaders zijn waar veel water samenkomt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Wateroverlast voorkomen**: waar stroombanen samenkomen en door laagtes lopen, ontstaan de plassen en ondergelopen tunnels van een hoosbui. Dit is de kaart om kwetsbare plekken te herkennen.\n- **Klimaatadaptatie**: bij herinrichting kun je met deze routes rekening houden, bijvoorbeeld door water gericht naar wadi's of groen te leiden in plaats van naar woningen.\n- **Prioritering**: de zwaardere banen helpen bepalen waar maatregelen het meeste effect hebben.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de service *Regenbui* van Gemeente Zwolle GIS en is modeluitkomst, geen meting: de werkelijke afstroming hangt af van verharding, verstoppingen en de precieze bui. Het volledige model bevat zeer veel lijnsegmenten; de kaart laadt een uitsnede binnen een maximum, dus de aantallen en de klasseverdeling gaan over de geladen segmenten in het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Regenbui/MapServer",
      },
      {
        label: "Gemeente Zwolle — klimaatadaptatie",
        url: "https://www.zwolle.nl/",
      },
    ],
  },
  {
    layerId: "regenbui-t100-wegen",
    title: "Begaanbaarheid van wegen bij een T100-bui in {city}",
    subtitle:
      "Welke wegen blijven begaanbaar bij een extreme bui van 67 mm per uur",
    intro:
      "Deze laag kleurt **{count} wegvakken** binnen het kaartgebied van {city} naar hun begaanbaarheid bij een **T100-bui**: een extreme regenbui van ongeveer 67 mm per uur die statistisch eens in de honderd jaar voorkomt. Groen betekent begaanbaar, geel alleen voor calamiteitenverkeer en rood onbegaanbaar. Zo zie je welke routes bij zo'n stortbui uitvallen en welke beschikbaar blijven.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegvakken in beeld", type: "count" },
          {
            label: "Begaanbaar (aandeel)",
            type: "count-where",
            property: "SYM",
            equals: ["Begaanbaar", "Hoofdweg begaanbaar"],
            asShare: true,
          },
          {
            label: "Alleen calamiteitenverkeer",
            type: "count-where",
            property: "SYM",
            equals: [
              "Begaanbaar voor calamiteitenverkeer",
              "Hoofdweg begaanbaar voor calamiteitenverkeer",
            ],
          },
          {
            label: "Onbegaanbaar",
            type: "count-where",
            property: "SYM",
            equals: ["Onbegaanbaar", "Hoofdweg onbegaanbaar"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Begaanbaarheid van de wegvakken in {city}",
        description:
          "Het veld SYM combineert begaanbaarheid met het onderscheid hoofdweg / overige weg",
        property: "SYM",
        maxCategories: 6,
        valueLabels: {
          Begaanbaar: "Begaanbaar",
          "Hoofdweg begaanbaar": "Hoofdweg — begaanbaar",
          "Begaanbaar voor calamiteitenverkeer":
            "Alleen calamiteitenverkeer",
          "Hoofdweg begaanbaar voor calamiteitenverkeer":
            "Hoofdweg — calamiteitenverkeer",
          Onbegaanbaar: "Onbegaanbaar",
          "Hoofdweg onbegaanbaar": "Hoofdweg — onbegaanbaar",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk gekleurd wegvak is de modeluitkomst voor één scenario: hoeveel water er op de weg staat bij een T100-bui, en of dat de doorgang belemmert. **Begaanbaar** betekent dat gewoon verkeer erdoor kan; **begaanbaar voor calamiteitenverkeer** dat alleen hulpdiensten met verhoogde voertuigen er nog door kunnen; **onbegaanbaar** dat de weg blank staat. Het onderscheid *hoofdweg* laat zien of het om een belangrijke verbindingsroute gaat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid hulpdiensten**: als hoofdwegen bij een stortbui onbegaanbaar worden, komt de aanrijtijd van ambulance en brandweer in het geding — precies de wegvakken om te versterken.\n- **Klimaatadaptatie**: de kaart wijst de knelpunten aan waar drempels, extra kolken of waterberging het meeste verschil maken.\n- **Risicocommunicatie**: bewoners en bedrijven kunnen zien welke routes bij extreem weer kunnen uitvallen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de service *Regenbui* van Gemeente Zwolle GIS en is een modelresultaat voor een gestandaardiseerde bui, geen waarneming van een echte gebeurtenis. De werkelijkheid hangt af van lokale omstandigheden. De aantallen gaan over de geladen wegvakken in het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Regenbui/MapServer",
      },
      {
        label: "Klimaateffectatlas — wateroverlast",
        url: "https://www.klimaateffectatlas.nl/",
      },
    ],
  },
  {
    layerId: "wolk-stroombanen",
    title: "Wateraccumulatie-stroombanen in {city}",
    subtitle:
      "Waar hemelwater zich ophoopt bij pluviale (regen)overlast",
    intro:
      "Deze laag toont **{count} stroombanen** binnen het kaartgebied van {city} uit het model \"Wolk\": een berekening van hoe regenwater zich over het maaiveld verzamelt bij pluviale wateroverlast. Elke lijn heeft een *GRID_CODE* die aangeeft hoeveel water er stroomopwaarts op die baan samenkomt — hoe hoger het getal, hoe zwaarder de hoofdader.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stroombanen in beeld", type: "count" },
          {
            label: "Zwaardere hoofdbanen (GRID_CODE ≥ 5)",
            type: "count-where",
            property: "GRID_CODE",
            equals: ["5", "6", "7", "8", "9", "10", "11", "12"],
          },
        ],
      },
      {
        kind: "histogram",
        title: "Accumulatieklasse van de stroombanen in {city}",
        description:
          "Het veld GRID_CODE: relatieve hoeveelheid afstromend water (hoger = meer accumulatie)",
        property: "GRID_CODE",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Net als de reguliere regenbui-stroombanen laat deze laag zien waar water heen loopt, maar hier ligt de nadruk op **accumulatie**: het *GRID_CODE*-getal telt op hoeveel bovenstroomse oppervlak op een baan afwatert. Lage waarden zijn de talloze fijne begingeultjes; hoge waarden zijn de weinige hoofdaders waar al dat water samenkomt en waar bij een hoosbui het meeste water passeert.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Knelpunten vinden**: de hoofdaders met hoge accumulatie zijn de plekken waar water zich concentreert — vaak net vóór een laagte of tunnel waar het blijft staan.\n- **Ontwerp openbare ruimte**: door hoofdstroombanen ruimte te geven (groen, wadi's, brede goten) voorkom je dat het water woningen of kelders in loopt.\n- **Samenhang**: gecombineerd met de begaanbaarheidskaart en de reguliere stroombanen ontstaat een compleet beeld van het regenwatergedrag.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de service *Wolk* van Gemeente Zwolle GIS en is een hydrologische modeluitkomst op basis van het maaiveldhoogtemodel. Het volledige model bevat honderdduizenden segmenten; de kaart laadt een uitsnede binnen een maximum. De accumulatieverdeling hierboven is daardoor sterk afhankelijk van welk deel van {city} in beeld is en vertegenwoordigt niet automatisch de hele gemeente.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Wolk/MapServer",
      },
      {
        label: "Klimaateffectatlas — wateroverlast",
        url: "https://www.klimaateffectatlas.nl/",
      },
    ],
  },
  {
    layerId: "geluid-wegverkeer",
    title: "Geluidsbelasting door wegverkeer in {city}",
    subtitle:
      "Geluidscontouren van het wegverkeer, uitgedrukt in Lden (dB)",
    intro:
      "Deze laag toont **{count} geluidscontouren** door wegverkeer binnen het kaartgebied van {city}: zones die aangeven hoe hoog de geluidsbelasting van auto's, vrachtwagens en bussen is, uitgedrukt in **Lden** (het gemiddelde dag-avond-nachtniveau in decibel). Hoe hoger de klasse, hoe meer verkeerslawaai. De contouren maken zichtbaar welke wijken langs drukke wegen het meest belast worden.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Contourvlakken in beeld", type: "count" },
          {
            label: "Hoog belast (≥ 65 dB)",
            type: "count-where",
            property: "LEGENDA",
            equals: ["65 - 70 dB", "70 dB of meer"],
          },
          {
            label: "Zeer hoog (≥ 70 dB)",
            type: "count-where",
            property: "LEGENDA",
            equals: "70 dB of meer",
          },
          { label: "dB-klassen", type: "distinct", property: "LEGENDA" },
        ],
      },
      dbNoiseCategoryBar(
        "Geluidsklassen wegverkeer in {city}",
        "Het veld LEGENDA: de Lden-klasse van elk contourvlak"
      ),
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De kaart is opgebouwd uit gekleurde vlakken per **geluidsklasse**, van 45–50 dB tot 70 dB of meer. **Lden** telt het geluid over het etmaal, met een toeslag voor de avond en nacht omdat lawaai dan als hinderlijker wordt ervaren. De hoogste klassen liggen als smalle stroken direct langs de drukste wegen; verder van de weg neemt het geluid snel af.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: langdurige blootstelling aan verkeerslawaai hangt samen met slaapverstoring, stress en hart- en vaatziekten; boven bepaalde waarden gelden landelijke normen en inspanningsverplichtingen.\n- **Ruimtelijke ordening**: bij nieuwe woningen langs wegen moet met geluid rekening worden gehouden (geluidluwe gevels, schermen, afstand).\n- **Maatregelen**: stiller asfalt, lagere snelheden en schermen zijn af te wegen tegen de zwaarst belaste contouren.",
      },
      {
        heading: "Over de bron",
        body: "De contouren komen uit de service *Geluidsbelastingkaart* van Gemeente Zwolle GIS en zijn een modelberekening op basis van verkeersintensiteiten en wegkenmerken, geen directe meting. De aantallen tellen contourvlakken (geen oppervlakte) binnen het kaartgebied van {city}; een uitgestrekte zone en een klein snippertje tellen elk als één vlak.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Geluidsbelastingkaart/MapServer",
      },
      {
        label: "Atlas Leefomgeving — geluid",
        url: "https://www.atlasleefomgeving.nl/",
      },
    ],
  },
  {
    layerId: "geluid-treinverkeer",
    title: "Geluidsbelasting door treinverkeer in {city}",
    subtitle:
      "Geluidscontouren van het spoor, uitgedrukt in Lden (dB)",
    intro:
      "Deze laag toont **{count} geluidscontouren** door treinverkeer binnen het kaartgebied van {city}: zones die de geluidsbelasting van passerende treinen weergeven in **Lden** (decibel). Rond het spoor en de stationsomgeving liggen de zwaarst belaste stroken. De contouren laten zien hoe ver het spoorlawaai de omliggende wijken in reikt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Contourvlakken in beeld", type: "count" },
          {
            label: "Hoog belast (≥ 65 dB)",
            type: "count-where",
            property: "LEGENDA",
            equals: ["65 - 70 dB", "70 dB of meer"],
          },
          {
            label: "Zeer hoog (≥ 70 dB)",
            type: "count-where",
            property: "LEGENDA",
            equals: "70 dB of meer",
          },
          { label: "dB-klassen", type: "distinct", property: "LEGENDA" },
        ],
      },
      dbNoiseCategoryBar(
        "Geluidsklassen treinverkeer in {city}",
        "Het veld LEGENDA: de Lden-klasse van elk contourvlak"
      ),
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak hoort bij een **geluidsklasse** van 45–50 dB tot 70 dB of meer. Spoorlawaai heeft een ander karakter dan wegverkeer: het komt in pieken (een passerende trein) in plaats van een continue stroom, en wordt in **Lden** gemiddeld over het etmaal met extra gewicht voor avond en nacht. De zwaarste klassen liggen als een band direct langs de spoorbaan.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Wonen bij het spoor**: stationsomgevingen zijn gewild voor verdichting, maar juist daar is het geluid het hoogst; ontwerp en bouwkundige maatregelen moeten dat opvangen.\n- **Gezondheid**: net als bij wegverkeer geldt dat aanhoudend nachtelijk lawaai de slaap en gezondheid raakt.\n- **Samenwerking met ProRail**: geluidschermen en raildempers langs het spoor worden in overleg met de spoorbeheerder afgewogen.",
      },
      {
        heading: "Over de bron",
        body: "De contouren komen uit de service *Geluidsbelastingkaart* van Gemeente Zwolle GIS en zijn modelberekeningen op basis van treinintensiteiten en baankenmerken. De aantallen tellen contourvlakken (geen oppervlakte) binnen het kaartgebied van {city}; treinlawaai bestrijkt doorgaans een beperkter gebied dan wegverkeer, dus verwacht minder vlakken.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Geluidsbelastingkaart/MapServer",
      },
      {
        label: "Atlas Leefomgeving — geluid",
        url: "https://www.atlasleefomgeving.nl/",
      },
    ],
  },
  {
    layerId: "geluid-industrie",
    title: "Geluidsbelasting door industrie in {city}",
    subtitle:
      "Geluidscontouren van industrielawaai, uitgedrukt in Lden (dB)",
    intro:
      "Deze laag toont **{count} geluidscontouren** door industrie binnen het kaartgebied van {city}: zones rond bedrijventerreinen en geluidgezoneerde industrie waar het industrielawaai in beeld is gebracht in **Lden** (decibel). Anders dan verkeerslawaai concentreert dit geluid zich rond specifieke locaties. De contouren laten zien hoe ver de invloed van industrie richting woongebieden reikt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Contourvlakken in beeld", type: "count" },
          {
            label: "Hoog belast (≥ 60 dB)",
            type: "count-where",
            property: "LEGENDA",
            equals: ["60 - 65 dB", "65 - 70 dB", "70 dB of meer"],
          },
          { label: "dB-klassen", type: "distinct", property: "LEGENDA" },
        ],
      },
      dbNoiseCategoryBar(
        "Geluidsklassen industrie in {city}",
        "Het veld LEGENDA: de Lden-klasse van elk contourvlak"
      ),
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De vlakken geven per **geluidsklasse** aan hoe zwaar het industrielawaai is. Rond gezoneerde industrieterreinen geldt vaak een wettelijke **geluidzone**: buiten die zone mag de gezamenlijke industrie een bepaalde waarde niet overschrijden. Deze laag is doorgaans een stuk kleiner dan die van weg- en treinverkeer, omdat industrielawaai zich rond enkele locaties concentreert in plaats van langs lange lijnen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimte voor bedrijven én wonen**: de geluidzone bepaalt hoeveel geluidruimte bedrijven hebben en hoe dicht woningbouw kan naderen — een klassiek spanningsveld bij binnenstedelijke transformatie.\n- **Vergunningen**: nieuwe of uitbreidende bedrijven moeten binnen de beschikbare geluidruimte passen.\n- **Leefkwaliteit**: aanhoudend laagfrequent industriegeluid wordt door omwonenden vaak als hinderlijk ervaren.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De contouren komen uit de service *Geluidsbelastingkaart* van Gemeente Zwolle GIS en zijn modelberekeningen. Omdat industrielawaai lokaal is, kan deze laag in een gegeven kaartuitsnede weinig of geen vlakken bevatten; het getal {count} is dan navenant laag. De aantallen betreffen het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Geluidsbelastingkaart/MapServer",
      },
      {
        label: "Atlas Leefomgeving — geluid",
        url: "https://www.atlasleefomgeving.nl/",
      },
    ],
  },
  {
    layerId: "swt-locaties",
    title: "Locaties van sociale wijkteams in {city}",
    subtitle:
      "Vindplaatsen van de sociale wijkteams, per wijkteamgebied",
    intro:
      "Deze laag toont **{count} locaties** van sociale wijkteams binnen het kaartgebied van {city}: de plekken — vaak wijkcentra en buurthuizen — waar inwoners terechtkunnen met vragen over zorg, welzijn, opvoeding, schulden of eenzaamheid. Elke locatie hoort bij een wijkteamgebied (Noord, Oost, Zuid, West of Midden). Klik op een punt voor naam en adres.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Locaties in beeld", type: "count" },
          { label: "Wijkteamgebieden", type: "distinct", property: "OMSCHRIJVING" },
        ],
      },
      {
        kind: "category-bar",
        title: "Locaties per wijkteamgebied in {city}",
        description:
          "Het veld OMSCHRIJVING: het gebied waaronder de locatie valt",
        property: "OMSCHRIJVING",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een fysieke locatie waar het sociaal wijkteam spreekuur houdt of gevestigd is. Sociale wijkteams zijn het laagdrempelige eerste aanspreekpunt in het sociaal domein: ze bieden hulp dichtbij, wijzen de weg naar voorzieningen en schakelen waar nodig door naar specialistische zorg. Het veld *OMSCHRIJVING* koppelt de locatie aan een van de wijkteamgebieden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toegankelijke zorg**: de spreiding van locaties bepaalt hoe makkelijk kwetsbare inwoners hulp kunnen vinden, juist voor wie minder mobiel is.\n- **Wijkgericht werken**: de indeling in gebieden sluit aan op andere wijkvoorzieningen en maakt samenwerking met scholen, huisartsen en woningcorporaties overzichtelijk.\n- **Beleid sociaal domein**: inzicht in aanwezigheid per gebied helpt bij het afwegen waar extra inzet nodig is.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de service *SWT* van Gemeente Zwolle GIS. Het gaat om een beperkt aantal, zorgvuldig onderhouden locaties; de aantallen betreffen de locaties binnen het kaartgebied van {city}. Combineer deze laag met de laag *Sociaal Wijkteam Gebieden* om de bijbehorende werkgebieden te zien.",
      },
    ],
    links: [
      {
        label: "Sociale wijkteams Zwolle",
        url: "https://www.swteams.nl/",
      },
      { label: "Gemeente Zwolle — zorg en ondersteuning", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "swt-gebieden",
    title: "Werkgebieden van sociale wijkteams in {city}",
    subtitle:
      "De gebiedsindeling waarin de sociale wijkteams werken",
    intro:
      "Deze laag toont **{count} werkgebieden** van de sociale wijkteams binnen het kaartgebied van {city}: de vlakken die de gemeente opdelen in wijkteamgebieden zoals Noord, Oost, Zuid, West en Midden. Samen vormen ze de organisatorische kaart van het sociaal domein — elk gebied heeft een eigen team dat de inwoners daar ondersteunt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebieden in beeld", type: "count" },
          {
            label: "Unieke gebiedsnamen",
            type: "distinct",
            property: "OMSCHRIJVING",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is het werkgebied van één sociaal wijkteam. Waar de puntenlaag *Sociaal Wijkteam Locaties* laat zien wáár je het team kunt vinden, laat deze laag zien wélk gebied elk team bedient. De gebieden zijn zo getekend dat ze samen de hele gemeente dekken, zonder gaten of overlap.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Heldere verantwoordelijkheid**: de indeling maakt eenduidig welk team voor welke buurt aanspreekbaar is — belangrijk voor inwoners én ketenpartners.\n- **Sturing en spreiding**: door caseload en problematiek per gebied te bekijken, kan de gemeente capaciteit gerichter verdelen.\n- **Koppeling met data**: de gebiedsgrenzen zijn een handige eenheid om andere sociaal-maatschappelijke cijfers op te aggregeren.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de service *SWT* van Gemeente Zwolle GIS (laag gebieden). Het betreft een klein, vast aantal gebiedsvlakken; elk gebied komt precies één keer voor. De aantallen betreffen het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Sociale wijkteams Zwolle",
        url: "https://www.swteams.nl/",
      },
      { label: "Gemeente Zwolle — zorg en ondersteuning", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "toegankelijkheid",
    title: "Toegankelijkheidsmeldingen in {city}",
    subtitle:
      "Door bewoners gemelde knelpunten in de toegankelijkheid van de openbare ruimte",
    intro:
      "Deze laag toont **{count} toegankelijkheidsmeldingen** binnen het kaartgebied van {city}: plekken waar inwoners een knelpunt in de openbare ruimte hebben gemeld, zoals een ontbrekende blindengeleidelijn, een te hoge stoeprand of obstakels op het trottoir. Elke melding heeft een omschrijving van het probleem (het veld *WAT*), een locatie en een status. Klik op een punt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meldingen in beeld", type: "count" },
          {
            label: "Nog openstaand",
            type: "count-where",
            property: "STATUS",
            equals: ["Melding", "Opgeslagen"],
          },
          {
            label: "Afgehandeld",
            type: "count-where",
            property: "STATUS",
            equals: "Afgemeld",
          },
          { label: "Locaties", type: "distinct", property: "LOCATIE" },
        ],
      },
      {
        kind: "category-bar",
        title: "Status van de toegankelijkheidsmeldingen in {city}",
        description:
          "Het veld STATUS: van nieuwe melding tot afgehandeld (afgemeld)",
        property: "STATUS",
        maxCategories: 5,
        valueLabels: {
          Melding: "Nieuwe melding",
          Opgeslagen: "In behandeling / opgeslagen",
          Afgemeld: "Afgehandeld (afgemeld)",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een concreet, door een inwoner gemeld toegankelijkheidsprobleem. De omschrijvingen zijn vaak heel specifiek — een ontbrekende geleidelijn bij een oversteek, palen te dicht op geleidetegels, of geen voelbaar onderscheid tussen trottoir en fietspad. Het veld **STATUS** laat de voortgang zien: van een nieuwe *Melding* via *Opgeslagen* (in behandeling) naar *Afgemeld* (afgehandeld).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Inclusieve stad**: een toegankelijke openbare ruimte is essentieel voor mensen met een visuele, motorische of andere beperking; het VN-verdrag Handicap verplicht overheden hierin actief te zijn.\n- **Van melding naar maatregel**: de meldingen vormen een concrete werklijst voor beheer en herinrichting — juist de kleine ingrepen (een verlaagde band, een geleidelijn) maken groot verschil.\n- **Participatie**: de laag laat zien dat inwoners meedenken over hun leefomgeving; de verhouding open/afgehandeld geeft een indruk van de doorlooptijd.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de service *Toegankelijkheid_publiek* van Gemeente Zwolle GIS. Het zijn burgermeldingen: de dekking is niet volledig (niet elk knelpunt wordt gemeld) en de omschrijvingen zijn in de woorden van de melder. Het datumveld is niet altijd ingevuld. De aantallen betreffen het kaartgebied van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — melding openbare ruimte",
        url: "https://www.zwolle.nl/melding-doen",
      },
      {
        label: "Gemeente Zwolle — geoservices",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Toegankelijkheid_publiek/MapServer",
      },
    ],
  },
];
