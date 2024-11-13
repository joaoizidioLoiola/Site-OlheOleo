import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../../../services/auth';
import { v4 as uuidv4 } from "uuid";

type UserFormProps = {
  error: string | null;
  initialData?: User | null;
  onSubmit: (userData: User) => void;
  isNewUser?: boolean;
  onChange?: (field: keyof User, value: string) => void;
  readOnly?: boolean;
};

const UserForm: React.FC<UserFormProps> = ({ onSubmit, error, initialData, isNewUser, onChange, readOnly }) => {

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<User>();

  const [cpf, setCpf] = useState(initialData?.cpf || '');
  const [telefone, setTelefone] = useState(initialData?.telefone || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(initialData?.confirmPassword || '');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('url_imagem', initialData.url_imagem);
      setValue('cpf', initialData.cpf);
      setValue('email', initialData.email);
      setValue('telefone', initialData.telefone);
      setValue('password', initialData.password);
      setValue('confirmPassword', initialData.confirmPassword);
    }
  }, [initialData, setValue]);

  const onFormSubmit = (data: User) => {
    if (data.password !== data.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    const userData: User = {
      ...data,
      id: initialData?.id || uuidv4(),
      veiculos: initialData?.veiculos || [],
      agendamentos: initialData?.agendamentos || []
    };

    onSubmit(userData);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatTelefone = (value: string) => {
    let onlyNums = value.replace(/\D/g, '');

    onlyNums = onlyNums.slice(0, 11);
    return onlyNums
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='justify-center items-center ml-2 w-[95%]' >
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
        <input
          {...register('name', { required: 'Nome é obrigatório' })}
          type="text"
          id="name"
          readOnly={readOnly}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="cpf" className="block text-gray-700 text-sm font-bold mb-2">CPF:</label>
        <input
          {...register('cpf', { required: 'CPF é obrigatório' })}
          name='cpf'
          type="text"
          id="cpf"
          value={cpf}
          onChange={(e) => {
            const formattedCPF = formatCPF(e.target.value);
            setCpf(formattedCPF);
            onChange && onChange('cpf', formattedCPF.replace(/\D/g, ''));
          }}
          readOnly={readOnly}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder='000.000.000-00'
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="telefone" className="block text-gray-700 text-sm font-bold mb-2">Celular:</label>
        <input
          {...register('telefone')}
          name='telefone'
          type="text"
          id="telefone"
          value={telefone}
          onChange={(e) => {
            const formattedTelefone = formatTelefone(e.target.value)
            setTelefone(formattedTelefone);
            onChange && onChange('telefone', formattedTelefone.replace(/\D/g, ''));
          }}
          readOnly={readOnly}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="(00) 00000-0000"
          required
        />
        {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail:</label>
        <input
          {...register('email', { required: 'E-mail é obrigadtório' })}
          type="email"
          id="email"
          readOnly={readOnly}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
          Senha:
        </label>
        <div className="relative">
          <input
            {...register('password', { required: 'Senha é obrigatória' })}
            name="password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              onChange && onChange('password', e.target.value);
            }}
            readOnly={readOnly}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 cursor-pointer"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm2 7a2 2 0 11-4 0 2 2 0 014 0zm-.707 2.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414-1.414l-2-2z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 cursor-pointer"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm2 7a2 2 0 11-4 0 2 2 0 014 0zm-.707 2.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414-1.414l-2-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Confirmar Senha:
        </label>
        <input
          {...register('confirmPassword', { required: 'Confirmação de senha é obrigatória' })}
          name="confirmPassword"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          readOnly={readOnly}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isNewUser && (
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
        >
          Salvar
        </button>
      )}
    </form>
  );
};

export default UserForm;
