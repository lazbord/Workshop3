import requests


paul_url ="https://9ee4-89-30-29-68.ngrok-free.app/predict"
lazare_url="https://8aba-89-30-29-68.ngrok-free.app/predict"
hubert_url="https://04d3-89-30-29-68.ngrok-free.app/predict"

url=[paul_url,lazare_url,hubert_url]
sepal_length = 0.1
sepal_width = 1.5
petal_length = 1.4
petal_width = 0.2

for i in url:
    response = requests.get(f'{i}/{sepal_length}/{sepal_width}/{petal_length}/{petal_width}')
    if response.status_code == 200:
        print(f"URL: {i}")
        print(response.json())
    else:
        print(f'Request failed with status code: {response.status_code}')
        print(response.text)