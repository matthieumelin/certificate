import { useEffect, useRef, useState, type FC } from 'react'
import { LuChevronsUpDown } from 'react-icons/lu'
import { MdOutlineLogout } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import useAuth from '@/contexts/AuthContext';
import AppLink from '@/components/AppLink';
import routes from '@/utils/routes';
import { Link } from 'react-router-dom';

const SidebarUserProfile: FC = () => {
    const { userProfile } = useAuth();
    const [open, setOpen] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open])

    const handleToggleMenu = () => {
        setOpen(!open);
    }

    if (!userProfile) {
        return null;
    }

    const fullName = `${userProfile.first_name} ${userProfile.last_name}` || 'John Doe';
    const splittedFullName = fullName.split(" ");
    const initialFullName = splittedFullName[0].charAt(0) + splittedFullName[1].charAt(0);

    return (
        <div className='relative' ref={menuRef}>
            {open ? (
                <div className={`top-24 lg:-top-52 lg:left-0 right-0 absolute border border-emerald-900/30 bg-black/90 backdrop-blur-sm rounded-2xl z-50 shadow-xl`}>
                    <Link to={routes.Dashboard.Profile} className='group rounded-t-2xl hover:bg-emerald-900/20 grid grid-cols-[40px_1fr] items-center gap-3 p-4 transition-colors'>
                        <div className='rounded-xl text-white font-bold bg-emerald-600 h-full flex items-center justify-center'>
                            {initialFullName}
                        </div>
                        <div>
                            <h2 className='text-white font-bold'>{fullName}</h2>
                            <h3 className='text-neutral-400 text-sm truncate max-w-[150px]'>{userProfile.email}</h3>
                        </div>
                    </Link>
                    <ul>
                        <li className='border-t border-emerald-900/30 p-4 hover:bg-emerald-900/20 transition-colors'>
                            <AppLink to={routes.Dashboard.Profile} className='text-white no-underline! flex items-center gap-3 font-medium'>
                                <CiSettings size={20} className='text-emerald-400' /> Paramètres
                            </AppLink>
                        </li>
                        <li className='border-t border-emerald-900/30 p-4 hover:bg-red-900/20 transition-colors rounded-b-2xl'>
                            <AppLink to={routes.Logout} className='text-red-400 no-underline! flex items-center gap-3 font-medium'>
                                <MdOutlineLogout size={20} /> Se déconnecter
                            </AppLink>
                        </li>
                    </ul>
                </div>
            ) : null}

            <div
                onClick={handleToggleMenu}
                className={`group rounded-xl hover:bg-emerald-900/20 flex gap-2 items-center justify-between p-3 cursor-pointer transition-colors ${open ? "bg-emerald-900/20" : ""}`}>
                <div className='flex items-center gap-3'>
                    <div className={`rounded-xl text-white font-bold w-10 h-10 flex items-center justify-center transition-colors ${!open ? "bg-emerald-600" : "bg-emerald-600"}`}>
                        {initialFullName}
                    </div>
                    <div>
                        <h2 className='text-white font-bold text-sm'>{fullName}</h2>
                        <h3 className='text-neutral-400 text-sm truncate max-w-[150px]'>{userProfile.email}</h3>
                    </div>
                </div>
                <LuChevronsUpDown className='text-emerald-400' size={18} />
            </div>
        </div>
    )
}

export default SidebarUserProfile