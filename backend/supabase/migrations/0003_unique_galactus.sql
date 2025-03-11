CREATE TABLE "application" (
	"ApplicationID" integer PRIMARY KEY NOT NULL,
	"supervisorID" integer,
	"studentID" integer,
	"repID" integer,
	"venueID" integer,
	"startDate" timestamp,
	"endDate" timestamp,
	"status" varchar(50),
	"type" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "Venue" (
	"venueID" integer PRIMARY KEY NOT NULL,
	"venueName" varchar(100),
	"repID" integer,
	"location" varchar(100),
	"departments" varchar(100),
	"website" text
);
--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_supervisorID_users_SystemID_fk" FOREIGN KEY ("supervisorID") REFERENCES "public"."users"("SystemID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_studentID_users_SystemID_fk" FOREIGN KEY ("studentID") REFERENCES "public"."users"("SystemID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_repID_users_SystemID_fk" FOREIGN KEY ("repID") REFERENCES "public"."users"("SystemID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_venueID_Venue_venueID_fk" FOREIGN KEY ("venueID") REFERENCES "public"."Venue"("venueID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_repID_users_SystemID_fk" FOREIGN KEY ("repID") REFERENCES "public"."users"("SystemID") ON DELETE no action ON UPDATE no action;