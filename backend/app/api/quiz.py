from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.quiz import Quiz
from app.schemas.schemas import QuizCreateRequest, QuizResponse
from app.services.quiz_generator import generate_quiz

router = APIRouter()

@router.post("/generate", response_model=QuizResponse)
def create_generated_quiz(
    request: QuizCreateRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    # Call AI generation service
    questions = generate_quiz(
        subject=request.subject,
        topic=request.topic,
        difficulty=request.difficulty,
        num_questions=request.num_questions
    )
    
    # Save to database
    db_quiz = Quiz(
        title=f"{request.topic} Practice Quiz",
        subject=request.subject,
        topic=request.topic,
        difficulty=request.difficulty,
        questions=questions,
        created_by=current_user_id
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    
    return db_quiz

@router.get("/list", response_model=List[QuizResponse])
def list_quizzes(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return db.query(Quiz).filter(Quiz.created_by == current_user_id).order_by(Quiz.created_at.desc()).all()

@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz_by_id(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.created_by == current_user_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return quiz
