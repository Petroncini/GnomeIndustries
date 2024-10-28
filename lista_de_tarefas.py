import os

from langchain_openai import ChatOpenAI

api_key = os.getenv("OPENAI_API_KEY")

from openai import OpenAI

client = OpenAI()

file = open("instrucoes_chefe.txt", "r")
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

print(completion.choices[0].message.content)


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
text = completion.choices[0].message.content
create_pdf_with_fpdf(text, "ordem.pdf")

