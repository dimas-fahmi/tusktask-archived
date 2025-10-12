import type { Project } from "@/src/db/schema/projects";
import type { Task } from "@/src/db/schema/tasks";
import type { CategorizedTasks } from "../utils/categorizedTasks";

export interface TaskWithSubtasks extends Task {
  subtasks?: TaskWithSubtasks[];
}

export interface TaskApp extends Task {
  isPending?: boolean;
  subtasks?: TaskWithSubtasks[];
  project?: Project;
}

/**
 * A type representing the keys that correspond to the main task "situations" or status buckets.
 */
export type SituationKey =
  | keyof Omit<
      CategorizedTasks,
      "lowPriority" | "mediumPriority" | "highPriority" | "urgentPriority"
    >
  | "all";

/**
 * A type representing the valid priority levels found on the TaskApp object.
 */
export type PriorityLevel = TaskApp["taskPriority"] | "all";
