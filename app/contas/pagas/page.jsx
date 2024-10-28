import React from 'react'
import { MenuContaPaga } from '@/components'
import { fetchContas } from '@/app/lib/data';


var stl_container = "shadow-md w-full h-full px-5 py-5 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-2"

/*
{contas.sort(compareDates).reverse().map((conta) => {
    if (conta.pag === true) {
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
*/


const Pagas = async () => {

  const contas = await fetchContas();
  const compareDates = (a, b) => a.pag_date - b.pag_date;

  return (
    <div className='overflow-hidden px-10'>

        <div className={stl_container}>
        <h1 className='pt-3 pb-0 text-5xl'>Contas Pagas</h1>

        <div className='pt-5'>
          <div className='relative flex flex-row pb-5 border-2 border-gray-500 rounded-md'>
            <p className="pl-1 text-xl">Fornecedores</p>
            <p className='absolute top-0 right-[24%] font-bold text-sm'>Vencimento</p>
            <p className='absolute top-0 right-[32%] font-bold text-sm'>Pagamento</p>
          </div>

          {contas.sort(compareDates).map((conta) => {
            if (conta.pag === true && conta.type ==='for') {
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
              return null;
              }
          })}
        </div>

        <div className='relative pt-3'>
          <div className='relative flex flex-row pb-5 border-2 border-gray-500 rounded-md'>
            <p className="pl-1 text-xl">Fixas</p>
            <p className='absolute top-0 right-[24%] font-bold text-sm'>Vencimento</p>
            <p className='absolute top-0 right-[32%] font-bold text-sm'>Pagamento</p>
          </div>

          {contas.sort(compareDates).map((conta) => {
            if (conta.pag === true && conta.type ==='fix') {
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
              return null;
              }
          })}
        </div>

        <div className='relative pt-3'>
          <div className='relative flex flex-row pb-5 border-2 border-gray-500 rounded-md'>
            <p className="pl-1 text-xl">Variadas</p>
            <p className='absolute top-0 right-[24%] font-bold text-sm'>Vencimento</p>
            <p className='absolute top-0 right-[32%] font-bold text-sm'>Pagamento</p>
          </div>

          {contas.sort(compareDates).map((conta) => {
            if (conta.pag === true && conta.type ==='var') {
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
              return null;
              }
          })}
        </div>
        </div>

    </div>
  )
}

export default Pagas