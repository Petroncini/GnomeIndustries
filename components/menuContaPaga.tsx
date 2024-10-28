'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'
import { DelConta, UpdateContaNP } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';



type MConta = {
    img: string;
    name: string;
    scd: string;
    date: Date;
    pDate: Date;
    total: Number;
    id:string;
    url:string;
    curl:string;
}



const MenuContaPaga: React.FC<MConta> = props => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  //********************************************************************************************************************* */


  const [selectedOption, setSelectedOption] = useState('Boleto');

  const handleSelectChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };


  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'Ordem do Chefe':
        return (
          <div 
              {...dropzone.getRootProps()} 
              className={`absolute right-3 bottom-3 flex w-[300px] h-[100px] rounded-lg border-dashed border-4 border-gray-600 bg-gray-700 hover:border-gray-500 ${dropzone.isDragActive ? "border-sky-600" : "border-gray-600"}  hover:bg-gray-600 transition-all`}
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
        )
      case 'Manual':
        return (
          <div 
              {...dropzone.getRootProps()} 
              className={`absolute right-3 bottom-3 flex w-[300px] h-[100px] rounded-lg border-dashed border-4 border-emerald-500 bg-green-400 hover:border-emerald-400 ${dropzone.isDragActive ? "border-sky-600" : "border-gray-600"}  hover:bg-green-300 transition-all`}
              >
                  <label htmlFor='dropzone-file' className='cursor-pointer w-full h-full'>
                      <div className='flex flex-col items-center justify-center pt-5 pb-6 w-full h-full'>
                          <p className='mb-2 text-black text-lg'>
                              <span className='font-bold'>{uploading ? 'Uploading...' : 'Envie o Arquivo'}</span>
                          </p>
                          <p className='text-black text-sm'>PDF</p>
                      </div>
                  </label>
                  <input {...dropzone.getInputProps()} className='hidden' type='file' />

          </div>
        )
        case 'Tutorial':
          return (
            <div 
                {...dropzone.getRootProps()} 
                className={`absolute right-3 bottom-3 flex w-[300px] h-[100px] rounded-lg border-dashed border-4 border-blue-500 bg-sky-400 hover:border-blue-400 ${dropzone.isDragActive ? "border-sky-600" : "border-gray-600"}  hover:bg-green-300 transition-all`}
                >
                    <label htmlFor='dropzone-file' className='cursor-pointer w-full h-full'>
                        <div className='flex flex-col items-center justify-center pt-5 pb-6 w-full h-full'>
                            <p className='mb-2 text-black text-lg'>
                                <span className='font-bold'>{uploading ? 'Uploading...' : 'Envie o Arquivo'}</span>
                            </p>
                            <p className='text-black text-sm'>Vídeo</p>
                        </div>
                    </label>
                    <input {...dropzone.getInputProps()} className='hidden' type='file' />
  
            </div>
          )
      default:
        return (
          <div 
              {...dropzone.getRootProps()} 
              className={`absolute right-3 bottom-3 flex w-[300px] h-[100px] rounded-lg border-dashed border-4 border-gray-600 bg-gray-700 hover:border-gray-500 ${dropzone.isDragActive ? "border-sky-600" : "border-gray-600"}  hover:bg-gray-600 transition-all`}
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
        )
    }
  };


  //********************************************************************************************************************* */




  //********************************************************************************************************************* */



  //Criando um useState para guardar o estado do 'upload'
  const [uploading, setUploading] = useState(false); 
  //Criando um useState(do tipo 'File' com valor inicial null) para guardar or arquivo
  const [fileS, setFileS] = useState<File | null>(null)


  //Função para pegar os dados do arquivo
  const getDataChefe =  async (file: File | null) => {
    //Var para resultado da analise
    let res1 = 'Analise Falhou!'
    let res2: String | undefined = 'error'
    
    //Mundando o estado do 'uploading'
    setUploading(true);
    setIsOpen(false)


    Swal.fire({
      title: "O Arquivo está sendo analizado",
      timer:30000,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        Swal.fire(res1, "", res2 as undefined);
        //Mudando o estado do 'update'
        setUploading(false);
        setIsOpen(true)
      }
    });

    //Criando o FormData que será enviado para ser analisado no backend
    var fm = new FormData();

    //Verificando se ha arquivo (isso tmb irá tirar o valor de 'null' da variavel para que ela possa ser lida
    if (!file) return 0;

    //Colocando o arquivo no FormData
    fm.append('file', file);
    fm.append('id', props.id);
    fm.append('url', props.url);

    //Enviando o arquivo para ser analisado pelo programa python
    await axios.post('http://localhost:3000/api/UploadChefe', fm, {headers: {'Content-Type': 'multipart/form-data'}})
    .then(async (response) => {
      const data = response.data;
      router.refresh();
      res1 = 'Analise Concluida!'
      res2 = 'success'
      const nl = Swal.getTimerLeft() as Number
      Swal.increaseTimer(-nl+50)

    })
    
    //Mudando o estado do 'update'
    setUploading(false);
    
  }




  //Função para pegar os dados do arquivo
  const getDataManual =  async (file: File | null) => {
    //Var para resultado da analise
    let res1 = 'Analise Falhou!'
    let res2: String | undefined = 'error'
    
    //Mundando o estado do 'uploading'
    setUploading(true);
    setIsOpen(false)


    Swal.fire({
      title: "O Arquivo está sendo analizado",
      timer:30000,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        Swal.fire(res1, "", res2 as undefined);
        //Mudando o estado do 'update'
        setUploading(false);
        setIsOpen(true)
      }
    });

    //Criando o FormData que será enviado para ser analisado no backend
    var fm = new FormData();

    //Verificando se ha arquivo (isso tmb irá tirar o valor de 'null' da variavel para que ela possa ser lida
    if (!file) return 0;

    //Colocando o arquivo no FormData
    fm.append('file', file);
    fm.append('id', props.id);
    fm.append('url', props.url);

    //Enviando o arquivo para ser analisado pelo programa python
    await axios.post('http://localhost:3000/api/UploadManual', fm, {headers: {'Content-Type': 'multipart/form-data'}})
    .then(async (response) => {
      const data = response.data;
      router.refresh();
      res1 = 'Analise Concluida!'
      res2 = 'success'
      const nl = Swal.getTimerLeft() as Number
      Swal.increaseTimer(-nl+50)

    })
    
    //Mudando o estado do 'update'
    setUploading(false);
    
  }



  const getDataTutorial =  async (file: File | null) => {
    //Var para resultado da analise
    let res1 = 'Analise Falhou!'
    let res2: String | undefined = 'error'
    
    //Mundando o estado do 'uploading'
    setUploading(true);
    setIsOpen(false)


    Swal.fire({
      title: "O Arquivo está sendo analizado",
      timer:30000,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        Swal.fire(res1, "", res2 as undefined);
        //Mudando o estado do 'update'
        setUploading(false);
        setIsOpen(true)
      }
    });

    //Criando o FormData que será enviado para ser analisado no backend
    var fm = new FormData();

    //Verificando se ha arquivo (isso tmb irá tirar o valor de 'null' da variavel para que ela possa ser lida
    if (!file) return 0;

    //Colocando o arquivo no FormData
    fm.append('file', file);
    fm.append('id', props.id);
    fm.append('url', props.url);

    //Enviando o arquivo para ser analisado pelo programa python
    await axios.post('http://localhost:3000/api/UploadChefe', fm, {headers: {'Content-Type': 'multipart/form-data'}})
    .then(async (response) => {
      const data = response.data;
      router.refresh();
      res1 = 'Analise Concluida!'
      res2 = 'success'
      const nl = Swal.getTimerLeft() as Number
      Swal.increaseTimer(-nl+50)

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
  })

  //Executando a função 'getData' toda fez que o arquivo muda
  React.useEffect(() => {
    if (fileS) {
        if (selectedOption === 'Ordem do Chefe') {
          getDataChefe(fileS);
        }
        if (selectedOption === 'Manual') {
          getDataManual(fileS);
        }
        if (selectedOption === 'Tutorial') {
          getDataTutorial(fileS);
        }
        
    }
  }, [fileS]);


  //********************************************************************************************************************* */


  const DelAction = (formData : FormData) => {
    Swal.fire({
      title: "Quer mesmo deletar essa conta?",
      icon: 'warning',
      showDenyButton: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Deletar conta",
      confirmButtonColor: 'red',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        DelConta(formData);
        router.refresh();
        Swal.fire("Deletada", "", "success");
      }
    });

  }

  //********************************************************************************************************************* */






  const icon_path = `/icon_contas/${props.img}.png`
  var stl_sub_container = 'w-full border-b border-gray-400 pt-5 flex flex-row items-center bg-gray-50 relative'
  

  return (
    <div className='flex flex-col items-center justify-center w-full'>

      <div className={stl_sub_container} onClick={toggleMenu} style={{ cursor: 'pointer' }}>
        <span className='pl-2'><Image src={icon_path} alt="" width={22} height={27} /></span>
        <p className='pl-1 text-md'>{props.name}</p>
        <p className='absolute right-72 text-sm'>{`${props.date.getUTCDate()}/${props.date.getUTCMonth()+1}/${props.date.getUTCFullYear()}`}</p>
        <p className='absolute right-20 text-sm'>Maquina</p>
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
              <div className='relative bg-gray-100 w-full max-w-[1080px] h-[230px] pt-2 border rounded-md border-gray-200 shadow-md'>

                <div className='p-2 flex flex-col w-full'>
                  
                  <form action={DelAction} className='absolute top-5 right-5'>
                      <input type="hidden" name='id' value={props.id} />
                      <input type="hidden" name='url' value={props.url} />
                      <input type="hidden" name='curl' value={props.curl} />

                      <button className='bg-blue-600 p-1 w-16 text-center rounded text-white text-sm'>
                      Feito!
                      </button>
                  </form>

                  <div className='space-y-0 w-full'>
                      {/*DIV QUE CONTEM OS DADOS DO ARQUIVO*/}
                      <div className='space-y-1 flex flex-col w-full'>
                          <input type="hidden" name='id' value={props.id} />  
                          <input type="hidden" name='pag' value={'false'} />

                          <div className='flex flex-row w-full space-x-1'>
                            <label className='font-bold text-sm'>Nome: </label>
                            <p>{props.name}</p>
                          </div>

                          <div className='flex flex-row w-full space-x-1'>
                            <label className='font-bold text-sm'>Máquina: </label>
                            <p>Máquina</p>
                          </div>

                          <div className='flex flex-row w-full space-x-1'>
                            <label className='font-bold text-sm'>Data Limite: </label>
                            <p className='text-sm'>{`${props.date.getUTCDate()}/${props.date.getUTCMonth()+1}/${props.date.getUTCFullYear()}`}</p>
                          </div>

                          <div className='flex flex-col w-full space-y-1'>
                            <label className='font-bold text-sm'>Técnicos envolvidos: </label>
                            <p className=' pl-2'>-Nome 1</p>
                            <p className=' pl-2'>-Nome 2</p>
                          </div>

                          <div className=' absolute top-4 left-56 flex flex-row w-full space-x-1'>
                            <label className='font-bold text-sm'>Tarefas: </label>
                            <a href={props.url} className="text-blue-500 hover:text-blue-700 underline">Link do Passo a passo</a>
                          </div>

                      </div>
                  </div>



                  {/*DIV DA DROPZONE*/}
                  <div className='flex flex-col'>
                    <select  className='absolute right-5 top-16 w-fit border border-gray-500 rounded-md text-sm' id="componentSelect" value={selectedOption} onChange={handleSelectChange}>
                      <option value="Ordem do Chefe">Ordem do Chefe</option>
                      <option value="Manual">Manual</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>

                    <div className='absolute right-1 bottom-5'>
                      {renderSelectedComponent()}
                    </div>
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