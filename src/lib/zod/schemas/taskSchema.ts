import { TaskInsertSchema } from "@/src/db/schema/tasks";
import { z } from "zod";

export const newTaskFormSchema = TaskInsertSchema.omit({
  id: true,
  ownerId: true,
  createdAt: true,
});

export type NewTaskFormSchema = z.infer<typeof newTaskFormSchema>;
