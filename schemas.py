from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    company: str
    description: str | None = None

class JobUpdate(BaseModel):
    status: str

class MatchRequest(BaseModel):
    skills: list[str]
    job_description: str

class CandidateProfile(BaseModel):
    name: str
    skills: list[str]