# Inventarisatie Datalandschap Bodem & Ondergrond v0.5 — integratie-analyse

Bron: `docs/Inventarisatie Datalandschap Bodem en Ondergrond v0.5.xlsx`
Analyse: 31 augustus 2026. Alle genoemde endpoints zijn met een live request geverifieerd
(HTTP-status + bbox-query + attribuutinspectie), tenzij expliciet anders vermeld.

> **Status: tier 1 en tier 2 zijn gebouwd** (31 augustus 2026). 27 nieuwe lagen, plus een
> WMS-rasterlaagsoort in de kaart. Zie `DATASOURCES.md §18` voor de endpoints zoals ze in
> de app zitten. Drie conclusies uit de eerste analyse bleken bij het bouwen te optimistisch
> en zijn hieronder gecorrigeerd; ze zijn gemarkeerd met **Correctie**.

## Wat er in het bestand zit

| Blad | Inhoud |
|---|---|
| Nodes - Systemen en Datasets | 302 rijen: 266 datasets, 24 systemen/portalen, 8 reken-/datamodellen, 3 standaarden, 1 informatiemodel |
| Edges - Connecties | 278 relaties (269× "is onderdeel van", 4× "levert data aan", 4× "gebruikt standaard") |
| Keuzelijsten | Vocabulaires: Type_Object, Thematische_Categorie_BOG, Schaalniveau, Toegankelijkheid, Type_Relatie, Protocol |
| Instructies | Leeg (alleen tekstvakken) |

Verdeling: 208 open data / 92 beperkt / 1 gesloten. 268 nationaal, 32 regionaal, 2 lokaal.
Thema's: 81 Fysisch, 26 Assets, 24 Biologisch, 18 Chemisch, 42 gecombineerd, 76 "N.v.t."

De 266 datasets hangen aan een handvol moederbronnen:

| Moederbron | # datasets |
|---|---|
| Klimaateffectatlas (6 categorieën) | 121 |
| Satellietdataportaal | 60 |
| Bodem Informatiesysteem NL (bodemdata.nl) | 23 |
| Atlas Leefomgeving (RIVM) | 16 |
| BRO (6 domeinen, 16 registratieobjecten) | 16 |
| Bodemloket | 4 |
| Overstromingsgevaar (Deltares) | 3 |
| Zonder moederbron (AHN, bodemdalingskaart, VEO, Topotijdreis…) | 11 |

## Wat de app nu heeft

`src/lib/data-sources` telt 79 lagen met `bog: true` en 11 nationale lagen in categorie
`bodem-ondergrond`; `src/lib/bog-datasets.ts` is de wensenlijst met 31 entries, waarvan
9 gekoppeld aan een echte laag. Overlap met dit spreadsheet: 6 nodes (GMW, GLD, GAR, GMN,
GUF/bodemenergie, AMK-archeologie). De rest van de 302 is nieuw materiaal.

---

## Tier 1 — direct integreerbaar (vector, bestaande fetchers, landelijk)

Dit werkt met `fetchPDOKWFS` / `fetchPDOKOGCAPI` zoals ze er nu staan. Geen architectuurwijziging.

### 1a. bodemdata.nl WFS — 4 lagen, dekt 12 spreadsheet-nodes

`https://maps.bodemdata.nl/geoserver/wfs` (WFS 2.0, `outputFormat=application/json`, bbox werkt)

| Laag | Dekt nodes | Attributen |
|---|---|---|
| `bodem:Bodemkaart50000_v2025` | DAT-BBB, DAT-ALBKN, MOD-BODEM | `soilcode`, `first_soilname`, `normal_soilprofile_name`, `soilslope` |
| `bodem:geomorphological_area_v2025` | DAT-BBGK, MOD-GKN | `relief_code`, `genese_code`, `landform_subgroup_code`, `active_process` |
| `bodem:water_depth_model_observation` | DAT-BBGHG/BBGLG/BBGVG/BBGWT/BBGWD, MOD-GWSD | `depth`, `type_observation`, `date` |
| `bodem:areaofpedologicalinterest_v2025` | DAT-BBG | `pedologicalinterest` (bv. "Sterk afgegraven terrein") |

