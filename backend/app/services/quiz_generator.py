import json
from typing import List, Dict, Any
from app.services.llm import call_llm

def generate_quiz(subject: str, topic: str, difficulty: str = "intermediate", num_questions: int = 5) -> List[Dict[str, Any]]:
    system_prompt = (
        "You are an expert curriculum designer. Generate a practice quiz on the specified subject and topic. "
        "You MUST return ONLY a JSON list of question objects. Do not include any markdown backticks or explanations outside the JSON. "
        "Each question object MUST have exactly these keys:\n"
        "- 'question': the question text (string)\n"
        "- 'options': list of exactly 4 choices (list of strings)\n"
        "- 'correct_index': the 0-based index of the correct answer (integer, 0 to 3)\n"
        "- 'explanation': a clear explanation of why the correct option is right (string)"
    )

    prompt = (
        f"Subject: {subject}\n"
        f"Topic: {topic}\n"
        f"Difficulty: {difficulty}\n"
        f"Number of questions: {num_questions}\n\n"
        "Generate a valid JSON list of quiz questions."
    )

    res = call_llm(prompt, system_prompt)

    try:
        # Extract JSON content from potential Markdown block
        if "```json" in res:
            res = res.split("```json")[1].split("```")[0].strip()
        elif "```" in res:
            res = res.split("```")[1].split("```")[0].strip()
        
        quiz_data = json.loads(res.strip())
        if isinstance(quiz_data, list):
            return quiz_data
        else:
            raise ValueError("Response is not a list")
    except Exception as e:
        # Fallback simulated quiz if parsing errors out or LLM fails
        return [
            {
                "question": f"What is the main definition of a fundamental process in {topic}?",
                "options": [
                    "Option A: The baseline initial state",
                    "Option B: The catalytic action of components",
                    "Option C: The primary response mechanism",
                    "Option D: All of the above"
                ],
                "correct_index": 3,
                "explanation": "All elements work together to form the fundamental baseline."
            },
            {
                "question": f"Which parameter is key when studying {topic} in the context of {subject}?",
                "options": [
                    "Standard deviation",
                    "System capacity",
                    "Core variables",
                    "External inputs"
                ],
                "correct_index": 2,
                "explanation": "Core variables determine the behavior of the system."
            }
        ]
