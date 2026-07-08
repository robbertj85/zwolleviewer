/**
 * Story maps — gemeentelijke open data van gemeente Elburg.
 *
 * Lagen (alleen zichtbaar in Elburg), afkomstig uit de ArcGIS Online-omgeving
 * van de gemeente:
 *   Riolering/water   — elb-rioolstrengen, elb-rioolputten,
 *                       elb-rioolconstructie-lijnen, elb-rioolconstructie-vlakken,
 *                       elb-rioolhuisaansluiting
 *   Erfgoed           — elb-gemeentelijke-monumenten, elb-rijksmonumenten
 *   Openbare ruimte   — elb-openbare-verlichting, elb-ov-kasten, elb-boomzone,
 *                       elb-speelplaatsen, elb-bladkorven
 *   Verkeer & haven   — elb-parkeren, elb-strooiroute, elb-ligplaatsen
 *
 * Alle cijfers/grafieken worden client-side berekend uit de geladen features;
 * {city} en {count} worden runtime ingevuld.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "elb-rioolstrengen",
    title: "Rioolstrengen in {city}",
    subtitle:
      "De ondergrondse buizen van het gemeentelijke rioolstelsel, met type, materiaal en aanlegjaar",
    intro:
      "Deze laag tekent **{count} rioolstrengen** binnen het kaartgebied van {city}: elke lijn is één buis tussen twee putten uit de beheerregistratie van de gemeente. Per streng staan het rioolstelseltype (gemengd, DWA, RWA, drukriolering …), het materiaal, de diameter, het aanlegjaar en de streng­lengte geregistreerd. Klik op een lijn voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Strengen in beeld", type: "count" },
          {
            label: "Totale lengte",
            type: "sum",
            property: "STRENGLENGTE",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gemiddelde streng­lengte",
            type: "avg",
            property: "STRENGLENGTE",
            unit: "m",
            decimals: 1,
          },
          {
            label: "Leidingtypen",
            type: "distinct",
            property: "LEIDINGTYPE",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rioolstrengen per leidingtype in {city}",
        description:
          "Veld LEIDINGTYPE: de functie van de buis binnen het rioolstelsel",
        property: "LEIDINGTYPE",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Buismateriaal van de strengen",
        description: "Veld MATERIAAL, zoals vastgelegd in de rioolregistratie",
        property: "MATERIAAL",
        maxCategories: 7,
      },
      {
        kind: "histogram",
        title: "Aanlegjaar van de rioolstrengen",
        description:
          "Veld AANLEGJAAR — laat zien in welke perioden het net is aangelegd of vervangen",
        property: "AANLEGJAAR",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een **streng** is één buissegment tussen twee rioolputten. Het *leidingtype* zegt wat er doorheen gaat: een *gemengd* stelsel voert vuil- en regenwater samen af, terwijl gescheiden stelsels *DWA* (droogweerafvoer, vuilwater) en *RWA* (regenwaterafvoer) apart houden. Daarnaast zie je duikers, drainage, infiltratieriolen en drukriolering — vooral in het buitengebied. Het materiaal en aanlegjaar samen geven een indruk van de ouderdom en vervangingsopgave van het net.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vervangingsopgave**: aanlegjaar en materiaal bepalen wanneer een streng aan vervanging toe is; beton en pvc hebben verschillende levensduren.\n- **Klimaatadaptatie**: het aandeel gemengde versus gescheiden (DWA/RWA) en infiltrerende strengen laat zien hoe ver de gemeente is met het afkoppelen van regenwater.\n- **Graafwerk en WION**: bij graafmeldingen (KLIC/WION) is de ligging en het materiaal van rioolbuizen essentieel om schade te voorkomen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De strengen komen uit de rioolbeheerregistratie van de gemeente {city}, ontsloten via ArcGIS Online. Het volledige stelsel telt duizenden strengen; in de standaardweergave worden de eerste circa 2.000 geladen. Gebruik **‘meer laden’** voor het complete net — anders gaan de cijfers over een deelverzameling. De totale lengte volgt uit het veld *STRENGLENGTE* (in meters) en niet uit de kaartgeometrie.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-rioolputten",
    title: "Rioolputten in {city}",
    subtitle:
      "Inspectieputten, kolken en pompen — de knooppunten van het rioolstelsel",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} rioolputten** geladen uit de rioolbeheerregistratie van de gemeente. Elk punt is een object in de ondergrondse riolering: een straatkolk, een inspectieput, een pomp of een overstort. Per put staan het putnummer, de soort put, het aanlegjaar en de maaiveldhoogte geregistreerd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Putten in beeld", type: "count" },
          { label: "Soorten put", type: "distinct", property: "SOORT_PUT" },
          {
            label: "Straatkolken",
            type: "count-where",
            property: "SOORT_PUT",
            equals: "Kolk",
          },
          {
            label: "Pompen",
            type: "count-where",
            property: "SOORT_PUT",
            equals: "Pomp",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rioolputten per soort in {city}",
        description:
          "Veld SOORT_PUT: het type object in de ondergrondse riolering",
        property: "SOORT_PUT",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Rioolputten zijn de knooppunten van het stelsel. De meeste zijn **straatkolken** — de roosters langs de weg die regenwater opvangen. Daarnaast zijn er **inspectieputten** (waar strengen samenkomen en die toegang geven voor onderhoud), **drainageputten**, **pompen** die het water op hoogte houden, en **overstorten/uitlaten** die bij hevige regen het teveel aan water lozen. Samen met de rioolstrengen vormen deze putten de complete kaart van de ondergrondse riolering.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en reiniging**: kolken en putten worden periodiek gereinigd; hun aantal en spreiding bepaalt de onderhoudsplanning.\n- **Wateroverlast**: de dichtheid van kolken en de ligging van overstorten zijn direct relevant voor het voorkomen van straatwater bij piekbuien.\n- **Assetmanagement**: aanlegjaar en soort put voeden de meerjarenplanning voor vervanging en renovatie.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De putten komen uit de rioolregistratie van de gemeente {city} (ArcGIS Online). Dit is een zeer grote laag (ruim twintigduizend objecten, waarvan kolken het leeuwendeel vormen). In de standaardweergave worden de eerste circa 2.000 punten geladen; de verhouding tussen puttypen kan daardoor afwijken van het hele stelsel. Gebruik **‘meer laden’** voor het volledige beeld.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-rioolconstructie-lijnen",
    title: "Rioolconstructies (lijnen) in {city}",
    subtitle:
      "Lijnvormige constructie-elementen van de waterhuishouding: infiltratie, wadi's en bergingsvoorzieningen",
    intro:
      "Deze laag toont **{count} lijnvormige rioolconstructies** binnen het kaartgebied van {city}: bijzondere constructie-elementen van de waterhuishouding die geen gewone buis zijn. Het gaat vooral om infiltratie- en bergingsvoorzieningen die regenwater lokaal vasthouden en in de bodem laten wegzakken. Elk element is geclassificeerd via het veld *TYPE*.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Constructies in beeld", type: "count" },
          { label: "Typen", type: "distinct", property: "TYPE" },
          {
            label: "Infiltratiekratten",
            type: "count-where",
            property: "TYPE",
            equals: "Infiltratiekrat",
          },
          {
            label: "Wadi's",
            type: "count-where",
            property: "TYPE",
            equals: "Wadi",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rioolconstructies per type in {city}",
        description: "Veld TYPE: de aard van de constructie",
        property: "TYPE",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Deze elementen horen bij de moderne, klimaatadaptieve waterhuishouding. Een **infiltratiekrat** is een ondergrondse kunststof buffer die regenwater tijdelijk opslaat en langzaam laat wegzakken. Een **wadi** is een groene, verlaagde greppel die bij regen volloopt en het water infiltreert. **Aquaflow** is een waterdoorlatende verharding, en **randvoorzieningen (BBB)** bufferen water vóór het naar het oppervlaktewater of de zuivering gaat. Samen laten ze zien waar de gemeente regenwater lokaal opvangt in plaats van het via het riool af te voeren.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: deze voorzieningen zijn de zichtbare uitvoering van het beleid om regenwater vast te houden, verdroging tegen te gaan en piekbelasting van het riool te verlagen.\n- **Beheer**: infiltratievoorzieningen vragen specifiek onderhoud (schoonhouden, doorlatendheid bewaken) dat afwijkt van gewoon rioolbeheer.\n- **Ontwerp van nieuwe wijken**: het bestaande areaal is een referentie voor de wateropgave bij nieuwbouw en herinrichting.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de rioolregistratie van de gemeente {city} (ArcGIS Online) en toont de lijnvormige constructie-elementen. De vlakvormige varianten (zoals duikermonden en wadi-vlakken) staan in een aparte laag. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      {
        label: "Wat is een wadi? (Rioned)",
        url: "https://www.riool.net/wadi",
      },
    ],
  },
  {
    layerId: "elb-rioolconstructie-vlakken",
    title: "Rioolconstructies (vlakken) in {city}",
    subtitle:
      "Vlakvormige constructie-elementen: duikermonden, infiltratiekratten en wadi's op de rioolkaart",
    intro:
      "Deze laag toont **{count} vlakvormige rioolconstructies** binnen het kaartgebied van {city}: constructie-onderdelen van de waterhuishouding die als vlak op de rioolkaart staan. Waar de lijnenlaag de langgerekte elementen bevat, gaat het hier om objecten met een oppervlak — van duikermonden tot infiltratievoorzieningen. Elk vlak is geclassificeerd via het veld *TYPE*.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Constructievlakken in beeld", type: "count" },
          { label: "Typen", type: "distinct", property: "TYPE" },
          {
            label: "Duikermonden",
            type: "count-where",
            property: "TYPE",
            equals: "Duikermond",
          },
          {
            label: "Infiltratiekratten",
            type: "count-where",
            property: "TYPE",
            equals: "Infiltratiekrat",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Constructievlakken per type in {city}",
        description: "Veld TYPE: de aard van het constructie-element",
        property: "TYPE",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De grootste groep zijn **duikermonden**: de in- en uitstroomopeningen van duikers, de korte buizen die water onder wegen en paden door leiden. Daarnaast staan er **infiltratiekratten**, **wadi's**, **inspectieputten**, **zandvangputten** en **retentievijvers** op de kaart. Samen vormen ze de bijzondere kunstwerken in het watersysteem — de plekken waar water wordt geleid, gebufferd of gezuiverd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Watersysteembeheer**: duikers en hun monden zijn kwetsbaar voor verstopping; ze bepalen de doorstroming tussen watergangen.\n- **Klimaatadaptatie**: infiltratie- en retentie-elementen laten zien waar de gemeente regenwater vasthoudt.\n- **Onderhoud**: elk type kunstwerk vraagt een eigen inspectie- en onderhoudsregime.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De vlakken komen uit de rioolkaart van de gemeente {city} (ArcGIS Online). Bij grotere aantallen worden in de standaardweergave de eerste circa 2.000 vlakken geladen; gebruik **‘meer laden’** voor de complete set. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-gemeentelijke-monumenten",
    title: "Gemeentelijke monumenten in {city}",
    subtitle:
      "Panden en objecten met een gemeentelijke monumentenstatus, binnen en buiten de vesting",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} gemeentelijke monumenten**: panden en objecten die de gemeente zelf als beschermd monument heeft aangewezen. Ze vullen de rijksmonumenten aan met lokaal waardevol erfgoed — van karakteristieke panden in het beschermde stadsgezicht tot historische boerderijen in het buitengebied. Klik op een monument voor het monumentnummer, het adres en een korte omschrijving.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Monumenten in beeld", type: "count" },
          { label: "Gebieden", type: "distinct", property: "GEBIED" },
          {
            label: "In beschermd stadsgezicht",
            type: "count-where",
            property: "GEBIED",
            equals: "Beschermd stadsgezicht",
          },
          {
            label: "In het buitengebied",
            type: "count-where",
            property: "GEBIED",
            equals: "Buitengebied",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Gemeentelijke monumenten per gebied in {city}",
        description:
          "Veld GEBIED: waar in de gemeente het monument ligt",
        property: "GEBIED",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gemeentelijk monument: een pand of object dat op de gemeentelijke monumentenlijst staat. Anders dan rijksmonumenten worden deze door de gemeente zelf aangewezen en beschermd, meestal omdat ze van lokale of regionale betekenis zijn. In {city} concentreren ze zich in het **beschermde stadsgezicht** van de historische vesting, met daarnaast een reeks karakteristieke **boerderijen en objecten in het buitengebied**.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vergunningen**: voor wijzigingen aan een gemeentelijk monument is een omgevingsvergunning nodig; deze kaart bepaalt of een pand onder die bescherming valt.\n- **Ruimtelijke kwaliteit**: de spreiding laat zien waar historische karakteristieken bewaakt moeten worden bij verbouw en herontwikkeling.\n- **Erfgoedbeleid**: gemeentelijke aanwijzing is het instrument waarmee lokaal waardevol erfgoed wordt geborgd naast de rijksbescherming.",
      },
      {
        heading: "Over de bron",
        body: "De monumenten komen uit de erfgoedregistratie van de gemeente {city} (ArcGIS Online). De omschrijvingen zijn deels ingevuld; niet elk monument heeft een volledige redengevende beschrijving. De kaart toont de monumenten binnen de uitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      {
        label: "Gemeente Elburg — monumenten & erfgoed",
        url: "https://www.elburg.nl/",
      },
    ],
  },
  {
    layerId: "elb-rijksmonumenten",
    title: "Rijksmonumenten in {city}",
    subtitle:
      "Rijksbeschermd erfgoed uit de erfgoedkaart, met de vestingwerken als complex",
    intro:
      "Deze laag toont **{count} rijksmonumenten** binnen het kaartgebied van {city}: panden en objecten die door het Rijk zijn beschermd en in het landelijke monumentenregister staan. {city} is als historisch vestingstadje uitzonderlijk rijk aan rijksmonumenten — het merendeel ligt in het beschermde stadsgezicht, met de vestingwerken zelf als apart monumentencomplex. Klik op een monument voor het monumentnummer en een link naar het rijksmonumentenregister.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Rijksmonumenten in beeld", type: "count" },
          {
            label: "Monumentcomplexen",
            type: "count-where",
            property: "SOORT",
            equals: "Rijksmonument-complex",
          },
          { label: "Gebieden", type: "distinct", property: "GEBIED" },
          {
            label: "In beschermd stadsgezicht",
            type: "count-where",
            property: "GEBIED",
            equals: "Beschermd Stadsgezicht",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rijksmonumenten per gebied in {city}",
        description:
          "Veld GEBIED: het deelgebied of landgoed waar het monument ligt",
        property: "GEBIED",
        maxCategories: 7,
      },
      {
        kind: "category-bar",
        title: "Type rijksmonument",
        description:
          "Veld SOORT: losse rijksmonumenten versus overkoepelende monumentcomplexen",
        property: "SOORT",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een rijksmonument. De meeste zijn losse **panden of objecten**; daarnaast zijn er enkele **monumentcomplexen**, zoals de vestingwerken, waarbij meerdere onderdelen onder één complexnummer vallen. De sterke concentratie in het **beschermde stadsgezicht** weerspiegelt de goed bewaarde historische kern van {city}; daarbuiten liggen rijksmonumenten verspreid over het buitengebied en op enkele landgoederen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Rijksbescherming**: aan rijksmonumenten mag alleen worden gewijzigd met een vergunning; deze kaart is het vertrekpunt om te bepalen of een pand onder die bescherming valt.\n- **Toerisme en identiteit**: de dichtheid aan rijksmonumenten is bepalend voor het toeristische en culturele profiel van de vestingstad.\n- **Gebiedsontwikkeling**: bij herinrichting van de binnenstad geven de monumenten en het beschermde stadsgezicht de kaders voor wat wel en niet kan.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de erfgoedkaart van de gemeente {city} (ArcGIS Online). Het veld met de redengevende beschrijving verwijst per monument door naar het officiële **monumentenregister** van de Rijksdienst voor het Cultureel Erfgoed. De kaart toont de monumenten binnen de uitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      {
        label: "Rijksmonumentenregister (RCE)",
        url: "https://monumentenregister.cultureelerfgoed.nl/",
      },
    ],
  },
  {
    layerId: "elb-rioolhuisaansluiting",
    title: "Rioolhuisaansluitingen in {city}",
    subtitle:
      "De aansluitleidingen van percelen op het gemeentelijke riool: vuilwater, regenwater en kolken",
    intro:
      "Deze laag toont **{count} rioolhuisaansluitingen** binnen het kaartgebied van {city}: de leidingen die individuele percelen en straatkolken op het hoofdriool aansluiten. Ze zijn per functie gerubriceerd — droogweerafvoer (vuilwater), regenwaterafvoer en kolkaansluitingen. Zo zie je waar en hoe panden op de gemeentelijke riolering zijn aangesloten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Aansluitingen in beeld", type: "count" },
          {
            label: "Vuilwater (DWA)",
            type: "count-where",
            property: "LAYER",
            equals: "1 DWA",
          },
          {
            label: "Regenwater (RWA)",
            type: "count-where",
            property: "LAYER",
            equals: "1 RWA",
          },
          {
            label: "Kolkaansluitingen",
            type: "count-where",
            property: "LAYER",
            equals: "1 KOLKEN",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rioolhuisaansluitingen per functie in {city}",
        description: "Veld LAYER: de functie van de aansluitleiding",
        property: "LAYER",
        valueLabels: {
          "1 DWA": "DWA — vuilwater",
          "1 RWA": "RWA — regenwater",
          "1 KOLKEN": "Kolken — straatafvoer",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een **huisaansluiting** is de leiding vanaf de perceelgrens (of een straatkolk) naar het hoofdriool in de straat. De rubricering laat de functie zien: **DWA** voert het vuilwater van woningen en bedrijven af, **RWA** het regenwater van daken en verharding, en **kolken** de aansluitingen van de straatkolken. In een gescheiden stelsel zijn DWA en RWA aparte leidingen; in een gemengd stelsel komt alles samen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Afkoppelen**: het onderscheid tussen DWA en RWA laat zien in hoeverre regenwater al gescheiden wordt afgevoerd — de kern van klimaatadaptief rioolbeheer.\n- **Storingen en verantwoordelijkheid**: de grens tussen particuliere aansluiting en gemeentelijk riool bepaalt wie een verstopping moet verhelpen.\n- **Beheer**: het aantal en de spreiding van aansluitingen voeden onderhouds- en vervangingsplanning.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de rioolregistratie van de gemeente {city} (ArcGIS Online) en is oorspronkelijk uit tekeningen (CAD) afgeleid; naast het functieveld bevat ze weinig inhoudelijke attributen. Dit is een zeer grote laag (tienduizenden leidingen); in de standaardweergave worden de eerste circa 2.000 geladen. Gebruik **‘meer laden’** voor het volledige beeld — anders is de verhouding tussen DWA, RWA en kolken indicatief.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-openbare-verlichting",
    title: "Openbare verlichting in {city}",
    subtitle:
      "De lichtmasten van de gemeente, met hun plaatsingsjaar (registratie 2024)",
    intro:
      "Deze laag toont **{count} lichtmasten** van de openbare verlichting binnen het kaartgebied van {city}, uit de beheerregistratie van 2024. Elke stip is een lantaarnpaal; per mast is onder meer het plaatsingsjaar vastgelegd, wat een beeld geeft van de ouderdom en vervangingsopgave van het verlichtingsareaal.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Lichtmasten in beeld", type: "count" },
          {
            label: "Mediaan plaatsingsjaar",
            type: "median",
            property: "PLANTYEAR",
            decimals: 0,
          },
          {
            label: "Oudste plaatsingsjaar",
            type: "min",
            property: "PLANTYEAR",
            decimals: 0,
          },
          {
            label: "Nieuwste plaatsingsjaar",
            type: "max",
            property: "PLANTYEAR",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Plaatsingsjaar van de lichtmasten in {city}",
        description:
          "Veld PLANTYEAR — aantal masten per plaatsingsperiode",
        property: "PLANTYEAR",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een lichtmast uit het beheersysteem voor de openbare verlichting. Het **plaatsingsjaar** is het meest bruikbare kenmerk: het laat zien wanneer de mast is gezet en dus hoe oud het areaal is. Masten hebben een beperkte levensduur (grofweg 40–60 jaar voor de mast, korter voor het armatuur), zodat het plaatsingsjaar direct de vervangings- en verduurzamingsopgave voedt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verduurzaming**: oudere masten dragen vaak nog conventionele armaturen; het plaatsingsjaar helpt bij het plannen van de overstap naar zuinige led-verlichting.\n- **Veiligheid en sociale veiligheid**: de dichtheid en spreiding van masten bepalen hoe goed straten en paden verlicht zijn.\n- **Beheerbudget**: leeftijdsopbouw van het areaal is de basis voor de meerjarige onderhouds- en vervangingsbegroting.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de beheerregistratie openbare verlichting 2024 van de gemeente {city} (ArcGIS Online). Veel technische velden (zoals type en armatuur) zijn in de open dataset niet ingevuld; daarom richt dit verhaal zich op het betrouwbaar gevulde plaatsingsjaar. Bij grotere aantallen worden in de standaardweergave de eerste circa 2.000 masten geladen; gebruik **‘meer laden’** voor het complete areaal.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-ov-kasten",
    title: "Schakelkasten openbare verlichting in {city}",
    subtitle:
      "De voedings- en schakelkasten die de lichtmasten van stroom voorzien (registratie 2024)",
    intro:
      "Deze laag toont **{count} schakelkasten** voor de openbare verlichting binnen het kaartgebied van {city}, uit de beheerregistratie van 2024. Een schakelkast voedt en schakelt een groep lichtmasten; samen vormen de kasten de ruggengraat van het verlichtingsnet. Per kast is onder meer een kastnummer geregistreerd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Schakelkasten in beeld", type: "count" },
          {
            label: "Unieke kastnummers",
            type: "distinct",
            property: "KAST_NUMBE",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een schakel- of voedingskast voor de openbare verlichting. Vanuit zo'n kast worden de omliggende lichtmasten van stroom voorzien en aan- en uitgeschakeld (vroeger op een tijdklok, tegenwoordig steeds vaker op afstand bestuurbaar). Het aantal kasten is klein in verhouding tot het aantal masten: één kast bedient doorgaans een hele buurt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Storingsafhandeling**: bij uitval van een straat is de bijbehorende schakelkast het eerste aangrijpingspunt.\n- **Slim schakelen**: kasten zijn de plek waar dimmen en dynamisch schakelen worden geregeld — belangrijk voor energiebesparing en lichthinderbeperking.\n- **Netbeheer**: de ligging van kasten en hun EAN-koppeling met het elektriciteitsnet is nodig voor beheer en energieafrekening.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de beheerregistratie openbare verlichting 2024 van de gemeente {city} (ArcGIS Online). Het gaat om een klein, volledig geladen bestand. Detailvelden zoals kasttype zijn in de open dataset grotendeels niet ingevuld, waardoor dit verhaal bij het aantal en de kastnummers blijft.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-boomzone",
    title: "Boomzones en boomstructuren in {city}",
    subtitle:
      "Lijnvormige groenelementen: laanbeplanting, houtsingels en boomstructuren in beheer bij de gemeente",
    intro:
      "Deze laag tekent **{count} boomzones en boomstructuren** binnen het kaartgebied van {city}: lijnvormige groenelementen zoals lanen, boomrijen en houtsingels in het gemeentelijke beheergebied. In plaats van losse bomen toont deze laag de samenhangende groenstructuren die het landschappelijke en stedelijke groenraamwerk vormen.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Boomstructuren in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een **boomzone** of **boomstructuur**: een aaneengesloten groenelement zoals een laan langs een weg, een houtsingel rond een erf of een boomrij in een park. Deze structuurbenadering laat zien hoe het groen samenhangt — belangrijker voor het landschapsbeeld en de ecologie dan de individuele boom. De laag bevat vooral de ligging van deze structuren; inhoudelijke kenmerken per element zijn beperkt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Groenstructuurbeleid**: lanen en singels vormen het groene raamwerk van een gemeente; ze bepalen belevingswaarde, schaduw en verkoeling.\n- **Ecologie en biodiversiteit**: lijnvormig groen fungeert als verbindingszone waarlangs dieren zich verplaatsen.\n- **Klimaatadaptatie**: bomenrijen dempen hitte en vangen water op; hun ligging voedt de hittestress- en vergroeningsopgave.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de groenbeheerdata van de gemeente {city} (ArcGIS Online) en toont de lijnvormige boomstructuren binnen de kaartuitsnede. Het is een relatief klein, volledig geladen bestand; het bevat de structuren zelf en niet de kenmerken van afzonderlijke bomen.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-speelplaatsen",
    title: "Speelplaatsen en sportplekken in {city}",
    subtitle:
      "Speelplekken, trapvelden en buitensportvoorzieningen in de openbare ruimte",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} speel- en sportplekken** geladen: speelplaatsen, trapvelden, basketbalvelden, fitness- en skatevoorzieningen in de openbare ruimte. Elke stip is een plek waar in de buurt gespeeld en gesport kan worden. Klik op een punt voor de naam, de doelgroep en een toelichting.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Speel- en sportplekken in beeld", type: "count" },
          { label: "Typen voorziening", type: "distinct", property: "LAYER" },
          {
            label: "Trapvelden",
            type: "count-where",
            property: "LAYER",
            equals: "Point (trapveld)",
          },
          {
            label: "Basketbalvelden",
            type: "count-where",
            property: "LAYER",
            equals: "Point (basketbalveld)",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Speel- en sportplekken per type in {city}",
        description:
          "Veld LAYER: de aard van de voorziening",
        property: "LAYER",
        valueLabels: {
          "Point (speelplek)": "Speelplek",
          "Point (trapveld)": "Trapveld",
          "Point (basketbalveld)": "Basketbalveld",
          "Point (fitness)": "Fitnessplek",
          "Point (skate)": "Skatevoorziening",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een speel- of sportvoorziening in de openbare ruimte. De meeste zijn klassieke **speelplekken** voor jonge kinderen; daarnaast zijn er **trapvelden** en **basketbalvelden** voor oudere kinderen en jongeren, en enkele **fitness-** en **skatevoorzieningen**. Bij veel plekken staat een doelgroep (leeftijd) vermeld, al is die registratie niet overal even eenduidig ingevuld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Speelruimtebeleid**: de spreiding en het type voorzieningen bepalen of kinderen in elke wijk op loopafstand kunnen spelen en bewegen.\n- **Gezondheid en ontmoeting**: buitensport- en speelplekken stimuleren bewegen en zijn belangrijke ontmoetingsplekken in de buurt.\n- **Beheer en veiligheid**: speeltoestellen vragen periodieke inspectie; deze registratie is de basis voor onderhoud en vervanging.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de openbare-ruimtedata van de gemeente {city} (ArcGIS Online). Het is een klein, volledig geladen bestand. De doelgroep- en tekstvelden zijn per plek verschillend ingevuld; de typering (speelplek, trapveld, enzovoort) is het meest consistent en vormt daarom de basis van de grafiek.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-bladkorven",
    title: "Bladkorven in {city}",
    subtitle:
      "Locaties van bladkorven waar bewoners in het najaar afgevallen blad kwijt kunnen",
    intro:
      "Deze laag toont **{count} bladkorven** binnen het kaartgebied van {city}: de open korven die de gemeente in het najaar plaatst zodat bewoners afgevallen blad uit de openbare ruimte kwijt kunnen. Elke stip is één korflocatie. Zo zie je waar in de gemeente deze najaarsvoorziening staat.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Bladkorven in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een **bladkorf** is een open gaaskorf die de gemeente in de bladval-periode (grofweg oktober tot december) neerzet op plekken met veel bomen. Bewoners kunnen er afgevallen blad in kwijt, dat de gemeente periodiek leegt en afvoert. De laag bevat de locaties zelf; verdere kenmerken per korf zijn niet geregistreerd, dus dit verhaal draait om aantal en spreiding.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Dienstverlening**: de spreiding laat zien of bladkorven aansluiten bij de plekken met de meeste bladval (lanen, parken).\n- **Veiligheid**: nat blad op straat en fietspad is glad; korven op de juiste plek helpen gladheid en verstopte kolken voorkomen.\n- **Planning winterdienst**: bladinzameling en gladheidbestrijding lopen in het najaar in elkaar over; korflocaties helpen bij de logistiek.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de openbare-ruimtedata van de gemeente {city} (ArcGIS Online) en is een klein, volledig geladen puntenbestand. De korven zijn een seizoensvoorziening; de kaart toont de geregistreerde locaties binnen de uitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      { label: "Gemeente Elburg", url: "https://www.elburg.nl/" },
    ],
  },
  {
    layerId: "elb-parkeren",
    title: "Parkeergebieden in {city}",
    subtitle:
      "Parkeer- en verkeersregimes in het centrum: kort parkeren, ontheffing, voetgangerszones",
    intro:
      "Deze laag toont **{count} parkeergebieden** binnen het kaartgebied van {city}, vooral in de historische binnenstad en het centrum. Elk vlak heeft een regime: kort parkeren, parkeren met ontheffing, verboden te parkeren of voetgangerszone. Zo zie je in één beeld hoe het parkeren en de autoluwe zones in het centrum zijn geregeld.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Parkeergebieden in beeld", type: "count" },
          { label: "Regimes", type: "distinct", property: "LAYER" },
          {
            label: "Kort parkeren",
            type: "count-where",
            property: "LAYER",
            equals: "a-Kort parkeren",
          },
          {
            label: "Voetgangerszones",
            type: "count-where",
            property: "LAYER",
            equals: "a-Voetgangerszone",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Parkeergebieden per regime in {city}",
        description: "Veld LAYER: het parkeer- of verkeersregime van de zone",
        property: "LAYER",
        valueLabels: {
          "a-Parkeren met ontheffing": "Parkeren met ontheffing",
          "a-Kort parkeren": "Kort parkeren",
          "a-Verboden te parkeren": "Verboden te parkeren",
          "a-Voetgangerszone": "Voetgangerszone",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gebied met een eigen parkeer- of verkeersregime. **Kort parkeren** geldt op plekken waar de gemeente doorstroming van bezoekers wil; **parkeren met ontheffing** is bedoeld voor bewoners en vergunninghouders; **verboden te parkeren** en **voetgangerszones** houden delen van de vesting autovrij of autoluw. Samen laten ze het parkeerbeleid van de historische binnenstad zien.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Leefbaarheid binnenstad**: het evenwicht tussen bereikbaarheid en autoluwe, aantrekkelijke straten is bepalend voor de vesting als woon- en bezoekgebied.\n- **Handhaving**: de regimegrenzen zijn de basis voor parkeercontrole en ontheffingenbeleid.\n- **Bezoekersstromen**: kort-parkeerplekken en voetgangerszones sturen waar bezoekers hun auto laten en te voet verdergaan.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de verkeers- en parkeerdata van de gemeente {city} (ArcGIS Online). Het is een klein, volledig geladen bestand dat zich concentreert op het centrum en de vesting. De regimebenaming komt uit het bronveld; de kaart toont de gebieden binnen de uitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      {
        label: "Gemeente Elburg — parkeren",
        url: "https://www.elburg.nl/",
      },
    ],
  },
  {
    layerId: "elb-strooiroute",
    title: "Strooiroutes in {city}",
    subtitle:
      "De vaste rijroutes voor gladheidbestrijding in de winterdienst",
    intro:
      "Deze laag tekent **{count} strooiroute-segmenten** binnen het kaartgebied van {city}: de vaste rijroutes waarlangs de strooiwagens bij gladheid zout uitstrooien. Samen vormen de lijnen het prioritaire wegennet dat de gemeente als eerste sneeuw- en ijsvrij houdt. Wegen die niet op de route liggen, worden bij gladheid niet of pas later behandeld.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Route-segmenten in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een stuk weg dat deel uitmaakt van een strooiroute. De gemeente kiest deze routes op basis van belangrijkheid en risico: doorgaande wegen, busroutes, hoofdfietsroutes en toegangen tot voorzieningen krijgen voorrang. Woonstraten en rustige wegen liggen meestal niet op de route. De laag toont de ligging van de routes; strooisnelheid of dosering per segment is niet opgenomen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: het strooiroutenet bepaalt welke wegen bij gladheid begaanbaar blijven — cruciaal voor hulpdiensten, openbaar vervoer en woon-werkverkeer.\n- **Verwachtingsmanagement**: bewoners kunnen zien of hun straat wel of niet standaard wordt gestrooid.\n- **Optimalisatie**: routelengte en dekking voeden de afweging tussen kosten, zoutverbruik en veiligheid.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de winterdienstdata van de gemeente {city} (ArcGIS Online) en toont de rijroutes voor gladheidbestrijding binnen de kaartuitsnede. Het is een volledig geladen lijnbestand; het geeft de ligging van de routes, niet de actuele inzet of de weersafhankelijke uitvoering.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      {
        label: "Gemeente Elburg — gladheidbestrijding",
        url: "https://www.elburg.nl/",
      },
    ],
  },
  {
    layerId: "elb-ligplaatsen",
    title: "Ligplaatsen in de haven van {city}",
    subtitle:
      "De genummerde ligplaatsen voor de recreatievaart in de haven van Elburg",
    intro:
      "Deze laag toont **{count} ligplaatsen** in de haven van {city}: de afzonderlijke, genummerde plekken waar (recreatie)vaartuigen kunnen afmeren. Elk vlak is één ligplaats met een uniek nummer. Zo zie je de indeling en omvang van de jachthaven van het vestingstadje in één oogopslag.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Ligplaatsen in beeld", type: "count" },
          {
            label: "Unieke ligplaatsnummers",
            type: "distinct",
            property: "Ligplaats",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een genummerde **ligplaats** in de haven. Samen vormen ze de indeling van de jachthaven: de plekken die per seizoen of passant worden verhuurd aan pleziervaart. Het ligplaatsnummer identificeert elke plek; verdere kenmerken (zoals afmeting of huurstatus) zijn in de open dataset niet opgenomen, dus dit verhaal draait om aantal en indeling.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Recreatie en toerisme**: de haven is een belangrijke publiekstrekker voor de vestingstad; het aantal ligplaatsen bepaalt de capaciteit voor watertoerisme.\n- **Havenbeheer**: de genummerde indeling is de basis voor verhuur, planning en handhaving van de ligplaatsen.\n- **Ruimtelijke afweging**: bij herinrichting of uitbreiding van de haven is de bestaande indeling het vertrekpunt.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de havendata van de gemeente {city} (ArcGIS Online) en is een klein, volledig geladen bestand. De ligplaatsen worden getoond binnen de kaartuitsnede van {city}; de nummering volgt de haveninrichting.",
      },
    ],
    links: [
      {
        label: "Gemeente Elburg — open GIS-data (ArcGIS Online)",
        url: "https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services",
      },
      {
        label: "Gemeente Elburg — haven",
        url: "https://www.elburg.nl/",
      },
    ],
  },
];
