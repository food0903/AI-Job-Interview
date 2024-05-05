# python3 -m uvicorn main:app --reload
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai
import random
openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPENAI_API_KEY")
from openai import OpenAI
from decouple import config
import random
from pathlib import Path
import requests
import json
import os
from pydantic import BaseModel

api_key = config("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
client.organization = config("OPEN_AI_ORG")
client.api_key = config("OPENAI_API_KEY")

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

job_description_text = ""
def audio_to_text(file_path):
    try:
        transcript = client.audio.transcriptions.create(model="whisper-1", file=file_path)
        message = transcript.text
        return message
    except Exception as e:
        print(e)
        return
    
def get_response(input_message):
    messages = response_behavior()
    user_message = {"role": "user", "content": input_message}
    messages.append(user_message)
    print(messages)
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
        )
        print(response)
        message_string = response.choices[0].message.content
        save_response(input_message, message_string)
        return message_string
    except Exception as e:
        print(e)
        return
    
def load_responses():
    response =[]
    file = 'responses.json'
    if os.path.exists(file) and os.path.getsize(file) > 0:
        with open(file) as db_file:
            data = json.load(db_file)
            for item in data:
                response.append(item)
    else:
        response = []

    return response


def save_response(message, response):
    file = 'responses.json'
    conversation = load_responses()
    conversation.append({"role": "user", "content": message})
    conversation.append({"role": "system", "content": response})
    with open(file, 'w') as f:
        json.dump(conversation, f)


@app.post("/submit_job_description")
async def submit_job_description(request: Request):
    body = await request.json()
    if "description" not in body:
        raise HTTPException(status_code=400, detail="Job description is missing")

    global job_description_text
    job_description_text = body["description"]
    return {"message": "Job description submitted successfully"}

def response_behavior():
    global job_description_text
    role = {
        "role": "system",
        "content": (f'Your name is Celia. You are a human interviewer interviewing a candidate regarding this job description: {job_description_text}.'
        f'You are trying to see if the candidate qualifies for the job.' 
        f'Ask questions that are relevant to the job.'
        f'Say the job name from the job description.'
        f"Do not return anything else but your response to the interviewee's answer."
        f'Remember, you are the interviewer interviewing the candidate.'
        f'You are not the candidate.'
        f'Do not respond as a candidate.'
        f'if the candidate responds with something irelevant to the job description, you should go along with it and saying a humiliating joke back to them to roast the shit out of them'
        f'after saying hi for the first time, you do not have to say hi again'
        f'remember you are the system')
    }

    messages = []

    x = random.uniform(0, 1.2)
    if x < 0.3:
        role["content"] = role["content"] + "Your response will include simple follow up questions to the interview answers"
    elif x < 0.6 and x >= 0.3:
        role["content"] = role["content"] + "Your response will include challenging follow up questions to the interview answers"
    elif x < 0.9 and x >= 0.6:
        role["content"] = role["content"] + "Your response will include humor and personality in the response to the interview answers then continue with a new question"
    else:
        role["content"] = role["content"] + "Your response will ask a new interview question"
    messages.append(role)   
    
    return messages

@app.post("/post_audio/")
async def post_audio(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    
    audio_input = open(file.filename, "rb") # get audio

    output_text = audio_to_text(audio_input) # convert audio to text

    response = get_response(output_text) # put text in gpt and get response

    output_audio = text_to_speech(response) # convert response to audio

    print(response)
    def iterfile():
        yield output_audio
    return StreamingResponse(iterfile(), media_type="application/octet-stream")


@app.post("/post_audio_and_get_text/")
async def post_audio_and_get_text(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    
    audio_input = open(file.filename, "rb") # get audio

    output_text = audio_to_text(audio_input) # convert audio to text

    # response = get_response(output_text) put text in gpt and get response

    return {"response": output_text}

class RespondPostParams(BaseModel):
    input_message: str

@app.post("/respond_message/")
def respond(input: RespondPostParams):
    print(input.input_message)
    response = get_response( input.input_message)
    return response

@app.post("/text_to_speech")
def text_to_speech(input: RespondPostParams):
    print(input.input_message)
    response = client.audio.speech.create(
        model="tts-1",
        voice="nova",
        input=input.input_message
    )
    def iterfile():
        yield response.content
    return StreamingResponse(iterfile(), media_type="application/octet-stream")

@app.post("/clear_responses/")
def clear_responses():
    file_path = 'responses.json'
    with open(file_path, 'w') as f:
        f.truncate(0)
    return {"message": "Responses cleared successfully"}


