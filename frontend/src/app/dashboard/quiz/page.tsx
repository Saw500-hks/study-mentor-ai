"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { Sparkles, FileQuestion, HelpCircle, Check, X, ArrowRight, RefreshCw, Trophy } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  questions: Question[];
}

export default function AIQuizPage() {
  // Generation state
  const [subject, setSubject] = useState("Biology");
  const [topic, setTopic] = useState("Cell Structure");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [numQuestions, setNumQuestions] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const list = await api.get("/quiz/list");
        setQuizzes(list);
      } catch (err) {
        console.error("Failed to load quizzes: ", err);
      }
    }
    loadQuizzes();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    try {
      const newQuiz = await api.post("/quiz/generate", {
        subject,
        topic,
        difficulty,
        num_questions: numQuestions
      });
      setQuizzes((prev) => [newQuiz, ...prev]);
      startQuiz(newQuiz);
    } catch (err) {
      alert("Failed to generate quiz. Please check API credentials.");
    } finally {
      setGenerating(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || submitted) return;

    setSubmitted(true);
    if (selectedOpt === activeQuiz?.questions[currentIdx].correct_index) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    
    if (currentIdx + 1 < activeQuiz.questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Practice Quizzes</h1>
        <p className="text-muted-foreground mt-1">Generate dynamic multiple-choice assessments tailored to any subject.</p>
      </div>

      {activeQuiz ? (
        // Active Quiz Player
        <div className="max-w-2xl mx-auto border bg-card rounded-2xl p-6 md:p-8 shadow-sm">
          {!showResults ? (
            // Quiz questions mode
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{activeQuiz.subject}</span>
                  <h3 className="font-bold text-lg leading-tight mt-0.5">{activeQuiz.title}</h3>
                </div>
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
                  Question {currentIdx + 1} of {activeQuiz.questions.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / activeQuiz.questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="space-y-4">
                <p className="font-bold text-base sm:text-lg">
                  {activeQuiz.questions[currentIdx].question}
                </p>

                <div className="grid gap-3 pt-2">
                  {activeQuiz.questions[currentIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx;
                    const isCorrect = oIdx === activeQuiz.questions[currentIdx].correct_index;
                    
                    let cardClass = "border bg-card text-foreground";
                    let icon = null;

                    if (submitted) {
                      if (isCorrect) {
                        cardClass = "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 font-medium";
                        icon = <Check className="h-4.5 w-4.5 text-emerald-500" />;
                      } else if (isSelected) {
                        cardClass = "border-destructive bg-destructive/10 dark:bg-destructive/5 text-destructive dark:text-red-400";
                        icon = <X className="h-4.5 w-4.5 text-destructive" />;
                      } else {
                        cardClass = "opacity-60 border-border bg-card";
                      }
                    } else if (isSelected) {
                      cardClass = "border-primary bg-primary/5 text-primary-foreground text-foreground";
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => setSelectedOpt(oIdx)}
                        className={`flex items-center justify-between p-4 rounded-xl text-left text-sm transition-all focus:outline-none ${
                          !submitted ? "hover:bg-accent hover:border-accent-foreground/30 hover:scale-[1.01]" : ""
                        } ${cardClass}`}
                      >
                        <span className="flex-1 pr-3">{opt}</span>
                        {icon}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation & Action footer */}
              <div className="flex flex-col gap-4 border-t pt-6">
                {submitted && (
                  <div className="rounded-xl bg-muted/40 p-4 border text-sm leading-relaxed text-muted-foreground animate-fadeIn">
                    <p className="font-bold text-foreground mb-1">Explanation:</p>
                    {activeQuiz.questions[currentIdx].explanation}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="text-sm font-medium hover:text-primary transition-all"
                  >
                    Quit Quiz
                  </button>

                  {!submitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOpt === null}
                      className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
                    >
                      {currentIdx + 1 < activeQuiz.questions.length ? "Next Question" : "View Results"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Results screen
            <div className="text-center py-6 space-y-6">
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Trophy className="h-10 w-10" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Quiz Completed!</h3>
                <p className="text-muted-foreground text-sm">
                  You scored <span className="text-primary font-bold">{score}</span> out of <span className="font-semibold">{activeQuiz.questions.length}</span> (
                  {Math.round((score / activeQuiz.questions.length) * 100)}%)
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => startQuiz(activeQuiz)}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold hover:bg-accent transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Quiz
                </button>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
                >
                  Back to Hub
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Generator Hub
        <div className="grid gap-8 md:grid-cols-3">
          {/* Creator Form */}
          <div className="md:col-span-1 border bg-card rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate New Quiz
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  {["Biology", "Chemistry", "Physics", "Math", "Computer Science", "History", "Literature"].map((sub) => (
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
                  placeholder="e.g. Organic Molecules"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Questions</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                >
                  {[3, 5, 10, 15].map((num) => (
                    <option key={num} value={num}>{num} Questions</option>
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
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4.5 w-4.5" />
                    Generate Practice Quiz
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of past generated quizzes */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-muted-foreground" />
              Your Generated Quizzes ({quizzes.length})
            </h2>

            {quizzes.length === 0 ? (
              <div className="border rounded-2xl bg-card p-12 text-center text-muted-foreground flex flex-col items-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground/35 mb-3" />
                <p className="font-medium">No practice quizzes generated yet.</p>
                <p className="text-xs mt-1">Specify a topic on the left and tap generate to kickstart your practice.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="border bg-card rounded-xl p-5 flex flex-col justify-between hover:shadow-sm transition-all duration-300">
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{quiz.subject}</span>
                      <h3 className="font-bold text-base mt-0.5 leading-tight">{quiz.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">Difficulty: {quiz.difficulty} • {quiz.questions.length} Questions</p>
                    </div>
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="mt-4 rounded-lg border py-2 text-xs font-semibold text-center hover:bg-accent transition-all"
                    >
                      Start Test
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
