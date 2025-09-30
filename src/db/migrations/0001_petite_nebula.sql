CREATE TYPE "public"."project_Type" AS ENUM('primary', 'generic', 'co-op');--> statement-breakpoint
CREATE TABLE "project"."master_tasks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text DEFAULT 'Untitled' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"date_start" timestamp with time zone NOT NULL,
	"r_rule" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "project"."projects" ADD COLUMN "projectType" "project_Type";--> statement-breakpoint
ALTER TABLE "project"."tasks" ADD COLUMN "master_task" uuid;--> statement-breakpoint
ALTER TABLE "project"."tasks" ADD COLUMN "parent_task" uuid;--> statement-breakpoint
ALTER TABLE "project"."tasks" ADD COLUMN "completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ADD CONSTRAINT "master_tasks_owner_id_profiles_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "user"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_MASTER_TASKS_CREATED_AT" ON "project"."master_tasks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "FTS_PROJECT_MASTER_TASKS_NAME" ON "project"."master_tasks" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
ALTER TABLE "project"."tasks" ADD CONSTRAINT "tasks_master_task_master_tasks_id_fk" FOREIGN KEY ("master_task") REFERENCES "project"."master_tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project"."tasks" ADD CONSTRAINT "SR_PROJECT_TASKS_PARENT_TASK_ID" FOREIGN KEY ("parent_task") REFERENCES "project"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER POLICY "PLC_PROJECT_TASKS_ALL_AUTHENTICATED" ON "project"."tasks" RENAME TO "PLC_PROJECT_TASKS_ALL_SELF";--> statement-breakpoint
CREATE POLICY "PLC_PROJECT_MASTER_TASKS_ALL_SELF" ON "project"."master_tasks" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select auth.uid()) = "project"."master_tasks"."owner_id") WITH CHECK ((select auth.uid()) = "project"."master_tasks"."owner_id");--> statement-breakpoint
CREATE POLICY "PLC_PROJECT_MASTER_TASKS_ALL_SERVICE" ON "project"."master_tasks" AS PERMISSIVE FOR ALL TO "service_role";--> statement-breakpoint
ALTER POLICY "PLC_USER_PROFILES_UPDATE_SELF" ON "user"."profiles" TO authenticated USING ((SELECT auth.uid()) = "user"."profiles"."user_id") WITH CHECK ((SELECT auth.uid()) = "user"."profiles"."user_id");--> statement-breakpoint
ALTER POLICY "PLC_PROJECT_PROJECTS_ALL_SELF" ON "project"."projects" TO authenticated USING ((select auth.uid()) = "project"."projects"."owner_id") WITH CHECK ((select auth.uid()) = "project"."projects"."owner_id");