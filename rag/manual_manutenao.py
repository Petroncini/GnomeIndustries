# Cópia do script do hackathon (scripts/manutencao/manual_manutenao.py) com a
# LÓGICA INTACTA, inclusive o defeito, para ver o problema acontecer (Etapa 0).
# Só mudou o que era preciso para rodar:
#   1. caminhos apontando para rag/data/;
#   2. provedor OpenAI -> Gemini (modelo de chat e modelo de embedding);
#   3. imports atualizados para o LangChain 1.x, sem os que não eram usados;
#   4. embeddings em lotes e índice salvo em disco, por causa do limite do
#      plano grátis (ver abaixo).
import os

from langchain_google_genai import ChatGoogleGenerativeAI

api_key = os.getenv("GOOGLE_API_KEY")
os.environ["GOOGLE_API_KEY"] = api_key
print(api_key)



llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite")


DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

file = open(os.path.join(DATA, "transcricao.txt"), "r")
transcript = file.read()

from langchain_core.prompts import PromptTemplate
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = PyPDFLoader(os.path.join(DATA, "manual.pdf"))
docs = loader.load()

pages = loader.load_and_split()


text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

splits = text_splitter.split_documents(docs)

# Adaptação ao plano grátis do Gemini, que aceita 100 embeddings por minuto:
# os trechos entram no banco em lotes, com 1 minuto de pausa entre eles.
# No original era uma linha só: Chroma.from_documents(documents=splits, embedding=...).
# O índice fica salvo em rag/chroma/ para não refazer os embeddings (e gastar
# a cota) a cada execução. Para recriar, apague essa pasta.
import time
vectorstore = Chroma(
    embedding_function=GoogleGenerativeAIEmbeddings(model="gemini-embedding-001"),
    persist_directory=os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma"),
)
if not vectorstore.get(limit=1)["ids"]:
    LOTE = 50  # metade do limite, para sobrar folga
    for i in range(0, len(splits), LOTE):
        if i > 0:
            time.sleep(61)
        vectorstore.add_documents(splits[i:i + LOTE])
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
