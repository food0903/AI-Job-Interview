import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def job_feedback(answer):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an assistant that provides feedback on job interview answers. Do not rewrite the question, just provide only feedback.",
            },
            {
                "role": "user",
                "content": (f'You are interviewing a prospective employee. Here are the answers.'
                            f'and you are expected to pass back feedback on the answers. The answer is {answer}. Give me back another question based on the answer.'),
            }
        ],
        model="gpt-3.5-turbo",
    )

    return chat_completion.choices[0].message.content
