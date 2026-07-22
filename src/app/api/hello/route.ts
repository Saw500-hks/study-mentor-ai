import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "online",
    message: "Welcome to Study Mentor API on Vercel!",
    timestamp: new Date().toISOString(),
  });
}
