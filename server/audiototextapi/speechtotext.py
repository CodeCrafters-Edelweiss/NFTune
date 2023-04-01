import io
import wave

from mutagen.mp3 import MP3
from google.oauth2 import service_account
from google.cloud import speech
from pydub import AudioSegment

client_file = 'key.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)

audio_file = 'samples/1minute.wav'

sizecheck = audio_file.split('.')
if sizecheck[1]== 'mp3' :

    def mutagen_length(path):
        try:
            audio = MP3(path)
            length = audio.info.length
            return length
        except:
            return None

    length = mutagen_length(audio_file)
    print("duration sec: " + str(length))
    print("duration min: " + str(int(length/60)) + ':' + str(int(length%60)))
    print(type(length))

if sizecheck[1] == 'wav' :

    with wave.open(audio_file) as mywav:
        duration_seconds = mywav.getnframes() / mywav.getframerate()
        print(f"Length of the WAV file: {duration_seconds:.1f} s")
        length = duration_seconds

if length > 60.00 :
    sound = AudioSegment.from_mp3("samples/1minute.wav")
    #Selecting Portion we want to cut
    StrtMin = 0
    StrtSec = 0
    EndMin = 0
    EndSec = 60
    # Time to milliseconds conversion
    StrtTime = StrtMin*60*1000+StrtSec*1000
    EndTime = StrtMin*60*1000+EndSec*1000
    # Opening file and extracting portion of it
    extract = sound[StrtTime:EndTime]
    # Saving file in required location
    extract.export("samples/portion.mp3", format="mp3")

    trimaudio = 'samples/portion.mp3'

else :

    trimaudio = audio_file




extensioncheck = trimaudio.split('.')

if extensioncheck[1]== 'wav' :
    with wave.open(trimaudio, "rb") as wave_file:
        frame_rate = wave_file.getframerate()
else:
    frame_rate = 24000


with io.open(trimaudio,'rb') as f:
    content = f.read()
    audio = speech.RecognitionAudio(content=content)


if extensioncheck[1] == 'wav':

    config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=frame_rate,
    language_code='en-IN',
    audio_channel_count = 2
  
    )
else :
    config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
    sample_rate_hertz=frame_rate,
    language_code='en-IN')



response = client.recognize(config=config,audio=audio)
print(response.results[0].alternatives[0].transcript)


#output

# results {
#   alternatives {
#     transcript: "introduction to Deep learning what is Deep learning deep learning is a branch of machine learning which is completely based on artificial neural network as neural network is going to mimic the human brain so deep learning is also kind of limits of human brain in deep learning we don\'t need to explicitly programmed the concept of deep learning is not new it has been around for a couple of years now it\'s only its own Hype nowadays because earlier did not have that much processing power and a lot of data as in the last 20 years the processing power increases exponentially deep learning and machine learning came in the Air formal definition of deep learning is neurone Deep learning is a subset of machine that is based on artificial neural networks with multiple layers also known as"
#     confidence: 0.913096309
#   }
#   result_end_time {
#     seconds: 59
#     nanos: 970000000
#   }