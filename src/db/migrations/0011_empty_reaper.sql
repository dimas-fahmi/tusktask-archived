ALTER TABLE "project"."tasks" ALTER COLUMN "task_status" SET DEFAULT 'on_process';--> statement-breakpoint
ALTER TABLE "project"."tasks" ALTER COLUMN "task_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ADD COLUMN "task_status" "project"."task_status" DEFAULT 'on_process' NOT NULL;--> statement-breakpoint
ALTER TABLE "project"."master_tasks" ADD COLUMN "reminder_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project"."tasks" ADD COLUMN "task_priority" "project"."priority_enum" DEFAULT 'medium' NOT NULL;