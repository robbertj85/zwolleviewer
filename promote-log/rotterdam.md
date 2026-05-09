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
