import { Button } from '@/components/UI/Button';
import { type FC } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { LiaCertificateSolid } from 'react-icons/lia';

interface EmptyCertificatesProps {
    title: string;
    description: string;
    onCreateCertificate: () => void;
}

const EmptyCertificates: FC<EmptyCertificatesProps> = ({ title, description, onCreateCertificate }) => {
    return (
        <div className='flex flex-col items-center p-12 rounded-2xl border-2 border-dashed border-emerald-900/30 bg-black/20 hover:border-emerald-500/50 transition-all'>
            <div className='relative'>
                <div className='absolute inset-0 bg-emerald-500/20 blur-xl rounded-full'></div>
                <div className='relative p-5 bg-emerald-600/20 rounded-2xl border border-emerald-500/30'>
                    <IoMdAdd size={32} className='text-emerald-400' />
                </div>
            </div>
            
            <h2 className='mt-6 text-white text-xl font-light text-center'>
                {title}
            </h2>
            <p className='mt-3 text-neutral-400 text-center italic max-w-md'>
                {description}
            </p>
            
            <Button 
                className='mt-6 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20' 
                onClick={onCreateCertificate}
            >
                <LiaCertificateSolid size={20} /> Créer une certification
            </Button>
        </div>
    )
}

export default EmptyCertificates