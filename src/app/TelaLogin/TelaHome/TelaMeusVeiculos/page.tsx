/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "react-query";
import { useVeiculos, useCreateVeiculo, useUpdateVeiculo, useDeleteVeiculo } from "@/app/api/api";
import { Veiculo } from "@/app/api/api";
import Slider from "react-slick";
import HeaderNavigation from "../../../../components/HeaderNavigation";
import Modal_AddVeiculos from "./components/modalAddVeiculos";
// import AgendarManu from '../__TelaAgendamento/components/AgendarManu';
import SemVeiculos from "./components/SemVeiculos";
import VeiculoForm from "./components/VeiculoForm";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

export default function MeusVeiculos() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedVeiculo, setEditedVeiculo] = useState<Veiculo | null>(null);
  const [openModalAddVeiculo, setOpenModalAddVeiculo] = useState(false);
  const [openAgendarManu, setOpenAgendarManu] = useState(false);
  const [openMais, setOpenMais] = useState(false);

  // Queries e Mutations
  const { data: veiculos = [], isLoading, refetch } = useVeiculos(session?.user?.id);
  const createVeiculoMutation = useCreateVeiculo();

  // Handlers
  const handleCloseModalAddVeiculo = () => setOpenModalAddVeiculo(false);
  const handleCloseAgendarManu = () => setOpenAgendarManu(false);
  const handlerOpenAgendarManu = () => setOpenAgendarManu(true);
  const handlerOpenMais = () => setOpenMais(true);
  const handleCloseMais = () => setOpenMais(false);

  const handleEditVeiculo = (veiculo: Veiculo) => {
    setEditedVeiculo(veiculo);
    setIsEditMode(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Veiculo) => {
    if (editedVeiculo) {
      setEditedVeiculo({
        ...editedVeiculo,
        [field]: e.target.value
      });
    }
  };

  const handleToggleEditMode = () => setIsEditMode(!isEditMode);
  const updateVeiculoMutation = useUpdateVeiculo();

  const handleSaveChanges = async () => {
    if (!editedVeiculo || !editedVeiculo.veiculo_id) return;
      
    try {
      // Cria o payload correto removendo campos desnecessários
      const payload = {
        veiculo_marca: editedVeiculo.veiculo_marca,
        veiculo_modelo: editedVeiculo.veiculo_modelo,
        veiculo_cor: editedVeiculo.veiculo_cor,
        veiculo_placa: editedVeiculo.veiculo_placa,
        veiculo_motor: editedVeiculo.veiculo_motor,
        veiculo_km: Number(editedVeiculo.veiculo_km), // Converte para número
        id_usuario: editedVeiculo.id_usuario
      };
  
      await updateVeiculoMutation.mutateAsync({
        ...payload,
        veiculo_id: editedVeiculo.veiculo_id
      });
        
      setIsEditMode(false);
      setEditedVeiculo(null);
      alert('Veículo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
    }
  };

  const deleteVeiculoMutation = useDeleteVeiculo();
  
  const handleDeleteVeiculo = async (veiculoId: number) => {
    try {
      await deleteVeiculoMutation.mutateAsync(veiculoId.toString());
      alert('Veículo excluído com sucesso!');
      refetch();
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      alert('Erro ao excluir veículo');
    }
  };

  useEffect(() => {
    if (createVeiculoMutation.isSuccess) {
      refetch();
    }
  }, [createVeiculoMutation.isSuccess, refetch]);

  if (isLoading || !session?.user?.email) {
    return <p>Carregando...</p>;
  }

  if (!veiculos || veiculos.length === 0) {
    return (
      <SemVeiculos
        onAddVeiculo={async (newVeiculo) => {
          if (!session?.user?.id) return;
          
          try {
            await createVeiculoMutation.mutateAsync({
              ...newVeiculo,
              id_usuario: Number(session.user.id) // Converter id_usuario para número
            });
            setOpenModalAddVeiculo(false);
            refetch();
          } catch (error) {
            console.error('Erro ao adicionar veículo:', error);
          }
        }}
      />
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <main className="flex flex-col max-w-screen h-screen bg-fund overflow-x-hidden">
        <HeaderNavigation />
        <Slider
          dots={false}
          infinite={false}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          arrows={false}
          className="w-full mt-16 mb-8"
          swipeToSlide={true} 
        >
          {veiculos.map((veiculo: Veiculo) => (
            <div key={veiculo.veiculo_id} className="px-2">
              {/* Dropdown */}
              <div className="fixed flex justify-start items-center mr-5 dropdown-fixed">
                <div className="items-center justify-center">
                  <img
                    src="/maisIcon.svg"
                    alt="Mais"
                    className="cursor-pointer justify-center items-center"
                    onClick={openMais ? handleCloseMais : handlerOpenMais}
                  />
                  {openMais && (
                    <>
                      <div 
                        id='main-content' 
                        className="mt-[100px] flex flex-col space-y-4 justify-center items-center w-screen h-full pb-3 mx-1 mb-8"
                        style={{ backdropFilter: 'blur(5px)', marginTop: '85px' }}
                      />
                      <div className="absolute top-20 left-0 w-56 bg-bord rounded-lg shadow-lg z-50">
                        <p
                          className="block px-4 py-2 text-fund cursor-pointer text-center"
                          onClick={() => {
                            setOpenModalAddVeiculo(true);
                            handleCloseMais();
                          }}
                        >
                          Cadastrar um novo veículo
                        </p>
                        <p
                          className="block px-4 py-2 text-fund cursor-pointer text-center"
                          onClick={() => {
                            setOpenAgendarManu(true);
                            handleCloseMais();
                          }}
                        >
                          Agendar manutenção
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg sm:w-3/4 mt-24">
                <VeiculoForm
                  veiculo={veiculo}
                  isEditMode={isEditMode}
                  editedVeiculo={editedVeiculo}
                  handleSaveChanges={handleSaveChanges}
                  handleToggleEditMode={handleToggleEditMode}
                  handleDeleteVeiculo={handleDeleteVeiculo}
                  handleChange={handleChange}
                  deleteVeiculo={() => {
                    queryClient.invalidateQueries(['veiculos', session?.user?.id]);
                  }}
                  handleEditVeiculo={() => handleEditVeiculo(veiculo)}
                  onSubmit={handleSaveChanges}
                />
              </div>
            </div>
          ))}
        </Slider>
        
        <Modal_AddVeiculos
          isOpen={openModalAddVeiculo}
          onClose={handleCloseModalAddVeiculo}
          onAdd={async (newVeiculo) => {
            if (!session?.user?.id) return;
            
            try {
              await createVeiculoMutation.mutateAsync({
                ...newVeiculo,
                id_usuario: Number(session.user.id)
              });
              setOpenModalAddVeiculo(false);
              refetch();
            } catch (error) {
              console.error('Erro ao adicionar veículo:', error);
            }
          }}
        />
        
        {/* {openAgendarManu && <AgendarManu onClose={handleCloseAgendarManu} />} */}
      </main>
    </ThemeProvider>
  );
  }