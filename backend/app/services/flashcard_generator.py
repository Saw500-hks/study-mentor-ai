import json
from typing import List, Dict, Any
from app.services.llm import call_llm

def generate_flashcards(subject: str, topic: str, num_cards: int = 5) -> List[Dict[str, Any]]:
    system_prompt = (
        "You are an educational assistant. Generate a set of flashcards for the student. "
        "You MUST return ONLY a JSON list of objects. Do not include markdown backticks or explanations outside the JSON. "
        "Each object MUST have exactly these keys:\n"
        "- 'id': a unique string identifier (e.g., 'fc1', 'fc2')\n"
        "- 'front': the question, term, or concept on the front of the card (string)\n"
        "- 'back': the answer, definition, or explanation on the back of the card (string)"
    )

    prompt = (
        f"Subject: {subject}\n"
        f"Topic: {topic}\n"
        f"Number of cards: {num_cards}\n\n"
        "Generate a valid JSON list of flashcards."
    )

    res = call_llm(prompt, system_prompt)

    try:
        # Clean response to parse JSON
        if "```json" in res:
            res = res.split("```json")[1].split("```")[0].strip()
        elif "```" in res:
            res = res.split("```")[1].split("```")[0].strip()
        
        cards = json.loads(res.strip())
        if not isinstance(cards, list):
            raise ValueError("Response is not a list")
        return cards
    except Exception:
        # Fallback cards
        return [
            {"id": "fc1", "front": f"Key Term 1 for {topic}", "back": f"The primary definition of the first core term in {subject}."},
            {"id": "fc2", "front": f"Key Concept 2 for {topic}", "back": f"The main theoretical framework supporting this element of study."}
        ]
