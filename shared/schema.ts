import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { sqliteTable, text as sqliteText, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


// Browser-compatible UUID generation
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    // Browser environment with crypto.randomUUID support
    return crypto.randomUUID();
  } else if (typeof require !== 'undefined') {
    // Node.js environment
    try {
      const { randomUUID } = require('crypto');
      return randomUUID();
    } catch {
      // Fallback if crypto is not available
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  } else {
    // Fallback UUID generation for environments without crypto
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Function to determine database type (only call on server)
function getIsPostgres() {
  return typeof process !== 'undefined' && !!process.env?.DATABASE_URL;
}

// PostgreSQL tables
const pgUsers = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  googleId: text("google_id").unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const pgSessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => pgUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const pgCodeGenerations = pgTable("code_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => pgUsers.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  language: text("language").notNull(),
  framework: text("framework"),
  generatedCode: jsonb("generated_code").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SQLite tables
const sqliteUsers = sqliteTable("users", {
  id: sqliteText("id").primaryKey().$defaultFn(() => generateUUID()),
  email: sqliteText("email").notNull().unique(),
  name: sqliteText("name").notNull(),
  avatar: sqliteText("avatar"),
  googleId: sqliteText("google_id").unique(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

const sqliteSessions = sqliteTable("sessions", {
  id: sqliteText("id").primaryKey(),
  userId: sqliteText("user_id").notNull().references(() => sqliteUsers.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

const sqliteCodeGenerations = sqliteTable("code_generations", {
  id: sqliteText("id").primaryKey().$defaultFn(() => generateUUID()),
  userId: sqliteText("user_id").references(() => sqliteUsers.id, { onDelete: "cascade" }),
  prompt: sqliteText("prompt").notNull(),
  language: sqliteText("language").notNull(),
  framework: sqliteText("framework"),
  generatedCode: sqliteText("generated_code").notNull(), // JSON as text in SQLite
  explanation: sqliteText("explanation"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

// Export the appropriate tables based on environment
// Only determine database type on server side
const isPostgres = typeof process !== 'undefined' ? getIsPostgres() : false;
export const users = isPostgres ? pgUsers : sqliteUsers;
export const sessions = isPostgres ? pgSessions : sqliteSessions;
export const codeGenerations = isPostgres ? pgCodeGenerations : sqliteCodeGenerations;

// Use PostgreSQL tables for schema generation (they're more complete)
export const insertCodeGenerationSchema = createInsertSchema(pgCodeGenerations).pick({
  prompt: true,
  language: true,
  framework: true,
});

export const generateCodeRequestSchema = z.object({
  prompt: z.string().min(1).max(500),
  language: z.string().min(1),
  framework: z.string().optional(),
});

export const insertUserSchema = createInsertSchema(pgUsers).pick({
  email: true,
  name: true,
  avatar: true,
  googleId: true,
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type CodeGeneration = typeof codeGenerations.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type InsertSession = typeof sessions.$inferInsert;
export type InsertCodeGeneration = typeof codeGenerations.$inferInsert;
export type GenerateCodeRequest = z.infer<typeof generateCodeRequestSchema>;

// Types for client-side components
export type GeneratedFile = {
  filename: string;
  content: string;
  language: string;
};

export type CodeGenerationResponse = {
  files: GeneratedFile[];
  explanation: string;
};
