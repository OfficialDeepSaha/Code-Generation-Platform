import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const codeGenerations = pgTable("code_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  language: text("language").notNull(),
  framework: text("framework"),
  generatedCode: jsonb("generated_code").notNull(), // Array of code files
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCodeGenerationSchema = createInsertSchema(codeGenerations).pick({
  prompt: true,
  language: true,
  framework: true,
});

export const generateCodeRequestSchema = z.object({
  prompt: z.string().min(1).max(500),
  language: z.string().min(1),
  framework: z.string().optional(),
});

export type InsertCodeGeneration = z.infer<typeof insertCodeGenerationSchema>;
export type CodeGeneration = typeof codeGenerations.$inferSelect;
export type GenerateCodeRequest = z.infer<typeof generateCodeRequestSchema>;

export type GeneratedFile = {
  filename: string;
  content: string;
  language: string;
};

export type CodeGenerationResponse = {
  files: GeneratedFile[];
  explanation: string;
};
