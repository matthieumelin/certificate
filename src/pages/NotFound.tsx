import ButtonLink from '@/components/UI/ButtonLink'
import { type FC } from 'react'

const NotFoundPage: FC = () => {
    return (
        <div className='min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden bg-[#050a08]'>
            <div className="absolute inset-0 bg-linear-to-br from-emerald-900/20 to-[#0a1410] pointer-events-none"></div>
            <div className="absolute -left-24 -top-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>

            <div className='relative z-10 bg-black/40 backdrop-blur-sm border border-emerald-900/30 rounded-3xl p-12 w-full max-w-xl text-center'>
                <h1 className='text-6xl text-emerald-500 font-bold mb-2'>404</h1>
                <h2 className='text-2xl text-white font-light mb-4'>Page introuvable</h2>
                <p className='text-neutral-400 italic mb-8'>
                    La page que vous recherchez n'existe pas ou a été déplacée
                </p>
                <ButtonLink
                    to="/"
                    className='bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold uppercase transition-all inline-block'
                >
                    Retour à l'accueil
                </ButtonLink>
            </div>
        </div>
    )
}

export default NotFoundPage