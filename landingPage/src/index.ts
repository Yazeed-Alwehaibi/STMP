import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;

// Load environment variables
dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

// Initialize DrizzleORM
import * as schema from "./db/schema"; // Adjust the path to your schema file

const db = drizzle(pool, { schema });

// Example query to use the db variable
db.execute(`SELECT * FROM student`)
  .then((result) => {
    // Make sure there is at least one row to access
    if (result.rows.length > 0) {
      console.log("First row from DB:", result.rows[0]);
      console.log("second row from DB:", result.rows[1]);  // Accessing the first row
    } else {
      console.log("No rows found in the student table.");
    }
  })
  .catch((error: Error) => console.error("Error executing query", error));

// Make sure to log only after the query has run
console.log("Connected to PostgreSQL!");

