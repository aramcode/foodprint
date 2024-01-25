import requests
import base64
import json
import cv2

foodini_ip = "192.168.1.36:8090"
login_url = f"http://{foodini_ip}/1/user/login"
token=""
dish_ids = []
dish_names = []
login_data = {
    "login": "hywang1027@gmail.com",
    "password": "Basten66."
}
image_id = 0

#we can change different picture through changing pic
pic='../Images/shape.png'


def process_shallow(pic):

    image = cv2.imread(pic, cv2.IMREAD_GRAYSCALE)
    _, otsu_thresh = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    cv2.imwrite('processed_image.png', otsu_thresh)

def decode_base64url(content):
    # Replace URL specific characters
    content = content.replace('-', '+').replace('_', '/')
    # Pad with '=' characters if necessary
    padded_content = content + '=' * ((4 - len(content) % 4) % 4)
    # Decode the base64 URL encoded string
    decoded_bytes = base64.b64decode(padded_content)
    # Convert the bytes to a string
    decoded_string = decoded_bytes.decode('utf-8')
    return decoded_string

# got token, should under the same wifi environment with FOODINI
response = requests.post(login_url, json=login_data)
if response.status_code == 200:
    token = response.json().get('token')
    print("Tocken:", token)
else:
    print("Login Fail:", response.status_code, response.text)

headers = {
    'x-token': token,
    'Content-Type': 'application/json'
}

#process img
image=process_shallow(pic)

# upload picture to Foodini server
with open("./processed_image.png", "rb") as image_file:# to Base64
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
upload_url = f"http://{foodini_ip}/1/storage/"

data_img = {
    'type': 'creation',
    'url': f"data:image/jpeg;base64,{encoded_string}"
}
response_img = requests.put(upload_url, headers=headers, json=data_img)
if response_img.status_code == 200:
    print("upload success")
    upload_response_data = response_img.json()
    print("upload_response_data",upload_response_data)
    image_id = upload_response_data.get('id')
    print("the id of the uploaded picture is:", image_id)
else:
    print("uploaded failed")


# retrive an object
retrive_api = f'http://{foodini_ip}/1/storage/{image_id}'
retrive_response = requests.get(retrive_api, headers=headers)
if retrive_response.status_code == 200:
    retrive_response_data = retrive_response.json()
    print("Object retrieved successfully:")
    print(retrive_response_data)
else:
    print("Error retrieving object:", retrive_response.status_code)

#convert to SVG
transform_url = f"http://{foodini_ip}/1/storage/{image_id}/transform/?nostore=1&trans=imageToVector"
print(transform_url)
data_transform = {
}
response_transform = requests.put(transform_url, headers=headers, json=data_transform)
print(response_transform)
if response_transform.status_code == 200:
    print("convert to SVG successful")
    svg_content_encoded = response_transform.json().get('content', '')
    print(svg_content_encoded)
    decoded_content = base64.b64decode(svg_content_encoded)  # 解码base64内容
    with open("output.svg", "wb") as svg_file:
        svg_file.write(decoded_content)
    print("Save SVG")
else:
    print("Convert failed:", response_transform.status_code)

# so we get the output.svg