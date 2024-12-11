import axios from "axios";
import { User } from "../api";
import apiCalls from './../api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const register = async (userData: Omit<User, 'id_usuario'>): Promise<RegisterResponse> => {
  try {
    const cpfResponse = await apiCalls.getUsers();
    const cpfExists = cpfResponse.some(user => user.cpf_usuario === userData.cpf_usuario);
    
    if (cpfExists) {
      return { 
        success: false, 
        message: 'CPF já cadastrado' 
      };
    }

    const emailExists = cpfResponse.some(user => user.email_usuario === userData.email_usuario);

    if (emailExists) {
      return { 
        success: false, 
        message: 'Email já cadastrado' 
      };
    }

    // Registra o usuário
    const user = await apiCalls.registerUser(userData);

    return {
      success: true,
      user
    };

  } catch (error) {
    if (error instanceof Error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
    return { 
      success: false,
      message: 'Erro durante o cadastro' 
    };
  }
};