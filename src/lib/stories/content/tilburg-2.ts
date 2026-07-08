/**
 * Story maps — batch "tilburg-2": gemeentelijke lagen van gemeente Tilburg.
 *
 * Lagen (Gemeente Tilburg GIS, ArcGIS FeatureServer — alleen zichtbaar in
 * Tilburg): tlb-geluidsprognose, tlb-bodemkwaliteitskaart,
 * tlb-grondwatermeetnet, tlb-grondwaterbescherming,
 * tlb-bodemkwaliteit-ondergrond, tlb-bodemtoepassing-bovengrond,
 * tlb-rioolvlakken, tlb-blauwe-ader, tlb-structuurvisie-ondergrond,
 * tlb-hoogtemerken, tlb-hoogspanning, tlb-milieuzone.
 *
 * Alle grafiek-properties zijn geverifieerd tegen een live sample van de
 * betreffende ArcGIS-laag (groupBy-telling per veld).
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "tlb-geluidsprognose",
    title: "Geluidbelasting prognose 2030 in {city}",
    subtitle:
      "Cumulatieve geluidbelasting (Lden) volgens de prognosekaart voor 2030",
    intro:
      "Deze laag toont **{count} geluidzones** binnen het kaartgebied van {city}: vlakken uit de gemeentelijke geluidbelastingkaart met de verwachte *cumulatieve* geluidbelasting in 2030, uitgedrukt in **Lden** (de Europese dag-avond-nacht-maat). “Cumulatief” betekent dat alle bronnen — wegverkeer, spoor, industrie — bij elkaar zijn opgeteld. Elk vlak hoort bij een geluidklasse van 5 dB; hoe hoger de klasse, hoe zwaarder belast.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Geluidzones in beeld", type: "count" },
          {
            label: "Zones ≥ 65 dB Lden",
            type: "count-where",
            property: "HIGH_VAL",
            equals: ["70", "75", "100"],
          },
          {
            label: "Zwaarst belast (> 75 dB)",
            type: "count-where",
            property: "HIGH_VAL",
            equals: "100",
          },
          {
            label: "Aandeel ≥ 65 dB",
            type: "count-where",
            property: "HIGH_VAL",
            equals: ["70", "75", "100"],
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Geluidzones per belastingklasse in {city}",
        description:
          "Bovengrens van de Lden-klasse (veld HIGH_VAL): het aantal vlakken per 5 dB-band",
        property: "HIGH_VAL",
        valueLabels: {
          "60": "55–60 dB",
          "65": "60–65 dB",
          "70": "65–70 dB",
          "75": "70–75 dB",
          "100": "> 75 dB",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk gekleurd vlak is een gebied met een verwachte geluidbelasting in een bepaalde klasse. De klassen lopen van *55–60 dB* (lichtst weergegeven) tot *boven de 75 dB* (zwaarst belast). De waarde is **Lden**: het gemiddelde geluidniveau over een etmaal, waarbij avond (+5 dB) en nacht (+10 dB) zwaarder meetellen omdat geluid dan als hinderlijker wordt ervaren. Omdat het om een *prognose voor 2030* gaat, is dit een modelberekening op basis van verwachte verkeers- en activiteitscijfers, geen momentopname.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: langdurige blootstelling aan hoge geluidniveaus hangt samen met slaapverstoring, stress en hart- en vaatziekten; de WHO adviseert ruim onder de hoogste klassen te blijven.\n- **Woningbouw**: bij nieuwbouw in zones met hoge belasting gelden aanvullende eisen (geluidluwe gevels, hogere-waarde-procedures); deze kaart laat zien waar dat speelt.\n- **Bronbeleid**: cumulatieve kaarten helpen bij het afwegen van maatregelen zoals stiller asfalt, geluidschermen of snelheidsverlaging op de drukste corridors.",
      },
      {
        heading: "Over de bron",
        body: "De kaart komt uit de geluidbelastingkaart (cumulatief, prognose 2030) van Gemeente Tilburg, ontsloten via de gemeentelijke ArcGIS-omgeving. De statistieken gaan over de vlakken binnen de kaartuitsnede van {city}; grote aaneengesloten belaste gebieden kunnen als meerdere vlakken zijn opgeknipt.",
      },
    ],
    links: [
      {
        label: "Atlas Leefomgeving — geluid",
        url: "https://www.atlasleefomgeving.nl/geluid",
      },
      {
        label: "Brondienst: Geluidsprognose 2030 (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Geluidsprognose2030/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-bodemkwaliteitskaart",
    title: "Bodemkwaliteitskaart — ontgraving bovengrond in {city}",
    subtitle:
      "Ontgravingsklassen van de bovengrond (0–0,5 m): welke kwaliteit komt vrij bij ontgraven?",
    intro:
      "Deze laag toont **{count} bodemvlakken** in het kaartgebied van {city} met de **ontgravingsklasse van de bovengrond** (de bovenste halve meter). De ontgravingsklasse zegt welke gemiddelde bodemkwaliteit je mag verwachten als je hier grond ontgraaft — belangrijk om te weten of vrijkomende grond elders hergebruikt mag worden. De indeling volgt het generieke kader van het Besluit bodemkwaliteit.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          {
            label: "Klasse Landbouw/natuur",
            type: "count-where",
            property: "OBG",
            equals: "Landbouw/natuur",
          },
          {
            label: "Aandeel Landbouw/natuur",
            type: "count-where",
            property: "OBG",
            equals: "Landbouw/natuur",
            asShare: true,
          },
          { label: "Bodemfunctieklassen", type: "distinct", property: "BFK" },
        ],
      },
      {
        kind: "category-bar",
        title: "Ontgravingsklasse bovengrond in {city}",
        description:
          "Veld OBG: de gemiddelde bodemkwaliteitsklasse van de bovengrond per vlak",
        property: "OBG",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak heeft een **ontgravingsklasse**: de verwachte gemiddelde kwaliteit van de grond die vrijkomt bij ontgraven van de bovengrond. *Landbouw/natuur* is de schoonste klasse, *Wonen* en *Industrie* staan voor een ruimere achtergrondbelasting. *Niet gezoneerd* betekent dat het gebied buiten de statistische zonering valt (bijvoorbeeld nieuwe of afwijkende locaties) en dat losse bodemonderzoeken leidend zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Grondverzet**: de ontgravingsklasse bepaalt of vrijkomende grond zonder aanvullend onderzoek elders mag worden toegepast — dat scheelt kosten en onderzoekstijd.\n- **Ruimtelijke ontwikkeling**: bij bouwrijp maken en herinrichting is de bodemkwaliteit een randvoorwaarde; deze kaart is het startpunt van de bodemtoets.\n- **Hergebruik**: samen met de toepassingskaart (waar mag grond naartoe?) vormt de ontgravingskaart de basis voor duurzaam, lokaal hergebruik van grond.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De kaart is de Tilburgse bodemkwaliteitskaart, ontsloten via de gemeentelijke ArcGIS-omgeving. Let op: een bodemkwaliteitskaart is een *statistisch gemiddelde* per zone, geen garantie voor een individueel perceel — bij een concrete locatie kan aanvullend bodemonderzoek nodig zijn. De cijfers gaan over de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Rijkswaterstaat Bodem+ — Besluit bodemkwaliteit",
        url: "https://www.bodemplus.nl/",
      },
      {
        label: "Brondienst: Bodemkwaliteitskaart (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Bodem_Bodemkwaltiteitskaart/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-bodemkwaliteit-ondergrond",
    title: "Bodemkwaliteitskaart — ontgraving ondergrond in {city}",
    subtitle:
      "Ontgravingsklassen van de ondergrond (dieper dan 0,5 m) volgens de bodemkwaliteitskaart",
    intro:
      "Deze laag toont **{count} bodemvlakken** in het kaartgebied van {city} met de **ontgravingsklasse van de ondergrond** — de laag onder de bovenste halve meter. Waar de bovengrond vaak sterker beïnvloed is door bebouwing en historisch gebruik, is de ondergrond doorgaans schoner. Deze kaart laat zien welke kwaliteit je bij dieper graafwerk mag verwachten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          {
            label: "Klasse Landbouw/natuur",
            type: "count-where",
            property: "OOG",
            equals: "Landbouw/natuur",
          },
          {
            label: "Aandeel Landbouw/natuur",
            type: "count-where",
            property: "OOG",
            equals: "Landbouw/natuur",
            asShare: true,
          },
          { label: "Ontgravingsklassen", type: "distinct", property: "OOG" },
        ],
      },
      {
        kind: "category-bar",
        title: "Ontgravingsklasse ondergrond in {city}",
        description:
          "Veld OOG: de gemiddelde bodemkwaliteitsklasse van de ondergrond per vlak",
        property: "OOG",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak heeft een **ontgravingsklasse voor de ondergrond**: de verwachte kwaliteit van de grond die vrijkomt bij dieper ontgraven. In {city} valt het overgrote deel in de klasse *Landbouw/natuur* — de schoonste categorie — wat past bij het beeld dat diepere bodemlagen minder beïnvloed zijn door historisch stedelijk gebruik. *Niet gezoneerd* markeert gebieden buiten de statistische zonering.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Diepe ingrepen**: bij kelders, kabels en leidingen, funderingen of bodemenergie wordt juist de ondergrond ontgraven; dan is déze klasse leidend, niet de bovengrond.\n- **Grondbalans**: schone ondergrond is waardevol en breed herbruikbaar; het scheiden van boven- en ondergrond bij graafwerk voorkomt onnodige afvoer naar een depot.\n- **Kostenbeheersing**: vooraf weten welke kwaliteit vrijkomt beperkt verrassingen en versnelt de bodemtoets bij projecten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De kaart is de Tilburgse bodemkwaliteitskaart (ondergrond), ontsloten via de gemeentelijke ArcGIS-omgeving. Net als bij de bovengrond geldt: de klasse is een *zonegemiddelde*, geen perceelsgarantie. De cijfers gaan over de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Rijkswaterstaat Bodem+ — Besluit bodemkwaliteit",
        url: "https://www.bodemplus.nl/",
      },
      {
        label: "Brondienst: Bodemkwaliteitskaart (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Bodem_Bodemkwaltiteitskaart/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-bodemtoepassing-bovengrond",
    title: "Bodemkwaliteitskaart — toepassing bovengrond in {city}",
    subtitle:
      "Toepassingsklassen: welke kwaliteit grond mag hier (bovengronds) worden aangebracht?",
    intro:
      "Waar de ontgravingskaart zegt wat er *uit* de bodem komt, zegt deze **toepassingskaart** wat er *in* mag: welke kwaliteitsklasse grond je bovengronds mag toepassen op een locatie. Binnen het kaartgebied van {city} zijn **{count} vlakken** ingedeeld naar de maximaal toegestane bodemkwaliteit voor hergebruik van grond.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bodemvlakken in beeld", type: "count" },
          {
            label: "Toepassing Landbouw/natuur",
            type: "count-where",
            property: "TBG",
            equals: ["Landbouw/natuur", "Landbouw/natuur @@"],
          },
          {
            label: "Maatwerk / in overleg",
            type: "count-where",
            property: "TBG",
            equals: [
              "In overleg met de gemeente",
              "Afhankelijk van de kwaliteit ontvangende bodem",
            ],
          },
          { label: "Toepassingsklassen", type: "distinct", property: "TBG" },
        ],
      },
      {
        kind: "category-bar",
        title: "Toepassingsklasse bovengrond in {city}",
        description:
          "Veld TBG: de maximaal toe te passen bodemkwaliteit per vlak",
        property: "TBG",
        valueLabels: {
          "Landbouw/natuur @@": "Landbouw/natuur",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke toepassingsklasse geeft de **maximaal toegestane kwaliteit** van grond die je hier bovengronds mag aanbrengen. *Landbouw/natuur* is het strengst (alleen schone grond mag erbij), terwijl *Afhankelijk van de kwaliteit ontvangende bodem* betekent dat de aanwezige bodem de norm bepaalt. Staat er *In overleg met de gemeente*, dan is een concrete beoordeling nodig voordat grond wordt toegepast.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Standstill-principe**: het Besluit bodemkwaliteit wil dat toepassing van grond de bodem niet verslechtert; de toepassingsklasse borgt dat op gebiedsniveau.\n- **Lokaal hergebruik**: door ontgravings- en toepassingskaart te combineren kan grond binnen de gemeente circuleren zonder kostbare afvoer en aanvoer.\n- **Vergunningverlening**: de klasse is een direct toetsingskader bij meldingen voor grondverzet en bij herinrichtingsprojecten.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De kaart is de Tilburgse bodemkwaliteitskaart (toepassing bovengrond), via de gemeentelijke ArcGIS-omgeving. De klasse is een zonegemiddelde en dus een vertrekpunt, geen eindoordeel voor een individueel perceel. De cijfers betreffen de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Rijkswaterstaat Bodem+ — grond toepassen",
        url: "https://www.bodemplus.nl/",
      },
      {
        label: "Brondienst: Bodemkwaliteitskaart (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Bodem_Bodemkwaltiteitskaart/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-grondwaterbescherming",
    title: "Grondwaterbeschermingsgebied in {city}",
    subtitle:
      "Zones rond drinkwaterwinningen waar strengere regels gelden voor bodemingrepen",
    intro:
      "Deze laag toont **{count} vlakken** in het kaartgebied van {city} die samenhangen met de bescherming van het grondwater rond drinkwaterwinningen. In een grondwaterbeschermingsgebied gelden extra beperkingen voor activiteiten die het grondwater kunnen vervuilen — van bodemenergie tot het toepassen van grond. De laag maakt onderdeel uit van de Tilburgse bodemkwaliteitskaart en draagt daarvan de bodemfunctie-indeling.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vlakken in beeld", type: "count" },
          {
            label: "Bodemfunctie Wonen",
            type: "count-where",
            property: "BFK",
            equals: "Wonen",
          },
          {
            label: "Bodemfunctie Landbouw/natuur",
            type: "count-where",
            property: "BFK",
            equals: "Landbouw/natuur",
          },
          { label: "Bodemfunctieklassen", type: "distinct", property: "BFK" },
        ],
      },
      {
        kind: "category-bar",
        title: "Bodemfunctieklasse binnen de gekarteerde gebieden in {city}",
        description:
          "Veld BFK: de bodemfunctieklasse (Wonen / Industrie / Landbouw/natuur) van de vlakken",
        property: "BFK",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Grondwaterbeschermingsgebieden liggen rond winningen waaruit drinkwater wordt gewonnen. Hoe dichter bij de winput, hoe strenger de regels: in de kern (het waterwingebied) is vrijwel geen risicovolle activiteit toegestaan, in de bredere beschermingszone gelden voorwaarden. De vlakken op deze kaart dragen de **bodemfunctieklasse** (BFK) uit de bodemkwaliteitskaart — een indicatie van het overheersende gebruik (wonen, industrie of landbouw/natuur) binnen het gebied.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Drinkwaterveiligheid**: het grondwater hier is een bron voor de openbare drinkwatervoorziening; verontreiniging is vaak onomkeerbaar en duur te saneren.\n- **Vergunningen**: bodemenergie (WKO), ondergrondse opslag, bepaalde bedrijfsactiviteiten en grondtoepassing zijn in deze zones aan strengere regels of een verbod gebonden.\n- **Ruimtelijke keuzes**: de provincie en gemeente sturen actief op functies die passen bij bescherming van de bron.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag is een sublaag van de Tilburgse bodemkwaliteitskaart en gebruikt dezelfde vlakindeling; de exacte juridische begrenzing en zonering van grondwaterbescherming staat in de provinciale omgevingsverordening. Raadpleeg bij een concrete locatie altijd de geldende verordening. De cijfers betreffen de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Atlas Leefomgeving — grondwaterbeschermingsgebieden",
        url: "https://www.atlasleefomgeving.nl/",
      },
      {
        label: "Brondienst: Grondwaterbeschermingsgebied (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Bodem_Bodemkwaltiteitskaart/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-grondwatermeetnet",
    title: "Grondwatermeetnet in {city}",
    subtitle:
      "Peilbuizen waarmee de gemeente de grondwaterstand in de gaten houdt",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} meetpunten** van het gemeentelijk grondwatermeetnet: peilbuizen waarmee Tilburg de grondwaterstand meet, vaak automatisch via dataloggers. Zo houdt de gemeente zicht op te hoge of te lage grondwaterstanden — beide kunnen tot overlast of schade leiden. Klik op een punt voor details zoals meetpuntcode, buislengte en de hoogte van het maaiveld ten opzichte van NAP.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Meetpunten in beeld", type: "count" },
          { label: "Unieke peilbuizen", type: "distinct", property: "MEETPUNT" },
          {
            label: "Gem. maaiveldhoogte",
            type: "avg",
            property: "HOOGTEMAAIVELD",
            unit: "m NAP",
            decimals: 1,
          },
          {
            label: "Waterpassing gereed",
            type: "count-where",
            property: "WATERPASSINGGEREED",
            equals: "ja",
          },
        ],
      },
      {
        kind: "histogram",
        title: "Maaiveldhoogte van de meetpunten in {city}",
        description:
          "Veld HOOGTEMAAIVELD: de hoogte van het maaiveld bij elke peilbuis, in meters t.o.v. NAP",
        property: "HOOGTEMAAIVELD",
        unit: "m NAP",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een **peilbuis**: een verticale buis in de grond met een filter, waarin de grondwaterstand wordt afgelezen. De gemeente registreert per buis onder meer de buislengte, de hoogte van bovenkant buis en maaiveld ten opzichte van **NAP** (Normaal Amsterdams Peil), en of de buis is ingemeten (*waterpassing*). Veel buizen hebben een datalogger die de stand automatisch en frequent vastlegt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Wateroverlast en droogte**: te hoge standen geven natte kruipruimtes en tuinen, te lage standen kunnen leiden tot funderingsschade (paalrot) en verdroging van groen.\n- **Klimaatadaptatie**: langjarige meetreeksen laten trends zien en onderbouwen maatregelen zoals drainage, infiltratie of het vasthouden van water.\n- **Bouwen en ondergrond**: bij nieuwbouw, kelders en bodemenergie is de grondwaterstand een harde ontwerprandvoorwaarde.",
      },
      {
        heading: "Over de bron",
        body: "De meetpunten komen uit het grondwatermeetnet van Gemeente Tilburg, ontsloten via de gemeentelijke ArcGIS-omgeving. De laag toont de meetlocaties en hun kenmerken; de actuele en historische standen zelf zitten in de achterliggende meetreeksen. De statistieken gaan over de meetpunten binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Brondienst: Grondwatermeetnet (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Grondwatermeetnet/FeatureServer",
      },
      {
        label: "Over NAP (Normaal Amsterdams Peil)",
        url: "https://www.rijkswaterstaat.nl/water/waterbeheer/normaal-amsterdams-peil",
      },
    ],
  },
  {
    layerId: "tlb-rioolvlakken",
    title: "Rioolvlakkenkaart in {city}",
    subtitle:
      "Afvoervlakken van het gemeentelijke rioolstelsel, gekoppeld aan de rioolrevisietekeningen",
    intro:
      "Deze laag toont **{count} rioolvlakken** binnen het kaartgebied van {city}: de gebieden waarin het gemeentelijke rioolstelsel is opgedeeld voor beheer en revisie. Elk vlak verwijst via een **tekeningnummer** naar de bijbehorende rioolrevisietekening, waarop het exacte leidingverloop staat. Samen vormen de vlakken een dekkend beheerraster over het bebouwde gebied.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Rioolvlakken in beeld", type: "count" },
          {
            label: "Unieke revisietekeningen",
            type: "distinct",
            property: "TEKENING",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De rioolvlakkenkaart is geen kaart van de leidingen zelf, maar een **indexkaart**: elk vlak is een beheergebied dat hoort bij één revisietekening (veld *TEKENING*, bijvoorbeeld `WR258`). Wie het rioolstelsel op een locatie wil bekijken, gebruikt het vlak om snel de juiste detailtekening te vinden. De meeste tekeningen dekken een klein gebied, waardoor er veel vlakken zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en onderhoud**: de gemeente plant inspecties, reiniging en vervanging per beheergebied; de vlakindeling is daarvan de ruggengraat.\n- **Graafwerk en KLIC**: bij werkzaamheden in de ondergrond is snel de juiste rioolrevisie terugvinden essentieel om schade te voorkomen.\n- **Klimaat en water**: inzicht in het rioolstelsel is de basis voor het aanpakken van wateroverlast en het afkoppelen van hemelwater.",
      },
      {
        heading: "Over de bron",
        body: "De rioolvlakkenkaart komt van Gemeente Tilburg, ontsloten via de gemeentelijke ArcGIS-omgeving. De laag bevat vooral het tekeningnummer per vlak; inhoudelijke leidinggegevens staan op de gekoppelde revisietekeningen. De statistieken gaan over de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Brondienst: Rioolvlakkenkaart (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Rioolvlakkenkaart/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-blauwe-ader",
    title: "Blauwe aders — hemelwater in {city}",
    subtitle:
      "Routes en gebieden voor het afkoppelen, afvoeren en bergen van regenwater",
    intro:
      "De **blauwe aders** vormen het watersysteem waarmee {city} regenwater apart van het riool wil afvoeren en bergen. Binnen het kaartgebied zijn **{count} vlakken** geladen, ingedeeld naar functie: gebieden waar hemelwater wordt afgekoppeld, gebieden die als ruimte voor water zijn gereserveerd, en plekken waar dit meelift met bouwontwikkelingen. Zo maakt de kaart zichtbaar hoe de stad klimaatbestendiger wordt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Blauwe-ader-vlakken in beeld", type: "count" },
          {
            label: "Afkoppelgebieden",
            type: "count-where",
            property: "OMSCHRIJVING",
            equals: "Afkoppelgebieden",
          },
          {
            label: "Reserveringsgebieden",
            type: "count-where",
            property: "OMSCHRIJVING",
            equals: "Reserveringsgebieden",
          },
          {
            label: "Bij bouwontwikkelingen",
            type: "count-where",
            property: "OMSCHRIJVING",
            equals: "Bouwontwikkelingen",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Blauwe aders per functie in {city}",
        description:
          "Veld OMSCHRIJVING: het type blauwe-ader-gebied",
        property: "OMSCHRIJVING",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een *blauwe ader* is een route of gebied dat regenwater opvangt, vertraagt en afvoert zonder het riool te belasten. De kaart onderscheidt onder meer **afkoppelgebieden** (waar verhard oppervlak van het vuilwaterriool wordt losgekoppeld), **reserveringsgebieden** (ruimte die voor toekomstige waterberging is vrijgehouden) en gebieden die meekoppelen met **bouwontwikkelingen**. Samen laten ze zien waar de stad water de ruimte geeft.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: bij hevige buien voorkomt een goed hemelwatersysteem wateroverlast op straat en in gebouwen; afkoppelen is daarvoor een sleutelmaatregel.\n- **Droogte en groen**: vastgehouden regenwater vult het grondwater aan en houdt groen gezond in droge zomers.\n- **Kostenefficiëntie**: schoon regenwater apart houden ontlast de rioolwaterzuivering en voorkomt onnodig verpompen en zuiveren.",
      },
      {
        heading: "Over de bron",
        body: "De blauwe-aderkaart komt van Gemeente Tilburg, ontsloten via de gemeentelijke ArcGIS-omgeving, en bundelt zowel bestaande als geplande/gereserveerde gebieden. De statistieken gaan over de vlakken binnen de kaartuitsnede van {city}; een gebied kan uit meerdere aangrenzende vlakken bestaan.",
      },
    ],
    links: [
      {
        label: "Brondienst: Blauwe aders (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Blauwe_ader/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-structuurvisie-ondergrond",
    title: "Structuurvisie Ondergrond in {city}",
    subtitle:
      "Nationale beleidsgebieden voor de ondergrond: drinkwater, mijnbouw en grondwaterreserves",
    intro:
      "Deze laag toont **{count} beleidsvlakken** uit de nationale **Structuurvisie Ondergrond (STRONG)** binnen het kaartgebied van {city}. De structuurvisie legt op hoofdlijnen vast hoe het Rijk wil omgaan met de diepe ondergrond — met bijzondere aandacht voor het beschermen van grondwatervoorraden voor de toekomstige drinkwatervoorziening naast andere ondergrondse belangen zoals mijnbouwactiviteiten.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Beleidsvlakken in beeld", type: "count" },
          { label: "Beleidscategorieën", type: "distinct", property: "NAAM" },
          {
            label: "Strategische voorraden",
            type: "count-where",
            property: "NAAM",
            equals: [
              "Aanvullende Strategische Voorraden",
              "Nationale Grondwater Reserves",
            ],
          },
          {
            label: "Bescherming huidige winningen",
            type: "count-where",
            property: "NAAM",
            equals: "Bescherming huidige grondwaterwinningen",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Beleidscategorieën in de ondergrond van {city}",
        description:
          "Veld NAAM: het type beleidsgebied uit de Structuurvisie Ondergrond",
        property: "NAAM",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een **beleidsgebied** uit de rijksstructuurvisie voor de ondergrond. De belangrijkste categorieën draaien om drinkwater: *Bescherming huidige grondwaterwinningen* (de bestaande winningen), *Aanvullende Strategische Voorraden* (gebieden die achter de hand worden gehouden) en *Nationale Grondwater Reserves* (grote voorraden voor de zeer lange termijn). Het veld *THEMA* koppelt de gebieden aan drinkwatervoorziening en mijnbouwactiviteiten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Toekomstig drinkwater**: de bevolking groeit en het klimaat verandert; strategische voorraden borgen dat er ook op lange termijn zoet grondwater is.\n- **Afstemming ondergrondse functies**: bodemenergie, geothermie, opslag en mijnbouw kunnen botsen met drinkwaterbelangen — de structuurvisie geeft de nationale spelregels.\n- **Doorwerking**: provincies en gemeenten vertalen dit rijksbeleid naar hun eigen omgevingsvisies en verordeningen.",
      },
      {
        heading: "Over de bron",
        body: "De vlakken zijn afkomstig uit de nationale Structuurvisie Ondergrond (planstatus *ontwerp*), hier ontsloten via de gemeentelijke ArcGIS-omgeving van Tilburg. Omdat het om nationaal beleid gaat, kunnen de vlakken groot zijn en over gemeentegrenzen heen lopen; de statistieken betreffen de vlakken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Rijksoverheid — Structuurvisie Ondergrond (STRONG)",
        url: "https://www.rijksoverheid.nl/onderwerpen/bodem-en-ondergrond",
      },
      {
        label: "Brondienst: Structuurvisie Ondergrond (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Structuurvisie_ondergrond/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-hoogtemerken",
    title: "Hoogtemerken (NAP) in {city}",
    subtitle:
      "Vaste peilmerken waarmee hoogtes ten opzichte van NAP worden ingemeten",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} hoogtemerken**: vaste peilmerken (bouten) in muren en kunstwerken waarvan de hoogte ten opzichte van **NAP** (Normaal Amsterdams Peil) nauwkeurig bekend is. Landmeters gebruiken ze als referentiepunt om nieuwe hoogtes in te meten. Elk merk heeft een unieke code, een NAP-hoogte en een beschrijving van de locatie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Hoogtemerken in beeld", type: "count" },
          { label: "Unieke peilmerken", type: "distinct", property: "PEILMERK" },
          {
            label: "Straten met een merk",
            type: "distinct",
            property: "STRAATNAAM",
          },
          {
            label: "Publicabel",
            type: "count-where",
            property: "STATUS",
            equals: "Publicabel",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Soort bout van de hoogtemerken in {city}",
        description:
          "Veld SOORT_BOUT: het type peilmerk (bout) dat is gebruikt",
        property: "SOORT_BOUT",
        valueLabels: {
          " ": "Onbekend",
          onbekend: "Onbekend",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een **peilmerk**: meestal een metalen bout in een stevige, stabiele constructie zoals een gevel of brug. De bijbehorende *NAP-hoogte* geeft exact aan hoe hoog dat punt ligt ten opzichte van het landelijke nulniveau. De velden beschrijven onder meer het soort bout, het muurvlak waarin het merk zit en het plaatsingsjaar; veel merken zijn al decennia oud.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Meetkundige basis**: zonder betrouwbare referentiepunten kan geen enkele hoogtemeting worden gecontroleerd; peilmerken zijn de fysieke ankers van het NAP-stelsel.\n- **Bouw en infrastructuur**: bij wegen, riolering, bouwputten en waterpeilen wordt alles teruggerekend naar NAP via nabijgelegen merken.\n- **Bodemdaling**: door merken periodiek opnieuw in te meten kan lokale zakking of stijging van de ondergrond worden gevolgd.",
      },
      {
        heading: "Over de bron",
        body: "De hoogtemerken komen uit het gemeentelijke peilmerkenbestand van Tilburg, ontsloten via de gemeentelijke ArcGIS-omgeving. De status *Publicabel* geeft aan dat een merk openbaar bruikbaar is. De statistieken gaan over de merken binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Brondienst: Hoogtemerken (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Hoogtemerken_Tilburg/FeatureServer",
      },
      {
        label: "Over NAP (Normaal Amsterdams Peil)",
        url: "https://www.rijkswaterstaat.nl/water/waterbeheer/normaal-amsterdams-peil",
      },
    ],
  },
  {
    layerId: "tlb-hoogspanning",
    title: "Hoogspanningsverbindingen in {city}",
    subtitle:
      "Boven- en ondergrondse hoogspanningstracés (150 kV en 380 kV) door de gemeente",
    intro:
      "Deze laag tekent **{count} hoogspanningsverbindingen** binnen het kaartgebied van {city}: de tracés van het landelijke en regionale hoogspanningsnet dat door de gemeente loopt, met spanningsniveaus van **150 kV en 380 kV**. Deze verbindingen transporteren grote hoeveelheden elektriciteit tussen stations en zijn bepalend voor de ruimte eromheen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Verbindingen in beeld", type: "count" },
          {
            label: "150 kV",
            type: "count-where",
            property: "SPANNING",
            equals: "150 kv",
          },
          {
            label: "380 kV",
            type: "count-where",
            property: "SPANNING",
            equals: "380 kv",
          },
          { label: "Spanningsniveaus", type: "distinct", property: "SPANNING" },
        ],
      },
      {
        kind: "category-bar",
        title: "Hoogspanningsverbindingen per spanningsniveau in {city}",
        description: "Veld SPANNING: het spanningsniveau van de verbinding",
        property: "SPANNING",
        valueLabels: {
          "150 kv": "150 kV",
          "380 kv": "380 kV",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is het tracé van een hoogspanningsverbinding. Het **spanningsniveau** zegt hoeveel elektriciteit de verbinding transporteert: *380 kV* vormt de ruggengraat van het landelijke net, *150 kV* verzorgt het regionale transport naar onderstations. Verbindingen kunnen bovengronds (masten) of ondergronds (kabels) liggen; het tracé loopt vaak in rechte lijnen door en langs de bebouwing.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke beperkingen**: onder en langs bovengrondse hoogspanningslijnen gelden zones met bouwbeperkingen; het Rijk hanteert een voorzorgbeleid voor gevoelige bestemmingen zoals woningen en scholen.\n- **Energietransitie**: verzwaring van het net is een randvoorwaarde voor meer zon, wind en elektrificatie; bestaande tracés bepalen mede waar dat kan.\n- **Veiligheid en onderhoud**: de netbeheerder houdt tracés vrij van bebouwing en beplanting; graafwerk in de buurt vraagt om extra zorgvuldigheid.",
      },
      {
        heading: "Over de bron",
        body: "De verbindingen komen van Gemeente Tilburg, ontsloten via de gemeentelijke ArcGIS-omgeving. Voor de exacte magneetveldzones rond bovengrondse lijnen is de landelijke netkaart van het RIVM leidend. De statistieken gaan over de verbindingen binnen de kaartuitsnede van {city}; een doorgaand tracé kan uit meerdere segmenten bestaan.",
      },
    ],
    links: [
      {
        label: "RIVM — hoogspanningslijnen en magneetvelden",
        url: "https://www.rivm.nl/hoogspanningslijnen",
      },
      {
        label: "Brondienst: Hoogspanningsverbinding (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Hoogspanningsverbinding/FeatureServer",
      },
    ],
  },
  {
    layerId: "tlb-milieuzone",
    title: "Milieuzone in {city}",
    subtitle:
      "Het afgebakende gebied met toegangsregels voor vervuilende voertuigen",
    intro:
      "Deze laag toont de **milieuzone** van {city}: een afgebakend gebied waarin toegangsregels gelden voor bepaalde (vervuilende) voertuigen, bedoeld om de luchtkwaliteit en leefbaarheid te verbeteren. Binnen het kaartgebied is **{count} zone** geladen — de kaart draait hier niet om aantallen, maar om de precieze begrenzing van het gebied.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Milieuzones in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het gekleurde vlak is de begrenzing van de milieuzone. Binnen deze grens gelden aparte regels voor de toegang van bepaalde voertuigcategorieën — welke voertuigen precies worden geweerd en op welke tijden, hangt af van het geldende gemeentelijke besluit. De kaart geeft antwoord op de kernvraag: *ligt een adres of route binnen of buiten de zone?*",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Luchtkwaliteit en gezondheid**: het weren van de meest vervuilende voertuigen verlaagt de uitstoot van fijnstof en stikstofoxiden in het drukst bezochte gebied.\n- **Logistiek en bereikbaarheid**: voor vervoerders en bezorgdiensten bepaalt de zonegrens welke voertuigen en routes zijn toegestaan; dat stuurt investeringen in schoner materieel.\n- **Handhaving**: een scherpe geografische begrenzing is de basis voor camerahandhaving en heldere communicatie naar weggebruikers.",
      },
      {
        heading: "Over de bron",
        body: "De milieuzone komt van Gemeente Tilburg, ontsloten via de gemeentelijke ArcGIS-omgeving. Deze laag bevat uitsluitend de geografische begrenzing; de actuele toegangsregels, uitzonderingen en ontheffingen staan in het gemeentelijke verkeersbesluit en de bijbehorende voorlichting.",
      },
    ],
    links: [
      {
        label: "Brondienst: Milieuzone (Gemeente Tilburg)",
        url: "https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services/Milieuzone/FeatureServer",
      },
      {
        label: "Landelijk: milieuzones in Nederland",
        url: "https://www.milieuzones.nl/",
      },
    ],
  },
];
