import { type FC } from 'react'

interface SeperatorProps {
    text: string;
}

const Seperator: FC<SeperatorProps> = ({ text }) => {
    return (
        <div className='flex items-center gap-4 my-8'>
            <div className='w-full h-px bg-emerald-900/30' />
            <span className='text-emerald-400/60 uppercase text-xs font-bold whitespace-nowrap'>{text}</span>
            <div className='w-full h-px bg-emerald-900/30'></div>
        </div>
    )
}

export default Seperator