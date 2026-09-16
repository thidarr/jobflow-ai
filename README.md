# JobFlow AI

JobFlow AI is a full-stack AI-powered job application management platform that helps users track job applications, manage follow-up dates, maintain a candidate profile, and analyze candidate-job fit using AI.

The project combines a Next.js frontend, FastAPI backend, PostgreSQL database, and Gemini API integration.

## Live Demo

[View JobFlow AI](https://jobflow-ai-xi.vercel.app)

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
- Responsive dashboard interface

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- REST API
- Psycopg

### Database

- PostgreSQL
- Supabase

### AI

- Gemini API
- Structured AI responses

### Testing & Tools

- Pytest
- Git & GitHub
- VS Code

### Deployment

- Vercel — Frontend
- Render — Backend
- Supabase — PostgreSQL database

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
4. FastAPI validates requests and stores job application and candidate data in PostgreSQL.
5. Users can update application status, manage follow-up dates, and remove rejected applications.
6. When AI match analysis is requested, FastAPI retrieves the job and candidate profile and sends the relevant information to the Gemini API.
7. Gemini returns a structured analysis containing a match score, matched skills, missing skills, strengths, and an explanation.
8. The AI result is stored in PostgreSQL and displayed on the frontend.

## Application Flow

```text
Next.js Frontend (Vercel)
        │
        │ HTTP / JSON
        ▼
FastAPI Backend (Render)
        │
        ├──────────────► PostgreSQL (Supabase)
        │                 ├── Jobs
        │                 ├── Candidate Profile
        │                 └── AI Match Results
        │
        └──────────────► Gemini API
                          AI Match Analysis
```

## Environment Variables

The application uses environment variables for database, AI API, frontend, and backend configuration.

Example files are included in the repository:

```text
backend/.env.example
frontend/.env.example
```

Sensitive credentials and API keys are excluded from version control.

## Testing

Backend API tests are implemented with Pytest.

Run the tests from the backend directory:

```bash
python -m pytest
```

## Deployment Architecture

```text
Vercel
  │
  │ Next.js Frontend
  ▼
Render
  │
  │ FastAPI REST API
  ├──────────────► Supabase PostgreSQL
  │
  └──────────────► Gemini API
```