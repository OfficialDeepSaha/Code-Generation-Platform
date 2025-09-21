import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

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

export default function Login() {
  const [, setLocation] = useLocation();

  const { data: authData } = useQuery<AuthResponse>({
    queryKey: ["/api/user"],
    staleTime: 30000,
  });

  useEffect(() => {
    if (authData?.authenticated) {
      setLocation("/");
    }
  }, [authData, setLocation]);

  const handleGoogleLogin = () => {
    window.location.href = "/auth/google";
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 via-transparent to-pink-900/50 animate-pulse" style={{animationDuration: '4s'}} />
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-900/30 via-transparent to-emerald-900/30 animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}} />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '3s'}} />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}} />
        <div className="absolute bottom-32 left-40 w-1 h-1 bg-pink-400/60 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '3s'}} />
        <div className="absolute top-60 right-20 w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-pulse" style={{animationDelay: '3s', animationDuration: '2.5s'}} />
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-yellow-400/50 rounded-full animate-bounce" style={{animationDelay: '4s', animationDuration: '3.5s'}} />
        <div className="absolute top-32 left-60 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-ping" style={{animationDelay: '1.5s', animationDuration: '4s'}} />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-indigo-400/40 rounded-full animate-pulse" style={{animationDelay: '2.5s', animationDuration: '3s'}} />
      </div>
      
      {/* Geometric Shapes */}
      <div className="absolute top-10 right-10 w-20 h-20 border border-cyan-400/20 rounded-full animate-spin" style={{animationDuration: '20s'}} />
      <div className="absolute bottom-10 left-10 w-16 h-16 border border-purple-400/20 rotate-45 animate-pulse" style={{animationDuration: '3s'}} />
      <div className="absolute top-1/3 right-20 w-12 h-12 border border-pink-400/20 rounded-lg animate-bounce" style={{animationDuration: '4s'}} />
      
      <div className="relative w-full max-w-md z-10">
        {/* Enhanced Logo and Brand */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="relative inline-block mb-6">
            {/* Multi-layer Glow Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-30 scale-110 animate-pulse" style={{animationDuration: '3s'}} />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-3xl blur-xl opacity-40 animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}} />
            
            {/* Logo Container */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl border border-white/20 transform hover:scale-110 transition-all duration-500 group">
              {/* Inner Glow */}
              <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
              
              <svg
                className="w-10 h-10 text-white drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
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
              <div className="absolute -top-2 -right-2 w-3 h-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping">
                ✨
              </div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{animationDelay: '0.5s'}}>
                ⭐
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent mb-3 tracking-tight">
            CodeCrafter
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" style={{animationDuration: '2s'}} />
            <span className="text-sm font-medium text-white/80 tracking-wider uppercase">AI Powered</span>
            <div className="w-3 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{animationDuration: '2s', animationDelay: '1s'}} />
          </div>
          <p className="text-white/70 text-lg font-medium">
            Next-generation code generation platform
          </p>
        </div>

        {/* Enhanced Login Card */}
        <Card className="relative bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Card Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          
          <CardHeader className="relative text-center pb-8 pt-8 overflow-hidden">
            {/* Animated Sidebar Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 via-pink-500 to-emerald-400 animate-pulse" style={{animationDuration: '3s'}} />
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-pink-500 via-purple-500 to-cyan-400 animate-pulse" style={{animationDuration: '3s', animationDelay: '1.5s'}} />
            
            {/* Enhanced Sidebar Effects */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cyan-400/20 via-purple-500/10 to-transparent animate-pulse" style={{animationDuration: '4s'}} />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-emerald-400/20 via-pink-500/10 to-transparent animate-pulse" style={{animationDuration: '4s', animationDelay: '2s'}} />
            
            {/* Floating Sidebar Particles */}
            <div className="absolute left-2 top-6 w-1 h-1 bg-cyan-400/80 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}} />
            <div className="absolute left-4 top-16 w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-ping" style={{animationDelay: '1s', animationDuration: '3s'}} />
            <div className="absolute right-2 top-10 w-1 h-1 bg-pink-400/80 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.5s'}} />
            <div className="absolute right-4 top-20 w-0.5 h-0.5 bg-emerald-400/60 rounded-full animate-ping" style={{animationDelay: '1.5s', animationDuration: '3s'}} />
            
            <CardTitle className="relative text-3xl font-bold text-white mb-2 z-10">
              Welcome Back
            </CardTitle>
            <CardDescription className="relative text-white/70 text-lg z-10">
              Sign in to continue generating amazing code
            </CardDescription>
            
            {/* Enhanced Decorative Elements */}
            <div className="relative flex justify-center mt-4 z-10">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" style={{animationDelay: '0s'}} />
                <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
                <div className="w-2 h-2 bg-pink-400/60 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
              </div>
            </div>
            
            {/* Gradient Accent Lines */}
            <div className="absolute left-6 top-1/2 w-6 h-px bg-gradient-to-r from-cyan-400/60 to-transparent transform -translate-y-1/2 animate-pulse" style={{animationDelay: '0s', animationDuration: '2s'}} />
            <div className="absolute right-6 top-1/2 w-6 h-px bg-gradient-to-l from-emerald-400/60 to-transparent transform -translate-y-1/2 animate-pulse" style={{animationDelay: '1s', animationDuration: '2s'}} />
          </CardHeader>
          
          <CardContent className="relative space-y-8 pb-8">
            {/* Enhanced Google Login Button */}
            <Button
              onClick={handleGoogleLogin}
              className="relative w-full h-14 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 group overflow-hidden"
              variant="outline"
            >
              {/* Button Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center justify-center">
                <svg
                  className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-semibold text-lg">Continue with Google</span>
              </div>
            </Button>

            {/* Enhanced Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 py-2 bg-white/5 backdrop-blur-sm rounded-full text-white/80 font-medium border border-white/10">
                  🔒 Secure Authentication
                </span>
              </div>
            </div>

            {/* Enhanced Features */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center text-white/80 group hover:text-white transition-colors duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">Generate code in multiple languages</span>
              </div>
              
              <div className="flex items-center text-white/80 group hover:text-white transition-colors duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">Save and manage your generations</span>
              </div>
              
              <div className="flex items-center text-white/80 group hover:text-white transition-colors duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">AI-powered explanations</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Footer */}
        <div className="text-center mt-10 text-white/60">
          <p className="text-sm leading-relaxed">
            By signing in, you agree to our{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}