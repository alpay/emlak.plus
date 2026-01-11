ALTER TABLE "image_generation" ADD COLUMN "environment" text DEFAULT 'indoor' NOT NULL;--> statement-breakpoint
ALTER TABLE "image_generation" ADD COLUMN "image_room_type" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "ai_tools" jsonb;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "language" text DEFAULT 'tr' NOT NULL;