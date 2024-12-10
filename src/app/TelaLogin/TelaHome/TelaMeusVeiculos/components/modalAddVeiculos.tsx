"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Veiculo } from '@/app/api/api';

import { useSession } from 'next-auth/react';
import useVeiculos from '@/hooks/useVeiculos';
import Button_AddFotoCar from '../components/Button_AddFotoCar';
import { IoCloseCircle } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

interface Modal_AddVeiculosProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newVeiculo: Omit<Veiculo, 'veiculo_id'>) => Promise<void>;
}

export default function Modal_AddVeiculos({
  isOpen, onClose, onAdd }: Modal_AddVeiculosProps) {
  const { data: session, status } = useSession();


  const [selectedImage, setSelectedImage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedImage = localStorage.getItem('selectedImage');
      return storedImage ? storedImage : '/car.jpg';
    }
    return '/car.jpg';
  });

  const formatPlaca = (value: string) => {
    const regex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return regex.test(value);
  };


  const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Veiculo, 'veiculo_id'>>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedImage', selectedImage);
    }
  }, [selectedImage]);

  const onSubmit = async (data: Omit<Veiculo, 'veiculo_id'>) => {
    try {
      await onAdd({
        ...data,
        veiculo_km: Number(data.veiculo_km),
      });
      onClose();
    } catch (error) {
    console.error('Erro ao adicionar veículo:', error);
  };

    if (!session?.user?.email || !session?.user) {
      console.log('Dados nao encontrados na sessão');
      return;
    }

    if (!formatPlaca(data.veiculo_placa)) {
      alert('A placa deve estar no formato MERCOSUL: ABC1D23');
      return;
    }

    try {
      const newVeiculo: Veiculo = {
        veiculo_modelo: data.veiculo_modelo,
        veiculo_km: data.veiculo_km,
        veiculo_placa: data.veiculo_placa,
        veiculo_marca: data.veiculo_marca, 
        veiculo_cor: data.veiculo_cor, 
        veiculo_motor: data.veiculo_motor , 
        id_usuario: parseInt(session.user.id || '0'), 
      };

      await onAdd(newVeiculo);
      onClose();
      reset();
      setSelectedImage('/car.jpg');
    } catch (error) {
      console.log('Erro ao adicionar veículo:', error);
    }
  }

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Usuário não autenticado.</div>;
  }

  return (
    <>
      {isOpen && (
        <div className='w-full z-40 sm:z-20 absolute mt-[35px] sm:mt-[60px] flex justify-center bg-black'>
          <div className="fixed mt-10 mb-10 overflow-hidden rounded-2xl bg-white border-2 pb-4 pt-2 sm:pb-2 px-3 max-w-[85%] min-h-[75%] sm:max-w-[600px]">
            <h2 className="flex items-center text-lg leading-6 font-medium text-black border-b-2 px-3 pb-1">
              Adicionar Novo Veículo{' '}
              <span className="flex ml-auto justify-end close cursor-pointer text-txt" onClick={onClose}>
                <IoCloseCircle size={28} />
              </span>
            </h2>
            <div className='max-h-[600px] overflow-y-scroll mt-2 rounded-lg p-2 bg-white'>
                <form onSubmit={handleSubmit(onSubmit) className='flex justify-center flex-col items-center'}>
                  <Image
                    src={selectedImage}
                    alt="Car Illustration"
                    className="animate-flip-once w-[250px] h-[200px] sm:w-[350px] sm:h-[250px] sm:mx-auto mt-3 mb-2 rounded-md"
                    width={400}
                    height={250}
                  />

                  <Button_AddFotoCar selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
                 
                  <input
                    type="text"
                    placeholder="Modelo do Veículo"
                    {...register('veiculo_modelo', { required: true })}
                    className={`mt-3 p-2 w-full border ${errors.veiculo_modelo ? 'border-bord' : 'border-gray-300'} rounded-md text-black`}
                  />
                  <input
                    type="text"
                    placeholder="Marca do Veículo"
                    {...register('veiculo_marca', { required: true })}
                    className={`mt-3 p-2 w-full border ${errors.veiculo_marca ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                  />
                  <input
                    type="text"
                    placeholder="Cor"
                    {...register('veiculo_cor', { required: true })}
                    className={`mt-3 p-2 w-full border ${errors.veiculo_cor ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                  />
                  <input
                    type="text"
                    placeholder="Placa"
                    {...register('veiculo_placa', { required: true })}
                    className={`mt-3 p-2 w-full border ${errors.veiculo_placa ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                  />
                  <input
                    type="text"
                    placeholder="Modelo do Motor do Veículo"
                    {...register('veiculo_motor', { required: false })}
                    className={`mt-3 p-2 w-full border ${errors.veiculo_motor ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                  />
                  <input
                    type="number"
                    placeholder="Quilometragem"
                    {...register('veiculo_km', { required: true })}
                    className={`mt-3 p-2 w-full border ${errors.veiculo_km ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
                  />
                  <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0}
                    className="mt-3 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    Adicionar Veículo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}