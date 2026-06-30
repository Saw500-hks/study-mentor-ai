import json
from typing import List, Dict, Any
from app.services.llm import call_llm

def generate_study_plan(title: str, goal: str, duration_weeks: int = 4, daily_hours: float = 2.0) -> List[Dict[str, Any]]:
    system_prompt = (
        "You are an expert AI Study Planner. Create a structured study schedule to help a student achieve their goal. "
        "You MUST return ONLY a JSON list of weekly plans. Do not include markdown backticks or explanations outside the JSON. "
        "Each weekly plan object MUST have exactly these keys:\n"
        "- 'week': name of the week (string, e.g., 'Week 1: Foundations of Chemistry')\n"
        "- 'tasks': list of specific topics, exercises, or tasks (list of strings)\n"
        "- 'hours': recommended study hours for this week (float or integer)"
    )

    prompt = (
        f"Study Plan Name: {title}\n"
        f"Goal: {goal}\n"
        f"Timeline: {duration_weeks} weeks\n"
        f"Available time: {daily_hours} hours per day\n\n"
        "Generate a detailed weekly study plan in JSON format."
    )

    res = call_llm(prompt, system_prompt)

    try:
        # Extract JSON content from potential Markdown block
        if "```json" in res:
            res = res.split("```json")[1].split("```")[0].strip()
        elif "```" in res:
            res = res.split("```")[1].split("```")[0].strip()
            
        plan_data = json.loads(res.strip())
        if isinstance(plan_data, list):
            return plan_data
        else:
            raise ValueError("Response is not a list")
    except Exception:
        # Fallback plan
        return [
            {
                "week": "Week 1: Core Fundamentals",
                "tasks": [
                    f"Read introductory materials for {title}",
                    "Identify key definitions and formula summaries",
                    "Take initial self-assessment quiz"
                ],
                "hours": duration_weeks * daily_hours
            },
            {
                "week": "Week 2: Advanced Deep Dive",
                "tasks": [
                    f"Solve application problems related to {goal}",
                    "Discuss hard concepts with AI Tutor",
                    "Create revision summary sheets"
                ],
                "hours": duration_weeks * daily_hours
            }
        ]
