import { useState, type FC } from 'react'
import { usePartnerCertificateStore } from '@/stores/certification/partnerCertificateStore';
import { type CertificateType } from '@/types/certificate.d';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/UI/Button';

interface ConfirmInStorePaymentModalProps {
    certificateTypes: CertificateType[];
    onCancel: () => void;
    setIsModalOpen: (value: boolean) => void;
    setIsConfirmPaymentModalOpen: (value: boolean) => void;
    onSuccess?: () => void;
}

const ConfirmInStorePaymentModal: FC<ConfirmInStorePaymentModalProps> = ({
    certificateTypes,
    onCancel,
    setIsModalOpen,
    setIsConfirmPaymentModalOpen,
    onSuccess
}) => {
    const { request } = useApi();
    const { draft, clearDraft } = usePartnerCertificateStore();

    const [processPayment, setProcessPayment] = useState<boolean>(false);

    const certificateType = certificateTypes.find(certificateType => certificateType.id === draft.certificate_type_id);
    const certificateTypePrice = `${certificateType?.price ? `${certificateType.price} €` : "Prix indisponible"}`;

    const customerFullName = `${draft.customer_data ? `${draft.customer_data.first_name} ${draft.customer_data.last_name}` : "Informations indisponible"}`;

    const handleSubmit = async () => {
        if (!draft.id) return;

        setProcessPayment(true);

        try {
            await request(`${import.meta.env.VITE_API_URL}/confirm-instore-payment`, {
                method: "POST",
                body: {
                    draftId: draft.id,
                },
            });

            toast.success("Paiement confirmé et certificat créé avec succès !");
            setIsConfirmPaymentModalOpen(false);
            setIsModalOpen(false);
            clearDraft();

            if (onSuccess) {
                await onSuccess();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur lors de la confirmation");
        } finally {
            setProcessPayment(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <h3 className="text-yellow-500 font-semibold mb-1">
                            Confirmation de paiement en boutique
                        </h3>
                        <p className="text-gray text-sm">
                            Vous êtes sur le point de confirmer que le client a payé en boutique.
                            Cette action est irréversible.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray">Client</span>
                    <span className="text-white font-medium">{customerFullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray">Montant</span>
                    <span className="text-white font-medium">{certificateTypePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray">Mode de paiement</span>
                    <span className="text-white font-medium">En boutique</span>
                </div>
            </div>

            <div className="border-t border-white/10 pt-4">
                <p className="text-gray text-sm mb-4">
                    En confirmant, vous attestez avoir reçu le paiement de <strong className="text-white">{certificateTypePrice}</strong> de la part de <strong className="text-white">{customerFullName}</strong>.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
                <Button
                    theme="secondary"
                    className="lg:flex-1"
                    onClick={onCancel}
                    disabled={processPayment}
                >
                    Annuler
                </Button>
                <Button
                    className="lg:flex-1"
                    onClick={handleSubmit}
                    disabled={processPayment}
                >
                    {processPayment ? "Confirmation..." : "Confirmer le paiement"}
                </Button>
            </div>
        </div>
    );
};

export default ConfirmInStorePaymentModal;