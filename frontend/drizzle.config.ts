// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/models',  // Path to your database models
  out: './migrations',     // Path where migrations will be saved
  driver: 'pg',            // Database driver: 'pg' for PostgreSQL
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!, // Database connection string
    // You could add connection options here like ssl, timeout, etc.
  },
});
