/**
 * Story maps — laadinfrastructuur & laden/lossen.
 * Lagen: ndw-laadpunten-ocpi, laadpunten-bouw, ndw-verkeersborden-e7.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "ndw-laadpunten-ocpi",
    title: "Publieke laadpunten in {city}",
    subtitle:
      "EV-laadlocaties met actuele status uit de landelijke NDW OCPI-feed",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} laadlocaties** geladen uit de open OCPI-feed van het Nationaal Dataportaal Wegverkeer (NDW). Elke stip is een laadlocatie met één of meer laadpunten (EVSE's); klik erop voor adres, exploitant, connectortypes, maximaal vermogen en de actuele bezetting.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Laadlocaties in beeld", type: "count" },
          {
            label: "Laadpunten (EVSE's) totaal",
            type: "sum",
            property: "evses_totaal",
          },
          {
            label: "24/7 geopend (aandeel)",
            type: "count-where",
            property: "24/7",
            equals: "Ja",
            asShare: true,
          },
          { label: "Exploitanten", type: "distinct", property: "operator" },
        ],
      },
      {
        kind: "category-bar",
        title: "Laadlocaties per exploitant in {city}",
        description:
          "Aantal laadlocaties per operator, zoals aangemeld in de OCPI-feed",
        property: "operator",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Waar staan de laadpunten?",
        description: "OCPI-veld parking_type van elke laadlocatie",
        property: "parkeertype",
        valueLabels: {
          ON_STREET: "Langs de openbare weg",
          PARKING_LOT: "Parkeerterrein",
          PARKING_GARAGE: "Parkeergarage",
          UNDERGROUND_GARAGE: "Ondergrondse garage",
          ON_DRIVEWAY: "Op eigen terrein / oprit",
          ALONG_MOTORWAY: "Langs de snelweg",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een *laadlocatie*: een adres waar één of meer laadpunten (in OCPI-jargon **EVSE's**) staan. Eén laadpaal in de straat telt meestal twee EVSE's — twee auto's kunnen tegelijk laden. Het verschil tussen het aantal locaties en het totaal aantal EVSE's laat dus zien hoeveel laad-*capaciteit* er werkelijk is. De feed bevat ook de actuele status per EVSE (beschikbaar, ladend of bezet) en het maximale vermogen — van reguliere AC-palen (11–22 kW) tot DC-snelladers.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Energietransitie**: het aantal elektrische auto's groeit hard; gemeenten zijn via de Nationale Agenda Laadinfrastructuur (NAL) verantwoordelijk voor voldoende publieke laadpunten.\n- **Plankaart**: witte vlekken op deze kaart zijn kandidaat-locaties voor nieuwe laadpalen, zeker in wijken met veel bewoners zonder eigen oprit.\n- **Netcongestie**: de spreiding en het vermogen van laadpunten bepalen mede de belasting van het elektriciteitsnet per buurt.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "NDW publiceert deze feed volgens de internationale **OCPI 2.2.1**-standaard; laadpaalexploitanten leveren de data zelf aan. Niet elke exploitant doet (al) mee, dus het werkelijke aantal laadpunten kan hoger liggen — private laadpunten bij bedrijven en thuisladers ontbreken sowieso. De statusinformatie (beschikbaar/bezet) is een momentopname van het laadmoment van de kaart. De cijfers gelden voor de kaartuitsnede van {city}, niet exact voor de gemeentegrens.",
      },
    ],
    links: [
      {
        label: "NDW open data — laadpunten (OCPI)",
        url: "https://opendata.ndw.nu/",
      },
      {
        label: "Nationale Agenda Laadinfrastructuur",
        url: "https://www.agendalaadinfrastructuur.nl/",
      },
      {
        label: "OCPI-standaard (EV Roaming Foundation)",
        url: "https://evroaming.org/ocpi-background/",
      },
    ],
  },

  {
    layerId: "laadpunten-bouw",
    title: "Laadpunten voor bouwmaterieel rond {city}",
    subtitle:
      "Zware laadlocaties voor elektrische mobiele werktuigen en bouwlogistiek",
    intro:
      "Deze kaart toont **{count} laadlocaties** binnen het kaartgebied van {city} waar elektrisch bouwmaterieel — graafmachines, laadschoppen, accupakketten en e-trucks — kan laden. De landelijke inventarisatie komt van de *Laadkaart Bouw* van BCI Global en omvat zware DC-snelladers, vaak op bedrijventerreinen. Klik op een punt voor exploitant, vermogen, toegankelijkheid en tarieven.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Laadlocaties in beeld", type: "count" },
          {
            label: "Exploitanten / bedrijven",
            type: "distinct",
            property: "Bedrijfsnaam",
          },
          {
            label: "Publiek toegankelijk",
            type: "count-where",
            property: "Toegankelijkheid_van_de_locatie",
            equals: [
              "Publiek",
              "Publiek (toegang iedereen)",
              "Publiek (toegang onder voorwaarden)",
            ],
            asShare: true,
          },
          {
            label: "Met doorrijdlocatie",
            type: "count-where",
            property: "Doorrijdlocatie_aanwezig",
            equals: "Ja",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Toegankelijkheid van de laadlocaties",
        description:
          "Publiek = iedereen kan er laden; semi-publiek = toegang onder voorwaarden",
        property: "Toegankelijkheid_van_de_locatie",
        maxCategories: 4,
      },
      {
        kind: "category-bar",
        title: "Reserveringssysteem aanwezig?",
        description:
          "Kan een bouwbedrijf vooraf een laadslot reserveren op de locatie?",
        property: "Reserveringssysteem_aanwezig",
        valueLabels: {
          Ja: "Ja",
          Nee: "Nee",
          "Geen info ontvangen": "Onbekend",
        },
        maxCategories: 4,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Bouwmaterieel laadt anders dan een personenauto: werktuigen zijn zwaar, staan op een trailer en hebben vaak in korte tijd veel energie nodig. Deze laadlocaties zijn daarop ingericht, met **DC-snelladers** van honderden kilowatts, ruime opstelplekken en soms een *doorrijdlocatie* zodat een dieplader niet hoeft te keren. Enkele locaties bieden al een **MCS-stekker** (Megawatt Charging System) voor de allergrootste vermogens. Let op: de lijst wordt handmatig geïnventariseerd; velden als tarief of vermogen zijn niet bij elke locatie ingevuld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Zero-emissie bouwlogistiek**: steeds meer aanbestedingen en binnenstedelijke zones eisen emissieloos bouwmaterieel; zonder laadpunten in de buurt van de bouwplaats is elektrisch werken praktisch onhaalbaar.\n- **Schoon en Emissieloos Bouwen (SEB)**: het Rijk en gemeenten werken via het SEB-convenant toe naar emissieloze bouwplaatsen; deze kaart laat zien waar de laadinfrastructuur al ligt en waar nog gaten zitten.\n- **Vestigingsklimaat**: voor bouw- en verhuurbedrijven is nabijheid van een zware laadlocatie een vestigingsfactor op bedrijventerreinen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De data komt van de landelijke **Laadkaart Bouw**, samengesteld door BCI Global op basis van opgaven van exploitanten en bouwbedrijven. Het is een landelijke lijst met (nog) een beperkt aantal locaties — in veel gemeenten staan er daardoor weinig of geen punten op de kaart. Dat betekent niet dat er niets is: laadpunten op eigen bouwplaatsen en tijdelijke bouwstroom-aansluitingen staan er niet in. De cijfers gelden voor de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Laadkaart Bouw (BCI Global)",
        url: "https://bciglobal.maps.arcgis.com/apps/instant/basic/index.html?appid=cdb5ce9509f24ee1838ab43ffd4c0e6c",
      },
      {
        label: "Convenant Schoon en Emissieloos Bouwen",
        url: "https://www.schoonenemissieloosbouwen.nl/",
      },
    ],
  },

  {
    layerId: "ndw-verkeersborden-e7",
    title: "Laad- en losplekken (E7-borden) in {city}",
    subtitle:
      "Officiële verkeersborden E7: gelegenheid bestemd voor het laden en lossen van goederen",
    intro:
      "Binnen {city} zijn **{count} E7-verkeersborden** geladen uit het landelijke verkeersbordenbestand van het NDW. Het blauwe RVV-bord **E7** markeert plekken die zijn gereserveerd voor het *onmiddellijk laden en lossen van goederen* — parkeren is er verboden. Samen vormen deze borden het netwerk van laad- en losplekken voor stadslogistiek. Klik op een bord voor de straatnaam en een foto van de bordsituatie.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "E7-borden in beeld", type: "count" },
          {
            label: "Straten met laad-/losplek",
            type: "distinct",
            property: "roadName",
          },
          {
            label: "Status: geplaatst",
            type: "count-where",
            property: "status",
            equals: "PLACED",
          },
          {
            label: "Woonplaatsen",
            type: "distinct",
            property: "townName",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Straten met de meeste E7-borden in {city}",
        description:
          "Aantal geregistreerde E7-borden per straat (NWB-wegvak); één laad-/loszone kan meerdere borden hebben",
        property: "roadName",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één fysiek verkeersbord, ingemeten op het wegvak waar het staat. Eén laad- en loszone wordt vaak met **meerdere borden** aangeduid (begin, einde, herhaling), dus het aantal borden is hoger dan het aantal zones. Het aantal *straten met een laad-/losplek* geeft daarom een beter beeld van de spreiding. Via de eigenschappen zie je per bord onder meer de straatnaam, wanneer het voor het eerst en laatst is waargenomen en een link naar een foto.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Stadslogistiek**: pakketbezorgers, horecaleveranciers en winkelbevoorrading zijn afhankelijk van voldoende laad- en losplekken dicht bij de bestemming; te weinig plekken betekent dubbelparkeren en hinder.\n- **Zero-emissiezones**: veel gemeenten voeren zero-emissiezones voor stadslogistiek in; elektrische bestel- en vrachtwagens hebben kortere actieradius en strakkere planning, waardoor betrouwbare loslocaties belangrijker worden.\n- **Handhaving en herinrichting**: dit bestand laat zien waar het laad-/losregime formeel geldt — nuttig bij herinrichtingen, venstertijden en digitale handhaving.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "Het NDW-verkeersbordenbestand is opgebouwd uit foto-inventarisaties (o.a. camera-auto's) en aanvullingen van wegbeheerders, gekoppeld aan het Nationaal Wegenbestand (NWB). De registratie loopt achter op de werkelijkheid: recent geplaatste of verwijderde borden kunnen ontbreken, en de datum *laatst gezien* kan enkele jaren oud zijn. Onderborden met venstertijden (bijv. alleen 's ochtends) zijn niet altijd meegenomen. De selectie is gefilterd op gemeentecode, dus deze cijfers gelden — anders dan bij de meeste lagen — voor de **hele gemeente** {city}.",
      },
    ],
    links: [
      {
        label: "NDW verkeersborden open data",
        url: "https://docs.ndw.nu/api/trafficsigns/nl/index.html",
      },
      {
        label: "RVV 1990, bord E7 (wettelijke betekenis)",
        url: "https://wetten.overheid.nl/BWBR0004825/",
      },
    ],
  },
];
