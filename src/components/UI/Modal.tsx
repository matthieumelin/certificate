import type { ModalProps } from '@/types/modal';
import { type FC } from 'react'
import { FaX } from 'react-icons/fa6';

const Modal: FC<ModalProps> = ({ title, description, content, onClose }) => {
    if (!content) return null;

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    const handleCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
    }

    return (
        <div
            className='fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm duration-200'
            onClick={handleBackdropClick}>
            <div className='min-h-full flex items-center justify-center p-4'>
                <div className='w-full max-w-3xl my-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-emerald-900/30 shadow-2xl'
                    onClick={(event) => event.stopPropagation()}>
                    <div className='flex items-center justify-between p-6 border-b border-emerald-900/30'>
                        <div>
                            {title && <h2 className='text-2xl text-white font-light'>{title}</h2>}
                            {description && <p className='text-neutral-400 italic mt-1'>{description}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={handleCloseClick}
                            className='text-neutral-400 hover:text-white transition-colors p-2 hover:bg-emerald-900/20 rounded-xl'>
                            <FaX size={16} />
                        </button>
                    </div>

                    <div className='p-6 overflow-y-auto max-h-[70vh]'>
                        {content}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal