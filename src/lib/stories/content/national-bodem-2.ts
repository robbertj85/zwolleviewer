/**
 * Story maps — batch "national-bodem-2": de BOG-uitbreiding van 2026-08-31.
 *
 * Nationale vectorlagen (bodemdata.nl WFS): bro-bodemkaart, bro-geomorfologie,
 * bro-grondwaterspiegeldiepte, bro-bodemkundig-belang.
 * Nationale PFAS-lagen (RIVM Atlas Leefomgeving WFS): rivm-pfas-bodemmonsters,
 * rivm-pfas-meetlocaties.
 * Nationale WMS-rasters (BRO via PDOK): bro-cpt, bro-bhr-p, bro-bhr-g,
 * bro-bhr-gt, bro-sfr, bro-sad, bro-sld, bro-epc, ahn-dtm.
 * Provinciaal Zuid-Holland: zh-* (12 lagen).
 *
 * Let op: de WMS-lagen dragen geen feature-data, dus die verhalen hebben
 * bewust een lege `charts`-lijst — alle cijfers zouden anders 0 zijn.
 */

import type { StoryDefinition } from "../types";

/** Leesbare labels bij de hoofdklasseletter uit `withMainClass`. */
const BODEM_HOOFDKLASSE_LABELS: Record<string, string> = {
  V: "Veengronden",
  W: "Moerige gronden",
  H: "Humuspodzolgronden",
  Y: "Moderpodzolgronden",
  Z: "Zandgronden",
  E: "Enkeerdgronden",
  M: "Zeekleigronden",
  R: "Rivierkleigronden",
  S: "Kalkhoudende vlakvaaggronden",
  K: "Keileem / potklei",
  L: "Leemgronden",
  A: "Associaties & bijzondere vlakken",
};

