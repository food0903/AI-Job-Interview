from google.cloud import speech
import pyaudio
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\trung\Downloads\sxhack-2840c4711b3f.json"

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

audio = pyaudio.PyAudio()
client = speech.SpeechClient()

stream_config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=RATE,
    language_code="en-US",
)

streaming_config = speech.StreamingRecognitionConfig(
    config=stream_config,
    interim_results=True,
)

def audio_data_generator():
    while True:
        audio_data = stream.read(CHUNK)
        yield speech.StreamingRecognizeRequest(audio_content=audio_data)

stream = audio.open(
    format=FORMAT,
    channels=CHANNELS,
    rate=RATE,
    input=True,
    frames_per_buffer=CHUNK,
)

stream_response = client.streaming_recognize(streaming_config, requests=audio_data_generator())

print("Listening...")

for response in stream_response:
    for result in response.results:
        if result.is_final:
            print("Transcription:", result.alternatives[0].transcript)

