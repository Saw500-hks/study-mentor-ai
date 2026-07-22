import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic = "Computer Science", difficulty = "Medium", count = 3 } = await req.json();

    const quizPool: Record<string, Array<{ question: string; options: string[]; answerIndex: number; explanation: string }>> = {
      "Computer Science": [
        {
          question: "What is the worst-case time complexity of QuickSort?",
          options: ["O(N log N)", "O(N²)", "O(N)", "O(1)"],
          answerIndex: 1,
          explanation: "QuickSort has a worst-case time complexity of O(N²) when the pivot selection consistently chooses the smallest or largest element (e.g. on an already sorted array without random pivots).",
        },
        {
          question: "Which data structure follows the Last-In, First-Out (LIFO) principle?",
          options: ["Queue", "Stack", "Binary Search Tree", "Linked List"],
          answerIndex: 1,
          explanation: "A Stack operates on LIFO order. Items pushed last are popped first, like a stack of cafeteria plates.",
        },
        {
          question: "What does HTTP status code 404 signify?",
          options: ["Internal Server Error", "Unauthorized", "Not Found", "Bad Gateway"],
          answerIndex: 2,
          explanation: "HTTP 404 indicates that the requested resource could not be found on the server.",
        },
      ],
      "Mathematics": [
        {
          question: "What is the derivative of f(x) = sin(x)?",
          options: ["-cos(x)", "cos(x)", "tan(x)", "sec²(x)"],
          answerIndex: 1,
          explanation: "The derivative of sin(x) with respect to x is cos(x).",
        },
        {
          question: "What is the area of a circle with radius r?",
          options: ["2πr", "πr²", "4/3 πr³", "πd"],
          answerIndex: 1,
          explanation: "The area formula for a circle is A = πr².",
        },
      ],
      "Physics": [
        {
          question: "According to Newton's Second Law, what is the formula for force?",
          options: ["F = m / a", "F = m * a", "F = m * v²", "F = ½ m v²"],
          answerIndex: 1,
          explanation: "Newton's Second Law states that Force equals Mass times Acceleration (F = m * a).",
        },
        {
          question: "What is the speed of light in a vacuum approximately?",
          options: ["3 × 10⁸ m/s", "3 × 10⁵ m/s", "1.5 × 10⁸ m/s", "3 × 10⁶ m/s"],
          answerIndex: 0,
          explanation: "The speed of light in a vacuum (c) is approximately 300,000,000 meters per second (3 × 10⁸ m/s).",
        },
      ],
    };

    const selectedPool = quizPool[topic] || quizPool["Computer Science"];
    const questions = selectedPool.slice(0, count);

    return NextResponse.json({
      success: true,
      topic,
      difficulty,
      questions,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Failed to generate quiz", details: String(err) }, { status: 500 });
  }
}
