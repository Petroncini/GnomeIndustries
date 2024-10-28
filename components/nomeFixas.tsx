'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DelFixName, DelForName } from '@/app/lib/actions';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


type NFixas = {
    name: string;
    tog: string;
    id: string;
}


var stl_sub_container = 'relative w-full border-b border-gray-400 pt-5 flex flex-row items-center bg-gray-50'


const NomeFixas: React.FC<NFixas> = props => {

    const router = useRouter();

    //********************************************************************************************************************* */

    const DelNameAction = (formData : FormData) => {
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
          if (props.tog === 'fix'){
            DelFixName(formData);
          }
          if (props.tog === 'for'){
            DelForName(formData);
          }
          router.refresh();
          Swal.fire("Deletada", "", "success");
        }
      });
  
    }
  
    //********************************************************************************************************************* */




    var lin = ''
    if (props.tog === 'fix'){
      lin = `/contas/fixas/${props.id}`
    }
    if (props.tog === 'for'){
      lin = `/contas/fornecedores/${props.id}`
    }
    
    const n = props.name
    const svg_l = n.split('')[0]
    const svg_path = `/alphabet/fi-sr-circle-${svg_l}.svg`
  return (
    <div className='flex flex-col items-center justify-center'>

        <div className={stl_sub_container}>
            <Link className='flex flex-row' href={lin} style={{ cursor: 'pointer' }}>
                <span className=''><Image src={svg_path} alt="" width={30} height={30} /></span>
                <p className='pl-4 text-2xl'>{props.name}</p>
            </Link>

            {props.tog === 'fix' ? (
              <form action={DelNameAction} className='absolute right-5 top-3'>
                  <input type="hidden" name='id' value={props.id} />
                  <input type="hidden" name='name' value={props.name} />

                  <button className='bg-red-600 p-1 w-16 text-center rounded text-white'>
                  Deletar
                  </button>
              </form>


            ) : (
              <form action={DelNameAction} className='absolute right-5 top-3'>
                  <input type="hidden" name='id' value={props.id} />
                  <input type="hidden" name='name' value={props.name} />

                  <button className='bg-red-600 p-1 w-16 text-center rounded text-white'>
                  Deletar
                  </button>
              </form>
            )}
            
        </div>
    </div>
  )
}

export default NomeFixas