import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Veiculo } from '@/app/api/api';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from "@mui/icons-material/Save";
import Button from '@mui/material/Button';

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

type VeiculoFormProps = {
  veiculo?: Veiculo;
  onSubmit: (veiculoData: Veiculo) => void;
  isEditMode?: boolean;
  editedVeiculo?: Veiculo | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Veiculo) => void;
  handleToggleEditMode: () => void;
  handleSaveChanges: () => void;
  handleEditVeiculo: (veiculo: Veiculo) => void;
  deleteVeiculo: () => void;
  handleDeleteVeiculo: (veiculoId: number) => Promise<void>;
}

const VeiculoForm: React.FC<VeiculoFormProps> = ({ veiculo, onSubmit, isEditMode, editedVeiculo, handleChange, handleToggleEditMode, handleSaveChanges, handleEditVeiculo, handleDeleteVeiculo }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Veiculo>();
  const [placa, setPLaca] = useState(veiculo?.veiculo_placa || '');
  const [placaError, setPlacaError] = useState<string | null>(null);

  useEffect(() => {
    if (editedVeiculo) {
      setValue('veiculo_marca', editedVeiculo.veiculo_marca || '');
      setValue('veiculo_modelo', editedVeiculo.veiculo_modelo);
      setValue('veiculo_cor', editedVeiculo.veiculo_cor || '');
      setValue('veiculo_placa', editedVeiculo.veiculo_placa || '');
      setValue('veiculo_km', editedVeiculo.veiculo_km);
      setValue('veiculo_motor', editedVeiculo.veiculo_motor || '');
    }
  }, [editedVeiculo, setValue]);

  const onFormSubmit = (data: Veiculo) => {
    onSubmit(data);
  };
  const formatPlaca = (value: string) => {
    const placaPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return placaPattern.test(value) ? value : value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-center items-center w-full h-full m-6 text-black">
        <form onSubmit={handleSubmit(onFormSubmit)} className="min-w-[85%] row justify-center items-center max-w-lg p-2 bg-white rounded-xl shadow-[0_4px_8px_rgba(0,0,0,0.1)">
          <div className="flex flex-col mb-2 w-full">
            <label htmlFor="veiculo_marca" className="mb-1">Marca do Veículo:</label>
            {isEditMode && editedVeiculo?.veiculo_id === veiculo?.veiculo_id ? (
              <input
                {...register('veiculo_marca')}
                type="text"
                id="veiculo_marca"
                name="veiculo_marca"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.veiculo_marca || ''}
                onChange={(e) => handleChange && handleChange(e, "veiculo_marca")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${veiculo?.veiculo_marca}`}
                readOnly
              />
            )}
            {errors.veiculo_marca && <span className="text-red-500">{errors.veiculo_marca.message}</span>}
          </div>
          <div className="flex flex-col mb-2 w-full">
            <label htmlFor="veiculo_modelo" className="mb-1">Modelo:</label>
            {isEditMode && editedVeiculo?.veiculo_id === veiculo?.veiculo_id ? (
              <input
                {...register('veiculo_modelo', { required: 'Modelo é obrigatório' })}
                type="text"
                id="veiculo_modelo"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.veiculo_modelo || ''}
                onChange={(e) => handleChange(e, "veiculo_modelo")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${veiculo?.veiculo_modelo}`}
                readOnly
              />
            )}
            {errors.veiculo_modelo && <p className="text-red-500 text-sm">{errors.veiculo_modelo.message}</p>}
          </div>

          <div className="flex flex-col mb-2 w-full">
            <label htmlFor="veiculo_cor" className="mb-1">Modelo do Último Óleo:</label>
            {isEditMode && editedVeiculo?.veiculo_id === veiculo?.veiculo_id ? (
              <input
                {...register('veiculo_cor')}
                type="text"
                id="veiculo_cor"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.veiculo_cor || ''}
                onChange={(e) => handleChange && handleChange(e, "veiculo_cor")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${veiculo?.veiculo_cor}`}
                readOnly
              />
            )}
            {errors.veiculo_cor && <p className="text-red-500 text-sm">{errors.veiculo_cor.message}</p>}
          </div>
          
          <div className="flex flex-col mb-2 w-full">
            <label htmlFor="veiculo_km" className="mb-1">Quilometragem:</label>
            {isEditMode && editedVeiculo?.veiculo_id === veiculo?.veiculo_id ? (
              <input
                {...register('veiculo_km', { required: 'Quilometragem é obrigatória' })}
                type="text"
                id="veiculo_km"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.veiculo_km || ''}
                onChange={(e) => handleChange(e, "veiculo_km")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${veiculo?.veiculo_km} km`}
                readOnly
              />
            )}
            {errors.veiculo_km && <p className="text-red-500 text-sm">{errors.veiculo_km.message}</p>}
          </div>
          <div className="flex flex-col mb-2 w-full">
            <label htmlFor="veiculo_placa" className="mb-1">Placa:</label>
            {isEditMode && editedVeiculo?.veiculo_id === veiculo?.veiculo_id ? (
              <input
                {...register('veiculo_placa', { required: 'Placa é obrigatória' })}
                type="text"
                id="veiculo_placa"
                className="text-black border border-gray-300 rounded-md p-1"
                value={placa || ''}
                onChange={(e) => {
                  const formattedPlaca = formatPlaca(e.target.value);
                  setPLaca(formattedPlaca)
                  handleChange && handleChange(e, "veiculo_placa")
                }}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${veiculo?.veiculo_placa}`}
                readOnly
              />
            )}
            {placaError && <span className="text-red-500">{placaError}</span>}
          </div>
          
          <div className="flex flex-col mb-2 w-full">
            <label htmlFor="veiculo_motor" className="mb-1">Filtro de Óleo:</label>
            {isEditMode && editedVeiculo?.veiculo_motor === veiculo?.veiculo_motor ? (
              <input
                type="text"
                id="veiculo_motor"
                name="veiculo_motor"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.veiculo_motor || ''}
                onChange={(e) => handleChange && handleChange(e, "veiculo_motor")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${veiculo?.veiculo_motor}`}
                readOnly
              />
            )}
            {errors.veiculo_motor && <p className="text-red-500 text-sm">{errors.veiculo_motor.message}</p>}
          </div>
          
          <div className="flex justify-around py-2">
            {isEditMode && editedVeiculo?.veiculo_id === veiculo?.veiculo_id ? (
              <div className="flex justify-around py-2 space-x-2">
                <Button onClick={handleToggleEditMode} variant="contained" style={{ color: 'white', background: 'red' }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveChanges} variant="contained" endIcon={<SaveIcon />} style={{ color: 'white', background: 'green' }} >
                  Salvar
                </Button>
              </div>
            ) : (
              <div className="flex justify-around py-2">
                <div className="mr-2">
                  <Button onClick={() => veiculo && handleEditVeiculo(veiculo)} variant="contained" color="ochre" style={{ color: 'white' }} >
                    Editar
                  </Button>
                </div>
                <div>
                  <Button onClick={() => veiculo?.veiculo_id && handleDeleteVeiculo(veiculo.veiculo_id)} variant="contained" color="error" startIcon={<DeleteIcon />} >
                    Excluir
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default VeiculoForm;