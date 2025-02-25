import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

// Define the users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
});
