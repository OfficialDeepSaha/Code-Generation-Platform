import { type CodeGeneration, type InsertCodeGeneration, codeGenerations, users } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export interface IStorage {
  createCodeGeneration(generation: Omit<InsertCodeGeneration, 'id' | 'createdAt'> & { 
    generatedCode: any; 
    explanation: string;
    userId?: string;
  }): Promise<CodeGeneration>;
  getCodeGenerations(limit?: number, userId?: string): Promise<CodeGeneration[]>;
  getCodeGeneration(id: string): Promise<CodeGeneration | undefined>;
}

export class PostgresStorage implements IStorage {
  constructor(database?: any) {
    this.database = database || db;
  }
  
  private database: any;
  async createCodeGeneration(data: Omit<InsertCodeGeneration, 'id' | 'createdAt'> & { 
    generatedCode: any; 
    explanation: string;
    userId?: string;
  }): Promise<CodeGeneration> {
    // Handle generatedCode serialization for SQLite
    const generatedCodeValue = typeof data.generatedCode === 'string' 
      ? data.generatedCode 
      : JSON.stringify(data.generatedCode);
    
    const result = await this.database
      .insert(codeGenerations)
      .values({
        prompt: data.prompt,
        language: data.language,
        framework: data.framework || null,
        generatedCode: generatedCodeValue,
        explanation: data.explanation,
        userId: data.userId || null,
      })
      .returning();
    
    return result[0];
  }

  async getCodeGenerations(limit: number = 10, userId?: string): Promise<CodeGeneration[]> {
    let query = this.database
      .select()
      .from(codeGenerations)
      .orderBy(desc(codeGenerations.createdAt))
      .limit(limit);
    
    if (userId) {
      query = query.where(eq(codeGenerations.userId, userId));
    }
    
    const results = await query;
    
    // Parse generatedCode for SQLite (it's stored as text)
    return results.map((result: any) => ({
      ...result,
      generatedCode: typeof result.generatedCode === 'string' 
        ? JSON.parse(result.generatedCode) 
        : result.generatedCode
    }));
  }

  async getCodeGeneration(id: string): Promise<CodeGeneration | undefined> {
    const result = await this.database
      .select()
      .from(codeGenerations)
      .where(eq(codeGenerations.id, id))
      .limit(1);
    
    if (!result[0]) return undefined;
    
    // Parse generatedCode for SQLite (it's stored as text)
    return {
      ...result[0],
      generatedCode: typeof result[0].generatedCode === 'string' 
        ? JSON.parse(result[0].generatedCode) 
        : result[0].generatedCode
    };
  }
}

// Use database storage for both PostgreSQL and SQLite
export const storage = new PostgresStorage();
