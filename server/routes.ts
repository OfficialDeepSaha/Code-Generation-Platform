import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCodeRequestSchema } from "@shared/schema";
import { generateCode } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate code endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = generateCodeRequestSchema.parse(req.body);
      
      const result = await generateCode(validatedData);
      
      // Store the generation in storage
      const generation = await storage.createCodeGeneration({
        prompt: validatedData.prompt,
        language: validatedData.language,
        framework: validatedData.framework,
        generatedCode: result.files,
        explanation: result.explanation,
      });

      res.json({
        id: generation.id,
        files: result.files,
        explanation: result.explanation,
        createdAt: generation.createdAt,
      });
    } catch (error) {
      console.error("Code generation error:", error);
      
      if (error && typeof error === 'object' && 'name' in error && error.name === "ZodError") {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: (error as any).errors 
        });
      }
      
      res.status(500).json({ 
        message: (error as Error)?.message || "Failed to generate code" 
      });
    }
  });

  // Get recent generations
  app.get("/api/generations", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const generations = await storage.getCodeGenerations(limit);
      
      res.json(generations.map(gen => ({
        id: gen.id,
        prompt: gen.prompt,
        language: gen.language,
        framework: gen.framework,
        createdAt: gen.createdAt,
      })));
    } catch (error) {
      console.error("Failed to fetch generations:", error);
      res.status(500).json({ message: "Failed to fetch generations" });
    }
  });

  // Get specific generation
  app.get("/api/generations/:id", async (req, res) => {
    try {
      const generation = await storage.getCodeGeneration(req.params.id);
      
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      res.json({
        id: generation.id,
        prompt: generation.prompt,
        language: generation.language,
        framework: generation.framework,
        files: generation.generatedCode,
        explanation: generation.explanation,
        createdAt: generation.createdAt,
      });
    } catch (error) {
      console.error("Failed to fetch generation:", error);
      res.status(500).json({ message: "Failed to fetch generation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
