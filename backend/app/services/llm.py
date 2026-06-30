import os
import json
import logging
from app.core.config import settings

logger = logging.getLogger("study-mentor-llm")

def call_llm(prompt: str, system_instruction: str = "") -> str:
    """
    Uniform LLM interface that checks for Gemini and OpenAI API keys.
    Falls back to mock/template responses if no key is present.
    """
    # 1. Try Gemini
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            
            # Combine system instruction and prompt
            model = genai.GenerativeModel('gemini-1.5-flash')
            contents = []
            if system_instruction:
                contents.append(f"System: {system_instruction}")
            contents.append(prompt)
            
            response = model.generate_content(contents)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
            # Fall through to next method

    # 2. Try OpenAI
    if settings.OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            # Fall through

    # 3. Fallback mock intelligence
    return generate_fallback_response(prompt, system_instruction)


def generate_fallback_response(prompt: str, system_instruction: str) -> str:
    """
    Generates realistic looking mock responses for development/offline mode.
    """
    prompt_lower = prompt.lower()
    system_lower = system_instruction.lower()

    # Determine topic of interest
    if "quiz" in prompt_lower or "questions" in prompt_lower:
        # Create a mock quiz structure in JSON if JSON was requested
        if "json" in prompt_lower:
            return json.dumps([
                {
                    "question": "What is the primary function of DNA replication?",
                    "options": [
                        "To transcribe RNA",
                        "To produce exact copies of the DNA molecule for cell division",
                        "To translate proteins",
                        "To create mutations"
                    ],
                    "correct_index": 1,
                    "explanation": "DNA replication makes sure that when a cell divides, both new cells get a complete copy of the DNA code."
                },
                {
                    "question": "Which of the following is a key difference between eukaryotic and prokaryotic cells?",
                    "options": [
                        "Prokaryotes contain a membrane-bound nucleus, while eukaryotes do not",
                        "Eukaryotes contain membrane-bound organelles and a nucleus, while prokaryotes do not",
                        "Prokaryotes are always multicellular",
                        "Eukaryotes do not contain DNA"
                    ],
                    "correct_index": 1,
                    "explanation": "Eukaryotes have a true nucleus and membrane-bound organelles (like mitochondria), whereas prokaryotes lack a nucleus."
                },
                {
                    "question": "What is the role of ribosomes in the cell?",
                    "options": [
                        "Energy production",
                        "Protein synthesis",
                        "Cell division regulation",
                        "Waste elimination"
                    ],
                    "correct_index": 1,
                    "explanation": "Ribosomes are the cellular machines responsible for translating mRNA into polypeptide chains (proteins)."
                }
            ])
        return "Here is a quick quiz guide: Study replication, cell structures, and metabolic processes."

    elif "timeline" in prompt_lower or "schedule" in prompt_lower or "planner" in prompt_lower:
        if "json" in prompt_lower:
            return json.dumps([
                {
                    "week": "Week 1: Core Fundamentals",
                    "tasks": [
                        "Review main textbook chapters on the core theory",
                        "Create concept map of primary terminology",
                        "Take diagnostic practice test"
                    ],
                    "hours": 5.0
                },
                {
                    "week": "Week 2: Deeper Dive & Worksheets",
                    "tasks": [
                        "Complete exercise sets 1 through 5",
                        "Participate in group study session",
                        "Consult AI tutor for complex items"
                    ],
                    "hours": 6.0
                },
                {
                    "week": "Week 3: Practical Application & Quizzes",
                    "tasks": [
                        "Build sample project/case study",
                        "Take AI generated custom quizzes",
                        "Summarize key learnings in study notes"
                    ],
                    "hours": 6.0
                },
                {
                    "week": "Week 4: Final Polish & Mock Exam",
                    "tasks": [
                        "Complete full-length practice examination",
                        "Review cards/flashcards for terms missed",
                        "Rest and do final key points review"
                    ],
                    "hours": 4.5
                }
            ])
        return "Study Plan: Focus on basic concepts in Week 1, practice sets in Week 2, quizzes in Week 3, and final reviews in Week 4."

    elif "flashcard" in prompt_lower:
        if "json" in prompt_lower:
            return json.dumps([
                {"id": "c1", "front": "Mitosis", "back": "A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus."},
                {"id": "c2", "front": "Mitochondria", "back": "An organelle found in large numbers in most cells, in which the biochemical processes of respiration and energy production occur."},
                {"id": "c3", "front": "Photosynthesis", "back": "The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water."},
                {"id": "c4", "front": "Enzyme", "back": "A substance produced by a living organism which acts as a catalyst to bring about a specific biochemical reaction."},
                {"id": "c5", "front": "Active Transport", "back": "The movement of ions or molecules across a cell membrane into a region of higher concentration, assisted by enzymes and requiring energy."}
            ])
        return "Flashcards: Mitosis, Mitochondria, Photosynthesis, Enzyme, Active Transport."

    elif "summary" in prompt_lower or "summarize" in prompt_lower or "notes" in prompt_lower:
        return """# Study Notes Summary

## Core Concepts
- **Definition**: The fundamental principles governing this subject.
- **Key Mechanism**: Action leads to reaction, maintaining equilibrium.

## Important Details
1. **First Phase**: Information gathering and initial setup.
2. **Second Phase**: Processing, computing, and analyzing options.
3. **Third Phase**: Verification, execution, and review.

## Summary Checklist
- [x] Review introductory guides
- [x] Complete sample exercises
- [x] Run local simulation tests

> *Note: Regular revision (spaced repetition) boosts memory retention by up to 80%.*
"""

    elif "code" in prompt_lower or "python" in prompt_lower or "javascript" in prompt_lower:
        if "json" in prompt_lower:
            return json.dumps({
                "is_correct": False,
                "feedback": "The code has a syntax error. In Python, you must indent blocks inside a function or loop, and use correct variable declaration.",
                "suggestions": [
                    "Ensure indentation is exactly 4 spaces.",
                    "Correct variable naming - avoid conflicts with reserved words.",
                    "Add return statement to return output."
                ],
                "fixed_code": "def calculate_average(numbers):\n    if not numbers:\n        return 0\n    return sum(numbers) / len(numbers)"
            })
        return "Ensure correct indentation, verify variables, and add return statements."

    # General chat Tutor response
    return f"I am your StudyMentor AI Tutor. You asked about: '{prompt[:60]}...'. That's a great question. To understand this concept, it's best to break it down into simple terms. Let me know if you would like me to generate a study guide, a practice quiz, or flashcards on this topic!"
