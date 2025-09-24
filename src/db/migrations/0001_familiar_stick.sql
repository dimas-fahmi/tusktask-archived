ALTER TABLE "project"."projects" ALTER COLUMN "owner_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "project"."tasks" ALTER COLUMN "owner_id" SET DATA TYPE uuid;