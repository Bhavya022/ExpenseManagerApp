import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the provided PostgreSQL connection URL
const DATABASE_URL = process.env.DATABASE_URL || "postgres://expense_user:bhavya%4022@localhost:5432/expenseTracker";


// Configure the pool with SSL disabled for local development
export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: false
});

export const db = drizzle({ client: pool, schema });