import Image from 'next/image';

const FooterNavigation = () => {
    return (
        <footer className="bg-txt w-full h-1/5 flex flex-col justify-around fixed bottom-0 text-white p-2">
            <div className="flex felx-col md:flex-row items-center justify-between">
                <div className="flex justify-center w-full md:w-auto mb-2 md:mb-0">
                    <Image src="/logo.png" alt="Ícone" width={150} height={60} />
                </div>
                <div className="flex flex-col items-end md:items-end text-sm">
                    <span>Av. Bahia, 1739 - Indaiá</span>
                    <span>Caraguatatuba - SP, 11665-071</span>
                    <span>olheeoleo@gmail.com.br</span>
                    <span>(00) 0 0000-0000</span>
                </div>
            </div>
            <div className="text-center md:text-end">
                <span className="text-xs opacity-60">Copyright © 2024</span>
            </div>
        </footer>
    );
}

export default FooterNavigation;
