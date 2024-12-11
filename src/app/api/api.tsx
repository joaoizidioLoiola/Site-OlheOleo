import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id_usuario?: number;
  cpf_usuario: string;
  nome_usuario: string;
  email_usuario: string;
  telefone_usuario: string;
  senha_usuario: string;
  tipo_usuario: number;
}

export interface Veiculo {
  veiculo_id?: number;
  veiculo_marca: string;
  veiculo_modelo: string;
  veiculo_cor: string;
  veiculo_placa: string;
  veiculo_motor: string;
  veiculo_km: number;
  id_usuario: number;
  usuario?: User;
}

export interface RegisterUserData {
  cpf_usuario: string;
  nome_usuario: string;
  tipo_usuario: number;
  email_usuario: string;
  telefone_usuario: string;
  senha_usuario: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const queryKeys = {
  users: 'users',
  veiculos: 'veiculos',
  userVeiculos: (userId: string) => ['veiculos', userId],
};

const apiCalls = {
  // Usuários
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    return data;
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const { data } = await api.post('/users', user);
    return data;
  },

  updateUser: async (user: User): Promise<User> => {
    if (!user.id_usuario) {
      throw new Error('ID do usuário é obrigatório');
    }
  
    // Remove o id_usuario do payload mas mantém na URL
    const { id_usuario, ...payload } = user;
    
    try {
      const { data } = await api.patch(`/users/${id_usuario}`, payload);
      return data;
    } catch (error) {
      console.error('Erro na atualização:', error);
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Veículos
  getAllVeiculos: async (): Promise<Veiculo[]> => {
    const { data } = await api.get('/veiculos');
    return data;
  },

  getVeiculoById: async (id: string): Promise<Veiculo> => {
    const { data } = await api.get(`/veiculos/${id}`);
    return data;
  },

  createVeiculo: async (veiculo: Omit<Veiculo, 'veiculo_id'>): Promise<Veiculo> => {
    const payload = {
      veiculo_marca: veiculo.veiculo_marca,
      veiculo_modelo: veiculo.veiculo_modelo,
      veiculo_cor: veiculo.veiculo_cor,
      veiculo_placa: veiculo.veiculo_placa,
      veiculo_motor: veiculo.veiculo_motor,
      veiculo_km: Number(veiculo.veiculo_km),
      id_usuario: veiculo.id_usuario
    };

    const { data } = await api.post('/veiculos', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return data;
  },

  updateVeiculo: async (veiculo: Veiculo): Promise<Veiculo> => {
    if (!veiculo.veiculo_id) {
      throw new Error('ID do veículo é obrigatório');
    }
  
    // Remove campos desnecessários e formata o payload
    const payload = {
      veiculo_marca: veiculo.veiculo_marca,
      veiculo_modelo: veiculo.veiculo_modelo,
      veiculo_cor: veiculo.veiculo_cor,
      veiculo_placa: veiculo.veiculo_placa,
      veiculo_motor: veiculo.veiculo_motor,
      veiculo_km: Number(veiculo.veiculo_km),
      id_usuario: veiculo.id_usuario
    };
  
    try {
      const { data } = await api.patch(`/veiculos/${veiculo.veiculo_id}`, payload);
      return data;
    } catch (error) {
      console.error('Erro na atualização:', error);
      throw error;
    }
  },

  deleteVeiculo: async (id: string): Promise<void> => {
    try {
      await api.delete(`/veiculos/${id}`);
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      throw error;
    }
  },
};

export const useUsers = () => {
  return useQuery(queryKeys.users, apiCalls.getUsers, {
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useUser = (id: string) => {
  return useQuery(['user', id], () => apiCalls.getUserById(id), {
    enabled: !!id,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const { data } = await api.post('/auth/login', { email, password });
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['user', data.user.id], data.user);
      },
    }
  );
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (userData: Omit<User, 'id_usuario'>) => {
      const url = `${API_URL}users`;

      const cpfLimpo = userData.cpf_usuario.replace(/\D/g, '');
      const telefoneLimpo = userData.telefone_usuario.replace(/\D/g, '');
      
      // Criar payload simplificado
      const userDataToSend: RegisterUserData = {
        cpf_usuario: cpfLimpo,
        nome_usuario: userData.nome_usuario,
        tipo_usuario: 1,
        email_usuario: userData.email_usuario,
        senha_usuario: userData.senha_usuario,
        telefone_usuario: telefoneLimpo
      };

      // Fazer requisição POST direta
      const response = await api.post(url, userDataToSend);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
      onError: (error: Error) => {
        console.error('Erro no registro:', error);
      }
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(apiCalls.updateUser, {
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries(queryKeys.users);
      queryClient.invalidateQueries(['user', updatedUser.id_usuario]);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(async (id: string) => {
    // Deletar veículos do usuário
    const veiculos = await apiCalls.getAllVeiculos();
    const userVeiculos = veiculos.filter(veiculo => veiculo.id_usuario === Number(id));
    await Promise.all(userVeiculos.map(veiculo => apiCalls.deleteVeiculo(veiculo.veiculo_id!.toString())));

    // Deletar usuário
    await apiCalls.deleteUser(id);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users);
    },
  });
};

/*
Use Veiculos
*/ 

export const useVeiculos = (userId?: string) => {
  return useQuery(
    ['veiculos', userId],
    async () => {
      const { data } = await api.get('/veiculos');
      return data.filter((veiculo: Veiculo) => veiculo.id_usuario === Number(userId));
    },
    {
      enabled: !!userId,
    }
  );
};

export const useCreateVeiculo = () => {
  const queryClient = useQueryClient();
  
  return useMutation(apiCalls.createVeiculo, {
    onSuccess: (newVeiculo) => {
      queryClient.invalidateQueries(queryKeys.veiculos);
      queryClient.invalidateQueries(queryKeys.userVeiculos(newVeiculo.id_usuario.toString()));
    },
  });
};

export const useUpdateVeiculo = () => {
  const queryClient = useQueryClient();
  
  return useMutation(apiCalls.updateVeiculo, {
    onSuccess: (updatedVeiculo) => {
      queryClient.invalidateQueries(queryKeys.veiculos);
      queryClient.invalidateQueries(['veiculo', updatedVeiculo.veiculo_id]);
      queryClient.invalidateQueries(queryKeys.userVeiculos(updatedVeiculo.id_usuario.toString()));
    },
  });
};

export const useDeleteVeiculo = () => {
  const queryClient = useQueryClient();
  
  return useMutation(apiCalls.deleteVeiculo, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.veiculos);
    },
  });
};

export default apiCalls;