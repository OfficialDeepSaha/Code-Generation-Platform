import OpenAI from "openai";
import { type GenerateCodeRequest, type CodeGenerationResponse } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || ""
});

export async function generateCode(request: GenerateCodeRequest): Promise<CodeGenerationResponse> {
  const { prompt, language, framework } = request;
  
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.warn("No OpenAI API key found, using mock response");
    return generateMockResponse(request);
  }
  
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
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
    }, {
      timeout: 30000, // 30 second timeout
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
    console.error("OpenAI API error:", error);
    console.warn("Falling back to mock response due to API error");
    return generateMockResponse(request);
  }
}

function generateMockResponse(request: GenerateCodeRequest): CodeGenerationResponse {
  const { prompt, language, framework } = request;
  const langLower = language.toLowerCase();
  
  // Generate appropriate file extension
  const getFileExtension = () => {
    if (langLower.includes('javascript') || langLower.includes('react')) return 'jsx';
    if (langLower.includes('typescript')) return 'tsx';
    if (langLower.includes('python')) return 'py';
    if (langLower.includes('html')) return 'html';
    if (langLower.includes('css')) return 'css';
    if (langLower.includes('java')) return 'java';
    if (langLower.includes('php')) return 'php';
    return 'js';
  };

  // Generate sample code based on prompt and language
  const generateSampleCode = () => {
    if (prompt.toLowerCase().includes('button') && (langLower.includes('react') || langLower.includes('javascript'))) {
      return `import React from 'react';

const Button = ({ children, onClick, disabled = false, variant = 'primary' }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button 
      className={\`\${baseStyles} \${variants[variant]} \${disabledStyles}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;`;
    }
    
    return `// Generated ${language} code for: ${prompt}
// This is a mock implementation for testing purposes

function generatedFunction() {
  console.log("Hello from generated ${language} code!");
  return "Generated content based on: ${prompt}";
}

export default generatedFunction;`;
  };

  const filename = prompt.toLowerCase().includes('button') ? 
    `Button.${getFileExtension()}` : 
    `GeneratedCode.${getFileExtension()}`;

  return {
    files: [
      {
        filename: filename,
        content: generateSampleCode(),
        language: langLower
      }
    ],
    explanation: `Generated ${language}${framework ? ` with ${framework}` : ''} code for "${prompt}". This implementation includes modern best practices and is ready for use in your application. Note: This is a mock response for testing purposes.`
  };
}
