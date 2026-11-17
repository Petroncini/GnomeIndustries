"""Extrai código de barras, vencimento e total de um boleto em public/arquivos.

Uso:
    python scripts/boletos/analisador.py <nome_do_arquivo>

Imprime um JSON com os três campos e apaga o arquivo analisado.
"""
import json
import os
import sys
from pathlib import Path

from functions import get_due_date, get_scd_of_any, get_total

# Raiz do repositório, para o script funcionar de qualquer pasta.
ROOT = Path(__file__).resolve().parents[2]

file_name = sys.argv[1]
file_path = str(ROOT / "public" / "arquivos" / file_name)

output = {
    'scd': f'{get_scd_of_any(file_path)}',
    'due_date': f'{get_due_date(file_path)}',
    'total': f'{get_total(file_path)}'
}

os.remove(file_path)

print(json.dumps(output))

sys.stdout.flush()
