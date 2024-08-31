from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough


class Query:
    def __init__(self, llm, db):
        self.llm = llm
        self.db = db

    def get_schema(self, _):
        return self.db.get_table_info()

    def run_query(self, query):
        clean_query = query.strip().strip('```sql').strip('```')
        return self.db.run(clean_query)

    def process_query(self, user_query):
        sql_prompt_raw = """
        You are a professional ticket booking AI Chatbot for booking museums tickets for country india.
        You have to answer user's queries and provide relevant information to help them. 

        Based on the table schema below, write a SQL query that would answer the user's question.
        You are not allowed to insert any data in the SQL database.
        You are allowed to read any data from the SQL database.
        Output only the SQL query without any additional text.

        Schema:
        {schema}

        Question: {question}
        SQL Query:
        """
        sql_prompt = ChatPromptTemplate.from_template(sql_prompt_raw)
        formatted_sql_prompt = sql_prompt.format(schema=self.get_schema, question=user_query)

        sql_chain = (
                RunnablePassthrough.assign(schema=self.get_schema)
                | sql_prompt | self.llm
                | StrOutputParser()
        )

        response_prompt_raw = """
        Based on the table schema below, question, SQL query, and SQL response, write a natural language response.
        You are not allowed to insert any data in the SQL database.
        You are allowed to read any data from the SQL database.
        Output only the natural language response without any additional text.

        Schema:
        {schema}

        Question: {question}
        SQL Query: {query}
        SQL Response: {response}
        Natural Language Response:
        """
        response_prompt = ChatPromptTemplate.from_template(response_prompt_raw)

        full_chain = (
                RunnablePassthrough.assign(query=sql_chain).assign(
                    schema=self.get_schema, response=lambda variables: self.run_query(variables["query"]))
                | response_prompt | self.llm | StrOutputParser()
        )

        return full_chain.invoke({"question": user_query})
