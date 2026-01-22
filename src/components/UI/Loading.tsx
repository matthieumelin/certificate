import { type FC } from 'react'

const Loading: FC = () => {
    return (
        <div className='bg-[#050a08] absolute left-0 top-0 right-0 bottom-0 h-screen w-screen flex flex-col items-center justify-center gap-4'>
            <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-900/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-400/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className='text-white font-light text-lg'>
                Chargement<span className='text-emerald-500 font-bold'>...</span>
            </p>
        </div>
    )
}

export default Loading