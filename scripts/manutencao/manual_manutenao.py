import os

from langchain_openai import ChatOpenAI

api_key = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = api_key
print(api_key)



from openai import OpenAI

llm = ChatOpenAI(model="gpt-3.5-turbo")


file = open("full_transcript.txt", "r")
transcript = file.read()

import bs4
from langchain import hub
from langchain.prompts import PromptTemplate
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = PyPDFLoader("manual.pdf")
docs = loader.load()

pages = loader.load_and_split()


text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

splits = text_splitter.split_documents(docs)

vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings())
retriever = vectorstore.as_retriever()

prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template= """Você é um assistente pessoal desenvolvido para auxiliar técnicos de manutenção de fábrica em seu dia a dia.
Você receberá um a transcrição de um vídeo tutorial para a manutenção de uma máquina.
Sua tarefa é criar um passo a passo EM PORTUGUÊS detalhado de manutenção, dando atenção especial para a segurança do trabalhador. Além disso 
você recebera um contexto baseado no manual de intruções da máquina em questão

Contexto do manual de instruções:
{context}

Transcrição do video de intrução:
{question}
"""
,
)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Step-by-step setup for chaining with correct syntax:
context_pipe = retriever | format_docs
question_pipe = RunnablePassthrough()

# Define the complete pipeline manually
rag_chain = {
    "context": context_pipe,
    "question": transcript
}

# Now, call llm with the template and parse the output
template_pipe = prompt_template | llm | StrOutputParser()

response = template_pipe.invoke(rag_chain)
print(response)

# completion = client.chat.completions.create(
#    model="gpt-3.5-turbo",
#    messages=[
#      {"role": "system", "content": system_prompt},
#      {"role": "user", "content": f"{transcript}"}
#    ]
#  )
#
# print(completion.choices[0].message.content)
#
