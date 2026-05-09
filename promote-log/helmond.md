# Helmond — promote-city log

## 2026-05-08 run

**Outcome:** `–` skipped — no new live layers discovered; city was already `coverage: "full"` with stub-only module.

### Provincial enrichment (Stage 0)

Noord-Brabant is marked "already done" in the skill spec. `provincial/noord-brabant.ts` has 3 live layers (provinciale wegen, hectometrering, wegassen from `atlas.brabant.nl`). Stage 0 skipped.

### City enrichment (Stage 1)

Probed the following endpoints in parallel:

| Endpoint | HTTP | Result |
|---|---|---|
| `https://data-helmond.opendata.arcgis.com/` | 200 | ArcGIS Hub — org `Z6jNDcrkDBbik5Ng` on `services6.arcgis.com` |
| `https://opendata-helmond.opendata.arcgis.com/` | 200 | Generic global ArcGIS Hub (no Helmond org) |
| `https://staatvan-helmond.opendata.arcgis.com/` | 200 | Generic global ArcGIS Hub (no Helmond org) |
| `https://gis.helmond.nl/` | timeout | Not reachable |
| `https://geo.helmond.nl/` | timeout | Not reachable |
| `https://kaart.helmond.nl/` | timeout | Not reachable |
| `https://opendata.helmond.nl/` | timeout | Not reachable |
| `https://data.helmond.nl/` | timeout | Not reachable |
| CKAN `ckan.dataplatform.nl` org=helmond | N/A | No results |
| NGR keyword=helmond | N/A | No parseable results |

**Discovered services on `services6.arcgis.com/Z6jNDcrkDBbik5Ng/arcgis/rest/services`:**

| Service | Type | Layers | Verdict |
|---|---|---|---|
| `WS_Rioolhuisaansluiting` | FeatureServer | layer 0: Rioolhuisaansluiting (Point, 30,157 total) | **Rejected** — all records have `DDEINDE` (end date) set; 0 active features |
| `Helmond_vlak` | FeatureServer | layer 0: Helmond_vlak (Polygon, 1 feature) | **Rejected** — city boundary reference polygon, not a data layer |
| `WS_MOR` | FeatureServer | layer 0: meldingen (Point, 2 features) | **Rejected** — only 2 features (likely test/demo data; fails ≥1 meaningful feature threshold) |

**Hub catalogue (org `Z6jNDcrkDBbik5Ng`):** 15 items total; only 2 Feature Layers (above). No GeoJSON distributions, no WFS endpoints. Maps and Web Apps are not ingestible.

### Rejected dataset table

| Dataset | Reason |
|---|---|
| WS_Rioolhuisaansluiting | All 30,157 records have DDEINDE (end-date) set → 0 active features |
| Helmond_vlak | City boundary reference polygon, not a data layer |
| WS_MOR | Only 2 features (likely demo/test data) |
| opendata-helmond.opendata.arcgis.com | Generic global ArcGIS Hub, no Helmond content |
| staatvan-helmond.opendata.arcgis.com | Generic global ArcGIS Hub, no Helmond content |
| Atlas Brabant non-wegen services | MapServer-only (raster), no FeatureServer |

### Files touched

None — no changes made. Existing `src/lib/data-sources/cities/helmond.ts` is already registered and all-stubs; `cities.ts` already has `coverage: "full"` for Helmond.

### Build status

N/A — no code changes made; nothing to compile.

### Notes

Helmond's open GIS footprint is minimal. The municipality does not operate a public ArcGIS REST catalogue with live municipal data beyond the three legacy services above. The current all-stub module correctly represents this situation. Any future enrichment would need:
- A new open data initiative from Gemeente Helmond
- Access to e.g. BGT-beheer data or Bomenregister via a new Helmond portal
- Provincial Brabant adding more FeatureServer services to atlas.brabant.nl

