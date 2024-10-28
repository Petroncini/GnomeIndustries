'use server'

import { Contssss, FixNames, ForName, User } from '@/app/lib/models';
import { connectToDB } from './utils';
import { revalidatePath } from'next/cache';
import { redirect } from 'next/navigation';
import {v2 as cloudinary} from 'cloudinary';
import { fetchContas } from '@/app/lib/data';
import bcrypt from "bcrypt";
import { signIn, signOut } from '../../backu/auth/auth'
import Swal from 'sweetalert2';



cloudinary.config({ 
    cloud_name: 'dntylhu7k', 
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



export const CreateUser = async (formData) => {

    const nUser = formData.get('name')
    const eUser = formData.get('email')
    const pUser = formData.get('password')

    try {
        connectToDB();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pUser, salt);

        const newUser = new User({name:nUser, email:eUser, password:hashedPassword});

        await newUser.save()

        await signIn('credentials', {eUser, hashedPassword})

    }catch(err) {
        console.log(err)
        throw new Error('Falhou ao tentar criar novo Usuario')
    }

}


export const authenticate = async (formData) => {
    const { email, password } = Object.fromEntries(formData);

    try {
        await signIn('credentials', {email, password})
    } catch (err) {
        console.log(err);
        throw err;
    }

}

export const logOut = async (formData) => {
    try {
        await signOut()
    } catch (err) {
        console.log(err);
        throw err;
    }

}








export const DelConta = async (formData) => {

    const { id, url, curl } = Object.fromEntries(formData);

    //Deletando o arquivo anterior
    if (url != '') {
        const l = url.split('/');
        const lll = l[l.length - 1];
        let nameUrl = lll.slice(0, -4);
        cloudinary.api.delete_resources([nameUrl], { type: 'upload', resource_type: 'image' })
    }

    if (curl != '') {
        const l = curl.split('/');
        const lll = l[l.length - 1];
        let nameUrl = lll.slice(0, -4);
        cloudinary.api.delete_resources([nameUrl], { type: 'upload', resource_type: 'image' })
    }

    try {
        connectToDB();

        await Contssss.findByIdAndDelete(id);
    }catch(err) {
        console.log(err)
        throw new Error(err)
    }

    revalidatePath('/contas')
    revalidatePath('/contas/pagas')
    revalidatePath('/contas/contas_a_pagar')
    revalidatePath('/contas/variadas')
}

export const UpdateContaNP = async (formData) => {

    const { id, name, scd, due_date, total, pag_date, pag } = Object.fromEntries(formData);

    try {
        connectToDB();

        const updateFields = {name, scd, due_date, total, pag_date};
        Object.keys(updateFields).forEach((key) => (updateFields[key] === '' || undefined) && delete updateFields[key]);

        await Contssss.findByIdAndUpdate(id, updateFields);

    }catch(err) {
        console.log(err)
        throw new Error('Falhou ao tentar colocar novos dados nova Conta Fixa')
    }

    revalidatePath('/contas')
    revalidatePath('/contas/contas_a_pagar')
    revalidatePath('/contas/variadas')
}

export const Pagar = async (formData) => {

    const { id, type, name } = Object.fromEntries(formData);

    try {
        connectToDB();

        //Deletando o ForName
        await Contssss.findByIdAndUpdate(id, {pag:true, pag_date: new Date()});

        const conta = await Contssss.findById(id);
        const data = conta.due_date

        if (type === 'fix') {
            const newContaFix = new Contssss({name:name, type:'fix', pag:false, due_date:new Date(data.getUTCFullYear(),data.getUTCMonth()+1, data.getUTCDate())});

            await newContaFix.save()
        };

        
    }catch(err) {
        console.log(err)
        throw new Error(err)
    }
    revalidatePath('/contas')
    revalidatePath('/contas/pagas')
    revalidatePath('/contas/contas_a_pagar')
    revalidatePath('/contas/variadas')

}






export const AddFixName = async (formData) => {

    const nFix = formData.get('name')

    try {
        connectToDB();

        const newFixName = new FixNames({name:nFix})
        await newFixName.save()

        const newContaFix = new Contssss({name:nFix, type:'fix', pag:false, due_date:new Date().setHours(0, 0, 0, 0)});
        await newContaFix.save()

    }catch(err) {
        console.log(err)
        throw new Error('Falhou ao tentar criar novo FixName')
    }

    revalidatePath('/contas/fixas')
    redirect('/contas/fixas')
}

export const DelFixName = async (formData) => {

    const { id, name } = Object.fromEntries(formData);
    const contas = await fetchContas();

    try {
        connectToDB();

        //Deletando o ForName
        await FixNames.findByIdAndDelete(id);

        //Deletando as Contas desse ForName
        {contas.map(async (conta) => {
            if (conta.name === name && conta.type === 'fix') {
                const fm = new FormData();
                fm.append('id', conta.id)
                fm.append('url', conta.bol)
                fm.append('curl', conta.comp)
                DelConta(fm);
            } else {
                return null;
            }
        })}

        
    }catch(err) {
        console.log(err)
        throw new Error(err)
    }

    revalidatePath('/contas/fixas')

}




export const AddForName = async (formData) => {

    const nFor = formData.get('name')

    try {
        connectToDB();

        const newForName = new ForName({name:nFor})

        await newForName.save()
    }catch(err) {
        console.log(err)
        throw new Error('Falhou ao tentar criar novo ForName')
    }

    revalidatePath('/contas/fornecedores')
    redirect('/contas/fornecedores')
}

export const DelForName = async (formData) => {

    const { id, name } = Object.fromEntries(formData);
    const contas = await fetchContas();

    try {
        connectToDB();

        //Deletando o ForName
        await ForName.findByIdAndDelete(id);

        //Deletando as Contas desse ForName
        {contas.map(async (conta) => {
            if (conta.name === name && conta.type === 'for') {
                const fm = new FormData();
                fm.append('id', conta.id)
                fm.append('url', conta.bol)
                fm.append('curl', conta.comp)
                DelConta(fm);
            } else {
                return null;
            }
        })}

        
    }catch(err) {
        console.log(err)
        throw new Error(err)
    }

    revalidatePath('/contas/fornecedores')

}

export const AddContaFor = async (formData) => {

    const nFor = formData.get('name')
    const idFor = formData.get('id')

    try {
        connectToDB();

        const newContaFor = new Contssss({name:nFor, type:'for', pag:false, due_date:new Date().setHours(0,0,0,0)});

        await newContaFor.save()
    }catch(err) {
        console.log(err)
        throw new Error('Falhou ao tentar criar nova Conta For')
    }

    revalidatePath(`/contas/fornecedores/${idFor}`)
}



export const AddContaVar = async (formData) => {

    const nVar = formData.get('name')
    const dVar = formData.get('data') != '' ? formData.get('data') : new Date();
    const tVar = formData.get('total') || 0

    try {
        connectToDB();

        const newContaVar = new Contssss({name:nVar, type:'var', pag:false, due_date:dVar, total:tVar});

        await newContaVar.save()
    }catch(err) {
        console.log(err)
        throw new Error('Falhou ao tentar criar nova Conta Fixa')
    }

    revalidatePath('/contas/variadas')
    redirect('/contas/variadas')
}