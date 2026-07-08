/**
 * Story maps — provinciale lagen Gelderland (Geoportaal Gelderland) en
 * Noord-Brabant (Atlas Brabant, momenteel stub).
 *
 * Gelderland-lagen (gld-*): luchtkwaliteit PM10/PM2.5/NO₂ per buurt,
 * zonneparken, stortplaatsen, baggerdepots, recreatiezonering Veluwe,
 * faunapassages, groen-blauwe dooradering, KRW-grondwater(kwaliteit/lichamen),
 * uiterwaarden en bebouwde kommen.
 *
 * Noord-Brabant-lagen (br-*): provinciale wegen, hectometrering en wegassen —
 * de Atlas-Brabant-ArcGIS-server is uit de lucht, dus deze lagen staan op stub
 * (0 features) tot de provincie een vervangend open eindpunt publiceert.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "gld-luchtkwaliteit-pm10",
    title: "Fijnstof PM10 in en rond {city}",
    subtitle:
      "Modelmatige PM10-concentraties per buurt uit het Geoportaal Gelderland",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} naar hun gemiddelde **PM10-concentratie** (fijnstof met deeltjes tot 10 micrometer), zoals de provincie Gelderland die per buurt heeft doorgerekend. Donkerder betekent een hogere concentratie. Klik op een buurt voor de exacte waarde en het aantal inwoners.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gemiddelde PM10",
            type: "avg",
            property: "pm10_avg",
            unit: "µg/m³",
            decimals: 1,
          },
          {
            label: "Hoogste buurtwaarde",
            type: "max",
            property: "pm10_avg",
            unit: "µg/m³",
            decimals: 1,
          },
          {
            label: "Inwoners in deze buurten",
            type: "sum",
            property: "inwoners",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van PM10-concentraties per buurt in {city}",
        description:
          "Aantal buurten per concentratieklasse (provinciaal veld pm10_avg)",
        property: "pm10_avg",
        unit: "µg/m³",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke buurt heeft één gemiddelde PM10-waarde, berekend door de provincie op basis van luchtkwaliteitsmodellen (niet één meetpunt per buurt). Het is dus een *immissie*-beeld: de concentratie waaraan mensen ter plekke worden blootgesteld. De verschillen binnen een gemeente zijn meestal klein; drukke wegen, industrie en veehouderij drukken de waarde lokaal wat omhoog.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: fijnstof is een van de belangrijkste milieu-gezondheidsrisico's. De WHO-advieswaarde voor PM10 (jaargemiddeld 15 µg/m³) ligt strenger dan de wettelijke EU-grenswaarde (40 µg/m³); veel Gelderse buurten zitten tussen die twee in.\n- **Omgevingsbeleid**: gemeenten gebruiken dit beeld bij het afwegen van nieuwe woningbouw langs drukke wegen en bij het Schone Lucht Akkoord.\n- **Kwetsbare bestemmingen**: scholen, zorginstellingen en speelplekken worden bij voorkeur niet op de hoogst belaste plekken gepland.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het **Geoportaal Gelderland** (milieuservice) en is een modelmatig beeld per buurt — geen directe meting. De kaart toont alleen buurten binnen de kaartuitsnede van {city}; buurten van buurgemeenten kunnen dus meetellen. Concentraties fluctueren van jaar tot jaar met het weer en de uitstoot, dus lees de waarden als een orde van grootte, niet als een exact meetresultaat.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Schone Lucht Akkoord",
        url: "https://www.schoneluchtakkoord.nl/",
      },
    ],
  },
  {
    layerId: "gld-luchtkwaliteit-pm25",
    title: "Fijnstof PM2.5 in en rond {city}",
    subtitle:
      "Modelmatige PM2.5-concentraties per buurt uit het Geoportaal Gelderland",
    intro:
      "Deze laag toont voor **{count} buurten** in en rond {city} de gemiddelde concentratie **PM2.5** — de fijnste fractie fijnstof (deeltjes tot 2,5 micrometer). Juist deze kleine deeltjes dringen diep in de longen door en worden gezondheidskundig als het schadelijkst gezien. Klik op een buurt voor de exacte waarde.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gemiddelde PM2.5",
            type: "avg",
            property: "pm25_avg",
            unit: "µg/m³",
            decimals: 1,
          },
          {
            label: "Hoogste buurtwaarde",
            type: "max",
            property: "pm25_avg",
            unit: "µg/m³",
            decimals: 1,
          },
          {
            label: "Inwoners in deze buurten",
            type: "sum",
            property: "inwoners",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van PM2.5-concentraties per buurt in {city}",
        description:
          "Aantal buurten per concentratieklasse (provinciaal veld pm25_avg)",
        property: "pm25_avg",
        unit: "µg/m³",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Net als bij PM10 gaat het om één modelmatig gemiddelde per buurt, niet om een meetpunt. PM2.5 komt vooral uit verbranding: verkeer, houtstook, industrie en de landbouw. De ruimtelijke verschillen zijn klein en vloeiend, omdat fijnstof zich over grote afstanden verspreidt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheidswinst**: PM2.5 is sterker aan sterfte en luchtwegaandoeningen gekoppeld dan grovere deeltjes. De WHO-advieswaarde (jaargemiddeld 5 µg/m³) wordt in vrijwel heel Nederland overschreden.\n- **Bronbeleid**: omdat een groot deel van buiten de gemeente komt, is samenwerking (regionaal, landelijk, Europees) nodig; lokaal beleid richt zich vooral op houtstook en verkeer.\n- **Afwegingskader**: het beeld helpt bij locatiekeuzes voor gevoelige functies en bij de onderbouwing van klimaat- en mobiliteitsmaatregelen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Afkomstig uit het **Geoportaal Gelderland** (milieuservice), als modelmatig beeld per buurt. Statistieken gaan over de buurten binnen de kaartuitsnede van {city}. Waarden zijn indicatief en variëren per jaargang; gebruik ze om patronen te zien, niet als exacte meting.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "WHO-richtlijnen luchtkwaliteit",
        url: "https://www.who.int/publications/i/item/9789240034228",
      },
    ],
  },
  {
    layerId: "gld-luchtkwaliteit-no2",
    title: "Stikstofdioxide (NO₂) in en rond {city}",
    subtitle:
      "Modelmatige NO₂-concentraties per buurt uit het Geoportaal Gelderland",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} naar hun gemiddelde **NO₂-concentratie** (stikstofdioxide). NO₂ is de duidelijkste verkeersindicator van de drie luchtlagen: de concentratie is het hoogst langs drukke wegen en in stedelijk gebied. Klik op een buurt voor de exacte waarde.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gemiddelde NO₂",
            type: "avg",
            property: "no2_avg",
            unit: "µg/m³",
            decimals: 1,
          },
          {
            label: "Hoogste buurtwaarde",
            type: "max",
            property: "no2_avg",
            unit: "µg/m³",
            decimals: 1,
          },
          {
            label: "Inwoners in deze buurten",
            type: "sum",
            property: "inwoners",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van NO₂-concentraties per buurt in {city}",
        description:
          "Aantal buurten per concentratieklasse (provinciaal veld no2_avg)",
        property: "no2_avg",
        unit: "µg/m³",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Eén modelmatig NO₂-gemiddelde per buurt. Anders dan fijnstof is NO₂ vooral een *lokaal* verschijnsel: het ontstaat bij verbranding (met name wegverkeer) en breekt relatief snel weer af. Daardoor kleuren buurten langs snelwegen en drukke invalswegen doorgaans donkerder dan rustige woonbuurten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersbeleid**: omdat NO₂ zo direct met verkeer samenhangt, is het de beste indicator om het effect van maatregelen als 30 km/u-zones, schonere bussen en autoluwe binnensteden te volgen.\n- **Gezondheid**: NO₂ hangt samen met luchtwegklachten; de EU-grenswaarde is 40 µg/m³ jaargemiddeld, de WHO adviseert 10 µg/m³.\n- **Ruimtelijke ordening**: bij bouwen langs drukke wegen is de NO₂-contour vaak maatgevend voor het al dan niet toestaan van woningen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Uit het **Geoportaal Gelderland** (milieuservice), als modelmatig beeld per buurt — geen meetpunt. De kaartuitsnede van {city} kan buurten van buurgemeenten bevatten. Waarden zijn indicatief en jaargebonden.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "RIVM: stikstofdioxide en gezondheid",
        url: "https://www.rivm.nl/stikstof",
      },
    ],
  },
  {
    layerId: "gld-zonneparken",
    title: "Zonneparken in en rond {city}",
    subtitle:
      "Geregistreerde zonneparken in Gelderland uit het Geoportaal Gelderland",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} zonneparken** volgens de provinciale registratie van Gelderland. Elk vlak is een grondgebonden of drijvende zonne-installatie, met kenmerken als het opgesteld vermogen, het type opstelling en of het park al gerealiseerd is. Klik op een park voor de details, zoals naam, adres en verwachte jaarproductie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zonneparken in beeld", type: "count" },
          {
            label: "Gerealiseerd",
            type: "count-where",
            property: "gerealiseerd",
            equals: "Ja",
          },
          {
            label: "Totaal opgesteld vermogen",
            type: "sum",
            property: "vermogen_mw",
            unit: "MW",
            decimals: 1,
          },
          {
            label: "Plaatsen met een zonnepark",
            type: "distinct",
            property: "plaats_lokatie",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zonneparken naar type opstelling in {city}",
        description:
          "Provinciaal veld opstelling_type: veldsysteem (op land) versus watersysteem (drijvend)",
        property: "opstelling_type",
      },
      {
        kind: "histogram",
        title: "Verdeling van opgesteld vermogen per park",
        description:
          "Aantal zonneparken per vermogensklasse (veld vermogen_mw, in megawatt)",
        property: "vermogen_mw",
        unit: "MW",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is één zonnepark. Het **opstellingstype** onderscheidt *veldsystemen* (panelen op het land) van *watersystemen* (drijvende parken op plassen of bassins). Het veld *gerealiseerd* geeft aan of een park al in bedrijf is, nog in aanbouw is, of pas deels operationeel. Het opgesteld vermogen (in MW) is een maat voor de omvang: grofweg levert 1 MW zon genoeg stroom voor enkele honderden huishoudens.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energietransitie**: zonneparken zijn samen met windmolens de dragers van de Regionale Energiestrategie (RES). Deze laag laat zien hoeveel opwek er al in de gemeente staat.\n- **Ruimtelijke afweging**: grondgebonden zon concurreert met landbouw, natuur en landschap; de provincie hanteert een voorkeursvolgorde (eerst daken, dan restgronden). De ligging helpt die discussie te voeren.\n- **Netcapaciteit**: de concentratie van vermogen is relevant voor netbeheerders, omdat het elektriciteitsnet in delen van Gelderland vol zit.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De registratie komt uit het **Geoportaal Gelderland** (milieuservice) en combineert onder meer OSM, luchtfoto's en SDE-subsidiegegevens. De kaart toont parken binnen de kaartuitsnede van {city}; ook parken van buurgemeenten kunnen meetellen. Kleine dakinstallaties zitten er niet in — dit zijn de grotere, veelal grondgebonden parken.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Regionale Energiestrategie (RES)",
        url: "https://www.regionale-energiestrategie.nl/",
      },
    ],
  },
  {
    layerId: "gld-stortplaatsen",
    title: "Stortplaatsen in en rond {city}",
    subtitle:
      "Stortplaatsen onder Wet milieubeheer-nazorg (Geoportaal Gelderland)",
    intro:
      "Deze laag toont **{count} stortplaatsen** in en rond {city} die onder de nazorgregeling van de Wet milieubeheer vallen. Het gaat om (voormalige) vuilstortlocaties waar de provincie eeuwigdurend verantwoordelijk is voor beheersing van bodem- en grondwaterrisico's. Klik op een locatie voor naam, plaats, status en omvang in hectare.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stortplaatsen in beeld", type: "count" },
          {
            label: "Gesloten",
            type: "count-where",
            property: "status",
            equals: "gesloten",
          },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "hectare",
            unit: "ha",
            decimals: 0,
          },
          {
            label: "Verschillende plaatsen",
            type: "distinct",
            property: "plaatsnaam",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Stortplaatsen naar status in {city}",
        description:
          "Provinciaal veld status: van 'in exploitatie' tot 'gesloten'",
        property: "status",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een stortplaats waarvoor de provincie een nazorgplicht heeft. De **status** loopt van *(nog) in exploitatie* — de locatie ontvangt nog afval — via *ontvangt geen afval meer* tot *gesloten*, waarbij een afdeklaag is aangebracht en de locatie in de langjarige nazorg zit. Het oppervlak (in hectare) geeft de omvang van het gestorte gebied aan.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bodem- en grondwaterbescherming**: onder een stortplaats kan verontreinigd percolaat ontstaan; de provincie monitort en beheerst dat via een nazorgfonds.\n- **Ruimtegebruik**: gesloten stortplaatsen worden soms hergebruikt voor natuur, recreatie of zonne-energie (zon op stort), maar met beperkingen door de afdeklaag.\n- **Vergunningen**: bij ontwikkelingen in de omgeving is de ligging en status van een stortplaats een harde randvoorwaarde.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit het **Geoportaal Gelderland** (milieuservice). De kaart toont locaties binnen de kaartuitsnede van {city}; ook stortplaatsen van buurgemeenten kunnen zichtbaar zijn. Het is een provinciale registratie, gericht op de Wet milieubeheer-nazorg.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Provincie Gelderland: bodem",
        url: "https://www.gelderland.nl/themas/klimaat-milieu-en-water/bodem",
      },
    ],
  },
  {
    layerId: "gld-bodem-baggerdepots",
    title: "Baggerdepots in en rond {city}",
    subtitle:
      "Baggerdepots onder Wet milieubeheer (Geoportaal Gelderland)",
    intro:
      "Deze laag toont **{count} baggerdepots** in en rond {city}: locaties waar baggerspecie uit watergangen wordt geborgen, onder toezicht van de provincie op grond van de Wet milieubeheer. Klik op een depot voor naam, status en omvang in hectare.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Baggerdepots in beeld", type: "count" },
          {
            label: "Gesloten",
            type: "count-where",
            property: "status",
            equals: "gesloten",
          },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "hectare",
            unit: "ha",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Baggerdepots naar status in {city}",
        description: "Provinciaal veld status van het depot",
        property: "status",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een baggerdepot: een aangewezen plek waar bagger — het slib dat bij het uitbaggeren van sloten, kanalen en havens vrijkomt — wordt ingedroogd en geborgen. De **status** geeft aan of het depot nog in gebruik is of al gesloten. Omdat bagger licht tot sterk verontreinigd kan zijn, gelden er milieu-eisen aan de berging.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Waterbeheer**: schoon houden van watergangen vraagt om baggeren, en dus om depotcapaciteit; de ligging speelt in de planning van waterschappen en gemeenten.\n- **Bodemkwaliteit**: een depot is een potentiële bron van bodem- en grondwaterbelasting en wordt daarom gemonitord.\n- **Herontwikkeling**: gesloten depots kennen gebruiksbeperkingen die relevant zijn bij ruimtelijke plannen in de omgeving.",
      },
      {
        heading: "Over de bron",
        body: "Afkomstig uit het **Geoportaal Gelderland** (milieuservice). De kaart toont depots binnen de kaartuitsnede van {city}; ook depots van buurgemeenten kunnen meetellen. Het is een provinciale registratie in het kader van de Wet milieubeheer.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Provincie Gelderland: bodem",
        url: "https://www.gelderland.nl/themas/klimaat-milieu-en-water/bodem",
      },
    ],
  },
  {
    layerId: "gld-recreatiezonering-veluwe",
    title: "Recreatiezonering Veluwe in en rond {city}",
    subtitle:
      "Zonering van toegankelijkheid en kwetsbaarheid op de Veluwe (Geoportaal Gelderland)",
    intro:
      "Deze laag toont de **recreatiezonering van de Veluwe** binnen het kaartgebied van {city}: **{count} zones** die aangeven waar recreatie ruim baan krijgt en waar juist rust nodig is voor kwetsbare natuur. Van drukke poorten en attractiezones tot stiltegebieden voor zeer verstoringsgevoelige soorten. Klik op een zone voor de code, de openstelling en de volledige omschrijving.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zones in beeld", type: "count" },
          {
            label: "Zonecategorieën",
            type: "distinct",
            property: "code",
          },
          {
            label: "Open zones",
            type: "count-where",
            property: "open_st",
            equals: "Open",
          },
          {
            label: "Gesloten zones",
            type: "count-where",
            property: "open_st",
            equals: "Gesloten",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zones naar categorie in {city}",
        description:
          "Provinciaal veld code — de zonecategorie, van O (buiten zonering) tot D* (meest kwetsbaar)",
        property: "code",
      },
      {
        kind: "category-bar",
        title: "Openstelling van de zones",
        description: "Provinciaal veld open_st: is de zone toegankelijk?",
        property: "open_st",
        valueLabels: {
          Open: "Open",
          Gesloten: "Gesloten",
          Periode: "Deel van het jaar open",
          Onbekend: "Onbekend / niet gezoneerd",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De Veluwe is opgedeeld in zones die een gradiënt vormen van *veel* naar *weinig* recreatie. Grofweg: zone **B** is voor levendige recreatie, zone **C** voor extensief medegebruik, en de **C\\*- en D\\*-zones** zijn rustgebieden voor de meest verstoringsgevoelige soorten. Zone **O** ligt buiten de eigenlijke zonering. Per zone is vastgelegd of en wanneer die is opengesteld voor bezoekers.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Natuur én recreatie**: de zonering is de kern van het programma om drukte op de Veluwe te sturen — recreatie concentreren waar het kan, rust bieden waar het moet (Natura 2000).\n- **Gebiedsontwikkeling**: nieuwe paden, parkeerplaatsen of verblijfsrecreatie worden aan de zonering getoetst.\n- **Handhaving en communicatie**: de zones onderbouwen afsluitingen, bewegwijzering en voorlichting aan bezoekers.",
      },
      {
        heading: "Over de bron",
        body: "De zonering komt uit het **Geoportaal Gelderland** (natuurservice). De kaart toont alleen de zones binnen de kaartuitsnede van {city}; buiten de Veluwe is er geen zonering, dus voor gemeenten zonder Veluwe-grondgebied kan deze laag leeg zijn. De indeling wordt periodiek geactualiseerd naarmate het zoneringsproces vordert.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Veluweop1: recreatiezonering",
        url: "https://www.veluweop1.nl/",
      },
    ],
  },
  {
    layerId: "gld-faunapassages",
    title: "Faunapassages in en rond {city}",
    subtitle:
      "Voorzieningen voor veilige diertrek onder en over wegen (Geoportaal Gelderland)",
    intro:
      "Binnen het kaartgebied van {city} registreert de provincie Gelderland **{count} faunapassages**: kunstwerken die dieren veilig langs of over infrastructuur helpen, van kleine amfibieënbuizen onder een weg tot grote ecoducten over een snelweg. Klik op een passage voor het type, de eigenaar en het jaar van aanleg.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Faunapassages in beeld", type: "count" },
          {
            label: "Verschillende typen",
            type: "distinct",
            property: "passage_srt",
          },
          {
            label: "In beheer bij de provincie",
            type: "count-where",
            property: "eigenaar",
            equals: "Provincie",
          },
          {
            label: "Wegen met een passage",
            type: "distinct",
            property: "weg_naam",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Faunapassages naar type in {city}",
        description:
          "Provinciaal veld passage_srt: van faunabuis en amfibieënbuis tot ecoduct",
        property: "passage_srt",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Faunapassages naar eigenaar",
        description:
          "Provinciaal veld eigenaar: wie beheert de voorziening (provincie, gemeente, Rijk/RWS, waterschap)",
        property: "eigenaar",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een concrete faunavoorziening. De **soort** varieert sterk: *faunabuizen* en *kleine faunavoorzieningen* zijn onderdoorgangen voor klein wild, *amfibieënbuizen* en *terugkeerkleppen* helpen padden en kikkers, en *ecoducten (wildviaducten)* zijn de grote groene bruggen waarmee ook edelherten en zwijnen een snelweg kunnen oversteken. De eigenaar bepaalt wie de voorziening beheert en onderhoudt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ontsnippering**: wegen, spoor en kanalen versnipperen leefgebieden; passages verbinden natuurgebieden weer, wat de kern is van het Gelders Natuurnetwerk.\n- **Verkeersveiligheid**: goede passages verminderen aanrijdingen met wild — belangrijk op en rond de Veluwe.\n- **Beheer en investering**: het overzicht helpt provincie, gemeenten en Rijkswaterstaat prioriteren waar nieuwe passages of onderhoud nodig zijn.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit het **Geoportaal Gelderland** (natuurservice). De kaart toont passages binnen de kaartuitsnede van {city}; ook voorzieningen van buurgemeenten kunnen meetellen. Het bestand bevat naast bestaande passages soms ook gewenste locaties (\"locatie ecopassage gewenst\").",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Provincie Gelderland: natuur",
        url: "https://www.gelderland.nl/themas/natuur-en-landschap",
      },
    ],
  },
  {
    layerId: "gld-groen-blauwe-dooradering",
    title: "Groen-blauwe dooradering in en rond {city}",
    subtitle:
      "Landschapselementen die het buitengebied verbinden (Geoportaal Gelderland)",
    intro:
      "Deze laag brengt de **groen-blauwe dooradering** in en rond {city} in beeld: **{count} landschapselementen** zoals houtwallen, bosjes, singels, poelen en beekjes die samen het fijnmazige netwerk vormen waarlangs planten en dieren zich door het landschap bewegen. Elk element is getypeerd naar vorm, kenmerk en landschapstype. Klik op een element voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Elementen in beeld", type: "count" },
          {
            label: "Landschapstypen",
            type: "distinct",
            property: "land_type",
          },
          {
            label: "Soorten landschapselement",
            type: "distinct",
            property: "lvl_4_landschapselement",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Elementen naar landschapstype in {city}",
        description:
          "Provinciaal veld land_type: het landschapstype waarin het element ligt",
        property: "land_type",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Soorten landschapselement",
        description:
          "Provinciaal veld lvl_4_landschapselement: het concrete type element",
        property: "lvl_4_landschapselement",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak of lijntje is één landschapselement, hiërarchisch geclassificeerd van grof (*groen* of *blauw* element) naar fijn (het concrete landschapselement, bijvoorbeeld 'droog bos met productie' of een houtwal). De elementen zijn gegroepeerd per landschapstype — essenlandschap, kampenlandschap, boslandschap, natte heide- en broekontginningen — wat het karakteristieke patroon van een streek weerspiegelt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Biodiversiteit**: kleine landschapselementen zijn cruciaal als leefgebied en verbindingsroute voor insecten, vogels en kleine zoogdieren; ze zijn de haarvaten van het natuurnetwerk buiten de grote natuurgebieden.\n- **Landschap en identiteit**: houtwallen, singels en poelen bepalen de herkenbaarheid van het Gelderse cultuurlandschap; behoud ervan is beleid.\n- **Klimaat en water**: groen-blauwe structuren bufferen water, bieden verkoeling en dragen bij aan koolstofvastlegging.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit het **Geoportaal Gelderland** (natuurservice). Dit is een fijnmazige, zeer omvangrijke laag; de kaart toont de elementen binnen de kaartuitsnede van {city}, en bij grote aantallen kan een deel pas na volledig laden verschijnen. De statistieken gaan over de geladen elementen in beeld.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Provincie Gelderland: landschap",
        url: "https://www.gelderland.nl/themas/natuur-en-landschap",
      },
    ],
  },
  {
    layerId: "gld-grondwaterkwaliteit",
    title: "Meetnet grondwaterkwaliteit in en rond {city}",
    subtitle:
      "KRW-meetpunten voor grondwaterkwaliteit (Geoportaal Gelderland)",
    intro:
      "Deze laag toont de **{count} meetpunten** van het provinciale meetnet grondwaterkwaliteit in en rond {city}, onderdeel van de monitoring voor de Europese Kaderrichtlijn Water (KRW). Op elk punt worden op één of meer dieptes grondwatermonsters genomen. Klik op een meetpunt voor de meetput-identificatie, de filterdiepte en het grondwaterlichaam waarin het ligt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetpunten in beeld", type: "count" },
          {
            label: "Grondwaterlichamen",
            type: "distinct",
            property: "grwlichaam",
          },
          {
            label: "Gemiddelde filterdiepte",
            type: "avg",
            property: "diepte",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meetpunten per meetnettype in {city}",
        description:
          "Provinciaal veld mlctype: het type meetlocatie binnen het KRW-meetnet",
        property: "mlctype",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een grondwatermeetput. Op verschillende filterdieptes wordt de kwaliteit van het grondwater bemonsterd: nitraat, sulfaat, chloride, metalen en bestrijdingsmiddelen. De metingen samen vertellen of het grondwater in een gebied schoon genoeg is en of het verbetert of verslechtert.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Drinkwater**: een groot deel van het Gelderse drinkwater komt uit grondwater; de kwaliteit hier is de basis voor de bescherming van winningen.\n- **Landbouw en milieu**: uitspoeling van meststoffen en gewasbeschermingsmiddelen is zichtbaar in het grondwater; het meetnet volgt of maatregelen effect hebben.\n- **KRW-doelen**: Nederland moet aantonen dat grondwaterlichamen in goede toestand zijn of komen; dit meetnet levert daarvoor het bewijs.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De meetpunten komen uit het **Geoportaal Gelderland** (waterservice). De kaart toont punten binnen de kaartuitsnede van {city}. Deze provinciale service laat zich niet altijd vlekkeloos bevragen; laadt de laag geen punten, dan blijven de statistieken hierboven op nul. De laag toont de *locaties* van het meetnet, niet de gemeten stofconcentraties zelf.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Kaderrichtlijn Water (Helpdesk Water)",
        url: "https://www.helpdeskwater.nl/onderwerpen/wetgeving-beleid/kaderrichtlijn-water/",
      },
    ],
  },
  {
    layerId: "gld-grondwaterlichamen",
    title: "Grondwaterlichamen in en rond {city}",
    subtitle:
      "Begrensde grondwatereenheden voor de Kaderrichtlijn Water (Geoportaal Gelderland)",
    intro:
      "Deze laag toont de **{count} grondwaterlichamen** in en rond {city}: de grote, samenhangende grondwatereenheden waarin Nederland is opgedeeld voor de Europese Kaderrichtlijn Water (KRW). Voor elk lichaam beoordeelt de overheid periodiek de chemische en kwantitatieve toestand. Klik op een vlak voor de naam en code.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Grondwaterlichamen in beeld", type: "count" },
          {
            label: "Verschillende namen",
            type: "distinct",
            property: "gwbnaam",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Grondwaterlichamen naar naam in {city}",
        description: "Provinciaal veld gwbnaam: de naam van het grondwaterlichaam",
        property: "gwbnaam",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Anders dan de meetpuntenlaag toont dit de *begrenzing* van hele grondwaterlichamen: aaneengesloten watervoerende pakketten die als één eenheid worden beoordeeld. Een gemeente ligt meestal binnen één of enkele van deze lichamen, die vaak zijn afgeleid van stroomgebieden zoals de Rijn en de Maas.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **KRW-toestand**: het grondwaterlichaam is de eenheid waarop doelen en maatregelen worden vastgelegd; de toestand ervan bepaalt of aanvullend beleid nodig is.\n- **Ruimtelijke plannen**: bij grondwateronttrekkingen, warmte-koudeopslag en bouwen in de ondergrond is bekend in welk lichaam een locatie ligt van belang.\n- **Samenhang**: de begrenzing helpt begrijpen dat grondwater zich niet aan gemeentegrenzen houdt — beleid werkt op de schaal van het hele lichaam.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Uit het **Geoportaal Gelderland** (waterservice). De kaart toont de lichamen die de kaartuitsnede van {city} raken. Deze provinciale service laat zich niet altijd vlekkeloos bevragen; blijft de laag leeg, dan staan de statistieken op nul. Het gaat om grofmazige, provincie-overstijgende eenheden.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Kaderrichtlijn Water (Helpdesk Water)",
        url: "https://www.helpdeskwater.nl/onderwerpen/wetgeving-beleid/kaderrichtlijn-water/",
      },
    ],
  },
  {
    layerId: "gld-uiterwaarden",
    title: "Uiterwaarden in en rond {city}",
    subtitle:
      "Uiterwaarden van de IJssel en andere Gelderse rivieren (Geoportaal Gelderland)",
    intro:
      "Deze laag toont de **{count} uiterwaarden** in en rond {city}: het land tussen de zomerbedding van de rivier en de winterdijk, dat bij hoogwater onderloopt en ruimte biedt aan de rivier. Uiterwaarden zijn tegelijk waterberging, natuurgebied en landschap. Klik op een uiterwaard voor de naam en het gebied waartoe die hoort.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Uiterwaarden in beeld", type: "count" },
          {
            label: "Verschillende namen",
            type: "distinct",
            property: "objectnaam",
          },
          {
            label: "Riviergebieden",
            type: "distinct",
            property: "gebied_naam",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een uiterwaard: het buitendijkse rivierland dat bij normale afvoer droog ligt maar bij hoogwater meestroomt. Rond {city} horen de uiterwaarden vooral bij de IJssel en aangrenzende Gelderse rivieren. Omdat de namen per uiterwaard uniek zijn, is er geen zinvolle categorie-indeling; de statistieken vatten daarom vooral het aantal en de riviergebieden samen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hoogwaterveiligheid**: uiterwaarden zijn de ruimte die de rivier nodig heeft; programma's als Ruimte voor de Rivier hebben ze verbreed en verlaagd om piekafvoeren veilig te bergen.\n- **Natuur en Natura 2000**: veel uiterwaarden zijn waardevolle riviernatuur met ooibos, stroomdalgrasland en moeras.\n- **Ruimtegebruik**: buitendijks bouwen en gebruik zijn sterk gereguleerd; de begrenzing is daarvoor het vertrekpunt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Afkomstig uit het **Geoportaal Gelderland** (waterservice). De kaart toont uiterwaarden binnen de kaartuitsnede van {city}; gemeenten zonder grote rivier hebben deze laag leeg. Deze provinciale service laat zich niet altijd vlekkeloos bevragen; laadt de laag geen vlakken, dan blijven de statistieken op nul.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Rijkswaterstaat: Ruimte voor de Rivier",
        url: "https://www.rijkswaterstaat.nl/water/waterbeheer/bescherming-tegen-het-water/maatregelen-om-overstromingen-te-voorkomen/ruimte-voor-de-rivier",
      },
    ],
  },
  {
    layerId: "gld-bebouwde-kommen",
    title: "Bebouwde kommen in en rond {city}",
    subtitle:
      "Kernen en hun grondgebruik in Gelderland (Geoportaal Gelderland)",
    intro:
      "Deze laag tekent de **bebouwde kommen** in en rond {city}: **{count} vlakken** die samen de bebouwde kernen van Gelderland vormen, opgeknipt naar hoofdvorm van grondgebruik. Zo zie je de begrenzing van dorpen en wijken en het onderscheid tussen bebouwing, bedrijventerrein, sportvelden en parken. Klik op een vlak voor de kern, plaats en het grondgebruik.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vlakken in beeld", type: "count" },
          {
            label: "Verschillende kernen",
            type: "distinct",
            property: "kern_nam",
          },
          {
            label: "Gemeenten in beeld",
            type: "distinct",
            property: "gemeente",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bebouwde kom naar grondgebruik in {city}",
        description:
          "Provinciaal veld grond_gebr: de hoofdvorm van grondgebruik binnen de kom",
        property: "grond_gebr",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De bebouwde kom is hier niet één massief vlak, maar opgedeeld naar **grondgebruik**: *bebouwing* (woon- en centrumgebied), *bedrijventerrein*, *sportveld* en *park*. Samen geven de vlakken de contour van de kern én een grove functie-indeling. Elk vlak hoort bij een benoemde kern (dorp of stadsdeel) en een gemeente.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke ordening**: de komgrens is bepalend voor tal van regels — van de Wegenverkeerswet (bebouwde-komgrens) tot bestemmingsplannen en het onderscheid stedelijk/landelijk gebied.\n- **Verstedelijking**: de verhouding tussen bebouwing, bedrijventerrein en groen binnen de kom zegt iets over het karakter en de verdichtingsruimte van een kern.\n- **Vergelijking**: doordat heel Gelderland op dezelfde manier is ingedeeld, zijn kernen onderling vergelijkbaar.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit het **Geoportaal Gelderland** (topografieservice). De kaart toont vlakken binnen de kaartuitsnede van {city}; ook kernen van buurgemeenten kunnen meetellen — het veld *gemeente* geeft per vlak uitsluitsel. De indeling is een provinciale, generaliserende weergave, niet de juridische komgrens uit een verkeersbesluit.",
      },
    ],
    links: [
      { label: "Geoportaal Gelderland", url: "https://geoportaal.gelderland.nl/" },
      {
        label: "Provincie Gelderland",
        url: "https://www.gelderland.nl/",
      },
    ],
  },
  {
    layerId: "br-provinciale-wegen",
    title: "Provinciale wegen in en rond {city}",
    subtitle:
      "Provinciale wegen in Noord-Brabant — bron (Atlas Brabant) tijdelijk uit de lucht",
    intro:
      "Deze laag is bedoeld om de **provinciale wegen (N-wegen)** in en rond {city} te tonen, zoals de provincie Noord-Brabant ze beheert. De oorspronkelijke bron — de ArcGIS-server van Atlas Brabant — is echter uit de lucht gehaald, en de provincie heeft nog geen vervangend open eindpunt gepubliceerd. De laag staat daarom op **stub**: er worden op dit moment **{count} objecten** getoond.",
    charts: [],
    sections: [
      {
        heading: "Waarom is deze laag (nog) leeg?",
        body: "De brondienst *Atlas Brabant* (atlas.brabant.nl) is medio 2026 uitgezet: de servicecatalogus is leeg en de weglagen geven een foutmelding. De provincie publiceert inmiddels via het Data Portaal Noord-Brabant, maar daar is (nog) geen provinciale-wegen-dataset teruggevonden. Tot dat vervangende eindpunt beschikbaar is, blijft deze laag leeg — vandaar dat er geen grafieken of statistieken zijn.",
      },
      {
        heading: "Wat kun je in de tussentijd gebruiken?",
        body: "Provinciale wegen zijn ook landelijk beschikbaar via het **Nationaal Wegenbestand (NWB)**. In deze viewer bevat de NWB-wegvakkenlaag een *wegbeheerder*-attribuut waarmee je de wegen in provinciaal beheer kunt herkennen — een volwaardig alternatief zolang de Brabantse bron ontbreekt.",
      },
      {
        heading: "Wat zou deze laag tonen?",
        body: "Zodra er een werkend eindpunt is, laat deze laag de provinciale wegen als lijnen zien: de N-wegen die dorpen en steden in Brabant verbinden en die qua beheer, onderhoud en verkeersveiligheid onder de provincie vallen (niet het Rijk of de gemeente).",
      },
    ],
    links: [
      {
        label: "Data Portaal Noord-Brabant",
        url: "https://data-portaal-noord-brabant.hub.arcgis.com/",
      },
      {
        label: "Nationaal Wegenbestand (NWB) — PDOK",
        url: "https://www.pdok.nl/introductie/-/article/nationaal-wegenbestand-nwb-",
      },
    ],
  },
  {
    layerId: "br-hectometrering",
    title: "Hectometrering provinciale wegen in en rond {city}",
    subtitle:
      "Hectometerpalen langs Brabantse N-wegen — bron (Atlas Brabant) tijdelijk uit de lucht",
    intro:
      "Deze laag is bedoeld om de **hectometerpalen** langs de provinciale wegen in en rond {city} te tonen: de puntsgewijze kilometeraanduiding waarmee locaties langs een N-weg exact worden benoemd. De bron (Atlas Brabant) is uit de lucht, dus de laag staat op **stub** en toont momenteel **{count} punten**.",
    charts: [],
    sections: [
      {
        heading: "Waarom is deze laag (nog) leeg?",
        body: "Net als de andere Brabantse weglagen kwam de hectometrering uit de ArcGIS-server van *Atlas Brabant*, die niet meer beschikbaar is. Er is nog geen vervangend open eindpunt gevonden op het Data Portaal Noord-Brabant. Tot die tijd blijft de laag leeg — daarom zijn er geen grafieken of statistieken.",
      },
      {
        heading: "Waar wordt hectometrering voor gebruikt?",
        body: "Hectometerpalen vormen het referentiestelsel langs wegen: ze koppelen incidenten, wegwerkzaamheden, verkeersbesluiten en onderhoudsgegevens aan een exacte plek op de weg. Hulpdiensten en weginspecteurs gebruiken de hectometeraanduiding om snel de juiste locatie te vinden.",
      },
      {
        heading: "Alternatief",
        body: "Voor de rijkswegen bestaat een landelijke hectometreringsdataset; voor provinciale wegen is die er (nog) niet als open laag in deze viewer. Zodra de provincie Noord-Brabant een vervangend eindpunt publiceert, kan deze laag opnieuw worden aangesloten.",
      },
    ],
    links: [
      {
        label: "Data Portaal Noord-Brabant",
        url: "https://data-portaal-noord-brabant.hub.arcgis.com/",
      },
      {
        label: "Nationaal Wegenbestand (NWB) — PDOK",
        url: "https://www.pdok.nl/introductie/-/article/nationaal-wegenbestand-nwb-",
      },
    ],
  },
  {
    layerId: "br-wegassen",
    title: "Wegassen provinciale wegen in en rond {city}",
    subtitle:
      "Hartlijnen van Brabantse N-wegen — bron (Atlas Brabant) tijdelijk uit de lucht",
    intro:
      "Deze laag is bedoeld om de **wegassen** — de hartlijnen — van de provinciale wegen in en rond {city} te tonen. De bron (Atlas Brabant) is uit de lucht gehaald, dus de laag staat op **stub** en toont op dit moment **{count} lijnen**.",
    charts: [],
    sections: [
      {
        heading: "Waarom is deze laag (nog) leeg?",
        body: "De wegassen kwamen, net als de provinciale wegen en de hectometrering, uit de inmiddels uitgezette ArcGIS-server van *Atlas Brabant*. Er is nog geen vervangend open eindpunt gevonden op het Data Portaal Noord-Brabant, dus de laag blijft voorlopig leeg en heeft geen grafieken of statistieken.",
      },
      {
        heading: "Wat is een wegas?",
        body: "Een wegas is de hartlijn van een weg: één doorlopende lijn door het midden van de rijbaan, in tegenstelling tot een vlak dat de volledige wegbreedte beslaat. Wegassen zijn de basis voor netwerkanalyses, routering en het koppelen van weggegevens aan een lijnvormige referentie.",
      },
      {
        heading: "Alternatief",
        body: "Het **Nationaal Wegenbestand (NWB)** levert landelijk wegassen (wegvakken) als lijnen, inclusief een *wegbeheerder*-attribuut om de provinciale wegen eruit te filteren. In deze viewer is de NWB-wegvakkenlaag daarom het aangewezen alternatief zolang de Brabantse bron ontbreekt.",
      },
    ],
    links: [
      {
        label: "Data Portaal Noord-Brabant",
        url: "https://data-portaal-noord-brabant.hub.arcgis.com/",
      },
      {
        label: "Nationaal Wegenbestand (NWB) — PDOK",
        url: "https://www.pdok.nl/introductie/-/article/nationaal-wegenbestand-nwb-",
      },
    ],
  },
];
