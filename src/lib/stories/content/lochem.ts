/**
 * Story maps — gemeentelijke lagen Lochem (open data DLGO9 / CirculusBeheer).
 * Alleen zichtbaar in gemeente Lochem. Alle cijfers/grafieken worden
 * client-side berekend uit de daadwerkelijk geladen features.
 *
 * DLGO9 = Datalab Gelderland Oost, dat data publiceert voor negen oost-Gelderse
 * gemeenten. Voor lagen met een DLGO9-suffix beslaat de brondata de hele regio;
 * dat staat waar relevant in de tekst.
 *
 * Properties per laag geverifieerd via live ArcGIS-samples (mei 2026).
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  // ═══════════════════════════════════════ BODEM & ONDERGROND
  {
    layerId: "lch-bodemkaart",
    title: "De bodem van {city}",
    subtitle:
      "Grondsoorten en bodemopbouw volgens de landelijke Bodemkaart (BRO)",
    intro:
      "Deze laag toont **{count} bodemvlakken** binnen {city}, afkomstig uit de landelijke Bodemkaart van de Basisregistratie Ondergrond (BRO) en per gemeente ontsloten door Datalab Gelderland Oost. Elk vlak beschrijft de grondsoort en bodemopbouw ter plekke — van humuspodzol- en enkeerdgronden op de hogere zandruggen tot rivierkleigronden in de beekdalen. Klik op een vlak voor de volledige bodemcode en omschrijving.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          { label: "Bodemgroepen", type: "distinct", property: "groep1" },
          {
            label: "Unieke bodemtypen",
            type: "distinct",
            property: "bodem1_oms",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemgroepen in {city}",
        description:
          "BRO-veld groep1: de hoofdindeling van de grondsoort per vlak",
        property: "groep1",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De Bodemkaart deelt Nederland op in vlakken met een vergelijkbare bodemopbouw. In {city} domineren **humuspodzolgronden** (uitgeloogde zandgronden op de dekzandruggen) en **enkeerdgronden** — de door eeuwenlange bemesting opgehoogde essen en enken die zo kenmerkend zijn voor de Achterhoek. In de lagere delen liggen rivier- en beekkleigronden. Het veld *bodem1_oms* geeft per vlak de precieze omschrijving, met daaronder nog een tweede en derde bodemlaag voor gemengde vlakken.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Water & klimaat**: de grondsoort bepaalt hoe snel regenwater wegzakt of juist blijft staan — basisinformatie voor klimaatadaptatie en waterberging.\n- **Landbouw & natuur**: bodemtype stuurt gewaskeuze, draagkracht en de natuurwaarde van een gebied.\n- **Bouwen**: grondsoort en draagkracht zijn medebepalend voor funderingskeuzes en zettingsrisico's.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit de BRO-Bodemkaart (schaal 1:50.000), via Datalab Gelderland Oost met een `statnaam`-filter tot {city} ingeperkt. Let op: de kaart is een landsdekkende generalisatie op basis van boringen en veldverkenning; op perceelniveau kan de werkelijke bodem afwijken. Voor een exacte beoordeling blijft een lokale boring nodig.",
      },
    ],
    links: [
      {
        label: "BRO Bodemkaart (PDOK)",
        url: "https://www.pdok.nl/introductie/-/article/bro-bodemkaart-sgm-",
      },
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
    ],
  },
  {
    layerId: "lch-grondwatertrappen",
    title: "Grondwatertrappen in {city}",
    subtitle:
      "De gemiddeld hoogste en laagste grondwaterstand per vlak (BRO)",
    intro:
      "Deze laag deelt {city} op in **{count} vlakken** met een **grondwatertrap** (GT): een klasse die aangeeft hoe hoog en hoe laag het grondwater gemiddeld in een gebied staat. Lage trappen (I–III) horen bij natte gronden waar het grondwater dicht onder maaiveld blijft; hoge trappen (VI–VII) bij droge gronden waar het diep wegzakt. Zo zie je in één oogopslag waar {city} nat of droog is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "GT-vlakken in beeld", type: "count" },
          { label: "Grondwatertrappen", type: "distinct", property: "GT_TRAP" },
          {
            label: "Natte gronden (GT I–III, aandeel)",
            type: "count-where",
            property: "GT_TRAP",
            equals: ["I", "II", "IIa", "III", "IIIa"],
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Verdeling van grondwatertrappen in {city}",
        description:
          "BRO-veld GT_TRAP: van GT I (zeer nat) tot GT VII (zeer droog)",
        property: "GT_TRAP",
        maxCategories: 10,
      },
    ],
    sections: [
      {
        heading: "Hoe lees je een grondwatertrap?",
        body: "Een grondwatertrap combineert de **gemiddeld hoogste grondwaterstand** (GHG, in de natte periode) en de **gemiddeld laagste grondwaterstand** (GLG, in de droge periode). Trap I is het natst (grondwater bijna altijd hoog), trap VII het droogst. Toevoegingen zoals *a* verfijnen de klasse. De waarden *nttk*, *onbekend* en *water* markeren vlakken zonder toegekende trap.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: natte gronden zijn gevoelig voor wateroverlast, droge gronden juist voor verdroging en hittestress.\n- **Funderingen**: een dalende grondwaterstand kan houten paalfunderingen aantasten — grondwatertrappen zijn daarvoor een eerste indicatie.\n- **Landbouw & natuur**: de trap bepaalt draagkracht, gewasgroei en welke natuurtypen kansrijk zijn.",
      },
      {
        heading: "Over de bron",
        body: "De grondwatertrappen komen uit de BRO en zijn via Datalab Gelderland Oost tot {city} ingeperkt. Het zijn langjarige gemiddelden op basis van bodemkundig-hydrologische kartering; ze zeggen niets over de grondwaterstand op één specifiek moment. Lokale drainage, verharding of ingrepen kunnen de werkelijke situatie hebben veranderd.",
      },
    ],
    links: [
      {
        label: "BRO Bodemkaart & grondwatertrappen (PDOK)",
        url: "https://www.pdok.nl/introductie/-/article/bro-bodemkaart-sgm-",
      },
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
    ],
  },
  {
    layerId: "lch-krw-oppervlaktewateren",
    title: "KRW-oppervlaktewateren rond {city}",
    subtitle:
      "Waterlichamen uit de Kaderrichtlijn Water in oost-Gelderland",
    intro:
      "Deze laag toont **{count} oppervlaktewaterlichamen** in de DLGO9-regio (oost-Gelderland, inclusief {city}) die onder de Europese **Kaderrichtlijn Water** (KRW) vallen. Voor deze wateren gelden Europese doelen voor ecologische en chemische waterkwaliteit. Elk waterlichaam heeft een KRW-type dat het karakter beschrijft — van langzaam stromende beken op zand tot gebufferde sloten en kanalen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Waterlichamen in beeld", type: "count" },
          { label: "KRW-typen", type: "distinct", property: "KRW_type" },
          { label: "Waternamen", type: "distinct", property: "owanaam" },
        ],
      },
      {
        kind: "category-bar",
        title: "KRW-typen in de regio rond {city}",
        description:
          "Veld KRW_type: het watertype waaraan de KRW-doelen zijn opgehangen",
        property: "KRW_type",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een **KRW-waterlichaam** met een buffer eromheen. In deze regio overheersen *langzaam stromende midden- en benedenlopen op zand* — de karakteristieke Achterhoekse beken zoals de Berkel en zijtakken. Het veld *owanaam* geeft de naam van het waterlichaam, *wgbnaam* het bijbehorende afwateringsgebied.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Waterkwaliteitsdoelen**: de KRW verplicht Nederland tot een goede ecologische toestand van deze wateren; achterblijvende kwaliteit vraagt om maatregelen.\n- **Grondwater–oppervlaktewater**: beken en sloten staan in verbinding met het grondwater; ingrepen in het ene systeem werken door in het andere.\n- **Ruimtelijke plannen**: langs KRW-wateren gelden vaak beschermings- en inrichtingseisen (natuurvriendelijke oevers, beekherstel).",
      },
      {
        heading: "Over de bron",
        body: "De laag is een DLGO9-brede selectie van Datalab Gelderland Oost en beslaat de hele oost-Gelderse regio, niet alleen {city}. Waterlichamen die net buiten de gemeentegrens liggen tellen dus mee. De begrenzing volgt de officiële KRW-registratie van de waterschappen.",
      },
    ],
    links: [
      {
        label: "Kaderrichtlijn Water (Informatiehuis Water)",
        url: "https://www.helpdeskwater.nl/onderwerpen/wetgeving-beleid/kaderrichtlijn-water/",
      },
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
    ],
  },

  // ═══════════════════════════════════════ GROEN & ECOLOGIE
  {
    layerId: "lch-basiskwaliteit-landschap",
    title: "Basiskwaliteit landschap & biodiversiteit in {city}",
    subtitle:
      "De landschappelijke en ecologische basiskwaliteit per landschapstype",
    intro:
      "Deze Lochem-specifieke kaart beoordeelt **{count} gebieden** op hun **basiskwaliteit landschap** en **basiskwaliteit biodiversiteit**. Elk vlak hoort bij een landschapstype — van het oude hoevenlandschap en de essen tot beekdalen en heideontginningen — en krijgt een kwaliteitsoordeel (goed, matig, onvoldoende/slecht). Zo zie je waar het landschap en de natuurwaarde sterk staan en waar ze onder druk staan.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebieden in beeld", type: "count" },
          {
            label: "Landschapstypen",
            type: "distinct",
            property: "landschapstype",
          },
          {
            label: "Landschap 'goed' (aandeel)",
            type: "count-where",
            property: "basiskwaliteit_landschap",
            equals: "goed",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Landschapstypen in {city}",
        description: "Veld landschapstype: het karakter van elk gebied",
        property: "landschapstype",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Basiskwaliteit biodiversiteit",
        description:
          "Veld basiskwaliteit_biodiversiteit: oordeel per gebied (goed / matig / slecht)",
        property: "basiskwaliteit_biodiversiteit",
        valueLabels: {
          goed: "Goed",
          matig: "Matig",
          slecht: "Slecht",
        },
      },
    ],
    sections: [
      {
        heading: "Wat is 'basiskwaliteit'?",
        body: "Basiskwaliteit natuur en landschap gaat over de *gewone* natuur en het *alledaagse* landschap buiten de beschermde natuurgebieden — de sloten, houtwallen, bermen en akkerranden waar biodiversiteit óók van afhankelijk is. De kaart beoordeelt per landschapstype hoe goed die basiskwaliteit op orde is. In {city} is het **oude hoevenlandschap** het meest voorkomende type, gevolgd door dorpsgebieden en heideontginningen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Omgevingsvisie**: basiskwaliteit is een leidend principe geworden in provinciaal en gemeentelijk natuur- en landschapsbeleid.\n- **Gerichte inzet**: gebieden met een oordeel *matig* of *onvoldoende* laten zien waar herstel (aanleg van landschapselementen, extensiever beheer) het meeste oplevert.\n- **Ruimtelijke afweging**: het beschermt landschappelijke waarden bij ontwikkelingen als woningbouw of energieopwekking.",
      },
      {
        heading: "Over de bron",
        body: "De kaart is opgesteld door Datalab Gelderland Oost specifiek voor {city}. Een deel van de vlakken (met name bebouwing) heeft nog geen kwaliteitsoordeel; die tellen niet mee in de kwaliteitsgrafieken. De oordelen zijn een expertmatige duiding en geen wettelijke status.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "Basiskwaliteit natuur (Vogelbescherming)",
        url: "https://www.vogelbescherming.nl/basiskwaliteit",
      },
    ],
  },
  {
    layerId: "lch-bomen-referentie",
    title: "Bomen in {city}",
    subtitle:
      "Het referentiebestand van de gemeentelijke bomen (beheer CirculusBeheer)",
    intro:
      "Deze laag toont de gemeentelijke **bomen van {city}** uit het beheerbestand van CirculusBeheer, de beheerder van de publieke ruimte. Er zijn **{count} bomen** in beeld; het volledige bestand telt tienduizenden bomen, dus standaard wordt een deel geladen (zie *Over de bron*). Per boom zijn de soort (Nederlands en Latijn), de hoogteklasse en de stamdiameter geregistreerd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bomen in beeld", type: "count" },
          {
            label: "Boomsoorten (NL-naam)",
            type: "distinct",
            property: "nederlands",
          },
          {
            label: "Botanische soorten (Latijn)",
            type: "distinct",
            property: "latijn",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende boomsoorten in {city}",
        description:
          "Veld nederlands: de Nederlandse soortnaam per geregistreerde boom",
        property: "nederlands",
        maxCategories: 10,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één geregistreerde gemeentelijke boom langs wegen, in plantsoenen en op pleinen. Het bestand vormt de basis voor het bomenbeheer: onderhoud, vervanging en de monitoring van soortenrijkdom. Het aantal **verschillende soorten** is een indicator voor de veerkracht van het bomenbestand — een gevarieerd bestand is minder kwetsbaar voor ziekten en plagen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaat & hitte**: bomen leveren schaduw en verkoeling; de kroonbedekking is een sleutelfactor tegen hittestress in de bebouwde kom.\n- **Biodiversiteit**: een diverse soortensamenstelling (te zien aan het aantal soorten) draagt bij aan een robuust groen netwerk.\n- **Beheer & veiligheid**: hoogte en stamdiameter helpen bij het inschatten van onderhoud, snoei en veiligheidsrisico's.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit het beheersysteem van CirculusBeheer (referentiebestand 2026). Omdat het volledige bestand zeer groot is, laadt de kaart standaard een deel van de bomen (`{count}`); de statistieken en soortenverdeling gaan dus over de geladen selectie in de kaartuitsnede, niet per se over alle bomen van {city}. Zoom in of laad de volledige laag voor een compleet beeld.",
      },
    ],
    links: [
      { label: "CirculusBeheer", url: "https://www.circulus.nl/" },
      { label: "Gemeente Lochem", url: "https://www.lochem.nl/" },
    ],
  },
  {
    layerId: "lch-bomen-snoeiplanning",
    title: "Snoeiplanning bomen in {city}",
    subtitle: "Welke gemeentelijke bomen op de publieke snoeiplanning staan",
    intro:
      "Deze laag toont de **{count} bomen** in {city} die op de publieke snoeiplanning van CirculusBeheer staan. Het is een puur operationele beheerlaag: hij markeert wélke bomen zijn ingepland voor snoei, zodat inwoners en aannemers kunnen zien waar en wanneer er wordt gewerkt. Klik op een boom om te zien of hij in de planning zit.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Ingeplande bomen in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een boom die is opgenomen in de snoeiplanning. Anders dan het referentiebestand bevat deze publieke laag bewust **geen** boomkenmerken (soort, hoogte): het gaat alleen om de vraag *welke* bomen aan de beurt zijn. Het aantal ingeplande bomen in beeld geeft een indruk van de snoeiopgave in dit deel van {city}.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Transparantie**: inwoners kunnen zien of de boom voor hun deur op de planning staat.\n- **Beheerlast**: het aantal ingeplande bomen zegt iets over de onderhoudsopgave in een gebied.\n- **Veiligheid & doorstroming**: tijdige snoei voorkomt overhangende takken boven wegen en fietspaden.",
      },
      {
        heading: "Over de bron",
        body: "De planning is afkomstig van CirculusBeheer (snoeiplanning 2025, publieke versie). Het is een momentopname van de planning; uitgevoerde of doorgeschoven snoeibeurten kunnen afwijken. Omdat de laag geen inhoudelijke kenmerken bevat, tonen we alleen het aantal ingeplande bomen in de kaartuitsnede.",
      },
    ],
    links: [
      { label: "CirculusBeheer", url: "https://www.circulus.nl/" },
      { label: "Gemeente Lochem", url: "https://www.lochem.nl/" },
    ],
  },
  {
    layerId: "lch-groen-per-buurt",
    title: "Groen per buurt rond {city}",
    subtitle:
      "Percentage groen, boomkroon en verharding per buurt (DLGO9)",
    intro:
      "Deze laag kleurt **{count} buurten** in de DLGO9-regio (oost-Gelderland, inclusief {city}) op hun **percentage groen**. Voor elke buurt is uit Top10NL en de BGT berekend hoeveel van het oppervlak groen, boomkroon of verharding (grijs) is. Zo zie je welke buurten groen en koel zijn en welke juist versteend — waardevolle input voor klimaatadaptatie en leefbaarheid.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gemiddeld % groen",
            type: "avg",
            property: "PercentageGroen",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Gemiddeld % boomkroon",
            type: "avg",
            property: "PercentageBoom",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Gemiddeld % grijs",
            type: "avg",
            property: "PercentageGrijs",
            unit: "%",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het groenpercentage per buurt",
        description:
          "Veld PercentageGroen: aandeel groen per buurt in de regio rond {city}",
        property: "PercentageGroen",
        unit: "%",
        bins: 8,
      },
      {
        kind: "category-bar",
        title: "Buurten naar stedelijkheidsklasse",
        description:
          "Veld stedelijkheidsklasse: van niet-stedelijk tot zwaar stedelijk",
        property: "stedelijkheidsklasse",
        maxCategories: 5,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elke buurt is het oppervlak opgedeeld naar functie (openbaar, privaat, bebouwing, water) en naar groen versus grijs. **PercentageGroen** vat samen hoeveel van de buurt groen is; **PercentageBoom** telt specifiek de boomkroonbedekking. Landelijke buurten scoren doorgaans hoog op groen, terwijl dichtbebouwde kernen meer verharding hebben — de stedelijkheidsklasse helpt die vergelijking eerlijk te maken.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hittestress**: groen en boomkronen verkoelen; buurten met weinig groen warmen sneller op.\n- **Wateropvang**: groen laat regenwater infiltreren en ontlast het riool bij hoosbuien.\n- **Leefbaarheid & gezondheid**: nabij groen hangt samen met meer bewegen, ontmoeten en welzijn — een expliciet doel in veel omgevingsvisies.",
      },
      {
        heading: "Over de bron",
        body: "De berekening is van Datalab Gelderland Oost en beslaat de hele DLGO9-regio; naast {city} zitten er dus buurten van buurgemeenten in de statistieken (het veld *Gemeente* geeft uitsluitsel). De percentages zijn afgeleid uit landsdekkende topografie en gaan over de buurt als geheel — binnen een buurt kunnen straten sterk verschillen.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "BGT — Basisregistratie Grootschalige Topografie",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
    ],
  },
  {
    layerId: "lch-groene-ontwikkelingszones",
    title: "Groene Ontwikkelingszones bij {city}",
    subtitle:
      "Provinciale corridors voor uitbreiding van het natuurnetwerk (DLGO9)",
    intro:
      "Deze laag toont de door de provincie Gelderland aangewezen **Groene Ontwikkelingszones** (GO) in de regio rond {city}. Het zijn gebieden — vaak landbouwgrond met natuurwaarden — die als *ontwikkelzone* rond het beschermde Gelders Natuurnetwerk (GNN) liggen. Ze vormen de schakels en buffers waarmee het natuurnetwerk in de toekomst kan worden versterkt en verbonden. In beeld: **{count} zone(s)**.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "GO-zones in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De GO is een groot, aaneengesloten beleidsvlak: de laag bestaat daarom uit enkele omvangrijke zones in plaats van veel kleine objecten. Waar het GNN de *bestaande* beschermde natuur bevat, wijst de GO de gebieden aan waar natuur en landschap versterkt mogen worden — bijvoorbeeld door aanleg van landschapselementen, natuurvriendelijke oevers of ecologische verbindingen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Natuurnetwerk**: de GO is het instrument om versnipperde natuur te verbinden tot een robuust netwerk.\n- **Ruimtelijke ordening**: binnen de GO geldt het *nee, tenzij*-achtige regime met de eis dat kernkwaliteiten niet significant worden aangetast; het is dus een harde randvoorwaarde bij ontwikkelingen.\n- **Kansen voor boeren**: agrariërs in de GO kunnen meedoen aan natuurbeheer en groenblauwe diensten.",
      },
      {
        heading: "Over de bron",
        body: "De begrenzing komt uit het provinciale beleid (Omgevingsverordening Gelderland), via Datalab Gelderland Oost als DLGO9-brede laag. De zones beslaan de hele regio en zijn niet tot {city} bijgesneden; het beeld toont dus de context waarin {city} ligt. Voor de juridisch geldende begrenzing is de provinciale verordening leidend.",
      },
    ],
    links: [
      {
        label: "Gelders Natuurnetwerk & Groene Ontwikkelingszone",
        url: "https://www.gelderland.nl/themas/natuur-en-landschap/gelders-natuurnetwerk",
      },
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
    ],
  },
  {
    layerId: "lch-nationaal-landschap",
    title: "Nationaal Landschap rond {city}",
    subtitle:
      "Nationaal-landschapsgebied buiten GNN en GO (DLGO9)",
    intro:
      "Deze laag toont het deel van de aangewezen **Nationale Landschappen** in oost-Gelderland dat buiten het Gelders Natuurnetwerk (GNN) en de Groene Ontwikkelingszones (GO) valt. Het gaat om waardevolle cultuurlandschappen — met hun karakteristieke verkaveling, houtwallen en oude bebouwingspatronen — die om hun landschappelijke kwaliteit worden beschermd. In beeld: **{count} gebied(en)**.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Gebieden in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het Nationaal Landschap is een groot, samenhangend gebied; deze laag toont het als enkele grote vlakken die de bredere regio rond {city} beslaan. Bewust is hier alléén het deel opgenomen dat *niet* al onder de bescherming van GNN of GO valt — zo vult deze laag die natuurkaarten aan tot een compleet beeld van beschermd landschap.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Landschapskwaliteit**: de kernkwaliteiten (openheid, kleinschaligheid, cultuurhistorie) zijn richtinggevend bij ruimtelijke plannen.\n- **Toerisme & recreatie**: het karakteristieke landschap is een belangrijke trekker voor recreatie in de Achterhoek.\n- **Afwegingskader**: bij ingrepen als woningbouw, wegen of energieopwekking weegt de landschappelijke waarde expliciet mee.",
      },
      {
        heading: "Over de bron",
        body: "De begrenzing komt via Datalab Gelderland Oost als DLGO9-brede laag en is niet tot {city} bijgesneden. De aanduiding *Nationaal Landschap* stamt uit eerder rijksbeleid en wordt inmiddels via provinciaal beleid geborgd; raadpleeg de provinciale omgevingsvisie voor de actuele status.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "Provincie Gelderland — landschap",
        url: "https://www.gelderland.nl/themas/natuur-en-landschap",
      },
    ],
  },
  {
    layerId: "lch-speel-sport-locaties",
    title: "Speel- en sportplekken en hittestress in {city}",
    subtitle:
      "Speel- en sportlocaties met hun gemeten hittestressniveau",
    intro:
      "Deze laag combineert de **speel- en sportplekken** van {city} met een **hittestress**-analyse: per locatie is bepaald hoe warm het er op een hete dag wordt. Er zijn **{count} plekken** in beeld, van schoolpleinen en speeltuinen tot sportvelden. Zo zie je waar kinderen en sporters bij hitte in de knel komen — en waar schaduw en groen het hardst nodig zijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Plekken in beeld", type: "count" },
          { label: "Plaatsen", type: "distinct", property: "Plaats" },
          {
            label: "Extreme hittestress (aandeel)",
            type: "count-where",
            property: "Stressniveau",
            equals: [
              "extreme hittestress niveau 1",
              "extreme hittestress niveau 2",
            ],
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Type speel- en sportplekken in {city}",
        description: "Veld type: het soort locatie",
        property: "type",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Hittestressniveau van de plekken",
        description:
          "Veld Stressniveau: gemeten hittebelasting per locatie",
        property: "Stressniveau",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke plek is beoordeeld op hittestress, oplopend van *matige hittestress* tot *extreme hittestress niveau 1 en 2*. Een open sportveld of versteend schoolplein zonder bomen loopt bij hitte snel op; een speelplek onder een boomgroep blijft koeler. Het veld *type* onderscheidt de functie (sportveld, speeltuin, schoolplein), *gewogen_score* geeft een genuanceerde onderliggende maat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezonde leefomgeving**: juist kinderen en sporters zijn kwetsbaar voor hitte; koele speel- en sportplekken zijn een concreet klimaatadaptatiedoel.\n- **Prioritering**: plekken met *extreme* hittestress zijn logische kandidaten voor vergroening, schaduwdoeken of bomen.\n- **Combineren**: leg deze laag naast 'Groen per buurt' of de schaduwkaart om te zien of ingrepen mogelijk zijn.",
      },
      {
        heading: "Over de bron",
        body: "De analyse is van Datalab Gelderland Oost, specifiek voor {city}. De laag is fijnmazig (veel losse gridvlakken per locatie), waardoor het volledige bestand groot is en de kaart standaard een deel laadt (`{count}` in beeld); statistieken gaan over die selectie. Het hittestressniveau is modelmatig bepaald en een indicatie, geen meting ter plekke.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "Klimaateffectatlas — hitte",
        url: "https://www.klimaateffectatlas.nl/nl/",
      },
    ],
  },

  // ═══════════════════════════════════════ OMGEVINGSFACTOREN
  {
    layerId: "lch-grijs-per-buurt",
    title: "Verharding per buurt rond {city}",
    subtitle:
      "Percentage grijs (verharding) per buurt, peiljaar 2020 (DLGO9)",
    intro:
      "Deze laag is het spiegelbeeld van 'Groen per buurt': hij toont per buurt het **percentage grijs** — verhard, versteend oppervlak zoals daken, wegen en bestrating. In beeld zijn **{count} buurten** in de DLGO9-regio (oost-Gelderland, inclusief {city}), naar peiljaar 2020. Hoe hoger het grijspercentage, hoe meer een buurt is versteend en hoe gevoeliger voor hitte en wateroverlast.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gemiddeld % grijs",
            type: "avg",
            property: "PercentageGrijs",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Gemiddeld % groen",
            type: "avg",
            property: "PercentageGroen",
            unit: "%",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het verhardingspercentage per buurt",
        description:
          "Veld PercentageGrijs: aandeel verhard oppervlak per buurt",
        property: "PercentageGrijs",
        unit: "%",
        bins: 8,
      },
      {
        kind: "category-bar",
        title: "Buurten per gemeente (regio rond {city})",
        description:
          "Veld GM_NAAM: de gemeente waarin de buurt ligt binnen de DLGO9-regio",
        property: "GM_NAAM",
        maxCategories: 9,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elke buurt is bepaald welk deel van het oppervlak *grijs* is: verhard en waterdicht. Dichtbebouwde kernen scoren hoog, landelijke buurten laag. Doordat groen en grijs samen (met water) het oppervlak vullen, hangt een hoog grijspercentage vrijwel altijd samen met weinig groen — de twee grafieken van deze en de groenlaag vertellen dus complementaire verhalen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Wateroverlast**: verhard oppervlak laat regen niet infiltreren; bij hoosbuien belandt alles in het riool. Ontstenen (\"tegel eruit, plant erin\") vermindert die druk.\n- **Hitte**: verharding houdt warmte vast en versterkt het hitte-eilandeffect.\n- **Operatie Steenbreek**: het grijspercentage is een meetbare indicator om vergroeningsdoelen op te hangen.",
      },
      {
        heading: "Over de bron",
        body: "De data is van Datalab Gelderland Oost, peiljaar 2020, en beslaat de hele DLGO9-regio — {city} is één van de negen gemeenten in de grafiek per gemeente. Het is een momentopname; recente vergroening of nieuwbouw sinds 2020 is nog niet verwerkt. Het veld met laag-inkomens-percentage bevat plaatselijk een ontbrekende-waarde-markering en is hier niet gebruikt.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      { label: "Operatie Steenbreek", url: "https://www.steenbreek.nl/" },
    ],
  },
  {
    layerId: "lch-schaduw-fiets-wandel",
    title: "Schaduw langs fiets- en wandelroutes bij {city}",
    subtitle:
      "Totaalpercentage schaduw per wegsegment (DLGO9)",
    intro:
      "Deze laag laat zien hoeveel **schaduw** er op fiets- en wandelwegen valt. Voor elk klein wegsegment in de DLGO9-regio (oost-Gelderland, inclusief {city}) is berekend welk deel over een dag beschaduwd is. In beeld zijn **{count} segmenten**. Schaduwrijke routes blijven op hete dagen aangenaam begaanbaar; kale routes worden juist gemeden — belangrijke kennis voor klimaatbestendige mobiliteit.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegsegmenten in beeld", type: "count" },
          {
            label: "Gemiddeld % schaduw",
            type: "avg",
            property: "Ptot_schad",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Best beschaduwde segment",
            type: "max",
            property: "Ptot_schad",
            unit: "%",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het schaduwpercentage",
        description:
          "Veld Ptot_schad: aandeel schaduw per fiets-/wandelwegsegment",
        property: "Ptot_schad",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk lijnstukje is een klein segment fiets- of wandelweg met een berekend schaduwpercentage — van 0% (volledig in de zon) tot bijna 100% (vrijwel geheel beschaduwd, bijvoorbeeld door een bomenlaan). De histogram toont hoe de segmenten over die schaal verdeeld zijn: een piek links betekent veel onbeschaduwde routes, een piek rechts juist veel groen overdekte paden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptieve mobiliteit**: schaduwrijke routes stimuleren fietsen en lopen op warme dagen en horen bij een 'koele' hoofdfietsstructuur.\n- **Prioritering**: langdurig onbeschaduwde, veelgebruikte routes zijn logische plekken om bomen bij te planten.\n- **Gezondheid**: schaduw beperkt hittebelasting en UV-blootstelling, wat vooral voor ouderen en kinderen telt.",
      },
      {
        heading: "Over de bron",
        body: "De schaduwberekening is van Datalab Gelderland Oost (DLGO9-breed). Doordat de laag zeer fijnmazig is (tienduizenden korte segmenten in de hele regio), laadt de kaart standaard een deel ervan (`{count}` in beeld); de statistieken gaan over die selectie in de kaartuitsnede. Schaduw is modelmatig bepaald op basis van boomhoogte en zonstand en is een benadering.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "Klimaateffectatlas — hitte",
        url: "https://www.klimaateffectatlas.nl/nl/",
      },
    ],
  },

  // ═══════════════════════════════════════ GEBOUWEN & INFRA
  {
    layerId: "lch-plannen-woningen",
    title: "Woningbouwplannen in {city}",
    subtitle:
      "Openbaar bekende plannen vanaf 25 wooneenheden",
    intro:
      "Deze laag toont de **openbaar bekende woningbouwplannen** in {city} van 25 wooneenheden of meer. In beeld: **{count} plannen**. Per plan zijn onder meer het aantal te bouwen woningen, het plantype (uitleg, verdichting, transformatie), de planologische status en het verwachte opleveringsjaar geregistreerd. Samen geven ze een beeld van waar en hoe {city} de komende jaren groeit.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Plannen in beeld", type: "count" },
          {
            label: "Woningen totaal (gepland)",
            type: "sum",
            property: "totaal_bouw",
            decimals: 0,
          },
          {
            label: "Gemiddeld per plan",
            type: "avg",
            property: "totaal_bouw",
            unit: "won.",
            decimals: 0,
          },
          {
            label: "Grootste plan",
            type: "max",
            property: "totaal_bouw",
            unit: "won.",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Woningbouwplannen naar type in {city}",
        description:
          "Veld plantype: de aard van het plan (uitleg, verdichting, transformatie…)",
        property: "plantype",
        maxCategories: 7,
      },
      {
        kind: "category-bar",
        title: "Planologische status",
        description:
          "Veld status_planologisch: hoe hard het plan planologisch is",
        property: "status_planologisch",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een woningbouwlocatie. Het **plantype** vertelt hóe er gebouwd wordt: *uitleg* (nieuwe wijk aan de rand), *verdichting* of *transformatie* (bouwen in bestaand gebied, bijvoorbeeld een pand herbestemmen). De **planologische status** geeft de hardheid aan — van *onherroepelijk* (juridisch rond) tot plannen die nog in procedure zijn. Het totaal aantal geplande woningen is de optelsom van het veld *totaal_bouw*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woningbouwopgave**: de plannen laten zien of {city} op koers ligt met de regionale en provinciale woningbouwafspraken.\n- **Hardheid**: alleen onherroepelijke en vastgestelde plannen zijn zeker; zachtere plannen kunnen nog wijzigen of vertragen.\n- **Type stad**: het aandeel verdichting en transformatie versus uitleg zegt iets over de keuze tussen inbreiden en uitbreiden.",
      },
      {
        heading: "Over de bron",
        body: "De plannen komen via Datalab Gelderland Oost en betreffen openbaar bekende plannen vanaf 25 woningen; kleinere of nog vertrouwelijke plannen ontbreken. Het is een momentopname — aantallen, status en opleverjaren kunnen tussentijds veranderen. Voor harde afspraken gelden de vastgestelde bestemmings-/omgevingsplannen.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      { label: "Gemeente Lochem — wonen", url: "https://www.lochem.nl/" },
    ],
  },
  {
    layerId: "lch-wrij-transportleidingriool",
    title: "Rioolpersleidingen rond {city}",
    subtitle:
      "Bovengemeentelijke transportleidingen van Waterschap Rijn en IJssel",
    intro:
      "Deze laag toont de **transportleidingen** (persleidingen) van Waterschap Rijn en IJssel in de regio rond {city}: het bovengemeentelijke rioolnetwerk dat afvalwater van de gemeentelijke stelsels naar de rioolwaterzuivering transporteert. In beeld zijn **{count} leidingsegmenten**. Per leiding zijn de binnen- en buitendiameter, de drukklasse en het aanlegjaar geregistreerd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Leidingsegmenten in beeld", type: "count" },
          {
            label: "Unieke leidingen (ZATIDENT)",
            type: "distinct",
            property: "ZATIDENT",
          },
          {
            label: "Gemiddelde binnendiameter",
            type: "avg",
            property: "IWS_DIAMETERBINNEN",
            unit: "mm",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van leidingdiameters rond {city}",
        description:
          "Veld IWS_DIAMETERBINNEN: binnendiameter van de persleiding in mm",
        property: "IWS_DIAMETERBINNEN",
        unit: "mm",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een segment van een rioolpersleiding in beheer bij het waterschap. Dit is *transport*-infrastructuur: geen huisaansluitingen, maar de dikke hoofdaders die het rioolwater onder druk naar de zuivering brengen. De **diameter** zegt iets over de capaciteit; grote leidingen verwerken het water van hele kernen of clusters van gemeenten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ondergrond & graafwerk**: bij bouw- en graafwerkzaamheden is de ligging van deze leidingen cruciaal om schade en storingen te voorkomen.\n- **Capaciteit & klimaat**: bij toenemende neerslag en verstedelijking speelt de vraag of het transportstelsel voldoende capaciteit houdt.\n- **Ketenbeheer**: gemeente en waterschap stemmen het gemeentelijke riool en dit transportnet op elkaar af.",
      },
      {
        heading: "Over de bron",
        body: "De data komt van Waterschap Rijn en IJssel via Datalab Gelderland Oost en beslaat de regio (niet alleen {city}). Veel technische velden (medium, soort, drukklasse) zijn als numerieke codes vastgelegd zonder publieke sleutel; we tonen daarom vooral de fysiek interpreteerbare kenmerken zoals diameter en het aantal segmenten. Voor exacte ligging en eigenschappen is het waterschap de bronhouder.",
      },
    ],
    links: [
      {
        label: "Waterschap Rijn en IJssel",
        url: "https://www.wrij.nl/",
      },
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
    ],
  },

  // ═══════════════════════════════════════ VERKEER & LOGISTIEK
  {
    layerId: "lch-plannen-verkeer",
    title: "Verkeersplannen in {city}",
    subtitle:
      "Aangekondigde verkeers- en infraprojecten, peildatum maart 2025",
    intro:
      "Deze laag toont de **aangekondigde verkeers- en infrastructuurprojecten** in {city} met peildatum maart 2025. In beeld zijn **{count} projecten** — van wegreconstructies en fietsvoorzieningen tot verkeersveiligheidsmaatregelen. Per project zijn de plaats, de planning, de status (wens, voorbereiding, uitvoering) en het startjaar geregistreerd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Projecten in beeld", type: "count" },
          { label: "Kernen/plaatsen", type: "distinct", property: "Plaatsnaam" },
          {
            label: "In uitvoering",
            type: "count-where",
            property: "status",
            equals: "uitvoering",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Verkeersprojecten naar status in {city}",
        description: "Veld status: fase van het project",
        property: "status",
        valueLabels: {
          wens: "Wens",
          voorbereiding: "In voorbereiding",
          uitvoering: "In uitvoering",
        },
      },
      {
        kind: "category-bar",
        title: "Projecten per kern",
        description: "Veld Plaatsnaam: de kern waar het project ligt",
        property: "Plaatsnaam",
        maxCategories: 9,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip of lijn is een gepland verkeersproject. De **status** laat de fase zien: van een *wens* (nog niet zeker) via *voorbereiding* naar *uitvoering* (er wordt gewerkt). De spreiding over de kernen — Lochem-stad, Gorssel, Eefde, Barchem en de kleinere dorpen — toont waar de verkeersaandacht ligt. Het veld *BudgetOK* geeft aan of er dekking is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid & veiligheid**: de projecten laten zien waar {city} knelpunten aanpakt.\n- **Afstemming**: bewoners en ondernemers kunnen anticiperen op werkzaamheden en omleidingen.\n- **Voortgang**: de verhouding tussen *wens*, *voorbereiding* en *uitvoering* geeft een gevoel voor hoe hard de plannen zijn.",
      },
      {
        heading: "Over de bron",
        body: "De projectenlijst is via Datalab Gelderland Oost ontsloten, met peildatum maart 2025. Het is een momentopname: sindsdien kunnen projecten zijn opgeschoven, afgerond of toegevoegd. Voor de actuele stand is de gemeente de bron.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      { label: "Gemeente Lochem — verkeer", url: "https://www.lochem.nl/" },
    ],
  },

  // ═══════════════════════════════════════ VEILIGHEID
  {
    layerId: "lch-zuiderenk-wateroverlast-begaanbaarheid",
    title: "Wateroverlast Zuiderenk — begaanbaarheid van straten",
    subtitle:
      "Hoe begaanbaar blijven straten in de wijk Zuiderenk bij hevige neerslag?",
    intro:
      "Deze laag toont voor de wijk **Zuiderenk** in {city} welke straten begaanbaar blijven bij een extreme bui. In beeld zijn **{count} wegsegmenten**, elk geclassificeerd als *begaanbaar*, *alleen voor calamiteitenverkeer* of *onbegaanbaar*. Het is de uitkomst van een wateroverlast-analyse voor een zware neerslaggebeurtenis en laat zien waar het water de doorgang belemmert.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegsegmenten in beeld", type: "count" },
          {
            label: "Onbegaanbaar",
            type: "count-where",
            property: "BEGAANBAAR",
            equals: "Onbegaanbaar",
          },
          {
            label: "Alleen calamiteitenverkeer",
            type: "count-where",
            property: "BEGAANBAAR",
            equals: "Begaanbaar voor calamiteitenverkeer",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Begaanbaarheid van straten bij hevige neerslag",
        description:
          "Veld BEGAANBAAR: doorgang per wegsegment tijdens de modelbui",
        property: "BEGAANBAAR",
        valueLabels: {
          Begaanbaar: "Begaanbaar",
          "Begaanbaar voor calamiteitenverkeer": "Alleen calamiteitenverkeer",
          Onbegaanbaar: "Onbegaanbaar",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk lijnstuk is een wegsegment met een begaanbaarheidsoordeel bij een zware bui. *Begaanbaar* betekent dat het water laag genoeg blijft voor normaal verkeer; *alleen voor calamiteitenverkeer* dat enkel hulpdiensten er nog doorheen kunnen; *onbegaanbaar* dat de straat tijdelijk onbruikbaar is. Zo wordt zichtbaar of hulpdiensten en bewoners bij extreme neerslag nog van en naar hun woning kunnen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid noodhulp**: onbegaanbare straten kunnen ambulance en brandweer vertragen — een direct veiligheidsrisico.\n- **Gericht ontwerpen**: de analyse wijst de knelpunten aan waar waterberging, afvoer of drempels het meeste effect hebben.\n- **Bewustwording**: bewoners in Zuiderenk zien wat een extreme bui voor hun straat betekent.",
      },
      {
        heading: "Over de bron",
        body: "De analyse (van Datalab Gelderland Oost) is gemaakt voor de wijk Zuiderenk op basis van een gemodelleerde extreme neerslaggebeurtenis (rond een T100-bui). De uitkomsten zijn modelresultaten: de werkelijke overlast hangt af van de precieze bui, verstoppingen en lokale omstandigheden. De laag beslaat alleen deze wijk, niet heel {city}.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "Klimaateffectatlas — wateroverlast",
        url: "https://www.klimaateffectatlas.nl/nl/",
      },
    ],
  },
  {
    layerId: "lch-zuiderenk-wateroverlast-panden",
    title: "Wateroverlast Zuiderenk — risicopanden",
    subtitle:
      "Panden met verhoogd risico op wateroverlast bij hevige neerslag",
    intro:
      "Deze laag toont de **panden** in de wijk **Zuiderenk** ({city}) en de bijbehorende waterstand bij een extreme bui. In beeld zijn **{count} panden**, elk met een berekende waterhoogte rond het pand (*WP_WATERHO*): positief betekent water bóven maaiveld tegen de gevel, negatief dat het water lager dan het maaiveld blijft. Zo wordt zichtbaar waar water tegen of in gebouwen kan komen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Panden in beeld", type: "count" },
          {
            label: "Hoogste waterstand bij pand",
            type: "max",
            property: "WP_WATERHO",
            unit: "m",
            decimals: 2,
          },
          {
            label: "Mediane waterstand",
            type: "median",
            property: "WP_WATERHO",
            unit: "m",
            decimals: 2,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de waterstand rond panden in Zuiderenk",
        description:
          "Veld WP_WATERHO: waterhoogte t.o.v. maaiveld bij het pand (m); positief = water tegen de gevel",
        property: "WP_WATERHO",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een pand met een gemodelleerde waterhoogte bij een zware bui. De meeste panden houden het water onder maaiveld (negatieve of nul-waarde), maar bij een deel staat het water tegen de gevel (positieve waarde) — dat zijn de risicopanden waar water naar binnen kan lopen. De histogram laat de verdeling zien: hoe verder naar rechts, hoe meer water tegen het pand.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Schaderisico**: panden met water tegen de gevel lopen risico op vocht- en waterschade in kruipruimte, begane grond of kelder.\n- **Maatwerk**: de kaart maakt gerichte maatregelen mogelijk — drempels, aangepaste dorpels, afkoppelen of ophogen van het maaiveld.\n- **Communicatie**: bewoners kunnen hun eigen pand terugvinden en zelf voorzorgen treffen.",
      },
      {
        heading: "Over de bron",
        body: "De analyse is van Datalab Gelderland Oost voor de wijk Zuiderenk, op basis van een gemodelleerde extreme bui. De waterhoogtes zijn modelresultaten en een indicatie; de werkelijke situatie hangt af van de precieze bui en lokale factoren. De laag beslaat alleen deze wijk, niet heel {city}.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "Klimaateffectatlas — wateroverlast",
        url: "https://www.klimaateffectatlas.nl/nl/",
      },
    ],
  },
  {
    layerId: "lch-kwetsbare-funderingen",
    title: "Kwetsbare funderingen rond {city}",
    subtitle:
      "Postcodegebieden met verhoogd risico op funderingsschade (DLGO9)",
    intro:
      "Deze laag toont per postcodegebied (PC6) het **risico op funderingsschade** in de regio rond {city}. In beeld zijn **{count} gebieden**. Het risico is afgeleid uit het aandeel panden dat vóór 1970 is gebouwd — die hebben vaker een houten of ondiepe fundering die gevoelig is voor veranderingen in de grondwaterstand — gecombineerd met de bodemgesteldheid.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Postcodegebieden in beeld", type: "count" },
          {
            label: "Gemiddeld % bouw vóór 1970",
            type: "avg",
            property: "percvoor1970",
            unit: "%",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kwetsbaarheidsklasse per postcodegebied",
        description:
          "Veld legenda: kwetsbaar versus stedelijk gebied, naar aandeel oude bouw",
        property: "legenda",
        maxCategories: 10,
      },
      {
        kind: "histogram",
        title: "Aandeel panden gebouwd vóór 1970",
        description:
          "Veld percvoor1970: percentage vooroorlogse/naoorlogse bouw per postcodegebied",
        property: "percvoor1970",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een postcodegebied (PC6) met een kwetsbaarheidsoordeel. De *legenda* onderscheidt **kwetsbaar gebied** (waar de bodem beperkte draagkracht heeft) van **stedelijk gebied**, telkens met de klasse van het aandeel oude bebouwing (0-20% tot 80-100%). Hoe meer oude panden op een gevoelige bodem, hoe groter de kans op funderingsproblemen bij een dalende of sterk wisselende grondwaterstand.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Funderingsschade**: houten paalfunderingen kunnen bij droogval van het grondwater gaan rotten (paalrot); dat is kostbaar en ingrijpend voor eigenaren.\n- **Grondwaterbeleid**: de kaart helpt om peilbeheer en verdrogingsmaatregelen af te stemmen op kwetsbare gebieden.\n- **Vroeg signaleren**: eigenaren in een kwetsbaar gebied kunnen tijdig onderzoek doen voordat schade optreedt.",
      },
      {
        heading: "Over de bron",
        body: "De laag is een DLGO9-brede analyse van Datalab Gelderland Oost en beslaat de hele regio; naast {city} zitten er postcodegebieden van buurgemeenten in (velden *GEMEENTE*/*WOONPLAATS* geven uitsluitsel). Omdat de laag fijnmazig is, kan de kaart standaard een deel laden. Het is een risico-indicatie op gebiedsniveau — geen uitspraak over een individuele woning; daarvoor blijft funderingsonderzoek nodig.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "Kenniscentrum Aanpak Funderingsproblematiek (KCAF)",
        url: "https://www.kcaf.nl/",
      },
    ],
  },

  // ═══════════════════════════════════════ SOCIAAL-ECONOMISCH
  {
    layerId: "lch-kwetsbare-inwoners",
    title: "Gebouwen met kwetsbare gebruikers rond {city}",
    subtitle:
      "Panden met de meest kwetsbare gebruiksfuncties (peildatum dec. 2025, DLGO9)",
    intro:
      "Deze laag toont **gebouwen met kwetsbare gebruikers** in de regio rond {city} — panden waar zich mensen bevinden die bij een calamiteit (brand, overstroming, hitte) extra hulp nodig hebben. In beeld zijn **{count} gebouwen**. Per gebouw is de *meest kwetsbare gebruiksfunctie* bepaald: van gezondheidszorg en onderwijs tot bijeenkomst- en woonfuncties.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebouwen in beeld", type: "count" },
          {
            label: "Gezondheidszorg",
            type: "count-where",
            property: "meest_kwetsbare_gebruiksfunctie",
            equals: "gezondheidszorgfunctie",
          },
          {
            label: "Onderwijs",
            type: "count-where",
            property: "meest_kwetsbare_gebruiksfunctie",
            equals: "onderwijsfunctie",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Gebouwen naar meest kwetsbare gebruiksfunctie",
        description:
          "Veld meest_kwetsbare_gebruiksfunctie: de zwaarst wegende functie per pand",
        property: "meest_kwetsbare_gebruiksfunctie",
        valueLabels: {
          woonfunctie: "Wonen",
          onderwijsfunctie: "Onderwijs",
          gezondheidszorgfunctie: "Gezondheidszorg",
          bijeenkomstfunctie: "Bijeenkomst",
          celfunctie: "Cel",
          kantoorfunctie: "Kantoor",
          logiesfunctie: "Logies",
          winkelfunctie: "Winkel",
        },
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gebouw met een gebruiksfunctie die als kwetsbaar geldt. De classificatie kijkt naar wie er verblijft: in een **gezondheidszorg**-functie (zorginstelling) of **onderwijs**-functie (school, kinderopvang) zijn mensen aanwezig die zichzelf bij een calamiteit minder goed in veiligheid kunnen brengen. Het veld *meest_kwetsbare_gebruiksfunctie* kiest per gebouw de zwaarst wegende functie als een pand meerdere functies heeft.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Rampenbestrijding**: hulpdiensten en gemeente kunnen deze gebouwen prioriteren in evacuatie- en risicoplannen.\n- **Klimaatadaptatie**: bij hitte- en wateroverlastrisico's verdienen locaties met kwetsbare gebruikers extra aandacht.\n- **Ruimtelijke afweging**: bij risicovolle activiteiten in de omgeving weegt de nabijheid van kwetsbare functies mee.",
      },
      {
        heading: "Over de bron",
        body: "De laag is samengesteld door Datalab Gelderland Oost (peildatum december 2025) op basis van de BAG-gebruiksdoeleinden, en beslaat de hele DLGO9-regio — dus ook gebouwen buiten {city}. De indeling volgt de gebruiksfuncties uit de basisregistraties; een actuele of afwijkende feitelijke situatie is niet altijd verwerkt.",
      },
    ],
    links: [
      { label: "Datalab Gelderland Oost", url: "https://www.datalabgo.nl/" },
      {
        label: "BAG — Basisregistratie Adressen en Gebouwen",
        url: "https://www.kadaster.nl/zakelijk/registraties/basisregistraties/bag",
      },
    ],
  },
];
