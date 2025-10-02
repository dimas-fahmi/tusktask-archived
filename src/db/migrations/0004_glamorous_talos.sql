ALTER TABLE "project"."projects" ALTER COLUMN "owner_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "name" SET DEFAULT 'My Project';--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "icon" SET DEFAULT 'File';