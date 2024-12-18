/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios'; 
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Agendamento, User } from '@/auth';
import { Veiculo } from '@/app/api/api';

const useVeiculos = (apiUrl: string) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  const [editedVeiculo, setEditedVeiculo] = useState<Veiculo | null>(null);
  const [user, setUser] = useState<User>();
  const [isEditMode, setIsEditMode] = useState(false);

  async function getVeiculos(email: string) {
    try {
      const response = await axios.get(apiUrl);
      const usuarios = response.data.find((usuarios: User) => usuarios.email_usuario === email);
      if (usuarios) {
        setVeiculos(usuarios.veiculos || []);
        setUser(usuarios);
      }
    } catch (error) {
      handleAxiosError(error); 
    }
  };

  const createVeiculo = async (email: string, veiculo: Veiculo) => {
    try {
      const response = await axios.get(`${apiUrl}?email=${email}`);
      const user = response.data[0];
      if (user) {
        user.veiculos.push(veiculo);
        await axios.put(`${apiUrl}/${user.id}`, user);
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      throw error;
    }
  };

  const deleteVeiculo = async (id: string) => {
    try {
      const email = session?.user?.email || '';
      const response = await axios.get(`${apiUrl}`);
      const user = response.data.find((usuarios: User) => usuarios.email_usuario === email);
      if (user) {
        const updatedVeiculos = user.veiculos.filter(
          (veiculo: Veiculo) => veiculo.veiculo_id !== Number(id)
        );
        await axios.put(`${apiUrl}/${user.id}`, {
          ...user,
          veiculos: updatedVeiculos,
        });
        setVeiculos(updatedVeiculos);
        setUser({ ...user, veiculos: updatedVeiculos });
      }
    } catch (error) {
      handleAxiosError(error); 
    }
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveChanges = async () => {
    try {
      const email = session?.user?.email || '';
      const response = await axios.get(apiUrl);
      const user = response.data.find((usuarios: User) => usuarios.email_usuario === email);
      if (user && editedVeiculo) {
        const updatedVeiculos = user.veiculos.map((veiculo: Veiculo) =>
          veiculo.veiculo_id === editedVeiculo.veiculo_id ? { ...editedVeiculo } : veiculo
        );
        await axios.put(`${apiUrl}/${user.id}`, {
          ...user,
          veiculos: updatedVeiculos
        });
        setVeiculos(updatedVeiculos);
        setEditedVeiculo(null);
        setIsEditMode(false);
      }
    } catch (error) {
      handleAxiosError(error); 
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Veiculo) => {
    if (editedVeiculo) {
      setEditedVeiculo({
        ...editedVeiculo,
        [field]: e.target.value
      });
    }
  };

  const handleEditVeiculo = (veiculo: Veiculo) => {
    setEditedVeiculo({ ...veiculo });
    setIsEditMode(true);
  };

  // const createAgendamento = async (agendamentoData: Agendamento) => {
  //   try {
  //     if (!user) {
  //       console.error('Usuário não autenticado.');
  //       return;
  //     }
  //     // Adicionar novo agendamento ao usuário existente
  //     // const novoUsuario: User = {
  //     //   ...user,
  //     //   agendamentos: user.agendamentos ? [...user.agendamentos, agendamentoData] : [agendamentoData],
  //     // };

  //     // Atualizar o usuário com o novo agendamento
  //     await axios.put(`${apiUrl}/${user.id}`, novoUsuario);

  //     // Atualizar o estado local do usuário
  //     setUser(novoUsuario);
  //   } catch (error) {
  //     console.error('Erro ao criar agendamento:', error);
  //     throw error;
  //   }
  // };

  useEffect(() => {
    const email = session?.user?.email || '';
    if (email) {
      getVeiculos(email);
    }
  }, [apiUrl, router, session]);

  const handleAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Erro de requisição:', axiosError.message);
      console.error('Detalhes do erro:', axiosError.response?.data);
    } else {
      console.error('Erro desconhecido:', error);
    }
  };

  return {
    veiculos,
    user,
    setVeiculos,
    getVeiculos,
    createVeiculo,
    deleteVeiculo,
    handleSaveChanges,
    handleToggleEditMode,
    handleChange,
    handleEditVeiculo,
    editedVeiculo,
    isEditMode,
  };
};

export default useVeiculos;
