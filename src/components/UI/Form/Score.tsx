import { useFormikContext } from 'formik';
import { type FC } from 'react'

interface ScoreProps {
    score: number;
    fieldName: string;
}

const Score: FC<ScoreProps> = ({ score, fieldName }) => {
    const { setFieldValue } = useFormikContext();

    return (
        <ul className='flex items-center gap-2'>
            {[...Array(11)].map((_: number, index: number) => {
                const active = score === index;
                return (
                    <li
                        onClick={() => setFieldValue(fieldName, index)}
                        className={`duration-200 w-10 h-10 flex items-center justify-center border ${active ? "border-green text-green" : "text-white border-white/10 hover:border-white/20"} rounded-xl cursor-pointer`} key={index}>{index}</li>
                )
            })}
        </ul>
    )
}

export default Score