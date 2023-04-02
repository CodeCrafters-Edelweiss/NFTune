get_path = "images.txt"
print("hi")
file=open(get_path,"r")
url_list = file.readlines()
file.close()

# file.close()
print(url_list)
for url_ipfs in url_list:
    # resp = requests.get(url_ipfs, stream=True).raw
    # image = np.asarray(bytearray(resp.read()), dtype="uint8")
    # image = cv.imdecode(image, cv.IMREAD_COLOR)
    print(url_ipfs)
