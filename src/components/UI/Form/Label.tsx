import { type FC } from 'react'
import { useFieldError } from '@/hooks/useFieldError';

interface LabelProps {
    htmlFor: string;
    label: string;
    className?: string;
    required?: boolean;
}

const Label: FC<LabelProps> = ({ htmlFor, label, className, required }) => {
    const { hasError } = useFieldError(htmlFor);

    return (
        <label
            className={`text-sm font-bold uppercase transition-colors ${hasError ? 'text-red-400' : 'text-emerald-400/60'} ${className || ''}`}
            htmlFor={htmlFor}
        >
            {label} {required && <span className='text-red-400'>*</span>}
        </label>
    )
}

export default Label