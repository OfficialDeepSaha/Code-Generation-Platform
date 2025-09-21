import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import CodeGenerator from "../components/code-generator";
import CodeOutput from "../components/code-output";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Generation {
  id: string;
  prompt: string;
  language: string;
  framework?: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthResponse {
  user: User | null;
  authenticated: boolean;
}

export default function Home() {
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: authData, isLoading: authLoading } = useQuery<AuthResponse>({
    queryKey: ["/api/user"],
    staleTime: 30000,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/login");
    },
  });

  useEffect(() => {
    if (!authLoading && !authData?.authenticated) {
      setLocation("/login");
    }
  }, [authData, authLoading, setLocation]);

  const { data: recentGenerations } = useQuery<Generation[]>({
    queryKey: ["/api/generations"],
    staleTime: 30000,
    enabled: authData?.authenticated,
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-red-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-xl font-semibold">✨ Loading your workspace...</p>
          <p className="text-gray-300 mt-2">Preparing the magic</p>
        </div>
      </div>
    );
  }

  if (!authData?.authenticated) {
    return null; // Will redirect to login
  }

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.1),transparent_50%)] animate-pulse" style={{animationDuration: '4s'}} />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.1),transparent_50%)] animate-pulse" style={{animationDelay: '2s', animationDuration: '4s'}} />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05),transparent_50%)] animate-pulse" style={{animationDelay: '1s', animationDuration: '5s'}} />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-cyan-400/20 rounded-full animate-ping" style={{animationDelay: '0s', animationDuration: '3s'}} />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400/25 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}} />
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-400/20 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '3.5s'}} />
        <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse" style={{animationDelay: '3s', animationDuration: '2.5s'}} />
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-yellow-400/20 rounded-full animate-ping" style={{animationDelay: '4s', animationDuration: '3s'}} />
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-red-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Modern Enhanced Header */}
      <header className="relative bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 animate-pulse" style={{animationDuration: '4s'}} />
        <div className="absolute inset-0 bg-gradient-to-l from-pink-900/10 via-transparent to-emerald-900/10 animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-10 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '2s'}} />
          <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}} />
          <div className="absolute bottom-3 left-32 w-1 h-1 bg-pink-400/50 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '2.5s'}} />
          <div className="absolute top-1 right-40 w-0.5 h-0.5 bg-emerald-400/60 rounded-full animate-ping" style={{animationDelay: '1.5s', animationDuration: '4s'}} />
          <div className="absolute bottom-2 right-60 w-1 h-1 bg-yellow-400/40 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}} />
        </div>
        
        {/* Gradient Border Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 py-2">
            {/* Enhanced Logo Section */}
            <div className="flex items-center group cursor-pointer">
              <div className="relative mr-4">
                {/* Multi-layer Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500 animate-pulse" style={{animationDuration: '3s'}} />
                
                {/* Logo Container */}
                <div className="relative inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl border border-white/20">
                  {/* Inner Glow */}
                  <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                  
                  <svg
                    className="w-6 h-6 text-white drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  
                  {/* Sparkle Effects */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping">
                    ✨
                  </div>
                  {/* <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 text-cyan-300 opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{animationDelay: '0.5s'}}>
                    ⭐
                  </div> */}
                </div>
              </div>
              
              {/* Enhanced Brand Name */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-500 tracking-tight">
                  CodeCrafter
                </h1>
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="w-2 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" style={{animationDuration: '2s'}} />
                  <span className="text-xs font-medium text-white/60 tracking-wider uppercase">AI Powered</span>
                  <div className="w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{animationDuration: '2s', animationDelay: '1s'}} />
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex items-center space-x-6">
                <a href="#features" className="relative text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium group">
                  <span>Features</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </a>
                <a href="#about" className="relative text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium group">
                  <span>About</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300" />
                </a>
                <a href="#docs" className="relative text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium group">
                  <span>Docs</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
                </a>
              </nav>
            </div>

            {/* Enhanced User Menu */}
            <div className="flex items-center justify-end space-x-4 min-w-0">
              {/* Status Indicator */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white/80">Online</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10 transition-all duration-300 group">
                    {/* Avatar Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    
                    <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 group-hover:scale-105">
                      <AvatarImage src={authData.user?.avatar} alt={authData.user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 text-white font-bold text-lg border border-white/20">
                        {authData.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online Status Dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white/20 animate-pulse" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <p className="text-sm font-semibold text-white">{authData.user?.name}</p>
                      </div>
                      <p className="text-xs text-white/60 pl-5">
                        {authData.user?.email}
                      </p>
                      <div className="flex items-center space-x-2 pl-5 pt-1">
                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-cyan-300 border border-cyan-500/30">Pro User</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="m-2 p-3 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 rounded-lg group">
                    <svg
                      className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{animationDelay: '0.3s', animationDuration: '1s', animationFillMode: 'both'}}>
          {/* Code Generator */}
          <div className="lg:col-span-2">
            <Card className="h-fit shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    ✨ Generate Code with AI
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Describe what you want to build and let AI create production-ready code for you.
                  </p>
                </div>
                <CodeGenerator onGenerationComplete={setSelectedGeneration} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Generations */}
            <Card className="shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">🚀 Recent Generations</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentGenerations && recentGenerations.length > 0 ? (
                    recentGenerations.slice(0, 5).map((generation) => (
                      <div
                        key={generation.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                          selectedGeneration === generation.id
                            ? "border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 shadow-lg backdrop-blur-sm"
                            : "border-white/20 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-lg backdrop-blur-sm"
                        }`}
                        onClick={() => setSelectedGeneration(generation.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 rounded-md bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <i className={`${getLanguageIcon(generation.language)} text-xs text-white`}></i>
                              </div>
                              <span className="text-sm font-semibold capitalize text-white">
                                {generation.language}
                              </span>
                              {generation.framework && (
                                <span className="text-xs text-cyan-300 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                  {generation.framework}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-200 line-clamp-2 mb-2">
                              {generation.prompt.length > 60 
                                ? `${generation.prompt.substring(0, 60)}...` 
                                : generation.prompt}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTimeAgo(generation.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <p className="text-white font-semibold text-lg">No generations yet</p>
                      <p className="text-sm text-gray-300 mt-2">
                        ✨ Start by creating your first AI-powered code generation
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Code Output */}
        <div className="max-w-6xl mx-auto mt-8">
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

     
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-black/20 backdrop-blur-xl mt-16 relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-white bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">🚀 CodeCrafter AI</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Transform your ideas into production-ready code with cutting-edge AI assistance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">✨ Features</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">🤖 AI Code Generation</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">💻 Multiple Languages</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">🎨 Syntax Highlighting</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">📦 Export Options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">🛠️ Support</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">📚 Documentation</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">🔗 API Reference</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">👥 Community</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">📧 Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">🌐 Connect</h4>
              <div className="flex space-x-6">
                <i className="fab fa-github text-gray-300 hover:text-cyan-400 cursor-pointer transition-all duration-300 transform hover:scale-110 text-xl"></i>
                <i className="fab fa-twitter text-gray-300 hover:text-cyan-400 cursor-pointer transition-all duration-300 transform hover:scale-110 text-xl"></i>
                <i className="fab fa-discord text-gray-300 hover:text-cyan-400 cursor-pointer transition-all duration-300 transform hover:scale-110 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-gray-300">&copy; 2025 <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent font-semibold">CodeCrafter AI</span>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
