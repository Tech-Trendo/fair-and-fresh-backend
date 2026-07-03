CREATE TABLE "benefits" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "blacklisted_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text,
	"slug" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"og_type" text DEFAULT 'website',
	"twitter_title" text,
	"twitter_description" text,
	"twitter_image" text,
	"twitter_card" text DEFAULT 'summary_large_image',
	"canonical_url" text,
	"meta_robots" text,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"featured_image" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"slug" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"og_type" text DEFAULT 'article',
	"twitter_title" text,
	"twitter_description" text,
	"twitter_image" text,
	"twitter_card" text DEFAULT 'summary_large_image',
	"canonical_url" text,
	"meta_robots" text,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blogs_categories" (
	"blog_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "blogs_categories_blog_id_category_id_pk" PRIMARY KEY("blog_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotation_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"services" jsonb NOT NULL,
	"preferred_date" text,
	"preferred_time" text,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"additional_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text,
	"slug" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"og_type" text DEFAULT 'website',
	"twitter_title" text,
	"twitter_description" text,
	"twitter_image" text,
	"twitter_card" text DEFAULT 'summary_large_image',
	"canonical_url" text,
	"meta_robots" text,
	CONSTRAINT "service_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_images" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_description" text,
	"long_description" text,
	"what_we_offer" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"og_type" text DEFAULT 'website',
	"twitter_title" text,
	"twitter_description" text,
	"twitter_image" text,
	"twitter_card" text DEFAULT 'summary_large_image',
	"canonical_url" text,
	"meta_robots" text,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services_categories" (
	"service_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "services_categories_service_id_category_id_pk" PRIMARY KEY("service_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "static_pages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"meta_keywords" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"og_type" text DEFAULT 'website',
	"twitter_title" text,
	"twitter_description" text,
	"twitter_image" text,
	"twitter_card" text DEFAULT 'summary_large_image',
	"canonical_url" text,
	"meta_robots" text,
	CONSTRAINT "static_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"author" text NOT NULL,
	"content" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"salt" text NOT NULL,
	"is_staff" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "whats_included" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "benefits" ADD CONSTRAINT "benefits_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs_categories" ADD CONSTRAINT "blogs_categories_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs_categories" ADD CONSTRAINT "blogs_categories_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_images" ADD CONSTRAINT "service_images_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_categories" ADD CONSTRAINT "services_categories_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services_categories" ADD CONSTRAINT "services_categories_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whats_included" ADD CONSTRAINT "whats_included_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;