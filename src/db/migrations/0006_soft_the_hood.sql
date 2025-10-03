ALTER TYPE "project"."project_Type" RENAME TO "project_type";--> statement-breakpoint
ALTER TABLE "project"."projects" RENAME COLUMN "projectType" TO "project_type";--> statement-breakpoint
ALTER TABLE "project"."tasks" RENAME COLUMN "taskStatus" TO "task_status";--> statement-breakpoint
DROP INDEX "project"."IDX_PROJECT_TASKS_TASK_STATUS";--> statement-breakpoint
CREATE INDEX "IDX_PROJECT_TASKS_TASK_STATUS" ON "project"."tasks" USING btree ("task_status");