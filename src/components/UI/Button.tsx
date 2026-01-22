import { type FC, type ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode;
    disabled?: boolean;
    theme?: 'primary' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ disabled, type = "button", className, children, theme = 'primary', onClick }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={`
                w-full font-bold uppercase text-sm tracking-wider rounded-xl px-6 py-3
                flex justify-center items-center gap-2 
                transition-all duration-200
                ${theme === "primary"
                    ? `bg-emerald-600 hover:bg-emerald-500 text-white
                       disabled:bg-emerald-900/20 disabled:hover:bg-emerald-900/20`
                    : `text-white bg-black/40 hover:bg-emerald-900/20 border border-emerald-900/30 hover:border-emerald-500/50
                       disabled:bg-black/20 disabled:hover:bg-black/20 disabled:text-neutral-600 disabled:border-emerald-900/10`
                }
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:shadow-none
                ${className}
            `}>
            {children}
        </button>
    )
}