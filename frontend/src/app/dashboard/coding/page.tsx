"use client";

import React, { useState } from "react";
import { api } from "@/utils/api";
import { Sparkles, Code, Play, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";

export default function CodingAssistantPage() {
  const [code, setCode] = useState("def calculate_average(numbers):\n  total = 0\n  for num in numbers:\n  total += num\n  return total / len(numbers)\n\n# Call function with invalid division\nprint(calculate_average([]))");
  const [language, setLanguage] = useState("python");
  const [problemDescription, setProblemDescription] = useState("Calculate standard average of array values. Avoid ZeroDivisionError if array is empty.");
  
  const [analyzing, setAnalyzing] = useState(false);
  const [response, setResponse] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setAnalyzing(true);
    setResponse(null);
    try {
      const res = await api.post("/coding/analyze", {
        code,
        language,
        problem_description: problemDescription
      });
      setResponse(res);
    } catch (err) {
      alert("Failed to analyze code snippet.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (response?.fixed_code) {
      navigator.clipboard.writeText(response.fixed_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Coding Assistant</h1>
        <p className="text-muted-foreground mt-1">Debug syntax errors, refactor algorithms, and inspect logic flaws in real-time.</p>
      </div>

      <form onSubmit={handleAnalyze} className="grid gap-6 md:grid-cols-2">
        {/* Left Side: Code inputs */}
        <div className="border bg-card rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Code Editor Workspace
              </h2>
              
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Problem Description (Optional)
              </label>
              <input
                type="text"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="What is this code supposed to do?"
                className="w-full rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Write Code
              </label>
              <textarea
                rows={12}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border bg-[#0f172a] text-[#f8fafc] font-mono p-4 text-xs leading-relaxed focus:outline-none resize-none shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {analyzing ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Analyzing Syntax & Logic...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                Analyze & Debug Code
              </>
            )}
          </button>
        </div>

        {/* Right Side: AI analysis logs */}
        <div className="border bg-card rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
          {response ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Correctness banner */}
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                  response.is_correct
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    : "bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400"
                }`}>
                  {response.is_correct ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-bold text-sm">
                      {response.is_correct ? "Code logic is healthy!" : "Bugs or syntax issues identified!"}
                    </h3>
                    <p className="text-xs mt-0.5 leading-normal">{response.feedback}</p>
                  </div>
                </div>

                {/* Suggestions list */}
                {response.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fix Suggestions</h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                      {response.suggestions.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Refactored corrected block */}
                {response.fixed_code && (
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Refactored Corrected Code</h4>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1 text-[10px] bg-muted hover:bg-accent px-2 py-1 rounded transition-all font-semibold"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="rounded-lg bg-[#0f172a] text-[#f8fafc] font-mono p-4 text-[10px] leading-relaxed overflow-x-auto border max-h-56">
                      <code>{response.fixed_code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground flex-1">
              <Sparkles className="h-10 w-10 text-muted-foreground/35 mb-3" />
              <p className="font-bold">Awaiting code input...</p>
              <p className="text-xs mt-1 max-w-xs">Write or paste a code block on the left and hit the analyze button to diagnostic bugs.</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
