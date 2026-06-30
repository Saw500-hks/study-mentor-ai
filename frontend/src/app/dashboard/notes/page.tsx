"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { Sparkles, Notebook, Plus, RefreshCw, FileText, ChevronRight } from "lucide-react";

interface Note {
  id: number;
  title: string;
  subject: string;
  original_text: string;
  summary: string;
  created_at: string;
}

export default function NotesGeneratorPage() {
  const [title, setTitle] = useState("Photosynthesis Summary");
  const [subject, setSubject] = useState("Biology");
  const [originalText, setOriginalText] = useState("Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities. This chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water. The process is initiated by light absorption by green pigments called chlorophylls. Organisms that perform photosynthesis are photoautotrophs.");
  const [generating, setGenerating] = useState(false);
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        const list = await api.get("/notes/list");
        setNotes(list);
        if (list.length > 0) {
          setActiveNote(list[0]);
        }
      } catch (err) {
        console.error("Failed to load notes: ", err);
      }
    }
    loadNotes();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !originalText.trim()) return;

    setGenerating(true);
    try {
      const newNote = await api.post("/notes/generate", {
        title,
        subject,
        original_text: originalText
      });
      setNotes((prev) => [newNote, ...prev]);
      setActiveNote(newNote);
    } catch (err) {
      alert("Failed to summarize notes.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notes Summarizer</h1>
        <p className="text-muted-foreground mt-1">Convert long lectures, transcript texts, or book chapters into clean summary bullet points.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left column: form inputs & notes index */}
        <div className="md:col-span-1 border bg-card rounded-2xl p-6 shadow-sm h-fit space-y-6">
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Summarize Material
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  {["Biology", "Chemistry", "Physics", "Math", "Computer Science", "History"].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Krebs Cycle"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Raw Text / Lecture Transcript</label>
                <textarea
                  required
                  rows={6}
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder="Paste lecture logs, textbook notes, or outlines here..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none resize-none text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Notebook className="h-4.5 w-4.5" />
                    Generate Summary
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of past notes */}
          {notes.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Saved Summaries</h3>
              <div className="space-y-2">
                {notes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setActiveNote(n)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center justify-between ${
                      activeNote?.id === n.id
                        ? "bg-accent/40 border-primary text-foreground"
                        : "bg-background hover:bg-accent/20 border-border text-muted-foreground"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{n.title}</p>
                      <p className="text-xs truncate capitalize mt-0.5">{n.subject}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Note summary render */}
        <div className="md:col-span-2 space-y-6">
          {activeNote ? (
            <div className="border bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{activeNote.subject}</span>
                  <h2 className="text-2xl font-bold mt-0.5">{activeNote.title}</h2>
                </div>
                <div className="flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span>AI Generated Note</span>
                </div>
              </div>

              {/* Renderized Note summary text */}
              <div className="whitespace-pre-line text-sm leading-relaxed text-foreground prose prose-invert max-w-none">
                {activeNote.summary}
              </div>
            </div>
          ) : (
            <div className="border rounded-2xl bg-card p-16 text-center text-muted-foreground flex flex-col items-center justify-center h-full min-h-[300px]">
              <Notebook className="h-10 w-10 text-muted-foreground/35 mb-3" />
              <p className="font-bold">No study summaries yet.</p>
              <p className="text-xs mt-1 max-w-sm">Paste some lectures on the left to extract key concept points.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
