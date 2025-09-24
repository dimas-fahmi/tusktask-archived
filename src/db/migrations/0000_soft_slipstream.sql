CREATE SCHEMA "project";
--> statement-breakpoint
CREATE SCHEMA "user";
--> statement-breakpoint
CREATE TYPE "project"."task_status" AS ENUM('pending', 'archived', 'on_process', 'completed');--> statement-breakpoint
CREATE TABLE "user"."profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"username" text,
	"avatar" text,
	"cover" text
);
--> statement-breakpoint
ALTER TABLE "user"."profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project"."projects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"logo" text,
	"cover" text
);
--> statement-breakpoint
ALTER TABLE "project"."projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project"."tasks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text DEFAULT 'Untitled' NOT NULL,
	"description" text,
	"taskStatus" "project"."task_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reminder_at" timestamp with time zone,
	"deadline_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "project"."tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user"."profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project"."projects" ADD CONSTRAINT "projects_owner_id_profiles_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "user"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project"."tasks" ADD CONSTRAINT "tasks_owner_id_profiles_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "user"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project"."tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "UIDX_USER_PROFILES_USERNAME" ON "user"."profiles" USING btree ("username");--> statement-breakpoint
CREATE INDEX "FTS_USER_PROFILES_NAME" ON "user"."profiles" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_PROJECTS_OWNER_ID" ON "project"."projects" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "FTS_PROJECT_PROJECTS_NAME" ON "project"."projects" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_TASKS_OWNER_ID" ON "project"."tasks" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_TASKS_PROJECT_ID" ON "project"."tasks" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_TASKS_TASK_STATUS" ON "project"."tasks" USING btree ("taskStatus");--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_TASKS_CREATED_AT" ON "project"."tasks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_TASKS_REMINDER_AT" ON "project"."tasks" USING btree ("reminder_at");--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_TASKS_DEADLINE_AT" ON "project"."tasks" USING btree ("deadline_at");--> statement-breakpoint
CREATE INDEX "FTS_PROJECT_TASKS_NAME" ON "project"."tasks" USING gin (to_tsVector('simple', "name"));--> statement-breakpoint
CREATE POLICY "PLC_USER_PROFILES_SELECT_AUTHENTICATED" ON "user"."profiles" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "PLC_USER_PROFILES_UPDATE_SELF" ON "user"."profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("user"."profiles"."user_id" = auth.uid()) WITH CHECK ("user"."profiles"."user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "PLC_USER_PROFILES_ALL_SERVICE" ON "user"."profiles" AS PERMISSIVE FOR ALL TO "service_role";--> statement-breakpoint
CREATE POLICY "PLC_PROJECT_PROJECTS_ALL_SELF" ON "project"."projects" AS PERMISSIVE FOR ALL TO "authenticated" USING ("project"."projects"."owner_id" = auth.uid()) WITH CHECK ("project"."projects"."owner_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "PLC_PROJECT_PROJECTS_ALL_SERVICE" ON "project"."projects" AS PERMISSIVE FOR ALL TO "service_role";--> statement-breakpoint
CREATE POLICY "PLC_PROJECT_TASKS_ALL_AUTHENTICATED" ON "project"."tasks" AS PERMISSIVE FOR ALL TO "authenticated" USING ("project"."tasks"."owner_id" = auth.uid()) WITH CHECK ("project"."tasks"."owner_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "PLC_PROJECT_TASKS_ALL_SERVICE" ON "project"."tasks" AS PERMISSIVE FOR ALL TO "service_role";