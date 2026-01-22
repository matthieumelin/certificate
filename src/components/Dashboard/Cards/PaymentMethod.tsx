import { type FC } from 'react'
import type { PaymentMethod } from '@/types/payment'

interface PaymentMethodCardProps {
    data: PaymentMethod;
    selected: boolean;
    onSelect: () => void;
}

const PaymentMethodCard: FC<PaymentMethodCardProps> = ({ data, selected, onSelect }) => {
    return (
        <div onClick={onSelect} className={`cursor-pointer border rounded-xl p-8 ${selected ? "border-green bg-green/5" : "border-white/10 hover:border-green duration-200"}`}>
            <div className='flex items-center justify-between'>
                <h2 className='text-white text-xl font-semibold'>{data.name}</h2>
                <div className='flex items-center justify-center border border-white/20 rounded-full h-4 w-4'>
                    <div className={`rounded-full h-2 w-2 ${selected ? "bg-green" : ""}`} />
                </div>
            </div>
        </div>
    )
}

export default PaymentMethodCard