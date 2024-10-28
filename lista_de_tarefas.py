import os

from langchain_openai import ChatOpenAI

api_key = ""

from openai import OpenAI

client = OpenAI(api_key=api_key)

file_path = fr'{os.getcwd()}\public\arquivos\instrucoes_chefe.txt'

file = open(file_path, "r")
transcript = file.read()

system_prompt = """
    Você é uma IA de auxilio para técnicos de manutenção. Você ira receber
    a transcrição de um audio que o técnico recebeu de seu chefe detalhando,
    grossamente, o que deve ser feito para uma dada ordem. Sua tarefa é gerar uma espécie
    de ordem de serviço de manutenção com uma lista de tarefas. Isso sera colocado em um pdf, use formatação apropriada

"""

completion = client.chat.completions.create(
   model="gpt-3.5-turbo",
   messages=[
     {"role": "system", "content": system_prompt},
     {"role": "user", "content": f"{transcript}"}
   ]
 )

#print(completion.choices[0].message.content)


from fpdf import FPDF


def create_pdf_with_fpdf(text, filename):
    pdf = FPDF()
    pdf.add_page()
    
    # Set font and add text
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text)  # multi_cell wraps long text

    # Save the PDF
    pdf.output(filename)

# Example usage
file_path = "ordem.pdf"
text = completion.choices[0].message.content
create_pdf_with_fpdf(text, file_path)


import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

cloudinary.config( 
    cloud_name = "dwbz60u2o", 
    api_key = "138523466332567", 
    api_secret = "sZ07cVb_KVVD3IXEsBdFAEH6PWo", # Click 'View API Keys' above to copy your API secret
    secure=True
)



def upload_pdf_to_cloudinary(file_path):
    response = cloudinary.uploader.upload(
        file_path,
        resource_type="raw",
        folder="pdfs"  # Optional: specify a folder in Cloudinary
    )
    return response["url"]

response_dict = {
    "link": upload_pdf_to_cloudinary(file_path)
}
print(response_dict)


