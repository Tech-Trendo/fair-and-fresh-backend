CREATE TABLE "suburb_copy_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_type" varchar(30) NOT NULL,
	"block_type" varchar(30) NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suburb_service_pricing" (
	"id" serial PRIMARY KEY NOT NULL,
	"suburb_id" integer NOT NULL,
	"service_id" text NOT NULL,
	"price_override" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "suburb_testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"suburb_id" integer NOT NULL,
	"review_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suburbs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"region" varchar(50) NOT NULL,
	"region_type" varchar(30) NOT NULL,
	"postcode" varchar(10),
	"lat" numeric(9, 6),
	"lng" numeric(9, 6),
	"travel_time_mins" integer,
	"local_landmark" text,
	"price_multiplier" numeric(4, 2) DEFAULT '1.00' NOT NULL,
	"meta_description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "suburbs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "suburb_service_pricing" ADD CONSTRAINT "suburb_service_pricing_suburb_id_suburbs_id_fk" FOREIGN KEY ("suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suburb_service_pricing" ADD CONSTRAINT "suburb_service_pricing_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suburb_testimonials" ADD CONSTRAINT "suburb_testimonials_suburb_id_suburbs_id_fk" FOREIGN KEY ("suburb_id") REFERENCES "public"."suburbs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suburb_testimonials" ADD CONSTRAINT "suburb_testimonials_review_id_testimonials_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."testimonials"("id") ON DELETE no action ON UPDATE no action;