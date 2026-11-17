Arquivos que o RAG lê:

- `manual.pdf`: *Doosan 7/72 – Manual de Operação e Conservação* (compressor portátil
  de parafuso, 82 páginas, português de Portugal). **Não vai para o git**, porque o
  manual proíbe reprodução sem autorização. Baixe e salve com este nome:

  ```bash
  curl -L -o rag/data/manual.pdf "https://dealers.doosanportablepower.com/emea/documents/Service/01_Portable%20Compressors/Compressor%20Manuals/04a_7-72/46635522-A-PT-09-13-OM-772.pdf"
  ```

- `transcricao.txt`: transcrição **sintética**, escrita para este projeto, imitando o
  áudio de um vídeo de instrução (troca do elemento separador de óleo e do filtro de ar
  do 7/72). Ela omite de propósito detalhes que só existem no manual (torques, tipo e
  quantidade de óleo, avisos específicos), para dar para ver quando a resposta usou o manual.
