"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import ThematicLayers from "@/patterns/projects/Map/Layers/ThematicLayers";
import { observer } from "mobx-react";
import { LayerGroup } from "react-leaflet";
import BackFrameLayer from "./BackFrameLayer";
import LandRegistryLayers_Draft from "./LandRegistryLayers_Draft";
import ProjectLayers from "./ProjectLayers";

export interface ProjectMapLayersProps {
  projectMap: ProjectMap;
}

export default observer(function ProjectMapLayers({ projectMap }: ProjectMapLayersProps) {
  const thematics = projectMap.thematics;

  return (
    <LayerGroup>
      <BackFrameLayer projectMap={projectMap} />

      {/* <LandRegistryLayers  /> */}
      <LandRegistryLayers_Draft projectMap={projectMap} />
      <ProjectLayers projectMap={projectMap} />
      {thematics.map((thematic) => (
        <ThematicLayers key={thematic.id} thematic={thematic} projectMap={projectMap} />
      ))}
    </LayerGroup>
  );
});
