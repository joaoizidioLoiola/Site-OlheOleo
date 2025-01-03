/* eslint-disable @next/next/no-img-element */
"use client"
import { useState } from "react";
import { IoReorderThree, IoCloseSharp } from "react-icons/io5";
import SidebarMenu from './SidebarMenu';
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HeaderNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full fixed z-40">
      <div className="bg-txt flex items-center justify-between p-2 border-b border-grid">
        <div className='cursor-pointer' onClick={toggleMenu} style={{ minWidth: '2.5rem' }}>
          {isOpen ? <IoCloseSharp className="text-5xl text-fund" /> : <IoReorderThree className="text-5xl text-fund" />}
        </div>
        <div className="flex-grow flex justify-center items-center">
          <img src="/logo.png" alt="Logo" className="w-32 h-10" />
        </div>
        <section style={{ minWidth: '2.5rem' }}>
          <div className="flex items-center space-x-4 justify-end">
            {status === "loading" ? (
              <span className='text-white mr-3'>Carregando...</span>
            ) : session ? (
              <span className='text-white'>Olá {session.user?.name}</span>
            ) : (
              <div className="flex space-x-2 mr-3">
                <Link href="/TelaLogin" className="text-white">Entrar</Link>
                <span className='text-gray-400 hidden sm:block'>ou</span>
                <Link href="/TelaCadastro" className="text-white hidden sm:block">Cadastrar-se</Link>
              </div>
            )}
          </div>
        </section>
      </div>
      {isOpen && (
        <SidebarMenu />
      )}
    </header>
  );
}