"use client";

import { useState } from "react";
import Sidebar, { TabType, RoleType } from "@/components/Sidebar";
import TutorView from "@/components/TutorView";
import QuizView from "@/components/QuizView";
import PlannerView from "@/components/PlannerView";
import DocChatView from "@/components/DocChatView";
import CodePlaygroundView from "@/components/CodePlaygroundView";
import AnalyticsView from "@/components/AnalyticsView";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("tutor");
  const [userRole, setUserRole] = useState<RoleType>("Student");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Feature View Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {activeTab === "tutor" && <TutorView />}
        {activeTab === "quiz" && <QuizView />}
        {activeTab === "planner" && <PlannerView />}
        {activeTab === "doc-chat" && <DocChatView />}
        {activeTab === "playground" && <CodePlaygroundView />}
        {activeTab === "analytics" && <AnalyticsView userRole={userRole} />}
      </main>
    </div>
  );
}