Geverifieerd met bbox Zwolle (`6.05,52.47,6.20,52.56`): polygonen terug, correcte attributen.
`soilcode` / `first_soilname` zijn categorisch → geschikt voor `colorMap` met legenda.

**Dit corrigeert `bog-datasets.ts`:** de entries `Bodemkaart`, `GKN` en `GWSD` staan daar als
`landelijkRaster: true` c.q. "nog geen laag". Ze zijn wél als vector beschikbaar. Het maakt
ook de regionale lagen `lch-bodemkaart`, `lch-grondwatertrappen` en `ut-prov-geomorfologie`
landelijk beschikbaar in plaats van alleen Gelderland-Oost/Utrecht.

### 1b. RIVM Atlas Leefomgeving WFS — PFAS/PFOS/PFOA, dekt 10 nodes

`https://data.rivm.nl/geo/alo/wfs` (243 lagen totaal, 13 bodem-relevant)

| Laag | Dekt |
|---|---|
| `alo:vw_rivm_20200131_meetlocaties_pfas` | DAT-ALPMT |
| `alo:rivm_20201201_pfasdef_totaal` | DAT-ALPMD |
| `alo:rivm_20201201_pfos_def_{ob,b}_{top,sub}` (4) | DAT-ALPFOSOO/DO/OB/DB |
| `alo:rivm_20201201_pfoa_def_{ob,b}_{top,sub}` (4) | DAT-ALPFOAOO/DO/OB/DB |
| `alo:rivm_2016_v_scholenasbest`, `…_ziekenhuizenasbest` | bonus (asbest) |

Puntgeometrie met volledige chemie per monster: `som_pfoa`, `som_pfos`, `diepte_cm`,
`diepteprof`, `bodemtype`, `landgebruik`, plus ~40 losse PFAS-verbindingen. Geverifieerd.

**Dit sluit de grootste erkende hiaat in `bog-datasets.ts`** — de entry `PFAS`
("geen landelijke laag") klopt niet meer.

> **Correctie (bij implementatie).** Van deze tien lagen zijn er maar twee dicht genoeg
> voor een kaartlaag: `meetlocaties_pfas` (652 punten landelijk) en `pfasdef_totaal`
> (6.381). De acht `pfos_def_*` / `pfoa_def_*` subsets tellen elk ~100 punten landelijk —
> één binnen de Zwolle-bbox. Ze zijn niet als losse lagen opgenomen; hun waarden staan al
> als kolommen op `pfasdef_totaal`. Ook met de twee dichte lagen geldt: dit is een
> meetnet, geen dekkende kaart (8 en 10 features binnen de Zwolle-bbox).

### 1c. PDOK RWS Overstromingen (ROR) — vervallen

- `https://api.pdok.nl/rws/overstromingen-gevarengebied/ogc/v1` → collectie `hazard_area`
- `https://api.pdok.nl/rws/overstromingen-risicogebied/ogc/v2` → collectie `risk_zone`

> **Correctie (bij implementatie): niet opgenomen.** Beide zijn dunne INSPIRE-wrappers uit
> 2018 zonder inhoudelijke attributen — alleen `local_id`, `namespace` en een
> codelist-URL; geen diepte, geen kans. `risk_zone` levert landelijk twee grove polygonen.
> Ze dekken dus **niet** DAT-ODGK/ODMK/ODKK/ZKK/EKK, zoals hierboven aangenomen. De
> werkelijke overstromingsdiepte-kaarten zitten in de Klimaateffectatlas (tier 3).

### 1d. Zuid-Holland `bodem` geoserver — 110 lagen, waarvan 107 ongebruikt

`https://geodata.zuid-holland.nl/geoserver/bodem/wfs` — de app gebruikt hier al 3 lagen
(`zh-bodemkaart`, `zh-bodemsanering-spoedlocaties`, `zh-grondwaterbescherming`). Er staan
er 110 in. Direct relevant en nog niet gebruikt, o.a.:

