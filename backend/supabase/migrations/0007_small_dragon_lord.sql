CREATE TABLE "Reports" (
	"reportID" serial PRIMARY KEY NOT NULL,
	"studentID" integer NOT NULL,
	"supervisorID" integer NOT NULL,
	"applicationID" integer NOT NULL,
	"submissionDate" timestamp with time zone DEFAULT now(),
	"mark" numeric(4, 2),
	"feedback" text,
	"type" "TEXT" NOT NULL,
	"status" varchar(250),
	"content" text,
	"file" "bytea"
);
