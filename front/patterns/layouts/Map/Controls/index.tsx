"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import { Box } from "@mui/material";
import { observer } from "mobx-react";
import ButtonsGroup from "./ButtonsGroup";
import DrawingFeature from "./DrawingFeature";
import LayersOptions from "./LayersOptions";

export interface ControlsProps {
  projectMap: ProjectMap;
}

export default observer(function Controls({ projectMap }: ControlsProps) {
  return (
    <Box>
      <ButtonsGroup projectMap={projectMap} />
      <DrawingFeature projectMap={projectMap} />
      {projectMap.thematics.length !== 0 && projectMap.showDrawer && <LayersOptions projectMap={projectMap} />}
    </Box>
  );
});
