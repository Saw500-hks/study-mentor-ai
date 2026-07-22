"use client";

import React from "react";
import Link from "next/link";
import { 
  Bot, 
  BrainCircuit, 
  Calendar, 
  FileText, 
  Code2, 
  BarChart3, 
  UserCheck, 
  Sparkles, 
  LayoutDashboard 
} from "lucide-react";

export type TabType = "tutor" | "quiz" | "planner" | "doc-chat" | "playground" | "analytics";
export type RoleType = "Student" | "Teacher" | "Admin";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userRole: RoleType;
  setUserRole: (role: RoleType) => void;
}

export default function Sidebar({ activeTab, setActiveTab, userRole, setUserRole }: SidebarProps) {
  const navItems: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: "tutor", label: "AI Tutor", icon: <Bot className="w-5 h-5" />, badge: "AI" },
    { id: "quiz", label: "Smart Quiz", icon: <BrainCircuit className="w-5 h-5" /> },
    { id: "planner", label: "Study Planner", icon: <Calendar className="w-5 h-5" /> },
    { id: "doc-chat", label: "PDF Textbook Chat", icon: <FileText className="w-5 h-5" /> },
    { id: "playground", label: "Code Sandbox", icon: <Code2 className="w-5 h-5" /> },
    { id: "analytics", label: "Analytics Hub", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 selection:bg-indigo-500">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/25">
            SM
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              StudyMentor <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-xs text-indigo-400 font-medium">AI Classroom System</div>
          </div>
        </div>

        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-800 transition-all border border-slate-700/80"
        >
          <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          <span>Overview Dashboard</span>
        </Link>

        {/* Role Selector */}
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
            <span>Workspace Role</span>
            <UserCheck className="w-3 h-3 text-slate-500" />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(["Student", "Teacher", "Admin"] as RoleType[]).map((r) => (
              <button
                key={r}
                onClick={() => setUserRole(r)}
                className={`text-xs py-1.5 rounded-lg font-medium transition-all ${
                  userRole === r
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Engine</span>
          <span className="font-mono text-indigo-400">Next.js 15</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Deploy</span>
          <span className="font-medium text-emerald-400">Vercel Ready</span>
        </div>
      </div>
    </aside>
  );
}
