/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import HeaderNavigation from '../../../../components/HeaderNavigation';
import UserForm from '@/app/TelaCadastro/components/UserForm';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { User } from '../../../../../services/auth';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from "@mui/icons-material/Save";
import Button_AddFoto from '../TelaMeusVeiculos/components/Button_AddFotoCar';
import Image from 'next/image';

declare module '@mui/material/styles' {
  interface Palette {
    ochre: Palette['primary'];
  }

  interface PaletteOptions {
    ochre?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    ochre: true;
  }
}

const theme = createTheme({
  palette: {
    ochre: {
      main: '#E3D026',
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#242105',
    },
  },
});

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const url = 'http://localhost:3000/usuarios';

  const getUserData = useCallback(async (email: string) => {
    try {
      const response = await axios.get(url);
      const user = response.data.find((usuario: User) => usuario.email === email);
      if (user) {
        setUserData(user);
      } else {
        setError('Usuário não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setError('Erro ao buscar dados do usuário.');
    }
  }, [url]);

  useEffect(() => {
    if (session?.user?.email) {
      getUserData(session.user.email);
    } else {
      router.push('/TelaLogin');
    }
  }, [router, getUserData, session]);

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && userData) {
      setEditedUser({ ...userData });
    } else if (!isEditMode) {
      setEditedUser(null);
    }
  };

  const handleSaveChanges = async () => {
    setError(null);
    try {
      if (editedUser) {
        const response = await axios.put(`${url}/${editedUser.id}`, editedUser);
        if (response.status === 200) {
          setUserData(response.data);
          setIsEditMode(false);
          alert('Dados atualizados com sucesso!');
        } else {
          setError('Erro ao atualizar os dados do usuário.');
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar os dados do usuário:', error);
      setError('Erro ao atualizar os dados do usuário.');
    }
  };

  const handleDeleteProfile = async () => {
    try {
      if (userData) {
        const response = await axios.delete(`${url}/${userData.id}`);
        const handleLogout = async () => {
          await signOut({ redirect: false });
        };
        if (response.status === 200) {
          handleLogout();
          router.push('/TelaLogin');
        } else {
          setError('Erro ao excluir o perfil.');
        }
      }
    } catch (error) {
      console.error('Erro ao excluir o perfil:', error);
      setError('Erro ao excluir o perfil.');
    }
  };

  const handleChange = (field: keyof User, value: string) => {
    if (isEditMode && editedUser) {
      setEditedUser((prevState: any) => ({
        ...prevState!,
        [field]: value
      }));
    }
  };

  const [selectedImage, setSelectedImage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedImage = localStorage.getItem('selectedImage');
      return storedImage ? storedImage : '/avatarPerfil.svg';
    }
    return '/avatarPerfil.svg';
  });


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedImage', selectedImage);
    }
  }, [selectedImage]);

  if (!session) {
    return <p>Carregando...</p>;
  }

  return (
    <ThemeProvider theme={theme}>
      {/* <main className='flex flex-col h-max bg-gray-100'> */}
      <main className='flex flex-col h-screen bg-gray-100 items-center'>
        <HeaderNavigation />
        <div className='max-w-[500px] flex justify-center flex-col'>
          <div className='flex justify-center mt-[5%]'>
            <h2 className='flex justify-center w-[95%] text-txt text-2xl font-bold mb-2'>Meu Perfil</h2>
          </div>
          <div className='flex flex-row items-center space-x-4 border-b border-t py-3 mb-2'>
            <div className='flex justify-center'>
              <img src="/avatarPerfil.svg" alt="Avatar" className='ml-2 w-24' />
            </div>
            <div className='flex flex-col justify-center items-center'>
              <Button type="button" className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[80%] max-h-[15%] mb-2 flex items-center justify-center" variant="contained" color="ochre" style={{ color: 'white' }}>
                Selecionar Foto
              </Button>
              <p className='flex flex-col justify-center text-txt text-[10px] w-[75%] text-justify pt-2 '>
                São aceitos apenas arquivos do tipo JPG ou PNG com tamanho máximo de 20 MB.
              </p>
            </div>
          </div>
          <div>
            {userData && (
              <UserForm
                initialData={isEditMode ? editedUser : userData}
                onChange={handleChange}
                readOnly={!isEditMode}
                onSubmit={isEditMode ? handleSaveChanges : () => { }}
                isNewUser={false}
                error={error}
              />
            )}
          </div>
          <div className="flex justify-around py-2">
            {isEditMode ? (
              <>
                <Button onClick={handleToggleEditMode} className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  variant="contained" style={{ color: 'white', background: "red" }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveChanges} className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  variant="contained" endIcon={<SaveIcon />} style={{ color: 'white', background: 'green' }}>
                  Salvar
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleToggleEditMode} className="py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  variant="contained" color='ochre' style={{ color: 'white' }} >
                  Editar
                </Button>
                <Button onClick={handleDeleteProfile} className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  variant="contained" color="error" startIcon={<DeleteIcon />}>
                  Excluir Perfil
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
};

export default ProfilePage;
