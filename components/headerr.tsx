'use client'

import React from 'react'
import { cn } from '@/utils'
import { Icon } from '@iconify/react';

var today = new Date();
var f = new Intl.DateTimeFormat('pt-br', {month: 'short', day:'2-digit', year: 'numeric'})

const Headerr = () => {
  return (
    <div className={cn('sticky inset-x-0 top-0 z-30 px-10 pt-4 w-full transition-all bg-transparent backdrop-blur-sm')}>
      <div className='relative p-4 flex flex-row space-x-4 bg-indigo-800 rounded-lg items-center w-full h-[80%] shadow-xl shadow-slate-100'>
        <p className='text-xl font-bold text-white'>Bem-Vindo</p>
        <p className=' font-normal text-white'> {'>>'} </p>
        <p className='text-white'>{f.format(today)}</p>


        <div className='absolute inset-y-4 right-10 bg-gray-100 rounded-lg w-[352px] h-[32px] border-2 border-gray-200 row-auto cursor-not-allowed'>
          <p className='py-1 px-10 text-sm text-gray-400'>Pesquise aqui</p>
          <span className='absolute inset-y-1 right-2'><Icon icon='ic:outline-search' width={22} height={22} color='#9ca3aa'></Icon></span>
        </div>
      </div>
    </div>
  )
}

export default Headerr