/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Slider from "react-slick";
import HeaderNavigation from "../../../../../components/HeaderNavigation";
import { useEffect, useState } from "react";
import Modal_AddVeiculos from "./modalAddVeiculos";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Veiculo } from "@/hooks/useVeiculos";
import useVeiculos from "@/hooks/useVeiculos";


export default function SemVeiculos() {
  const url = 'http://localhost:3000/usuarios';
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [openModalAddVeiculo, setOpenModalAddVeiculo] = useState(false);
  const { createVeiculo } = useVeiculos(url);
  const [reloadPage, setReloadPage] = useState(false);
  const router = useRouter();

  const handleCloseModalAddVeiculo = () => {
    setOpenModalAddVeiculo(false);
  };

  const handleAddVeiculo = async (email: string, newVeiculo: Veiculo) => {
    try {
      await createVeiculo(email, newVeiculo);
      await getVeiculos();
      setReloadPage(true);
      // setOpenModalAddVeiculo(false);
    } catch (error) {
      console.log('Erro ao add o veiculo', error);
    }
  };

  async function getVeiculos() {
    try {
      const email = localStorage.getItem('userEmail') || '';
      const response = await axios.get(`${url}?email=${email}`);
      const user = response.data.find((user: any) => user.email === email);

      if (user) {
        setVeiculos(user.veiculos || []);
      } else {
        setVeiculos([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getVeiculos();
    if (reloadPage) {
      setReloadPage(false);
      window.location.reload();
    }
  }, [reloadPage])

  return (
    <main className="flex w-full h-dvh bg-fund flex-col">
      <HeaderNavigation />
      {veiculos.length === 0 && (
        <>
          <div className="w-full  h-auto mt-20">
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
              <div className="">
                <img src="/car2.jpg" alt="carro2" />
              </div>
              <div className="flex justify-center items-center">
                <img src="/car3.jpg" alt="carro3" />
              </div>
              <div className="flex justify-center items-center">
                <img src="/car4.jpg" alt="carro4" />
              </div>
            </Slider>
          </div>
          <div className="flex justify-center items-center mt-[40%] lg:mt-14">
            <button
              className="flex justify-center items-center bg-txt text-grid w-40 h-20 border
              rounded-md shadow-sm"
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
