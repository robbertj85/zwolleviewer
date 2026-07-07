/**
 * Story maps — batch "wegennet".
 * Lagen: bgt-wegdeel, bgt-ondersteunendwegdeel, nwb-wegvakken,
 * nwb-hectopunten, ndw-wegkenmerken-snelheden, ndw-verkeersborden,
 * cbs-pc4-afstand-snelweg, bgt-bruggen, bgt-tunnels, osm-verkeersdrempels.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "bgt-wegdeel",
    title: "Wegdelen in {city}",
    subtitle:
      "Rijbanen, fiets- en voetpaden uit de Basisregistratie Grootschalige Topografie",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} wegdelen** geladen uit de BGT — de meest gedetailleerde topografische registratie van Nederland, bijgehouden op 20 cm nauwkeurig. Elk vlak is één wegdeel met een vaste *functie* (rijbaan, fietspad, voetpad, parkeervlak…) en een *fysiek voorkomen* (het soort verharding). Klik op een vlak voor de details.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegdelen in beeld", type: "count" },
          { label: "Verschillende functies", type: "distinct", property: "functie" },
          {
            label: "Fiets- en voetpaden (aandeel)",
            type: "count-where",
            property: "functie",
            equals: ["fietspad", "voetpad", "voetpad op trap"],
            asShare: true,
          },
          {
            label: "Gesloten verharding (aandeel)",
            type: "count-where",
            property: "fysiek_voorkomen",
            equals: "gesloten verharding",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Wegdelen in {city} naar functie",
        description: "BGT-veld functie, zoals geregistreerd door de bronhouder",
        property: "functie",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Type verharding",
        description:
          "BGT-veld fysiek_voorkomen: gesloten verharding is asfalt of beton, open verharding zijn klinkers en tegels",
        property: "fysiek_voorkomen",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "De BGT knipt de openbare ruimte op in kleine vlakken met elk precies één functie. Eén straat bestaat dus al snel uit tientallen wegdelen: de rijbaan, de fietspaden ernaast, de voetpaden, inritten en parkeervlakken zijn allemaal aparte objecten. Dat maakt deze laag geschikt om per vlak te zien *wat* iets is en *hoe* het verhard is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Wegbeheer & assetmanagement**: de verhouding tussen gesloten verharding (asfalt) en open verharding (klinkers) bepaalt onderhoudscycli en -kosten.\n- **Verkeersveiligheid**: het aandeel vrijliggende fiets- en voetpaden zegt iets over hoe goed langzaam verkeer gescheiden is van autoverkeer.\n- **Klimaatadaptatie**: verhard oppervlak voert regenwater snel af; deze laag is de basis voor verhardings- en vergroeningsanalyses.",
      },
      {
        heading: "Over de bron",
        body: "De BGT wordt bijgehouden door bronhouders (gemeenten, provincies, Rijkswaterstaat) en dagelijks via PDOK gepubliceerd. Deze kaart toont een uitsnede rond {city} en laadt standaard met een limiet — voor stedelijk gebied is het aantal wegdelen al snel veel groter dan wat in beeld staat. Gebruik *alles laden* voor een completer beeld; de statistieken gaan altijd over de geladen objecten.",
      },
    ],
    links: [
      {
        label: "BGT via PDOK (brondata)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
      {
        label: "IMGeo/BGT objectenhandboek: wegdeel",
        url: "https://docs.geostandaarden.nl/imgeo/catalogus/bgt/",
      },
    ],
  },

  {
    layerId: "bgt-ondersteunendwegdeel",
    title: "Ondersteunende wegdelen in {city}",
    subtitle: "Bermen en verkeerseilanden uit de BGT",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} ondersteunende wegdelen** geladen uit de BGT. Dit zijn de vlakken die geen verkeersfunctie hebben maar wél bij de weg horen: bermen langs de rijbaan en verkeerseilanden op kruispunten en rotondes.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Objecten in beeld", type: "count" },
          {
            label: "Bermen (aandeel)",
            type: "count-where",
            property: "functie",
            equals: "berm",
            asShare: true,
          },
          {
            label: "Verkeerseilanden",
            type: "count-where",
            property: "functie",
            equals: "verkeerseiland",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Ondersteunende wegdelen naar functie",
        description: "BGT-veld functie",
        property: "functie",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Een *berm* is de strook tussen de rijbaan en de rest van de omgeving — vaak gras, soms half verhard. Een *verkeerseiland* is een verhoogd of gemarkeerd vlak dat verkeersstromen scheidt, zoals middengeleiders en rotonde-eilanden. Samen vormen ze de 'randen' van het wegennet die je op de laag *BGT Wegdeel* niet ziet.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Groenbeheer**: bermen zijn een grote beheerpost (maaien, ecologisch bermbeheer) en tegelijk kansrijk voor biodiversiteit.\n- **Verkeersveiligheid**: verkeerseilanden dwingen snelheid af en maken oversteken in twee etappes mogelijk — hun aantal en ligging zegt iets over de inrichting van kruispunten.\n- **Waterberging**: onverharde bermen laten regenwater infiltreren en verlichten het riool.",
      },
      {
        heading: "Over de bron",
        body: "Ook deze laag komt uit de dagelijks geactualiseerde BGT via PDOK. De data wordt geladen voor de kaartuitsnede van {city} en standaard met een limiet; de cijfers hierboven gaan over de geladen objecten, niet noodzakelijk over de hele gemeente.",
      },
    ],
    links: [
      {
        label: "BGT via PDOK (brondata)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
      {
        label: "IMGeo/BGT objectenhandboek: ondersteunend wegdeel",
        url: "https://docs.geostandaarden.nl/imgeo/catalogus/bgt/",
      },
    ],
  },

  {
    layerId: "nwb-wegvakken",
    title: "Het wegennet van {city} volgens het NWB",
    subtitle:
      "Wegvakken met straatnaam en wegbeheerder uit het Nationaal Wegenbestand",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} wegvakken** geladen uit het Nationaal Wegenbestand (NWB) van Rijkswaterstaat. Een wegvak is een stukje weg tussen twee kruispunten (juncties), met daaraan gekoppeld de straatnaam, de wegbeheerder en het wegnummer. Het NWB is dé referentie waarop verkeersdata in Nederland wordt geprikt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Wegvakken in beeld", type: "count" },
          { label: "Unieke straatnamen", type: "distinct", property: "sttNaam" },
          {
            label: "Gemiddelde wegvaklengte",
            type: "avg",
            property: "stLengthshape",
            unit: "m",
            decimals: 0,
          },
          {
            label: "In gemeentelijk beheer (aandeel)",
            type: "count-where",
            property: "wegbehsrt",
            equals: "G",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Wegvakken naar soort wegbeheerder",
        description:
          "NWB-veld wegbehsrt: wie is verantwoordelijk voor beheer en onderhoud",
        property: "wegbehsrt",
        valueLabels: {
          G: "Gemeente",
          R: "Rijk (Rijkswaterstaat)",
          P: "Provincie",
          W: "Waterschap",
          T: "Overige beheerder",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is één wegvak: het NWB modelleert het wegennet als een netwerk van vakken tussen juncties. Klik op een lijn voor de straatnaam (*sttNaam*), woonplaats en beheerder. Het verschil tussen het aantal wegvakken en het aantal unieke straatnamen laat zien dat een gemiddelde straat uit meerdere vakken bestaat — elk zijstraatje 'knipt' de weg.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Wie betaalt het onderhoud?** De beheerder-verdeling laat direct zien welk deel van het net onder de gemeente valt en welk deel onder Rijk, provincie of waterschap.\n- **Referentienetwerk**: verkeersborden, maximumsnelheden, ongevallen en verkeersintensiteiten worden landelijk aan NWB-wegvakken gekoppeld. Wie met verkeersdata werkt, komt altijd bij het NWB uit.\n- **Routering & hulpdiensten**: het NWB is de basis voor aanrijtijdenanalyses en routeplanning van hulpdiensten.",
      },
      {
        heading: "Over de bron",
        body: "Het NWB wordt maandelijks geactualiseerd door Rijkswaterstaat, mede op basis van de BGT, en is via PDOK als open data beschikbaar. Deze kaart laadt de wegvakken binnen de kaartuitsnede van {city} en standaard met een limiet — in stedelijk gebied is het werkelijke aantal wegvakken vaak groter dan wat geladen is.",
      },
    ],
    links: [
      {
        label: "Nationaal Wegenbestand (NWB)",
        url: "https://www.nationaalwegenbestand.nl/",
      },
      {
        label: "NWB Wegen via PDOK (brondata)",
        url: "https://www.pdok.nl/introductie/-/article/nationaal-wegen-bestand-nwb-",
      },
    ],
  },

  {
    layerId: "nwb-hectopunten",
    title: "Hectometerpalen rond {city}",
    subtitle: "Hectopunten langs rijks- en provinciale wegen uit het NWB",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} hectopunten** geladen uit het Nationaal Wegenbestand. Dit zijn de bekende groene hectometerpaaltjes langs snelwegen en N-wegen: elke 100 meter één, met daarop de hectometrering en de wegzijde. Ze vormen het landelijke referentiesysteem voor plaatsbepaling op de weg.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Hectopunten in beeld", type: "count" },
          { label: "Aantal wegvakken met punten", type: "distinct", property: "wvkId" },
          {
            label: "Laagste hectometrering",
            type: "min",
            property: "hectomtrng",
            decimals: 0,
          },
          {
            label: "Hoogste hectometrering",
            type: "max",
            property: "hectomtrng",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Hectopunten naar wegzijde",
        description:
          "NWB-veld zijde: aan welke kant van de weg het punt ligt, gezien in de richting van de hectometrering",
        property: "zijde",
        valueLabels: {
          Li: "Linkerzijde",
          Re: "Rechterzijde",
          M: "Midden",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een hectopunt, gekoppeld aan een NWB-wegvak (*wvkId*). De hectometrering loopt op langs de weg; samen met de wegzijde (*Li*/*Re*) en eventueel een hectoletter is elke locatie op het hoofdwegennet exact aan te duiden — precies zoals in verkeersinformatie: “file op de A28 Links bij hectometerpaal 92,3”.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Incidentafhandeling**: hulpdiensten, weginspecteurs en de ANWB lokaliseren pech en ongevallen op hectometrering — het is de gemeenschappelijke taal van de weg.\n- **Ongevallenanalyse**: ongevallenregistraties (BRON) verwijzen naar hectopunten, zodat black spots op het hoofdwegennet exact te lokaliseren zijn.\n- **Beheer**: wegwerkzaamheden, bewegwijzering en inspecties worden gepland en aanbesteed op hectometertrajecten.",
      },
      {
        heading: "Over de bron",
        body: "Hectopunten liggen vooral langs rijkswegen en provinciale wegen; in gemeenten zonder snelweg door de kaartuitsnede kan het aantal dus laag zijn. De data komt uit het maandelijks geactualiseerde NWB via PDOK en is geladen voor de kaartuitsnede van {city}, standaard met een limiet.",
      },
    ],
    links: [
      {
        label: "Nationaal Wegenbestand (NWB)",
        url: "https://www.nationaalwegenbestand.nl/",
      },
      {
        label: "NWB Wegen via PDOK (brondata)",
        url: "https://www.pdok.nl/introductie/-/article/nationaal-wegen-bestand-nwb-",
      },
    ],
  },

  {
    layerId: "ndw-wegkenmerken-snelheden",
    title: "Maximumsnelheden in {city}",
    subtitle:
      "Snelheidslimieten per wegvak uit de NDW Wegkenmerken Database (WKD)",
    intro:
      "Deze laag kleurt elk wegvak in {city} naar de geldende **maximumsnelheid**, van 15 km/u in het woonerf tot 130 km/u op de snelweg. De data komt uit de Wegkenmerken Database (WKD) van het Nationaal Dataportaal Wegverkeer en wordt maandelijks bijgewerkt op basis van verkeersbesluiten, bebording en het Nationaal Wegenbestand.",
    charts: [],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke kleur staat voor een snelheidsregime: onder meer paars voor 30 km/u, oranje voor 50, groen-blauwtinten voor 60–80 en geel voor 100 km/u. Grijs betekent *niet van toepassing* of *onbekend*. Deze laag wordt als **vector tiles** rechtstreeks vanaf de NDW-tegelserver getekend — daardoor blijft hij vlot, ook bij een volledig stedelijk wegennet, maar zijn er in dit verhaal geen telstatistieken per object beschikbaar zoals bij andere lagen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **30 km/u-beleid**: veel gemeenten breiden 30 km/u-zones uit (GOW30). Deze kaart laat zien waar dat al geregeld is en waar nog 50 geldt.\n- **Verkeersveiligheid**: snelheid is de belangrijkste factor in de ernst van ongevallen; het snelhedenbeeld is de basis voor een risicogestuurde aanpak (SPV).\n- **Handhaving en modellering**: verkeersmodellen, navigatiesystemen en ISA (intelligente snelheidsassistentie) gebruiken exact deze database.",
      },
      {
        heading: "Over de bron",
        body: "De WKD combineert verkeersbesluiten, bebording uit beeldherkenning en het NWB tot één landsdekkend bestand van wegkenmerken. Let op: de kaart toont de *geregistreerde* limiet; recente verkeersbesluiten kunnen enkele weken tot een maand achterlopen. Fouten kunnen via het NDW-loket worden gemeld — gemeenten zijn zelf bronhouder voor hun wegen.",
      },
    ],
    links: [
      {
        label: "NDW Wegkenmerken Database (WKD)",
        url: "https://wegkenmerken.ndw.nu",
      },
      {
        label: "Nationaal Dataportaal Wegverkeer (NDW)",
        url: "https://www.ndw.nu/",
      },
    ],
  },

  {
    layerId: "ndw-verkeersborden",
    title: "Verkeersborden in {city}",
    subtitle: "Alle geregistreerde verkeersborden uit de landelijke NDW-database",
    intro:
      "Binnen {city} zijn **{count} verkeersborden** geladen uit de landelijke verkeersbordendatabase van het NDW. Elk punt is één fysiek bord, met de RVV-code (het bordtype), de straatnaam en vaak een foto. De database is grotendeels opgebouwd met beeldherkenning op straatbeelden en wordt aangevuld door wegbeheerders.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Borden in beeld", type: "count" },
          { label: "Verschillende bordtypen (RVV)", type: "distinct", property: "rvvCode" },
          { label: "Straten met borden", type: "distinct", property: "roadName" },
          {
            label: "Gevalideerd (aandeel)",
            type: "count-where",
            property: "validated",
            equals: "y",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Meest voorkomende bordtypen in {city}",
        description:
          "NDW-veld rvvCode: de bordcode uit het Reglement verkeersregels en verkeerstekens",
        property: "rvvCode",
        maxCategories: 8,
        valueLabels: {
          A1: "A1 – maximumsnelheid",
          A2: "A2 – einde maximumsnelheid",
          B1: "B1 – voorrangsweg",
          B6: "B6 – verleen voorrang",
          C1: "C1 – gesloten verklaring",
          C2: "C2 – eenrichting, gesloten",
          D1: "D1 – rotonde",
          D2: "D2 – gebod voorbijgaan",
          E1: "E1 – parkeerverbod",
          E4: "E4 – parkeergelegenheid",
          E6: "E6 – gehandicaptenparkeerplaats",
          E7: "E7 – laden en lossen",
          G7: "G7 – voetpad",
          G11: "G11 – verplicht fietspad",
          G12a: "G12a – fiets/bromfietspad",
          G13: "G13 – onverplicht fietspad",
          L2: "L2 – voetgangersoversteekplaats",
          J22: "J22 – waarschuwing oversteekplaats",
          J37: "J37 – waarschuwing gevaar",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een geregistreerd verkeersbord. De *RVV-code* vertelt wat het bord doet: de A-serie regelt snelheid, B voorrang, C geslotenverklaringen, D gebodsrichtingen, E parkeren en stilstaan, G de aard van de weg en J waarschuwingen. Klik op een bord voor de straat, de kijkrichting en meestal een foto uit de inwinning.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Assetmanagement**: borden zijn gemeentelijke assets — een actueel bordenbestand is nodig voor beheer, vervanging en schouw.\n- **Consistentie met verkeersbesluiten**: staat er een bord zonder besluit, of andersom? Deze database maakt zulke controles mogelijk.\n- **Bordensanering**: veel gemeenten willen het aantal borden terugdringen; de verdeling per type laat zien waar de grootste aantallen staan.\n- **Smart mobility**: navigatie- en ADAS-systemen gebruiken deze data voor snelheidsadvies en waarschuwingen.",
      },
      {
        heading: "Over de bron",
        body: "De landelijke verkeersbordendatabase van het NDW is voor een groot deel geautomatiseerd ingewonnen; het veld *validated* geeft aan of een bord door de wegbeheerder is gecontroleerd. Een laag validatie-aandeel betekent niet dat borden er niet staan, maar dat de registratie nog niet formeel is bevestigd. Deze laag wordt per gemeente opgevraagd en toont dus de hele gemeente {city}.",
      },
    ],
    links: [
      {
        label: "NDW verkeersbordendatabase (brondata)",
        url: "https://docs.ndw.nu/api/trafficsigns/nl/index.html",
      },
      {
        label: "Overzicht RVV-verkeersborden (Rijksoverheid)",
        url: "https://www.rijksoverheid.nl/onderwerpen/verkeersregels/vraag-en-antwoord/wat-betekenen-de-verschillende-verkeersborden",
      },
    ],
  },

  {
    layerId: "cbs-pc4-afstand-snelweg",
    title: "Afstand tot de snelwegoprit in {city}",
    subtitle:
      "Gemiddelde afstand tot de dichtstbijzijnde oprit van een hoofdverkeersweg, per postcodegebied (CBS)",
    intro:
      "Deze laag kleurt de **{count} geladen postcodegebieden (PC4)** in en rond {city} naar de gemiddelde afstand tot de dichtstbijzijnde oprit van een hoofdverkeersweg. Het CBS berekent die afstand over de weg (niet hemelsbreed) voor alle inwoners van een gebied en middelt dat per postcode.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "PC4-gebieden in beeld", type: "count" },
          {
            label: "Gemiddelde afstand",
            type: "avg",
            property: "dichtstbijzijndeOpritHoofdverkeerswegAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Kortste (per gebied)",
            type: "min",
            property: "dichtstbijzijndeOpritHoofdverkeerswegAfstandInKm",
            unit: "km",
            decimals: 1,
          },
          {
            label: "Langste (per gebied)",
            type: "max",
            property: "dichtstbijzijndeOpritHoofdverkeerswegAfstandInKm",
            unit: "km",
            decimals: 1,
          },
        ],
      },
      {
        kind: "histogram",
        title: "Verdeling van de afstand tot de snelwegoprit",
        description:
          "Aantal PC4-gebieden per afstandsklasse (CBS-veld dichtstbijzijndeOpritHoofdverkeerswegAfstandInKm)",
        property: "dichtstbijzijndeOpritHoofdverkeerswegAfstandInKm",
        unit: "km",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een viercijferig postcodegebied. De waarde is de *gemiddelde reisafstand over de weg* van alle inwoners van dat gebied tot de dichtstbijzijnde oprit van een hoofdverkeersweg (snelweg of autoweg). Lichte gebieden liggen dicht bij een oprit, donkere verder weg. Klik op een vlak voor de postcode en de exacte waarde.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bereikbaarheid**: nabijheid van een oprit is een belangrijke vestigingsfactor voor bedrijven en logistiek.\n- **Verkeersstromen**: wijken ver van een oprit genereren meer kilometers over het onderliggende wegennet — relevant voor sluipverkeer en de keuze van ontsluitingsroutes.\n- **Ruimtelijke planning**: bij nieuwe woon- of werklocaties weegt de afstand tot het hoofdwegennet mee in mobiliteitstoetsen en MER-onderzoek.",
      },
      {
        heading: "Over de bron",
        body: "De cijfers komen uit de CBS-statistiek *Nabijheid voorzieningen*, gepubliceerd per PC4 via PDOK. Het gaat om een gebiedsgemiddelde: binnen één postcodegebied kan de werkelijke afstand per adres flink verschillen. De kaart toont de PC4-vlakken die de kaartuitsnede van {city} snijden — randgebieden kunnen deels buiten de gemeente vallen.",
      },
    ],
    links: [
      {
        label: "CBS Postcode-4 statistieken via PDOK",
        url: "https://www.pdok.nl/introductie/-/article/cbs-postcode-statistieken",
      },
      {
        label: "CBS Nabijheidsstatistieken (toelichting)",
        url: "https://www.cbs.nl/nl-nl/reeksen/publicatie/nabijheid-voorzieningen-buurtcijfers",
      },
    ],
  },

  {
    layerId: "bgt-bruggen",
    title: "Bruggen en viaducten in {city}",
    subtitle: "Overbruggingsdelen — civiele kunstwerken uit de BGT",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} overbruggingsdelen** geladen uit de BGT. Een brug of viaduct bestaat in de BGT niet als één object, maar als een verzameling *overbruggingsdelen*: het dek waar je overheen rijdt, de landhoofden aan weerszijden en eventuele pijlers eronder.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Overbruggingsdelen in beeld", type: "count" },
          {
            label: "Brugdekken",
            type: "count-where",
            property: "type_overbruggingsdeel",
            equals: "dek",
          },
          {
            label: "Pijlers",
            type: "count-where",
            property: "type_overbruggingsdeel",
            equals: "pijler",
          },
          {
            label: "Landhoofden",
            type: "count-where",
            property: "type_overbruggingsdeel",
            equals: "landhoofd",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Overbruggingsdelen naar type",
        description:
          "BGT-veld type_overbruggingsdeel: uit welke onderdelen de kunstwerken zijn opgebouwd",
        property: "type_overbruggingsdeel",
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is één onderdeel van een kunstwerk. Het *dek* is het rijdende of lopende oppervlak, *landhoofden* dragen de uiteinden, *pijlers* de tussensteunpunten. Het aantal dekken benadert daarmee het aantal bruggen en viaducten in beeld het best — één kunstwerk telt immers meerdere delen. Waar geregistreerd geeft het veld *hoort_bij_typeoverbrugging* ook aan of het om een brug, viaduct of aquaduct gaat, maar dit optionele veld is lang niet overal ingevuld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Assetmanagement**: bruggen en viaducten zijn de duurste assets in de openbare ruimte; veel naoorlogse kunstwerken naderen het einde van hun levensduur (de landelijke vervangings- en renovatieopgave).\n- **Constructieve veiligheid**: een compleet overzicht van kunstwerken is de basis voor inspectieprogramma's en aslastbeperkingen.\n- **Vaarwegen en ecologie**: bruggen bepalen doorvaarthoogtes en zijn — als ecoduct — ook schakels in ecologische verbindingen.",
      },
      {
        heading: "Over de bron",
        body: "De BGT wordt dagelijks geactualiseerd via PDOK; bronhouders zijn gemeenten, provincies, waterschappen en Rijkswaterstaat. De laag is geladen voor de kaartuitsnede van {city} met een laadlimiet; de statistieken beschrijven de geladen delen, niet per se alle kunstwerken in de gemeente.",
      },
    ],
    links: [
      {
        label: "BGT via PDOK (brondata)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
      {
        label: "IMGeo/BGT objectenhandboek: overbruggingsdeel",
        url: "https://docs.geostandaarden.nl/imgeo/catalogus/bgt/",
      },
    ],
  },

  {
    layerId: "bgt-tunnels",
    title: "Tunnels en onderdoorgangen in {city}",
    subtitle: "Tunneldelen uit de BGT",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} tunneldelen** geladen uit de BGT. Een tunneldeel is het vlak waar een weg, fietspad of spoorlijn *onder* iets anders doorgaat — van grote verkeerstunnels tot fietsonderdoorgangen onder een rotonde of spoorlijn.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Tunneldelen in beeld", type: "count" },
          {
            label: "Diepste niveau (t.o.v. maaiveld)",
            type: "min",
            property: "relatieve_hoogteligging",
            decimals: 0,
          },
          {
            label: "Bestaand (aandeel)",
            type: "count-where",
            property: "status",
            equals: "bestaand",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Tunneldelen naar hoogteniveau",
        description:
          "BGT-veld relatieve_hoogteligging: aantal niveaus onder (negatief) of op maaiveld",
        property: "relatieve_hoogteligging",
        valueLabels: {
          "0": "Op maaiveld",
          "-1": "1 niveau onder maaiveld",
          "-2": "2 niveaus onder maaiveld",
          "-3": "3 niveaus onder maaiveld",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak markeert een passage onder maaiveld. De *relatieve hoogteligging* geeft aan hoe diep: −1 is één niveau onder maaiveld (de meeste onderdoorgangen), −2 of dieper komt voor bij gestapelde infrastructuur. Let op: lange tunnels kunnen uit meerdere tunneldelen bestaan, dus het aantal delen is niet één-op-één het aantal tunnels.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Sociale veiligheid**: fiets- en voetgangersonderdoorgangen zijn vaak aandachtslocaties voor verlichting en zichtbaarheid.\n- **Wateroverlast**: onderdoorgangen zijn de laagste punten van het wegennet en lopen bij hoosbuien als eerste onder — cruciaal voor klimaatstresstesten.\n- **Barrièrewerking**: tunnels en onderdoorgangen bepalen waar langzaam verkeer spoorlijnen en drukke wegen veilig kan kruisen.",
      },
      {
        heading: "Over de bron",
        body: "De BGT wordt dagelijks geactualiseerd en via PDOK ontsloten. Deze laag toont de tunneldelen binnen de kaartuitsnede van {city}; in veel gemeenten is het aantal beperkt, waardoor de cijfers hierboven klein maar wel compleet voor de uitsnede kunnen zijn.",
      },
    ],
    links: [
      {
        label: "BGT via PDOK (brondata)",
        url: "https://www.pdok.nl/introductie/-/article/basisregistratie-grootschalige-topografie-bgt-",
      },
      {
        label: "IMGeo/BGT objectenhandboek: tunneldeel",
        url: "https://docs.geostandaarden.nl/imgeo/catalogus/bgt/",
      },
    ],
  },

  {
    layerId: "osm-verkeersdrempels",
    title: "Verkeersdrempels in {city}",
    subtitle:
      "Drempels, plateaus en kussens uit OpenStreetMap (traffic calming)",
    intro:
      "In {city} zijn **{count} snelheidsremmers** gevonden in OpenStreetMap: verkeersdrempels, verkeersplateaus en verkeerskussens, door vrijwilligers in kaart gebracht met de tag `traffic_calming`. Elke stip is één fysieke maatregel op de rijbaan.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Snelheidsremmers in beeld", type: "count" },
          {
            label: "Plateaus (aandeel)",
            type: "count-where",
            property: "traffic_calming",
            equals: "table",
            asShare: true,
          },
          {
            label: "Verkeerskussens",
            type: "count-where",
            property: "traffic_calming",
            equals: "cushion",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Snelheidsremmers naar type",
        description: "OpenStreetMap-tag traffic_calming",
        property: "traffic_calming",
        valueLabels: {
          bump: "Drempel, kort (bump)",
          hump: "Drempel, lang (hump)",
          table: "Verkeersplateau (table)",
          cushion: "Verkeerskussen (cushion)",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "OpenStreetMap onderscheidt verschillende typen snelheidsremmers:\n- **bump**: korte, steile drempel — vooral in 30 km/u-straten;\n- **hump**: langere sinusdrempel, comfortabeler bij de juiste snelheid;\n- **table**: verkeersplateau, een verhoogd vlak — vaak op kruispunten en oversteekplaatsen;\n- **cushion**: verkeerskussen dat auto's remt maar bussen en hulpdiensten (met bredere spoorbreedte) doorlaat.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: drempels zijn de meest gebruikte fysieke maatregel om snelheid in verblijfsgebieden af te dwingen — de kaart laat zien waar de inrichting het 30 km/u-regime ondersteunt.\n- **Hulpdiensten en OV**: elke drempel kost aanrijtijd en comfort; brandweer en busvervoerders kijken kritisch mee bij nieuwe drempels, en kussens zijn vaak het compromis.\n- **Trillingen en klachten**: drempels nabij woningen kunnen trillinghinder geven; een overzicht helpt bij het afhandelen van meldingen.",
      },
      {
        heading: "Over de bron",
        body: "Deze data komt uit OpenStreetMap via de Overpass API en beslaat de hele gemeente {city}. OSM is vrijwilligerswerk: de volledigheid verschilt per buurt, en een ontbrekende drempel op de kaart betekent niet dat hij er niet is. Omgekeerd is wat er wél staat doorgaans betrouwbaar en actueel — en iedereen kan verbeteringen direct bijdragen.",
      },
    ],
    links: [
      {
        label: "OSM-wiki: traffic_calming",
        url: "https://wiki.openstreetmap.org/wiki/Key:traffic_calming",
      },
      {
        label: "OpenStreetMap",
        url: "https://www.openstreetmap.org/",
      },
    ],
  },
];
