'use server'

import { NextResponse, NextRequest } from 'next/server';
import { connectToDB } from '@/app/lib/utils';
import { Contssss } from '@/app/lib/models';
import {v2 as cloudinary} from 'cloudinary';
import { revalidatePath } from'next/cache';



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


        //Recebendo os dados com uma promessa para que seja executado de forma async
        const ddPromise = new Promise(async (resolve, reject) => {
            try {
                connectToDB();

                //Deletando o arquivo anterior
                if (urll != '') {
                    const l = urll.split('/');
                    const lll = l[l.length - 1];
                    let nameUrl = lll.slice(0, -4);
                    cloudinary.api.delete_resources([nameUrl], { type: 'upload', resource_type: 'image' })
                }


                //Handling the upload to Cloudinary
                const cloudBuffer = new Uint8Array(bytes)

                const dados = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, function (error, result) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(result);
                    } ).end(cloudBuffer)
                })
                const url = dados.secure_url
          
                await Contssss.findByIdAndUpdate(idd, { comp:url});

                resolve(url);
        
        
        
            }catch(err) {
                console.log(err)
                throw new Error('Falhou ao tentar colocar novos dados nova Conta Fixa pela Drop - Comprovante')
            }
        });

        //Colocando os dados recebidos na variavel com o 'await' para que o programa espere
        const ddd = await ddPromise;

        revalidatePath('/contas')
        revalidatePath('/contas/pagas')
        revalidatePath('/contas/contas_a_pagar')
        revalidatePath('/contas/variadas')
        


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