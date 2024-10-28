import React from 'react'
import { NomeFixas } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { fetchForNames } from '@/app/lib/data';


var stl_container = "shadow-md w-full h-full px-5 py-5 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-2"

const Fornecedores = async () => {

  const forNames = await fetchForNames();

  return (
    <div className='overflow-hidden px-10'>
      <div className='flex flex-row space-x-3'>
        <h1>Contas de Fornecedores</h1>
        <Link href={'/contas/fornecedores/add'} className='pt-8'>
            <span><Image src="/img_plus.png" alt="" width={30} height={30} /></span>
        </Link>
      </div>

      <div className={stl_container}>
          {forNames.reverse().map((forName) => (
            <NomeFixas key={forName.id}
            name={forName.name ? forName.name : 'Sem Nome'}
            tog='for'
            id={forName.id} />
          ))}
      </div>

    </div>
  )
}

export default Fornecedores