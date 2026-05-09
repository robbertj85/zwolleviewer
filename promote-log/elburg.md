# Elburg — promote-city log

## 2026-05-08 run

### Outcome

`–` skipped — no Elburg-specific open GIS layers discoverable within scope.
Coverage remains `national-only`. Module `src/lib/data-sources/cities/elburg.ts` created (empty, returns `[]`), registered in `index.ts` and `cities.ts`.

### Stage 0 — Provincial enrichment

Skipped: Gelderland is already done (marked in SKILL.md probe table).

### Stage 1 — City enrichment

All endpoints probed in parallel on 2026-05-08:

| Endpoint | Result |
|---|---|
| `https://data-elburg.opendata.arcgis.com/api/feed/dcat-us/1.1.json` | 404 |
| `https://opendata-elburg.opendata.arcgis.com/api/feed/dcat-us/1.1.json` | 404 |
| `https://staatvan-elburg.opendata.arcgis.com/api/feed/dcat-us/1.1.json` | 404 |
| `https://gis.elburg.nl/` | ECONNREFUSED |
| `https://geo.elburg.nl/` | ECONNREFUSED |
| `https://kaart.elburg.nl/` | ECONNREFUSED |
| `https://opendata.elburg.nl/` | ECONNREFUSED |
| `https://data.elburg.nl/` | ECONNREFUSED |
| `https://nationaalgeoregister.nl/geonetwork/srv/dut/q?keyword=elburg` | 400 (no Elburg-specific municipal layers) |
| `https://ckan.dataplatform.nl/api/3/action/package_search?q=organization:elburg` | timeout |

No public ArcGIS Hub, ArcGIS REST, WFS, or CKAN endpoint found for Gemeente Elburg.

### Rejected datasets

None — no responsive endpoint returned any datasets.

**Context:** Elburg is a small historic gemeente (~23k inhabitants) in Gelderland (Veluwe), known for the well-preserved Vesting Elburg (fortified 14th-century town). It does not maintain a public GIS open-data portal. Provincial Gelderland layers (gld-* IDs) cover province-wide environmental, water, and nature data. National RCE layers cover rijksmonumenten including Vesting Elburg.

### Files touched

- `src/lib/data-sources/cities/elburg.ts` — created (0 live layers, 0 stubs)
- `src/lib/data-sources/index.ts` — registered `buildElburgLayers` in `CITY_BUILDERS`
- `src/lib/cities.ts` — `LIVE_OVERRIDES["elburg"]` set to `coverage: "national-only"` (threshold not met: 0 < 10 live layers)

### Build status

- `npx tsc --noEmit` — PASS (clean)
- `npm run build` — PASS

### Coverage decision

Live layers added: **0** (threshold for promotion: ≥10). Coverage badge stays **Nationaal**.

---

## 2026-05-09 run

### Outcome

`✓` promoted — 11 live city layers discovered via ArcGIS Online search.
Coverage upgraded to `full`. Module `src/lib/data-sources/cities/elburg.ts` rewritten with 11 `DataSource` entries.

### Stage 0 — Provincial enrichment

Skipped: Gelderland is already done (marked in SKILL.md probe table).

### Stage 1 — New probes (2026-05-09)

Standard slug-probes were known to fail from the 2026-05-08 run. New regional avenues probed:

| Endpoint | Result |
|---|---|
| `https://www.arcgis.com/sharing/rest/search?q=tags%3A%22Elburg%22&f=json&num=50` | **HIT** — 9 Feature Services + web maps owned by Gemeente Elburg accounts |
| `https://elburg.maps.arcgis.com/sharing/rest/portals/self?f=json` | Redirects to global ArcGIS Online (private org) |
| `https://services-eu1.arcgis.com/l6Drc1A04T0QsiNl/arcgis/rest/services?f=json` | **HIT** — 31 FeatureServer services for Gemeente Elburg |
| `https://services-eu1.arcgis.com/VV2g0JnRRF5xL5uh/arcgis/rest/services?f=json` | 900+ services (Datalab Gelderland Oost) — no Elburg-specific layers |
| `https://services-eu1.arcgis.com/7Hne9Ajbj36KaHMj/arcgis/rest/services?f=json` | 78 services (CirculusBeheer) — Lochem-specific only, not Elburg |

**Discovered ArcGIS Online organisation:** `services-eu1.arcgis.com/l6Drc1A04T0QsiNl`
Owners: `jan.pieter.den.boer@elburg.nl_gemeente_elburg` and `wim.van.den.bos@elburg.nl_gemeente_elburg`

### Live layers probed and accepted

All 11 layers probed individually (layer/0/query?where=1=1&resultRecordCount=1) and confirmed to return ≥1 feature:

| Service | Layer ID | Geometry | Category | Accepted |
|---|---|---|---|---|
| `Gem_monumenten_weergave` | 0 | Polygon | gebouwen-infra | ✓ |
| `Erfgoedkaart_Rijksmonumenten_weergave` | 0 | Polygon | gebouwen-infra | ✓ |
| `Rioolhuisaansluiting3` | 0 | Polyline | gebouwen-infra | ✓ |
| `2024_OV_Gemeente_Elburg_WFL1` | 0 (kasten) | Point | gebouwen-infra | ✓ |
| `2024_OV_Gemeente_Elburg_WFL1` | 1 (lichtmasten) | Point | gebouwen-infra | ✓ |
| `boomzone` | 0 | Polyline | groen-ecologie | ✓ |
| `speel` | 0 | Point | groen-ecologie | ✓ |
| `Badkorf_point_WFL1` | 0 | Point | groen-ecologie | ✓ |
| `Parkeren` | 0 | Polygon | verkeer-logistiek | ✓ |
| `Strooiroute_gemeente_Elburg` | 0 | Polyline | verkeer-logistiek | ✓ |
| `Ligplaatsen` | 0 | Polygon | mobiliteitsdiensten | ✓ |

### Rejected datasets

| Service | Reason |
|---|---|
| `MOR_Openbaar` / `MOR_Groen` / `MOR_Dieren` / `MOR_Afval` | MOR = Meldingen Openbare Ruimte — internal reporting, not public open data |
| `MeldingenOpenbareRuimte_aanmelden` | Submission form (write endpoint) |
| `survey123_…` | Survey form — not geo layer |
| `Grens_Doornspijk_WFL1/2/3/4/5` | Administrative boundary helpers (WFL = workflow layers, not data layers) |
| `Bestek_2025_WFL1` | Internal project workflow layer |
| `Mask_elburg` | Cartographic mask — not a data layer |
| `Erfgoed_Keitjesstoep` / `Kerkenpad` | Editor variants (not weergave), may require auth for writes |
| `_2023_Verledding2_0_WFL1` | Earlier OV registratie (2022); superseded by `2024_OV_…` |
| `rioolkaart_rioolconstructie` | Empty fields array — likely auth-gated or internal |
| `Elburg_Houtige_Biomassa` | National coverage layer (owner: overmorgen_thomas, not Gemeente Elburg) |

### Files touched

- `src/lib/data-sources/cities/elburg.ts` — rewritten with 11 live DataSource entries
- `src/lib/data-sources/index.ts` — `SOURCE_URLS["Gemeente Elburg GIS"]` added
- `src/lib/cities.ts` — `LIVE_OVERRIDES["elburg"]` upgraded to `coverage: "full"`, `promotedAt: "2026-05-09"`, `municipalGIS` added

### Build status

- `npx tsc --noEmit` — PASS (clean)
- `npm run build` — PASS

### Coverage decision

Live layers added: **11** (threshold for promotion: ≥10). Coverage badge upgraded to **Lokaal**.

