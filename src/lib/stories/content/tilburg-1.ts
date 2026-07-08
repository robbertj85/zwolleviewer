/**
 * Story maps — batch "tilburg-1": gemeentelijke open-data lagen van Tilburg.
 *
 * Lagen: tlb-fietsnetwerk, tlb-fietsenstallingen, tlb-speciale-parkeerplaatsen,
 * tlb-betaald-parkeren, tlb-maximumsnelheden, tlb-doorrijhoogtes,
 * tlb-strooiroutes, tlb-monumentale-bomen, tlb-hondenlosloopgebieden,
 * tlb-speelplekken, tlb-cultureel-erfgoed, tlb-cultureel-kunstwerk,
 * tlb-sportcomplexen.
 *
 * Alle property-namen zijn geverifieerd via een live query op de Gemeente
 * Tilburg ArcGIS-FeatureServers (mei 2026-schema; sample + groupBy-statistiek).
 * Deze lagen zijn gemeentelijk en alleen zichtbaar binnen Tilburg; de teksten
 * gebruiken toch {city}/{count} zodat de placeholders runtime worden ingevuld.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "tlb-fietsnetwerk",
    title: "Snelfietsroutes in {city}",
    subtitle: "De beleidskaart Fietsnetwerk van de gemeente",
    intro:
      "Deze laag tekent **{count} tracés** uit de beleidskaart *Fietsnetwerk* van {city}: de doorgaande snelfietsroutes die de gemeente als ruggengraat van het fietsnetwerk aanwijst. Het gaat om een beleidsmatige selectie — niet elk fietspad, maar de hoofdverbindingen waarlangs {city} snel en comfortabel fietsen tussen wijken en met buurgemeenten wil garanderen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Routesegmenten in beeld", type: "count" },
          { label: "Routetypen", type: "distinct", property: "ROUTE" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een segment van een aangewezen fietsroute; het veld *ROUTE* benoemt het type (in de huidige export uitsluitend **Snelfietsroute**). Samen vormen de segmenten het beleidsmatige hoofdfietsnetwerk. Omdat het om een selectie van hoofdroutes gaat, is het aantal segmenten klein — dit is geen volledige inventaris van alle fietspaden in de gemeente.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Netwerkkeuzes**: snelfietsroutes krijgen voorrang bij onderhoud, verkeerslichten en kruisingsontwerp; deze kaart laat zien waar die investeringen landen.\n- **Woon-werkverkeer**: doorgaande fietsroutes zijn een alternatief voor de auto op de kortere afstanden en dragen bij aan bereikbaarheids- en klimaatdoelen.\n- **Regionale samenhang**: veel snelfietsroutes lopen door tot in buurgemeenten; ze zijn onderdeel van regionale fietsprogramma's.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de beleidskaart *Fietsnetwerk* van {city}, ontsloten via de gemeentelijke ArcGIS-services. Het is een beleidslaag: hij geeft de *gewenste* hoofdroutestructuur weer, niet noodzakelijk de fysieke staat van elk pad.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Fietsnetwerk (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Fietsnetwerk/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-fietsenstallingen",
    title: "Fietsenstallingen in {city}",
    subtitle: "Bewaakte en onbewaakte stallingen met tarief en capaciteit",
    intro:
      "Binnen {city} toont deze laag **{count} fietsenstallingen**: van grote bewaakte stallingen in de binnenstad tot voorzieningen bij stations. Per stalling zijn naam, tarief, capaciteit en openingstijden geregistreerd. Klik op een punt voor de details, zoals de link naar meer informatie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stallingen in beeld", type: "count" },
          { label: "Unieke stallingen", type: "distinct", property: "FIETSENSTALLING" },
          {
            label: "Gratis stallingen",
            type: "count-where",
            property: "TARIEF",
            equals: "Gratis",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Tarief van fietsenstallingen in {city}",
        description: "Veld TARIEF, zoals aangeleverd door de gemeente",
        property: "TARIEF",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een fietsenstalling. Het overgrote deel van de gemeentelijke binnenstadsstallingen is **gratis**; bij de NS-stallingen bij de stations gelden aparte NS-voorwaarden (het tarief- en capaciteitsveld is daar niet altijd gevuld). Het veld *CAPACITEIT* bevat waar bekend het aantal plekken — dat loopt uiteen van enkele honderden tot ruim duizend bij de grootste binnenstadsstalling.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ketenmobiliteit**: goede en gratis stallingen bij winkelgebieden en stations verlagen de drempel om de fiets te pakken in plaats van de auto.\n- **Binnenstadsbeleid**: bewaakte stallingen halen geparkeerde fietsen uit het straatbeeld en houden looproutes vrij.\n- **Capaciteitsplanning**: het capaciteitsveld helpt beoordelen of stallingen op piekmomenten toereikend zijn.",
      },
      {
        heading: "Over de bron",
        body: "De gegevens komen uit de gemeentelijke registratie van {city} (ArcGIS-service *Fietsenstallingen*). Het is een compacte, handmatig bijgehouden lijst van de voorzieningen die de gemeente zelf aanbiedt of aanraadt — losse fietsklemmen op straat zitten er niet in.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Fietsenstallingen (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Fietsenstallingen_Rjj/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-speciale-parkeerplaatsen",
    title: "Speciale parkeerplaatsen in {city}",
    subtitle: "Voorbehouden parkeervakken voor specifieke doelgroepen",
    intro:
      "Deze laag toont **{count} speciale parkeerplaatsen** in {city}: parkeervakken die aan een specifieke functie of doelgroep zijn voorbehouden, zoals hulpdiensten en ambulanceposten. Per vak zijn de categorie, de straat, de vakvorm en de capaciteit geregistreerd. Het gaat om een klein, gericht bestand — geen overzicht van alle parkeervakken in de stad.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Speciale plaatsen in beeld", type: "count" },
          { label: "Categorieën", type: "distinct", property: "Categorie" },
          {
            label: "Capaciteit (vakken)",
            type: "sum",
            property: "Capaciteit",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Categorie van speciale parkeerplaatsen in {city}",
        description: "Veld Categorie: de doelgroep of functie van het vak",
        property: "Categorie",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een parkeervak dat de gemeente aan een specifieke functie heeft toegekend — het veld *Categorie* benoemt die (bijvoorbeeld *Ambulance*). Het veld *Fiscaal* geeft aan of het vak binnen een betaald-parkeerregime valt, en *Vakvorm* of het een langs-, haaks- of gestoken vak is. Omdat dit een gericht themabestand is, is het aantal vakken beperkt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid hulpdiensten**: voorbehouden plekken bij ambulanceposten en zorglocaties zijn cruciaal voor snelle inzet.\n- **Handhaving**: gemarkeerde bijzondere vakken zijn de basis voor toezicht en handhaving op verkeerd parkeren.\n- **Toegankelijkheid**: bijzondere vakken (zoals voor doelgroepen) maken voorzieningen bruikbaar voor wie daarvan afhankelijk is.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de gemeentelijke parkeerregistratie van {city} (ArcGIS-service *Speciale parkeerplaatsen*). Het publieke bestand bevat alleen de bijzondere vakken; reguliere en algemene gehandicaptenparkeerplaatsen zitten in andere registraties.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Speciale parkeerplaatsen (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Speciale_parkeerplaatsen/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-betaald-parkeren",
    title: "Betaald parkeren in {city}",
    subtitle: "Parkeerzones met tarief, tijden en betaalwijze",
    intro:
      "Deze laag toont **{count} betaald-parkeergebieden** in {city}: de zones waar op straat parkeergeld geldt, elk met een eigen tarief, tijdvenster en betaalwijze. Klik op een vlak voor de details, zoals de zonecode, het rayon en de exacte parkeertijden.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Parkeerzones in beeld", type: "count" },
          { label: "Rayons", type: "distinct", property: "Rayon" },
          { label: "Gebieden", type: "distinct", property: "GEBIED" },
          {
            label: "Zones à € 1,00 p/u",
            type: "count-where",
            property: "TARIEF",
            equals: "€ 1,00 p/u",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Uurtarief per parkeerzone in {city}",
        description: "Veld TARIEF: het geldende straatparkeertarief per zone",
        property: "TARIEF",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een betaald-parkeerzone. Het **tarief** loopt op van het lage buitentarief (€ 1,00 per uur) naar het hoge binnenstadstarief; enkele zones kennen een dagtarief of een *Stop & Shop*-regeling voor kort winkelen. De zones zijn gegroepeerd in **rayons** (zoals *Binnenstad*, *Noord* of *West*), wat aansluit bij de vergunning- en tariefstructuur. Betalen kan vrijwel overal mobiel of bij de automaat met bankpas.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Parkeerbeleid**: de tariefzonering is een sturingsinstrument — hogere tarieven in het centrum ontmoedigen langparkeren en houden plekken vrij voor bezoekers.\n- **Leefbaarheid**: gereguleerd parkeren voorkomt zoekverkeer en vol geparkeerde woonstraten aan de rand van het centrum.\n- **Bezoekersinformatie**: tarief, tijden en betaalwijze per zone zijn direct bruikbaar voor reis- en bezoekplanning.",
      },
      {
        heading: "Over de bron",
        body: "De zones komen uit de gemeentelijke parkeerregistratie van {city} (ArcGIS-service *Betaald parkeren*). Tarieven en tijden worden periodiek herzien; raadpleeg bij twijfel altijd de actuele borden of de officiële gemeentepagina.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Betaald parkeren (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Betaald_parkeren_RP/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-maximumsnelheden",
    title: "Wegsegmenten en snelheidsregime in {city}",
    subtitle: "Het wegennet uit het gemeentelijke snelhedenbestand",
    intro:
      "Deze laag tekent **{count} wegsegmenten** in {city} uit het bestand *Maximumsnelheden wegen*. Elk segment komt uit het Nationaal Wegenbestand (NWB) en draagt een straatnaam en een wegbeheerder. Let op: in de huidige open-data export is het snelheidsveld voor vrijwel alle segmenten leeg (*NVT*) — de kaart is daardoor vooral een fijnmazig beeld van het wegennet en de beheersverdeling, niet van de feitelijke snelheidslimieten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegsegmenten in beeld", type: "count" },
          { label: "Straatnamen", type: "distinct", property: "stt_naam" },
          {
            label: "Snelheid = NVT (aandeel)",
            type: "count-where",
            property: "maxshd",
            equals: "NVT",
            asShare: true,
          },
          {
            label: "In gemeentelijk beheer",
            type: "count-where",
            property: "wegbehsrt",
            equals: "G",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Wegbeheerder van de segmenten in {city}",
        description:
          "Veld wegbehsrt: soort wegbeheerder volgens het NWB (G = gemeente)",
        property: "wegbehsrt",
        valueLabels: {
          G: "Gemeente",
          P: "Provincie",
          T: "Terrein / overig",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een wegvak uit het NWB, met de straatnaam (*stt_naam*) en de woonplaats. Het veld *wegbehsrt* geeft aan wie de weg beheert — verreweg de meeste segmenten binnen de bebouwde kom staan op **gemeentelijk** beheer, met daarnaast enkele provinciale en terrein-/overige wegen. Het bedoelde snelheidsveld *maxshd* is in deze export niet gevuld; daarom staat er bij vrijwel elk segment *NVT*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en onderhoud**: de verdeling naar wegbeheerder laat zien welk deel van het net de gemeente zelf onderhoudt en waar afstemming met provincie of derden nodig is.\n- **Basis voor snelheidsbeleid**: dit wegvakkenbestand is de kaartlaag waarop een 30-km-zonering of GOW/ETW-indeling wordt geprojecteerd; als de gemeente het snelheidsveld vult, wordt de laag een volwaardige snelhedenkaart.\n- **Compleetheid**: met duizenden segmenten is dit een fijnmazig beeld van het hele wegennet, inclusief zijstraten en woonerven.",
      },
      {
        heading: "Kanttekening bij de data",
        body: "Omdat het snelheidsattribuut (*maxshd*) in de gepubliceerde export leeg is, zijn statistieken over feitelijke maximumsnelheden hier niet mogelijk. De laag blijft waardevol als actuele weergave van het wegennet en de beheersverdeling. Het standaard laadmaximum kan bovendien lager liggen dan het totale aantal segmenten, waardoor bij grote uitsnedes niet alle wegvakken tegelijk in beeld zijn.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Maximumsnelheden wegen (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Maximumsnelheden_wegen/FeatureServer",
      },
      {
        label: "Nationaal Wegenbestand (NWB)",
        url: "https://www.rijkswaterstaat.nl/zakelijk/open-data/nationaal-wegenbestand",
      },
    ],
  },
  {
    layerId: "tlb-doorrijhoogtes",
    title: "Doorrijhoogtes in {city}",
    subtitle: "Hoogtebeperkingen op wegen, tunnels en onderdoorgangen",
    intro:
      "Deze laag toont **{count} hoogtebeperkingen** in {city}: punten waar de vrije doorrijhoogte beperkt is, bijvoorbeeld onder een viaduct, bij een verkeerslicht of langs een bomenrij. Per punt is de maximale doorrijhoogte geregistreerd plus een korte typering van de oorzaak. Klik op een punt voor de exacte hoogte en opmerking.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Hoogtebeperkingen in beeld", type: "count" },
          { label: "Verschillende hoogtewaarden", type: "distinct", property: "Doorrijhoo" },
        ],
      },
      {
        kind: "category-bar",
        title: "Type obstakel bij doorrijhoogtes in {city}",
        description: "Veld Opmerking: de aard van de hoogtebeperking",
        property: "Opmerking",
        valueLabels: {
          VRI: "Verkeersregelinstallatie (VRI)",
          Overbrugging: "Overbrugging / viaduct",
          Bomenrij: "Bomenrij",
          Hoogspanningskabel: "Hoogspanningskabel",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt markeert een plek met een beperkte vrije hoogte. Het veld *Doorrijhoo* bevat de gemeten maximale doorrijhoogte in meters; het veld *Opmerking* typeert de oorzaak. Verreweg de meeste beperkingen horen bij **verkeersregelinstallaties** (uithangende armaturen boven de weg), gevolgd door **overbruggingen** en enkele losse gevallen zoals een bomenrij of hoogspanningskabel.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vrachtverkeer en routering**: hoogtebeperkingen bepalen welke routes toegankelijk zijn voor vrachtwagens, bussen en hoge landbouw- of hulpvoertuigen.\n- **Schadepreventie**: onvoldoende doorrijhoogte leidt tot aanrijdingen met viaducten en installaties; een actueel overzicht helpt bebording en navigatie op orde te houden.\n- **Vergunningen**: bij uitzonderlijk transport is een betrouwbaar hoogtebestand onmisbaar voor het uitzetten van een veilige route.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de gemeentelijke registratie van {city} (ArcGIS-service *Doorrijhoogtes*). De hoogtes zijn ingemeten waarden; controleer bij kritische transporten altijd de actuele situatie ter plaatse, omdat wegdek- of installatiewijzigingen de vrije hoogte kunnen veranderen.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Doorrijhoogtes (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Doorrijhoogtes/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-strooiroutes",
    title: "Strooiroutes in {city}",
    subtitle: "Het gladheidsbestrijdingsnetwerk voor winterse omstandigheden",
    intro:
      "Deze laag tekent **{count} wegvakken** die in {city} bij gladheid worden gestrooid. Samen vormen ze het strooinetwerk waarmee de gemeente bij vorst en sneeuw de belangrijkste rijbanen en fietsroutes begaanbaar houdt. Elk segment is een stukje strooiroute; klik erop voor de routenaam en het routetype.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Strooisegmenten in beeld", type: "count" },
          {
            label: "Totale lengte in beeld",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          { label: "Routetypen", type: "distinct", property: "SOORT_ROUTE" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk lijnsegment maakt deel uit van een strooiroute; het veld *SOORT_ROUTE* typeert het (in de huidige export **wegenstrooiroute**) en *ROUTENAAM* koppelt het segment aan een beheergebied. Het net is opgeknipt in duizenden korte vakken, wat een gedetailleerd beeld geeft van welke straten wél en niet standaard worden gestrooid. Prioriteit ligt doorgaans bij hoofdrijbanen, busroutes en doorgaande fietspaden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Winterbereikbaarheid**: de strooiroutes bepalen welke wegen bij gladheid veilig blijven — cruciaal voor hulpdiensten, openbaar vervoer en woon-werkverkeer.\n- **Verwachtingsmanagement**: bewoners kunnen zien of hun straat op een strooiroute ligt; woonstraten buiten het net worden meestal niet preventief gestrooid.\n- **Middeleninzet**: de totale routelengte is een directe maat voor de benodigde inzet van strooiwagens, zout en manuren per strooironde.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het gemeentelijke wegbeheer van {city} (ArcGIS-service *Strooiroutes*). Let op: het bestand telt meer segmenten dan er standaard tegelijk worden geladen, dus bij een grote kaartuitsnede is niet het hele net in beeld en betreft de getoonde totale lengte alleen de geladen segmenten. Routes kunnen per winterseizoen worden herzien.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Strooiroutes (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Strooiroutes/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-monumentale-bomen",
    title: "Monumentale bomen in {city}",
    subtitle: "Beschermde bomen met bijzondere waarde",
    intro:
      "Binnen {city} toont deze laag **{count} monumentale bomen**: bomen die vanwege hun leeftijd, omvang, soort of cultuurhistorische betekenis extra bescherming genieten. Per boom zijn onder meer de Nederlandse naam, het eigendom en de cultuurhistorische waardering vastgelegd. Klik op een boom voor de details, zoals boomnummer en (waar bekend) kiemjaar.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Monumentale bomen in beeld", type: "count" },
          { label: "Verschillende soorten", type: "distinct", property: "NED_NAAM" },
          {
            label: "In gemeentelijk eigendom",
            type: "count-where",
            property: "EIGENDOM",
            equals: "Gemeentelijk",
          },
          {
            label: "Cultuurhistorisch aantoonbaar",
            type: "count-where",
            property: "CULTUURHIS",
            equals: "Cultuurhistorische waarde aantoonbaar",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten in {city}",
        description: "Veld NED_NAAM: de Nederlandse soortnaam van de boom",
        property: "NED_NAAM",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Eigendom van de monumentale bomen",
        description: "Veld EIGENDOM: gemeentelijke versus particuliere bomen",
        property: "EIGENDOM",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één beschermde boom. Het bestand wordt gedomineerd door forse loofbomen — **inlandse eik**, **beuk** (groen en bruin) en **linde** vormen samen de ruggengraat van het monumentale bomenbestand. Het veld *EIGENDOM* laat zien dat het merendeel op gemeentelijke grond staat, met een aanzienlijke minderheid in particulier bezit. Het veld *CULTUURHIS* geeft aan of aan een boom aantoonbare cultuurhistorische waarde is toegekend.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bescherming**: voor monumentale bomen geldt een strenger kapregime; ze mogen niet zonder meer worden verwijderd, ook niet bij bouwplannen.\n- **Klimaat en leefbaarheid**: oude, grote bomen leveren onevenredig veel schaduw, koelte en waterberging — precies wat bij hittestress in de stad telt.\n- **Ruimtelijke afweging**: bij herinrichting of nieuwbouw moet met de standplaats en het wortelpakket van deze bomen rekening worden gehouden.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het gemeentelijke bomenbeheer van {city} (ArcGIS-service *Monumentale bomen*). Enkele records hebben een lege of afwijkend gespelde soortnaam; die verschijnen als aparte categorie of blijven buiten de grafiek. Het bestand telt meer bomen dan er standaard tegelijk worden geladen, dus bij een ruime kaartuitsnede is mogelijk niet elke boom in beeld.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Monumentale bomen (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Monumentale_bomen/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-hondenlosloopgebieden",
    title: "Hondenlosloopgebieden in {city}",
    subtitle: "Gebieden waar honden zonder aanlijnplicht mogen lopen",
    intro:
      "Deze laag toont **{count} hondenlosloopgebieden** in {city}: aangewezen zones waar honden los mogen lopen, buiten de algemene aanlijnplicht om. Per gebied is het terreintype vastgelegd. Klik op een vlak voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Losloopgebieden in beeld", type: "count" },
          { label: "Terreintypen", type: "distinct", property: "objecttype" },
        ],
      },
      {
        kind: "category-bar",
        title: "Terreintype van de losloopgebieden in {city}",
        description: "Veld objecttype: de begroeiing/inrichting van het gebied",
        property: "objecttype",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een zone waar honden los mogen. Het veld *objecttype* beschrijft het terrein: de meeste losloopgebieden zijn **gras- en kruidachtig**, daarnaast liggen er in **bos** en **bosplantsoen**. Het veld *gebruiksfunctie* bevestigt voor elk vlak de functie *Hondenlosloopgebied*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Leefbaarheid**: duidelijk afgebakende losloopgebieden voorkomen conflicten tussen hondenbezitters, andere recreanten en natuur.\n- **Spreiding**: de ligging laat zien of elke wijk op redelijke afstand een losloopmogelijkheid heeft.\n- **Natuurbeheer**: door loslopen te concentreren in aangewezen zones blijft verstoring van kwetsbare natuur elders beperkt.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de gemeentelijke registratie van {city} (ArcGIS-service *Hondenlosloopgebieden*). De begrenzingen volgen de officiële aanwijzingsbesluiten; buiten deze gebieden geldt in de regel een aanlijn- en/of opruimplicht.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Hondenlosloopgebieden (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Hondenlosloopgebieden/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-speelplekken",
    title: "Speelplekken in {city}",
    subtitle: "Speelterreinen per buurt, doelgroep en omvang",
    intro:
      "Binnen {city} toont deze laag **{count} speelplekken**: van kleine straatplekken tot grote buurtspeelterreinen. Per plek zijn onder meer de leeftijdsdoelgroep, de omvang, de buurtfunctie en het beheergebied vastgelegd. Klik op een vlak voor de details, zoals de objectnaam en het beheergebied.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Speelplekken in beeld", type: "count" },
          { label: "Beheergebieden", type: "distinct", property: "beheergebied" },
          {
            label: "Grote speelterreinen",
            type: "count-where",
            property: "kl_speelterrein_grootte",
            equals: "Groot",
          },
          {
            label: "Buurtplekken",
            type: "count-where",
            property: "kl_buurtstructuur",
            equals: "Buurtplek",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Omvang van de speelplekken in {city}",
        description: "Veld kl_speelterrein_grootte: klasse-indeling naar omvang",
        property: "kl_speelterrein_grootte",
      },
      {
        kind: "category-bar",
        title: "Leeftijdsdoelgroep van de speelplekken",
        description: "Veld leeftijddoelgroep: de beoogde leeftijdscategorie",
        property: "leeftijddoelgroep",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke plek is een speelterrein, geclassificeerd op meerdere assen. De **omvang** loopt van *Klein* (straatplek) via *Middel* (blokplek) tot *Groot* (buurtplek); die indeling loopt gelijk op met de **buurtstructuur** (*kl_buurtstructuur*). De **leeftijdsdoelgroep** laat zien of een plek voor peuters (*0 t/m 5*), kinderen (*0 t/m 11*) of ook oudere jeugd (*6 t/m 18*) is ingericht. Via het **beheergebied** (Noord, West, Reeshof, BIOS …) zijn de plekken aan het gemeentelijk onderhoud gekoppeld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Speelruimtebeleid**: de spreiding en omvang laten zien of elke buurt voldoende en gevarieerd speelaanbod heeft, voor alle leeftijden.\n- **Inclusie**: de doelgroep- en inclusieklassen helpen beoordelen of er ook plekken zijn voor oudere jeugd en voor kinderen met een beperking.\n- **Beheer**: door plekken aan beheergebieden te koppelen kan onderhoud, vervanging en veiligheidsinspectie gericht worden gepland.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit het gemeentelijke speelruimtebeheer van {city} (ArcGIS-service *Speelplekken*, gevoed uit het beheersysteem Geovisia). Een klein deel van de records heeft nog niet alle klassevelden ingevuld; die tellen als *onbekend* en blijven buiten de betreffende grafiek.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Speelplekken (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Speelplekken_Geovisia/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-cultureel-erfgoed",
    title: "Gemeentelijke monumenten in {city}",
    subtitle: "Aangewezen gemeentelijke monumenten en hun bescherming",
    intro:
      "Deze laag toont **{count} gemeentelijke monumenten** in {city}: panden en objecten die de gemeente vanwege hun architectonische of cultuurhistorische waarde heeft aangewezen als beschermd erfgoed. Elk vlak is de begrenzing van een aanwijzing. Klik erop voor de details, zoals de identificatie en de datum van inwerkingtreding.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Monumenten in beeld", type: "count" },
          {
            label: "Grondslag van de aanwijzing",
            type: "distinct",
            property: "GRONDSLAG_OMSCHRIJVING",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een aangewezen **gemeentelijk monument**. Het veld *GRONDSLAG_OMSCHRIJVING* bevestigt de juridische basis: een *aanwijzing gemeentelijk monument* (met voorbescherming, aanwijzingsbesluit en afschrift). Anders dan rijksmonumenten worden deze objecten door de gemeente zelf beschermd, op grond van lokale erfgoedwaarde. Via het veld *NAAM_PDF* is per object naar het onderliggende aanwijzingsbesluit te verwijzen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Vergunningen**: voor wijzigingen aan een gemeentelijk monument gelden extra eisen en een omgevingsvergunning; deze kaart bakent af waar dat speelt.\n- **Ruimtelijke kwaliteit**: beschermd erfgoed bepaalt mede de identiteit van straten en buurten en weegt mee bij herontwikkeling.\n- **Beleid**: het bestand is de basis voor subsidie-, onderhouds- en handhavingsbeleid rond gemeentelijk erfgoed.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de gemeentelijke erfgoedregistratie van {city} (ArcGIS-service *Cultureel erfgoed*), ontsloten als beperkingengebieden. Rijksmonumenten en beschermde stads- en dorpsgezichten worden landelijk (RCE) geregistreerd en zitten niet per definitie in dit gemeentelijke bestand.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Cultureel erfgoed (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Cultureel_erfgoed/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-cultureel-kunstwerk",
    title: "Kunst in de openbare ruimte in {city}",
    subtitle: "De buitencollectie: kunstwerken op straat, plein en in het groen",
    intro:
      "Deze laag toont **{count} kunstwerken** in de openbare ruimte van {city}: beelden, muurschilderingen en andere objecten uit de gemeentelijke buitencollectie. Per kunstwerk zijn de titel, de kunstenaar en een link naar de collectiepagina vastgelegd. Klik op een punt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kunstwerken in beeld", type: "count" },
          { label: "Verschillende kunstenaars", type: "distinct", property: "Kunstenaar" },
          { label: "Verschillende titels", type: "distinct", property: "Titel_kunstwerk" },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest vertegenwoordigde kunstenaars in {city}",
        description: "Veld Kunstenaar: maker(s) van het kunstwerk",
        property: "Kunstenaar",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een kunstwerk uit de buitencollectie — het veld *Object_type* typeert ze als *Kunstobject*. De titel (*Titel_kunstwerk*) en de maker (*Kunstenaar*) staan per object vermeld, en via het veld *URL* is elk werk gekoppeld aan zijn pagina in de online buitencollectie. Sommige kunstenaars zijn met meerdere werken vertegenwoordigd; het merendeel van de titels is uniek.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Cultuurbeleid**: de collectie in de openbare ruimte is een zichtbaar onderdeel van het gemeentelijke kunst- en cultuurbeleid.\n- **Beheer en behoud**: een compleet register is nodig voor onderhoud, restauratie en verzekering van de werken.\n- **Beleving en toerisme**: de data maakt kunstwandelingen en publieksinformatie mogelijk en versterkt de aantrekkelijkheid van de openbare ruimte.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de gemeentelijke buitencollectie van {city} (ArcGIS-service *Cultureel kunstwerk*), gekoppeld aan de online collectiedatabase. Tijdelijke kunst en particuliere werken op privéterrein vallen doorgaans buiten dit register.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Cultureel kunstwerk (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Cultureel_kunstwerk/FeatureServer",
      },
      {
        label: "Buitencollectie Tilburg",
        url: "https://buitencollectie.tilburg.nl/",
      },
    ],
  },
  {
    layerId: "tlb-sportcomplexen",
    title: "Sportcomplexen in {city}",
    subtitle: "Sportparken en -complexen als terreinvlakken",
    intro:
      "Deze laag toont **{count} sportcomplexen** in {city}: de sportparken en -terreinen als vlakken op de kaart, elk met een eigen naam. Zo zie je in één beeld waar het georganiseerde buitensport-aanbod zich in de gemeente concentreert. Klik op een vlak voor de naam van het complex.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Sportcomplexen in beeld", type: "count" },
          { label: "Unieke namen", type: "distinct", property: "Naam" },
          {
            label: "Totaal oppervlak",
            type: "sum",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Grootste complex",
            type: "max",
            property: "Shape__Area",
            unit: "m²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Oppervlakteverdeling van sportcomplexen in {city}",
        description: "Veld Shape__Area: het terreinoppervlak per complex",
        property: "Shape__Area",
        unit: "m²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een sportcomplex — een sportpark of terrein waarop een of meer verenigingen actief zijn. Het veld *Naam* geeft de aanduiding (bijvoorbeeld *Sportpark Brugstraat*); elk complex komt één keer voor. Uit het geometrisch oppervlak (*Shape__Area*) blijkt hoe sterk de terreinen in omvang verschillen: van compacte complexen tot uitgestrekte sportparken met meerdere velden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Voorzieningenspreiding**: de ligging laat zien of sport in alle delen van de gemeente op redelijke afstand bereikbaar is.\n- **Ruimtebeslag**: sportparken zijn grote groene terreinen; hun oppervlak is relevant voor ruimtelijke plannen, verdichting en klimaatadaptatie.\n- **Capaciteit en beheer**: omvang en aantal complexen zijn de basis voor onderhoudsplanning en voor afwegingen over uitbreiding of herschikking van sportaccommodaties.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de gemeentelijke registratie van {city} (ArcGIS-service *Sportcomplex*). Het gaat om de terreinbegrenzingen; individuele velden, gebouwen of binnensportaccommodaties zitten niet als aparte objecten in deze laag. Het oppervlak is de geometrische terreinoppervlakte en kan afwijken van de netto bespeelbare ruimte.",
      },
    ],
    links: [
      {
        label: "Gemeente Tilburg — Sportcomplex (ArcGIS FeatureServer)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Sportcomplex/FeatureServer",
      },
    ],
  },
];
