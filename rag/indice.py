"""Leitura do PDF, chunking e índice vetorial, compartilhados pelos scripts do rag/.

Fica num lugar só para que explorar.py, rag.py e a avaliação usem exatamente
os mesmos trechos: se cada um cortasse o manual de um jeito, os resultados
não seriam comparáveis.
"""
import os
import time

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader

PASTA = os.path.dirname(os.path.abspath(__file__))
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
MODELO_EMBEDDING = "gemini-embedding-001"

# Plano grátis do Gemini: 100 embeddings por minuto, e cada trecho conta.
LOTE = 50
PAUSA_SEGUNDOS = 61


def carregar_paginas(caminho_pdf):
    """Lê o PDF: um Document por página."""
    return [
        # "pagina" começa em 1, igual ao leitor de PDF, para não ter que somar 1 depois.
        Document(page_content=(p.extract_text() or "").strip(), metadata={"pagina": n})
        for n, p in enumerate(PdfReader(caminho_pdf).pages, start=1)
    ]


def dividir(paginas):
    """Corta cada página em trechos. Não há sobreposição entre páginas diferentes."""
    splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
    return splitter.split_documents(paginas)


def carregar_chunks(caminho_pdf):
    return dividir(carregar_paginas(caminho_pdf))


def abrir_indice(caminho_pdf):
    """Abre o índice salvo em rag/chroma/; se ainda não existir, cria (uns 4 minutos)."""
    # Uma coleção por PDF e por modelo de embedding, para nunca misturar vetores
    # de documentos ou de modelos diferentes (isso volta na Etapa 4).
    nome_pdf = os.path.splitext(os.path.basename(caminho_pdf))[0]
    banco = Chroma(
        collection_name=f"{nome_pdf}-{MODELO_EMBEDDING}",
        embedding_function=GoogleGenerativeAIEmbeddings(model=MODELO_EMBEDDING),
        persist_directory=os.path.join(PASTA, "chroma"),
    )
    if not banco.get(limit=1)["ids"]:
        chunks = carregar_chunks(caminho_pdf)
        print(f"Criando o índice: {len(chunks)} trechos, em lotes de {LOTE} por minuto...")
        for i in range(0, len(chunks), LOTE):
            if i > 0:
                time.sleep(PAUSA_SEGUNDOS)
            banco.add_documents(chunks[i:i + LOTE])
            print(f"  {min(i + LOTE, len(chunks))}/{len(chunks)}")
    return banco
