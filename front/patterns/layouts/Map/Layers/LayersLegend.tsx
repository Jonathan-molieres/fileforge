"use client";

import app from "@/models/app";
import ProjectMap from "@/models/projects/ProjectMap";
import { ThematicType } from "@/models/surveys/Thematic";
import * as constants from "@/patterns/ThemeRegistry/constants";
import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react";

interface LayersLegendProps {
  projectMap: ProjectMap;
}

export default observer(function LayersLegend({ projectMap }: LayersLegendProps) {
  const shapeStyles = { width: 16, height: 16 };
  const shapeCircleStyles = { borderRadius: "50%" };
  const projectMapLayerThematic = Object.values(projectMap.thematics)[0].type;
  console.log("app.geographics.surfaceTypes", app.geographics.surfaceTypes);
  const types = Object.values(app.geographics.surfaceTypes).filter(
    (type) => type?.thematic?.type === projectMapLayerThematic
  );
  const legendCenterDesign =
    projectMapLayerThematic !== ThematicType.LAND_USE
      ? {
          justifyContent: "center",
        }
      : {};

  return (
    <Box
      sx={{
        display: "grid",
        gap: "3rem",
        maxWidth: "90rem",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          color: constants.nightBlue[300],
        }}
      >
        {/*BUILD_UP*/}
        {types
          .filter((type) => type.type === "BUILT_UP")
          .map((type) => (
            <Box
              key={type.id}
              sx={{
                flex: "1 0 auto",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  lineHeight: "1.8rem",
                  margin: "revert",
                  marginTop: 0,
                }}
              >
                Construit/built-up :
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "3rem",
                  color: constants.nightBlue[300],
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Box component="span" sx={{ backgroundColor: type.color, ...shapeStyles, ...shapeCircleStyles }} />
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  >
                    {type.label}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}

        {/*SEPARATION*/}
        {projectMapLayerThematic === ThematicType.LAND_USE && (
          <Box
            sx={{
              backgroundColor: constants.nightBlue[100],
              width: "0.2rem",
              height: "100%",
            }}
          ></Box>
        )}

        {/*OTHERS*/}
        <Box
          sx={{
            flex: "1 1 auto",
          }}
        >
          {projectMapLayerThematic === ThematicType.LAND_USE && (
            <Typography
              sx={{
                fontSize: "1.2rem",
                lineHeight: "1.8rem",
                margin: "revert",
                marginTop: 0,
              }}
            >
              Espaces naturels, agricoles et forestiers :
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              color: constants.nightBlue[300],
              ...legendCenterDesign,
            }}
          >
            {types
              .filter((type) => type.type !== "BUILT_UP")
              .map((type) => (
                <Box
                  key={type.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginRight: "2rem",
                  }}
                >
                  <Box component="span" sx={{ backgroundColor: type.color, ...shapeStyles, ...shapeCircleStyles }} />
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  >
                    {type.label}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: "1.2rem",
          color: constants.nightBlue[300],
          textAlign: "center",
        }}
      >
        Sources JJ/MM/AAAA - INPN - Données non-exhaustives
      </Typography>
    </Box>
  );
});
