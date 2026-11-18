"""Gera um passo a passo de manutenção a partir da transcrição de um vídeo,
completado com trechos do manual da máquina (RAG).

Uso (com o ambiente rag/.venv ativo):
    python rag/rag.py                                  # manual e transcrição de rag/data/
    python rag/rag.py --pdf outro.pdf --transcricao outra.txt
    python rag/rag.py --sem-rag                        # só a transcrição, sem o manual
    python rag/rag.py --mostrar-prompt                 # imprime o prompt e sai
    python rag/rag.py --saida rag/exemplos/x.md        # também salva a resposta
"""
import argparse
import os
from datetime import date

from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI

import indice

load_dotenv(os.path.join(indice.PASTA, ".env"))  # lê GOOGLE_API_KEY sem imprimir

# Padrão: o modelo que respondeu de forma estável no plano grátis (nov/2026).
# Os Gemini Flash maiores estavam devolvendo 503 (sobrecarga). Troque com --modelo.
MODELO_CHAT = "gemini-3.5-flash-lite"
K = 4  # quantos trechos do manual entram no prompt

INSTRUCOES = """Você é um assistente pessoal desenvolvido para auxiliar técnicos de manutenção de fábrica no dia a dia.
Você vai receber a transcrição de um vídeo tutorial de manutenção de uma máquina.
Sua tarefa é criar um passo a passo detalhado de manutenção, EM PORTUGUÊS, com atenção especial à segurança do trabalhador."""

PROMPT_COM_RAG = PromptTemplate.from_template(INSTRUCOES + """
Além disso, você vai receber trechos do manual de instruções da máquina. Quando usar uma informação do manual, indique a página entre colchetes, por exemplo [página 32].

Trechos do manual de instruções:
{context}

Transcrição do vídeo de instrução:
{question}
""")

# Mesmas instruções, sem o manual: serve de comparação para ver o efeito do RAG.
PROMPT_SEM_RAG = PromptTemplate.from_template(INSTRUCOES + """

Transcrição do vídeo de instrução:
{question}
""")


def formatar_trechos(docs):
    # A página vai junto do texto para o modelo poder citar de onde tirou cada informação.
    return "\n\n".join(f"[página {d.metadata['pagina']}]\n{d.page_content}" for d in docs)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--pdf", default=os.path.join(indice.PASTA, "data", "manual.pdf"))
    parser.add_argument("--transcricao", default=os.path.join(indice.PASTA, "data", "transcricao.txt"))
    parser.add_argument("--sem-rag", action="store_true", help="responde só com a transcrição")
    parser.add_argument("--modelo", default=MODELO_CHAT)
    parser.add_argument("--mostrar-prompt", action="store_true", help="imprime o prompt final e sai, sem chamar o modelo de chat")
    parser.add_argument("--saida", help="arquivo .md onde salvar a resposta")
    args = parser.parse_args()

    with open(args.transcricao, encoding="utf-8") as f:
        transcricao = f.read()

    trechos = []
    if args.sem_rag:
        entrada = {"question": RunnablePassthrough()}
        prompt = PROMPT_SEM_RAG
    else:
        retriever = indice.abrir_indice(args.pdf).as_retriever(search_kwargs={"k": K})

        # Busca só para mostrar o que foi recuperado; a chain abaixo refaz a mesma busca.
        trechos = retriever.invoke(transcricao)
        print(f"Trechos recuperados (k={K}):")
        for n, d in enumerate(trechos, start=1):
            print(f"\n--- trecho {n} | página {d.metadata['pagina']} ---\n{d.page_content[:300]}...")
        print()

        # A CORREÇÃO: o dicionário agora é a primeira etapa da chain. Quando a chain
        # roda, ele recebe a transcrição, executa o retriever com ela e entrega ao
        # prompt o TEXTO dos trechos ("context") e a própria transcrição ("question").
        entrada = {"context": retriever | formatar_trechos, "question": RunnablePassthrough()}
        prompt = PROMPT_COM_RAG

    if args.mostrar_prompt:
        print((entrada | prompt).invoke(transcricao).to_string())
        return

    llm = ChatGoogleGenerativeAI(model=args.modelo)
    rag_chain = entrada | prompt | llm | StrOutputParser()
    resposta = rag_chain.invoke(transcricao)
    print(resposta)

    if args.saida:
        salvar(args, trechos, resposta)


def salvar(args, trechos, resposta):
    modo = "sem RAG (só a transcrição)" if args.sem_rag else f"com RAG (k={K})"
    paginas = ", ".join(str(d.metadata["pagina"]) for d in trechos) or "nenhuma"
    with open(args.saida, "w", encoding="utf-8") as f:
        f.write(f"""<!--
Gerado por rag/rag.py em {date.today().isoformat()}. A resposta muda a cada execução.
Modo: {modo}
Modelo de chat: {args.modelo} | Embedding: {indice.MODELO_EMBEDDING}
PDF: {os.path.basename(args.pdf)} | Transcrição: {os.path.basename(args.transcricao)}
Páginas dos trechos recuperados: {paginas}
-->

{resposta}
""")
    print(f"\n(salvo em {args.saida})")


if __name__ == "__main__":
    main()
