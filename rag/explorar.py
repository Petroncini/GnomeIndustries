"""Roda o pipeline de RAG por partes e mostra o que entra e sai de cada uma.

Uso (com o ambiente rag/.venv ativo):
    python rag/explorar.py                          # pede a pergunta no terminal
    python rag/explorar.py "qual óleo usar no compressor?"

A leitura do PDF, o chunking e o índice estão em indice.py, que rag.py também usa.
"""
import math
import os
import sys

from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings

import indice

PDF = os.path.join(indice.PASTA, "data", "manual.pdf")
load_dotenv(os.path.join(indice.PASTA, ".env"))  # lê GOOGLE_API_KEY sem imprimir nada


def titulo(texto):
    print(f"\n{'=' * 70}\n{texto}\n{'=' * 70}")


def cosseno(a, b):
    # Produto escalar dividido pelo produto dos tamanhos dos vetores:
    # mede o ângulo entre eles, sem importar o comprimento.
    produto = sum(x * y for x, y in zip(a, b))
    tamanho_a = math.sqrt(sum(x * x for x in a))
    tamanho_b = math.sqrt(sum(y * y for y in b))
    return produto / (tamanho_a * tamanho_b)


# ---------------------------------------------------------------------------
titulo("1. CHUNKING: do PDF para trechos")

paginas = indice.carregar_paginas(PDF)
chunks = indice.dividir(paginas)

print(f"Páginas no PDF: {len(paginas)}")
print(f"Chunks gerados: {len(chunks)} (até {indice.CHUNK_SIZE} caracteres, "
      f"sobreposição de até {indice.CHUNK_OVERLAP})")

# ---------------------------------------------------------------------------
titulo("2. SOBREPOSIÇÃO: um chunk e o seguinte")

# Cada página é cortada separadamente, então só existe sobreposição entre
# chunks da MESMA página. Página 32: troca do elemento separador e do filtro de ar.
da_pagina = [c for c in chunks if c.metadata["pagina"] == 32]
atual, seguinte = da_pagina[0].page_content, da_pagina[1].page_content

# Maior final do chunk atual que é também o começo do seguinte.
repetido = next(
    (atual[-n:] for n in range(min(len(atual), len(seguinte)), 0, -1)
     if seguinte.startswith(atual[-n:])),
    "",
)

print(f"Chunk A ({len(atual)} caracteres), últimos 300:\n...{atual[-300:]}\n")
print(f"Chunk B ({len(seguinte)} caracteres), primeiros 300:\n{seguinte[:300]}...\n")
print(f"Texto repetido nos dois ({len(repetido)} caracteres):\n{repetido!r}")

# ---------------------------------------------------------------------------
titulo("3. EMBEDDING: de texto para vetor")

embeddings = GoogleGenerativeAIEmbeddings(model=indice.MODELO_EMBEDDING)
vetor = embeddings.embed_documents([atual])[0]

print(f"Entrada: o chunk A ({len(atual)} caracteres de texto)")
print(f"Saída: um vetor com {len(vetor)} números")
print("Primeiros 8 valores:", [round(v, 4) for v in vetor[:8]])

# ---------------------------------------------------------------------------
titulo("4. SIMILARIDADE DE COSSENO: o que é 'parecido' para o modelo")

frase = "Troque o filtro de ar do compressor."
parecida = "Substitua o elemento filtrante de ar da máquina."
sem_relacao = "O jogo de futebol terminou empatado."

# embed_query trata o texto como pergunta. O Gemini gera vetores um pouco
# diferentes para perguntas e para trechos de documento (isso volta na Etapa 4).
v_frase, v_parecida, v_sem_relacao = (
    embeddings.embed_query(t) for t in (frase, parecida, sem_relacao)
)

print(f"A: {frase}\nB: {parecida}\nC: {sem_relacao}\n")
print(f"cosseno(A, B) = {cosseno(v_frase, v_parecida):.3f}   <- mesmo sentido, outras palavras")
print(f"cosseno(A, C) = {cosseno(v_frase, v_sem_relacao):.3f}   <- sem relação")

# ---------------------------------------------------------------------------
titulo("5. BANCO VETORIAL + RETRIEVER: buscar trechos para uma pergunta")

banco = indice.abrir_indice(PDF)  # reaproveita rag/chroma/; cria se não existir
print(f"Trechos no banco: {len(banco.get()['ids'])}")

retriever = banco.as_retriever(search_kwargs={"k": 4})

pergunta = " ".join(sys.argv[1:]) or input("\nDigite uma pergunta sobre o manual: ")
trechos = retriever.invoke(pergunta)

print(f"\nPergunta: {pergunta}\nO retriever devolveu {len(trechos)} trechos (k=4):")
for n, doc in enumerate(trechos, start=1):
    print(f"\n--- trecho {n} | página {doc.metadata['pagina']} do PDF ---")
    print(doc.page_content[:400] + ("..." if len(doc.page_content) > 400 else ""))
