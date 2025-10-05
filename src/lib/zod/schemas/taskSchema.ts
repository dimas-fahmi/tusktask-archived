import { TaskInsertSchema } from "@/src/db/schema/tasks";
import { z } from "zod";

export const newTaskFormSchema = TaskInsertSchema.omit({
  id: true,
  ownerId: true,
  createdAt: true,
}).extend({
  completedAt: z.coerce.date().optional(),
  deadlineAt: z.coerce.date().optional(),
  reminderAt: z.coerce.date().optional(),
});

export type NewTaskFormSchema = z.infer<typeof newTaskFormSchema>;
