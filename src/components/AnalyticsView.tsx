"use client";

import { BarChart3, TrendingUp, Users, Award, Clock } from "lucide-react";
import { RoleType } from "./Sidebar";

interface AnalyticsViewProps {
  userRole: RoleType;
}

export default function AnalyticsView({ userRole }: AnalyticsViewProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Analytics Hub & Performance Dashboard</h2>
            <p className="text-xs text-slate-400">
              {userRole === "Student"
                ? "Track your personal study hours, quiz accuracy, and subject progress"
                : `Classroom metrics and student engagement tracking (${userRole} Mode)`}
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          Role: {userRole}
        </div>
      </div>

      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Study Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">34.5 hrs</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last week
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Quiz Pass Rate</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">88.2%</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 10th Percentile
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Classmates</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">128 Students</div>
          <div className="text-[11px] text-slate-400 font-medium">Online now</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>AI Tutor Queries</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">52 Concepts</div>
          <div className="text-[11px] text-indigo-400 font-medium">Explained with analogies</div>
        </div>
      </div>

      {/* Visual Progress Bar Chart & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Hours Bar Chart Visualization */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Weekly Study Hours Logged</h3>
            <span className="text-xs text-slate-400">Current Week</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { day: "Mon", hours: 4.5, max: 6, color: "bg-indigo-500" },
              { day: "Tue", hours: 5.2, max: 6, color: "bg-purple-500" },
              { day: "Wed", hours: 3.8, max: 6, color: "bg-cyan-500" },
              { day: "Thu", hours: 6.0, max: 6, color: "bg-emerald-500" },
              { day: "Fri", hours: 4.0, max: 6, color: "bg-amber-500" },
              { day: "Sat", hours: 5.5, max: 6, color: "bg-indigo-400" },
              { day: "Sun", hours: 5.5, max: 6, color: "bg-purple-400" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{item.day}</span>
                  <span className="font-mono text-slate-400">{item.hours} hrs</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.hours / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Mastery Radar / Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Subject Mastery Breakdown</h3>
            <span className="text-xs text-slate-400">AI Evaluation</span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { subject: "Algorithms & Data Structures", mastery: 92, status: "Advanced" },
              { subject: "Calculus & Linear Algebra", mastery: 84, status: "Proficient" },
              { subject: "Physics & Mechanics", mastery: 76, status: "Intermediate" },
              { subject: "Cell Biology & Genetics", mastery: 88, status: "Proficient" },
            ].map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{s.subject}</span>
                  <span className="text-indigo-400 font-bold">{s.mastery}% ({s.status})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${s.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
