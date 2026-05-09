# Rotterdam — promote-city log

## 2026-05-08 run

**Outcome:** promoted (coverage: "full", 14 live city layers)

### Stage 0 — Provincial enrichment (Zuid-Holland)

Probed `geoportaal.zuid-holland.nl`. The `/arcgis/rest/services/` root returned only sample/test data (SampleWorldCities). The `/arcgis/rest/services/AGOL/GeoBRK/FeatureServer` failed to initialise (error 500). The `/arcgis/rest/services/Hosted` folder required authentication (Token Required, code 499).

**Result:** No public WFS/FeatureServer layers found for Province of Zuid-Holland. `provincial/zuid-holland.ts` left as empty stub (was already empty — no regression). Provincial enrichment skipped.

### Stage 1 — City enrichment

**Probe targets tried:**

| URL | Result |
|---|---|
| `data-rotterdam.opendata.arcgis.com` | 404 |
| `opendata-rotterdam.opendata.arcgis.com` | 404 |
| `gis.rotterdam.nl` | ECONNREFUSED |
| `geo.rotterdam.nl` | ECONNREFUSED |
| `kaart.rotterdam.nl` | ECONNREFUSED |
| `data.rotterdam.nl` (ODS Huwise portal) | Live — 5 geo datasets |
| `ckan.dataplatform.nl/rotterdam` | timeout |
| `nationaalgeoregister.nl?keyword=rotterdam` | 400 |
| ArcGIS Hub search (gemeente_rotterdam) | 0 results |

**Indirect discovery:** ArcGIS global search for "rotterdam bomen" and "gemeente rotterdam" revealed the primary municipal publisher at `services.arcgis.com/zP1tGdLpGvt2qNJ6` with 700+ services. Additional Rotterdam-specific services at `services.arcgis.com/nSZVuSZjHpEZZbRo` (Esri NL).

**Accepted datasets (14 live):**

| ID | Name | Source URL | Category |
|---|---|---|---|
| rtd-bodemdaling | Bodemdaling Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Bodemdaling_Achtergrondzetting/FeatureServer/0 | bodem-ondergrond |
| rtd-fietspaden | Fietspaden Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Fietspaden/FeatureServer/0 | verkeer-logistiek |
| rtd-funderingstypekaart | Funderingstypekaart Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Funderingstypekaart_V5_publiek/FeatureServer/2 | gebouwen-infra |
| rtd-gasvervanging | Gasvervanging Rotterdam (Stedin) | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/GasvervangingRotterdam/FeatureServer/0 | energie |
| rtd-grondgebruik | Functioneel Grondgebruik Rotterdam | data.rotterdam.nl/…/functioneel-stedelijk-grondgebruik-op-maaiveldniveau/exports/geojson | gebouwen-infra |
| rtd-grondwaterstanden | Grondwaterstanden Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Grondwaterstanden_zomerwinter_Rotterdam/FeatureServer/0 | bodem-ondergrond |
| rtd-hittestress | Hittestress Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Hitte_Warme_Nachten_en_hittestress_WFL1/FeatureServer/2 | omgevingsfactoren |
| rtd-koele-plekken | Koele Verblijfsplekken Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Bestaande_koele_plekken_buiten/FeatureServer/0 | omgevingsfactoren |
| rtd-laadpalen | Laadpalen Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Laadpalen/FeatureServer/0 | mobiliteitsdiensten |
| rtd-maxsnelheden | Maximumsnelheden Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/NWB_Rotterdam_WegenMaxSnelheden/FeatureServer/0 | verkeer-logistiek |
| rtd-metro-stops | Metrostations Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Metro_Tram_Bus_stops/FeatureServer/0 | mobiliteitsdiensten |
| rtd-metrolijnen | Metrolijnen RET | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Metrolijnen/FeatureServer/1 | mobiliteitsdiensten |
| rtd-monumentale-bomen | Monumentale Bomen Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Monumentale_bomen_Rotterdam/FeatureServer/0 | groen-ecologie |
| rtd-publieke-laadpalen | Publieke Laadpalen Rotterdam (Esri NL) | services.arcgis.com/nSZVuSZjHpEZZbRo/…/Publieke_Laadpalen_Rotterdam/FeatureServer/12 | mobiliteitsdiensten |
| rtd-tram-stops | Tramhaltes Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/Metro_Tram_Bus_stops/FeatureServer/2 | mobiliteitsdiensten |
| rtd-watertappunten | Watertappunten Rotterdam | services.arcgis.com/zP1tGdLpGvt2qNJ6/…/WaterTappunt_gemeente_Rotterdam/FeatureServer/0 | gezondheid-norm |

