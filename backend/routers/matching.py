from fastapi import APIRouter

from schemas import MatchRequest
from services.matching import calculate_match

router = APIRouter(
    prefix="/match",
    tags=["matching"]
)


@router.post("")
def match_job(request: MatchRequest):
    return calculate_match(
        request.skills,
        request.job_description
    )