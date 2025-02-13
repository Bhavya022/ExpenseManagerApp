
import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use the provided PostgreSQL connection URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://expense_user:bhavya%4022@localhost:5432/expenseTracker';

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Configure the pool for local PostgreSQL
export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: false
});

export const db = drizzle(pool, { schema });