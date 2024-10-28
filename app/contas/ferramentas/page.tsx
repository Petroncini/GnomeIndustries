import React from 'react'
import { MenuConta } from '@/components'
import { fetchContas } from '@/app/lib/data';


var stl_container = "shadow-md w-full h-full px-5 py-5 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-2"
var stl_container_home = "relative shadow-md w-full h-full px-5 py-2 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-0"


const ContasAPagar = async () => {
  const contas = await fetchContas();
  const compareDates = (a: { due_date: number; }, b: { due_date: number; }) => a.due_date - b.due_date;

  let forTotal = 0;
  let fixTotal = 0;
  let varTotal = 0;

  contas.forEach((conta) => {
    if (conta.pag === false && conta.type ==='for') {
      forTotal += conta.total;
    }

    if (conta.pag === false && conta.type ==='fix') {
      fixTotal += conta.total;
    }

    if (conta.pag === false && conta.type ==='var') {
      varTotal += conta.total;
    }

  });


  return (
    <div className="relative space-y-4">

      <div className='px-10 w-[1280px] min-w-[300px] h-[600px]'>

        <div className={stl_container_home}>
          <div className=" relative flex flex-row space-x-5 pb-3">
            <h1 className="text-3xl">Ferramentas</h1>
          </div>

          {contas.map((conta) => {
              if (conta.pag === true && conta.type ==='for') {
                return (
                <MenuConta
                  key={conta.id}
                  img={conta.type}
                  name="Nome da Ordem"
                  scd={conta.scd ? conta.scd : 'Sem Codigo de Barras'}
                  date={conta.due_date ? conta.due_date : new Date(10, 10, 5)}
                  total={conta.total ? conta.total : 0}
                  id={conta.id}
                  url={conta.bol}
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

export default ContasAPagar