import { pgTable, serial, integer, timestamp, numeric, varchar } from "drizzle-orm/pg-core";


export const presentation = pgTable("presentation", {
  presentationID: serial("presentation_id").primaryKey(),
  studentID: integer("student_id").notNull(),
  supervisorID: integer("supervisor_id").notNull(),
  applicationID: integer("application_id").notNull(),
  presentationDate: timestamp("presentation_date"),
  mark: numeric("mark", { precision: 4, scale: 2 }),
  status: varchar("status", { length: 250 }),
  fileUrl: varchar("fileUrl", { length: 250 }),
  createdAt: timestamp("created_at").defaultNow(),
});
