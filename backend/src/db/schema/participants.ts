import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { offers } from "./offers";

export const participants = pgTable("participants", {
  participantID: serial("participantID").primaryKey(),
  offerID: integer("offerID")
    .notNull()
    .references(() => offers.offerID, { onDelete: "cascade" }),
  studentID: integer("studentID").notNull(), 
  status: varchar("status", { length: 50 }), 
});
