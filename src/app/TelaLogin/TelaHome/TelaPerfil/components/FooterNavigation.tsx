import Image from 'next/image';

const FooterNavigation = () => {
    return (
        <footer className="bg-txt w-full h-1/5 flex flex-col justify-around fixed items-around bottom-0 p-2 ">
            <div className="flex items-center justify-between text-[#FFF5DD]">
                <div className="flex items-center">
                    <Image src="/logo.png" alt="Ícone" width={150} height={60} />
                </div>
                <div className="flex flex-col items-end text-sm md:text-base">
                    <span>Av. Bahia, 1739 - Indaiá</span>
                    <span>Caraguatatuba - SP, 11665-071</span>
                    <span>olheeoleo@gmail.com.br</span>
                    <span>(00) 0 0000-0000</span>
                </div>
            </div>
            <div className="text-end text-[#FFF5DD]">
                <span className="text-xs md:text-sm">Copyright © 2024</span>
            </div>
        </footer>
    );
}

export default FooterNavigation;
