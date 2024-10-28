'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'
import { createWorker } from 'tesseract.js';


var stl_sub_container = 'w-full border-b border-gray-400 pt-5 flex flex-row items-center bg-gray-50'

type MConta = {
    img: string;
    name: string;
    date: string;
    total: string;
}



const MenuConta: React.FC<MConta> = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  //********************************************************************************************************************* */



  //Criando um useState para guardar o estado do 'upload'
  const [uploading, setUploading] = useState(false); 
  //Criando um useState(do tipo 'File' com valor inicial null) para guardar or arquivo
  const [fileS, setFileS] = useState<File | null>(null)

  //Criando as Variaveis para os dados do arquivo
  const [name, setName] = useState('Nome:________________________________________');
  const [scd, setScd] = useState('Codigo de Barras:________________________________________');
  const [dueDate, setDueDate] = useState('Data de Vencimento:________________________________________');
  const [total, setTotal] = useState('Total:________________________________________');

  //Função para pegar os dados do arquivo
  const getData =  async (file: File | null) => {
    //Mundando o estado do 'uploading'
    setUploading(true);

    //Criando o FormData que será enviado para ser analisado no backend
    var fm = new FormData();

    //Verificando se ha arquivo (isso tmb irá tirar o valor de 'null' da variavel para que ela possa ser lida
    if (!file) return 0;

    //Colocando o arquivo no FormData
    fm.append('file', file);




    const worker = await createWorker('eng');
    await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png')
      .then(async resp => {
        try {
          //Mandando o FormData para ser analisado no backend
          await axios.post('http://localhost:3000/api/UploadF', fm, {headers: {'Content-Type': 'multipart/form-data'}})
            .then((response) => {
              //Salvando a resposta em 'ddds'
              var ddds = response.data
    
              //Setando os valores recebidos nas variaveis
              setName(ddds['name'])
              setScd(ddds['scd'])
              setDueDate(ddds['due_date'])
              setTotal(ddds['total'])
    
            })
    
        } catch(error: any) {
          //Verificando se ha erro
          console.log(error.responde?.data
        )}
      })




    
    //Mudando o estado do 'update'
    setUploading(false);
    
  }


  //Função para salvar o arquivo recebido na 'dropbox' na variavel fileS
  const onDrop = useCallback(async (files: File[]) => {
    setFileS(files[0]);

  }, [])


  //Criando o parametro da lib dropzone
  const dropzone = useDropzone({
    onDrop,
    accept: {
        'application/pdf': ['.pdf'],
    },
  })

  //Executando a função 'getData' toda fez que o arquivo muda
  React.useEffect(() => {
    if (fileS) {
        getData(fileS);
    }
  }, [fileS]);



  //********************************************************************************************************************* */


  return (
    <div className='flex flex-col items-center justify-center'>

      <div className={stl_sub_container} onClick={toggleMenu} style={{ cursor: 'pointer' }}>
        <span><Image src={'/' + props.img} alt="" width={26} height={31.56} /></span>
        <p className='pl-4 text-lg'>{props.name}</p>
        <p className='pl-96'>{props.date}</p>
        <p className='pl-80'>{props.total}</p>
        <span className='pl-20'><Image src="/arrow_head_down.png" alt="" width={13} height={13} /></span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className='bg-red-300 w-[1100px] h-[270px] pt-2 border rounded-md border-gray-200 shadow-md'>

              <div className='p-6 flex flex-row relative'>
                

                {/*DIV DA DROPZONE*/}
                <div 
                    {...dropzone.getRootProps()} 
                    className={`flex w-[300px] h-[200px] rounded-lg border-dashed border-4 border-gray-600 bg-gray-700 hover:border-gray-500 ${dropzone.isDragActive ? "border-sky-600" : "border-gray-600"}  hover:bg-gray-600 transition-all`}
                    >
                        <label htmlFor='dropzone-file' className='cursor-pointer w-full h-full'>
                            <div className='flex flex-col items-center justify-center pt-5 pb-6 w-full h-full'>
                                <p className='mb-2 text-gray-400 text-lg'>
                                    <span className='font-bold'>{uploading ? 'Uploading...' : 'Envie o Arquivo'}</span>
                                </p>
                                <p className='text-gray-400 text-sm'>PDF</p>
                            </div>
                        </label>
                        <input {...dropzone.getInputProps()} className='hidden' type='file' />

                </div>



                <div className='absolute right-10 space-y-2'>
                    {/*DIV QUE CONTEM OS DADOS DO ARQUIVO*/}
                    <div className='space-y-2'>
                        <p ><span>{name}</span></p>
                        <p><span>{scd}</span></p>
                        <p><span>{dueDate}</span></p>
                        <p><span>{total}</span></p>
                    </div>

                    <div className='pt-10'>
                        <button
                        className='bg-green-600 p-3 w-32 text-center rounded text-white'
                        >
                        Pagar
                        </button>
                    </div>

                </div>



              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    
    </div>
  );
}

export default MenuConta