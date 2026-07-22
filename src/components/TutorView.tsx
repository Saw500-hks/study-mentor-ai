"use client";

import { useState } from "react";
import { Send, Bot, Sparkles, Lightbulb, BookOpen, CheckCircle2 } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  analogy?: string;
  takeaways?: string[];
  timestamp: string;
}

export default function TutorView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your StudyMentor AI Tutor. Ask me any concept in Computer Science, Mathematics, Physics, or Biology and I will explain it with intuitive analogies!",
      analogy: "Think of me as your 24/7 personal tutor sitting right beside you in class.",
      takeaways: ["Ask complex questions", "Get real-world analogies", "Practice step-by-step reasoning"],
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("Computer Science");
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Explain recursion with a real-world analogy",
    "What is the intuitive concept of derivatives in calculus?",
    "How does photosynthesis convert light energy into glucose?",
    "What is Newton's Second Law of Motion?",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query, subject }),
      });
      const data = await res.json();

      if (data.success) {
        const aiMsg: Message = {
          sender: "ai",
          text: data.answer,
          analogy: data.analogy,
          takeaways: data.keyTakeaways,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I encountered a network issue while retrieving the explanation. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              AI Tutor Assistant <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">Conversational concept explanations with real-world analogies</p>
          </div>
        </div>

        {/* Subject Filter Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Subject:</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option>Computer Science</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Biology</option>
          </select>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all text-left"
          >
            💡 {p}
          </button>
        ))}
      </div>

      {/* Chat Conversation History */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.sender === "ai" && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 border space-y-3 ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900 text-slate-200 border-slate-800 rounded-tl-none shadow-xl"
              }`}
            >
              <p className="text-sm leading-relaxed">{m.text}</p>

              {m.analogy && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Analogy Breakdown:</span>
                    {m.analogy}
                  </div>
                </div>
              )}

              {m.takeaways && m.takeaways.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-indigo-400" /> Key Takeaways
                  </div>
                  {m.takeaways.map((tk, tIdx) => (
                    <div key={tIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tk}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-slate-400 text-right">{m.timestamp}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-slate-800 animate-pulse flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <span>AI Tutor is thinking & crafting analogy...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or request a concept explanation..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 focus:outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
