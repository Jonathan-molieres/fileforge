"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import L from "leaflet";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { LayerGroup, Marker } from "react-leaflet";
import { geometryExtendedPathOptions, polygonPathOptions } from "../PathOptions";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

export default observer(function ProjectLayers({ projectMap }: { projectMap: ProjectMap }) {
  const project = projectMap.project;
  useEffect(() => {
    const layers: L.GeoJSON[] = [];
    if (projectMap.map && project.geometry?.type) {
      layers.push(new L.GeoJSON(project.geometry.geojson, polygonPathOptions(projectMap)));
      if (project.geometryExtended) {
        layers.push(new L.GeoJSON(project.geometryExtended.geojson, geometryExtendedPathOptions(projectMap)));
      }
    }
    if (projectMap.map) {
      layers.forEach((layer: L.GeoJSON, index: number) => {
        projectMap.map?.addLayer(layer);
        index === 0 &&
          layer.eachLayer((layer) => {
            try {
              // TODO: code the right declaration for this plugin
              // @ts-ignore
              layer.showMeasurements();
            } catch (e) {
              console.warn(e);
            }
          });
      });
    }

    return () => {
      layers.forEach((layer) => {
        projectMap.map?.removeLayer(layer);
      });
    };
  }, [projectMap.map, project.geometryExtensionRadius, project.geometry]);

  return (
    <LayerGroup>
      {/* {project.geometry?.type === "Polygon" && (
        <Polygon pathOptions={polygonPathOptions(projectMap)} positions={project.geometry.positions} />
      )}
      {project.geometry?.type === "MultiPolygon" && (
        <Polygon pathOptions={polygonPathOptions(projectMap)} positions={project.geometry.positions} />
      )}
      {project.geometry?.type === "LineString" && (
        <Polyline pathOptions={polylinePathOptions(projectMap)} positions={project.geometry.positions} />
      )}
      {project.geometry?.type === "MultiLineString" && (
        <Polyline pathOptions={polylinePathOptions(projectMap)} positions={project.geometry.positions} />
      )}
      {project.geometryExtended && (
        <Polygon pathOptions={geometryExtendedPathOptions(projectMap)} positions={project.geometryExtended.positions} />
      )} */}
      {project.locationPoint && <Marker position={project.locationPoint?.latlng}></Marker>}
    </LayerGroup>
  );
});
