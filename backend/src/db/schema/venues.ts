import { pgTable, integer, varchar, text, index,serial,decimal } from "drizzle-orm/pg-core";
import { usersTable } from "./users";


export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const venues = pgTable(
  "Venue",
  {
    venueID: serial("venueID").primaryKey(),
    venueName: varchar("venueName", { length: 100 }),
    repID: integer("repID").references(() => usersTable.SystemID),
    location: varchar("location", { length: 100 }),
    website: text("website"),
    rating: decimal("rating", { precision: 4, scale: 2 }),
    description: text("description"),
  },
);

export const venueDepartments = pgTable('venue_departments', {
  venueId: integer('venue_id').references(() => venues.venueID),
  departmentId: integer('department_id').references(() => departments.id)
});