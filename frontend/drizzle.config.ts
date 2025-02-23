import 'dotenv/config';  // Load environment variables from .env
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',  // Generated migration files
  schema: './src/db/schema.ts',  // Path to your database schema
  dialect: 'postgresql',  // Database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // Ensure the DATABASE_URL is loaded from .env
  },
});
