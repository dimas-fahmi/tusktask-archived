import { index, pgPolicy, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  priorityEnum,
  projectSchema,
  projectTypeEnum,
  statusEnum,
} from "./configs";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, sql } from "drizzle-orm";
import { profiles } from "./profiles";
import { authenticatedRole, serviceRole } from "drizzle-orm/supabase";
import { tasks } from "./tasks";
import { DEFAULT_ICON } from "@/src/lib/configs";

// Project Schema
export const projects = projectSchema
  .table(
    "projects",
    {
      id: uuid("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      ownerId: uuid("owner_id")
        .references(() => profiles.userId, {
          onDelete: "cascade",
        })
        .notNull(),
      projectType: projectTypeEnum("project_type").notNull().default("generic"),
      name: text("name").notNull().default("My Project"),
      description: text("description"),
      icon: text("icon").notNull().default(DEFAULT_ICON),
      cover: text("cover"),
      deadlineAt: timestamp("deadline_at", { withTimezone: true }),
      priority: priorityEnum("project_priority").notNull().default("low"),
      projectStatus: statusEnum("project_status").notNull().default("pending"),
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    },
    (t) => [
      // Indexes
      index("IDX_PROJECT_PROJECTS_OWNER_ID").on(t.ownerId),

      // Full Text Search
      index("FTS_PROJECT_PROJECTS_NAME").using(
        "gin",
        sql`to_tsvector('simple', ${t.name})`,
      ),

      // Policies
      pgPolicy("PLC_PROJECT_PROJECTS_ALL_SELF", {
        as: "permissive",
        to: authenticatedRole,
        for: "all",
        using: sql`(select auth.uid()) = ${t.ownerId}`,
        withCheck: sql`(select auth.uid()) = ${t.ownerId}`,
      }),
      pgPolicy("PLC_PROJECT_PROJECTS_ALL_SERVICE", {
        as: "permissive",
        to: serviceRole,
        for: "all",
        using: sql``,
      }),
    ],
  )
  .enableRLS();

// Projects Table Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export const ProjectSchema = createSelectSchema(projects);
export const ProjectInsertSchema = createInsertSchema(projects);

// Project Schema Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [projects.ownerId],
    references: [profiles.userId],
  }),
  tasks: many(tasks),
}));
