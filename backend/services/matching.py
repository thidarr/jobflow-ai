import re


def calculate_match(candidate_skills: list[str], job_description: str):
    matched_skills = []
    missing_skills = []

    description_lower = job_description.lower()

    for skill in candidate_skills:
        pattern = rf"\b{re.escape(skill.lower())}\b"

        if re.search(pattern, description_lower):
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    if not candidate_skills:
        score = 0
    else:
        score = round(
            len(matched_skills) / len(candidate_skills) * 100
        )

    return {
        "match_score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }