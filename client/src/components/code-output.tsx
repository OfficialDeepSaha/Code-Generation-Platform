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
      <div className="text-center py-16" data-testid="empty-state">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-code text-3xl text-muted-foreground"></i>
        </div>
        <h3 className="text-xl font-semibold mb-2">Ready to generate code</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Enter a prompt above to get started. I can help you create components, functions, APIs, and more.
        </p>
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

      {/* AI Explanation */}
      {data.explanation && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-robot text-accent-foreground"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Code Explanation</h3>
                <div className="text-muted-foreground whitespace-pre-wrap" data-testid="explanation-content">
                  {data.explanation}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
