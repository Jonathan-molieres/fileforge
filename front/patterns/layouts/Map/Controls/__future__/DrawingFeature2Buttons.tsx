"use client";

import Project from "@/models/projects/Project";
import { DrawingType } from "@/models/projects/ProjectMap";
import { _ } from "@/utils";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditRoadIcon from "@mui/icons-material/EditRoad";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { Box, Button, IconButton, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { observer } from "mobx-react";
import { FeatureGroup } from "react-leaflet";

const paperSx = {
  display: "grid",
  gap: 1,
  p: 1,
  gridTemplateRows: "1fr ",
  //   minWidth: "15rem",
  position: "absolute",
  top: "1rem",
  zIndex: 9999,
  "& button": {
    whiteSpace: "nowrap",
  },
};

export default observer(function Controls({ project }: { project: Project }) {
  const map = project.map;

  const handleChangeType = (event: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      map.setDrawingType(value as DrawingType);
    }
  };

  const handleDrawing = () => {
    map.setIsDrawing(true);
  };

  const handeCancel = () => {
    map.setIsDrawing(false);
  };

  const handleSave = () => {
    map.saveDrawing();
  };

  const handleClear = () => {
    map.clearPoints();
  };

  const handleRemoveLastPoint = () => {
    map.removeLastPoint();
  };

  const handleMouseEnter = () => {
    map.setIsEventDisabled(true);
  };

  const handleMouseLeave = () => {
    map.setIsEventDisabled(false);
  };

  return (
    <FeatureGroup>
      {map.isDrawing && (
        <Paper
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            ...paperSx,
            left: "1rem",
          }}
        >
          <Button fullWidth variant="contained" color="error" onClick={handleClear} startIcon={<DeleteForeverIcon />}>
            {_("Clear")}
          </Button>
          <Button fullWidth variant="contained" color="error" onClick={handleRemoveLastPoint} startIcon={<ClearIcon />}>
            {_("Remove last point")}
          </Button>
        </Paper>
      )}
      <Paper
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          ...paperSx,
          right: "1rem",
        }}
      >
        {map.isDrawing ? (
          <>
            <Box>
              <IconButton onClick={handeCancel} value={""} aria-label="type roads">
                <HighlightOffIcon color="error" sx={{ fontSize: 25 }} />
              </IconButton>
              <ToggleButtonGroup
                fullWidth
                exclusive
                value={map.drawingType}
                onChange={handleChangeType}
                aria-label="type"
              >
                <ToggleButton value="roads" aria-label="type roads">
                  <EditRoadIcon sx={{ fontSize: 25 }} />
                </ToggleButton>
                <ToggleButton value="buildings" aria-label="type buildings">
                  <HomeWorkIcon sx={{ fontSize: 25 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Button fullWidth variant="contained" color="success" onClick={handleSave}>
              {_("Save")}
            </Button>
          </>
        ) : (
          <>
            <Button fullWidth variant="contained" color="success" onClick={handleDrawing}>
              {_("Edit geometry")}
            </Button>
          </>
        )}
      </Paper>
    </FeatureGroup>
  );
});
