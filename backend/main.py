# python3 -m uvicorn main:app --reload

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai
from openai_endpoints import audio_to_text, get_response, text_to_speech

openai.organization = config("OPEN_AI_ORG")
openai.api_key = config("OPENAI_API_KEY")

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