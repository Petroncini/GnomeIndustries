'use server'

import { NextResponse, NextRequest } from 'next/server';
import { connectToDB } from '@/app/lib/utils';
import { Contssss } from '@/app/lib/models';
import {v2 as cloudinary} from 'cloudinary';
import { revalidatePath } from'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';



cloudinary.config({ 
    cloud_name: 'dntylhu7k', 
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



export const POST = async (req, res) => {
    if (req.method === 'POST') {
        try {
        // Extract data from the request
        const data = await req.formData();
        const file = data.get('file');
        const idd = data.get('id');
        const urll = data.get('url');


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
        const path_py = 'C:/Users/nicol/OneDrive/Documentos/JS/Projects/Tractian/lista_de_tarefas.py'

        //Executando o arquivo python
        const python_process = spawn('python', [path_py, file.name]);


        //Recebendo os dados com uma promessa para que seja executado de forma async
        const ddPromise = new Promise((resolve, reject) => {
            python_process.stdout.on('data', async (data) => {
                var dic = JSON.parse(data.toString());

                const dd = {
                    'link': dic["link"],
                };

                resolve(dd);
            });
        });

        //Colocando os dados recebidos na variavel com o 'await' para que o programa espere
        const ddd = await ddPromise;

        console.log(ddd);

        let link = ddd.link;

        connectToDB();

        await Contssss.findByIdAndUpdate(idd, {url:link});

        revalidatePath('/contas')

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