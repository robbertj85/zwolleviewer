/**
 * Story maps — batch "rotterdam-3": gemeentelijke open-datalagen van Rotterdam.
 * Lagen: rtd-peilgebieden, rtd-bedrijvigheid, rtd-bomenkaart,
 * rtd-natuur-verbindingen, rtd-natuur-ambities, rtd-natuurparels,
 * rtd-kapvergunningen, rtd-religieuze-gebouwen, rtd-bruggen, rtd-speellocaties,
 * rtd-bgt-electrakasten, rtd-gevaarlijke-straten, rtd-boorputten,
 * rtd-bodemkwaliteit, rtd-loodonderzoek, rtd-riool-buizen.
 *
 * Alle lagen komen uit de ArcGIS-omgeving van Gemeente Rotterdam
 * (services.arcgis.com/zP1tGdLpGvt2qNJ6) en zijn alleen in Rotterdam zichtbaar.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "rtd-peilgebieden",
    title: "Peilgebieden en polderpeil in {city}",
    subtitle:
      "Vastgestelde streefpeilen (m NAP) van het polderwaterstelsel",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} peilgebieden** uit de polderpeilkaart van de gemeente. Een peilgebied is een aaneengesloten stuk polder waarvoor één streefpeil is vastgesteld: de waterstand die het waterschap er via gemalen en stuwen probeert te handhaven. De kleur van elk vlak volgt het vastgestelde peil in meters ten opzichte van NAP.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Peilgebieden in beeld", type: "count" },
          {
            label: "Gemiddeld streefpeil",
            type: "avg",
            property: "IWS_GPGVAS",
            unit: "m NAP",
            decimals: 2,
          },
          {
            label: "Laagste streefpeil",
            type: "min",
            property: "IWS_GPGVAS",
            unit: "m NAP",
            decimals: 2,
          },
          {
            label: "Hoogste streefpeil",
            type: "max",
            property: "IWS_GPGVAS",
            unit: "m NAP",
            decimals: 2,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van streefpeilen in {city}",
        description:
          "Aantal peilgebieden per klasse van het vastgestelde streefpeil (veld IWS_GPGVAS, m NAP)",
        property: "IWS_GPGVAS",
        unit: "m NAP",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een peilgebied met een vastgesteld streefpeil (*IWS_GPGVAS*, in meters t.o.v. NAP). In een laaggelegen delta als {city} liggen die peilen vrijwel overal onder NAP — vaak enkele meters. Naast elkaar liggende gebieden met een groot peilverschil verraden een polderscheiding: een kade of gemaal houdt het waterpeil aan weerszijden verschillend.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Waterbeheer**: het streefpeil bepaalt hoeveel drooglegging er onder maaiveld is en dus hoe kwetsbaar een gebied is voor wateroverlast of juist droogte.\n- **Bouwen en funderingen**: het peil is medebepalend voor grondwaterstanden en daarmee voor houten paalfunderingen en zettingen.\n- **Klimaatadaptatie**: bij hevige neerslag en langdurige droogte staan streefpeilen onder druk; de kaart laat zien welke polders welk peil aanhouden.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam en geeft de vastgestelde peilbesluiten weer. De statistieken gelden voor de kaartuitsnede van {city}; peilgebieden die de rand kruisen tellen volledig mee. Niet elk gebied heeft een ingevulde naam — de duiding leunt daarom op het streefpeil, dat wel overal geregistreerd is.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Peilgebieden (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Peilgebieden_polderpeil_Rotterdam/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-bedrijvigheid",
    title: "Bedrijvigheid en bedrijventerreinen in {city}",
    subtitle: "Geregistreerde vestigingen op de bedrijven- en industrielocaties",
    intro:
      "Deze laag toont **{count} vestigingen** binnen het kaartgebied van {city} uit het gemeentelijke bestand *Bedrijvigheid*. Het bestand is gericht op de bedrijven- en industrielocaties van de stad: elke stip is een geregistreerde vestiging met adres, buurt en het gebied waarin ze valt. Zo zie je in één oogopslag waar de economische activiteit zich concentreert.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vestigingen in beeld", type: "count" },
          { label: "Gebieden", type: "distinct", property: "GEBIED" },
          { label: "Buurten", type: "distinct", property: "BUURT" },
        ],
      },
      {
        kind: "category-bar",
        title: "Vestigingen per gebied in {city}",
        description:
          "Gemeentelijk veld GEBIED: het stadsgebied waarin de vestiging valt",
        property: "GEBIED",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Vestigingen per buurt in {city}",
        description: "De buurten met de meeste geregistreerde vestigingen",
        property: "BUURT",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een geregistreerde vestiging. Het bestand is opgebouwd rond de bedrijven- en industrieterreinen van de stad, dus de puntenwolk volgt vooral de haven- en bedrijvenzones en niet de gewone winkelstraten. De velden *GEBIED* en *BUURT* plaatsen elke vestiging in de gebiedsindeling van de gemeente.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Economisch beleid**: de spreiding over gebieden en buurten laat zien welke terreinen dragend zijn voor de lokale werkgelegenheid.\n- **Ruimtelijke afweging**: bij transformatie van bedrijventerrein naar wonen is het belangrijk te weten hoeveel en welke bedrijvigheid er zit.\n- **Milieu en veiligheid**: concentraties van bedrijvigheid bepalen mede waar geluid-, geur- en veiligheidscontouren spelen.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam. De cijfers gaan over de kaartuitsnede van {city}, niet per se over de hele gemeente; bij grote bestanden wordt bovendien een deel van de vestigingen geladen, dus de aantallen per gebied zijn indicatief voor de verdeling, niet noodzakelijk een volledige telling.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bedrijvigheid (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Bedrijvigheid/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-bomenkaart",
    title: "De bomenkaart van {city}",
    subtitle: "Individuele bomen met geregistreerde hoogte (peiljaar 2018)",
    intro:
      "Deze laag tekent **{count} bomen** binnen het kaartgebied van {city} uit de volledige bomeninventarisatie van de gemeente (peiljaar 2018, ruim een half miljoen bomen stadsbreed). Elke stip is één boom, met een geregistreerde hoogte. Doordat het bestand zo groot is, wordt in de kaart een deel geladen — genoeg om de patronen van het stedelijk groen goed te zien.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          {
            label: "Gemiddelde hoogte",
            type: "avg",
            property: "H_Boom",
            unit: "m",
            decimals: 1,
          },
          {
            label: "Hoogste boom",
            type: "max",
            property: "H_Boom",
            unit: "m",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Hoogteverdeling van bomen in {city}",
        description:
          "Aantal bomen per hoogteklasse (veld H_Boom, meter), peiljaar 2018",
        property: "H_Boom",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een individuele boom met een gemeten hoogte (*H_Boom*, in meters). Lage waarden horen bij jonge aanplant of laagblijvende soorten; de staart naar boven zijn de volwassen laanbomen en solitairen. De hoogteverdeling zegt daarmee iets over de leeftijdsopbouw en het volume van het bomenbestand.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaat en hitte**: hogere, volgroeide bomen leveren veruit de meeste schaduw en verkoeling; hun aandeel is een maat voor de kwaliteit van de groenstructuur.\n- **Beheer**: een gezond bomenbestand kent een mix van jong en oud; een scheve leeftijdsopbouw voorspelt toekomstige vervangingsgolven.\n- **Leefbaarheid en waarde**: straatbomen dragen aantoonbaar bij aan luchtkwaliteit, waterberging en vastgoedwaarde.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De inventarisatie heeft peiljaar 2018; sindsdien zijn er bomen geveld en bijgeplant, dus voor de allernieuwste situatie is de kaart een momentopname. Doordat het bestand honderdduizenden bomen telt, wordt maar een deel geladen: de aantallen gaan over die selectie binnen de kaartuitsnede van {city}, terwijl de hoogteverdeling representatief blijft.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bomen 2018 (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Bomen_2018_hoogte/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-natuur-verbindingen",
    title: "Natuurverbindingen in {city}",
    subtitle: "Ecologische verbindingszones uit de Natuurkaart 2018",
    intro:
      "Deze laag toont **{count} natuurverbindingen** binnen het kaartgebied van {city}: de ecologische verbindingszones uit de Natuurkaart Rotterdam 2018. Het zijn de groenblauwe aders — boscorridors, oeverstroken, groene linten — die losse natuurgebieden met elkaar verbinden zodat planten en dieren zich door de stad kunnen verplaatsen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Verbindingen in beeld", type: "count" },
          { label: "Typen lint", type: "distinct", property: "Laag_naam" },
        ],
      },
      {
        kind: "category-bar",
        title: "Natuurverbindingen per type in {city}",
        description:
          "Veld Laag_naam uit de Natuurkaart: het type verbindingszone",
        property: "Laag_naam",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk element is een verbindingszone, ingedeeld naar type (*Laag_naam*). Een *droog lint* is een groene verbinding over land, een *gradiëntrijk lint* combineert nat en droog met veel soortenrijkdom, en *grote tuinen* zijn particuliere groengebieden die als stapsteen dienen. Samen vormen ze het netwerk waarlangs soorten zich verspreiden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Biodiversiteit**: losse natuureilandjes verarmen; verbindingen houden populaties met elkaar in contact en veerkrachtig.\n- **Groen-blauwe structuur**: verbindingszones combineren vaak natuur met wateropgave, recreatie en verkoeling.\n- **Ruimtelijke bescherming**: door verbindingen expliciet op de kaart te zetten kan de gemeente ze meewegen bij nieuwe plannen en ze niet ongemerkt doorsnijden.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de Natuurkaart Rotterdam 2018 in de open GIS-omgeving van de gemeente. Het is een beleids- en visiekaart: de begrenzingen zijn indicatief en niet perceelscherp. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Natuurkaart Verbindingen (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Natuurkaart_Rotterdam_2018_Verbindingen/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-natuur-ambities",
    title: "Natuurambities en -kansen in {city}",
    subtitle: "Beleidsambities voor versterking van de natuurstructuur",
    intro:
      "Deze laag markeert **{count} gebieden** binnen het kaartgebied van {city} waar de Natuurkaart Rotterdam 2018 een ambitie of kans voor natuurversterking benoemt. Het is een beleidslaag: geen bestaande natuur, maar plekken waar de gemeente ruimte ziet om de natuurstructuur te verbeteren — door vergroening, natuurvriendelijke oevers of het dichten van gaten in het netwerk.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Ambitiegebieden in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gebied waar de Natuurkaart een kans of ambitie voor natuurversterking legt. Het gaat om een intentie, niet om een vastgelegde begrenzing of een uitgevoerd project: de kaart wijst de plekken aan waar winst te behalen valt. Inhoudelijke kenmerken per vlak zijn beperkt geregistreerd, dus dit verhaal blijft bij het aantal en de ligging.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Prioritering**: de kaart helpt bij het kiezen waar vergroeningsbudget het meeste ecologisch effect heeft.\n- **Koppelkansen**: ambitiegebieden vallen vaak samen met opgaven voor water, klimaatadaptatie en herinrichting — één ingreep kan meerdere doelen dienen.\n- **Continuïteit**: door ambities vast te leggen blijven ze meewegen in latere plannen, ook als de personele bezetting wisselt.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de Natuurkaart Rotterdam 2018 (open GIS-omgeving gemeente). Het is nadrukkelijk een visiekaart met indicatieve vlakken; er is geen juridische status aan verbonden. De telling geldt voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Natuurkaart Ambities (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Natuurkaart_Rotterdam_2018_Ambities_en_kansen/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-natuurparels",
    title: "Natuurparels in {city}",
    subtitle: "Kleinschalige hotspots van biodiversiteit",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} natuurparels**: bijzondere, vaak kleine natuurgebiedjes die de Natuurkaart apart uitlicht als hotspots van biodiversiteit. Denk aan een oud parkbosje, een bijzondere oever of een verrassend soortenrijk hoekje in de stad. Elke parel heeft een naam en een korte, publieksgerichte beschrijving.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Natuurparels in beeld", type: "count" },
          { label: "Unieke namen", type: "distinct", property: "naam" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een natuurparel met een eigen naam (*naam*) en meestal een korte beschrijving. Het zijn stuk voor stuk plekken die ecologisch of belevingsmatig uitspringen — juist omdat ze klein en soms verscholen zijn, is het waardevol dat ze expliciet in beeld staan.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bescherming**: kleine parels verdwijnen ongemerkt bij herinrichting; door ze te benoemen kan de gemeente ze bewust ontzien of versterken.\n- **Bewustwording**: de publieksbeschrijvingen maken natuur dichtbij zichtbaar en vergroten het draagvlak voor groen.\n- **Verbinding**: parels functioneren als stapstenen tussen grotere natuurgebieden en het netwerk van verbindingszones.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de Natuurkaart Rotterdam (open GIS-omgeving gemeente). Het is een selectie op basis van deskundig oordeel, geen uitputtende inventarisatie: er zijn ongetwijfeld meer waardevolle plekjes dan er als parel zijn aangemerkt. De telling geldt voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Natuurparels (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Natuurkaart_Rotterdam_Natuurparels/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-kapvergunningen",
    title: "Kapvergunningen voor bomen in {city}",
    subtitle: "Aangevraagde en verleende vellingen van openbare bomen",
    intro:
      "Deze laag toont **{count} kapvergunningen** binnen het kaartgebied van {city}: aangevraagde en verleende vergunningen om bomen in de openbare ruimte te vellen of ingrijpend te snoeien. Elke stip staat voor één boom met een lopende of afgeronde procedure, inclusief boomsoort en status van de vergunning.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vergunningen in beeld", type: "count" },
          {
            label: "Verleend",
            type: "count-where",
            property: "Status_kapvergunning",
            equals: "verleend",
          },
          {
            label: "Aangevraagd",
            type: "count-where",
            property: "Status_kapvergunning",
            equals: "aangevraagd",
          },
          { label: "Boomsoorten", type: "distinct", property: "BOOMSORTIMENT" },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest gekapte boomsoorten in {city}",
        description:
          "Veld BOOMSORTIMENT: de botanische soort waarvoor een kapvergunning loopt",
        property: "BOOMSORTIMENT",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Status van de kapvergunningen",
        description: "Veld Status_kapvergunning",
        property: "Status_kapvergunning",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één boom waarvoor een kapvergunning is aangevraagd (*aangevraagd*) of al is verleend (*verleend*). Het veld *BOOMSORTIMENT* geeft de botanische soort; de meeste maatregelen betreffen het verwijderen van de boom, een klein deel gaat om zwaar snoeien (kandelaberen).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Transparantie**: bewoners kunnen zien welke bomen in hun buurt op de nominatie staan en desgewenst bezwaar maken.\n- **Groenbalans**: het aantal en de soort gevelde bomen is samen met de herplantplicht een graadmeter voor het op peil houden van het bomenbestand.\n- **Ziekte en veiligheid**: pieken bij bepaalde soorten (zoals es) kunnen wijzen op boomziekten zoals essentaksterfte.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam en wordt regelmatig geactualiseerd (maandelijkse frequentie). Ze bevat zowel lopende aanvragen als reeds verleende vergunningen; een verleende vergunning betekent niet altijd dat de boom al is gekapt. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Kapvergunningen (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Kapvergunningen_bomen_openbaar/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-religieuze-gebouwen",
    title: "Religieuze gebouwen in {city}",
    subtitle: "Kerken, moskeeën, synagogen en hun monumentenstatus",
    intro:
      "Binnen het kaartgebied van {city} brengt deze laag **{count} religieuze gebouwen** in beeld: kerken, moskeeën, synagogen en andere gebedshuizen, met hun religie, huidige gebruik en eventuele monumentenstatus. Veel van deze panden zijn beeldbepalend voor de stad en hun toekomst is vaak onderwerp van ruimtelijke en erfgoeddiscussies.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebouwen in beeld", type: "count" },
          {
            label: "Rijksmonument",
            type: "count-where",
            property: "Monumentenstatus",
            equals: "rijksmonument",
          },
          {
            label: "Gemeentelijk monument",
            type: "count-where",
            property: "Monumentenstatus",
            equals: "gemeentelijk monument",
          },
          { label: "Wijken", type: "distinct", property: "Wijk" },
        ],
      },
      {
        kind: "category-bar",
        title: "Religieuze gebouwen per religie in {city}",
        description: "Veld Religie",
        property: "Religie",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Monumentenstatus van de gebouwen",
        description: "Veld Monumentenstatus",
        property: "Monumentenstatus",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk element is een religieus gebouw. Het veld *Religie* deelt ze in naar hoofdstroming (christendom, islam, jodendom of *geen* bij inmiddels herbestemde panden), en *Monumentenstatus* geeft aan of het pand beschermd is als rijks- of gemeentelijk monument, beeldbepalend object of geen. Ook het huidige gebruik is per gebouw vastgelegd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Erfgoed**: veel gebedshuizen zijn architectonisch en cultuurhistorisch waardevol; de monumentenstatus bepaalt hoeveel bescherming ze genieten.\n- **Herbestemming**: door ontkerkelijking komen panden vrij; inzicht in gebruik en status helpt bij zorgvuldige transformatie.\n- **Sociale kaart**: gebedshuizen zijn ontmoetingsplekken en spelen een rol in de sociale infrastructuur van wijken.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam en is samengesteld voor erfgoed- en beleidsdoeleinden. De classificaties (religie, gebruik, status) zijn handmatig ingevuld en kunnen voor individuele panden verouderd zijn. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Religieuze gebouwen (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Religieuze_gebouwen_publiek/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-bruggen",
    title: "Bruggen en kunstwerken in {city}",
    subtitle: "Beheerde bruggen en sluizen met bouwjaar en materiaal",
    intro:
      "Deze laag toont **{count} bruggen en waterbouwkundige kunstwerken** binnen het kaartgebied van {city}: ophaal- en basculebruggen, hef- en verkeersbruggen, en sluizen die de gemeente beheert. Per object zijn het type, het bouwmateriaal en het aanlegjaar geregistreerd — samen een beeld van de leeftijd en variatie van de Rotterdamse kunstwerken.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kunstwerken in beeld", type: "count" },
          {
            label: "Oudste bouwjaar",
            type: "min",
            property: "AANLEGJAAR",
          },
          {
            label: "Gemiddeld bouwjaar",
            type: "avg",
            property: "AANLEGJAAR",
            decimals: 0,
          },
          { label: "Objecttypen", type: "distinct", property: "OBJECTTYPE" },
        ],
      },
      {
        kind: "category-bar",
        title: "Kunstwerken per type in {city}",
        description:
          "Veld OBJECTTYPE: ophaalbrug, basculebrug, sluis, hefbrug, enzovoort",
        property: "OBJECTTYPE",
        maxCategories: 8,
      },
      {
        kind: "histogram",
        title: "Bouwjaar van de kunstwerken",
        description: "Aantal kunstwerken per bouwjaarklasse (veld AANLEGJAAR)",
        property: "AANLEGJAAR",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk element is een beheerd kunstwerk. Het veld *OBJECTTYPE* onderscheidt beweegbare bruggen (ophaal-, bascule-, hefbrug) van vaste verkeersbruggen en sluizen (schut- en keersluizen). *AANLEGJAAR* laat de leeftijd zien: van negentiende-eeuwse bruggen tot recente nieuwbouw, met het merendeel in staal uitgevoerd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Assetmanagement**: bouwjaar en materiaal bepalen de onderhouds- en vervangingsopgave; oude beweegbare bruggen zijn onderhoudsintensief.\n- **Bereikbaarheid**: bruggen en sluizen zijn schakels voor zowel weg- als scheepvaartverkeer; storingen hebben direct effect op doorstroming.\n- **Erfgoed**: sommige oude bruggen zijn beeldbepalend en cultuurhistorisch waardevol.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam en bevat de door de gemeente beheerde kunstwerken. Rijks- en provinciale kunstwerken of die van derden vallen er buiten. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bruggen (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Bruggen/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-speellocaties",
    title: "Speellocaties in {city}",
    subtitle: "Speeltuinen, schoolpleinen en trapvelden met bodemklasse",
    intro:
      "Deze laag toont **{count} speellocaties** binnen het kaartgebied van {city}: speeltuinen, schoolpleinen, kinderopvangterreinen en andere plekken waar kinderen spelen. Bijzonder aan dit bestand is de koppeling met bodemonderzoek — elke locatie heeft een kleurcode die aangeeft in hoeverre de bodemkwaliteit (met name lood) is onderzocht en op orde is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Speellocaties in beeld", type: "count" },
          {
            label: "Kleurcode 'Groen'",
            type: "count-where",
            property: "Kleurcode",
            equals: "Groen",
            asShare: true,
          },
          {
            label: "Soorten gebruik",
            type: "distinct",
            property: "Soort_Gevoelig_Gebruik",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Speellocaties per kleurcode in {city}",
        description:
          "Veld Kleurcode: samenvattende status van de bodem(lood)kwaliteit per locatie",
        property: "Kleurcode",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Type gevoelig gebruik van de locatie",
        description: "Veld Soort_Gevoelig_Gebruik",
        property: "Soort_Gevoelig_Gebruik",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een speellocatie, met een *Kleurcode* die de bodemstatus samenvat: *groen* betekent doorgaans dat de bodem is onderzocht en op orde of dat contact met de grond beperkt is; *oranje*, *geel* en *rood* wijzen op meer aandacht of nog lopend onderzoek; *grijs* en *blauw* markeren locaties zonder toegang of die niet zijn aangetroffen. Het veld *Soort_Gevoelig_Gebruik* geeft aan of het om een speelplaats, schoolplein, kinderopvang of scoutingterrein gaat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Kindergezondheid**: jonge kinderen zijn extra gevoelig voor lood in de bodem; juist op speelplekken is een goede bodemkwaliteit belangrijk.\n- **Prioritering onderzoek**: de kleurcodes laten zien waar nog onderzoek of maatregelen nodig zijn.\n- **Communicatie**: de kaart maakt voor ouders en beheerders transparant wat er over een specifieke speelplek bekend is.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam en hangt samen met het gemeentelijke loodprogramma. De kleurcode is een samenvattend oordeel; de onderliggende onderzoeken kunnen dateren en per locatie verschillen. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Speellocaties (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Locatiegrenzen_Speellocaties_221027/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-bgt-electrakasten",
    title: "Elektrakasten in {city}",
    subtitle: "Openbare straatkasten uit de Basisregistratie Grootschalige Topografie",
    intro:
      "Deze laag toont **{count} elektrakasten** binnen het kaartgebied van {city}: de straatkasten en verdeelkasten in de openbare ruimte, zoals geregistreerd in de Basisregistratie Grootschalige Topografie (BGT). Het zijn de onopvallende grijze kasten langs stoep en fietspad die stroom verdelen voor verlichting, verkeersregelingen en aansluitingen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Elektrakasten in beeld", type: "count" },
          {
            label: "Bronhouder gemeente",
            type: "count-where",
            property: "BRONHOUDER",
            equals: "Rotterdam (G)",
            asShare: true,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een elektrakast uit de BGT. In de BGT zijn deze objecten als één klasse (*Kast*) geregistreerd met een topografische ligging; inhoudelijke kenmerken zoals functie of vermogen zijn in dit publieke bestand niet ingevuld. Het veld *BRONHOUDER* laat wel zien wie de kast in de BGT bijhoudt — vrijwel altijd de gemeente, een enkele keer de provincie.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer openbare ruimte**: elektrakasten horen bij het areaal dat de gemeente onderhoudt en inspecteert.\n- **Ruimtelijke inpassing**: bij herinrichting van straten moet met de ligging van kasten rekening worden gehouden.\n- **Volledigheid BGT**: als wettelijke basisregistratie is de BGT het referentiebestand waarop veel andere kaarten voortbouwen.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de BGT via de open GIS-omgeving van Gemeente Rotterdam. Omdat de BGT een topografische registratie is, ligt de nadruk op ligging en niet op technische eigenschappen; een inhoudelijke uitsplitsing is daarom niet mogelijk. De telling geldt voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — BGT Elektrakasten (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/BGT_electra_kasten/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-gevaarlijke-straten",
    title: "Verkeersonveilige straten in {city}",
    subtitle: "Door de gemeente aangemerkte onveilige wegvakken",
    intro:
      "Deze laag markeert **{count} wegvakken** binnen het kaartgebied van {city} die de gemeente heeft aangemerkt als verkeersonveilig — met of zonder lopende aanpak. Het is een beleidslaag die de aandachtslocaties van het verkeersveiligheidsbeleid zichtbaar maakt: de straten waar op basis van ongevallen, meldingen of inrichting extra maatregelen nodig zijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Onveilige wegvakken in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een wegvak dat als verkeersonveilig is aangemerkt. Het bestand bevat de geometrie van deze aandachtslocaties; nadere kenmerken zijn in dit publieke bestand niet uitgesplitst, dus dit verhaal blijft bij het aantal en de ligging. De laagnaam maakt wel duidelijk dat het zowel om straten mét als zónder lopende aanpak gaat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: het in beeld brengen van risicolocaties is de eerste stap naar gericht ingrijpen (Duurzaam Veilig, risicogestuurd beleid).\n- **Prioritering**: de kaart helpt bepalen waar herinrichting, snelheidsremmers of oversteekvoorzieningen het hardst nodig zijn.\n- **Verantwoording**: door onveilige straten expliciet te benoemen kan de voortgang van de aanpak worden gevolgd.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam. Het is een beleidsmatige selectie: dat een straat niet is opgenomen betekent niet automatisch dat die veilig is, en de status kan veranderen zodra maatregelen zijn uitgevoerd. De telling geldt voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Gevaarlijke straten (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Gevaarlijke_straten_met_en_zonder_aanpak/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-boorputten",
    title: "Boorputten in de ondergrond van {city}",
    subtitle: "Diepe boringen naar olie, gas en de geologie (NLOG)",
    intro:
      "Deze laag toont **{count} boorputten** binnen het kaartgebied van {city}: diepe boringen die zijn geregistreerd voor olie- en gaswinning, exploratie en geologisch onderzoek. Het gaat nadrukkelijk om diepe mijnbouwboringen (tot vele kilometers) uit de landelijke registratie, niet om ondiepe grondwaterpeilbuizen. Per put zijn doel, status en diepte vastgelegd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Boorputten in beeld", type: "count" },
          {
            label: "Gemiddelde diepte",
            type: "avg",
            property: "Boorgatdie",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Grootste diepte",
            type: "max",
            property: "Boorgatdie",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Boorputten per doel in {city}",
        description:
          "Veld Boorgatdoe: het doel van de boring (winning, exploratie, observatie, verkenning)",
        property: "Boorgatdoe",
        maxCategories: 7,
      },
      {
        kind: "category-bar",
        title: "Status van de boorputten",
        description:
          "Veld Boorgatsta: de huidige toestand van de put (o.a. verlaten, in productie, geobserveerd)",
        property: "Boorgatsta",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een geregistreerde boorput. Het veld *Boorgatdoe* laat het doel zien — het merendeel betreft de ontwikkeling of exploratie van koolwaterstoffen (olie/gas). *Boorgatsta* toont de status: veel putten zijn inmiddels definitief afgesloten (*Abandoned*) of tijdelijk buiten gebruik (*Suspended*), een deel is nog in productie of dient voor observatie. De diepte (*Boorgatdie*) loopt van ondiep tot meerdere kilometers.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ondergrondgebruik**: boorputten claimen ruimte in de diepe ondergrond en zijn relevant voor toekomstig gebruik zoals geothermie of opslag.\n- **Veiligheid en beheer**: afgesloten putten moeten blijvend goed zijn afgedicht; hun ligging is van belang bij graaf- en bouwwerkzaamheden.\n- **Energietransitie**: kennis van bestaande boringen helpt bij het beoordelen van kansen voor aardwarmte.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam en is gebaseerd op de landelijke registratie van boringen (NLOG). Een deel van de kenmerken is niet voor elke put ingevuld. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Boorputten (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Boorputten_Rotterdam/FeatureServer",
      },
      { label: "NLOG — Nederlands Olie- en Gasportaal", url: "https://www.nlog.nl/" },
    ],
  },
  {
    layerId: "rtd-bodemkwaliteit",
    title: "Indicatieve bodemkwaliteit in {city}",
    subtitle: "Bodemkwaliteitsklassen per gebied (kaart 2014)",
    intro:
      "Deze laag deelt het kaartgebied van {city} op in **{count} zones** met een indicatieve bodemkwaliteit, gebaseerd op de bodemkwaliteitskaart 2014. Per zone is een functie én een bodemkwaliteitsklasse vastgelegd — van schoon (natuur) tot sterk verontreinigd (industrie). Het is de basiskaart die bepaalt welke grond waar mag worden hergebruikt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zones in beeld", type: "count" },
          {
            label: "Klasse Wonen",
            type: "count-where",
            property: "Functie",
            equals: "Wonen (Licht verontreinigd)",
            asShare: true,
          },
          {
            label: "Klasse Industrie",
            type: "count-where",
            property: "Functie",
            equals: "Industrie (Matig verontreinigd)",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemfunctie/-kwaliteit per zone in {city}",
        description:
          "Veld Functie: de toegekende bodemfunctieklasse met bijbehorende kwaliteit",
        property: "Functie",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Kwaliteitsklasse van de bovengrond (laag 1)",
        description: "Veld BKW_L1: bodemkwaliteitsklasse van de bovenste laag",
        property: "BKW_L1",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een zone met een indicatieve bodemkwaliteit. Het veld *Functie* combineert de gebruiksfunctie met een kwaliteitslabel (bijvoorbeeld *Wonen (licht verontreinigd)* of *Industrie (matig verontreinigd)*). De velden *BKW_L1* en *BKW_L2* geven de klasse van respectievelijk de boven- en ondergrond, wat relevant is bij grondverzet.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Grondverzet**: de bodemkwaliteitskaart bepaalt welke vrijgekomen grond elders mag worden toegepast, zonder dat telkens apart onderzoek nodig is.\n- **Ruimtelijke plannen**: bij functiewijziging (bijvoorbeeld van industrie naar wonen) moet de bodem passend zijn of worden gesaneerd.\n- **Historie**: de verontreinigingsgraad weerspiegelt de industriële en havengeschiedenis van de stad.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag is de indicatieve bodemkwaliteitskaart uit **2014** (open GIS-omgeving gemeente). Het is een gebiedsdekkende inschatting op basis van statistiek, geen perceelsonderzoek: voor een concrete locatie blijft actueel bodemonderzoek leidend. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Bodemkwaliteitskaart 2014 (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Indicatieve_Bodem_Kwaliteidskaart_2014/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-loodonderzoek",
    title: "Loodonderzoek in de bodem van {city}",
    subtitle: "Onderzochte locaties met risicoscore voor lood",
    intro:
      "Deze laag toont **{count} locaties** binnen het kaartgebied van {city} waar de bodem op lood is beoordeeld of onderzocht: woonblokken, kinderopvang, stadslandbouw en andere gevoelige plekken. Per locatie is een risicoscore bepaald op basis van gemeten loodgehalten en de bouwperiode. Lood in de bodem is vooral schadelijk voor jonge kinderen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Locaties in beeld", type: "count" },
          {
            label: "Risicoverdacht",
            type: "count-where",
            property: "Verdacht_f",
            equals: "Ja",
            asShare: true,
          },
          { label: "Wijken", type: "distinct", property: "WIJKNAAM" },
        ],
      },
      {
        kind: "category-bar",
        title: "Totaalscore lood per locatie in {city}",
        description:
          "Veld Totaal_sco: samengestelde risicoscore (hoger = meer aandacht nodig)",
        property: "Totaal_sco",
        valueLabels: {
          "0": "0 — laagste",
          "6": "6 — hoogste",
        },
      },
      {
        kind: "category-bar",
        title: "Bodemfunctie van de onderzochte locaties",
        description: "Veld Functie",
        property: "Functie",
        maxCategories: 5,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een beoordeelde locatie. Het veld *Verdacht_f* geeft aan of de plek als risicoverdacht is aangemerkt, en *Totaal_sco* vat het risico samen in een score (opgebouwd uit onder meer gemeten loodpercentielen en bouwperiode): hoe hoger, hoe meer aandacht nodig is. Het veld *Functie* laat zien om wat voor gebruik het gaat, met een sterk accent op woon- en verblijfslocaties.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid van kinderen**: lood remt de ontwikkeling van jonge kinderen; onderzoek richt zich daarom op plekken waar zij veel in contact met grond komen.\n- **Gerichte aanpak**: de scores helpen bepalen waar sanering, afdekken of voorlichting prioriteit heeft.\n- **Transparantie**: bewoners kunnen zien of en hoe hun omgeving is beoordeeld.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de open GIS-omgeving van Gemeente Rotterdam en hoort bij het gemeentelijke loodprogramma. De score is een risico-inschatting op gebiedsniveau; voor een individuele tuin of speelplek blijft specifiek onderzoek nodig. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Loodonderzoek (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Loodonderzoek_op_de_kaart/FeatureServer",
      },
    ],
  },
  {
    layerId: "rtd-riool-buizen",
    title: "Het rioolstelsel van {city}",
    subtitle: "Rioolbuizen met materiaal, type en aanlegjaar",
    intro:
      "Deze laag tekent **{count} riool­strengen** binnen het kaartgebied van {city}: de buizen van het gemeentelijke rioolstelsel, uit het beheerregister. Per streng zijn materiaal, buistype (vorm en diameter), functie en aanlegjaar vastgelegd. Samen vormen ze het grotendeels onzichtbare netwerk dat afval- en regenwater onder de stad afvoert.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Riool­strengen in beeld", type: "count" },
          {
            label: "Totale lengte",
            type: "sum",
            property: "LENGTE_TOT",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gemiddelde strenglengte",
            type: "avg",
            property: "LENGTE_TOT",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gemiddeld aanlegjaar",
            type: "avg",
            property: "AANLEGJAAR",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Riool­strengen per materiaal in {city}",
        description: "Veld MATERIAAL1: het buismateriaal",
        property: "MATERIAAL1",
        maxCategories: 7,
      },
      {
        kind: "histogram",
        title: "Aanlegjaar van de riool­strengen",
        description: "Aantal strengen per aanlegjaarklasse (veld AANLEGJAAR)",
        property: "AANLEGJAAR",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een riool­streng: een stuk buis tussen twee putten. Het veld *MATERIAAL1* toont het buismateriaal — overwegend beton, met een flink aandeel PVC bij nieuwere aanleg. Het *buistype* legt vorm en diameter vast (bijvoorbeeld *Rond 400* of *Eivormig 400/600*), en *AANLEGJAAR* laat de leeftijd zien, wat direct raakt aan de vervangingsopgave.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Assetmanagement**: leeftijd en materiaal bepalen de vervangings- en onderhoudsplanning van het riool.\n- **Klimaatadaptatie**: de capaciteit van het stelsel (diameter, vorm, functie) is bepalend voor de kans op wateroverlast bij hevige buien.\n- **Werk in de openbare ruimte**: kennis van de ligging voorkomt schade bij graafwerk en helpt werkzaamheden te combineren.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het beheerregister in de open GIS-omgeving van Gemeente Rotterdam. Het stelsel is zeer omvangrijk, dus in de kaart wordt een deel van de strengen geladen: de totale lengte gaat over die selectie binnen de kaartuitsnede van {city} en is dus geen stadsbrede optelsom. Strengen die de rand kruisen tellen met hun volledige geregistreerde lengte mee.",
      },
    ],
    links: [
      {
        label: "Gemeente Rotterdam — Riool buizen (ArcGIS FeatureServer)",
        url: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services/Riool_buizen/FeatureServer",
      },
    ],
  },
];
