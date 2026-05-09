# Lochem — promote-city log

## 2026-05-09 run

**Outcome:** ✓ promoted (16 live city layers, 0 stub city, 0 provincial — Gelderland already done)

### Provincial enrichment (Stage 0)
Skipped — Gelderland is on the "already done" list. Provincial set already contains 13 live layers (luchtkwaliteit, zonneparken, faunapassages, recreatiezonering Veluwe, …) via `provincial/gelderland.ts`.

### City enrichment (Stage 1)

**Probed endpoints:**

| Endpoint | Result |
|---|---|
| `https://data-lochem.opendata.arcgis.com/` | 200, 0 datasets in DCAT feed |
| `https://opendata-lochem.opendata.arcgis.com/` | 200, 0 datasets |
| `https://staatvan-lochem.opendata.arcgis.com/` | 200, generic empty Hub |
| `https://gis.lochem.nl/` | timeout |
| `https://geo.lochem.nl/` | timeout |
| `https://kaart.lochem.nl/` | timeout |
| `https://opendata.lochem.nl/` | timeout |
| `https://data.lochem.nl/` | timeout |
| NGR keyword search "Lochem" | 0 results |
| CKAN dataplatform.nl | 0 results |
| `https://lochem.maps.arcgis.com/` (org portal) | 200 but no public items |

**Discovered via ArcGIS Online tag-search:** Datalab Gelderland Oost (DLGO9) at `services-eu1.arcgis.com/VV2g0JnRRF5xL5uh` — a regional datalab covering 9 oost-Gelderse gemeenten waaronder Lochem. 369 datasets, owner `a.vangijsel_datalabgo`. Plus CirculusBeheer at `services-eu1.arcgis.com/7Hne9Ajbj36KaHMj` (publieke ruimte beheer).

**16 layers accepted (all probed for ≥1 feature):**

| ID | Name | Category | Source |
|---|---|---|---|
| `lch-basiskwaliteit-landschap` | Basiskwaliteit landschap & biodiversiteit | groen-ecologie | DLGO |
| `lch-bomen-referentie` | Bomen — referentie 2026 | groen-ecologie | CirculusBeheer |
| `lch-bomen-snoeiplanning` | Bomen — snoeiplanning publiek | groen-ecologie | CirculusBeheer |
| `lch-groen-per-buurt` | Groen per buurt (DLGO9) | groen-ecologie | DLGO |
| `lch-groene-ontwikkelingszones` | Groene Ontwikkelingszones (DLGO9) | groen-ecologie | DLGO |
| `lch-nationaal-landschap` | Nationaal Landschap (DLGO9) | groen-ecologie | DLGO |
| `lch-speel-sport-locaties` | Speel- en sportlocaties (hittestress) | groen-ecologie | DLGO |
| `lch-grijs-per-buurt` | Grijs per buurt 2020 | omgevingsfactoren | DLGO |
| `lch-schaduw-fiets-wandel` | Schaduw fiets/wandelwegen (DLGO9) | omgevingsfactoren | DLGO |
| `lch-plannen-woningen` | Plannen woningen (≥25 wooneenheden) | gebouwen-infra | DLGO |
| `lch-wrij-transportleidingriool` | WRIJ Transportleidingriool | gebouwen-infra | DLGO (via WRIJ) |
| `lch-plannen-verkeer` | Verkeerplannen maart 2025 | verkeer-logistiek | DLGO |
| `lch-zuiderenk-wateroverlast-begaanbaarheid` | Zuiderenk wateroverlast — begaanbaarheid | veiligheid | DLGO |
| `lch-zuiderenk-wateroverlast-panden` | Zuiderenk wateroverlast — risicopanden | veiligheid | DLGO |
| `lch-kwetsbare-funderingen` | Kwetsbare stedelijke gebieden — funderingen (DLGO9) | veiligheid | DLGO |
| `lch-kwetsbare-inwoners` | Gebouwen met zeer kwetsbare inwoners (DLGO9) | sociaal-economisch | DLGO |

**Rejected:**

| Reason | Examples |
|---|---|
| Per-event objectvergunningen, no useful map layer | `Lochem_Object_2022459`, `Lochem_Object_2021273`, `Lochem_Object_2023511`, … (~15 instances by owner `saltus`) |
| Already in `national.ts` (BGT panden) | `BGT_Lochem_WFL1` |
| Web Map / app, not Feature Service | `Strooiroutes gemeente Lochem`, `Volt Dynamische Viewer` |
| Region-wide non-Lochem (Winterswijk, Aalten, Oude IJsselstreek, Berkelland, Oost Gelre) | `basiskwaliteit_Winterswijk`, `Aalten_basiskwaliteit`, `Oude_IJsselstreek_basiskwaliteit`, `OostGelre_basiskwaliteit`, `basiskwaliteit_landschapstypen_Berkelland`, `gevoelstemperaturen_in_Oost_Gelre`, `300_meter_vanaf_koele_plek_in_Oost_Gelre` |
| CBS-buurten varianten (zou overlappen met landelijke CBS-laag) | `CBS_Buurten_Aantal_inwoners`, `CBS_Buurten_Aantal_huishoudens`, `CBS_Buurten_omgevingsadressendichtheid`, `CBS_Buurten_gemiddeld_inkomen_per_ontvanger`, etc. |
| Specifieke `Lochem_Object_<num>` records (transactionele data) | door owner `saltus` — niet relevant voor de stadstwin |

### Files touched

- `src/lib/data-sources/cities/lochem.ts` — new (16 live layers)
- `src/lib/data-sources/index.ts` — added `buildLochemLayers` import + `lochem` entry in `CITY_BUILDERS`; added 3 new SOURCE_URLS (`Datalab Gelderland Oost`, `CirculusBeheer`, `Waterschap Rijn en IJssel via Datalab Gelderland Oost`)
- `src/lib/cities.ts` — added `lochem` entry to `LIVE_OVERRIDES` with `coverage: "full"`, `promotedAt: "2026-05-09"`, `municipalGIS` pointing to `services-eu1.arcgis.com/VV2g0JnRRF5xL5uh/arcgis/rest/services`. Hostname `services-eu1.arcgis.com` was already in `getAllowedHosts()`.
- `promote-log/lochem.md` — this file
- `promote-log/INDEX.md` — row added/updated for lochem

### Build status
- `npx tsc --noEmit` — clean
- `npm run build` — clean (705 static pages generated)
