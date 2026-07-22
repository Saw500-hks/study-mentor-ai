import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { goal = "Ace Algorithms Exam", hoursPerWeek = 15 } = await req.json();

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const schedule = days.map((day, idx) => {
      const dailyHours = Math.round((hoursPerWeek / 7) * 10) / 10;
      const tasks = [
        `Review Core Concepts (${dailyHours}h)`,
        idx % 2 === 0 ? "Practice 3 Algorithmic Quiz Questions" : "Read Textbook Chapter & Notes",
        idx % 3 === 0 ? "Debug Coding Exercises in Sandbox" : "Summarize Key Takeaways"
      ];

      return {
        day,
        durationHours: dailyHours,
        focusArea: idx % 2 === 0 ? "Theory & Mathematics" : "Hands-on Code & Quizzes",
        tasks,
      };
    });

    return NextResponse.json({
      success: true,
      goal,
      totalHoursWeekly: hoursPerWeek,
      schedule,
      recommendation: `Allocating ${hoursPerWeek} hours across the week with alternating theory and coding sessions ensures maximum long-term retention.`,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Failed to create plan", details: String(err) }, { status: 500 });
  }
}
