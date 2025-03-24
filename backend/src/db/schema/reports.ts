import { pgTable, serial, integer, timestamp, numeric, text, varchar, pgEnum, customType } from "drizzle-orm/pg-core";

// Define ENUM type correctly
export const reportTypeEnum = pgEnum("report_type", ["1", "2", "3", "final"]);

// Define a custom type for BYTEA (binary data)
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea"; // PostgreSQL BYTEA type
  },
});

export const reports = pgTable("Reports", {
  reportID: serial("reportID").primaryKey(),
  studentID: integer("studentID").notNull(),
  supervisorID: integer("supervisorID").notNull(),
  applicationID: integer("applicationID").notNull(),
  submissionDate: timestamp("submissionDate", { withTimezone: true }).defaultNow(),
  mark: numeric("mark", { precision: 4, scale: 2 }),
  feedback: text("feedback"),
  type: reportTypeEnum("type").notNull(),
  status: varchar("status", { length: 250 }),
  content: text("content"),
  file: bytea("file"), 
});
