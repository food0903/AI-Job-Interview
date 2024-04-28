from openai import OpenAI
from decouple import config
import random

api_key = config("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
client.organization = config("OPEN_AI_ORG")
client.api_key = config("OPENAI_API_KEY")

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
        message_string = response["choices"][0]["message"]["content"]
        return message_string
    except Exception as e:
        print(e)
        return
    
