import axios from 'axios';

const API_URL = process.env.API_URL;

export interface User {
  id: string;
  nome_usuario: string;
  cpf_usuario: string;
  email_usuario: string;
  telefone_usuario: string;
  senha_usuario: string;
  confirmPassword_usuario: string;
  veiculos?: any[];
  agendamentos?: any[];
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    password: string;
  };
}

interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    password: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const url = `${API_URL}users`;
  try {
    const response = await axios.get(url, {
      params: {
        email,
        password,
      }
    });

    const users = response.data;
    const user = users.find((user: any) => user.email === email && user.password === password);

    if (user) {
      return { success: true, user };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Error durante o login', error);
    return { success: false };
  }
};

export const register = async (userData: User): Promise<RegisterResponse> => {
  const url = `${API_URL}users`;

  try {
    const cpfExistsResponse = await axios.get(url, {
      params: {
        cpf: userData.cpf_usuario,
      },
    });
    const cpfExists = cpfExistsResponse.data.length > 0;

    if (cpfExists) {
      return { success: false, user: undefined };
    }

    const emailExistsResponse = await axios.get(url, {
      params: {
        email: userData.email_usuario,
      },
    });
    const emailExists = emailExistsResponse.data.length > 0;

    if (emailExists) {
      return { success: false, user: undefined };
    }

    const telefoneExistsResponse = await axios.get(url, {
      params: {
        telefone: userData.telefone_usuario,
      },
    });
    const telefoneExists = telefoneExistsResponse.data.length > 0;

    if (telefoneExists) {
      return { success: false, user: undefined };
    }

    const response = await axios.post(url, userData);
    alert('Cadastrado Realizado');
    return { success: true, user: response.data };
  } catch (error) {
    console.error('Error durante o cadastro:', error);
    alert('Erro ao cadastrar');
    return { success: false };
  }
};
