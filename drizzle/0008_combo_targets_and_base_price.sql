CREATE TABLE "combo_page_targets" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"suburb_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "base_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "combo_page_targets" ADD CONSTRAINT "combo_page_targets_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "combo_page_targets" ADD CONSTRAINT "combo_page_targets_suburb_id_suburbs_id_fk" FOREIGN KEY ("suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "combo_page_targets_service_suburb_unique" ON "combo_page_targets" USING btree ("service_id","suburb_id");