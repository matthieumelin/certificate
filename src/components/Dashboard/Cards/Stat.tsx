import { type FC } from 'react'

interface StatCardProps {
    title: string;
    value: number | string;
    icon: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className='bg-dark p-5 rounded-xl border border-white/10'>
            <div className='flex items-center justify-between mb-2'>
                <span className='text-gray text-sm'>{title}</span>
                <span className='text-2xl'>{icon}</span>
            </div>
            <p className='text-white text-3xl font-bold'>{value}</p>
        </div>
    )
}

export default StatCard