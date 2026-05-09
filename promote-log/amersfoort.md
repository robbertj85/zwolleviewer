# Amersfoort — promote-city log

## 2026-05-08 run

**Outcome:** partial — module created, 1 live city layer + 11 live provincial layers; coverage stays `national-only` (< 10 city-specific live layers)

---

### Stage 0 — Provincial enrichment (Utrecht)

Probed:
- `webkaart.provincie-utrecht.nl` → HTTP 403 (access denied)
- `geodata.provincie-utrecht.nl` → ECONNREFUSED
- `geo.provincie-utrecht.nl` → redirects to login wall
- `gis.provincie-utrecht.nl` → **responsive**, ArcGIS REST v11.5

Discovered 3 services on `gis.provincie-utrecht.nl`:
- `Tygron_Basisdata/MapServer` — 59 layers (air quality, noise, nature, water, soil, energy, bus buffers)
- `WFS_IKN/MapServer` — 9 layers (NNN, Groene Contour, weidevogelgebieden, stiltegebieden)
- `m01_2_bodem/MapServer` — geomorphological map 1:50.000 (BRO)

**Provincial layers written to `provincial/utrecht.ts`** (11 live):

| Layer ID | Name | Category | Features in bbox |
|---|---|---|---|
| ut-prov-geomorfologie | Geomorfologische Kaart 1:50.000 | bodem-ondergrond | ≥5 (exceededTransferLimit) |
| ut-prov-bodemkwaliteit | Bodemkwaliteitskaart Utrecht | bodem-ondergrond | 1 |
| ut-prov-wko-grondwater | WKO Grondwateronttrekkingen | bodem-ondergrond | ≥5 (exceededTransferLimit) |
| ut-prov-nnn | Natuurnetwerk Nederland (NNN) | groen-ecologie | ≥5 (exceededTransferLimit) |
| ut-prov-groene-contour | Groene Contour (NNN-overgangszone) | groen-ecologie | ≥5 (exceededTransferLimit) |
| ut-prov-tygron-nnn | Natuur Netwerk (Tygron Basisdata) | groen-ecologie | ≥5 (exceededTransferLimit) |
| ut-prov-geluid-cumulatief | Geluidbelasting Cumulatief (WHO) | omgevingsfactoren | ≥5 (exceededTransferLimit) |
| ut-prov-no2 | Luchtkwaliteit NO₂ | omgevingsfactoren | response too large (clipped) |
| ut-prov-pm10 | Luchtkwaliteit PM10 | omgevingsfactoren | 2 |
| ut-prov-overstroombaar | Overstromingsgevoelige Gebieden | veiligheid | 2 |
| ut-prov-bushalte-buffer | Afstand tot Bushalte (400 m zones) | mobiliteitsdiensten | ≥5 (exceededTransferLimit) |

---

### Stage 1 — City enrichment (Amersfoort)

Probed all standard slugs:
- `data-amersfoort.opendata.arcgis.com` → 404
- `opendata-amersfoort.opendata.arcgis.com` → 404
- `staatvan-amersfoort.opendata.arcgis.com` → 404
- `gis.amersfoort.nl` → ECONNREFUSED
- `geo.amersfoort.nl` → ECONNREFUSED
- `kaart.amersfoort.nl` → responds (KaartViewer, Apache, no public REST)
- `amersfoort.maps.arcgis.com` → **responsive** ArcGIS Online, org `xJqVgvX1Tdd3h0YB`

`amersfoort.maps.arcgis.com` org search: 2 public items (1 image + 1 FeatureService):
- `Snoeproutes` → `services-eu1.arcgis.com/xJqVgvX1Tdd3h0YB/...` → 10 features, LineString ✓

**Accepted city layers (1 live):**

| Layer ID | Name | Category | Features |
|---|---|---|---|
| amf-snoeproutes | Snoeiroutes | groen-ecologie | 10 |

**Rejected:**
| Dataset | Reason |
|---|---|
| `kaart.amersfoort.nl` KaartViewer internal data | No public REST endpoint; kaartenbak dir only has backups |
| `data.overheid.nl` — Kaarten en Ontwerptekeningen | XML/image archive, no GeoJSON/WFS |
| Historical Archief Eemland maps | Not geographic API |

---

### Stage 2 — Code generated

Files created/modified:
- `src/lib/data-sources/cities/amersfoort.ts` (new — 1 live layer)
- `src/lib/data-sources/provincial/utrecht.ts` (rewritten — 11 live layers)
- `src/lib/data-sources/index.ts` (added import + CITY_BUILDERS entry + SOURCE_URLS entries)
- `src/lib/cities.ts` (added `gis.provincie-utrecht.nl` to `getAllowedHosts()`)

Coverage: stays `national-only` (only 1 city-specific live layer; threshold is 10).

---

### Stage 3 — Build status

- `npx tsc --noEmit` → clean ✓
- `npm run build` → success ✓ (705 static pages generated)

---

### Stage 4 — Summary

~ partial — 1 city live layer + 11 provincial live layers; module wired; coverage badge stays Nationaal.
