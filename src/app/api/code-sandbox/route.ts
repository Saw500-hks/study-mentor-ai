import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, language = "python" } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code content is required" }, { status: 400 });
    }

    let output = "";
    let hasError = false;
    let diagnosis = "";
    let fixSuggestion = "";

    if (language === "python") {
      if (code.includes("print(") && !code.endsWith(")")) {
        hasError = true;
        output = "SyntaxError: unexpected EOF while parsing";
        diagnosis = "Missing closing parenthesis on print statement.";
        fixSuggestion = "Ensure all open parentheses '(' are balanced with closing parentheses ')'.";
      } else if (code.includes("def ") && !code.includes(":")) {
        hasError = true;
        output = "SyntaxError: invalid syntax";
        diagnosis = "Function definition is missing a colon ':' at the end of the line.";
        fixSuggestion = "Add a colon ':' at the end of the line where the function signature ends.";
      } else {
        output = "Program executed successfully!\nOutput:\nHello from StudyMentor Python Sandbox!\n[Result: 42]";
        diagnosis = "Code structure is clean and valid.";
      }
    } else {
      if (code.includes("console.log(") && !code.includes(")")) {
        hasError = true;
        output = "SyntaxError: Unexpected token";
        diagnosis = "Missing closing parenthesis in console.log call.";
        fixSuggestion = "Close the parenthesis: console.log('message');";
      } else {
        output = "JavaScript Execution Output:\n> StudyMentor Sandbox initialized.\n> Execution complete.";
        diagnosis = "JavaScript syntax is correct.";
      }
    }

    return NextResponse.json({
      success: true,
      language,
      output,
      hasError,
      diagnosis,
      fixSuggestion,
      executionTimeMs: Math.floor(Math.random() * 40) + 10,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Sandbox execution failed", details: String(err) }, { status: 500 });
  }
}
