import React from 'react'
import { MenuConta, MenuContaPaga } from '@/components'
import Image from 'next/image'
import { fetchContas } from '@/app/lib/data'
import Link from 'next/link'


var stl_container = "shadow-md w-full h-full px-5 py-5 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-2"


const ContasVariadas = async () => {

  const contas = await fetchContas();

  return (
    <div className='overflow-hidden px-10'>

        <div className={stl_container}>
          <div className='flex flex-row space-x-3'>
            <h1>Contas Variadas</h1>
            <Link href={'/contas/variadas/add'} className='pt-8'>
                <span><Image src="/img_plus.png" alt="" width={30} height={30} /></span>
            </Link>
            <p className='pt-8 pl-80'>Pagamento | Vencimento</p>
          </div>

          {contas.reverse().map((conta) => {
              if (conta.type === 'var' && conta.pag === false) {
                return (
                  <MenuConta
                    key={conta.id}
                    img={conta.type}
                    name={conta.name ? conta.name : 'Sem Nome'}
                    scd={conta.scd ? conta.scd : 'Sem Codigo de Barras'}
                    date={conta.due_date ? conta.due_date : new Date(10,10,5) }
                    total={conta.total ? conta.total : 0}
                    id={conta.id}
                    url={conta.bol}
                  />
                );
              }

              if (conta.type === 'var' && conta.pag === true) {
                return (
                  <MenuContaPaga
                  key={conta.id}
                  img={conta.type}
                  name={conta.name ? conta.name : 'Sem Nome'}
                  scd={conta.scd ? conta.scd : 'Sem Codigo de Barras'}
                  date={conta.due_date ? conta.due_date : new Date(10,10,5) }
                  pDate={conta.pag_date ? conta.pag_date : new Date(10, 10, 5)}
                  total={conta.total ? conta.total : '0,00'}
                  id={conta.id}
                  url={conta.bol}
                  curl={conta.comp}
                  />
                );
              } else {
                return null; // or some other placeholder if you don't want to render anything
              }
            })}
        </div>

    </div>
  )
}

export default ContasVariadas