"""Gera uma ordem de serviço em PDF a partir da transcrição do áudio do chefe.

Uso:
    python scripts/manutencao/lista_de_tarefas.py [arquivo_enviado] [transcricao.txt]

O primeiro argumento é o nome do arquivo que o front enviou (hoje não é usado).
Sem o segundo, lê a transcrição de exemplo em data/exemplos/.
Imprime um JSON com o link do PDF, que a rota /api/UploadChefe lê.
"""
import json
import os
import sys
from pathlib import Path

import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from fpdf import FPDF
from openai import OpenAI

# Raiz do repositório, para o script funcionar de qualquer pasta.
ROOT = Path(__file__).resolve().parents[2]

# As chaves ficam no .env da raiz, nunca no código.
load_dotenv(ROOT / ".env")

SYSTEM_PROMPT = """
    Você é uma IA de auxilio para técnicos de manutenção. Você ira receber
    a transcrição de um audio que o técnico recebeu de seu chefe detalhando,
    grossamente, o que deve ser feito para uma dada ordem. Sua tarefa é gerar uma espécie
    de ordem de serviço de manutenção com uma lista de tarefas. Isso sera colocado em um pdf, use formatação apropriada

"""


def gerar_ordem(transcript: str) -> str:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": transcript},
        ],
    )
    return completion.choices[0].message.content


def create_pdf_with_fpdf(text: str, filename: Path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text)  # multi_cell quebra linhas longas
    pdf.output(str(filename))


def upload_pdf_to_cloudinary(file_path: Path) -> str:
    cloudinary.config(
        cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
        api_key=os.environ["CLOUDINARY_API_KEY"],
        api_secret=os.environ["CLOUDINARY_API_SECRET"],
        secure=True,
    )
    response = cloudinary.uploader.upload(
        str(file_path),
        resource_type="raw",
        folder="pdfs",
    )
    return response["url"]


def main():
    if len(sys.argv) > 2:
        transcript_path = Path(sys.argv[2])
    else:
        transcript_path = ROOT / "data" / "exemplos" / "instrucoes_chefe.txt"
    transcript = transcript_path.read_text(encoding="utf-8")

    # public/arquivos está no .gitignore, então o PDF gerado não suja o repositório.
    pdf_path = ROOT / "public" / "arquivos" / "ordem.pdf"
    create_pdf_with_fpdf(gerar_ordem(transcript), pdf_path)

    # json.dumps (e não print do dict) porque a rota do Next faz JSON.parse da saída.
    print(json.dumps({"link": upload_pdf_to_cloudinary(pdf_path)}))


if __name__ == "__main__":
    main()
