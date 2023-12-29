"use client";

import app from "@/models/app";
import ProjectMap from "@/models/projects/ProjectMap";
import SurfaceOverlap from "@/models/surveys/SurfaceOverlap";
import Thematic, { ThematicType } from "@/models/surveys/Thematic";
import VectorTileLayer from "@/utils/VectorTileLayer";
import { alpha } from "@mui/material";
import L, { PathOptions } from "leaflet";
import { observer } from "mobx-react";
import { useCallback, useEffect, useState } from "react";

interface VectorTileFeature {
  id: number;
  type: number;
  extent: number;
  properties: {
    id: number;
    label: string;
    type: string;
  };
}

// const propsByTypes = {
//     ThematicType.BIODIVERSITY: {
//         minZoom: 20
//     }
// }

const getPathOptions = (color?: string, external?: boolean): PathOptions => {
  return {
    color: "transparent",
    fillColor: alpha(color ?? "#000", external ? 0.35 : 1),
    fillOpacity: 0.4,
    weight: 0,
  };
};

interface ThematicLayersProps {
  thematic: Thematic;
  projectMap: ProjectMap;
}

export default observer(function ThematicLayers({ thematic, projectMap }: ThematicLayersProps) {
  //   ██╗   ██╗███████╗███████╗███████╗
  //   ██║   ██║██╔════╝██╔════╝██╔════╝
  //   ██║   ██║███████╗█████╗  ███████╗
  //   ██║   ██║╚════██║██╔══╝  ╚════██║
  //   ╚██████╔╝███████║███████╗███████║
  //    ╚═════╝ ╚══════╝╚══════╝╚══════╝

  const map = projectMap.map;
  const project = projectMap.project;
  const survey = project.getSurvey(thematic.type);
  const [surfaceOverlaps, setSurfaceOverlaps] = useState<SurfaceOverlap[]>([]);
  const show = true;
  const thematics = projectMap.thematics;

  //   ███████╗███████╗███████╗███████╗ ██████╗████████╗███████╗
  //   ██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
  //   █████╗  █████╗  █████╗  █████╗  ██║        ██║   ███████╗
  //   ██╔══╝  ██╔══╝  ██╔══╝  ██╔══╝  ██║        ██║   ╚════██║
  //   ███████╗██║     ██║     ███████╗╚██████╗   ██║   ███████║
  //   ╚══════╝╚═╝     ╚═╝     ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝

  const getStyle = useCallback(
    (projectMap: ProjectMap) =>
      ({ properties: { type, label } }: VectorTileFeature, layerName: string, zoom: number) => {
        if (projectMap.containsSurfaceType(type)) {
          const color = app.geographics.surfaceTypes[type.toUpperCase()]?.color;

          return {
            color: color,
            fillColor: color,
            opacity: 0.8,
            fillOpacity: 0.3,
            weight: 1.5,
            interactive: true,
          };
        } else {
          return null;
        }
      },
    [projectMap.surfaceTypes]
  );

  useEffect(() => {
    survey &&
      !survey.project?.isSurveysUpdateNeeded &&
      survey.getSurfaceOverlaps().then((surfaceOverlaps) => {
        setSurfaceOverlaps(surfaceOverlaps);
      });
  }, [survey?.id, survey.project?.isSurveysUpdateNeeded]);

  useEffect(() => {
    const layers: L.GeoJSON[] = [];
    if (map && !survey.project?.isSurveysUpdateNeeded) {
      const selectedSurfaces = surfaceOverlaps; //.filter((surface) => project.map.surfaceTypes.includes(surface[0]))

      selectedSurfaces.map(({ type, label, color, geometry, geometryExtended }) => {
        try {
          const layer = L.geoJSON(geometry, { style: getPathOptions(type.color) });
          map.addLayer(layer);
          layer.bindPopup(`<h1>${type.label}</h1>`);
          layers.push(layer);

          // const layer2 = L.geoJSON(geometryExtended, { style: getPathOptions(color, true) });
          // map.addLayer(layer2);
          // layer.bindPopup(`<h1>${label}</h1>`);
          // layers.push(layer2);
        } catch (e) {
          console.warn(e);
        }
      });
    }

    return () => {
      layers.map((layer) => {
        map?.removeLayer(layer);
      });
    };
  }, [map, surfaceOverlaps, survey.project?.isSurveysUpdateNeeded]);

  //   ██████╗ ███████╗███╗   ██╗██████╗ ███████╗██████╗
  //   ██╔══██╗██╔════╝████╗  ██║██╔══██╗██╔════╝██╔══██╗
  //   ██████╔╝█████╗  ██╔██╗ ██║██║  ██║█████╗  ██████╔╝
  //   ██╔══██╗██╔══╝  ██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
  //   ██║  ██║███████╗██║ ╚████║██████╔╝███████╗██║  ██║
  //   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝

  return (
    <>
      {thematics.map((thematic) => (
        // A decommenter lorsqu'on ne regardera pas que la BIODIVERSITY et supprimer les condition sur CARBON et POLLUTION

        <VectorTileLayer
          key={thematic.id}
          disabled={!show}
          url={`/tiles-data/act4eco.${
            thematic.type === ThematicType.LAND_USE ? "artificialisation" : thematic.type?.toLowerCase()
          }/{z}/{x}/{y}.pbf?`}
          getStyle={getStyle(projectMap)}
          //   {...propsByTypes[thematic.type]}
        />
      ))}
    </>
  );
});
