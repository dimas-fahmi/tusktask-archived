import { index, pgPolicy, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projectSchema } from "./configs";
import { relations, sql } from "drizzle-orm";
import { authenticatedRole, serviceRole } from "drizzle-orm/supabase";
import { profiles } from "./profiles";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { projects } from "./projects";

// Tasks Enums
export const taskStatusEnum = projectSchema.enum("task_status", [
  "pending",
  "archived",
  "on_process",
  "completed",
]);

// Tasks table
export const tasks = projectSchema
  .table(
    "tasks",
    {
      id: uuid("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      ownerId: uuid("owner_id")
        .references(() => profiles.userId, { onDelete: "cascade" })
        .notNull(),
      projectId: uuid("project_id")
        .references(() => projects.id, { onDelete: "cascade" })
        .notNull(),
      name: text("name").notNull().default("Untitled"),
      description: text("description"),
      taskStatus: taskStatusEnum(),
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
      reminderAt: timestamp("reminder_at", { withTimezone: true }),
      deadlineAt: timestamp("deadline_at", { withTimezone: true }),
    },
    (t) => [
      // Indexes
      index("IDX_PROJECT_TASKS_OWNER_ID").on(t.ownerId),
      index("IDX_PROJECT_TASKS_PROJECT_ID").on(t.projectId),
      index("IDX_PROJECT_TASKS_TASK_STATUS").on(t.taskStatus),
      index("IDX_PROJECT_TASKS_CREATED_AT").on(t.createdAt),
      index("IDX_PROJECT_TASKS_REMINDER_AT").on(t.reminderAt),
      index("IDX_PROJECT_TASKS_DEADLINE_AT").on(t.deadlineAt),

      // Full Text Search
      index("FTS_PROJECT_TASKS_NAME").using(
        "gin",
        sql`to_tsVector('simple', ${t.name})`
      ),

      // Policies
      pgPolicy("PLC_PROJECT_TASKS_ALL_AUTHENTICATED", {
        as: "permissive",
        to: authenticatedRole,
        for: "all",
        using: sql`${t.ownerId} = auth.uid()`,
        withCheck: sql`${t.ownerId} = auth.uid()`,
      }),
      pgPolicy("PLC_PROJECT_TASKS_ALL_SERVICE", {
        as: "permissive",
        to: serviceRole,
        for: "all",
        using: sql``,
      }),
    ]
  )
  .enableRLS();

// Tasks table types
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
export const TaskSchema = createSelectSchema(tasks);
export const TaskInsertSchema = createInsertSchema(tasks);

// Tasks Relations
export const tasksRelations = relations(tasks, ({ one }) => ({
  owner: one(profiles, {
    fields: [tasks.ownerId],
    references: [profiles.userId],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));
