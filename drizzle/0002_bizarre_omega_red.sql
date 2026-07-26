CREATE TABLE IF NOT EXISTS "service_types" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "service_types" ADD CONSTRAINT "service_types_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;