"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { Sparkles, Calendar, Plus, BookOpen, Clock, CheckSquare } from "lucide-react";

interface TimelineTask {
  week: string;
  tasks: string[];
  hours: number;
}

interface StudyPlan {
  id: number;
  title: string;
  goal: string;
  timeline: TimelineTask[];
  created_at: string;
}

export default function AIStudyPlannerPage() {
  const [title, setTitle] = useState("Introduction to Physics");
  const [goal, setGoal] = useState("Master Newtonian Mechanics and pass final exam");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [dailyHours, setDailyHours] = useState(2.0);
  
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const list = await api.get("/planner/list");
        setPlans(list);
        if (list.length > 0) {
          setActivePlan(list[0]);
        }
      } catch (err) {
        console.error("Failed to load study plans: ", err);
      }
    }
    loadPlans();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !goal.trim()) return;

    setGenerating(true);
    try {
      const newPlan = await api.post("/planner/generate", {
        title,
        goal,
        duration_weeks: durationWeeks,
        daily_hours: dailyHours
      });
      setPlans((prev) => [newPlan, ...prev]);
      setActivePlan(newPlan);
    } catch (err) {
      alert("Failed to generate plan. Check backend connectivity.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Study Planner</h1>
        <p className="text-muted-foreground mt-1">Design customized weekly learning paths and goal checklists.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Planner controls */}
        <div className="md:col-span-1 border bg-card rounded-2xl p-6 shadow-sm h-fit space-y-6">
          <div>
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Configure Schedule
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject / Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced Calculus"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Study Goal</label>
                <textarea
                  required
                  rows={3}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="What is your learning objective?"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (Weeks)</label>
                  <select
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    {[2, 4, 6, 8, 12].map((w) => (
                      <option key={w} value={w}>{w} Weeks</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Daily Study Time</label>
                  <select
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                  >
                    {[1.0, 2.0, 3.0, 4.0, 6.0].map((h) => (
                      <option key={h} value={h}>{h} Hours/day</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Designing Plan...
                  </>
                ) : (
                  <>
                    <Plus className="h-4.5 w-4.5" />
                    Create Study Plan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Past plans list */}
          {plans.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Saved Plans</h3>
              <div className="space-y-2">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePlan(p)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                      activePlan?.id === p.id
                        ? "bg-accent/40 border-primary"
                        : "bg-background hover:bg-accent/20 border-border"
                    }`}
                  >
                    <p className="font-bold truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{p.goal}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Plan Display timeline */}
        <div className="md:col-span-2 space-y-6">
          {activePlan ? (
            <div className="border bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
                <div>
                  <h2 className="text-2xl font-bold">{activePlan.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Objective: {activePlan.goal}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold h-fit self-start sm:self-center">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Timeline Calendar</span>
                </div>
              </div>

              {/* Render Weeks list */}
              <div className="space-y-6">
                {activePlan.timeline.map((weekData, wIdx) => (
                  <div key={wIdx} className="relative pl-6 border-l border-primary/20 last:border-0 last:pb-0 pb-6">
                    {/* Circle timeline dot */}
                    <div className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10" />
                    
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-base sm:text-lg text-foreground">{weekData.week}</h3>
                      <span className="text-xs font-semibold text-muted-foreground bg-accent px-2 py-0.5 rounded">
                        {weekData.hours}h recommended
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {weekData.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex gap-2.5 items-start text-sm text-muted-foreground">
                          <CheckSquare className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border rounded-2xl bg-card p-16 text-center text-muted-foreground flex flex-col items-center justify-center h-full min-h-[300px]">
              <Calendar className="h-10 w-10 text-muted-foreground/35 mb-3" />
              <p className="font-bold">No study plans created yet.</p>
              <p className="text-xs mt-1 max-w-sm">Use the configuration form to generate your custom week-by-week study calendar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
