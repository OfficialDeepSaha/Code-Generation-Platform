import OpenAI from "openai";
import { type GenerateCodeRequest, type CodeGenerationResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export async function generateCode(request: GenerateCodeRequest): Promise<CodeGenerationResponse> {
  const { prompt, language, framework } = request;
  
  const systemPrompt = `You are an expert software developer. Generate clean, production-ready code based on the user's prompt.

IMPORTANT: Always respond with valid JSON in this exact format:
{
  "files": [
    {
      "filename": "example.js",
      "content": "// actual code content here",
      "language": "javascript"
    }
  ],
  "explanation": "Brief explanation of the generated code and its key features"
}

Guidelines:
- Generate complete, functional code
- Include proper error handling where appropriate
- Use modern best practices for the specified language/framework
- If multiple files are needed, include them all in the files array
- Keep explanations concise but informative
- Ensure code is properly formatted and indented`;

  const userPrompt = `Generate ${language}${framework ? ` with ${framework}` : ''} code for: ${prompt}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const result = JSON.parse(content) as CodeGenerationResponse;
    
    // Validate the response structure
    if (!result.files || !Array.isArray(result.files) || !result.explanation) {
      throw new Error("Invalid response format from OpenAI");
    }

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse OpenAI response as JSON");
    }
    throw new Error(`Code generation failed: ${(error as Error)?.message || 'Unknown error'}`);
  }
}
