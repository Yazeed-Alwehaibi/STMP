import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { venues } from "./venues";
import { usersTable } from "./users"; // Adjust the import based on your project structure

export const offers = pgTable("offers", {
  offerID: serial("offerID").primaryKey(),
  venueID: integer("venueID").notNull().references(() => venues.venueID),
  repID: integer("repID").notNull().references(() => usersTable.SystemID),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  maxParticipant: integer("maxParticipant").notNull(),
  status: varchar("status", { length: 50 }),

});
