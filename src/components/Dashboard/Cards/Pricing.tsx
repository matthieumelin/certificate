import { renderStyledText } from '@/helpers/text';
import type { FC } from 'react';

type Variant = 'default' | 'premium' | 'custom';

interface PricingCardProps {
    title: string;
    price: number | string;
    priceLabel?: string;
    features: string[];
    buttonText: string;
    isRecommended?: boolean;
    physical?: boolean;
    variant?: Variant;
    goal?: string;
}

const PricingCard: FC<PricingCardProps> = ({
    title,
    price,
    priceLabel = '/ certificat',
    features,
    buttonText,
    isRecommended = false,
    physical = false,
    variant = 'default',
    goal,
}) => {
    const baseClasses = 'p-5 lg:p-10 rounded-[45px] border transition-all flex flex-col';

    const variantClasses: Record<Variant, string> = {
        default: 'border-emerald-900/30 bg-[#050a08] hover:border-emerald-800',
        premium: 'border-emerald-500 bg-[#0a1410] shadow-[0_20px_60px_rgba(5,150,105,0.15)] relative scale-105 z-10',
        custom: 'border-emerald-900/30 bg-[#050a08] hover:border-emerald-800'
    };

    const featureTextClasses: Record<Variant, string> = {
        default: 'text-neutral-400',
        premium: 'text-white',
        custom: 'text-neutral-400'
    };

    const checkmarkClasses: Record<Variant, string> = {
        default: 'text-emerald-500',
        premium: 'text-emerald-400',
        custom: 'text-emerald-500'
    };

    const buttonClasses: Record<Variant, string> = {
        default: 'bg-emerald-950 text-emerald-400 border border-emerald-800/30 hover:bg-emerald-900',
        premium: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20',
        custom: 'bg-emerald-950 text-emerald-400 border border-emerald-800/30 hover:bg-emerald-900'
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]}`}>
            {isRecommended && (
                <div className="absolute -top-4 left-1/2 -tranneutral-x-1/2 bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    Recommandé
                </div>
            )}

            <h4 className="text-white font-bold text-lg mb-6 tracking-widest uppercase">
                {title}
            </h4>

            <div className='mb-8 space-y-2'>
                <div className="flex items-baseline gap-1">
                    {typeof price === 'number' ? (
                        <>
                            <span className="text-5xl font-bold text-white tracking-tighter">{`${price === 0 ? "Gratuit" : `${price}€`}`}</span>
                            <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">{price === 0 ? "" : priceLabel}</span>
                        </>
                    ) : (
                        <span className="text-4xl font-bold text-white tracking-tighter">{price}</span>
                    )}
                </div>
                {price === 0 && <span className='text-neutral-500'>(puis 5€/certificat)</span>}
            </div>

            <ul className="space-y-2 mb-12 grow">
                {features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-3 text-sm ${featureTextClasses[variant]} italic`}>
                        <span className={`${checkmarkClasses[variant]} font-bold`}>✓</span>
                        <span className="leading-snug">
                            {renderStyledText(feature)}
                        </span>
                    </li>
                ))}
            </ul>

            <div className='space-y-6'>
                {price !== 0 && (
                    <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/20 border border-emerald-800/30'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-400'></span>
                        <p className='text-xs text-white font-medium'>
                            {physical ? renderStyledText("**Inspection physique**") : "Inspection en ligne"}
                        </p>
                    </div>
                )}

                {goal && (
                    <div className='bg-black/20 rounded-xl p-4 border border-emerald-900/20'>
                        <p className='text-xs text-emerald-400/60 uppercase font-bold mb-1'>Idéal pour</p>
                        <p className='text-sm text-neutral-300'>{goal}</p>
                    </div>
                )}

                <p className='text-[11px] text-neutral-500 italic leading-relaxed'>
                    * Les prix peuvent varier selon les options sélectionnées
                </p>

                <button className={`w-full py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${buttonClasses[variant]}`}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default PricingCard;