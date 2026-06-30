from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.flashcard import FlashcardDeck
from app.schemas.schemas import FlashcardDeckCreateRequest, FlashcardDeckResponse
from app.services.flashcard_generator import generate_flashcards

router = APIRouter()

@router.post("/generate", response_model=FlashcardDeckResponse)
def create_flashcard_deck(
    request: FlashcardDeckCreateRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    cards = generate_flashcards(
        subject=request.subject,
        topic=request.topic,
        num_cards=request.num_cards
    )

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
