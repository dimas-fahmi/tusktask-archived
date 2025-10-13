import { z } from "zod";
import { TaskInsertSchema } from "@/src/db/schema/tasks";

export const newTaskFormSchema = TaskInsertSchema.omit({
  id: true,
  ownerId: true,
  createdAt: true,
}).extend({
  name: z.string().min(3).max(100),
});

export type NewTaskFormSchema = z.infer<typeof newTaskFormSchema>;
