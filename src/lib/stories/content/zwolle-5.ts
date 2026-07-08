/**
 * Story maps — batch "zwolle-5": lokale gemeentelijke ArcGIS-lagen van Zwolle.
 * Lagen: gemeentelijke-projecten, bor-herplant, bor-kap, wildplukkaart,
 * hessenpoort-kavels, bomen-snoei, inspectiebomen, tor-stadsdelen,
 * enexis-gas-hoofdleiding, enexis-elektra-kabel, enexis-gas-stations,
 * enexis-elektra-stations, gemeentelijk-eigendom, erfpacht.
 *
 * Dit zijn lokale lagen uit de GIS-services van de gemeente (en Enexis via de
 * gemeente); ze verschijnen alleen wanneer {city} de betreffende gemeente is.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "gemeentelijke-projecten",
    title: "Gemeentelijke projecten in {city}",
    subtitle:
      "Lopende en geplande projecten uit de projectenportefeuille van de gemeente",
    intro:
      "Binnen het kaartgebied van {city} staan **{count} gemeentelijke projecten** op de kaart: locaties van lopende en geplande gemeentelijke opgaven, uit de projectenregistratie (VP) van de gemeentelijke GIS-services. Elk punt is één project met een projectnaam, een bestuurlijk verantwoordelijke (portefeuillehouder), een projectmanager en een indeling naar omvang. Klik op een punt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Projecten in beeld", type: "count" },
          { label: "Unieke projectnamen", type: "distinct", property: "PROJECT" },
          {
            label: "Portefeuillehouders",
            type: "distinct",
            property: "BESTUURLIJK",
          },
          {
            label: "Grote projecten",
            type: "count-where",
            property: "SOORTPROJECT",
            equals: "Hoog",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Projecten naar omvang in {city}",
        description:
          "Veld SOORTPROJECT: de indeling van projecten naar omvang / zwaarte",
        property: "SOORTPROJECT",
        valueLabels: {
          Hoog: "Groot / zwaar",
          Midden: "Middelgroot",
          Laag: "Klein / licht",
        },
      },
      {
        kind: "category-bar",
        title: "Projecten per portefeuillehouder",
        description:
          "Veld BESTUURLIJK: het college-lid dat bestuurlijk verantwoordelijk is",
        property: "BESTUURLIJK",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een project uit de projectenportefeuille van de gemeente — van gebiedsontwikkeling en woningbouw tot herinrichting van de openbare ruimte. Het veld *SOORTPROJECT* deelt projecten in naar omvang (Hoog, Midden, Laag): een grove maat voor de complexiteit en het bestuurlijke gewicht. Het veld *BESTUURLIJK* koppelt elk project aan de verantwoordelijke portefeuillehouder in het college.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Overzicht en afstemming**: door alle projecten ruimtelijk te tonen wordt duidelijk waar opgaven samenvallen en waar werkzaamheden op elkaar afgestemd moeten worden.\n- **Bestuurlijke verantwoording**: de verdeling per portefeuillehouder laat zien hoe de projectenlast over het college verdeeld is.\n- **Participatie**: bewoners en ondernemers zien in één oogopslag welke plannen er in hun buurt spelen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de projectenregistratie (VP) van de gemeentelijke GIS-services van {city}. Het is een momentopname van de administratie: afgeronde projecten kunnen nog even in beeld blijven en de omvangsindeling is een inschatting, geen exacte maat. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Gemeentelijke GIS-services (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/VP/MapServer",
      },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "bor-herplant",
    title: "Herplant van bomen in {city}",
    subtitle:
      "Locaties waar gekapte bomen vervangen worden, met soort en herplantstatus",
    intro:
      "Deze laag toont **{count} herplantlocaties** binnen het kaartgebied van {city}: plekken waar de gemeente ter compensatie van gekapte bomen nieuwe bomen plant. Elke stip heeft een boomsoort (Nederlandse en Latijnse naam), een herplantstatus en de kaplijst waaraan de herplant gekoppeld is. Zo volg je de compensatieopgave van boom tot boom.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Herplantlocaties in beeld", type: "count" },
          { label: "Verschillende boomsoorten", type: "distinct", property: "SOORT_NL" },
          {
            label: "Al geplant (aandeel)",
            type: "count-where",
            property: "HERPL_STATUS",
            equals: ["Geplant", "Geplant andere soort"],
            asShare: true,
          },
          {
            label: "Kaplijsten",
            type: "distinct",
            property: "HOORTKAPLIJST",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Status van de herplant in {city}",
        description: "Veld HERPL_STATUS: hoe ver de vervanging gevorderd is",
        property: "HERPL_STATUS",
        maxCategories: 7,
      },
      {
        kind: "category-bar",
        title: "Meest herplante boomsoorten",
        description: "Veld SOORT_NL: de Nederlandse boomnaam per herplantlocatie",
        property: "SOORT_NL",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke locatie is een geplande of gerealiseerde herplant. Het veld *HERPL_STATUS* laat de voortgang zien: *Geplant* betekent dat de compensatieboom er staat, *Geplant andere soort* dat er een andere soort is teruggekomen dan oorspronkelijk gepland, en de diverse *Niet geplant*-varianten dat de plek nog open staat of vervallen is. Via *HOORTKAPLIJST* is elke herplant gekoppeld aan de kaplijst (bijvoorbeeld een voor- of najaarskaplijst) die de kap veroorzaakte.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Groencompensatie**: de gemeente is verplicht gekapte bomen te compenseren; deze laag maakt zichtbaar of dat ook echt gebeurt.\n- **Biodiversiteit**: de soortenverdeling laat zien of er gevarieerd wordt herplant of juist eenzijdig — belangrijk voor een klimaatbestendig en gevarieerd bomenbestand.\n- **Handhaving en transparantie**: bewoners kunnen controleren of beloofde herplant in hun buurt is uitgevoerd.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de openbare BOR-registratie voor kap en herplant van de gemeentelijke GIS-services. De aantallen gaan over de kaartuitsnede van {city}; grote lijsten worden begrensd geladen, dus bij een gemeente met veel herplant kan het werkelijke totaal hoger liggen dan wat in beeld is.",
      },
    ],
    links: [
      {
        label: "BOR kap & herplant (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/BOR_kap_herplant_openbaar/MapServer",
      },
      {
        label: "Bomen en groen in Zwolle",
        url: "https://www.zwolle.nl/afval-en-leefomgeving/bomen",
      },
    ],
  },
  {
    layerId: "bor-kap",
    title: "Boomkap in {city}",
    subtitle:
      "Locaties waar bomen gekapt (zijn) worden, met kaplijst en kapstatus",
    intro:
      "Deze laag toont **{count} kaplocaties** binnen het kaartgebied van {city}: bomen die op de gemeentelijke kaplijsten staan of stonden. Per locatie zijn de herkomst (welke kaplijst), de status van de kap en, waar bekend, de straatnaam en het aanlegjaar geregistreerd. Samen met de herplantlaag geeft dit het volledige beeld van kap én compensatie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kaplocaties in beeld", type: "count" },
          {
            label: "Daadwerkelijk gekapt",
            type: "count-where",
            property: "KAP_STATROVA",
            equals: ["Gekapt", "Gerooid"],
          },
          {
            label: "Kaplijsten",
            type: "distinct",
            property: "KAP_AFKOMST",
          },
          {
            label: "Met herplantplicht",
            type: "count-where",
            property: "HERPLANT",
            equals: ["1", "2"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kaplocaties per kaplijst in {city}",
        description:
          "Veld KAP_AFKOMST: de kaplijst of aanleiding waaruit de kap voortkomt",
        property: "KAP_AFKOMST",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Status van de kap",
        description: "Veld KAP_STATROVA: de uitvoeringsstatus van de kap",
        property: "KAP_STATROVA",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een boom die is opgenomen op een kaplijst. Het veld *KAP_AFKOMST* laat de aanleiding zien — reguliere voor- en najaarskaplijsten, maar ook specifieke oorzaken zoals *Essentaksterfte* (een boomziekte die veel essen aantast) of stormschade. Het veld *KAP_STATROVA* geeft de status: *Gekapt* of *Gerooid* betekent uitgevoerd, *Niet gekapt* dat de boom (voorlopig) blijft staan. De categorie *Mogelijke locaties* zijn plekken die nog beoordeeld worden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Transparantie**: kap ligt gevoelig; een openbaar overzicht van wat, waar en waarom er gekapt wordt versterkt het vertrouwen.\n- **Bomenziektes**: het aandeel kap door essentaksterfte laat zien hoe ziektes het bomenbestand onder druk zetten.\n- **Koppeling met herplant**: samen met de herplantlaag zie je of kap gecompenseerd wordt en hoe de balans van het bomenbestand zich ontwikkelt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit de openbare BOR-registratie voor kap en herplant. Niet elk veld is bij elke boom ingevuld — boomsoort en straatnaam ontbreken regelmatig, terwijl herkomst en status vrijwel altijd bekend zijn. De grafieken slaan lege waarden automatisch over. De aantallen gaan over de kaartuitsnede van {city} en grote lijsten worden begrensd geladen.",
      },
    ],
    links: [
      {
        label: "BOR kap & herplant (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/BOR_kap_herplant_openbaar/MapServer",
      },
      {
        label: "Kapmeldingen en vergunningen Zwolle",
        url: "https://www.zwolle.nl/afval-en-leefomgeving/bomen",
      },
    ],
  },
  {
    layerId: "wildplukkaart",
    title: "Wildplukkaart van {city}",
    subtitle:
      "Openbare fruit- en notenbomen waarvan je de opbrengst mag plukken",
    intro:
      "Deze laag toont **{count} eetbare bomen** binnen het kaartgebied van {city} uit de wildplukkaart van de gemeente: openbare fruit- en notenbomen waarvan bewoners de opbrengst mogen oogsten. Elke stip heeft een Nederlandse en Latijnse boomnaam, een type (fruit of noten) en een subtype. Klik op een boom om te zien wat je er kunt plukken.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Eetbare bomen in beeld", type: "count" },
          { label: "Verschillende soorten", type: "distinct", property: "NAAMNL" },
          {
            label: "Fruitbomen",
            type: "count-where",
            property: "TYPE",
            equals: "Fruitboom",
          },
          {
            label: "Notenbomen",
            type: "count-where",
            property: "TYPE",
            equals: "Notenboom",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Fruit- versus notenbomen in {city}",
        description: "Veld TYPE: de hoofdindeling van de wildplukkaart",
        property: "TYPE",
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende eetbare soorten",
        description: "Veld NAAMNL: de Nederlandse boomnaam",
        property: "NAAMNL",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een boom in de openbare ruimte die geschikt is voor wildplukken. Het veld *TYPE* onderscheidt fruitbomen (appel, peer, krent, bes) van notenbomen (walnoot, tamme kastanje). Het veld *SUBTYPE* verfijnt dat verder (bijvoorbeeld *bes* of *walnoot*), en *NAAMNL* geeft de Nederlandse soortnaam. Alle bomen op deze kaart zijn door de gemeente als plukgeschikt aangemerkt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Eetbaar groen**: de wildplukkaart maakt de openbare ruimte tastbaar bruikbaar en versterkt de band tussen bewoners en hun buurtgroen.\n- **Biodiversiteit en klimaat**: fruit- en notenbomen leveren voedsel voor mens én dier en dragen bij aan een gevarieerd, klimaatbestendig bomenbestand.\n- **Bewustwording**: door te laten zien wat eetbaar is, stimuleert de gemeente gezond, lokaal en gratis oogsten.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de wildplukkaart (Eetbaar groen) van de gemeentelijke GIS-services van {city}. De aantallen gaan over de kaartuitsnede; een boom nét buiten de uitsnede telt niet mee. Pluk met respect: laat genoeg hangen voor dieren en andere plukkers.",
      },
    ],
    links: [
      {
        label: "Wildplukkaart / Eetbaar groen (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Eetbaar_groen_Wildplukkaart/MapServer",
      },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "hessenpoort-kavels",
    title: "Bedrijfskavels op Hessenpoort in {city}",
    subtitle:
      "Uitgeefbare en verkochte kavels op bedrijventerrein Hessenpoort",
    intro:
      "Deze laag toont **{count} kavels** op bedrijventerrein Hessenpoort binnen het kaartgebied van {city}. Elke kavel heeft een status (verkocht, bouwrijp, nog uit te geven) en een oppervlakte. Zo zie je in één beeld hoeveel bedrijfsgrond nog beschikbaar is en hoe groot de kavels zijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kavels in beeld", type: "count" },
          {
            label: "Verkocht (aandeel)",
            type: "count-where",
            property: "TYPE",
            equals: "Verkocht",
            asShare: true,
          },
          {
            label: "Totale kaveloppervlakte",
            type: "sum",
            property: "OPP",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Gemiddelde kavelgrootte",
            type: "avg",
            property: "OPP",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kavels naar status op Hessenpoort",
        description: "Veld TYPE: de uitgifte- of bestemmingsstatus van de kavel",
        property: "TYPE",
        maxCategories: 7,
      },
      {
        kind: "histogram",
        title: "Verdeling van kavelgroottes",
        description: "Veld OPP: de oppervlakte van elke kavel in vierkante meters",
        property: "OPP",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een kavel op Hessenpoort, het grootste bedrijventerrein van {city}. Het veld *TYPE* geeft de status: *Verkocht* is uitgegeven, *Bouwrijp* is klaar voor uitgifte, en categorieën als *Groen*, *Geel* of *Zonnepark* duiden op andere bestemmingen binnen het terrein. Het veld *OPP* geeft de oppervlakte, wat de spreiding tussen kleine en grote kavels zichtbaar maakt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Economische ontwikkeling**: het aandeel nog beschikbare (bouwrijpe) grond bepaalt hoeveel ruimte er is voor nieuwe bedrijvigheid en werkgelegenheid.\n- **Ruimtelijke planning**: de kavelgrootteverdeling laat zien of het terrein zich richt op grootschalige logistiek of juist op kleinere bedrijven.\n- **Duurzaamheid**: bestemmingen als *Zonnepark* tonen de inpassing van energieopwekking op het bedrijventerrein.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de Hessenpoort-registratie van de gemeentelijke GIS-services. De statistieken gaan over de kavels binnen de kaartuitsnede van {city}; de totale oppervlakte is de som van de getoonde kavels, niet per se het hele terrein.",
      },
    ],
    links: [
      {
        label: "Hessenpoort-kavels (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Hessenpoort/MapServer",
      },
      { label: "Bedrijventerrein Hessenpoort", url: "https://www.hessenpoort.nl/" },
    ],
  },
  {
    layerId: "bomen-snoei",
    title: "Snoeibeheer van bomen in {city}",
    subtitle:
      "Bomen in het onderhoudsbestand, ingedeeld naar snoeimethode en wijk",
    intro:
      "Deze laag toont **{count} bomen** binnen het kaartgebied van {city} uit het snoei- en onderhoudsbestand van de gemeente. Per boom zijn de soort, de beheergroep (het type snoeionderhoud) en de wijk vastgelegd. Zo zie je hoe de gemeente haar bomenbestand systematisch onderhoudt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          { label: "Verschillende soorten", type: "distinct", property: "NAAMNL" },
          { label: "Snoeimethoden", type: "distinct", property: "BEHEERGROEP" },
          { label: "Wijken", type: "distinct", property: "WIJK" },
        ],
      },
      {
        kind: "category-bar",
        title: "Bomen naar snoeimethode in {city}",
        description:
          "Veld BEHEERGROEP: het type snoeionderhoud dat op de boom wordt toegepast",
        property: "BEHEERGROEP",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten",
        description: "Veld NAAMNL: de Nederlandse boomnaam",
        property: "NAAMNL",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een boom in het gemeentelijke onderhoudsbestand. Het veld *BEHEERGROEP* beschrijft hoe de boom gesnoeid wordt: *begeleidingssnoei* stuurt jonge bomen in de goede vorm, *onderhoudssnoei* houdt volwassen bomen veilig en gezond, en *knotsnoei* hoort bij knotbomen. De indeling naar *WIJK* laat zien hoe het bomenbestand over de gemeente verdeeld is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Boomveiligheid**: regelmatig, methodisch snoeien voorkomt afbrekende takken en houdt bomen langer gezond.\n- **Beheerplanning**: de verdeling over snoeimethoden en wijken helpt de gemeente onderhoud in te plannen en budgetten te ramen.\n- **Groenstructuur**: de soortenverdeling geeft inzicht in de diversiteit en daarmee de veerkracht van het stedelijk groen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het bomenbeheerbestand (BomenSnoei) van de gemeentelijke GIS-services. Het bestand is groot; binnen de kaartuitsnede van {city} wordt een begrensd aantal bomen geladen, dus het werkelijke totaal in de gemeente ligt hoger dan wat in beeld is. De statistieken gelden voor de getoonde selectie.",
      },
    ],
    links: [
      {
        label: "Bomensnoei (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/BomenSnoei/MapServer",
      },
      {
        label: "Bomen en groenbeheer Zwolle",
        url: "https://www.zwolle.nl/afval-en-leefomgeving/bomen",
      },
    ],
  },
  {
    layerId: "inspectiebomen",
    title: "Geïnspecteerde bomen in {city}",
    subtitle:
      "Bomen met een veiligheidsinspectie: conditie en verwachte levensduur",
    intro:
      "Deze laag toont **{count} bomen** binnen het kaartgebied van {city} die een boomveiligheidsinspectie hebben gehad. Per boom zijn de conditie, het boombeeld, de verwachte resterende levensduur en de soort vastgelegd. Zo brengt de gemeente in kaart welke bomen extra aandacht of vervanging nodig hebben.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Geïnspecteerde bomen in beeld", type: "count" },
          {
            label: "Conditie (zeer) slecht",
            type: "count-where",
            property: "CONDITIE",
            equals: ["Slecht", "Zeer Slecht"],
          },
          {
            label: "Conditie goed/redelijk",
            type: "count-where",
            property: "CONDITIE",
            equals: ["Goed", "Redelijk"],
            asShare: true,
          },
          { label: "Verschillende soorten", type: "distinct", property: "BOOMSORTIM" },
        ],
      },
      {
        kind: "category-bar",
        title: "Conditie van geïnspecteerde bomen in {city}",
        description: "Veld CONDITIE: de bij inspectie vastgestelde gezondheid",
        property: "CONDITIE",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Boombeeld bij inspectie",
        description:
          "Veld BOOMBEELD: het onderhoudsbeeld — is de boom aanvaardbaar, regulier of achterstallig?",
        property: "BOOMBEELD",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een boom die door een boomveiligheidscontrole (VTA) is beoordeeld. Het veld *CONDITIE* loopt van *Goed* tot *Zeer Slecht* en zegt iets over de vitaliteit. Het veld *BOOMBEELD* beschrijft het onderhoudsbeeld: *Aanvaard* of *Regulier* is in orde, *Achterstallig* betekent dat er onderhoud is blijven liggen. Via het veld voor de verwachte levensduur zie je welke bomen op termijn vervangen moeten worden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Veiligheid**: geïnspecteerde bomen met een slechte conditie zijn een risico voor omgeving en verkeer; deze registratie is de basis voor gerichte maatregelen.\n- **Vervangingsplanning**: de verwachte levensduur helpt de gemeente tijdig herplant en budget te plannen.\n- **Zorgplicht**: als eigenaar heeft de gemeente een wettelijke zorgplicht voor haar bomen; systematische inspectie maakt die controleerbaar.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit het inspectiebomenbestand van de gemeentelijke GIS-services van {city}. Het gaat om een selectie bomen die vanwege leeftijd, soort of eerdere signalen extra worden gevolgd — niet het volledige bomenbestand. De statistieken gelden voor de kaartuitsnede.",
      },
    ],
    links: [
      {
        label: "Inspectiebomen (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Inspectiebomen/MapServer",
      },
      {
        label: "Bomenbeleid Zwolle",
        url: "https://www.zwolle.nl/afval-en-leefomgeving/bomen",
      },
    ],
  },
  {
    layerId: "tor-stadsdelen",
    title: "TOR-incidenten per stadsdeel in {city}",
    subtitle: "Stadsdeelgrenzen gekoppeld aan meldingen — tijdelijk niet beschikbaar",
    intro:
      "Deze laag koppelt stadsdeelgrenzen aan TOR-incidentmeldingen (Toezicht Openbare Ruimte) in {city}. De onderliggende service is echter van de gemeentelijke GIS-omgeving verwijderd, waardoor er op dit moment **{count} gebieden** geladen zijn. De laag blijft als placeholder bestaan tot de gemeente de gegevens opnieuw publiceert.",
    charts: [],
    sections: [
      {
        heading: "Wat zou je hier zien?",
        body: "Wanneer de bron weer beschikbaar is, toont deze laag de stadsdelen van {city} als vlakken, waarbij elk stadsdeel gekoppeld is aan het aantal en type meldingen over de openbare ruimte — denk aan overlast, kapotte straatverlichting of zwerfafval. Zo wordt zichtbaar in welke delen van de stad de meeste meldingen binnenkomen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "Meldingen over de openbare ruimte zijn een directe graadmeter voor leefbaarheid en beheerdruk. Een geografische verdeling helpt de gemeente handhaving en onderhoud te sturen naar de plekken waar dat het hardst nodig is.",
      },
      {
        heading: "Status van deze laag",
        body: "De service *TOR_stadsdelen* is momenteel niet publiek beschikbaar op de gemeentelijke GIS-omgeving. Zodra {city} de laag opnieuw publiceert, vult deze kaart zich automatisch met de actuele gegevens. Tot die tijd toont hij bewust geen gebieden.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle — meldingen openbare ruimte", url: "https://www.zwolle.nl/melding-doen" },
    ],
  },
  {
    layerId: "enexis-gas-hoofdleiding",
    title: "Gasnet (hoofdleidingen) in {city}",
    subtitle:
      "Hoofdgasleidingen van Enexis, met druk en buismateriaal",
    intro:
      "Deze laag tekent **{count} gasleidingen** binnen het kaartgebied van {city}: de hoofdleidingen van het gasnet van netbeheerder Enexis. Per leiding zijn de bedrijfsdruk, het buismateriaal en de status geregistreerd. Zo zie je hoe het gasnet door de gemeente loopt en waar de zwaardere, hogere-drukleidingen liggen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gasleidingen in beeld", type: "count" },
          {
            label: "In gebruik (aandeel)",
            type: "count-where",
            property: "CURRENTSTATUS",
            equals: "functional",
            asShare: true,
          },
          {
            label: "Buismaterialen",
            type: "distinct",
            property: "BUISMATERIAALTYPE",
          },
          {
            label: "Gemiddelde druk",
            type: "avg",
            property: "PRESSURE",
            unit: "bar",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Gasleidingen naar druk in {city}",
        description: "Veld PRESSURE: de bedrijfsdruk van de leiding in bar",
        property: "PRESSURE",
        valueLabels: {
          "100": "100 bar (hoge druk)",
          "30": "30 bar",
          "8": "8 bar",
          "4": "4 bar",
          "0": "Onbekend / 0 bar",
        },
      },
      {
        kind: "category-bar",
        title: "Buismateriaal van de gasleidingen",
        description:
          "Veld BUISMATERIAALTYPE: het materiaal waarvan de leiding is gemaakt",
        property: "BUISMATERIAALTYPE",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een gasleiding uit het assetbestand van Enexis. Het veld *PRESSURE* geeft de bedrijfsdruk: hoge-drukleidingen (bijvoorbeeld 100 bar) vormen het transportnet, terwijl lagere drukken (8 of 4 bar) het distributienet naar wijken en woningen zijn. Het veld *BUISMATERIAALTYPE* toont waarvan de leidingen zijn gemaakt — van modern PE-kunststof tot ouder grijs gietijzer, dat prioriteit heeft bij vervanging.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energietransitie**: bij het van-het-gas-af halen van wijken is een actueel beeld van het gasnet onmisbaar om de fasering te plannen.\n- **Veiligheid en graafschade**: het materiaal en de druk bepalen de risico's; oude gietijzeren leidingen krijgen voorrang bij vervanging.\n- **Ondergrondse ordening**: bij herinrichting van de openbare ruimte moet met de ligging van deze leidingen rekening worden gehouden.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit *Energie in Beeld* van Enexis, ontsloten via de gemeentelijke GIS-services van {city}. Het gasnet is uitgebreid; binnen de kaartuitsnede wordt een begrensd aantal leidingen geladen, dus het werkelijke totaal ligt hoger. De statistieken gelden voor de getoonde selectie.",
      },
    ],
    links: [
      {
        label: "Enexis assets — gas (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer",
      },
      { label: "Enexis Netbeheer", url: "https://www.enexis.nl/" },
    ],
  },
  {
    layerId: "enexis-elektra-kabel",
    title: "Elektriciteitsnet (kabels) in {city}",
    subtitle: "Ondergrondse elektriciteitskabels van Enexis",
    intro:
      "Deze laag tekent **{count} elektriciteitskabels** binnen het kaartgebied van {city}: het ondergrondse kabelnet van netbeheerder Enexis. Per kabel is de netstatus geregistreerd — in gebruik of buiten gebruik. Zo zie je hoe fijnmazig het stroomnet door de gemeente loopt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kabels in beeld", type: "count" },
          {
            label: "In gebruik (aandeel)",
            type: "count-where",
            property: "CURRENTSTATUS",
            equals: "functional",
            asShare: true,
          },
          {
            label: "Buiten gebruik",
            type: "count-where",
            property: "CURRENTSTATUS",
            equals: "disused",
          },
          {
            label: "Ondergronds",
            type: "count-where",
            property: "VERTICALPOSITION",
            equals: "underground",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kabels naar netstatus in {city}",
        description: "Veld CURRENTSTATUS: of de kabel in of buiten gebruik is",
        property: "CURRENTSTATUS",
        valueLabels: {
          functional: "In gebruik",
          disused: "Buiten gebruik",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een elektriciteitskabel uit het assetbestand van Enexis, vrijwel altijd ondergronds (*VERTICALPOSITION* = underground). Het veld *CURRENTSTATUS* laat zien of een kabel *functional* (in gebruik) of *disused* (buiten gebruik, maar nog in de grond) is. Buiten gebruik gestelde kabels blijven vaak liggen omdat verwijderen duur en verstorend is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Netcapaciteit en verzwaring**: de energietransitie (warmtepompen, laadpalen, zon op dak) vraagt om verzwaring van het net; inzicht in de bestaande kabels is daarvoor het startpunt.\n- **Graafschade**: een actueel kabelbeeld voorkomt schade bij graafwerk in de openbare ruimte.\n- **Ondergrondse ordening**: bij herinrichting moet ruimte voor deze kabels worden gereserveerd.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit *Energie in Beeld* van Enexis via de gemeentelijke GIS-services van {city}. Het kabelnet is zeer fijnmazig; binnen de kaartuitsnede wordt een begrensd aantal kabels geladen, dus het werkelijke totaal ligt aanzienlijk hoger. De statistieken gelden voor de getoonde selectie.",
      },
    ],
    links: [
      {
        label: "Enexis assets — elektra (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer",
      },
      { label: "Enexis Netbeheer", url: "https://www.enexis.nl/" },
    ],
  },
  {
    layerId: "enexis-gas-stations",
    title: "Gasstations in {city}",
    subtitle:
      "Technische gebouwen in het gasnet van Enexis: districts- en afleverstations",
    intro:
      "Deze laag toont **{count} gasstations** binnen het kaartgebied van {city}: de technische gebouwen en installaties in het gasnet van netbeheerder Enexis. Elk punt heeft een omschrijving van het type station. Deze knooppunten regelen de druk en verdeling in het gasnet.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gasstations in beeld", type: "count" },
          { label: "Types station", type: "distinct", property: "OMSCHRIJVING" },
          {
            label: "Bovengronds zichtbaar",
            type: "count-where",
            property: "BOVENGRONDSZICHTBAAR",
            equals: "true",
            asShare: true,
          },
          {
            label: "In gebruik",
            type: "count-where",
            property: "CURRENTSTATUS",
            equals: "functional",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Gasstations naar type in {city}",
        description:
          "Veld OMSCHRIJVING: het type technisch gebouw of station in het gasnet",
        property: "OMSCHRIJVING",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een technisch gebouw of station in het gasnet. Het veld *OMSCHRIJVING* geeft het type: een *Districtstation* of *Gasontvangstation* verlaagt de druk van het transportnet naar het distributienet, terwijl een *Afleverstation* gas levert aan een grote afnemer. De verschillende *HAS*-categorieën zijn huisaansluitstations op wijkniveau.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Netstructuur**: stations zijn de knooppunten die het gasnet laten werken; hun ligging bepaalt hoe wijken worden gevoed.\n- **Energietransitie**: bij het afbouwen van gas zijn dit de punten waar het net wordt aangepast of buiten gebruik gesteld.\n- **Ruimtegebruik**: bovengronds zichtbare stations nemen fysieke ruimte in de openbare ruimte in — relevant bij herinrichting.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit *Energie in Beeld* van Enexis via de gemeentelijke GIS-services van {city}. De aantallen gaan over de kaartuitsnede; stations net buiten de uitsnede tellen niet mee.",
      },
    ],
    links: [
      {
        label: "Enexis assets — gasstations (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer",
      },
      { label: "Enexis Netbeheer", url: "https://www.enexis.nl/" },
    ],
  },
  {
    layerId: "enexis-elektra-stations",
    title: "Elektrastations in {city}",
    subtitle:
      "Technische gebouwen in het elektriciteitsnet van Enexis: net- en klantstations",
    intro:
      "Deze laag toont **{count} elektrastations** binnen het kaartgebied van {city}: de transformator- en verdeelstations in het middenspanningsnet van netbeheerder Enexis. Elk punt heeft een omschrijving van het type station. Deze stations zetten middenspanning om naar de laagspanning waarop woningen en bedrijven zijn aangesloten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Elektrastations in beeld", type: "count" },
          { label: "Types station", type: "distinct", property: "OMSCHRIJVING" },
          {
            label: "Netstations",
            type: "count-where",
            property: "OMSCHRIJVING",
            equals: "Netstation",
          },
          {
            label: "In gebruik",
            type: "count-where",
            property: "CURRENTSTATUS",
            equals: "functional",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Elektrastations naar type in {city}",
        description:
          "Veld OMSCHRIJVING: het type transformator- of verdeelstation",
        property: "OMSCHRIJVING",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een station in het elektriciteitsnet. Het veld *OMSCHRIJVING* geeft het type: een *Netstation* transformeert middenspanning naar laagspanning voor een buurt, een *Klantstation* voedt één grote afnemer (zoals een fabriek of appartementencomplex), en een *Transportverdeelstation* verdeelt op een hoger niveau. Samen vormen ze de schakels tussen het hoofdnet en de stopcontacten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Netcapaciteit**: het aantal en de spreiding van netstations bepalen hoeveel extra vraag (warmtepompen, laadpalen, zonnestroom) een wijk aankan.\n- **Verzwaringsopgave**: waar het net vol raakt, moeten nieuwe of grotere stations komen — een fysieke en ruimtelijke opgave.\n- **Klantstations**: hun ligging laat zien waar grote stroomafnemers zitten, relevant voor economische en energieplanning.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit *Energie in Beeld* van Enexis via de gemeentelijke GIS-services van {city}. De aantallen gaan over de kaartuitsnede; stations net buiten de uitsnede tellen niet mee.",
      },
    ],
    links: [
      {
        label: "Enexis assets — elektrastations (gisservices.zwolle.nl)",
        url: "https://gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer",
      },
      { label: "Enexis Netbeheer", url: "https://www.enexis.nl/" },
    ],
  },
  {
    layerId: "gemeentelijk-eigendom",
    title: "Gemeentelijk eigendom in {city}",
    subtitle: "Percelen in eigendom van de gemeente — nog niet als open data beschikbaar",
    intro:
      "Deze laag is bedoeld om de percelen te tonen die in eigendom zijn van de gemeente {city}. Er is op dit moment echter geen openbare dataset waaruit deze percelen geladen kunnen worden, dus zijn er **{count} percelen** in beeld. De laag staat klaar als placeholder voor zodra de gemeente een open eigendomslaag publiceert.",
    charts: [],
    sections: [
      {
        heading: "Wat zou je hier zien?",
        body: "Wanneer de bron beschikbaar komt, kleurt deze laag alle kadastrale percelen in die de gemeente {city} in eigendom heeft — van gebouwen en gronden tot openbaar groen en snippergroen. Zo wordt in één beeld zichtbaar welk deel van de stad publiek bezit is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "Inzicht in gemeentelijk grondbezit is de basis voor grondbeleid: het bepaalt waar de gemeente zelf kan ontwikkelen, ruilen of verkopen, en waar zij afhankelijk is van private eigenaren. Het is ook relevant voor beheer en onderhoud van de openbare ruimte.",
      },
      {
        heading: "Status van deze laag",
        body: "De gemeentelijke GIS-omgeving van {city} biedt op dit moment geen publieke eigendoms- of perceelslaag aan. Zodra zo'n open dataset beschikbaar is, vult deze kaart zich automatisch. Perceels- en eigendomsinformatie is wel opvraagbaar via het Kadaster.",
      },
    ],
    links: [
      { label: "Kadaster", url: "https://www.kadaster.nl/" },
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
    ],
  },
  {
    layerId: "erfpacht",
    title: "Erfpachtpercelen in {city}",
    subtitle: "Gemeentelijk uitgegeven erfpacht — nog niet als open data beschikbaar",
    intro:
      "Deze laag is bedoeld om de percelen te tonen die de gemeente {city} in erfpacht heeft uitgegeven. Er is op dit moment geen openbare dataset beschikbaar, dus zijn er **{count} percelen** in beeld. De laag staat klaar als placeholder voor zodra de gemeente een open erfpachtlaag publiceert.",
    charts: [],
    sections: [
      {
        heading: "Wat is erfpacht?",
        body: "Bij erfpacht blijft de grond eigendom van de gemeente, maar mag een ander (de erfpachter) die grond gebruiken tegen een jaarlijkse vergoeding (de canon). Deze laag zou de percelen tonen die op die manier zijn uitgegeven in {city}.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "Erfpacht is een instrument van grondbeleid: de gemeente houdt grip op grondgebruik en deelt in de waardeontwikkeling van de grond. Een geografisch overzicht helpt bij het beheer van de erfpachtportefeuille en bij transparantie richting erfpachters.",
      },
      {
        heading: "Status van deze laag",
        body: "De gemeentelijke GIS-omgeving van {city} biedt op dit moment geen publieke erfpachtlaag aan. Zodra zo'n open dataset beschikbaar is, vult deze kaart zich automatisch met de uitgegeven percelen.",
      },
    ],
    links: [
      { label: "Gemeente Zwolle", url: "https://www.zwolle.nl/" },
      { label: "Kadaster", url: "https://www.kadaster.nl/" },
    ],
  },
];
