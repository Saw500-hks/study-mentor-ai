"use client";

import { useState } from "react";
import { FileText, Search, BookOpen, UploadCloud, ArrowRight } from "lucide-react";

interface DocSearchResult {
  answer: string;
  sources: Array<{ document: string; page: number; snippet: string }>;
}

export default function DocChatView() {
  const [query, setQuery] = useState("Explain Dynamic Programming");
  const [activeDoc, setActiveDoc] = useState("Introduction_to_Algorithms.pdf");
  const [results, setResults] = useState<DocSearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const mockDocuments = [
    { name: "Introduction_to_Algorithms.pdf", pages: 142, size: "14.2 MB" },
    { name: "Database_Systems_Guide.pdf", pages: 98, size: "8.7 MB" },
    { name: "Physics_Mechanics_Vol1.pdf", pages: 210, size: "22.1 MB" },
  ];

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/doc-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, filename: activeDoc }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">PDF Textbook RAG Chat</h2>
            <p className="text-xs text-slate-400">Ask questions over uploaded lecture notes and textbook PDF documents</p>
          </div>
        </div>

        {/* Upload simulated button */}
        <button className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-amber-400" /> Upload New PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column: Uploaded Document Index */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Indexed Documents</h3>
          <div className="space-y-2">
            {mockDocuments.map((doc, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDoc(doc.name)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  activeDoc === doc.name
                    ? "bg-slate-900 border-amber-500/50 shadow-md shadow-amber-500/10"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white text-xs truncate max-w-[180px]">{doc.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {doc.pages} pages &bull; {doc.size}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Search Query & Cited Sources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-amber-400" /> Search Content in {activeDoc}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about a concept in the textbook..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white font-medium text-xs rounded-xl transition-all shadow-md shrink-0"
              >
                {loading ? "Searching..." : "Query Document"}
              </button>
            </div>
          </div>

          {/* Results & Cited Sources */}
          {results && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Synthesized Answer
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{results.answer}</p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cited Textbook Passages</div>
                {results.sources.map((src, sIdx) => (
                  <div key={sIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-400">{src.document}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[11px]">
                        Page {src.page}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic">
                      &quot;{src.snippet}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
