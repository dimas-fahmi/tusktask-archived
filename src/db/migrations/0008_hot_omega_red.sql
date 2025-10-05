CREATE TYPE "project"."priority_enum" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
ALTER TABLE "project"."projects" ADD COLUMN "deadline_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project"."projects" ADD COLUMN "project_priority" "project"."priority_enum" DEFAULT 'low' NOT NULL;