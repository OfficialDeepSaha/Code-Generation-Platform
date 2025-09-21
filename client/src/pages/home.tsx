import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CodeGenerator from "../components/code-generator";
import CodeOutput from "../components/code-output";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Generation {
  id: string;
  prompt: string;
  language: string;
  framework?: string;
  createdAt: string;
}

export default function Home() {
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const { data: recentGenerations } = useQuery<Generation[]>({
    queryKey: ["/api/generations"],
    staleTime: 30000,
  });

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      javascript: "fab fa-js-square",
      typescript: "fab fa-js-square", 
      python: "fab fa-python",
      html: "fab fa-html5",
      css: "fab fa-css3-alt",
      react: "fab fa-react",
      nodejs: "fab fa-node-js",
      php: "fab fa-php",
      java: "fab fa-java",
    };
    return icons[language.toLowerCase()] || "fas fa-file-code";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-code text-primary-foreground text-sm"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold">CodeCraft AI</h1>
                <p className="text-xs text-muted-foreground">Transform ideas into code</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant={showHistory ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowHistory(!showHistory)}
                data-testid="button-history"
              >
                <i className="fas fa-history mr-2"></i>
                History
              </Button>
              <Button size="sm" data-testid="button-upgrade">
                <i className="fas fa-crown mr-2"></i>
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Code Generator */}
        <div className="max-w-4xl mx-auto mb-8">
          <CodeGenerator onGenerationComplete={setSelectedGeneration} />
        </div>

        {/* Code Output */}
        <div className="max-w-6xl mx-auto">
          <CodeOutput generationId={selectedGeneration} />
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="max-w-6xl mx-auto mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <i className="fas fa-history mr-2 text-muted-foreground"></i>
                    Generation History
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowHistory(false)}
                    data-testid="button-close-history"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
                <div data-testid="history-list">
                  {recentGenerations && recentGenerations.length > 0 ? (
                    <div className="space-y-3">
                      {recentGenerations.map((generation, index) => (
                        <div
                          key={generation.id}
                          className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedGeneration(generation.id);
                            setShowHistory(false);
                          }}
                          data-testid={`generation-item-${index}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                              <i className={`${getLanguageIcon(generation.language)} text-primary text-sm`}></i>
                            </div>
                            <div>
                              <p className="font-medium text-sm" data-testid={`text-prompt-${generation.id}`}>
                                {generation.prompt.length > 50 
                                  ? `${generation.prompt.substring(0, 50)}...` 
                                  : generation.prompt}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span data-testid={`text-language-${generation.id}`}>{generation.language}</span>
                                {generation.framework && (
                                  <>
                                    <span>•</span>
                                    <span data-testid={`text-framework-${generation.id}`}>{generation.framework}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span data-testid={`text-time-${generation.id}`}>
                                  {formatTimeAgo(generation.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="p-1 hover:bg-muted rounded" data-testid={`button-view-${generation.id}`}>
                            <i className="fas fa-chevron-right text-muted-foreground text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8" data-testid="empty-history">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-history text-2xl text-muted-foreground"></i>
                      </div>
                      <h4 className="text-lg font-medium mb-2">No generation history</h4>
                      <p className="text-muted-foreground">Start generating code to see your history here.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Generations (Auto-shown) */}
        {!showHistory && recentGenerations && recentGenerations.length > 0 && (
          <div className="max-w-6xl mx-auto mt-12">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <i className="fas fa-history mr-2 text-muted-foreground"></i>
                  Recent Generations
                </h3>
                <div className="space-y-3">
                  {recentGenerations.slice(0, 3).map((generation) => (
                    <div
                      key={generation.id}
                      className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
                      onClick={() => setSelectedGeneration(generation.id)}
                      data-testid={`generation-${generation.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <i className={`${getLanguageIcon(generation.language)} text-primary text-sm`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-sm" data-testid={`text-prompt-${generation.id}`}>
                            {generation.prompt.length > 50 
                              ? `${generation.prompt.substring(0, 50)}...` 
                              : generation.prompt}
                          </p>
                          <p className="text-xs text-muted-foreground" data-testid={`text-time-${generation.id}`}>
                            {formatTimeAgo(generation.createdAt)}
                          </p>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-muted rounded" data-testid={`button-view-${generation.id}`}>
                        <i className="fas fa-chevron-right text-muted-foreground text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
                {recentGenerations.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowHistory(true)}
                      data-testid="button-view-all-history"
                    >
                      View all {recentGenerations.length} generations
                      <i className="fas fa-chevron-right ml-2"></i>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-3">CodeCraft AI</h4>
              <p className="text-sm text-muted-foreground">
                Transform your ideas into production-ready code with AI assistance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Code Generation</li>
                <li>Multiple Languages</li>
                <li>Syntax Highlighting</li>
                <li>Export Options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <div className="flex space-x-4">
                <i className="fab fa-github text-muted-foreground hover:text-foreground cursor-pointer transition-colors"></i>
                <i className="fab fa-twitter text-muted-foreground hover:text-foreground cursor-pointer transition-colors"></i>
                <i className="fab fa-discord text-muted-foreground hover:text-foreground cursor-pointer transition-colors"></i>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CodeCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
