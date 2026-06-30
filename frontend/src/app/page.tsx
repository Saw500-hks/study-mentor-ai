"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  FileQuestion, 
  Calendar, 
  FileText, 
  Code, 
  CheckCircle,
  GraduationCap
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Interactive AI Tutor",
      description: "Chat with a virtual professor skilled in complex sciences, coding, and mathematical reasoning.",
      icon: Sparkles,
      color: "text-blue-500 bg-blue-500/10"
    },
    {
      title: "Smart Quiz Generator",
      description: "Auto-generate quizzes directly from study subjects or custom notes to gauge your actual score progression.",
      icon: FileQuestion,
      color: "text-purple-500 bg-purple-500/10"
    },
    {
      title: "AI Study Planner",
      description: "Map out weekly checklists, timelines, and goal checkpoints based on your personalized schedule.",
      icon: Calendar,
      color: "text-emerald-500 bg-emerald-500/10"
    },
    {
      title: "PDF & Document Chat",
      description: "Upload academic text books, slides, or documents and fetch exact answers instantly with source pages.",
      icon: FileText,
      color: "text-amber-500 bg-amber-500/10"
    },
    {
      title: "Coding Playground",
      description: "Evaluate syntax mistakes, debug logic problems, and test snippets in an AI coding sandbox.",
      icon: Code,
      color: "text-pink-500 bg-pink-500/10"
    },
    {
      title: "Teacher Dashboard",
      description: "Teachers can monitor student quiz performance, design assignments, and track class metrics.",
      icon: GraduationCap,
      color: "text-indigo-500 bg-indigo-500/10"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        </div>

        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-semibold text-primary animate-pulse shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Next-Gen AI Classroom & Learning Assistant</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-foreground via-primary to-blue-600 dark:to-cyan-400 bg-clip-text text-transparent">
            Supercharge Your Learning with StudyMentor AI
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground">
            A comprehensive, clean educational ecosystem powered by LangGraph AI agents. Summarize notes, generate mock tests, chat with PDF books, and get live debug help instantly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
            >
              Start Studying Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border bg-card px-6 py-3.5 text-sm font-semibold hover:bg-accent transition-all hover:scale-[1.02]"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to master any subject</h2>
          <p className="text-muted-foreground text-lg">
            Powerful tools engineered to help students study faster and teachers teach better.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className="group relative rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${feature.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-all">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works banner */}
      <section className="py-16 bg-accent/30 border-y px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why educators and learners trust StudyMentor</h2>
              <div className="space-y-4">
                {[
                  "Personalized curriculum mapped dynamically using LangGraph state flows.",
                  "Comprehensive progress logging via SQLAlchemy analytics counters.",
                  "Role-based environments tailoring features for Students, Teachers, and Admins.",
                  "Clean, gorgeous dark-mode optimized interface with fluid glassmorphism sheets."
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl border bg-card p-8 shadow-inner overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-2xl" />
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready to master your courses?</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Create a study deck, review with the tutor, generate a self-eval practice quiz, and watch your average score climb to 100%.
              </p>
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} StudyMentor AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-all">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-all">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
