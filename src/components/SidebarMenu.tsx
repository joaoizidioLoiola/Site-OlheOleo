/* eslint-disable @next/next/no-img-element */
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { CgProfile } from "react-icons/cg";
import { useRouter, usePathname } from 'next/navigation'

export default function SidebarMenu() {
  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  const loadRoutes = () => {
    const flag = document.getElementById(usePathname())
    console.log(flag, usePathname())
    if(flag != null){
      flag.style.color = 'blue'
    }
  }

  loadRoutes()

  return (
    <div className="fixed top-[64px] bottom-0 left-0 sm:max-w-lg sm:min-w-lg z-10 scroll flex flex-col items-start justify-between bg-fund_sidebar text-txt overflow-x-hidden">
      <div className='sm:max-w-lg'>
        {/* HOME */}
        <div className='w-full p-2 overflow-hidden'>
          <Link href="/">
            <div className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full hover:bg-blue-600 hover:bg-opacity-20">
              <img src="/homeIcon.svg" alt="" className="cursor-pointer mr-2" />
              <p>Home</p>
            </div>
          </Link>
        </div>

        {/* MEUS VEICULOS */}
        <div className='w-full p-2 overflow-hidden'>
          <Link href="/TelaLogin/TelaHome/TelaMeusVeiculos">
            <div id='/TelaLogin/TelaHome/TelaMeusVeiculos' className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full hover:bg-blue-600 hover:bg-opacity-20">
              <img src="/carIcon.svg" alt="" className="cursor-pointer mr-2" />
              <p>Meus Veículos</p>
            </div>
          </Link>
        </div>

        {/* MEUS AGENDAMENTOS */}
        <div className='w-full p-2 overflow-hidden'>
          <Link href='/TelaLogin/TelaHome/TelaHistoricoAgendamento'>
            <div id='/TelaLogin/TelaHome/TelaHistoricoAgendamento' className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full hover:bg-blue-600 hover:bg-opacity-20">
              <img src="/calendarioIcon.svg" alt="" className="cursor-pointer mr-2" />
              <p>Meus Agendamentos</p>
            </div>
          </Link>
        </div>

        {/* PERFIL */}
        <div className='w-full p-2 overflow-hidden'>
          <Link href="/TelaLogin/TelaHome/TelaPerfil">
            <div id='/TelaLogin/TelaHome/TelaPerfil' className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full hover:bg-blue-600 hover:bg-opacity-20">
              <CgProfile className='cursor-pointer mr-2 w-[40px] h-[40px]' style={{fontSize: '40px'}} />
              <p>Perfil</p>
            </div>
          </Link>
        </div>
      </div>

      {/* LOGOUT */}
      <div className='w-full px-2 pb-2 overflow-hidden group'>
        <Link href="/">
          <div onClick={handleLogout} className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full group-hover:bg-red-600 group-hover:bg-opacity-20">
            <img src="/loginIcon.svg" alt="" className="cursor-pointer mr-2" />
            <p>Sair</p>
          </div>
        </Link>
      </div>

    </div>
  )
}