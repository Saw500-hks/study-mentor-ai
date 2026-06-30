import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.flashcard import FlashcardDeck
from app.schemas.schemas import FlashcardDeckCreateRequest, FlashcardDeckResponse
from app.services.llm import call_llm

router = APIRouter()

@router.post("/generate", response_model=FlashcardDeckResponse)
def create_flashcard_deck(
    request: FlashcardDeckCreateRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    system_prompt = (
        "You are an educational assistant. Generate a set of flashcards for the student. "
        "You MUST return ONLY a JSON list of objects. Do not include markdown backticks or explanations outside the JSON. "
        "Each object MUST have exactly these keys:\n"
        "- 'id': a unique string identifier (e.g., 'fc1', 'fc2')\n"
        "- 'front': the question, term, or concept on the front of the card (string)\n"
        "- 'back': the answer, definition, or explanation on the back of the card (string)"
    )

    prompt = (
        f"Subject: {request.subject}\n"
        f"Topic: {request.topic}\n"
        f"Number of cards: {request.num_cards}\n\n"
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
    except Exception:
        # Fallback cards
        cards = [
            {"id": "fc1", "front": f"Key Term 1 for {request.topic}", "back": f"The primary definition of the first core term in {request.subject}."},
            {"id": "fc2", "front": f"Key Concept 2 for {request.topic}", "back": f"The main theoretical framework supporting this element of study."}
        ]

    db_deck = FlashcardDeck(
        name=f"{request.topic} Flashcards",
        subject=request.subject,
        cards=cards,
        created_by=current_user_id
    )
    db.add(db_deck)
    db.commit()
    db.refresh(db_deck)
    
    return db_deck

@router.get("/list", response_model=List[FlashcardDeckResponse])
def list_flashcard_decks(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return db.query(FlashcardDeck).filter(FlashcardDeck.created_by == current_user_id).order_by(FlashcardDeck.created_at.desc()).all()

@router.get("/{deck_id}", response_model=FlashcardDeckResponse)
def get_flashcard_deck_by_id(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id, FlashcardDeck.created_by == current_user_id).first()
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard deck not found"
        )
    return deck
