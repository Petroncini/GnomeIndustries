'use server'

import { writeFile } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';
import { NextResponse } from 'next/server';




export const POST = async (req: Request, res: Response) => {
    if (req.method === 'POST') {
        try {
        // Extract data from the request
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        // Check if a file was uploaded
        if (!file) {
            console.log('No file uploaded');
            return NextResponse.json({message: 'No file uploaded'})
        }



        // Perform file upload logic (similar to your existing upload function)
        //TRANSFORMANDO O TIPO 'File' EM TIPO 'ArrayBuffer'
        const bytes = await file.arrayBuffer()

        //PEGANDO O 'Buffer' DO 'ArrayBuffer' PARA CONSEGUIR SER LIDO PELA FUNÇÃO 'writeFile'
        const buffer = Buffer.from(bytes)

        //CAMINHO ONDE O ARQUIVO SERÁ SALVO
        const path = join(process.cwd(), '/', 'public', '/', 'arquivos', file.name)

        //FUNÇÃO PARA SALVAR O ARQUIVO NA PASTA
        await writeFile(path, buffer)
        //console.log(`open ${path} to see the uploaded file`)


        // Your existing logic to analyze the file with 'ANALISADOR.PY'
        //ANALISANDO O ARQUIVO COM O 'ANALISADOR.PY'
        const path_py = 'C:/Users/nicol/OneDrive/Documentos/JS/Projects/inovdrop/analisador.py'

        //Executando o arquivo python
        const python_process = spawn('python', [path_py, file.name]);


        //Recebendo os dados com uma promessa para que seja executado de forma async
        const ddPromise = new Promise((resolve, reject) => {
            python_process.stdout.on('data', async (data) => {
                var dic = JSON.parse(data.toString());

                const dd = {
                    'name': `Nome: ${file.name}`,
                    'scd': dic['scd'],
                    'due_date': dic['due_date'],
                    'total': dic['total'],
                };

                resolve(dd);
            });
        });

        //Colocando os dados recebidos na variavel com o 'await' para que o programa espere
        const ddd = await ddPromise;

        return NextResponse.json(ddd);
        
        } catch (error) {
        console.error('Error processing the request :( :', error);
        return NextResponse.json({message: 'Error processing the request', error})
        }
    } else {
        // Handle other HTTP methods if needed
        console.log(req.method)
        return NextResponse.json({ error: 'Method Not Alloweddddd' });
    }
};