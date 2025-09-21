import { defineConfig } from "drizzle-kit";

// Use SQLite for development if no DATABASE_URL is provided
const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && !isDevelopment) {
  throw new Error("DATABASE_URL is required for production");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: databaseUrl ? "postgresql" : "sqlite",
  dbCredentials: databaseUrl 
    ? { url: databaseUrl }
    : { url: "./dev.db" },
});
