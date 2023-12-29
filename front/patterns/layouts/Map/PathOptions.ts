"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import { darkGreyBlue } from "@/patterns/ThemeRegistry/constants";
import { PathOptions } from "leaflet";

export const polygonPathOptions = (map: ProjectMap): PathOptions => ({
  color: "#0099A5",
  //   fillColor: "transparent",
  fillColor: "#0099A5",
  fillOpacity: 0.6,
  weight: 2,
});

export const polylinePathOptions = (map: ProjectMap): PathOptions => ({
  color: "#0099A5",
  fillColor: "transparent", //  "#0099A5",
  fillOpacity: 0.6,
  weight: 2,
});

export const geometryExtendedPathOptions = (map: ProjectMap): PathOptions => ({
  color: "#015D60",
  //   fillColor: "transparent", //
  fillColor: "#5CBDC5",
  opacity: 1,
  fillOpacity: 0.4,
  weight: 3,
  dashArray: "10, 10",
  dashOffset: "10",
});

export const edgePathOptions = (map: ProjectMap): PathOptions => ({
  color: darkGreyBlue.darker,
  fillColor: darkGreyBlue.darker,
  weight: 2,
});

export const tracePathOptions = (map: ProjectMap): PathOptions => ({
  color: darkGreyBlue.light,
  fillColor: darkGreyBlue.darker,
  weight: 2,
});