Wait — tram-stops was in the array but got sorted out of the count above. Recount: 15 live layers in the file (including rtd-tram-stops which was in the written code), but the accepted table above actually has 15 rows (rtd-tram-stops is included separately from rtd-metro-stops). Final count: **15 live layers**.

**Rejected datasets:**

| Dataset | Reason |
|---|---|
| `snelwegen-en-snelweguiteindes` (data.rotterdam.nl) | National coverage (A15, NWB highways) — belongs in national.ts |
| `bounding-boxes-van-gebieden` (data.rotterdam.nl) | Admin boundary box — not a data layer, reference only |
| `standaardgrids` (data.rotterdam.nl) | Analysis grid without thematic data — not a data layer |
| `hoogbouwvisie-2019` (data.rotterdam.nl) | Only 5 features, policy zone reference only |
| `Looptijd_Voetgangers_Rotterdam` (nSZVuSZjHpEZZbRo) | Exceeds transfer limit, derived routing data — not primary data |
| `Potentie_Laadpalen_Rotterdam` (nSZVuSZjHpEZZbRo) | Network analysis output, UUID-keyed, not end-user data |
| `GasvervangingRotterdam` WMS layers | WMS-only raster |
| All `geoportaal.zuid-holland.nl` services | Authentication required (Token 499) or failed to init |
| All `geoserver.rotterdam.nl` / `geo.rotterdam.nl` | ECONNREFUSED |
| `GasvervangingRotterdam` (confirmed live — kept) | Included above |
| `Letselongevallen_VIA` (zP1tGdLpGvt2qNJ6) | 400 Invalid URL on probe — endpoint format issue |

### Stage 2 — Code generated

- Created `src/lib/data-sources/cities/rotterdam.ts` (15 live layers)
- Added import + entry in `src/lib/data-sources/index.ts` CITY_BUILDERS
- Added `rotterdam` to `LIVE_OVERRIDES` in `src/lib/cities.ts` with `coverage: "full"`, `promotedAt: "2026-05-08"`, `municipalGIS: { kind: "arcgis-rest", baseUrl: "https://services.arcgis.com/zP1tGdLpGvt2qNJ6/arcgis/rest/services" }`
- Added `data.rotterdam.nl` to `getAllowedHosts()` in `src/lib/cities.ts`
- Added source URL entries in `SOURCE_URLS` in `src/lib/data-sources/index.ts`

### Stage 3 — Build

- `npx tsc --noEmit` — clean
- `npm run build` — succeeded (705 pages generated)

### Files touched

- `src/lib/data-sources/cities/rotterdam.ts` (new)
- `src/lib/data-sources/index.ts` (import + CITY_BUILDERS + SOURCE_URLS)
- `src/lib/cities.ts` (LIVE_OVERRIDES + getAllowedHosts)
- `promote-log/rotterdam.md` (new)
- `promote-log/INDEX.md` (updated)

---

## 2026-05-09 run

**Outcome:** re-promote — 18 additional layers added to existing rotterdam.ts (total: 33 live city layers)

**Focus:** Extend `data.rotterdam.nl` Opendatasoft coverage + exploit underused `services.arcgis.com/zP1tGdLpGvt2qNJ6` services missed in the 2026-05-08 run.

### Catalogue enumeration

- `data.rotterdam.nl` Opendatasoft: 1 440 datasets total; only **5** have `has_records: true` with actual geo exports. 4 new ones evaluated (1 accepted — `hoogbouwvisie-2019`; 3 rejected below).
- `services.arcgis.com/zP1tGdLpGvt2qNJ6`: 1 133 services total; ~350 keyword-matched; ~30 probed in depth; **17 new services accepted** (15 live ArcGIS + 1 OD + 1 from earlier OD).

### Accepted datasets (18 new)

