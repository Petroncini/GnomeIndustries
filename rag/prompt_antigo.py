"""Mostra o prompt que o código do hackathon montava, sem chamar o modelo de chat.

Uso:
    python rag/prompt_antigo.py
"""
import os

from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate

import indice

load_dotenv(os.path.join(indice.PASTA, ".env"))

# Mesmo template e mesma montagem do script original (rag/manual_manutenao.py).
prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""Você é um assistente pessoal desenvolvido para auxiliar técnicos de manutenção de fábrica em seu dia a dia.
Você receberá um a transcrição de um vídeo tutorial para a manutenção de uma máquina.
Sua tarefa é criar um passo a passo EM PORTUGUÊS detalhado de manutenção, dando atenção especial para a segurança do trabalhador. Além disso
você recebera um contexto baseado no manual de intruções da máquina em questão

Contexto do manual de instruções:
{context}

Transcrição do video de intrução:
{question}
""",
)


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


retriever = indice.abrir_indice(os.path.join(indice.PASTA, "data", "manual.pdf")).as_retriever()
with open(os.path.join(indice.PASTA, "data", "transcricao.txt"), encoding="utf-8") as f:
    transcript = f.read()

# O defeito: o dicionário é passado como DADO para o prompt, fora da chain.
rag_chain = {"context": retriever | format_docs, "question": transcript}
prompt_final = prompt_template.invoke(rag_chain).to_string()

# Imprime só até o começo da transcrição, que é a parte que interessa.
print(prompt_final.split("Transcrição do video de intrução:")[0])
print("Transcrição do video de intrução:\n(... a transcrição inteira, sem mudanças ...)")
