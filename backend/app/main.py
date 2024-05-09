# Run this for docker
# docker-compose up --build

from typing import Union
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from app.openai_utils import root_test, audio_to_text, add_message_to_db
from app.firebase_utils import clear_messages_for_user
import tempfile
from pathlib import Path
from pydantic import BaseModel
import os

# FastAPI instance
app = FastAPI()

# Classes for POST requests 
class Message(BaseModel):
    role: str
    content: str
    uid: int

class User(BaseModel):
    uid: int

@app.get("/")
def read_root():
    return root_test()
    
@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/transcribe_text/")
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
    add_message_to_db(message.role, message.content, message.uid)

    # return response
    return {"response": "Message added to the database."}

@app.delete("/delete_messages")
def delete_message(user: User):
    clear_messages_for_user(user.uid)
    return {"response": "Messages deleted from the database."}