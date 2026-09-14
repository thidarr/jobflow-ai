from pydantic import BaseModel
from datetime import date


class JobCreate(BaseModel):
    title: str
    company: str
    description: str | None = None

class JobUpdate(BaseModel):
    status: str | None = None
    applied_date: date | None = None
    follow_up_date: date | None = None

class MatchRequest(BaseModel):
    skills: list[str]
    job_description: str

class CandidateProfile(BaseModel):
    name: str
    skills: list[str]

class AIMatchResult(BaseModel):
    match_score: int
    matched_skills: list[str]
    missing_skills: list[str]
    strengths: list[str]
    explanation: str