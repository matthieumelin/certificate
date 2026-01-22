import { type FC, type ReactNode } from 'react'
import { Link } from 'react-router-dom';

interface AppLinkProps {
    to: string;
    className?: string;
    children: ReactNode;
}

const AppLink: FC<AppLinkProps> = ({ to, className = '', children }) => {
    return (
        <Link to={to} className={`text-green underline font-medium ${className}`}>{children}</Link>
    )
}

export default AppLink;