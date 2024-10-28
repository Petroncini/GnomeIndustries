import React from 'react'
import { MenuConta, MenuContaPaga } from '@/components'
import Image from 'next/image'
import Link from 'next/link'
import { fetchContas, fetchForName } from '@/app/lib/data'
import { AddContaFor } from '@/app/lib/actions'


var stl_container = "shadow-md w-full h-full px-5 py-5 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-2"


const TodasAsContas = async ({ params }) => {

  const { id } = params
  const contaFor = await fetchForName(id)
  const contas = await fetchContas();
  const compareDates = (a, b) => a.due_date - b.due_date;

  return (
    <div className='overflow-hidden px-10'>
      <div className='relative flex flex-row space-x-3'>
        <h1>{contaFor.name}</h1>
        <form action={AddContaFor} className='pt-8'>
            <input type="hidden" name='name' value={contaFor.name} />
            <input type="hidden" name='id' value={id} />

            <button type='submit'><Image src="/img_plus.png" alt="" width={30} height={30} /></button>
        </form>
        <p className='absolute right-72 top-8'>Pagamento | Vencimento</p>
      </div>

        <div className={stl_container}>
            {contas.sort(compareDates).reverse().map((conta) => {
              if (conta.name.includes(contaFor.name) && conta.type === 'for') {
                  if (conta.pag === false) {
                    return (
                      <MenuConta
                        key={conta.id}
                        img='for'
                        name={conta.name ? conta.name : 'Sem Nome'}
                        scd={conta.scd ? conta.scd : 'Sem Codigo de Barras'}
                        date={conta.due_date ? conta.due_date : new Date(10,10,5) }
                        total={conta.total ? conta.total : '0,00'}
                        id={conta.id}
                        url={conta.bol}
                      />
                    );
                  }

                  if (conta.pag === true) {
                    return (
                      <MenuContaPaga
                        key={conta.id}
                        img='for'
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
                  }
              } else {
                return null; // or some other placeholder if you don't want to render anything
              }
            })}
        </div>

    </div>
  )
}

export default TodasAsContas