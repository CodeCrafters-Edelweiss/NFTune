import tensorflow as tf
import tensorflow_hub as hub
from scipy.spatial import distance
import cv2 as cv
import numpy as np

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

model_url = "https://tfhub.dev/tensorflow/efficientnet/lite0/feature-vector/2"

IMAGE_SHAPE = (256,256,3)

layer = hub.KerasLayer(model_url, input_shape=IMAGE_SHAPE)
model = tf.keras.Sequential([layer])

# print("test-pass")

# img = "./Images"
# img_copy = "./Images/1.jpg"

img = cv.imread(".\Images\0_copy.jpg",1);
img_copy = cv.imread(".\Images\0_copy.jpg",1)


flat_feature_img = feature_extraction(img,model)

flat_feature_copy_img = feature_extraction(img_copy,model)

print(flat_feature_img)

print(flat_feature_copy_img)


if(cosine_similarity(flat_feature_copy_img,flat_feature_img)<0.5):
   print("Image is too similar with another existing NFT")
else:
    print("Image is good to go")
