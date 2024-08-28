import os
from Query import Query
from langchain_community.utilities import SQLDatabase
from langchain_cohere import ChatCohere
from flask import Flask, jsonify, request
from flask_cors import CORS

backend_port = 5000
os.environ[
    'COHERE_API_KEY'] = 'WxPWfSIHVASNIFMlfnLMrViai4iKklvMl1jvfVu5'
username = "sih2024"
password = "sih12345."
host = "sihdbconnection.cvu4owusgq3p.ap-south-1.rds.amazonaws.com"
port = 3306
database = "Travel_Chatbot"
db_url = f"mysql+mysqlconnector://{username}:{password}@{host}:{port}/{database}"
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


@app.route('/chat', methods=['POST'])
def api():
    data = request.get_json()

    user_query = data.get('message', '')
    print("USER_QUERY:" + user_query)

    result = query_handler.process_query(user_query)

    return jsonify({'response': result})


if __name__ == '__main__':
    app.run(debug=True, port=backend_port)
