# Tilburg — promote-city log

## 2026-05-08 run

**Outcome:** promoted — coverage set to `full` (21 live layers, 3 stubs)

---

### Provincial enrichment (Stage 0)

Noord-Brabant is marked "already done" — Stage 0 skipped.
Existing `provincial/noord-brabant.ts` provides 3 Atlas Brabant layers (provinciale wegen, hectometrering, wegassen).

---

### City enrichment (Stage 1)

**Endpoints probed:**

| URL | Result |
|---|---|
| `data-tilburg.opendata.arcgis.com` | 404 |
| `opendata-tilburg.opendata.arcgis.com` | 404 |
| `staatvan-tilburg.opendata.arcgis.com` | 404 |
| `gis.tilburg.nl` | No response (blank) |
| `geo.tilburg.nl` | ECONNREFUSED |
| `opendata.tilburg.nl` | ECONNREFUSED |
| `data.tilburg.nl` | ECONNREFUSED |
| `kaart.tilburg.nl` | Redirects to Mappi (not a GIS API) |
| ArcGIS Online search `Tilburg + Feature Service + public` | **91 services found on `services-eu1.arcgis.com/CQPBPtVdeDfydflM`** |
| NGR `keyword=tilburg` | 400 Bad Request |
| CKAN `organization:tilburg` | Timeout |

**Discovered endpoint:** `https://services-eu1.arcgis.com/CQPBPtVdeDfydflM/arcgis/rest/services`
(91 FeatureServer / WFSServer services, owned by `gemeente@Tilburg`)

---

### Accepted datasets (21 live)

| ID | Service | Layer | Category |
|---|---|---|---|
| tlb-fietsnetwerk | Fietsnetwerk/0 | LineString | verkeer-logistiek |
| tlb-fietsenstallingen | Fietsenstallingen_Rjj/0 | Point | mobiliteitsdiensten |
| tlb-speciale-parkeerplaatsen | Speciale_parkeerplaatsen/0 | Point | verkeer-logistiek |
| tlb-betaald-parkeren | Betaald_parkeren_RP/0 | Polygon | verkeer-logistiek |
| tlb-maximumsnelheden | Maximumsnelheden_wegen/0 | LineString | verkeer-logistiek |
| tlb-doorrijhoogtes | Doorrijhoogtes/0 | Point | verkeer-logistiek |
| tlb-strooiroutes | Strooiroutes/0 | LineString | verkeer-logistiek |
| tlb-monumentale-bomen | Monumentale_bomen/1 | Point | groen-ecologie |
| tlb-hondenlosloopgebieden | Hondenlosloopgebieden/0 | Polygon | groen-ecologie |
| tlb-speelplekken | Speelplekken_Geovisia/0 | Polygon | groen-ecologie |
| tlb-cultureel-erfgoed | Cultureel_erfgoed/0 | Polygon | gebouwen-infra |
| tlb-cultureel-kunstwerk | Cultureel_kunstwerk/0 | Point | gebouwen-infra |
| tlb-sportcomplexen | Sportcomplex/0 | Polygon | gebouwen-infra |
| tlb-onderwijs-kindvoorzieningen | Onderwijs_en_kindervoorzieningen/0 | Point | gezondheid-norm |
| tlb-geluidsprognose | Geluidsprognose2030/0 | Polygon | omgevingsfactoren |
| tlb-bodemkwaliteitskaart | Bodem_Bodemkwaltiteitskaart/2 | Polygon | bodem-ondergrond |
| tlb-grondwatermeetnet | Grondwatermeetnet/0 | Point | bodem-ondergrond |
| tlb-hoogspanning | Hoogspanningsverbinding/1 | LineString | energie |
| tlb-warmtetransitie-wijken | WijkpaspoortWarmtetransitieVNG/0 | Polygon | energie |
| tlb-milieuzone | Milieuzone/0 | Polygon | omgevingsfactoren |
| tlb-kap-en-herplant | Kap_en_herplant/0 | Point | groen-ecologie |

**Note:** Kap_en_herplant was discovered but moved to live (tree felling permits with replanting plans) — also confirmed via probe.

---

### Rejected datasets

| Service | Reason |
|---|---|
| Rioolvlakkenkaart | HTTP 400 without authentication |
| Afvalcontainers_Openbaar_1 (layer 1) | HTTP 400 without authentication |
| WaterOpStraat_RisicoPanden | HTTP 400 without authentication |
| Hoogspanningsverbinding zones (layers 2,3) | Polygon buffers — less informative than line layer |
| Gemeentegrens_mappi | Administrative boundary — national BAG already covers this |
| Straatnamen | Label-only dataset, no meaningful GIS value |
| BAG_adreszoeker / BAG_NAR | Covered by national BAG layer |
| TVWIndelingsgebieden | Aardgasvrij planning — same data available via national DSO |
| Bevolkingsprognosegebied | Administrative planning zone — covered by CBS nationale set |
| Stadsdeel / Wijk / Buurt | Administrative divisons — national layer preferred |
| Calamiteitenroute | Event locations, not persistent infrastructure |
| Bestemmingsplan_plangebied | Covered by national DSO/ruimtelijkeplannen |
| CSV_CO2_totaal_gesplitst / Opwek_* / Verbruik_* | CSV-based, no spatial geometry layer |
| dataAardgasvrijForecastproducts | CSV-based, no spatial geometry |
| Evenementenlocaties | Temporary / event use, low permanent value |
| Focuswijk / Impulswijk / Aandachtswijk | Policy zones — no physical infrastructure |
| Gebiedsindeling_* | Internal administrative divisions |
| MeerjarenprogrammaVastgesteld | Programme data, no geometry |
| Preventief_bespoten_eiken_2023_RPP | Temporary single-year dataset |
| Bladkorven_2024_levering_medio_sept | Temporary seasonal dataset |
| ANL_Tilburg_ROVK_* (Arcadis) | Third-party project data, not municipal open data |

---

### Stubs (3)

| ID | Service | Reason |
|---|---|---|
| tlb-riolering | Rioolvlakkenkaart | HTTP 400 (auth required) |
| tlb-afvalcontainers | Afvalcontainers_Openbaar_1 | HTTP 400 (auth required) |
| tlb-water-op-straat | WaterOpStraat_RisicoPanden | HTTP 400 (auth required) |

---

### Files touched

- `src/lib/data-sources/cities/tilburg.ts` — created (21 live + 3 stub)
- `src/lib/data-sources/index.ts` — added import + CITY_BUILDERS entry
- `src/lib/cities.ts` — LIVE_OVERRIDES: coverage → "full", promotedAt, municipalGIS
- `promote-log/tilburg.md` — created (this file)
- `promote-log/INDEX.md` — updated

---

### Build status

- `npx tsc --noEmit` — clean
- `npm run build` — success (705 static pages generated)
