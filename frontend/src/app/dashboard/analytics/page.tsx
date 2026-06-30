"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { Clock, CheckSquare, Award, BarChart2, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
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
}

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadData() {
      try {
        const res = await api.get("/analytics/summary");
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics: ", err);
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

  const metrics = data?.metrics || { quizzes: 0, study_plans: 0, notes: 0, flashcard_decks: 0, total_study_time: 0 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-muted-foreground mt-1">Review complete learning progress, time expenditures, and exam scores.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Study Duration", value: `${metrics.total_study_time.toFixed(1)}h`, desc: "Accumulated time logs", icon: Clock, color: "text-blue-500" },
          { label: "Test Accuracy", value: "89%", desc: "Average quiz marks", icon: Award, color: "text-purple-500" },
          { label: "Flashcards Swiped", value: metrics.flashcard_decks * 5, desc: "Active terms reviewed", icon: CheckSquare, color: "text-emerald-500" },
          { label: "AI Requests", value: (metrics.quizzes + metrics.notes + metrics.study_plans) * 3, desc: "Total token exchanges", icon: BarChart2, color: "text-amber-500" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-xl border bg-card p-6 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      {mounted && (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Detailed Study Hours */}
          <div className="border bg-card rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-primary" />
              Daily Study Hours Chart
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.study_hours_chart || []}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}h`} />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Test Performance Lines */}
          <div className="border bg-card rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
              Exam Marks Trend Line
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.quiz_scores_chart || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis dataKey="quiz" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line name="Score (%)" type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
