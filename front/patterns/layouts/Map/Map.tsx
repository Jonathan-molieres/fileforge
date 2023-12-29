"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import Controls from "@/patterns/projects/Map/Controls";
import Layers from "@/patterns/projects/Map/Layers";
import LayersLegend from "@/patterns/projects/Map/Layers/LayersLegend";
import Box from "@mui/material/Box";
import L from "leaflet";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { MapContainer } from "react-leaflet";

export interface ProjectMapProps {
  projectMap: ProjectMap;
}

export default observer(function _ProjectMap({ projectMap }: ProjectMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  console.log(projectMap);
  const localizationDesign =
    projectMap.isLocalization === true
      ? {
          height: "100%",
        }
      : {};

  useEffect(() => {
    if (map) {
      projectMap.setMap(map);
      projectMap.fitBounds();
      L.control.scale({ maxWidth: 240, metric: true, imperial: false, position: "bottomleft" }).addTo(map);
    }
  }, [map]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          aspectRatio: "11 / 5",
          width: "100%",
          padding: "1rem",
          zIndex: "5",
          ...localizationDesign,
        }}
      >
        <Box
          id="map"
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            component={MapContainer}
            zoom={15}
            ref={setMap}
            center={projectMap.project.locationPoint?.latlng ?? [46.227638, 2.213749]}
            sx={{
              position: "relative",
              zIndex: 1,
              borderRadius: "2rem",
              "& .leaflet-container": {
                width: "100%",
                height: "100%",
              },
            }}
          >
            <Controls projectMap={projectMap} />
            <Layers projectMap={projectMap} />
          </Box>
        </Box>
      </Box>
      {projectMap.showLegends && <LayersLegend projectMap={projectMap} />}
    </Box>
  );
});