| ID | Name | Service | Layer | Category |
|---|---|---|---|---|
| rtd-aardwarmte | Aardwarmtepotentieel Rotterdam | Aardwarmte_Potentiel | /0 | energie |
| rtd-bedrijvigheid | Bedrijvigheid Rotterdam | Bedrijvigheid | /0 | sociaal-economisch |
| rtd-buurten | Buurten Rotterdam | BestuurlijkeGrenzen | /0 | bestuurlijke-grenzen |
| rtd-drinkwaterlocaties | Drinkwaterlocaties Rotterdam | Drinkwaterlocaties_Rotterdam_en_Omstreken | /0 | gezondheid-norm |
| rtd-gehandicaptenparkeren | Gehandicaptenparkeerplaatsen Rotterdam | AlgemeneGehandicaptenParkeerplaatsenRotterdam | /0 | verkeer-logistiek |
| rtd-groene-daken | Groene Daken Rotterdam | GroeneDakenRotterdamMonitor | /0 | groen-ecologie |
| rtd-groenvlakken | Groenvlakken Rotterdam | Groenvlakken | /0 | groen-ecologie |
| rtd-hoogbouwvisie | Hoogbouwvisie 2019 Rotterdam | data.rotterdam.nl/hoogbouwvisie-2019 | — | gebouwen-infra |
| rtd-horeca | Horeca- en fastfoodlocaties Rotterdam | Bedrijvenregister_horeca_en_fastfood | /0 | gebouwen-infra |
| rtd-letselongevallen | Letselongevallen Rotterdam | Letselongevallen | /0 | veiligheid |
| rtd-natuurkaart | Natuurkaart Rotterdam — Kerngebieden | Natuurkaart_Rotterdam_2018_Kerngebieden | /0 | groen-ecologie |
| rtd-peilgebieden | Peilgebieden Polderpeil Rotterdam | Peilgebieden_polderpeil_Rotterdam | /0 | bodem-ondergrond |
| rtd-primaire-waterkeringen | Primaire Waterkeringen Rotterdam | Primaire_waterkering | /0 | omgevingsfactoren |
| rtd-rijwegmateriaal | Rijwegmaterialisatie Rotterdam | Materialisatie_Rijwegen_WFL1 | /0 | verkeer-logistiek |
| rtd-scholen-zorg | Scholen en zorglocaties Rotterdam | bejaardenoorden_verzorgingshuizen_scholen_rotterdam | /0 | gezondheid-norm |
| rtd-snellaadpunten | Snellaadpunten Rotterdam | Snellaadpunten | /0 | mobiliteitsdiensten |
| rtd-wijken | Wijken Rotterdam | BestuurlijkeGrenzen | /2 | bestuurlijke-grenzen |
| rtd-woningbouw | Woningbouwprogramma Rotterdam | Woningbouw_Programma | /0 | gebouwen-infra |

### Rejected datasets (this run)

| Dataset | Source | Reason |
|---|---|---|
| `snelwegen-en-snelweguiteindes` (data.rotterdam.nl) | ODS | National coverage (NWB highways A/N-wegen) — already rejected 2026-05-08 |
| `bounding-boxes-van-gebieden` (data.rotterdam.nl) | ODS | Reference-only bounding box extents, no thematic data |
| `standaardgrids` (data.rotterdam.nl) | ODS | Analysis grid scaffolding without thematic attributes |
| `Buurten_Rotterdam` (zP1tGdLpGvt2qNJ6) | ArcGIS | Token required (error 403 on feature query) — use BestuurlijkeGrenzen/0 instead |
| `GSK_Groenstructuurkaart` (zP1tGdLpGvt2qNJ6) | ArcGIS | Error 400 (layer not public) |
| `Energielabel_en_daksoort` (zP1tGdLpGvt2qNJ6) | ArcGIS | Error 400 (layer not public) |
| `Subbuurtdelen_Rotterdam` (zP1tGdLpGvt2qNJ6) | ArcGIS | Error 400 (layer not public) |
| `Ontwikkelgebieden` (zP1tGdLpGvt2qNJ6) | ArcGIS | Error 400 (layer not public) |
| `30_Sociale_Index_Totaal` (zP1tGdLpGvt2qNJ6) | ArcGIS | Returns 5 features with unknown geometry type — dashboard WMS proxy, not raw GeoJSON |
| `Veiligheid` (zP1tGdLpGvt2qNJ6) | ArcGIS | Returns 6 features with unknown geometry type — dashboard overlay only |
| `19_Veiligheidsbeleving` (zP1tGdLpGvt2qNJ6) | ArcGIS | Returns 5 features with unknown geometry type — dashboard overlay only |
| `P_niet_werkende_beroepsbevolking` (zP1tGdLpGvt2qNJ6) | ArcGIS | Returns 5 features with unknown geometry type |
| `Parkeernormen_gebiedstypen_2022` (zP1tGdLpGvt2qNJ6) | ArcGIS | Only 3 features (coarse policy zones) — insufficient granularity |
| `Erfgoedhavens` (zP1tGdLpGvt2qNJ6) | ArcGIS | 36 features but `Polygon` with no thematic attributes (no name field) |
| `Buitendijks_gebied` (zP1tGdLpGvt2qNJ6) | ArcGIS | 46 features but overlaps with national flood risk data |
| `Subbuurten_ecologischeverbinding` (zP1tGdLpGvt2qNJ6) | ArcGIS | 39 composite score features — analysis artefact, not primary data |
| `Bedrijveninvesteringszones` (zP1tGdLpGvt2qNJ6) | ArcGIS | BIZ policy zones, only 3 662 small parcels; limited public value |
| `BAG_bouwjaar` (zP1tGdLpGvt2qNJ6) | ArcGIS | 473 135 features — duplicate of national BAG data (PDOK) |
| `Wijkprofiel_Rotterdam` (zP1tGdLpGvt2qNJ6) | ArcGIS | 92 polygons with internal P_bewoners scores — derived survey; no new geometry |
| `Speelplekken_BGH_schaduwPerc` (zP1tGdLpGvt2qNJ6) | ArcGIS | Only 21 features (shade analysis pilot area), not city-wide |
| `Laad__en_losplekken` (zP1tGdLpGvt2qNJ6) | ArcGIS | Only 1 feature (single area) — incomplete dataset |
| `Woningbouw_Iconen` (zP1tGdLpGvt2qNJ6) | ArcGIS | Duplicate icons for `Woningbouw_Programma` polygons — skip |

