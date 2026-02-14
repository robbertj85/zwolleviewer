export type LayerCategory =
  | "verkeer"
  | "gebouwen"
  | "openbare-ruimte"
  | "grenzen"
  | "milieu"
  | "voorzieningen";

export interface DataSource {
  id: string;
  name: string;
  description: string;
  source: string;
  endpoint: string;
  category: LayerCategory;
  color: [number, number, number, number];
  icon: string;
  fetchData: () => Promise<GeoJSON.FeatureCollection>;
  visible: boolean;
  loading: boolean;
  pointType?: "icon" | "circle" | "scatterplot";
  radius?: number;
  lineWidth?: number;
  filled?: boolean;
  stroked?: boolean;
  extruded?: boolean;
  getElevation?: number;
}

const ZWOLLE_BBOX = "6.04,52.48,6.16,52.55";
const ZWOLLE_BBOX_WFS =
  "52.48,6.04,52.55,6.16,urn:ogc:def:crs:EPSG::4326";

const ZWOLLE_GIS = "https://gisservices.zwolle.nl/ArcGIS/rest/services";

async function fetchGeoJSON(url: string): Promise<GeoJSON.FeatureCollection> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fout bij laden: ${res.status}`);
  const data = await res.json();
  if (data.type === "FeatureCollection") return data;
  if (data.features) return data as GeoJSON.FeatureCollection;
  return { type: "FeatureCollection", features: [] };
}

async function fetchZwolleGIS(
  service: string,
  layerId: number,
  serverType: "FeatureServer" | "MapServer" = "FeatureServer",
  maxFeatures = 2000
): Promise<GeoJSON.FeatureCollection> {
  const url = `${ZWOLLE_GIS}/${service}/${serverType}/${layerId}/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultRecordCount=${maxFeatures}`;
  return fetchGeoJSON(url);
}

async function fetchPDOKWFS(
  typeName: string,
  serviceUrl: string,
  maxFeatures = 1000
): Promise<GeoJSON.FeatureCollection> {
  const url = `${serviceUrl}?service=WFS&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=json&count=${maxFeatures}&srsName=EPSG:4326&bbox=${ZWOLLE_BBOX_WFS}`;
  return fetchGeoJSON(url);
}

async function fetchPDOKOGCAPI(
  baseUrl: string,
  collection: string,
  limit = 1000
): Promise<GeoJSON.FeatureCollection> {
  const url = `${baseUrl}/collections/${collection}/items?limit=${limit}&bbox=${ZWOLLE_BBOX}&f=json`;
  return fetchGeoJSON(url);
}

async function fetchOverijsselWFS(
  workspace: string,
  typeName: string,
  maxFeatures = 1000
): Promise<GeoJSON.FeatureCollection> {
  const url = `https://services.geodataoverijssel.nl/geoserver/${workspace}/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=json&count=${maxFeatures}&srsName=EPSG:4326&bbox=${ZWOLLE_BBOX_WFS}`;
  return fetchGeoJSON(url);
}

async function fetchOverpassGeoJSON(
  query: string
): Promise<GeoJSON.FeatureCollection> {
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  if (!res.ok) throw new Error(`Overpass fout: ${res.status}`);
  const data = await res.json();
  const features: GeoJSON.Feature[] = [];
  for (const el of data.elements || []) {
    if (el.type === "node" && el.lat && el.lon) {
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [el.lon, el.lat] },
        properties: el.tags || {},
      });
    }
  }
  return { type: "FeatureCollection", features };
}

export const CATEGORIES: Record<
  LayerCategory,
  { label: string; icon: string }
> = {
  verkeer: { label: "Verkeer & Transport", icon: "TrafficCone" },
  gebouwen: { label: "Gebouwen & Adressen", icon: "Building2" },
  "openbare-ruimte": { label: "Openbare Ruimte", icon: "TreePine" },
  grenzen: { label: "Grenzen & Gebieden", icon: "MapPin" },
  milieu: { label: "Milieu & Klimaat", icon: "Leaf" },
  voorzieningen: { label: "Voorzieningen", icon: "Store" },
};

