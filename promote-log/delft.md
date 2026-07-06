# Delft — promote-city log

## 2026-07-06 run

**Outcome:** `promoted` — 18 live city layers + 19 live provincial layers (Zuid-Holland). `coverage: "full"`, `promotedAt: "2026-07-06"`.

### Stage 0 — Provincial enrichment (Zuid-Holland)

`provincial/zuid-holland.ts` was a 100%-stub module (0 layers). Probe results:

| Endpoint | Result |
|---|---|
| `geoportaal.zuid-holland.nl` | 200 — publieksportaal (ASCII-art SPA, geen machine-leesbare feed) |
| `geodata.zuid-holland.nl/geoserver/wfs` (root) | **401** — catalogus vereist authenticatie |
| `geodata.zuid-holland.nl/geoserver/<workspace>/wfs` | **200** — workspace-scoped WFS is publiek |

Workspace-discovery (naam-probing): publiek = `bodem` (106 types), `cultuur` (56), `economie` (23), `energie` (167), `klimaat` (52), `milieu` (41), `ruimte` (84), `verkeer` (129), `water` (60), `wonen` (8). 404 = natuur, landschap, recreatie, mobiliteit, erfgoed, lucht, geluid, groen, landbouw, ondergrond.

**Let op bbox-CRS:** lagen staan native in EPSG:28992; de bbox-parameter moet de CRS-suffix dragen. `city.bboxWFS` bevat die al (`…,urn:ogc:def:crs:EPSG::4326`), dus `fetchPDOKWFS` werkt ongewijzigd.

**19 lagen geaccepteerd** (elk geprobed ≥1 feature op Delft-bbox, of provinciale bbox `[3.7737, 51.6438, 5.0314, 52.3325]` voor provincie-brede lagen):

zh-aardwarmteprojecten, zh-bedrijventerreinen-woz, zh-bodemkaart, zh-bodemsanering-spoedlocaties, zh-bomen-provinciale-wegen, zh-bushaltes-provinciale-wegen, zh-carpoolplaatsen, zh-elektriciteitsstations, zh-fiets-verkeersongevallen, zh-fietstellingen, zh-geluidcontouren-wegen, zh-grondwaterbescherming, zh-hectometrering, zh-kunstwerken, zh-lichtmasten, zh-luchtkwaliteit-wegen, zh-netcapaciteit-afname, zh-provinciale-wegen, zh-stiltegebieden

Niet meegenomen (follow-up kandidaten): de workspaces `klimaat` (hitte/wateroverlast/overstroming-kaarten), `ruimte` (kwaliteitskaarten), `cultuur` (CHS/erfgoed, deels overlap met nationale RCE-lagen) en `wonen` (corporatiebezit provinciebreed) — bewust beperkt tot 19 lagen voor een eerste module.

### Stage 1 — City enrichment (Delft)

| Endpoint | Result |
|---|---|
| `data.delft.nl` | **200 — ArcGIS Hub**, DCAT-feed werkt (`/api/feed/dcat-us/1.1.json`, 57 datasets) |
| `kaart.delft.nl` | 200 — viewer, geen machine-leesbare catalogus |
| `data-delft` / `opendata-delft` / `staatvan-delft` `.opendata.arcgis.com` | 404 |
| `gis.delft.nl`, `geo.delft.nl`, `opendata.delft.nl` | DNS/geen respons |
| `ckan.dataplatform.nl` (org: delft) | geen bruikbare respons |

ArcGIS-org: `services3.arcgis.com/j07voPd56xoB4c87`. **18 datasets geaccepteerd**, elk geprobed met `returnCountOnly` (aantal features tussen haakjes):

delft-archeologie (11), delft-beplantingen (15.770), delft-bomen (36.756), delft-buurtpreventie (28), delft-corporatiebezit (9.573), delft-drinkwaterpunten (21), delft-energielabels (42.178), delft-fietsenstallingen (4), delft-geologie (8), delft-hagen (677), delft-milieuzone (1), delft-monumenten (2.048), delft-parkeerautomaten (105), delft-parkeergebieden (11), delft-speelplekken (208), delft-stadsgezichten (4), delft-voetgangersnetwerk (15), delft-zonnepanelen (157.360)

### Rejected

| Dataset | Reden |
|---|---|
| Terrassenkaart (3 varianten) | horeca-niche, weinig analytische waarde |
| Voetgangersnetwerk (7 overige varianten) | dedupe — hoofdnet volstaat als eerste laag |
| Welstand* (6 varianten) | beleidsniveau-niche; Welstandsniveau evt. follow-up |
| Strooiroutes klein/groot | seizoensgebonden beheer; follow-up kandidaat (Zwolle heeft equivalent) |
| Meldingen Openbare Ruimte | zeer dynamisch/groot; categorie onduidelijk; follow-up |
| Evenementen locaties | laatst gewijzigd 2020 → ouder dan 5 jaar |
| Infraroodmeting wegen | laatst gewijzigd 2019 → ouder dan 5 jaar |
| Stoepparkeren, Mixparkeerplekken | niche; parkeergebieden/automaten dekken het thema |
| Wijken, Buurten | duplicaat van nationale CBS wijken/buurten-lagen |
| Wateren, Grassen, Parkverhardingen | BGT-achtig; nationale BGT-lagen dekken dit |
| Bedrijvengebieden | provinciale laag zh-bedrijventerreinen-woz dekt het thema |
| Musea, Kunst in openbare ruimte, Groene Rijksmonumenten, Cultuurhistorische gebieden/objecten, Wederopbouwgebieden | erfgoed-niche; monumenten + stadsgezichten opgenomen als kern |

### Categorie-opmerkingen

- `delft-drinkwaterpunten` en `delft-speelplekken` → `sociaal-economisch`, conform de bestaande `osm-drinkwater`/`osm-speeltuinen` nationale lagen.
- `delft-buurtpreventie` → `veiligheid` (geen keyword-match; beredeneerde toewijzing).
- `zh-bedrijventerreinen-woz` → `sociaal-economisch` (keyword "WOZ").

### Files touched

- `src/lib/data-sources/provincial/zuid-holland.ts` — herschreven: stub → 19 lagen (GeoServer WFS)
- `src/lib/data-sources/cities/delft.ts` — nieuw: 18 lagen (ArcGIS Hub)
- `src/lib/data-sources/index.ts` — `CITY_BUILDERS.delft` + SOURCE_URLS ("Geodata Zuid-Holland", "Open data Delft")
- `src/lib/cities.ts` — `LIVE_OVERRIDES.delft` (coverage full, promotedAt 2026-07-06, municipalGIS arcgis-hub) + allowed hosts `geodata.zuid-holland.nl`, `services3.arcgis.com`

### Build

- `npx tsc --noEmit` — clean
- `npm run build` — succeeded
- End-to-end fetchData-probe (Delft): 35/37 nieuwe lagen leveren features; `zh-carpoolplaatsen` en `zh-grondwaterbescherming` zijn leeg binnen de Delft-bbox maar provinciebreed gevuld (102 resp. 52 features) — verwacht gedrag, analoog aan de Gelderse waterlagen bij Elburg.
