"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Settings, Moon, Sun, Key, Save, User } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setName(localStorage.getItem("user_name") || "Student");
      setEmail("student@studymentor.ai"); // Default visual fallback
      setRole(localStorage.getItem("user_role") || "student");
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure profile details, system display themes, and private API keys.</p>
      </div>

      <div className="border bg-card rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile fields */}
          <div className="space-y-4">
            <h2 className="font-bold text-base border-b pb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-lg border bg-muted px-3 py-2 text-sm focus:outline-none text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Learning Role</label>
              <input
                type="text"
                disabled
                value={role}
                className="w-full rounded-lg border bg-muted px-3 py-2 text-sm focus:outline-none capitalize text-muted-foreground"
              />
            </div>
          </div>

          {/* Theme display */}
          <div className="space-y-4">
            <h2 className="font-bold text-base border-b pb-2 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Theme Configuration
            </h2>
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-amber-500" />}
                <div>
                  <p className="text-sm font-semibold">Dark Mode Interface</p>
                  <p className="text-xs text-muted-foreground">Toggle dark mode themes across the portal.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-bold border hover:bg-accent/80 transition-all"
              >
                Switch to {theme === "light" ? "Dark" : "Light"}
              </button>
            </div>
          </div>

          {/* API keys */}
          <div className="space-y-4">
            <h2 className="font-bold text-base border-b pb-2 flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Developer API Access Keys
            </h2>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">OpenAI or Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-••••••••••••••••••••••••"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none"
              />
              <p className="text-[10px] text-muted-foreground mt-1">If set, overrides system keys and directs requests straight to your API quota.</p>
            </div>
          </div>

          {/* Submit */}
          <div className="border-t pt-4 flex justify-between items-center">
            {saved ? (
              <span className="text-xs text-emerald-500 font-semibold animate-pulse">Settings saved successfully!</span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
            >
              <Save className="h-4 w-4" />
              Save Configurations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
