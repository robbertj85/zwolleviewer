/**
 * Story maps — batch "zwolle-2": gemeentelijke beheer- en gebiedslagen
 * uit de ArcGIS-services van gemeente Zwolle (gisservices.zwolle.nl).
 *
 * Lagen: bomen, hagen, beplantingen, grassen, sportvelden, water-bor,
 * afvalbakken, kunstwerken, japanse-duizendknoop, gemeentegrens, stadsdelen,
 * wijken, buurten, bebouwde-kom-bos, bebouwde-kom-verkeer, archeologie,
 * klimaat-koelteplekken.
 *
 * Alle geladen lagen komen uit het gemeentelijke beheersysteem openbare ruimte
 * (BOR) en aanverwante GIS-services; ze zijn alleen in Zwolle zichtbaar. De
 * cijfers en grafieken worden client-side berekend uit de geladen features
 * binnen de kaartuitsnede.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "bomen",
    title: "Bomen in {city}",
    subtitle:
      "De volledige bomenregistratie uit het beheersysteem openbare ruimte (BOR)",
    intro:
      "Deze laag toont **{count} bomen** binnen het kaartgebied van {city}, rechtstreeks uit het gemeentelijke beheersysteem openbare ruimte (BOR). Elke stip is één geregistreerde boom met soort, hoogteklasse, stamdiameter en aanlegjaar. De volledige gemeentelijke bomenpopulatie telt tienduizenden bomen; om de kaart snel te houden wordt standaard een deel binnen de uitsnede geladen — de cijfers hieronder gaan dus over de zichtbare selectie, niet per se over alle bomen van {city}.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          { label: "Boomsoorten (Nederlandse naam)", type: "distinct", property: "NAAMNL" },
          {
            label: "Mediane stamdiameter",
            type: "median",
            property: "DIAMETER",
            unit: "cm",
            decimals: 0,
          },
          {
            label: "Binnen bebouwde kom (aandeel)",
            type: "count-where",
            property: "LIGGING",
            equals: "BINNEN",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten in {city}",
        description:
          "BOR-veld NAAMNL: de Nederlandse benaming van de boomsoort",
        property: "NAAMNL",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Bomen per hoogteklasse",
        description:
          "BOR-veld HOOGTE: de indicatieve hoogteklasse van de kroon",
        property: "HOOGTE",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke boom staat als apart punt in het beheersysteem, met een soortnaam (zowel wetenschappelijk in *BOOMSORTIMENT* als in het Nederlands in *NAAMNL*), een hoogteklasse, een stamdiameter en het jaar van aanplant. De veelvoorkomende soorten — zomereik, es, linde, wilg — vormen de ruggengraat van het Zwolse bomenbestand. Het veld *LIGGING* onderscheidt bomen binnen en buiten de bebouwde kom; dat is relevant omdat voor het kappen van bomen buiten de bebouwde kom andere regels (Wet natuurbescherming / Boswet) gelden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Groenbeheer en onderhoud**: soort, leeftijd en diameter bepalen het snoei- en vervangingsritme en de kosten daarvan.\n- **Klimaatadaptatie**: bomen leveren schaduw en verkoeling; hun spreiding is een directe indicator voor hittestress in de openbare ruimte.\n- **Biodiversiteit en soortdiversiteit**: een gevarieerd bomenbestand is minder kwetsbaar voor ziekten en plagen dan een populatie die op enkele soorten leunt.\n- **Waardevolle bomen**: dikke, oude exemplaren (hoge stamdiameter) zijn vaak beeldbepalend en genieten extra bescherming.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De gegevens komen uit het beheersysteem openbare ruimte (BOR) van gemeente {city}, ontsloten via de gemeentelijke ArcGIS-services. Let op:\n- De laag laadt binnen de kaartuitsnede en is begrensd op een maximum; zoom in om lokaal alle bomen te zien.\n- Alleen bomen in gemeentelijk beheer staan erin — bomen op particulier terrein ontbreken.\n- Registraties worden doorlopend bijgewerkt; hoogteklasse en diameter zijn de laatst geïnventariseerde waarden.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — openbare ruimte", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "hagen",
    title: "Hagen in {city}",
    subtitle: "Geknipte en vrij uitgroeiende hagen in de openbare ruimte",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} hagen** uit het gemeentelijke beheersysteem openbare ruimte (BOR). Elke lijn is een haagvak met een haagsoort, een lengte en een snoeiwijze. Samen vormen hagen kilometers groene erfafscheiding, geleiding en beschutting langs paden, parkeerplaatsen en plantsoenen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Haagvakken in beeld", type: "count" },
          { label: "Haagsoorten", type: "distinct", property: "HEESTERSOORT" },
          {
            label: "Totale haaglengte",
            type: "sum",
            property: "LENGTE",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Tweezijdig geknipt",
            type: "count-where",
            property: "SNOEIWIJZE",
            equals: "tweezijdig",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest gebruikte haagsoorten in {city}",
        description:
          "BOR-veld HEESTERSOORT: het botanische geslacht met Nederlandse naam",
        property: "HEESTERSOORT",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Snoeiwijze van de hagen",
        description: "BOR-veld SNOEIWIJZE: hoe de haag wordt onderhouden",
        property: "SNOEIWIJZE",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk haagvak is als lijn met een lengte geregistreerd. Beuk, haagbeuk en liguster zijn de meest gebruikte soorten. De **snoeiwijze** (eenzijdig of tweezijdig) bepaalt hoeveel onderhoud een haag vraagt: tweezijdig geknipte hagen worden aan beide zijden en de bovenkant bijgehouden en zijn arbeidsintensiever dan hagen die maar aan één kant worden gesnoeid.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Onderhoudsplanning**: het aantal strekkende meters en de snoeiwijze bepalen de jaarlijkse knipbeurten en de kosten.\n- **Beeldkwaliteit**: hagen zijn beeldbepalend voor straten en pleinen; hun conditie beïnvloedt de ervaren netheid van een buurt.\n- **Biodiversiteit en microklimaat**: bloeiende en besdragende hagen bieden voedsel en schuilplaats voor vogels en insecten en dempen wind en geluid.",
      },
      {
        heading: "Over de bron",
        body: "De hagen komen uit het beheersysteem openbare ruimte (BOR) van gemeente {city}. De statistieken gaan over de haagvakken binnen de kaartuitsnede; bij grote lagen wordt een maximum aan features geladen, dus zoom in voor een volledig lokaal beeld. Alleen hagen in gemeentelijk beheer zijn opgenomen.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — openbare ruimte", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "beplantingen",
    title: "Beplantingen in {city}",
    subtitle: "Heester-, struik- en bosplantsoenvakken in de openbare ruimte",
    intro:
      "Deze laag toont **{count} beplantingsvakken** binnen het kaartgebied van {city}: heesters, vaste planten, bosplantsoen en houtsingels uit het gemeentelijke beheersysteem openbare ruimte (BOR). Elk vlak heeft een beheergroep (het onderhoudstype) en een functie in het groenbeeld. Samen vormen deze vakken het lage, dichte groen tussen de bomen en het gras.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Beplantingsvakken in beeld", type: "count" },
          {
            label: "Totaal oppervlak",
            type: "sum",
            property: "OPPERVLAKTE",
            unit: "m²",
            decimals: 0,
          },
          { label: "Beheergroepen", type: "distinct", property: "BEHEERGROEP" },
          {
            label: "Natuurgroen (aandeel)",
            type: "count-where",
            property: "FUNCTIE",
            equals: "natuurgroen",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Beplantingen per beheergroep in {city}",
        description:
          "BOR-veld BEHEERGROEP: het onderhoudstype van het beplantingsvak",
        property: "BEHEERGROEP",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Functie van de beplanting",
        description:
          "BOR-veld FUNCTIE: de rol van het groen in de openbare ruimte",
        property: "FUNCTIE",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een beplantingsvak met een oppervlakte. De **beheergroep** zegt hoe het vak wordt onderhouden: reguliere heesters, heesters met een vaste snoeicyclus, bosplantsoen, vaste planten of grafbeplanting. De **functie** onderscheidt *beeldgroen* (siergroen langs straten en pleinen), *natuurgroen* (ecologisch beheerd) en *gebruiksgroen* (waar mensen komen). Het onderscheid bepaalt zowel het onderhoud als de ecologische waarde.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Onderhoud en kosten**: de beheergroep bepaalt de snoeifrequentie; extensiever beheerde vakken vragen minder inzet en zijn vaak rijker aan bloei en insecten.\n- **Biodiversiteit**: het aandeel natuurgroen is een indicator voor hoeveel ruimte er is voor spontane natuur in de stad.\n- **Klimaat en waterberging**: beplante bodems nemen regenwater op en verkoelen hun omgeving sterker dan verharding.",
      },
      {
        heading: "Over de bron",
        body: "De beplantingen komen uit het beheersysteem openbare ruimte (BOR) van gemeente {city}. De cijfers betreffen de vakken binnen de kaartuitsnede; bij grote lagen geldt een maximum aantal geladen features. Het veld *HEESTERSORTIMENT* (de exacte soortsamenstelling) is lang niet altijd ingevuld en is daarom niet als grafiek opgenomen.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — openbare ruimte", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "grassen",
    title: "Gras en gazons in {city}",
    subtitle: "Grasvelden en bermen uit het beheersysteem openbare ruimte",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} grasvakken** uit het gemeentelijke beheersysteem openbare ruimte (BOR): van intensief gemaaide gazons tot extensief beheerde bermen en dijken. Elk vlak heeft een oppervlakte, een maairegime (beheergroep) en een functie. Gras is qua oppervlak vaak het grootste groentype van een gemeente.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Grasvakken in beeld", type: "count" },
          {
            label: "Totaal grasoppervlak",
            type: "sum",
            property: "OPPERVLAKTE",
            unit: "m²",
            decimals: 0,
          },
          { label: "Maairegimes (beheergroep)", type: "distinct", property: "BEHEERGROEP" },
          {
            label: "Natuurgroen (aandeel)",
            type: "count-where",
            property: "FUNCTIE",
            equals: "natuurgroen",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Gras per maairegime in {city}",
        description:
          "BOR-veld BEHEERGROEP: intensief gazon versus de verschillende extensieve maairegimes",
        property: "BEHEERGROEP",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Functie van het gras",
        description: "BOR-veld FUNCTIE: de rol van het grasvak",
        property: "FUNCTIE",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk grasvak heeft een **beheergroep** die het maairegime aangeeft. *Gras intensief* wordt vaak gemaaid en oogt als strak gazon; de vele *gras extensief*-varianten worden slechts enkele keren per jaar gemaaid — het cijferachtervoegsel verwijst naar de maaiweken. Extensief beheer geeft kruiden en insecten de ruimte. De **functie** koppelt daar een rol aan (natuurgroen, beeldgroen of gebruiksgroen zoals speel- en ligweiden).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ecologisch bermbeheer**: de verschuiving van intensief naar extensief maaien (met afvoer van maaisel) is een concreet biodiversiteitsbeleid; deze laag laat zien waar dat al gebeurt.\n- **Onderhoudsplanning**: het maairegime en het oppervlak bepalen de inzet van materieel en de kosten.\n- **Gebruik en beleving**: gebruiksgazons in wijken zijn belangrijk voor spelen, sporten en ontmoeten — hun spreiding zegt iets over de leefbaarheid.",
      },
      {
        heading: "Over de bron",
        body: "De grasvakken komen uit het beheersysteem openbare ruimte (BOR) van gemeente {city}. De statistieken gaan over de vakken binnen de kaartuitsnede; bij deze grote laag geldt een maximum aantal geladen features, dus zoom in voor een volledig lokaal beeld.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — openbare ruimte", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "sportvelden",
    title: "Sportvelden in {city}",
    subtitle: "Velden op de gemeentelijke sportparken, met sporttak en veldtype",
    intro:
      "Deze laag toont **{count} sportvelden** binnen het kaartgebied van {city}, uit het gemeentelijke beheersysteem openbare ruimte (BOR). Elk vlak is één speelveld op een sportpark, met de bijbehorende sporttak (voetbal, hockey, atletiek, korfbal …) en het veldtype (natuurgras, kunstgras of kunststof). Zo zie je in één oogopslag het gemeentelijke sportaanbod in de buitenruimte.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Sportvelden in beeld", type: "count" },
          { label: "Sporttakken", type: "distinct", property: "SPORTTAK" },
          {
            label: "Kunstgrasvelden",
            type: "count-where",
            property: "BEHEERGROEP",
            equals: "Kunstgras sportveld",
          },
          { label: "Sportparken", type: "distinct", property: "GROENGEBIED" },
        ],
      },
      {
        kind: "category-bar",
        title: "Sportvelden per sporttak in {city}",
        description: "BOR-veld SPORTTAK: de sport waarvoor het veld is ingericht",
        property: "SPORTTAK",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Velden per ondergrond",
        description:
          "BOR-veld BEHEERGROEP: onderscheidt natuurgras, kunstgras en kunststof",
        property: "BEHEERGROEP",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een speelveld op een gemeentelijk sportpark (het veld *GROENGEBIED* bevat de naam van het sportpark). Voetbalvelden vormen veruit de grootste groep. De **ondergrond** (beheergroep) is beheertechnisch belangrijk: kunstgras- en kunststofvelden zijn intensiever te bespelen maar hebben een beperkte levensduur en hogere vervangingskosten dan natuurgras.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sportaccommodatiebeleid**: de verdeling over sporttakken en de bespelbaarheid (kunstgras versus natuurgras) sturen investeringen in sportcapaciteit.\n- **Vervangingsplanning**: kunstgrasvelden hebben een levensduur van ~10–15 jaar; het aantal en type bepaalt de vervangingsopgave en het budget.\n- **Ruimtelijke spreiding**: de ligging van sportparken bepaalt of alle wijken op redelijke afstand van sportvoorzieningen liggen.",
      },
      {
        heading: "Over de bron",
        body: "De sportvelden komen uit het beheersysteem openbare ruimte (BOR) van gemeente {city}. De cijfers betreffen de velden binnen de kaartuitsnede; velden van een sportpark net buiten de uitsnede tellen niet mee. Alleen velden in gemeentelijk beheer zijn opgenomen — velden van particuliere verenigingen of scholen kunnen ontbreken.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — sport", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "water-bor",
    title: "Water in beheer in {city}",
    subtitle:
      "Sloten, watergangen en waterpartijen uit het beheersysteem openbare ruimte",
    intro:
      "Binnen het kaartgebied van {city} toont deze laag **{count} watervakken** uit het gemeentelijke beheersysteem openbare ruimte (BOR): sloten, bredere watergangen, vijvers, meertjes en recreatieplassen. Elk vlak heeft een watertype (beheergroep) en een beheerder. Samen vormen ze het stedelijke oppervlaktewater dat regenwater bergt en afvoert.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Watervakken in beeld", type: "count" },
          { label: "Watertypen", type: "distinct", property: "BEHEERGROEP" },
          {
            label: "In beheer bij waterschap",
            type: "count-where",
            property: "BEHEERDER",
            equals: "Waterschap",
          },
          { label: "Beheerders", type: "distinct", property: "BEHEERDER" },
        ],
      },
      {
        kind: "category-bar",
        title: "Water per type in {city}",
        description:
          "BOR-veld BEHEERGROEP: van smalle sloten tot watervlakken en plassen",
        property: "BEHEERGROEP",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Water per beheerder",
        description:
          "BOR-veld BEHEERDER: wie het onderhoud (schouw, baggeren) uitvoert",
        property: "BEHEERDER",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een stuk oppervlaktewater met een **type**: van smalle sloten (tot 6 meter) tot bredere watergangen, watervlakken, meertjes en recreatieplassen. Het veld **BEHEERDER** geeft aan wie verantwoordelijk is voor het onderhoud — vaak de gemeente, maar bij grotere watergangen het waterschap. Die verdeling is belangrijk omdat schouw, baggeren en oeveronderhoud tussen partijen zijn verdeeld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Waterberging en klimaatadaptatie**: oppervlaktewater vangt piekbuien op; het areaal en de spreiding zijn cruciaal bij het voorkomen van wateroverlast.\n- **Onderhoud en verantwoordelijkheid**: de beheerderverdeling bepaalt wie welke sloot schoonhoudt — relevant bij meldingen over verstopping of dichtgroei.\n- **Ecologie en waterkwaliteit**: natuurvriendelijke oevers en helder water dragen bij aan biodiversiteit; deze laag is de basiskaart daarvoor.",
      },
      {
        heading: "Over de bron",
        body: "Het water komt uit het beheersysteem openbare ruimte (BOR) van gemeente {city}. De cijfers gaan over de vakken binnen de kaartuitsnede. Dit is de beheerregistratie van de gemeente; de formele legger van het watersysteem wordt door het waterschap bijgehouden en kan op detailniveau afwijken.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — water", url: "https://www.zwolle.nl/" },
      {
        label: "Waterschap Drents Overijsselse Delta",
        url: "https://www.wdodelta.nl/",
      },
    ],
  },
  {
    layerId: "afvalbakken",
    title: "Afvalbakken in {city}",
    subtitle: "Openbare prullenbakken uit het beheersysteem openbare ruimte",
    intro:
      "Deze laag toont **{count} openbare afvalbakken** binnen het kaartgebied van {city}, uit het gemeentelijke beheersysteem openbare ruimte (BOR). Elke stip is een prullenbak die de gemeente plaatst, leegt en onderhoudt. De spreiding laat zien waar mensen hun afval kwijt kunnen — op looproutes, bij haltes, in parken en op pleinen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Afvalbakken in beeld", type: "count" },
          {
            label: "Oudste geregistreerde plaatsing",
            type: "min",
            property: "AANLEGJAAR",
            decimals: 0,
          },
          {
            label: "Nieuwste geregistreerde plaatsing",
            type: "max",
            property: "AANLEGJAAR",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Plaatsingsjaar van afvalbakken in {city}",
        description:
          "BOR-veld AANLEGJAAR — alleen voor de bakken waarvan een aanlegjaar is geregistreerd (bij een groot deel ontbreekt dit)",
        property: "AANLEGJAAR",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één afvalbak (in de registratie vrijwel altijd van het type *Prullenbak*). Waar een **aanlegjaar** bekend is, laat de grafiek zien wanneer de bakken zijn geplaatst of vervangen. Van een groot deel van de bakken is echter geen aanlegjaar vastgelegd; die tellen wél mee in het totaal, maar niet in de jaargrafiek.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Schone openbare ruimte**: voldoende en goed geplaatste bakken verminderen zwerfafval; gaten in de spreiding zijn plekken waar afval sneller op straat belandt.\n- **Serviceroutes en kosten**: het aantal en de ligging bepalen de leeg- en onderhoudsroutes van de reinigingsdienst.\n- **Meldingen en beheer**: bewoners melden volle of kapotte bakken; deze registratie is de basis om die meldingen aan een object te koppelen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De afvalbakken komen uit het beheersysteem openbare ruimte (BOR) van gemeente {city}. De cijfers gaan over de bakken binnen de kaartuitsnede. Het veld *AANLEGJAAR* is bij de meeste bakken niet ingevuld; de plaatsingsjaar-grafiek toont daarom alleen de bakken met een geregistreerd jaartal en is niet representatief voor het hele bestand.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — afval & reiniging", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "kunstwerken",
    title: "Kunst in de openbare ruimte in {city}",
    subtitle: "Beelden en kunstobjecten uit de gemeentelijke kunstcollectie",
    intro:
      "Deze laag toont **{count} kunstobjecten** in de openbare ruimte van {city}: beelden, sculpturen en andere kunstwerken die de gemeente beheert. Elk object heeft een titel, een plaatsingsjaar en vaak een uitgebreide beschrijving. Van de oudste monumenten tot recente sculpturen — samen vormen ze de openluchtcollectie van de stad.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kunstobjecten in beeld", type: "count" },
          { label: "Unieke titels", type: "distinct", property: "TITEL" },
          {
            label: "Oudste werk (plaatsingsjaar)",
            type: "min",
            property: "PLAATSINGSJAAR",
            decimals: 0,
          },
          {
            label: "Nieuwste werk (plaatsingsjaar)",
            type: "max",
            property: "PLAATSINGSJAAR",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Plaatsingsjaar van kunstwerken in {city}",
        description:
          "Veld PLAATSINGSJAAR: het jaar waarin het kunstwerk in de openbare ruimte is geplaatst",
        property: "PLAATSINGSJAAR",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een kunstwerk met een titel en een plaatsingsjaar. Veel objecten hebben een rijke beschrijving (*INLEIDINGWERK* en *OMSCHRIJVINGWERK*) met de achtergrond van het werk en de kunstenaar. Het plaatsingsjaar laat de opbouw van de collectie in de tijd zien — van enkele historische werken tot de vele beelden die in de late 20e eeuw en daarna zijn geplaatst.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer van de collectie**: kunst in de buitenruimte vraagt onderhoud, restauratie en soms verplaatsing; een actueel overzicht is daarvoor onmisbaar.\n- **Cultuur en identiteit**: kunstwerken markeren plekken, vertellen het verhaal van een wijk en dragen bij aan de beleving van de openbare ruimte.\n- **Toerisme en educatie**: de collectie leent zich voor wandelroutes en publieksinformatie; de beschrijvingen per object vormen daarvoor de inhoud.",
      },
      {
        heading: "Over de bron",
        body: "De gegevens komen uit de gemeentelijke registratie van kunst in de openbare ruimte van {city}. De cijfers gaan over de objecten binnen de kaartuitsnede. Bij enkele werken ontbreekt een plaatsingsjaar; die tellen mee in het totaal maar niet in de jaargrafiek. De velden *TECHNIEK* en *STROMING* zijn in de dataset niet ingevuld en daarom niet als grafiek opgenomen.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — kunst & cultuur", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "japanse-duizendknoop",
    title: "Japanse duizendknoop in {city}",
    subtitle: "Geregistreerde groeiplaatsen van een invasieve exoot",
    intro:
      "Deze laag toont **{count} geregistreerde groeiplaatsen** van de Japanse duizendknoop binnen het kaartgebied van {city}. De Japanse duizendknoop is een van de lastigste invasieve exoten van Nederland: de plant groeit razendsnel, verdringt inheemse soorten en kan met zijn wortelstokken schade toebrengen aan verhardingen, kades en funderingen. Elke stip is een bij de gemeente bekende vindplaats in de openbare ruimte.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Geregistreerde groeiplaatsen in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een vindplaats van Japanse duizendknoop die de gemeente heeft geregistreerd. Deze laag bevat alleen de locatie: er is geen aanvullende soort- of beheerinformatie per punt beschikbaar, dus het verhaal beperkt zich tot het aantal en de spreiding van de bekende haarden binnen de kaartuitsnede.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bestrijding en beheersing**: de plant is nauwelijks uit te roeien; kennis van elke haard is nodig om verspreiding via grondverzet en maaimachines te voorkomen.\n- **Schaderisico**: wortelstokken kunnen wegverhardingen, riolering en funderingen aantasten; vindplaatsen bij infrastructuur verdienen extra aandacht.\n- **Werk met derden**: aannemers die graven of maaien moeten weten waar de plant staat, zodat besmette grond apart wordt afgevoerd.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De groeiplaatsen komen uit de registratie van gemeente {city}. Het beeld is per definitie onvolledig: alleen gemelde en geïnventariseerde haarden staan erin, en de situatie verandert doordat de plant zich verspreidt en bestrijding plaatsvindt. De cijfers betreffen de punten binnen de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Bestrijdingsprotocol Japanse duizendknoop",
        url: "https://www.stowa.nl/deltafacts/waterkwaliteit/exoten/japanse-duizendknoop",
      },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "gemeentegrens",
    title: "De gemeentegrens van {city}",
    subtitle: "De officiële bestuurlijke buitengrens van de gemeente",
    intro:
      "Deze laag tekent de **officiële gemeentegrens** van {city}: de bestuurlijke buitengrens die het gemeentelijk grondgebied afbakent. Het is één doorlopende lijn die het hele grondgebied omsluit — de basis waarop bevoegdheden, belastingen, verkiezingen en beleid van de gemeente van toepassing zijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Grensvlakken in beeld", type: "count" },
          {
            label: "Lengte van de grens",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Omsloten oppervlak",
            type: "sum",
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
        body: "De laag bestaat uit het gemeentelijke grensvlak; de omtrek daarvan (ruim 60 kilometer) is de lengte van de gemeentegrens en het omsloten oppervlak is de totale landoppervlakte van {city}. Anders dan de wijk- en buurtindelingen, die de gemeente ván binnen opdelen, markeert deze laag alleen de buitenrand.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bevoegdheidsgebied**: alles wat de gemeente regelt — van vergunningen tot handhaving — geldt binnen deze grens.\n- **Referentiekader**: de grens is de ijklijn voor alle andere kaartlagen; features net buiten de grens horen bij een buurgemeente.\n- **Samenwerking**: waar grenzen elkaar raken, werken gemeenten samen aan bijvoorbeeld wegen, water en bedrijventerreinen die de grens overschrijden.",
      },
      {
        heading: "Over de bron",
        body: "De gemeentegrens komt uit de GIS-services van gemeente {city}. Voor de landelijk vastgestelde, juridische grenzen (die jaarlijks per 1 januari kunnen wijzigen) is de Basisregistratie Kadaster / het CBS-bestand Wijk- en Buurtkaart leidend; deze weergave is de gemeentelijke versie daarvan.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
      {
        label: "CBS Wijk- en Buurtkaart",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart-2023",
      },
    ],
  },
  {
    layerId: "stadsdelen",
    title: "Stadsdelen van {city}",
    subtitle: "De grofste gebiedsindeling van de gemeente",
    intro:
      "Deze laag verdeelt {city} in **{count} stadsdelen**: de grofste bestuurlijke en statistische gebiedsindeling van de gemeente, boven het niveau van wijken en buurten. Elk stadsdeel bundelt meerdere wijken tot een herkenbaar deel van de stad en het buitengebied. Klik op een vlak voor de naam van het stadsdeel.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stadsdelen in beeld", type: "count" },
          { label: "Unieke namen", type: "distinct", property: "OMSCHR" },
          {
            label: "Gemiddeld oppervlak",
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
        body: "Elk vlak is een stadsdeel met een naam (veld *OMSCHR*). De stadsdelen dekken samen het hele grondgebied van {city} en vormen de bovenste laag in de hiërarchie stadsdeel → wijk → buurt. Omdat er maar een handvol stadsdelen is, is dit vooral een indelings- en referentiekaart en minder een laag om te tellen of te aggregeren.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gebiedsgericht werken**: veel gemeenten organiseren wijkbeheer, participatie en communicatie per stadsdeel.\n- **Aggregatieniveau**: cijfers over bevolking, voorzieningen of meldingen worden vaak per stadsdeel samengevat voor een overzichtelijk beeld.\n- **Herkenbaarheid**: stadsdeelnamen zijn voor bewoners een vertrouwde manier om de stad te benoemen.",
      },
      {
        heading: "Over de bron",
        body: "De stadsdelen komen uit de GIS-services van gemeente {city}. Het is de gemeentelijke gebiedsindeling; die kan afwijken van de landelijke CBS-wijkindeling. Alle stadsdelen liggen binnen de gemeentegrens.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — wijken & stadsdelen", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "wijken",
    title: "Wijken van {city}",
    subtitle: "De wijkindeling van de gemeente",
    intro:
      "Deze laag verdeelt {city} in **{count} wijken**: het middenniveau tussen stadsdeel en buurt. Elke wijk heeft een officiële naam en een wijknummer en bundelt meerdere buurten. Wijken zijn het niveau waarop veel gemeentelijk beleid, bewonersparticipatie en statistiek worden georganiseerd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wijken in beeld", type: "count" },
          { label: "Unieke wijknamen", type: "distinct", property: "OFFICIËLE_NAAM" },
          {
            label: "Gemiddeld oppervlak",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Totaal oppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Oppervlakteverdeling van wijken in {city}",
        description:
          "Veld Shape__Area: het oppervlak van elke wijk in vierkante meters",
        property: "Shape__Area",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een wijk met een naam en een nummer. De oppervlakteverdeling laat het contrast zien tussen compacte, dichtbebouwde wijken in de stad en grote, ruim opgezette wijken aan de rand en in het buitengebied. Wijken vallen binnen een stadsdeel en zijn zelf weer opgedeeld in buurten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beleid en budget**: leefbaarheid, groen en veiligheid worden vaak per wijk gemonitord en aangepakt.\n- **Participatie**: wijkplatforms en wijkbudgetten werken op dit niveau; de indeling bepaalt wie waarover meepraat.\n- **Vergelijking**: cijfers per wijk maken het mogelijk om delen van de stad met elkaar te vergelijken en achterstanden te signaleren.",
      },
      {
        heading: "Over de bron",
        body: "De wijken komen uit de GIS-services van gemeente {city}. Dit is de gemeentelijke indeling; die kan op detailniveau verschillen van de CBS-wijkindeling die landelijk voor statistiek wordt gebruikt. Alle wijken liggen binnen de gemeentegrens.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — wijken & stadsdelen", url: "https://www.zwolle.nl/" },
      {
        label: "CBS Wijk- en Buurtkaart",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart-2023",
      },
    ],
  },
  {
    layerId: "buurten",
    title: "Buurten van {city}",
    subtitle: "De fijnste gebiedsindeling van de gemeente",
    intro:
      "Deze laag verdeelt {city} in **{count} buurten**: het fijnste niveau van de gebiedsindeling, onder wijk en stadsdeel. Elke buurt heeft een naam en een buurtnummer. Buurten zijn klein genoeg om een herkenbare woonomgeving te vormen en vormen de bouwstenen waaruit wijken en stadsdelen zijn opgebouwd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          { label: "Unieke buurtnamen", type: "distinct", property: "OFFICIËLE_NAAM" },
          {
            label: "Gemiddeld oppervlak",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Totaal oppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Oppervlakteverdeling van buurten in {city}",
        description:
          "Veld Shape__Area: het oppervlak van elke buurt in vierkante meters",
        property: "Shape__Area",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een buurt met een naam (velden *OMSCHR* en *OFFICIËLE_NAAM*) en een buurtnummer. De oppervlakteverdeling toont het verschil tussen kleine, compacte stadsbuurten en uitgestrekte buurten in het buitengebied. Buurten zijn het niveau waarop de fijnmazige statistiek en het dagelijkse wijkbeheer plaatsvinden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fijnmazige analyse**: op buurtniveau worden verschillen in wonen, leeftijd en leefbaarheid het scherpst zichtbaar.\n- **Adres- en gebiedskoppeling**: meldingen, voorzieningen en projecten worden aan een buurt gekoppeld voor gebiedsgericht werken.\n- **Bouwsteen voor hogere niveaus**: wijk- en stadsdeelcijfers zijn optellingen van buurten; de indeling bepaalt hoe die aggregatie uitpakt.",
      },
      {
        heading: "Over de bron",
        body: "De buurten komen uit de GIS-services van gemeente {city}. Dit is de gemeentelijke indeling; die kan afwijken van de CBS-buurtindeling die landelijk voor statistiek wordt gebruikt. Alle buurten liggen binnen de gemeentegrens.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — wijken & stadsdelen", url: "https://www.zwolle.nl/" },
      {
        label: "CBS Wijk- en Buurtkaart",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart-2023",
      },
    ],
  },
  {
    layerId: "bebouwde-kom-bos",
    title: "Bebouwde kom volgens de Boswet in {city}",
    subtitle:
      "De grens die bepaalt waar de Wet natuurbescherming (voorheen Boswet) geldt voor bomen",
    intro:
      "Deze laag toont de **grens van de bebouwde kom volgens de Boswet** (nu opgegaan in de Wet natuurbescherming) in {city}, opgebouwd uit {count} grensvlakken. Deze specifieke komgrens is juridisch bepalend: buiten deze grens gelden voor het vellen van bomen en houtopstanden de meldings- en herplantplicht van de Wet natuurbescherming, binnen de grens niet.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Grensvlakken in beeld", type: "count" },
          {
            label: "Omsloten oppervlak",
            type: "sum",
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
        body: "De laag bakent het gebied af dat als 'bebouwde kom' in de zin van de (voormalige) Boswet is aangewezen. Let op: deze komgrens is iets anders dan de bebouwde kom voor het verkeer (de blauwe komborden). De Boswet-komgrens is speciaal bedoeld om te bepalen welk bomen- en bosbeschermingsregime geldt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bomenkap buiten de kom**: buiten deze grens geldt voor houtopstanden een kap-, meldings- en herplantplicht onder de Wet natuurbescherming; binnen de grens valt bomenkap onder de gemeentelijke bomen- en kapregels.\n- **Vergunningverlening**: de ligging van een boom ten opzichte van deze grens bepaalt welk bevoegd gezag en welke procedure van toepassing is.\n- **Bosbeheer**: voor bos en houtsingels in het buitengebied is deze grens het startpunt van de beschermingsvraag.",
      },
      {
        heading: "Over de bron",
        body: "De grens komt uit de GIS-services van gemeente {city}. Het is de door de gemeenteraad vastgestelde komgrens voor de Boswet/Wet natuurbescherming. Voor de exacte juridische status is het vaststellingsbesluit van de gemeente leidend.",
      },
    ],
    links: [
      {
        label: "Wet natuurbescherming — houtopstanden",
        url: "https://www.bij12.nl/onderwerpen/natuur-en-landschap/houtopstanden/",
      },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "bebouwde-kom-verkeer",
    title: "Bebouwde kom volgens de Wegenverkeerswet in {city}",
    subtitle: "De grens van de komborden: waar de bebouwde-komregels gelden",
    intro:
      "Deze laag toont de **grens van de bebouwde kom volgens de Wegenverkeerswet** in {city}, opgebouwd uit {count} grensvlakken. Dit is de grens die met de blauwe komborden op straat wordt aangegeven en die bepaalt waar de verkeersregels voor de bebouwde kom gelden — met name de standaard maximumsnelheid van 50 km/u (of lager) en voorrangs- en parkeerregimes.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Grensvlakken in beeld", type: "count" },
          {
            label: "Omsloten oppervlak",
            type: "sum",
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
        body: "De laag bakent het gebied af dat verkeerskundig als bebouwde kom is aangewezen — het gebied tussen de komborden. Deze grens verschilt bewust van de Boswet-komgrens: de verkeerskundige kom is bepalend voor de weginrichting en snelheden, niet voor bomen. Buiten deze grens gelden de regels voor buiten de bebouwde kom (doorgaans 60 of 80 km/u).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Snelheidsregime**: de komgrens bepaalt de standaardsnelheid en daarmee de inrichting van wegen, oversteken en fietsvoorzieningen.\n- **Handhaving en verkeersveiligheid**: binnen de kom gelden andere handhavings- en voorrangsregels; de grens is het juridische ankerpunt.\n- **Ruimtelijke ontwikkeling**: bij uitbreiding van woonwijken schuift de komgrens mee — het besluit daarover is een formele verkeersmaatregel.",
      },
      {
        heading: "Over de bron",
        body: "De grens komt uit de GIS-services van gemeente {city} en weerspiegelt het verkeersbesluit tot vaststelling van de bebouwde kom. Voor de exacte juridische ligging is het onderliggende verkeersbesluit en de daadwerkelijke bebording leidend.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — verkeer", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "archeologie",
    title: "Archeologische waarderingskaart van {city}",
    subtitle:
      "Gebieden met een archeologische verwachting en de toegekende weging",
    intro:
      "Deze laag toont **{count} gebiedsvlakken** van de archeologische waarderingskaart van {city}. De kaart geeft per gebied aan hoe groot de kans is op archeologische resten in de bodem en welk beschermings- of onderzoeksregime daarbij hoort. Elk vlak verwijst via een gebiedscode naar een onderliggend verwachtingsdocument. Klik op een vlak voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebiedsvlakken in beeld", type: "count" },
          {
            label: "Verwachtingsgebieden (codes)",
            type: "distinct",
            property: "GEBIED_CODE",
          },
          {
            label: "Zonder verwachting (aandeel)",
            type: "count-where",
            property: "OMSCHRIJVING",
            equals: "Geen.pdf",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Toegekende verwachtingsweging in {city}",
        description:
          "Veld PROCENT: de aan het gebied toegekende archeologische wegingswaarde (in procenten)",
        property: "PROCENT",
        valueLabels: {
          "0": "0% (geen verwachting)",
          "10": "10%",
          "50": "50%",
          "90": "90%",
          "100": "100%",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gebied met een **verwachtingswaarde** voor archeologie. Het veld *PROCENT* drukt de toegekende weging uit: hoe hoger het percentage, hoe groter de verwachte kans op waardevolle resten en hoe strenger het onderzoeksregime bij bodemingrepen. Gebieden waarvan de omschrijving *Geen.pdf* is, hebben geen bijzondere archeologische verwachting; gebieden met een *VerwXXX.pdf*-verwijzing horen bij een specifiek verwachtingsdocument met eigen regels.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vergunningen en bouwplannen**: in gebieden met een hoge verwachting geldt bij graven of bouwen vaak een archeologisch onderzoeksplicht; deze kaart bepaalt of en welk onderzoek nodig is.\n- **Erfgoedbescherming**: de waarderingskaart is de basis om bodemarchief te beschermen zonder alle ontwikkeling stil te leggen — het regime schaalt mee met de verwachting.\n- **Planning en kosten**: vroeg weten dat een locatie een hoge archeologische verwachting heeft, voorkomt vertraging en onverwachte kosten later in een project.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De waarderingskaart komt uit de erfgoed-GIS-services van gemeente {city}. Let op:\n- Het is een *verwachtings*kaart: hoge verwachting betekent niet dat er zeker resten liggen, en een lage verwachting sluit vondsten niet volledig uit.\n- De precieze betekenis van de wegingsklassen staat in het gemeentelijke archeologiebeleid en de bijbehorende gebiedsdocumenten.\n- De cijfers gaan over de vlakken binnen de kaartuitsnede.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — archeologie & erfgoed", url: "https://www.zwolle.nl/" },
      { label: "Zwolle GIS-services", url: "https://gisservices.zwolle.nl/" },
    ],
  },
  {
    layerId: "klimaat-koelteplekken",
    title: "Koele verblijfsplekken in {city}",
    subtitle: "Potentiële plekken om af te koelen tijdens hitte",
    intro:
      "Deze laag toont **{count} potentiële koele verblijfsplekken** binnen het kaartgebied van {city}: plekken — vaak groen en beschaduwd — waar het tijdens warme dagen aangenaam verblijven is. Bij toenemende hitte in de stad worden zulke plekken belangrijker als plek om even af te koelen, zeker voor kwetsbare inwoners. Elke vlek is een als koel aangemerkte plek.",
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
            label: "Mediaan oppervlak per plek",
            type: "median",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Grootteverdeling van koele plekken in {city}",
        description:
          "Veld Shape__Area: het oppervlak per koele verblijfsplek in vierkante meters",
        property: "Shape__Area",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke vlek is een plek die als *koele aangename verblijfsplek (potentieel)* is aangemerkt — meestal groene, schaduwrijke plekken zoals parken, lanen en plantsoenen die op hete dagen verkoeling bieden. De grootteverdeling laat zien of het koele aanbod vooral uit enkele grote parken bestaat of uit veel kleinere plekken verspreid door de stad. Het gaat om *potentiële* plekken op basis van een analyse, niet om formeel ingerichte koeltepunten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie en hittestress**: bij hittegolven is de nabijheid van koele plekken een gezondheidsfactor, vooral voor ouderen en mensen met een kwetsbare gezondheid.\n- **Groenbeleid**: gaten in het aanbod — wijken zonder koele plek op loopafstand — zijn concrete plekken om groen en schaduw toe te voegen.\n- **Inrichting openbare ruimte**: bankjes, water en bomen kunnen een potentiële koele plek tot een echte verblijfsplek maken.",
      },
      {
        heading: "Over de bron",
        body: "De koele plekken komen uit de klimaat-GIS-services van gemeente {city} en zijn met een analyse afgeleid (potentieel), niet ter plekke gemeten. De cijfers gaan over de plekken binnen de kaartuitsnede. Combineer deze laag met de laag *Afstand tot koelteplek* om te zien welke delen van de stad ver van een koele plek af liggen.",
      },
    ],
    links: [
      {
        label: "Klimaateffectatlas — hitte",
        url: "https://www.klimaateffectatlas.nl/nl/",
      },
      { label: "Gemeente Zwolle — klimaatadaptatie", url: "https://www.zwolle.nl/" },
    ],
  },
];
