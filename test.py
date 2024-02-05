from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn import datasets
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import numpy as np

# Load Iris dataset
iris = datasets.load_iris()
X = iris.data
y = iris.target

# Encode target labels (optional)
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Apply k-means clustering
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X_train)

# Predict the clusters for the test set
y_pred = kmeans.predict(X_test)

# Map cluster labels to original class labels
cluster_to_class_mapping = {cluster: np.argmax(np.bincount(y_train[kmeans.labels_ == cluster])) for cluster in range(3)}
y_pred_mapped = np.array([cluster_to_class_mapping[cluster] for cluster in y_pred])

# Evaluate accuracy
accuracy = accuracy_score(y_test, y_pred_mapped)
print(f'Accuracy: {accuracy * 100:.2f}%')

# Apply PCA for visualization (reduce data to 2D)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Apply k-means clustering on the 2D data
kmeans_2d = KMeans(n_clusters=3, random_state=42)
kmeans_2d.fit(X_pca)

# Predict the clusters for the original data
y_pred_2d = kmeans_2d.predict(X_pca)

# Plot the clusters
plt.figure(figsize=(12, 6))

# Plot the actual class labels
plt.subplot(1, 2, 1)
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', edgecolor='k', s=50)
plt.title('Actual Class Labels')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')

# Plot the k-means clustering results
plt.subplot(1, 2, 2)
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y_pred_2d, cmap='viridis', edgecolor='k', s=50)
plt.scatter(kmeans_2d.cluster_centers_[:, 0], kmeans_2d.cluster_centers_[:, 1], marker='X', s=200, c='red', label='Centroids')
plt.title('K-Means Clustering Results')
plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.legend()

plt.show()
