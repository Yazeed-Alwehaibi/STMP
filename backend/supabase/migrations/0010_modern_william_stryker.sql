CREATE TABLE "departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "venue_departments" (
	"venue_id" integer,
	"department_id" integer
);
--> statement-breakpoint
ALTER TABLE "Venue" ADD COLUMN "rating" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "venue_departments" ADD CONSTRAINT "venue_departments_venue_id_Venue_venueID_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."Venue"("venueID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venue_departments" ADD CONSTRAINT "venue_departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Venue" DROP COLUMN "departments";