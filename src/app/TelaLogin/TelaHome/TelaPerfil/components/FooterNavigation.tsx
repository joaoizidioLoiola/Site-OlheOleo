import Image from 'next/image';

const FooterNavigation = () => {
    return (
        <footer className="bg-txt w-full h-1/5 flex flex-col justify-around fixed bottom-0 text-white p-2">
            <div className="flex items-center justify-between md:justify-end">
                <div className="flex items-between">
                    <Image src="/logo.png" alt="Ícone" width={150} height={60} />
                </div>
                <div className="flex flex-col items-end text-sm">
                    <span>Av. Bahia, 1739 - Indaiá</span>
                    <span>Caraguatatuba - SP, 11665-071</span>
                    <span>olheeoleo@gmail.com.br</span>
                    <span>(00) 0 0000-0000</span>
                </div>
            </div>
            <div className="text-end">
                <span className="text-xs opacity-60">Copyright © 2024</span>
            </div>
        </footer>
    );
}

export default FooterNavigation;
