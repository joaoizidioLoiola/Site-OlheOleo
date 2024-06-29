/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react';
import HeaderNavigation from '@/components/HeaderNavigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AgendarManu from './components/AgendarManu';

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

export default function TelaAgendamento() {
    const [openModalAgendar, setOpenModalAgendar] = useState(false);

    const handleOpenModalAgendar = () => {
        setOpenModalAgendar(true);
    };

    const handleCloseModalAgendar = () => {
        setOpenModalAgendar(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <main className="w-full h-full bg-fund">
                <HeaderNavigation />
                <div className='flex justify-center items-center w-full py-2 border-b border-stone-900'>
                    <h2 className='text-txt text-center text-2xl'>Agendamentos</h2>
                </div>
                <section className='flex justify-center items-center w-full mt-[10%] lg:mt-[2%]'>
                    <div className="relative flex justify-center items-center w-full">
                        <div className='absolute top-0 left-0 bg-cover bg-center w-[80%] sm:w-1/2 ' style={{ backgroundImage: 'url("/calendarioM.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', width: '100%', height: '100%' }}></div>
                        <div className='relative z-0 flex justify-center items-center w-full max-w-[750px] h-full'>
                            <img src="/carM.png" alt="Imagem do carro" className='w-full h-auto mt-6' />
                        </div>
                    </div>
                </section>
                <div className="flex justify-center items-center mt-2 h-screen w-full ">
                    <Button variant="contained" color="ochre" 
                    style={{ color: 'white' }} 
                    onClick={handleOpenModalAgendar}
                    className="w-[85%] mb-[40%]">
                        Agendar
                    </Button>
                </div>
                {openModalAgendar && <AgendarManu onClose={handleCloseModalAgendar} />}
            </main>
        </ThemeProvider>
    );
};