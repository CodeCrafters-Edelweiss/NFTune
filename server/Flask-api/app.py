import tensorflow as tf
import tensorflow_hub as hub
from scipy.spatial import distance
import cv2 as cv
import numpy as np

from transformers import pipeline
from flask import Flask,render_template,request,session
import requests
from werkzeug.utils import secure_filename


import io
import os
import wave
from os import path
from google.oauth2 import service_account
from google.cloud import speech


from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app, resources={r"/YOURAPP/*": {"origins": "*"}})

client_file = 'key.json'
credentials = service_account.Credentials.from_service_account_file(client_file)
client = speech.SpeechClient(credentials=credentials)


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



ALLOWED_EXTENSIONS = ['.aac','mp3','wav']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploadaudio',methods=['POST'])
def uploadaudio():
    if(requests.method=="POST"):
        file = request.form['file']
        if(file and allowed_file(file)):
            print("good")
                
            # Save the file to ./uploads
            basepath = os.path.dirname(__file__)
            file_path = os.path.join(
                basepath, 'uploads', secure_filename(file.filename))
            file.save(file_path)

            get_path = "http://localhost:6000/speechtotext/{file}"
            
            text_get_response = requests.get(get_path)

            print(text_get_response)

            return text_get_response
        else:
            return 0
    else:
        return 0


#passing the path to the api
@app.route('/speechtotext/<path:filename>')
def speechtotext(filename):
    audio_file = "uploads/"+filename

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

    summarizer = pipeline("summarization", model="t5-base", tokenizer="t5-base", framework="tf")
    text_result_speechtotext = ""

    x = summarizer(text_result_speechtotext,max_length=100,min_length=1,do_sample=False)
    print(x)
    return x

@app.route('/imagesimilarity')
def imagesimilarity():
    model_url = "https://tfhub.dev/tensorflow/efficientnet/lite0/feature-vector/2"

    IMAGE_SHAPE = (256,256,3)

    layer = hub.KerasLayer(model_url, input_shape=IMAGE_SHAPE)
    model = tf.keras.Sequential([layer])

    url = ""

    resp = requests.get(url, stream=True).raw
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv.imdecode(image, cv.IMREAD_COLOR)

    print(image)


    flat_feature_img = feature_extraction(image,model)

    #TODO: Do the query in all the images in the database to check the 

    flat_feature_copy_img = "" # query on the images

    if(cosine_similarity(flat_feature_copy_img,flat_feature_img)<0.5):
        return 1
    else:
        return 0


if __name__ == "__main__":
    app.run(debug=True,port=6000)