import { useMemo } from "react";

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  className?: string;
  "data-testid"?: string;
}

export default function SyntaxHighlighter({ 
  code, 
  language, 
  className = "",
  "data-testid": dataTestId 
}: SyntaxHighlighterProps) {
  const highlightedCode = useMemo(() => {
    // Simple syntax highlighting for common languages
    let highlighted = code;
    
    // Define language-specific patterns
    const patterns: Record<string, Array<{ regex: RegExp; className: string }>> = {
      javascript: [
        { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new)\b/g, className: "code-keyword" },
        { regex: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, className: "code-string" },
        { regex: /\/\/.*$/gm, className: "code-comment" },
        { regex: /\/\*[\s\S]*?\*\//g, className: "code-comment" },
        { regex: /\b\d+\.?\d*\b/g, className: "code-number" },
        { regex: /\b([A-Z][a-zA-Z0-9]*)\s*\(/g, className: "code-function" },
      ],
      typescript: [
        { regex: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|interface|type|enum|public|private|protected)\b/g, className: "code-keyword" },
        { regex: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, className: "code-string" },
        { regex: /\/\/.*$/gm, className: "code-comment" },
        { regex: /\/\*[\s\S]*?\*\//g, className: "code-comment" },
        { regex: /\b\d+\.?\d*\b/g, className: "code-number" },
        { regex: /\b([A-Z][a-zA-Z0-9]*)\s*\(/g, className: "code-function" },
      ],
      python: [
        { regex: /\b(def|class|if|elif|else|for|while|try|except|finally|with|import|from|as|return|yield|lambda|and|or|not|in|is|True|False|None)\b/g, className: "code-keyword" },
        { regex: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, className: "code-string" },
        { regex: /#.*$/gm, className: "code-comment" },
        { regex: /\b\d+\.?\d*\b/g, className: "code-number" },
        { regex: /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, className: "code-function" },
      ],
      html: [
        { regex: /(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(.*?)(&gt;)/g, className: "code-keyword" },
        { regex: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, className: "code-string" },
        { regex: /&lt;!--[\s\S]*?--&gt;/g, className: "code-comment" },
      ],
      css: [
        { regex: /\b(color|background|margin|padding|border|width|height|display|position|font|text|flex|grid|transform|transition|animation)\b/g, className: "code-keyword" },
        { regex: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, className: "code-string" },
        { regex: /\/\*[\s\S]*?\*\//g, className: "code-comment" },
        { regex: /\b\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|lh|vmin|vmax)\b/g, className: "code-number" },
        { regex: /#[a-fA-F0-9]{3,6}\b/g, className: "code-number" },
      ],
    };

    // Get patterns for the specified language (fallback to javascript)
    const langPatterns = patterns[language.toLowerCase()] || patterns.javascript;

    // Escape HTML entities
    highlighted = highlighted
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Apply syntax highlighting
    langPatterns.forEach(({ regex, className }) => {
      highlighted = highlighted.replace(regex, (match) => {
        return `<span class="${className}">${match}</span>`;
      });
    });

    return highlighted;
  }, [code, language]);

  return (
    <pre 
      className={`syntax-highlight rounded-lg p-4 overflow-x-auto font-mono text-sm ${className}`}
      data-testid={dataTestId}
    >
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}
