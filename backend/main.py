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

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
        )
        print(response)
        message_string = response.choices[0].message.content
        return message_string
    except Exception as e:
        print(e)
        return
    
def text_to_speech(message):
    response = client.audio.speech.create(
        model="tts-1",
        voice="nova",
        input=message,
        )

    return response.content


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
        "content": f"Your name is Celia. You are a human interviewer interviewing a candidate regarding this job description: {job_description_text}. You are trying to see if the candidate qualifies for the job. Ask questions that are relevant to the job. Say the job name from the job description",
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