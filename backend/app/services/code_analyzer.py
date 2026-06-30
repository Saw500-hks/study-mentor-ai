import json
from typing import Dict, Any
from app.services.llm import call_llm

def analyze_code_snippet(code: str, language: str, problem_description: str = None) -> Dict[str, Any]:
    system_prompt = (
        "You are an expert AI Coding Assistant and Senior Developer. "
        "Review the student's code. Diagnose syntax, logical, or runtime errors. "
        "Provide constructive feedback, clear optimization/fix suggestions, and correct refactored code. "
        "You MUST return ONLY a JSON object. Do not include markdown backticks outside the JSON. "
        "The response JSON object must have exactly these keys:\n"
        "- 'is_correct': boolean (true if code runs perfectly, false if has issues)\n"
        "- 'feedback': summary of findings (string)\n"
        "- 'suggestions': list of specific bullet-point suggestions (list of strings)\n"
        "- 'fixed_code': fully corrected code block (string, optional/nullable)"
    )

    prompt = (
        f"Language: {language}\n"
        f"Problem Context (if any): {problem_description or 'General development helper'}\n\n"
        f"Code Snippet:\n```\n{code}\n```\n\n"
        "Analyze the code and output validation results."
    )

    res = call_llm(prompt, system_prompt)

    try:
        # Clean response to parse JSON
        if "```json" in res:
            res = res.split("```json")[1].split("```")[0].strip()
        elif "```" in res:
            res = res.split("```")[1].split("```")[0].strip()
            
        analysis = json.loads(res.strip())
        return {
            "is_correct": analysis.get("is_correct"),
            "feedback": analysis.get("feedback", "Code analyzed."),
            "suggestions": analysis.get("suggestions", []),
            "fixed_code": analysis.get("fixed_code")
        }
    except Exception:
        # Fallback analysis
        return {
            "is_correct": False,
            "feedback": "Analyzed code. Please double-check formatting and variable scoping.",
            "suggestions": ["Check variable scoping.", "Ensure all function arguments are passed.", "Verify bracket closures."],
            "fixed_code": code
        }
