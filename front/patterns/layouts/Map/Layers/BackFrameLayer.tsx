"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import { LatLngBounds } from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import LeafletVectorTileLayer from "leaflet-vector-tile-layer";
import "leaflet/dist/leaflet.css";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { TileLayerProps as LeafletTileLayerProps, TileLayer } from "react-leaflet";

interface TileLayersProps extends LeafletTileLayerProps {
  apikey?: string;
  format?: string;
  style?: string | Object;
  styleUrl?: string;
}

const TILES: { [name: string]: TileLayersProps } = {
  default: {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 22,
  },
  CartoDB_Positron: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 22,
  },
  France_Cadastre: {
    url: "https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',

    apikey: "choisirgeoportail",
    format: "image/png",
    style: "PCI vecteur",
    bounds: new LatLngBounds([
      [-75, -180],
      [81, 180],
    ]),
    minZoom: 2,
    maxZoom: 20,
  },

  openMaptilesCadastre: {
    url: "https://openmaptiles.geo.data.gouv.fr/data/cadastre/{z}/{x}/{y}.pbf", // Vector PBF tiles
    maxZoom: 22,
    style: {
      color: "black",
      fillColor: null,
      opacity: 0.4,
      fillOpacity: 0,
      weight: 1,
      interactive: false,
    },
  },

  Esri_WorldGrayCanvas: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    maxZoom: 22,
  },
};

// Benedicte authier => lister les solutions de tuiles

export default observer(function TileLayers({ projectMap }: { projectMap: ProjectMap }) {
  return (
    <>
      <TileLayer {...TILES.CartoDB_Positron} />
      {/* <TileLayer {...TILES.France_Cadastre} /> */}
      <VectorTileLayer map={projectMap.map} {...TILES.openMaptilesCadastre} />
    </>
  );
});

function VectorTileLayer({ map, url, style }: TileLayersProps & { map?: L.Map }) {
  useEffect(() => {
    const landRegistriesLayer = new LeafletVectorTileLayer(url, {
      maxDetailZoom: 16,
      maxZoom: 20,
      //   style: myStyle,
      //   style: style
    });

    if (map) {
      //   map.addLayer(landRegistriesLayer);
    }

    return () => {
      //   map?.removeLayer(landRegistriesLayer);
    };
  }, [map]);

  return null;
}

// function myStyle(feature: string, layerName: string, zoom: number) {
//   // console.log(feature, layerName, zoom)
//   if (layerName == "parcelles") {
//     return {
//       color: "black",
//       fillColor: null,
//       opacity: 0.4,
//       fillOpacity: 0,
//       weight: 1,
//       interactive: false,
//     };
//   }
// }
