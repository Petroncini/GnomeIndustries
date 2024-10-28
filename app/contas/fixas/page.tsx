import React from 'react'
import { NomeFixas } from '@/components'
import Image from 'next/image';
import Link from 'next/link';
import { fetchFixNames } from '@/app/lib/data';

var stl_container = "shadow-md w-full h-full px-5 py-5 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-2"

const Fixas = async () => {

  const fixNames = await fetchFixNames();

  return (
    <div className='overflow-hidden px-10'>

      <div className={stl_container}>
          <div className='flex flex-row space-x-3'>
            <h1>Contas Fixas</h1>
            <Link href={'/contas/fixas/add'} className='pt-8'>
                <span><Image src="/img_plus.png" alt="" width={30} height={30} /></span>
            </Link>
          </div>

          {fixNames.reverse().map((fixName) => (
            <NomeFixas key={fixName.id}
            name={fixName.name ? fixName.name : 'Sem Nome'}
            tog='fix'
            id={fixName.id} />
          ))}
      </div>

    </div>
  )
}

export default Fixas