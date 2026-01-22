import { type FC, type ReactNode } from 'react'
import { Link } from 'react-router-dom';

interface ButtonLinkProps {
    children: ReactNode;
    to: string;
    theme?: 'primary' | 'secondary';
    className?: string;
}

const ButtonLink: FC<ButtonLinkProps> = ({ to, children, className, theme = 'primary' }) => {
    return (
        <Link
            to={to}
            className={`
                w-full font-bold uppercase text-sm tracking-wider rounded-xl px-6 py-3
                flex justify-center items-center gap-2 
                transition-all duration-200
                ${theme === "primary"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "text-white bg-black/40 hover:bg-emerald-900/20 border border-emerald-900/30 hover:border-emerald-500/50"
                }
                ${className}
            `}>
            {children}
        </Link>
    )
}

export default ButtonLink