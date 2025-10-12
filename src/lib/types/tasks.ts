import type { Project } from "@/src/db/schema/projects";
import type { Task } from "@/src/db/schema/tasks";

export interface TaskWithSubtasks extends Task {
  subtasks?: TaskWithSubtasks[];
}

export interface TaskApp extends Task {
  isPending?: boolean;
  subtasks?: TaskWithSubtasks[];
  project?: Project;
}
