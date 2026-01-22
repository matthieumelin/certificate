import { type FC } from 'react'
import { BiCheck } from 'react-icons/bi';
import type { CertificateType } from '@/types/certificate';
import { renderStyledText } from '@/helpers/text';

interface CertificateTypeCardProps {
    selected: boolean;
    data: CertificateType;
    onSelect: () => void;
}

const CertificateTypeCard: FC<CertificateTypeCardProps> = ({ selected, data, onSelect }) => {
    const MAX_VISIBLE_FEATURES = 6;
    const visibleFeatures = data.features?.slice(0, MAX_VISIBLE_FEATURES) || [];
    const remainingCount = (data.features?.length || 0) - MAX_VISIBLE_FEATURES;

    return (
        <div onClick={onSelect} className={`cursor-pointer border rounded-xl p-8 ${selected ? "border-green bg-green/5" : "border-white/10 hover:border-green duration-200"}`}>
            <div className='flex items-center justify-between'>
                <h2 className='text-white text-xl font-semibold'>{data.name}</h2>
                <div className='flex items-center justify-center border border-white/20 rounded-full h-4 w-4'>
                    {selected && <div className='rounded-full bg-green h-2 w-2' />}
                </div>
            </div>
            <p className='mt-3 mb-8 text-gray'>{data.description}</p>
            <h3 className='text-white text-3xl font-semibold'>{data.price.toFixed(2)}€</h3>
            {data.features && data.features.length > 0 ? (
                <div className='mt-6'>
                    <ul className='space-y-1'>
                        {visibleFeatures.map((feature: string, index: number) => (
                            <li key={index} className='flex items-center gap-2 text-white'>
                                <BiCheck size={22} className='text-green' />
                                <span>{renderStyledText(feature)}</span>
                            </li>
                        ))}
                    </ul>
                    {remainingCount > 0 && (
                        <p className='mt-3 text-gray text-sm'>
                            + {remainingCount} autre{remainingCount > 1 ? 's' : ''} fonctionnalité{remainingCount > 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            ) : null}
        </div>
    )
}

export default CertificateTypeCard