"use client";

import { useState } from "react";
import { Code2, Play, AlertCircle, CheckCircle2, Terminal } from "lucide-react";

export default function CodePlaygroundView() {
  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [code, setCode] = useState<string>(
    `# StudyMentor AI Code Sandbox\ndef binary_search(arr, target):\n    low = 0\n    high = len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint("Result:", binary_search([1, 3, 5, 7, 9], 5))`
  );
  const [output, setOutput] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [fixSuggestion, setFixSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/code-sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.output);
        setHasError(data.hasError);
        setDiagnosis(data.diagnosis);
        setFixSuggestion(data.fixSuggestion);
      }
    } catch {
      setOutput("Error executing code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Coding Sandbox & AI Debugger</h2>
            <p className="text-xs text-slate-400">Write Python or JavaScript code, execute, and diagnose syntax and logic issues</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "python" | "javascript")}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="python">Python 3.13</option>
            <option value="javascript">JavaScript (Node)</option>
          </select>

          <button
            onClick={runCode}
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {loading ? "Executing..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Editor & Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
        {/* Left: Code Editor Pane */}
        <div className="flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Editor &bull; {language}.py</span>
            <span className="text-[11px] text-slate-400">Interactive Sandbox</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-slate-900 p-4 font-mono text-sm text-emerald-300 focus:outline-none resize-none leading-relaxed selection:bg-emerald-500/30"
            spellCheck={false}
          />
        </div>

        {/* Right: Console Output & AI Diagnosis */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Execution Console */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex-1 flex flex-col min-h-[220px]">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Console Terminal Output
            </div>
            <pre className="p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap flex-1 overflow-y-auto">
              {output || "Click 'Run Code' above to execute code and view output."}
            </pre>
          </div>

          {/* AI Diagnosis Card */}
          {diagnosis && (
            <div
              className={`p-4 rounded-2xl border space-y-2 text-xs ${
                hasError
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                {hasError ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {hasError ? "AI Syntax & Error Diagnosis" : "Code Verification Successful"}
              </div>
              <p className="leading-relaxed">{diagnosis}</p>
              {fixSuggestion && (
                <div className="pt-1 text-[11px] font-mono text-slate-300">
                  <span className="font-bold text-amber-400">Suggestion: </span>
                  {fixSuggestion}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
