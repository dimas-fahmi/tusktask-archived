import { pgSchema } from "drizzle-orm/pg-core";

// Schemas
export const userSchema = pgSchema("user");
export const projectSchema = pgSchema("project");
