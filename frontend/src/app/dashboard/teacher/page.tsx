"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { GraduationCap, Users, FileText, CheckCircle2, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PerformanceItem {
  subject: string;
  average_score: number;
  students: number;
}

interface TeacherData {
  class_performance: PerformanceItem[];
  engagement_metrics: {
    active_students: number;
    quizzes_taken: number;
    help_tickets: number;
  };
}

export default function TeacherDashboard() {
  const [data, setData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const res = await api.get("/analytics/teacher/summary");
        setData(res);
      } catch (err) {
        console.error("Failed to load teacher metrics", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const performance = data?.class_performance || [];
  const metrics = data?.engagement_metrics || { active_students: 0, quizzes_taken: 0, help_tickets: 0 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Console Hub</h1>
        <p className="text-muted-foreground mt-1">Monitor course performance, classroom activity tracking, and assignment records.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {[
          { label: "Active Class Roster", value: metrics.active_students, desc: "Registered students", icon: Users, color: "text-blue-500 bg-blue-500/10" },
          { label: "AI Assignments Taken", value: metrics.quizzes_taken, desc: "Evaluations generated", icon: FileText, color: "text-purple-500 bg-purple-500/10" },
          { label: "Pending Help Tickets", value: metrics.help_tickets, desc: "Awaiting tutor routing", icon: GraduationCap, color: "text-amber-500 bg-amber-500/10" }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="rounded-xl border bg-card p-6 flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                <p className="text-3xl font-bold">{item.value}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart & Roster */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Chart */}
        {mounted && (
          <div className="md:col-span-2 border bg-card rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              Subject Average Performance
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance}>
                  <XAxis dataKey="subject" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip />
                  <Bar dataKey="average_score" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Average Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Student Roster status */}
        <div className="md:col-span-1 border bg-card rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base border-b pb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Class Activity Feed
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {[
              { student: "Marcus Aurelius", act: "Scored 95% on Physics exam", time: "10 mins ago" },
              { student: "Hypatia of Alex", act: "Created 12 Chemistry cards", time: "1 hour ago" },
              { student: "Marie Curie", act: "Generated Biology study plan", time: "3 hours ago" },
              { student: "Ada Lovelace", act: "Analyzed Javascript logic bug", time: "1 day ago" }
            ].map((feed, idx) => (
              <div key={idx} className="text-xs space-y-0.5 border-b last:border-0 pb-2.5 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">{feed.student}</span>
                  <span className="text-[10px] text-muted-foreground">{feed.time}</span>
                </div>
                <p className="text-muted-foreground">{feed.act}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
