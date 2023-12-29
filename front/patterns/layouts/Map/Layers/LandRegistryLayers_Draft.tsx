"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import { Geometry, GeometryData, _, api } from "@/utils";

import { VectorTile } from "@mapbox/vector-tile";
import { Box, Button, Tooltip } from "@mui/material";
import { LeafletMouseEvent } from "leaflet";
// @ts-ignore
import VectorTileLayer from "leaflet-vector-tile-layer";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { FeatureGroup } from "react-leaflet";

interface VectorTileFeature {
  id: number;
  type: number;
  extent: number;
  properties: {
    type: string;
    commune: string;
    created: string;
    updated: string;
  };
}

type VectorTileName = "batiments" | "parcelles" | "sections" | "regions";

var openmaptilesCadastreUrl = "https://openmaptiles.geo.data.gouv.fr/data/cadastre/{z}/{x}/{y}.pbf";

function layerStyle(feature: VectorTileFeature, layerName: VectorTileName, zoom: number) {
  if (layerName == "parcelles" && zoom > 15) {
    return {
      color: "grey",
      fillColor: null,
      fillOpacity: 0.4,
      weight: 1.5,
      interactive: true,
    };
  } else if (layerName == "sections" && zoom <= 15) {
    return {
      color: "grey",
      fillColor: null,
      opacity: 0.4,
      fillOpacity: 0,
      weight: 1.5,
      interactive: true,
    };
  }
}

interface ConfirmLandRegistry {
  top: number;
  left: number;
  geometry: Geometry;
  layer: VectorTileLayer;
}

export default observer(function LandRegistryLayers({ projectMap }: { projectMap: ProjectMap }) {
  const project = projectMap.project;
  const map = projectMap.map;
  const showLandRegistries = projectMap.showLandRegistries;
  const [hoveredLandRegistry, setHoveredLandRegistry] = useState<any>(null);
  const [confirmLandRegistry, setConfirmLandRegistry] = useState<ConfirmLandRegistry>(null);

  const handleConfirmParcel = (confirm?: boolean) => (e: any) => {
    if (confirm && confirmLandRegistry) {
      project.set("geometry", new Geometry(confirmLandRegistry.geometry));
      project.set("geometryExtensionRadius", undefined);
    }
    setConfirmLandRegistry(undefined);
  };

  // Select the parcel or section
  const handleSelectLandRegistry = async (e: LeafletMouseEvent) => {
    if (projectMap.map) {
      // Plan B : call api instead transform PBF to GeoJson
      // TODO: investiguate to transform PBF to GeoJson
      const registries = await api.get<
        {},
        {
          geometry: GeometryData;
          type: "PARCEL" | "SECTION";
        }[]
      >(`/geographics/pick_land_registries/${e.latlng.lng}/${e.latlng.lat}/${projectMap.map.getZoom()}/`);
      const geometry = registries.find((registry) => registry.type === "PARCEL" || registry.type === "SECTION");
      if (geometry) {
        setConfirmLandRegistry((previousConfirm?: ConfirmLandRegistry) => {
          previousConfirm?.layer.setStyle({});
          hoveredLandRegistry.setStyle({});
          return {
            left: e.originalEvent.clientX,
            top: e.originalEvent.clientY,
            geometry: new Geometry(geometry.geometry),
            layer: hoveredLandRegistry,
          };
        });
      }
      return null;
    }
  };

  // Reset hovered land registry
  const resetHoveredLandRegistry = () => {
    setHoveredLandRegistry(null);
  };

  // Show land registry info in a tooltip on hover
  const handleMouseMoveLandRegistry = (e: LeafletMouseEvent) => {
    setHoveredLandRegistry((previousLayer: VectorTileLayer) => {
      return {
        left: e.originalEvent.clientX,
        top: e.originalEvent.clientY - 30,
        layer: e.layer,
      };
    });
  };

  useEffect(() => {
    const cadastreVectorTileLayer: VectorTile = VectorTileLayer(openmaptilesCadastreUrl, {
      maxDetailZoom: 16,
      maxZoom: 20,
      style: layerStyle,
    });
    if (map && showLandRegistries) {
      map.addLayer(cadastreVectorTileLayer);
      cadastreVectorTileLayer.addEventListener("click", handleSelectLandRegistry);
      cadastreVectorTileLayer.addEventListener("mousemove", handleMouseMoveLandRegistry);
      cadastreVectorTileLayer.addEventListener("mouseout", resetHoveredLandRegistry);
    }

    return () => {
      if (map && showLandRegistries) {
        map.removeLayer(cadastreVectorTileLayer);
        cadastreVectorTileLayer.removeEventListener("click", handleSelectLandRegistry);
        cadastreVectorTileLayer.removeEventListener("mousemove", resetHoveredLandRegistry);
      }
    };
  }, [map, showLandRegistries]);

  return (
    <FeatureGroup>
      <Tooltip
        arrow
        placement="top"
        open={!!hoveredLandRegistry}
        title={
          <Box
            sx={{
              p: 1,
              display: "flex",
              gap: "2rem",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span>
              {_("id :")} {hoveredLandRegistry?.layer?.feature?.id}
            </span>
            <span>
              {_("commune :")} {hoveredLandRegistry?.layer?.feature?.properties.commune}
            </span>
            <span>
              {_("prefixe :")} {hoveredLandRegistry?.layer?.feature?.properties.prefixe}
            </span>
            <span>
              {_("code :")} {hoveredLandRegistry?.layer?.feature?.properties.code}
            </span>
            <span>
              {_("créé :")} {hoveredLandRegistry?.layer?.feature?.properties.created}
            </span>
            <span>
              {_("modifié :")} {hoveredLandRegistry?.layer?.feature?.properties.updated}
            </span>
          </Box>
        }
      >
        <Box
          sx={{
            position: "fixed",
            top: hoveredLandRegistry?.top,
            left: hoveredLandRegistry?.left,
            zIndex: 1000,
          }}
        ></Box>
      </Tooltip>

      <Tooltip
        arrow
        placement="right"
        open={!!confirmLandRegistry}
        componentsProps={{ tooltip: { sx: { borderRadius: "50px" } } }}
        title={
          <Box sx={{ p: 1, display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center" }}>
            {_("<p>Le positionnement de l’import <b>est-il exact ?</b></p>", { html: true })}
            <Button onClick={handleConfirmParcel(false)} variant="outlined" sx={{ borderRadius: "50px" }}>
              {_("Non")}
            </Button>
            <Button onClick={handleConfirmParcel(true)} variant="contained" sx={{ borderRadius: "50px" }}>
              {_("Oui")}
            </Button>
          </Box>
        }
      >
        <Box
          sx={{
            position: "fixed",
            top: confirmLandRegistry?.top,
            left: confirmLandRegistry?.left,
            zIndex: 1000,
          }}
        ></Box>
      </Tooltip>
    </FeatureGroup>
  );
});
