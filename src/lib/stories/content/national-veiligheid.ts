/**
 * Story maps — batch "national-veiligheid".
 * Lagen: ndw-srti, drone-nofly, bron-ongevallen-totaal, bron-ongevallen-letsel,
 * bron-ongevallen-dodelijk, bron-ongevallen-voetganger, osm-brandkranen,
 * pointer-onveilige-plekken.
 */

import type { StoryDefinition } from "../types";

export const stories: StoryDefinition[] = [
  {
    layerId: "ndw-srti",
    title: "Actuele veiligheidsmeldingen in {city}",
    subtitle:
      "SRTI: spookrijders, obstakels op de weg en extreme weersomstandigheden — realtime uit de NDW-feed",
    intro:
      "Deze laag toont de veiligheidsgerelateerde verkeersmeldingen (SRTI — *Safety Related Traffic Information*) die op **dit moment** binnen het kaartgebied van {city} actief zijn. Het gaat om acute waarschuwingen zoals spookrijders, objecten of dieren op de rijbaan, gladheid en andere gevaarlijke omstandigheden. Nu staan er **{count} meldingen** in beeld. Omdat het om realtime informatie gaat is dat aantal sterk wisselend: op een rustig, droog moment kan de teller op nul staan, terwijl er bij gladheid of een incident opeens meerdere meldingen tegelijk verschijnen.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Actuele meldingen", type: "count" },
          { label: "Soorten melding", type: "distinct", property: "type" },
          { label: "Aanleverende bronnen", type: "distinct", property: "source" },
        ],
      },
      {
        kind: "category-bar",
        title: "Soorten veiligheidsmelding in {city}",
        description:
          "NDW-veld type: het gemelde obstakel of de gemelde gebeurtenis (bijv. object op de weg, dier, weersomstandigheid)",
        property: "type",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is één actieve veiligheidsmelding op of langs de weg. SRTI is bedoeld om weggebruikers en systemen (navigatie, in-car-diensten) snel te waarschuwen voor acuut gevaar. De meldingen komen uit de landelijke NDW-feed en zijn hier gefilterd op het kaartgebied van {city}. Zie je geen stippen, dan zijn er op dit moment simpelweg geen actieve waarschuwingen in dit gebied — dat is het normale beeld op een gewone dag.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Verkeersveiligheid**: SRTI-meldingen markeren precies de plekken waar het op dit moment gevaarlijk is; wegbeheerders en hulpdiensten gebruiken ze om snel te reageren.\n- **Patroonherkenning**: terugkerende meldingen op dezelfde locatie (bijvoorbeeld steeds obstakels of gladheid op één traject) kunnen wijzen op een structureel knelpunt.\n- **Realtime karakter**: deze laag is een momentopname. Voor structurele analyse van onveilige plekken zijn de historische ongevallenlagen (BRON) geschikter.",
      },
      {
        heading: "Over de bron",
        body: "De data komt van het **Nationaal Dataportaal Wegverkeer (NDW)** in het DATEX II-formaat en wordt elke minuut ververst. Meldingen worden aangeleverd door wegbeheerders (o.a. Rijkswaterstaat) en verkeerscentrales. Omdat SRTI zich richt op het hoofdwegennet en grotere doorgaande wegen, zijn niet alle straten even goed gedekt.",
      },
    ],
    links: [
      { label: "NDW open data", url: "https://opendata.ndw.nu/" },
      {
        label: "NDW documentatie (DATEX II / SRTI)",
        url: "https://docs.ndw.nu/",
      },
    ],
  },
  {
    layerId: "drone-nofly",
    title: "Drone no-fly zones in {city}",
    subtitle:
      "Luchtvaartgebieden waar het vliegen met een drone verboden of beperkt is",
    intro:
      "Deze laag toont de gebieden waar het vliegen met een drone verboden of aan strenge regels gebonden is — denk aan de omgeving van luchthavens, ziekenhuis-helihavens en andere beschermde luchtruimgebieden. **Belangrijk**: PDOK heeft deze dataset per 30 juni 2026 op verzoek van luchtverkeersleider LVNL uit productie genomen en er is nog geen vervangend open eindpunt. De laag toont daardoor op dit moment **{count} zones**; zodra er een nieuwe officiële bron beschikbaar is, kan de laag opnieuw gevuld worden.",
    charts: [],
    sections: [
      {
        heading: "Wat toont deze laag?",
        body: "Bedoeld zijn de *luchtvaartgebieden* met een vliegverbod of -beperking voor onbemande luchtvaartuigen (drones). In de praktijk gaat het om zones rond start- en landingsbanen, controlegebieden (CTR), no-fly-gebieden boven kwetsbare of gevoelige objecten en tijdelijke beperkingen. Deze zones zijn juridisch bindend: wie er zonder ontheffing vliegt is in overtreding.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Handhaving en vergunningen**: gemeenten en veiligheidsregio's krijgen steeds vaker vragen over dronegebruik bij evenementen, inspecties en hobbyvluchten; de no-fly-zones bepalen waar dat mag.\n- **Veiligheid**: rond luchthavens, spoedeisende hulp en industrie kan een drone reële risico's opleveren.\n- **Actualiteit**: doordat het bronbestand tijdelijk uit productie is, moeten vlieggebieden nu via de officiële kanalen van LVNL en de Rijksoverheid worden gecontroleerd.",
      },
      {
        heading: "Over de bron en de huidige status",
        body: "De oorspronkelijke dataset kwam van **PDOK / LVNL** (Luchtverkeersleiding Nederland). Sinds 30 juni 2026 is dit open eindpunt niet meer beschikbaar. Raadpleeg voor de actuele regels de officiële informatie van de Rijksoverheid over waar je met een drone mag vliegen (zie de link hieronder). Zodra er een vervangende open dataset is, wordt deze laag hersteld.",
      },
    ],
    links: [
      {
        label: "Rijksoverheid: waar mag ik vliegen met een drone?",
        url: "https://www.rijksoverheid.nl/onderwerpen/drone/vraag-en-antwoord/waar-mag-ik-vliegen-met-een-drone",
      },
      { label: "LVNL", url: "https://www.lvnl.nl/" },
    ],
  },
  {
    layerId: "bron-ongevallen-totaal",
    title: "Verkeersongevallen in {city} (2022–2024)",
    subtitle:
      "Alle door de politie geregistreerde ongevallen uit het landelijke bestand BRON",
    intro:
      "Deze laag toont **{count} verkeersongevallen** die de politie tussen 2022 en 2024 heeft geregistreerd binnen het kaartgebied van {city}. Elke stip is één ongeval uit het **Bestand geRegistreerde Ongevallen in Nederland (BRON)** — van uitsluitend blikschade tot ongevallen met letsel of dodelijke afloop. Samen tekenen de stippen de plekken waar het in de gemeente structureel misgaat in het verkeer.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Ongevallen in beeld", type: "count" },
          {
            label: "Met letsel of dodelijk",
            type: "count-where",
            property: "AP3_CODE",
            equals: ["Letsel", "Dodelijk"],
          },
          {
            label: "Binnen de bebouwde kom",
            type: "count-where",
            property: "BEBKOM",
            equals: "Binnen",
            asShare: true,
          },
          {
            label: "Waarbij voetganger betrokken",
            type: "count-where",
            property: "AOL_ID",
            equals: "Voetganger",
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Afloop van de ongevallen in {city}",
        description:
          "BRON-veld AP3_CODE: de ernst van de afloop (materiële schade, letsel of dodelijk)",
        property: "AP3_CODE",
      },
      {
        kind: "category-bar",
        title: "Aard van de ongevallen in {city}",
        description:
          "BRON-veld AOL_ID: het type botsing of manoeuvre (bijv. flank, kop/staart, frontaal, voetganger)",
        property: "AOL_ID",
        maxCategories: 8,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elk punt is een geregistreerd ongeval, geplaatst op de door de politie vastgelegde locatie. Twee velden bepalen het beeld: de **afloop** (*AP3_CODE* — materiële schade, letsel of dodelijk) en de **aard** van het ongeval (*AOL_ID* — bijvoorbeeld een flankaanrijding, een kop/staartbotsing of een aanrijding met een voetganger). Verreweg de meeste geregistreerde ongevallen betreffen uitsluitend materiële schade; de letsel- en dodelijke ongevallen zijn zeldzamer maar beleidsmatig het zwaarst.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Blackspots**: clusters van ongevallen op één kruispunt of wegvak wijzen op een infrastructureel knelpunt dat aangepakt kan worden.\n- **Kwetsbare verkeersdeelnemers**: het aandeel ongevallen met voetgangers en (via de deellaag) fietsers is een directe graadmeter voor de veiligheid van langzaam verkeer.\n- **Bebouwde kom versus buitengebied**: het veld *BEBKOM* laat zien of ongevallen zich vooral in de stad of op de doorgaande wegen eromheen voordoen — dat vraagt om verschillende maatregelen.",
      },
      {
        heading: "Over de bron en kanttekeningen",
        body: "BRON wordt door de politie gevuld en jaarlijks door Rijkswaterstaat gepubliceerd; deze laag gebruikt de Esri Nederland-mirror. Belangrijke kanttekeningen:\n- **Onderregistratie**: lang niet elk ongeval wordt geregistreerd, vooral lichte ongevallen zonder letsel ontbreken vaak. De cijfers zijn dus een ondergrens.\n- **Kaartuitsnede**: de selectie volgt de stadsbbox, dus ook ongevallen in aangrenzende gemeenten kunnen meetellen. Het veld *GME_NAAM* geeft per ongeval de gemeente.\n- **Registratielocatie**: de vastgelegde positie is niet altijd exact de plek van de botsing.",
      },
    ],
    links: [
      {
        label: "Rijkswaterstaat: BRON verkeersongevallen",
        url: "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
      },
      { label: "SWOV — kennis over verkeersveiligheid", url: "https://swov.nl/" },
    ],
  },
  {
    layerId: "bron-ongevallen-letsel",
    title: "Verkeersongevallen met letsel in {city} (2022–2024)",
    subtitle:
      "De letsel- en dodelijke ongevallen uit BRON — de kern van het verkeersveiligheidsbeleid",
    intro:
      "Deze laag zoomt in op de **{count} ongevallen met letsel of dodelijke afloop** die tussen 2022 en 2024 in het kaartgebied van {city} zijn geregistreerd (BRON, afloop *Letsel* of *Dodelijk*). Waar de totale ongevallenlaag ook alle blikschade bevat, filtert deze laag daarop weg en houdt alleen de ongevallen over waarbij daadwerkelijk gewonden of doden vielen — precies de gevallen waar verkeersveiligheidsbeleid zich op richt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Letselongevallen in beeld", type: "count" },
          {
            label: "Met dodelijke afloop",
            type: "count-where",
            property: "AP3_CODE",
            equals: "Dodelijk",
          },
          {
            label: "Waarbij voetganger betrokken",
            type: "count-where",
            property: "AOL_ID",
            equals: "Voetganger",
          },
          {
            label: "Binnen de bebouwde kom",
            type: "count-where",
            property: "BEBKOM",
            equals: "Binnen",
            asShare: true,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Aard van de letselongevallen in {city}",
        description:
          "BRON-veld AOL_ID: het type ongeval bij letsel- en dodelijke ongevallen",
        property: "AOL_ID",
        maxCategories: 8,
      },
      {
        kind: "category-bar",
        title: "Snelheidsregime op de ongevalslocatie",
        description:
          "BRON-veld MAXSNELHD: de toegestane maximumsnelheid (km/u) op de plek van het letselongeval",
        property: "MAXSNELHD",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een ongeval waarbij minstens één gewonde of dode viel. Het veld *AOL_ID* laat zien hoe het ongeval ontstond (een flankaanrijding op een kruispunt gedraagt zich anders dan een kop/staartbotsing in de file), en *MAXSNELHD* geeft het snelheidsregime op de locatie. Juist bij letselongevallen is die combinatie van botstype en snelheid bepalend voor de ernst.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Prioritering**: letsel- en dodelijke ongevallen wegen het zwaarst bij het kiezen waar geld en maatregelen naartoe gaan.\n- **Snelheid als knop**: het verband tussen letsel en het snelheidsregime onderbouwt maatregelen als 30 km/u-zones binnen de bebouwde kom.\n- **Kwetsbaar verkeer**: aandelen voetgangers en fietsers in de letselcijfers sturen het beleid rond veilige oversteekplaatsen en fietsinfrastructuur.",
      },
      {
        heading: "Over de bron en kanttekeningen",
        body: "De selectie combineert de afloopcodes *Letsel* en *Dodelijk* uit BRON. Ook hier speelt **onderregistratie**: vooral eenzijdige fietsongevallen en licht letsel belanden lang niet altijd in het bestand, waardoor het werkelijke aantal gewonden hoger ligt. De cijfers gaan over de kaartuitsnede van {city}, inclusief ongevallen net over de gemeentegrens.",
      },
    ],
    links: [
      {
        label: "Rijkswaterstaat: BRON verkeersongevallen",
        url: "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
      },
      { label: "SWOV — kennis over verkeersveiligheid", url: "https://swov.nl/" },
    ],
  },
  {
    layerId: "bron-ongevallen-dodelijk",
    title: "Dodelijke verkeersongevallen in {city} (2003–2024)",
    subtitle:
      "Twee decennia dodelijke ongevallen uit BRON — de meest ingrijpende plekken op de kaart",
    intro:
      "Deze laag toont alle **{count} verkeersongevallen met dodelijke afloop** die sinds 2003 in het kaartgebied van {city} zijn geregistreerd (BRON, afloop *Dodelijk*). Anders dan de andere ongevallenlagen kijkt deze laag ver terug — over ruim twee decennia — zodat ook zeldzame, zware ongevallen zichtbaar worden en langjarige patronen naar voren komen. Elke stip staat voor een dodelijk slachtoffer­ongeval.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Dodelijke ongevallen in beeld", type: "count" },
          {
            label: "Waarbij voetganger betrokken",
            type: "count-where",
            property: "AOL_ID",
            equals: "Voetganger",
          },
          {
            label: "Buiten de bebouwde kom",
            type: "count-where",
            property: "BEBKOM",
            equals: "Buiten",
            asShare: true,
          },
          { label: "Eerste registratiejaar", type: "min", property: "JAAR_VKL" },
        ],
      },
      {
        kind: "category-bar",
        title: "Aard van de dodelijke ongevallen in {city}",
        description:
          "BRON-veld AOL_ID: het type ongeval bij dodelijke afloop",
        property: "AOL_ID",
        maxCategories: 8,
      },
      {
        kind: "histogram",
        title: "Dodelijke ongevallen door de jaren heen",
        description:
          "BRON-veld JAAR_VKL: verdeling van de dodelijke ongevallen over de jaren (2003–2024)",
        property: "JAAR_VKL",
        bins: 11,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een ongeval waarbij ten minste één dode viel, ergens in de periode 2003–2024. Omdat dodelijke ongevallen gelukkig relatief zeldzaam zijn, is dit een dunne maar zeer betekenisvolle laag: één punt kan een ingrijpende gebeurtenis in de gemeente markeren. De verdeling over de jaren (*JAAR_VKL*) en de aard van de ongevallen (*AOL_ID*) helpen om terugkerende risico's te herkennen.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Nul verkeersdoden**: het landelijke streven (*Strategisch Plan Verkeersveiligheid*) is nul verkeersslachtoffers; deze laag maakt de opgave concreet en plaatsgebonden.\n- **Langjarig perspectief**: door twee decennia te tonen, worden ook incidentele maar ernstige locaties zichtbaar die in een kort tijdvenster zouden wegvallen.\n- **Buitenwegen**: dodelijke ongevallen concentreren zich vaak op wegen buiten de bebouwde kom met hogere snelheden — het veld *BEBKOM* laat zien of dat ook voor {city} geldt.",
      },
      {
        heading: "Over de bron en kanttekeningen",
        body: "Dodelijke ongevallen worden vollediger geregistreerd dan lichte ongevallen, maar ook hier geldt: de locatie is de politieregistratie, niet noodzakelijk de exacte botsplek, en de kaartuitsnede kan ongevallen van buurgemeenten bevatten (zie *GME_NAAM*). Doordat de reeks tot 2003 teruggaat, weerspiegelen oudere punten soms een inmiddels gewijzigde wegsituatie.",
      },
    ],
    links: [
      {
        label: "Rijkswaterstaat: BRON verkeersongevallen",
        url: "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
      },
      {
        label: "Strategisch Plan Verkeersveiligheid 2030",
        url: "https://www.rijksoverheid.nl/onderwerpen/verkeersveiligheid",
      },
    ],
  },
  {
    layerId: "bron-ongevallen-voetganger",
    title: "Ongevallen met voetgangers in {city} (2022–2024)",
    subtitle:
      "Verkeersongevallen waarbij een voetganger betrokken was — een graadmeter voor loopveiligheid",
    intro:
      "Deze laag toont de **{count} verkeersongevallen** waarbij tussen 2022 en 2024 een voetganger betrokken was in het kaartgebied van {city} (BRON, aard *Voetganger*). Voetgangers behoren tot de meest kwetsbare verkeersdeelnemers: een aanrijding loopt voor hen veel vaker slecht af dan voor inzittenden van een auto. Deze laag laat zien wáár lopen in de gemeente risico met zich meebrengt.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Voetgangersongevallen in beeld", type: "count" },
          {
            label: "Met letsel of dodelijk",
            type: "count-where",
            property: "AP3_CODE",
            equals: ["Letsel", "Dodelijk"],
          },
          {
            label: "Binnen de bebouwde kom",
            type: "count-where",
            property: "BEBKOM",
            equals: "Binnen",
            asShare: true,
          },
          {
            label: "Mediane maximumsnelheid",
            type: "median",
            property: "MAXSNELHD",
            unit: "km/u",
            decimals: 0,
          },
        ],
      },
      {
        kind: "category-bar",
        title: "Afloop van voetgangersongevallen in {city}",
        description:
          "BRON-veld AP3_CODE: de ernst van de afloop bij ongevallen met een voetganger",
        property: "AP3_CODE",
      },
      {
        kind: "category-bar",
        title: "Snelheidsregime op de ongevalslocatie",
        description:
          "BRON-veld MAXSNELHD: de toegestane maximumsnelheid (km/u) op de plek van het voetgangersongeval",
        property: "MAXSNELHD",
        maxCategories: 7,
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een ongeval waarbij een voetganger was betrokken. Omdat deze laag al gefilterd is op de aard *Voetganger*, draait het verhaal hier om de **afloop** (*AP3_CODE*) en de **omgeving**: binnen of buiten de bebouwde kom (*BEBKOM*) en het geldende snelheidsregime (*MAXSNELHD*). Juist voor voetgangers is dat snelheidsregime cruciaal — de kans op ernstig letsel neemt sterk toe naarmate de aanrijsnelheid hoger is.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Oversteekbaarheid**: clusters van voetgangersongevallen wijzen op onveilige oversteekplaatsen die om een zebra, verkeerslicht of middeneiland vragen.\n- **30 km/u-beleid**: de relatie tussen voetgangersletsel en snelheid onderbouwt het verlagen van snelheden in woon- en winkelgebieden.\n- **Toegankelijke stad**: veilige looproutes zijn een voorwaarde voor een stad waarin ouderen, kinderen en mensen met een beperking zich zelfstandig kunnen verplaatsen.",
      },
      {
        heading: "Over de bron en kanttekeningen",
        body: "De selectie filtert BRON op de aardcode *Voetganger*. Voetgangersongevallen kennen relatief veel **onderregistratie**, zeker de lichtere gevallen, waardoor het werkelijke aantal hoger ligt dan hier getoond. De cijfers gaan over de kaartuitsnede van {city} en kunnen ongevallen net buiten de gemeentegrens bevatten.",
      },
    ],
    links: [
      {
        label: "Rijkswaterstaat: BRON verkeersongevallen",
        url: "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
      },
      { label: "SWOV — voetgangers", url: "https://swov.nl/nl/feiten-cijfers" },
    ],
  },
  {
    layerId: "osm-brandkranen",
    title: "Brandkranen in {city}",
    subtitle:
      "Bluswatervoorzieningen langs de straat, in kaart gebracht door de OpenStreetMap-gemeenschap",
    intro:
      "Deze laag toont **{count} brandkranen** in {city} zoals vrijwilligers ze in **OpenStreetMap** hebben vastgelegd. Brandkranen zijn de vaste aansluitpunten waarop de brandweer bij een brand bluswater aftapt — meestal ondergrondse of paalvormige aansluitingen op het drinkwaternet. Klik op een punt voor de beschikbare details, zoals het type kraan.",
    charts: [
      {
        kind: "stat-row",
        stats: [
          { label: "Brandkranen in beeld", type: "count" },
          { label: "Type geregistreerd", type: "distinct", property: "fire_hydrant:type" },
        ],
      },
      {
        kind: "category-bar",
        title: "Type brandkraan in {city}",
        description:
          "OSM-tag fire_hydrant:type (o.a. underground, pillar) — alleen ingevuld waar een karteerder dit heeft vastgelegd",
        property: "fire_hydrant:type",
        valueLabels: {
          underground: "Ondergronds",
          pillar: "Bovengronds (paal)",
          wall: "Muuraansluiting",
          pipe: "Standpijp",
        },
      },
    ],
    sections: [
      {
        heading: "Wat zie je hier?",
        body: "Elke stip is een brandkraan uit OpenStreetMap (tag *emergency = fire_hydrant*). Waar een karteerder extra details heeft ingevoerd, is ook het **type** bekend — bijvoorbeeld *ondergronds* (een put in het wegdek) of *bovengronds* (een zichtbare paal). In Nederland zijn de meeste brandkranen ondergronds, wat in het kaartbeeld doorgaans terugkomt.",
      },
      {
        heading: "Waarom is dit relevant?",
        body: "- **Bluswatervoorziening**: de dekking en onderlinge afstand van brandkranen bepalen hoe snel de brandweer op een adres water beschikbaar heeft.\n- **Ruimtelijke plannen**: bij nieuwbouw en herinrichting moet worden nagedacht over voldoende primaire bluswatervoorziening.\n- **Aanvulling, geen bronregister**: dit OSM-beeld is een handige indicatie, maar het formele register ligt bij de brandweer/veiligheidsregio en het drinkwaterbedrijf.",
      },
      {
        heading: "Over de bron en kanttekeningen",
        body: "OpenStreetMap is **crowdsourced**: de volledigheid verschilt sterk per gemeente en wijk. In het ene gebied is vrijwel elke kraan ingetekend, in het andere nauwelijks — een laag aantal betekent dus niet automatisch dat er weinig brandkranen zijn, maar mogelijk dat ze nog niet gekarteerd zijn. Het veld *fire_hydrant:type* is optioneel en vaak leeg; de typegrafiek toont daarom alleen de kranen waar dit is ingevuld en wordt overgeslagen als dat er te weinig zijn.",
      },
    ],
    links: [
      {
        label: "OpenStreetMap — fire hydrant (wiki)",
        url: "https://wiki.openstreetmap.org/wiki/Tag:emergency%3Dfire_hydrant",
      },
      { label: "OpenStreetMap", url: "https://www.openstreetmap.org/" },
    ],
  },
  {
    layerId: "pointer-onveilige-plekken",
    title: "Onveilige plekken volgens bewoners in {city}",
    subtitle:
      "Burgermeldingen van als onveilig ervaren locaties — KRO-NCRV Pointer",
    intro:
      "Deze laag is bedoeld om plekken te tonen die bewoners zelf als **onveilig** ervaren, verzameld via het burgerwetenschapsproject van **KRO-NCRV Pointer**. Het gaat nadrukkelijk om de *beleving* van veiligheid — een oversteek die eng voelt, een donkere onderdoorgang, een kruispunt waar het net goed ging — die niet altijd in officiële ongevallencijfers terugkomt. De data is echter nog **niet via een publiek eindpunt** ontsloten; de laag toont daarom nu **{count} meldingen**.",
    charts: [],
    sections: [
      {
        heading: "Wat is het idee achter deze laag?",
        body: "Officiële statistieken zoals BRON registreren ongevallen die daadwerkelijk zijn gebeurd. Maar veel onveiligheid wordt gevoeld voordat er iets misgaat: plekken die mensen mijden, omwegen die ze nemen, situaties waar het steeds bijna misgaat. Pointer verzamelt zulke ervaringen bij bewoners, zodat het beeld van 'onveilige plekken' wordt aangevuld met kennis die alleen de gebruikers van de openbare ruimte hebben.",
      },
      {
        heading: "Waarom zou dit relevant zijn?",
        body: "- **Aanvulling op ongevalscijfers**: subjectieve onveiligheid wijst op knelpunten die (nog) niet tot geregistreerde ongevallen hebben geleid — juist daar is preventie mogelijk.\n- **Participatie**: bewonersmeldingen geven de gemeente direct zicht op wat er in wijken leeft.\n- **Combineren loont**: leg deze beleving naast de BRON-ongevallenlagen om te zien waar objectief risico en gevoelde onveiligheid samenvallen of juist uiteenlopen.",
      },
      {
        heading: "Over de bron en de huidige status",
        body: "De beoogde bron is het onderzoeksplatform **KRO-NCRV Pointer**. Op dit moment is de dataset niet als open GeoJSON-eindpunt beschikbaar, waardoor deze laag leeg blijft totdat een geschikte bron is ontsloten. De laag staat alvast klaar zodat gemeente en bewoners de meldingen kunnen bekijken zodra de data er is.",
      },
    ],
    links: [
      { label: "KRO-NCRV Pointer", url: "https://pointer.kro-ncrv.nl" },
    ],
  },
];
