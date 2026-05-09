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

