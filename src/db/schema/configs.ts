import { pgSchema } from "drizzle-orm/pg-core";

// Schemas
export const userSchema = pgSchema("user");
export const projectSchema = pgSchema("project");

// enums
export const priorityEnum = projectSchema.enum("priority_enum", [
  "low",
  "medium",
  "high",
  "urgent",
]);
