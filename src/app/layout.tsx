import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyMentor AI - Intelligent Learning Platform",
  description: "Unified AI Classroom, Smart Quiz Generator, Study Planner, and Code Sandbox.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
