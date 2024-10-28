import React from 'react'
import { AddFixName } from '@/app/lib/actions'

const AddFixPage = () => {


  return (
    <div className='w-screen h-screen px-[430px] pt-20 bg-gray-200'>
      <div className='relative bg-indigo-800 w-[400px] h-[520px] shadow-lg rounded-lg'>

        <div className='absolute left-10 top-10 flex w-[80%] h-full'>
          
          <form action={AddFixName} className='flex flex-col w-full h-full items-center space-y-10'>
            <input 
            className='rounded-md w-full h-[40px]'
            type="text" placeholder='Nome' name='name' required />

            <button type='submit'
            className='bg-gray-100 p-3 w-32 text-center rounded text-black border border-gray-500 hover:bg-gray-300 transition-all'>
            Criar
            </button>
          </form>

        </div>
        
      </div>
    </div>

  )
}

export default AddFixPage