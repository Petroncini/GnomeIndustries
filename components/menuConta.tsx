'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'
import { DelConta, Pagar, UpdateContaNP } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Tesseract from 'tesseract.js';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';

GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;


type MConta = {
    img: string;
    name: string;
    scd: string;
    date: Date;
    total: Number;
    id:string;
    url:string;
}


const MenuConta: React.FC<MConta> = props => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  //********************************************************************************************************************* */


  const PagarAction = (formData : FormData) => {
    Pagar(formData);
    router.refresh();
  }

  //********************************************************************************************************************* */
  


  const icon_path = `/icon_contas/${props.img}.png`
  var stl_sub_container = 'w-full border-b border-gray-400 pt-2 flex flex-row items-center bg-gray-50 relative'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  

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
              <div className='relative bg-gray-100 w-full max-w-[1080px] h-[190px] pt-2 border rounded-md border-gray-200 shadow-md'>

                <div className='p-2 flex flex-col w-full'>

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
                            <a href="">Link da máquina</a>
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
                            <a href="">Link do Passo a passo</a>
                          </div>

                      </div>
                  </div>

                  <div className='absolute top-5 right-[80px] pr-5 flex flex-row'>
                      <form action={PagarAction}>
                          <input type="hidden" name='id' value={props.id} />
                          <input type="hidden" name='type' value={props.img} />
                          <input type="hidden" name='name' value={props.name} />

                          <button
                          className='bg-blue-600 p-1 text-center rounded text-white'>
                          Feito!
                          </button>
                      </form>

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

export default MenuConta