import { pgTable, integer, varchar, text, index } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const venues = pgTable(
  "Venue",
  {
    venueID: integer("venueID").primaryKey(),
    venueName: varchar("venueName", { length: 100 }),
    repID: integer("repID").references(() => usersTable.SystemID),
    location: varchar("location", { length: 100 }),
    departments: varchar("departments", { length: 100 }),
    website: text("website"),
  },
);
