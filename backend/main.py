from fastapi import FastAPI
from routers.jobs import router as jobs_router
from routers.matching import router as matching_router
from routers.candidate import router as candidate_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs_router)
app.include_router(matching_router)
app.include_router(candidate_router)

@app.get("/")
def home():
    return {"message": "Welcome to JobFlow AI"}