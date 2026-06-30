"use client";

import React, { useState, useRef, useEffect } from "react";
import { api } from "@/utils/api";
import { Upload, FileText, Send, Sparkles, AlertCircle, File, User, BookOpen } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  source_pages?: number[];
}

export default function PDFChatPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [pagesCount, setPagesCount] = useState(0);
  const [fileName, setFileName] = useState("");
  
  const [uploading, setUploading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: "assistant", content: "Upload an academic PDF, textbook, or notes file on the left, and ask me questions about its content!" }
  ]);
  const [input, setInput] = useState("");
  const [querying, setQuerying] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.upload("/pdf/upload", file);
      setPdfId(res.pdf_id);
      setFileName(res.filename);
      setPagesCount(res.pages);
      setChatHistory([
        { role: "assistant", content: `Successfully processed and indexed "${res.filename}" (${res.pages} pages). Ask me anything about the content!` }
      ]);
    } catch (err: any) {
      alert(err.message || "Failed to process PDF file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !pdfId || querying) return;

    const userMsg = input;
    setInput("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setQuerying(true);

    try {
      const res = await api.post("/pdf/query", {
        pdf_id: pdfId,
        message: userMsg,
        chat_history: chatHistory.map(m => ({ role: m.role, content: m.content }))
      });

      setChatHistory((prev) => [
        ...prev, 
        { role: "assistant", content: res.reply, source_pages: res.source_pages }
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to fetch response. Make sure backend is running." }
      ]);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PDF Academic Chat</h1>
        <p className="text-muted-foreground mt-1">Upload educational books or syllabi and retrieve specific references.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Upload widgets */}
        <div className="md:col-span-1 border bg-card rounded-2xl p-6 shadow-sm h-fit space-y-6">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Document Manager
          </h2>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-all bg-muted/20"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.txt,.md"
              className="hidden"
            />
            <FileText className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
            <p className="text-xs font-semibold text-foreground">
              {file ? file.name : "Select PDF, TXT, or MD"}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Max upload limit 10MB</p>
          </div>

          {file && !pdfId && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? "Analyzing Document..." : "Upload & Index File"}
            </button>
          )}

          {pdfId && (
            <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
              <div className="flex gap-2.5 items-center">
                <File className="h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{fileName}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{pagesCount} parsed pages</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPdfId(null);
                  setFile(null);
                  setChatHistory([{ role: "assistant", content: "Upload an academic PDF and ask me questions about its content!" }]);
                }}
                className="w-full text-center text-xs font-bold text-destructive hover:underline mt-2"
              >
                Clear Document
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Chat interface */}
        <div className="md:col-span-2 border bg-card rounded-2xl h-[calc(100vh-16rem)] flex flex-col overflow-hidden shadow-sm">
          {/* Chat Window header */}
          <div className="p-4 border-b bg-muted/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-bold text-sm sm:text-base">Document Reader Chat</h3>
                <p className="text-[10px] text-muted-foreground">RAG querying with page-source citations</p>
              </div>
            </div>
          </div>

          {/* Chat logs viewport */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-2xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                  msg.role === "user" ? "bg-primary text-primary-foreground border-primary" : "bg-accent text-accent-foreground"
                }`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </div>

                <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed border ${
                  msg.role === "user" ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                  
                  {msg.source_pages && msg.source_pages.length > 0 && (
                    <div className="mt-2.5 pt-1.5 border-t flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                      <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                      <span>Source Pages:</span>
                      {msg.source_pages.map((p) => (
                        <span key={p} className="bg-accent px-1.5 py-0.5 rounded text-foreground">Page {p}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {querying && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent border">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="rounded-xl border bg-muted/30 px-4 py-2.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input footer */}
          <form onSubmit={handleSendQuery} className="p-3 border-t bg-background flex gap-2">
            <input
              type="text"
              disabled={!pdfId || querying}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={pdfId ? "Ask a question about the document..." : "Please upload a document to unlock chat."}
              className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!pdfId || querying || !input.trim()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all disabled:opacity-50 shrink-0 shadow"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
