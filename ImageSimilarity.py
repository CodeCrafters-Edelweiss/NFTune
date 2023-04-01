import tensorflow as tf
import tensorflow_hub as hub
# import PIL as Image
import cv2 as cv
import numpy as np

def feature_extraction(img,model):
    img = cv.resize(img,(256,256),interpolation=cv.INTER_NEAREST)

    # img = np.stack((img,)*3, axis=-1)               
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

img = "Images/0.jpg"
img_copy = "Images/0_copy.jpg"

img = cv.imread(img,1);
img_copy = cv.imread(img_copy,1)

flat_feature_img = feature_extraction(img,model)

print(flat_feature_img)

