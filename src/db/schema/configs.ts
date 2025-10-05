import { pgSchema } from "drizzle-orm/pg-core";

// Schemas
export const userSchema = pgSchema("user");
export const projectSchema = pgSchema("project");

// enums
export const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export const priorityEnum = projectSchema.enum("priority_enum", PRIORITIES);
