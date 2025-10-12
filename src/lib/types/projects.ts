import type { Project } from "@/src/db/schema/projects";

export interface ProjectApp extends Project {
  isPending?: boolean;
}
