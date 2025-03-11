import { pgTable, serial, text, integer, pgEnum } from 'drizzle-orm/pg-core';

 
  export const roleEnum = pgEnum('Role', ['Supervisor', 'Student', 'Training Representative']);

  export const usersTable = pgTable('users', {
    SystemID: serial('SystemID').primaryKey(),
    UserID: integer('UserID').notNull(),
    UserName: text('UserName').notNull(),
    Email: text('Email').notNull().unique(),
    Role: roleEnum('Role').notNull(),
    DepartmentOrMajor: text('DepartmentOrMajor'),
    ExtraInfo: text('ExtraInfo'),
    Status: text('Status'),
    Password: text('Password').notNull(),
  });
  

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
