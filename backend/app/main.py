import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine

# Import all models to ensure they register on Base metadata
from app.models.user import User
from app.models.quiz import Quiz
from app.models.study_plan import StudyPlan
from app.models.note import Note
from app.models.flashcard import FlashcardDeck

# Import routers
from app.api import auth, tutor, quiz, planner, pdf, flashcards, notes, coding, analytics

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("study-mentor-backend")

# Create Database tables on startup
try:
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully!")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration for frontend Next.js requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount APIRouters
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(tutor.router, prefix=f"{settings.API_V1_STR}/tutor", tags=["tutor"])
app.include_router(quiz.router, prefix=f"{settings.API_V1_STR}/quiz", tags=["quiz"])
app.include_router(planner.router, prefix=f"{settings.API_V1_STR}/planner", tags=["planner"])
app.include_router(pdf.router, prefix=f"{settings.API_V1_STR}/pdf", tags=["pdf"])
app.include_router(flashcards.router, prefix=f"{settings.API_V1_STR}/flashcards", tags=["flashcards"])
app.include_router(notes.router, prefix=f"{settings.API_V1_STR}/notes", tags=["notes"])
app.include_router(coding.router, prefix=f"{settings.API_V1_STR}/coding", tags=["coding"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": f"Welcome to {settings.PROJECT_NAME} API. Access API docs at /docs"
    }
