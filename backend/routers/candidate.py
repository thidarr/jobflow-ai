from fastapi import APIRouter, HTTPException

from database import get_connection
from schemas import CandidateProfile

router = APIRouter(
    prefix="/candidate",
    tags=["candidate"]
)


@router.post("")
def save_candidate(profile: CandidateProfile):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id
                FROM candidate_profiles
                ORDER BY id DESC
                LIMIT 1;
                """
            )

            existing_candidate = cursor.fetchone()

            if existing_candidate:
                cursor.execute(
                    """
                    UPDATE candidate_profiles
                    SET name = %s, skills = %s
                    WHERE id = %s
                    RETURNING *;
                    """,
                    (
                        profile.name,
                        profile.skills,
                        existing_candidate["id"]
                    )
                )
            else:
                cursor.execute(
                    """
                    INSERT INTO candidate_profiles (name, skills)
                    VALUES (%s, %s)
                    RETURNING *;
                    """,
                    (profile.name, profile.skills)
                )

            candidate = cursor.fetchone()

    return candidate


@router.get("")
def get_candidate():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM candidate_profiles
                ORDER BY id DESC
                LIMIT 1;
                """
            )

            candidate = cursor.fetchone()

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate profile not found"
        )

    return candidate


def get_candidate_profile():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM candidate_profiles
                ORDER BY id DESC
                LIMIT 1;
                """
            )

            candidate = cursor.fetchone()

    return candidate