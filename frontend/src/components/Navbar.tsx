"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Moon, Sun, LogOut, Menu, X, User } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { removeAuthToken } from "@/utils/api";
import { useState, useEffect } from "react";

export default function Navbar({ showSidebarToggle = false, onToggleSidebar }: { showSidebarToggle?: boolean; onToggleSidebar?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Attempt to extract user data from token or local storage
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("user_name");
      if (storedName) setUserName(storedName);
    }
  }, []);

  const handleSignOut = () => {
    removeAuthToken();
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
          
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:to-cyan-400">
              StudyMentor AI
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {userName ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {typeof window !== "undefined" ? localStorage.getItem("user_role") || "student" : "student"}
                </span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <User className="h-4 w-4" />
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary transition-all px-3 py-2 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
