import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  nome: string;
  url_imagem: string;
  cpf: string;
  email: string;
  telefone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
}

export const register = async (userData: User): Promise<RegisterResponse> => {
  const url = 'https://server-bancojs-ed773394a807.herokuapp.com/usuarios';

  try {

    const newUser: User = {
      ...userData,
      id: uuidv4(),
    };

    // Verificar se o CPF já está cadastrado
    const cpfExists = await checkIfExists(url, { cpf: userData.cpf });
    if (cpfExists) {
      return { success: false };
    }

    // Verificar se o email já está cadastrado
    const emailExists = await checkIfExists(url, { email: userData.email });
    if (emailExists) {
      return { success: false };
    }

    // Verificar se o telefone já está cadastrado
    const telefoneExists = await checkIfExists(url, { telefone: userData.telefone });
    if (telefoneExists) {
      return { success: false };
    }

    // Submeter os dados do usuário para o backend
    const response = await axios.post(url, newUser);
    return { success: true, user: response.data };
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false };
  }
};

// Função auxiliar para verificar se um dado já existe no backend
const checkIfExists = async (url: string, params: any): Promise<boolean> => {
  const response = await axios.get(url, { params });
  return response.data.length > 0;
};
