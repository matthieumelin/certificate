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

    const isSelected = values.type === data.name;
    const isDisabled = !data.is_active;

    return (
        <div
            onClick={handleSelect}
            className={`
                group duration-200 flex flex-col items-center justify-center gap-2 border-2 rounded-xl p-5 transition-all
                ${isDisabled
                    ? "opacity-50 cursor-not-allowed border-white/5"
                    : "cursor-pointer"
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
            <div className={`text-4xl transition-transform duration-200 ${!isDisabled ? "group-hover:scale-110" : ""}`}>
                {data.icon}
            </div>
            <h2 className='text-white text-center font-semibold'>{data.label}</h2>
            {isDisabled && (
                <span className='text-xs text-white/50 mt-1'>Indisponible</span>
            )}
        </div>
    )
}

export default ObjectTypeCard