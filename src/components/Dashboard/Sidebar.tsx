import { useState, type FC, type ReactNode } from 'react'
import { LuHouse, LuUsers } from "react-icons/lu";
import { LiaCertificateSolid } from "react-icons/lia";
import { Link, NavLink } from 'react-router-dom';
import { BiBarChart } from 'react-icons/bi';
import { FaHandshake, FaMoneyBillWave } from 'react-icons/fa6';
import { HiDocumentReport } from 'react-icons/hi';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { hasMinimumRole } from '../../utils/user';
import { UserProfileRole } from '@/types/user.d';
import useAuth from '@/contexts/AuthContext';
import SidebarUserProfile from '@/components/Dashboard/UserProfile';
import routes from '@/utils/routes';

interface SidebarItemProps {
    to: string;
    children: ReactNode;
}

interface SidebarMenuItem {
    name: string;
    to: string;
    icon: ReactNode;
}

interface SidebarMenu {
    title: string;
    items: SidebarMenuItem[];
    minRole: UserProfileRole | null;
}

const menus: SidebarMenu[] = [
    {
        title: "Navigation",
        minRole: null,
        items: [
            {
                name: "Tableau de bord",
                to: routes.Dashboard.Main,
                icon: <LuHouse size={18} />
            },
            {
                name: "Certificats",
                to: routes.Dashboard.Certificates.Main,
                icon: <LiaCertificateSolid size={18} />
            }
        ],
    },
    {
        title: "Partenaires",
        minRole: UserProfileRole.Partner,
        items: [
            {
                name: "Certificats",
                to: routes.Dashboard.Partner.Certificates.List,
                icon: <LiaCertificateSolid size={18} />
            }
        ]
    },
    {
        title: "Administration",
        minRole: UserProfileRole.Admin,
        items: [
            {
                name: "Vue d'ensemble",
                to: routes.Dashboard.Admin.Main,
                icon: <BiBarChart size={18} />
            },
            {
                name: "Gestion des utilisateurs",
                to: routes.Dashboard.Admin.Users.List,
                icon: <LuUsers size={18} />
            },
            {
                name: "Ateliers & Partenaires",
                to: routes.Dashboard.Admin.Partners.List,
                icon: <FaHandshake size={18} />
            },
            {
                name: "Tous les certificats",
                to: routes.Dashboard.Admin.Certificates.List,
                icon: <LiaCertificateSolid size={18} />
            },
            {
                name: "Paiements",
                to: routes.Dashboard.Admin.Payments.List,
                icon: <FaMoneyBillWave size={18} />
            },
            {
                name: "Rapports & Statistiques",
                to: routes.Dashboard.Admin.Reports.List,
                icon: <HiDocumentReport size={18} />
            }
        ]
    }
]

const SidebarItem: FC<SidebarItemProps> = ({ to, children }) => {
    return (
        <li>
            <NavLink
                end
                to={to}
                className={({ isActive }) => `
                    text-white flex items-center gap-3 px-4 py-3 rounded-xl 
                    transition-all font-medium
                    ${isActive
                        ? "bg-emerald-600 shadow-lg shadow-emerald-600/20"
                        : "hover:bg-emerald-900/20 hover:text-emerald-400"
                    }
                `}
            >
                {children}
            </NavLink>
        </li>
    )
}

const Sidebar: FC = () => {
    const { userProfile } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    }

    const filteredMenus = menus.filter((menu: SidebarMenu) =>
        hasMinimumRole(userProfile?.role, menu.minRole)
    );

    return (
        <nav className='lg:h-screen p-4 flex flex-col justify-between border-r border-emerald-900/30 bg-black/40 backdrop-blur-sm'>
            <div>
                <div className='flex items-center justify-between'>
                    <Link to={routes.Home} className="hover:scale-105 transition-transform">
                        <img className='block max-w-[60px] w-full' src="/logo.png" alt="Certificate" />
                    </Link>
                    <button onClick={handleToggle} type="button" className='lg:hidden text-white hover:text-emerald-400 transition-colors'>
                        {isOpen ? <IoCloseOutline size={28} /> : <RxHamburgerMenu size={22} />}
                    </button>
                </div>

                {filteredMenus && filteredMenus.length > 0 ? (
                    <div className={`lg:mt-8 space-y-8 transition-all duration-500 ease-in-out overflow-hidden lg:overflow-visible lg:max-h-full lg:opacity-100 ${isOpen ? "max-h-[1000px] opacity-100 py-8" : "max-h-0 opacity-0 lg:max-h-full lg:opacity-100"}`}>
                        {filteredMenus.map((menu: SidebarMenu, index: number) => (
                            <ul key={index} className={index > 0 ? "space-y-1" : "space-y-1"}>
                                {menu.title && (
                                    <span className='text-emerald-400/60 text-xs uppercase font-bold mb-3 block px-4'>
                                        {menu.title}
                                    </span>
                                )}
                                {menu.items.map((item: SidebarMenuItem, itemIndex: number) => (
                                    <SidebarItem key={itemIndex} to={item.to}>
                                        {item.icon} {item.name}
                                    </SidebarItem>
                                ))}
                            </ul>
                        ))}
                    </div>
                ) : null}
            </div>

            <SidebarUserProfile />
        </nav>
    )
}

export default Sidebar