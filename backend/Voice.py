from google.cloud import speech
import pyaudio
import os
from dotenv import load_dotenv
import requests

load_dotenv()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# Audio settings
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

audio = pyaudio.PyAudio()
client = speech.SpeechClient()

# Streaming configuration
stream_config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=RATE,
    language_code="en-US",
)

streaming_config = speech.StreamingRecognitionConfig(
    config=stream_config,
    interim_results=True,
)

# Audio data generator
def audio_data_generator():
    while True:
        audio_data = stream.read(CHUNK)
        yield speech.StreamingRecognizeRequest(audio_content=audio_data)

# Open audio stream
stream = audio.open(
    format=FORMAT,
    channels=CHANNELS,
    rate=RATE,
    input=True,
    frames_per_buffer=CHUNK,
)

# Stream recognition response
stream_response = client.streaming_recognize(streaming_config, requests=audio_data_generator())

# FastAPI endpoint
endpoint = "http://localhost:8000/get_job_feedback"

print("Listening...")

# Process and send transcription results to FastAPI
for response in stream_response:
    for result in response.results:
        if result.is_final:
            transcription = result.alternatives[0].transcript
            print("Transcription:", transcription)

            # Send transcription to FastAPI
            payload = {"answer": transcription}
            requests.post(endpoint, json=payload)
