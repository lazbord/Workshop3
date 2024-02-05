# Import necessary libraries
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.datasets import load_iris

# Load Iris dataset
iris = load_iris()
X = iris.data
y = iris.target

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a Random Forest Classifier
rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the model
rf_classifier.fit(X_train, y_train)

# Make predictions and get probability estimates on the test set
y_pred = rf_classifier.predict(X_test)
y_pred_proba = rf_classifier.predict_proba(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
class_report = classification_report(y_test, y_pred)

# Display probabilities for each prediction
for i, proba in enumerate(y_pred_proba):
    print(f"\nSample {i + 1} - Predicted Class: {y_pred[i]}")
    for class_idx, class_proba in enumerate(proba):
        print(f"   Class {class_idx}: {class_proba:.4f}")


# Display the results
print(f"Accuracy: {accuracy:.2f}")
print("\nConfusion Matrix:")
print(conf_matrix)
print("\nClassification Report:")
print(class_report)

from flask import Flask, request, jsonify
app = Flask(__name__)


@app.route('/predict/<float:sepal_length>/<float:sepal_width>/<float:petal_length>/<float:petal_width>',
           methods=['GET'])
def predict(sepal_length, sepal_width, petal_length, petal_width):
    # Make a prediction
    input_data = np.array([[sepal_length, sepal_width, petal_length, petal_width]])
    prediction = rf_classifier.predict(input_data)[0]
    class_name = iris.target_names[prediction]
    probabilities = rf_classifier.predict_proba(input_data)

    # Convert class names to strings for better JSON representation
    class_names_str = [str(class_name) for class_name in iris.target_names]

    response = {
        'prediction': class_name,
        'probabilities': {class_names_str[i]: proba for i, proba in enumerate(probabilities[0])}
    }
    # Return the prediction as JSON
    return jsonify(response)


if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)