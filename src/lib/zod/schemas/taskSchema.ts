import { PRIORITIES } from "@/src/db/schema/configs";
import z from "zod";

export const newTaskSchema = z.object({
  taskName: z.string().min(3).max(100),
  taskDescription: z.string().optional(),
  taskPriority: z.enum(PRIORITIES),
  taskDeadline: z.date().optional(),
  taskReminder: z.date().optional(),
  taskProjectId: z.uuid(),
});

export type NewTaskSchema = z.infer<typeof newTaskSchema>;
