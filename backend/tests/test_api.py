import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup test SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Set database url configuration prior to importing app
os.environ["DATABASE_URL"] = SQLALCHEMY_DATABASE_URL

from app.main import app
from app.core.database import Base, get_db

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    # Initialize test tables
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up test tables and file
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_temp.db"):
        os.remove("./test_temp.db")

def test_auth_flow():
    # 1. Sign Up
    signup_data = {
        "name": "Test Student",
        "email": "student@test.com",
        "password": "securepassword123",
        "role": "student"
    }
    response = client.post("/api/v1/auth/signup", json=signup_data)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["name"] == signup_data["name"]
    assert json_data["email"] == signup_data["email"]
    assert json_data["role"] == "student"
    assert "id" in json_data

    # 2. Sign Up Duplicate Email
    response = client.post("/api/v1/auth/signup", json=signup_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

    # 3. Log In
    login_data = {
        "email": "student@test.com",
        "password": "securepassword123"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # 4. Get Current User info
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "student@test.com"

def test_ai_tutor_chat():
    # Login to get headers
    login_data = {"email": "student@test.com", "password": "securepassword123"}
    token = client.post("/api/v1/auth/login", json=login_data).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "message": "Explain how cell respiration works.",
        "chat_history": [],
        "subject": "Biology"
    }
    response = client.post("/api/v1/tutor/chat", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "suggested_followups" in data
    assert len(data["suggested_followups"]) > 0

def test_quiz_endpoints():
    login_data = {"email": "student@test.com", "password": "securepassword123"}
    token = client.post("/api/v1/auth/login", json=login_data).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Generate Quiz
    payload = {
        "subject": "Chemistry",
        "topic": "Periodic Table",
        "difficulty": "easy",
        "num_questions": 3
    }
    response = client.post("/api/v1/quiz/generate", json=payload, headers=headers)
    assert response.status_code == 200
    quiz = response.json()
    assert quiz["subject"] == "Chemistry"
    assert quiz["topic"] == "Periodic Table"
    assert len(quiz["questions"]) > 0
    quiz_id = quiz["id"]

    # 2. Get Quiz List
    response = client.get("/api/v1/quiz/list", headers=headers)
    assert response.status_code == 200
    quizzes = response.json()
    assert len(quizzes) > 0
    assert quizzes[0]["id"] == quiz_id

    # 3. Get Quiz by ID
    response = client.get(f"/api/v1/quiz/{quiz_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["id"] == quiz_id

def test_study_planner_endpoints():
    login_data = {"email": "student@test.com", "password": "securepassword123"}
    token = client.post("/api/v1/auth/login", json=login_data).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Generate Study Plan
    payload = {
        "title": "Semester 1 Biology",
        "goal": "Score above 90% in final exam",
        "duration_weeks": 4,
        "daily_hours": 1.5
    }
    response = client.post("/api/v1/planner/generate", json=payload, headers=headers)
    assert response.status_code == 200
    plan = response.json()
    assert plan["title"] == "Semester 1 Biology"
    assert plan["goal"] == "Score above 90% in final exam"
    assert len(plan["timeline"]) > 0
    plan_id = plan["id"]

    # 2. Get Plan List
    response = client.get("/api/v1/planner/list", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) > 0

    # 3. Get Plan by ID
    response = client.get(f"/api/v1/planner/{plan_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["id"] == plan_id

def test_study_notes_endpoints():
    login_data = {"email": "student@test.com", "password": "securepassword123"}
    token = client.post("/api/v1/auth/login", json=login_data).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Generate Study Notes
    payload = {
        "title": "Mitosis and Meiosis Notes",
        "subject": "Biology",
        "original_text": "Mitosis produces two diploid somatic cells. Meiosis produces four haploid gametes."
    }
    response = client.post("/api/v1/notes/generate", json=payload, headers=headers)
    assert response.status_code == 200
    note = response.json()
    assert note["title"] == "Mitosis and Meiosis Notes"
    assert "summary" in note
    note_id = note["id"]

    # 2. Get Notes List
    response = client.get("/api/v1/notes/list", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) > 0

    # 3. Get Note by ID
    response = client.get(f"/api/v1/notes/{note_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["id"] == note_id

def test_flashcard_deck_endpoints():
    login_data = {"email": "student@test.com", "password": "securepassword123"}
    token = client.post("/api/v1/auth/login", json=login_data).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Generate Flashcards
    payload = {
        "name": "Mitosis Deck",
        "subject": "Biology",
        "topic": "Mitosis Stages",
        "num_cards": 3
    }
    response = client.post("/api/v1/flashcards/generate", json=payload, headers=headers)
    assert response.status_code == 200
    deck = response.json()
    assert "cards" in deck
    assert len(deck["cards"]) > 0
    deck_id = deck["id"]

    # 2. Get Deck List
    response = client.get("/api/v1/flashcards/list", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) > 0

    # 3. Get Deck by ID
    response = client.get(f"/api/v1/flashcards/{deck_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["id"] == deck_id

def test_coding_playground():
    login_data = {"email": "student@test.com", "password": "securepassword123"}
    token = client.post("/api/v1/auth/login", json=login_data).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "code": "def hello(): print('hello')",
        "language": "python",
        "problem_description": "Create a function that prints hello"
    }
    response = client.post("/api/v1/coding/analyze", json=payload, headers=headers)
    assert response.status_code == 200
    analysis = response.json()
    assert "feedback" in analysis
    assert "suggestions" in analysis

def test_analytics_endpoints():
    login_data = {"email": "student@test.com", "password": "securepassword123"}
    token = client.post("/api/v1/auth/login", json=login_data).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Student Summary
    response = client.get("/api/v1/analytics/summary", headers=headers)
    assert response.status_code == 200
    summary = response.json()
    assert "metrics" in summary
    assert "study_hours_chart" in summary
    assert "quiz_scores_chart" in summary

    # 2. Teacher Summary
    response = client.get("/api/v1/analytics/teacher/summary", headers=headers)
    assert response.status_code == 200
    teacher_summary = response.json()
    assert "class_performance" in teacher_summary

    # 3. Admin Summary
    response = client.get("/api/v1/analytics/admin/summary", headers=headers)
    assert response.status_code == 200
    admin_summary = response.json()
    assert "server_status" in admin_summary
