import { type FC } from 'react'

interface CertificateStatCardProps {
    label: string;
    value: number;
}

const CertificateStatCard: FC<CertificateStatCardProps> = ({ label, value }) => {
    return (
        <div className='p-5 border border-white/10 rounded-xl'>
            <h2 className='text-gray'>{label}</h2>
            <h3 className='text-2xl text-white font-bold'>{value}</h3>
        </div>
    )
}

export default CertificateStatCard