"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import { IconButton, IconButtonProps, Paper } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { FeatureGroup } from "react-leaflet";
import CenterIcon from "../Icons/CenterIcon";
import LayersIcon from "../Icons/LayersIcon";
import ZoomInIcon from "../Icons/ZoomInIcon";
import ZoomOutIcon from "../Icons/ZoomOutIcon";

interface ButtonsGroup {
  projectMap: ProjectMap;
}

export default observer(function Controls({ projectMap }: ButtonsGroup) {
  const project = projectMap.project;

  const handlToggleLayersOptions = (e: React.MouseEvent<HTMLElement>) => {
    projectMap.setShowLayersOptions(!projectMap.showLayersOptions);
  };

  const handleCenter = (e: React.MouseEvent<HTMLElement>) => {
    projectMap.fitBounds();
  };

  const handleMouseEnter = () => {
    projectMap.setIsEventDisabled(true);
  };

  const handleMouseLeave = () => {
    projectMap.setIsEventDisabled(false);
  };

  const handleZoom = (delta: number) => (e: React.MouseEvent<HTMLElement>) => {
    projectMap.map && projectMap.map.setZoom(projectMap.map.getZoom() + delta);
  };

  return (
    <FeatureGroup>
      <Paper
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          position: "absolute",
          zIndex: "800",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          borderRadius: "0.25rem 0rem 0rem 0.25rem",
          display: "grid",
        }}
      >
        {projectMap.showDrawer && (
          <MapButton aria-label="layers" onClick={handlToggleLayersOptions}>
            <LayersIcon />
          </MapButton>
        )}
        <MapButton aria-label="center" onClick={handleCenter} disabled={!(project.locationPoint || project.geometry)}>
          <CenterIcon />
        </MapButton>
        <MapButton aria-label="zoom out" onClick={handleZoom(-1)}>
          <ZoomOutIcon />
        </MapButton>
        <MapButton aria-label="zoom in" onClick={handleZoom(1)}>
          <ZoomInIcon />
        </MapButton>
        {/*<MapButton aria-label="trash">*/}
        {/*  <TrashIcon />*/}
        {/*</MapButton>*/}
      </Paper>
    </FeatureGroup>
  );
});

function MapButton({ ...props }: IconButtonProps) {
  return (
    <IconButton
      sx={{
        backgroundColor: "transparent",
        color: "primary.dark",
      }}
      edge={false}
      size="large"
      {...props}
    >
      {React.cloneElement(props.children as React.ReactElement, { fontSize: "large" })}
    </IconButton>
  );
}
