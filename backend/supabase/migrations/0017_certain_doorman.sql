ALTER TABLE "offers" DROP CONSTRAINT "offers_repID_Venue_repID_fk";
--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_repID_users_SystemID_fk" FOREIGN KEY ("repID") REFERENCES "public"."users"("SystemID") ON DELETE no action ON UPDATE no action;