/**
 * Story maps — batch "zwolle-3": gemeentelijke lagen van gemeente Zwolle
 * (ArcGIS-services, alleen zichtbaar binnen Zwolle).
 *
 * Lagen: klimaat-afstand-koelte, milieu-bescherming, horeca, horeca-terrassen,
 * wijkservicepunten, riolering-putten, riolering-strengen, eetbaar-groen,
 * carbid-locaties, standplaatsen, wkpb, bodem-verontreinigingen, bodem-sanering,
 * bodem-locaties, bodem-onderzoeken, bodem-nazorg, riolering-drukpersleiding.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "klimaat-afstand-koelte",
    title: "Afstand tot een koelteplek in {city}",
    subtitle:
      "Hoe ver is het lopen naar de dichtstbijzijnde verkoelende plek tijdens hitte?",
    intro:
      "Deze laag deelt {city} op in **{count} zones** die elk aangeven hoe ver het lopen is naar de dichtstbijzijnde *koelteplek* — een schaduwrijke, verkoelende plek zoals een park, waterpartij of boomrijke straat. Groen betekent koelte om de hoek, rood betekent een lange looproute op een warme dag. De indeling komt uit het klimaatadaptatie-GIS van de gemeente Zwolle.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zones in beeld", type: "count" },
          {
            label: "Koelte dichtbij (< 100 m)",
            type: "count-where",
            property: "LOOPAFSTAND",
            equals: "< 100 meter",
            asShare: true,
          },
          {
            label: "Ver van koelte (> 500 m)",
            type: "count-where",
            property: "LOOPAFSTAND",
            equals: "> 500 meter",
            asShare: true,
          },
          {
            label: "Afstandsklassen",
            type: "distinct",
            property: "LOOPAFSTAND",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zones per afstandsklasse tot een koelteplek in {city}",
        description:
          "Veld LOOPAFSTAND: de loopafstand vanaf de zone tot de dichtstbijzijnde koelteplek",
        property: "LOOPAFSTAND",
        maxCategories: 6,
        valueLabels: {
          "< 100 meter": "< 100 m (koelte om de hoek)",
          "100 - 200 meter": "100 – 200 m",
          "200 - 300 meter": "200 – 300 m",
          "300 - 400 meter": "300 – 400 m",
          "400 - 500 meter": "400 – 500 m",
          "> 500 meter": "> 500 m (ver weg)",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke gekleurde vlek is een gebiedje met één afstandsklasse: de loopafstand — via het straten- en padennetwerk, niet hemelsbreed — naar de dichtstbijzijnde koelteplek. Een koelteplek is een plek die op warme dagen merkbaar verkoeling geeft, bijvoorbeeld door schaduw van bomen, water of veel groen. Hoe donkerder/roder de kleur, hoe verder bewoners moeten lopen om verkoeling te vinden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hittestress**: bij toenemende hitte zijn plekken met verkoeling een gezondheidsvraagstuk, vooral voor ouderen en jonge kinderen.\n- **Groennorm**: veel gemeenten hanteren een streefafstand tot koelte (vaak 300 m); deze kaart laat zien welke buurten daar (nog) niet aan voldoen.\n- **Vergroening prioriteren**: rode zones zijn logische kandidaten voor extra bomen, schaduwplekken of ontharding.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het klimaatadaptatie-GIS van de gemeente Zwolle (service *Klimaat*). De afstand is een modeluitkomst op basis van de aanwezige koelteplekken en het loopnetwerk; de precieze definitie van 'koelteplek' bepaalt sterk het beeld. De statistieken gaan over de zones binnen de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — klimaatadaptatie",
        url: "https://www.zwolle.nl/klimaatadaptatie",
      },
      {
        label: "ArcGIS-service Klimaat (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Klimaat/FeatureServer",
      },
    ],
  },
  {
    layerId: "milieu-bescherming",
    title: "Milieubeschermingsgebieden in {city}",
    subtitle: "Gebieden met een bijzondere milieubeschermingsstatus",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} milieubeschermingsgebieden** volgens de gemeentelijke milieukaart. Dit zijn zones waar extra beschermingsregels gelden vanwege bijvoorbeeld grondwater, stilte of natuurwaarden. Klik op een gebied voor de naam en de beschermingssoort.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebieden in beeld", type: "count" },
          { label: "Benoemde gebieden", type: "distinct", property: "NAAM" },
        ],
      },
      {
        kind: "category-bar",
        title: "Milieubeschermingsgebieden per naam in {city}",
        description:
          "Veld NAAM: de benaming van het beschermde gebied (leeg = onbenoemd deelgebied)",
        property: "NAAM",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gebied waarvoor een milieubeschermingsstatus geldt. Sommige gebieden hebben een herkenbare naam (zoals een grondwater- of stiltegebied), andere zijn onbenoemde deelvlakken. De onderliggende *SOORT*-code geeft het type bescherming aan, maar de betekenis van die codes is niet uit de laag zelf af te leiden en wordt hier daarom niet vertaald.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vergunningen en ruimtelijke plannen**: binnen een milieubeschermingsgebied gelden vaak strengere eisen aan activiteiten, lozingen of bouwwerken.\n- **Drinkwater en natuur**: grondwaterbeschermings- en stiltegebieden borgen kwetsbare functies; ze bepalen mede waar bepaalde bedrijvigheid wél of niet kan.\n- **Afstemming provincie**: veel milieubeschermingsgebieden zijn provinciaal aangewezen en in de gemeentelijke kaart overgenomen.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de milieukaart van de gemeente Zwolle (service *Milieu*). De kaart toont alleen gebieden binnen de kaartuitsnede van {city}; een gebied dat over de gemeentegrens doorloopt telt mee met het deel dat is ingetekend.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle",
        url: "https://www.zwolle.nl/",
      },
      {
        label: "ArcGIS-service Milieu (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Milieu/MapServer",
      },
    ],
  },
  {
    layerId: "horeca",
    title: "Horecavergunningen in {city}",
    subtitle: "Verleende horeca-exploitatievergunningen, per soort inrichting",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} horecalocaties** met een verleende exploitatievergunning in beeld, uit het openbare horecabestand van de gemeente Zwolle. Van een regulier café tot een coffeeshop of slijterij: elke vergunning is één punt, met adres en het soort inrichting. Klik op een punt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vergunningen in beeld", type: "count" },
          { label: "Soorten inrichting", type: "distinct", property: "SOORT" },
          {
            label: "Coffeeshops",
            type: "count-where",
            property: "SOORT",
            equals: "Coffeeshop",
          },
          {
            label: "Slijterijen",
            type: "count-where",
            property: "SOORT",
            equals: "Slijterij",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Horecavergunningen per soort in {city}",
        description:
          "Veld SOORT: het type horeca-inrichting waarvoor de vergunning geldt",
        property: "SOORT",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een pand met een geldige horeca-exploitatievergunning. Het veld *SOORT* onderscheidt onder meer reguliere horeca, paracommerciële horeca (kantines van verenigingen), slijterijen, coffeeshops en enkele bijzondere categorieën. Alle getoonde vergunningen hebben de status *Toegekend*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Leefbaarheid en toezicht**: de concentratie en het type horeca zijn belangrijk voor het horecabeleid, geluidsnormen en handhaving.\n- **Levendigheid van het centrum**: horecadichtheid is een indicator voor de aantrekkelijkheid en functie van een gebied.\n- **Ruimtelijke ordening**: bij bestemmingsplannen en vergunningen is inzichtelijk waar welke horeca is toegestaan een belangrijke basis.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit het openbare horecabestand van de gemeente Zwolle (service *Horeca_openbaar*). Het gaat om de administratieve vergunningregistratie; een net gesloten of net geopende zaak kan achterlopen op de werkelijkheid. De statistieken gaan over de locaties binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — horeca en vergunningen",
        url: "https://www.zwolle.nl/horeca",
      },
      {
        label: "ArcGIS-service Horeca (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Horeca_openbaar/FeatureServer",
      },
    ],
  },
  {
    layerId: "horeca-terrassen",
    title: "Terrassen in {city}",
    subtitle: "De ingetekende terrasvlakken bij horecazaken",
    intro:
      "Deze laag toont **{count} terrasvlakken** binnen het kaartgebied van {city}: de fysieke oppervlakken waarop horecazaken volgens de gemeente een terras mogen exploiteren. Anders dan de horecavergunningen (punten) zijn dit vlakken — je ziet dus niet alleen wáár een terras is, maar ook hoe groot. Klik op een vlak voor de naam van de zaak.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Terrassen in beeld", type: "count" },
          { label: "Horecazaken met terras", type: "distinct", property: "NAAM" },
          {
            label: "Totale terrasoppervlakte",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde terrasgrootte",
            type: "avg",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Grootteverdeling van terrassen in {city}",
        description:
          "Oppervlakte per terrasvlak (Shape__Area), in vierkante meters",
        property: "Shape__Area",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is één ingetekend terras. Eén horecazaak kan meerdere terrasvlakken hebben (bijvoorbeeld aan weerszijden van de gevel), waardoor het aantal terrassen hoger kan liggen dan het aantal zaken. De oppervlakte per vlak komt uit de geometrie zelf en geeft een goed beeld van hoeveel openbare ruimte terrassen innemen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Openbare ruimte**: terrassen leggen beslag op stoepen en pleinen; hun omvang raakt aan doorloopruimte, toegankelijkheid en de balans tussen functies.\n- **Terrasbeleid en precario**: de ingetekende oppervlakken zijn de basis voor terrasvergunningen en eventuele heffingen.\n- **Levendigheid**: terrassen bepalen mede de sfeer en aantrekkelijkheid van het centrum en buurtwinkelgebieden.",
      },
      {
        heading: "Over de bron",
        body: "De terrasvlakken komen uit het openbare horecabestand van de gemeente Zwolle (service *Horeca_openbaar*). Het gaat om de vergunde/ingetekende situatie, die kan afwijken van wat er op een specifieke dag daadwerkelijk staat. De statistieken gaan over de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — terrassen",
        url: "https://www.zwolle.nl/terras",
      },
      {
        label: "ArcGIS-service Horeca (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Horeca_openbaar/FeatureServer",
      },
    ],
  },
  {
    layerId: "wijkservicepunten",
    title: "Wijkservicepunten in {city}",
    subtitle: "Wijkcentra en buurthuizen waar bewoners terechtkunnen",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} wijkservicepunten**: laagdrempelige plekken — vaak wijkcentra of buurthuizen — waar bewoners terechtkunnen met vragen, voor activiteiten en voor contact met de gemeente en welzijnspartners. Klik op een punt voor de naam en het adres.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wijkservicepunten in beeld", type: "count" },
          {
            label: "Wijkgebieden",
            type: "distinct",
            property: "OMSCHRIJVING",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Wijkservicepunten per wijkgebied in {city}",
        description:
          "Veld OMSCHRIJVING: het wijk-/stadsdeel waaronder het servicepunt valt",
        property: "OMSCHRIJVING",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een wijkservicepunt met een naam (het gebouw, bijvoorbeeld een wijkcentrum) en een *OMSCHRIJVING* die aangeeft voor welk wijk- of stadsdeel het punt de spil vormt. Het is een klein, overzichtelijk netwerk: één of enkele punten per stadsdeel.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sociale basis**: wijkservicepunten zijn ankerpunten voor welzijn, ontmoeting en ondersteuning dicht bij huis.\n- **Bereikbaarheid van voorzieningen**: de spreiding laat zien welke wijken een eigen punt hebben en welke op een naburig punt zijn aangewezen.\n- **Beleid sociaal domein**: bij bezuinigingen of uitbreiding van het voorzieningenniveau is de spreiding het vertrekpunt.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke registratie van wijkservicepunten (service *Wijkservicepunten*). Het is een kleine dataset; de statistieken gaan over de punten binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — wijken en buurten",
        url: "https://www.zwolle.nl/wijken",
      },
      {
        label: "ArcGIS-service Wijkservicepunten (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Wijkservicepunten/FeatureServer",
      },
    ],
  },
  {
    layerId: "riolering-putten",
    title: "Rioolputten in {city}",
    subtitle:
      "De knooppunten van het rioolstelsel: inspectieputten, gemalen en meer",
    intro:
      "Deze laag toont **{count} rioolputten** (knooppunten van het rioolstelsel) binnen het kaartgebied van {city}, uit het beheerbestand riolering van de gemeente. Elk punt is een put of constructie waar leidingen samenkomen: van een gewone inspectieput tot een rioolgemaal of infiltratieput. Klik op een put voor het knooppunttype, het materiaal en het maaiveldniveau.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Putten in beeld", type: "count" },
          {
            label: "Knooppunttypen",
            type: "distinct",
            property: "KNOOPPUNTTYPE",
          },
          {
            label: "Inspectieputten",
            type: "count-where",
            property: "KNOOPPUNTTYPE",
            equals: "Inspectieput",
          },
          {
            label: "Rioolgemalen",
            type: "count-where",
            property: "KNOOPPUNTTYPE",
            equals: "Rioolgemaal",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rioolputten per knooppunttype in {city}",
        description:
          "Veld KNOOPPUNTTYPE: de functie van de put binnen het rioolstelsel",
        property: "KNOOPPUNTTYPE",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Materiaal van de putten in {city}",
        description: "Veld MATERIAAL: het bouwmateriaal van de putconstructie",
        property: "MATERIAAL",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een knooppunt in het rioolstelsel. Verreweg de meeste zijn *inspectieputten* — de standaardputten waar het riool bereikbaar is voor inspectie en reiniging. Daarnaast zijn er functionele constructies zoals *rioolgemalen* (die water oppompen), *infiltratieputten* en diverse bijzondere putten. Samen met de leidingen (zie de laag *Riolering Leidingen*) vormen ze het complete ondergrondse netwerk.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Assetmanagement**: put voor put wordt het rioolonderhoud gepland; type en materiaal bepalen de levensduur en het onderhoudsregime.\n- **Klimaatadaptatie**: infiltratie- en bergingsconstructies laten zien waar het stelsel is ingericht op het vasthouden van regenwater.\n- **Storingen en calamiteiten**: gemalen en bijzondere putten zijn de kwetsbare, actieve onderdelen van het stelsel.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het beheerbestand riolering van de gemeente Zwolle (service *Riolering_openbaar*, onderdeel *bodem & ondergrond*). Dit is een grote dataset; bij grote uitsnedes wordt maar een deel van de putten geladen, dus lees de aantallen als een beeld van de kaartuitsnede, niet als een sluitende telling voor de hele gemeente. Het veld *MATERIAAL* is niet overal ingevuld.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — riolering",
        url: "https://www.zwolle.nl/riolering",
      },
      {
        label: "ArcGIS-service Riolering (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Riolering_openbaar/FeatureServer",
      },
    ],
  },
  {
    layerId: "riolering-strengen",
    title: "Rioolleidingen in {city}",
    subtitle:
      "De strengen van het rioolstelsel: vuilwater-, hemelwater- en gemengde riolen",
    intro:
      "Deze laag tekent **{count} rioolstrengen** (leidingen) binnen het kaartgebied van {city}, uit het beheerbestand riolering van de gemeente. Elke lijn is één leiding tussen twee putten, met een type (bijvoorbeeld vuilwater, hemelwater of gemengd), een materiaal en een lengte. Zo zie je hoe het ondergrondse stelsel onder de straten doorloopt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Strengen in beeld", type: "count" },
          {
            label: "Totale leidinglengte",
            type: "sum",
            property: "LENGTE",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gemiddelde strenglengte",
            type: "avg",
            property: "LENGTE",
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
        title: "Rioolleidingen per type in {city}",
        description:
          "Veld LEIDINGTYPE: de functie van de leiding binnen het stelsel",
        property: "LEIDINGTYPE",
        maxCategories: 8,
      },
      {
        kind: "histogram",
        title: "Lengteverdeling van rioolstrengen in {city}",
        description:
          "Aantal strengen per lengteklasse (veld LENGTE), in meters",
        property: "LENGTE",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een streng: het stuk leiding tussen twee putten. Het *LEIDINGTYPE* vertelt wat er doorheen stroomt — een *gemengd riool* voert vuil- én regenwater samen af, terwijl een gescheiden stelsel *vuilwater-* en *hemelwaterriolen* apart houdt. Hemelwater- en infiltratieriolen horen bij de klimaatbestendige inrichting; drukleidingen en persleidingen transporteren rioolwater onder druk.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Afkoppelen en klimaat**: de verhouding tussen gemengde en gescheiden riolen laat zien hoe ver de gemeente is met het scheiden van schoon en vuil water.\n- **Vervanging en investering**: leeftijd, materiaal en lengte bepalen het vervangingsprogramma; de totale lengte is een directe maat voor het areaal dat beheerd wordt.\n- **Wateroverlast**: de ligging en capaciteit van de strengen zijn de basis voor het doorrekenen van hevige buien.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het beheerbestand riolering van de gemeente Zwolle (service *Riolering_openbaar*). Dit is een grote dataset; bij een ruime kaartuitsnede wordt maar een deel geladen, dus de totale lengte is die van de geladen strengen — niet het volledige gemeentelijke stelsel. Strengen die de rand van de uitsnede kruisen tellen mee met hun volledige geregistreerde lengte.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — riolering",
        url: "https://www.zwolle.nl/riolering",
      },
      {
        label: "ArcGIS-service Riolering (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Riolering_openbaar/FeatureServer",
      },
    ],
  },
  {
    layerId: "eetbaar-groen",
    title: "Eetbaar groen en stadslandbouw in {city}",
    subtitle:
      "Buurttuinen, volkstuinen, wijkboerderijen en andere plekken om te telen",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} locaties voor eetbaar groen en stadslandbouw** in beeld: van buurt- en volkstuinen tot wijkboerderijen en natuureducatieparken. Het zijn plekken waar bewoners samen groente, fruit en groen verbouwen. Klik op een punt voor de naam en het type tuin.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Locaties in beeld", type: "count" },
          { label: "Typen", type: "distinct", property: "TYPE" },
          {
            label: "Buurttuinen",
            type: "count-where",
            property: "TYPE",
            equals: "Buurttuinen",
          },
          {
            label: "Volkstuinen",
            type: "count-where",
            property: "TYPE",
            equals: "Volkstuinen",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Eetbaar groen per type in {city}",
        description: "Veld TYPE: het soort tuin- of stadslandbouwlocatie",
        property: "TYPE",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een locatie waar in of om de stad geteeld wordt. Het veld *TYPE* onderscheidt onder meer buurttuinen, volkstuinen, jeugdtuinen, nutstuinen, wijkboerderijen en natuureducatieparken. Sommige zijn kleine buurtinitiatieven, andere zijn grotere, georganiseerde complexen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sociale cohesie**: samen tuinieren brengt bewoners bij elkaar en versterkt de betrokkenheid bij de buurt.\n- **Groen en biodiversiteit**: eetbaar groen voegt beplanting, bloei en bodemleven toe aan de stad.\n- **Voedsel en educatie**: stadslandbouw maakt de herkomst van voedsel zichtbaar en biedt (school)educatie dicht bij huis.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit het gemeentelijke bestand *Eetbaar groen / Stadslandbouw* van Zwolle. Het is een overzichtsdataset die door de gemeente wordt bijgehouden; nieuwe of gestopte initiatieven kunnen achterlopen. De statistieken gaan over de locaties binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — groen en stadslandbouw",
        url: "https://www.zwolle.nl/groen",
      },
      {
        label: "ArcGIS-service Eetbaar groen (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Eetbaar_groen_Stadslandbouw/FeatureServer",
      },
    ],
  },
  {
    layerId: "carbid-locaties",
    title: "Carbidschietlocaties in {city}",
    subtitle: "De aangewezen plekken waar rond de jaarwisseling carbid mag worden geschoten",
    intro:
      "Deze laag toont **{count} aangewezen locaties** binnen het kaartgebied van {city} waar rond de jaarwisseling carbidschieten is toegestaan. Elk vlak is een specifiek terrein — vaak een veldje of open ruimte aan de rand van een buurt of dorp — met een toelichting op de exacte plek. Klik op een vlak voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Locaties in beeld", type: "count" },
          { label: "Gebieden / kernen", type: "distinct", property: "OPMERKINGEN" },
        ],
      },
      {
        kind: "category-bar",
        title: "Carbidlocaties per gebied in {city}",
        description:
          "Veld OPMERKINGEN: de wijk of kern waarin de locatie ligt",
        property: "OPMERKINGEN",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een terrein waar de gemeente carbidschieten rond oud en nieuw toestaat. Het veld *TOELICHTING* beschrijft de precieze plek (bijvoorbeeld 'trapveldje langs het fietspad'), en *OPMERKINGEN* geeft de wijk of kern aan. Buiten deze aangewezen plekken is carbidschieten in de gemeente niet toegestaan.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Veiligheid en handhaving**: carbidschieten kent risico's; door het aan specifieke, ruime locaties te binden houdt de gemeente afstand tot bebouwing en publiek.\n- **Traditie en overlast**: de kaart maakt de afweging tussen het behoud van een traditie en het beperken van overlast concreet en communiceerbaar.\n- **Vergunningverlening**: de aangewezen plekken zijn het vertrekpunt voor meldingen en toezicht rond de jaarwisseling.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit het gemeentelijke bestand *Carbidschietlocaties* van Zwolle. Het is een kleine, seizoensgebonden dataset die jaarlijks wordt geactualiseerd. De statistieken gaan over de locaties binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — jaarwisseling en carbid",
        url: "https://www.zwolle.nl/carbid",
      },
      {
        label: "ArcGIS-service Carbidschietlocaties (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Carbidschietlocaties/MapServer",
      },
    ],
  },
  {
    layerId: "standplaatsen",
    title: "Standplaatsen in {city}",
    subtitle: "Vaste plekken voor ambulante handel, zoals kramen en foodtrucks",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} standplaatsen**: aangewezen plekken in de openbare ruimte waar ambulante handelaren — een viskraam, oliebollenkraam of bloemenstal — met vergunning mogen staan. Elk vlak toont onder meer of de plek beschikbaar is en welke waren er verkocht worden. Klik op een vlak voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Standplaatsen in beeld", type: "count" },
          {
            label: "Volledig beschikbaar",
            type: "count-where",
            property: "BESCHIKBAA",
            equals: "Volledig beschikbaar",
          },
          {
            label: "Niet beschikbaar",
            type: "count-where",
            property: "BESCHIKBAA",
            equals: "Niet beschikbaar",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Standplaatsen naar beschikbaarheid in {city}",
        description:
          "Veld BESCHIKBAA: of de standplaats geheel, gedeeltelijk of niet beschikbaar is",
        property: "BESCHIKBAA",
        maxCategories: 3,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een standplaatslocatie. Het veld *BESCHIKBAA* geeft aan of de plek volledig, gedeeltelijk of niet meer beschikbaar is voor nieuwe vergunningen — een gedeeltelijk beschikbare plek is bijvoorbeeld op sommige weekdagen al vergeven. De detailvelden per plek laten zien welke waren er per dag verkocht (mogen) worden en wat de afmetingen zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ambulante handel**: standplaatsen bieden ondernemers een laagdrempelige plek en bewoners een voorziening dicht bij huis.\n- **Vergunningbeleid**: de beschikbaarheid stuurt direct de uitgifte van standplaatsvergunningen.\n- **Openbare ruimte**: standplaatsen delen de ruimte met verkeer, terrassen en markt; hun ligging vraagt afstemming.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke *Standplaatsenkaart* van Zwolle. Niet elke plek heeft alle velden ingevuld (het gebiedsnummer staat soms alleen in de opmerkingen). De statistieken gaan over de standplaatsen binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — standplaats",
        url: "https://www.zwolle.nl/standplaats",
      },
      {
        label: "ArcGIS-service Standplaatsen (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Standplaatsenkaart/MapServer",
      },
    ],
  },
  {
    layerId: "wkpb",
    title: "Publiekrechtelijke beperkingen (WKPB) in {city}",
    subtitle:
      "Op percelen rustende beperkingen uit de Wet kenbaarheid publiekrechtelijke beperkingen",
    intro:
      "Deze laag toont **{count} publiekrechtelijke beperkingen** binnen het kaartgebied van {city}: overheidsbesluiten die op een onroerende zaak (perceel of pand) rusten en die kopers en eigenaren moeten kunnen kennen. Denk aan een monumentenstatus, een bodemsaneringsplicht of een handhavingsbesluit. Klik op een vlak voor de grondslag en de datum.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Beperkingen in beeld", type: "count" },
          {
            label: "Soorten grondslag",
            type: "distinct",
            property: "GRONDSLAG_OMSCHRIJVING",
          },
          {
            label: "Grondslagcodes",
            type: "distinct",
            property: "GRONDSLAG_CODE",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Beperkingen per grondslag in {city}",
        description:
          "Veld GRONDSLAG_OMSCHRIJVING: de wettelijke grondslag van de beperking",
        property: "GRONDSLAG_OMSCHRIJVING",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een onroerende zaak waarop een publiekrechtelijke beperking rust. De *grondslag* vertelt op welke wet en welk besluit de beperking berust — bijvoorbeeld de Erfgoedwet (monument), de Wet bodembescherming (verontreiniging of sanering) of een handhavingsbesluit dat ook voor rechtsopvolgers geldt. Zulke beperkingen zijn openbaar juist omdat ze de gebruiks- of verkoopmogelijkheden van een pand raken.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Koop en verkoop**: bij een transactie moeten beperkingen kenbaar zijn; ze kunnen de waarde en de gebruiksmogelijkheden beïnvloeden.\n- **Vergunningen en handhaving**: veel beperkingen komen voort uit besluiten die doorwerken bij nieuwe aanvragen of bij handhaving.\n- **Ruimtelijk beeld**: de spreiding laat zien waar in de gemeente relatief veel monumenten, bodemdossiers of handhavingszaken samenkomen.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke WKPB-registratie van Zwolle, gebaseerd op de Wet kenbaarheid publiekrechtelijke beperkingen. Een deel is aan een kadastraal perceel gekoppeld en een deel aan een BAG-object of handmatig ingetekend. De statistieken gaan over de beperkingen binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Kadaster — publiekrechtelijke beperkingen (WKPB)",
        url: "https://www.kadaster.nl/producten/woning/koop-een-woning/publiekrechtelijke-beperkingen",
      },
      {
        label: "ArcGIS-service WKPB (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/WKPB/FeatureServer",
      },
    ],
  },
  {
    layerId: "bodem-verontreinigingen",
    title: "Bodemverontreinigingen in {city}",
    subtitle:
      "Contouren van verontreiniging in grond, grondwater en waterbodem",
    intro:
      "Deze laag toont **{count} verontreinigingscontouren** binnen het kaartgebied van {city}: gebieden waar in de grond, het grondwater of de waterbodem een verhoogde concentratie van schadelijke stoffen is vastgesteld. Elke contour heeft een mate van overschrijding en een dieptebereik. Klik op een contour voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Contouren in beeld", type: "count" },
          {
            label: "In de grond",
            type: "count-where",
            property: "CONTOURTYPE",
            equals: "Grond",
          },
          {
            label: "In het grondwater",
            type: "count-where",
            property: "CONTOURTYPE",
            equals: "Grondwater",
          },
          {
            label: "Boven interventiewaarde (I)",
            type: "count-where",
            property: "OVERSCHRIJDING",
            equals: "I",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Contouren naar mate van overschrijding in {city}",
        description:
          "Veld OVERSCHRIJDING: de toetswaarde die de verontreiniging overschrijdt",
        property: "OVERSCHRIJDING",
        maxCategories: 8,
        valueLabels: {
          S: "S — streefwaarde",
          T: "T — tussenwaarde",
          I: "I — interventiewaarde",
          AW2000: "AW2000 — achtergrondwaarde",
          BGW: "BGW — bodemgebruikswaarde",
        },
      },
      {
        kind: "category-bar",
        title: "Contouren naar milieucompartiment in {city}",
        description:
          "Veld CONTOURTYPE: grond, grondwater of waterbodem",
        property: "CONTOURTYPE",
        maxCategories: 4,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke contour omgrenst een zone waar een verontreiniging is vastgesteld. Het veld *OVERSCHRIJDING* geeft de zwaarte aan volgens de landelijke toetswaarden: de **streefwaarde (S)** is het schone referentieniveau, de **interventiewaarde (I)** is de grens waarboven de bodem als ernstig verontreinigd geldt en sanering in beeld komt; de **tussenwaarde (T)** ligt daar tussenin. Het *CONTOURTYPE* laat zien of het om grond, grondwater of waterbodem gaat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bouwen en graven**: bij grondverzet, bouw of herontwikkeling bepaalt de verontreiniging welke maatregelen en kosten nodig zijn.\n- **Gezondheid en milieu**: verontreinigd grondwater kan zich verspreiden; interventiewaarde-overschrijdingen hebben prioriteit.\n- **Grondtransacties**: de aanwezigheid van een contour is belangrijke informatie bij koop, verkoop en functieverandering.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het bodeminformatiesysteem, ontsloten via de gemeente Zwolle (service *Bodem*, onderdeel *bodem & ondergrond*). Contouren zijn vaak globaal ingetekend en het volume is niet altijd bekend; lees ze als indicatie, niet als exacte begrenzing. De statistieken gaan over de contouren binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Bodemloket (landelijk)",
        url: "https://www.bodemloket.nl/",
      },
      {
        label: "ArcGIS-service Bodem (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Bodem/MapServer",
      },
    ],
  },
  {
    layerId: "bodem-sanering",
    title: "Bodemsaneringen in {city}",
    subtitle: "Uitgevoerde en geplande saneringsmaatregelen bij verontreiniging",
    intro:
      "Deze laag toont **{count} saneringscontouren** binnen het kaartgebied van {city}: gebieden waar bij een bodemverontreiniging een saneringsmaatregel is toegepast of vastgelegd. Per contour is bekend welke saneringsvariant is gekozen en of het om grond of grondwater gaat. Klik op een contour voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Saneringscontouren in beeld", type: "count" },
          {
            label: "In de grond",
            type: "count-where",
            property: "CONTOURTYPE",
            equals: "Grond",
          },
          {
            label: "In het grondwater",
            type: "count-where",
            property: "CONTOURTYPE",
            equals: "Grondwater",
          },
          {
            label: "Saneringsvarianten",
            type: "distinct",
            property: "SANERINGSVARIANT_BG",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Saneringen naar milieucompartiment in {city}",
        description: "Veld CONTOURTYPE: grond, grondwater of waterbodem",
        property: "CONTOURTYPE",
        maxCategories: 4,
      },
      {
        kind: "category-bar",
        title: "Saneringsvariant bovengrond in {city}",
        description:
          "Veld SANERINGSVARIANT_BG: de gekozen aanpak voor de bovengrond",
        property: "SANERINGSVARIANT_BG",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke contour hoort bij een saneringsdossier. De *saneringsvariant* beschrijft de aanpak: van volledig verwijderen van de verontreinigde grond met aanvulling van schone grond, tot het aanbrengen van een leeflaag of verharding die blootstelling voorkomt, of het monitoren van een achtergebleven restverontreiniging. Het onderscheid grond/grondwater laat zien welk compartiment is aangepakt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hergebruik van locaties**: een uitgevoerde sanering bepaalt of en hoe een locatie opnieuw gebruikt kan worden.\n- **Restverontreiniging en nazorg**: waar niet alles is verwijderd, hangen saneringen samen met nazorgverplichtingen (zie de laag *Bodem Nazorg*).\n- **Kosten en planning**: de variant zegt veel over de kosten en de doorlooptijd van een aanpak.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het bodeminformatiesysteem via de gemeente Zwolle (service *Bodem*). Niet elk dossier heeft alle velden ingevuld; de saneringsvariant is soms alleen voor de onder- of bovengrond bekend. De contouren zijn indicatief ingetekend. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Bodemloket (landelijk)",
        url: "https://www.bodemloket.nl/",
      },
      {
        label: "ArcGIS-service Bodem (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Bodem/MapServer",
      },
    ],
  },
  {
    layerId: "bodem-locaties",
    title: "Bodemlocaties in {city}",
    subtitle: "Percelen met een bodemdossier: verdenking, beoordeling en nazorg",
    intro:
      "Deze laag toont **{count} bodemlocaties** binnen het kaartgebied van {city}: percelen waarvan een bodemdossier bekend is bij de gemeente en de omgevingsdienst. Per locatie is onder meer bekend hoe de verontreiniging is beoordeeld en of er nazorg geldt. Klik op een locatie voor naam en status.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemlocaties in beeld", type: "count" },
          { label: "Benoemde locaties", type: "distinct", property: "NAAM" },
          {
            label: "Beoordelingen (soorten)",
            type: "distinct",
            property: "BEOORDELINGVERONTOMS",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemlocaties naar nazorgstatus in {city}",
        description:
          "Veld NAZORGSTATUS: of en welke vorm van nazorg op de locatie rust",
        property: "NAZORGSTATUS",
        maxCategories: 5,
      },
      {
        kind: "category-bar",
        title: "Bodemlocaties naar beoordeling in {city}",
        description:
          "Veld BEOORDELINGVERONTOMS: het oordeel over de verontreiniging",
        property: "BEOORDELINGVERONTOMS",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een locatie met een bodemdossier. Het gaat om een breed spectrum: van percelen die alleen *potentieel* verdacht zijn tot locaties met een vastgestelde ernstige verontreiniging of een lopend nazorgtraject. Het veld *BEOORDELINGVERONTOMS* vat het oordeel samen (bijvoorbeeld 'niet ernstig' of 'ernstig, geen spoed'), en *NAZORGSTATUS* geeft aan of er beheersmaatregelen op rusten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vooronderzoek**: bij ontwikkeling of transactie is dit de eerste plek om te checken of een perceel een bodemhistorie heeft.\n- **Prioritering**: het oordeel bepaalt of onderzoek of sanering nodig is en met welke urgentie.\n- **Beheer**: locaties met nazorg (IBC, monitoring) vragen langdurige aandacht.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het bodeminformatiesysteem, beheerd door de Omgevingsdienst IJsselland en ontsloten via de gemeente Zwolle (service *Bodem*). De beoordelingsteksten zijn deels vrije tekst en niet gestandaardiseerd; lees de categorieën als indicatie. Niet elke locatie heeft alle velden ingevuld. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Bodemloket (landelijk)",
        url: "https://www.bodemloket.nl/",
      },
      {
        label: "ArcGIS-service Bodem (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Bodem/MapServer",
      },
    ],
  },
  {
    layerId: "bodem-onderzoeken",
    title: "Bodemonderzoeken in {city}",
    subtitle:
      "Uitgevoerde onderzoeken met onderzoeksoort, toetsing en eindoordeel",
    intro:
      "Deze laag toont **{count} bodemonderzoeken** binnen het kaartgebied van {city}: de rapporten die op een locatie zijn uitgevoerd, met de onderzoeksoort, de WBB-toetsing van grond en grondwater en een eindoordeel over de vervolgstap. Klik op een onderzoek voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Onderzoeken in beeld", type: "count" },
          {
            label: "Onderzoeksoorten",
            type: "distinct",
            property: "ONDERZOEKSOORT",
          },
          {
            label: "Eindoordelen (soorten)",
            type: "distinct",
            property: "EINDOORDEEL",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemonderzoeken naar onderzoeksoort in {city}",
        description:
          "Veld ONDERZOEKSOORT: het type uitgevoerde bodemonderzoek",
        property: "ONDERZOEKSOORT",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Eindoordeel van de onderzoeken in {city}",
        description:
          "Veld EINDOORDEEL: de geadviseerde vervolgstap na het onderzoek",
        property: "EINDOORDEEL",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak hoort bij een bodemonderzoeksrapport. De *onderzoeksoort* varieert van een verkennend onderzoek (NEN 5740) tot nader onderzoek, saneringsonderzoek of een nazorgrapportage. Het *eindoordeel* vat samen wat er na het onderzoek moet gebeuren — van 'voldoende onderzocht' tot 'starten sanering' of 'uitvoeren aanvullend onderzoek'. De toetsvelden geven aan of grond en grondwater de streef-, tussen- of interventiewaarde overschrijden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Onderbouwing**: onderzoeken vormen de bewijslast onder beoordelingen en saneringsbesluiten.\n- **Actualiteit**: de onderzoeksoort en -datum laten zien hoe recent en hoe diepgaand een locatie in beeld is gebracht.\n- **Vervolgacties**: het eindoordeel wijst de weg naar de volgende stap in het bodemtraject.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het bodeminformatiesysteem via de gemeente Zwolle (service *Bodem*). De teksten in onderzoeksoort en eindoordeel zijn deels vrije tekst met wisselend hoofdlettergebruik, waardoor vergelijkbare oordelen soms als aparte categorieën verschijnen. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Bodemloket (landelijk)",
        url: "https://www.bodemloket.nl/",
      },
      {
        label: "ArcGIS-service Bodem (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Bodem/MapServer",
      },
    ],
  },
  {
    layerId: "bodem-nazorg",
    title: "Bodemnazorg in {city}",
    subtitle:
      "Locaties met blijvende nazorg- en zorgmaatregelen na een bodemsanering",
    intro:
      "Deze laag toont **{count} nazorglocaties** binnen het kaartgebied van {city}: plekken waar na een bodemsanering een restverontreiniging is achtergebleven en langdurige nazorg- of zorgmaatregelen gelden. Per contour is de locatiecode en, waar bekend, de einddatum van de nazorg vastgelegd. Klik op een contour voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Nazorglocaties in beeld", type: "count" },
          { label: "Unieke locatiecodes", type: "distinct", property: "LOCATIECODE" },
          {
            label: "Contouren in de grond",
            type: "count-where",
            property: "CONTOURTYPE",
            equals: "Grond",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een contour waarop een nazorg- of zorgmaatregel rust. Nazorg betekent dat een verontreiniging niet volledig is verwijderd, maar op een beheerste manier wordt beheerd — bijvoorbeeld door monitoring, een afdeklaag of gebruiksbeperkingen. Het veld *NAZORG_EINDDATUM* geeft aan tot wanneer de nazorg loopt; een lege einddatum betekent doorgaans langdurige of nog niet begrensde nazorg. Dit is een kleine, gespecialiseerde dataset, dus het aantal contouren in beeld kan klein zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Blijvende verplichting**: nazorglocaties vragen langjarig beheer en periodieke controle; ze zijn niet 'klaar' na de sanering.\n- **Gebruiksbeperkingen**: op deze locaties kunnen beperkingen gelden voor graven, bouwen of functieverandering.\n- **Koppeling met WKPB**: veel nazorgverplichtingen zijn ook als publiekrechtelijke beperking geregistreerd (zie de WKPB-laag).",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit het bodeminformatiesysteem via de gemeente Zwolle (service *Bodem*, nazorgmaatregelen). De contouren zijn indicatief ingetekend en gekoppeld aan een locatiecode in het bodemdossier. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Bodemloket (landelijk)",
        url: "https://www.bodemloket.nl/",
      },
      {
        label: "ArcGIS-service Bodem (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Bodem/MapServer",
      },
    ],
  },
  {
    layerId: "riolering-drukpersleiding",
    title: "Druk- en persleidingen van de riolering in {city}",
    subtitle:
      "Ondergrondse leidingen die rioolwater onder druk transporteren",
    intro:
      "Deze laag toont **{count} druk- en persleidingen** binnen het kaartgebied van {city}: de leidingen die rioolwater niet vanzelf (onder vrij verval) maar onder druk verplaatsen, bijvoorbeeld vanaf een gemaal of een drukriolering in het buitengebied. Elke lijn heeft een type en een laagnaam. Klik op een lijn voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Leidingen in beeld", type: "count" },
          {
            label: "Totale leidinglengte",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          { label: "Typen", type: "distinct", property: "TYPE" },
        ],
      },
      {
        kind: "category-bar",
        title: "Druk-/persleidingen per type in {city}",
        description: "Veld TYPE: de functie of aard van de leiding",
        property: "TYPE",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een leiding uit het onderdeel druk- en persleidingen van het rioolbeheer. Het veld *TYPE* onderscheidt onder meer vuilwater- en schoonwaterafvoer, echte persleidingen, mantelbuizen en overige of particuliere leidingen. Persleidingen zijn nodig waar het riool niet op natuurlijk afschot kan lozen — typisch in laaggelegen of dunbebouwd gebied.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Kwetsbaar en actief**: persleidingen hangen aan gemalen en pompen; storingen hebben direct effect op de afvoer.\n- **Buitengebied**: drukriolering ontsluit verspreide bebouwing die niet op een vrijvervalstelsel kan worden aangesloten.\n- **Beheer en veiligheid**: de ligging is belangrijk bij graafwerk (KLIC) en bij het plannen van onderhoud.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit het beheerbestand riolering van de gemeente Zwolle (service *Riolering_openbaar*, onderdeel *bodem & ondergrond*). De dataset bevat naast actieve leidingen ook als 'onbruikbaar' of 'overig' gemarkeerde lijnen; de typering is daardoor niet altijd eenduidig. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeente Zwolle — riolering",
        url: "https://www.zwolle.nl/riolering",
      },
      {
        label: "ArcGIS-service Riolering (Zwolle)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Riolering_openbaar/FeatureServer",
      },
    ],
  },
];
