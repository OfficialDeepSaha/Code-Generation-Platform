import { type CodeGeneration, type InsertCodeGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createCodeGeneration(generation: Omit<InsertCodeGeneration, 'id' | 'createdAt'> & { 
    generatedCode: any; 
    explanation: string; 
  }): Promise<CodeGeneration>;
  getCodeGenerations(limit?: number): Promise<CodeGeneration[]>;
  getCodeGeneration(id: string): Promise<CodeGeneration | undefined>;
}

export class MemStorage implements IStorage {
  private codeGenerations: Map<string, CodeGeneration>;

  constructor() {
    this.codeGenerations = new Map();
  }

  async createCodeGeneration(data: Omit<InsertCodeGeneration, 'id' | 'createdAt'> & { 
    generatedCode: any; 
    explanation: string; 
  }): Promise<CodeGeneration> {
    const id = randomUUID();
    const generation: CodeGeneration = {
      ...data,
      framework: data.framework || null,
      id,
      createdAt: new Date(),
    };
    this.codeGenerations.set(id, generation);
    return generation;
  }

  async getCodeGenerations(limit = 10): Promise<CodeGeneration[]> {
    const generations = Array.from(this.codeGenerations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return generations;
  }

  async getCodeGeneration(id: string): Promise<CodeGeneration | undefined> {
    return this.codeGenerations.get(id);
  }
}

export const storage = new MemStorage();
