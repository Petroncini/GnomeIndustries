import React from 'react'
import { MenuConta, MenuContaPaga } from '@/components'
import { fetchFixName, fetchContas } from '@/app/lib/data'


var stl_container = "shadow-md w-full h-full px-5 py-5 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-2"


const ContaFixa = async ({ params }) => {

  const { id } = params
  const contaFixa = await fetchFixName(id)
  const contas = await fetchContas();
  const compareDates = (a, b) => a.due_date - b.due_date;

  return (
    <div className='relative overflow-hidden px-10'>
        <div className='flex flex-row'>
          <h1>{contaFixa.name}</h1>
          <p className='ml-auto pt-8 pr-72'>Pagamento | Vencimento</p>
        </div>

        <div className={stl_container}>

            {contas.sort(compareDates).reverse().map((conta) => {
              if (conta.name.includes(contaFixa.name) && conta.type === 'fix') {
                if (conta.pag === false) {
                  return (
                    <MenuConta
                      key={conta.id}
                      img='fix'
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
                      img='fix'
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
                return null;
              }
            })}
        </div>


    </div>
  )
}


export default ContaFixa