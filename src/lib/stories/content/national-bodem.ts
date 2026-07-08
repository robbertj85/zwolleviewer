/**
 * Story maps — batch "national-bodem": water, bodem & ondergrond.
 * Lagen: bgt-waterdeel, bro-grondwaterput, bro-grondwaterstand,
 * bro-grondwatersamenstelling, bro-grondwatermonitoringnet, bodemenergie-open,
 * bodemenergie-gesloten, grondwateronttrekking, bgt-put, waterkeringen,
 * rce-archeologie.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "bgt-waterdeel",
    title: "Water in {city} (BGT)",
    subtitle:
      "Sloten, greppels, vijvers en watergangen uit de Basisregistratie Grootschalige Topografie",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} watervlakken** geladen uit de Basisregistratie Grootschalige Topografie (BGT). Elk vlak is een stukje open water — een sloot, greppel, watergang, vijver of plas — nauwkeurig ingemeten op maaiveldniveau. Het BGT-veld *type* vertelt om wat voor water het gaat; klik op een vlak voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Watervlakken in beeld", type: "count" },
          { label: "Watertypen", type: "distinct", property: "type" },
          {
            label: "Bestaand (aandeel)",
            type: "count-where",
            property: "status",
            equals: "bestaand",
            asShare: true,
          },
          { label: "Bronhouders", type: "distinct", property: "bronhouder" },
        ],
      },
      {
        kind: "category-bar",
        title: "Watervlakken per type in {city}",
        description:
          "BGT-veld type: de aard van het watervlak volgens de IMGeo-standaard",
        property: "type",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De BGT legt de fysieke leefomgeving op maaiveldniveau vast met een nauwkeurigheid van enkele decimeters. Water is daarin een eigen objectklasse: elk vlak heeft een *type* (bijvoorbeeld *watergang*, *greppel, droge sloot* of *waterloop*) en een *status* (meestal *bestaand*, soms een geplande of vervallen situatie). Omdat de BGT vlakgericht is, telt een lange watergang die door meerdere kaartbladen loopt als meerdere vlakken — het aantal vlakken zegt dus meer over de versnippering van de kartering dan over het aantal 'echte' waterlichamen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Waterberging en klimaatadaptatie**: het oppervlaktewaternetwerk bepaalt hoeveel regenwater een gebied kan bergen en afvoeren — cruciaal bij hoosbuien en verdroging.\n- **Beheer en onderhoud**: gemeenten en waterschappen gebruiken de BGT als ondergrond voor baggerprogramma's, oevers en duikers.\n- **Ruimtelijke plannen**: bij nieuwbouw geldt vaak een wateropgave (compensatie van verhard oppervlak); de BGT is de standaardondergrond om die tegen af te zetten.",
      },
      {
        heading: "Over de bron",
        body: "De BGT is een wettelijke basisregistratie die door bronhouders (gemeenten, waterschappen, Rijkswaterstaat, ProNature-beheerders) gezamenlijk wordt bijgehouden en via PDOK als open data wordt ontsloten. De statistieken hierboven gaan over de kaartuitsnede van {city}; watervlakken van buurgemeenten kunnen dus meetellen.",
      },
    ],
    links: [
      {
        label: "PDOK: Basisregistratie Grootschalige Topografie (BGT)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
      { label: "Over de BGT", url: "https://www.geobasisregistraties.nl/basisregistraties/grootschalige-topografie" },
    ],
  },
  {
    layerId: "bro-grondwaterput",
    title: "Grondwatermonitoringputten in {city}",
    subtitle:
      "Peilbuizen en meetputten uit de Basisregistratie Ondergrond (BRO)",
    intro:
      "In het kaartgebied van {city} liggen **{count} grondwatermonitoringputten** uit de Basisregistratie Ondergrond (BRO). Dit zijn de peilbuizen waarmee overheden en beheerders de grondwaterstand volgen: elke put heeft een landelijk uniek *bro_id*, een of meer meetbuizen en een geregistreerde maaiveldhoogte ten opzichte van NAP. Klik op een put voor de constructiegegevens.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetputten in beeld", type: "count" },
          { label: "Unieke put-ID's", type: "distinct", property: "bro_id" },
          {
            label: "Totaal aantal meetbuizen",
            type: "sum",
            property: "number_of_monitoring_tubes",
            decimals: 0,
          },
          {
            label: "Gem. maaiveldhoogte",
            type: "avg",
            property: "ground_level_position",
            unit: "m NAP",
            decimals: 1,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Oorspronkelijke functie van de putten in {city}",
        description:
          "BRO-veld initial_function: waarvoor de put oorspronkelijk is aangelegd",
        property: "initial_function",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Kwaliteitsregime van de registratie",
        description:
          "BRO-veld quality_regime: IMBRO/A betreft ouder, gemigreerd materiaal; IMBRO voldoet aan het volledige gegevensmodel",
        property: "quality_regime",
        maxCategories: 4,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een grondwatermonitoringput (in de BRO een *Grondwatermonitoringput* / GMW) is een fysieke buis in de grond waarmee de grondwaterstand of -kwaliteit wordt gemeten. Eén put kan meerdere *meetbuizen* op verschillende diepten bevatten (het veld *number_of_monitoring_tubes*). Het *quality_regime* geeft aan onder welk kwaliteitsniveau een put is geregistreerd: *IMBRO/A* is ouder, uit bestaande databronnen overgezet materiaal, *IMBRO* voldoet aan het volledige BRO-gegevensmodel.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verdroging en wateroverlast**: een dicht meetnet is de basis om grondwaterstanden te volgen en tijdig te sturen bij droogte of te natte omstandigheden.\n- **Funderingen en bodemdaling**: grondwaterstanden bepalen mede het risico op paalrot en zetting van gebouwen en infrastructuur.\n- **Vergunningverlening**: bij onttrekkingen, bemalingen en bodemenergie is een goed beeld van de uitgangssituatie nodig; deze putten leveren die meetreeksen.",
      },
      {
        heading: "Over de bron",
        body: "De BRO is de wettelijke basisregistratie voor gegevens over de Nederlandse ondergrond, beheerd door TNO/Geologische Dienst Nederland en ontsloten via PDOK. Deze laag toont de putlocaties binnen de kaartuitsnede van {city}; de bijbehorende meetreeksen zelf zitten in de gekoppelde grondwaterstand- en samenstellingsonderzoeken.",
      },
    ],
    links: [
      { label: "BRO-loket", url: "https://www.broloket.nl/" },
      {
        label: "Basisregistratie Ondergrond (BRO)",
        url: "https://basisregistratieondergrond.nl/",
      },
    ],
  },
  {
    layerId: "bro-grondwaterstand",
    title: "Grondwaterstandonderzoek in {city}",
    subtitle:
      "Meetreeksen van de grondwaterstand (GLD) uit de Basisregistratie Ondergrond",
    intro:
      "Deze laag toont **{count} grondwaterstandonderzoeken** (in de BRO: *Grondwaterstanddossier*, GLD) binnen het kaartgebied van {city}. Waar de puttenlaag de fysieke peilbuizen toont, staat hier het meetdossier centraal: de reeks metingen van de grondwaterstand die aan een meetbuis hangt. Elk dossier heeft een uniek *bro_id* en een teller van het aantal observaties.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetdossiers in beeld", type: "count" },
          { label: "Unieke dossier-ID's", type: "distinct", property: "bro_id" },
          {
            label: "Totaal aantal observaties",
            type: "sum",
            property: "number_of_observations",
            decimals: 0,
          },
          {
            label: "Meeste observaties (dossier)",
            type: "max",
            property: "number_of_observations",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kwaliteitsregime van de meetdossiers in {city}",
        description:
          "BRO-veld quality_regime: IMBRO/A is gemigreerd historisch materiaal, IMBRO voldoet aan het volledige model",
        property: "quality_regime",
        maxCategories: 4,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een grondwaterstandonderzoek (GLD) bundelt de tijdreeks van gemeten grondwaterstanden voor één meetbuis. Het veld *number_of_observations* telt hoeveel metingen er in het dossier zitten — van een handmatig ingelezen historische reeks tot een automatische datalogger met duizenden punten. Sommige dossiers zijn net aangemaakt en bevatten nog geen observaties (teller 0); die tellen wel mee als dossier, maar dragen niet bij aan de meetsom.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Trendanalyse**: alleen met langjarige reeksen zie je of het grondwater structureel stijgt of daalt — essentieel voor droogte- en verziltingsbeleid.\n- **Onderbouwing van maatregelen**: peilbesluiten, drainage en infiltratie worden op deze meetreeksen gebaseerd.\n- **Openheid**: de reeksen zijn publiek opvraagbaar, zodat bewoners en adviesbureaus dezelfde data gebruiken als de overheid.",
      },
      {
        heading: "Over de bron",
        body: "De grondwaterstanddossiers zijn onderdeel van de Basisregistratie Ondergrond (BRO), beheerd door TNO/Geologische Dienst Nederland en ontsloten via PDOK. De onderliggende meetreeksen zijn per dossier als CSV op te vragen bij de publieke BRO-services. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "BRO-loket", url: "https://www.broloket.nl/" },
      {
        label: "Basisregistratie Ondergrond (BRO)",
        url: "https://basisregistratieondergrond.nl/",
      },
    ],
  },
  {
    layerId: "bro-grondwatersamenstelling",
    title: "Grondwaterkwaliteit in {city}",
    subtitle:
      "Chemische samenstelling van het grondwater (GAR) uit de Basisregistratie Ondergrond",
    intro:
      "Deze laag toont **{count} grondwatersamenstellingsonderzoeken** (BRO: *Grondwatersamenstellingsonderzoek*, GAR) binnen het kaartgebied van {city}. Op deze meetpunten is een grondwatermonster genomen en chemisch geanalyseerd — de basis voor het beoordelen van de grondwaterkwaliteit. Elk onderzoek heeft een uniek *bro_id* en een bemonsteringsmoment.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kwaliteitsmetingen in beeld", type: "count" },
          { label: "Unieke onderzoek-ID's", type: "distinct", property: "bro_id" },
          {
            label: "Kwaliteitsregime IMBRO/A",
            type: "count-where",
            property: "quality_regime",
            equals: "IMBRO/A",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kwaliteitsregime van de metingen in {city}",
        description:
          "BRO-veld quality_regime: IMBRO/A is gemigreerd historisch materiaal, IMBRO voldoet aan het volledige model",
        property: "quality_regime",
        maxCategories: 4,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een grondwatersamenstellingsonderzoek (GAR) legt de chemische analyse van een grondwatermonster vast: zuurgraad, chloride, nitraat, metalen en tal van andere parameters. Deze laag toont de meetlocaties en het bijbehorende dossier; de meetwaarden zelf zijn per onderzoek op te vragen via de BRO-services. Het aantal onderzoeken in een gebied hangt sterk af van historische meetcampagnes en van de aanwezigheid van kwetsbare functies zoals drinkwaterwinning.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Drinkwaterbescherming**: de kwaliteit van het grondwater bepaalt of het (na zuivering) als drinkwaterbron bruikbaar blijft.\n- **Bodem- en grondwatervervuiling**: metingen signaleren verontreinigingen en helpen bronnen op te sporen.\n- **Kaderrichtlijn Water**: Nederland moet de chemische toestand van grondwaterlichamen rapporteren; deze metingen leveren daarvoor de onderbouwing.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De samenstellingsonderzoeken zijn onderdeel van de Basisregistratie Ondergrond (BRO), beheerd door TNO/Geologische Dienst Nederland en ontsloten via PDOK. De dekking is ongelijkmatig: in een gemeente kunnen soms maar enkele metingen liggen. De statistieken gaan over de kaartuitsnede van {city} en zijn dus geen volledig beeld van de grondwaterkwaliteit in de gemeente.",
      },
    ],
    links: [
      { label: "BRO-loket", url: "https://www.broloket.nl/" },
      {
        label: "Basisregistratie Ondergrond (BRO)",
        url: "https://basisregistratieondergrond.nl/",
      },
    ],
  },
  {
    layerId: "bro-grondwatermonitoringnet",
    title: "Grondwatermonitoringnetten in {city}",
    subtitle:
      "Meetpunten van georganiseerde grondwatermeetnetten (GMN) uit de BRO",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} meetpunten** van grondwatermonitoringnetten (BRO: *Grondwatermonitoringnet*, GMN). Een monitoringnet is een doelgericht samengestelde verzameling meetpunten — bijvoorbeeld voor een provinciaal meetnet, een natuurgebied of een drinkwaterwinning. Elk meetpunt heeft een netwerk-ID (*gmn_bro_id*) en een meetpuntcode.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetpunten in beeld", type: "count" },
          {
            label: "Monitoringnetten",
            type: "distinct",
            property: "gmn_bro_id",
          },
          {
            label: "Unieke meetpuntcodes",
            type: "distinct",
            property: "measuring_point_code",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meetpunten per monitoringnet in {city}",
        description:
          "BRO-veld gmn_bro_id: het net waartoe elk meetpunt behoort",
        property: "gmn_bro_id",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Waar de putten- en dossierlagen losse meetlocaties tonen, groepeert een *monitoringnet* meetpunten die met een gezamenlijk doel worden beheerd. Eén fysieke peilbuis kan aan meerdere netten meedoen. Het veld *gmn_bro_id* identificeert het net; de *measuring_point_code* is de door de beheerder gehanteerde code van het punt. Zo laat deze laag zien welke gestructureerde meetprogramma's er in een gebied lopen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beleidsmonitoring**: provincies en waterschappen beheren netten om bijvoorbeeld verdroging van natuurgebieden of de invloed van onttrekkingen te volgen.\n- **Samenhang**: doordat metingen in een net gebundeld zijn, kunnen trends over meerdere punten samen worden geanalyseerd.\n- **Efficiëntie**: het overzicht helpt overlappende of juist ontbrekende meetinspanning in beeld te brengen.",
      },
      {
        heading: "Over de bron",
        body: "De monitoringnetten zijn onderdeel van de Basisregistratie Ondergrond (BRO), beheerd door TNO/Geologische Dienst Nederland en ontsloten via PDOK. De statistieken gaan over de meetpunten binnen de kaartuitsnede van {city}; een net kan zich veel verder uitstrekken dan deze uitsnede.",
      },
    ],
    links: [
      { label: "BRO-loket", url: "https://www.broloket.nl/" },
      {
        label: "Basisregistratie Ondergrond (BRO)",
        url: "https://basisregistratieondergrond.nl/",
      },
    ],
  },
  {
    layerId: "bodemenergie-open",
    title: "Open bodemenergiesystemen (WKO) in {city}",
    subtitle:
      "Warmte-koudeopslag met grondwater — bron- en retourputten uit de landelijke WKO-registratie",
    intro:
      "In het kaartgebied van {city} zijn **{count} putten van open bodemenergiesystemen** geladen uit de landelijke WKO-registratie van RVO. Open systemen (open bodemenergie, *OBES*) pompen grondwater op om er warmte of koude uit te halen en injecteren het weer terug — samen vormen ze een warmte-koudeopslag (WKO). Elke stip is een bron- of retourput; klik erop voor capaciteit en status.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "WKO-putten in beeld", type: "count" },
          {
            label: "Unieke installaties",
            type: "distinct",
            property: "installatie_id",
          },
          {
            label: "In gebruik (aandeel)",
            type: "count-where",
            property: "status_instal",
            equals: "In Gebruik",
            asShare: true,
          },
          {
            label: "Gem. pompcapaciteit",
            type: "avg",
            property: "pompcapaciteit",
            unit: "m³/u",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Status van de installaties in {city}",
        description:
          "Veld status_instal: de gebruiksstatus van het bodemenergiesysteem",
        property: "status_instal",
        maxCategories: 6,
      },
      {
        kind: "histogram",
        title: "Vergunde onttrekkingshoeveelheid per put",
        description:
          "Veld maxhoeveelheidm3ontrekking: de maximaal vergunde jaaronttrekking in kubieke meter grondwater",
        property: "maxhoeveelheidm3ontrekking",
        unit: "m³/jaar",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een open bodemenergiesysteem gebruikt het grondwater zelf als opslagmedium: in de zomer wordt warmte in de bodem opgeslagen en in de winter teruggewonnen (en omgekeerd voor koude). Zo'n systeem bestaat uit meerdere putten — vandaar dat het aantal *putten* hoger ligt dan het aantal *installaties*. De velden *pompcapaciteit* en *maxhoeveelheidm3ontrekking* zeggen iets over de omvang van het systeem.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energietransitie**: WKO is een van de belangrijkste technieken om gebouwen aardgasvrij te verwarmen en te koelen.\n- **Ordening van de ondergrond**: open systemen beïnvloeden de grondwaterstroming; onderlinge afstand en interferentie moeten worden geregeld, zeker in drukke binnensteden.\n- **Vergunningen**: grotere open systemen zijn vergunningplichtig bij de provincie; deze registratie geeft zicht op wat er al vergund en gerealiseerd is.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De gegevens komen uit de publieke WKO-registratie van RVO (gevoed door bevoegd gezag en de BRO). Niet elk veld is voor elke put ingevuld; ontbrekende capaciteiten worden automatisch weggelaten uit de gemiddelden en de histogram. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "RVO: bodemenergie (WKO)", url: "https://www.rvo.nl/onderwerpen/bodemenergie" },
      { label: "WKO-tool Nederland", url: "https://www.wkotool.nl/" },
    ],
  },
  {
    layerId: "bodemenergie-gesloten",
    title: "Gesloten bodemenergiesystemen in {city}",
    subtitle:
      "Bodemwarmtewisselaars (gesloten lussen) uit de landelijke WKO-registratie",
    intro:
      "In het kaartgebied van {city} liggen **{count} gesloten bodemenergiesystemen** (bodemwarmtewisselaars, *GBES*) uit de landelijke WKO-registratie van RVO. Anders dan open systemen pompen deze geen grondwater op: er circuleert een vloeistof door een gesloten buizenlus in de bodem, die warmte en koude uitwisselt met de grond. Klik op een punt voor diepte, lengte en warmte-/koudevraag.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gesloten systemen in beeld", type: "count" },
          {
            label: "In gebruik (aandeel)",
            type: "count-where",
            property: "status_instal",
            equals: "In Gebruik",
            asShare: true,
          },
          {
            label: "Gem. einddiepte",
            type: "avg",
            property: "einddiepte",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Totale boorlengte",
            type: "sum",
            property: "totalelengte",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Boordiepte van de bodemlussen in {city}",
        description:
          "Veld einddiepte: hoe diep de gesloten bodemwarmtewisselaar in de grond reikt",
        property: "einddiepte",
        unit: "m",
        bins: 8,
      },
      {
        kind: "category-bar",
        title: "Status van de installaties",
        description:
          "Veld status_instal: de gebruiksstatus van het gesloten systeem",
        property: "status_instal",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een gesloten bodemenergiesysteem — ook wel bodemwarmtewisselaar of *aardwarmtelus* — bestaat uit een of meer geboorde lussen waardoor een vloeistof circuleert. Het systeem onttrekt geen water aan de bodem, maar wisselt alleen warmte uit. De velden *einddiepte* en *totalelengte* geven de geometrie van de lus weer, *koudevraag* en *warmtevraag* de energetische vraag. Kleine systemen (bijvoorbeeld bij een woning) staan naast grote systemen onder utiliteitsgebouwen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Aardgasvrij verwarmen**: gesloten systemen zijn een gangbare oplossing voor individuele woningen en kleinere gebouwen zonder grondwateronttrekking.\n- **Bodembeheer**: ook gesloten lussen beïnvloeden de bodemtemperatuur; bij hoge dichtheid speelt onderlinge beïnvloeding.\n- **Meldingsplicht**: kleine gesloten systemen zijn meldingsplichtig; de registratie helpt gemeenten en provincies zicht te houden op wat er in de ondergrond zit.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De gegevens komen uit de publieke WKO-registratie van RVO. Niet elk veld is voor elk systeem ingevuld; ontbrekende diepten of lengten worden automatisch weggelaten uit de gemiddelden, sommen en histogram. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "RVO: bodemenergie (WKO)", url: "https://www.rvo.nl/onderwerpen/bodemenergie" },
      { label: "WKO-tool Nederland", url: "https://www.wkotool.nl/" },
    ],
  },
  {
    layerId: "grondwateronttrekking",
    title: "Grondwateronttrekkingen in {city}",
    subtitle:
      "Onttrekkings- en infiltratieputten uit de landelijke registratie van RVO",
    intro:
      "In het kaartgebied van {city} zijn **{count} grondwateronttrekkingen en -infiltraties** geladen uit de landelijke registratie van RVO. Dit zijn putten waarmee (grond)water aan de bodem wordt onttrokken of juist wordt geïnfiltreerd — voor industrie, beregening, drinkwater, bouwputbemaling of grondwaterbeheer. Klik op een punt voor de status en vergunde hoeveelheid.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Onttrekkingsputten in beeld", type: "count" },
          {
            label: "Unieke installaties",
            type: "distinct",
            property: "installatie_id",
          },
          {
            label: "In gebruik (aandeel)",
            type: "count-where",
            property: "status_instal",
            equals: "In Gebruik",
            asShare: true,
          },
          {
            label: "Vergunde onttrekking (totaal)",
            type: "sum",
            property: "maxhoeveelheidm3ontrekking",
            unit: "m³/jaar",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Status van de onttrekkingen in {city}",
        description:
          "Veld status_instal: de gebruiksstatus van de onttrekking of infiltratie",
        property: "status_instal",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een put waarmee grondwater wordt onttrokken of geïnfiltreerd. Het gaat om uiteenlopende doelen: van permanente industriële winningen tot tijdelijke bouwputbemalingen. Het veld *maxhoeveelheidm3ontrekking* geeft de maximaal vergunde jaarhoeveelheid; dit veld is niet voor elke put ingevuld (met name bij infiltraties of oudere registraties), waardoor de totaalsom een ondergrens is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Waterbalans**: grote onttrekkingen kunnen de grondwaterstand in de omgeving verlagen — relevant voor natuur, landbouw en funderingen.\n- **Verdrogingsbestrijding**: bij droogte staan onttrekkingen soms onder verscherpt toezicht of tijdelijk verbod.\n- **Vergunningen en toezicht**: provincie en waterschap zijn bevoegd gezag; deze registratie geeft zicht op de vergunde en actieve onttrekkingen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De gegevens komen uit de publieke WKO/grondwater-registratie van RVO. Doordat niet elk veld overal is ingevuld, worden ontbrekende hoeveelheden automatisch weggelaten uit de som. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      { label: "RVO: bodemenergie en grondwater", url: "https://www.rvo.nl/onderwerpen/bodemenergie" },
      { label: "WKO-tool Nederland", url: "https://www.wkotool.nl/" },
    ],
  },
  {
    layerId: "bgt-put",
    title: "Putten en brandkranen in {city} (BGT)",
    subtitle:
      "Straatputten, kolken, brandkranen en rioolputten uit de Basisregistratie Grootschalige Topografie",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} putten** geladen uit de Basisregistratie Grootschalige Topografie (BGT). Dit zijn de zichtbare 'deksels' in de openbare ruimte: brandkranen, inspectie- en rioolputten, straatkolken en pomp-/infiltratieputten. Het BGT-veld *plus_type* onderscheidt de soorten; klik op een punt voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Putten in beeld", type: "count" },
          {
            label: "Brandkranen / -putten",
            type: "count-where",
            property: "plus_type",
            equals: "brandkraan / -put",
          },
          {
            label: "Inspectie- / rioolputten",
            type: "count-where",
            property: "plus_type",
            equals: "inspectie- / rioolput",
          },
          {
            label: "Kolken",
            type: "count-where",
            property: "plus_type",
            equals: "kolk",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Putten per type in {city}",
        description:
          "BGT-veld plus_type: de soort put volgens de IMGeo-standaard",
        property: "plus_type",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De BGT registreert putten als puntobjecten met een *plus_type*: een **brandkraan / -put** (bluswatervoorziening), een **inspectie- / rioolput** (toegang tot de riolering), een **kolk** (straatkolk die hemelwater afvoert) of een pomp-/infiltratieput. Niet elke put heeft een ingevuld *plus_type*; die vallen in de categorie zonder waarde. Het aantal en de mix van typen geven een indruk van de ondergrondse infrastructuur onder de straat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Brandveiligheid**: de locatie van brandkranen is direct relevant voor de bereikbaarheid van bluswater voor de brandweer.\n- **Rioolbeheer**: inspectieputten en kolken zijn de toegangs- en afvoerpunten van het rioolstelsel; hun dichtheid hangt samen met de afwatering van straten.\n- **Klimaatadaptatie**: kolken bepalen hoe snel regenwater van straat wordt afgevoerd — bij hoosbuien een kritieke schakel.",
      },
      {
        heading: "Over de bron",
        body: "De putten komen uit de Basisregistratie Grootschalige Topografie (BGT), bijgehouden door bronhouders zoals gemeenten en waterschappen en ontsloten via PDOK. De BGT toont alleen wat aan het maaiveld zichtbaar is; het onderliggende leidingnet zit hier niet in. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "PDOK: Basisregistratie Grootschalige Topografie (BGT)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
      { label: "Over de BGT", url: "https://www.geobasisregistraties.nl/basisregistraties/grootschalige-topografie" },
    ],
  },
  {
    layerId: "waterkeringen",
    title: "Waterkeringen in {city}",
    subtitle:
      "Dijken, kades en andere keringen van de waterschappen (IMWA-legger)",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} waterkeringen** uit de landelijke IMWA-dataset van de waterschappen. Het gaat om dijken, kades en andere keringen die het land tegen overstroming beschermen. Elke kering heeft een categorie (primair, regionaal of overig), een keringtype en een beherend waterschap; klik op een lijn voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Keringen in beeld", type: "count" },
          {
            label: "Primaire keringen",
            type: "count-where",
            property: "categoriewaterkering",
            equals: "primair",
          },
          {
            label: "Keringtypen",
            type: "distinct",
            property: "typewaterkering",
          },
          {
            label: "Waterbeheerders",
            type: "distinct",
            property: "waterbeheerder",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Waterkeringen per categorie in {city}",
        description:
          "IMWA-veld categoriewaterkering: het beschermingsniveau van de kering",
        property: "categoriewaterkering",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Type waterkering",
        description:
          "IMWA-veld typewaterkering: de fysieke vorm van de kering (bijvoorbeeld dijk of kade)",
        property: "typewaterkering",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een waterkering is een aaneengesloten lijnelement dat water tegenhoudt. Het veld *categoriewaterkering* geeft het beschermingsniveau: **primaire** keringen beschermen tegen buitenwater (zee, grote rivieren, meren) en vallen onder wettelijke veiligheidsnormen; **regionale** en **overige** keringen beschermen tegen binnenwater en regionale peilverschillen. Het *typewaterkering* beschrijft de fysieke vorm, zoals een dijk of kade. De lijnen komen uit de legger — de formele registratie waarin het waterschap vastlegt welke keringen het beheert.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hoogwaterveiligheid**: keringen bepalen welk gebied droog blijft; hun ligging is de basis voor overstromingsrisico's en evacuatieplannen.\n- **Ruimtelijke beperkingen**: rond keringen geldt een beschermingszone waarin bouwen en graven aan regels gebonden zijn (de keur van het waterschap).\n- **Klimaatopgave**: door zeespiegelstijging en hogere rivierafvoeren staan keringen onder toenemende druk; dijkversterkingen volgen uit de landelijke veiligheidsbeoordeling.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de landelijke IMWA-standaard (Informatiemodel Water) van de waterschappen, samengebracht en via PDOK ontsloten. Het beherende waterschap staat per kering in het veld *waterbeheerder*. De statistieken gaan over de kaartuitsnede van {city}; keringen van aangrenzende gebieden kunnen meetellen.",
      },
    ],
    links: [
      {
        label: "PDOK: waterschappen keringen (IMWA)",
        url: "https://www.pdok.nl/",
      },
      { label: "Waterschappen (Unie van Waterschappen)", url: "https://unievanwaterschappen.nl/" },
    ],
  },
  {
    layerId: "rce-archeologie",
    title: "Archeologische monumenten in {city}",
    subtitle:
      "Terreinen van archeologische waarde uit de Archeologische Monumentenkaart (AMK)",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} archeologische monumenten** uit de Archeologische Monumentenkaart (AMK) van de Rijksdienst voor het Cultureel Erfgoed (RCE). Dit zijn terreinen met bekende of verwachte archeologische resten, ingedeeld naar archeologische waarde. Elk terrein heeft een *toponiem* (gebiedsnaam) en een waardering; klik op een vlak voor de omschrijving.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Monumenten in beeld", type: "count" },
          { label: "Unieke terreinen", type: "distinct", property: "toponiem" },
          {
            label: "Waarderingsklassen",
            type: "distinct",
            property: "kwaliteitswaarde",
          },
          {
            label: "Zeer hoge waarde",
            type: "count-where",
            property: "kwaliteitswaarde",
            equals: "zeer hoge archeologische waarde",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Archeologische waardering in {city}",
        description:
          "AMK-veld kwaliteitswaarde: de toegekende archeologische waarde van het terrein",
        property: "kwaliteitswaarde",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De Archeologische Monumentenkaart deelt terreinen in naar *kwaliteitswaarde* — van *archeologische waarde* tot *zeer hoge archeologische waarde (beschermd)*. Een hoge waardering betekent dat er bekende, goed bewaarde of zeldzame resten in de bodem zitten. Het *toponiem* is de traditionele naam van het gebied (bijvoorbeeld een havezathe of terp), en de *omschrijving* vertelt wat er bekend is over de vindplaats.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke ordening**: bij ingrepen in de bodem (bouwen, graven, kabels leggen) op of nabij een monument geldt vaak een onderzoeks- of vergunningplicht.\n- **Erfgoedbescherming**: de hoogst gewaardeerde terreinen kunnen wettelijk beschermd zijn; verstoring is dan verboden zonder ontheffing.\n- **Planvorming**: gemeenten verwerken deze waarden in hun archeologiebeleid en bestemmingsplannen, zodat vroeg in het proces met erfgoed rekening wordt gehouden.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De AMK wordt beheerd door de Rijksdienst voor het Cultureel Erfgoed (RCE) en via de erfgoed-WFS ontsloten. De kaart toont *bekende* terreinen; de afwezigheid van een monument betekent niet dat er geen archeologie in de bodem zit — daarvoor bestaan aparte verwachtingskaarten. De statistieken gaan over de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "RCE: Rijksdienst voor het Cultureel Erfgoed",
        url: "https://www.cultureelerfgoed.nl/onderwerpen/archeologie",
      },
      {
        label: "Archeologie in Nederland",
        url: "https://www.cultureelerfgoed.nl/onderwerpen/bronnen-en-kaarten",
      },
    ],
  },
];
