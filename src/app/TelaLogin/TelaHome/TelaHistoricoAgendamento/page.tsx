'use client'
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TelaAgendamento from "../TelaAgendamento/page";
import { Agendamento, User } from '@/auth';
import axios from "axios";
import HeaderNavigation from "@/components/HeaderNavigation";
import useAgendamentosUsuario, { AgendamentoResumido } from "./components/useAgendamentos";



export default function TelaHistoricoAgendamento() {

    const { data: session } = useSession();
    const [user, setUser] = useState<User>();
    const { agendamentos } = useAgendamentosUsuario();

    useEffect(() => {
        const fetchUsers = async () => {
            if (session?.user?.email) {
                try {
                    const response = await axios.get(`https://json-serv-0f8cbf4ce8d8.herokuapp.com/usuarios?email=${session?.user?.email}`);
                    const userData = response.data;
                    if (userData) {
                        setUser(userData);
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuario:', error);
                }
            };
        };
        fetchUsers();
    }, [session]);

    if (!session?.user?.email) {
        return <p>Você não está autenticado.</p>;
    }

    if (!user) {
        return <p>Carregando...</p>;
    }

    if (user.agendamentos && user.agendamentos.length === 0) {
        return <TelaAgendamento />;
    } else {
        return (
            <main className="bg-fund w-full h-full">
                {agendamentos && agendamentos.length > 0 ? (
                    <><HeaderNavigation />
                    <div className="flex flex-col items-center mt-4 h-full">
                        <div className='flex justify-center items-center w-full py-2 border-b border-stone-900'>
                            <h2 className='text-txt text-center text-2xl'>Meus Agendamentos</h2>
                        </div>
                        <ul className="w-full h-screen max-w-2xl">
                            {agendamentos.map((agendamento: AgendamentoResumido) => (
                                <li key={agendamento.id_oficina} className="bg-white shadow-lg rounded-lg p-4 m-2 text-txt">
                                    <p className="text-txt"><strong> Modelo:</strong>{agendamento.modelo_veiculo}</p>
                                    <p className="text-txt"><strong>Oficina:</strong> {agendamento.nome_oficina}</p>
                                    <p className="text-txt"><strong>Data:</strong> {agendamento.data_agendamento}</p>
                                    <p className="text-txt"><strong>Tipo de Manutenção:</strong> {agendamento.tipo_manutencao}</p>
                                    <p className="text-txt"><strong>Status:</strong> {agendamento.status}</p>
                                </li>
                            ))}
                        </ul>
                    </div></>
                ) : (
                    <TelaAgendamento />
                )}
            </main>
        )
    }
}