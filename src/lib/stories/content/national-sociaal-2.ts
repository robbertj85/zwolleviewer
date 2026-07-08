/**
 * Story maps — batch "national-sociaal-2": sociaal-economische en
 * leefomgevingslagen.
 *
 * Lagen: osm-drinkwater, osm-speeltuinen, cbs-pc4-inkomen-besteedbaar,
 * cbs-pc4-inkomen-laag-pct, cbs-pc4-inkomen-hoog-pct, cbs-pc4-woz,
 * cbs-pc4-stedelijkheid, cbs-pc4-omgevingsadressendichtheid,
 * cbs-pc4-koopwoningen-pct, cbs-pc4-meergezins-pct,
 * cbs-pc4-eenpersoonshh-pct, cbs-pc4-leeftijd-25-45-pct,
 * cbs-pc4-horeca-1km, bzk-leefbaarometer.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "osm-drinkwater",
    title: "Drinkwaterpunten in {city}",
    subtitle: "Openbare tappunten en waterfonteinen uit OpenStreetMap",
    intro:
      "Deze laag toont **{count} openbare drinkwaterpunten** in {city}, verzameld uit OpenStreetMap: tappunten, waterfonteinen en vulpunten waar iedereen gratis water kan tappen. Klik op een punt voor de details die vrijwilligers hebben vastgelegd, zoals of het binnen of buiten ligt en of het toegankelijk is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Drinkwaterpunten in beeld", type: "count" },
          {
            label: "Als rolstoeltoegankelijk gemarkeerd",
            type: "count-where",
            property: "wheelchair",
            equals: ["yes", "limited"],
          },
          {
            label: "Als fontein gemarkeerd",
            type: "count-where",
            property: "man_made",
            equals: "fountain",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een plek waar OpenStreetMap-vrijwilligers een openbaar drinkwaterpunt (*amenity=drinking_water*) hebben ingetekend. De meeste punten zijn spaarzaam getagd — vaak alleen de locatie zelf, soms met extra kenmerken zoals *wheelchair* (toegankelijkheid) of een *check_date* van de laatste controle. Namen ontbreken vrijwel altijd; het gaat om objecten, niet om benoemde voorzieningen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Hittebestendige stad**: bij hitte zijn gratis tappunten een laagdrempelige voorziening voor kwetsbare groepen, sporters en toeristen; het aanbod is een concrete klimaatadaptatie-indicator.\n- **Openbare ruimte**: drinkwaterpunten worden vaak samen met bankjes, schaduw en speelplekken geplaatst als onderdeel van een prettige verblijfsplek.\n- **Aanvulling op officiële data**: veel gemeenten hebben geen sluitend eigen bestand; de OSM-laag geeft snel een indicatief beeld waar al voorzieningen staan.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De punten komen live uit OpenStreetMap via de Overpass-API, begrensd op de gemeentegrens van {city}. Omdat OSM door vrijwilligers wordt bijgehouden, is de dekking niet gegarandeerd volledig: een ontbrekend punt betekent niet dat er geen tappunt is, en andersom kan een tijdelijk verwijderd punt nog even meelopen. Gebruik de laag als indicatie, niet als officiële registratie.",
      },
    ],
    links: [
      {
        label: "OpenStreetMap: amenity=drinking_water",
        url: "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Ddrinking_water",
      },
      { label: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
    ],
  },
  {
    layerId: "osm-speeltuinen",
    title: "Speeltuinen en speelplekken in {city}",
    subtitle: "Openbare speelplaatsen uit OpenStreetMap",
    intro:
      "Binnen de gemeentegrens van {city} kent OpenStreetMap **{count} speeltuinen en speelplekken**. Elke stip is een speelplaats (*leisure=playground*) — van een klein buurtplekje met een wipkip tot een grote speeltuin. Klik op een punt voor de details die vrijwilligers hebben vastgelegd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Speelplekken in beeld", type: "count" },
          { label: "Met een eigen naam", type: "distinct", property: "name" },
          {
            label: "Met beperkte toegang",
            type: "count-where",
            property: "access",
            equals: ["customers", "private"],
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt markeert een speelplek zoals ingetekend in OpenStreetMap. De meeste speelplekken hebben geen eigen naam en zijn beperkt getagd; een deel draagt een *access*-kenmerk dat aangeeft of de plek vrij toegankelijk is (*yes*), alleen voor klanten (*customers*, bijvoorbeeld bij horeca) of privé. Waar geen *access* staat, gaat het meestal om een gewone openbare buurtspeelplek.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Kindvriendelijke wijk**: de spreiding van speelplekken is een kernindicator voor de leefbaarheid van woonwijken; veel gemeenten hanteren een norm voor speelruimte binnen loopafstand van woningen.\n- **Sociale ontmoeting**: speelplekken zijn ook ontmoetingsplekken voor ouders en buurtbewoners en dragen bij aan sociale samenhang.\n- **Beheer en vernieuwing**: een actueel overzicht helpt bij het plannen van onderhoud, vervanging en het toevoegen van speelaanleidingen in nieuwe wijken.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De speelplekken komen live uit OpenStreetMap via de Overpass-API, begrensd op {city}. OSM is vrijwilligerswerk: de dekking is doorgaans goed voor herkenbare speeltuinen, maar kleine of nieuwe plekjes kunnen ontbreken. Gebruik de laag als indicatief overzicht en niet als het officiële speelruimtebestand van de gemeente.",
      },
    ],
    links: [
      {
        label: "OpenStreetMap: leisure=playground",
        url: "https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dplayground",
      },
      { label: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
    ],
  },
  {
    layerId: "cbs-pc4-inkomen-besteedbaar",
    title: "Besteedbaar inkomen per postcodegebied in {city}",
    subtitle:
      "Gemiddeld besteedbaar huishoudensinkomen per PC4-gebied (CBS 2022)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op het gemiddelde besteedbare inkomen per huishouden, in duizenden euro's. Donkerder betekent een hoger gemiddeld inkomen. Zo zie je in één oogopslag de sociaal-economische verschillen tussen wijken en buurten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddeld inkomen (× €1.000)",
            type: "avg",
            property: "gemiddeldInkomenHuishouden",
            unit: "k€",
            decimals: 1,
          },
          {
            label: "Laagste gebiedsgemiddelde",
            type: "min",
            property: "gemiddeldInkomenHuishouden",
            unit: "k€",
            decimals: 1,
          },
          {
            label: "Hoogste gebiedsgemiddelde",
            type: "max",
            property: "gemiddeldInkomenHuishouden",
            unit: "k€",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het gemiddeld inkomen per PC4 in {city}",
        description:
          "Aantal postcodegebieden per inkomensklasse (gemiddeld besteedbaar huishoudensinkomen, × €1.000)",
        property: "gemiddeldInkomenHuishouden",
        unit: "k€",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elk viercijferig postcodegebied berekent het CBS het gemiddelde besteedbare inkomen van de huishoudens, uitgedrukt in duizenden euro's. Het is één gemiddelde per gebied: binnen een PC4 kunnen huishoudens flink verschillen, en een enkel zeer hoog of laag inkomen trekt het gemiddelde mee. Gebruik de kaart daarom om patronen tussen gebieden te zien, niet om individuele situaties af te lezen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sociaal beleid**: inkomensverschillen tussen wijken zijn een startpunt voor beleid rond armoede, schuldhulp en gerichte voorzieningen.\n- **Woonbeleid**: de inkomensverdeling helpt bij het afwegen van de woningmix (sociale huur, middenhuur, koop) per gebied.\n- **Vergelijkbaarheid**: het CBS past dezelfde methodiek landelijk toe, waardoor je {city} eerlijk met andere gemeenten kunt vergelijken.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistiek *Gegevens per postcode* (PC4), ontsloten via PDOK. Belangrijk:\n- Inkomensvelden lopen op de structurele data achter; deze laag gebruikt daarom bewust de **jaargang 2022**, de laatste release met gevulde inkomenscijfers.\n- Gebieden zonder gepubliceerd cijfer (te weinig huishoudens, of onderdrukt om privacyredenen) worden weggelaten uit de statistieken en grafiek.\n- De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-inkomen-laag-pct",
    title: "Huishoudens met een laag inkomen in {city}",
    subtitle:
      "Aandeel huishoudens met een laag inkomen per PC4-gebied (CBS 2022)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op het percentage huishoudens met een laag inkomen. Donkerder betekent een groter aandeel lage inkomens. Zo wordt zichtbaar in welke delen van de gemeente relatief veel huishoudens financieel kwetsbaar zijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddeld aandeel laag inkomen",
            type: "avg",
            property: "percentageLaagInkomenHuishouden",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Hoogste aandeel (PC4)",
            type: "max",
            property: "percentageLaagInkomenHuishouden",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Laagste aandeel (PC4)",
            type: "min",
            property: "percentageLaagInkomenHuishouden",
            unit: "%",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het aandeel lage inkomens per PC4 in {city}",
        description:
          "Aantal postcodegebieden per klasse van het percentage huishoudens met een laag inkomen",
        property: "percentageLaagInkomenHuishouden",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Per postcodegebied geeft het CBS het aandeel huishoudens met een laag inkomen: huishoudens onderin de landelijke inkomensverdeling. Het is een relatief cijfer per gebied; een hoog percentage in een klein gebied kan om weinig huishoudens gaan. De kaart toont dus concentraties, geen absolute aantallen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Armoede en bestaanszekerheid**: gebieden met een hoog aandeel lage inkomens zijn logische focusgebieden voor armoedebeleid, schuldhulp en toeslagenondersteuning.\n- **Voorzieningen**: het aandeel lage inkomens hangt vaak samen met de behoefte aan betaalbare voorzieningen dicht bij huis.\n- **Segregatie**: samen met de laag *hoog inkomen* laat dit zien hoe sterk inkomensgroepen ruimtelijk gescheiden wonen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistiek *Gegevens per postcode* (PC4) via PDOK, jaargang **2022** (de laatste met gevulde inkomenscijfers). Gebieden zonder gepubliceerd cijfer worden weggelaten. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten; percentages gaan altijd over het gebied zelf, niet over de hele gemeente.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-inkomen-hoog-pct",
    title: "Huishoudens met een hoog inkomen in {city}",
    subtitle:
      "Aandeel huishoudens met een hoog inkomen per PC4-gebied (CBS 2022)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op het percentage huishoudens met een hoog inkomen. Donkerder betekent een groter aandeel hoge inkomens. Samen met de laag *laag inkomen* schetst dit het sociaal-economische reliëf van de gemeente.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddeld aandeel hoog inkomen",
            type: "avg",
            property: "percentageHoogInkomenHuishouden",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Hoogste aandeel (PC4)",
            type: "max",
            property: "percentageHoogInkomenHuishouden",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Laagste aandeel (PC4)",
            type: "min",
            property: "percentageHoogInkomenHuishouden",
            unit: "%",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het aandeel hoge inkomens per PC4 in {city}",
        description:
          "Aantal postcodegebieden per klasse van het percentage huishoudens met een hoog inkomen",
        property: "percentageHoogInkomenHuishouden",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Per postcodegebied geeft het CBS het aandeel huishoudens met een hoog inkomen: huishoudens bovenin de landelijke inkomensverdeling. Ook dit is een relatief cijfer per gebied. Waar dit aandeel hoog is, ligt het aandeel lage inkomens meestal juist laag — de twee lagen zijn elkaars spiegelbeeld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Draagkracht en voorzieningen**: de inkomensmix beïnvloedt de lokale bestedingsruimte, het draagvlak voor voorzieningen en de gemeentelijke belastinggrondslag.\n- **Wonen**: gebieden met veel hoge inkomens hebben vaak een andere woningmix en woningwaarde; combineer met de WOZ-laag voor een vollediger beeld.\n- **Evenwicht in de stad**: de verdeling van hoge en lage inkomens laat zien hoe gemengd of gescheiden groepen wonen — relevant voor het bestrijden van kansenongelijkheid.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistiek *Gegevens per postcode* (PC4) via PDOK, jaargang **2022** (de laatste met gevulde inkomenscijfers). Gebieden zonder gepubliceerd cijfer worden weggelaten. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-woz",
    title: "WOZ-waarde van woningen in {city}",
    subtitle:
      "Gemiddelde WOZ-waarde per PC4-gebied (CBS 2023, × €1.000)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op de gemiddelde WOZ-waarde van woningen, in duizenden euro's. Donkerder betekent een hogere gemiddelde woningwaarde. Zo zie je de ruimtelijke verschillen in woningwaarde binnen de gemeente.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddelde WOZ-waarde (× €1.000)",
            type: "avg",
            property: "gemiddeldeWozWaardeWoning",
            unit: "k€",
            decimals: 0,
          },
          {
            label: "Laagste gebiedsgemiddelde",
            type: "min",
            property: "gemiddeldeWozWaardeWoning",
            unit: "k€",
            decimals: 0,
          },
          {
            label: "Hoogste gebiedsgemiddelde",
            type: "max",
            property: "gemiddeldeWozWaardeWoning",
            unit: "k€",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de gemiddelde WOZ-waarde per PC4 in {city}",
        description:
          "Aantal postcodegebieden per klasse van de gemiddelde WOZ-waarde (× €1.000)",
        property: "gemiddeldeWozWaardeWoning",
        unit: "k€",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De WOZ-waarde is de door de gemeente vastgestelde waarde van een woning, die jaarlijks wordt bepaald. Het CBS middelt die waarde per postcodegebied. Het is dus een gebiedsgemiddelde: dure en goedkope woningen binnen hetzelfde PC4 worden samengenomen. Een WOZ-waarde loopt door de peildatum meestal iets achter op de actuele marktprijs.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woningmarkt**: de WOZ-waarde is een goede proxy voor de lokale woningmarkt en voor verschillen in vermogen tussen wijken.\n- **Woonbeleid**: samen met het aandeel koopwoningen en de woningtypen helpt de WOZ-waarde bij het beoordelen van de betaalbaarheid en de gewenste woningmix.\n- **Gemeentefinanciën**: de WOZ vormt de grondslag voor de onroerendezaakbelasting; de verdeling zegt iets over de belastingcapaciteit per gebied.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistiek *Gegevens per postcode* (PC4) via PDOK. WOZ loopt iets minder achter dan inkomen; deze laag gebruikt daarom **jaargang 2023**, de laatste met gevulde WOZ-cijfers. Gebieden zonder woningen of zonder gepubliceerd cijfer worden weggelaten. De kaartuitsnede van {city} kan ook PC4-gebieden van buurgemeenten bevatten.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-stedelijkheid",
    title: "Stedelijkheid per postcodegebied in {city}",
    subtitle:
      "CBS-stedelijkheidsklasse (1 = zeer sterk stedelijk … 5 = niet stedelijk) per PC4",
    intro:
      "Deze laag deelt **{count} postcodegebieden** (PC4) in en rond {city} in naar hun mate van stedelijkheid, volgens de vijfdeling van het CBS. Klasse 1 is zeer sterk stedelijk, klasse 5 is niet stedelijk (landelijk). De klasse is afgeleid van de omgevingsadressendichtheid: hoe dichter de bebouwing, hoe stedelijker het gebied.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "(Zeer) sterk stedelijk (klasse 1-2)",
            type: "count-where",
            property: "stedelijkheid",
            equals: ["1", "2"],
          },
          {
            label: "Weinig / niet stedelijk (klasse 4-5)",
            type: "count-where",
            property: "stedelijkheid",
            equals: ["4", "5"],
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Postcodegebieden per stedelijkheidsklasse in {city}",
        description:
          "CBS-veld stedelijkheid: aantal PC4-gebieden per klasse (1 = zeer sterk stedelijk … 5 = niet stedelijk)",
        property: "stedelijkheid",
        valueLabels: {
          "1": "1 – Zeer sterk stedelijk",
          "2": "2 – Sterk stedelijk",
          "3": "3 – Matig stedelijk",
          "4": "4 – Weinig stedelijk",
          "5": "5 – Niet stedelijk",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De stedelijkheidsklasse is een **ordinale** indeling in vijf stappen die het CBS afleidt uit de omgevingsadressendichtheid: het aantal adressen per km² in de omgeving van een gebied. Een binnenstad met veel functies dicht op elkaar valt in klasse 1; een buitengebied met verspreide bebouwing in klasse 5. De klasse zegt dus iets over de dichtheid en het karakter van het gebied, niet over inwonertal of oppervlakte.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beleid op maat**: veel normen en voorzieningenafwegingen (parkeren, OV, groen, winkelaanbod) verschillen sterk tussen stedelijke en landelijke gebieden; de klasse maakt die context expliciet.\n- **Verstedelijkingsopgave**: de spreiding van klassen laat zien waar de gemeente compact-stedelijk is en waar juist dorps of landelijk — relevant voor waar verdichting logisch is.\n- **Vergelijkbaarheid**: het is een landelijk gestandaardiseerde maat, ideaal om gebieden en gemeenten onderling te vergelijken.",
      },
      {
        heading: "Over de bron",
        body: "De klasse komt uit de CBS-statistiek *Gegevens per postcode* (PC4, jaargang 2024) via PDOK en wordt jaarlijks geactualiseerd. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten. Wil je het onderliggende, continue cijfer zien? Gebruik de laag *Omgevingsadressendichtheid*.",
      },
    ],
    links: [
      {
        label: "CBS: uitleg stedelijkheid",
        url: "https://www.cbs.nl/nl-nl/nieuws/2019/44/steeds-meer-mensen-wonen-in-stedelijk-gebied",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-omgevingsadressendichtheid",
    title: "Omgevingsadressendichtheid in {city}",
    subtitle:
      "Aantal adressen per km² in de omgeving, per PC4-gebied (CBS 2024)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op de omgevingsadressendichtheid: het gemiddeld aantal adressen per km² in de omgeving van een gebied. Donkerder betekent een dichter bebouwde omgeving. Dit is de continue maat waaruit het CBS de stedelijkheidsklasse afleidt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddelde dichtheid",
            type: "avg",
            property: "omgevingsadressendichtheid",
            unit: "adr/km²",
            decimals: 0,
          },
          {
            label: "Hoogste dichtheid (PC4)",
            type: "max",
            property: "omgevingsadressendichtheid",
            unit: "adr/km²",
            decimals: 0,
          },
          {
            label: "Laagste dichtheid (PC4)",
            type: "min",
            property: "omgevingsadressendichtheid",
            unit: "adr/km²",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de omgevingsadressendichtheid per PC4 in {city}",
        description:
          "Aantal postcodegebieden per dichtheidsklasse (adressen per km² in de omgeving)",
        property: "omgevingsadressendichtheid",
        unit: "adr/km²",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De omgevingsadressendichtheid (OAD) telt hoeveel adressen — woningen én bedrijven — er gemiddeld per km² binnen een straal van één kilometer rondom de adressen in een gebied liggen. Het is de standaardmaat van het CBS voor stedelijkheid: hoge waarden horen bij compacte binnensteden, lage waarden bij landelijk gebied. Anders dan de klasse-indeling is dit een continu getal, zodat ook binnen dezelfde stedelijkheidsklasse verschillen zichtbaar blijven.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Fijnmazige dichtheidskaart**: de OAD toont dichtheidsverschillen die de vijf klassen van de stedelijkheidslaag afvlakken — nuttig om gradaties binnen de stad te zien.\n- **Voorzieningen en mobiliteit**: dichtheid is een belangrijke verklaring voor draagvlak voor OV, winkels en andere voorzieningen op loopafstand.\n- **Verdichtingsbeleid**: de kaart helpt bepalen waar al hoge dichtheid is bereikt en waar nog ruimte zit voor intensivering.",
      },
      {
        heading: "Over de bron",
        body: "De OAD komt uit de CBS-statistiek *Gegevens per postcode* (PC4, jaargang 2024) via PDOK en wordt jaarlijks geactualiseerd. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten. Voor de vereenvoudigde vijfdeling: zie de laag *Stedelijkheid*.",
      },
    ],
    links: [
      {
        label: "CBS: begrip omgevingsadressendichtheid",
        url: "https://www.cbs.nl/nl-nl/onze-diensten/methoden/begrippen/omgevingsadressendichtheid",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-koopwoningen-pct",
    title: "Aandeel koopwoningen in {city}",
    subtitle:
      "Percentage koopwoningen op de woningvoorraad per PC4-gebied (CBS 2024)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op het aandeel koopwoningen in de woningvoorraad. Donkerder betekent een groter aandeel koop; lichte gebieden zijn juist huurdominant. Zo wordt de eigendomsverhouding tussen wijken in één beeld zichtbaar.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddeld aandeel koopwoningen",
            type: "avg",
            property: "percentageKoopwoningen",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Hoogste aandeel koop (PC4)",
            type: "max",
            property: "percentageKoopwoningen",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Laagste aandeel koop (PC4)",
            type: "min",
            property: "percentageKoopwoningen",
            unit: "%",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het aandeel koopwoningen per PC4 in {city}",
        description:
          "Aantal postcodegebieden per klasse van het percentage koopwoningen",
        property: "percentageKoopwoningen",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Per postcodegebied geeft het CBS welk deel van de woningvoorraad een koopwoning is; de rest bestaat uit huurwoningen (particulier én corporatie). Het is een aandeel per gebied, gebaseerd op de hele voorraad — niet op recent verkochte woningen. Een hoog percentage koop wijst meestal op eengezins- en grondgebonden wijken, een laag percentage vaak op corporatie- of gestapelde woningbouw.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woningmix en betaalbaarheid**: de koop-huurverhouding is een kernindicator bij het sturen op een evenwichtige woningvoorraad en voldoende betaalbare huur.\n- **Doorstroming en wooncarrière**: gebieden met veel huur en weinig koop bieden minder mogelijkheden voor een wooncarrière binnen de wijk.\n- **Beleidscombinatie**: leg de laag naast WOZ-waarde en woningtype (meergezins) om de aard van de lokale woningmarkt scherp te krijgen.",
      },
      {
        heading: "Over de bron",
        body: "De cijfers komen uit de CBS-statistiek *Gegevens per postcode* (PC4, jaargang 2024) via PDOK. Gebieden zonder woningvoorraad of zonder gepubliceerd cijfer worden weggelaten. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-meergezins-pct",
    title: "Aandeel meergezinswoningen in {city}",
    subtitle:
      "Percentage gestapelde woningen per PC4-gebied (CBS 2024, afgeleid)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op het aandeel meergezinswoningen: gestapelde woningen zoals flats, appartementen en portiekwoningen. Donkerder betekent meer gestapelde bouw; lichte gebieden bestaan vooral uit grondgebonden eengezinswoningen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddeld aandeel meergezins",
            type: "avg",
            property: "percentageMeergezinsWoningen",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Hoogste aandeel meergezins (PC4)",
            type: "max",
            property: "percentageMeergezinsWoningen",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Laagste aandeel meergezins (PC4)",
            type: "min",
            property: "percentageMeergezinsWoningen",
            unit: "%",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het aandeel meergezinswoningen per PC4 in {city}",
        description:
          "Aantal postcodegebieden per klasse van het percentage gestapelde woningen",
        property: "percentageMeergezinsWoningen",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het aandeel meergezinswoningen is hier **afgeleid**: het aantal meergezinswoningen gedeeld door de totale woningvoorraad per postcodegebied, op basis van de CBS-cijfers. Meergezinswoningen zijn woningen die deel uitmaken van een groter gebouw met meerdere zelfstandige woningen (flats, appartementen, boven- en benedenwoningen). Een hoog percentage duidt op verdichte, stedelijke woonmilieus.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woningtype en dichtheid**: het aandeel gestapelde bouw zegt veel over het woonmilieu en de bereikte dichtheid van een gebied.\n- **Doelgroepen**: meergezinswoningen huisvesten relatief vaak eenpersoonshuishoudens, starters en ouderen; combineer met de laag *eenpersoonshuishoudens* voor context.\n- **Verdichtingskansen**: de kaart laat zien waar al gestapeld wordt gewoond en waar transformatie naar meer gestapelde bouw denkbaar is.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Het percentage wordt afgeleid uit de CBS-statistiek *Gegevens per postcode* (PC4, jaargang 2024) via PDOK: aantal meergezinswoningen ten opzichte van de totale woningvoorraad. Gebieden zonder woningvoorraad worden weggelaten. Als afgeleide maat kan het licht afwijken van een rechtstreeks gepubliceerd CBS-cijfer. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-eenpersoonshh-pct",
    title: "Aandeel eenpersoonshuishoudens in {city}",
    subtitle:
      "Percentage alleenstaanden per PC4-gebied (CBS 2024, afgeleid)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op het aandeel eenpersoonshuishoudens: huishoudens van één persoon. Donkerder betekent relatief veel alleenwonenden. Zo wordt zichtbaar waar de huishoudensverdunning het sterkst is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddeld aandeel eenpersoons",
            type: "avg",
            property: "percentageEenpersoonshuishoudens",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Hoogste aandeel (PC4)",
            type: "max",
            property: "percentageEenpersoonshuishoudens",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Laagste aandeel (PC4)",
            type: "min",
            property: "percentageEenpersoonshuishoudens",
            unit: "%",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het aandeel eenpersoonshuishoudens per PC4 in {city}",
        description:
          "Aantal postcodegebieden per klasse van het percentage eenpersoonshuishoudens",
        property: "percentageEenpersoonshuishoudens",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het aandeel eenpersoonshuishoudens is hier **afgeleid**: het aantal eenpersoonshuishoudens gedeeld door het totaal aantal particuliere huishoudens per postcodegebied. Alleenwonenden concentreren zich vaak in stedelijke, gestapelde woonmilieus en in gebieden met veel studenten of ouderen. Het gaat om huishoudens, niet om personen: één alleenwonende telt als één huishouden.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Woningbehoefte**: een hoog aandeel alleenwonenden vraagt om kleinere, betaalbare woningen; de huishoudensverdunning is een belangrijke motor achter de woningbouwopgave.\n- **Zorg en eenzaamheid**: onder eenpersoonshuishoudens — vooral oudere alleenstaanden — speelt eenzaamheid en zorgvraag vaker; de kaart helpt bij het richten van welzijnsbeleid.\n- **Voorzieningen**: de huishoudenssamenstelling beïnvloedt de vraag naar voorzieningen, van buurtontmoeting tot dagbesteding.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Het percentage wordt afgeleid uit de CBS-statistiek *Gegevens per postcode* (PC4, jaargang 2024) via PDOK: eenpersoonshuishoudens ten opzichte van alle particuliere huishoudens. Gebieden zonder huishoudens worden weggelaten. Als afgeleide maat kan het licht afwijken van een rechtstreeks gepubliceerd cijfer. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-leeftijd-25-45-pct",
    title: "Aandeel inwoners van 25 tot 45 jaar in {city}",
    subtitle:
      "Percentage inwoners in de leeftijd 25–45 jaar per PC4-gebied (CBS 2024, afgeleid)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op het aandeel inwoners van 25 tot 45 jaar — de leeftijdsgroep van veel starters, jonge gezinnen en werkenden. Donkerder betekent een relatief jonge, volwassen bevolking in dat gebied.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddeld aandeel 25-45 jaar",
            type: "avg",
            property: "percentageInwoners25Tot45Jaar",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Hoogste aandeel (PC4)",
            type: "max",
            property: "percentageInwoners25Tot45Jaar",
            unit: "%",
            decimals: 0,
          },
          {
            label: "Laagste aandeel (PC4)",
            type: "min",
            property: "percentageInwoners25Tot45Jaar",
            unit: "%",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het aandeel 25-45-jarigen per PC4 in {city}",
        description:
          "Aantal postcodegebieden per klasse van het percentage inwoners van 25 tot 45 jaar",
        property: "percentageInwoners25Tot45Jaar",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het aandeel 25–45-jarigen is hier **afgeleid**: het aantal inwoners van 25 tot 45 jaar gedeeld door het totale inwonertal per postcodegebied. Deze leeftijdsgroep — vaak starters op de woningmarkt en gezinnen met jonge kinderen — clustert doorgaans in stedelijke wijken en nieuwbouwgebieden. Een laag aandeel wijst vaak op vergrijzende of juist zeer jonge (kinderrijke) buurten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Voorzieningen voor jonge gezinnen**: waar veel 25–45-jarigen wonen, is de vraag naar kinderopvang, basisscholen en speelvoorzieningen groter.\n- **Woningmarktdynamiek**: deze groep is bepalend voor doorstroming en de vraag naar starters- en gezinswoningen.\n- **Demografische balans**: samen met andere leeftijdsgroepen laat dit zien of een gebied vergrijst, verjongt of in evenwicht is.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Het percentage wordt afgeleid uit de CBS-statistiek *Gegevens per postcode* (PC4, jaargang 2024) via PDOK: inwoners 25–45 jaar ten opzichte van het totale inwonertal. Gebieden zonder (geregistreerde) inwoners worden weggelaten. Als afgeleide maat kan het licht afwijken van een rechtstreeks gepubliceerd cijfer. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten.",
      },
    ],
    links: [
      {
        label: "CBS: gegevens per postcode",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/gegevens-per-postcode",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "cbs-pc4-horeca-1km",
    title: "Nabijheid van horeca in {city}",
    subtitle:
      "Afstand tot het dichtstbijzijnde café of restaurant per PC4-gebied (CBS, afgeleid)",
    intro:
      "Deze laag kleurt **{count} postcodegebieden** (PC4) in en rond {city} op de afstand tot de dichtstbijzijnde horecagelegenheid — het minimum van de afstand tot een café en tot een restaurant, als proxy voor horeca-nabijheid. Kortere afstanden (lichtere kleuren) wijzen op levendige, voorzieningenrijke gebieden.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Inwoners in deze gebieden",
            type: "sum",
            property: "aantalInwoners",
            decimals: 0,
          },
          {
            label: "Gemiddelde afstand tot horeca",
            type: "avg",
            property: "dichtstbijzijndeHorecaAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Grootste afstand (PC4)",
            type: "max",
            property: "dichtstbijzijndeHorecaAfstandInKm",
            unit: "km",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de afstand tot horeca per PC4 in {city}",
        description:
          "Aantal postcodegebieden per afstandsklasse tot het dichtstbijzijnde café of restaurant",
        property: "dichtstbijzijndeHorecaAfstandInKm",
        unit: "km",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elk postcodegebied berekent het CBS de gemiddelde afstand van de inwoners tot het dichtstbijzijnde café en tot het dichtstbijzijnde restaurant. Deze laag neemt daarvan de **kleinste** afstand als één horeca-nabijheidsmaat. Het is een afstand via het wegennet, niet hemelsbreed, en één cijfer per gebied — binnen een groot buitengebied-PC4 kunnen de werkelijke afstanden variëren.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Levendigheid en ontmoeting**: horeca op korte afstand draagt bij aan levendige, gemengde woonmilieus en aan ontmoeting in de buurt.\n- **Centrum versus rand**: de kaart brengt scherp in beeld hoe sterk voorzieningen zich in en rond het centrum concentreren en waar de rand of het buitengebied verstoken is.\n- **Voorzieningenbeleid**: samen met andere nabijheidscijfers helpt dit bij het beoordelen van de voorzieningendekking per gebied.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De onderliggende afstanden komen uit de CBS-statistiek *Gegevens per postcode* (PC4) via PDOK; deze horeca-maat is afgeleid door café- en restaurantafstand te combineren. Belangrijk: de nabijheids- en afstandsvelden worden per jaargang gefaseerd gevuld en staan in de nieuwste release soms nog op een lege waarde. Ontbrekende waarden worden automatisch weggelaten uit de statistieken en grafiek; is de afstandsdata voor de actuele jaargang nog niet gepubliceerd, dan blijven de afstandsgrafieken leeg en zie je vooral het aantal gebieden en inwoners. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten.",
      },
    ],
    links: [
      {
        label: "CBS: nabijheid voorzieningen",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/nabijheid-voorzieningen",
      },
      {
        label: "PDOK: CBS postcodestatistieken",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
    ],
  },
  {
    layerId: "bzk-leefbaarometer",
    title: "Leefbaarheid per buurt in {city}",
    subtitle:
      "Leefbaarometer 3.1 van het Ministerie van BZK — leefbaarheidsscore per buurt (peiljaar 2024)",
    intro:
      "Deze laag toont de **Leefbaarometer** voor **{count} buurten** in en rond {city}: een landelijk model van het Ministerie van BZK dat de leefbaarheid per buurt inschat. Elke buurt krijgt een klassescore van 1 (zeer onvoldoende) tot 9 (uitstekend), opgebouwd uit vijf dimensies. Donkerder groen betekent een hogere score.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gemiddelde klassescore (1-9)",
            type: "avg",
            property: "kscore",
            decimals: 1,
          },
          {
            label: "Buurten met score 7 of hoger",
            type: "count-where",
            property: "kscore",
            equals: ["7", "8", "9"],
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
        title: "Buurten per leefbaarheidsklasse in {city}",
        description:
          "Leefbaarometer-veld kscore: aantal buurten per klasse (1 = zeer onvoldoende … 9 = uitstekend)",
        property: "kscore",
        maxCategories: 9,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De **Leefbaarometer** is een model dat de leefbaarheid van een buurt afleidt uit ruim honderd omgevingskenmerken, gegroepeerd in vijf dimensies: *woningen*, *bewoners*, *voorzieningen*, *veiligheid* en *fysieke omgeving*. Het model rekent die samen tot één score, die per buurt in een klasse van 1 tot 9 wordt uitgedrukt. Het is nadrukkelijk een modelmatige inschatting van de leefomgeving — geen enquête onder bewoners en geen oordeel over individuele mensen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Signaleren en volgen**: de Leefbaarometer helpt gemeenten en het Rijk om buurten met leefbaarheidsdruk vroeg te signaleren en ontwikkelingen over de tijd te volgen.\n- **Onderbouwing van programma's**: de scores worden gebruikt bij de selectie van focus- en aandachtsgebieden, zoals in het Nationaal Programma Leefbaarheid en Veiligheid.\n- **Dimensies als diagnose**: doordat de score is opgebouwd uit vijf dimensies, kun je nagaan óf en waaróm een buurt onder druk staat — bijvoorbeeld door de woningvoorraad of door veiligheid.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt van de **Leefbaarometer 3.1** (peiljaar 2024) van het Ministerie van BZK, via de WFS-service van de Leefbaarometer. Aandachtspunten:\n- De score is modelmatig en indicatief; lees hem als richting, niet als exacte waarheid over een buurt.\n- De kaart toont buurten binnen de uitsnede van {city} en kan dus ook buurten van buurgemeenten bevatten — het veld *gemeente* geeft uitsluitsel.\n- De indeling in buurten volgt de CBS-buurtgrenzen; zeer kleine of onbewoonde buurten kunnen ontbreken of afwijken.",
      },
    ],
    links: [
      { label: "Leefbaarometer", url: "https://www.leefbaarometer.nl/" },
      {
        label: "Rijksoverheid: Leefbaarometer",
        url: "https://www.rijksoverheid.nl/onderwerpen/leefbaarheid",
      },
    ],
  },
];
