CREATE TYPE "public"."Role" AS ENUM('Supervisor', 'Student', 'Training Representative');--> statement-breakpoint
CREATE TABLE "users" (
	"UserID" serial PRIMARY KEY NOT NULL,
	"UserName" text NOT NULL,
	"Email" text NOT NULL,
	"Role" "Role" NOT NULL,
	"DepartmentOrMajor" text,
	"ExtraInfo" text,
	"Status" text,
	"Password" text NOT NULL,
	CONSTRAINT "users_Email_unique" UNIQUE("Email")
);
--> statement-breakpoint
DROP TABLE "posts_table" CASCADE;--> statement-breakpoint
DROP TABLE "users_table" CASCADE;