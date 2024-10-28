import { MenuConta, MenuContaPaga } from "@/components";
import { fetchContas } from '@/app/lib/data';
import Image from 'next/image'


function condToday(date) {
  const today = new Date()
  if ((date < today.getTime()) && (date - today.getTime() > -86400000)){
    return true;
  } else {
    return false;
  }
}

export default async function Contas() {
  var stl_container_home = "relative shadow-md w-full h-full px-5 py-2 rounded-lg border border-gray-300 overflow-auto bg-gray-50 space-y-0"
  var stl_sub_container = 'w-full border-b border-gray-400 pt-2 flex flex-row items-center bg-gray-50 relative'

  const contas = await fetchContas();

  const today = new Date()
  today.setHours(0, 0, 0, 0) //86400000

  var venTotal = 0;
  var vnTotal = 0;

  // Calculate total
  contas.forEach((conta) => {
    if (condToday(conta.due_date.getTime()) && conta.pag ===false) {
      venTotal += conta.total;
    }

    if ((conta.due_date.getTime() - today.getTime() + 86400000 < 0) && conta.pag ===false) {
      vnTotal += conta.total;
    }

  });


  return (
    <div className="relative space-y-4">

      <div className='px-10 w-[1280px] min-w-[300px] h-[600px]'>

        <div className={stl_container_home}>
          <div className=" relative flex flex-row space-x-5 pb-3">
            <h1 className="text-3xl">Ordens de serviço disponíveis</h1>
            <p className="absolute bottom-0 right-72">Data limite</p>
            <p className="absolute bottom-0 right-20">Máquina</p>
          </div>

          {contas.map((conta) => {
              if (conta.pag === true && conta.type ==='for') {
                return (
                <MenuContaPaga
                  key={conta.id}
                  img='fix'
                  name="Nome da Ordem"
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
