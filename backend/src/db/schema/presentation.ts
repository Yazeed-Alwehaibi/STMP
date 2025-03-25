import { pgTable, serial, integer, timestamp, numeric, varchar, customType } from "drizzle-orm/pg-core";

// Define a custom BYTEA type correctly
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea"; // PostgreSQL BYTEA type
  },
});

export const presentation = pgTable("presentation", {
  presentationID: serial("presentation_id").primaryKey(),
  studentID: integer("student_id").notNull(),
  supervisorID: integer("supervisor_id").notNull(),
  applicationID: integer("application_id").notNull(),
  presentationDate: timestamp("presentation_date"),
  mark: numeric("mark", { precision: 4, scale: 2 }),
  status: varchar("status", { length: 250 }),
  file: bytea("file"),
  createdAt: timestamp("created_at").defaultNow(),
});
