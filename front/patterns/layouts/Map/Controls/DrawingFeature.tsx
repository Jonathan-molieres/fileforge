"use client";

import Map from "@/models/projects/ProjectMap";
import { Geometry } from "@/utils";
import { observer } from "mobx-react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

interface DrawingToolsProps {
  projectMap: Map;
}

export default observer(function DrawingTools({ projectMap }: DrawingToolsProps) {
  const project = projectMap.project;
  const handlePolygonCreated = async (e: any) => {
    setGeometry(e.layer.toGeoJSON().geometry);
  };

  const handlePolygonEdited = async (e: any) => {
    setGeometry(e.layers.getLayers()[0].toGeoJSON().geometry);
  };

  const setGeometry = async (geometryFromDraw: any) => {
    const geometry = new Geometry(geometryFromDraw);
    project.set("geometry", geometry);
    projectMap.fitBounds({ geometryOnly: true });
  };

  //   --- PLACE MARKER REMOVED ON CLICK / ONLY WAY TO PLACE MARKER FROM NOW ON IS TO CHANGE THE ADDRESS---
  //   useEffect(() => {
  //     const placeMarker = async (e: any) => {
  //       if (project?.map.isDrawing && !project?.map.isEventDisabled && !project?.map.showLandRegistries) {
  //         const { lat, lng } = e.latlng;
  //         const address = await Geocoding.reverse(
  //           {
  //             lat: lat,
  //             lon: lng,
  //           },
  //           { countryCode: project?.country?.numeric }
  //         );

  //         project.set("locationPoint", new Geometry({ type: "Point", coordinates: [lng, lat] }));
  //         project.set("locationAddress", address.formattedAddress);
  //       }
  //     };

  //     project.map.map?.on("click", placeMarker);

  //     return () => {
  //       project.map.map?.off("click", placeMarker);
  //     };
  //   }, [project.map.map, project?.map.isDrawing, project.map.showLandRegistries]);

  return (
    projectMap.showEditControl && (
      <FeatureGroup>
        <EditControl
          // edit={{
          //   featureGroup: project.geometry?.json,
          // }}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: true,
            polygon: true,
          }}
          position="topright"
          // onEditStop={handlePolygonChange}
          onCreated={handlePolygonCreated}
          onEdited={handlePolygonEdited}
          // onDeleted={handlePolygonChange}
        />
      </FeatureGroup>
    )
  );
});
