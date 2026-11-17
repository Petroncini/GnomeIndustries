# GnomeIndustries

Assistente para técnicos de manutenção industrial, criado no hackathon da Tractian (out/2024).
A partir do áudio de instruções do chefe e do manual da máquina, o projeto gera ordens de
serviço e passo a passos de manutenção.

## Estrutura

```
app/            Front-end Next.js (páginas, rotas de API e app/lib com banco e autenticação)
components/     Componentes React
constants/      Constantes do front
types/          Tipos TypeScript
utils/          Funções auxiliares do front
public/         Arquivos estáticos; public/arquivos recebe os uploads (fora do git)
scripts/        Scripts Python
  manutencao/   Ordem de serviço (lista_de_tarefas.py) e RAG do manual (manual_manutenao.py)
  transcricao/  Transcrição de áudio e vídeo com Whisper (transcribe.py)
  boletos/      OCR de boletos (analisador.py, functions.py)
models/         Modelo do Whisper (Git LFS)
data/exemplos/  Áudio e transcrição de exemplo
```

## Como rodar

Copie `.env.example` para `.env` e preencha as chaves.

Front-end:

```bash
npm install
npm run dev
```

Scripts Python:

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r scripts/requirements.txt
python scripts/transcricao/transcribe.py data/exemplos/instrucoes_chefe.mp3 saida.txt
python scripts/manutencao/lista_de_tarefas.py
```
