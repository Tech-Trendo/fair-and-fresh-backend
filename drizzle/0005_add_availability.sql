CREATE TABLE "availability" (
	"id" text PRIMARY KEY NOT NULL,
	"date" text,
	"start_time" text,
	"end_time" text,
	"type" text NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
