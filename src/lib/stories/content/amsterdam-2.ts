/**
 * Story maps — batch "amsterdam-2": gemeentelijke open-data lagen van Amsterdam.
 *
 * Lagen: ams-historische-obstakels, ams-explosieven-verdachtgebied,
 * ams-explosieven-bominslag, ams-ondergrondse-kabels, ams-geluidszones-metro,
 * ams-geluidszones-industrie, ams-milieuzone-vracht, ams-parkeervakken,
 * ams-fietspaaltjes, ams-milieuzone-bestelbus, ams-zwembaden, ams-buurten.
 *
 * Bron: Gemeente Amsterdam DSO-API WFS (https://api.data.amsterdam.nl/v1/wfs/).
 * Alle grafiek-properties zijn geverifieerd op een live sample van het endpoint.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "ams-historische-obstakels",
    title: "Historisch bodemgebruik en obstakels in {city}",
    subtitle:
      "Voormalige bebouwing, bedrijvigheid en achtergebleven objecten in de ondergrond",
    intro:
      "Deze laag toont **{count} vlakken** met historisch bodemgebruik en ondergrondse obstakels binnen het kaartgebied van {city}, uit de dataset *Historische bodeminformatie* van de gemeente. Denk aan voormalige boerderijen, fabrieksterreinen en gebouwen, maar ook aan concrete objecten als achtergebleven funderingspalen, tanks of puin. Elk vlak heeft een categorie, een beschrijving en — waar bekend — een periode van gebruik (*van_minimaal_jaar* / *tot_maximaal_jaar*).",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Vlakken in beeld", type: "count" },
          { label: "Categorieën", type: "distinct", property: "categorie" },
          {
            label: "Losse objecten (obstakels)",
            type: "count-where",
            property: "categorie",
            equals: "Object",
          },
          {
            label: "Vroegst geregistreerd gebruik",
            type: "min",
            property: "van_minimaal_jaar",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Historisch bodemgebruik per categorie in {city}",
        description:
          "Veld categorie uit de dataset historische bodeminformatie: het type voormalig gebruik of obstakel",
        property: "categorie",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak markeert een plek waar in het verleden iets stond of gebeurde dat vandaag nog relevant is voor de ondergrond. De categorie *Object* is veruit het talrijkst: dit zijn concrete, vaak ingemeten obstakels zoals achtergebleven heipalen of funderingsresten. Categorieën als *Boerderij*, *Fabriek/bedrijventerrein* en *Gebouw* verwijzen naar voormalig gebruik van een terrein, dat een aanwijzing kan zijn voor bodemverontreiniging of ondergrondse restanten. De beschrijving en de bronvermelding (*bron_1* t/m *bron_4*) leggen per vlak vast waarop de registratie is gebaseerd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Graven en bouwen**: voordat er ontgraven, geheid of gefundeerd wordt, is het cruciaal te weten of er obstakels of oude funderingen in de weg zitten.\n- **Bodemkwaliteit**: voormalige bedrijvigheid (fabrieken, tuinbouw) is een klassieke indicatie voor mogelijke verontreiniging en aanvullend bodemonderzoek.\n- **Kosten en planning**: onverwachte obstakels in de ondergrond zijn een bekende bron van vertraging en meerkosten bij grondroerende werkzaamheden.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De dataset komt uit het gemeentelijke systeem voor historische bodeminformatie en wordt aangevuld op basis van uitgevoerde onderzoeken en sloop-/bouwprojecten. Het is een **historisch, niet uitputtend** beeld: de afwezigheid van een vlak betekent niet dat de ondergrond obstakelvrij is. De jaartallen zijn vaak schattingen (*van_minimaal_jaar* / *van_maximaal_jaar*). De getoonde cijfers gaan over de vlakken binnen de kaartuitsnede van {city}, tot de laadlimiet van de laag.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: historische bodeminformatie (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/historische_bodeminformatie/",
      },
      {
        label: "Gemeente Amsterdam — bodem",
        url: "https://www.amsterdam.nl/wonen-leefomgeving/bodem/",
      },
    ],
  },
  {
    layerId: "ams-explosieven-verdachtgebied",
    title: "Verdachte gebieden op ontplofbare oorlogsresten in {city}",
    subtitle:
      "Zones die op basis van vooronderzoek verdacht zijn op niet-gesprongen explosieven (WOII)",
    intro:
      "Binnen het kaartgebied van {city} zijn **{count} verdachte gebieden** in beeld uit de dataset *Explosieven* van de gemeente. Het zijn zones die volgens historisch vooronderzoek verdacht zijn op ontplofbare oorlogsresten (OO) uit de Tweede Wereldoorlog: afwerpmunitie (vliegtuigbommen), geschut- en kleinkalibermunitie, granaten of vernielingsladingen. Elk vlak vermeldt het *detail_type* (soort explosief), het *subtype*, het *kaliber*, de *verschijning* (bijv. afgeworpen) en een verwijzing naar het onderliggende onderzoeksrapport (*pdf*).",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Verdachte gebieden in beeld", type: "count" },
          {
            label: "Soorten oorlogsresten",
            type: "distinct",
            property: "detail_type",
          },
          {
            label: "Bevat afwerpmunitie (bommen)",
            type: "count-where",
            property: "detail_type",
            equals: ["Afwerpmunitie", "Afwerpmunitie, Kleinkalibermunitie"],
          },
          {
            label: "Onderliggende oorlogshandelingen",
            type: "distinct",
            property: "oorlogshandeling",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Verdachte gebieden per soort oorlogsrest in {city}",
        description:
          "Veld detail_type: de vermoede soort(en) ontplofbare oorlogsresten per zone",
        property: "detail_type",
        maxCategories: 6,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een gebied dat op basis van archiefonderzoek (luchtfoto's, meldingen, rapporten) **verdacht** is verklaard op ontplofbare oorlogsresten. Verdacht betekent niet dat er zeker iets ligt, maar dat er vóór grondroerende werkzaamheden extra voorzichtigheid en meestal aanvullend onderzoek of detectie nodig is. Het veld *detail_type* beschrijft de vermoede soort resten; deze zijn vaak samengesteld (meerdere munitietypen tegelijk), waardoor de categorieën lange, opgesomde omschrijvingen kunnen zijn. Per vlak is een brondocument (rapport) gekoppeld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Veiligheid bij graafwerk**: binnen een verdacht gebied gelden protocollen (detectie, benadering, ruiming) voordat er gegraven, geheid of gebaggerd mag worden.\n- **Projectplanning en kosten**: opsporing en ruiming van explosieven kost tijd en geld; vroeg zicht op verdachte zones voorkomt verrassingen.\n- **Vergunningen en zorgplicht**: gemeenten hebben een wettelijke rol bij het veilig laten uitvoeren van werkzaamheden in verdacht gebied.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke explosievendataset, gebaseerd op vooronderzoek naar ontplofbare oorlogsresten. Het is een **risico-indicatie op basis van historisch onderzoek**, geen garantie dat er wel of geen explosieven aanwezig zijn. Raadpleeg altijd het gekoppelde brondocument en de gemeente vóór werkzaamheden. De statistieken betreffen de zones binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: explosieven (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/explosieven/",
      },
      {
        label: "Gemeente Amsterdam — niet-gesprongen explosieven",
        url: "https://www.amsterdam.nl/",
      },
    ],
  },
  {
    layerId: "ams-explosieven-bominslag",
    title: "Bominslagen uit de Tweede Wereldoorlog in {city}",
    subtitle:
      "Geregistreerde inslagpunten, met de wijze waarop ze zijn ingetekend",
    intro:
      "Deze laag toont **{count} geregistreerde bominslagen** uit de Tweede Wereldoorlog binnen het kaartgebied van {city}, uit de gemeentelijke dataset *Explosieven*. Elk punt is een locatie waar volgens archiefonderzoek een inslag heeft plaatsgevonden. Per inslag zijn de datum, de bron en de wijze van intekening (*intekening*) vastgelegd — die intekening bepaalt hoe nauwkeurig de locatie bekend is. De inslagen vormen samen met de verdachte gebieden de onderbouwing van het explosievenonderzoek.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Bominslagen in beeld", type: "count" },
          {
            label: "Ingetekend via luchtfoto",
            type: "count-where",
            property: "intekening",
            equals: "Luchtfoto",
            asShare: true,
          },
          {
            label: "Wijzen van intekening",
            type: "distinct",
            property: "intekening",
          },
          {
            label: "Onderliggende oorlogsincidenten",
            type: "distinct",
            property: "oorlogsinc",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Bominslagen per wijze van intekening in {city}",
        description:
          "Veld intekening: de bron/methode waarmee de inslaglocatie op de kaart is bepaald (bepaalt de nauwkeurigheid)",
        property: "intekening",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een gedocumenteerde inslag. De **wijze van intekening** zegt veel over de betrouwbaarheid van de plek: een inslag die op een *Luchtfoto* of *Strike photo* zichtbaar is, is doorgaans nauwkeuriger gelokaliseerd dan een *Locatieomschrijving* of *Getuigeverklaring*, die uit tekstbronnen komt. De meeste inslagen in deze dataset zijn uit luchtfoto's afgeleid. Het veld *datum* geeft, waar bekend, de datum van de inslag; *oorlogsinc* koppelt de inslag aan het bredere oorlogsincident/onderzoek.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Onderbouwing verdachte gebieden**: clusters van inslagen zijn een directe aanleiding om een gebied als verdacht op blindgangers aan te merken.\n- **Historische duiding**: de inslagpatronen laten zien welke delen van de stad tijdens de oorlog zijn getroffen.\n- **Onderzoek en detectie**: bij graafwerk in de buurt van geregistreerde inslagen is extra alertheid op niet-ontplofte munitie op zijn plaats.",
      },
      {
        heading: "Over de bron",
        body: "De inslagpunten komen uit de gemeentelijke explosievendataset en zijn afgeleid uit archiefmateriaal (luchtfoto's, kaarten, rapporten). De locatie is zo goed mogelijk gereconstrueerd, maar blijft — zeker bij tekstuele bronnen — een **benadering**. De cijfers gaan over de inslagen binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: explosieven (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/explosieven/",
      },
    ],
  },
  {
    layerId: "ams-ondergrondse-kabels",
    title: "Ondergrondse kabels van de openbare verlichting in {city}",
    subtitle:
      "Het kabelnet dat de lantaarnpalen voedt: hoofd- en aansluitkabels",
    intro:
      "Deze laag tekent **{count} ondergrondse kabels** van de openbare verlichting (OVL) binnen het kaartgebied van {city}, uit de gemeentelijke dataset *Leidingeninfrastructuur*. Het gaat om het laagspanningsnet dat de lantaarnpalen voedt: hoofdkabels die de energie verdelen en aansluitkabels naar de afzonderlijke masten. Per kabel zijn onder meer het *thema* (spanningsniveau), het *type*, de *diepte*, het *voltage* en de eigenaar vastgelegd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Kabelsegmenten in beeld", type: "count" },
          {
            label: "Hoofdkabels",
            type: "count-where",
            property: "type",
            equals: "hoofdkabel",
          },
          {
            label: "Aansluitkabels",
            type: "count-where",
            property: "type",
            equals: "aansluitkabel",
          },
          { label: "Voedende kasten", type: "distinct", property: "kast" },
        ],
      },
      {
        kind: "category-bar",
        title: "Kabels per type in {city}",
        description:
          "Veld type: hoofdkabels verdelen de energie, aansluitkabels lopen naar de afzonderlijke lichtmasten",
        property: "type",
        valueLabels: {
          hoofdkabel: "Hoofdkabel",
          aansluitkabel: "Aansluitkabel",
        },
      },
      {
        kind: "category-bar",
        title: "Kabels per thema (spanningsniveau) in {city}",
        description:
          "Veld thema: vrijwel het hele OVL-net is laagspanning; weesleidingen zijn kabels zonder bekende functie/eigenaar",
        property: "thema",
        valueLabels: {
          laagspanning: "Laagspanning",
          weesleiding: "Weesleiding",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke lijn is een geregistreerd kabelsegment van de openbare verlichting. Een **hoofdkabel** vormt de ruggengraat die de stroom vanuit een voedende kast verdeelt; een **aansluitkabel** loopt vanaf die ruggengraat naar één lichtmast. Het *thema* is bij vrijwel alle kabels *laagspanning*; een enkele *weesleiding* is een kabel waarvan de functie of eigenaar onbekend is. Velden als *diepte*, *voltage* en *jaar_van_aanleg* geven aanvullende technische context, maar zijn niet altijd ingevuld.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Beheer en storingen**: het kabelnet is de basis voor onderhoud aan en storingsafhandeling van de straatverlichting.\n- **Graafwerk**: bij werkzaamheden in de openbare ruimte is de ligging van OVL-kabels van belang om schade en uitval te voorkomen (naast de formele KLIC-melding).\n- **Assetmanagement**: aanlegjaar en type helpen bij het plannen van vervanging en verduurzaming (bijv. ledverlichting).",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de gemeentelijke leidingeninfrastructuur-dataset en betreft **uitsluitend de openbare verlichting** — niet het net van netbeheerders (elektra, gas, water, data). Voor formeel graafwerk blijft een KLIC-melding leidend. Registratiekwaliteit varieert: velden als *diepte* en *nauwkeurigheid* kunnen als 'onbekend' zijn opgenomen. De cijfers gaan over de kabels binnen de kaartuitsnede van {city}, tot de laadlimiet.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: leidingeninfrastructuur (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/leidingeninfrastructuur/",
      },
    ],
  },
  {
    layerId: "ams-geluidszones-metro",
    title: "Geluidszones langs metro en spoor in {city}",
    subtitle:
      "Wettelijke zones waarbinnen akoestisch onderzoek verplicht is (Wet Geluidhinder)",
    intro:
      "Deze laag toont de **wettelijke geluidszones langs metro- en spoorwegen** binnen het kaartgebied van {city} ({count} zonevlakken in beeld), uit de gemeentelijke dataset *Geluidszones*. Binnen deze zones — die volgens het Besluit Geluidhinder Spoorwegen van 100 tot 800 meter aan weerszijden van het spoor kunnen reiken — is voor nieuwe geluidsgevoelige bebouwing zoals woningen, scholen en zorggebouwen akoestisch onderzoek verplicht.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zonevlakken in beeld", type: "count" },
          { label: "Thema's", type: "distinct", property: "thema" },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is een wettelijk vastgestelde geluidszone rond een metro- of spoorbaan. De zone is geen contour van een gemeten geluidsniveau, maar een **juridische invloedssfeer**: ligt een geplande woning of school binnen de zone, dan moet worden aangetoond dat de geluidsbelasting binnen de normen van de Wet Geluidhinder blijft. Tram- en metrobanen die deel uitmaken van het wegprofiel vallen niet onder deze spoorzones maar worden als wegverkeer beschouwd. Het aantal vlakken is klein: het gaat om enkele grote zones, niet om veel losse objecten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Ruimtelijke plannen**: de zone bepaalt waar akoestisch onderzoek en eventueel geluidwerende maatregelen nodig zijn voordat er gebouwd mag worden.\n- **Woningbouw bij het spoor**: veel binnenstedelijke verdichtingslocaties liggen langs metro en spoor, precies waar deze zones gelden.\n- **Gezondheid**: geluidhinder is een erkende omgevings- en gezondheidsfactor; de zones borgen dat dit vroeg in de planvorming wordt meegewogen.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke dataset *Geluidszones* en is gebaseerd op de Wet Geluidhinder (Besluit Geluidhinder Spoorwegen). De zonebreedte verschilt per baanvak. De laag toont de zones binnen de kaartuitsnede van {city}. Voor de exacte juridische status geldt de vastgestelde regelgeving als leidend.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: geluidszones (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/geluidszones/",
      },
    ],
  },
  {
    layerId: "ams-geluidszones-industrie",
    title: "Industriële geluidszones in {city}",
    subtitle:
      "Gezoneerde industrieterreinen waar akoestisch onderzoek verplicht is",
    intro:
      "Deze laag toont **{count} zonevlakken** rond gezoneerde industrieterreinen binnen het kaartgebied van {city}, uit de gemeentelijke dataset *Geluidszones*. Het gaat om terreinen met bedrijven die in belangrijke mate geluidhinder kunnen veroorzaken (de vroegere 'A-inrichtingen' uit de Wet Milieubeheer). Binnen de zone gelden beperkingen voor nieuwe geluidsgevoelige bebouwing en is akoestisch onderzoek verplicht. Elk industrieterrein is via het veld *naam* herkenbaar (bijvoorbeeld Westpoort, Schinkel of Cornelis Douwes).",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zonevlakken in beeld", type: "count" },
          {
            label: "Gezoneerde industrieterreinen",
            type: "distinct",
            property: "naam",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zonevlakken per industrieterrein in {city}",
        description:
          "Veld naam: het gezoneerde industrieterrein waartoe de geluidszone hoort",
        property: "naam",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk vlak is de geluidszone rond een gezoneerd industrieterrein: het gebied waarbinnen de gezamenlijke geluidsbelasting van de bedrijven wordt bewaakt en getoetst aan de 50 dB(A)-grens uit de Wet Geluidhinder. Sommige terreinen liggen deels in buurgemeenten (zoals Zaanstad of Diemen) maar hebben een zone die tot in {city} reikt. Belangrijk: ook als de meest hinderlijke bedrijven van een terrein verdwenen zijn, blijft de geluidszone **juridisch van kracht** totdat die formeel wordt gewijzigd.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bouwen nabij bedrijventerreinen**: binnen de zone moet voor woningen en andere gevoelige functies worden aangetoond dat de geluidsnormen worden gehaald.\n- **Transformatieopgaven**: bij het ombouwen van industrie- naar woongebied is de zone een sturend kader; de zonegrens moet dan vaak juridisch worden aangepast.\n- **Milieuruimte**: de zone beschermt tegelijk de bedrijven, doordat oprukkende woningbouw hun geluidruimte niet zomaar kan inperken.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke dataset *Geluidszones* en is gebaseerd op de Wet Geluidhinder. Per industrieterrein kunnen meerdere zonevlakken zijn opgenomen. De cijfers gaan over de vlakken binnen de kaartuitsnede van {city}; de juridisch vastgestelde zonering is altijd leidend.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: geluidszones (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/geluidszones/",
      },
    ],
  },
  {
    layerId: "ams-milieuzone-vracht",
    title: "Milieuzone voor vrachtauto's in {city}",
    subtitle:
      "Het gebied waar toegangsregels gelden voor vervuilende vrachtwagens",
    intro:
      "Deze laag toont de **milieuzone voor vrachtauto's** in {city} ({count} zonevlak in beeld), uit de gemeentelijke dataset *Milieuzones*. Binnen dit gebied gelden toegangseisen voor vrachtwagens op basis van hun uitstoot: te vervuilende voertuigen mogen de zone niet in. Het is een aaneengesloten gebied, geen verzameling losse punten — deze laag toont dus vooral de begrenzing ervan op de kaart.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Zonevlak in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het gekleurde vlak is de begrenzing van de vrachtauto-milieuzone. Het veld *verkeerstype* (\"vracht\") geeft aan op welk voertuigtype de zone betrekking heeft, en *vanafdatum* wanneer de regeling is ingegaan. Toegang hangt af van de emissieklasse van het voertuig; de exacte, actuele toelatingseisen staan op de gemeentelijke informatiepagina en worden periodiek aangescherpt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Stadslogistiek**: de zone stuurt op schonere bevoorrading van de binnenstad en is een bouwsteen richting emissievrije stadslogistiek.\n- **Luchtkwaliteit en gezondheid**: minder uitstoot van vrachtverkeer verbetert de luchtkwaliteit in dichtbevolkt gebied.\n- **Ondernemers en vervoerders**: wie in de zone laadt of lost, moet weten of het voertuig voldoet; de begrenzing is daarvoor het vertrekpunt.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke dataset *Milieuzones*. Deze laag geeft de **geografische begrenzing**; de precieze, geldende toelatingsregels en uitzonderingen (ontheffingen) staan in het gemeentelijke beleid en kunnen wijzigen. Raadpleeg altijd de officiële gemeentepagina voor de actuele eisen.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: milieuzones (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/milieuzones/",
      },
      {
        label: "Gemeente Amsterdam — milieuzones",
        url: "https://www.amsterdam.nl/parkeren-verkeer/milieuzone/",
      },
    ],
  },
  {
    layerId: "ams-parkeervakken",
    title: "Parkeervakken in {city}",
    subtitle:
      "Individueel geregistreerde parkeerplaatsen, met type en fiscaliteit",
    intro:
      "Deze laag toont **{count} parkeervakken** binnen het kaartgebied van {city}, uit de gemeentelijke dataset *Parkeervakken*. Elk vak is een individueel geregistreerde parkeerplaats met een parkeertype (langs, haaks of visgraat), een fiscaliteitssoort (betaald, vergunning of niet-fiscaal), een straatnaam en een buurtcode. Samen geven ze een gedetailleerd beeld van het parkeeraanbod op straat.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Parkeervakken in beeld", type: "count" },
          {
            label: "Fiscaal (betaald parkeren)",
            type: "count-where",
            property: "soort",
            equals: "FISCAAL",
            asShare: true,
          },
          {
            label: "Aantal plekken (som)",
            type: "sum",
            property: "aantal",
            decimals: 0,
          },
          { label: "Straten met parkeervakken", type: "distinct", property: "straatnaam" },
        ],
      },
      {
        kind: "category-bar",
        title: "Parkeervakken per type in {city}",
        description:
          "Veld type: de opstelling van het parkeervak ten opzichte van de weg",
        property: "type",
      },
      {
        kind: "category-bar",
        title: "Parkeervakken per fiscaliteitssoort in {city}",
        description:
          "Veld soort: het regime van het vak — fiscaal (betaald), Mulder (o.a. handhaving/vergunning) of niet-fiscaal",
        property: "soort",
        valueLabels: {
          FISCAAL: "Fiscaal (betaald)",
          MULDER: "Mulder",
          "NIET FISCAAL": "Niet-fiscaal",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk polygoon is één parkeervak. Het **type** beschrijft de opstelling: *Langs* (parallel aan de weg), *Haaks* (loodrecht) of *Vissengraat* (schuin). De **soort** beschrijft het regime: *Fiscaal* zijn plekken met betaald parkeren, *Niet-fiscaal* zijn plekken zonder betaalregime, en *Mulder* verwijst naar vakken met handhaving via de Wet Mulder (zoals belanghebbenden-/vergunningplaatsen). Het veld *aantal* is doorgaans 1 per vak, zodat de som een goede benadering van het aantal individuele plekken geeft.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Parkeerbeleid**: het aandeel betaald parkeren en de verdeling over typen zijn directe indicatoren voor parkeerdruk en -sturing.\n- **Herinrichting van straten**: bij het toevoegen van groen, fietsparkeren of laadpunten is exact bekend hoeveel vakken er sneuvelen of verschuiven.\n- **Laadinfrastructuur en deelmobiliteit**: de vakkenkaart is de basis om plekken voor laadpalen en deelauto's te plannen.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de gemeentelijke dataset *Parkeervakken* en wordt regelmatig geactualiseerd (zie *versiedatum*). Bij grote gemeenten wordt maar een deel van alle vakken geladen (tot de laadlimiet), dus de cijfers gaan over de vakken binnen de kaartuitsnede van {city} tot die limiet — niet per se over álle parkeervakken van de gemeente.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: parkeervakken (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/parkeervakken/",
      },
    ],
  },
  {
    layerId: "ams-fietspaaltjes",
    title: "Fietspaaltjes in {city}",
    subtitle:
      "Toegangspaaltjes op fietspaden, met een veiligheidsbeoordeling per locatie",
    intro:
      "Deze laag toont **{count} locaties met fietspaaltjes** binnen het kaartgebied van {city}, uit de gemeentelijke dataset *Fietspaaltjes*. Fietspaaltjes zijn de palen die sluipverkeer of auto's van fietspaden moeten weren, maar ze zijn zelf een bekende oorzaak van eenzijdige fietsongevallen. Per locatie is een veiligheidsbeoordeling (*score_current*: goed, matig of slecht), het aantal paaltjes en informatie over zicht, markering en noodzaak vastgelegd.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Locaties in beeld", type: "count" },
          {
            label: "Beoordeeld als 'slecht'",
            type: "count-where",
            property: "score_current",
            equals: "slecht",
            asShare: true,
          },
          {
            label: "Aantal paaltjes (som)",
            type: "sum",
            property: "count",
            decimals: 0,
          },
          { label: "Stadsdelen/gebieden", type: "distinct", property: "area" },
        ],
      },
      {
        kind: "category-bar",
        title: "Fietspaaltjes per veiligheidsscore in {city}",
        description:
          "Veld score_current: de actuele veiligheidsbeoordeling van de locatie",
        property: "score_current",
        valueLabels: {
          goed: "Goed",
          matig: "Matig",
          slecht: "Slecht",
        },
      },
      {
        kind: "category-bar",
        title: "Fietspaaltjes-locaties per gebied in {city}",
        description:
          "Veld area: het stadsdeel of gebied waarin de locatie ligt",
        property: "area",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een locatie waar één of meer fietspaaltjes staan; het veld *count* geeft het aantal paaltjes op die plek. De **score** (*score_current*) is een veiligheidsbeoordeling volgens landelijke richtlijnen: is het paaltje echt nodig, is het goed zichtbaar (ook in het donker), is er genoeg ruimte omheen en is de markering op orde? Een score *slecht* betekent dat het paaltje een verhoogd valrisico vormt en heroverwogen of aangepast zou moeten worden. In deze dataset is *matig* het meest voorkomende oordeel.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: fietspaaltjes veroorzaken relatief veel enkelvoudige fietsongevallen; de scores helpen de gevaarlijkste locaties te prioriteren.\n- **CROW-richtlijn 'paaltje weg, tenzij'**: het landelijke uitgangspunt is om onnodige paaltjes te verwijderen; deze inventarisatie is daarvoor de basis.\n- **Beheer**: markering, reflectie en plaatsing zijn concrete verbeterpunten die per locatie zijn vastgelegd.",
      },
      {
        heading: "Over de bron en beperkingen",
        body: "De laag komt uit de gemeentelijke dataset *Fietspaaltjes*, gebaseerd op inventarisaties (o.a. uit 2013 en actueler). De gebiedsnamen in *area* zijn niet volledig uniform gespeld (bijvoorbeeld 'Amsterdam-Nieuw-West' naast 'Amsterdam Nieuw-West'), waardoor eenzelfde stadsdeel soms in twee categorieën kan verschijnen. De cijfers gaan over de locaties binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: fietspaaltjes (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/fietspaaltjes/",
      },
      {
        label: "CROW — fietspaaltjes (paaltje weg, tenzij)",
        url: "https://www.crow.nl/",
      },
    ],
  },
  {
    layerId: "ams-milieuzone-bestelbus",
    title: "Milieuzone voor bestelbussen in {city}",
    subtitle:
      "Het gebied waar toegangsregels gelden voor vervuilende bestelwagens",
    intro:
      "Deze laag toont de **milieuzone voor bestelbussen** in {city} ({count} zonevlak in beeld), uit de gemeentelijke dataset *Milieuzones*. Binnen dit gebied gelden toegangseisen voor bestelwagens op basis van hun uitstoot: te vervuilende bestelbussen mogen de zone niet meer in. Net als de vrachtauto-milieuzone is dit een aaneengesloten gebied; deze laag toont vooral de begrenzing op de kaart.",
    charts: [
      {
        kind: "stat-row",
        stats: [{ label: "Zonevlak in beeld", type: "count" }],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Het gekleurde vlak is de begrenzing van de bestelbus-milieuzone. Het veld *verkeerstype* (\"bestel\") geeft het voertuigtype aan en *vanafdatum* wanneer de regeling inging. Of een bestelbus toegang heeft, hangt af van de emissieklasse; de eisen worden stapsgewijs strenger richting emissievrije stadslogistiek. De actuele toelatingsregels staan op de gemeentelijke informatiepagina.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Schone bevoorrading**: bestelbussen vormen een groot deel van het bestelverkeer in de stad; de zone stuurt op verschoning ervan.\n- **Luchtkwaliteit**: minder uitstoot in dichtbevolkt gebied draagt bij aan gezondere lucht.\n- **Ondernemers**: pakket- en servicediensten moeten weten of hun wagenpark aan de eisen voldoet; de begrenzing is het vertrekpunt.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke dataset *Milieuzones* en geeft de **geografische begrenzing**. De precieze, geldende toelatingseisen en ontheffingen staan in het gemeentelijke beleid en wijzigen in de tijd. Raadpleeg de officiële gemeentepagina voor de actuele regels.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: milieuzones (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/milieuzones/",
      },
      {
        label: "Gemeente Amsterdam — milieuzones",
        url: "https://www.amsterdam.nl/parkeren-verkeer/milieuzone/",
      },
    ],
  },
  {
    layerId: "ams-zwembaden",
    title: "Zwembaden in {city}",
    subtitle: "Overzicht van zwembaden met locatie, exploitant en stadsdeel",
    intro:
      "Deze laag toont **{count} zwembaden** in en rond {city}, uit de gemeentelijke dataset *Sport*. Per bad zijn de naam, het adres, het stadsdeel, de exploitant en contactgegevens vastgelegd. Zo zie je in één oogopslag waar de zwemvoorzieningen liggen en hoe ze over de stad zijn verdeeld.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Zwembaden in beeld", type: "count" },
          { label: "Stadsdelen met een zwembad", type: "distinct", property: "stadsdeel" },
          { label: "Exploitanten", type: "distinct", property: "exploitant" },
          {
            label: "Buiten Amsterdam gelegen",
            type: "count-where",
            property: "stadsdeel",
            equals: "Buiten Amsterdam",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Zwembaden per stadsdeel in {city}",
        description:
          "Veld stadsdeel: de spreiding van zwembaden over de stad (inclusief enkele net buiten de gemeente)",
        property: "stadsdeel",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een zwembad. Naast overdekte en openluchtbaden van de gemeente bevat de dataset ook baden met een andere exploitant. Een deel is als *Buiten Amsterdam* aangemerkt: dat zijn baden net buiten de gemeentegrens die in het regionale sportoverzicht zijn meegenomen. Het veld *type* is in deze dataset uniform (\"Zwembad\"); de inhoudelijke variatie zit vooral in stadsdeel, exploitant en adres.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Voorzieningenspreiding**: de verdeling over stadsdelen laat zien welke gebieden goed en welke minder goed van zwemwater zijn voorzien.\n- **Zwemvaardigheid en gezondheid**: bereikbare zwembaden ondersteunen zwemles, bewegen en gezondheid, met bijzondere aandacht voor kinderen.\n- **Beheer en programmering**: exploitantgegevens helpen bij afspraken over openingstijden, tarieven en maatschappelijk gebruik.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke dataset *Sport*. De cijfers gaan over de zwembaden binnen de kaartuitsnede van {city}; baden die als 'Buiten Amsterdam' zijn gemarkeerd horen bij buurgemeenten maar zijn voor de regionale volledigheid opgenomen.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: sport (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/sport/",
      },
    ],
  },
  {
    layerId: "ams-buurten",
    title: "Buurten in {city}",
    subtitle: "De officiële buurtindeling met naam, code en CBS-code",
    intro:
      "Deze laag toont **{count} buurten** binnen het kaartgebied van {city}, uit de gemeentelijke dataset *Gebieden*. Het is de officiële, administratieve buurtindeling van de stad: elke buurt heeft een naam, een gemeentelijke code, een CBS-buurtcode en een koppeling naar de bovenliggende wijk en het gebied (stadsdeel/GGW-gebied). Deze indeling vormt de ruggengraat waaraan veel andere statistieken en kaarten worden opgehangen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Buurten in beeld", type: "count" },
          { label: "Unieke buurtnamen", type: "distinct", property: "naam" },
          {
            label: "Bovenliggende wijken",
            type: "distinct",
            property: "ligt_in_wijk_identificatie",
          },
          {
            label: "Gebieden (GGW)",
            type: "distinct",
            property: "ligt_in_ggwgebied_identificatie",
          },
        ],
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk polygoon is één officiële buurt. De buurt is het fijnste niveau in de hiërarchie *buurt → wijk → gebied (GGW) → stadsdeel*. De velden *code* (bijv. AA01) en *cbs_code* (bijv. BU0363AA01) maken elke buurt landelijk uniek koppelbaar, onder meer aan CBS-statistieken. De velden *begin_geldigheid* en *eind_geldigheid* laten zien dat de indeling in de tijd kan wijzigen; deze laag toont de actueel geldige buurten.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Statistiek en analyse**: vrijwel alle demografische, sociale en fysieke gegevens worden op buurt- of wijkniveau samengevat; de grenzen zijn daarvoor de basis.\n- **Gebiedsgericht werken**: de koppeling naar wijk en GGW-gebied sluit aan op de manier waarop de stad beleid en participatie organiseert.\n- **Vergelijkbaarheid**: dankzij de CBS-codes zijn cijfers per buurt te vergelijken met andere gemeenten en met landelijke reeksen.",
      },
      {
        heading: "Over de bron",
        body: "De laag komt uit de gemeentelijke dataset *Gebieden*. Het is een **administratieve indeling**, geen fysieke of belevingsgrens; buurtgrenzen volgen niet altijd zichtbare scheidslijnen in de stad. De cijfers gaan over de buurten binnen de kaartuitsnede van {city}.",
      },
    ],
    links: [
      {
        label: "Amsterdam Open Data: gebieden (WFS)",
        url: "https://api.data.amsterdam.nl/v1/wfs/gebieden/",
      },
      {
        label: "CBS — wijk- en buurtindeling",
        url: "https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/wijk-en-buurtkaart",
      },
    ],
  },
];
