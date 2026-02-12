import { useState, type FC } from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import { useClientCertificateStore } from '@/stores/certification/clientCertificateStore';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';
import { ClientCertificateStep, type CertificateType } from '@/types/certificate.d';
import type { PaymentMethod } from '@/types/payment.d';
import PaymentMethodCard from '@/components/Dashboard/Cards/PaymentMethod';
import { Button } from '@/components/UI/Button';
import Steps from '@/components/Dashboard/Steps';
import { usePaymentMethods } from '@/hooks/useSupabase';
import Loading from '@/components/UI/Loading';

interface ClientCertificationPaymentModalProps {
    certificateTypes: CertificateType[];
    setIsModalOpen: (value: boolean) => void;
    setIsConfirmPaymentModalOpen: (value: boolean) => void;
    onSuccess?: () => void;
}

interface SummarItemProps {
    label: string;
    value: string;
}
const SummaryItem: FC<SummarItemProps> = ({
    label,
    value,
}) => {
    const isTotal = label === "Total";
    return (
        <div className={`flex justify-between ${isTotal ? "border-t border-t-white/10 pt-3" : ""}`}>
            <span className={`${isTotal ? "text-white text-xl font-semibold" : "text-gray"}`}>{label}</span>
            <span className={`${isTotal ? "text-green text-xl font-semibold" : "text-white font-medium"}`}>{value}</span>
        </div>
    )
}

const ClientCertificationPaymentModal: FC<ClientCertificationPaymentModalProps> = ({
    certificateTypes,
    setIsModalOpen,
    setIsConfirmPaymentModalOpen,
    onSuccess
}) => {
    const { request } = useApi();
    const { draft, setDraft, clearDraft } = useClientCertificateStore();
    const { paymentMethods, isLoading } = usePaymentMethods(true, { only_partner: false });

    const [processPayment, setProcessPayment] = useState<boolean>(false);

    const steps = Object.values(ClientCertificateStep);

    const currentPaymentMethod = paymentMethods.find(paymentMethod => paymentMethod.id === draft.payment_method_id);
    const currentCertificateType = certificateTypes.find(certificateType => certificateType.id === draft.certificate_type_id);
    const certificateTypePrice = `${currentCertificateType?.price ? `${currentCertificateType.price} €` : "Prix indisponible"}`;

    const filteredPaymentMethods = paymentMethods.filter(paymentMethod => paymentMethod.is_active);

    const customerFullName = `${draft.customer_data ? `${draft.customer_data.first_name} ${draft.customer_data.last_name}` : "Informations indisponible"}`;

    const handleSelectPaymentMethod = async (paymentMethod: PaymentMethod) => {
        setDraft({ payment_method_id: paymentMethod.id });
    }

    const handleSubmit = async () => {
        if (!draft.id) {
            toast.error("Aucun brouillon n'a été trouvé.")
            return;
        }

        if (!draft.customer_data) {
            toast.error("Aucune donnée client n'a été trouvée.")
            return;
        }

        if (!currentCertificateType) {
            toast.error("Aucun type de certificat n'a été trouvé.");
            return;
        }

        if (!currentPaymentMethod) {
            toast.error("Aucune méthode de paiement n'a été trouvée.")
            return;
        }

        try {
            await request('/upsert-certificate-draft', {
                method: 'POST',
                body: {
                    id: draft.id,
                    customer_data: draft.customer_data,
                    object_type_id: draft.object_type_id,
                    object_brand: draft.object_brand,
                    object_model: draft.object_model,
                    object_reference: draft.object_reference,
                    object_serial_number: draft.object_serial_number,
                    certificate_type_id: draft.certificate_type_id,
                    payment_method_id: draft.payment_method_id,
                    created_by: draft.created_by,
                }
            });
        } catch (error) {
            toast.error("Erreur lors de la création du brouillon");
            return;
        }

        if (!currentPaymentMethod.is_online) {
            setIsModalOpen(false);
            setIsConfirmPaymentModalOpen(true);
            return;
        }

        setProcessPayment(true);

        try {
            const response = await request('/create-checkout-session', {
                method: 'POST',
                body: {
                    draftId: draft.id,
                    customerData: draft.customer_data,
                    objectTypeId: draft.object_type_id,
                    objectModel: draft.object_model,
                    objectBrand: draft.object_brand,
                    objectReference: draft.object_reference,
                    objectSerialNumber: draft.object_serial_number,
                    certificateTypeId: draft.certificate_type_id,
                    paymentMethodId: draft.payment_method_id,
                    createdBy: draft.created_by,
                }
            });

            if (!response.success) {
                throw new Error("Erreur serveur");
            }

            toast.success("Lien de paiement envoyé avec succès au client !");

            setIsModalOpen(false);
            clearDraft();

            if (onSuccess) {
                await onSuccess();
            }
        } catch (error: any) {
            console.error("Erreur paiement:", error);
            toast.error(error.message || "Une erreur est survenue");
        } finally {
            setProcessPayment(false);
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <Steps
                mode='client'
                steps={steps} />
            <div>
                <h2 className='text-white text-2xl font-semibold'>Mode de paiement</h2>
                <p className='mt-2 text-gray'>Veuillez sélectionnez votre mode de paiement</p>
                <div className='mt-8 border border-white/10 p-5 rounded-xl'>
                    <h3 className='text-white text-xl font-semibold'>Récapitulatif</h3>
                    <div className='mt-8 grid gap-3'>
                        <SummaryItem label='Client' value={customerFullName} />
                        {currentCertificateType && (
                            <>
                                <SummaryItem label='Service' value={currentCertificateType.name} />
                                <SummaryItem label='Total' value={certificateTypePrice} />
                            </>
                        )}
                    </div>
                </div>
                {filteredPaymentMethods && filteredPaymentMethods.length > 0 ? (
                    <div className='mt-8 grid gap-4'>
                        {filteredPaymentMethods.map((paymentMethod: PaymentMethod) => (
                            <PaymentMethodCard
                                key={paymentMethod.id}
                                selected={paymentMethod.id === currentPaymentMethod?.id}
                                data={paymentMethod}
                                onSelect={() => handleSelectPaymentMethod(paymentMethod)} />
                        ))}
                    </div>
                ) : (
                    <p className="my-8 text-gray">Aucun moyen de paiement n'est disponible.</p>
                )}
                <div className='mt-8 flex flex-col md:flex-row justify-end gap-5'>
                    <Button
                        theme="secondary"
                        className='lg:w-max'
                        onClick={() => setDraft({ current_step: ClientCertificateStep.Service })}>
                        <IoIosArrowBack /> Précédent
                    </Button>
                    <Button
                        disabled={currentPaymentMethod == null || processPayment}
                        className='lg:w-max'
                        onClick={handleSubmit}>
                        {processPayment ? "Confirmation..." : "Confirmer"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ClientCertificationPaymentModal