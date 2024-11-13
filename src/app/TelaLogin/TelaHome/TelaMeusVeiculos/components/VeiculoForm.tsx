import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Veiculo } from '../../../../../hooks/useVeiculos';
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
  initialData?: Veiculo | null;
  onSubmit: (veiculoData: Veiculo) => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  editedVeiculo?: Veiculo | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Veiculo) => void;
  handleToggleEditMode: () => void;
  handleSaveChanges: () => void;
  handleEditVeiculo: (veiculo: Veiculo) => void;
}

// interface VeiculoFormProps {
//   veiculo: Veiculo;
//   isEditMode: boolean;
//   editedVeiculo: Veiculo | null;
//   handleSaveChanges: () => void;
//   handleToggleEditMode: () => void;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Veiculo) => void;
//   deleteVeiculo: () => void;
//   handleEditVeiculo: (veiculo: Veiculo) => void;
// };

const VeiculoForm: React.FC<VeiculoFormProps> = ({ initialData, onSubmit, onDelete, isEditMode, editedVeiculo, handleChange, handleToggleEditMode, handleSaveChanges, handleEditVeiculo }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Veiculo>();
  const [placa, setPLaca] = useState(initialData?.placa || '');
  const [placaError, setPlacaError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setValue('modelo', initialData.modelo);
      setValue('quilometragem', initialData.quilometragem);
      setValue('placa', initialData.placa);
      setValue('tipo_oleo', initialData.tipo_oleo);
      setValue('modelo_ultimo_oleo', initialData.modelo_ultimo_oleo);
      setValue('filtro_oleo', initialData.filtro_oleo);
      setValue('filtro_ar', initialData.filtro_ar);
      setValue('filtro_combustivel', initialData.filtro_combustivel);
      setValue('filtro_cambio', initialData.filtro_cambio);
    }
  }, [initialData, setValue]);

  const onFormSubmit = (data: Veiculo) => {
    onSubmit(data);
  };
  const formatPlaca = (value: string) => {
    const placaPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return placaPattern.test(value) ? value : value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  };

  // const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const formattedPlaca = formatPlaca(e.target.value);
  //   if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(formattedPlaca) || formattedPlaca === '') {
  //     setPlacaError(null);
  //   } else {
  //     setPlacaError('Placa inválida. Formato correto: ABC1D23');
  //   }
  //   handleChange({ ...e, target: { ...e.target, value: formattedPlaca } }, 'placa');
  // };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col justify-center items-center h-full p-4 text-black">
        <div className="flex flex-col mb-2 w-full items-center">
          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="modelo" className="mb-1">Modelo:</label>
            {isEditMode && editedVeiculo?.id === initialData?.id ? (
              <input
                {...register('modelo', { required: 'Modelo é obrigatório' })}
                type="text"
                id="modelo"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.modelo || ''}
                onChange={(e) => handleChange(e, "modelo")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.modelo}`}
                readOnly
              />
            )}
            {errors.modelo && <p className="text-red-500 text-sm">{errors.modelo.message}</p>}
          </div>
          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="quilometragem" className="mb-1">Quilometragem:</label>
            {isEditMode && editedVeiculo?.id === initialData?.id ? (
              <input
                {...register('quilometragem', { required: 'Quilometragem é obrigatória' })}
                type="text"
                id="quilometragem"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.quilometragem || ''}
                onChange={(e) => handleChange(e, "quilometragem")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.quilometragem} km`}
                readOnly
              />
            )}
            {errors.quilometragem && <p className="text-red-500 text-sm">{errors.quilometragem.message}</p>}
          </div>
          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="placa" className="mb-1">Placa:</label>
            {isEditMode && editedVeiculo?.id === initialData?.id ? (
              <input
                {...register('placa', { required: 'PLaca é obrigatória' })}
                type="text"
                id="placa"
                className="text-black border border-gray-300 rounded-md p-1"
                value={placa || ''}
                onChange={(e) => {
                  const formattedPlaca = formatPlaca(e.target.value);
                  setPLaca(formattedPlaca)
                  handleChange && handleChange(e, "placa")
                }}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.placa}`}
                readOnly
              />
            )}
            {placaError && <span className="text-red-500">{placaError}</span>}
          </div>
          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="tipo_oleo" className="mb-1">Tipo de Óleo:</label>
            {isEditMode && editedVeiculo?.id === initialData?.id ? (
              <input
                {...register('tipo_oleo')}
                type="text"
                id="tipo_oleo"
                name="tipo_oleo"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.tipo_oleo || ''}
                onChange={(e) => handleChange && handleChange(e, "tipo_oleo")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.tipo_oleo}`}
                readOnly
              />
            )}
            {errors.tipo_oleo && <span className="text-red-500">{errors.tipo_oleo.message}</span>}
          </div>
          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="modelo_ultimo_oleo" className="mb-1">Modelo do Último Óleo:</label>
            {isEditMode && editedVeiculo?.id === initialData?.id ? (
              <input
                {...register('modelo_ultimo_oleo')}
                type="text"
                id="modelo_ultimo_oleo"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.modelo_ultimo_oleo || ''}
                onChange={(e) => handleChange && handleChange(e, "modelo_ultimo_oleo")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.modelo_ultimo_oleo}`}
                readOnly
              />
            )}
            {errors.modelo_ultimo_oleo && <p className="text-red-500 text-sm">{errors.modelo_ultimo_oleo.message}</p>}
          </div>

          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="filtro_oleo" className="mb-1">Filtro de Óleo:</label>
            {isEditMode && editedVeiculo?.id === initialData?.id ? (
              <input
                type="text"
                id="filtro_oleo"
                name="filtro_oleo"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.filtro_oleo || ''}
                onChange={(e) => handleChange && handleChange(e, "filtro_oleo")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.filtro_oleo}`}
                readOnly
              />
            )}
            {errors.filtro_oleo && <p className="text-red-500 text-sm">{errors.filtro_oleo.message}</p>}
          </div>
          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="filtro_ar" className="mb-1">Filtro de Ar:</label>
            {isEditMode && editedVeiculo?.id === initialData?.id ? (
              <input
                type="text"
                id="filtro_ar"
                name="filtro_ar"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.filtro_ar || ''}
                onChange={(e) => handleChange && handleChange(e, "filtro_ar")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.filtro_ar}`}
                readOnly
              />
            )}
            {errors.filtro_ar && <p className="text-red-500 text-sm">{errors.filtro_ar.message}</p>}
          </div>
          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="filtro_combustivel" className="mb-1">Filtro de Combustível:</label>
            {isEditMode ? (
              <input
                type="text"
                id="filtro_combustivel"
                name="filtro_combustivel"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.filtro_combustivel || ''}
                onChange={(e) => handleChange && handleChange(e, "filtro_combustivel")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.filtro_combustivel}`}
                readOnly
              />
            )}
            {errors.filtro_combustivel && <p className="text-red-500 text-sm">{errors.filtro_combustivel.message}</p>}
          </div>
          <div className="flex flex-col mb-2 w-full sm:w-1/2">
            <label htmlFor="filtro_cambio" className="mb-1">Filtro de Câmbio:</label>
            {isEditMode ? (
              <input
                type="text"
                id="filtro_cambio"
                name="filtro_cambio"
                className="text-black border border-gray-300 rounded-md p-1"
                value={editedVeiculo?.filtro_cambio || ''}
                onChange={(e) => handleChange && handleChange(e, "filtro_cambio")}
              />
            ) : (
              <input
                className="text-txt border border-gray-300 rounded-md p-1"
                type="text"
                value={`${initialData?.filtro_cambio}`}
                readOnly
              />
            )}
          </div>
          {errors.filtro_cambio && <p className="text-red-500 text-sm">{errors.filtro_cambio.message}</p>}
        </div>
        <div className="flex justify-around py-2 pl-2">
          {isEditMode && editedVeiculo?.id === initialData?.id ? (
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
                <Button onClick={() => initialData && handleEditVeiculo(initialData)} variant="contained" color="ochre" style={{ color: 'white' }} >
                  Editar
                </Button>
              </div>
              <div>
                <Button onClick={onDelete} variant="contained" color="error" startIcon={<DeleteIcon />} >
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </ThemeProvider>
  );
};

export default VeiculoForm;
