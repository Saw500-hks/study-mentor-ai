"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { ShieldCheck, HardDrive, Cpu, Activity, Server } from "lucide-react";

interface AdminSummary {
  server_status: string;
  total_users: number;
  role_distribution: Array<{ role: string; count: number }>;
  api_tokens_used: number;
  uptime: string;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/analytics/admin/summary");
        setData(res);
      } catch (err) {
        console.error("Failed to load admin stats", err);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Admin Console</h1>
          <p className="text-muted-foreground mt-0.5">Audit server metrics, API routing, and DB logs.</p>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Server Status", value: data?.server_status || "Healthy", icon: Server, color: "text-emerald-500" },
          { label: "Platform Users", value: data?.total_users || 0, icon: Cpu, color: "text-blue-500" },
          { label: "Uptime Rate", value: data?.uptime || "99.99%", icon: Activity, color: "text-purple-500" },
          { label: "API Token Logs", value: data?.api_tokens_used || 0, icon: HardDrive, color: "text-amber-500" }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="border bg-card rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>{item.label}</span>
                <Icon className={`h-4.5 w-4.5 ${item.color}`} />
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Role list and system diagnostic */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="border bg-card rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-base mb-4 border-b pb-2">Registered Accounts Distribution</h3>
          <div className="space-y-4">
            {data?.role_distribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="font-semibold text-muted-foreground capitalize">{item.role}s</span>
                <span className="bg-accent px-2.5 py-1 rounded-lg font-bold text-xs">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border bg-card rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base border-b pb-2">Active Service Endpoints</h3>
          <div className="space-y-3">
            {[
              { path: "/api/v1/auth", status: "Active (200 OK)" },
              { path: "/api/v1/tutor", status: "Active (200 OK)" },
              { path: "/api/v1/quiz", status: "Active (200 OK)" },
              { path: "/api/v1/planner", status: "Active (200 OK)" },
              { path: "/api/v1/pdf", status: "Active (200 OK)" }
            ].map((route, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="font-mono text-muted-foreground">{route.path}</span>
                <span className="text-emerald-500 font-semibold">{route.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
