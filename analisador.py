from functions import get_scd_of_any
from functions import get_total
from functions import get_due_date


import os
import sys
import json
from io import StringIO


#ANALISANDO O ARQUIVO
file_name = sys.argv[1]
#file_path = f"C:/Users/nicol/OneDrive/Documentos/JS/Projects/inovdrop/public/arquivos/{file_name}"
file_path = fr'{os.getcwd()}\public\arquivos\{file_name}'


output = {
    'scd': f'{get_scd_of_any(file_path)}',
    'due_date': f'{get_due_date(file_path)}',
    'total': f'{get_total(file_path)}'
}

os.remove(file_path)

print(json.dumps(output))

sys.stdout.flush()