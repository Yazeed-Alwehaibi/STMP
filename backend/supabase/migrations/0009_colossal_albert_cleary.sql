CREATE TABLE "presentation" (
	"presentation_id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"supervisor_id" integer NOT NULL,
	"application_id" integer NOT NULL,
	"presentation_date" timestamp,
	"mark" numeric(4, 2),
	"status" varchar(250),
	"file" "bytea",
	"created_at" timestamp DEFAULT now()
);
