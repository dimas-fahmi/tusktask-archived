import { z } from "zod";
import { ProjectInsertSchema } from "@/src/db/schema/projects";

export const projectFormSchema = ProjectInsertSchema.omit({
  id: true,
  ownerId: true,
  createdAt: true,
}).extend({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  icon: z.string(),
});
