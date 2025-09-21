import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import postgres from "postgres";
import Database from "better-sqlite3";
import * as schema from "../shared/schema";
import { config } from "dotenv";

config();

const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && !isDevelopment) {
  throw new Error("DATABASE_URL is required for production");
}

let db: ReturnType<typeof drizzlePostgres> | ReturnType<typeof drizzleSqlite>;

if (databaseUrl) {
  // Use PostgreSQL for production
  const client = postgres(databaseUrl);
  db = drizzlePostgres(client, { schema });
} else {
  // Use SQLite for development
  const sqlite = new Database('./dev.db');
  db = drizzleSqlite(sqlite, { schema });
}

export { db };
export type DatabaseType = typeof db;