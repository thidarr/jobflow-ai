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
    update_data = update.model_dump(exclude_unset=True)
    set_clause = ", ".join(
        [f"{key} = %s" for key in update_data.keys()]
        )
    values = list(update_data.values())
    values.append(job_id)
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                f"""
                UPDATE jobs
                SET {set_clause}
                WHERE id = %s
                RETURNING *;
                """,
                values
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
    try:
        result = analyze_job_match(candidate, job)
    except Exception as e:
        print(e)

        raise HTTPException(
            status_code=502,
            detail="Ai matching service is temporarily unavailable"
        )

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO ai_match_results (
                    job_id,
                    candidate_id,
                    match_score,
                    matched_skills,
                    missing_skills,
                    strengths,
                    explanation
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
                """,
                (
                    job["id"],
                    candidate["id"],
                    result.match_score,
                    result.matched_skills,
                    result.missing_skills,
                    result.strengths,
                    result.explanation,
                ),
            )

            saved_result = cursor.fetchone()

    return {
        "job": job,
        "candidate": candidate,
        "ai_match": saved_result
    }

@router.get("/{job_id}/ai_matches")
def get_ai_matches(job_id: int):
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

            cursor.execute(
                """
                SELECT * FROM ai_match_results
                WHERE job_id = %s
                ORDER BY id DESC;
                """,
                (job_id,)
            )

            results = cursor.fetchall()

    return {
        "ai_matches": results
    }

@router.get("/follow-ups/due")
def get_due_follow_ups():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT * from jobs
                WHERE follow_up_date <= CURRENT_DATE
                ORDER BY follow_up_date ASC;
                """,
            )
            dates = cursor.fetchall()
    return{
        "follow_up_dates": dates
    }