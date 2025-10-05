ALTER TYPE "project"."priority_enum" ADD VALUE 'urgent';--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ADD COLUMN "task_priority" "project"."priority_enum" DEFAULT 'medium' NOT NULL;