from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional
from datetime import datetime

# --- AUTH SCHEMAS ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student" # student, teacher, admin

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


# --- QUIZ SCHEMAS ---
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int
    explanation: str

class QuizCreateRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str = "intermediate"
    num_questions: int = 5

class QuizResponse(BaseModel):
    id: int
    title: str
    subject: str
    topic: str
    difficulty: str
    questions: List[Dict[str, Any]]
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- STUDY PLAN SCHEMAS ---
class StudyPlanCreateRequest(BaseModel):
    title: str
    goal: str
    duration_weeks: int = 4
    daily_hours: float = 2.0

class StudyPlanResponse(BaseModel):
    id: int
    title: str
    goal: str
    timeline: List[Dict[str, Any]]
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- NOTES SCHEMAS ---
class NoteCreateRequest(BaseModel):
    title: str
    subject: str
    original_text: str

class NoteResponse(BaseModel):
    id: int
    title: str
    subject: str
    original_text: Optional[str]
    summary: str
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- FLASHCARD SCHEMAS ---
class FlashcardItem(BaseModel):
    id: str
    front: str
    back: str

class FlashcardDeckCreateRequest(BaseModel):
    name: str
    subject: str
    topic: str
    num_cards: int = 5

class FlashcardDeckResponse(BaseModel):
    id: int
    name: str
    subject: str
    cards: List[Dict[str, Any]]
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- AI TUTOR & PDF CHAT SCHEMAS ---
class ChatMessage(BaseModel):
    role: str # user or assistant
    content: str

class TutorChatRequest(BaseModel):
    message: str
    chat_history: List[ChatMessage] = []
    subject: Optional[str] = "General"

class TutorChatResponse(BaseModel):
    reply: str
    suggested_followups: List[str] = []

class PDFChatRequest(BaseModel):
    pdf_id: str
    message: str
    chat_history: List[ChatMessage] = []

class PDFChatResponse(BaseModel):
    reply: str
    source_pages: List[int] = []


# --- CODING ASSISTANT SCHEMAS ---
class CodeAnalysisRequest(BaseModel):
    code: str
    language: str
    problem_description: Optional[str] = None

class CodeAnalysisResponse(BaseModel):
    is_correct: Optional[bool] = None
    feedback: str
    suggestions: List[str] = []
    fixed_code: Optional[str] = None
