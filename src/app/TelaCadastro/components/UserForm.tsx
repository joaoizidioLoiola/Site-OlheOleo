import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { User } from '@/app/api/api';

type UserFormProps = {
  error: string | null;
  initialData?: User | null;
  onSubmit: (userData: Omit<User, 'id_usuario'>) => void;
  isNewUser?: boolean;
  onChange?: (field: keyof User, value: string) => void;
  readOnly?: boolean;
};

const UserForm: React.FC<UserFormProps> = ({ onSubmit, error, initialData, isNewUser, onChange, readOnly }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<User>({
    defaultValues: {
      nome_usuario: initialData?.nome_usuario || '',
      cpf_usuario: initialData?.cpf_usuario || '',
      email_usuario: initialData?.email_usuario || '',
      telefone_usuario: initialData?.telefone_usuario || '',
      senha_usuario: initialData?.senha_usuario || '',
      tipo_usuario: initialData?.tipo_usuario || 1,
    }
  });

  const [showPassword, setShowPassword] = useState(false);

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

  const onFormSubmit = (data: User) => {
    const userData: Omit<User, 'id_usuario'> = {
      cpf_usuario: data.cpf_usuario,
      nome_usuario: data.nome_usuario,
      email_usuario: data.email_usuario,
      telefone_usuario: data.telefone_usuario,
      senha_usuario: data.senha_usuario,
      tipo_usuario: data.tipo_usuario,
    };

    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='justify-center items-center ml-2 w-[95%]'>
      <div className="mb-4">
        <label htmlFor="nome_usuario" className="block text-gray-700 text-sm font-bold mb-2">
          Nome:
        </label>
        <Controller
          name="nome_usuario"
          control={control}
          rules={{ required: 'Nome é obrigatório' }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              readOnly={readOnly}
              onChange={(e) => {
                field.onChange(e);
                if (onChange) onChange('nome_usuario', e.target.value);
              }}
            />
          )}
        />
        {errors.nome_usuario && (
          <p className="text-red-500 text-sm">{errors.nome_usuario.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="cpf_usuario" className="block text-gray-700 text-sm font-bold mb-2">
          CPF:
        </label>
        <Controller
          name="cpf_usuario"
          control={control}
          rules={{ required: 'CPF é obrigatório' }}
          render={({ field: { onChange, value } }) => (
            <input
              type="text"
              value={formatCPF(value)}
              onChange={(e) => {
                const formatted = formatCPF(e.target.value);
                onChange(formatted);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="000.000.000-00"
              readOnly={readOnly}
            />
          )}
        />
        {errors.cpf_usuario && (
          <p className="text-red-500 text-sm">{errors.cpf_usuario.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="telefone_usuario" className="block text-gray-700 text-sm font-bold mb-2">
          Celular:
        </label>
        <Controller
          name="telefone_usuario"
          control={control}
          rules={{ required: 'Telefone é obrigatório' }}
          render={({ field: { onChange, value } }) => (
            <input
              type="text"
              value={formatTelefone(value)}
              onChange={(e) => {
                const formatted = formatTelefone(e.target.value);
                onChange(formatted);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="(00) 00000-0000"
              readOnly={readOnly}
            />
          )}
        />
        {errors.telefone_usuario && (
          <p className="text-red-500 text-sm">{errors.telefone_usuario.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email_usuario" className="block text-gray-700 text-sm font-bold mb-2">
          E-mail:
        </label>
        <Controller
          name="email_usuario"
          control={control}
          rules={{
            required: 'E-mail é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'E-mail inválido',
            },
          }}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              readOnly={readOnly}
              onChange={(e) => {
                field.onChange(e);
                if (onChange) onChange('email_usuario', e.target.value);
              }}
            />
          )}
        />
        {errors.email_usuario && (
          <p className="text-red-500 text-sm">{errors.email_usuario.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="senha_usuario" className="block text-gray-700 text-sm font-bold mb-2">
          Senha:
        </label>
        <div className="relative">
          <Controller
            name="senha_usuario"
            control={control}
            rules={{ required: 'Senha é obrigatória' }}
            render={({ field }) => (
              <input
                {...field}
                type={showPassword ? 'text' : 'password'}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                readOnly={readOnly}
                onChange={(e) => {
                  field.onChange(e);
                  if (onChange) onChange('senha_usuario', e.target.value);
                }}
              />
            )}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </button>
        </div>
        {errors.senha_usuario && (
          <p className="text-red-500 text-sm">{errors.senha_usuario.message}</p>
        )}
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