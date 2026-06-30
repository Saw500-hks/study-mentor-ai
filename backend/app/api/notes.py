from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models.note import Note
from app.schemas.schemas import NoteCreateRequest, NoteResponse
from app.services.llm import call_llm

router = APIRouter()

@router.post("/generate", response_model=NoteResponse)
def generate_study_notes(
    request: NoteCreateRequest,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    system_prompt = (
        "You are an expert AI Study Assistant. Summarize and format the provided student notes or textbooks. "
        "Use Markdown with headers, bullet points, checklists, and highlighted quotes. "
        "Organize the content logically so it is easy to review."
    )

    prompt = (
        f"Subject: {request.subject}\n"
        f"Notes Title: {request.title}\n\n"
        f"Content to Summarize:\n{request.original_text}"
    )

    summary = call_llm(prompt, system_prompt)

    db_note = Note(
        title=request.title,
        subject=request.subject,
        original_text=request.original_text,
        summary=summary,
        created_by=current_user_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    return db_note

@router.get("/list", response_model=List[NoteResponse])
def list_notes(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return db.query(Note).filter(Note.created_by == current_user_id).order_by(Note.created_at.desc()).all()

@router.get("/{note_id}", response_model=NoteResponse)
def get_note_by_id(
    note_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    note = db.query(Note).filter(Note.id == note_id, Note.created_by == current_user_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    return note
