import { type FC } from 'react'
import type { MonthlyData } from '@/types/stat'

interface CertificatesChartProps {
    data: MonthlyData[];
}

const CertificatesChart: FC<CertificatesChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map((value: MonthlyData) => value.certificates), 1);
    return (
        <div>
            {data.map((item: MonthlyData, index: number) => (
                <div key={index}>
                    <div className='flex items-center justify-between mb-1'>
                        <span className='text-gray text-sm'>{item.month}</span>
                        <span className='text-white text-sm font-semibold'>{item.certificates}</span>
                    </div>
                    <div className='w-full bg-white/10 rounded-full h-2'>
                        <div className='bg-green h-2 rounded-full transition-all duration-300'
                            style={{ width: `${(item.certificates / maxValue) * 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CertificatesChart