from sklearn.cluster import KMeans
from flask import Flask, jsonify
import numpy as np

# Load Iris dataset
from sklearn import datasets

iris = datasets.load_iris()
X = iris.data

# Fit KMeans model
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)

# Map numerical labels to custom cluster names
cluster_names = {0: 'setosa', 1: 'versicolor', 2: 'virginica'}

# Create a Flask application
app = Flask(__name__)


# Define the predict route
@app.route('/predict/<float:sepal_length>/<float:sepal_width>/<float:petal_length>/<float:petal_width>',
           methods=['GET'])
def predict(sepal_length, sepal_width, petal_length, petal_width):
    # Make a prediction
    input_data = np.array([[sepal_length, sepal_width, petal_length, petal_width]])
    cluster = kmeans.predict(input_data)[0]

    # Create a response with custom cluster names
    probabilities = {cluster_names[i]: 0.0 for i in range(kmeans.n_clusters)}
    probabilities[cluster_names[cluster]] = 1.0

    response = {
        'prediction': cluster_names[cluster],
        'probabilities': probabilities
    }

    # Return the prediction as JSON
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
