"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import { 
  Sparkles, 
  FileQuestion, 
  Calendar, 
  FileText,
  TrendingUp,
  Clock,
  BookOpen,
  Notebook
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

interface AnalyticsData {
  metrics: {
    quizzes: number;
    study_plans: number;
    notes: number;
    flashcard_decks: number;
    total_study_time: number;
  };
  study_hours_chart: Array<{ name: string; hours: number }>;
  quiz_scores_chart: Array<{ quiz: string; score: number }>;
  recent_activities: Array<{ id: number; description: string; date: string }>;
}

export default function StudentDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchAnalytics() {
      try {
        const summary = await api.get("/analytics/summary");
        setData(summary);
      } catch (err) {
        console.error("Failed to load analytics: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const metrics = data?.metrics || { quizzes: 0, study_plans: 0, notes: 0, flashcard_decks: 0, total_study_time: 0 };
  const activities = data?.recent_activities || [];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {typeof window !== "undefined" ? localStorage.getItem("user_name") || "Student" : "Student"}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-xl">
          You have completed {metrics.quizzes} AI quizzes and generated {metrics.notes} sets of summary notes. Keep up the momentum!
        </p>
      </div>

      {/* Grid Quick Actions */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/dashboard/tutor", title: "AI Tutor", desc: "Chat with AI coach", icon: Sparkles, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
          { href: "/dashboard/quiz", title: "AI Quizzes", desc: "Generate self-test", icon: FileQuestion, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
          { href: "/dashboard/planner", title: "Study Planner", desc: "Map weeks schedules", icon: Calendar, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
          { href: "/dashboard/pdf-chat", title: "PDF Chat", desc: "Ask document facts", icon: FileText, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
        ].map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              href={action.href}
              className={`flex flex-col p-4 rounded-xl border bg-card hover:scale-[1.02] hover:shadow-sm transition-all duration-300 ${action.color}`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <h3 className="font-bold text-foreground text-sm sm:text-base">{action.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Numerical Stats row */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Study Hours", value: `${metrics.total_study_time.toFixed(1)}h`, icon: Clock },
          { label: "AI Quizzes Created", value: metrics.quizzes, icon: FileQuestion },
          { label: "Flashcard Decks", value: metrics.flashcard_decks, icon: BookOpen },
          { label: "Notes Saved", value: metrics.notes, icon: Notebook },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-xl border bg-card p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <Icon className="h-8 w-8 text-muted-foreground/30" />
            </div>
          );
        })}
      </div>

      {/* Visual Analytics graphs */}
      {mounted && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Study hours bar chart */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Study Time Distribution</h2>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.study_hours_chart || []}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quiz score progression */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Quiz Score Progression</h2>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.quiz_scores_chart || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="quiz" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Log */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-bold mb-4">Recent Learning Logs</h2>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground text-sm">
            <p>No recent activity logs yet.</p>
            <p className="text-xs mt-1">Start chatting with the AI Tutor to trigger activity tracker logs.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex justify-between items-start border-b last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{act.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">StudyPortal Auto-logger</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{act.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
