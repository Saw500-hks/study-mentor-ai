# API Documentation

All request payloads and responses use standard JSON formatting. Authentication requires a bearer token in the `Authorization` header (`Authorization: Bearer <jwt_token>`).

---

## Authentication Endpoints

### 1. User Sign Up
- **Endpoint**: `POST /api/v1/auth/signup`
- **Request Body**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@mercer.com",
    "password": "securepassword123",
    "role": "student"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Alex Mercer",
    "email": "alex@mercer.com",
    "role": "student"
  }
  ```

### 2. User Log In
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "alex@mercer.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

### 3. Get Current User Profiling
- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Alex Mercer",
    "email": "alex@mercer.com",
    "role": "student"
  }
  ```

---

## AI Learning Endpoints

### 4. AI Tutor Chat
- **Endpoint**: `POST /api/v1/tutor/chat`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "message": "Explain quantum tunneling.",
    "chat_history": [
      { "role": "user", "content": "What is quantum mechanics?" },
      { "role": "assistant", "content": "Quantum mechanics is..." }
    ],
    "subject": "Physics"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "reply": "Quantum tunneling is a phenomenon where...",
    "suggested_followups": [
      "Show me a formula",
      "Is it used in microchips?",
      "Give me a simple analogy"
    ]
  }
  ```

### 5. Quiz Generator
- **Endpoint**: `POST /api/v1/quiz/generate`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "subject": "Biology",
    "topic": "Mitosis Stages",
    "difficulty": "intermediate",
    "num_questions": 3
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 4,
    "title": "Mitosis Stages Practice Quiz",
    "subject": "Biology",
    "topic": "Mitosis Stages",
    "difficulty": "intermediate",
    "questions": [
      {
        "question": "During which phase do chromosomes line up?",
        "options": ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        "correct_index": 1,
        "explanation": "Metaphase is characterized by alignment at the equatorial plate."
      }
    ],
    "created_by": 1,
    "created_at": "2026-06-30T13:00:00"
  }
  ```

### 6. Study Planner
- **Endpoint**: `POST /api/v1/planner/generate`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "Organic Chemistry Midterm",
    "goal": "Understand reactions and mechanisms",
    "duration_weeks": 4,
    "daily_hours": 2.0
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 2,
    "title": "Organic Chemistry Midterm",
    "goal": "Understand reactions and mechanisms",
    "timeline": [
      {
        "week": "Week 1: Alkanes & Alkenes",
        "tasks": ["Review nomenclature", "Complete basic worksheets"],
        "hours": 8.0
      }
    ],
    "created_by": 1,
    "created_at": "2026-06-30T13:00:00"
  }
  ```

### 7. PDF Upload & Document Chat
- **Upload Endpoint**: `POST /api/v1/pdf/upload` (Form Data Multipart)
  - **Parameter**: `file` (PDF, TXT, or MD file)
- **Response**: `200 OK`
  ```json
  {
    "pdf_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "filename": "syllabus.pdf",
    "pages": 12,
    "message": "File uploaded and indexed successfully!"
  }
  ```

- **Query Endpoint**: `POST /api/v1/pdf/query`
- **Request Body**:
  ```json
  {
    "pdf_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "message": "When is the midterm exam?",
    "chat_history": []
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "reply": "According to page 3, the midterm exam is scheduled for October 14th.",
    "source_pages": [3]
  }
  ```

### 8. Flashcards Generator
- **Endpoint**: `POST /api/v1/flashcards/generate`
- **Request Body**:
  ```json
  {
    "name": "Mitosis Stage Deck",
    "subject": "Biology",
    "topic": "Mitosis Stages",
    "num_cards": 5
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Mitosis Stages Flashcards",
    "subject": "Biology",
    "cards": [
      {
        "id": "fc1",
        "front": "Prophase",
        "back": "Chromatin condenses into visible chromosomes."
      }
    ],
    "created_by": 1,
    "created_at": "2026-06-30T13:00:00"
  }
  ```

### 9. Notes Summarizer
- **Endpoint**: `POST /api/v1/notes/generate`
- **Request Body**:
  ```json
  {
    "title": "Photosynthesis Lecture Notes",
    "subject": "Biology",
    "original_text": "Light reactions occur in thylakoid membranes. Calvin cycle in stroma."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "title": "Photosynthesis Lecture Notes",
    "subject": "Biology",
    "summary": "# Photosynthesis Summary\n\n- **Light Reactions**: Occur in thylakoid membranes.\n- **Calvin Cycle**: Occur in stroma.",
    "created_by": 1,
    "created_at": "2026-06-30T13:00:00"
  }
  ```

---

## Coding sandbox & Analytics

### 10. Coding Playground
- **Endpoint**: `POST /api/v1/coding/analyze`
- **Request Body**:
  ```json
  {
    "code": "def double(x): return x * 2",
    "language": "python",
    "problem_description": "Double an integer"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "is_correct": true,
    "feedback": "Your code is correct and optimized.",
    "suggestions": ["Add type hints for extra clarity."],
    "fixed_code": "def double(x: int) -> int:\n    return x * 2"
  }
  ```

### 11. Analytics Summaries
- **Student Dashboard**: `GET /api/v1/analytics/summary`
- **Teacher Dashboard**: `GET /api/v1/analytics/teacher/summary`
- **Admin Dashboard**: `GET /api/v1/analytics/admin/summary`
