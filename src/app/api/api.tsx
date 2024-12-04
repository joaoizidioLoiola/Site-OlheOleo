import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id_usuario?: string;
  cpf_usuario: string;
  nome_usuario: string;
  email_usuario: string;
  telefone_usuario: string;
  senha_usuario: string;
  tipo_usuario: number;
}

export interface Veiculo {
  veiculo_id: string;
  veiculo_marca: string;
  veiculo_modelo: string;
  veiculo_cor: string;
  veiculo_placa: string;
  veiculo_motor: string;
  veiculo_km: number;
  id_usuario: string;
  usuario: User;
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
    const { data } = await api.put(`/users/${user.id_usuario}`, user);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Veículos
  getVeiculos: async (): Promise<Veiculo[]> => {
    const { data } = await api.get('/veiculos');
    return data;
  },

  getVeiculoById: async (id: string): Promise<Veiculo> => {
    const { data } = await api.get(`/veiculos/${id}`);
    return data;
  },

  createVeiculo: async (veiculo: Omit<Veiculo, 'id'>): Promise<Veiculo> => {
    const { data } = await api.post('/veiculos', veiculo);
    return data;
  },

  updateVeiculo: async (veiculo: Veiculo): Promise<Veiculo> => {
    const { data } = await api.put(`/veiculos/${veiculo.veiculo_id}`, veiculo);
    return data;
  },

  deleteVeiculo: async (id: string): Promise<void> => {
    await api.delete(`/veiculos/${id}`);
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
      
      // Criar payload simplificado
      const userDataToSend: RegisterUserData = {
        cpf_usuario: userData.cpf_usuario,
        nome_usuario: userData.nome_usuario,
        tipo_usuario: 1,
        email_usuario: userData.email_usuario,
        senha_usuario: userData.senha_usuario,
        telefone_usuario: userData.telefone_usuario
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
  
  return useMutation(apiCalls.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.users);
    },
  });
};

export const useVeiculos = () => {
  return useQuery(queryKeys.veiculos, apiCalls.getVeiculos, {
    staleTime: 1000 * 60 * 5,
  });
};

export const useVeiculo = (id: string) => {
  return useQuery(['veiculo', id], () => apiCalls.getVeiculoById(id), {
    enabled: !!id,
  });
};

export const useCreateVeiculo = () => {
  const queryClient = useQueryClient();
  
  return useMutation(apiCalls.createVeiculo, {
    onSuccess: (newVeiculo) => {
      queryClient.invalidateQueries(queryKeys.veiculos);
      queryClient.invalidateQueries(queryKeys.userVeiculos(newVeiculo.id_usuario));
    },
  });
};

export const useUpdateVeiculo = () => {
  const queryClient = useQueryClient();
  
  return useMutation(apiCalls.updateVeiculo, {
    onSuccess: (updatedVeiculo) => {
      queryClient.invalidateQueries(queryKeys.veiculos);
      queryClient.invalidateQueries(['veiculo', updatedVeiculo.veiculo_id]);
      queryClient.invalidateQueries(queryKeys.userVeiculos(updatedVeiculo.id_usuario));
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