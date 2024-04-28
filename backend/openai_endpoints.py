from openai import OpenAI
from decouple import config
import random
from pathlib import Path
import requests


api_key = config("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
client.organization = config("OPEN_AI_ORG")
client.api_key = config("OPENAI_API_KEY")
ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

def response_behavior():
    with open("description.txt", "r") as file:
        job_description = file.read()
    role = {
        "role": "system",
        "content": f"Your name is Chun Chan. You are a human interviewer interviewing a candidate regarding this job description: {job_description}. You are trying to see if the candidate qualifies for the job. Ask questions that are relevant to the job. Say the job name from the job description",
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
        message_string = response.choices[0].message
        return message_string
    except Exception as e:
        print(e)
        return
    
def text_to_speech(message):
    body = {
        "text": message,
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0
        },
    }

    voice_shaun = "mTSvIrm2hmcnOvb21nW2"
    voice_rachel = "21m00Tcm4TlvDq8ikWAM"
    voice_antoni = "ErXwobaYiN019PkySvjV"

    # Construct request headers and url
    headers = { "xi-api-key": ELEVEN_LABS_API_KEY, "Content-Type": "application/json"}
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_rachel}"

    try:
        response = requests.post(endpoint, json=body, headers=headers)

        if (response.status_code == 200):
            return response.content  # Valid content
        else:
            raise ValueError("Text-to-speech API returned an error")
    except Exception as e:
        print("Error in text_to_speech:", e)
        return None  # Handle exceptions


