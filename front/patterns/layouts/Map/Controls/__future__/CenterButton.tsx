"use client";

import { IconButton } from "@/generic";
import Project from "@/models/projects/Project";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { observer } from "mobx-react";

export default observer(function CenterButton({ project }: { project: Project }) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    project.map.fitBounds();
  };

  // Render
  return (
    <>
      {(project.locationPoint || project.geometry) && (
        <IconButton size="medium" icon="location" onMouseDown={handleClick} />
      )}
    </>
  );
});
