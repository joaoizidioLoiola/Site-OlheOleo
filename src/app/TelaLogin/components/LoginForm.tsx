'use client'
import { signIn } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useLogin } from "@/app/api/api";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { control, handleSubmit, setError, formState: { errors } } = useForm<FormData>();
  const loginMutation = useLogin();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      if ((result as { error?: string })?.error) {
        setError('email', { type: 'manual', message: 'E-mail ou senha incorretos. Por favor, tente novamente.' });
        setError('password', { type: 'manual', message: 'E-mail ou senha incorretos. Por favor, tente novamente.' });
      } else {
        router.push('/TelaLogin/TelaHome/TelaMeusVeiculos');
      }
    } catch (err) {
      setError('email', { type: 'manual', message: 'Ocorreu um erro durante o login. Por favor, tente novamente.' });
      setError('password', { type: 'manual', message: 'Ocorreu um erro durante o login. Por favor, tente novamente.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail:</label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Endereço de email inválido'
            }
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              autoComplete="email"
            />
          )}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Senha é obrigatória' }}
          render={({ field }) => (
            <input
              {...field}
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              autoComplete="current-password"
            />
          )}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <a href="#" className="flex justify-end text-sm text-txt hover:text-gray-400">Esqueceu a senha?</a>
      </div>
      <button
        type="submit"
        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
      >
        Entrar
      </button>
      <div className="text-center text-gray-500 mb-4">OU</div>
      <button
        type="button"
        onClick={() => signIn('google')}
        className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
      >
        <FcGoogle />
        <span className="ml-2">Continuar com o Google</span>
      </button>
    </form>
  );
}