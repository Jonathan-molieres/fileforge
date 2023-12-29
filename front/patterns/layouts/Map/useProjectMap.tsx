import Project from "@/models/projects/Project";
import ProjectMap, { ProjectMapOptions } from "@/models/projects/ProjectMap";
import { useMemo } from "react";

export default function useProjectMap(project: Project, options: ProjectMapOptions): ProjectMap {
  //
  const projectMap = useMemo(() => new ProjectMap(project, options), [project.id]);
  //
  return projectMap;
}
