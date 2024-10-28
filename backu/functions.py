import pytesseract
from pytesseract import Output
from pdf2image import convert_from_path
from PIL import Image
import os
import re
import sys
import json

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'


#FUNÇÃO PARA REMOVER OS CARACTERES INDESEJADOS
def rreplace(string: str, find: str, replace: str, n_occurences: int) -> str:
    """
    Given a `string`, `find` and `replace` the first `n_occurences`
    found from the right of the string.
    """
    temp = string.rsplit(find, n_occurences)
    return replace.join(temp)

#FUNÇÃO PARA CHECAR SE TODOS OS ELEMENTOS DA LISTA SÃO IGUAIS
def check(l):
    if(len(l) < 0):
        r = True
    r = all(ele == l[0] for ele in l)

    if(r):
        return True

    else:
        return False


#FUNÇÃO PARA ACHAR A DATA DE VENCIMENTO
def get_due_date(arq):
    #Padrão da data para o re
    date_pattern = "^[0-9]{1,2}\\/[0-9]{1,2}\\/[0-9]{2,4}$"

    # TRANSFORMAR PDF EM IMG
    if arq.endswith('.pdf'):
        bill = arq.replace('pdf', 'png')
        lista = convert_from_path(arq)
        page = lista[0]
        page.save(os.path.join(os.getcwd(), bill), 'png')
    else:
        bill = arq
    

    #Lendo a Imagem
    img = Image.open(bill)

    #Usando o OCR
    try:
        img_data = pytesseract.image_to_data(img, output_type=Output.DICT, lang='por')
    except:
        os.remove(bill)
        return None

    #Limpando a lista de palavras
    img_data['text'] = [x for x in img_data['text'] if x!='' and x!=' ']

    #Achando a Data pelo Metodo 1 ('in')
    dates = []
    for i, word in enumerate(img_data['text']):
        #Achando a palavra 'Vencimento'
        if 'Vencimento' in word or 'vencimento' in word or 'Vencinento' in word or 'vencinento' in word:
            #Buscando pela Data a partir da palavra 'Vencimento'
            for wor in img_data['text'][i:]:
                if re.match(date_pattern, wor) != None:
                    dates.append(wor)
                    break

    # Achando a Data pelo Metodo 2 ('==')
    if not check(dates) or dates==[]:
        dates = []
        for i, word in enumerate(img_data['text']):
            # Achando a palavra 'Vencimento'
            if 'Vencimento' == word or 'vencimento' == word or 'Vencinento' == word or 'vencinento' == word:
                # Buscando pela Data a partir da palavra 'Vencimento'
                for wor in img_data['text'][i:]:
                    if re.match(date_pattern, wor) != None:
                        dates.append(wor)
                        break

    #Removendo o arquivo de img criado
    os.remove(bill)

    #Checando se a Data é válida
    if check(dates) and dates!=[]:
        return dates[0]
    else:
        return 'ERROR-DATE'






#FUNÇÃO PARA EXTRAIR A MAIOR SEQUENCIA NUMERICA DE UMA STRING
def mar(string):
    number_s = re.findall(pattern='[0-9]+', string=string)
    len_a = [len(x) for x in number_s]
    ma = str(number_s[len_a.index(max(len_a))])
    return ma



#FUNÇÃO PARA PEGAR O SERIAL CODE
def get_scd(text):
    #FORMATANDO O TEXTO
    lista = text.split('\n')

    text2 = text

    #ACHANDO A LINHA DA SERIAL CODE
    #Maior sequencia numerica do boleto
    ma_l = mar(text2)

    #Achando a linha com a maior sequencia numerica do boleto
    linha = ''
    for line in text2.split('\n'):
        if ma_l in line:
            linha = line

    #FORMATANDO A LINHA
    l = rreplace(string=linha, find='.', replace='', n_occurences=linha.count('.'))
    for elem in [' ', "'", '"', '-', '_', '/']:
        l = rreplace(string=l, find=elem, replace='', n_occurences=linha.count(elem))

    #PEGANDO O CODIGO DA LINHA
    scd = mar(l)
    #print(f'{l}\n{scd}\n-------')

    #CONFERINDO O RESULTADO -- TODE SERIAL CODE TEM 47 OU 48 CARACTERES
    if (len(scd) != 47 and len(scd) != 48):
        t = text2
        while len(scd) != 47 and len(scd) != 48:
            # TIRANDO A LINHA INDESEJADA
            t = rreplace(string=t, find=linha, replace='', n_occurences=1)

            # DEVOLVENDO O VALOR CORRIGIDO
            scd = get_scd(t)

    #DEVOLVENDO O VALOR
    return scd


