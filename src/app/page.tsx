"use client";

import FooterNavigation from "@/app/TelaLogin/TelaHome/TelaPerfil/components/FooterNavigation";
import HeaderNavigation from "@/components/HeaderNavigation";
import Image from "next/image";

import { useEffect, useState } from "react";
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function Home() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`{API_URL}users`);
        if (response.status === 200 && response.data) {
          setUsers(response.data);
        } else {
          null;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Erro na requisição:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
        } else {
          console.error("Erro desconhecido:", error);
        }
      }
    };

    fetchUsers();
  }, []);
  return (
    <main className="flex w-screen min-h-screen flex-col bg-fund items-center">
      <HeaderNavigation />
      <section className="w-full flex flex-col items-center mt-10">
        <div className="w-10/12 max-w-2xl 2xl:max-w-5xl mt-10">
          <Image src="/capa.png" alt="Capa" layout="responsive" width={768} height={600} objectFit="contain" />
        </div>
        <div className="text-center text-txt mt-4 text-lg border-b border-stone-900">
          <h2>Muito Prazer,<br />
            <b>Chegou a sua nova plataforma de TROCA DE ÓLEO</b>
          </h2>
        </div>
      </section>
      <FooterNavigation />
    </main>
    );
  }