/**
 * Story maps — batch "amsterdam-1": gemeentelijke open-data lagen van Amsterdam.
 * Lagen: ams-bomen, ams-openbaresportplek, ams-sportparken, ams-monumenten,
 * ams-afvalcontainers, ams-lichtpunten, ams-bouwstroompunten, ams-rioolleidingen,
 * ams-bodem-grond, ams-bodem-grondwater, ams-bodem-asbest,
 * ams-historische-bodemonderzoeken, ams-historische-dempingen-ophogingen.
 *
 * Alle lagen komen uit de DSO-API WFS van gemeente Amsterdam
 * (https://api.data.amsterdam.nl/v1/wfs/) en zijn alleen zichtbaar binnen Amsterdam.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "ams-bomen",
    title: "Bomen in {city}",
    subtitle:
      "De stamgegevens van de gemeentelijke bomen: soort, hoogteklasse en aanlegjaar",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} bomen** geladen uit het gemeentelijke bomenbestand. Elke stip is één geregistreerde boom in beheer van de gemeente, met soortnaam, hoogteklasse, standplaats en het jaar van aanplant. Klik op een boom voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          { label: "Boomgeslachten", type: "distinct", property: "soortnaam_top" },
          { label: "Botanische soorten", type: "distinct", property: "soortnaam" },
          {
            label: "Oudste aanplant (jaar)",
            type: "min",
            property: "jaar_van_aanleg",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomgeslachten in {city}",
        description:
          "Veld soortnaam_top: het geslacht (bijv. Linde, Esdoorn, Eik) van de geregistreerde bomen",
        property: "soortnaam_top",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Hoogteklassen van de bomen",
        description:
          "Veld boomhoogteklasse_actueel: de actuele hoogte van de boom, ingedeeld in klassen",
        property: "boomhoogteklasse_actueel",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een individuele boom uit de beheerregistratie van de gemeente. Het veld *soortnaam_top* groepeert bomen op geslacht (zoals *Linde (Tilia)* of *Eik (Quercus)*), terwijl *soortnaam* de precieze botanische soort geeft. De **hoogteklasse** is een actuele meting in stappen van enkele meters; klassen als *Niet te beoordelen* betekenen dat de boom (nog) niet is opgemeten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: bomen geven schaduw en verkoeling; de soort- en hoogteverdeling laat zien hoeveel volgroeid kroonvolume een wijk heeft.\n- **Biodiversiteit**: een gevarieerde soortensamenstelling maakt het bomenbestand robuuster tegen ziekten en plagen (denk aan iepziekte of essentaksterfte).\n- **Beheer**: leeftijd (aanlegjaar) en hoogteklasse sturen onderhoud, snoeicycli en vervangingsplanning.",
      },
      {
        heading: "Over de bron",
        body: "De bomen komen uit het open-databestand *Bomen* van gemeente Amsterdam (DSO-API WFS). De kaart toont bomen binnen de kaartuitsnede van {city}; bij grote aantallen wordt een deel van het bestand geladen, dus de statistieken beschrijven de zichtbare selectie en niet noodzakelijk het volledige areaal.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Bomen (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/bomen/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-openbaresportplek",
    title: "Openbare sportplekken in {city}",
    subtitle:
      "Vrij toegankelijke sportvoorzieningen in de openbare ruimte",
    intro:
      "Deze laag toont **{count} openbare sportplekken** binnen het kaartgebied van {city}: vrij toegankelijke voorzieningen in de buitenruimte, van voetbalveldjes en basketbalpleinen tot tafeltennistafels en fitnesstoestellen. Elke stip is één plek, met het type sportvoorziening en of hij overdekt is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Sportplekken in beeld", type: "count" },
          {
            label: "Soorten voorziening",
            type: "distinct",
            property: "sportvoorziening",
          },
          {
            label: "Voetbalplekken",
            type: "count-where",
            property: "sportvoorziening",
            equals: "Voetbal",
          },
          {
            label: "Overdekt",
            type: "count-where",
            property: "indicatie_overdekt",
            equals: "Ja",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Type sportvoorziening in {city}",
        description:
          "Veld sportvoorziening: het soort sport dat op de plek beoefend kan worden",
        property: "sportvoorziening",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een openbare, vrij toegankelijke sportplek — geen sportvereniging of afgesloten complex, maar een voorziening in de openbare ruimte die iedereen kan gebruiken. Het veld *sportvoorziening* beschrijft wat je er kunt doen; verreweg de meeste plekken zijn niet overdekt (*indicatie_overdekt* = Nee).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid en bewegen**: laagdrempelige beweegplekken in de buurt stimuleren dagelijkse beweging, zeker voor jongeren en mensen zonder sportabonnement.\n- **Spreiding**: de kaart laat zien of elke wijk voldoende en gevarieerd sportaanbod dichtbij heeft.\n- **Inrichting openbare ruimte**: bij herinrichting of nieuwbouw helpt dit om te bepalen waar aanvullende voorzieningen nodig zijn.",
      },
      {
        heading: "Over de bron",
        body: "De sportplekken komen uit het open-databestand *Sport* van gemeente Amsterdam. Getoond wordt de kaartuitsnede van {city}; plekken net buiten de uitsnede tellen niet mee in de aantallen.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Sport (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/sport/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-sportparken",
    title: "Sportparken in {city}",
    subtitle: "Sportparken en -complexen als vlakken, met hun oppervlakte",
    intro:
      "Deze laag tekent **{count} sportparken** binnen het kaartgebied van {city}: de vlakken van sportcomplexen met velden, banen en bijbehorende terreinen. Anders dan losse sportplekken gaat het hier om hele complexen; elk vlak heeft een oppervlakte en omtrek.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Sportparken in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "oppervlakte",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde oppervlakte",
            type: "avg",
            property: "oppervlakte",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Grootste park",
            type: "max",
            property: "oppervlakte",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Oppervlakteverdeling van sportparken in {city}",
        description:
          "Aantal sportparken per oppervlakteklasse (veld oppervlakte, in m²)",
        property: "oppervlakte",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een sportpark of -complex: een aaneengesloten terrein voor sport, met velden, banen en voorzieningen. De **oppervlakte** en **omtrek** worden rechtstreeks uit de geometrie afgeleid. Grote parken kunnen meerdere verenigingen en velden herbergen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtebeslag**: sportparken leggen een fors beslag op de stedelijke ruimte; hun oppervlakte is relevant bij verdichtings- en transformatievraagstukken.\n- **Voorzieningenniveau**: de spreiding en omvang laten zien of het georganiseerde sportaanbod in balans is met de bevolkingsomvang per stadsdeel.\n- **Meervoudig gebruik**: groene sportterreinen spelen ook een rol in waterberging, hittebestrijding en ecologie.",
      },
      {
        heading: "Over de bron",
        body: "De sportparken komen uit het open-databestand *Sport* van gemeente Amsterdam. De statistieken gaan over de kaartuitsnede van {city}; een park dat de rand van de uitsnede kruist telt mee met zijn volledige geregistreerde oppervlakte.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Sport (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/sport/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-monumenten",
    title: "Monumenten in {city}",
    subtitle:
      "Rijks- en gemeentelijke monumenten als puntlocaties",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} monumenten**: beschermde panden, bouwwerken, beeldhouwkunst en terreinen die als rijksmonument of gemeentelijk monument zijn aangewezen. Elke stip toont het monumenttype, de status en — waar bekend — de oorspronkelijke functie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Monumenten in beeld", type: "count" },
          {
            label: "Rijksmonumenten",
            type: "count-where",
            property: "status",
            equals: "Rijksmonument",
          },
          {
            label: "Gemeentelijke monumenten",
            type: "count-where",
            property: "status",
            equals: "Gemeentelijk monument",
          },
          { label: "Monumenttypen", type: "distinct", property: "type" },
        ],
      },
      {
        kind: "category-bar",
        title: "Beschermingsstatus van monumenten in {city}",
        description:
          "Veld status: rijksmonument, gemeentelijk monument of in procedure",
        property: "status",
        maxCategories: 5,
      },
      {
        kind: "category-bar",
        title: "Type monument",
        description:
          "Veld type: de aard van het beschermde object",
        property: "type",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een aangewezen monument. De **status** onderscheidt *rijksmonumenten* (landelijke bescherming) van *gemeentelijke monumenten* (lokale bescherming); enkele objecten zijn nog *in procedure*. Het **type** loopt uiteen van panden (verreweg het talrijkst) tot losse bouwwerken, beeldhouwkunst en beschermde terreinen. Waar bekend geeft het veld *oorspronkelijke_functie* het historische gebruik.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Erfgoed en vergunningen**: bij verbouw of restauratie van een monument gelden strengere regels; deze kaart laat zien waar die spelen.\n- **Ruimtelijke kwaliteit**: monumentendichtheid kenmerkt historische kernen en bepaalt mede het karakter van een gebied.\n- **Toerisme en identiteit**: monumenten dragen bij aan de aantrekkelijkheid en beleving van de stad.",
      },
      {
        heading: "Over de bron",
        body: "De monumenten komen uit het open-databestand *Monumenten* van gemeente Amsterdam, als puntcoördinaten. De kaart toont de uitsnede van {city}; de puntlocatie is een representatiepunt van het object en niet de volledige begrenzing.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Monumenten (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/monumenten/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-afvalcontainers",
    title: "Afvalcontainers in {city}",
    subtitle:
      "Boven- en ondergrondse inzamelcontainers, per afvalfractie",
    intro:
      "Deze laag toont **{count} afvalcontainers** binnen het kaartgebied van {city}: de boven- en ondergrondse inzamelpunten voor huishoudelijk afval. Elke stip toont welke fractie er wordt ingezameld (rest, papier, glas, textiel …), de eigenaar en de plaatsingsdatum.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Containers in beeld", type: "count" },
          {
            label: "Afvalfracties",
            type: "distinct",
            property: "fractie_omschrijving",
          },
          {
            label: "Restafval",
            type: "count-where",
            property: "fractie_omschrijving",
            equals: "Rest",
          },
          {
            label: "Papier",
            type: "count-where",
            property: "fractie_omschrijving",
            equals: "Papier",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Containers per afvalfractie in {city}",
        description:
          "Veld fractie_omschrijving: het type afval dat de container inzamelt",
        property: "fractie_omschrijving",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een inzamelcontainer. Het veld *fractie_omschrijving* geeft de afvalstroom: *Rest* is veruit de grootste groep, gevolgd door *Papier* en *Glas*; daarnaast zijn er onder meer textiel-, brood- en GFT-containers. De registratie bevat ook plaatsings- en operationele datums en de eigenaar van de container.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Afvalscheiding**: de verhouding tussen rest- en scheidingscontainers laat zien hoe goed bewoners hun afval kunnen scheiden.\n- **Loopafstand**: de dichtheid van containers bepaalt hoe ver bewoners moeten lopen — een servicenorm die de gemeente hanteert.\n- **Beheer en vervanging**: plaatsings- en garantiedatums sturen onderhoud en vervanging van het containerpark.",
      },
      {
        heading: "Over de bron",
        body: "De containers komen uit het open-databestand *Huishoudelijk afval* van gemeente Amsterdam. Getoond wordt de kaartuitsnede van {city}; bij grote aantallen wordt een deel van het bestand geladen, dus de aantallen beschrijven de zichtbare selectie.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Huishoudelijk afval (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/huishoudelijkafval/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-lichtpunten",
    title: "Openbare verlichting in {city}",
    subtitle:
      "Lichtpunten van de openbare verlichting, met hun bouwtype",
    intro:
      "Deze laag toont **{count} lichtpunten** van de openbare verlichting binnen het kaartgebied van {city}: elke lantaarn, armatuur of overspanning met een mastcode en bouwtype. Samen vormen ze het netwerk dat straten, pleinen en paden 's avonds verlicht.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Lichtpunten in beeld", type: "count" },
          { label: "Bouwtypen", type: "distinct", property: "bouwtype" },
          {
            label: "Overspanningen",
            type: "count-where",
            property: "bouwtype",
            equals: "Overspanning",
          },
          {
            label: "Grondspots",
            type: "count-where",
            property: "bouwtype",
            equals: "Grondspot",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bouwtype van lichtpunten in {city}",
        description:
          "Veld bouwtype: hoe het lichtpunt is opgehangen of gemonteerd",
        property: "bouwtype",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één lichtpunt. Het **bouwtype** beschrijft de montagewijze: een *overspanning* hangt aan draden tussen gevels of masten, een *onderbouw* of *opbouw* staat op een mast, en een *grondspot* is in het maaiveld verwerkt. Elk punt heeft een unieke *mastcode* voor het beheer.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sociale veiligheid**: goede verlichting vergroot het veiligheidsgevoel; gaten in het netwerk zijn zo op te sporen.\n- **Energie en verduurzaming**: het lichtpuntenbestand is de basis voor ombouw naar led en dimbeleid.\n- **Beheer**: mastcodes en bouwtypen sturen onderhoud, inspectie en storingsafhandeling.",
      },
      {
        heading: "Over de bron",
        body: "De lichtpunten komen uit het open-databestand *Leidingen­infrastructuur* van gemeente Amsterdam. De kaart toont de uitsnede van {city}; bij grote aantallen wordt een deel geladen, dus de aantallen betreffen de zichtbare selectie.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Leidingeninfrastructuur (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/leidingeninfrastructuur/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-bouwstroompunten",
    title: "Bouwstroompunten in {city}",
    subtitle:
      "Vaste stroomaansluitingen voor bouwplaatsen, markten en evenementen",
    intro:
      "Deze laag toont **{count} bouwstroompunten** binnen het kaartgebied van {city}: vaste aansluitpunten waar bouwplaatsen, markten en evenementen tijdelijk stroom kunnen afnemen zonder aggregaat. Elke stip toont de primaire functie, de aansluitcapaciteit en hoe je toegang krijgt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bouwstroompunten in beeld", type: "count" },
          {
            label: "Primaire functies",
            type: "distinct",
            property: "primaire_functie",
          },
          {
            label: "Voor markten",
            type: "count-where",
            property: "primaire_functie",
            equals: "Markt",
          },
          {
            label: "Voor evenementen",
            type: "count-where",
            property: "primaire_functie",
            equals: "Evenement",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Primaire functie van bouwstroompunten in {city}",
        description:
          "Veld primaire_functie: het hoofdgebruik waarvoor het punt bedoeld is",
        property: "primaire_functie",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een vast stroomafnamepunt in de openbare ruimte. De **primaire functie** laat zien waarvoor het punt vooral bedoeld is — de meeste dienen *markten* en *evenementen*, daarnaast zijn er walkasten en bouwaansluitingen. Per punt is vastgelegd wat de capaciteit is, welke aansluitingen beschikbaar zijn en via welke *toegangswijze* je stroom kunt afnemen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Schoon en stil**: vaste aansluitingen vervangen dieselaggregaten, wat geluid en uitstoot bij evenementen en markten vermindert.\n- **Vergunningen en logistiek**: organisatoren kunnen vooraf zien of er op locatie voldoende capaciteit beschikbaar is.\n- **Verduurzaming openbare ruimte**: het netwerk van bouwstroompunten ondersteunt de overgang naar emissieloos bouwen en organiseren.",
      },
      {
        heading: "Over de bron",
        body: "De bouwstroompunten komen uit het gelijknamige open-databestand van gemeente Amsterdam. Getoond wordt de kaartuitsnede van {city}. Dit is een relatief kleine, specialistische laag; het aantal punten in beeld kan daardoor beperkt zijn.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Bouwstroompunten (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/bouwstroompunten/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-rioolleidingen",
    title: "Rioolleidingen in {city}",
    subtitle:
      "Het rioolnetwerk van Waternet: type leiding, materiaal en diameter",
    intro:
      "Deze laag tekent **{count} rioolleidingen** binnen het kaartgebied van {city}: de ondergrondse buizen van het rioolnetwerk zoals Waternet ze beheert. Elke lijn heeft een leidingtype (vuilwater, hemelwater, gemengd …), een materiaal, een diameter en een stelseltype.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Leidingen in beeld", type: "count" },
          {
            label: "Leidingtypen",
            type: "distinct",
            property: "type_leiding",
          },
          {
            label: "Gemiddelde diameter",
            type: "avg",
            property: "diameter",
            unit: "mm",
            decimals: 0,
          },
          { label: "Materialen", type: "distinct", property: "materiaal" },
        ],
      },
      {
        kind: "category-bar",
        title: "Type rioolleiding in {city}",
        description:
          "Veld type_leiding: de functie van de leiding binnen het rioolstelsel",
        property: "type_leiding",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Leidingmateriaal",
        description:
          "Veld materiaal: het materiaal waarvan de leiding is gemaakt",
        property: "materiaal",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is één rioolleiding. Het **type leiding** onderscheidt onder meer *vuilwaterriool*, *hemelwaterriool*, *gemengd riool*, perceelaansluitingen en persleidingen; het **stelseltype** geeft aan of vuil- en regenwater gescheiden of gemengd worden afgevoerd. Het **materiaal** (veelal PVC of beton) en de **diameter** in millimeters zeggen iets over leeftijd en capaciteit.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatbestendigheid**: het aandeel gescheiden stelsel (aparte hemelwaterriolen) bepaalt hoe goed de stad hevige buien kan verwerken zonder overstort of wateroverlast.\n- **Vervangingsopgave**: materiaal en aanlegjaar sturen de miljoeneninvesteringen in rioolvervanging.\n- **Graafwerk**: bij werkzaamheden aan de ondergrond is de ligging van leidingen essentieel om schade te voorkomen.",
      },
      {
        heading: "Over de bron",
        body: "De rioolleidingen komen uit het open-databestand *Leidingen­infrastructuur* (Waternet) van gemeente Amsterdam. De kaart toont de uitsnede van {city}; bij grote aantallen wordt een deel geladen. Leidingen die de rand kruisen tellen mee met hun volledige geregistreerde gegevens.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Leidingeninfrastructuur (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/leidingeninfrastructuur/",
      },
      { label: "Waternet", url: "https://www.waternet.nl/" },
    ],
  },
  {
    layerId: "ams-bodem-grond",
    title: "Bodemonderzoek grond in {city}",
    subtitle:
      "Analyseresultaten van grondmonsters uit historische bodemonderzoeken",
    intro:
      "Deze laag toont **{count} boorpunten** met grondmonsters binnen het kaartgebied van {city}. Elk punt is een grondmonster uit een bodemonderzoek, geanalyseerd op onder meer zware metalen, PAK, minerale olie, PCB en EOX. Het veld *eindoordeel* vat samen of de gemeten waarden landelijke normen overschrijden.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Grondmonsters in beeld", type: "count" },
          {
            label: "Boven interventiewaarde",
            type: "count-where",
            property: "eindoordeel",
            equals: ">I",
          },
          {
            label: "Sterk verontreinigd (aandeel)",
            type: "count-where",
            property: "eindoordeel",
            equals: ">I",
            asShare: true,
          },
          {
            label: "Typen onderzoek",
            type: "distinct",
            property: "type_onderzoek",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Eindoordeel van grondmonsters in {city}",
        description:
          "Veld eindoordeel: hoogste normoverschrijding van het monster (Wet bodembescherming)",
        property: "eindoordeel",
        valueLabels: {
          ">S": "Boven streef-/achtergrondwaarde",
          ">T": "Boven tussenwaarde",
          ">I": "Boven interventiewaarde (sterk)",
          "-": "Niet geanalyseerd / geen overschrijding",
          "": "Onbekend",
        },
      },
      {
        kind: "category-bar",
        title: "Type bodemonderzoek",
        description:
          "Veld type_onderzoek: de fase/aard van het onderzoek waaruit het monster komt",
        property: "type_onderzoek",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een grondmonster met analyseresultaten. Het **eindoordeel** volgt de toetsingskaders van de Wet bodembescherming: *>S* betekent boven de streef- of achtergrondwaarde (lichte verontreiniging), *>T* boven de tussenwaarde, en *>I* boven de interventiewaarde (sterke verontreiniging waarvoor sanering in beeld kan komen). Een streepje (*-*) betekent dat er geen overschrijding is of dat de stof niet is geanalyseerd. Per monster zijn ook de losse concentraties (lood, zink, koper, PAK, minerale olie …) beschikbaar.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bouwen en graven**: bij grondverzet en herontwikkeling bepaalt de bodemkwaliteit of grond hergebruikt of afgevoerd moet worden.\n- **Gezondheid**: sterk verontreinigde locaties kunnen gebruiksbeperkingen krijgen, zeker bij wonen, moestuinen of speelplekken.\n- **Historie van de plek**: verontreiniging hangt vaak samen met voormalig industrieel gebruik; deze punten helpen dat in beeld te brengen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De grondmonsters komen uit het open-databestand *Bodem* van gemeente Amsterdam en betreffen historische onderzoeken van uiteenlopende datum en kwaliteit. Let op:\n- Een monster is een momentopname op één plek en diepte; de bodem ernaast kan afwijken.\n- Ontbrekende of niet-geanalyseerde stoffen zijn met een streepje aangeduid.\n- De statistieken gaan over de kaartuitsnede van {city} en de geladen selectie, niet over de hele stad.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Bodem (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/bodem/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-bodem-grondwater",
    title: "Grondwaterkwaliteit in {city}",
    subtitle:
      "Analyseresultaten van grondwatermonsters uit bodemonderzoeken",
    intro:
      "Deze laag toont **{count} boorpunten** met grondwatermonsters binnen het kaartgebied van {city}. Elk punt is een peilbuismonster, geanalyseerd op onder meer vluchtige organische chloorstoffen (VOCl), aromaten (BTEX), zware metalen, minerale olie, chloride en pH. Het veld *eindoordeel* vat de normtoetsing samen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Grondwatermonsters in beeld", type: "count" },
          {
            label: "Boven interventiewaarde",
            type: "count-where",
            property: "eindoordeel",
            equals: ">I",
          },
          {
            label: "Sterk verontreinigd (aandeel)",
            type: "count-where",
            property: "eindoordeel",
            equals: ">I",
            asShare: true,
          },
          {
            label: "Mediane pH",
            type: "median",
            property: "waarde_ph",
            decimals: 1,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Eindoordeel van grondwatermonsters in {city}",
        description:
          "Veld eindoordeel: hoogste normoverschrijding van het monster (Wet bodembescherming)",
        property: "eindoordeel",
        valueLabels: {
          ">S": "Boven streefwaarde",
          ">T": "Boven tussenwaarde",
          ">I": "Boven interventiewaarde (sterk)",
          "-": "Niet geanalyseerd / geen overschrijding",
          "": "Onbekend",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een grondwatermonster uit een peilbuis. Het **eindoordeel** toetst de gemeten stoffen aan de normen: *>S* is boven de streefwaarde (lichte verontreiniging), *>T* boven de tussenwaarde en *>I* boven de interventiewaarde (sterke verontreiniging). Een streepje (*-*) betekent geen overschrijding of niet geanalyseerd. Per monster zijn de losse gehalten beschikbaar, inclusief chloorhoudende oplosmiddelen, benzeen en de zuurgraad (pH).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verspreiding**: grondwaterverontreinigingen kunnen zich verplaatsen; sterke overschrijdingen vragen soms om monitoring of beheersing.\n- **Onttrekking en bemaling**: bij bronbemaling voor bouwputten is de grondwaterkwaliteit bepalend voor lozing en afvoer.\n- **Drinkwater- en ecologiebescherming**: kwaliteit van het freatisch grondwater raakt aan natuur en waterbeheer.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De grondwatermonsters komen uit het open-databestand *Bodem* van gemeente Amsterdam en betreffen historische onderzoeken. Let op:\n- Grondwaterkwaliteit verandert in de tijd; een oud monster hoeft niet de huidige situatie te beschrijven.\n- De pH-mediaan wordt berekend over de geladen monsters met een geregistreerde waarde.\n- De statistieken gaan over de kaartuitsnede van {city} en de geladen selectie.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Bodem (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/bodem/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-bodem-asbest",
    title: "Asbest in de bodem van {city}",
    subtitle:
      "Asbestmetingen in grond en puin per monster en boordiepte",
    intro:
      "Deze laag toont **{count} asbestmonsters** binnen het kaartgebied van {city}: metingen naar asbest in grond en puin, verzameld bij bodemonderzoeken. Elk punt registreert het onderzochte materiaal, het monstertype en de gemeten concentratie op een bepaalde boordiepte.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Asbestmonsters in beeld", type: "count" },
          {
            label: "Mengmonsters",
            type: "count-where",
            property: "type_monster",
            equals: "Mengmonster",
          },
          {
            label: "Losse monsters",
            type: "count-where",
            property: "type_monster",
            equals: "Monster",
          },
          {
            label: "Onderzochte locaties",
            type: "distinct",
            property: "locatie",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Type asbestmonster in {city}",
        description:
          "Veld type_monster: mengmonster (samengesteld) of los monster",
        property: "type_monster",
        maxCategories: 4,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een monster dat op asbest is onderzocht. Een **mengmonster** is samengesteld uit meerdere deelmonsters (efficiënt voor een eerste screening), terwijl een los **monster** één specifieke plek en diepte betreft. Per punt is de *waarde_concentratie* op een boortraject (van *bovenkant* tot *onderkant*) vastgelegd; negatieve waarden duiden op een meting onder de detectiegrens.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid en veiligheid**: asbest in de bodem vormt een risico bij graven en verwaaien; aangetroffen locaties krijgen extra maatregelen.\n- **Grondverzet**: asbestverdachte of -houdende grond mag niet zomaar worden hergebruikt en vraagt aparte afvoer.\n- **Historie**: asbest hangt vaak samen met puin, sloop en dempingen; deze metingen helpen risicogebieden af te bakenen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De asbestmonsters komen uit het open-databestand *Bodem* van gemeente Amsterdam. Een monster zegt alleen iets over de onderzochte plek en diepte; de afwezigheid van een punt betekent niet dat er geen asbest kan zitten. De statistieken gaan over de kaartuitsnede van {city} en de geladen selectie.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Bodem (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/bodem/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-historische-bodemonderzoeken",
    title: "Historische bodemonderzoeken in {city}",
    subtitle:
      "Vlakken van uitgevoerde bodemonderzoeken met rapportgegevens",
    intro:
      "Deze laag toont **{count} historische bodemonderzoeken** binnen het kaartgebied van {city}: de onderzochte gebieden met rapportnaam, datum, opdrachtgever en een indicatie van de betrouwbaarheid. Samen laten ze zien waar in de stad de ondergrond al eens is onderzocht.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Onderzoeken in beeld", type: "count" },
          {
            label: "Opdrachtgevers",
            type: "distinct",
            property: "opdrachtgever",
          },
          {
            label: "Hoogste kwaliteitsindicatie",
            type: "count-where",
            property: "indicatie_kwaliteit",
            equals: "+++",
          },
          {
            label: "Uitvoerende bureaus",
            type: "distinct",
            property: "opdrachtnemer",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kwaliteitsindicatie van onderzoeken in {city}",
        description:
          "Veld indicatie_kwaliteit: inschatting van de betrouwbaarheid/volledigheid van het onderzoek",
        property: "indicatie_kwaliteit",
        valueLabels: {
          "+++": "Hoog (+++)",
          "++": "Middel (++)",
          "+": "Basis (+)",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is het gebied van een uitgevoerd bodemonderzoek. De registratie bevat de *naam_rapport*, het *datum_rapport*, de *opdrachtgever* en *opdrachtnemer*, en vaak een permalink naar het rapport in het archief. De **kwaliteitsindicatie** (*+++* tot *+*) geeft een grove inschatting van hoe betrouwbaar of volledig het onderzoek is. Het veld *type_onderzoek* somt de onderwerpen op (bodemkwaliteit, archeologie, oorlogsresten, obstakels …), vaak meerdere tegelijk.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vooronderzoek**: bij nieuwe plannen bespaart bestaand onderzoek tijd en geld — je ziet meteen waar al gegevens beschikbaar zijn.\n- **Kennisleemtes**: witte vlekken op de kaart tonen waar de ondergrond nog niet is onderzocht.\n- **Kwaliteitsweging**: de indicatie helpt beoordelen of oud onderzoek nog bruikbaar is of dat aanvullend werk nodig is.",
      },
      {
        heading: "Over de bron",
        body: "De onderzoeken komen uit het open-databestand *Historische bodeminformatie* van gemeente Amsterdam. Het zijn samenvattende metagegevens van rapporten, geen meetwaarden zelf. De statistieken gaan over de kaartuitsnede van {city}; een onderzoeksvlak dat de rand kruist telt volledig mee.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Historische bodeminformatie (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/historische_bodeminformatie/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
  {
    layerId: "ams-historische-dempingen-ophogingen",
    title: "Historische dempingen en ophogingen in {city}",
    subtitle:
      "Gedempte sloten en opgehoogde terreinen uit historisch bodemonderzoek",
    intro:
      "Deze laag toont **{count} historische dempingen en ophogingen** binnen het kaartgebied van {city}: plekken waar in het verleden sloten zijn gedempt of terreinen zijn opgehoogd, vaak met onbekend of gemengd materiaal. Elke vlek heeft een categorie, een beschrijving en — waar bekend — een periode.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vlakken in beeld", type: "count" },
          {
            label: "Dempingen",
            type: "count-where",
            property: "categorie",
            equals: "Demping",
          },
          {
            label: "Ophogingen",
            type: "count-where",
            property: "categorie",
            equals: "Ophoging",
          },
          {
            label: "Vroegste startjaar",
            type: "min",
            property: "van_minimaal_jaar",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Categorie van historische bodemingrepen in {city}",
        description:
          "Veld categorie: het type historische ingreep in de ondergrond",
        property: "categorie",
        valueLabels: {
          Demping: "Demping (gedempte sloot/water)",
          Ophoging: "Ophoging (opgehoogd terrein)",
          Dijk: "Dijk",
          "Depot/stort": "Depot / stort",
        },
        maxCategories: 5,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een historische ingreep in de ondergrond. Een **demping** is een voormalige sloot of watergang die met grond of puin is dichtgemaakt; een **ophoging** is een terrein dat is opgehoogd, bijvoorbeeld vóór bebouwing. Daarnaast zijn er dijken en oude depots/storten. De velden *van_minimaal_jaar* en *tot_maximaal_jaar* geven de (soms ruime) periode waarin de ingreep plaatsvond, met een verwijzing naar historische bronnen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bodemroerende werkzaamheden**: in dempingen en ophogingen zit vaak onbekend materiaal — puin, afval of verontreinigde grond — wat extra alertheid vraagt bij graven.\n- **Zettingsrisico**: opgehoogde en gedempte gronden kunnen ongelijkmatig inklinken, met gevolgen voor funderingen en riolering.\n- **Bodemkwaliteit**: deze plekken zijn logische kandidaten voor aanvullend bodemonderzoek voordat ergens wordt gebouwd.",
      },
      {
        heading: "Over de bron",
        body: "De vlakken komen uit het open-databestand *Historische bodeminformatie* van gemeente Amsterdam, gereconstrueerd uit historische kaarten en bronnen. Het gaat om indicaties: de begrenzing en periode zijn benaderingen. De statistieken gaan over de kaartuitsnede van {city}; een vlak dat de rand kruist telt volledig mee.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data — Historische bodeminformatie (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/historische_bodeminformatie/",
      },
      { label: "data.amsterdam.nl", url: "https://data.amsterdam.nl/" },
    ],
  },
];
