import {
  foreignKey,
  index,
  pgPolicy,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { priorityEnum, projectSchema, statusEnum } from "./configs";
import { relations, sql } from "drizzle-orm";
import { authenticatedRole, serviceRole } from "drizzle-orm/supabase";
import { profiles } from "./profiles";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { projects } from "./projects";

// MasterTasks Table (recurring mechanism)
export const masterTasks = projectSchema
  .table(
    "master_tasks",
    {
      id: uuid("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      ownerId: uuid("owner_id")
        .references(() => profiles.userId, { onDelete: "cascade" })
        .notNull(),
      name: text("name").notNull().default("Untitled"),
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
      taskStatus: statusEnum("task_status").notNull().default("on_process"),
      taskPriority: priorityEnum("task_priority").notNull().default("medium"),
      dateStart: timestamp("date_start", { withTimezone: true }).notNull(),
      reminderAt: timestamp("reminder_at", { withTimezone: true }),
      rRule: text("r_rule").notNull(),
    },
    (t) => [
      // Indexes
      index("IDX_PROJECT_MASTER_TASKS_CREATED_AT").on(t.createdAt),

      // Full Text Search
      index("FTS_PROJECT_MASTER_TASKS_NAME").using(
        "gin",
        sql`to_tsvector('simple', ${t.name})`
      ),

      // Policies
      pgPolicy("PLC_PROJECT_MASTER_TASKS_ALL_SELF", {
        as: "permissive",
        to: authenticatedRole,
        for: "all",
        using: sql`(select auth.uid()) = ${t.ownerId}`,
        withCheck: sql`(select auth.uid()) = ${t.ownerId}`,
      }),
      pgPolicy("PLC_PROJECT_MASTER_TASKS_ALL_SERVICE", {
        as: "permissive",
        to: serviceRole,
        for: "all",
        using: sql``,
      }),
    ]
  )
  .enableRLS();

// Recurring Relations
export const masterTasksRelations = relations(masterTasks, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [masterTasks.ownerId],
    references: [profiles.userId],
  }),
  occurrences: many(tasks, {
    relationName: "PROJECTS_TASKS_RECURRING",
  }),
}));

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
      masterTasks: uuid("master_task").references(() => masterTasks.id, {
        onDelete: "cascade",
      }),
      parentTask: uuid("parent_task"),
      name: text("name").notNull().default("Untitled"),
      description: text("description"),
      taskStatus: statusEnum("task_status").notNull().default("on_process"),
      taskPriority: priorityEnum("task_priority").notNull().default("medium"),
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
      completedAt: timestamp("completed_at", { withTimezone: true }),
      reminderAt: timestamp("reminder_at", { withTimezone: true }),
      deadlineAt: timestamp("deadline_at", { withTimezone: true }),
    },
    (t) => [
      // Self References
      foreignKey({
        name: "SR_PROJECT_TASKS_PARENT_TASK_ID",
        columns: [t.parentTask],
        foreignColumns: [t.id],
      }).onDelete("cascade"), // Subtasks

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
      pgPolicy("PLC_PROJECT_TASKS_ALL_SELF", {
        as: "permissive",
        to: authenticatedRole,
        for: "all",
        using: sql`(select auth.uid()) = ${t.ownerId}`,
        withCheck: sql`(select auth.uid()) = ${t.ownerId}`,
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
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [tasks.ownerId],
    references: [profiles.userId],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  parent: one(tasks, {
    fields: [tasks.parentTask],
    references: [tasks.id],
    relationName: "PROJECTS_TASKS_SUBTASKS",
  }),
  subtasks: many(tasks, {
    relationName: "PROJECTS_TASKS_SUBTASKS",
  }),
  masterTasks: one(masterTasks, {
    fields: [tasks.masterTasks],
    references: [masterTasks.id],
    relationName: "PROJECTS_TASKS_RECURRING",
  }),
}));

export type TasksRelations = typeof tasksRelations.table.$inferSelect;
