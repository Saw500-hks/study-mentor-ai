"use client";

import { useState } from "react";
import { Calendar, Clock, CheckSquare, Sparkles, Flame, Plus } from "lucide-react";

interface ScheduleDay {
  day: string;
  durationHours: number;
  focusArea: string;
  tasks: string[];
}

export default function PlannerView() {
  const [goal, setGoal] = useState("Master Algorithms & Data Structures");
  const [hours, setHours] = useState(14);
  const [schedule, setSchedule] = useState<ScheduleDay[]>([
    { day: "Monday", durationHours: 2, focusArea: "Theory & Mathematics", tasks: ["Review Big-O Notation", "Solve 2 Array Problems"] },
    { day: "Tuesday", durationHours: 2, focusArea: "Hands-on Code", tasks: ["Implement Stack & Queue in Python", "Complete Quiz 1"] },
    { day: "Wednesday", durationHours: 2, focusArea: "Theory & Mathematics", tasks: ["Read Trees & Graphs Chapter", "Notes Breakdown"] },
    { day: "Thursday", durationHours: 2, focusArea: "Hands-on Code", tasks: ["Breadth-First Search Exercise", "Debug Binary Tree Sandbox"] },
    { day: "Friday", durationHours: 2, focusArea: "Review & Testing", tasks: ["Weekly Quiz Checkpoint", "Synthesize Flashcards"] },
    { day: "Saturday", durationHours: 2, focusArea: "Hands-on Code", tasks: ["Dynamic Programming Intro", "Solve Knapsack Example"] },
    { day: "Sunday", durationHours: 2, focusArea: "Rest & Prep", tasks: ["Plan Next Week's Milestones", "Light Reading"] },
  ]);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, hoursPerWeek: hours }),
      });
      const data = await res.json();
      if (data.success) {
        setSchedule(data.schedule);
      }
    } catch {
      // Keep existing schedule if fetch fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              AI Study Planner <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">Automated weekly timetables, goal tracking, and study schedules</p>
          </div>
        </div>

        {/* Streak Stats */}
        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Flame className="w-5 h-5 fill-amber-400" /> 7 Day Streak!
          </div>
        </div>
      </div>

      {/* Goal Generator Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-400">Target Learning Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-semibold text-slate-400">Weekly Hours ({hours}h)</label>
              <input
                type="range"
                min="5"
                max="40"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
            <button
              onClick={generatePlan}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-medium text-xs rounded-xl transition-all shadow-md shrink-0"
            >
              {loading ? "Planning..." : "Auto-Generate Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedule.map((s, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-base">{s.day}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> {s.durationHours} hrs
              </span>
            </div>

            <div className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 inline-block">
              {s.focusArea}
            </div>

            <div className="space-y-2 pt-1">
              {s.tasks.map((task, tIdx) => (
                <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
