# JobFlow AI

JobFlow AI is a full-stack job application management platform that helps users track job applications, manage follow-up dates, and analyze job-candidate fit using AI.

The project combines a Next.js frontend, FastAPI backend, PostgreSQL database, and Gemini API integration.

## Features

- Add and manage job applications
- Track application status: Saved, Applied, Interview, Offer, and Rejected
- Set and clear follow-up dates
- Automatically identify overdue, due-today, and upcoming follow-ups
- Create and edit a candidate profile with skills used for job matching
- Analyze candidate-job fit using Gemini AI
- Display AI-generated match scores, matched skills, missing skills, strengths, and explanations
- Store AI match results in PostgreSQL
- Delete rejected job applications with confirmation
- Handle API and AI service errors gracefully

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**
- Python
- FastAPI
- REST API

**Database**
- PostgreSQL
- Psycopg

**AI**
- Gemini API
- Structured AI responses

**Testing & Tools**
- Pytest
- Git & GitHub
- VS Code

## Project Structure

```text
AI JobFlow Project/
├── backend/
│   ├── routers/
│   ├── services/
│   ├── tests/
│   ├── main.py
│   ├── database.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── .env.example
│
├── .gitignore
└── README.md
```

## How It Works

1. The user creates and manages a candidate profile containing skills used for job matching.
2. The user adds job applications through the Next.js dashboard.
3. The frontend communicates with the FastAPI backend through REST API requests.
4. FastAPI validates requests and stores application and candidate data in PostgreSQL.
5. Users can update application status, manage follow-up dates, and remove rejected applications.
6. When AI match analysis is requested, FastAPI retrieves the job and candidate profile and sends the relevant information to the Gemini API.
7. Gemini returns a structured analysis containing the match score, matched skills, missing skills, strengths, and explanation.
8. The AI result is stored in PostgreSQL and displayed on the frontend.

### Application Flow

```text
Next.js Frontend
       │
       │ HTTP / JSON
       ▼
FastAPI Backend
       │
       ├──────────────► PostgreSQL
       │                 Jobs
       │                 Candidate Profile
       │                 AI Match Results
       │
       └──────────────► Gemini API
                         AI Match Analysis
```