- Bodemdaling: `BB_BODEMBEWEGING_{DIEP,ONDIEP,TOTAAL}`, `SK_BODEMDALING_{VEENOXIDATIE,STABILITEIT,DRAAGKRACHT,TOTAALKAART}`
- Verontreiniging: `BS_HBB_PUNTEN_PZH` + `BS_HBB_PUNTEN_BUITEN_PZH` (Historisch Bodem Bestand — **buiten-ZH-variant heeft landelijke dekking**), `BS_SLOOTDEMPINGEN`, `STORTPLAATSEN_VOORMALIG`, `WM_STORTLOCATIES`
- Ondergrondse infra: `SK_ONDERGRONDSEINFRA_{RIOLERINGTRACES,AARDGASTRACES,WARMTEDISTRIBUTIENET}`
- Bodemenergie: `WKO_ZOETBRAK_*`, `BE_GT_POT_*` (geothermiepotentieel), `BE_AARDWARMTE_BORINGEN`
- `GEOMORFOLOGISCHE_KAART` (versie 2023, landelijk), `GRONDWATERTRAPPEN`, `BB_ZOET_ZOUT_GRONDWATERVOORKOMEN`

Grootste directe winst voor Rotterdam en Delft.

**Tier 1 totaal: ~30 spreadsheet-nodes + ~50 bruikbare ZH-lagen, zonder architectuurwijziging.**

---

## Tier 2 — integreerbaar ná één architectuurwijziging (WMS-overlay)

Deze bronnen bestaan alleen als WMS-raster; er is géén WFS of OGC API (geprobeerd en 404).
De app rendert nu alleen raster als *basemap* (`pdokWmtsStyle` in `src/components/map-view.tsx`);
er is geen raster-overlay per laag. Eén nieuw veld op `DataSource` — bv.
`wms?: { url, layers, opacity }` — plus een maplibre raster-source per zichtbare laag
ontsluit deze lijst in één klap. WMS `GetFeatureInfo` kan de klik-info in `FeaturePanel` vullen,
dus de laag hoeft niet "dood" te zijn.

Alle onderstaande endpoints geven HTTP 200 op GetCapabilities:

| Dataset | Endpoint (`service.pdok.nl/tno/…/wms/v1_0`) | WMS-lagen |
|---|---|---|
| CPT sondeeronderzoek (DAT-CPT) | `bro-geotechnischsondeeronderzoek` | `cpt_kenset`, `sondering` |
| Bodemkundig booronderzoek (DAT-BHR-P) | `bro-bodemkundig-booronderzoek` | `bhr_kenset`, `boring` |
| Geologisch booronderzoek (DAT-BHR-G) | `bro-geologisch-booronderzoek` (v2_0) | — |
| Geotechnisch booronderzoek (DAT-BHR-GT) | `bro-geotechnisch-booronderzoek` | — |
| Wandonderzoek (DAT-SFR) | `bro-wandonderzoek` | — |
| **Milieuhygiënisch bodemonderzoek (DAT-SAD)** | `bro-milieuhygienisch-bodemonderzoek` | `sad`, `sad_measurement_point` |
| **Overheidsbesluit bodemverontreiniging (DAT-SLD)** | `bro-overheidsbesluit-bodemverontreiniging` | `sld_aftercare_area`, `sld_handled_area`, `sld_soil_location` |
| Mijnbouwconstructie (DAT-EPC) | `bro-mijnbouwconstructie` | — |
| Grondwatergebruik INSPIRE | `bro-grondwatergebruik-geharmoniseerd` | — |
| AHN DTM (DAT-AHN) | `service.pdok.nl/rws/hoogte-nederland-land-dtm/wms/v1_0` | + **WCS** op `/wcs/v1_0` |

Twee opmerkingen die de wensenlijst raken:

