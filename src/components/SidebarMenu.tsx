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
      flag.style.color = 'white'
    }
  }

  loadRoutes()

  return (
    <div className="fixed top-[60px] left-0 w-full h-full flex flex-col items-start justify-start p-1 bg-fund text-txt">
      <Link href="/">
        <div id='/' className="flex items-center border-b border-stone-900 w-screen py-2">
          <img src="/homeIcon.svg" alt="" className="cursor-pointer mr-2" />
          <p>Home</p>
        </div>
      </Link>
      <Link href="/TelaLogin/TelaHome/TelaMeusVeiculos">
        <div id='/TelaLogin/TelaHome/TelaMeusVeiculos' className="flex items-center border-b border-stone-900 w-screen py-2">
          <img src="/carIcon.svg" alt="" className="cursor-pointer mr-2" />
          <p>Meus Veículos</p>
        </div>
      </Link>
      <Link href="/TelaLogin/TelaHome/TelaHistoricoAgendamento">
        <div id='/TelaLogin/TelaHome/TelaHistoricoAgendamento' className="flex items-center border-b border-stone-900 w-screen py-2 ">
          <img src="/calendarioIcon.svg" alt="" className="cursor-pointer mr-2" />
          <p>Meus Agendamentos</p>
        </div>
      </Link>
      <Link href="/TelaLogin/TelaHome/TelaPerfil">
        <div id='/TelaLogin/TelaHome/TelaPerfil' className="flex items-center border-b border-stone-900 w-screen py-2">
          <CgProfile className='cursor-pointer mr-2 w-[40px] h-[40px]' style={{fontSize: '40px'}} />
          <p>Perfil</p>
        </div>
      </Link>
      <Link href="/">
        <div onClick={handleLogout} className="flex items-center border-b border-stone-900 w-screen py-2 cursor-pointer">
          <img src="/loginIcon.svg" alt="" className="cursor-pointer mr-2" />
          <p>Sair</p>
        </div>

      </Link>
    </div>
  )
}