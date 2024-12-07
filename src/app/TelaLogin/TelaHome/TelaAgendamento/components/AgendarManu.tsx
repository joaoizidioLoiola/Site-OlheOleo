/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect } from 'react';
import { MenuItem, Select } from '@mui/material';
import { useSession } from 'next-auth/react';
import useVeiculos, { Veiculo } from '@/hooks/useVeiculos';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Dayjs } from 'dayjs';
import { Agendamento } from '@/auth';

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

interface AgendarManuProps {
  onClose: () => void;
}

export default function AgendarManu({ onClose }: AgendarManuProps) {
  const { data: session } = useSession();
  const { user, veiculos, createAgendamento, getVeiculos } = useVeiculos("http://localhost:3000/usuarios");

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedMaintenanceTypes, setSelectedMaintenanceTypes] = useState<string[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('');
  const [selectedVeiculo, setSelectedVeiculo] = useState<string>('');

  useEffect(() => {
    if (session?.user?.email) {
      getVeiculos(session.user.email);
    }
  }, [session]);

  const handleCheckboxChange = (value: string) => {
    setSelectedMaintenanceTypes(prevSelected =>
      prevSelected.includes(value)
        ? prevSelected.filter(type => type !== value)
        : [...prevSelected, value]
    );
  };

  const handleAgendarClick = async () => {
    try {
      if (!session?.user?.id) {
        console.error('Usuário não autenticado.');
        return;
      }

      if (!user) {
        console.error('Usuário não encontrado.');
        return;
      }
      const veiculoSelecionado = user.veiculos?.find(veiculo => veiculo.id === selectedVeiculo);
      if (!veiculoSelecionado) {
        console.error('Veículo não encontrado para o usuário.');
        return;
      }

      const agendamentoData: Agendamento = {
        id_Agendamento: `${Math.random()}`,
        modelo_veiculo: veiculoSelecionado.modelo,
        nome_oficina: selectedWorkshop,
        data_agendamento: selectedDate?.toISOString() || '',
        status: 'pendente',
        tipo_manutencao: selectedMaintenanceTypes.join(', '),
      };

      await createAgendamento(agendamentoData);
      console.log('Agendamento enviado com sucesso:', agendamentoData);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao agendar:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="fixed inset-0 z-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-y-auto">
        <div className="bg-white p-6 mt-10 rounded-lg shadow-lg max-w-[85%] min-h-[75%] text-black">
          <h2 className="text-xl font-semibold mb-4 text-center text-black border-b border-stone-900">
            Agendamentos
          </h2>
          <div className="flex justify-center items-center mb-4 relative" style={{ width: '100%', height: '100%' }}>
            <div className='absolute inset-0 bg-cover bg-center z-0' style={{ backgroundImage: 'url("/calendarioM.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', width: '100%', height: '100%' }}></div>
            <div className='relative z-10'>
              <img src="/carM.png" alt="Imagem do carro" className='h-auto' />
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="veiculo" className="block text-sm font-medium text-gray-700 mb-1 border-yellow-400">
              Veículo
            </label>
            <Select
              id="veiculo"
              className="mt-1 p-2 border rounded-md w-full max-h-10 text-black"
              value={selectedVeiculo}
              onChange={(e) => setSelectedVeiculo(e.target.value as string)}
            >
              {veiculos.map((veiculo: Veiculo) => (
                <MenuItem key={veiculo.id} value={veiculo.id}>
                  {veiculo.modelo} - {veiculo.placa}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Data da Manutenção"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          {selectedDate && (
            <p className="mb-2 text-black">
              Data selecionada: {selectedDate.format('dddd, DD MMMM YYYY')}
            </p>
          )}
          <div className="mb-4">
            <label htmlFor="maintenance" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Manutenção
            </label>
            <Select
              id="maintenance"
              className="mt-1 p-2 border rounded-md w-full max-h-10 text-black"
              value={selectedMaintenanceTypes}
              multiple
              displayEmpty
              onChange={(e) => setSelectedMaintenanceTypes(e.target.value as string[])}
              renderValue={(selected) => selected.length ? selected.join(', ') : 'TIPO DE MANUTENÇÃO'}
            >
              {['Óleo do Motor', 'Filtro de Óleo', 'Filtro de Ar', 'Filtro de Combustível', 'Filtro de Câmbio'].map((type) => (
                <MenuItem key={type} value={type}>
                  <label className="flex items-center space-x-2 max-h-10">
                    <input
                      type="checkbox"
                      value={type}
                      checked={selectedMaintenanceTypes.includes(type)}
                      onChange={() => handleCheckboxChange(type)}
                    />
                    <span className="capitalize">{type.replace('Filtro', 'Filtro de ').replace('oleomotor', 'Óleo do Motor')}</span>
                  </label>
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <label htmlFor="workshop" className="block text-sm font-medium text-gray-700 mb-1">
              Oficinas
            </label>
            <Select
              id="workshop"
              className="mt-1 p-2 border rounded-md w-full max-h-10 text-black"
              value={selectedWorkshop}
              onChange={(e) => setSelectedWorkshop(e.target.value as string)}
              displayEmpty
              renderValue={(selected) => selected ? selected : 'Oficinas'}
            >
              <MenuItem value="workshop1">Oficina 1</MenuItem>
              <MenuItem value="workshop2">Oficina 2</MenuItem>
            </Select>
          </div>
          <Button
            variant="contained"
            color="ochre"
            style={{ color: 'white' }}
            className="w-full bg-ochre text-white py-2 px-4 rounded-lg"
            onClick={handleAgendarClick}
          >
            Agendar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className="w-full mt-2 text-ochre border-ochre py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
