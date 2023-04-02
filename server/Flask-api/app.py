import tensorflow as tf
import tensorflow_hub as hub
from scipy.spatial import distance
import cv2 as cv
import numpy as np

from transformers import pipeline
from flask import Flask,render_template,request,jsonify
import requests
from werkzeug.utils import secure_filename

from pydub import AudioSegment
from mutagen.mp3 import MP3

import io
import os
import wave
from os import path
from google.oauth2 import service_account
from google.cloud import speech


from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/YOURAPP/*": {"origins": "*"}})

client_file = 'key.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)

UPLOAD_FOLDER=r'Uploads'
app.config['UPLOAD_FOLDER']=UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH']=16*1024*1024



def cosine_similarity(img1,img2):

    metric = 'cosine'
    cosineDistance = distance.cdist([img1], [img2], metric)[0]
    return cosineDistance

def feature_extraction(img,model):
    img = cv.resize(img,(256,256),interpolation=cv.INTER_NEAREST)
        
    img = np.array(img)/255.0                               

    embedding = model.predict(img[np.newaxis, ...])
    embedding_np = np.array(embedding)
    flat_feature = embedding_np.flatten()

    return flat_feature


ALLOWED_EXTENSIONS = ['mp3','wav']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploadaudio',methods=['POST','GET'])
def uploadaudio():
    if(request.method=="POST"):
        print("hello")
        f = request.files['file']
        print("hi")
        print(f.filename)
        print("good to go")
        if(f and allowed_file(f.filename)):
            filename=secure_filename( f.filename )
            f.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))


            get_path = "http://localhost:5000/speechtotext/"+filename
            
            text_get_response = requests.get(get_path)

            text_get_response = text_get_response.json()

            return jsonify(text_get_response)
        else:
            print("Please check the file extension")
            data = {"text":None}
            return jsonify(data)
    else:
        return render_template('test.html')


@app.route('/image/similarity/<path:url>')
def imagesimilarity(url):
    if(request.method == "GET"):
        print("hi")
        model_url = "https://tfhub.dev/tensorflow/efficientnet/lite0/feature-vector/2"

        IMAGE_SHAPE = (256,256,3)

        layer = hub.KerasLayer(model_url, input_shape=IMAGE_SHAPE)
        model = tf.keras.Sequential([layer])

        resp = requests.get(url, stream=True).raw
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        image = cv.imdecode(image, cv.IMREAD_COLOR)

        flat_feature_img = feature_extraction(image,model)


        #TODO: Do the query in all the images in the database to check the

        # get_path = "images.txt"
        text_get_response = requests.get("http:localhost:3500/file/upload") 

        print("hi")

        file=open(text_get_response,"r")
        url_list = file.readlines()
        file.close()


        for url_ipfs in url_list:
            resp = requests.get(url_ipfs, stream=True).raw
            url_image = np.asarray(bytearray(resp.read()), dtype="uint8")
            url_image = cv.imdecode(image, cv.IMREAD_COLOR)
            
            flat_feature_url_img = feature_extraction(url_image,model)

            if(cosine_similarity(flat_feature_url_img,flat_feature_img)<0.05):
                data = {
                "response":False
                }
                return jsonify(data)
       
        data = {
            "response":True
        }
        return jsonify(data)
    

#passing the path to the api
@app.route('/speechtotext/<path:filename>')
def speechtotext(filename):
    
    audio_file = "uploads/"+filename

    sizecheck = audio_file.split('.')
    print(sizecheck)

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
        sound = AudioSegment.from_mp3(audio_file)
        #Selecting Portion we want to cut
        StrtMin = 0
        StrtSec = 0
        EndMin = 0
        EndSec = 60
        # Time to milliseconds conversion
        StrtTime = StrtMin*60*1000+StrtSec*1000
        EndTime = EndMin*60*1000+EndSec*1000
        # Opening file and extracting portion of it
        extract = sound[StrtTime:EndTime]
        # Saving file in required location
        extract.export("export/portion.mp3", format="mp3")

        trimaudio = 'export/portion.mp3'
    else :
        trimaudio = audio_file

    extensioncheck = trimaudio.split('.')
    print(extensioncheck)


    with io.open(trimaudio,'rb') as f:
        content = f.read()
        audio = speech.RecognitionAudio(content=content)

    config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
    sample_rate_hertz=24000,
    language_code='en-IN')

    response = client.recognize(config=config,audio=audio)

    text = response.results[0].alternatives[0].transcript

    # summarizer = pipeline("summarization", model="t5-base", tokenizer="t5-base", framework="tf")
    summarizer = pipeline("summarization",model="t5-small")

    x = summarizer(text,max_length=30,min_length=1,do_sample=False)
    print(x)
    # [{'summary_text': 'deep learning deep learning is a branch of machine learning which is completely based on artificial neural network as neural network is going to mimic the human'}]
    print(x[0]['summary_text'])
    data = {
        "text":x[0]['summary_text']
    }
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)