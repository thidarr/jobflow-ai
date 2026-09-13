from fastapi import APIRouter, HTTPException
from database import get_connection
from schemas import JobCreate, JobUpdate
from routers.candidate import get_candidate_profile
from services.matching import calculate_match
from services.ai_matching import analyze_job_match

router = APIRouter(
    prefix="/jobs",
    tags=["jobs"]
)


@router.post("", status_code=201)
def create_job(job: JobCreate):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO jobs (title, company, description)
                VALUES (%s, %s, %s)
                RETURNING *;
                """,
                (job.title, job.company, job.description),
            )

            new_job = cursor.fetchone()

    return new_job


@router.get("")
def get_jobs():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM jobs;")
            jobs = cursor.fetchall()

    return jobs


@router.get("/{job_id}")
def get_job(job_id: int):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM jobs WHERE id = %s;",
                (job_id,)
            )

            job = cursor.fetchone()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


@router.patch("/{job_id}")
def update_job(job_id: int, update: JobUpdate):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE jobs
                SET status = %s
                WHERE id = %s
                RETURNING *;
                """,
                (update.status, job_id)
            )

            job = cursor.fetchone()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


@router.delete("/{job_id}")
def delete_job(job_id: int):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM jobs
                WHERE id = %s
                RETURNING *;
                """,
                (job_id,)
            )

            job = cursor.fetchone()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job

@router.post("/{job_id}/match")
def match_saved_job(job_id: int):
    candidate_profile = get_candidate_profile()

    if candidate_profile is None:
        raise HTTPException(
            status_code=400,
            detail="Candidate profile not found"
        )

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM jobs WHERE id = %s;",
                (job_id,)
            )

            job = cursor.fetchone()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    description = job["description"] or ""

    result = calculate_match(
        candidate_profile["skills"],
        description
    )

    return {
        "job": job,
        "candidate": candidate_profile,
        "match": result
    }

@router.post("/{job_id}/ai-match")
def ai_match_job(job_id: int):
    candidate = get_candidate_profile()

    if candidate is None:
        raise HTTPException(
            status_code=400,
            detail="Candidate profile not found"
        )

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM jobs WHERE id = %s;",
                (job_id,)
            )
            job = cursor.fetchone()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    result = analyze_job_match(candidate, job)

    return {
        "job": job,
        "candidate": candidate,
        "ai_match": result
    }