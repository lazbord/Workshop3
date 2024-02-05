import requests

# Replace this URL with the URL where your Flask app is running
api_url = 'http://127.0.0.1:5000/predict'

# Sample input parameters
sepal_length = 0.1
sepal_width = 1.5
petal_length = 1.4
petal_width = 0.2

# Make a GET request to the predict route with input parameters
response = requests.get(f'{api_url}/{sepal_length}/{sepal_width}/{petal_length}/{petal_width}')

# Check if the request was successful (status code 200)
if response.status_code == 200:
    print(response.json())

else:
    print(f'Request failed with status code: {response.status_code}')
    print(response.text)
