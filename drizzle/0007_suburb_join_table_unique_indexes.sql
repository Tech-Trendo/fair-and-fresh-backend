ALTER TABLE "suburb_service_pricing" DROP CONSTRAINT "suburb_service_pricing_suburb_id_suburbs_id_fk";
--> statement-breakpoint
ALTER TABLE "suburb_service_pricing" DROP CONSTRAINT "suburb_service_pricing_service_id_services_id_fk";
--> statement-breakpoint
ALTER TABLE "suburb_testimonials" DROP CONSTRAINT "suburb_testimonials_suburb_id_suburbs_id_fk";
--> statement-breakpoint
ALTER TABLE "suburb_testimonials" DROP CONSTRAINT "suburb_testimonials_review_id_testimonials_id_fk";
--> statement-breakpoint
ALTER TABLE "suburb_service_pricing" ADD CONSTRAINT "suburb_service_pricing_suburb_id_suburbs_id_fk" FOREIGN KEY ("suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suburb_service_pricing" ADD CONSTRAINT "suburb_service_pricing_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suburb_testimonials" ADD CONSTRAINT "suburb_testimonials_suburb_id_suburbs_id_fk" FOREIGN KEY ("suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suburb_testimonials" ADD CONSTRAINT "suburb_testimonials_review_id_testimonials_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "suburb_service_pricing_suburb_service_unique" ON "suburb_service_pricing" USING btree ("suburb_id","service_id");--> statement-breakpoint
CREATE UNIQUE INDEX "suburb_testimonials_suburb_review_unique" ON "suburb_testimonials" USING btree ("suburb_id","review_id");