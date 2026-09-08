from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Welcome to JobFlow AI"}

class JobCreate(BaseModel):
    title: str
    company: str
    status: str

class JobUpdate(BaseModel):
    status:str


jobs = [
    {
        "id": 1,
        "title": "AI Engineer",
        "company": "Gofive",
        "status": "Applied"
    },
    {
        "id": 2,
        "title": "Software Engineer",
        "company": "FindTemp",
        "status": "Saved"
    }
]

@app.post("/jobs", status_code=201)
def create_job(job: JobCreate):
    job_data = job.model_dump()
    job_data["id"] = len(jobs)+1
    jobs.append(job_data)
    return job_data

@app.get("/jobs")
def get_jobs():
    return jobs

@app.get("/jobs/{job_id}")
def get_job(job_id: int):
    for job in jobs:
        if job["id"] == job_id:
            return job
        
    raise HTTPException(
                    status_code=404,
                    detail="Job not found"
                )

@app.patch("/jobs/{job_id}")
def update_job(job_id: int, update: JobUpdate):
    for job in jobs:
        if job["id"] == job_id:
            job["status"] = update.status
            return job
         
    raise HTTPException(
    status_code=404,
    detail="Job not found"
)

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    for job in jobs:
        if job["id"] == job_id:
            jobs.remove(job)
            return job
    raise HTTPException(
        status_code=404,
        detail="Job not found"
    )



