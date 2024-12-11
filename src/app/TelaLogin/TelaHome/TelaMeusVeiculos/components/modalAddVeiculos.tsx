"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Veiculo } from '@/app/api/api';
import { useSession } from 'next-auth/react';
import { IoCloseCircle } from 'react-icons/io5';
import Button_AddFotoCar from '../components/Button_AddFotoCar';

interface Modal_AddVeiculosProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newVeiculo: Omit<Veiculo, 'veiculo_id'>) => Promise<void>;
}

export default function Modal_AddVeiculos({ isOpen, onClose, onAdd }: Modal_AddVeiculosProps) {
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedImage = localStorage.getItem('selectedImage');
      return storedImage ? storedImage : '/car.jpg';
    }
    return '/car.jpg';
  });

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
      reset();
      setSelectedImage('/car.jpg');
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
    }
  };

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Usuário não autenticado.</div>;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="max-w-[90%] max-h-[90%] overflow-y-auto m-auto">
            <div className="p-5 bg-white rounded-[12px] shadow-md">
              <div className="flex justify-between items-center border-b border-solid border-[#eaeaea]">
                <h2 className="text-lg font-medium text-black">Adicionar Novo Veículo</h2>
                <span className="cursor-pointer text-txt" onClick={onClose}>
                  <IoCloseCircle size={28} />
                </span>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
                  <Image
                    src={selectedImage}
                    alt="Car Illustration"
                    className="w-[250px] h-[200px] sm:w-[350px] sm:h-[250px] mt-3 mb-2 rounded-md"
                    width={400}
                    height={250}
                  />
                  <Button_AddFotoCar selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
                  <input
                    type="text"
                    placeholder="Modelo do Veículo"
                    {...register('veiculo_modelo', { required: true })}
                    className={`mt-3 p-2 w-full border ${errors.veiculo_modelo ? 'border-red-500' : 'border-gray-300'} rounded-md text-black`}
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
                    className="mt-3 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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