"use client";

import type { LeafletElement } from "@react-leaflet/core";
import type { Layer } from "leaflet";
import vectorTileLayer from "leaflet-vector-tile-layer";

function myStyle(feature: string, layerName: string, zoom: number) {
  // console.log(feature, layerName, zoom)
  if (layerName == "parcelles") {
    return {
      color: "black",
      fillColor: null,
      opacity: 0.4,
      fillOpacity: 0,
      weight: 1,
      interactive: false,
    };
  }
}

export default function VectorTileLayer({ element }: { element: LeafletElement<Layer> }) {
  //   const context = useLeafletContext();
  const layer = vectorTileLayer(URL, Option);

  //   console.log(element, context);
  return null;
}
