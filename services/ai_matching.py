import os

from dotenv import load_dotenv
from google import genai

from schemas import AIMatchResult

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_job_match(candidate: dict, job: dict):
    prompt = f"""
You are evaluating how well a candidate matches a job.

Candidate:
Name: {candidate["name"]}
Skills: {candidate["skills"]}

Job:
Title: {job["title"]}
Company: {job["company"]}
Description: {job["description"]}

Evaluate the candidate against the job requirements.

Be realistic.
Do not invent skills the candidate does not have.
Do not assume professional experience or skill depth unless it is explicitly provided in the candidate data.

Return:
- match_score from 0 to 100
- matched_skills
- missing_skills
- strengths
- a short explanation

"""
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": AIMatchResult,
        },
    )

    return AIMatchResult.model_validate_json(response.text)