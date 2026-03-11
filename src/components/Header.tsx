import { appName } from '@/main';
import routes from '@/utils/routes';
import { useState, type FC } from 'react'
import { IoMdClose } from 'react-icons/io';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Link } from 'react-router-dom';

const Header: FC = () => {
    const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

    return (
        <header>
            <nav className="lg:fixed lg:left-0 lg:right-0 lg:top-0 lg:z-50 py-6 px-8 border-b border-emerald-900/30 bg-[#050a08]/90 backdrop-blur-md">
                <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between lg:items-center">
                    <div className="flex items-center justify-between gap-2">
                        <Link to={routes.Home}>
                            <img className='max-w-16' src="/logo.png" alt={appName} />
                        </Link>
                        <button className='lg:hidden' onClick={() => setNavbarOpen(prev => !prev)} type="button">
                            {navbarOpen ? <IoMdClose size={22} className='text-white' /> : <RxHamburgerMenu size={22} className='text-neutral-400' />}
                        </button>
                    </div>

                    <ul className={`${navbarOpen ? "flex" : "hidden lg:flex"} mt-6 lg:mt-0 flex-col lg:flex-row lg:items-center gap-4 lg:gap-8`}>
                        <li>
                            <a href="#features" className="text-neutral-400 hover:text-emerald-400 transition-colors">Fonctionnalités</a>
                        </li>
                        <li>
                            <a href="#search" className="text-neutral-400 hover:text-emerald-400 transition-colors">Rechercher</a>
                        </li>
                        <li>
                            <a href="#pricing" className="text-neutral-400 hover:text-emerald-400 transition-colors">Prix</a>
                        </li>
                    </ul>

                    <Link target='_blank' to={routes.Dashboard.Main} className="mt-6 lg:mt-0 block bg-emerald-700/20 text-emerald-400 border border-emerald-700/50 px-6 py-2 rounded-full">Ouvrir l'application</Link>
                </div>
            </nav>
        </header>
    )
}

export default Header