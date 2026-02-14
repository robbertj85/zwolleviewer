# Zwolle Data Viewer

An interactive open data viewer for the municipality of Zwolle, displaying 107+ data layers on a real-time map. Built with Next.js, deck.gl, and MapLibre GL.

**Live:** [zwolleviewer.vercel.app](https://zwolleviewer.vercel.app)

## Features

- **107+ data layers** across 6 categories: traffic & transport, buildings & addresses, public space, boundaries & areas, environment & climate, and facilities
- **Real-time NDW traffic data** with DATEX II XML parsing — incidents, traffic speeds, MSI matrix signs, bridge openings, emission zones, truck parking, and more
- **Visual MSI matrix signs** — SVG-rendered Dutch highway matrix sign icons showing per-lane speed limits, lane closures, and open/blank states
- **Traffic speed color gradient** — measurement points colored from red (congested) through orange/yellow to green (free flow)
- **8 basemaps** — dark, light, voyager, OpenStreetMap, PDOK satellite (standard + HR), BRT topographic, and BRT dark
- **API Gateway** — RESTful API with OpenAPI 3.0 spec for programmatic access to all layers
- **Interactive map** — hover tooltips, click-to-inspect feature properties, zoom/pan/rotate

## Data Sources

| Source | Layers | Description |
|--------|--------|-------------|
| Gemeente Zwolle GIS | ~40 | Municipal open data (trees, parking, construction, etc.) |
| PDOK | ~25 | Dutch national geo-data (BAG, cadastral, topographic) |
| NDW (DATEX II) | ~10 | Real-time traffic data (speeds, incidents, MSI, DRIPs) |
| CBS | ~5 | Demographics and neighborhood statistics |
| Geoportaal Overijssel | ~5 | Provincial data (roads, waterways) |
| ProRail | 3 | Rail infrastructure (stations, tracks, crossings) |
| Enexis | 4 | Energy infrastructure (gas, electricity) |
| OSM / Other | ~10 | OpenStreetMap, OCPI charging points, package pickup points |

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- **Map:** deck.gl 9 + MapLibre GL JS
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **XML Parsing:** fast-xml-parser + custom regex parsers for large NDW feeds
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
  app/
    api/
      ndw/[dataset]/    # NDW DATEX II proxy with caching
      ocpi/             # OCPI charging point proxy
      proxy/            # Generic WFS/WMS proxy
      v1/               # REST API gateway (OpenAPI 3.0)
    api-gateway/        # API documentation page
    page.tsx            # Main map page
  components/
    map-view.tsx        # deck.gl + MapLibre GL map rendering
    sidebar.tsx         # Layer toggle sidebar with search
    feature-panel.tsx   # Feature inspection panel
    nav-bar.tsx         # Top navigation
  lib/
    data-sources.ts     # 107+ layer definitions with fetch logic
    ndw-xml.ts          # DATEX II XML parsing (situations, VMS, MSI, speed)
    msi-utils.ts        # MSI matrix sign SVG icon generation
    use-layers.ts       # Layer state management hook
```

## API

The API Gateway provides programmatic access to all layers:

```
GET /api/v1/layers                  # List all layers
GET /api/v1/layers/{id}             # Get layer GeoJSON
GET /api/v1/categories              # List categories
GET /api/v1/openapi.json            # OpenAPI 3.0 spec
GET /api/ndw/{dataset}              # NDW traffic data
```

Available NDW datasets: `incidents`, `actueel`, `srti`, `brugopeningen`, `emissiezones`, `maxsnelheden`, `drips`, `msi`, `truckparking`, `trafficspeed`

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0).

Copyright (c) 2026 Transport Beat BV
