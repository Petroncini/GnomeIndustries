'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'



type MConta = {
    img: string;
    name: string;
    date: string;
    total: string;
}



const MenuContaPaga: React.FC<MConta> = props => {
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
  const [name, setName] = useState('');
  const [scd, setScd] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [total, setTotal] = useState('');
  const [bol, setBol] = useState('');
  const [comp, setComp] = useState('');

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


    await axios.post('http://localhost:3000/api/UploadDef', fm, {headers: {'Content-Type': 'multipart/form-data'}})
    .then(async (response) => {
      //Salvando a resposta em 'ddds'
      var ddds = response.data

      //Setando os valores recebidos nas variaveis
      setName(ddds['name'])
      setScd(ddds['scd'])
      setDueDate(ddds['due_date'])
      setTotal(ddds['total'])

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


  const icon_path = `/icon_contas/${props.img}_pag.png`
  var stl_sub_container = 'w-full border-b border-gray-400 pt-5 flex flex-row items-center bg-gray-50 relative'


  return (
    <div className='flex flex-col items-center justify-center w-full'>

      <div className={stl_sub_container} onClick={toggleMenu} style={{ cursor: 'pointer' }}>
        <span><Image src={icon_path} alt="" width={26} height={31.56} /></span>
        <p className='absolute left-8 text-lg'>{props.name}</p>
        <p className='absolute right-72'>{props.date}</p>
        <p className='absolute right-20'>{props.total}</p>
        <span className='absolute right-8'><Image src="/arrow_head_down.png" alt="" width={13} height={13} /></span>
      </div>



      <div className='w-full'>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='flex w-full justify-center'
            >
              <div className='relative bg-gray-100 w-full max-w-[1080px] h-[280px] pt-2 border rounded-md border-gray-200 shadow-md'>

                <div className='p-2 flex flex-col'>
                  

                  <div className='space-y-0 w-full'>
                      {/*DIV QUE CONTEM OS DADOS DO ARQUIVO*/}
                      <div className='space-y-3 flex flex-col w-full'>
                          <div className='flex flex-row w-full space-x-1'>
                            <label className=' font-bold'>Nome: </label>
                            <input type='text' name='' placeholder={name} className='w-[87.7%] rounded-md border border-gray-500'></input>
                          </div>

                          <div className='flex flex-row w-full space-x-1'>
                            <label className=' font-bold'>Codigo de Barras: </label>
                            <input type='text' name='' placeholder={scd} className='w-[80%] rounded-md border border-gray-500'></input>
                          </div>

                          <div className='flex flex-row w-full space-x-1'>
                            <label className=' font-bold'>Data de Vencimento: </label>
                            <input type='date' name='' placeholder={dueDate} className='w-[40%] rounded-md border border-gray-500'></input>
                          </div>

                          <div className='flex flex-row w-full space-x-1'>
                            <label className=' font-bold'>Data do Pagamento: </label>
                            <input type='date' name='' placeholder='' className='w-[40%] rounded-md border border-gray-500'></input>
                          </div>

                          <div className='flex flex-row w-full space-x-1'>
                            <label className=' font-bold'>Total: </label>
                            <input type='number' name='' placeholder={total} className='w-[40%] rounded-md border border-gray-500'></input>
                          </div>

                          <p><span className=' font-bold'>Boleto: </span>{bol}</p>

                          <p><span className=' font-bold'>Comprovante: </span>{bol}</p>

                      </div>
                  </div>



                  <div className='absolute right-3 bottom-3 '>
                      <div className='absolute right-3 bottom-24 pb-2'>
                        <select name="tog" id="bol_comp" className='cursor-pointer'>
                          <option value="comp">Comprovante</option>
                          <option value="bol">Boleto</option>
                        </select>
                      </div>



                      {/*DIV DA DROPZONE*/}
                      <div 
                          {...dropzone.getRootProps()} 
                          className={`absolute right-3 bottom-0 flex w-[380px] h-[100px] rounded-lg border-dashed border-4 border-gray-600 bg-gray-700 hover:border-gray-500 ${dropzone.isDragActive ? "border-sky-600" : "border-gray-600"}  hover:bg-gray-600 transition-all`}
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

                  </div>

                  <div className='absolute left-[36%] bottom-3'>

                    <button type='submit'
                    className='bg-indigo-600 p-3 w-40 text-center rounded text-white'>
                    Salvar alterações
                    </button>

                  </div>





                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    
    </div>
  );
}

export default MenuContaPaga