- **SAD en SLD staan in `bog-datasets.ts` als `beschikbaarheid: "hiaat"`** ("versnipperd per
  gemeente, geen uniforme open service"). Dat is achterhaald: beide zijn inmiddels landelijk
  via PDOK gepubliceerd. Dit zijn precies de bodemverontreiniging-/saneringsdatasets die de
  app nu alleen lokaal heeft (Zwolle, Amsterdam, Rotterdam).

  > **Correctie (bij implementatie): let op het verschil in vulling.** SAD is een forse
  > dataset — 3,5 GB als volledige GeoPackage — die op stadsniveau rijk rendert
  > (geverifieerd op Rotterdam), maar op landelijk zoomniveau vrijwel leeg oogt omdat de
  > symbolen klein zijn. SLD daarentegen is écht nog nauwelijks gevuld: 467 KB voor de
  > volledige set. Beide lagen zijn opgenomen, SLD met een `freshness.note` die dit zegt.
- **AHN heeft naast WMS ook WCS.** Dat levert een echte hoogtegrid op en zou een deck.gl
  `TerrainLayer` kunnen voeden — relevanter voor deze app dan een platte raster-overlay.

GeoTOP, REGIS II en DGM (MOD-GEOTOP/MOD-REGIS/MOD-DGM) hebben géén WMS op het verwachte pad
(404) en worden alleen als ATOM-download (volledig landsdekkend bestand) aangeboden.
Die blijven terecht "viewer-link" in `bog-datasets.ts`.

---

## Tier 3 — wel open, maar per dataset uitzoekwerk (~188 nodes)

**Klimaateffectatlas — 121 datasets, het grootste blok.** De viewer draait op een propriëtaire
Geodan-component (`services.geodan.nl/public/viewer`, config-id `7f5adc24-…`); ik heb geen
publiek OGC-endpoint kunnen vinden (alle geprobeerde geoserver/ows-paden geven 000/404). De
NGR-metadata verwijst voor de KEA-lagen naar een handmatig "data opvragen"-formulier.

Wat wél kan zonder KEA:
- de 6 nodes onder *grenzen* (gemeente-, provincie-, waterschapsgrenzen, veiligheidsregio's,
  bebouwde kom) heeft de app al in `bestuurlijke-grenzen`;
- de 5 overstromingsdiepte-nodes zijn via PDOK ROR te halen (tier 1c);
- de 28 "grootschalige extreme regen"-nodes (waterdiepte + overstromingsduur per regio) zijn
  LIWO-afgeleiden; LIWO zelf staat in het bestand als "beperkt" en heeft geen open service.
- de 13 monitoring-nodes (boomkroonbedekking, groene/grijze schaduw, schaduw op fiets- en
  wandelpaden) zijn Cobra/AHN-afgeleiden en apart te sourcen.

Realistische inschatting: ~15 van de 121 KEA-nodes zijn langs een andere weg te halen; de rest
vergt een datalevering-afspraak met de Klimaateffectatlas.

**Satellietdataportaal — 60 datasets, allemaal `Beperkt/Autorisatie vereist`** (login bij NSO).
Praktisch: de app heeft de PDOK-luchtfoto (RGB + CIR) al als basemap, wat het grootste deel van
de gebruikswaarde dekt. Aanbeveling: niet integreren.

**Bodemloket — 4 datasets.** `geo.bodemloket.nl` resolvet niet meer; de inhoud (bodeminformatie,
bodemkwaliteitskaarten) is inmiddels opgegaan in BRO SAD/SLD (tier 2). Vervallen.

**Overstromingsgevaar (Deltares) — 3 datasets.** Alleen als ArcGIS StoryMap, geen service.

---

## Tier 4 — niet integreerbaar

| Bron | Reden |
|---|---|
| KLIC / IMKL (SYS-KLIC, STD-IMKL) | Alleen via KLIC-melding bij grondroering (WIBON). Staat al correct als `besloten` in de wensenlijst. |
| Landelijk Grondwater Register (SYS-LGR) | Gesloten |
| Archis (SYS-ARCHIS), PAN (SYS-PAN) | Login vereist i.v.m. bescherming vindplaatsen |
| NLOG (SYS-NLOG), EPL mijnbouwwetvergunning | Beperkt |
| VEO Bommenkaart (DAT-VEO) | Commercieel |
| Grondwaterproductiedossier (DAT-GPD) | Beperkt; alleen ATOM |
| Topotijdreis, Regels op de Kaart, Geschiktheidskaart woningbouw | Beperkt / geen service |

---

## Een tweede soort integratie: het bestand zelf

Los van kaartlagen is het spreadsheet een kant-en-klare **herkomstgraaf**: 302 nodes ×
21 kolommen (bronhouder, opdrachtgever, beheerder, toegankelijkheid, NORA-link, wettelijke
grondslag, beoogde gebruikers, restricties) plus 278 edges.

`src/lib/bog-datasets.ts` is nu 31 handgeschreven entries zonder herkomstvelden. Dat bestand
kan hiermee groeien naar 302 entries mét bronhouder/beheerder/NORA-verwijzing, en
`/dekking/bodem` kan de "is onderdeel van"-edges tonen als hiërarchie (BRO → domein →
registratieobject) in plaats van de huidige platte thema-indeling. Ook bruikbaar voor de
dataspace/PDC-sectie: de kolommen Opdrachtgever/Bronhouder/Beheerder/Toegankelijkheid mappen
vrijwel 1:1 op EDC-asset-metadata.

Let op bij import: `Primair Doel-Grondslag` is in álle 302 rijen leeg, `Thematische Categorie`
kent twee spellingsvarianten van "N.v.t. (Systeem)", en één edge-type heeft een afgekapte
waarde ("…wordt ontsloten vi").

---

## Wat er gebouwd is (31 augustus 2026)

27 nieuwe lagen, alle met `bog: true` en `addedAt: "2026-08-31"`:

| Blok | Aantal | Lagen |
|---|---|---|
| bodemdata.nl WFS (vector) | 4 | `bro-bodemkaart`, `bro-geomorfologie`, `bro-grondwaterspiegeldiepte`, `bro-bodemkundig-belang` |
| RIVM PFAS (vector) | 2 | `rivm-pfas-bodemmonsters`, `rivm-pfas-meetlocaties` |
| BRO WMS-raster | 9 | `bro-cpt`, `bro-bhr-p`, `bro-bhr-g`, `bro-bhr-gt`, `bro-sfr`, `bro-sad`, `bro-sld`, `bro-epc`, `ahn-dtm` |
| Zuid-Holland (vector) | 12 | `zh-bodembeweging-totaal`, `zh-bodemdaling-*`, `zh-hbb-punten`, `zh-slootdempingen`, `zh-stortplaatsen-*`, `zh-rioleringtraces`, `zh-warmtedistributienet`, `zh-wko-geschiktheid-ondiep`, `zh-aardwarmte-boringen`, `zh-zoet-zout-grondwater` |

Daarnaast:

- **Nieuwe laagsoort `DataSource.wms`** — MapLibre raster-overlay met GetFeatureInfo voor
  klik-info, gemodelleerd naar de bestaande `vectorTile`-afhandeling. Opacity, basemap-wissel
  en opruimen bij uitzetten werken identiek.
- **`addedAt` + `isRecentlyAdded`** — een decal dat na 30 dagen vanzelf verdwijnt, naar het
  model van `CityConfig.promotedAt` op de landingspagina. Nodig omdat `isNew: true` inmiddels
  op 163 van de 426 lagen stond en dus niets meer onderscheidde.
- **27 storymaps** in `src/lib/stories/content/national-bodem-2.ts`.
- **`bog-datasets.ts` gecorrigeerd** — SAD, SLD en PFAS niet meer als `hiaat`; Bodemkaart,
  GKN en GWSD niet meer als `landelijkRaster`; 13 nieuwe `mappedLayerId`-koppelingen.

## Wat er nog open staat

1. **Klimaateffectatlas** — 121 datasets, geen publiek OGC-endpoint. Vergt een
   datalevering-afspraak; alleen langs die weg komen de overstromingsdiepte- en
   hittekaarten binnen bereik.
2. **AHN via WCS** — de WCS levert een echt hoogtegrid dat een deck.gl `TerrainLayer` kan
   voeden. Nu alleen als WMS-beeld opgenomen.
3. **Zuid-Holland** — 12 van de ~110 `bodem`-lagen zijn gewired; de rest (vooral
   geothermiepotentieel en signaleringskaarten) ligt klaar.
4. **Het spreadsheet als herkomstgraaf** — `bog-datasets.ts` telt nu 31 handgeschreven
   entries; de 302 nodes × 21 kolommen zouden dat kunnen vullen mét bronhouder, beheerder
   en NORA-verwijzing.
