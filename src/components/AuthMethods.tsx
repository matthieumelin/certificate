import useAuth from '@/contexts/AuthContext';
import { useState, type FC } from 'react'
import { FaGoogle } from 'react-icons/fa';

interface AuthMethodProps {
    onAuth: () => Promise<void>;
    children: React.ReactNode;
    disabled?: boolean;
}

const AuthMethod: FC<AuthMethodProps> = ({ onAuth, children, disabled }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = async () => {
        try {
            setIsLoading(true);
            await onAuth();
        } catch (error) {
            console.error("Erreur d'authentification", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            type='button'
            onClick={handleClick}
            disabled={disabled || isLoading}
            className='hover:cursor-pointer rounded-xl border border-white hover:border-green hover:bg-green duration-200 p-5 disabled:opacity-50 disabled:cursor-not-allowed'>
            {children}
        </button>
    )
}

const AuthMethods: FC = () => {
    const { signInWithGoogle } = useAuth();

    return (
        <div className='flex flex-wrap justify-center gap-4'>
            <AuthMethod onAuth={signInWithGoogle}>
                <FaGoogle size={22} color='white' />
            </AuthMethod>
        </div>)
}

export default AuthMethods