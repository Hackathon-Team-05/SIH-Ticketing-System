import os
from Query import Query
from langchain_community.utilities import SQLDatabase
from langchain_cohere import ChatCohere
from flask import Flask, jsonify, request
from flask_cors import CORS

os.environ[
    'COHERE_API_KEY'] = 'WxPWfSIHVASNIFMlfnLMrViai4iKklvMl1jvfVu5'
db_url = 'sqlite:///../heritage_culture_data/heritage_culture.db'

llm = ChatCohere()

app = Flask(__name__)
CORS(app)


@app.route('/chat', methods=['POST'])
def api():
    data = request.get_json()

    user_query = data.get('message', '')
    print("USER_QUERY:"+user_query)
    db = SQLDatabase.from_uri(db_url)
    query_handler = Query(llm, db)

    result = query_handler.process_query(user_query)

    return jsonify({'response': result})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
