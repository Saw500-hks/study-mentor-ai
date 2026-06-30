"use client";

import React, { useState, useRef, useEffect } from "react";
import { api } from "@/utils/api";
import { Send, Sparkles, BookOpen, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AITutorPage() {
  const [subject, setSubject] = useState("General");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am your AI Study Tutor. Which topic or concept would you like to master today? Pick a subject above, or type anything to get started!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followups, setFollowups] = useState<string[]>([
    "Explain photosynthesis with a simple analogy",
    "How does the binary search algorithm work?",
    "Give me a quick chemistry summary notes sheet"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/tutor/chat", {
        message: messageText,
        chat_history: messages,
        subject: subject
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response.reply }]);
      setFollowups(response.suggested_followups || []);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Sorry, I encountered an issue processing your request. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] border rounded-2xl bg-card overflow-hidden">
      {/* Header bar with subject selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-3 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base">AI Tutor Chatroom</h2>
            <p className="text-xs text-muted-foreground">Conversational memory powered by LangGraph</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["General", "Biology", "Chemistry", "Physics", "Math", "Computer Science"].map((sub) => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                subject === sub
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-accent text-muted-foreground"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages viewport */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-3xl ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full border ${
              msg.role === "user" 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-accent text-accent-foreground"
            }`}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
            </div>
            
            <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
              msg.role === "user"
                ? "bg-primary/5 text-foreground border-primary/20"
                : "bg-muted/30 text-foreground border-border"
            }`}>
              {/* Parse content into simple markdown line breaks */}
              <div className="whitespace-pre-line prose prose-invert max-w-none">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-3xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent border text-accent-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="rounded-2xl border bg-muted/30 px-4 py-3 flex items-center gap-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts list */}
      {followups.length > 0 && !loading && (
        <div className="px-4 py-2 border-t flex flex-wrap gap-2 bg-muted/10">
          {followups.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 p-3 border-t bg-background"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask the AI Tutor a question about ${subject}...`}
          disabled={loading}
          className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
}
