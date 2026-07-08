/**
 * Story maps — bestuurlijke grenzen & omgevingsfactoren (nationaal).
 * Lagen: bag-woonplaats, kadaster-gemeentegrenzen, kadaster-provinciegrenzen,
 * kadaster-landgrens, kadastrale-grens, cbs-gemeentegrenzen, cbs-postcode6,
 * cbs-postcode4-grens, ndw-emissiezones, rivm-geluidhinder-verkeer,
 * rivm-geluidhinder-trein.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "bag-woonplaats",
    title: "Woonplaatsgrenzen in en rond {city}",
    subtitle:
      "Officiële woonplaatsen uit de Basisregistratie Adressen en Gebouwen (BAG)",
    intro:
      "Binnen het kaartgebied van {city} liggen **{count} woonplaatsen** volgens de BAG: de formele, door de gemeenteraad aangewezen woonplaatsbegrenzingen waarbinnen elk adres in Nederland valt. Dit is geen buurt- of wijkindeling, maar de administratieve plaatsaanduiding die je terugziet in elk officieel adres. Klik op een vlak voor de woonplaatsnaam en de registratiestatus.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Woonplaatsen in beeld", type: "count" },
          {
            label: "Unieke woonplaatsnamen",
            type: "distinct",
            property: "woonplaats",
          },
          {
            label: "Status 'aangewezen'",
            type: "count-where",
            property: "status",
            equals: "Woonplaats aangewezen",
            asShare: true,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke polygoon is één woonplaats zoals vastgelegd in de **Basisregistratie Adressen en Gebouwen** (BAG). Een gemeente bestaat vaak uit meerdere woonplaatsen: de hoofdkern plus dorpen en buurtschappen met een eigen plaatsnaam. Elke woonplaats heeft een landelijk unieke *identificatie* en een *status* — vrijwel altijd “Woonplaats aangewezen”, het formele raadsbesluit waarmee de begrenzing geldt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Adressering**: elk adres in Nederland hangt aan precies één woonplaats; wijzigt de grens, dan wijzigen adressen mee.\n- **Basis voor andere registraties**: woonplaatsen vormen het geografische fundament onder de BAG en werken door in talloze systemen, van postbezorging tot hulpdiensten.\n- **Identiteit en beleid**: de woonplaatsindeling maakt zichtbaar uit welke kernen een gemeente is opgebouwd — relevant voor kernenbeleid, voorzieningenspreiding en dorpsplannen.",
      },
      {
        heading: "Over de bron",
        body: "De woonplaatsvlakken komen live uit de BAG-WFS van PDOK en zijn gefilterd op het kaartgebied van {city}. Woonplaatsen van buurgemeenten die de kaartuitsnede raken tellen daardoor mee. De BAG wordt door gemeenten zelf bijgehouden en is een wettelijke basisregistratie: dit zijn de authentieke grenzen.",
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
    layerId: "kadaster-gemeentegrenzen",
    title: "Gemeentegrenzen rond {city}",
    subtitle:
      "Actuele bestuurlijke gemeentegrenzen van het Kadaster, maandelijks bijgewerkt",
    intro:
      "Deze laag toont **{count} gemeentegebieden** binnen het kaartgebied van {city}, uit de dataset *Bestuurlijke Gebieden* van het Kadaster. Dit is de meest actuele, formele grens van elke gemeente — de referentie waar herindelingen en grenscorrecties als eerste in verschijnen. Klik op een grens voor de gemeentenaam, de CBS-gemeentecode en de provincie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gemeenten in beeld", type: "count" },
          { label: "Unieke gemeentenamen", type: "distinct", property: "naam" },
          {
            label: "Provincies",
            type: "distinct",
            property: "ligtInProvincieNaam",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Gemeenten in beeld per provincie",
        description:
          "Kadaster-veld ligtInProvincieNaam: de provincie waarin elke gemeente ligt",
        property: "ligtInProvincieNaam",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is de formele buitengrens van één gemeente. De grenzen zijn afgeleid uit de kadastrale registratie en worden **maandelijks** door het Kadaster geactualiseerd. Elke gemeente draagt een unieke code (zoals *0193*) die ook het CBS en alle andere overheidsregistraties gebruiken — dé sleutel om datasets aan gemeenten te koppelen. Grenst {city} aan een provinciegrens, dan zie je dat direct terug in de provincie-uitsplitsing hierboven.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bevoegdheid**: de gemeentegrens bepaalt letterlijk waar het gemeentelijk beleid ophoudt — van omgevingsplan tot afvalinzameling.\n- **Regionale samenwerking**: veel opgaven (wonen, mobiliteit, energie) spelen over de grens; de kaart laat zien met welke buren {city} schakelt.\n- **Data koppelen**: wie statistieken per gemeente op de kaart wil zetten, heeft precies deze geometrie en gemeentecodes nodig.",
      },
      {
        heading: "Over de bron",
        body: "De dataset *Bestuurlijke Gebieden* van het Kadaster (via PDOK) is de authentieke bron voor bestuurlijke grenzen en loopt bij herindelingen voor op de jaarlijkse CBS-versies. De statistieken gaan over de kaartuitsnede van {city}: buurgemeenten waarvan slechts een randje in beeld ligt tellen volledig mee.",
      },
    ],
    links: [
      {
        label: "PDOK: Bestuurlijke Gebieden",
        url: "https://www.pdok.nl/introductie/-/article/bestuurlijke-gebieden",
      },
      {
        label: "Kadaster: bestuurlijke grenzen",
        url: "https://www.kadaster.nl/zakelijk/registraties/basisregistraties/bestuurlijke-grenzen",
      },
    ],
  },
  {
    layerId: "kadaster-provinciegrenzen",
    title: "Provinciegrenzen rond {city}",
    subtitle:
      "De formele provinciegrens uit de Kadaster-dataset Bestuurlijke Gebieden",
    intro:
      "Binnen het kaartgebied van {city} raken **{count} provinciegebieden** de kaart. Deze laag tekent de formele buitengrens van elke provincie zoals het Kadaster die maandelijks actualiseert. Ligt {city} tegen een provinciegrens aan, dan zie je hier precies waar het gezag van de ene provincie overgaat in dat van de andere.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Provincies in beeld", type: "count" },
          { label: "Provincienamen", type: "distinct", property: "naam" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is de grens van één provincie, met de officiële naam en provinciecode (zoals *23* voor Overijssel) als klikbare eigenschappen. Voor de meeste gemeenten toont de kaartuitsnede maar één provincie; grensgemeenten zien er twee of meer. Dit is **referentiegeometrie**: de laag bevat bewust weinig attributen, want de waarde zit in de exacte ligging van de lijn.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bevoegd gezag**: provincies gaan over ruimtelijke verordeningen, natuur, regionale mobiliteit en vergunningen voor grotere activiteiten — de grens bepaalt welk provinciaal beleid geldt.\n- **Datakoppeling**: veel provinciale open data (natuurbeheerplannen, wegen, subsidiekaarten) stopt hard op deze lijn; handig om te weten waarom een dataset ineens 'ophoudt'.\n- **Regio-analyses**: bij vergelijkingen tussen gemeenten is de provincie een veelgebruikt schaalniveau.",
      },
      {
        heading: "Over de bron",
        body: "De grens komt uit de dataset *Bestuurlijke Gebieden* van het Kadaster via PDOK en wordt maandelijks bijgewerkt vanuit de kadastrale registratie. Provinciegrenzen wijzigen zelden, maar bij gemeentelijke herindelingen over provinciegrenzen heen verschuift ook deze lijn.",
      },
    ],
    links: [
      {
        label: "PDOK: Bestuurlijke Gebieden",
        url: "https://www.pdok.nl/introductie/-/article/bestuurlijke-gebieden",
      },
    ],
  },
  {
    layerId: "kadaster-landgrens",
    title: "De landsgrens van Nederland",
    subtitle: "Het formele landgebied uit de Kadaster-dataset Bestuurlijke Gebieden",
    intro:
      "Deze laag laadt **{count} landgebied(en)**: de officiële begrenzing van Nederland zoals het Kadaster die registreert. Voor het kaartgebied van {city} is dit vooral een referentielaag — de buitenste lijn waarbinnen alle andere bestuurlijke grenzen vallen. Ligt {city} niet aan de landsgrens of de kust, dan is de lijn zelf buiten beeld maar wordt het landsvlak wel geladen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Landgebieden geladen", type: "count" },
          { label: "Naam", type: "distinct", property: "naam" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Eén polygoon met de officiële naam *Nederland* en landcode *6030*: het Europese deel van het Koninkrijk zoals vastgelegd in de kadastrale registratie. De grens volgt op land de verdragsgrenzen met België en Duitsland en op zee de vastgestelde kustlijn-begrenzing van het landgebied. Het is de bovenste laag in de bestuurlijke hiërarchie: land → provincie → gemeente.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Kaartreferentie**: bij nationale analyses is dit dé clip-geometrie om data netjes op Nederland af te snijden.\n- **Grensgemeenten**: voor gemeenten aan de Belgische of Duitse grens is deze lijn de formele rand van de Nederlandse jurisdictie — inclusief bijzonderheden als de enclaves bij Baarle.\n- **Consistentie**: doordat land-, provincie- en gemeentegrenzen uit dezelfde Kadaster-dataset komen, sluiten ze exact op elkaar aan, zonder kieren of overlap.",
      },
      {
        heading: "Over de bron",
        body: "De dataset *Bestuurlijke Gebieden* van het Kadaster wordt via PDOK ontsloten en maandelijks geactualiseerd. De landsgrens zelf wijzigt vrijwel nooit; kleine correcties komen voort uit grensverdragen of nauwkeuriger inmeting.",
      },
    ],
    links: [
      {
        label: "PDOK: Bestuurlijke Gebieden",
        url: "https://www.pdok.nl/introductie/-/article/bestuurlijke-gebieden",
      },
    ],
  },
  {
    layerId: "kadastrale-grens",
    title: "Kadastrale perceelsgrenzen in {city}",
    subtitle:
      "Grenzen tussen kadastrale percelen uit de Basisregistratie Kadaster (BRK)",
    intro:
      "Binnen de kaartuitsnede van {city} zijn **{count} kadastrale grenzen** geladen: de lijnen die percelen van elkaar scheiden volgens de Basisregistratie Kadaster. Elk lijnstuk kent de percelen links en rechts ervan, een grenstype en een kwaliteitsklasse die aangeeft hoe nauwkeurig de grens is ingemeten. Let op: bij deze zeer gedetailleerde laag wordt standaard een beperkt aantal grenzen geladen — de cijfers gaan over wat er in beeld is.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Grenzen in beeld", type: "count" },
          {
            label: "Definitieve grenzen (aandeel)",
            type: "count-where",
            property: "typeGrensWaarde",
            equals: "Definitief",
            asShare: true,
          },
          {
            label: "Kwaliteitsklassen",
            type: "distinct",
            property: "ClassificatieKwaliteitWaarde",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Grenstype van kadastrale grenzen in {city}",
        description:
          "BRK-veld typeGrensWaarde: definitief ingemeten grenzen versus voorlopige en administratieve grenzen",
        property: "typeGrensWaarde",
        maxCategories: 5,
      },
      {
        kind: "category-bar",
        title: "Kwaliteitsklasse van de grenzen",
        description:
          "BRK-veld ClassificatieKwaliteitWaarde: klasse-indeling voor de nauwkeurigheid van de ingemeten grens",
        property: "ClassificatieKwaliteitWaarde",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is één kadastrale grens: de juridische scheiding tussen twee percelen. Het **grenstype** vertelt de status: een *definitieve* grens is door het Kadaster ingemeten en vastgesteld; andere grenzen zijn nog voorlopig (bijvoorbeeld na een recente splitsing) of administratief van aard. De **kwaliteitsklasse** zegt iets over de meetnauwkeurigheid — oudere grenzen zijn soms met minder precisie gedigitaliseerd dan recent ingemeten grenzen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Eigendom**: de kadastrale grens is de basis onder eigendomsrecht; bij verkoop, bouwplannen of grensgeschillen is dit de juridische referentie.\n- **Gebiedsontwikkeling**: verwerving, kavelruil en uitgifte van gemeentegrond beginnen bij de perceelstructuur.\n- **Nauwkeurigheid kennen**: de kwaliteitsklasse waarschuwt dat de getekende lijn niet overal centimeter-precies is — belangrijk bij het interpreteren van de kaart nabij erfgrenzen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De grenzen komen uit de **Kadastrale Kaart v5** (BRK) via PDOK. De kadastrale kaart is een *schets* van de registratie: juridisch bindend is de meetdocumentatie, niet de kaartlijn zelf. Deze laag is bedoeld als visuele referentie; voor rechtszekere informatie raadpleeg je het Kadaster. De statistieken betreffen alleen de geladen uitsnede, niet heel {city}.",
      },
    ],
    links: [
      {
        label: "PDOK: Kadastrale Kaart",
        url: "https://www.pdok.nl/introductie/-/article/kadastrale-kaart",
      },
      {
        label: "Kadaster: Basisregistratie Kadaster (BRK)",
        url: "https://www.kadaster.nl/zakelijk/registraties/basisregistraties/brk",
      },
    ],
  },
  {
    layerId: "cbs-gemeentegrenzen",
    title: "CBS-gemeentegrenzen met kerncijfers rond {city}",
    subtitle:
      "Gemeentegrenzen uit CBS Wijken & Buurten 2024, inclusief demografische kerncijfers",
    intro:
      "Deze laag toont **{count} gemeenten** binnen het kaartgebied van {city} uit de CBS-publicatie *Wijken en Buurten 2024*. Anders dan de kale Kadaster-grenzen draagt elke gemeente hier tientallen statistische kenmerken mee: inwonertal, huishoudens, bevolkingsdichtheid, woningvoorraad en meer. Klik op een gemeente om de kerncijfers te bekijken.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Gemeenten in beeld", type: "count" },
          {
            label: "Inwoners (som van deze gemeenten)",
            type: "sum",
            property: "aantalInwoners",
            decimals: 0,
          },
          {
            label: "Huishoudens (som)",
            type: "sum",
            property: "aantalHuishoudens",
            decimals: 0,
          },
          {
            label: "Gem. bevolkingsdichtheid",
            type: "avg",
            property: "bevolkingsdichtheidInwonersPerKm2",
            unit: "inw/km²",
            decimals: 0,
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Dezelfde gemeentegrenzen als in de Kadaster-laag, maar dan in de **statistische jaargang** van het CBS: een vaste peildatum (2024) met per gemeente de officiële kerncijfers. De grens verandert hier dus niet maandelijks mee met herindelingen — dat is juist de kracht: alle cijfers horen aantoonbaar bij deze exacte indeling. Ontbrekende of afgeschermde waarden geeft het CBS aan met speciale codes; die worden hier automatisch als 'leeg' behandeld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Benchmarken**: vergelijk {city} in één oogopslag met de buurgemeenten op inwonertal, dichtheid en huishoudenssamenstelling.\n- **Regionale opgaven**: woningbouwafspraken, zorgregio's en arbeidsmarktanalyses rekenen vrijwel altijd met deze CBS-indeling en -cijfers.\n- **Betrouwbare bron**: de Wijken en Buurten-kaart is de landelijke standaard voor gemeentestatistiek; iedereen rekent met dezelfde getallen.",
      },
      {
        heading: "Over de bron",
        body: "De data komt uit *CBS Wijken en Buurten 2024* via PDOK. De sommen en gemiddelden hierboven gaan over **alle gemeenten in de kaartuitsnede** — dus inclusief buurgemeenten — en zeggen daarmee iets over de regio, niet alleen over {city} zelf. Sommige velden zijn in de nieuwste jaargang nog niet gevuld; het CBS publiceert gefaseerd.",
      },
    ],
    links: [
      {
        label: "CBS: Wijk- en buurtkaart 2024",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart-2024",
      },
      {
        label: "PDOK: CBS Wijken en Buurten",
        url: "https://www.pdok.nl/introductie/-/article/cbs-wijken-en-buurten",
      },
    ],
  },
  {
    layerId: "cbs-postcode6",
    title: "Postcode 6-gebieden in {city}",
    subtitle:
      "CBS-statistieken op het fijnste schaalniveau: het volledige postcodegebied (PC6)",
    intro:
      "Binnen de kaartuitsnede van {city} zijn **{count} PC6-vlakken** geladen: gebiedjes van één volledige postcode (zoals *8043LV*), vaak niet groter dan één straatzijde. Het CBS publiceert per PC6 onder meer inwoners, huishoudens en woningvoorraad. Dit is het fijnste statistische schaalniveau dat openbaar beschikbaar is — klik op een vlak voor de cijfers.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC6-gebieden in beeld", type: "count" },
          {
            label: "Inwoners in deze gebieden",
            type: "sum",
            property: "aantalInwoners",
            decimals: 0,
          },
          {
            label: "Woningen",
            type: "sum",
            property: "aantalWoningen",
            decimals: 0,
          },
          {
            label: "Gem. huishoudensgrootte",
            type: "avg",
            property: "gemiddeldeHuishoudensgrootte",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Inwoners per PC6-gebied in {city}",
        description:
          "Verdeling van het aantal inwoners per postcodegebied — hoge uitschieters zijn flatcomplexen of dichte stadsstraten",
        property: "aantalInwoners",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke zescijferige postcode (vier cijfers + twee letters) is één vlak. Omdat een PC6 vaak maar enkele tientallen adressen telt, beschermt het CBS de privacy actief: **waarden worden afgerond op vijftallen** en cellen met te weinig waarnemingen worden onderdrukt. Onderdrukte waarden verschijnen hier automatisch als 'leeg' en tellen niet mee in de statistieken — de sommen zijn daardoor eerder een ondergrens.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Straatniveau-inzicht**: PC6 is fijn genoeg om verschillen bínnen een buurt te zien — bijvoorbeeld tussen een koopwoningstraat en een corporatieflat ernaast.\n- **Gerichte aanpak**: energiearmoede, eenzaamheid of woningverbetering laten zich op dit niveau veel preciezer lokaliseren dan per wijk.\n- **Koppelbaar**: vrijwel elk adressenbestand bevat een postcode, dus deze vlakken zijn dé brug tussen eigen gemeentedata en CBS-statistiek.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit *CBS Statistieken per postcode (PC6), jaargang 2024*, via PDOK. Let op:\n- Vanwege de laadgrootte wordt standaard een beperkt aantal vlakken geladen; de cijfers gaan over de geladen uitsnede, niet over heel {city}.\n- Door afronding en onderdrukking tellen PC6-cijfers nooit exact op tot buurt- of gemeentetotalen.\n- Gebieden zonder bewoning (bedrijventerrein, water) hebben veel lege velden.",
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
    layerId: "cbs-postcode4-grens",
    title: "Postcode 4-grenzen in {city}",
    subtitle:
      "De grenzen van viercijferige postcodegebieden (PC4) met CBS-kerncijfers",
    intro:
      "Deze laag tekent de grenzen van **{count} PC4-gebieden** in en rond {city}: de viercijferige postcodegebieden waarin wijken en dorpen zijn opgedeeld. De laag is bewust als *grenslijn* vormgegeven — als referentiekader onder de thematische PC4-lagen (zoals stationsafstand) die de vlakken juist inkleuren. Elk gebied draagt wel de volledige CBS-kerncijfers mee; klik op een grens voor de details.",
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
            label: "Woningen",
            type: "sum",
            property: "aantalWoningen",
            decimals: 0,
          },
          {
            label: "Gem. huishoudensgrootte",
            type: "avg",
            property: "gemiddeldeHuishoudensgrootte",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Inwoners per PC4-gebied in {city}",
        description:
          "Verdeling van het inwonertal per postcodegebied — stadswijken tellen vaak duizenden inwoners, buitengebied-postcodes honderden",
        property: "aantalInwoners",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een PC4-gebied omvat alle adressen met dezelfde vier postcodecijfers (zoals *8015*). De indeling is ooit door PostNL ontworpen voor postbezorging en valt daardoor **niet samen met wijk- of buurtgrenzen** — een PC4 kan over een gemeentegrens heen lopen. Het CBS berekent per gebied dezelfde soort kerncijfers als per buurt: demografie, huishoudens, woningvoorraad en nabijheid van voorzieningen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Communicatie**: bewoners kennen hun postcode beter dan hun CBS-buurtcode; PC4 is daardoor een natuurlijk schaalniveau voor participatie en gebiedsgericht werken.\n- **Analyses**: veel landelijke datasets (gezondheid, energie, criminaliteit) worden op PC4 gepubliceerd; deze grenzen zijn nodig om ze op de kaart te zetten.\n- **Referentiekader**: als grenslaag onder thematische PC4-kaarten voorkomt deze laag dat je vlakken zonder context interpreteert.",
      },
      {
        heading: "Over de bron",
        body: "De grenzen en cijfers komen uit *CBS Statistieken per postcode (PC4), jaargang 2024* via PDOK. De kaartuitsnede van {city} bevat ook PC4-gebieden van buurgemeenten; sommen gaan over alle geladen gebieden. Afgeschermde CBS-waarden worden automatisch als 'leeg' behandeld.",
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
    layerId: "ndw-emissiezones",
    title: "Emissiezones in en rond {city}",
    subtitle:
      "Milieuzones en zero-emissiezones voor voertuigen, uit de landelijke NDW-feed",
    intro:
      "Op dit moment liggen er **{count} emissiezones** binnen het kaartgebied van {city} volgens het landelijke register van het NDW. Een emissiezone is een gebied waar toegangseisen gelden voor de uitstoot van voertuigen — van milieuzones voor oudere diesels tot zero-emissiezones voor stadslogistiek. Veel gemeenten hebben (nog) geen zone; een lege kaart is hier dus een normaal en betekenisvol resultaat.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zones in beeld", type: "count" },
          { label: "Unieke zonenamen", type: "distinct", property: "name" },
          { label: "Zonetypen", type: "distinct", property: "type" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is één gereguleerde zone uit de landelijke DATEX II-feed *emissiezones* van het NDW — hetzelfde bestand dat navigatiesystemen en logistieke planners gebruiken. Per zone zijn de naam, het zonetype, de status en een verwijzing naar meer informatie beschikbaar. De begrenzing is de juridische zonegrens uit het verkeersbesluit van de gemeente.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Luchtkwaliteit**: milieuzones weren de meest vervuilende voertuigen uit binnensteden en drukke gebieden.\n- **Zero-emissie stadslogistiek**: tientallen gemeenten voeren vanaf 2025 zero-emissiezones voor bestel- en vrachtverkeer in; ondernemers moeten hun wagenpark hierop aanpassen.\n- **Handhaving en navigatie**: doordat de zones machineleesbaar in deze landelijke feed staan, kunnen routeplanners er automatisch omheen of doorheen plannen.",
      },
      {
        heading: "Over de bron",
        body: "De zones komen uit de open databestanden van het **Nationaal Dataportaal Wegverkeer** (NDW) en worden hier via een serverroute gefilterd op het kaartgebied van {city}. Gemeenten melden hun zones zelf aan; een recent ingestelde zone kan met enige vertraging in de feed verschijnen. Voor de actuele toegangsregels per voertuigcategorie is de gemeentelijke bekendmaking leidend.",
      },
    ],
    links: [
      {
        label: "NDW open data",
        url: "https://opendata.ndw.nu/",
      },
      {
        label: "Milieuzones in Nederland (rijksoverheid)",
        url: "https://www.milieuzones.nl/",
      },
    ],
  },
  {
    layerId: "rivm-geluidhinder-verkeer",
    title: "Geluidhinder door wegverkeer in {city}",
    subtitle:
      "RIVM-modelcijfers per buurt: aandeel inwoners met ernstige geluidhinder door wegverkeer",
    intro:
      "Deze laag kleurt **{count} buurten** in en rond {city} op de door het RIVM berekende **ernstige geluidhinder door wegverkeer** (peiljaar 2020). Het cijfer per buurt is het percentage inwoners dat naar verwachting ernstige hinder ondervindt van wegverkeersgeluid. Klik op een buurt voor de naam, de gemeente en de hinderpercentages per geluidbron.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. ernstige hinder wegverkeer",
            type: "avg",
            property: "weg",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Hoogste buurtscore",
            type: "max",
            property: "weg",
            unit: "%",
            decimals: 1,
          },
          { label: "Gemeenten in beeld", type: "distinct", property: "gm_naam" },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van geluidhinder door wegverkeer per buurt in {city}",
        description:
          "Aantal buurten per klasse van het percentage ernstig gehinderde inwoners (RIVM-veld 'weg')",
        property: "weg",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het RIVM berekent per buurt hoeveel procent van de inwoners **ernstige geluidhinder** ervaart, door de gemodelleerde geluidbelasting van wegverkeer te combineren met landelijke blootstelling-responsrelaties: hoe hoger het geluidniveau op de gevel, hoe groter de kans op ernstige hinder. Het is dus een *modelmatige schatting*, geen enquête per buurt. Naast het totaalcijfer voor wegverkeer bevat elke buurt ook hinderpercentages voor trein-, vlieg- en burengeluid — zichtbaar bij klikken.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Gezondheid**: langdurige geluidhinder hangt samen met slaapverstoring, stress en hart- en vaatziekten; geluid is na luchtkwaliteit de belangrijkste milieufactor voor gezondheid.\n- **Omgevingsbeleid**: de Omgevingswet vraagt gemeenten geluid mee te wegen bij woningbouw en herinrichting; buurten met hoge percentages zijn kandidaten voor stiller asfalt, lagere snelheden of afscherming.\n- **Prioriteren**: het buurtniveau maakt direct zichtbaar waar maatregelen de meeste bewoners helpen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de RIVM-kaart *ernstige geluidhinder per buurt* (peiljaar 2020), ontsloten via de geodataservice van het RIVM en de Atlas Leefomgeving. Kanttekeningen:\n- Het peiljaar is 2020; nieuwe wijken en recente verkeersmaatregelen zitten er niet in.\n- De kaartuitsnede van {city} bevat ook buurten van buurgemeenten.\n- Buurtgemiddelden verhullen verschillen binnen de buurt — direct langs een drukke weg is de hinder hoger dan het buurtcijfer suggereert.",
      },
    ],
    links: [
      {
        label: "Atlas Leefomgeving: geluid",
        url: "https://www.atlasleefomgeving.nl/thema/geluid",
      },
      {
        label: "RIVM geodataservices",
        url: "https://data.rivm.nl/geo/",
      },
    ],
  },
  {
    layerId: "rivm-geluidhinder-trein",
    title: "Geluidhinder door treinverkeer in {city}",
    subtitle:
      "RIVM-modelcijfers per buurt: aandeel inwoners met ernstige geluidhinder door het spoor",
    intro:
      "Deze laag toont voor **{count} buurten** in en rond {city} de door het RIVM berekende **ernstige geluidhinder door treinverkeer** (peiljaar 2020): het percentage inwoners per buurt dat naar verwachting ernstige hinder ondervindt van spoorgeluid. Buurten direct langs het spoor springen eruit; verder van het spoor zakt het percentage snel richting nul.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          {
            label: "Gem. ernstige hinder treinverkeer",
            type: "avg",
            property: "trein",
            unit: "%",
            decimals: 1,
          },
          {
            label: "Hoogste buurtscore",
            type: "max",
            property: "trein",
            unit: "%",
            decimals: 1,
          },
          { label: "Gemeenten in beeld", type: "distinct", property: "gm_naam" },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van treingeluidhinder per buurt in {city}",
        description:
          "Aantal buurten per klasse van het percentage ernstig gehinderde inwoners (RIVM-veld 'trein')",
        property: "trein",
        unit: "%",
        bins: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Net als bij de wegverkeerslaag is dit een **modelmatige schatting**: het RIVM combineert de berekende geluidbelasting van het spoor met blootstelling-responsrelaties tot een percentage ernstig gehinderde inwoners per buurt. Treingeluid heeft een ander karakter dan weggeluid — korte, luide passages in plaats van een continue bron — en wordt daardoor bij dezelfde gemiddelde geluidbelasting doorgaans als minder hinderlijk ervaren; de blootstelling-responsrelaties houden daar rekening mee.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bouwen langs het spoor**: stationsomgevingen zijn populaire verdichtingslocaties, maar juist daar is spoorgeluid een ontwerp-opgave (gevelisolatie, oriëntatie van woningen, afscherming).\n- **Combineer met de spoorlagen**: leg deze laag naast de spooras- en overweglagen om te zien welke buurten direct aan drukke trajecten liggen.\n- **Trillingen en nachtgoederen**: hoge treinhinder-percentages hangen vaak samen met (nachtelijk) goederenvervoer — een aandachtspunt dat niet uit geluidcijfers alleen blijkt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De cijfers komen uit de RIVM-kaart *ernstige geluidhinder per buurt* (peiljaar 2020) via de geodataservice van het RIVM en de Atlas Leefomgeving. Het peiljaar is 2020: wijzigingen in de dienstregeling, stiller materieel of nieuwe geluidsschermen van daarna zitten er niet in. In buurten zonder spoor is het percentage (vrijwel) nul — de kaart zegt dan vooral dat treingeluid daar geen thema is.",
      },
    ],
    links: [
      {
        label: "Atlas Leefomgeving: geluid",
        url: "https://www.atlasleefomgeving.nl/thema/geluid",
      },
      {
        label: "RIVM geodataservices",
        url: "https://data.rivm.nl/geo/",
      },
    ],
  },
];
