import { useFormikContext } from 'formik';
import { type FC } from 'react'

interface ScoreProps {
    score: number;
    fieldName: string;
}

const Score: FC<ScoreProps> = ({ score, fieldName }) => {
    const { setFieldValue } = useFormikContext();

    const getScoreColor = (index: number, isActive: boolean): string => {
        if (!isActive) return "text-white border-white/10 hover:border-white/20";

        if (index <= 3) return "border-red-500 text-red-500 bg-red-500/10";
        if (index <= 6) return "border-orange-500 text-orange-500 bg-orange-500/10";
        if (index <= 9) return "border-green text-green bg-green/10";
        return "border-blue-500 text-blue-500 bg-blue-500/10";
    };

    return (
        <div className="space-y-3">
            <ul className='flex items-center gap-2'>
                {[...Array(11)].map((_: number, index: number) => {
                    const active = score === index;
                    const colorClasses = getScoreColor(index, active);

                    return (
                        <li
                            onClick={() => setFieldValue(fieldName, index)}
                            className={`duration-200 w-10 h-10 flex items-center justify-center border ${colorClasses} rounded-xl cursor-pointer select-none`}
                            key={index}
                        >
                            {index}
                        </li>
                    )
                })}
            </ul>
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-white/70">0-3 : État critique</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-white/70">4-6 : État moyen</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-white/70">7-9 : État satisfaisant</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-white/70">10 : État excellent</span>
                </div>
            </div>
        </div>
    )
}

export default Score