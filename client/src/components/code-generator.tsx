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
    <div className="space-y-6">
     

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <span className="mr-2">⚡</span> Quick Start Templates
                </h3>
                <div className="flex flex-wrap gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickPrompt(prompt)}
                      className="text-sm bg-white/10 border-white/20 text-gray-200 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-pink-500/20 hover:border-cyan-400/40 hover:text-white transition-all duration-300 backdrop-blur-sm"
                      data-testid={`button-quick-prompt-${index}`}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        {/* Enhanced animated background glow with multiple layers */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition-all duration-500 animate-pulse" style={{animationDuration: '3s'}}></div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-pink-500 via-cyan-500 to-purple-500 rounded-2xl blur-sm opacity-15 group-hover:opacity-30 group-focus-within:opacity-45 transition-all duration-500 animate-pulse" style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
                        
                        {/* Main container */}
                        <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-xl border border-white/20 backdrop-blur-xl overflow-hidden">
                          {/* Top gradient bar */}
                          <div className="h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-60"></div>
                          
                          {/* Floating label */}
                          <div className="absolute top-4 left-4 z-30">
                            <span className="text-xs font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text flex items-center">
                              <span className="mr-1">💭</span>
                              Describe your vision
                            </span>
                          </div>
                          
                          {/* Textarea */}
                          <Textarea
                            placeholder="e.g., Create a React component that displays a list of users with search functionality and real-time filtering..."
                            className="h-48 resize-none pt-12 pb-16 px-6 bg-transparent border-0 text-white placeholder:text-gray-400/70 focus:ring-0 focus:outline-none text-base leading-relaxed transition-all duration-500 hover:placeholder:text-gray-300/80 focus:placeholder:text-gray-300/90"
                            style={{
                              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.1) 0%, rgba(51, 65, 85, 0.1) 100%)',
                              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setCharCount(e.target.value.length);
                            }}
                            data-testid="input-prompt"
                          />
                          
                          {/* Bottom section with character count and decorative elements */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4">
                            <div className="flex justify-between items-center">
                              {/* Decorative icons */}
                              <div className="flex space-x-2 opacity-40">
                                <span className="text-cyan-400">⚡</span>
                                <span className="text-purple-400">🎨</span>
                                <span className="text-pink-400">✨</span>
                              </div>
                              
                              {/* Enhanced character count with animated elements */}
                              <div className="flex items-center space-x-3">
                                <div className="relative h-2 w-24 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm">
                                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/50 to-slate-700/50 rounded-full" />
                                  <div 
                                    className={`h-full transition-all duration-500 relative overflow-hidden rounded-full ${
                                      charCount > 500 
                                        ? "bg-gradient-to-r from-red-500 via-red-400 to-pink-500" 
                                        : charCount > 400
                                        ? "bg-gradient-to-r from-yellow-500 via-orange-400 to-red-400"
                                        : "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                                    }`}
                                    style={{ width: `${Math.min((charCount / 500) * 100, 100)}%` }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{animationDuration: '2s'}} />
                                  </div>
                                </div>
                                <span 
                                  className={`text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm border transition-all duration-500 ${
                                    charCount > 500 
                                      ? "text-red-300 bg-red-500/20 border-red-400/30 shadow-red-500/20 shadow-lg animate-pulse" 
                                      : charCount > 400
                                      ? "text-yellow-300 bg-yellow-500/20 border-yellow-400/30"
                                      : "text-cyan-300 bg-cyan-500/20 border-cyan-400/30"
                                  }`} 
                                  data-testid="text-char-count"
                                >
                                  {charCount}/500
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced floating particles with better timing */}
                          <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-40 animate-ping" style={{animationDelay: '0s', animationDuration: '2s'}}></div>
                            <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.7s', animationDuration: '3s'}}></div>
                            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-35 animate-ping" style={{animationDelay: '1.4s', animationDuration: '2.5s'}}></div>
                            <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-emerald-400 rounded-full opacity-30 animate-pulse" style={{animationDelay: '2.1s', animationDuration: '2s'}}></div>
                            <div className="absolute bottom-1/4 right-1/2 w-1 h-1 bg-yellow-400 rounded-full opacity-25 animate-ping" style={{animationDelay: '2.8s', animationDuration: '3s'}}></div>
                          </div>
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
                      <FormLabel className="text-gray-300 font-semibold flex items-center">
                        <span className="mr-2">💻</span> Programming Language
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 focus:border-cyan-400/50 transition-all duration-300" data-testid="select-language">
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
                      <FormLabel className="text-gray-300 font-semibold flex items-center">
                        <span className="mr-2">🚀</span> Framework/Library
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 focus:border-cyan-400/50 transition-all duration-300" data-testid="select-framework">
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

            <div className="flex justify-center mt-8">
              <Button
                type="submit"
                disabled={generateMutation.isPending || !form.formState.isValid || !form.watch("prompt").trim()}
                className="relative px-12 py-4 font-bold text-lg bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3 overflow-hidden group"
                data-testid="button-generate"
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Button content */}
                <div className="relative z-10">
                  {generateMutation.isPending ? (
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <div className="absolute inset-0 border-2 border-transparent border-t-cyan-300 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}} />
                      </div>
                      <span className="animate-pulse">✨ Generating Magic...</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}} />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center space-x-3">
                      {/* Sparkle animations on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        {/* Large sparkles */}
                        <div className="absolute top-1 left-4 w-3 h-3 text-yellow-300 animate-ping" style={{animationDelay: '0s', animationDuration: '1.5s'}}>
                          ✨
                        </div>
                        <div className="absolute top-2 right-8 w-2 h-2 text-cyan-300 animate-ping" style={{animationDelay: '0.3s', animationDuration: '1.8s'}}>
                          ⭐
                        </div>
                        <div className="absolute bottom-1 left-12 w-2 h-2 text-pink-300 animate-ping" style={{animationDelay: '0.6s', animationDuration: '1.2s'}}>
                          ✦
                        </div>
                        <div className="absolute bottom-2 right-4 w-3 h-3 text-purple-300 animate-ping" style={{animationDelay: '0.9s', animationDuration: '1.6s'}}>
                          ✨
                        </div>
                        <div className="absolute top-3 left-20 w-1.5 h-1.5 text-emerald-300 animate-ping" style={{animationDelay: '1.2s', animationDuration: '1.4s'}}>
                          ⭐
                        </div>
                        <div className="absolute bottom-3 right-12 w-2 h-2 text-orange-300 animate-ping" style={{animationDelay: '1.5s', animationDuration: '1.7s'}}>
                          ✦
                        </div>
                        
                        {/* Small sparkle particles */}
                        <div className="absolute top-0 left-8 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s', animationDuration: '1s'}} />
                        <div className="absolute top-4 right-6 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s', animationDuration: '1.3s'}} />
                        <div className="absolute bottom-0 left-16 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.8s', animationDuration: '1.1s'}} />
                        <div className="absolute bottom-4 right-2 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1.1s', animationDuration: '1.4s'}} />
                        <div className="absolute top-2 left-24 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '1.4s', animationDuration: '1.2s'}} />
                        
                        {/* Floating light particles */}
                        <div className="absolute top-1 right-10 w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{animationDelay: '0.4s', animationDuration: '2s'}} />
                        <div className="absolute bottom-1 left-6 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.7s', animationDuration: '1.8s'}} />
                        <div className="absolute top-3 right-14 w-1 h-1 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '1.6s'}} />
                      </div>
                      
                      {/* Enhanced button content */}
                      <span className="text-xl group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300">🪄</span>
                      <span className="font-bold group-hover:text-white transition-colors duration-300">Generate Code with AI</span>
                      <span className="text-xl group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300">✨</span>
                      
                      {/* Enhanced pulsing dot */}
                      <div className="relative">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-ping" style={{animationDelay: '0.5s', animationDuration: '2s'}} />
                        <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" style={{animationDuration: '1.5s'}} />
                      </div>
                    </div>
                  )}
                </div>
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}
