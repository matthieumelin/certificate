import { type FC } from 'react'
import { Button } from '../../UI/Button';

interface ConfirmationModalProps {
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ title, description, onConfirm, onCancel }) => {
    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
            <div className='bg-dark rounded-xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'>
                <h2 className='text-white text-xl font-bold mb-4'>{title || "Confirmer"}</h2>
                <p>{description || "Êtes-vous sûr de confirmer cette action ?"}</p>
                <div>
                    <Button theme='secondary' onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button onClick={onConfirm}>
                        Confirmer
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal