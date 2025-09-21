import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateCodeRequestSchema, type GenerateCodeRequest } from "@shared/schema";

interface CodeGeneratorProps {
  onGenerationComplete: (generationId: string) => void;
}

const quickPrompts = [
  "Create a React component for a todo list",
  "Write a Python function to sort an array", 
  "Create a responsive CSS grid layout",
  "Build a REST API endpoint with Express.js"
];

const languages = [
  "JavaScript",
  "Python", 
  "HTML/CSS",
  "TypeScript",
  "React/JSX",
  "Node.js",
  "PHP",
  "Java"
];

const frameworks = [
  "None",
  "React",
  "Vue.js", 
  "Angular",
  "Express.js",
  "Django",
  "Laravel",
  "Next.js"
];

export default function CodeGenerator({ onGenerationComplete }: CodeGeneratorProps) {
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GenerateCodeRequest>({
    resolver: zodResolver(generateCodeRequestSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      prompt: "",
      language: "JavaScript",
      framework: "None",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateCodeRequest) => {
      const response = await apiRequest("POST", "/api/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Code generated successfully!",
        description: "Your code has been generated and is ready to view.",
      });
      onGenerationComplete(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
      form.reset();
      setCharCount(0);
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GenerateCodeRequest) => {
    if (data.framework === "None") {
      data.framework = undefined;
    }
    generateMutation.mutate(data);
  };

  const handleQuickPrompt = (prompt: string) => {
    form.setValue("prompt", prompt);
    setCharCount(prompt.length);
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">What would you like to build?</h2>
          <p className="text-muted-foreground">Describe your code requirements and I'll generate it for you.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-sm"
                    data-testid={`button-quick-prompt-${index}`}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="e.g., Create a React component that displays a list of users with search functionality..."
                          className="h-32 resize-none pr-16"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setCharCount(e.target.value.length);
                          }}
                          data-testid="input-prompt"
                        />
                        <div className="absolute bottom-3 right-3">
                          <span 
                            className={`text-xs ${
                              charCount > 500 
                                ? "text-destructive font-medium" 
                                : "text-muted-foreground"
                            }`} 
                            data-testid="text-char-count"
                          >
                            {charCount}/500
                          </span>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Programming Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-language">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Framework/Library</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-framework">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {frameworks.map((framework) => (
                            <SelectItem key={framework} value={framework}>
                              {framework}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={generateMutation.isPending || !form.formState.isValid || !form.watch("prompt").trim()}
                className="px-8 py-3 font-medium flex items-center space-x-2"
                data-testid="button-generate"
              >
                {generateMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic-wand-sparkles"></i>
                    <span>Generate Code</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
