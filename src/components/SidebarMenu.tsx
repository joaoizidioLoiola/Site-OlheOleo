/* eslint-disable @next/next/no-img-element */
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { CgProfile } from "react-icons/cg";
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";


export default function SidebarMenu() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 sm:max-w-sm  w-full z-10 scroll flex flex-col items-start justify-between bg-fund_sidebar text-txt overflow-x-hidden sm:border-r-4 sm:border-gray-300">
      <div className='w-full'>
        {/* HOME */}
        <div className='block p-2 overflow-hidden w-full'>
          <Link href="/">
            <div  id='/' className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer hover:bg-gray-500 hover:bg-opacity-20">
              <img src="/homeIcon.svg" alt="" className="cursor-pointer mr-2" />
              <p>Home</p>
            </div>
          </Link>
        </div>

        {session && (
          /* MEUS VEICULOS */
          <div className='w-full p-2 overflow-hidden'>
            <Link href="/TelaLogin/TelaHome/TelaMeusVeiculos">
              <div id='/TelaLogin/TelaHome/TelaMeusVeiculos' className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full hover:bg-gray-500 hover:bg-opacity-20">
                <img src="/carIcon.svg" alt="" className="cursor-pointer mr-2" />
                <p>Meus Veículos</p>
              </div>
            </Link>
          </div>
        )}

        {session && (
          /* MEUS AGENDAMENTOS */
          <div className='w-full p-2 overflow-hidden'>
            <Link href='/TelaLogin/TelaHome/TelaHistoricoAgendamento'>
              <div id='/TelaLogin/TelaHome/TelaHistoricoAgendamento' className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full hover:bg-gray-500 hover:bg-opacity-20">
                <img src="/calendarioIcon.svg" alt="" className="cursor-pointer mr-2" />
                <p>Meus Agendamentos</p>
              </div>
            </Link>
          </div>
        )}

        {session && (
          /* PERFIL */
          <div className='w-full p-2 overflow-hidden'>
            <Link href="/TelaLogin/TelaHome/TelaPerfil">
              <div id='/TelaLogin/TelaHome/TelaPerfil' className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full hover:bg-gray-500 hover:bg-opacity-20">
                <CgProfile className='cursor-pointer mr-2 w-[40px] h-[40px]' style={{ fontSize: '40px' }} />
                <p>Perfil</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {session && (
        /* LOGOUT */
        <div className='w-full px-2 pb-2 overflow-hidden group'>
          <Link href="/">
            <div onClick={handleLogout} className="flex p-2 rounded-md items-center border-stone-900 cursor-pointer w-full group-hover:bg-red-600 group-hover:bg-opacity-20">
              <img src="/loginIcon.svg" alt="" className="cursor-pointer mr-2" />
              <p>Sair</p>
            </div>
          </Link>
        </div>
      )}

    </div>
  )
}