export const DATA_SOURCES: DataSource[] = [
  // ═══════════════════════════════════════
  // VERKEER & TRANSPORT
  // ═══════════════════════════════════════
  {
    id: "traffic-lights",
    name: "Verkeerslichten (iVRI)",
    endpoint: "verkeerslichtenviewer.nl/api/v1/export?format=geojson",
    source: "verkeerslichtenviewer.nl",
    description:
      "Intelligente verkeerslichten uit het UDAP netwerk via verkeerslichtenviewer.nl",
    category: "verkeer",
    color: [255, 80, 80, 200],
    icon: "TrafficCone",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 6,
    fetchData: async () => {
      const res = await fetch(
        "https://verkeerslichtenviewer.nl/api/v1/export?format=geojson"
      );
      const data: GeoJSON.FeatureCollection = await res.json();
      return {
        ...data,
        features: data.features.filter((f) => {
          if (f.geometry.type !== "Point") return false;
          const [lng, lat] = f.geometry.coordinates;
          return lng > 6.04 && lng < 6.16 && lat > 52.48 && lat < 52.55;
        }),
      };
    },
  },
  {
    id: "wegwerkzaamheden",
    name: "Wegwerkzaamheden",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Wegwerkzaamheden/FeatureServer/0",
    source: "Gemeente Zwolle GIS (NDW)",
    description: "Actuele wegwerkzaamheden en omleidingen (NDW data)",
    category: "verkeer",
    color: [255, 120, 0, 200],
    icon: "Construction",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 3,
    fetchData: async () => fetchZwolleGIS("Wegwerkzaamheden", 0),
  },
  {
    id: "wegwerkzaamheden-omleiding",
    name: "Omleidingen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Wegwerkzaamheden/FeatureServer/1",
    source: "Gemeente Zwolle GIS (NDW)",
    description: "Omleidingsroutes bij wegwerkzaamheden",
    category: "verkeer",
    color: [255, 200, 0, 180],
    icon: "ArrowRightLeft",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Wegwerkzaamheden", 1),
  },
  {
    id: "hoofdfietsroutes",
    name: "Hoofdfietsroutes",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Hoofdfietsroutes/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description:
      "Regionale fietsverbindingen en stedelijke verbindingsroutes",
    category: "verkeer",
    color: [50, 200, 255, 200],
    icon: "Bike",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Hoofdfietsroutes", 0),
  },
  {
    id: "strooiroute-fiets",
    name: "Strooiroute Fietspaden",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Strooiroute/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Strooiroutes voor fietspaden in de winter",
    category: "verkeer",
    color: [180, 220, 255, 180],
    icon: "Snowflake",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Strooiroute", 0),
  },
  {
    id: "strooiroute-weg",
    name: "Strooiroute Wegen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Strooiroute/FeatureServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Strooiroutes voor wegen in de winter",
    category: "verkeer",
    color: [140, 180, 255, 180],
    icon: "Snowflake",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Strooiroute", 1),
  },
  {
    id: "parkeerautomaten",
    name: "Parkeerautomaten",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Parkeren/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Locaties van parkeerautomaten",
    category: "verkeer",
    color: [0, 120, 255, 200],
    icon: "ParkingCircle",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () => fetchZwolleGIS("Parkeren", 0),
  },
  {
    id: "parkeer-invaliden",
    name: "Gehandicaptenparkeerplaatsen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Parkeren/FeatureServer/3",
    source: "Gemeente Zwolle GIS",
    description: "Gehandicaptenparkeerplaatsen in Zwolle",
    category: "verkeer",
    color: [0, 80, 220, 200],
    icon: "Accessibility",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () => fetchZwolleGIS("Parkeren", 3),
  },
  {
    id: "parkeer-zones",
    name: "Parkeerzones",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Parkeren/FeatureServer/7",
    source: "Gemeente Zwolle GIS",
    description: "Parkeer reguleringsgebieden",
    category: "verkeer",
    color: [0, 100, 200, 100],
    icon: "ParkingCircle",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Parkeren", 7),
  },
  {
    id: "parkeer-betaald",
    name: "Betaald Parkeren",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Parkeren/FeatureServer/4",
    source: "Gemeente Zwolle GIS",
    description: "Zones met betaald parkeren",
    category: "verkeer",
    color: [60, 60, 200, 100],
    icon: "CreditCard",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Parkeren", 4),
  },
  {
    id: "parkeervakken",
    name: "Parkeervakken",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Parkeervakken/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Individuele parkeervakken op straat",
    category: "verkeer",
    color: [100, 140, 255, 140],
    icon: "ParkingCircle",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Parkeervakken", 0),
  },
  {
    id: "laadpalen",
    name: "Laadpalen (bestaand)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Laadpalen/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Bestaande laadpaallocaties voor elektrische auto's",
    category: "verkeer",
    color: [0, 220, 120, 200],
    icon: "Zap",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () => fetchZwolleGIS("Laadpalen", 0),
  },
  {
    id: "laadpalen-aangevraagd",
    name: "Laadpalen (aangevraagd)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Laadpalen/FeatureServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Aangevraagde laadpaallocaties",
    category: "verkeer",
    color: [0, 180, 100, 150],
    icon: "Zap",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () => fetchZwolleGIS("Laadpalen", 1),
  },

  {
    id: "pakketpunten",
    name: "Pakketpunten",
    endpoint: "pakketpuntenviewer.nl/data/zwolle.geojson",
    source: "pakketpuntenviewer.nl",
    description:
      "Alle pakketpunten in Zwolle (PostNL, DHL, DPD, Amazon, GLS, VintedGo)",
    category: "verkeer",
    color: [255, 160, 0, 220],
    icon: "Store",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 6,
    fetchData: async () => {
      const res = await fetch(
        "https://pakketpuntenviewer.nl/data/zwolle.geojson"
      );
      const data: GeoJSON.FeatureCollection = await res.json();
      return {
        ...data,
        features: data.features.filter(
          (f) => f.geometry.type === "Point"
        ),
      };
    },
  },

  // ═══════════════════════════════════════
  // GEBOUWEN & ADRESSEN
  // ═══════════════════════════════════════
  {
    id: "bag-panden",
    name: "BAG Panden",
    endpoint: "service.pdok.nl/lv/bag/wfs/v2_0",
    source: "PDOK",
    description:
      "Gebouwen uit de Basisregistratie Adressen en Gebouwen (PDOK)",
    category: "gebouwen",
    color: [180, 100, 200, 140],
    icon: "Building2",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchPDOKWFS(
        "bag:pand",
        "https://service.pdok.nl/lv/bag/wfs/v2_0",
        1000
      ),
  },
  {
    id: "bag-zwolle",
    name: "BAG Zwolle (lokaal)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BAG/FeatureServer/6",
    source: "Gemeente Zwolle GIS",
    description: "BAG panden via Zwolle GIS server",
    category: "gebouwen",
    color: [160, 80, 180, 120],
    icon: "Building2",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("BAG", 6, "FeatureServer", 1000),
  },
  {
    id: "energielabels",
    name: "Energielabels",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Energielabels/FeatureServer/0",
    source: "Gemeente Zwolle GIS (EP-online RVO)",
    description: "Energielabels van gebouwen in Zwolle (bron: EP-online RVO)",
    category: "gebouwen",
    color: [255, 200, 50, 180],
    icon: "Gauge",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 3,
    fetchData: async () => fetchZwolleGIS("Energielabels", 0),
  },
  {
    id: "erfgoed-rijksmonumenten",
    name: "Rijksmonumenten",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Erfgoed/MapServer/4",
    source: "Gemeente Zwolle GIS",
    description: "Door het Rijk aangewezen monumenten",
    category: "gebouwen",
    color: [200, 150, 50, 180],
    icon: "Landmark",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchZwolleGIS("Erfgoed", 4, "MapServer"),
  },
  {
    id: "erfgoed-gemeentemonumenten",
    name: "Gemeentelijke Monumenten",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Erfgoed/MapServer/5",
    source: "Gemeente Zwolle GIS",
    description: "Door de gemeente aangewezen monumenten",
    category: "gebouwen",
    color: [180, 130, 40, 160],
    icon: "Landmark",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchZwolleGIS("Erfgoed", 5, "MapServer"),
  },
  {
    id: "beschermd-stadsgezicht",
    name: "Beschermd Stadsgezicht",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Erfgoed/MapServer/6",
    source: "Gemeente Zwolle GIS",
    description: "Beschermd stadsgezicht gebied",
    category: "gebouwen",
    color: [220, 180, 100, 100],
    icon: "Castle",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchZwolleGIS("Erfgoed", 6, "MapServer"),
  },

  // ═══════════════════════════════════════
  // OPENBARE RUIMTE
  // ═══════════════════════════════════════
  {
    id: "bomen",
    name: "Bomen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_groen_wegen/FeatureServer/2",
    source: "Gemeente Zwolle GIS",
    description: "Alle gemeentelijke bomen met soort, hoogte en diameter",
    category: "openbare-ruimte",
    color: [50, 180, 80, 200],
    icon: "TreePine",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 3,
    fetchData: async () =>
      fetchZwolleGIS("BOR_groen_wegen", 2, "FeatureServer"),
  },
  {
    id: "hagen",
    name: "Hagen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_groen_wegen/FeatureServer/10",
    source: "Gemeente Zwolle GIS",
    description: "Hagen in de openbare ruimte",
    category: "openbare-ruimte",
    color: [30, 130, 60, 160],
    icon: "TreePine",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchZwolleGIS("BOR_groen_wegen", 10, "FeatureServer"),
  },
  {
    id: "beplantingen",
    name: "Beplantingen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_groen_wegen/FeatureServer/12",
    source: "Gemeente Zwolle GIS",
    description: "Beplantingen en struiken in de openbare ruimte",
    category: "openbare-ruimte",
    color: [60, 150, 70, 140],
    icon: "Leaf",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () =>
      fetchZwolleGIS("BOR_groen_wegen", 12, "FeatureServer"),
  },
  {
    id: "grassen",
    name: "Grassen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_groen_wegen/FeatureServer/11",
    source: "Gemeente Zwolle GIS",
    description: "Grasvelden en gazons",
    category: "openbare-ruimte",
    color: [120, 200, 80, 120],
    icon: "Leaf",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () =>
      fetchZwolleGIS("BOR_groen_wegen", 11, "FeatureServer"),
  },
  {
    id: "sportvelden",
    name: "Sportvelden",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_groen_wegen/FeatureServer/8",
    source: "Gemeente Zwolle GIS",
    description: "Sportvelden in de gemeente",
    category: "openbare-ruimte",
    color: [80, 200, 120, 140],
    icon: "Dumbbell",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchZwolleGIS("BOR_groen_wegen", 8, "FeatureServer"),
  },
  {
    id: "water-bor",
    name: "Water (BOR)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_groen_wegen/FeatureServer/14",
    source: "Gemeente Zwolle GIS",
    description: "Waterpartijen in de openbare ruimte",
    category: "openbare-ruimte",
    color: [50, 130, 220, 140],
    icon: "Waves",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () =>
      fetchZwolleGIS("BOR_groen_wegen", 14, "FeatureServer"),
  },
  {
    id: "afvalbakken",
    name: "Afvalbakken",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_groen_wegen/FeatureServer/3",
    source: "Gemeente Zwolle GIS",
    description: "Openbare afvalbakken",
    category: "openbare-ruimte",
    color: [160, 160, 160, 200],
    icon: "Trash2",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 3,
    fetchData: async () =>
      fetchZwolleGIS("BOR_groen_wegen", 3, "FeatureServer"),
  },
  {
    id: "kunstwerken",
    name: "Artistieke Kunstwerken",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Artistiekekunst/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Kunstobjecten in de openbare ruimte",
    category: "openbare-ruimte",
    color: [220, 120, 255, 200],
    icon: "Palette",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 6,
    fetchData: async () =>
      fetchZwolleGIS("Artistiekekunst", 0),
  },
  {
    id: "japanse-duizendknoop",
    name: "Japanse Duizendknoop",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Japanse_duizendknoop_openbaar/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Locaties van Japanse duizendknoop (invasieve plant)",
    category: "openbare-ruimte",
    color: [200, 50, 50, 200],
    icon: "Bug",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () =>
      fetchZwolleGIS("Japanse_duizendknoop_openbaar", 0),
  },

  // ═══════════════════════════════════════
  // GRENZEN & GEBIEDEN
  // ═══════════════════════════════════════
  {
    id: "gemeentegrens",
    name: "Gemeentegrens",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Grenzen/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Gemeentegrens van Zwolle",
    category: "grenzen",
    color: [255, 255, 255, 200],
    icon: "MapPin",
    visible: true,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 3,
    fetchData: async () => fetchZwolleGIS("Grenzen", 0),
  },
  {
    id: "stadsdelen",
    name: "Stadsdelen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Grenzen/FeatureServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Stadsdelen van Zwolle",
    category: "grenzen",
    color: [255, 200, 100, 100],
    icon: "Map",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Grenzen", 1),
  },
  {
    id: "wijken",
    name: "Wijken",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Grenzen/FeatureServer/2",
    source: "Gemeente Zwolle GIS",
    description: "Wijkgrenzen van Zwolle",
    category: "grenzen",
    color: [255, 180, 0, 100],
    icon: "Map",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Grenzen", 2),
  },
  {
    id: "buurten",
    name: "Buurten",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Grenzen/FeatureServer/3",
    source: "Gemeente Zwolle GIS",
    description: "Buurtgrenzen van Zwolle",
    category: "grenzen",
    color: [200, 160, 0, 80],
    icon: "LayoutGrid",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Grenzen", 3),
  },
  {
    id: "bebouwde-kom-bos",
    name: "Bebouwde Kom (Boswet)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Grenzen/FeatureServer/4",
    source: "Gemeente Zwolle GIS",
    description: "Grens bebouwde kom o.g.v. de Boswet",
    category: "grenzen",
    color: [100, 200, 100, 80],
    icon: "TreePine",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Grenzen", 4),
  },
  {
    id: "bebouwde-kom-verkeer",
    name: "Bebouwde Kom (Verkeer)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Grenzen/FeatureServer/5",
    source: "Gemeente Zwolle GIS",
    description: "Grens bebouwde kom o.g.v. de Wegenverkeerswet",
    category: "grenzen",
    color: [200, 100, 100, 80],
    icon: "TrafficCone",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Grenzen", 5),
  },
  {
    id: "archeologie",
    name: "Archeologische Waarderingskaart",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Erfgoed/MapServer/8",
    source: "Gemeente Zwolle GIS",
    description: "Archeologische waarderings- en verwachtingsgebieden",
    category: "grenzen",
    color: [180, 120, 60, 100],
    icon: "Search",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchZwolleGIS("Erfgoed", 8, "MapServer"),
  },

  // ═══════════════════════════════════════
  // MILIEU & KLIMAAT
  // ═══════════════════════════════════════
  {
    id: "klimaat-koelteplekken",
    name: "Koele Verblijfsplekken",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Klimaat/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Aangename koele verblijfsplekken (potentieel)",
    category: "milieu",
    color: [80, 180, 220, 120],
    icon: "Thermometer",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () => fetchZwolleGIS("Klimaat", 0),
  },
  {
    id: "klimaat-afstand-koelte",
    name: "Afstand tot Koelteplek",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Klimaat/FeatureServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Afstand tot dichtstbijzijnde koelteplek",
    category: "milieu",
    color: [255, 140, 60, 100],
    icon: "Thermometer",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () => fetchZwolleGIS("Klimaat", 1),
  },
  {
    id: "milieu-bescherming",
    name: "Milieubeschermingsgebieden",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Milieu/MapServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Beschermde milieugebieden",
    category: "milieu",
    color: [50, 200, 100, 100],
    icon: "ShieldCheck",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchZwolleGIS("Milieu", 1, "MapServer"),
  },
  {
    id: "bgt-waterdeel",
    name: "BGT Waterdeel",
    endpoint: "api.pdok.nl/lv/bgt/ogc/v1/collections/waterdeel/items",
    source: "PDOK (BGT)",
    description: "Water uit de Basisregistratie Grootschalige Topografie",
    category: "milieu",
    color: [50, 130, 220, 140],
    icon: "Waves",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () =>
      fetchPDOKOGCAPI(
        "https://api.pdok.nl/lv/bgt/ogc/v1",
        "waterdeel",
        500
      ),
  },

  // ═══════════════════════════════════════
  // VOORZIENINGEN
  // ═══════════════════════════════════════
  {
    id: "horeca",
    name: "Horeca",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Horeca_openbaar/FeatureServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Horeca vergunningen en terrassen",
    category: "voorzieningen",
    color: [255, 140, 60, 200],
    icon: "UtensilsCrossed",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () =>
      fetchZwolleGIS("Horeca_openbaar", 1),
  },
  {
    id: "horeca-terrassen",
    name: "Terrassen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Horeca_openbaar/FeatureServer/2",
    source: "Gemeente Zwolle GIS",
    description: "Horeca terrassen (vlakken)",
    category: "voorzieningen",
    color: [255, 160, 80, 120],
    icon: "UtensilsCrossed",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchZwolleGIS("Horeca_openbaar", 2),
  },
  {
    id: "wijkservicepunten",
    name: "Wijkservicepunten",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Wijkservicepunten/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Wijkservicepunten en buurthuizen",
    category: "voorzieningen",
    color: [100, 180, 255, 200],
    icon: "MapPin",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 7,
    fetchData: async () =>
      fetchZwolleGIS("Wijkservicepunten", 0),
  },
  {
    id: "riolering-putten",
    name: "Riolering Putten",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Riolering_openbaar/FeatureServer/8",
    source: "Gemeente Zwolle GIS",
    description: "Rioolputten in Zwolle",
    category: "voorzieningen",
    color: [100, 100, 100, 180],
    icon: "CircleDot",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 3,
    fetchData: async () =>
      fetchZwolleGIS("Riolering_openbaar", 8),
  },
  {
    id: "riolering-strengen",
    name: "Riolering Leidingen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Riolering_openbaar/FeatureServer/9",
    source: "Gemeente Zwolle GIS",
    description: "Rioolstrengen / leidingen",
    category: "voorzieningen",
    color: [80, 80, 80, 160],
    icon: "Route",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchZwolleGIS("Riolering_openbaar", 9),
  },
  {
    id: "eetbaar-groen",
    name: "Eetbaar Groen / Stadslandbouw",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Eetbaar_groen_Stadslandbouw/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Locaties voor stadslandbouw en eetbaar groen",
    category: "voorzieningen",
    color: [80, 200, 80, 180],
    icon: "Apple",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 6,
    fetchData: async () =>
      fetchZwolleGIS("Eetbaar_groen_Stadslandbouw", 0),
  },
  {
    id: "carbid-locaties",
    name: "Carbidschieten Locaties",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Carbidschietlocaties/MapServer/2",
    source: "Gemeente Zwolle GIS",
    description: "Toegestane locaties voor carbidschieten",
    category: "voorzieningen",
    color: [255, 50, 50, 180],
    icon: "Flame",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchZwolleGIS("Carbidschietlocaties", 2, "MapServer"),
  },
  {
    id: "standplaatsen",
    name: "Standplaatsen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Standplaatsenkaart/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Markt- en standplaatsen",
    category: "voorzieningen",
    color: [200, 120, 255, 180],
    icon: "Store",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchZwolleGIS("Standplaatsenkaart", 0, "MapServer"),
  },
  {
    id: "wkpb",
    name: "WKPB Beperkingen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/WKPB/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description:
      "Publiekrechtelijke beperkingen op onroerende zaken",
    category: "voorzieningen",
    color: [200, 50, 120, 120],
    icon: "ShieldAlert",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("WKPB", 0),
  },

  // ═══════════════════════════════════════
  // NEW: ZWOLLE GIS — EXTRA SERVICES
  // ═══════════════════════════════════════

  // --- Bodem (Soil) ---
  {
    id: "bodem-verontreinigingen",
    name: "Bodemverontreinigingen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Bodem/MapServer/2",
    source: "Gemeente Zwolle GIS",
    description: "Locaties met bodemverontreiniging (grond en grondwater)",
    category: "milieu",
    color: [180, 80, 40, 140],
    icon: "Bug",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Bodem", 2, "MapServer"),
  },
  {
    id: "bodem-sanering",
    name: "Bodemsaneringsmaatregelen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Bodem/MapServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Saneringsmaatregelen bij bodemverontreiniging",
    category: "milieu",
    color: [140, 100, 40, 120],
    icon: "ShieldCheck",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Bodem", 1, "MapServer"),
  },
  {
    id: "bodem-locaties",
    name: "Bodemonderzoek Locaties",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Bodem/MapServer/3",
    source: "Gemeente Zwolle GIS",
    description: "Locaties van bodemonderzoeken",
    category: "milieu",
    color: [160, 120, 60, 100],
    icon: "Search",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Bodem", 3, "MapServer"),
  },

  // --- Groenekaart (Notable Trees) ---
  {
    id: "bijzondere-bomen-particulier",
    name: "Bijzondere Bomen (Particulier)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Groenekaart/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Bijzondere en monumentale bomen in particulier bezit",
    category: "openbare-ruimte",
    color: [30, 160, 50, 200],
    icon: "TreePine",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () => fetchZwolleGIS("Groenekaart", 0, "MapServer"),
  },
  {
    id: "bijzondere-bomen-gemeentelijk",
    name: "Bijzondere Bomen (Gemeentelijk)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Groenekaart/MapServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Bijzondere en monumentale gemeentelijke bomen",
    category: "openbare-ruimte",
    color: [20, 140, 40, 200],
    icon: "TreePine",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () => fetchZwolleGIS("Groenekaart", 1, "MapServer"),
  },

  // --- Kunstwerken civiel (Civil Engineering) ---
  {
    id: "civiele-kunstwerken",
    name: "Civiele Kunstwerken",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Kunstwerken/MapServer/2",
    source: "Gemeente Zwolle GIS",
    description: "Bruggen, tunnels, duikers, viaducten en andere civiele kunstwerken",
    category: "voorzieningen",
    color: [140, 140, 180, 160],
    icon: "Construction",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Kunstwerken", 2, "MapServer"),
  },

  // --- Lichtmasten (Street Lights) ---
  {
    id: "lichtmasten",
    name: "Lichtmasten",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Lichtmasten/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Gemeentelijke straatverlichting met mast- en lamptype",
    category: "openbare-ruimte",
    color: [255, 230, 100, 180],
    icon: "Lightbulb",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 2,
    fetchData: async () => fetchZwolleGIS("Lichtmasten", 0, "MapServer", 2000),
  },

  // --- Regenbui (Flood Modeling) ---
  {
    id: "regenbui-stroombanen",
    name: "Regenbui Stroombanen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Regenbui/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Waterafstroomroutes bij zware regenbuien",
    category: "milieu",
    color: [40, 100, 220, 160],
    icon: "Droplets",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Regenbui", 0, "MapServer"),
  },
  {
    id: "regenbui-t100-wegen",
    name: "Begaanbaarheid T100 Bui",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Regenbui/MapServer/4",
    source: "Gemeente Zwolle GIS",
    description: "Begaanbaarheid wegen bij T100 bui (67mm/uur)",
    category: "milieu",
    color: [60, 60, 200, 140],
    icon: "Droplets",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Regenbui", 4, "MapServer"),
  },

  // --- Geluidsbelastingkaart (Noise Map) ---
  {
    id: "geluid-wegverkeer",
    name: "Geluid Wegverkeer",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Geluidsbelastingkaart/MapServer/8",
    source: "Gemeente Zwolle GIS",
    description: "Geluidsbelasting door wegverkeer (Lden in dB)",
    category: "milieu",
    color: [255, 100, 100, 100],
    icon: "Volume2",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () =>
      fetchZwolleGIS("Geluidsbelastingkaart", 8, "MapServer"),
  },
  {
    id: "geluid-treinverkeer",
    name: "Geluid Treinverkeer",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Geluidsbelastingkaart/MapServer/5",
    source: "Gemeente Zwolle GIS",
    description: "Geluidsbelasting door treinverkeer (Lden in dB)",
    category: "milieu",
    color: [200, 80, 200, 100],
    icon: "Volume2",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () =>
      fetchZwolleGIS("Geluidsbelastingkaart", 5, "MapServer"),
  },
  {
    id: "geluid-industrie",
    name: "Geluid Industrie",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Geluidsbelastingkaart/MapServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Geluidsbelasting door industrielawaai (Lden in dB)",
    category: "milieu",
    color: [200, 160, 60, 100],
    icon: "Volume2",
    visible: false,
    loading: false,
    filled: true,
    stroked: false,
    fetchData: async () =>
      fetchZwolleGIS("Geluidsbelastingkaart", 1, "MapServer"),
  },

  // --- SWT (Social Teams) ---
  {
    id: "swt-locaties",
    name: "Sociaal Wijkteam Locaties",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/SWT/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Locaties van sociale wijkteams",
    category: "voorzieningen",
    color: [100, 200, 180, 200],
    icon: "Users",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 7,
    fetchData: async () => fetchZwolleGIS("SWT", 0, "MapServer"),
  },
  {
    id: "swt-gebieden",
    name: "Sociaal Wijkteam Gebieden",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/SWT/MapServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Werkgebieden van sociale wijkteams",
    category: "grenzen",
    color: [100, 200, 180, 60],
    icon: "Users",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("SWT", 1, "MapServer"),
  },

  // --- Toegankelijkheid ---
  {
    id: "toegankelijkheid",
    name: "Toegankelijkheidsmeldingen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Toegankelijkheid_publiek/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Meldingen over toegankelijkheidsproblemen door burgers",
    category: "voorzieningen",
    color: [255, 180, 0, 200],
    icon: "Accessibility",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () =>
      fetchZwolleGIS("Toegankelijkheid_publiek", 0, "MapServer"),
  },

  // --- VP (Municipal Projects) ---
  {
    id: "gemeentelijke-projecten",
    name: "Gemeentelijke Projecten",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/VP/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Lopende en geplande gemeentelijke projecten",
    category: "voorzieningen",
    color: [120, 100, 255, 180],
    icon: "Flag",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 6,
    fetchData: async () => fetchZwolleGIS("VP", 0, "MapServer"),
  },

  // --- Wolk (Flood Risk) ---
  {
    id: "wolk-stroombanen",
    name: "Wateroverlast Stroombanen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Wolk/MapServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Potentiële wateraccumulatie stroombanen bij pluviale overlast",
    category: "milieu",
    color: [30, 80, 200, 140],
    icon: "Droplets",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () => fetchZwolleGIS("Wolk", 1, "MapServer"),
  },

  // --- BOR Kap & Herplant ---
  {
    id: "bor-herplant",
    name: "Herplant Bomen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_kap_herplant_openbaar/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Herplantlocaties voor gekapte bomen",
    category: "openbare-ruimte",
    color: [60, 200, 60, 180],
    icon: "TreePine",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 4,
    fetchData: async () =>
      fetchZwolleGIS("BOR_kap_herplant_openbaar", 0, "MapServer"),
  },
  {
    id: "bor-kap",
    name: "Kap Uitvoering",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BOR_kap_herplant_openbaar/MapServer/1",
    source: "Gemeente Zwolle GIS",
    description: "Locaties waar bomen gekapt worden",
    category: "openbare-ruimte",
    color: [200, 60, 60, 180],
    icon: "TreePine",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 4,
    fetchData: async () =>
      fetchZwolleGIS("BOR_kap_herplant_openbaar", 1, "MapServer"),
  },

  // --- Wildplukkaart ---
  {
    id: "wildplukkaart",
    name: "Wildplukkaart Bomen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Eetbaar_groen_Wildplukkaart/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Bomen geschikt voor wildplukken (noten, fruit, etc.)",
    category: "openbare-ruimte",
    color: [180, 120, 40, 200],
    icon: "Apple",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 4,
    fetchData: async () => {
      const data = await fetchZwolleGIS("Eetbaar_groen_Wildplukkaart", 0, "MapServer");
      return {
        ...data,
        features: data.features
          .map((f) => {
            if (f.geometry) return f;
            const lng = parseFloat(String(f.properties?.X_WGS84));
            const lat = parseFloat(String(f.properties?.Y_WGS84));
            if (isNaN(lng) || isNaN(lat)) return null;
            return { ...f, geometry: { type: "Point" as const, coordinates: [lng, lat] } };
          })
          .filter((f): f is GeoJSON.Feature => f !== null),
      };
    },
  },

  // --- Hessenpoort ---
  {
    id: "hessenpoort-kavels",
    name: "Hessenpoort Kavels",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Hessenpoort/MapServer/3",
    source: "Gemeente Zwolle GIS",
    description: "Beschikbare bedrijfskavels op Hessenpoort",
    category: "voorzieningen",
    color: [100, 120, 200, 120],
    icon: "Store",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () => fetchZwolleGIS("Hessenpoort", 3, "MapServer"),
  },

  // ═══════════════════════════════════════
  // NEW: PDOK / CBS NATIONAL DATA
  // ═══════════════════════════════════════

  // --- CBS Wijken en Buurten (Demographics) ---
  {
    id: "cbs-buurten",
    name: "CBS Buurten (Demografie)",
    endpoint: "service.pdok.nl/cbs/wijkenbuurten/2023/wfs/v1_0",
    source: "PDOK / CBS",
    description:
      "Buurten met demografische gegevens (bevolking, inkomen, woningen, afstanden)",
    category: "grenzen",
    color: [100, 160, 255, 80],
    icon: "LayoutGrid",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchPDOKWFS(
        "wijkenbuurten:buurten",
        "https://service.pdok.nl/cbs/wijkenbuurten/2023/wfs/v1_0",
        200
      ),
  },

  // --- ProRail Spoorwegen ---
  {
    id: "treinstations",
    name: "Treinstations",
    endpoint: "service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
    source: "PDOK / ProRail",
    description: "Treinstations in en rond Zwolle",
    category: "verkeer",
    color: [255, 220, 0, 220],
    icon: "TrainFront",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 8,
    fetchData: async () =>
      fetchPDOKWFS(
        "spoorwegen:station",
        "https://service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
        50
      ),
  },
  {
    id: "spooras",
    name: "Spoorlijnen",
    endpoint: "service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
    source: "PDOK / ProRail",
    description: "Spooraslijnen (treinrails)",
    category: "verkeer",
    color: [200, 200, 0, 160],
    icon: "TrainFront",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchPDOKWFS(
        "spoorwegen:spooras",
        "https://service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
        500
      ),
  },
  {
    id: "overwegen",
    name: "Overwegen",
    endpoint: "service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
    source: "PDOK / ProRail",
    description: "Spoorwegovergangen (gelijkvloerse kruisingen)",
    category: "verkeer",
    color: [255, 60, 60, 200],
    icon: "TrainFront",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () =>
      fetchPDOKWFS(
        "spoorwegen:overweg",
        "https://service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
        100
      ),
  },

  // --- NWB Wegenbestand ---
  {
    id: "nwb-wegen",
    name: "NWB Wegenbestand",
    endpoint: "service.pdok.nl/rws/nationaal-wegenbestand-wegen/wfs/v1_0",
    source: "PDOK / Rijkswaterstaat",
    description: "Nationaal Wegenbestand - wegvakken met straatnamen",
    category: "verkeer",
    color: [180, 180, 180, 100],
    icon: "Route",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchPDOKWFS(
        "nwbwegen:wegvakken",
        "https://service.pdok.nl/rws/nationaal-wegenbestand-wegen/wfs/v1_0",
        1000
      ),
  },

  // --- Natura 2000 ---
  {
    id: "natura2000",
    name: "Natura 2000 Gebieden",
    endpoint: "service.pdok.nl/rvo/natura2000/wfs/v1_0",
    source: "PDOK / RVO",
    description: "Natura 2000 beschermde natuurgebieden",
    category: "milieu",
    color: [30, 180, 60, 80],
    icon: "Leaf",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchPDOKWFS(
        "natura2000:natura2000",
        "https://service.pdok.nl/rvo/natura2000/wfs/v1_0",
        50
      ),
  },

  // ═══════════════════════════════════════
  // NEW: GEOPORTAAL OVERIJSSEL
  // ═══════════════════════════════════════
  {
    id: "ov-fietsnetwerk",
    name: "Hartlijnen Wegen (NWB Overijssel)",
    endpoint: "services.geodataoverijssel.nl/geoserver/B22_wegen/wfs",
    source: "Geoportaal Overijssel",
    description: "Hartlijnen wegennetwerk NWB in Overijssel",
    category: "verkeer",
    color: [0, 200, 200, 140],
    icon: "Route",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchOverijsselWFS(
        "B22_wegen",
        "B22_wegen:B2_Hartlijnen_wegen_NWB",
        500
      ),
  },
  {
    id: "ov-gastankstations",
    name: "Gas/Groengas Tankstations",
    endpoint: "services.geodataoverijssel.nl/geoserver/B42_energie/wfs",
    source: "Geoportaal Overijssel",
    description: "Aardgas en groengas tankstations in Overijssel",
    category: "verkeer",
    color: [0, 200, 80, 200],
    icon: "Gauge",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 6,
    fetchData: async () =>
      fetchOverijsselWFS(
        "B42_energie",
        "B42_energie:B4_aardgas_en_groengas_tankstations_in_Overijssel",
        100
      ),
  },
  {
    id: "ov-vaarwegen",
    name: "Provinciale Vaarwegen",
    endpoint: "services.geodataoverijssel.nl/geoserver/B23_waterwegen/wfs",
    source: "Geoportaal Overijssel",
    description: "Vaarroutes van provinciale vaarwegen",
    category: "verkeer",
    color: [40, 120, 200, 160],
    icon: "Ship",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchOverijsselWFS(
        "B23_waterwegen",
        "B23_waterwegen:B23_Vaarwegen_beroepsvaart",
        200
      ),
  },

  // ═══════════════════════════════════════
  // NEW: OPENSTREETMAP (OVERPASS)
  // ═══════════════════════════════════════
  {
    id: "osm-aed",
    name: "AED Defibrillatoren",
    endpoint: "overpass-api.de/api/interpreter",
    source: "OpenStreetMap",
    description: "AED defibrillatoren in Zwolle (via OpenStreetMap)",
    category: "voorzieningen",
    color: [255, 50, 50, 220],
    icon: "HeartPulse",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 7,
    fetchData: async () =>
      fetchOverpassGeoJSON(
        '[out:json][timeout:25];area["name"="Zwolle"]["admin_level"="8"]->.searchArea;node["emergency"="defibrillator"](area.searchArea);out body;'
      ),
  },
  {
    id: "osm-toiletten",
    name: "Openbare Toiletten",
    endpoint: "overpass-api.de/api/interpreter",
    source: "OpenStreetMap",
    description: "Openbare toiletten in Zwolle (via OpenStreetMap)",
    category: "voorzieningen",
    color: [100, 140, 220, 200],
    icon: "CircleDot",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () =>
      fetchOverpassGeoJSON(
        '[out:json][timeout:25];area["name"="Zwolle"]["admin_level"="8"]->.searchArea;node["amenity"="toilets"](area.searchArea);out body;'
      ),
  },
  {
    id: "osm-drinkwater",
    name: "Drinkwaterpunten",
    endpoint: "overpass-api.de/api/interpreter",
    source: "OpenStreetMap",
    description: "Openbare drinkwaterpunten in Zwolle",
    category: "voorzieningen",
    color: [40, 160, 220, 200],
    icon: "GlassWater",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 6,
    fetchData: async () =>
      fetchOverpassGeoJSON(
        '[out:json][timeout:25];area["name"="Zwolle"]["admin_level"="8"]->.searchArea;node["amenity"="drinking_water"](area.searchArea);out body;'
      ),
  },
  {
    id: "osm-speeltuinen",
    name: "Speeltuinen",
    endpoint: "overpass-api.de/api/interpreter",
    source: "OpenStreetMap",
    description: "Speeltuinen en speelplaatsen in Zwolle",
    category: "voorzieningen",
    color: [255, 160, 220, 200],
    icon: "Dumbbell",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 4,
    fetchData: async () =>
      fetchOverpassGeoJSON(
        '[out:json][timeout:25];area["name"="Zwolle"]["admin_level"="8"]->.searchArea;node["leisure"="playground"](area.searchArea);out body;'
      ),
  },
  {
    id: "osm-scholen",
    name: "Scholen",
    endpoint: "overpass-api.de/api/interpreter",
    source: "OpenStreetMap",
    description: "Scholen in Zwolle (basis, voortgezet, MBO, HBO)",
    category: "voorzieningen",
    color: [100, 100, 255, 200],
    icon: "GraduationCap",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () =>
      fetchOverpassGeoJSON(
        '[out:json][timeout:25];area["name"="Zwolle"]["admin_level"="8"]->.searchArea;node["amenity"="school"](area.searchArea);out body;'
      ),
  },
  {
    id: "osm-zorg",
    name: "Zorgvoorzieningen",
    endpoint: "overpass-api.de/api/interpreter",
    source: "OpenStreetMap",
    description:
      "Ziekenhuizen, klinieken, huisartsen, apotheken en tandartsen",
    category: "voorzieningen",
    color: [255, 100, 100, 200],
    icon: "HeartPulse",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () =>
      fetchOverpassGeoJSON(
        '[out:json][timeout:25];area["name"="Zwolle"]["admin_level"="8"]->.searchArea;node["amenity"~"hospital|clinic|doctors|pharmacy|dentist"](area.searchArea);out body;'
      ),
  },
  {
    id: "osm-supermarkten",
    name: "Supermarkten",
    endpoint: "overpass-api.de/api/interpreter",
    source: "OpenStreetMap",
    description: "Supermarkten in Zwolle",
    category: "voorzieningen",
    color: [0, 180, 120, 200],
    icon: "ShoppingCart",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 6,
    fetchData: async () =>
      fetchOverpassGeoJSON(
        '[out:json][timeout:25];area["name"="Zwolle"]["admin_level"="8"]->.searchArea;node["shop"="supermarket"](area.searchArea);out body;'
      ),
  },

  // ═══════════════════════════════════════
  // NEW: ENEXIS ENERGY GRID
  // ═══════════════════════════════════════
  {
    id: "enexis-gas-hoofdleiding",
    name: "Enexis Gas Hoofdleidingen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer/3",
    source: "Gemeente Zwolle GIS / Enexis",
    description: "Gasleidingen (hoofdleidingen) Enexis netwerk",
    category: "voorzieningen",
    color: [255, 200, 0, 140],
    icon: "Flame",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchZwolleGIS("Energie_in_Beeld_Enexis_Assets", 3, "MapServer"),
  },
  {
    id: "enexis-elektra-kabel",
    name: "Enexis Elektriciteitskabels",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer/7",
    source: "Gemeente Zwolle GIS / Enexis",
    description: "Elektriciteitskabels Enexis netwerk",
    category: "voorzieningen",
    color: [255, 80, 0, 140],
    icon: "Zap",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchZwolleGIS("Energie_in_Beeld_Enexis_Assets", 7, "MapServer"),
  },
  {
    id: "enexis-gas-stations",
    name: "Enexis Gasstations",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer/1",
    source: "Gemeente Zwolle GIS / Enexis",
    description: "Technische gebouwen gas (hoge druk)",
    category: "voorzieningen",
    color: [255, 220, 60, 200],
    icon: "Flame",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () =>
      fetchZwolleGIS("Energie_in_Beeld_Enexis_Assets", 1, "MapServer"),
  },
  {
    id: "enexis-elektra-stations",
    name: "Enexis Elektrastations",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Energie_in_Beeld_Enexis_Assets/MapServer/5",
    source: "Gemeente Zwolle GIS / Enexis",
    description: "Technische gebouwen elektra (middenspanning)",
    category: "voorzieningen",
    color: [255, 120, 0, 200],
    icon: "Zap",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 4,
    fetchData: async () =>
      fetchZwolleGIS("Energie_in_Beeld_Enexis_Assets", 5, "MapServer"),
  },

  // ═══════════════════════════════════════
  // NEW: NDW TRAFFIC DATA
  // ═══════════════════════════════════════
  {
    id: "ndw-laadpunten-ocpi",
    name: "Laadpunten OCPI (NDW)",
    endpoint: "opendata.ndw.nu/charging_point_locations_ocpi.json.gz",
    source: "NDW (Open Charge Point Interface 2.2.1)",
    description:
      "EV-laadpunten met EVSE-status, connectortype, vermogen en operator (NDW DOT-NL OCPI)",
    category: "verkeer",
    color: [0, 255, 140, 220],
    icon: "Zap",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 5,
    fetchData: async () => {
      const res = await fetch("/api/ocpi");
      if (!res.ok) throw new Error(`OCPI laden mislukt: ${res.status}`);
      return res.json();
    },
  },
  {
    id: "ndw-verkeersborden",
    name: "Verkeersborden (NDW)",
    endpoint: "data.ndw.nu/api/rest/static-road-data/traffic-signs/v4/current-state?countyCode=GM0193",
    source: "NDW",
    description: "Alle verkeersborden in Zwolle (snelheid, verbod, etc.)",
    category: "verkeer",
    color: [255, 255, 255, 200],
    icon: "ShieldAlert",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 3,
    fetchData: async () =>
      fetchGeoJSON(
        "https://data.ndw.nu/api/rest/static-road-data/traffic-signs/v4/current-state?countyCode=GM0193"
      ),
  },

  // ═══════════════════════════════════════
  // NEW: PDOK EXTRA
  // ═══════════════════════════════════════
  {
    id: "kadastrale-percelen",
    name: "Kadastrale Percelen",
    endpoint: "api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/collections/perceel/items",
    source: "PDOK / Kadaster",
    description: "Kadastrale perceelgrenzen",
    category: "grenzen",
    color: [180, 120, 200, 60],
    icon: "LayoutGrid",
    visible: false,
    loading: false,
    filled: false,
    stroked: true,
    lineWidth: 1,
    fetchData: async () =>
      fetchPDOKOGCAPI(
        "https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1",
        "perceel",
        500
      ),
  },
  {
    id: "drone-nofly",
    name: "Drone No-Fly Zones",
    endpoint: "api.pdok.nl/lvnl/drone-no-flyzones/ogc/v1/collections/luchtvaartgebieden/items",
    source: "PDOK / LVNL",
    description: "Verbodszones voor drones (luchtvaartgebieden)",
    category: "grenzen",
    color: [255, 60, 60, 60],
    icon: "ShieldAlert",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchPDOKOGCAPI(
        "https://api.pdok.nl/lvnl/drone-no-flyzones/ogc/v1",
        "luchtvaartgebieden",
        50
      ),
  },

  // ═══════════════════════════════════════
  // NEW: EXTRA ZWOLLE GIS
  // ═══════════════════════════════════════
  {
    id: "bomen-snoei",
    name: "Bomensnoei",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/BomenSnoei/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Locaties waar bomen gesnoeid worden",
    category: "openbare-ruimte",
    color: [80, 160, 40, 180],
    icon: "TreePine",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 3,
    fetchData: async () =>
      fetchZwolleGIS("BomenSnoei", 0, "MapServer"),
  },
  {
    id: "inspectiebomen",
    name: "Inspectiebomen",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/Inspectiebomen/MapServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Bomen met veiligheidsinspectie",
    category: "openbare-ruimte",
    color: [200, 160, 40, 180],
    icon: "Search",
    visible: false,
    loading: false,
    pointType: "scatterplot",
    radius: 3,
    fetchData: async () =>
      fetchGeoJSON(
        `${ZWOLLE_GIS}/Inspectiebomen/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson`
      ),
  },
  {
    id: "tor-stadsdelen",
    name: "TOR Incidenten (Stadsdelen)",
    endpoint: "gisservices.zwolle.nl/ArcGIS/rest/services/TOR_stadsdelen/FeatureServer/0",
    source: "Gemeente Zwolle GIS",
    description: "Stadsdeelgrenzen gekoppeld aan TOR-incidentmeldingen",
    category: "grenzen",
    color: [255, 100, 80, 60],
    icon: "Map",
    visible: false,
    loading: false,
    filled: true,
    stroked: true,
    lineWidth: 2,
    fetchData: async () =>
      fetchZwolleGIS("TOR_stadsdelen", 0),
  },
];

export interface LayerMetadata {
  id: string;
  name: string;
  description: string;
  source: string;
  endpoint: string;
  category: LayerCategory;
  icon: string;
}

export const LAYER_METADATA: LayerMetadata[] = DATA_SOURCES.map(
  ({ id, name, description, source, endpoint, category, icon }) => ({
    id,
    name,
    description,
    source,
    endpoint,
    category,
    icon,
  })
);
