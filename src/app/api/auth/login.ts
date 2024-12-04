import axios from "axios";
import { LoginResponse } from "@/auth";
import { useMutation } from 'react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginCredentials): Promise<LoginResponse> => {
  try {
    const { data } = await api.get('/users', {
      params: { email, password }
    });

    const user = data.find((user: any) => user.email_usuario === email && user.senha_usuario === password);

    if (user) {
      return { 
        success: true, 
        user: {
          id: user.id_usuario,
          email: user.email_usuario,
          name: user.nome_usuario,
          password: user.senha_usuario,
        }
      };
    }

    return { 
      success: false, 
      message: 'Credenciais inválidas' 
    };
  } catch (error) {
    console.error('Erro durante o login:', error);
    return { 
      success: false, 
      message: 'Erro ao tentar fazer login' 
    };
  }
};

export const useLogin = () => {
  return useMutation(
    (credentials: LoginCredentials) => login(credentials),
    {
      onError: (error) => {
        console.error('Erro na mutation de login:', error);
      },
    }
  );
};