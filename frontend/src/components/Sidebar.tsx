"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileQuestion,
  Calendar,
  FileText,
  CreditCard,
  Notebook,
  Code,
  BarChart2,
  Settings,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [role, setRole] = useState<string>("student");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("user_role");
      if (storedRole) setRole(storedRole);
    }
  }, []);

  const studentLinks = [
    { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/tutor", label: "AI Tutor", icon: MessageSquare },
    { href: "/dashboard/quiz", label: "AI Quizzes", icon: FileQuestion },
    { href: "/dashboard/planner", label: "Study Planner", icon: Calendar },
    { href: "/dashboard/pdf-chat", label: "PDF Chat", icon: FileText },
    { href: "/dashboard/flashcards", label: "Flashcards", icon: CreditCard },
    { href: "/dashboard/notes", label: "Notes Summarizer", icon: Notebook },
    { href: "/dashboard/coding", label: "Coding Assistant", icon: Code },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const teacherLinks = [
    { href: "/dashboard/teacher", label: "Teacher Dashboard", icon: GraduationCap }
  ];

  const adminLinks = [
    { href: "/dashboard/admin", label: "Admin Settings", icon: ShieldCheck }
  ];

  const renderLink = (link: { href: string; label: string; icon: any }) => {
    const Icon = link.icon;
    const isActive = pathname === link.href;

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span>{link.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-card px-4 py-6 transition-transform duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 overflow-y-auto pr-1">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
            Learning Portal
          </p>
          {studentLinks.map(renderLink)}

          {(role === "teacher" || role === "admin") && (
            <>
              <div className="my-4 border-t" />
              <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                Teacher controls
              </p>
              {teacherLinks.map(renderLink)}
            </>
          )}

          {role === "admin" && (
            <>
              <div className="my-4 border-t" />
              <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                System Admin
              </p>
              {adminLinks.map(renderLink)}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
