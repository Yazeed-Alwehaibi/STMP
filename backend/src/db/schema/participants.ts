import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { offers } from "./offers";
import { usersTable } from "./users"; // Adjust the import based on your project structure

export const participants = pgTable("participants", {
  participantID: serial("participantID").primaryKey().references(() => usersTable.SystemID),
  offerID: integer("offerID")
    .notNull()
    .references(() => offers.offerID, { onDelete: "cascade" }),
  studentID: integer("studentID").notNull(), 
  status: varchar("status", { length: 50 }), 
});
