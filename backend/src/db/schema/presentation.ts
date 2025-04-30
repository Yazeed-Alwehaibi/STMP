import { pgTable, serial, integer, timestamp, numeric, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users"; 
import { applications } from "./application";


export const presentation = pgTable("presentation", {
  presentationID: serial("presentation_id").primaryKey(),
  studentID: integer("student_id").notNull().references(() => usersTable.SystemID),
  supervisorID: integer("supervisor_id").notNull().references(() => usersTable.SystemID),
  applicationID: integer("application_id").notNull().references(() => applications.ApplicationID),
  presentationDate: timestamp("presentation_date"),
  mark: numeric("mark", { precision: 4, scale: 2 }),
  status: varchar("status", { length: 250 }),
  fileUrl: varchar("fileUrl", { length: 250 }),
  createdAt: timestamp("created_at").defaultNow(),
});