def get_scd_of_any(arq):
    #TRANSFORMAR PDF EM IMG
    if arq.endswith('.pdf'):
        bill = arq.replace('pdf', 'png')
        lista = convert_from_path(arq)
        page = lista[0]
        page.save(os.path.join(os.getcwd(), bill), 'png')
    else:
        bill = arq
    

    #EXTRAIR O TEXTO DO ARQUIVO
    try:
        try:
            myconfig = r'--psm 11 --oem 3'
            text = pytesseract.image_to_string(Image.open(bill), config=myconfig)
            l_text = text.split('\n')
            l_text = [l for l in l_text if l != '']
            text = '\n'.join(l_text)
            scd = get_scd(text)
        except:
            #print('-='*30)
            myconfig = r'--psm 6 --oem 3'
            text = pytesseract.image_to_string(Image.open(bill), config=myconfig)
            l_text = text.split('\n')
            l_text = [l for l in l_text if l != '']
            text = '\n'.join(l_text)
            scd = get_scd(text)
    except:
        try:
            myconfig = r'--psm 11 --oem 3'
            text = pytesseract.image_to_string(Image.open(bill), config=myconfig)
            try:
                l_text = text.split('\n')
                l_text = [l for l in l_text if l != '']
                text = '\n'.join(l_text)
                scd = get_scd(text)
            except:
                scd = 'Error -- scd'
        except:
            #print('-='*30)
            myconfig = r'--psm 6 --oem 3'
            text = pytesseract.image_to_string(Image.open(bill), config=myconfig)
            try:
                l_text = text.split('\n')
                l_text = [l for l in l_text if l != '']
                text = '\n'.join(l_text)
                scd = get_scd(text)
            except:
                scd = 'Error -- scd'

    #EXCLUINDO O ARQIVO CRIADO
    #os.remove(bill)

    #RETORNANDO O SCD
    return scd




#FUNÇÃO PARA ACHAR O VALOR TOTAL
def get_total(arq):

    value_pattern = "^[0-9]+.{1,25}\\,[0-9]{1,2}$"

    # TRANSFORMAR PDF EM IMG
    if arq.endswith('.pdf'):
        bill = arq.replace('pdf', 'png')
        lista = convert_from_path(arq)
        page = lista[0]
        page.save(os.path.join(os.getcwd(), bill), 'png')
    else:
        bill = arq
    

    #Lendo a Imagem
    img = Image.open(bill)

    #Usando o OCR
    try:
        img_data = pytesseract.image_to_data(img, output_type=Output.DICT, lang='por')
    except:
        os.remove(bill)
        return None

    #Limpando a lista de palavras
    img_data['text'] = [x for x in img_data['text'] if x!='' and x!=' ']

    valores = []
    #Achando o Valor pelo Metodo 1
    for i, word in enumerate(img_data['text']):
        # Achando a palavra 'Vencimento'
        if ('Valor' in word) or ('valor' in word):
            # Buscando pela Data a partir da palavra 'Vencimento'
            for wor in img_data['text'][i + 1:]:
                if re.match(value_pattern, wor) != None:
                    valores.append(wor)
                    break

    #print(f'1-  {valores}')

    # Achando a Data pelo Metodo 2
    if not check(valores) or valores==[]:
        valores = []
        for i, word in enumerate(img_data['text']):
            # Achando a palavra 'Vencimento'
            if ('Pagar' in word) or ('pagar' in word) or ('Cobrado' in word) or ('cobrado' in word):
                # Buscando pela Data a partir da palavra 'Vencimento'
                for wor in img_data['text'][i + 1:]:
                    if re.match(value_pattern, wor) != None:
                        valores.append(wor)
                        break
        #print(f'2-  {valores}')

    #Removendo o arquivo de img criado
    os.remove(bill)

    #Checando se a Data é válida
    if check(valores) and valores!=[]:
        return valores[0]
    else:
        vn = [rreplace(string=x, find='.', replace='', n_occurences=x.count('.')) for x in valores]
        vn = [rreplace(string=x, find=',', replace='.', n_occurences=x.count(',')) for x in vn]
        vn = rreplace(string="{0:,.2f}".format(max([float(x) for x in vn])).replace(',','.'), find='.', replace=',', n_occurences=1)
        return vn

