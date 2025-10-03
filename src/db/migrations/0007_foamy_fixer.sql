ALTER TABLE "project"."projects" ALTER COLUMN "project_type" SET DEFAULT 'generic';--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "project_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "icon" SET DEFAULT 'Clock1';--> statement-breakpoint
ALTER TABLE "project"."projects" ALTER COLUMN "icon" SET NOT NULL;