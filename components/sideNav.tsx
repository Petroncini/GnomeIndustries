'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { logOut } from '@/app/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

var stl_but = 'flex flex-row space-x-2 items-center justify-center md:justify-start md:px-4 w-11/12 py-3 rounded-lg bg-indigo-800 bg-opacity-20 hover:bg-indigo-700 transition-all'

const SideNav = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

  return (
    <div 
    className='md:w-60 bg-indigo-950 h-screen flex-1 fixed md:flex text-white'>
        <div className='flex flex-col space-y-6 w-full pt-10'>
            <Link href='/contas' className='flex flex-row items-center justify-center md:justify-start md:px-6'>
                <span className=' px-2'><Icon icon='carbon:user' width={21} height={21}></Icon></span>
                <p className='text-2xl'>José</p>
            </Link>

            <div className='pt-10'>

                <div className='px-2 py-2'>
                    <Link href='/contas' className={stl_but}>
                        <span><Icon icon='carbon:document' width={22} height={22}></Icon></span>
                        <p className='text-md'>Ordens de Serviço</p>
                    </Link>
                </div>

                <div className='px-2 py-2'>
                    <Link href='/contas/ferramentas' className={stl_but}>
                        <span><Icon icon='carbon:tools' width={21} height={21}></Icon></span>
                        <p className='text-md'>Ferramentas</p>
                    </Link>
                </div>

                <div className='px-2 py-2'>
                    <Link href='/contas/pagas' className={stl_but}>
                        <span><Icon icon='carbon:gears' width={21} height={21}></Icon></span>
                        <p className='text-md'>Máquinas</p>
                    </Link>
                </div>



                <form action={logOut} className='absolute bottom-2 right-2 px-2 py-2'>
                    <button className='flex flex-row space-x-2 items-center justify-center md:justify-start md:px-4 w-36 py-3 rounded-lg bg-indigo-800 bg-opacity-20 hover:bg-red-500 transition-all'>
                        <p className='text-md'>Encerrar Sessão</p>
                    </button>
                </form>

                
            </div>




        </div>
    </div>
  )
}

export default SideNav