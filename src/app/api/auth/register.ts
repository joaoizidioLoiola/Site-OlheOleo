import axios from "axios";
import { User } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const register = async (userData: Omit<User, 'id_usuario'>): Promise<RegisterResponse> => {
  try {
    const userWithId = {
      ...userData,
    };

    const cpfResponse = await axios.get(`${API_URL}/users`, {
      params: { cpf_usuario: userData.cpf_usuario }
    });
    
    if (cpfResponse.data.length > 0) {
      return { 
        success: false, 
        message: 'CPF já cadastrado' 
      };
    }

    const emailResponse = await axios.get(`${API_URL}/users`, {
      params: { email_usuario: userData.email_usuario }
    });

    if (emailResponse.data.length > 0) {
      return { 
        success: false, 
        message: 'Email já cadastrado' 
      };
    }

    // Registra o usuário
    const response = await axios.post(`${API_URL}/users`, userWithId);

    return {
      success: true,
      user: response.data
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