export const stories: StoryDefinition[] = [
  // ─── Nationale vectorlagen — bodemdata.nl ────────────────────────
  {
    layerId: "bro-bodemkaart",
    title: "De bodem onder {city}",
    subtitle: "Bodemkaart van Nederland 1:50.000 uit de Basisregistratie Ondergrond",
    intro:
      "Onder {city} liggen **{count} bodemvlakken** uit de landelijke Bodemkaart 1:50.000. Elk vlak draagt een bodemcode zoals *aVz* of *cHn21*: een compacte beschrijving van wat je aantreft als je een kuil graaft. De kaart is gekleurd op **hoofdklasse** — de eerste hoofdletter in de code, die zegt of je met veen, zand, klei of podzol te maken hebt. Klik op een vlak voor de volledige bodemnaam.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          { label: "Hoofdklassen", type: "distinct", property: "bodemhoofdklasse" },
          { label: "Unieke bodemcodes", type: "distinct", property: "soilcode" },
          {
            label: "Veengrond (aandeel)",
            type: "count-where",
            property: "bodemhoofdklasse",
            equals: "V",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemvlakken per hoofdklasse in {city}",
        description:
          "De eerste hoofdletter van de bodemcode bepaalt de hoofdklasse van de grond",
        property: "bodemhoofdklasse",
        maxCategories: 8,
        valueLabels: BODEM_HOOFDKLASSE_LABELS,
      },
    ],
    sections: [
      {
        heading: "Hoe lees je een bodemcode?",
        body: "Een code als **aVz** bestaat uit drie delen. De kleine letter vooraan is een *prefix* die iets over de bovengrond zegt. De **hoofdletter** in het midden is de hoofdklasse: `V` voor veen, `Z` voor zand, `M` voor zeeklei, `R` voor rivierklei, `H` en `Y` voor podzolgronden, `E` voor enkeerdgronden. Wat erna komt beschrijft de ondergrond en de textuur. *aVz* is dus een madeveengrond op zand — veen dat op zandondergrond ligt.\n\nDe kaart kleurt op die middelste letter, want die bepaalt het gedrag van de grond: draagkracht, waterhuishouding en gevoeligheid voor daling.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bodemdaling**: veen- en moerige gronden klinken in en oxideren zodra ze droogvallen. Waar `V` of `W` op de kaart staat, is daling een structureel thema — met gevolgen voor funderingen, riolering en wegen.\n- **Bouwen en funderen**: zandgronden dragen, veen en slappe klei niet. De bodemkaart is de eerste indicatie vóór er ook maar één sondering wordt gezet.\n- **Water**: de bodemopbouw bepaalt hoe snel regenwater infiltreert en hoe diep het grondwater staat.\n- **Groen en landbouw**: bodemtype stuurt welke beplanting het doet en hoe droogtegevoelig een gebied is.",
      },
      {
        heading: "Over de bron",
        body: "De Bodemkaart van Nederland 1:50.000 wordt door Wageningen Environmental Research beheerd en is sinds 2022 een registratieobject van de Basisregistratie Ondergrond (BRO). Deze laag komt uit de WFS van bodemdata.nl, versie 2025. De kaart is gekarteerd op schaal 1:50.000 — bruikbaar op wijkniveau, maar niet voor uitspraken over één perceel. Daarvoor zijn boringen (BHR-P) of sonderingen (CPT) nodig.",
      },
    ],
    links: [
      { label: "Bodemdata.nl — Bodemkaart", url: "https://bodemdata.nl/basiskaarten/bodem/bodemkaart" },
      { label: "BRO: Bodemkaart (SGM)", url: "https://basisregistratieondergrond.nl/inhoud-bro/registratieobjecten/" },
    ],
  },
  {
    layerId: "bro-geomorfologie",
    title: "Het landschap van {city} en hoe het ontstond",
    subtitle: "Geomorfologische kaart van Nederland 1:50.000 (BRO GMM)",
    intro:
      "De geomorfologische kaart toont **{count} landvormen** in het kaartgebied van {city}. Waar de bodemkaart beschrijft *waaruit* de grond bestaat, beschrijft deze kaart *welke vorm* het landschap heeft en *hoe die is ontstaan*: door de zee, een rivier, de wind, ijs of de mens. Elk vlak heeft een reliëfcode, een genesecode en een landvormgroep.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Landvormen in beeld", type: "count" },
          { label: "Landvormgroepen", type: "distinct", property: "landform_subgroup_code" },
          { label: "Genesetypen", type: "distinct", property: "genese_code" },
          {
            label: "Actief vormend proces",
            type: "count-where",
            property: "active_process",
            equals: "ja",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Landvormen per reliëfklasse in {city}",
        description: "Reliëfcode: de mate van hoogteverschil binnen het vlak",
        property: "relief_code",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Geomorfologie gaat over de vorm van het landschap en het proces dat die vorm maakte. Een dekzandrug, een rivierduin, een kreekrug, een stuwwal, een uiterwaard of een opgehoogd stadsdeel zijn allemaal landvormen met een eigen ontstaansgeschiedenis.\n\nHet veld *active_process* zegt of het vormende proces vandaag nog werkt. In het rivierengebied en langs de kust staat dat vaak op *ja*; in het binnenland is het landschap meestal een fossiel product van de laatste ijstijd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Archeologie**: hogere, droge landvormen — dekzandruggen, rivierduinen, kreekruggen — zijn precies de plekken waar mensen zich vestigden. Geomorfologie is daarom een van de sterkste voorspellers voor archeologische verwachting.\n- **Water**: laagtes, oude geulen en kommen zijn de plekken waar water zich verzamelt bij hoosbuien.\n- **Landschapsontwerp**: de onderliggende landvorm verklaart waarom een gebied is zoals het is — waardevolle context bij inrichtingsvraagstukken.",
      },
      {
        heading: "Over de bron",
        body: "De Geomorfologische Kaart van Nederland (GMM) is een gezamenlijk product van Wageningen Environmental Research en TNO, en sinds kort een BRO-registratieobject. Deze laag komt uit de WFS van bodemdata.nl, versie 2025.",
      },
    ],
    links: [
      {
        label: "Bodemdata.nl — Geomorfologische kaart",
        url: "https://bodemdata.nl/basiskaarten/geomorfologie/geomorfologische-kaart",
      },
    ],
  },
  {
    layerId: "bro-grondwaterspiegeldiepte",
    title: "Hoe diep staat het grondwater in {city}?",
    subtitle: "Waarnemingen onder het BRO-model Grondwaterspiegeldiepte (WDM)",
    intro:
      "In het kaartgebied van {city} liggen **{count} waarnemingspunten** van het model Grondwaterspiegeldiepte. Dit model vertaalt losse peilbuismetingen naar een landsdekkend beeld van de gemiddeld hoogste (GHG) en gemiddeld laagste grondwaterstand (GLG) — en daarmee naar de klassieke *grondwatertrap*. De punten hieronder zijn de waarnemingen waarop dat model steunt; ze zijn gekleurd op gemeten diepte.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Waarnemingen in beeld", type: "count" },
          { label: "Gemiddelde diepte", type: "avg", property: "depth", unit: "cm", decimals: 0 },
          { label: "Ondiepste", type: "min", property: "depth", unit: "cm", decimals: 0 },
          { label: "Diepste", type: "max", property: "depth", unit: "cm", decimals: 0 },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de gemeten grondwaterdiepte in {city}",
        description: "Diepte beneden maaiveld per waarneming",
        property: "depth",
        unit: "cm",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "GHG, GLG en grondwatertrap",
        body: "De **GHG** is de gemiddeld hoogste grondwaterstand — het natte uiterste in de winter. De **GLG** is de gemiddeld laagste, het droge uiterste aan het eind van de zomer. Samen vormen ze de *grondwatertrap*: een klasse-indeling van I (permanent zeer nat) tot VIII (diep en droog).\n\nDie combinatie is bepalender dan één momentopname. Een gebied met een hoge GHG én een lage GLG heeft een grote jaarlijkse fluctuatie — en dat is juist de situatie waarin houten paalfunderingen droogvallen en gaan rotten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Funderingen**: houten palen moeten permanent onder water staan. Een dalende GLG is een direct funderingsrisico.\n- **Wateroverlast**: een hoge GHG betekent weinig bergingsruimte in de bodem — regen blijft op straat staan.\n- **Verdroging en groen**: bomen en natuur zijn afhankelijk van de zomerstand; een zakkende GLG betekent droogtestress.\n- **Ontwateringsdiepte**: het verschil tussen maaiveld en grondwaterstand bepaalt of kelders, kabels en leidingen droog blijven.",
      },
      {
        heading: "Over de bron",
        body: "Het model Grondwaterspiegeldiepte (WDM) is een BRO-registratieobject, ontwikkeld door TNO en Wageningen Environmental Research. Deze laag toont de onderliggende waarnemingen via de WFS van bodemdata.nl. Voor actuele, doorlopende metingen zie de laag *Grondwaterstandonderzoek (BRO)*.",
      },
    ],
    links: [
      { label: "Bodemdata.nl — Grondwatertrappen", url: "https://bodemdata.nl/basiskaarten/grondwater/gt-modus" },
    ],
  },
  {
    layerId: "bro-bodemkundig-belang",
    title: "Vergraven en bijzondere gronden in {city}",
    subtitle: "Gebieden van bodemkundig belang uit de BRO",
    intro:
      "Deze laag markeert **{count} gebieden** in {city} waar de bodem afwijkt van het normale beeld: sterk afgegraven, opgehoogd, vergraven of juist bodemkundig bijzonder waardevol. Op de Bodemkaart zelf krijgen deze vlakken vaak geen betekenisvolle bodemcode — hier staat wél wat er aan de hand is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebieden in beeld", type: "count" },
          { label: "Typen", type: "distinct", property: "pedologicalinterest" },
        ],
      },
      {
        kind: "category-bar",
        title: "Gebieden naar bodemkundig belang in {city}",
        property: "pedologicalinterest",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Nederland is voor een groot deel een gemaakt landschap. Zandwinning, afgraving voor kleiwinning, ophoging voor bouwrijp maken, vergraving bij ruilverkaveling — allemaal ingrepen die de natuurlijke bodemopbouw hebben gewist. Deze laag legt vast wáár dat gebeurd is.\n\nDe keerzijde: sommige gebieden zijn juist aangemerkt omdat de bodemopbouw er uitzonderlijk gaaf of zeldzaam is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Betrouwbaarheid van de bodemkaart**: in vergraven gebieden zegt de bodemcode weinig over wat je feitelijk aantreft. Hier is aanvullend onderzoek nodig.\n- **Ophogingen en zettingen**: opgehoogde terreinen zetten na. Dat verklaart scheefstand en verzakkingen in relatief nieuwe wijken.\n- **Bodemkwaliteit**: opgehoogd terrein is historisch nogal eens opgehoogd met puin, slib of stadsafval — een aanknopingspunt voor bodemonderzoek.",
      },
    ],
    links: [{ label: "Bodemdata.nl", url: "https://bodemdata.nl/" }],
  },

  // ─── Nationale PFAS-lagen — RIVM ─────────────────────────────────
  {
    layerId: "rivm-pfas-bodemmonsters",
    title: "PFAS in de bodem rond {city}",
    subtitle: "Bodemmonsters uit het landelijke PFAS-achtergrondwaardenonderzoek (RIVM)",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} bodemmonsters** uit het landelijke PFAS-onderzoek van het RIVM. Let op de schaal: dit is een **meetnet**, geen dekkende kaart. Landelijk gaat het om ruim 6.000 monsters, dus per gemeente blijven er meestal maar een handvol punten over. Elk punt draagt wel een volledige analyse: som-PFOS, som-PFOA en tientallen losse PFAS-verbindingen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Monsters in beeld", type: "count" },
          { label: "Gem. som-PFOS", type: "avg", property: "som_pfos", unit: "µg/kg", decimals: 2 },
          { label: "Gem. som-PFOA", type: "avg", property: "som_pfoa", unit: "µg/kg", decimals: 2 },
          { label: "Hoogste som-PFOS", type: "max", property: "som_pfos", unit: "µg/kg", decimals: 2 },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van som-PFOS in de monsters rond {city}",
        property: "som_pfos",
        unit: "µg/kg",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zijn PFAS?",
        body: "PFAS is een verzamelnaam voor duizenden door de mens gemaakte fluorverbindingen, gebruikt in blusschuim, antiaanbaklagen, waterafstotende coatings en industriële processen. Ze breken vrijwel niet af — vandaar de bijnaam *forever chemicals* — en hopen zich op in bodem, water en het menselijk lichaam.\n\nPFOS en PFOA zijn de twee bekendste en inmiddels verboden varianten. Omdat ze zo persistent zijn, zijn ze intussen overal in Nederland in de bodem aantoonbaar, ook ver van elke bron.",
      },
      {
        heading: "Achtergrondwaarde versus verontreiniging",
        body: "Dit onderzoek is opgezet om de **achtergrondwaarde** te bepalen: het niveau dat je overal aantreft zonder specifieke bron. Die waarde is de referentie waartegen een lokale meting wordt afgezet — pas als een meting daar duidelijk bovenuit komt, is er sprake van een verontreiniging die om actie vraagt.\n\nDe monsters zijn daarom bewust gekozen op plekken zónder bekende bron. Het veld *afst_chemo* geeft aan hoe ver een locatie van de dichtstbijzijnde chemiebron ligt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Grondverzet**: sinds het handelingskader PFAS moet bij hergebruik van grond op PFAS worden getoetst. De achtergrondwaarden bepalen wat toelaatbaar is.\n- **Bouwprojecten**: PFAS-normen kunnen grondstromen stilleggen en de kosten van een project fors beïnvloeden.\n- **Gezondheid en drinkwater**: PFAS in de bodem kan doorwerken naar grondwater en daarmee naar drinkwaterwinning.",
      },
      {
        heading: "Over de bron",
        body: "Het RIVM voerde dit onderzoek uit in opdracht van het ministerie van Infrastructuur en Waterstaat; de resultaten zijn in 2020 gepubliceerd en worden via Atlas Leefomgeving als open data ontsloten. Omdat het om een landelijk meetnet gaat, zegt het aantal punten in {city} niets over de PFAS-situatie ter plaatse — daarvoor is lokaal bodemonderzoek nodig.",
      },
    ],
    links: [
      { label: "Atlas Leefomgeving — PFAS", url: "https://www.atlasleefomgeving.nl/kaarten" },
      { label: "RIVM over PFAS", url: "https://www.rivm.nl/pfas" },
    ],
  },
  {
    layerId: "rivm-pfas-meetlocaties",
    title: "PFAS-meetlocaties rond {city}",
    subtitle: "Bemonsteringspunten van het landelijke achtergrondwaardenonderzoek",
    intro:
      "Deze laag toont **{count} meetlocaties** van het PFAS-achtergrondwaardenonderzoek binnen het kaartgebied van {city}. Waar de monsterlaag de gemeten concentraties bevat, gaat het hier om de locaties zelf: bodemtype, landgebruik, bemonsteringsdiepte en de afstand tot de dichtstbijzijnde chemiebron. Landelijk zijn het 652 locaties, dus per gemeente enkele punten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetlocaties in beeld", type: "count" },
          { label: "Bodemtypen", type: "distinct", property: "bodemtype" },
          { label: "Vormen van landgebruik", type: "distinct", property: "landgebrui" },
        ],
      },
      {
        kind: "category-bar",
        title: "Meetlocaties naar landgebruik",
        property: "landgebrui",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Meetlocaties naar bodemtype",
        property: "bodemtype",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Waarom bodemtype en landgebruik meetellen",
        body: "PFAS hecht zich verschillend aan verschillende gronden. Organische stof en klei binden de verbindingen sterker dan schoon zand, waardoor dezelfde belasting in een veengrond een andere gemeten waarde oplevert dan in een zandgrond. Het RIVM heeft daarom bewust over bodemtypen en vormen van landgebruik gespreid bemonsterd.\n\nHet veld *diepteprof* onderscheidt toplaag en ondergrond: PFAS komt van bovenaf en zit daarom doorgaans het hoogst in de bovenste decimeters.",
      },
      {
        heading: "Over de bron",
        body: "Deze locaties horen bij hetzelfde RIVM-onderzoek als de laag *PFAS in bodem — monsterwaarden*; zet beide aan om locatiekenmerken en gemeten waarden naast elkaar te zien.",
      },
    ],
    links: [{ label: "Atlas Leefomgeving", url: "https://www.atlasleefomgeving.nl/kaarten" }],
  },

  // ─── Nationale BRO WMS-rasters ───────────────────────────────────
  // Geen feature-data beschikbaar; bewust zonder charts.
  {
    layerId: "bro-cpt",
    title: "Sonderingen onder {city}",
    subtitle: "Geotechnisch sondeeronderzoek (CPT) uit de Basisregistratie Ondergrond",
    intro:
      "Een **sondering** is de meest gebruikte manier om te weten te komen wat er onder je voeten zit. Een stalen conus wordt met constante snelheid de grond in gedrukt; de weerstand op de punt en de wrijving langs de mantel worden continu gemeten. Uit die twee grootheden volgt laag voor laag welke grondsoort je passeert en hoe draagkrachtig die is.\n\nDeze laag toont het landelijke CPT-bestand als kaartbeeld. Klik op een sondering voor het BRO-ID, de einddiepte, de bronhouder en de gemeten parameters.",
    charts: [],
    sections: [
      {
        heading: "Waarom als kaartbeeld en niet als features?",
        body: "De BRO ontsluit CPT alleen via een WMS-kaartservice; er is geen WFS of OGC API waarmee de app losse punten kan ophalen. Het volledige bestand is ruim 6 GB — te groot om in de browser te laden. Daarom rendert deze laag als kaartbeeld van de bron, en worden de gegevens per aangeklikte sondering opgehaald.\n\nDaardoor toont deze laag geen aantallen en kun je hem niet op waarde kleuren; de opaciteitsregelaar werkt wel gewoon.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Funderingsadvies**: de conusweerstand bepaalt op welke diepte een paal draagt. Zonder sondering geen funderingsberekening.\n- **Bodemdaling en zetting**: slappe lagen zijn direct zichtbaar in het sondeerprofiel.\n- **Kabels, leidingen en riolering**: de haalbaarheid van boringen en sleuven hangt af van de grondopbouw.\n- **Hergebruik van bestaand onderzoek**: het BRO-doel is dat een sondering die ooit ergens is uitgevoerd, nooit meer opnieuw hoeft.",
      },
      {
        heading: "Over de bron",
        body: "Sinds 2018 zijn overheden verplicht sonderingen aan de BRO te leveren. Daardoor is dit een van de dichtste geotechnische meetnetten ter wereld. De onderliggende meetreeksen zijn per sondering op te vragen via DINOloket of het BRO-loket.",
      },
    ],
    links: [
      { label: "DINOloket — ondergrondgegevens", url: "https://www.dinoloket.nl/ondergrondgegevens" },
      { label: "Basisregistratie Ondergrond", url: "https://basisregistratieondergrond.nl" },
    ],
  },
  {
    layerId: "bro-bhr-p",
    title: "Bodemkundige boringen in {city}",
    subtitle: "Bodemkundig booronderzoek (BHR-P) uit de BRO",
    intro:
      "Dit zijn de **veldwaarnemingen onder de Bodemkaart**. Een bodemkundige boring is handwerk: een grondboor wordt tot ongeveer anderhalve meter de grond in gedraaid en de karteerder beschrijft laag voor laag textuur, kleur, organische stof en roestvlekken. Uit duizenden van die beschrijvingen is de Bodemkaart van Nederland samengesteld.\n\nZet deze laag samen met *De bodem onder {city}* aan om te zien op welke waarnemingen de vlakken op de bodemkaart daadwerkelijk rusten.",
    charts: [],
    sections: [
      {
        heading: "Boring, sondering of wandonderzoek?",
        body: "- Een **bodemkundige boring** (BHR-P) beschrijft de bovenste ~1,5 m met het oog op bodemvorming: waar zit de humus, waar begint het zand, hoe hoog komt het grondwater.\n- Een **sondering** (CPT) meet mechanische weerstand tot tientallen meters diep en gaat over draagkracht.\n- Een **wandonderzoek** (SFR) beschrijft een verticale ontgravingswand — een compleet profiel in één blik, maar alleen waar toevallig gegraven wordt.\n\nDrie technieken, drie vragen. Samen vormen ze de BRO-kennis over de ondiepe ondergrond.",
      },
      {
        heading: "Over de bron",
        body: "BHR-P wordt beheerd door Wageningen Environmental Research en is als WMS-kaartbeeld via PDOK beschikbaar. Klik op een boring voor de kenset-gegevens.",
      },
    ],
    links: [{ label: "DINOloket", url: "https://www.dinoloket.nl/ondergrondgegevens" }],
  },
  {
    layerId: "bro-bhr-g",
    title: "Geologische boringen onder {city}",
    subtitle: "Geologisch booronderzoek (BHR-G) uit de BRO",
    intro:
      "Waar de bodemkundige boring in de bovenste meter blijft, gaat de **geologische boring** door tot de diepere opeenvolging van afzettingen: dekzand, rivierklei, veenpakketten, mariene lagen, tot in het Pleistoceen. Elke boring is een verticale doorsnede door de geschiedenis van het landschap — tienduizenden jaren afzetting in één beschrijving.",
    charts: [],
    sections: [
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ondergrondmodellen**: DGM, REGIS II en GeoTOP zijn geïnterpoleerd uit precies deze boringen. Wie de betrouwbaarheid van zo'n model wil beoordelen, kijkt naar de dichtheid van boringen in de buurt.\n- **Grondwater**: welke lagen water doorlaten en welke afsluiten volgt rechtstreeks uit de geologische opbouw.\n- **Bodemenergie en geothermie**: de haalbaarheid van een WKO of aardwarmteproject staat of valt met de aanwezigheid van een watervoerend pakket op de juiste diepte.",
      },
      {
        heading: "Over de bron",
        body: "BHR-G wordt beheerd door TNO Geologische Dienst Nederland en via PDOK als WMS ontsloten. Volledige boorbeschrijvingen zijn opvraagbaar via DINOloket.",
      },
    ],
    links: [{ label: "DINOloket", url: "https://www.dinoloket.nl/ondergrondgegevens" }],
  },
  {
    layerId: "bro-bhr-gt",
    title: "Geotechnische boringen in {city}",
    subtitle: "Boormonsterbeschrijving en -analyse (BHR-GT) uit de BRO",
    intro:
      "Bij een **geotechnische boring** wordt niet alleen beschreven wat er in de grond zit, maar worden ook monsters meegenomen naar het laboratorium. Daar worden korrelverdeling, watergehalte, volumegewicht en sterkte-eigenschappen bepaald — de getallen die een constructeur nodig heeft om een fundering door te rekenen.",
    charts: [],
    sections: [
      {
        heading: "Aanvulling op de sondering",
        body: "Een sondering meet continu maar indirect: uit weerstand wordt de grondsoort *afgeleid*. Een geotechnische boring levert het echte materiaal en dus harde laboratoriumwaarden, maar alleen op de bemonsterde dieptes.\n\nIn de praktijk worden ze gecombineerd: veel sonderingen voor het beeld in de breedte, enkele boringen om dat beeld te ijken.",
      },
      {
        heading: "Over de bron",
        body: "BHR-GT is een BRO-registratieobject en wordt via PDOK als WMS ontsloten. Klik op een boring voor de kenset.",
      },
    ],
    links: [{ label: "Basisregistratie Ondergrond", url: "https://basisregistratieondergrond.nl" }],
  },
  {
    layerId: "bro-sfr",
    title: "Wandonderzoek in {city}",
    subtitle: "Bodemkundig wandonderzoek (SFR) uit de BRO",
    intro:
      "Bij **wandonderzoek** wordt een bestaande ontgravingswand — een bouwput, een sleuf, een afgraving — schoongemaakt en van boven tot onder beschreven. Je ziet het profiel in één blik, inclusief de overgangen tussen lagen die je met een grondboor makkelijk mist.\n\nLandelijk is dit nog een dunne set: wandonderzoek kan alleen waar toevallig gegraven wordt, en de aanlevering aan de BRO is recent op gang gekomen. Grote kans dat er in {city} nog niets te zien is.",
    charts: [],
    sections: [
      {
        heading: "Waarom is dit relevant?",
        body: "Een wand toont de ruimtelijke samenhang die een boring niet kan laten zien: hellende laagvlakken, oude geulen, grondsporen, verstoringen door de mens. Voor archeologie en bodemkunde is dat waardevolle informatie — juist omdat een boring maar één verticale prik is.",
      },
      {
        heading: "Over de bron",
        body: "SFR is een van de nieuwere BRO-registratieobjecten. Beheer ligt bij Wageningen Environmental Research; ontsluiting gaat via PDOK als WMS.",
      },
    ],
    links: [{ label: "Basisregistratie Ondergrond", url: "https://basisregistratieondergrond.nl" }],
  },
  {
    layerId: "bro-sad",
    title: "Bodemonderzoek en verontreiniging in {city}",
    subtitle: "Milieuhygiënisch bodemonderzoek (SAD) uit de BRO",
    intro:
      "Deze laag toont **milieuhygiënische bodemonderzoeken**: onderzoekslocaties en meetpunten waar de bodem op verontreiniging is onderzocht. Tot voor kort was dit type gegevens versnipperd over gemeenten, provincies en omgevingsdiensten, elk met een eigen viewer. Sinds de opname in de BRO is er voor het eerst één landelijke, uniforme ontsluiting.\n\nDe aanlevering door bronhouders loopt nog. De dekking verschilt daardoor sterk per gemeente: in de ene stad staat het vol met meetpunten, in de andere is de kaart nog leeg.",
    charts: [],
    sections: [
      {
        heading: "Wat betekent een onderzoekslocatie?",
        body: "Een punt op deze kaart betekent dat er **onderzocht is** — niet dat er verontreiniging is. Bodemonderzoek wordt standaard uitgevoerd bij bouwprojecten, grondtransacties, herinrichtingen en bij bedrijfsbeëindiging. Verreweg de meeste onderzoeken tonen aan dat er niets aan de hand is.\n\nOmgekeerd geldt: waar geen punt staat, is niet aangetoond dat de bodem schoon is — daar is simpelweg (nog) niet gekeken, of is het onderzoek nog niet aangeleverd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hergebruik van onderzoek**: het kernidee van de BRO is dat eerder uitgevoerd onderzoek vindbaar en herbruikbaar is. Dat scheelt tijd en geld bij elk volgend project.\n- **Grondtransacties**: bij aankoop van grond is bekende bodeminformatie direct relevant voor prijs en risico.\n- **Gezonde leefomgeving**: lood, PAK's en asbest in stedelijke bodem zijn een gezondheidsthema, vooral bij moestuinen en speelplekken.",
      },
      {
        heading: "Over de bron",
        body: "SAD is een BRO-registratieobject dat via PDOK als WMS wordt ontsloten. Klik op een meetpunt voor het type onderzoek, de datum en de einddiepte. Voor gemeenten met een eigen bodemloket — zoals Zwolle, Amsterdam en Rotterdam — staan er in deze app ook gemeentelijke bodemlagen met meer detail.",
      },
    ],
    links: [
      { label: "Basisregistratie Ondergrond", url: "https://basisregistratieondergrond.nl" },
      { label: "Bodemloket", url: "https://www.bodemloket.nl/" },
    ],
  },
  {
    layerId: "bro-sld",
    title: "Besluiten over bodemverontreiniging in {city}",
    subtitle: "Overheidsbesluit bodemverontreiniging (SLD) uit de BRO",
    intro:
      "Waar de laag *Milieuhygiënisch bodemonderzoek* laat zien waar gekeken is, gaat het hier om de **juridische uitkomst**: besluiten van het bevoegd gezag over verontreinigde locaties. De laag onderscheidt saneringslocaties, aangepakte gebieden en nazorggebieden — plekken waar na sanering blijvend beheer nodig is.\n\nDeze registratie is landelijk nog nauwelijks gevuld: het volledige bestand is enkele honderden kilobytes, tegenover ruim drie gigabyte voor de onderzoeken. Reken er dus op dat de kaart in de meeste gemeenten nog leeg is.",
    charts: [],
    sections: [
      {
        heading: "Sanering, beheersing en nazorg",
        body: "Niet elke verontreiniging wordt volledig verwijderd. Vaak is *isoleren, beheersen en controleren* de gekozen route: een leeflaag erover, monitoring van het grondwater, en beperkingen op wat er met het terrein mag gebeuren.\n\nEen **nazorggebied** is zo'n locatie: de verontreiniging zit er nog, maar is onder controle. Dat brengt langlopende verplichtingen mee — graafbeperkingen, monitoringsputten, periodieke rapportage.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke plannen**: een nazorglocatie legt beperkingen op aan herontwikkeling en grondroering.\n- **Kadastrale lasten**: besluiten over bodemverontreiniging kunnen aan een perceel kleven en de waarde beïnvloeden.\n- **Uitvoering**: wie gaat graven moet weten of er een besluit ligt — de sanctie op onwetendheid ligt bij de veroorzaker van de verspreiding.",
      },
    ],
    links: [{ label: "Basisregistratie Ondergrond", url: "https://basisregistratieondergrond.nl" }],
  },
  {
    layerId: "bro-epc",
    title: "De diepe ondergrond onder {city}",
    subtitle: "Mijnbouwconstructies (EPC) uit de BRO",
    intro:
      "Deze laag toont **mijnbouwconstructies**: boorgaten en constructies voor de winning van olie, gas, zout en aardwarmte, plus ondergrondse opslag. Waar de rest van de bodemlagen over de bovenste meters gaat, gaat het hier om honderden tot duizenden meters diepte.",
    charts: [],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een mijnbouwconstructie is meer dan een gat: het is een gestaalde, gecementeerde put met een vergunde levensduur, een eigenaar en een verplichte eindafwerking. De BRO registreert de ligging en de kenmerken; de vergunningen zelf (EPL) horen bij een ander registratieobject.\n\nOok afgesloten putten blijven geregistreerd — juist omdat ze bij toekomstige activiteiten in de diepe ondergrond meetellen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Aardwarmte**: bestaande boorgaten en de kennis eruit bepalen mede of geothermie op een locatie kansrijk is.\n- **Ondergrondse opslag**: waterstof, CO₂ en warmte concurreren om dezelfde diepe ruimte; bestaande constructies zijn daarbij zowel kans als beperking.\n- **Bodembeweging**: gas- en zoutwinning veroorzaken bodemdaling en soms bevingen, met gevolgen aan het maaiveld.",
      },
    ],
    links: [
      { label: "NLOG — Nederlandse olie- en gasportaal", url: "https://www.nlog.nl/" },
      { label: "Basisregistratie Ondergrond", url: "https://basisregistratieondergrond.nl" },
    ],
  },
  {
    layerId: "ahn-dtm",
    title: "De hoogtekaart van {city}",
    subtitle: "Actueel Hoogtebestand Nederland — maaiveld (DTM)",
    intro:
      "Het **Actueel Hoogtebestand Nederland** is een laserhoogtemeting van heel Nederland, ingewonnen vanuit een vliegtuig. Deze laag toont het *Digital Terrain Model*: de hoogte van het maaiveld, met gebouwen en bomen eruit gefilterd. Wat overblijft is het kale landschap — dijken, kades, oude geulen, terpen en ophogingen komen zo scherp in beeld als nergens anders.",
    charts: [],
    sections: [
      {
        heading: "DTM en DSM",
        body: "Het **DSM** (Digital Surface Model) meet het eerste wat de laser raakt: dus boomkruinen en daken. Het **DTM** filtert die weg en houdt het maaiveld over. Voor water, bodemdaling en archeologie wil je het DTM; voor zonpotentie en 3D-stadsmodellen juist het DSM.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Water**: waterstromen volgen de hoogtekaart. Waar water bij hoosbuien naartoe loopt, is uit het DTM af te leiden.\n- **Bodemdaling**: opeenvolgende AHN-versies naast elkaar leggen laat zien waar het maaiveld zakt.\n- **Archeologie**: het reliëf van grafheuvels, celtic fields, oude wegen en verdedigingswerken tekent zich in het DTM af terwijl je er in het veld overheen loopt zonder iets te zien.\n- **Drooglegging**: het verschil tussen maaiveld en waterpeil bepaalt of een gebied nat wordt.",
      },
      {
        heading: "Over de bron",
        body: "Het AHN wordt beheerd door Rijkswaterstaat, de waterschappen en de provincies. Deze laag toont de INSPIRE-geharmoniseerde WMS via PDOK. Dezelfde bron biedt ook een WCS die het echte hoogtegrid levert — daarmee zou de app in de toekomst een 3D-terreinweergave kunnen voeden.",
      },
    ],
    links: [
      { label: "AHN-viewer", url: "https://www.ahn.nl/ahn-viewer" },
      { label: "PDOK — Hoogte Nederland", url: "https://www.pdok.nl/datasets" },
    ],
  },

  // ─── Provinciaal Zuid-Holland ────────────────────────────────────
  {
    layerId: "zh-bodembeweging-totaal",
    title: "Hoe snel zakt {city}?",
    subtitle: "Gemeten bodembeweging in Zuid-Holland, in mm per jaar",
    intro:
      "Deze laag toont **{count} vlakken** met gemeten bodembeweging rond {city}, uitgedrukt in millimeters per jaar. Negatieve waarden betekenen daling. De metingen komen uit satellietinterferometrie: door radarbeelden van dezelfde plek over jaren te vergelijken, is beweging tot op millimeters nauwkeurig vast te stellen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetvlakken in beeld", type: "count" },
          { label: "Gemiddelde beweging", type: "avg", property: "velocity", unit: "mm/jr", decimals: 2 },
          { label: "Snelste daling", type: "min", property: "velocity", unit: "mm/jr", decimals: 2 },
          { label: "Grootste stijging", type: "max", property: "velocity", unit: "mm/jr", decimals: 2 },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de bodembeweging rond {city}",
        property: "velocity",
        unit: "mm/jr",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Diepe en ondiepe daling",
        body: "Bodemdaling heeft twee heel verschillende oorzaken die op deze kaart bij elkaar opgeteld zijn.\n\n**Ondiepe daling** speelt in de bovenste meters: veen dat oxideert zodra het droogvalt, en klei die inklinkt onder de last van ophogingen en bebouwing. Dit is de dominante oorzaak in het Groene Hart en de veenweidegebieden.\n\n**Diepe daling** komt van gas- en zoutwinning, kilometers onder het maaiveld. Die daling is gelijkmatiger en over een groter gebied verspreid.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Funderingsschade**: ongelijkmatige daling is de directe oorzaak van scheuren en scheefstand.\n- **Riolering en kabels**: leidingen die meezakken met de bodem terwijl aansluitingen op palen staan, breken.\n- **Waterbeheer**: dalend maaiveld betekent dat peilen mee omlaag moeten, wat de veenoxidatie weer versnelt — een vicieuze cirkel.\n- **CO₂**: oxiderend veen stoot koolstof uit; bodemdaling is daarmee ook een klimaatvraagstuk.",
      },
    ],
    links: [
      { label: "Bodemdalingskaart Nederland", url: "https://bodemdalingskaart.nl/" },
      { label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" },
    ],
  },
  {
    layerId: "zh-bodemdaling-veenoxidatie",
    title: "Veenoxidatie rond {city}",
    subtitle: "Signaleringskaart bodemdaling door oxiderend veen",
    intro:
      "Deze signaleringskaart geeft per gebied aan hoe sterk **veenoxidatie** bijdraagt aan bodemdaling. Zolang veen onder water staat, blijft het intact. Zodra het door peilverlaging in contact komt met zuurstof, verteert het — en verdwijnt letterlijk in de lucht.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebieden in beeld", type: "count" },
          { label: "Klassen", type: "distinct", property: "Klasse" },
        ],
      },
      {
        kind: "category-bar",
        title: "Gebieden per klasse veenoxidatie",
        property: "Klasse",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Het mechanisme",
        body: "Veen bestaat voor het grootste deel uit onverteerde plantenresten, geconserveerd door permanente natheid. Zakt de grondwaterstand, dan krijgen bacteriën toegang tot zuurstof en breken ze het organische materiaal af tot CO₂ en water. Het maaiveld zakt, waardoor de drooglegging opnieuw ontoereikend wordt en het peil verder omlaag moet — een zichzelf versterkend proces dat al eeuwen loopt.\n\nIn grote delen van het Zuid-Hollandse veenweidegebied ligt het maaiveld inmiddels meters lager dan bij ontginning.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaat**: oxiderend veen is in Nederland goed voor een aanzienlijke jaarlijkse CO₂-uitstoot.\n- **Waterpeilbeheer**: hogere peilen remmen de oxidatie maar botsen met landbouwgebruik.\n- **Bouwen**: op oxiderend veen zijn ophogingen en funderingen structureel duurder.",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
  {
    layerId: "zh-bodemdaling-totaal",
    title: "Bodemdaling rond {city} — het totaalbeeld",
    subtitle: "Signaleringskaart bodemdaling: veenoxidatie, zetting en draagkracht samengevat",
    intro:
      "Deze kaart brengt de losse signaleringskaarten samen tot **{count} gebieden** met een gecombineerd oordeel over bodemdaling. Veenoxidatie, zetting van slappe lagen en beperkte draagkracht zijn hier tot één klasse teruggebracht — bedoeld als eerste signaal in de vroege fase van ruimtelijke plannen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gebieden in beeld", type: "count" },
          { label: "Klassen", type: "distinct", property: "Klasse" },
        ],
      },
      {
        kind: "category-bar",
        title: "Gebieden per klasse bodemdaling",
        property: "Klasse",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Hoe gebruik je een signaleringskaart?",
        body: "Een signaleringskaart is bewust grof. Hij beantwoordt de vraag *moet ik hier alert zijn?* — niet *hoeveel zakt dit perceel?*. Valt een locatie in een hoge klasse, dan is dat aanleiding voor gericht onderzoek: sonderingen, zettingsberekeningen, een funderingsadvies.\n\nDe kracht zit in het moment: deze informatie is beschikbaar vóórdat een plan vastligt, wanneer bijsturen nog goedkoop is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Locatiekeuze**: bouwen op een slappe, dalende ondergrond kost over de levensduur aanzienlijk meer.\n- **Beheerkosten**: wegen en riolering in dalingsgevoelig gebied vragen vaker onderhoud.\n- **Klimaatadaptatie**: dalingsgevoelige gebieden overlappen sterk met gebieden die kwetsbaar zijn voor wateroverlast.",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
  {
    layerId: "zh-hbb-punten",
    title: "Verdachte locaties in {city}",
    subtitle: "Historisch Bodem Bestand: waar vroeger bodembedreigende activiteiten waren",
    intro:
      "Het **Historisch Bodem Bestand** is opgebouwd uit oude hinderwetvergunningen, bedrijvenregisters en historische kaarten. Elk van deze **{count} punten** markeert een plek waar ooit een activiteit plaatsvond die de bodem kan hebben belast: een smederij, een benzinepomp, een wasserij, een gasfabriek, een sloperij.\n\nEen punt betekent niet dat er verontreiniging is — het betekent dat er aanleiding is om te kijken.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Verdachte locaties in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Van archief naar kaart",
        body: "Het HBB is destijds samengesteld door systematisch archieven door te spitten: wie had waar een vergunning, en voor welke activiteit? Die gegevens zijn vervolgens gegeocodeerd op adres. Dat verklaart twee dingen: de precisie is die van een historisch adres, niet van een landmeting, en de dekking eindigt bij wat er in de archieven te vinden was.\n\nActiviteiten van vóór de vergunningplicht, of bedrijfjes die nooit vergund waren, staan er dus niet in.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bouwen en herontwikkelen**: het HBB is standaard de eerste stap in een historisch vooronderzoek volgens de NEN 5725.\n- **Grondtransacties**: een verdachte locatie in het HBB is reden voor bodemonderzoek vóór levering.\n- **Stedelijke transformatie**: juist de binnenstedelijke locaties die nu voor woningbouw in beeld komen, waren vroeger vaak bedrijfsterrein.",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
  {
    layerId: "zh-slootdempingen",
    title: "Gedempte sloten in {city}",
    subtitle: "Waar het slotenpatroon is verdwenen — en waarmee het is gedempt",
    intro:
      "Rond {city} zijn **{count} gedempte sloten** geregistreerd. Bij ruilverkavelingen en stadsuitbreidingen zijn in de twintigste eeuw op grote schaal sloten dichtgegooid. Waarmee dat gebeurde, varieert sterk: schone grond, maar even vaak bouwpuin, sloopafval of bagger.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Gedempte sloten in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Waarom een gedempte sloot een aandachtspunt is",
        body: "Twee redenen. **Bodemkwaliteit**: puin en sloopafval bevatten vaak asbest, PAK's en zware metalen. Bij graafwerk of herinrichting komt dat materiaal weer naar boven.\n\n**Draagkracht**: een dempingsvulling is nooit zo goed verdicht als gewassen grond. Daaroverheen bouwen leidt tot ongelijkmatige zetting — zichtbaar als een verzakkende strook dwars door een tuin, een weg of een gebouw.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Grondverzet**: bij ontgraving is de kans op verontreinigd materiaal reëel; dat vraagt om vooronderzoek en soms om aparte afvoer.\n- **Funderingsadvies**: de ligging van dempingen verklaart waarom zettingen zich soms in rechte lijnen door een gebied aftekenen.\n- **Historisch landschap**: het oude slotenpatroon is vaak de laatste zichtbare structuur van de middeleeuwse ontginning.",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
  {
    layerId: "zh-stortplaatsen-voormalig",
    title: "Voormalige stortplaatsen rond {city}",
    subtitle: "Waar vroeger afval de grond in ging — en wat er nu op staat",
    intro:
      "Rond {city} liggen **{count} voormalige stortplaatsen**. Tot ver in de twintigste eeuw was storten in een oude zandwinput, een kreek of gewoon een laagte de normale manier om afval kwijt te raken, doorgaans zonder onderafdichting. Veel van die terreinen hebben inmiddels een nieuwe functie gekregen: park, sportveld, bedrijventerrein, soms woningbouw.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Voormalige stortplaatsen", type: "count" },
          { label: "Vormen van huidig gebruik", type: "distinct", property: "Huidig_gebruik" },
        ],
      },
      {
        kind: "category-bar",
        title: "Voormalige stortplaatsen naar huidig gebruik",
        property: "Huidig_gebruik",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Waarom oude stortplaatsen blijven meetellen",
        body: "Een stort zonder onderafdichting laat percolaat door naar het grondwater — decennia lang. Daarnaast produceert organisch afval stortgas, voornamelijk methaan, dat zich ondergronds kan verplaatsen en in kelders of kruipruimtes kan ophopen.\n\nEn stortmateriaal zet in: het maaiveld boven een oude stort blijft ongelijkmatig zakken, soms nog tientallen jaren na sluiting.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Herontwikkeling**: bouwen op of naast een oude stort vraagt om onderzoek naar stortgas, percolaat en zetting.\n- **Nazorg**: bij sommige locaties gelden blijvende beheersmaatregelen en graafbeperkingen.\n- **Groen en recreatie**: veel oude storten zijn nu park — met beperkingen op diep wortelende beplanting en graafwerk.",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
  {
    layerId: "zh-stortlocaties-wm",
    title: "Stortplaatsen onder de Wet milieubeheer bij {city}",
    subtitle: "Vergunde stortlocaties met GLOBIS-registratie",
    intro:
      "Naast de historische stortplaatsen bestaan er **vergunde stortlocaties** onder de Wet milieubeheer: aangelegd met onderafdichting, drainage voor percolaat, gasonttrekking en een verplichte eeuwigdurende nazorg. Rond {city} zijn er **{count}** geregistreerd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stortlocaties in beeld", type: "count" },
          { label: "Soorten", type: "distinct", property: "SOORT" },
        ],
      },
      {
        kind: "category-bar",
        title: "Stortlocaties naar soort",
        property: "SOORT",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Het verschil met een oude stort",
        body: "Waar de historische stort een gat in de grond was, is een Wm-stortplaats een technische installatie: een afdichtende folie onderin, een drainagesysteem dat percolaat opvangt en afvoert naar een zuivering, gasonttrekking bovenin, en een afdeklaag als de stort vol is.\n\nDe provincie blijft na sluiting eeuwigdurend verantwoordelijk voor de nazorg. Daar staat een nazorgfonds tegenover, gevuld uit heffingen op het gestorte afval.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke plannen**: rond een stortplaats gelden hinderzones en beperkingen op gevoelige functies.\n- **Duurzame gebiedsontwikkeling**: afgedekte storten worden steeds vaker benut voor zonnevelden — een functie die verenigbaar is met de nazorg.\n- **Circulaire economie**: bij sommige oude storten wordt gekeken naar terugwinning van grondstoffen (*landfill mining*).",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
  {
    layerId: "zh-rioleringtraces",
    title: "De leeftijd van het riool in {city}",
    subtitle: "Signaleringskaart riolering: tracés met aanlegjaar en leeftijd",
    intro:
      "Deze laag toont **{count} rioleringstracés** rond {city}, elk met een aanlegjaar en een berekende leeftijd. Riolering is de grootste verborgen kapitaalgoederenvoorraad van een gemeente en gaat ongeveer zestig jaar mee. Waar het riool tegen die grens aanloopt, komt vervanging in zicht — en dat is een van de duurste opgaven op de gemeentelijke begroting.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Tracés in beeld", type: "count" },
          { label: "Gemiddelde leeftijd", type: "avg", property: "Leeftijd", unit: "jaar", decimals: 0 },
          { label: "Oudste tracé", type: "max", property: "Leeftijd", unit: "jaar", decimals: 0 },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de rioolleeftijd rond {city}",
        property: "Leeftijd",
        unit: "jaar",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Waarom leeftijd zo bepalend is",
        body: "De naoorlogse woningbouwgolf betekent dat grote delen van het Nederlandse riool ongeveer tegelijk zijn aangelegd — en dus ook ongeveer tegelijk vervangen moeten worden. Die golf komt de komende decennia aan.\n\nLeeftijd alleen is geen vonnis: de werkelijke conditie hangt af van materiaal, grondsoort, grondwaterstand en belasting. Een betonriool in stabiele zandgrond haalt makkelijk tachtig jaar; hetzelfde riool in zettingsgevoelig veen kan na veertig jaar al kapot zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Werk met werk maken**: rioolvervanging is het natuurlijke moment om de straat ook klimaatadaptief in te richten, warmtenetten aan te leggen of te vergroenen.\n- **Bodemdaling**: in dalingsgevoelig gebied verkort de levensduur aanzienlijk — daar overlappen deze kaart en de bodemdalingskaart elkaar niet toevallig.\n- **Begroting**: vervangingspieken zijn met deze data jaren vooruit te zien en te spreiden.",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
  {
    layerId: "zh-warmtedistributienet",
    title: "Warmtenetten rond {city}",
    subtitle: "Warmtetransport- en distributieleidingen met status, eigenaar en brontype",
    intro:
      "Deze laag toont de **warmteleidingen** rond {city}: transport- en distributienetten met hun status, eigenaar en het brontype waarop ze draaien. In Zuid-Holland ligt met WarmtelinQ en de Rotterdamse en Haagse netten een van de grootste warmte-infrastructuren van het land.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Leidingtracés in beeld", type: "count" },
          { label: "Brontypen", type: "distinct", property: "Brontype" },
          { label: "Eigenaren", type: "distinct", property: "Eigenaar" },
        ],
      },
      {
        kind: "category-bar",
        title: "Warmteleidingen naar status",
        property: "Status",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Waarom dit een ondergrondlaag is",
        body: "Een warmtenet is bovengronds onzichtbaar maar ondergronds fors: geïsoleerde stalen buizen met een aanzienlijke diameter, die ruimte opeisen in een ondergrond waar al riolering, water, gas, elektriciteit en telecom liggen.\n\nIn de stedelijke ondergrond is ruimte inmiddels een schaars goed. De warmtetransitie is daarom net zozeer een ondergrondse ordeningsopgave als een energievraagstuk.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Warmtetransitie**: de ligging van bestaande netten bepaalt sterk welke wijken als eerste van het gas af kunnen.\n- **Ondergrondse ordening**: bij herinrichting moeten warmteleidingen naast alle andere kabels en leidingen worden ingepast.\n- **Bronkeuze**: restwarmte, geothermie en aquathermie stellen elk andere eisen aan temperatuur en netontwerp.",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
  {
    layerId: "zh-wko-geschiktheid-ondiep",
    title: "Kansen voor WKO in {city}",
    subtitle: "Geschiktheid voor warmte-koudeopslag in het eerste watervoerend pakket",
    intro:
      "Deze kaart beoordeelt per buurt de geschiktheid voor **warmte-koudeopslag** in het ondiepe, eerste watervoerende pakket. WKO slaat in de zomer warmte op in het grondwater en haalt die er 's winters weer uit — een van de meest volwassen alternatieven voor aardgas, maar alleen waar de ondergrond meewerkt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          { label: "Woningen in deze buurten", type: "sum", property: "F_woningen", decimals: 0 },
          { label: "Gemeenten", type: "distinct", property: "F_gm_naam" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat maakt een ondergrond geschikt?",
        body: "Drie dingen. Er moet een **watervoerend pakket** zijn met voldoende dikte en doorlatendheid, zodat je water kunt onttrekken en terugbrengen. Het grondwater moet **zoet of hooguit brak** zijn — zout water tast installaties aan en mag niet worden verplaatst. En er moet **ruimte** zijn: WKO-systemen beïnvloeden elkaar, dus in drukke gebieden is ordening nodig.\n\nDe zoet-zoutverdeling is in Zuid-Holland de belangrijkste beperking; zie ook de laag *Zoet-zout grondwatervoorkomens*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Warmtetransitie**: WKO is vooral kansrijk bij nieuwbouw en grootschalige renovatie, waar lage-temperatuurverwarming haalbaar is.\n- **Ondergrondse ordening**: zonder afstemming putten systemen elkaar uit; provincies sturen daarom met interferentiegebieden.\n- **Koeling**: met warmere zomers wordt de koelfunctie van WKO steeds waardevoller.",
      },
    ],
    links: [
      { label: "WKO-bodemenergietool", url: "https://wkotool.nl/" },
      { label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" },
    ],
  },
  {
    layerId: "zh-aardwarmte-boringen",
    title: "Aardwarmte onder {city}",
    subtitle: "Boringen voor geothermie in de diepe ondergrond",
    intro:
      "Deze laag toont **{count} aardwarmteboringen** rond {city}. Geothermie haalt warm water op uit poreuze zandsteenlagen op één tot drie kilometer diepte, gebruikt de warmte en pompt het afgekoelde water via een tweede put weer terug. Zuid-Holland loopt hierin voorop — vooral het Westland, waar de glastuinbouw een constante warmtevraag heeft.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Boringen in beeld", type: "count" },
          { label: "On/offshore", type: "distinct", property: "On_offshore" },
        ],
      },
    ],
    sections: [
      {
        heading: "Hoe werkt een doublet?",
        body: "Een geothermieproject bestaat vrijwel altijd uit een **doublet**: twee putten in hetzelfde watervoerende pakket, met de voeten enkele honderden meters uit elkaar. Uit de productieput komt water van 60 tot 100 graden; na warmtewisseling gaat het afgekoelde water via de injectieput terug het reservoir in.\n\nHet reservoir raakt dus niet leeg — de warmte wordt onttrokken, het water blijft in de kringloop. Wel koelt het reservoir over decennia geleidelijk af.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Warmtebronnen**: geothermie is een van de weinige duurzame bronnen die grootschalig én constant warmte kan leveren.\n- **Glastuinbouw**: het Westland is de grootste toepasser; de warmtevraag daar is groot en jaarrond.\n- **Ondergrondse ordening**: geothermie concurreert met gas-, zout- en opslagactiviteiten om dezelfde diepe lagen.",
      },
    ],
    links: [
      { label: "NLOG", url: "https://www.nlog.nl/" },
      { label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" },
    ],
  },
  {
    layerId: "zh-zoet-zout-grondwater",
    title: "Zoet en zout grondwater onder {city}",
    subtitle: "De verdeling van zoet, brak en zout grondwater in de ondergrond",
    intro:
      "Onder {city} liggen **{count} vlakken** die aangeven waar het grondwater zoet, brak of zout is. In laag Nederland is dat geen academische vraag: de zee heeft hier duizenden jaren zout water achtergelaten, en op veel plekken drijft een dunne zoetwaterlens op een zoute ondergrond.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vlakken in beeld", type: "count" },
          { label: "Klassen", type: "distinct", property: "ZOET_BRAK" },
        ],
      },
      {
        kind: "category-bar",
        title: "Verdeling zoet, brak en zout rond {city}",
        property: "ZOET_BRAK",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Verzilting en het zoet-zoutgrensvlak",
        body: "Zoet water is lichter dan zout en drijft er dus bovenop. De grens tussen beide ligt in de diepte, maar is niet stabiel: bij droogte, grondwateronttrekking en zeespiegelstijging schuift het zoute water omhoog — **verzilting**.\n\nIn diepe polders komt zout kwelwater zelfs tot aan het maaiveld. Dat is een van de moeilijkst omkeerbare gevolgen van klimaatverandering voor het Nederlandse waterbeheer.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Drinkwater**: winningen zijn afhankelijk van een zoetwatervoorraad die niet mag verzilten.\n- **WKO en geothermie**: zout grondwater is corrosief en beperkt de inzet van bodemenergie sterk.\n- **Landbouw**: zoutgehalte in het beregeningswater bepaalt welke teelten mogelijk blijven.\n- **Natuur**: brakke en zoute kwelmilieus zijn zeldzaam en ecologisch waardevol — hier is zout juist een kwaliteit.",
      },
    ],
    links: [{ label: "Geodata Zuid-Holland", url: "https://geoportaal.zuid-holland.nl" }],
  },
];
