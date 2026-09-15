# JobFlow AI

JobFlow AI is a full-stack job application management platform that helps users track job applications, manage follow-up dates, and analyze job-candidate fit using AI.

The project combines a Next.js frontend, FastAPI backend, PostgreSQL database, and Gemini API integration.

## Features

- Add and manage job applications
- Track application status: Saved, Applied, Interview, Offer, and Rejected
- Set and clear follow-up dates
- Automatically identify overdue, due-today, and upcoming follow-ups
- Analyze candidate-job fit using Gemini AI
- Display AI-generated match scores, matched skills, missing skills, strengths, and explanations
- Store AI match results in PostgreSQL
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

This section is useful because someone opening your repository can understand the architecture without digging through every file.

One small distinction worth remembering: **Gemini is an external API**, while FastAPI is the framework you used to build **your own REST API**.

Add this and save it. After that we'll add the most important technical section: **how JobFlow actually works**, including the frontend → FastAPI → PostgreSQL/Gemini flow. Then we'll add setup instructions and be basically finished with the README. 

## How It Works

1. The user adds a job application through the Next.js dashboard.
2. The frontend sends requests to the FastAPI REST API.
3. FastAPI validates the request and stores application data in PostgreSQL.
4. Users can update application status and manage follow-up dates from the dashboard.
5. When the user requests an AI match analysis, FastAPI retrieves the job and candidate profile and sends the relevant information to the Gemini API.
6. Gemini returns a structured analysis containing the match score, matched skills, missing skills, strengths, and explanation.
7. The result is stored in PostgreSQL and displayed on the frontend.

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


This is a useful section for interviews too. If someone asks:

> “Can you explain the architecture of your project?”

you can explain essentially the same flow in your own words.

After adding it, save the README.

Then we'll add **Setup & Run Locally**. That's the last substantial README section because someone cloning your repository should be able to figure out how to run JobFlow. 