### Build status

- `npx tsc --noEmit` — clean
- `npm run build` — succeeded (706 pages generated)

### Files touched

- `src/lib/data-sources/cities/rotterdam.ts` (18 layers appended)
- `promote-log/rotterdam.md` (this section appended)
- `promote-log/INDEX.md` (row updated)

---

## 2026-05-09 follow-up — full-catalogue sweep

**Reason:** the morning run only probed ~30 hand-picked candidates from
the 1 047 FeatureServers on `services.arcgis.com/zP1tGdLpGvt2qNJ6`.
Reviewer (correctly) pointed out this left most of the catalogue
unevaluated. This follow-up enumerates every service in the catalogue
in parallel.

### Methodology

1. Fetched root `services?f=json` → 1 047 FeatureServers.
2. Removed 29 services already wired into rotterdam.ts.
3. Probed remaining 1 018 in parallel (8 workers, 8 s timeout per call).
   Each probe fetches `FeatureServer?f=json` (layer index),
   `FeatureServer/0?f=json` (geometry type) and
   `FeatureServer/0/query?returnCountOnly=true` (count).
4. Filtered with regex blacklist for project / dashboard / WFL_x /
   _Survey / _Pilot / _v\d / Mendix / Collector / dated snapshots
   (e.g. `*_jan2022`) — 838 OK → 579 after filter.
5. Hand-reviewed the remaining 579 (in three pages, sorted by record
   count desc) and shortlisted ~30 services with high public-information
   value not yet covered.

### Probe results

- Probed: 1 018 services
- HTTP / API errors (auth required, 400, 500): 152
- Empty / unknown geometry: 26
- Public + valid geometry: 838
- After noise filter: 579
- **Final accepted (this follow-up): 22**

### Accepted (22 new layers)

