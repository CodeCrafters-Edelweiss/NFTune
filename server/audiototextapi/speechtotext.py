import io
import os
import wave
from os import path

from google.oauth2 import service_account
from google.cloud import speech

client_file = 'key.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)

audio_file = '222.aac'

extensioncheck = audio_file.split('.')

if extensioncheck[1]== 'wav' :
    with wave.open(audio_file, "rb") as wave_file:
        frame_rate = wave_file.getframerate()
else:
    frame_rate = 24000


with io.open(audio_file,'rb') as f:
    content = f.read()
    audio = speech.RecognitionAudio(content=content)


if extensioncheck[1] == 'wav':

    config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=frame_rate,
    language_code='en-IN'
    )
else :
    config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
    sample_rate_hertz=frame_rate,
    language_code='en-IN')



response = client.recognize(config=config,audio=audio)
print(response)