/**
 * National & EU data sources — these work for any Dutch municipality by parameterizing
 * bbox / area-name / gemeentecode. Sources: PDOK, CBS, RIVM, RCE, BRO,
 * Kadaster, ProRail, NDW, OSM Overpass, Pakketpuntenviewer, Natura 2000.
 */

import type { CityConfig } from "../cities";
import type { DataSource } from "./types";
import {
  fetchBronOngevallen,
  fetchCBSBuurten,
  fetchCBSPC4,
  fetchCBSWijken,
  fetchEmpty,
  fetchGeoJSON,
  fetchOverpassGeoJSON,
  fetchPakketpunten,
  fetchPDOKOGCAPI,
  fetchPDOKWFS,
  fetchTelraamSegments,
  cleanCBSProperties,
  overpassNodesInArea,
  CBS_PC4_LATEST_YEAR,
  CBS_PC4_INCOME_YEAR,
  CBS_PC4_WOZ_YEAR,
} from "./fetchers";

export function buildNationalLayers(city: CityConfig): DataSource[] {
  const bbox = city.bbox.join(",");
  const bboxWFS = city.bboxWFS;
  const countyCode = city.cbsCode || ""; // e.g. GM0193

  const layers: DataSource[] = [
    // ─── VERKEER & TRANSPORT ───────────────────────────────
    {
      id: "traffic-lights",
      labelProperties: ["name"],
      name: "Verkeerslichten (iVRI)",
      endpoint: "verkeerslichtenviewer.nl/api/v1/export?format=geojson",
      source: "verkeerslichtenviewer.nl",
      description:
        "Intelligente verkeerslichten uit het UDAP netwerk via verkeerslichtenviewer.nl",
      category: "verkeer-logistiek",
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
        const [lonMin, latMin, lonMax, latMax] = city.bbox;
        return {
          ...data,
          features: data.features.filter((f) => {
            if (f.geometry.type !== "Point") return false;
            const [lng, lat] = f.geometry.coordinates;
            return lng > lonMin && lng < lonMax && lat > latMin && lat < latMax;
          }),
        };
      },
    },
    {
      id: "laadpunten-bouw",
      labelProperties: ["Bedrijfsnaam", "Adres"],
      name: "Laadpunten Bouw (mobiele werktuigen)",
      endpoint:
        "services.arcgis.com/B9r4xgv0TkbErjvr/arcgis/rest/services/Laadpunten_mobiele_werktuigen_bouw/FeatureServer/0",
      source: "BCI Global / Laadkaart Bouw",
      sourceUrl:
        "https://bciglobal.maps.arcgis.com/apps/instant/basic/index.html?appid=cdb5ce9509f24ee1838ab43ffd4c0e6c",
      description:
        "Laadpunten voor elektrische mobiele werktuigen in de bouw (DC/AC, vermogen, tarieven, MCS)",
      category: "mobiliteitsdiensten",
      color: [255, 140, 0, 220],
      icon: "Zap",
      visible: false,
      loading: false,
      isNew: true,
      pointType: "scatterplot",
      radius: 7,
      fetchData: async () => {
        const url =
          "https://services.arcgis.com/B9r4xgv0TkbErjvr/arcgis/rest/services/Laadpunten_mobiele_werktuigen_bouw/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultRecordCount=2000";
        const data = await fetchGeoJSON(url);
        const [lonMin, latMin, lonMax, latMax] = city.bbox;
        return {
          ...data,
          features: data.features.filter((f) => {
            if (f.geometry?.type !== "Point") return false;
            const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
            return lng > lonMin && lng < lonMax && lat > latMin && lat < latMax;
          }),
        };
      },
    },

    // Pakketpunten (city-specific URL slug)
    ...(city.pakketpuntenSlug
      ? [
          {
            id: "pakketpunten",
            labelProperties: ["vervoerder", "straatNaam"],
            name: "Pakketpunten",
            endpoint: `pakketpuntenviewer.nl/data/${city.pakketpuntenSlug}.geojson`,
            source: "pakketpuntenviewer.nl",
            description: `Alle pakketpunten in ${city.name} (PostNL, DHL, DPD, Amazon, GLS, VintedGo)`,
            category: "verkeer-logistiek" as const,
            color: [255, 160, 0, 220] as [number, number, number, number],
            icon: "Store",
            visible: false,
            loading: false,
            pointType: "scatterplot" as const,
            radius: 6,
            fetchData: async () => {
              const data = await fetchPakketpunten(city.pakketpuntenSlug!);
              return {
                ...data,
                features: data.features.filter(
                  (f) => f.geometry.type === "Point"
                ),
              };
            },
          },
          {
            id: "pakketpunten-300m",
            name: "Pakketpunten Bereik 300m",
            endpoint: `pakketpuntenviewer.nl/data/${city.pakketpuntenSlug}.geojson`,
            source: "pakketpuntenviewer.nl",
            description: "Loopafstand 300m rondom pakketpunten",
            category: "verkeer-logistiek" as const,
            color: [255, 200, 100, 60] as [number, number, number, number],
            icon: "CircleDot",
            visible: false,
            loading: false,
            filled: true,
            stroked: false,
            fetchData: async () => {
              const data = await fetchPakketpunten(city.pakketpuntenSlug!);
              return {
                ...data,
                features: data.features.filter(
                  (f) => f.properties?.type === "buffer_union_300m"
                ),
              };
            },
          },
          {
            id: "pakketpunten-400m",
            name: "Pakketpunten Bereik 400m",
            endpoint: `pakketpuntenviewer.nl/data/${city.pakketpuntenSlug}.geojson`,
            source: "pakketpuntenviewer.nl",
            description: "Loopafstand 400m rondom pakketpunten",
            category: "verkeer-logistiek" as const,
            color: [255, 220, 130, 50] as [number, number, number, number],
            icon: "CircleDot",
            visible: false,
            loading: false,
            filled: true,
            stroked: false,
            fetchData: async () => {
              const data = await fetchPakketpunten(city.pakketpuntenSlug!);
              return {
                ...data,
                features: data.features.filter(
                  (f) => f.properties?.type === "buffer_union_400m"
                ),
              };
            },
          },
        ]
      : []),

    // ─── GEBOUWEN & ADRESSEN ──────────────────────────────
    {
      id: "bag-panden",
      labelProperties: ["bouwjaar"],
      name: "BAG Panden",
      endpoint: "service.pdok.nl/lv/bag/wfs/v2_0",
      source: "PDOK",
      description: "Gebouwen uit de Basisregistratie Adressen en Gebouwen (PDOK)",
      category: "gebouwen-infra",
      color: [180, 100, 200, 140],
      icon: "Building2",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 1000,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "bag:pand",
          "https://service.pdok.nl/lv/bag/wfs/v2_0",
          bboxWFS,
          1000,
          full
        ),
    },

    // ─── BGT (national topography) ────────────────────────
    {
      id: "bgt-wegdeel",
      labelProperties: ["functie"],
      name: "BGT Wegdeel",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items",
      source: "PDOK (BGT)",
      description: "Wegen en paden uit de Basisregistratie Grootschalige Topografie",
      category: "verkeer-logistiek",
      color: [180, 180, 180, 120],
      icon: "Route",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "wegdeel",
          bbox,
          500,
          full
        ),
    },
    {
      id: "bgt-begroeidterreindeel",
      labelProperties: ["fysiek_voorkomen"],
      name: "BGT Begroeid Terreindeel",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel/items",
      source: "PDOK (BGT)",
      description: "Groengebieden: gras, bos, struiken en overig begroeid terrein",
      category: "groen-ecologie",
      color: [80, 180, 60, 100],
      icon: "TreePine",
      visible: false,
      loading: false,
      filled: true,
      stroked: false,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "begroeidterreindeel",
          bbox,
          500,
          full
        ),
    },
    {
      id: "bgt-onbegroeidterreindeel",
      labelProperties: ["fysiek_voorkomen"],
      name: "BGT Onbegroeid Terreindeel",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel/items",
      source: "PDOK (BGT)",
      description: "Onverharde en verharde terreindelen (zand, klinkers, asfalt, etc.)",
      category: "groen-ecologie",
      color: [200, 180, 140, 100],
      icon: "LayoutGrid",
      visible: false,
      loading: false,
      filled: true,
      stroked: false,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "onbegroeidterreindeel",
          bbox,
          500,
          full
        ),
    },
    {
      id: "bgt-ondersteunendwegdeel",
      labelProperties: ["functie"],
      name: "BGT Ondersteunend Wegdeel",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel/items",
      source: "PDOK (BGT)",
      description: "Bermen, verkeerseilanden en andere ondersteunende wegdelen",
      category: "verkeer-logistiek",
      color: [160, 200, 140, 100],
      icon: "Route",
      visible: false,
      loading: false,
      filled: true,
      stroked: false,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "ondersteunendwegdeel",
          bbox,
          500,
          full
        ),
    },
    {
      id: "bgt-pand",
      name: "BGT Pand",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1/collections/pand/items",
      source: "PDOK (BGT)",
      description: "Gebouwen uit de BGT (nauwkeuriger dan BAG voor topografie)",
      category: "gebouwen-infra",
      color: [160, 100, 140, 120],
      icon: "Building2",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "pand",
          bbox,
          500,
          full
        ),
    },
    {
      id: "bgt-waterdeel",
      labelProperties: ["type"],
      name: "BGT Waterdeel",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1/collections/waterdeel/items",
      source: "PDOK (BGT)",
      description: "Water uit de Basisregistratie Grootschalige Topografie",
      category: "bodem-ondergrond",
      color: [50, 130, 220, 140],
      icon: "Waves",
      visible: false,
      loading: false,
      filled: true,
      stroked: false,
      defaultLimit: 500,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "waterdeel",
          bbox,
          500,
          full
        ),
    },

    // ─── CBS BUURTEN/WIJKEN (sociaal/wonen/gezondheid) ──
    {
      id: "cbs-buurten",
      labelProperties: ["buurtnaam", "aantalInwoners"],
      name: "CBS Buurten (Demografie)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Buurten met demografische gegevens (bevolking, inkomen, woningen, afstanden)",
      category: "sociaal-economisch",
      color: [100, 160, 255, 80],
      icon: "LayoutGrid",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-wmo",
      labelProperties: ["buurtnaam", "aantalWmoClientenPer1000Inwoners"],
      name: "Wmo Clienten (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Aantal Wmo-clienten en Wmo-clienten per 1.000 inwoners per buurt",
      category: "sociaal-economisch",
      color: [0, 150, 200, 100],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-jeugdzorg",
      labelProperties: ["buurtnaam", "percentageJongerenMetJeugdzorgInNatura"],
      name: "Jeugdzorg (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Jongeren met jeugdzorg in natura: aantal en percentage per buurt",
      category: "sociaal-economisch",
      color: [180, 100, 220, 100],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-bijstand",
      labelProperties: ["buurtnaam", "aantalPersonenMetEenAlgBijstandsuitkeringTot"],
      name: "Bijstand / Participatiewet (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Personen met bijstandsuitkering, AO-uitkering en WW-uitkering per buurt",
      category: "sociaal-economisch",
      color: [220, 120, 60, 100],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-sociaal-minimum",
      labelProperties: ["buurtnaam", "percentageHuishoudensOnderOfRondSociaalMinimum"],
      name: "Sociaal Minimum (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Huishoudens onder/rond sociaal minimum, tot 110% en 120% van sociaal minimum per buurt",
      category: "sociaal-economisch",
      color: [200, 80, 80, 100],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-arbeidsparticipatie",
      labelProperties: ["buurtnaam", "nettoArbeidsparticipatie"],
      name: "Arbeidsparticipatie (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Netto arbeidsparticipatie, percentage werknemers en zelfstandigen per buurt",
      category: "sociaal-economisch",
      color: [60, 160, 120, 100],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-wijken-sociaal",
      labelProperties: ["wijknaam"],
      name: "Sociaal Domein (per wijk)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Wmo, jeugdzorg, bijstand, uitkeringen en sociaal minimum geaggregeerd per wijk",
      category: "sociaal-economisch",
      color: [0, 130, 180, 80],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 100,
      fetchData: async (full) => fetchCBSWijken(city, full),
    },
    {
      id: "cbs-woz",
      labelProperties: ["buurtnaam", "gemiddeldeWoningwaarde"],
      name: "WOZ Woningwaarde (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description: "Gemiddelde WOZ-waarde van woningen per buurt",
      category: "sociaal-economisch",
      color: [220, 180, 40, 100],
      icon: "Home",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-woningvoorraad",
      labelProperties: ["buurtnaam", "woningvoorraad"],
      name: "Woningvoorraad (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Aantal woningen, percentage eengezins/meergezins, bouwjaarklasse en leegstand per buurt",
      category: "sociaal-economisch",
      color: [160, 120, 200, 100],
      icon: "Home",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-huur-koop",
      labelProperties: ["buurtnaam", "percentageKoopwoningen"],
      name: "Huur vs Koop (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Percentage huurwoningen, koopwoningen en woningcorporatiebezit per buurt",
      category: "sociaal-economisch",
      color: [100, 160, 60, 100],
      icon: "Home",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-energie-verbruik",
      labelProperties: ["buurtnaam", "gemiddeldGasverbruikTotaal"],
      name: "Energieverbruik Woningen (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Gemiddeld gas- en elektriciteitsverbruik per woningtype per buurt",
      category: "energie",
      color: [255, 180, 0, 100],
      icon: "Zap",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-wijken-wonen",
      labelProperties: ["wijknaam"],
      name: "WOZ & Woningen (per wijk)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "WOZ-waarde, woningvoorraad, huur/koop en energieverbruik geaggregeerd per wijk",
      category: "sociaal-economisch",
      color: [200, 160, 40, 80],
      icon: "Home",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 100,
      fetchData: async (full) => fetchCBSWijken(city, full),
    },
    {
      id: "cbs-vierkant-100m",
      labelProperties: ["aantalWoningen"],
      name: "CBS Vierkant 100m (Woningen)",
      endpoint: "service.pdok.nl/cbs/vierkantstatistieken100m/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description: "Aantal inwoners en woningen per 100m gridcel — zeer fijnmazig",
      category: "sociaal-economisch",
      color: [140, 100, 200, 80],
      icon: "LayoutGrid",
      visible: false,
      loading: false,
      filled: true,
      stroked: false,
      defaultLimit: 500,
      fetchData: async (full) => {
        const data = await fetchPDOKWFS(
          "vierkantstatistieken100m:vierkant_100m",
          "https://service.pdok.nl/cbs/vierkantstatistieken100m/2024/wfs/v1_0",
          bboxWFS,
          500,
          full
        );
        return cleanCBSProperties(data);
      },
    },
    {
      id: "cbs-vierkant-500m",
      labelProperties: ["aantalInwoners"],
      name: "CBS Vierkant 500m (Woningen)",
      endpoint: "service.pdok.nl/cbs/vierkantstatistieken500m/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Inwoners, woningen, demografische en nabijheidsgegevens per 500m gridcel",
      category: "sociaal-economisch",
      color: [120, 80, 180, 80],
      icon: "LayoutGrid",
      visible: false,
      loading: false,
      filled: true,
      stroked: false,
      defaultLimit: 200,
      fetchData: async (full) => {
        const data = await fetchPDOKWFS(
          "vierkantstatistieken500m:Vierkant500M2024",
          "https://service.pdok.nl/cbs/vierkantstatistieken500m/2024/wfs/v1_0",
          bboxWFS,
          200,
          full
        );
        return cleanCBSProperties(data);
      },
    },
    {
      id: "cbs-nabijheid-huisarts",
      labelProperties: ["buurtnaam", "huisartsenpraktijkGemiddeldeAfstandInKm"],
      name: "Nabijheid Huisarts (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Gemiddelde afstand tot huisartsenpraktijk en huisartsenpost, aantal binnen 1/3/5 km per buurt",
      category: "gezondheid-norm",
      color: [255, 80, 80, 100],
      icon: "HeartPulse",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-nabijheid-ziekenhuis",
      labelProperties: ["buurtnaam", "ziekenhuisInclBuitenpolikliniekGemAfstInKm"],
      name: "Nabijheid Ziekenhuis (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Gemiddelde afstand tot ziekenhuis (incl/excl buitenpoli), aantal binnen 5/10/20 km per buurt",
      category: "gezondheid-norm",
      color: [200, 60, 60, 100],
      icon: "HeartPulse",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-nabijheid-apotheek",
      labelProperties: ["buurtnaam", "apotheekGemiddeldeAfstandInKm"],
      name: "Nabijheid Apotheek (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Gemiddelde afstand tot apotheek en aantal binnen 1/3/5 km per buurt",
      category: "gezondheid-norm",
      color: [255, 120, 100, 100],
      icon: "HeartPulse",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-nabijheid-onderwijs",
      labelProperties: ["buurtnaam", "basisonderwijsGemiddeldeAfstandInKm"],
      name: "Nabijheid Onderwijs (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Afstand tot basis-, voortgezet en MBO/HBO onderwijs en aantal binnen bereik per buurt",
      category: "gezondheid-norm",
      color: [100, 100, 220, 100],
      icon: "GraduationCap",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-nabijheid-voorzieningen",
      labelProperties: ["buurtnaam", "groteSupermarktGemiddeldeAfstandInKm"],
      name: "Nabijheid Voorzieningen (per buurt)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Afstand tot supermarkten, restaurants, café, bibliotheek, kinderopvang en sportvelden per buurt",
      category: "gezondheid-norm",
      color: [220, 140, 60, 100],
      icon: "ShoppingCart",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      fetchData: async (full) => fetchCBSBuurten(city, full),
    },
    {
      id: "cbs-wijken-gezondheid",
      labelProperties: ["wijknaam"],
      name: "Gezondheid & Nabijheid (per wijk)",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description: "Nabijheid van zorg, onderwijs en voorzieningen per wijk",
      category: "gezondheid-norm",
      color: [220, 100, 80, 80],
      icon: "HeartPulse",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 100,
      fetchData: async (full) => fetchCBSWijken(city, full),
    },

    // ─── ProRail Spoorwegen ─────────────────────────────
    {
      id: "treinstations",
      labelProperties: ["naam"],
      name: "Treinstations",
      endpoint: "service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
      source: "PDOK / ProRail",
      description: `Treinstations in en rond ${city.name}`,
      category: "mobiliteitsdiensten",
      color: [255, 220, 0, 220],
      icon: "TrainFront",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 8,
      defaultLimit: 50,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "spoorwegen:station",
          "https://service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
          bboxWFS,
          50,
          full
        ),
    },
    {
      id: "spooras",
      name: "Spoorlijnen",
      endpoint: "service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
      source: "PDOK / ProRail",
      description: "Spooraslijnen (treinrails)",
      category: "mobiliteitsdiensten",
      color: [200, 200, 0, 160],
      icon: "TrainFront",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 500,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "spoorwegen:spooras",
          "https://service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
          bboxWFS,
          500,
          full
        ),
    },
    {
      id: "overwegen",
      labelProperties: ["naam"],
      name: "Overwegen",
      endpoint: "service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
      source: "PDOK / ProRail",
      description: "Spoorwegovergangen (gelijkvloerse kruisingen)",
      category: "mobiliteitsdiensten",
      color: [255, 60, 60, 200],
      icon: "TrainFront",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      defaultLimit: 100,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "spoorwegen:overweg",
          "https://service.pdok.nl/prorail/spoorwegen/wfs/v1_0",
          bboxWFS,
          100,
          full
        ),
    },

    // ─── NDW Wegkenmerken Snelheden (vector tiles) ──────
    {
      id: "ndw-wegkenmerken-snelheden",
      name: "Maximumsnelheden (WKD)",
      endpoint: "maps.ndw.nu/api/v1/wkdSpeedLimits",
      source: "NDW Wegkenmerken (WKD)",
      sourceUrl: "https://wegkenmerken.ndw.nu",
      description:
        "Maximumsnelheden per wegvak uit de NDW Wegkenmerken Database, maandelijks bijgewerkt",
      category: "verkeer-logistiek",
      color: [255, 157, 84, 200],
      icon: "Gauge",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      fetchData: async () => ({ type: "FeatureCollection" as const, features: [] }),
      vectorTile: {
        tileUrl: "/api/ndw/tiles/{z}/{x}/{y}.pbf",
        sourceLayer: "segments",
        type: "line",
        paint: {
          "line-width": 2,
          "line-opacity": 0.85,
          "line-color": [
            "match",
            ["get", "speedLimit"],
            "5",
            "#83ABCC",
            "15",
            "#E88D85",
            "20",
            "#47FFB5",
            "30",
            "#D8AEE8",
            "40",
            "#83ABCC",
            "50",
            "#FF9D54",
            "60",
            "#E240E8",
            "70",
            "#8EBF98",
            "80",
            "#4893FF",
            "90",
            "#E39877",
            "100",
            "#E8E648",
            "120",
            "#83ABCC",
            "130",
            "#AA61CD",
            "NOA",
            "#F0F0F0",
            "NVT",
            "#C8C8C8",
            "unknown",
            "#414141",
            "#808080",
          ],
        },
      },
    },

    // ─── Natura 2000 ────────────────────────────────────
    {
      id: "natura2000",
      labelProperties: ["naamN2K"],
      name: "Natura 2000 Gebieden",
      endpoint: "service.pdok.nl/rvo/natura2000/wfs/v1_0",
      source: "PDOK / RVO",
      description: "Natura 2000 beschermde natuurgebieden",
      category: "groen-ecologie",
      color: [30, 180, 60, 80],
      icon: "Leaf",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 50,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "natura2000:natura2000",
          "https://service.pdok.nl/rvo/natura2000/wfs/v1_0",
          bboxWFS,
          50,
          full
        ),
    },

    // ─── OSM Overpass ───────────────────────────────────
    {
      id: "osm-aed",
      labelProperties: ["defibrillator:location"],
      name: "AED Defibrillatoren",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: `AED defibrillatoren in ${city.name} (via OpenStreetMap)`,
      category: "gezondheid-norm",
      color: [255, 50, 50, 220],
      icon: "HeartPulse",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 7,
      fetchData: async () =>
        fetchOverpassGeoJSON(
          overpassNodesInArea(city, '["emergency"="defibrillator"]')
        ),
    },
    {
      id: "osm-toiletten",
      labelProperties: ["name"],
      name: "Openbare Toiletten",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: `Openbare toiletten in ${city.name} (via OpenStreetMap)`,
      category: "sociaal-economisch",
      color: [100, 140, 220, 200],
      icon: "CircleDot",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      fetchData: async () =>
        fetchOverpassGeoJSON(
          overpassNodesInArea(city, '["amenity"="toilets"]')
        ),
    },
    {
      id: "osm-drinkwater",
      labelProperties: ["name"],
      name: "Drinkwaterpunten",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: `Openbare drinkwaterpunten in ${city.name}`,
      category: "sociaal-economisch",
      color: [40, 160, 220, 200],
      icon: "GlassWater",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 6,
      fetchData: async () =>
        fetchOverpassGeoJSON(
          overpassNodesInArea(city, '["amenity"="drinking_water"]')
        ),
    },
    {
      id: "osm-speeltuinen",
      labelProperties: ["name"],
      name: "Speeltuinen",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: `Speeltuinen en speelplaatsen in ${city.name}`,
      category: "sociaal-economisch",
      color: [255, 160, 220, 200],
      icon: "Dumbbell",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 4,
      fetchData: async () =>
        fetchOverpassGeoJSON(
          overpassNodesInArea(city, '["leisure"="playground"]')
        ),
    },
    {
      id: "osm-scholen",
      labelProperties: ["name"],
      name: "Scholen",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: `Scholen in ${city.name} (basis, voortgezet, MBO, HBO)`,
      category: "gezondheid-norm",
      color: [100, 100, 255, 200],
      icon: "GraduationCap",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      fetchData: async () =>
        fetchOverpassGeoJSON(
          overpassNodesInArea(city, '["amenity"="school"]')
        ),
    },
    {
      id: "osm-zorg",
      labelProperties: ["name", "amenity"],
      name: "Zorgvoorzieningen",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: "Ziekenhuizen, klinieken, huisartsen, apotheken en tandartsen",
      category: "gezondheid-norm",
      color: [255, 100, 100, 200],
      icon: "HeartPulse",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      fetchData: async () =>
        fetchOverpassGeoJSON(
          overpassNodesInArea(
            city,
            '["amenity"~"hospital|clinic|doctors|pharmacy|dentist"]'
          )
        ),
    },
    {
      id: "osm-supermarkten",
      labelProperties: ["name"],
      name: "Supermarkten",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: `Supermarkten in ${city.name}`,
      category: "mobiliteitsdiensten",
      color: [0, 180, 120, 200],
      icon: "ShoppingCart",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 6,
      fetchData: async () =>
        fetchOverpassGeoJSON(
          overpassNodesInArea(city, '["shop"="supermarket"]')
        ),
    },

    // ─── NDW (national, used as-is — bbox-filtered server-side per city) ─
    {
      id: "ndw-laadpunten-ocpi",
      labelProperties: ["name", "operator"],
      name: "Laadpunten OCPI (NDW)",
      endpoint: "opendata.ndw.nu/charging_point_locations_ocpi.json.gz",
      source: "NDW (Open Charge Point Interface 2.2.1)",
      description:
        "EV-laadpunten met EVSE-status, connectortype, vermogen en operator",
      category: "mobiliteitsdiensten",
      color: [0, 255, 140, 220],
      icon: "Zap",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      fetchData: async () => {
        const res = await fetch(`/api/ocpi?city=${city.slug}`);
        if (!res.ok) throw new Error(`OCPI laden mislukt: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-verkeersborden",
      labelProperties: ["rvvCode", "roadName"],
      name: "Verkeersborden (NDW)",
      endpoint: `data.ndw.nu/api/rest/static-road-data/traffic-signs/v4/current-state?countyCode=${countyCode}`,
      source: "NDW",
      description: `Alle verkeersborden in ${city.name} (snelheid, verbod, etc.)`,
      category: "verkeer-logistiek",
      color: [255, 255, 255, 200],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 3,
      fetchData: async () =>
        fetchGeoJSON(
          `https://data.ndw.nu/api/rest/static-road-data/traffic-signs/v4/current-state?countyCode=${countyCode}`
        ),
    },
    {
      id: "ndw-verkeersborden-e7",
      labelProperties: ["roadName"],
      name: "Verkeersborden E7 – Laden/Lossen (NDW)",
      endpoint: `data.ndw.nu/api/rest/static-road-data/traffic-signs/v4/current-state?rvvCode=E7&countyCode=${countyCode}`,
      source: "NDW",
      description: `E7-verkeersborden in ${city.name}: zones voor laden en lossen`,
      category: "mobiliteitsdiensten",
      color: [0, 180, 255, 220],
      icon: "Truck",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      fetchData: async () =>
        fetchGeoJSON(
          `https://data.ndw.nu/api/rest/static-road-data/traffic-signs/v4/current-state?rvvCode=E7&countyCode=${countyCode}`
        ),
    },
    {
      id: "ndw-incidenten",
      labelProperties: ["type"],
      name: "Incidenten & Situaties (NDW)",
      endpoint: "opendata.ndw.nu/incidents.xml.gz",
      source: "NDW (DATEX II)",
      description: "Actuele verkeersincidenten, pechgevallen en situatieberichten",
      category: "verkeer-logistiek",
      color: [255, 60, 60, 220],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 7,
      fetchData: async () => {
        const res = await fetch(`/api/ndw/incidents?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW incidenten: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-actueel",
      labelProperties: ["type"],
      name: "Actueel Beeld (NDW)",
      endpoint: "opendata.ndw.nu/actueel_beeld.xml.gz",
      source: "NDW (DATEX II v3)",
      description: "Realtime actueel verkeersbeeld: files, incidenten, werkzaamheden",
      category: "verkeer-logistiek",
      color: [255, 180, 0, 220],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 6,
      fetchData: async () => {
        const res = await fetch(`/api/ndw/actueel?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW actueel: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-srti",
      labelProperties: ["type"],
      name: "SRTI Veiligheidsmeldingen",
      endpoint: "opendata.ndw.nu/srti.xml.gz",
      source: "NDW (DATEX II)",
      description:
        "Safety Related Traffic Information: spookrijders, objecten op de weg, extreme weersomstandigheden",
      category: "veiligheid",
      color: [255, 0, 0, 240],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 8,
      fetchData: async () => {
        const res = await fetch(`/api/ndw/srti?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW SRTI: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-brugopeningen",
      labelProperties: ["type"],
      name: "Brugopeningen (NDW)",
      endpoint: "opendata.ndw.nu/brugopeningen.xml.gz",
      source: "NDW (DATEX II)",
      description: "Geplande en actuele brugopeningen (beweegbare bruggen)",
      category: "verkeer-logistiek",
      color: [0, 180, 255, 200],
      icon: "Construction",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 7,
      fetchData: async () => {
        const res = await fetch(`/api/ndw/brugopeningen?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW brugopeningen: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-emissiezones",
      labelProperties: ["name"],
      name: "Emissiezones (NDW)",
      endpoint: "opendata.ndw.nu/emissiezones.xml.gz",
      source: "NDW (DATEX II v3)",
      description: "Milieuzones en emissiezones voor voertuigen in Nederland",
      category: "omgevingsfactoren",
      color: [100, 200, 50, 100],
      icon: "Leaf",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 2,
      fetchData: async () => {
        const res = await fetch(`/api/ndw/emissiezones?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW emissiezones: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-maxsnelheden",
      labelProperties: ["type"],
      name: "Tijdelijke Snelheidsbeperkingen",
      endpoint: "opendata.ndw.nu/tijdelijke_verkeersmaatregelen_maximum_snelheden.xml.gz",
      source: "NDW (WKD / DATEX II v3)",
      description: "Tijdelijke maximumsnelheden door werkzaamheden of incidenten",
      category: "verkeer-logistiek",
      color: [255, 100, 0, 200],
      icon: "Gauge",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      fetchData: async () => {
        const res = await fetch(`/api/ndw/maxsnelheden?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW maxsnelheden: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-msi",
      labelProperties: ["name"],
      name: "MSI Matrixborden (NDW)",
      endpoint: "opendata.ndw.nu/Matrixsignaalinformatie.xml.gz",
      source: "NDW (RWS MSI)",
      description:
        "Matrixsignaalborden met actuele rijstrookstatus (snelheidslimiet, rijstrook dicht, open)",
      category: "verkeer-logistiek",
      color: [0, 255, 255, 200],
      icon: "Lightbulb",
      visible: false,
      loading: false,
      renderAs: "msi-icon",
      radius: 5,
      fetchData: async () => {
        const res = await fetch(`/api/ndw/msi?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW MSI: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-truckparking",
      labelProperties: ["name", "vacant"],
      name: "Truckparkings (NDW)",
      endpoint: "opendata.ndw.nu/Truckparking_Parking_Table.xml",
      source: "NDW (DATEX II v3)",
      description: "Truckparkeerplaatsen met realtime bezettingsgraad",
      category: "verkeer-logistiek",
      color: [180, 120, 255, 200],
      icon: "ParkingCircle",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 7,
      fetchData: async () => {
        const res = await fetch(`/api/ndw/truckparking?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW truckparking: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ndw-trafficspeed",
      name: "Actuele Snelheden (NDW)",
      endpoint: "opendata.ndw.nu/trafficspeed.xml.gz",
      source: "NDW (DATEX II)",
      description:
        "Realtime gemeten verkeerssnelheden en intensiteiten op meetlocaties",
      category: "verkeer-logistiek",
      color: [0, 200, 100, 200],
      icon: "Gauge",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      renderAs: "speed-point",
      fetchData: async () => {
        const res = await fetch(`/api/ndw/trafficspeed?city=${city.slug}`);
        if (!res.ok) throw new Error(`NDW trafficspeed: ${res.status}`);
        return res.json();
      },
    },

    // ─── Kadaster, NWB, BRO, RIVM, RCE, DSO ───────────────
    {
      id: "kadastrale-percelen",
      labelProperties: ["sectie", "perceelnummer"],
      name: "Kadastrale Percelen",
      endpoint: "api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/collections/perceel/items",
      source: "PDOK / Kadaster",
      description: "Kadastrale perceelgrenzen",
      category: "gebouwen-infra",
      color: [180, 120, 200, 60],
      icon: "LayoutGrid",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1",
          "perceel",
          bbox,
          500,
          full
        ),
    },
    {
      id: "drone-nofly",
      labelProperties: ["source_txt", "localtype"],
      name: "Drone No-Fly Zones",
      endpoint: "api.pdok.nl/lvnl/drone-no-flyzones/ogc/v1/collections/luchtvaartgebieden/items",
      source: "PDOK / LVNL",
      description: "Verbodszones voor drones (luchtvaartgebieden)",
      category: "veiligheid",
      color: [255, 60, 60, 60],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 50,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lvnl/drone-no-flyzones/ogc/v1",
          "luchtvaartgebieden",
          bbox,
          50,
          full
        ),
    },
    {
      id: "nwb-wegvakken",
      labelProperties: ["sttNaam"],
      name: "Nationaal Wegenbestand (NWB)",
      endpoint: "service.pdok.nl/rws/nationaal-wegenbestand-wegen/wfs/v1_0",
      source: "PDOK / Rijkswaterstaat",
      description: "Alle wegen in Nederland met wegtype, straatnaam en wegbeheerder",
      category: "verkeer-logistiek",
      color: [200, 160, 80, 160],
      icon: "Route",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "nwbwegen:wegvakken",
          "https://service.pdok.nl/rws/nationaal-wegenbestand-wegen/wfs/v1_0",
          bboxWFS,
          500,
          full
        ),
    },
    {
      id: "nwb-hectopunten",
      labelProperties: ["hectomtrng"],
      name: "Hectometerpalen (NWB)",
      endpoint: "service.pdok.nl/rws/nationaal-wegenbestand-wegen/wfs/v1_0",
      source: "PDOK / Rijkswaterstaat",
      description: "Hectometerpalen langs rijkswegen",
      category: "verkeer-logistiek",
      color: [180, 180, 60, 180],
      icon: "MapPin",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 3,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "nwbwegen:hectopunten",
          "https://service.pdok.nl/rws/nationaal-wegenbestand-wegen/wfs/v1_0",
          bboxWFS,
          500,
          full
        ),
    },
    {
      id: "bro-grondwaterput",
      labelProperties: ["bro_id"],
      name: "Grondwatermonitoringputten (BRO)",
      endpoint: "api.pdok.nl/bzk/bro-gminsamenhang-karakteristieken/ogc/v1/collections/gm_gmw/items",
      source: "PDOK / BRO",
      description: "Grondwatermonitoringputten uit de Basisregistratie Ondergrond",
      category: "bodem-ondergrond",
      color: [40, 120, 200, 180],
      icon: "Droplets",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      defaultLimit: 200,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/bzk/bro-gminsamenhang-karakteristieken/ogc/v1",
          "gm_gmw",
          bbox,
          200,
          full
        ),
    },
    {
      id: "bro-grondwaterstand",
      labelProperties: ["bro_id"],
      name: "Grondwaterstandonderzoek (BRO)",
      endpoint: "api.pdok.nl/bzk/bro-gminsamenhang-karakteristieken/ogc/v1/collections/gm_gld/items",
      source: "PDOK / BRO",
      description: "Grondwaterstandonderzoeken met meetreeksen uit de BRO",
      category: "bodem-ondergrond",
      color: [30, 100, 180, 180],
      icon: "Droplets",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 4,
      defaultLimit: 200,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/bzk/bro-gminsamenhang-karakteristieken/ogc/v1",
          "gm_gld",
          bbox,
          200,
          full
        ),
    },
    {
      id: "waterkeringen",
      labelProperties: ["naam"],
      name: "Waterkeringen (IMWA)",
      endpoint: "service.pdok.nl/hwh/waterschappen-keringen-imwa/wfs/v3_0",
      source: "PDOK / Waterschappen",
      description: "Dijken, kades en andere waterkeringen van waterschappen",
      category: "bodem-ondergrond",
      color: [40, 80, 180, 140],
      icon: "Waves",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 3,
      defaultLimit: 200,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "waterschappen-keringen-imwa:waterkering",
          "https://service.pdok.nl/hwh/waterschappen-keringen-imwa/wfs/v3_0",
          bboxWFS,
          200,
          full
        ),
    },
    {
      id: "rivm-geluidhinder-verkeer",
      labelProperties: ["bu_naam", "weg"],
      name: "Geluidhinder Wegverkeer (RIVM)",
      endpoint: "data.rivm.nl/geo/wfs",
      source: "RIVM / Atlas Leefomgeving",
      description: "Ernstige geluidhinder door wegverkeer >50 dB per buurt (RIVM 2020)",
      category: "omgevingsfactoren",
      color: [255, 120, 80, 100],
      icon: "Volume2",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "alo:rivm_20230201_geluidhinder_bu_gt50_2020",
          "https://data.rivm.nl/geo/wfs",
          bboxWFS,
          200,
          full
        ),
    },
    {
      id: "rivm-geluidhinder-trein",
      labelProperties: ["bu_naam", "trein"],
      name: "Geluidhinder Treinverkeer (RIVM)",
      endpoint: "data.rivm.nl/geo/wfs",
      source: "RIVM / Atlas Leefomgeving",
      description: "Ernstige geluidhinder door treinverkeer per buurt (RIVM 2020)",
      category: "omgevingsfactoren",
      color: [200, 100, 200, 100],
      icon: "Volume2",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "alo:rivm_20230201_geluidhinder_bu_trein_2020",
          "https://data.rivm.nl/geo/wfs",
          bboxWFS,
          200,
          full
        ),
    },
    {
      id: "rce-rijksmonumenten",
      labelProperties: ["rijksmonument_nummer", "subcategorie"],
      name: "Rijksmonumenten (RCE)",
      endpoint: "data.geo.cultureelerfgoed.nl/openbaar/wfs",
      source: "RCE / Cultureelerfgoed",
      description:
        "Rijksmonumentencontouren uit de landelijke database van de Rijksdienst voor het Cultureel Erfgoed",
      category: "gebouwen-infra",
      color: [220, 170, 60, 140],
      icon: "Landmark",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 500,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "openbaar:rijksmonumentcontouren",
          "https://data.geo.cultureelerfgoed.nl/openbaar/wfs",
          bboxWFS,
          500,
          full
        ),
    },
    {
      id: "rce-archeologie",
      labelProperties: ["toponiem"],
      name: "Archeologische Monumenten (RCE)",
      endpoint: "data.geo.cultureelerfgoed.nl/openbaar/wfs",
      source: "RCE / Cultureelerfgoed",
      description: "Archeologische monumentenkaart (ARCHIS/AMK gebieden)",
      category: "bodem-ondergrond",
      color: [180, 140, 80, 100],
      icon: "Search",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 200,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "openbaar:Archeologische_Monumentenkaart_2014",
          "https://data.geo.cultureelerfgoed.nl/openbaar/wfs",
          bboxWFS,
          200,
          full
        ),
    },
    {
      id: "dso-bestemmingsplan",
      labelProperties: ["naam"],
      name: "Bestemmingsplannen (DSO)",
      endpoint: "service.pdok.nl/kadaster/bestuurlijkegrenzen/wfs/v1_0",
      source: "DSO / Omgevingsloket",
      description:
        "Bestemmingsplangebieden via het Digitaal Stelsel Omgevingswet (DSO API-key vereist)",
      category: "gebouwen-infra",
      color: [150, 100, 255, 140],
      icon: "Map",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 3,
      defaultLimit: 50,
      isNew: true,
      accessType: "restricted",
      fetchData: async () => {
        const res = await fetch(`/api/dso/plannen?city=${city.slug}`);
        if (!res.ok) throw new Error(`DSO laden mislukt: ${res.status}`);
        return res.json();
      },
    },

    // ─── CBS PC4 (postcode 4) — landelijke statistiek per postcode ─
    // Eén WFS-laag (`postcode4:postcode4`) draagt ~150 numerieke
    // properties; we publiceren hier per indicator een eigen laag, zodat
    // de zijbalk leesbaar blijft. Numerieke layers staan op
    // `colorMode: "auto-bucket"` zodat de visualisatie meteen variatie
    // toont; stedelijkheid heeft een vast 5-staps colorMap.
    {
      id: "cbs-pc4-inkomen-besteedbaar",
      labelProperties: ["postcode", "gemiddeldInkomenHuishouden"],
      name: "Besteedbaar Inkomen (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_INCOME_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Gemiddeld besteedbaar inkomen per huishouden in × €1.000 (CBS Postcode-4 ${CBS_PC4_INCOME_YEAR}; nieuwere jaargangen hebben dit veld nog niet gepubliceerd)`,
      category: "sociaal-economisch",
      color: [40, 120, 200, 120],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "gemiddeldInkomenHuishouden",
      freshness: { frequency: "annual", reference: String(CBS_PC4_INCOME_YEAR) },
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_INCOME_YEAR),
    },
    {
      id: "cbs-pc4-inkomen-laag-pct",
      labelProperties: ["postcode", "percentageLaagInkomenHuishouden"],
      name: "% Huishoudens Laag Inkomen (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_INCOME_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Percentage huishoudens met laag inkomen per postcode 4-gebied (CBS ${CBS_PC4_INCOME_YEAR})`,
      category: "sociaal-economisch",
      color: [200, 80, 80, 120],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "percentageLaagInkomenHuishouden",
      freshness: { frequency: "annual", reference: String(CBS_PC4_INCOME_YEAR) },
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_INCOME_YEAR),
    },
    {
      id: "cbs-pc4-inkomen-hoog-pct",
      labelProperties: ["postcode", "percentageHoogInkomenHuishouden"],
      name: "% Huishoudens Hoog Inkomen (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_INCOME_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Percentage huishoudens met hoog inkomen per postcode 4-gebied (CBS ${CBS_PC4_INCOME_YEAR})`,
      category: "sociaal-economisch",
      color: [60, 160, 100, 120],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "percentageHoogInkomenHuishouden",
      freshness: { frequency: "annual", reference: String(CBS_PC4_INCOME_YEAR) },
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_INCOME_YEAR),
    },
    {
      id: "cbs-pc4-woz",
      labelProperties: ["postcode", "gemiddeldeWozWaardeWoning"],
      name: "WOZ-waarde Woning (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_WOZ_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Gemiddelde WOZ-waarde van woningen × €1.000 per postcode 4-gebied (CBS ${CBS_PC4_WOZ_YEAR}; latere jaargangen hebben dit veld nog niet)`,
      category: "sociaal-economisch",
      color: [220, 180, 40, 120],
      icon: "Home",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "gemiddeldeWozWaardeWoning",
      freshness: { frequency: "annual", reference: String(CBS_PC4_WOZ_YEAR) },
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_WOZ_YEAR),
    },
    {
      id: "cbs-pc4-stedelijkheid",
      labelProperties: ["postcode"],
      name: "Stedelijkheid (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Mate van stedelijkheid (1 = zeer sterk stedelijk … 5 = niet stedelijk) per postcode 4-gebied (CBS ${CBS_PC4_LATEST_YEAR})`,
      category: "sociaal-economisch",
      color: [120, 140, 180, 120],
      icon: "Building2",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMap: {
        property: "stedelijkheid",
        values: {
          "1": [33, 102, 172, 180],
          "2": [103, 169, 207, 180],
          "3": [180, 180, 180, 180],
          "4": [180, 200, 140, 180],
          "5": [120, 160, 80, 180],
        },
        default: [180, 180, 180, 120],
      },
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-omgevingsadressendichtheid",
      labelProperties: ["postcode", "omgevingsadressendichtheid"],
      name: "Omgevingsadressendichtheid (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Aantal adressen per km² in de omgeving van het PC4-gebied (CBS ${CBS_PC4_LATEST_YEAR})`,
      category: "sociaal-economisch",
      color: [140, 100, 200, 120],
      icon: "LayoutGrid",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "omgevingsadressendichtheid",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-koopwoningen-pct",
      labelProperties: ["postcode", "percentageKoopwoningen"],
      name: "% Koopwoningen (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Aandeel koopwoningen op de totale woningvoorraad per postcode 4-gebied (CBS ${CBS_PC4_LATEST_YEAR})`,
      category: "sociaal-economisch",
      color: [100, 160, 60, 120],
      icon: "Home",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "percentageKoopwoningen",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-meergezins-pct",
      labelProperties: ["postcode", "percentageMeergezinsWoningen"],
      name: "% Meergezinswoningen (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Percentage meergezinswoningen (gestapeld) per postcode 4-gebied (CBS ${CBS_PC4_LATEST_YEAR}, afgeleid)`,
      category: "sociaal-economisch",
      color: [160, 120, 200, 120],
      icon: "Building2",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "percentageMeergezinsWoningen",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-eenpersoonshh-pct",
      labelProperties: ["postcode", "percentageEenpersoonshuishoudens"],
      name: "% Eenpersoonshuishoudens (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Percentage eenpersoonshuishoudens per postcode 4-gebied (CBS ${CBS_PC4_LATEST_YEAR}, afgeleid)`,
      category: "sociaal-economisch",
      color: [220, 140, 60, 120],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "percentageEenpersoonshuishoudens",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-leeftijd-25-45-pct",
      labelProperties: ["postcode", "percentageInwoners25Tot45Jaar"],
      name: "% Inwoners 25-45 jaar (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Aandeel inwoners van 25 t/m 45 jaar per postcode 4-gebied (CBS ${CBS_PC4_LATEST_YEAR}, afgeleid)`,
      category: "sociaal-economisch",
      color: [80, 180, 160, 120],
      icon: "Users",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "percentageInwoners25Tot45Jaar",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-afstand-treinstation",
      labelProperties: ["postcode", "dichtstbijzijndeTreinstationAfstandInKm"],
      name: "Afstand tot Treinstation (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Afstand in km van het PC4-zwaartepunt tot het dichtstbijzijnde treinstation (CBS ${CBS_PC4_LATEST_YEAR})`,
      category: "mobiliteitsdiensten",
      color: [100, 100, 220, 120],
      icon: "TrainFront",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "dichtstbijzijndeTreinstationAfstandInKm",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-afstand-snelweg",
      labelProperties: ["postcode", "dichtstbijzijndeOpritHoofdverkeerswegAfstandInKm"],
      name: "Afstand tot Snelwegoprit (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Afstand in km tot de dichtstbijzijnde oprit van een hoofdverkeersweg per PC4 (CBS ${CBS_PC4_LATEST_YEAR})`,
      category: "verkeer-logistiek",
      color: [220, 140, 80, 120],
      icon: "Route",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "dichtstbijzijndeOpritHoofdverkeerswegAfstandInKm",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-supermarkten-1km",
      labelProperties: ["postcode", "groteSupermarktAantalBinnen1Km"],
      name: "Grote Supermarkten Binnen 1 km (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Aantal grote supermarkten binnen 1 km van het PC4-zwaartepunt (CBS ${CBS_PC4_LATEST_YEAR})`,
      category: "mobiliteitsdiensten",
      color: [0, 180, 120, 120],
      icon: "ShoppingCart",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "groteSupermarktAantalBinnen1Km",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },
    {
      id: "cbs-pc4-horeca-1km",
      labelProperties: ["postcode", "dichtstbijzijndeHorecaAfstandInKm"],
      name: "Afstand tot Horeca (PC4)",
      endpoint: `service.pdok.nl/cbs/postcode4/${CBS_PC4_LATEST_YEAR}/wfs/v1_0`,
      source: "PDOK / CBS",
      description: `Afstand tot dichtstbijzijnde café/restaurant in km — proxy voor horeca-nabijheid (CBS ${CBS_PC4_LATEST_YEAR}, afgeleid)`,
      category: "sociaal-economisch",
      color: [220, 140, 60, 120],
      icon: "Store",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "dichtstbijzijndeHorecaAfstandInKm",
      fetchData: async (full) => fetchCBSPC4(city, full, CBS_PC4_LATEST_YEAR),
    },

    // ─── OV-haltes (OVapi GTFS) ─────────────────────────
    {
      id: "ov-haltes",
      labelProperties: ["stop_name"],
      name: "OV-haltes (alle modaliteiten)",
      endpoint: "gtfs.ovapi.nl/nl/gtfs-nl.zip",
      source: "OVapi GTFS",
      sourceUrl: "https://gtfs.ovapi.nl/nl/",
      description:
        "Alle haltes uit de landelijke OVapi GTFS-feed (bus, tram, metro, trein, veer)",
      category: "mobiliteitsdiensten",
      color: [0, 200, 220, 220],
      icon: "TrainFront",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 4,
      isNew: true,
      fetchData: async () => {
        const res = await fetch(`/api/ov-haltes?city=${city.slug}`);
        if (!res.ok) throw new Error(`OV-haltes laden mislukt: ${res.status}`);
        return res.json();
      },
    },
    {
      id: "ov-haltes-trein",
      labelProperties: ["stop_name"],
      name: "OV-haltes - Trein (NS/IFF)",
      endpoint: "gtfs.ovapi.nl/nl/gtfs-nl.zip",
      source: "OVapi GTFS",
      sourceUrl: "https://gtfs.ovapi.nl/nl/",
      description:
        "Treinhaltes uit de OVapi GTFS-feed: stops met IFF-/NS-prefix of stationsnaam",
      category: "mobiliteitsdiensten",
      color: [255, 220, 0, 220],
      icon: "TrainFront",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 6,
      isNew: true,
      fetchData: async () => {
        const res = await fetch(
          `/api/ov-haltes?city=${city.slug}&filter=trein`
        );
        if (!res.ok)
          throw new Error(`OV-haltes (trein) laden mislukt: ${res.status}`);
        return res.json();
      },
    },

    // ─── BRON Verkeersongevallen (Esri NL / Rijkswaterstaat) ──
    // Esri Nederland mirror van het BRON-bestand. Service is publiek
    // toegankelijk en wordt jaarlijks bijgewerkt (2003 t/m 2024 op moment
    // van schrijven). We splitsen in vier lagen op basis van AP3_CODE
    // (afloopcategorie) en jaar; voor "letsel" combineren we Letsel +
    // Dodelijk via een ArcGIS where-clause.
    {
      id: "bron-ongevallen-totaal",
      labelProperties: ["AP3_CODE", "JAAR_VKL"],
      name: "Verkeersongevallen Totaal (BRON 2022-2024)",
      endpoint:
        "services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Verkeersongevallen/FeatureServer/0",
      source: "Esri NL / Rijkswaterstaat (BRON)",
      sourceUrl:
        "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
      description:
        "Alle door de politie geregistreerde verkeersongevallen 2022-2024 binnen de stadsbbox (BRON via Esri NL)",
      category: "veiligheid",
      color: [200, 100, 100, 200],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 4,
      defaultLimit: 2000,
      isNew: true,
      fetchData: async (full) =>
        fetchBronOngevallen(city, "JAAR_VKL>=2022", full),
    },
    {
      id: "bron-ongevallen-letsel",
      labelProperties: ["AOL_ID", "JAAR_VKL"],
      name: "Verkeersongevallen met Letsel (BRON 2022-2024)",
      endpoint:
        "services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Verkeersongevallen/FeatureServer/0",
      source: "Esri NL / Rijkswaterstaat (BRON)",
      sourceUrl:
        "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
      description:
        "Verkeersongevallen met letsel of dodelijke afloop 2022-2024 (BRON, AP3_CODE = Letsel/Dodelijk)",
      category: "veiligheid",
      color: [220, 60, 60, 220],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      defaultLimit: 2000,
      isNew: true,
      fetchData: async (full) =>
        fetchBronOngevallen(
          city,
          "JAAR_VKL>=2022 AND AP3_CODE IN ('Letsel','Dodelijk')",
          full
        ),
    },
    {
      id: "bron-ongevallen-dodelijk",
      labelProperties: ["JAAR_VKL"],
      name: "Dodelijke Verkeersongevallen (BRON 2003-2024)",
      endpoint:
        "services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Verkeersongevallen/FeatureServer/0",
      source: "Esri NL / Rijkswaterstaat (BRON)",
      sourceUrl:
        "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
      description:
        "Verkeersongevallen met dodelijke afloop sinds 2003 (BRON, AP3_CODE = Dodelijk)",
      category: "veiligheid",
      color: [120, 0, 0, 240],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 6,
      defaultLimit: 2000,
      isNew: true,
      fetchData: async (full) =>
        fetchBronOngevallen(city, "AP3_CODE='Dodelijk'", full),
    },
    {
      id: "bron-ongevallen-voetganger",
      labelProperties: ["AP3_CODE", "JAAR_VKL"],
      name: "Ongevallen met Voetganger (BRON 2022-2024)",
      endpoint:
        "services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Verkeersongevallen/FeatureServer/0",
      source: "Esri NL / Rijkswaterstaat (BRON)",
      sourceUrl:
        "https://www.rijkswaterstaat.nl/apps/geoservices/geodata/dmc/bron",
      description:
        "Verkeersongevallen waarbij een voetganger betrokken was 2022-2024 (BRON, AOL_ID = Voetganger)",
      category: "veiligheid",
      color: [255, 140, 0, 220],
      icon: "ShieldAlert",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      defaultLimit: 2000,
      isNew: true,
      fetchData: async (full) =>
        fetchBronOngevallen(
          city,
          "JAAR_VKL>=2022 AND AOL_ID='Voetganger'",
          full
        ),
    },

    // ─── AHN hoogtekaart (national raster, served via PDOK WMTS) ──
    // Note: this is a raster, not a vector layer; deck.gl expects FeatureCollection,
    // so we expose it as an empty stub for now and document it as a roadmap item.
    // Implementation deferred to phase D.

    // ─── PDOK AHN (raster-only — vector overlay nog niet ondersteund) ─
    {
      id: "pdok-ahn-dsm",
      name: "AHN DSM 0.5m (Hoogte oppervlak)",
      endpoint: "service.pdok.nl/rws/ahn/wms/v1_0",
      source: "PDOK AHN",
      sourceUrl: "https://www.ahn.nl",
      description:
        "Hoogtemodel oppervlak (DSM 0.5m) — alleen als raster (WMS), vector-overlay nog niet ondersteund",
      category: "bodem-ondergrond",
      color: [120, 120, 120, 80],
      icon: "Mountain",
      visible: false,
      loading: false,
      availability: "stub",
      isNew: true,
      fetchData: fetchEmpty,
    },
    {
      id: "pdok-ahn-dtm",
      name: "AHN DTM 0.5m (Maaiveld)",
      endpoint: "service.pdok.nl/rws/ahn/wms/v1_0",
      source: "PDOK AHN",
      sourceUrl: "https://www.ahn.nl",
      description:
        "Hoogtemodel maaiveld (DTM 0.5m, gebouwen verwijderd) — alleen als raster (WMS), vector-overlay nog niet ondersteund",
      category: "bodem-ondergrond",
      color: [120, 120, 120, 80],
      icon: "Mountain",
      visible: false,
      loading: false,
      availability: "stub",
      isNew: true,
      fetchData: fetchEmpty,
    },

    // ─── RIVM Atlas Leefomgeving — windturbines (locaties + geluid) ─
    {
      id: "rivm-windturbines-locaties",
      labelProperties: ["naam", "kw"],
      name: "Windturbines (locaties)",
      endpoint: "data.rivm.nl/geo/alo/wfs",
      source: "RIVM / Atlas Leefomgeving",
      sourceUrl: "https://www.atlasleefomgeving.nl",
      description:
        "Bestaande windturbines met vermogen in MW — RIVM 2024",
      category: "energie",
      color: [60, 130, 220, 220],
      icon: "Wind",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 6,
      defaultLimit: 1000,
      isNew: true,
      freshness: { frequency: "ad-hoc", reference: "2024" },
      fetchData: async (full) =>
        fetchPDOKWFS(
          "alo:rivm_20240101_Windturbines_vermogen",
          "https://data.rivm.nl/geo/alo/wfs",
          bboxWFS,
          1000,
          full
        ),
    },

    // ─── RIVM Atlas Leefomgeving — gezondheid: geluidnorm Lden ──
    {
      id: "rivm-geluid-combinatie-lden",
      name: "Lden combinatie alle bronnen 2020",
      endpoint: "data.rivm.nl/geo/alo/wms",
      source: "RIVM / Atlas Leefomgeving",
      sourceUrl: "https://www.atlasleefomgeving.nl",
      description:
        "Cumulatieve geluidbelasting Lden (alle bronnen: weg, rail, lucht, industrie) — RIVM 2020. Raster-only — WMS overlay support komt later.",
      category: "gezondheid-norm",
      color: [120, 120, 120, 80],
      icon: "Volume2",
      visible: false,
      loading: false,
      availability: "stub",
      freshness: { frequency: "ad-hoc", reference: "2020" },
      fetchData: fetchEmpty,
    },
    {
      id: "rivm-windturbines-geluid",
      labelProperties: ["buurtnaam", "b_gel_wtn"],
      name: "Windturbinegeluid Lden 2024 (per buurt)",
      endpoint: "data.rivm.nl/geo/alo/wfs",
      source: "RIVM / Atlas Leefomgeving",
      sourceUrl: "https://www.atlasleefomgeving.nl",
      description:
        "Lden geluidcontouren rond bestaande windturbines — RIVM 2024 (geaggregeerd per buurt)",
      category: "gezondheid-norm",
      color: [180, 140, 220, 120],
      icon: "Wind",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 1000,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "b_gel_wtn",
      freshness: { frequency: "ad-hoc", reference: "2024" },
      fetchData: async (full) =>
        fetchPDOKWFS(
          "alo:rivm_20251201_geluidhinder_bu_windturbine_2024",
          "https://data.rivm.nl/geo/alo/wfs",
          bboxWFS,
          1000,
          full
        ),
    },

    // ─── PDOK RIONED — Beheer Stedelijk Water (riolering) ──
    {
      id: "pdok-rioned-beheerleiding",
      labelProperties: ["naam"],
      name: "Riolering BeheerLeiding",
      endpoint: "service.pdok.nl/rioned/beheerstedelijkwater/wfs/v1_0",
      source: "Stichting RIONED",
      sourceUrl: "https://www.riool.net/gwsw",
      description:
        "Riolering BeheerLeiding — gemeentelijke openbare riolering, gepubliceerd via Stichting RIONED",
      category: "gebouwen-infra",
      color: [80, 60, 140, 200],
      icon: "Pipette",
      visible: false,
      loading: false,
      lineWidth: 1,
      defaultLimit: 1000,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "beheerstedelijkwater:BeheerLeiding",
          "https://service.pdok.nl/rioned/beheerstedelijkwater/wfs/v1_0",
          bboxWFS,
          1000,
          full
        ),
    },

    // ─── PDOK Fietsplatform — Regionale Fietsnetwerken (raster-only) ──
    {
      id: "pdok-fietsnetwerk-regionaal",
      name: "Regionale Fietsnetwerken",
      endpoint: "service.pdok.nl/fietsplatform/regionale-fietsnetwerken/wms/v1_0",
      source: "Stichting Landelijk Fietsplatform",
      sourceUrl: "https://www.fietsplatform.nl",
      description:
        "Knooppuntenroutes en LF-routes (regionaal + landelijk) — Stichting Landelijk Fietsplatform. Raster-only — WMS overlay support komt later.",
      category: "mobiliteitsdiensten",
      color: [60, 120, 220, 200],
      icon: "Bike",
      visible: false,
      loading: false,
      availability: "stub",
      isNew: true,
      fetchData: fetchEmpty,
    },

    // ─── Telraam — Burger-getelde verkeerstellingen ──
    {
      id: "telraam-segments",
      labelProperties: ["segment_id"],
      name: "Telraam verkeerstellingen",
      endpoint: "telraam-api.net/v1/segments/active",
      source: "Telraam",
      sourceUrl: "https://telraam.net/nl",
      description:
        "Burger-getelde verkeerstellingen (auto, vracht, fiets, voetganger) per straatsegment — actieve sensoren via Telraam-API. Vereist TELRAAM_API_KEY.",
      category: "verkeer-logistiek",
      color: [40, 180, 140, 220],
      icon: "Activity",
      visible: false,
      loading: false,
      lineWidth: 2,
      defaultLimit: 5000,
      isNew: true,
      accessType: "restricted",
      freshness: { frequency: "realtime", note: "vereist API-sleutel" },
      fetchData: async () => fetchTelraamSegments(city.bbox),
    },

    // ─── BZK Leefbaarometer 3.1 — leefbaarheid per buurt ──
    {
      id: "bzk-leefbaarometer",
      labelProperties: ["name", "kscore"],
      name: "Leefbaarometer 3.1 (per buurt)",
      endpoint: "geo.leefbaarometer.nl/wfs",
      source: "BZK Leefbaarometer",
      sourceUrl: "https://www.leefbaarometer.nl",
      description:
        "Leefbaarheidsscore per buurt 1.0–9.0 (zeer onvoldoende → uitstekend) — Ministerie van BZK, Leefbaarometer v3.1 (peiljaar 2024)",
      category: "sociaal-economisch",
      color: [120, 180, 80, 120],
      icon: "Smile",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 1000,
      isNew: true,
      colorMode: "auto-bucket",
      bucketProperty: "kscore",
      freshness: { frequency: "biennial", reference: "3.1 (2024)" },
      fetchData: async (full) =>
        fetchPDOKWFS(
          "lbm3:buurtscore24",
          "https://geo.leefbaarometer.nl/wfs",
          bboxWFS,
          1000,
          full
        ),
    },

    // ─── Bestuurlijke grenzen ─────────────────────────────────────────────
    // Cat: gebouwen-infra (boundary overlays) ────────────────────────────

    {
      id: "bag-woonplaats",
      labelProperties: ["woonplaats"],
      name: "BAG Woonplaatsen",
      endpoint: "service.pdok.nl/lv/bag/wfs/v2_0",
      source: "PDOK / BAG",
      description:
        "Woonplaatspolygonen uit de BAG (BRP) — administratieve plaatsbegrenzing",
      category: "bestuurlijke-grenzen",
      color: [255, 160, 40, 80],
      icon: "Home",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1.5,
      defaultLimit: 50,
      isNew: true,
      fetchData: async (full) =>
        fetchPDOKWFS(
          "bag:woonplaats",
          "https://service.pdok.nl/lv/bag/wfs/v2_0",
          bboxWFS,
          50,
          full
        ),
    },
    {
      id: "kadaster-gemeentegrenzen",
      labelProperties: ["naam"],
      name: "Kadaster Gemeentegrenzen 2026",
      endpoint: "service.pdok.nl/kadaster/bestuurlijkegebieden/wfs/v1_0",
      source: "PDOK / Kadaster",
      description:
        "Gemeentegrenzen actueel — Kadaster bestuurlijke gebieden (maandelijks bijgewerkt)",
      category: "bestuurlijke-grenzen",
      color: [80, 120, 200, 220],
      icon: "MapPin",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 10,
      isNew: true,
      freshness: { frequency: "monthly", reference: "2026" },
      fetchData: async (full) =>
        fetchPDOKWFS(
          "bestuurlijkegebieden:Gemeentegebied",
          "https://service.pdok.nl/kadaster/bestuurlijkegebieden/wfs/v1_0",
          bboxWFS,
          10,
          full
        ),
    },
    {
      id: "kadaster-provinciegrenzen",
      labelProperties: ["naam"],
      name: "Kadaster Provinciegrenzen 2026",
      endpoint: "service.pdok.nl/kadaster/bestuurlijkegebieden/wfs/v1_0",
      source: "PDOK / Kadaster",
      description:
        "Provinciegrenzen actueel — Kadaster bestuurlijke gebieden (maandelijks bijgewerkt)",
      category: "bestuurlijke-grenzen",
      color: [60, 80, 180, 220],
      icon: "Map",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2.5,
      defaultLimit: 5,
      isNew: true,
      freshness: { frequency: "monthly", reference: "2026" },
      fetchData: async (full) =>
        fetchPDOKWFS(
          "bestuurlijkegebieden:Provinciegebied",
          "https://service.pdok.nl/kadaster/bestuurlijkegebieden/wfs/v1_0",
          bboxWFS,
          5,
          full
        ),
    },
    {
      id: "kadaster-landgrens",
      labelProperties: ["naam"],
      name: "Kadaster Landsgrens",
      endpoint: "service.pdok.nl/kadaster/bestuurlijkegebieden/wfs/v1_0",
      source: "PDOK / Kadaster",
      description: "Landsgrens Nederland — Kadaster (maandelijks bijgewerkt)",
      category: "bestuurlijke-grenzen",
      color: [40, 40, 140, 220],
      icon: "Globe2",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 3,
      defaultLimit: 5,
      isNew: true,
      freshness: { frequency: "monthly", reference: "2026" },
      fetchData: async (full) =>
        fetchPDOKWFS(
          "bestuurlijkegebieden:Landgebied",
          "https://service.pdok.nl/kadaster/bestuurlijkegebieden/wfs/v1_0",
          bboxWFS,
          5,
          full
        ),
    },
    {
      id: "kadastrale-grens",
      name: "Kadastrale Grenzen (BRK v5)",
      endpoint: "service.pdok.nl/kadaster/kadastralekaart/wfs/v5_0",
      source: "PDOK / Kadaster",
      description:
        "Kadastrale grenzen tussen percelen — BRK v5 (lijngeometrie)",
      category: "bestuurlijke-grenzen",
      color: [160, 100, 200, 180],
      icon: "Spline",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 1000,
      isNew: true,
      freshness: { frequency: "monthly" },
      fetchData: async (full) =>
        fetchPDOKWFS(
          "kadastralekaart:KadastraleGrens",
          "https://service.pdok.nl/kadaster/kadastralekaart/wfs/v5_0",
          bboxWFS,
          1000,
          full
        ),
    },

    // Cat: sociaal-economisch (CBS grens/statistische eenheden) ──────────

    {
      id: "cbs-gemeentegrenzen",
      labelProperties: ["gemeentenaam", "aantalInwoners"],
      name: "CBS Gemeentegrenzen 2024",
      endpoint: "service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Gemeentegrenzen — CBS Wijken & Buurten 2024 (incl. demografische en statistische attributen)",
      category: "bestuurlijke-grenzen",
      color: [80, 140, 200, 200],
      icon: "MapPin",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 2,
      defaultLimit: 10,
      isNew: true,
      fetchData: async (full) => {
        const count = full ? 500 : 10;
        const data = await fetchPDOKWFS(
          "wijkenbuurten:gemeenten",
          "https://service.pdok.nl/cbs/wijkenbuurten/2024/wfs/v1_0",
          bboxWFS,
          count,
          full
        );
        return cleanCBSProperties(data);
      },
    },
    {
      id: "cbs-postcode6",
      labelProperties: ["postcode6"],
      name: "Postcode 6 Vlakken (CBS 2024)",
      endpoint: "service.pdok.nl/cbs/postcode6/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Postcode 6-vlakken op straatniveau — CBS statistieken per postcode 6 (2024)",
      category: "bestuurlijke-grenzen",
      color: [60, 180, 160, 80],
      icon: "Mailbox",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      defaultLimit: 500,
      isNew: true,
      freshness: { frequency: "annual", reference: "2024" },
      fetchData: async (full) => {
        const data = await fetchPDOKWFS(
          "postcode6:postcode6",
          "https://service.pdok.nl/cbs/postcode6/2024/wfs/v1_0",
          bboxWFS,
          full ? 5000 : 500,
          full
        );
        return cleanCBSProperties(data);
      },
    },
    {
      id: "cbs-postcode4-grens",
      labelProperties: ["postcode"],
      name: "Postcode 4 Grenzen (CBS 2024)",
      endpoint: "service.pdok.nl/cbs/postcode4/2024/wfs/v1_0",
      source: "PDOK / CBS",
      description:
        "Postcode 4-grenzen op buurt/straatniveau — outline only (fills via thematische PC4-lagen)",
      category: "bestuurlijke-grenzen",
      color: [40, 140, 200, 200],
      icon: "Mailbox",
      visible: false,
      loading: false,
      filled: false,
      stroked: true,
      lineWidth: 1.5,
      defaultLimit: 100,
      isNew: true,
      freshness: { frequency: "annual", reference: "2024" },
      fetchData: async (full) => {
        const data = await fetchPDOKWFS(
          "postcode4:postcode4",
          "https://service.pdok.nl/cbs/postcode4/2024/wfs/v1_0",
          bboxWFS,
          full ? 2000 : 100,
          full
        );
        return cleanCBSProperties(data);
      },
    },

    // ─── Topografie & Veiligheid (extra) ──────────────────────────────────

    // Cat: gebouwen-infra — BGT nummeraanduidingen ─────────────────────────
    {
      id: "bgt-nummeraanduiding",
      labelProperties: ["tekst"],
      name: "BGT Huisnummeraanduidingen",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1",
      source: "PDOK (BGT)",
      description:
        "BGT huisnummer-aanduidingen — kantoor- en woonadressen op kaart (pand_nummeraanduiding, BGT OGC API)",
      category: "gebouwen-infra",
      color: [180, 120, 255, 220],
      icon: "Hash",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 4,
      freshness: { frequency: "daily" },
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "pand_nummeraanduiding",
          bbox,
          1000,
          full
        ),
    },

    // Cat: gebouwen-infra — BGT openbare ruimte labels ─────────────────────
    {
      id: "bgt-openbare-ruimte",
      labelProperties: ["openbareruimtenaam"],
      name: "BGT Openbare Ruimte Labels",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1",
      source: "PDOK (BGT)",
      description:
        "BGT objecten in openbare ruimte — straatnamen, pleinen, parkjes (openbareruimtelabel, BGT OGC API)",
      category: "gebouwen-infra",
      color: [80, 180, 120, 220],
      icon: "Type",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      freshness: { frequency: "daily" },
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "openbareruimtelabel",
          bbox,
          1000,
          full
        ),
    },

    // Cat: verkeer-logistiek — BGT bruggen en tunnels ──────────────────────
    {
      id: "bgt-bruggen",
      labelProperties: ["hoort_bij_typeoverbrugging", "type_overbruggingsdeel"],
      name: "BGT Bruggen (Overbruggingsdelen)",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1",
      source: "PDOK (BGT)",
      description:
        "BGT overbruggingsdelen — civiele kunstwerken: bruggen, viaducten en aquaducten in basistopografie",
      category: "verkeer-logistiek",
      color: [200, 140, 60, 200],
      icon: "Construction",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      freshness: { frequency: "daily" },
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "overbruggingsdeel",
          bbox,
          1000,
          full
        ),
    },
    {
      id: "bgt-tunnels",
      name: "BGT Tunnels",
      endpoint: "api.pdok.nl/lv/bgt/ogc/v1",
      source: "PDOK (BGT)",
      description:
        "BGT tunneldelen — tunnels en onderdoorgangen in basistopografie",
      category: "verkeer-logistiek",
      color: [100, 100, 180, 200],
      icon: "Construction",
      visible: false,
      loading: false,
      filled: true,
      stroked: true,
      lineWidth: 1,
      freshness: { frequency: "daily" },
      fetchData: async (full) =>
        fetchPDOKOGCAPI(
          "https://api.pdok.nl/lv/bgt/ogc/v1",
          "tunneldeel",
          bbox,
          1000,
          full
        ),
    },

    // Cat: veiligheid — OSM brandkranen ────────────────────────────────────
    {
      id: "osm-brandkranen",
      labelProperties: ["ref"],
      name: "Brandkranen",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: `Brandkranen — fire hydrants in ${city.name} (via OpenStreetMap)`,
      category: "veiligheid",
      color: [220, 40, 40, 220],
      icon: "Flame",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      freshness: { frequency: "community" },
      fetchData: async () =>
        fetchOverpassGeoJSON(
          overpassNodesInArea(city, '["emergency"="fire_hydrant"]')
        ),
    },

    // Cat: verkeer-logistiek — OSM verkeersdrempels ────────────────────────
    {
      id: "osm-verkeersdrempels",
      labelProperties: ["traffic_calming"],
      name: "Verkeersdrempels",
      endpoint: "overpass-api.de/api/interpreter",
      source: "OpenStreetMap",
      description: `Verkeersdrempels — speed bumps, humps, plateaus en cushions in ${city.name} (via OpenStreetMap)`,
      category: "verkeer-logistiek",
      color: [255, 160, 20, 220],
      icon: "Mountain",
      visible: false,
      loading: false,
      pointType: "scatterplot",
      radius: 5,
      freshness: { frequency: "community" },
      fetchData: async () =>
        fetchOverpassGeoJSON(
          `[out:json][timeout:25];area["name"="${city.overpassArea}"]["admin_level"="8"]->.searchArea;(node["traffic_calming"="bump"](area.searchArea);node["traffic_calming"="hump"](area.searchArea);node["traffic_calming"="table"](area.searchArea);node["traffic_calming"="cushion"](area.searchArea);node["highway"="speed_table"](area.searchArea););out body;`
        ),
    },

    // Cat: veiligheid — Pointer Onveilige Plekken (stub) ───────────────────
    {
      id: "pointer-onveilige-plekken",
      name: "Onveilige Plekken (Pointer)",
      endpoint: "pointer.kro-ncrv.nl",
      source: "KRO-NCRV Pointer",
      sourceUrl: "https://pointer.kro-ncrv.nl",
      description:
        "Burgermeldingen van onveilige plekken — KRO-NCRV Pointer burgerwetenschap. Data nog niet ontsloten via publiek GeoJSON-eindpunt.",
      category: "veiligheid",
      color: [255, 120, 0, 220],
      icon: "AlertTriangle",
      visible: false,
      loading: false,
      isNew: true,
      availability: "stub" as const,
      pointType: "scatterplot",
      radius: 7,
      freshness: { frequency: "ad-hoc" },
      fetchData: async () => fetchEmpty(),
    },
  ];

  return layers;
}

// Mark all layers from this module as live (they work for any city).
// Used by the orchestrator in index.ts.
export function markNationalLive(layers: DataSource[]): DataSource[] {
  return layers.map((l) => ({ ...l, availability: "live" as const }));
}
