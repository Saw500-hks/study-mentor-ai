# StudyMentor AI

StudyMentor AI is a next-generation collaborative AI classroom and learning management system. Powered by LangGraph agents, it helps students generate study plans, practice quizzes, summarize lecture notes, chat with PDF textbooks, and debug code snippets in an interactive sandbox. It also provides teachers and admins with a dashboard to monitor engagement and progress metrics.

## 🏗️ Architecture & Structure

```
.
├── src/
│   └── app/
│       ├── api/
│       │   └── hello/
│       │       └── route.ts     # Backend API Route Handler
│       ├── globals.css          # Global Tailwind CSS styles
│       ├── layout.tsx           # Root layout component
│       └── page.tsx             # Interactive dashboard page
├── public/                      # Static assets
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
└── vercel.json                  # Vercel deployment configuration
```

Decoupled Stack
Frontend: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
Backend: FastAPI (Python 3.13), SQLAlchemy ORM, Pydantic v2, PyJWT.
AI Engine: LangGraph & LangChain, integrating Gemini 1.5 Flash and OpenAI GPT-4o-mini.
- Database: PostgreSQL (Production) / SQLite (Local fallback).
Features
AI Tutor Chat: Live conversational memory powered by LangGraph to explain concepts with analogies.
Smart Quiz Generator: Generates custom multiple-choice quizzes with explanations.
AI Study Planner: Formulates weekly timetables and task lists.
PDF Document Chat: Local keyword-based RAG indexing and sourcing over uploaded documents.
Coding Playground: AI sandbox diagnosing syntax and logic issues in Python and JavaScript.
Analytics Hub: Dashboard visualizations tracking active students, quiz scores, and study hours.
7. Role-Based Portals: Dedicated workspaces for Students, Teachers, and Admins.
🔄 System Workflows & Data Flows
1. User Authentication & Authorization Flow
sequenceDiagram
   participant User as Student/Teacher/Admin
   participant FE as Next.js Frontend
   participant BE as FastAPI Backend
   participant DB as Database (SQLite/PostgreSQL)

   User->>FE: Enter Credentials & Submit
   FE->>BE: POST /api/v1/auth/login
   BE->>DB: Query User by Email
   DB-->>BE: User Details & Hashed Password
   BE->>BE: Verify Password Hash
   alt Success
       BE->>BE: Generate JWT Token (user_id & role)
       BE-->>FE: Return Access Token & Metadata
       FE->>FE: Save Token & Redirect
       FE->>User: Load Student/Teacher Dashboard
   else Invalid Credentials
       BE-->>FE: Return 401 Unauthorized
       FE->>User: Display Error Toast
   end
2. AI Tutor Agent Flow (LangGraph State Machine)
graph TD
   Start([User Question]) --> CheckHistory[Retrieve Conversation History]
   CheckHistory --> Router{LangGraph Agent Router}
   Router -->|General Concept| LLMResponse[Generate Analogy & Explanation]
   Router -->|Code Snippet| CodePlayground[Code Analyzer Service]
   Router -->|Schedule Query| PlanBuilder[Study Planner Service]

   CodePlayground --> LLMResponse
   PlanBuilder --> LLMResponse

   LLMResponse --> SaveHistory[Save Message to DB]
   SaveHistory --> End([Send Reply to User])
3. PDF Upload & Chat RAG Pipeline
flowchart LR
   Upload[Upload PDF/TXT/MD] --> Extractor[extract_text_from_file]
   Extractor --> Store[store_pdf_content]
   Store --> Split[Chunk Content by Formfeed]
   Split --> Memory[(pdf_storage In-Memory Map)]

   Query[Ask Question] --> Search[Keyword Word-Overlap Search]
   Memory --> Search
   Search --> Context[Retrieve Top 3 Source Pages]
   Context --> LLM[Augment Prompt Context]
   LLM --> Reply[Response with Page Sources]
🛠️ Local Setup
Backend Setup
Navigate to the backend directory:
  cd backend
Create and activate a Python virtual environment:
  python3 -m venv .venv
  source .venv/bin/activate
Install dependencies:
  pip install -r requirements.txt
Create a .env file:
  DATABASE_URL=sqlite:///study_mentor.db
  JWT_SECRET=supersecretjwtkeyforstudymentorai2026
  GEMINI_API_KEY=your_gemini_api_key
  OPENAI_API_KEY=your_openai_api_key
Run the server:
  PYTHONPATH=. uvicorn app.main:app --reload --port 8000
Frontend Setup
Navigate to the frontend directory:
  cd frontend
Install dependencies:
  npm install --legacy-peer-deps
Create a .env.local file:
  NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
Run the development server:
  npm run dev
5. Open http://localhost:3000 in your browser.
Testing
Run the backend integration test suite:

cd backend
PYTHONPATH=. .venv/bin/pytest tests
Containerization (Docker)
Spin up the entire application stack including PostgreSQL using Docker Compose:

docker-compose up --build
Deployment Guide
Frontend (Vercel)
Import the root repository or the frontend/ folder into Vercel.
Set Environment Variables:
NEXT_PUBLIC_API_URL: Your deployed backend URL (e.g. https://api.yourstartup.com/api/v1).
Deploy!
Backend (Railway / Render)
Deploy the backend/ directory as a web service.
Provision a PostgreSQL Database add-on.
Configure Environment Variables:
DATABASE_URL: Injected automatically by Railway, or manually configure.
JWT_SECRET: A secure random secret.
GEMINI_API_KEY / OPENAI_API_KEY: API keys for LLM features.
