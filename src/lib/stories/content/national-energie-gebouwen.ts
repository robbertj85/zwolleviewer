/**
 * Story maps — batch "national-energie-gebouwen": energie-, elektriciteitsnet-,
 * gebouw-, perceel-, erfgoed-, plan- en ondergrondlagen (landelijke bronnen).
 *
 * Lagen: cbs-energie-verbruik, rivm-windturbines-locaties,
 * liander-hoogspanningskabels, liander-middenspanningskabels,
 * liander-laagspanningskabels, liander-middenspanningsstations,
 * liander-laagspanningsverdeelkasten, bag-panden, bgt-pand,
 * kadastrale-percelen, rce-rijksmonumenten, dso-bestemmingsplan,
 * pdok-rioned-beheerleiding, bgt-nummeraanduiding, bgt-openbare-ruimte.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "cbs-energie-verbruik",
    title: "Energieverbruik van woningen in {city}",
    subtitle:
      "Gemiddeld gas- en elektriciteitsverbruik per buurt uit de CBS-statistiek Wijken & Buurten",
    intro:
      "Deze laag kleurt **{count} buurten** in {city} op het gemiddelde energieverbruik van woningen, zoals het CBS dat jaarlijks publiceert in de statistiek *Wijken en Buurten*. Per buurt zie je hoeveel aardgas en elektriciteit een gemiddelde woning verbruikt, en hoe ver de buurt is met de overstap van het gas af. Klik op een buurt voor de onderliggende cijfers.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. aardgasverbruik",
            type: "avg",
            property: "gemiddeldAardgasverbruik",
            unit: "m³",
            decimals: 0,
          },
          {
            label: "Gem. elektriciteitslevering",
            type: "avg",
            property: "gemiddeldeElektriciteitslevering",
            unit: "kWh",
            decimals: 0,
          },
          {
            label: "Woningvoorraad (totaal)",
            type: "sum",
            property: "woningvoorraad",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het gemiddelde aardgasverbruik per buurt in {city}",
        description:
          "Aantal buurten per verbruiksklasse — het CBS-veld gemiddeldAardgasverbruik (m³ per woning per jaar)",
        property: "gemiddeldAardgasverbruik",
        unit: "m³",
        bins: 8,
      },
      {
        kind: "histogram",
        title: "Woningen met zonnestroom per buurt",
        description:
          "Percentage woningen met zonnepanelen per buurt (CBS-veld percentageWoningenMetZonnestroom)",
        property: "percentageWoningenMetZonnestroom",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Voor elke buurt berekent het CBS het gemiddelde verbruik van woningen: aardgas in kubieke meters en elektriciteit in kilowattuur per jaar. Het is dus één gemiddelde per buurt — binnen een buurt met veel oude vrijstaande huizen én een paar nieuwbouwappartementen kan het werkelijke verbruik sterk uiteenlopen. Naast het verbruik toont de bron ook het **aandeel woningen met zonnestroom**, het percentage aardgasvrije woningen en het percentage met stadsverwarming.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Warmtetransitie**: het gemiddelde aardgasverbruik per buurt is een directe indicator voor het besparingspotentieel en helpt bij het prioriteren van wijken in de Transitievisie Warmte.\n- **Verduurzaming**: het aandeel zonnestroom en aardgasvrije woningen laat zien waar bewoners al stappen zetten en waar nog winst te halen valt.\n- **Netcapaciteit**: hoge elektriciteitslevering (verbruik) en teruglevering (zonnepanelen) samen bepalen de belasting van het lokale net — relevant bij netcongestie.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de CBS-statistiek *Wijken en Buurten* (jaargang 2024), ontsloten via PDOK. Let op:\n- Het CBS onderdrukt cijfers voor kleine of privacygevoelige buurten; die verschijnen als lege waarde en tellen niet mee in de gemiddelden en grafieken.\n- Enkele oudere verbruiksvelden (zoals *gemiddeldGasverbruikTotaal*) zijn in deze jaargang nog niet gevuld; de grafieken gebruiken daarom het wel gepubliceerde *gemiddeldAardgasverbruik*.\n- De kaartuitsnede van {city} kan ook buurten van buurgemeenten bevatten.",
      },
    ],
    links: [
      {
        label: "CBS: Kerncijfers wijken en buurten",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/wijk-en-buurtstatistieken",
      },
      {
        label: "PDOK: CBS Wijken en Buurten",
        url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
      },
    ],
  },
  {
    layerId: "rivm-windturbines-locaties",
    title: "Windturbines in en rond {city}",
    subtitle:
      "Bestaande windturbines met hun vermogen en afmetingen, uit de RIVM Atlas Leefomgeving",
    intro:
      "Binnen het kaartgebied van {city} staan **{count} windturbines** volgens de landelijke dataset van het RIVM (Atlas Leefomgeving, 2024). Elke stip is één bestaande turbine, met het opgestelde vermogen (in kW), de rotordiameter en de ashoogte. Klik op een turbine voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Turbines in beeld", type: "count" },
          {
            label: "Totaal opgesteld vermogen",
            type: "sum",
            property: "kw",
            unit: "kW",
            decimals: 0,
          },
          {
            label: "Gem. rotordiameter",
            type: "avg",
            property: "diam",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Hoogste ashoogte",
            type: "max",
            property: "ash",
            unit: "m",
            decimals: 0,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van het turbinevermogen in {city}",
        description:
          "Aantal turbines per vermogensklasse (RIVM-veld kw — opgesteld vermogen in kilowatt)",
        property: "kw",
        unit: "kW",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een bestaande windturbine. Het **vermogen** (veld *kw*) loopt van kleine, oudere solitaire molens van enkele tientallen kilowatt tot moderne turbines van meerdere megawatt (één megawatt is 1.000 kW). De **rotordiameter** en **ashoogte** zeggen iets over de generatie en de fysieke maat van de turbine — nieuwere turbines zijn fors groter dan de molens uit de jaren negentig.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energieopgave**: het opgestelde vermogen is een directe maat voor de bijdrage aan de lokale en regionale doelen uit de RES (Regionale Energiestrategie).\n- **Ruimtelijke inpassing**: turbinehoogte en -diameter bepalen de zichtbaarheid en de aan te houden afstanden tot woningen; deze laag combineer je met de buurt- en woninglagen om effecten in te schatten.\n- **Modernisering**: veel oude, kleine turbines komen in aanmerking voor *repowering* — vervanging door minder maar krachtiger exemplaren.",
      },
      {
        heading: "Over de bron",
        body: "De dataset komt uit de RIVM Atlas Leefomgeving (peiljaar 2024) en bevat uitsluitend **bestaande** turbines — geen plannen of vergunningen in procedure. De namen van turbines zijn in de bron vaak niet ingevuld; de kaart leunt daarom op het vermogen en de afmetingen. Statistieken gelden voor de kaartuitsnede van {city}, dus turbines van buurgemeenten kunnen meetellen.",
      },
    ],
    links: [
      { label: "RIVM Atlas Leefomgeving", url: "https://www.atlasleefomgeving.nl" },
      {
        label: "Rijksdienst: windenergie op land",
        url: "https://www.rvo.nl/onderwerpen/windenergie-op-land",
      },
    ],
  },
  {
    layerId: "liander-hoogspanningskabels",
    title: "Hoogspanningskabels in {city}",
    subtitle:
      "Het hoogspanningsnet (HS) uit de open data van netbeheerder Liander",
    intro:
      "Deze laag tekent het **hoogspanningsnet** binnen het kaartgebied van {city}: **{count} kabelsegmenten** uit de open data van netbeheerder Liander. Liander beheert het net in onder meer Noord-Holland, Gelderland, Flevoland en delen van Zuid-Holland en Utrecht; ligt {city} buiten dat werkgebied (bijvoorbeeld in Overijssel, Noord-Brabant of Zuid-Holland-zuid), dan verzorgt een andere netbeheerder het net en toont deze laag geen kabels.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kabelsegmenten in beeld", type: "count" },
          {
            label: "Totale kabellengte",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gem. segmentlengte",
            type: "avg",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Spanningsniveaus",
            type: "distinct",
            property: "SPANNINGSNIVEAU",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Kabelsegmenten per spanningsniveau in {city}",
        description: "Liander-veld SPANNINGSNIVEAU (in kV)",
        property: "SPANNINGSNIVEAU",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is één kabelsegment van het hoogspanningsnet. Hoogspanning vormt de ruggengraat van de elektriciteitsvoorziening: via onderstations wordt de spanning verlaagd naar midden- en laagspanning voordat de stroom bij woningen en bedrijven komt. Het aantal segmenten zegt iets over de fijnmazigheid van de registratie, de opgetelde lengte over de omvang van het net in de uitsnede.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Netcapaciteit en congestie**: het hoogspanningsnet bepaalt hoeveel vermogen een gebied kan aan- en afvoeren — een sleutelfactor bij netcongestie en de aansluiting van grootverbruikers, zon- en windparken.\n- **Ruimtelijke ordening**: rond hoogspanningsverbindingen gelden zones en voorzorgsafstanden die relevant zijn bij woningbouwplannen.\n- **Ondergrondse infrastructuur**: samen met de midden- en laagspanningslagen geeft dit een beeld van het complete elektriciteitsnet in een gebied.",
      },
      {
        heading: "Over de bron en een belangrijke kanttekening",
        body: "De data komt uit de open dataset *Liander Open Data Elektra* (per kwartaal geactualiseerd). De lijnen zijn **indicatief** en tonen alleen het Liander-net. **Deze kaart vervangt nooit een KLIC-melding**: bij graafwerkzaamheden is een officiële KLIC-melding via het Kadaster wettelijk verplicht.",
      },
    ],
    links: [
      {
        label: "Liander Open Data Elektra",
        url: "https://www.arcgis.com/home/item.html?id=11b7bcf1b78b4462b91db0dff234cf78",
      },
      {
        label: "KLIC-melding (Kadaster)",
        url: "https://www.kadaster.nl/zakelijk/producten/woning-en-gebouw/klic-melding",
      },
    ],
  },
  {
    layerId: "liander-middenspanningskabels",
    title: "Middenspanningskabels in {city}",
    subtitle:
      "Het middenspanningsnet (MS) uit de open data van netbeheerder Liander",
    intro:
      "Deze laag toont het **middenspanningsnet** binnen het kaartgebied van {city}: **{count} kabelsegmenten** uit de open data van Liander. Het middenspanningsnet (typisch 10–20 kV) verbindt de hoogspanningsstations met de wijk- en straattransformatoren. Liander beheert het net in onder meer Noord-Holland, Gelderland en Flevoland; buiten dat werkgebied toont deze laag geen kabels.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kabelsegmenten in beeld", type: "count" },
          {
            label: "Totale kabellengte",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gem. segmentlengte",
            type: "avg",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Spanningsniveaus",
            type: "distinct",
            property: "SPANNINGSNIVEAU",
          },
        ],
      },
      {
        kind: "histogram",
        title: "Lengteverdeling van middenspanningssegmenten in {city}",
        description:
          "Aantal kabelsegmenten per lengteklasse (Liander-veld Shape__Length, in meters)",
        property: "Shape__Length",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is één segment van het middenspanningsnet — de tussenlaag tussen het hoogspanningsnet en de laagspanning in de straat. Vanaf middenspanningsstations (aparte laag) loopt de spanning via deze kabels naar de wijken, waar transformatoren hem verlagen naar de 230/400 volt van het stopcontact. Veel korte segmenten wijzen op een dichtbebouwd, fijnmazig net.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verduurzaming en netcongestie**: het middenspanningsnet is vaak de eerste plek waar knelpunten ontstaan bij grootschalige zon-op-dak, warmtepompen en laadpalen.\n- **Gebiedsontwikkeling**: bij nieuwe wijken of bedrijventerreinen bepaalt de nabijheid van middenspanning de kosten en doorlooptijd van aansluitingen.\n- **Compleet netbeeld**: combineer deze laag met hoog- en laagspanning en met de stations en verdeelkasten voor het volledige plaatje.",
      },
      {
        heading: "Over de bron en een belangrijke kanttekening",
        body: "De data komt uit de open dataset *Liander Open Data Elektra* (per kwartaal geactualiseerd) en is **indicatief**. **Deze kaart vervangt nooit een KLIC-melding**: bij graafwerkzaamheden is een officiële KLIC-melding via het Kadaster wettelijk verplicht.",
      },
    ],
    links: [
      {
        label: "Liander Open Data Elektra",
        url: "https://www.arcgis.com/home/item.html?id=11b7bcf1b78b4462b91db0dff234cf78",
      },
      {
        label: "KLIC-melding (Kadaster)",
        url: "https://www.kadaster.nl/zakelijk/producten/woning-en-gebouw/klic-melding",
      },
    ],
  },
  {
    layerId: "liander-laagspanningskabels",
    title: "Laagspanningskabels in {city}",
    subtitle:
      "Het laagspanningsnet (LS) uit de open data van netbeheerder Liander",
    intro:
      "Deze laag toont het **laagspanningsnet** binnen het kaartgebied van {city}: **{count} kabelsegmenten** uit de open data van Liander. Laagspanning (230/400 volt) is het fijnmazige net dat vanaf de wijktransformator de stroom tot in elke woning en winkel brengt — verreweg het grootste en dichtste deel van het elektriciteitsnet. Liander beheert dit net in onder meer Noord-Holland, Gelderland en Flevoland; buiten dat werkgebied toont deze laag geen kabels.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kabelsegmenten in beeld", type: "count" },
          {
            label: "Totale kabellengte",
            type: "sum",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gem. segmentlengte",
            type: "avg",
            property: "Shape__Length",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Spanningsniveaus",
            type: "distinct",
            property: "SPANNINGSNIVEAU",
          },
        ],
      },
      {
        kind: "histogram",
        title: "Lengteverdeling van laagspanningssegmenten in {city}",
        description:
          "Aantal kabelsegmenten per lengteklasse (Liander-veld Shape__Length, in meters)",
        property: "Shape__Length",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is één segment van het laagspanningsnet in de straat. Dit is het laatste stuk van de keten hoog- → midden- → laagspanning: vanaf een wijktransformator of verdeelkast loopt de kabel via het trottoir naar de huisaansluitingen. Doordat elke straat is aangesloten, is dit net veel langer en fijnmaziger dan de hogere spanningsniveaus.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Laadpalen en warmtepompen**: het laagspanningsnet voelt als eerste de druk van elektrificatie; lokale verzwaring begint hier.\n- **Zon-op-dak**: bij veel teruglevering in een straat kan de spanning oplopen; het laagspanningsnet bepaalt hoeveel een buurt aankan.\n- **Werk in de openbare ruimte**: de ligging is relevant bij herinrichting, rioolvervanging en groenaanplant.",
      },
      {
        heading: "Over de bron en een belangrijke kanttekening",
        body: "De data komt uit de open dataset *Liander Open Data Elektra* (per kwartaal geactualiseerd) en is **indicatief**. **Deze kaart vervangt nooit een KLIC-melding**: bij graafwerkzaamheden is een officiële KLIC-melding via het Kadaster wettelijk verplicht.",
      },
    ],
    links: [
      {
        label: "Liander Open Data Elektra",
        url: "https://www.arcgis.com/home/item.html?id=11b7bcf1b78b4462b91db0dff234cf78",
      },
      {
        label: "KLIC-melding (Kadaster)",
        url: "https://www.kadaster.nl/zakelijk/producten/woning-en-gebouw/klic-melding",
      },
    ],
  },
  {
    layerId: "liander-middenspanningsstations",
    title: "Middenspanningsstations in {city}",
    subtitle:
      "MS-verdeelstations en netruimtes uit de open data van netbeheerder Liander",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} middenspanningsstations** uit de open data van Liander. Dit zijn de verdeel- en transformatorruimtes die het middenspanningsnet ontsluiten en de spanning verlagen richting de wijk. Liander beheert het net in onder meer Noord-Holland, Gelderland en Flevoland; buiten dat werkgebied toont deze laag geen stations. Klik op een station voor naam, functie en spanningsniveau.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Stations in beeld", type: "count" },
          { label: "Unieke stationsnamen", type: "distinct", property: "NAAM" },
          { label: "Functietypen", type: "distinct", property: "FUNCTIE" },
          {
            label: "Spanningscombinaties",
            type: "distinct",
            property: "SPANNINGSNIVEAUS",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Middenspanningsstations per functie in {city}",
        description: "Liander-veld FUNCTIE",
        property: "FUNCTIE",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Stations per spanningscombinatie",
        description:
          "Liander-veld SPANNINGSNIVEAUS — de spanningen die het station koppelt (bv. 10kV/0.4kV)",
        property: "SPANNINGSNIVEAUS",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een middenspanningsstation: een netruimte (soms een apart gebouwtje, soms een ruimte in een pand) waar het middenspanningsnet wordt verdeeld en waar transformatoren de spanning verlagen. Het veld *FUNCTIE* onderscheidt bijvoorbeeld reguliere netruimtes van gecombineerde ruimtes; *SPANNINGSNIVEAUS* toont welke spanningen het station koppelt, zoals 10 kV naar 0,4 kV (laagspanning).",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Aansluitcapaciteit**: de dichtheid en capaciteit van deze stations bepalen mede hoeveel extra vraag (laden, warmtepompen) of teruglevering (zon) een wijk aankan.\n- **Ruimtebeslag**: netruimtes vragen fysieke ruimte in de wijk; bij gebiedsontwikkeling moet daar vroeg rekening mee worden gehouden.\n- **Storingsgevoeligheid**: stations zijn knooppunten waar storingen impact hebben op hele wijken.",
      },
      {
        heading: "Over de bron en een belangrijke kanttekening",
        body: "De data komt uit de open dataset *Liander Open Data Elektra* (per kwartaal geactualiseerd) en is **indicatief**. **Deze kaart vervangt nooit een KLIC-melding**: bij graafwerkzaamheden is een officiële KLIC-melding via het Kadaster wettelijk verplicht.",
      },
    ],
    links: [
      {
        label: "Liander Open Data Elektra",
        url: "https://www.arcgis.com/home/item.html?id=11b7bcf1b78b4462b91db0dff234cf78",
      },
      { label: "Liander", url: "https://www.liander.nl" },
    ],
  },
  {
    layerId: "liander-laagspanningsverdeelkasten",
    title: "Laagspanningsverdeelkasten in {city}",
    subtitle:
      "LS-verdeelkasten en -stations uit de open data van netbeheerder Liander",
    intro:
      "Binnen het kaartgebied van {city} staan **{count} laagspanningsverdeelkasten** uit de open data van Liander — de kasten en kleine stations waar het laagspanningsnet in de straat wordt verdeeld naar de huisaansluitingen. Liander beheert het net in onder meer Noord-Holland, Gelderland en Flevoland; buiten dat werkgebied toont deze laag geen kasten. Klik op een kast voor naam, functie en spanningsniveau.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Verdeelkasten in beeld", type: "count" },
          { label: "Unieke kastnamen", type: "distinct", property: "NAAM" },
          { label: "Functietypen", type: "distinct", property: "FUNCTIE" },
          {
            label: "Spanningsniveaus",
            type: "distinct",
            property: "SPANNINGSNIVEAUS",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Verdeelkasten per functie in {city}",
        description: "Liander-veld FUNCTIE (bv. LS Kast)",
        property: "FUNCTIE",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een laagspanningsverdeelkast of klein LS-station. Deze kasten — de grijze straatkasten die je op stoepen tegenkomt — verdelen de stroom vanaf de wijktransformator over de verschillende straten en huisaansluitingen. Ze werken op laagspanning (0,4 kV, ofwel 230/400 volt), zoals het veld *SPANNINGSNIVEAUS* laat zien.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Openbare ruimte**: verdeelkasten nemen fysieke ruimte in op trottoirs en in plantsoenen; hun ligging is relevant bij herinrichting en toegankelijkheid.\n- **Netverzwaring**: bij toenemende belasting (laadpalen, warmtepompen) worden kasten en de kabels ertussen als eerste verzwaard.\n- **Fijnmazig netbeeld**: samen met de laagspanningskabels laten deze kasten zien hoe het net tot in de haarvaten van de wijk is opgebouwd.",
      },
      {
        heading: "Over de bron en een belangrijke kanttekening",
        body: "De data komt uit de open dataset *Liander Open Data Elektra* (per kwartaal geactualiseerd) en is **indicatief**. **Deze kaart vervangt nooit een KLIC-melding**: bij graafwerkzaamheden is een officiële KLIC-melding via het Kadaster wettelijk verplicht.",
      },
    ],
    links: [
      {
        label: "Liander Open Data Elektra",
        url: "https://www.arcgis.com/home/item.html?id=11b7bcf1b78b4462b91db0dff234cf78",
      },
      { label: "Liander", url: "https://www.liander.nl" },
    ],
  },
  {
    layerId: "bag-panden",
    title: "Gebouwen (BAG) in {city}",
    subtitle:
      "Alle panden uit de Basisregistratie Adressen en Gebouwen, met hun bouwjaar",
    intro:
      "Deze laag toont **{count} panden** binnen het kaartgebied van {city} uit de Basisregistratie Adressen en Gebouwen (BAG). Elk pand heeft een landelijk uniek nummer, een bouwjaar en een status. Het bouwjaar maakt in één oogopslag zichtbaar hoe de stad in de tijd is gegroeid — van historische kernen tot naoorlogse uitbreidingen en recente nieuwbouw. Klik op een pand voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Panden in beeld", type: "count" },
          {
            label: "Mediaan bouwjaar",
            type: "median",
            property: "bouwjaar",
            decimals: 0,
          },
          {
            label: "Verblijfsobjecten (totaal)",
            type: "sum",
            property: "aantal_verblijfsobjecten",
            decimals: 0,
          },
          {
            label: "In gebruik (aandeel)",
            type: "count-where",
            property: "status",
            equals: "Pand in gebruik",
            asShare: true,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Bouwjaren van panden in {city}",
        description:
          "Aantal panden per bouwjaarklasse (BAG-veld bouwjaar) — de bouwgeschiedenis in één beeld",
        property: "bouwjaar",
        bins: 10,
      },
      {
        kind: "category-bar",
        title: "Status van de panden",
        description: "BAG-veld status: de levenscyclusstatus van elk pand",
        property: "status",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke vlak is één pand — een fysiek gebouw, dat één of meer adressen (verblijfsobjecten) kan bevatten. Het veld *aantal_verblijfsobjecten* laat zien dat veel panden geen zelfstandig adres hebben (schuren, bergingen, bijgebouwen), terwijl een flat er tientallen kan bevatten. Het **bouwjaar** is het registratiejaar van eerste oplevering; bij ingrijpende verbouwingen kan de status *Verbouwing pand* zijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verduurzaming**: het bouwjaar is een sterke voorspeller van de energetische kwaliteit — vooroorlogse en vroeg-naoorlogse panden vragen vaak de meeste isolatie-inzet.\n- **Ruimtelijke geschiedenis**: de bouwjaarverdeling vertelt het verhaal van de stadsgroei en helpt bij cultuurhistorische afwegingen.\n- **Basisregistratie**: de BAG is de officiële bron die door heel de overheid wordt gebruikt; hij koppelt aan adressen, WOZ, energielabels en veel andere registraties.",
      },
      {
        heading: "Over de bron",
        body: "De BAG wordt door gemeenten bijgehouden en landelijk ontsloten via PDOK. De kaart is beperkt tot de uitsnede van {city} en laadt in de standaardweergave een deel van de panden; met *volledig laden* haal je alle panden binnen de uitsnede op. Statistieken gaan over de geladen panden, niet per se over de hele gemeente.",
      },
    ],
    links: [
      {
        label: "PDOK: Basisregistratie Adressen en Gebouwen (BAG)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-adressen-en-gebouwen-ba-1",
      },
      {
        label: "Kadaster over de BAG",
        url: "https://www.kadaster.nl/zakelijk/registraties/basisregistraties/bag",
      },
    ],
  },
  {
    layerId: "bgt-pand",
    title: "Gebouwen (BGT) in {city}",
    subtitle:
      "Panden uit de Basisregistratie Grootschalige Topografie — de nauwkeurigste gebouwcontouren",
    intro:
      "Deze laag toont **{count} panden** binnen het kaartgebied van {city} uit de Basisregistratie Grootschalige Topografie (BGT). Waar de BAG vooral over adressen en administratie gaat, is de BGT de meest **nauwkeurige topografische** weergave van gebouwen: de contouren zijn ingemeten op de werkelijke situatie op straatniveau. Klik op een pand voor bronhouder en status.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Panden in beeld", type: "count" },
          { label: "Bronhouders", type: "distinct", property: "bronhouder" },
          {
            label: "Status 'bestaand' (aandeel)",
            type: "count-where",
            property: "status",
            equals: "bestaand",
            asShare: true,
          },
          {
            label: "Hoogteliggingen",
            type: "distinct",
            property: "relatieve_hoogteligging",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Status van de BGT-panden in {city}",
        description: "BGT-veld status (bv. bestaand, plan, historie)",
        property: "status",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is één pandcontour zoals de bronhouder — meestal de gemeente — die heeft ingemeten. De BGT is de grootschalige basiskaart van Nederland: alle overheden gebruiken dezelfde geometrie voor beheer, ontwerp en vergunningen. Het veld *status* geeft de levenscyclus aan (bestaand, plan, historie) en *relatieve_hoogteligging* onderscheidt objecten op maaiveld van objecten daarboven of -onder (bijvoorbeeld een pand boven een onderdoorgang).",
      },
      {
        heading: "BGT of BAG?",
        body: "De **BGT** is topografisch: nauwkeurige contouren voor kaart en beheer, elk pand met één bronhouder. De **BAG** is administratief: bouwjaar, adressen en status voor registratiedoeleinden. Ze zijn aan elkaar gekoppeld (via het BAG-pandnummer *bag_pnd*), maar dienen verschillende doelen — gebruik de BGT als je de exacte ligging nodig hebt, de BAG als je bouwjaar of adressen wilt.",
      },
      {
        heading: "Over de bron",
        body: "De BGT wordt dagelijks geactualiseerd en via PDOK ontsloten. De kaart is beperkt tot de uitsnede van {city} en laadt in de standaardweergave een deel van de panden; statistieken gaan over de geladen objecten. De bronhouder verschilt per gebied — binnen één gemeente kunnen naast de gemeente ook Rijkswaterstaat of ProRail als bronhouder voorkomen.",
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
    layerId: "kadastrale-percelen",
    title: "Kadastrale percelen in {city}",
    subtitle:
      "Perceelgrenzen en -oppervlakten uit de kadastrale kaart van het Kadaster",
    intro:
      "Deze laag toont **{count} kadastrale percelen** binnen het kaartgebied van {city} uit de kadastrale kaart van het Kadaster. Een perceel is een juridisch afgebakend stuk grond met een eigen aanduiding (kadastrale gemeente, sectie en perceelnummer) en een geregistreerde oppervlakte. Klik op een perceel voor de aanduiding en de grootte.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Percelen in beeld", type: "count" },
          {
            label: "Totale oppervlakte",
            type: "sum",
            property: "kadastrale_grootte_waarde",
            unit: "m²",
            decimals: 0,
          },
          {
            label: "Mediaan perceelgrootte",
            type: "median",
            property: "kadastrale_grootte_waarde",
            unit: "m²",
            decimals: 0,
          },
          { label: "Secties", type: "distinct", property: "sectie" },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van perceelgroottes in {city}",
        description:
          "Aantal percelen per grootteklasse (Kadaster-veld kadastrale_grootte_waarde, in m²)",
        property: "kadastrale_grootte_waarde",
        unit: "m²",
        bins: 8,
      },
      {
        kind: "category-bar",
        title: "Percelen per kadastrale gemeente",
        description:
          "Kadaster-veld kadastrale_gemeente_waarde — de historische kadastrale gemeente waarin het perceel valt",
        property: "kadastrale_gemeente_waarde",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is één kadastraal perceel. De aanduiding bestaat uit een **kadastrale gemeente** (een historische indeling die niet altijd met de huidige gemeentegrens samenvalt), een **sectie** (een letter) en een **perceelnummer**. Het veld *kadastrale_grootte_waarde* geeft de geregistreerde oppervlakte; *soort_grootte_waarde* laat zien of die is *Vastgesteld* (ingemeten) of *Voorlopig*.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Eigendom en grondbeleid**: percelen zijn de eenheid waarin grond wordt verkocht, verpacht en onteigend; ze vormen de basis voor grondexploitaties en anterieure overeenkomsten.\n- **Ruimtelijke plannen**: bestemmingen, vergunningen en subsidies worden vaak per perceel toegekend of getoetst.\n- **Oppervlakteanalyses**: de perceelgrootte helpt bij bebouwingspercentages, bouwmogelijkheden en waardebepaling.",
      },
      {
        heading: "Over de bron",
        body: "De kadastrale kaart wordt door het Kadaster bijgehouden en via PDOK ontsloten. Deze laag toont **grenzen en oppervlakten**, niet de eigenaargegevens — die zijn niet openbaar en alleen via een officiële kadastrale recherche op te vragen. De kaart is beperkt tot de uitsnede van {city}; statistieken gaan over de geladen percelen.",
      },
    ],
    links: [
      {
        label: "PDOK: BRK Kadastrale kaart",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-kadaster-brk-",
      },
      {
        label: "Kadaster: kadastrale kaart",
        url: "https://www.kadaster.nl/producten/woning/kadastrale-kaart",
      },
    ],
  },
  {
    layerId: "rce-rijksmonumenten",
    title: "Rijksmonumenten in {city}",
    subtitle:
      "Beschermde rijksmonumenten uit de database van de Rijksdienst voor het Cultureel Erfgoed",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} rijksmonumenten** volgens de landelijke database van de Rijksdienst voor het Cultureel Erfgoed (RCE). Elk vlak is de beschermde contour van een monument, met een rijksmonumentnummer en een indeling in hoofd- en subcategorie (van woonhuizen en kerken tot molens, parken en verdedigingswerken). Klik op een contour voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Rijksmonumenten in beeld", type: "count" },
          {
            label: "Unieke monumentnummers",
            type: "distinct",
            property: "rijksmonument_nummer",
          },
          {
            label: "Hoofdcategorieën",
            type: "distinct",
            property: "hoofdcategorie",
          },
          {
            label: "Onderdeel van complex",
            type: "distinct",
            property: "complex_nummer",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Rijksmonumenten per hoofdcategorie in {city}",
        description: "RCE-veld hoofdcategorie — het type erfgoed",
        property: "hoofdcategorie",
        maxCategories: 7,
      },
      {
        kind: "category-bar",
        title: "Rijksmonumenten per subcategorie",
        description: "RCE-veld subcategorie — de fijnere typering van het monument",
        property: "subcategorie",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is de beschermde contour van een rijksmonument. De **hoofdcategorie** groepeert grofweg (woonhuizen, kerkelijke gebouwen, kastelen en parken, verdedigingswerken, boerderijen en molens), de **subcategorie** verfijnt dat. Een monument kan deel zijn van een **complex** (veld *complex_nummer*), zoals een landgoed met huis, koetshuis en park — die delen delen dan hetzelfde complexnummer.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bescherming en vergunningen**: voor wijzigingen aan een rijksmonument is een omgevingsvergunning nodig; deze contouren bepalen waar dat regime geldt.\n- **Erfgoed en ruimtelijke kwaliteit**: monumenten zijn dragers van identiteit en spelen een rol bij herbestemming, toerisme en gebiedsontwikkeling.\n- **Beleid**: gemeenten voeren vaak eigen erfgoedbeleid bovenop de rijksbescherming; deze laag is daarvoor het landelijke vertrekpunt.",
      },
      {
        heading: "Over de bron",
        body: "De contouren komen uit de landelijke database van de Rijksdienst voor het Cultureel Erfgoed. De laag toont uitsluitend **rijksmonumenten**; gemeentelijke en provinciale monumenten staan er niet in en worden apart bijgehouden. Statistieken gelden voor de kaartuitsnede van {city}, dus monumenten van buurgemeenten kunnen meetellen.",
      },
    ],
    links: [
      {
        label: "Rijksdienst voor het Cultureel Erfgoed",
        url: "https://www.cultureelerfgoed.nl",
      },
      {
        label: "Rijksmonumentenregister",
        url: "https://www.monumentenregister.cultureelerfgoed.nl",
      },
    ],
  },
  {
    layerId: "dso-bestemmingsplan",
    title: "Bestemmingsplannen en omgevingsdocumenten in {city}",
    subtitle:
      "Geldende ruimtelijke plannen via het Digitaal Stelsel Omgevingswet (DSO)",
    intro:
      "Deze laag haalt de geldende ruimtelijke plannen en omgevingsdocumenten voor {city} op via het Digitaal Stelsel Omgevingswet (DSO). Op dit moment zijn **{count} plangebieden** in beeld, elk met een titel, type, planstatus en het bevoegd gezag. De laag vereist een DSO-API-sleutel; zonder sleutel of buiten kantoortijden van de API kan het aantal 0 zijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Plangebieden in beeld", type: "count" },
          { label: "Bevoegde gezagen", type: "distinct", property: "bevoegdGezag" },
          { label: "Documenttypen", type: "distinct", property: "type" },
          {
            label: "Met plancontour",
            type: "count-where",
            property: "hasGeometry",
            equals: "true",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Plangebieden per planstatus in {city}",
        description:
          "DSO-veld planstatus — waar het document in de procedure staat (bv. onherroepelijk, vastgesteld)",
        property: "planstatus",
        maxCategories: 6,
      },
      {
        kind: "category-bar",
        title: "Plangebieden per documenttype",
        description: "DSO-veld type — het soort omgevingsdocument",
        property: "type",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak (of punt, als de contour niet kon worden opgehaald) staat voor een omgevingsdocument dat op die plek geldt: een bestemmingsplan, een omgevingsplan of een ander ruimtelijk besluit. Het veld *planstatus* laat zien waar het in de procedure staat, *bevoegdGezag* wie het heeft vastgesteld, en *type* om wat voor document het gaat. De laag toont alleen **actuele** documenten; historische plannen worden overgeslagen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Rechtszekerheid**: geldende plannen bepalen wat op een locatie is toegestaan — de basis voor vergunningverlening en handhaving.\n- **Omgevingswet**: onder de Omgevingswet gaan bestemmingsplannen op in één omgevingsplan per gemeente; deze laag laat de overgangssituatie zien.\n- **Initiatieven toetsen**: bij bouwplannen en functiewijzigingen is dit het startpunt om te zien welk regime geldt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt live uit het DSO (Omgevingsloket). De laag bemonstert een raster van punten over de kaartuitsnede en verzamelt de plannen die daar gelden; heel kleine plangebieden tussen de rasterpunten kunnen worden gemist. De contouren worden waar mogelijk opgehaald; lukt dat niet, dan verschijnt het plan als punt (*hasGeometry* = false). De DSO-API is aan verkeersbeperkingen onderhevig, dus het aantal kan per keer verschillen.",
      },
    ],
    links: [
      {
        label: "Omgevingsloket (DSO)",
        url: "https://omgevingswet.overheid.nl",
      },
      {
        label: "Over het Digitaal Stelsel Omgevingswet",
        url: "https://iplo.nl/digitaal-stelsel/",
      },
    ],
  },
  {
    layerId: "pdok-rioned-beheerleiding",
    title: "Riolering in {city}",
    subtitle:
      "Openbare rioolleidingen (BeheerLeiding) uit het gegevenswoordenboek GWSW van Stichting RIONED",
    intro:
      "Deze laag tekent **{count} rioolleidingen** binnen het kaartgebied van {city}: de openbare beheerleidingen die gemeenten en waterschappen aanleveren via het Gegevenswoordenboek Stedelijk Water (GWSW) van Stichting RIONED. Van vuilwaterriool en hemelwaterriool tot persleidingen en drains — samen vormen ze het ondergrondse afvoersysteem van de stad. Klik op een leiding voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Leidingen in beeld", type: "count" },
          {
            label: "Totale leidinglengte",
            type: "sum",
            property: "lengteLeiding",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Gem. leidinglengte",
            type: "avg",
            property: "lengteLeiding",
            unit: "m",
            decimals: 0,
          },
          {
            label: "Geregistreerde materialen",
            type: "distinct",
            property: "materiaalLeiding",
          },
        ],
      },
      {
        kind: "histogram",
        title: "Lengteverdeling van rioolleidingen in {city}",
        description:
          "Aantal leidingsegmenten per lengteklasse (RIONED-veld lengteLeiding, in meters)",
        property: "lengteLeiding",
        unit: "m",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is één rioolleiding of leidingsegment. Het riool bestaat uit verschillende typen: **vuilwaterriool** en **gemengd riool** voeren afvalwater af, **hemelwaterriool** en **infiltratieriolen** verwerken regenwater, en **persleidingen** transporteren afvalwater onder druk naar zuiveringen. De opgetelde lengte geeft de omvang van het stelsel in de uitsnede; de meeste segmenten zijn kort (van put tot put), enkele transportleidingen zijn lang.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Klimaatadaptatie**: de verhouding tussen gemengd en gescheiden (regenwater)riool bepaalt hoe kwetsbaar een gebied is voor wateroverlast en riooloverstorten bij hevige buien.\n- **Beheer en vervanging**: riolering is een van de grootste ondergrondse assets van een gemeente; leeftijd, materiaal en lengte sturen de vervangingsopgave en de rioolheffing.\n- **Werk in de ondergrond**: bij graven, herinrichten en het aanleggen van kabels en leidingen is de ligging van het riool essentieel.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt uit het GWSW van Stichting RIONED, waarin bronhouders (gemeenten en waterschappen) hun rioolgegevens standaardiseren. De volledigheid en detaillering verschillen per bronhouder: velden als materiaal, aanlegjaar en stelseltype zijn niet overal ingevuld. De kaartuitsnede van {city} kan ook leidingen van buurgemeenten en waterschappen bevatten. **Deze kaart vervangt nooit een KLIC-melding** bij graafwerkzaamheden.",
      },
    ],
    links: [
      { label: "Stichting RIONED — GWSW", url: "https://www.riool.net/gwsw" },
      {
        label: "PDOK: Beheer Stedelijk Water",
        url: "https://www.pdok.nl/introductie/-/article/rioned-beheer-stedelijk-water",
      },
    ],
  },
  {
    layerId: "bgt-nummeraanduiding",
    title: "Huisnummeraanduidingen (BGT) in {city}",
    subtitle:
      "Huisnummerlabels op de kaart uit de Basisregistratie Grootschalige Topografie",
    intro:
      "Deze laag toont **{count} huisnummeraanduidingen** binnen het kaartgebied van {city} uit de BGT: de labels die op de grootschalige basiskaart het huisnummer bij een pand plaatsen, met de juiste positie en oriëntatie. Het is de kaartweergave van adressen — handig om in één oogopslag te zien waar welke nummers liggen. Klik op een label voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Nummeraanduidingen in beeld", type: "count" },
          {
            label: "Status 'bestaand' (aandeel)",
            type: "count-where",
            property: "status",
            equals: "bestaand",
            asShare: true,
          },
          { label: "Bronhouders", type: "distinct", property: "bronhouder" },
          {
            label: "Hoogteliggingen",
            type: "distinct",
            property: "relatieve_hoogteligging",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een huisnummerlabel zoals dat op de BGT-kaart wordt getoond — het veld *tekst* bevat het huisnummer (soms met een toevoeging). Anders dan bij de BAG gaat het hier om de **cartografische plaatsing**: waar en onder welke hoek het nummer op de kaart hoort te staan, zodat het bij het juiste pand en de juiste entree valt. De labels zijn gekoppeld aan een pand en een BAG-verblijfsobject.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Orientatie en logistiek**: correcte nummerplaatsing helpt hulpdiensten, bezorging en beheerders een adres snel te vinden.\n- **Kaartkwaliteit**: als onderdeel van de BGT dragen deze labels bij aan een consistente, landsdekkende basiskaart die de hele overheid gebruikt.\n- **Adreskoppeling**: via het pand en verblijfsobject sluit deze laag naadloos aan op de BAG-adresregistratie.",
      },
      {
        heading: "Over de bron",
        body: "De huisnummeraanduidingen komen uit de BGT (via PDOK) en worden dagelijks geactualiseerd. De kaart is beperkt tot de uitsnede van {city} en laadt in de standaardweergave een deel van de labels; statistieken gaan over de geladen objecten. De inhoud is bewust beperkt tot kaartkenmerken (tekst, status, bronhouder) — voor volledige adresgegevens is de BAG de bron.",
      },
    ],
    links: [
      {
        label: "PDOK: Basisregistratie Grootschalige Topografie (BGT)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
    ],
  },
  {
    layerId: "bgt-openbare-ruimte",
    title: "Openbare-ruimtelabels (BGT) in {city}",
    subtitle:
      "Straat-, plein- en gebiedsnamen op de kaart uit de Basisregistratie Grootschalige Topografie",
    intro:
      "Deze laag toont **{count} openbare-ruimtelabels** binnen het kaartgebied van {city} uit de BGT: de namen van straten, pleinen, parken en andere openbare ruimten, geplaatst op hun juiste positie op de grootschalige basiskaart. Het is de tekstlaag die de kaart leesbaar maakt. Klik op een label voor naam en type.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Labels in beeld", type: "count" },
          {
            label: "Unieke namen",
            type: "distinct",
            property: "openbareruimtenaam",
          },
          {
            label: "Typen openbare ruimte",
            type: "distinct",
            property: "openbareruimtetype",
          },
          {
            label: "Status 'bestaand' (aandeel)",
            type: "count-where",
            property: "status",
            equals: "bestaand",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Labels per type openbare ruimte in {city}",
        description:
          "BGT-veld openbareruimtetype (bv. Weg, Water, Terrein, Kunstwerk)",
        property: "openbareruimtetype",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een naamlabel voor een openbare ruimte. Het veld *openbareruimtenaam* bevat de naam (bijvoorbeeld een straat of plein) en *openbareruimtetype* de soort — meestal *Weg*, maar ook *Water*, *Terrein* of *Kunstwerk*. Een lange straat kan meerdere labels hebben zodat de naam over de hele lengte leesbaar blijft; het aantal labels is daarom groter dan het aantal unieke namen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Kaartleesbaarheid**: naamlabels maken de basiskaart bruikbaar voor beheer, ontwerp en communicatie met bewoners.\n- **Adres- en gebiedsindeling**: openbare-ruimtenamen vormen samen met huisnummers de basis van het adressenstelsel (BAG).\n- **Beheer openbare ruimte**: het type (weg, water, groen) sluit aan op de beheerkaarten die gemeenten voor onderhoud gebruiken.",
      },
      {
        heading: "Over de bron",
        body: "De labels komen uit de BGT (via PDOK) en worden dagelijks bijgehouden. De kaart is beperkt tot de uitsnede van {city} en laadt in de standaardweergave een deel van de labels; statistieken gaan over de geladen objecten. Omdat dit een cartografische laag is, kan één naam meerdere keren voorkomen op verschillende plekken langs dezelfde ruimte.",
      },
    ],
    links: [
      {
        label: "PDOK: Basisregistratie Grootschalige Topografie (BGT)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
    ],
  },
];
