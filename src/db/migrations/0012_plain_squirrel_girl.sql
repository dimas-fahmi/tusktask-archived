ALTER TYPE "project"."task_status" RENAME TO "status";--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "project_status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "project_status" SET DATA TYPE "project"."status" USING "project_status"::text::"project"."status";--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "project_status" SET DEFAULT 'on_process';--> statement-breakpoint
DROP TYPE "project"."project_status";