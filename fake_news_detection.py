import pandas as pd
import numpy as np
import re
import string
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# 🔹 Step 1: Load Datasets
true_news = pd.read_csv("True.csv")
fake_news = pd.read_csv("Fake.csv")

# Add Labels (1 = True, 0 = Fake)
true_news["label"] = 1
fake_news["label"] = 0

# Combine both datasets
df = pd.concat([true_news, fake_news], ignore_index=True)
df = df.sample(frac=1).reset_index(drop=True)  # Shuffle dataset

# 🔹 Step 2: Preprocess Text Data
def clean_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'\[.*?\]', '', text)  # Remove square brackets
    text = re.sub(r'https?://\S+|www\.\S+', '', text)  # Remove URLs
    text = re.sub(r'<.*?>+', '', text)  # Remove HTML tags
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)  # Remove punctuation
    text = re.sub(r'\n', '', text)  # Remove new lines
    text = re.sub(r'\w*\d\w*', '', text)  # Remove words containing numbers
    return text

df["text"] = df["title"] + " " + df["text"]  # Combine title and article
df["text"] = df["text"].apply(clean_text)  # Apply cleaning

# 🔹 Step 3: Convert Text to TF-IDF Features
vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
X = vectorizer.fit_transform(df["text"])
y = df["label"]

# 🔹 Step 4: Split Data (80% Train, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 🔹 Step 5: Train Logistic Regression Model
model = LogisticRegression()
model.fit(X_train, y_train)

# 🔹 Step 6: Evaluate Model
y_pred = model.predict(X_test)
print("🔹 Model Accuracy:", accuracy_score(y_test, y_pred))
print("\n🔹 Classification Report:\n", classification_report(y_test, y_pred))

# 🔹 Step 7: Test with a New Example
def predict_news(news_text):
    news_text = clean_text(news_text)  # Clean text
    vectorized_text = vectorizer.transform([news_text])  # Convert to TF-IDF
    prediction = model.predict(vectorized_text)  # Predict
    return "📰 True News" if prediction[0] == 1 else "⚠️ Fake News"

# Example Test
sample_news = "sends Trump stopgap spending bill"
print("Prediction:", predict_news(sample_news))
