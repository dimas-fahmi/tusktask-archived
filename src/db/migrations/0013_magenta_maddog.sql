ALTER TABLE "project"."projects" ALTER COLUMN "project_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "project_status" SET DEFAULT 'pending'::text;--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ALTER COLUMN "task_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ALTER COLUMN "task_status" SET DEFAULT 'on_process'::text;--> statement-breakpoint
ALTER TABLE "project"."tasks" ALTER COLUMN "task_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project"."tasks" ALTER COLUMN "task_status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "project"."status";--> statement-breakpoint
CREATE TYPE "project"."status" AS ENUM('pending', 'archived', 'on_process');--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "project_status" SET DEFAULT 'pending'::"project"."status";--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "project_status" SET DATA TYPE "project"."status" USING "project_status"::"project"."status";--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ALTER COLUMN "task_status" SET DEFAULT 'on_process'::"project"."status";--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ALTER COLUMN "task_status" SET DATA TYPE "project"."status" USING "task_status"::"project"."status";--> statement-breakpoint
ALTER TABLE "project"."tasks" ALTER COLUMN "task_status" SET DEFAULT 'pending'::"project"."status";--> statement-breakpoint
ALTER TABLE "project"."tasks" ALTER COLUMN "task_status" SET DATA TYPE "project"."status" USING "task_status"::"project"."status";