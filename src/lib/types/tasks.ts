import { Task } from "@/src/db/schema/tasks";

export interface TaskApp extends Task {
  isPending?: boolean;
}
