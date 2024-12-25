"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import UserForm from './UserForm';
import { User } from '@/app/api/api';
import { useRegister } from '@/app/api/api';

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const registerMutation = useRegister();

  const handleRegister = async (userData: User) => {
    try {
      await registerMutation.mutateAsync(userData);
      
      const result = await signIn('credentials', {
        email: userData.email_usuario,
        password: userData.senha_usuario,
        redirect: false,
      });

      if (result?.error) {
        setError('Erro no login após cadastro');
      } else {
        router.push('/TelaLogin');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro durante o cadastro');
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full h-full max-w-sm">
      <UserForm onSubmit={handleRegister} error={error} isNewUser={true} />
    </div>
  );
};

export default RegisterForm;
