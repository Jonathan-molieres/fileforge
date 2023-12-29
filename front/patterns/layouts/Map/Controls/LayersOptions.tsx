"use client";

import SurfaceType from "@/models/geographics/SurfaceType";
import Map from "@/models/projects/ProjectMap";
import { ThematicType } from "@/models/surveys/Thematic";
import theme from "@/patterns/ThemeRegistry/theme";
import { _ } from "@/utils";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Divider, FormGroup, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import { observer } from "mobx-react";
import React from "react";
import app from "@/models/app";

interface LayersDrawerProps {
  projectMap: Map;
}

export default observer(function LayersDrawer({ projectMap }: LayersDrawerProps) {
  const types = Object.values(app.geographics.surfaceTypes);

  const surfacesByThematics: {
    label: React.ReactNode;
    surfaces: SurfaceType[];
  }[] = [
    {
      label: _("Biodiversité"),
      surfaces: types.filter((type) => type?.thematic?.type === ThematicType.BIODIVERSITY),
    },
    {
      label: _("Artificialisation des sols"),
      surfaces: types.filter((type) => type?.thematic?.type === ThematicType.LAND_USE),
    },
  ];

  const handleMouseEnter = () => {
    projectMap.setIsEventDisabled(true);
  };

  const handleMouseLeave = () => {
    projectMap.setIsEventDisabled(false);
  };

  const handleSelectSurface = (surface: SurfaceType) => () => {
    projectMap.toggleSurfaceType(surface);
  };

  const handlToggleLayersOptions = (e: React.MouseEvent<HTMLElement>) => {
    projectMap.setShowLayersOptions(!projectMap.showLayersOptions);
  };

  return (
    <Drawer
      open={projectMap.showLayersOptions}
      anchor="right"
      variant="persistent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        zIndex: "9999",
        "& div[class*=MuiPaper-root-MuiDrawer-paper]": {
          padding: "6rem 4rem",
          marginTop: "8rem",
          height: "calc(100% - 8rem)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "1.4rem",
          right: "2.4rem",
        }}
      >
        <Button
          endIcon={<CloseIcon color={"primary"} />}
          onClick={handlToggleLayersOptions}
          color={"secondary"}
          variant="text"
        >
          {_("Fermer")}
        </Button>
      </Box>
      <Typography
        sx={{
          fontSize: "1.4rem",
          "& span": {
            fontWeight: 800,
          },
        }}
      >
        Activer les couches pour les faire <span>apparaitre ou disparaitre</span>
      </Typography>
      <Divider
        sx={{
          margin: "3rem 0",
        }}
      />
      {surfacesByThematics.map(({ label, surfaces }) => (
        <>
          <Accordion
            sx={{
              border: "none",
              "& .Mui-expanded .MuiTypography-root": {
                color: theme.palette.tertiary[500],
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                flexDirection: "row",
                margin: "0rem",
                minHeight: "auto",
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.tertiary[500],
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {Object.values(surfaces).map((surface) => (
                  <FormControlLabel
                    key={surface.type}
                    control={
                      <Checkbox
                        onChange={handleSelectSurface(surface)}
                        checked={projectMap.isSelectedSurfaceType(surface)}
                        sx={{
                          [`&, &.${checkboxClasses.checked}`]: {
                            color: surface.color,
                          },
                        }}
                      />
                    }
                    label={surface.label}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
          <Divider
            sx={{
              margin: "3rem 0",
            }}
          />
        </>
      ))}
    </Drawer>
  );
});
