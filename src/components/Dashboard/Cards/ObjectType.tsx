import type { ObjectType } from '@/types/object'
import { useFormikContext } from 'formik';
import { type FC } from 'react'

interface ObjectTypeCardProps {
    data: ObjectType;
}

const ObjectTypeCard: FC<ObjectTypeCardProps> = ({ data }) => {
    const { values, setFieldValue } = useFormikContext<{
        type: string;
    }>();

    const handleSelect = () => {
        if (!data.is_active) return;
        setFieldValue("type", data.name);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!data.is_active) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFieldValue("type", data.name);
        }
    }

    const isSelected = values.type === data.name;
    const isDisabled = !data.is_active;

    return (
        <div
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            className={`
                h-full group duration-200 flex flex-col items-center justify-between border-2 rounded-xl p-5 transition-all
                ${isDisabled
                    ? "opacity-50 cursor-not-allowed border-white/5"
                    : "cursor-pointer focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 focus:ring-offset-gray-900"
                }
                ${!isDisabled && isSelected
                    ? "border-green bg-green/5"
                    : ""
                }
                ${!isDisabled && !isSelected
                    ? "hover:border-green border-white/10"
                    : ""
                }
            `}
        >
            <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                <div
                    className={`text-4xl transition-transform duration-200 ${!isDisabled ? "group-hover:scale-110" : ""}`}
                    aria-hidden="true"
                >
                    {data.icon}
                </div>
                <h2 className='text-white text-center font-semibold'>{data.label}</h2>
            </div>
            {isDisabled && (
                <span className='text-xs text-white/50 mt-2'>Indisponible</span>
            )}
        </div>
    )
}

export default ObjectTypeCard