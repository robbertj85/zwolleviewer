# Open Data Sources for Municipality of Zwolle, Netherlands

## Table of Contents

1. [Gemeente Zwolle Open Data Portal (ArcGIS Hub)](#1-gemeente-zwolle-open-data-portal-arcgis-hub)
2. [Verkeerslichtenviewer - Traffic Lights API](#2-verkeerslichtenviewer---traffic-lights-api)
3. [NDW - Nationaal Dataportaal Wegverkeer](#3-ndw---nationaal-dataportaal-wegverkeer)
4. [PDOK - BAG (Adressen en Gebouwen)](#4-pdok---bag-basisregistratie-adressen-en-gebouwen)
5. [PDOK - BGT (Grootschalige Topografie)](#5-pdok---bgt-basisregistratie-grootschalige-topografie)
6. [PDOK - Locatieserver (Geocoding)](#6-pdok---locatieserver-geocoding)
7. [PDOK - Background Map Tiles](#7-pdok---background-map-tiles-brt-achtergrondkaart)
8. [PDOK - CBS Wijken en Buurten](#8-pdok---cbs-wijken-en-buurten)
9. [PDOK - AHN (Elevation Data)](#9-pdok---ahn-actueel-hoogtebestand-nederland)
10. [PDOK - Kadastrale Kaart](#10-pdok---kadastrale-kaart)
11. [PDOK - Luchtfoto (Aerial Photography)](#11-pdok---luchtfoto-aerial-photography)
12. [CBS - Statistics Netherlands](#12-cbs---statistics-netherlands-odata-api)
13. [Kadaster BAG API - Individual Queries](#13-kadaster-bag-api---individual-queries)
14. [PostNL - Location API (Package Points)](#14-postnl---location-api-package-pickup-points)
15. [DHL - Location Finder API](#15-dhl---location-finder-api)
16. [OpenStreetMap - Overpass API](#16-openstreetmap---overpass-api)
17. [Data.overheid.nl - Dutch Government Data](#17-dataoverheadnl---dutch-government-open-data)

---

## 1. Gemeente Zwolle Open Data Portal (ArcGIS Hub)

### Portal URLs

| Portal | URL |
|--------|-----|
| Smart Zwolle Hub | https://smart-zwolle.opendata.arcgis.com/ |
| Smart Zwolle Hub (English) | https://en-smart-zwolle.opendata.arcgis.com/ |
| Zwolle ArcGIS Maps | https://zwolle.maps.arcgis.com/ |
| Zwolle ArcGIS Hub | https://zwolle.hub.arcgis.com/ |
| Geo Informatie Portaal | https://www.arcgis.com/apps/instant/filtergallery/index.html?appid=a1ca934bbf9841bd92bf4d5648d8ee08 |

### ArcGIS REST Services Base URL

```
https://services1.arcgis.com/3YlK2vfHGZtonb1r/ArcGIS/rest/services/
```

**Authentication:** None required (public)
**Total services:** 167 FeatureServers + 7 SceneServers
**Formats:** GeoJSON, CSV, KML, Shapefile, Excel, GeoTIFF, PNG

### Key Datasets Available

#### Parking (Real-time, updated every 5 minutes)

```
GET https://services1.arcgis.com/3YlK2vfHGZtonb1r/ArcGIS/rest/services/Parkeeraccommodaties_Zwolle/FeatureServer/1/query?where=1%3D1&outFields=*&f=geojson
```

Fields: NAAM, CAPACITEIT, AANTALVRIJ, VOL, STATUS, OPEN_, EXPLOITATIE, SOORT, MAXDOORRIJHOOGTE, LOOPAFSTAND, LINKNAARTARIEVEN, UPDATED

#### Trees (Bomen)

```
GET https://services1.arcgis.com/3YlK2vfHGZtonb1r/ArcGIS/rest/services/Bomen_overig/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson
```

Fields: ID, IMGEO_KLASSE, IMGEO_FYSIEKVOORKOMEN, IMGEO_FYSIEKVOORKOMEN_PLUS, IMGEO_BRONHOUDER, ROTATIE, HOOGTE_INDICATIEF

#### Dog Off-Leash Areas

```
GET https://services1.arcgis.com/3YlK2vfHGZtonb1r/ArcGIS/rest/services/Hondenkaart_openbaar/FeatureServer/1/query?where=1%3D1&outFields=*&f=geojson
```

#### Bicycle Counts (updated every 5 minutes)

```
GET https://services1.arcgis.com/3YlK2vfHGZtonb1r/ArcGIS/rest/services/Bicycle_counts_access_roads_bicycle_parking_city_centre_Zwolle/FeatureServer/1/query?where=1%3D1&outFields=*&f=json
```

#### Notable Other Services (all FeatureServer)

| Service Name | Description |
|-------------|-------------|
| Zonnepanelen_Zwolle | Solar panel locations |
| Energiemonitor | Energy monitoring |
| Duurzame_opwek_elektriciteit | Sustainable electricity generation |
| Warmtetransitiekaart | Heat transition map |
| Fietsenstalling_actueel | Bicycle parking (real-time) |
| Deelvoertuigen_actueel | Shared vehicles (real-time) |
| Openbaar_vervoer | Public transport |
| MOR_meldingen_openbaar | Public maintenance reports |
| TOR_melding_openbaar | Public reports |
| Gemeentelijke_monumenten | Municipal monuments |
| Wateroverlast_Raadplegen | Water nuisance consultation |
| Natuurwaarden | Nature values |
| Groene_buurtinitiatieven | Green neighborhood initiatives |
| Groendetectie_BGT_erf | Green detection |
| 3D_Digitale_Tweelingstad_Zwolle_Bebouwing | 3D Digital Twin buildings |
| Parkeren_zones | Parking zones |

### Generic ArcGIS Query Pattern

```
https://services1.arcgis.com/3YlK2vfHGZtonb1r/ArcGIS/rest/services/{SERVICE_NAME}/FeatureServer/{LAYER_ID}/query?where=1%3D1&outFields=*&f=geojson
```

Parameters:
- `where`: SQL WHERE clause (use `1=1` for all records)
- `outFields`: Field names or `*` for all
- `f`: Output format (`json`, `geojson`, `html`, `csv`, `kmz`)
- `resultRecordCount`: Limit number of results
- `geometry`: Spatial filter (envelope or point)
- `geometryType`: `esriGeometryEnvelope`, `esriGeometryPoint`
- `spatialRel`: `esriSpatialRelIntersects`, `esriSpatialRelContains`
- `outSR`: Output spatial reference (e.g., `4326` for WGS84)

---

## 2. Verkeerslichtenviewer - Traffic Lights API

### Overview
Provides data on all intelligent traffic lights (iVRI) in the Netherlands, sourced from UDAP (Urban Data Access Platform, successor to TLEX).

| Property | Value |
|----------|-------|
| Website | https://verkeerslichtenviewer.nl |
| API Base URL | https://verkeerslichtenviewer.nl/api/v1 |
| API Docs | https://verkeerslichtenviewer.nl/api/v1/docs |
| OpenAPI Spec | https://verkeerslichtenviewer.nl/openapi.json |
| Authentication | None required |
| Data Source | UDAP (Urban Data Access Platform) - https://map.udap.nl |
| Formats | GeoJSON, JSON, CSV |

### Endpoints

#### GET /api/v1/subjects - List Traffic Lights

```bash
# Get all traffic lights (paginated)
curl "https://verkeerslichtenviewer.nl/api/v1/subjects?page=1&limit=100"

# Filter by road authority (e.g., Zwolle)
curl "https://verkeerslichtenviewer.nl/api/v1/subjects?authority=Zwolle&limit=1000"

# Filter by priority type
curl "https://verkeerslichtenviewer.nl/api/v1/subjects?priority=public_transport"
```

Parameters:
- `page` (int, default: 1) - Page number
- `limit` (int, default: 100, max: 1000) - Items per page
- `authority` (string) - Filter by road authority name
- `priority` (string) - Filter: emergency, road_operator, public_transport, logistics, agriculture
- `tlc_organization` (string) - Filter by traffic light controller vendor

Response:
```json
{
  "total": 1217,
  "page": 1,
  "limit": 100,
  "total_pages": 13,
  "data": [
    {
      "id": "uuid",
      "name": "VRI name",
      "identifier": "short-id",
      "latitude": 52.5168,
      "longitude": 6.0830,
      "roadRegulatorId": 123,
      "roadRegulatorName": "Gemeente Zwolle",
      "has_emergency": true,
      "has_public_transport": true,
      "has_logistics": false,
      "has_agriculture": false,
      "has_road_operator": true,
      "priorities": ["emergency", "public_transport", "road_operator"],
      "priority_count": 3,
      "tlc_organization": "Vendor Name",
      "coordinates": [6.0830, 52.5168]
    }
  ]
}
```

#### GET /api/v1/stats - Statistics

```bash
curl "https://verkeerslichtenviewer.nl/api/v1/stats"
```

#### GET /api/v1/export - Full Data Export

```bash
# GeoJSON export (default)
curl "https://verkeerslichtenviewer.nl/api/v1/export?format=geojson"

# CSV export
curl "https://verkeerslichtenviewer.nl/api/v1/export?format=csv"

# JSON export
curl "https://verkeerslichtenviewer.nl/api/v1/export?format=json"
```

---

## 3. NDW - Nationaal Dataportaal Wegverkeer

### Overview
National road traffic data portal providing real-time and historical traffic measurements, incidents, roadworks, and infrastructure data.

| Property | Value |
|----------|-------|
| Website | https://www.ndw.nu/ |
| Open Data Portal | https://opendata.ndw.nu/ |
| Documentation | https://docs.ndw.nu/ |
| Historical Data | https://dexter.ndw.nu/opendata |
| Data Format | DATEX II (XML), GeoJSON, CSV |
| Authentication | None for open data feeds |
| Note | Transitioning from DATEX II v2.3 to v3 (deadline: April 2, 2026) |

### Open Data Feeds (Real-time)

All feeds are at `https://opendata.ndw.nu/{filename}` and updated continuously:

| Feed | File | Size | Description |
|------|------|------|-------------|
| Traffic Overview | actueel_beeld.xml.gz | 172K | Current traffic situation |
| Traffic Speed | trafficspeed.xml.gz | 1.0M | Speed measurements |
| Travel Times | traveltime.xml.gz | 2.5M | Route travel times |
| Incidents | incidents.xml.gz | 2.1K | Traffic incidents |
| Status Reports | actuele_statusberichten.xml.gz | 94K | Real-time status |
| Measurements | measurement.xml.gz | 11M | Detection point data |
| Road Works | wegwerkzaamheden.xml.gz | 27M | Current roadworks |
| Bridge Openings | brugopeningen.xml.gz | 75K | Bridge schedules |
| EV Charging | charging_point_locations.geojson.gz | 1.8M | Charging stations (GeoJSON) |
| Emission Zones | emissiezones.xml.gz | 121K | Low emission zones |
| Truck Parking | Truckparking_Parking_Status.xml | 15K | Truck parking availability |
| Road Closures | tijdelijke_verkeersmaatregelen_afsluitingen.xml.gz | 103K | Temporary closures |
| Traffic Signs | verkeersborden_actueel_beeld.csv.gz | 234M | All traffic signs (CSV) |

### Example - Download Real-time Traffic Speed Data

```bash
curl -o trafficspeed.xml.gz "https://opendata.ndw.nu/trafficspeed.xml.gz"
gunzip trafficspeed.xml.gz
# Result: DATEX II XML with speed measurements across NL
```

### Example - EV Charging Points (GeoJSON)

```bash
curl -o charging.geojson.gz "https://opendata.ndw.nu/charging_point_locations.geojson.gz"
gunzip charging.geojson.gz
# Result: GeoJSON FeatureCollection with all charging points
```

### Historical Data (Dexter)

```
https://dexter.ndw.nu/opendata
```
- Basic module: query intensities and speeds for up to 10 measurement locations
- Covers all measurement points in the Netherlands including Zwolle area

### Filtering for Zwolle Area

NDW data covers all of the Netherlands. To filter for Zwolle:
- Parse XML/GeoJSON and filter by coordinates (Zwolle bbox: ~52.48-52.55 lat, 6.05-6.15 lon)
- Or use measurement location IDs in the Zwolle area

---

## 4. PDOK - BAG (Basisregistratie Adressen en Gebouwen)

### Overview
The official Dutch registry of all addresses and buildings. Contains building footprints, addresses, residential objects.

| Property | Value |
|----------|-------|
| Authentication | None required |
| License | CC0 1.0 (Public Domain) |
| Update Frequency | Daily |
| Coordinate System | EPSG:28992 (RD New) and EPSG:4326 (WGS84) |

### API Endpoints

| Service | URL |
|---------|-----|
| OGC API Features/Tiles | https://api.pdok.nl/kadaster/bag/ogc/v2/ |
| WFS v2.0 | https://service.pdok.nl/lv/bag/wfs/v2_0 |
| WMS v2.0 | https://service.pdok.nl/lv/bag/wms/v2_0 |
| ATOM Download | https://service.pdok.nl/lv/bag/atom/bag.xml |
| Linked Open Data | https://bag.basisregistraties.overheid.nl |

### OGC API Features - Example Requests

```bash
# List available collections
curl "https://api.pdok.nl/kadaster/bag/ogc/v2/collections?f=json"

# Get buildings (panden) in Zwolle area using bbox (WGS84)
curl "https://api.pdok.nl/kadaster/bag/ogc/v2/collections/pand/items?bbox=6.05,52.48,6.15,52.55&limit=100&f=json"

# Get buildings using RD coordinates bbox
curl "https://api.pdok.nl/kadaster/bag/ogc/v2/collections/pand/items?bbox=198000,498000,204000,504000&bbox-crs=http://www.opengis.net/def/crs/EPSG/0/28992&limit=100&f=json"
```

### WFS - Example Requests

```bash
# GetCapabilities
curl "https://service.pdok.nl/lv/bag/wfs/v2_0?service=WFS&request=GetCapabilities"

# Get buildings as GeoJSON with bbox (RD coordinates for Zwolle center)
curl "https://service.pdok.nl/lv/bag/wfs/v2_0?service=WFS&version=2.0.0&request=GetFeature&typeName=bag:pand&count=100&outputFormat=json&bbox=198000,498000,204000,504000"

# Get buildings as GeoJSON with Web Mercator bbox
curl "https://service.pdok.nl/lv/bag/wfs/v2_0?service=WFS&version=1.1.0&request=GetFeature&typename=bag:pand&outputFormat=application/json&srsname=EPSG:3857&bbox=673000,6864000,685000,6876000,EPSG:3857"
```

### Available WFS TypeNames

- `bag:pand` - Buildings (footprints + attributes)
- `bag:verblijfsobject` - Residential objects
- `bag:ligplaats` - Mooring places
- `bag:standplaats` - Standing places
- `bag:woonplaats` - Residential areas

---

## 5. PDOK - BGT (Basisregistratie Grootschalige Topografie)

### Overview
The detailed large-scale base map of the Netherlands. Contains physical objects like roads, buildings, water, vegetation at high detail.

| Property | Value |
|----------|-------|
| Authentication | None required |
| License | CC0 1.0 |
| Collections | 49 feature types |

### API Endpoints

| Service | URL |
|---------|-----|
| OGC API Features/Tiles/Styles | https://api.pdok.nl/lv/bgt/ogc/v1/ |
| BGT Download API | https://api.pdok.nl/lv/bgt/download/v1_0/ui/ |

### Example Requests

```bash
# List all collections (49 available)
curl "https://api.pdok.nl/lv/bgt/ogc/v1/collections?f=json"

# Get road sections (wegdeel) in Zwolle area
curl "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items?bbox=6.05,52.48,6.15,52.55&limit=100&f=json"

# Get buildings (pand) from BGT
curl "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand/items?bbox=6.05,52.48,6.15,52.55&limit=100&f=json"

# Get water bodies (waterdeel)
curl "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterdeel/items?bbox=6.05,52.48,6.15,52.55&limit=100&f=json"
```

### Key Collections

| Collection | Description |
|-----------|-------------|
| pand | Buildings |
| wegdeel | Road sections |
| waterdeel | Water bodies |
| spoor | Railways |
| begroeidterreindeel | Vegetated terrain |
| onbegroeidterreindeel | Non-vegetated terrain |
| ondersteunendwegdeel | Supporting road sections |
| overbruggingsdeel | Bridge parts |
| tunneldeel | Tunnel parts |
| kunstwerkdeel | Engineering structures |
| scheiding | Separations/fences |
| functioneelgebied | Functional areas |

### Vector Tiles

```
https://api.pdok.nl/lv/bgt/ogc/v1/tiles/{tileMatrixSetId}/{tileMatrix}/{tileRow}/{tileCol}
```

---

## 6. PDOK - Locatieserver (Geocoding)

### Overview
Free geocoding service for the Netherlands. Supports forward geocoding, reverse geocoding, and autocomplete.

| Property | Value |
|----------|-------|
| Base URL | https://api.pdok.nl/bzk/locatieserver/search/v3_1/ |
| API Docs (Swagger) | https://api.pdok.nl/bzk/locatieserver/search/v3_1/ui/ |
| Authentication | None required |
| Format | JSON |
| Data Sources | BAG, NWB, DKK, Bestuurlijke Grenzen, CBS |

### Endpoints

#### Suggest (Autocomplete)

```bash
# Autocomplete search for address in Zwolle
curl "https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=Grote+Markt+Zwolle&rows=5"

# Filter to addresses only
curl "https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=Grote+Markt&fq=type:adres&fq=gemeentenaam:Zwolle&rows=10"
```

#### Free (Classic Geocoding)

```bash
# Geocode an address
curl "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=Grote+Markt+20+Zwolle"

# Search with type filter
curl "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=Zwolle&fq=type:gemeente"
```

#### Lookup (Get Details by ID)

```bash
# Lookup a specific object by ID from suggest results
curl "https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?id=adr-XXXXXXXX"
```

#### Reverse Geocoder

```bash
# Reverse geocode from coordinates (WGS84)
curl "https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=52.5126&lon=6.0944&rows=5"
```

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| q | Search query | required |
| rows | Results per page | 10 (max 50) |
| start | Pagination offset | 0 |
| lat, lon | Sort by distance from point | - |
| fl | Return fields | all |
| fq | Filter query (e.g., `type:adres`, `gemeentenaam:Zwolle`) | - |
| sort | Custom sorting | score desc |

### Searchable Object Types

provincie, gemeente, woonplaats, weg, postcode, adres, perceel, hectometerpaal, wijk, buurt, waterschapsgrens, appartementsrecht

---

## 7. PDOK - Background Map Tiles (BRT Achtergrondkaart)

### Overview
Free Dutch topographic base map tiles for use in web applications.

| Property | Value |
|----------|-------|
| Authentication | None required |
| License | CC-BY 4.0 |
| Projections | EPSG:28992 (RD), EPSG:3857 (Web Mercator), EPSG:25831 |

### WMTS Endpoints

```bash
# GetCapabilities
curl "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?service=WMTS&request=GetCapabilities"
```

### XYZ Tile URLs (for Leaflet/Mapbox/OpenLayers)

```
# Standard (RD projection)
https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:28992/{z}/{x}/{y}.png

# Standard (Web Mercator - use in Leaflet)
https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png

# Grayscale
https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:3857/{z}/{x}/{y}.png

# Pastel
https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/pastel/EPSG:3857/{z}/{x}/{y}.png

# Water
https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:3857/{z}/{x}/{y}.png
```

### OGC API Tiles

```
https://api.pdok.nl/kadaster/brt-achtergrondkaart/ogc/v1
```

### Leaflet Example

```javascript
L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png', {
  attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl">Kadaster</a>',
  maxZoom: 19
}).addTo(map);
```

---

## 8. PDOK - CBS Wijken en Buurten

### Overview
Geographic boundaries and statistics for all municipalities, districts (wijken) and neighborhoods (buurten) in the Netherlands.

| Property | Value |
|----------|-------|
| Authentication | None required |
| License | CC-BY 4.0 |
| Formats | GeoJSON, GML, Shapefile |

### OGC API Endpoints (by year)

| Year | URL |
|------|-----|
| 2024 | https://api.pdok.nl/cbs/wijken-en-buurten-2024/ogc/v1 |
| 2023 | https://api.pdok.nl/cbs/wijken-en-buurten-2023/ogc/v1 |
| 2022 | https://api.pdok.nl/cbs/wijken-en-buurten-2022/ogc/v1 |

### Example Requests

```bash
# List collections for 2024
curl "https://api.pdok.nl/cbs/wijken-en-buurten-2024/ogc/v1/collections?f=json"

# Get municipality boundaries
curl "https://api.pdok.nl/cbs/wijken-en-buurten-2024/ogc/v1/collections/gemeenten/items?f=json&limit=10"

# Get Zwolle's districts (wijken) - filter by gemeente name
curl "https://api.pdok.nl/cbs/wijken-en-buurten-2024/ogc/v1/collections/wijken/items?f=json&limit=100"

# Get neighborhoods (buurten) using bbox around Zwolle
curl "https://api.pdok.nl/cbs/wijken-en-buurten-2024/ogc/v1/collections/buurten/items?bbox=6.05,52.48,6.15,52.55&f=json&limit=100"
```

### WFS Endpoint

```bash
curl "https://service.pdok.nl/cbs/wijken-en-buurten-2024/wfs/v1_0?service=WFS&request=GetFeature&typeName=wijken&outputFormat=json&count=10"
```

---

## 9. PDOK - AHN (Actueel Hoogtebestand Nederland)

### Overview
Digital elevation model of the Netherlands at 0.5m resolution.

| Property | Value |
|----------|-------|
| WCS Endpoint | https://service.pdok.nl/rws/ahn/wcs/v1_0/ |
| Format | GeoTIFF |
| Resolution | 0.5m DSM and 0.5m DTM |
| Coordinate System | EPSG:28992 (RD New) |
| Authentication | None required |

### Example WCS Request

```bash
# Get elevation data for a small area in Zwolle (RD coordinates)
curl "https://service.pdok.nl/rws/ahn/wcs/v1_0?service=WCS&version=1.1.1&request=GetCoverage&identifier=dsm_05m&boundingbox=199000,499000,200000,500000,urn:ogc:def:crs:EPSG::28992&format=image/tiff&GridBaseCRS=urn:ogc:def:crs:EPSG::28992"
```

---

## 10. PDOK - Kadastrale Kaart

### Overview
Cadastral parcel boundaries and information.

| Service | URL |
|---------|-----|
| OGC API | https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/ |
| Bestuurlijke Gebieden | https://api.pdok.nl/kadaster/brk-bestuurlijke-gebieden/ogc/v1/ |
| Download API | https://api.pdok.nl/kadaster/kadastralekaart/download/v5_0/ui |

### Example

```bash
# Get cadastral parcels in Zwolle area
curl "https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/collections?f=json"
```

---

## 11. PDOK - Luchtfoto (Aerial Photography)

### Overview
Annual aerial photography of the Netherlands at 8cm and 25cm resolution.

| Property | Value |
|----------|-------|
| WMS | https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 |
| License | CC-BY 4.0 |
| Authentication | None required |

### WMS Example

```bash
# Get aerial image as PNG for Zwolle area
curl "https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0?service=WMS&request=GetMap&layers=Actueel_orthoHR&styles=&crs=EPSG:28992&bbox=198000,498000,204000,504000&width=800&height=800&format=image/png"
```

---

## 12. CBS - Statistics Netherlands (OData API)

### Overview
Statistical data for all Dutch municipalities, districts, and neighborhoods.

| Property | Value |
|----------|-------|
| OData v4 Base URL | https://datasets.cbs.nl/odata/v1/CBS/ |
| OData v3 Base URL | https://opendata.cbs.nl/ODataApi/OData/ |
| Data Portal | https://opendata.cbs.nl/statline/portal.html |
| Authentication | None required |
| Format | JSON (OData) |
| Zwolle Municipality Code | GM0193 |

### Key Table IDs

| Table ID | Description |
|----------|-------------|
| 85984NED | Kerncijfers wijken en buurten 2024 |
| 86165NED | Kerncijfers wijken en buurten 2025 |
| 83765NED | Kerncijfers wijken en buurten (historical) |
| 70072NED | Regionale kerncijfers Nederland |

### Example Requests

```bash
# Get table metadata
curl "https://datasets.cbs.nl/odata/v1/CBS/86165NED"

# Get Zwolle municipality data (kerncijfers 2025)
curl "https://datasets.cbs.nl/odata/v1/CBS/86165NED/Observations?\$filter=startswith(WijkenEnBuurten,'GM0193')"

# Get all neighborhoods in Zwolle (buurt level, code starts with BU0193)
curl "https://datasets.cbs.nl/odata/v1/CBS/86165NED/Observations?\$filter=startswith(WijkenEnBuurten,'BU0193')"

# Get specific measures for Zwolle
curl "https://datasets.cbs.nl/odata/v1/CBS/86165NED/Observations?\$filter=WijkenEnBuurten eq 'GM0193  ' and Measure eq 'T001036'"

# Browse all available tables
curl "https://datasets.cbs.nl/odata/v1/CBS/Datasets"
```

### Data Includes

Population, households, age distribution, housing, income, social security, energy, land use, proximity to amenities, and more - all at municipality, district (wijk), and neighborhood (buurt) level.

---

## 13. Kadaster BAG API - Individual Queries

### Overview
RESTful API for individual address/building lookups from the official BAG registry.

| Property | Value |
|----------|-------|
| Base URL | https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/ |
| OpenAPI Spec | https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/openapi.yaml |
| GitHub Docs | https://github.com/lvbag/BAG-API |
| Authentication | **API key required** (free, request via Kadaster) |
| Rate Limit | 50,000 queries/day, 50 messages/second |
| Format | JSON (HAL) |

### Example Requests

```bash
# Search addresses by postcode and house number
curl -H "X-Api-Key: YOUR_KEY" "https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressen?postcode=8011&huisnummer=1"

# Lookup a specific building (pand) by ID
curl -H "X-Api-Key: YOUR_KEY" "https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/panden/0193100000XXXXX"
```

### Available Resources

- `/adressen` - Addresses
- `/adressenuitgebreid` - Extended addresses
- `/panden` - Buildings
- `/verblijfsobjecten` - Residential objects
- `/nummeraanduidingen` - Address designations
- `/openbareruimten` - Public spaces
- `/woonplaatsen` - Residential places

---

## 14. PostNL - Location API (Package Pickup Points)

### Overview
Find nearest PostNL pickup points (4000+ locations in NL).

| Property | Value |
|----------|-------|
| Production URL | https://api.postnl.nl/shipment/v2_1/locations |
| Sandbox URL | https://api-sandbox.postnl.nl/shipment/v2_1/locations |
| Developer Portal | https://developer.postnl.nl/browse-apis/delivery-options/location-webservice/ |
| Docs | https://docs.api.postnl.nl/ |
| Authentication | **API key required** (free registration) |
| Format | JSON |

### Methods

1. **GetNearestLocations** - By postal code or coordinates
2. **GetLocationsInArea** - By bounding box
3. **GetLocation** - By LocationCode

### Example

```bash
# Get nearest PostNL points to a Zwolle postal code
curl -H "apikey: YOUR_KEY" "https://api.postnl.nl/shipment/v2_1/locations/nearest?CountryCode=NL&PostalCode=8011AB&City=Zwolle&DeliveryOptions=PG"

# Get locations in area (bounding box)
curl -H "apikey: YOUR_KEY" "https://api.postnl.nl/shipment/v2_1/locations/area?LatitudeNorth=52.55&LongitudeWest=6.05&LatitudeSouth=52.48&LongitudeEast=6.15&DeliveryOptions=PG"
```

Parameter `DeliveryOptions=PG` = Pick up at PostNL location

---

## 15. DHL - Location Finder API

### Overview
Find DHL service points, parcel lockers, and post offices.

| Property | Value |
|----------|-------|
| API Reference | https://developer.dhl.com/api-reference/location-finder-unified |
| Developer Portal | https://developer.dhl.com/api-catalog |
| Locator | https://locator.dhl.com/ |
| Authentication | **API key required** (free registration at DHL Developer Portal) |
| Format | JSON |

### Endpoints

```bash
# Find by address
curl -H "DHL-API-Key: YOUR_KEY" "https://api.dhl.com/location-finder/v1/find-by-address?countryCode=NL&postalCode=8011AB&streetAddress=Grote+Markt&limit=10"

# Find by coordinates (Zwolle center)
curl -H "DHL-API-Key: YOUR_KEY" "https://api.dhl.com/location-finder/v1/find-by-geo?latitude=52.5126&longitude=6.0944&radius=5000"
```

---

## 16. OpenStreetMap - Overpass API

### Overview
Query any OpenStreetMap data for the Zwolle area.

| Property | Value |
|----------|-------|
| Overpass API | https://overpass-api.de/api/interpreter |
| Alternative | https://overpass.kumi.systems/api/interpreter |
| Web IDE | https://overpass-turbo.eu/ |
| Authentication | None required |
| Format | JSON, XML, CSV |
| Zwolle Bbox | 52.48, 6.05, 52.55, 6.15 (south, west, north, east) |

### Example Queries

```bash
# Get all buildings in Zwolle
curl -d 'data=[out:json][bbox:52.48,6.05,52.55,6.15][timeout:60];way["building"]({{bbox}});out center;' "https://overpass-api.de/api/interpreter"

# Get all restaurants in Zwolle
curl -d 'data=[out:json][bbox:52.48,6.05,52.55,6.15][timeout:30];(node["amenity"="restaurant"](52.48,6.05,52.55,6.15);way["amenity"="restaurant"](52.48,6.05,52.55,6.15););out center;' "https://overpass-api.de/api/interpreter"

# Get all bicycle parking in Zwolle
curl -d 'data=[out:json][timeout:30];(node["amenity"="bicycle_parking"](52.48,6.05,52.55,6.15);way["amenity"="bicycle_parking"](52.48,6.05,52.55,6.15););out center;' "https://overpass-api.de/api/interpreter"

# Get all traffic signals in Zwolle
curl -d 'data=[out:json][timeout:30];node["highway"="traffic_signals"](52.48,6.05,52.55,6.15);out;' "https://overpass-api.de/api/interpreter"

# Get supermarkets and shops in Zwolle
curl -d 'data=[out:json][timeout:30];(node["shop"="supermarket"](52.48,6.05,52.55,6.15);way["shop"="supermarket"](52.48,6.05,52.55,6.15););out center;' "https://overpass-api.de/api/interpreter"

# Get Zwolle administrative boundary
curl -d 'data=[out:json][timeout:30];relation["boundary"="administrative"]["name"="Zwolle"]["admin_level"="8"];out geom;' "https://overpass-api.de/api/interpreter"
```

### Overpass Turbo URL (pre-loaded with Zwolle bbox)

```
https://overpass-turbo.eu/?Q=[out:json][bbox:52.48,6.05,52.55,6.15][timeout:30];
```

---

## 17. Data.overheid.nl - Dutch Government Open Data

### Overview
Central portal for all Dutch government open data.

| Property | Value |
|----------|-------|
| Zwolle Organization | https://data.overheid.nl/community/organization/zwolle_gemeente |
| API Type | CKAN API |
| API Docs | https://docs.ckan.org/en/latest/api/index.html |
| License | CC-0 |

### Example

```bash
# Search datasets for Zwolle
curl "https://data.overheid.nl/api/3/action/package_search?q=zwolle&rows=25"

# List datasets by organization
curl "https://data.overheid.nl/api/3/action/package_search?fq=organization:zwolle_gemeente"
```

---

## Quick Reference - All Free (No Auth) APIs

| Data Source | Format | Endpoint |
|-------------|--------|----------|
| Zwolle Parking (real-time) | GeoJSON | `services1.arcgis.com/.../Parkeeraccommodaties_Zwolle/FeatureServer/1/query?...&f=geojson` |
| Zwolle Trees | GeoJSON | `services1.arcgis.com/.../Bomen_overig/FeatureServer/0/query?...&f=geojson` |
| Zwolle Bicycle Counts | JSON | `services1.arcgis.com/.../Bicycle_counts_.../FeatureServer/1/query?...&f=json` |
| Traffic Lights (NL) | GeoJSON | `verkeerslichtenviewer.nl/api/v1/export?format=geojson` |
| Traffic Speed (NL) | DATEX II XML | `opendata.ndw.nu/trafficspeed.xml.gz` |
| EV Charging (NL) | GeoJSON | `opendata.ndw.nu/charging_point_locations.geojson.gz` |
| BAG Buildings | GeoJSON | `api.pdok.nl/kadaster/bag/ogc/v2/collections/pand/items?bbox=...&f=json` |
| BAG Buildings (WFS) | GeoJSON | `service.pdok.nl/lv/bag/wfs/v2_0?...&typeName=bag:pand&outputFormat=json` |
| BGT Topography | JSON | `api.pdok.nl/lv/bgt/ogc/v1/collections/{type}/items?bbox=...&f=json` |
| Geocoding | JSON | `api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=...` |
| Background Map | PNG Tiles | `service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png` |
| CBS Neighborhoods | GeoJSON | `api.pdok.nl/cbs/wijken-en-buurten-2024/ogc/v1/collections/buurten/items?...` |
| CBS Statistics | JSON | `datasets.cbs.nl/odata/v1/CBS/86165NED/Observations?$filter=...` |
| Aerial Photo | PNG (WMS) | `service.pdok.nl/hwh/luchtfotorgb/wms/v1_0?...` |
| OSM Data | JSON | `overpass-api.de/api/interpreter` (POST with QL query) |
| Cadastral Parcels | JSON | `api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/collections/.../items?bbox=...` |
| Elevation (AHN) | GeoTIFF | `service.pdok.nl/rws/ahn/wcs/v1_0?...` |

## APIs Requiring Registration (Free)

| Data Source | Key Required | Registration |
|-------------|-------------|-------------|
| Kadaster BAG Individual | API Key | https://www.kadaster.nl |
| PostNL Locations | API Key | https://developer.postnl.nl |
| DHL Location Finder | API Key | https://developer.dhl.com |

---

## Zwolle-Specific Coordinates Reference

| Reference | Value |
|-----------|-------|
| Center (WGS84) | lat: 52.5126, lon: 6.0944 |
| Bounding Box (WGS84) | 52.48, 6.05, 52.55, 6.15 |
| Center (RD/EPSG:28992) | x: ~200500, y: ~501500 |
| Bounding Box (RD) | 196000, 497000, 205000, 506000 |
| CBS Municipality Code | GM0193 |
| CBS Wijk Prefix | WK0193 |
| CBS Buurt Prefix | BU0193 |
