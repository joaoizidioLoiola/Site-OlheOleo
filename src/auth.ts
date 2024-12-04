import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type User = {
  id_usuario?: string;
  cpf_usuario: string;
  nome_usuario: string;
  email_usuario: string;
  telefone_usuario: string;
  senha_usuario: string;
}

export type Agendamento = {
  id_Agendamento: string;
  modelo_veiculo: string;
  nome_oficina: string;
  data_agendamento: string;
  status: 'pendente' | 'cancelado' | 'concluido';
  tipo_manutencao: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    password: string;
  };
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    password: string;
  };
}

const authOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Nome", type: "text" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        const url = `${API_URL}users`;
        try {
          const response = await axios.get(url, {
            params: {
              email,
              password,
            }
          });

          const users = response.data;
          const user = users.find((user: User) => user.email_usuario === email && user.senha_usuario === password);

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error during authorization', error);
          return null;
        }
      },
    })
  ],
  trustHosrt: true,
  trustHostedDomain: true,

  pages: {
    signIn: "/TelaLogin",
    signOut: "/",
    error: "/TelaLogin",
    verifyRequest: "/TelaLogin",
    newUser: "/TelaLogin",
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.nome = token.nome;
        console.log('Session:', session);
      }
      return session;
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nome = user.nome;
        console.log('JWT token:', token);
      }
      return token;
    },
  }
};

export default NextAuth(authOptions);

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
    return { success: true, user: response.data };
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false };
  }
};
