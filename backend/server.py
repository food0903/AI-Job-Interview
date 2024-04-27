from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel

app = FastAPI()

# Data model for POST request
class JobFeedbackPostParams(BaseModel):
    answer: str  # This will receive the transcription text

@app.post("/get_job_feedback")
def get_job_feedback(params: JobFeedbackPostParams):
    # Handle the transcription result
    # Example processing: print to console, return a message, etc.
    print("Received transcription:", params.answer)
    return {"message": "Transcription received successfully"}

if __name__ == "__main__":
    uvicorn.run("server:app", port=8000, reload=True)
