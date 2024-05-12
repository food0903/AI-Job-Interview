# Run this for docker
# docker-compose up --build

from typing import Union
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from app.openai_utils import audio_to_text, add_message_to_db, fetch_assistant_response, text_to_audio_response
from app.firebase_utils import clear_messages_for_user, set_job_description, create_session_in_db
import tempfile
from pathlib import Path
from pydantic import BaseModel
import os

# FastAPI instance
app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Classes for POST requests 
class Message(BaseModel):
    role: str
    content: str
    uid: str
    sid: str

class User(BaseModel):
    uid: str

class Text(BaseModel):
    text: str

class JobDescription(BaseModel):
    uid: str
    text: str
    sid: str

class Session(BaseModel):
    sid: str

@app.post("/create_session")
def create_session(user: User):
    sid = create_session_in_db(user.uid)
    return {"sid": sid}

@app.post("/fetch_response")
def fetch_response(session: Session):
    return fetch_assistant_response(session.sid)
    
@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/transcribe_text")
async def transcribe_text(file: UploadFile = File(...)):

    # Save audio file to temp file
    extension = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(suffix=extension, delete=False) as temp:
        open(temp.name, "wb").write(file.file.read())
    
    # Open audio file stored in temp file
    audio_input = open(temp.name, "rb")


    # Convert audio to text
    output_text = audio_to_text(audio_input)

    # Close audio file
    os.unlink(temp.name)

    return {"text": output_text}

@app.post("/add_message")
def add_message(message: Message):

    # adds the message to the firestore db
    add_message_to_db(message.role, message.content, message.uid, message.sid)

    # return response
    return {"response": "Message added to the database."}

@app.delete("/delete_messages/{uid}")
def delete_messages(uid: str):
    clear_messages_for_user(uid)
    return {"response": "Messages deleted from the database."}

@app.post("/text_to_speech")
def text_to_speech(text: Text):
    response = text_to_audio_response(text.text)

    def iterfile():
        yield response.content
    return StreamingResponse(iterfile(), media_type="application/octet-stream")

@app.post("/set_job_description_for_user")
def set_job_description_for_user(description: JobDescription):
    set_job_description(description.uid, description.text, description.sid)
    return {"response": "Job description set for user session."}
