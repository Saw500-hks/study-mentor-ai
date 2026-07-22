"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Bot, 
  BrainCircuit, 
  Calendar, 
  FileText, 
  Code2, 
  BarChart3, 
  Users, 
  Clock, 
  Award, 
  Flame, 
  ArrowUpRight, 
  CheckCircle2, 
  BookOpen, 
  Plus, 
  UserCheck 
} from "lucide-react";

export default function DashboardPage() {
  const [role, setRole] = useState<"Student" | "Teacher" | "Admin">("Student");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20">
              SM
            </div>
            <Link href="/" className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5 hover:text-indigo-300 transition-colors">
              StudyMentor AI <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher Pill */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
              {(["Student", "Teacher", "Admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    role === r
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              Main Workspace <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8 flex-1">
        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Active Portal: {role} Workspace
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back to your AI Classroom! 👋
              </h1>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                {role === "Student" && "Track your study goals, test your mastery with AI quizzes, and resolve complex concepts."}
                {role === "Teacher" && "Monitor student engagement metrics, quiz average scores, and curriculum progress."}
                {role === "Admin" && "System operations, user roles, API usage telemetry, and server health overview."}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 shadow-xl">
              <Flame className="w-7 h-7 text-amber-400 fill-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-medium text-slate-400">Current Study Streak</div>
                <div className="text-xl font-black text-white">7 Days Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/?tab=tutor"
            className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">AI Tutor</div>
              <div className="text-xs text-slate-400">Ask questions with analogies</div>
            </div>
          </Link>

          <Link
            href="/?tab=quiz"
            className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">Smart Quiz</div>
              <div className="text-xs text-slate-400">Generate custom practice tests</div>
            </div>
          </Link>

          <Link
            href="/?tab=planner"
            className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">Study Planner</div>
              <div className="text-xs text-slate-400">Automated weekly timetables</div>
            </div>
          </Link>

          <Link
            href="/?tab=playground"
            className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">Code Sandbox</div>
              <div className="text-xs text-slate-400">Run & diagnose code snippets</div>
            </div>
          </Link>
        </div>

        {/* Role-Specific Overview Content */}
        {role === "Student" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Study Milestones & Tasks */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" /> Current Learning Tasks
                  </h3>
                  <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    3 Pending
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { task: "Complete Algorithms Quiz 2 (Binary Trees)", time: "Today, 5:00 PM", subject: "CS", tag: "Quiz" },
                    { task: "Review Derivatives & Integrals Analogy Notes", time: "Tomorrow, 10:00 AM", subject: "Math", tag: "Reading" },
                    { task: "Debug Python Recursion in Code Sandbox", time: "Friday, 2:00 PM", subject: "CS", tag: "Coding" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-white text-sm">{item.task}</div>
                          <div className="text-xs text-slate-400">{item.time} &bull; {item.subject}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quick Stats & Progress */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Weekly Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Total Hours</span>
                    <span className="font-bold text-white">14.5 hrs</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Quiz Accuracy</span>
                    <span className="font-bold text-emerald-400">88.5%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Concepts Clarified</span>
                    <span className="font-bold text-purple-400">18 Analogy Cards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {role === "Teacher" && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> Teacher Classroom Analytics & Engagement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Enrolled Students</div>
                <div className="text-2xl font-black text-white">128 Students</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Avg Quiz Completion</div>
                <div className="text-2xl font-black text-emerald-400">92.4%</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Top Struggling Topic</div>
                <div className="text-xl font-bold text-amber-400">Dynamic Programming</div>
              </div>
            </div>
          </div>
        )}

        {role === "Admin" && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" /> System Operations & Server Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Vercel Edge API Health</div>
                <div className="text-xl font-bold text-emerald-400">100% Operational</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Server Latency</div>
                <div className="text-xl font-bold text-white">18 ms</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">AI Tokens Processed</div>
                <div className="text-xl font-bold text-indigo-400">1.4M Tokens</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        StudyMentor AI Dashboard &bull; Deployed on Vercel
      </footer>
    </div>
  );
}
