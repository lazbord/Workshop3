from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from flask import Flask, jsonify
import numpy as np
import pickle



# Load the iris dataset
iris = load_iris()
X = iris.data
y = iris.target

# Split the dataset into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

# Create and train the Decision Tree model
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Predict and evaluate the model
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
accuracy 


# Save the trained model
with open('iris_model.pkl', 'wb') as file:
    pickle.dump(model, file)



# Load the trained Decision Tree model
with open('iris_model.pkl', 'rb') as file:
    dt_classifier = pickle.load(file)

app = Flask(__name__)

@app.route('/predict/<float:sepal_length>/<float:sepal_width>/<float:petal_length>/<float:petal_width>', methods=['GET'])
def predict(sepal_length, sepal_width, petal_length, petal_width):
    # Prepare input data
    input_data = np.array([[sepal_length, sepal_width, petal_length, petal_width]])

    # Make a prediction using the Decision Tree model
    prediction = dt_classifier.predict(input_data)[0]
    probabilities = dt_classifier.predict_proba(input_data)

    
    class_name = iris.target_names[prediction]
    probabilities = dt_classifier.predict_proba(input_data)

    # Convert class names to strings for better JSON representation
    class_names_str = [str(class_name) for class_name in iris.target_names]

    response = {
        'prediction': class_name,
        'probabilities': {class_names_str[i]: proba for i, proba in enumerate(probabilities[0])}
    }
    # Return the prediction as JSON
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)


