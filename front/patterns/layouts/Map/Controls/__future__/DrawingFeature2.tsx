"use client";

import ProjectMap from "@/models/projects/ProjectMap";
import L, { LeafletMouseEvent } from "leaflet";
import { observer } from "mobx-react";
import { useEffect, useMemo } from "react";
import { CircleMarker, LayerGroup } from "react-leaflet";
import { edgePathOptions, tracePathOptions } from "../../PathOptions";

export default observer(function DrawingTools({ projectMap }: { projectMap: ProjectMap }) {
  const project = projectMap.project;
  const map = projectMap.map;
  const trace = useMemo<L.Polyline>(() => L.polyline([], tracePathOptions(map)), [project.id]);

  const handleMouseMove = (e: any) => {
    if (map && projectMap.isTracing) {
      trace.setLatLngs([projectMap.drawingLatLngs, e.latlng]);
    }
  };

  const handleClick = (e: LeafletMouseEvent) => {
    if (map && projectMap.isTracing) {
      projectMap.addDrawingPoint(e.latlng);
    }
  };

  useEffect(() => {
    trace && map?.addLayer(trace);
    map?.on("click", handleClick);
    map?.on("mousemove", handleMouseMove);
    projectMap.setdrawingLatLngs([]);

    return () => {
      trace && map?.removeLayer(trace);
      map?.off("click", handleClick);
      map?.off("mousemove", handleMouseMove);
    };
  }, [project?.id]);

  return (
    <LayerGroup>
      {project?.geometry?.latlngs.map((latlng, index) => (
        <CircleMarker key={index} center={latlng} pathOptions={edgePathOptions(map)} radius={4} />
      ))}
    </LayerGroup>
  );
});
