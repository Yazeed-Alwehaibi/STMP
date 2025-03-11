import { pgTable, integer, varchar, timestamp, index, primaryKey } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { venues } from "./venues";

export const applications = pgTable(
  "application",
  {
    ApplicationID: integer("ApplicationID").primaryKey(),
    supervisorID: integer("supervisorID").references(() => usersTable.SystemID),
    studentID: integer("studentID").references(() => usersTable.SystemID),
    repID: integer("repID").references(() => usersTable.SystemID),
    venueID: integer("venueID").references(() => venues.venueID),
    startDate: timestamp("startDate"),
    endDate: timestamp("endDate"),
    status: varchar("status", { length: 50 }),
    type: varchar("type", { length: 50 }),
  },
  
);
