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
        const text = data.get('text');

        //console.log(`Text:\n${text}`);


        // Check if a file was uploaded
        if (!file) {
            console.log('No file uploaded');
            return NextResponse.json({message: 'No file uploaded'})
        }



        // Perform file upload logic (similar to your existing upload function)
        //TRANSFORMANDO O TIPO 'File' EM TIPO 'ArrayBuffer'
        const bytes = await file.arrayBuffer()

        //PEGANDO O 'Buffer' DO 'ArrayBuffer' PARA CONSEGUIR SER LIDO PELA FUNÇÃO 'writeFile'

        //Handling the upload to Cloudinary
        try {
            connectToDB();
            const cloudBuffer = new Uint8Array(bytes);
            const base64File = Buffer.from(cloudBuffer).toString('base64');
        
            // Deletando o arquivo anterior
            if (urll != '') {
                const l = urll.split('/');
                const lll = l[l.length - 1];
                let nameUrl = lll.slice(0, -4);
                //console.log('Deleting resource:', nameUrl);
                await cloudinary.api.delete_resources([nameUrl], { type: 'upload', resource_type: 'image' });
            }
        
            const dados = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                        return;
                    }
                    resolve(result);
                });
                uploadStream.end(cloudBuffer);
            });
        
            const url = dados.secure_url;
            //console.log('Upload successful, URL:', url);
        
            await Contssss.findByIdAndUpdate(idd, { bol: url });
        } catch (err) {
            console.error('Error caught in try-catch:', err);
            throw new Error('Falhou ao fazer o upload do boleto');
        }

        
        //Extracting the information from the text
        let scd = get_scd(text);
        //console.log(scd);

        let dueDate = getDueDate(text);
        console.log(dueDate);
        if(dueDate != 'ERROR-DATE'){
            let parts = dueDate.split("/");
            if(parts[2].length === 2){
                parts[2] = '20' + parts[2];
            }
            var dateObject = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            //console.log(dateObject);
        }


        let total = get_total(text);
        //console.log(total);


        connectToDB();

        await Contssss.findByIdAndUpdate(idd, {scd:scd});

        if(dueDate != 'ERROR-DATE'){
            await Contssss.findByIdAndUpdate(idd, {due_date:dateObject});
        }

        if(total != -Infinity){
            await Contssss.findByIdAndUpdate(idd, {total:total});
        }

        revalidatePath('/contas')
        revalidatePath('/contas/pagas')
        revalidatePath('/contas/contas_a_pagar')
        revalidatePath('/contas/variadas')

        // The recognized text is stored in the 'text' variable
        const ddd = '';

        return NextResponse.json({ ddd });
        
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