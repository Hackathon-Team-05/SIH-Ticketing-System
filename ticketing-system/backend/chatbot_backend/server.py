import os
from Query import Query
from langchain_community.utilities import SQLDatabase
from langchain_cohere import ChatCohere
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import joblib
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

backend_port = 5000
os.environ['COHERE_API_KEY'] = 'V5POk06fbvq1UEYNDsOAwfSP7BoIP5dMZ5hoNA3k'
username = "sih2024"
password = "sih12345."
host = "sihdbconnection.cvu4owusgq3p.ap-south-1.rds.amazonaws.com"
port = 3306
database = "Travel_Chatbot"
db_url = f"mysql+mysqlconnector://{username}:{password}@{host}:{port}/{database}"
model_file = 'intent_classifier_model.pkl'
global db, query_handler

try:
    db = SQLDatabase.from_uri(db_url)
    db.run("SELECT 1")
    print("Connection to the database established successfully!")
except Exception as e:
    print(f"Error connecting to the database: {e}")

llm = ChatCohere()

app = Flask(__name__)
CORS(app)

if db:
    query_handler = Query(llm, db)


def load_training_data(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    texts = [entry["text"] for entry in data]
    intents = [entry["intent"] for entry in data]
    return texts, intents


def train_and_save_model():
    texts, intents = load_training_data('training_data.json')
    pipeline = Pipeline([
        ('vectorizer', CountVectorizer()),
        ('classifier', MultinomialNB())
    ])
    pipeline.fit(texts, intents)
    joblib.dump(pipeline, model_file)
    return pipeline


if os.path.exists(model_file):
    pipeline = joblib.load(model_file)
    print("Model loaded from file.")
else:
    pipeline = train_and_save_model()
    print("Model trained and saved to file.")


@app.route('/chat', methods=['POST'])
def api():
    data = request.get_json()
    user_query = data.get('message', '')
    print("USER_QUERY:" + user_query)
    result = query_handler.process_query(user_query)
    return jsonify({'response': result})


@app.route('/classify', methods=['POST'])
def classify_intent():
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        prediction = pipeline.predict([text])
        intent = prediction[0]

        return jsonify({'intent': intent}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=backend_port)
