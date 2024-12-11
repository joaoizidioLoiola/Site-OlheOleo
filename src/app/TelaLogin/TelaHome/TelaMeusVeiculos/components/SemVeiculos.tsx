"use client";
import Slider from "react-slick";
import HeaderNavigation from "../../../../../components/HeaderNavigation";
import { useState } from "react";
import Modal_AddVeiculos from "./modalAddVeiculos";
import { useRouter } from "next/navigation";
import { Veiculo } from "@/app/api/api";
import { useCreateVeiculo, useVeiculos } from "@/app/api/api";
import { useSession } from "next-auth/react";

interface SemVeiculosProps {
  onAddVeiculo: (newVeiculo: Omit<Veiculo, 'veiculo_id'>) => Promise<void>;
}

export default function SemVeiculos({ onAddVeiculo }: SemVeiculosProps) {
  const { data: session } = useSession();
  const [openModalAddVeiculo, setOpenModalAddVeiculo] = useState(false);
  const router = useRouter();
  const createVeiculoMutation = useCreateVeiculo();
  
  const { data: veiculos = [] } = useVeiculos(session?.user?.id);

  const handleCloseModalAddVeiculo = () => {
    setOpenModalAddVeiculo(false);
  };

  const handleAddVeiculo = async (newVeiculo: Omit<Veiculo, 'veiculo_id'>) => {
    if (!session?.user?.id) {
      console.error('Usuário não autenticado');
      return;
    }
    try {
      const veiculoData = {
        ...newVeiculo,
        id_usuario: Number(session.user.id), // Converter id_usuario para número
        veiculo_km: Number(newVeiculo.veiculo_km)
      };

      await createVeiculoMutation.mutateAsync(veiculoData);
      setOpenModalAddVeiculo(false);
      router.push('/TelaLogin/TelaHome/TelaMeusVeiculos');
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
    }
  };

  return (
    <main className="flex w-full h-dvh bg-fund flex-col">
      <HeaderNavigation />
      {veiculos.length === 0 && (
        <>
          <div className="w-full h-auto mt-20">
            <Slider
              dots={true}
              fade={true}
              infinite={true}
              speed={500}
              autoplay={true}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={false}
              cssEase='linear'
              centerMode={true}
              className="flex w-full justify-center items-center"
            >
                <div className="flex justify-center items-center">
                  <img src="/car2.jpg" alt="carro2" className="w-full h-auto" />
                </div>
                <div className="flex justify-center items-center">
                  <img src="/car3.jpg" alt="carro3" className="w-full h-auto" />
                </div>
                <div className="flex justify-center items-center">
                  <img src="/car4.jpg" alt="carro4" className="w-full h-auto" />
                </div>
            </Slider>
          </div>
          <div className="flex justify-center items-center mt-[40%] lg:mt-14">
            <button
              className="flex justify-center items-center bg-txt text-grid w-40 h-20 border rounded-md shadow-sm"
              onClick={() => setOpenModalAddVeiculo(true)}
            >
              Adicionar Veículo
            </button>
          </div>
        </>
      )}
      <Modal_AddVeiculos
        isOpen={openModalAddVeiculo}
        onClose={handleCloseModalAddVeiculo}
        onAdd={handleAddVeiculo}
      />
    </main>
  );
}