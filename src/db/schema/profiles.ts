import { index, pgPolicy, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { userSchema } from "./configs";
import {
  authenticatedRole,
  authUsers,
  serviceRole,
} from "drizzle-orm/supabase";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { projects } from "./projects";
import { masterTasks, tasks } from "./tasks";

// Profiles Table
export const profiles = userSchema
  .table(
    "profiles",
    {
      userId: uuid("user_id")
        .references(() => authUsers.id, { onDelete: "cascade" })
        .primaryKey(),
      name: text("name"),
      username: text("username"),
      avatar: text("avatar"),
      cover: text("cover"),
    },
    (t) => [
      // Indexes
      uniqueIndex("UIDX_USER_PROFILES_USERNAME").on(t.username),

      // Full Text Search
      index("FTS_USER_PROFILES_NAME").using(
        "gin",
        sql`to_tsvector('simple', ${t.name})`
      ),

      // Policies
      pgPolicy("PLC_USER_PROFILES_SELECT_AUTHENTICATED", {
        as: "permissive",
        to: authenticatedRole,
        for: "select",
        using: sql``,
      }),
      pgPolicy("PLC_USER_PROFILES_UPDATE_SELF", {
        as: "permissive",
        to: authenticatedRole,
        for: "update",
        using: sql`(SELECT auth.id()) = ${t.userId}`,
        withCheck: sql`(SELECT auth.id()) = ${t.userId}`,
      }),
      pgPolicy("PLC_USER_PROFILES_ALL_SERVICE", {
        as: "permissive",
        to: serviceRole,
        for: "all",
        using: sql``,
      }),
    ]
  )
  .enableRLS();

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export const ProfileSchema = createSelectSchema(profiles);
export const ProfileInsertSchema = createInsertSchema(profiles);

// Profiles relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
  recurringTasks: many(masterTasks),
}));
