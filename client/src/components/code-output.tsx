import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SyntaxHighlighter from "./syntax-highlighter";
import type { GeneratedFile } from "@shared/schema";

interface CodeOutputProps {
  generationId: string | null;
}

interface GenerationData {
  id: string;
  prompt: string;
  language: string;
  framework?: string;
  files: GeneratedFile[];
  explanation: string;
  createdAt: string;
}

export default function CodeOutput({ generationId }: CodeOutputProps) {
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<GenerationData>({
    queryKey: ["/api/generations", generationId],
    enabled: !!generationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard!",
        description: `${filename} has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!generationId) {
    return (
      <div className="relative text-center py-24 overflow-hidden" data-testid="empty-state">
        {/* Enhanced animated background with moving gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/40 to-slate-900/60 animate-pulse" style={{animationDuration: '4s'}} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(6,182,212,0.15),transparent_50%)] animate-pulse" style={{animationDelay: '0s', animationDuration: '3s'}} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.15),transparent_50%)] animate-pulse" style={{animationDelay: '1.5s', animationDuration: '3s'}} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse" style={{animationDelay: '3s', animationDuration: '4s'}} />
        </div>
        
        {/* Enhanced floating particles with better animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400/40 rounded-full animate-ping" style={{animationDelay: '0s', animationDuration: '2s'}} />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400/50 rounded-full animate-pulse" style={{animationDelay: '0.5s', animationDuration: '3s'}} />
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-400/40 rounded-full animate-ping" style={{animationDelay: '1s', animationDuration: '2.5s'}} />
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-cyan-300/50 rounded-full animate-pulse" style={{animationDelay: '1.5s', animationDuration: '2s'}} />
          <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-emerald-400/40 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '3s'}} />
          <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-yellow-400/50 rounded-full animate-pulse" style={{animationDelay: '2.5s', animationDuration: '2.5s'}} />
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/6 left-1/6 w-4 h-4 border border-cyan-400/20 rotate-45 animate-spin" style={{animationDelay: '0s', animationDuration: '8s'}} />
          <div className="absolute bottom-1/6 right-1/6 w-3 h-3 border border-pink-400/20 animate-spin" style={{animationDelay: '2s', animationDuration: '6s'}} />
          <div className="absolute top-1/2 right-1/8 w-2 h-2 bg-purple-400/20 rotate-45 animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}} />
        </div>
        
        {/* Main content with enhanced animations */}
        <div className="relative z-10 animate-fade-in" style={{animationDelay: '0.5s', animationDuration: '1s', animationFillMode: 'both'}}>
          {/* Enhanced icon container with multiple glow layers */}
          <div className="relative mx-auto mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" style={{animationDuration: '3s'}} />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse" style={{animationDelay: '1.5s', animationDuration: '3s'}} />
            <div className="relative w-36 h-36 bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-full flex items-center justify-center mx-auto border border-white/30 backdrop-blur-lg shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-pink-400/30 rounded-full flex items-center justify-center animate-pulse" style={{animationDuration: '2s'}}>
                <svg className="w-12 h-12 text-cyan-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24" style={{animationDelay: '0.5s', animationDuration: '2.5s'}}>
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Enhanced title with animated gradient */}
          <div className="mb-6">
            <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse" style={{animationDuration: '2s'}}>
              ✨ Ready to Generate Code
            </h3>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 mx-auto rounded-full animate-pulse" style={{animationDelay: '0.5s', animationDuration: '3s'}} />
          </div>
          
          {/* Enhanced description with staggered animations */}
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-gray-300 text-xl leading-relaxed animate-fade-in" style={{animationDelay: '1s', animationDuration: '1s', animationFillMode: 'both'}}>
              Enter a prompt above to get started. I can help you create
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/40 backdrop-blur-sm hover:bg-cyan-500/30 hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '1.2s', animationDuration: '0.8s', animationFillMode: 'both'}}>
                🧩 Components
              </span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/40 backdrop-blur-sm hover:bg-purple-500/30 hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '1.4s', animationDuration: '0.8s', animationFillMode: 'both'}}>
                ⚡ Functions
              </span>
              <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full border border-pink-400/40 backdrop-blur-sm hover:bg-pink-500/30 hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '1.6s', animationDuration: '0.8s', animationFillMode: 'both'}}>
                🔗 APIs
              </span>
              <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/40 backdrop-blur-sm hover:bg-emerald-500/30 hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '1.8s', animationDuration: '0.8s', animationFillMode: 'both'}}>
                🎨 And More
              </span>
            </div>
          </div>
          
          {/* Enhanced animated arrow with glow effect */}
          <div className="mt-12 flex justify-center animate-fade-in" style={{animationDelay: '2s', animationDuration: '1s', animationFillMode: 'both'}}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur-lg opacity-30 animate-pulse" style={{animationDuration: '2s'}} />
              <div className="relative animate-bounce bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20" style={{animationDuration: '2s'}}>
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card data-testid="loading-state">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div>
              <h3 className="text-lg font-semibold">Generating your code</h3>
              <p className="text-muted-foreground">Please wait...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="error-state">
        <CardContent className="p-8 text-center">
          <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-destructive"></i>
          </div>
          <h3 className="text-lg font-semibold mb-2">Generation failed</h3>
          <p className="text-muted-foreground">
            {error.message || "Failed to load the generated code. Please try again."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="code-output">
      {/* Generated Files */}
      {data.files.map((file, index) => (
        <Card key={index} className="overflow-hidden shadow-lg">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-secondary/50">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm font-medium ml-4" data-testid={`filename-${index}`}>
                {file.filename}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(file.content, file.filename)}
                data-testid={`button-copy-${index}`}
              >
                <i className="fas fa-copy"></i>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => downloadFile(file.content, file.filename)}
                data-testid={`button-download-${index}`}
              >
                <i className="fas fa-download"></i>
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            <SyntaxHighlighter
              code={file.content}
              language={file.language}
              data-testid={`code-content-${index}`}
            />
          </CardContent>
        </Card>
      ))}

      {/* Enhanced AI Explanation */}
      {data.explanation && (
        <div className="relative group animate-fade-in" style={{animationDelay: '0.6s', animationDuration: '1s', animationFillMode: 'both'}}>
          {/* Animated background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse" style={{animationDuration: '3s'}} />
          <div className="absolute -inset-1 bg-gradient-to-br from-pink-500/15 via-cyan-500/15 to-purple-500/15 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse" style={{animationDelay: '1.5s', animationDuration: '4s'}} />
          
          <Card className="relative bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 overflow-hidden">
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-ping" style={{animationDelay: '0s', animationDuration: '2s'}} />
              <div className="absolute top-8 right-12 w-1 h-1 bg-pink-400/30 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '3s'}} />
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '2.5s'}} />
            </div>
            
            <CardContent className="p-8 relative z-10">
              <div className="flex items-start space-x-6">
                {/* Enhanced AI Icon */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl blur-lg opacity-40 animate-pulse" style={{animationDuration: '2s'}} />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/30 to-purple-400/30 rounded-lg flex items-center justify-center animate-pulse" style={{animationDuration: '2.5s'}}>
                      <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-4">
                  {/* Enhanced Title */}
                  <div className="flex items-center space-x-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse" style={{animationDuration: '3s'}}>
                      🤖 AI Code Explanation
                    </h3>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
                      <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      <div className="w-2 h-2 bg-pink-400/60 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                    </div>
                  </div>
                  
                  {/* Decorative line */}
                  <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.5s', animationDuration: '2s'}} />
                  
                  {/* Enhanced Explanation Content */}
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400/50 via-purple-400/50 to-pink-400/50 rounded-full animate-pulse" style={{animationDuration: '4s'}} />
                    <div className="pl-6 pr-4 py-4 bg-slate-800/40 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
                      <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg" data-testid="explanation-content">
                        {data.explanation}
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Badge */}
                  <div className="flex items-center space-x-2 pt-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full border border-cyan-400/30 backdrop-blur-sm text-sm font-medium">
                      ✨ AI Generated
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full border border-purple-400/30 backdrop-blur-sm text-sm font-medium">
                      🧠 Smart Analysis
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
