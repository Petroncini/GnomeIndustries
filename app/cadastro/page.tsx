import React from 'react'
import Link from 'next/link'
import { CreateUser } from '../lib/actions'

const CadastroPage = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-indigo-950'>
      <div className='relative bg-gray-300 w-[360px] h-[350px] shadow-lg rounded-lg'>
        <h1 className='absolute left-[22%]'>Cadastro</h1>

        <form action={CreateUser} className='flex flex-col space-y-4 pt-24 pl-10'>

          <div className='flex flex-row w-[250px] items-center justify-center space-x-2'>
            <label className='text-lg'>Nome:</label>
            <input type='text' name='name' className='bg-gray-100 w-[220px] h-[40px] rounded-md' required></input>
          </div>
          
          <div className='flex flex-row w-[250px] items-center justify-center space-x-2'>
            <label className='text-lg'>Email:</label>
            <input type='email' name='email' className='bg-gray-100 w-[220px] h-[40px] rounded-md' required></input>
          </div>

          <div className='flex flex-row w-[250px] items-center justify-center space-x-2'>
            <label className='text-lg'>Senha:</label>
            <input type='password' name='password' className='bg-gray-100 w-[220px] h-[40px] rounded-md' required></input>
          </div>

          <button
          className='absolute right-3 bottom-5 bg-indigo-800 p-3 w-32 text-center rounded text-white border border-indigo-900 hover:bg-indigo-700 transition-all'>
          Cadastrar
          </button>

        </form>
        
      </div>
    </div>

  )
}

export default CadastroPage