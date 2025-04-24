CREATE TABLE "offers" (
	"offerID" serial PRIMARY KEY NOT NULL,
	"venueID" integer NOT NULL,
	"repID" integer NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"maxParticipant" integer NOT NULL,
	"status" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"participantID" serial PRIMARY KEY NOT NULL,
	"offerID" integer NOT NULL,
	"studentID" integer NOT NULL,
	"status" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_venueID_Venue_venueID_fk" FOREIGN KEY ("venueID") REFERENCES "public"."Venue"("venueID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_repID_Venue_repID_fk" FOREIGN KEY ("repID") REFERENCES "public"."Venue"("repID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_offerID_offers_offerID_fk" FOREIGN KEY ("offerID") REFERENCES "public"."offers"("offerID") ON DELETE cascade ON UPDATE no action;