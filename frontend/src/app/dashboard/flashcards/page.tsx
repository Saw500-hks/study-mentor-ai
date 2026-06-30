"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { Sparkles, CreditCard, RefreshCw, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

interface Card {
  id: string;
  front: string;
  back: string;
}

interface Deck {
  id: number;
  name: string;
  subject: string;
  cards: Card[];
}

export default function FlashcardsPage() {
  const [subject, setSubject] = useState("Biology");
  const [topic, setTopic] = useState("Cell Division");
  const [numCards, setNumCards] = useState(5);
  const [generating, setGenerating] = useState(false);
  
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  
  // Card Player states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    async function loadDecks() {
      try {
        const list = await api.get("/flashcards/list");
        setDecks(list);
      } catch (err) {
        console.error("Failed to load flashcard decks: ", err);
      }
    }
    loadDecks();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    try {
      const newDeck = await api.post("/flashcards/generate", {
        name: `${topic} Deck`,
        subject,
        topic,
        num_cards: numCards
      });
      setDecks((prev) => [newDeck, ...prev]);
      startDeck(newDeck);
    } catch (err) {
      alert("Failed to generate flashcards. Please check database connection.");
    } finally {
      setGenerating(false);
    }
  };

  const startDeck = (deck: Deck) => {
    setActiveDeck(deck);
    setCurrentIdx(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % activeDeck.cards.length);
    }, 150);
  };

  const handlePrev = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + activeDeck.cards.length) % activeDeck.cards.length);
    }, 150);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Flashcards</h1>
        <p className="text-muted-foreground mt-1">Accelerate memorization using interactive spaced-repetition card decks.</p>
      </div>

      {activeDeck ? (
        // Flashcard Player
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{activeDeck.subject}</span>
              <h2 className="text-lg font-bold truncate leading-tight mt-0.5">{activeDeck.name}</h2>
            </div>
            <button 
              onClick={() => setActiveDeck(null)}
              className="text-sm font-semibold hover:text-primary transition-all"
            >
              Back to decks
            </button>
          </div>

          {/* Interactive Flipped Card Box */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative h-80 w-full cursor-pointer perspective-1000"
          >
            <div className={`relative h-full w-full rounded-2xl border bg-card p-6 shadow-md transition-all duration-500 transform-style-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}>
              {/* Front Side */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 backface-hidden">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Front</span>
                <p className="text-center font-bold text-xl sm:text-2xl leading-relaxed self-center">
                  {activeDeck.cards[currentIdx]?.front}
                </p>
                <p className="text-center text-xs text-muted-foreground">Click card to reveal answer</p>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 rotate-y-180 backface-hidden bg-accent/20 rounded-2xl">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Back (Explanation)</span>
                <p className="text-center text-base sm:text-lg leading-relaxed self-center overflow-y-auto max-h-48 pr-2">
                  {activeDeck.cards[currentIdx]?.back}
                </p>
                <p className="text-center text-xs text-muted-foreground">Click card to show term</p>
              </div>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-between px-4">
            <button
              onClick={handlePrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-card hover:bg-accent transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="text-xs font-semibold text-muted-foreground">
              Card {currentIdx + 1} of {activeDeck.cards.length}
            </span>

            <button
              onClick={handleNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-card hover:bg-accent transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        // Deck Creator Hub
        <div className="grid gap-8 md:grid-cols-3">
          {/* Form generator */}
          <div className="md:col-span-1 border bg-card rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Deck
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
                <label className="block text-sm font-medium mb-1">Topic</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Mitosis & Meiosis"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Number of Cards</label>
                <select
                  value={numCards}
                  onChange={(e) => setNumCards(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  {[3, 5, 8, 12].map((num) => (
                    <option key={num} value={num}>{num} Cards</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4.5 w-4.5" />
                    Generate Flashcards
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Decks index */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              Your Generated Flashcard Decks ({decks.length})
            </h2>

            {decks.length === 0 ? (
              <div className="border rounded-2xl bg-card p-12 text-center text-muted-foreground flex flex-col items-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground/35 mb-3" />
                <p className="font-medium">No card decks generated yet.</p>
                <p className="text-xs mt-1">Specify a study topic on the left to design custom revision decks.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {decks.map((deck) => (
                  <div key={deck.id} className="border bg-card rounded-xl p-5 flex flex-col justify-between hover:shadow-sm transition-all duration-300">
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{deck.subject}</span>
                      <h3 className="font-bold text-base mt-0.5 leading-tight">{deck.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{deck.cards.length} Revision Cards</p>
                    </div>
                    <button
                      onClick={() => startDeck(deck)}
                      className="mt-4 rounded-lg border py-2 text-xs font-semibold text-center hover:bg-accent transition-all"
                    >
                      Start Deck
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
