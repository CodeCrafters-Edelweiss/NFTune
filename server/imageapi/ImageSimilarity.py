import tensorflow as tf
import tensorflow_hub as hub
from scipy.spatial import distance
import cv2 as cv
import numpy as np
import requests

url = r'https://oaidalleapiprodscus.blob.core.windows.net/private/org-H2Wa8pgHtksiDcWDehxBdQ9S/user-RrHnW4hJk3BrvB1JEPrEyNJH/img-P1QPvP90vGCtx7O5VbnuhueY.png?st=2023-04-01T12%3A16%3A36Z&se=2023-04-01T14%3A16%3A36Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-01T08%3A47%3A58Z&ske=2023-04-02T08%3A47%3A58Z&sks=b&skv=2021-08-06&sig=ZzTwveWfoAdt9gTV72LIfZywhUbZVZnFeSVFG5ro1lM%3D'


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

# model_url = "https://tfhub.dev/tensorflow/efficientnet/lite0/feature-vector/2"

# IMAGE_SHAPE = (256,256,3)

# layer = hub.KerasLayer(model_url, input_shape=IMAGE_SHAPE)
# model = tf.keras.Sequential([layer])

# print("test-pass")

# img = "./Images"
# img_copy = "./Images/1.jpg"

# img = cv.imread("https://oaidalleapiprodscus.blob.core.windows.net/private/org-H2Wa8pgHtksiDcWDehxBdQ9S/user-RrHnW4hJk3BrvB1JEPrEyNJH/img-P1QPvP90vGCtx7O5VbnuhueY.png?st=2023-04-01T12%3A16%3A36Z&se=2023-04-01T14%3A16%3A36Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-01T08%3A47%3A58Z&ske=2023-04-02T08%3A47%3A58Z&sks=b&skv=2021-08-06&sig=ZzTwveWfoAdt9gTV72LIfZywhUbZVZnFeSVFG5ro1lM%3D",1);
# # img_copy = cv.imread(".\Images\0_copy.jpg",1)

# print(img)

# flat_feature_img = feature_extraction(img,model)

# flat_feature_copy_img = feature_extraction(img_copy,model)

# print(flat_feature_img)

# print(flat_feature_copy_img)


# if(cosine_similarity(flat_feature_copy_img,flat_feature_img)<0.5):
#    print("Image is too similar with another existing NFT")
# else:
#     print("Image is good to go")
