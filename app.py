import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from flask import Flask, request, jsonify


iris = load_iris()
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Same model as Paul Lacoutiere but with different parameters
rf_classifier = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

rf_classifier.fit(X_train, y_train)

app = Flask(__name__)


@app.route('/predict/<float:sepal_length>/<float:sepal_width>/<float:petal_length>/<float:petal_width>',
           methods=['GET'])
def predict(sepal_length, sepal_width, petal_length, petal_width):
    input_data = np.array([[sepal_length, sepal_width, petal_length, petal_width]])
    prediction = rf_classifier.predict(input_data)[0]
    class_name = iris.target_names[prediction]
    probabilities = rf_classifier.predict_proba(input_data)

    class_names_str = [str(class_name) for class_name in iris.target_names]

    response = {
        'prediction': class_name,
        'probabilities': {class_names_str[i]: proba for i, proba in enumerate(probabilities[0])}
    }
    return jsonify(response)


if __name__ == '__main__':
    # Run the Flask app
    app.run(port=5000)
