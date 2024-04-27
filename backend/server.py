from fastapi import FastAPI
import uvicorn
import random
from pydantic import BaseModel
from gpt import job_feedback

app = FastAPI()

class JobFeedbackPostParams(BaseModel):
    answer: str

@app.post("/get_job_feedback")
def get_job_feedback(params: JobFeedbackPostParams):
    res = job_feedback(params.answer)
    return({ "message": res})

if __name__ == "__main__":
    uvicorn.run("server:app", port=8000, reload=True)