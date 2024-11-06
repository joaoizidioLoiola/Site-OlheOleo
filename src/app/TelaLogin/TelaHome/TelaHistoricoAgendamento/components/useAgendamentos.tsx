// useAgendamentosUsuario.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react"

export interface AgendamentoResumido {
    id_oficina: string;
    modelo_veiculo: string;
    nome_oficina: string;
    data_agendamento: string;
    tipo_manutencao: string;
    status: string
}

const useAgendamentosUsuario = () => {
    const [agendamentos, setAgendamentos] = useState<AgendamentoResumido[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await axios.get(`https://server-bancojs-ed773394a807.herokuapp.com/usuarios?email=${session?.user?.email}`);
                const userData = response.data[0];
                if (userData && userData.agendamentos) {
                    setAgendamentos(userData.agendamentos);
                }
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        };
        if (session?.user?.email) {
            fetchAgendamentos();
        }
    }, [session]);

    return { agendamentos };
};

export default useAgendamentosUsuario;
