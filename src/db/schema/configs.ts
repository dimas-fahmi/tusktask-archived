import { pgSchema } from "drizzle-orm/pg-core";

// Schemas
export const userSchema = pgSchema("user");
export const projectSchema = pgSchema("project");

// enums
export const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export const priorityEnum = projectSchema.enum("priority_enum", PRIORITIES);

export const STATUSES = [
  "pending",
  "archived",
  "on_process",
  "completed",
] as const;
export const statusEnum = projectSchema.enum("status", STATUSES);

// Enums
export const PROJECT_TYPES = ["primary", "generic", "co-op"] as const;
export const projectTypeEnum = projectSchema.enum(
  "project_type",
  PROJECT_TYPES
);