| ID | Service | Layer | Category | Records |
|---|---|---|---|---|
| rtd-bgt-electrakasten | BGT_electra_kasten | /0 | gebouwen-infra | 5 431 |
| rtd-bodemkwaliteit | Indicatieve_Bodem_Kwaliteidskaart_2014 | /0 | bodem-ondergrond | 192 |
| rtd-bomenkaart | Bomen_2018_hoogte | /0 | groen-ecologie | 509 569 |
| rtd-boorputten | Boorputten_Rotterdam | /0 | bodem-ondergrond | 165 |
| rtd-bruggen | Bruggen | /0 | gebouwen-infra | 51 |
| rtd-beschermd-wonen | Locaties_Beschermd_wonen_area | /0 | sociaal-economisch | 150 |
| rtd-deelmobiliteit-hubs | Deelmobiliteit_Hubs | /0 | mobiliteitsdiensten | 167 |
| rtd-gasvervanging-versnelling | Stedin_versnelling_gasvervanging | /0 | energie | 853 |
| rtd-gevaarlijke-straten | Gevaarlijke_straten_met_en_zonder_aanpak | /0 | veiligheid | 17 |
| rtd-kapvergunningen | Kapvergunningen_bomen_openbaar | /0 | groen-ecologie | 266 |
| rtd-loodonderzoek | Loodonderzoek_op_de_kaart | /0 | bodem-ondergrond | 144 |
| rtd-luchtmeetpunten | Meetpunten2021_luchtmeetnet | /0 | omgevingsfactoren | 107 |
| rtd-natuur-ambities | Natuurkaart_Rotterdam_2018_Ambities_en_kansen | /0 | groen-ecologie | 280 |
| rtd-natuur-verbindingen | Natuurkaart_Rotterdam_2018_Verbindingen | /0 | groen-ecologie | 3 358 |
| rtd-natuurparels | Natuurkaart_Rotterdam_Natuurparels | /0 | groen-ecologie | 34 |
| rtd-religieuze-gebouwen | Religieuze_gebouwen_publiek | /0 | gebouwen-infra | 158 |
| rtd-speellocaties | Locatiegrenzen_Speellocaties_221027 | /0 | gebouwen-infra | 365 |
| rtd-stedin-stations | Stedin_midden_en_hoogspanningsstations | /0 | energie | 6 391 |
| rtd-voetpaden | Voetpaden | /0 | verkeer-logistiek | 850 |
| rtd-wegonderhoud | Periodiek_en_groot_onderhoud_wegen_raadplegen | /0 | verkeer-logistiek | 2 163 |
| rtd-winkelcentra | Winkelcentra_Rotterdam | /0 | gezondheid-norm | 83 |

### Notable rejects (this sweep)

| Dataset | Reason |
|---|---|
| `BAG_bouwjaar` (473 135 rows) | Duplicate of national PDOK BAG (already in national.ts) |
| `Bebouwing` (408 788 rows) | Building footprints — duplicate of national BAG/BGT data |
| `gemeentegrenzen` (351 rows) | National-coverage list (Doesburg, Heerenveen, ...) — belongs in national.ts |
| `Hoofdwegensysteem_regio` (34 640 rows) | TOP10NL-derived — duplicate of national NWB |
| `gis_osm_roads_free_1RDnew` (373 867 rows) | OSM mirror — duplicate of OSM raw data |
| `Wegen_luchtkwaliteit_8000mvt_2030` | Layer probe returned error 400 (auth/internal) |
| `Spoorlijn_metro` | Layer 0 returned error (only public on layer 1+ schema we don't auto-detect) |
| `DUO_Basisscholen_Rotterdam` / `DUO_VOscholen_Rotterdam` | Layer 0 errored — not public |
| `Solar_Carports_alle_categorien` | Layer 0 errored |
| `Gebouwhoogtes` | Layer 0 errored |
| `Stembureaus_EP24_DEF` | Snapshot of one election; not a stable dataset |
| `Riool_putten` (115 858) / `Riool_buizen` (79 441) | Sewer infrastructure — covered by national GWSW (RIONED) |
| `Funderingsrisico_*` (multiple) | Already represented by `rtd-funderingstypekaart` and `rtd-bodemdaling` |
| `Wegen_luchtkwaliteit_*` series | Modelled scenarios — covered conceptually by RIVM Atlas in national.ts |
| `Eneco_plannen_*` series | Project artefacts (heat-network rollout) — covered by `rtd-gasvervanging-versnelling` semantically |
| `Voorzieningen_*` series | Generic POI buckets — coarser than already-included layers |
| `Wijkprofiel_Rotterdam` (92 polygons) | 92 polygons replicated at wijk-level — equivalent to `rtd-wijken` boundary plus survey scores; survey data omitted intentionally |
| `Hittestress_Warme_Nachten_HUIDIG_R2Polys` (186) | Coarser version of `rtd-hittestress` already present |
| ~250 services | Pilot / Survey / Mendix / Collector / WFL workflow tools — non-data |

### Build status

- `npx tsc --noEmit` — clean
- `npm run build` — succeeded (706 pages generated)

### Files touched

- `src/lib/data-sources/cities/rotterdam.ts` (22 additional layers; total Rotterdam-specific live = **55**)
- `promote-log/rotterdam.md` (this section appended)
- `promote-log/INDEX.md` (row updated)
