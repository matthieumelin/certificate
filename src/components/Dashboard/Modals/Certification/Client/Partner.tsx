import { type FC } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { toast } from 'react-toastify';
import { Form, Formik } from 'formik';
import { PartnerCertificateStep, type CertificateType, ClientCertificateStep } from '@/types/certificate.d';
import Steps from '@/components/Dashboard/Steps';
import { Button } from '@/components/UI/Button';
import { useClientCertificateStore } from '@/stores/certification/clientCertificateStore';

interface ClientCertificationPartnerProps {
}

interface FormValues {
    certificate_type_id: number | null;
}

const ClientCertificationPartnerModal: FC<ClientCertificationPartnerProps> = ({ }) => {
    const { draft, setDraft } = useClientCertificateStore();

    const steps = Object.values(ClientCertificateStep);

    const initialFormValues: FormValues = {
        certificate_type_id: draft.certificate_type_id || null,
    }

    const handleSubmit = async (values: FormValues) => {
        if (!draft.id) return;

        try {
            setDraft({
                certificate_type_id: values.certificate_type_id!,
                current_step: ClientCertificateStep.Payment
            });
        } catch (error) {
            console.error("Erreur mise à jour draft:", error);
            toast.error("Erreur lors de la sauvegarde");
        }
    }

    return (
        <div>
            <Steps
                mode='client'
                steps={steps} />

            <Formik
                initialValues={initialFormValues}
                onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <div>
                            <h2 className='text-white text-2xl font-semibold'>Choix du point de contrôle</h2>
                            <p className='mt-2 text-gray'>Sélectionnez le point de contrôle que vous souhaitez pour votre certification</p>
                            <div className='flex justify-end gap-5'>
                                <Button
                                    theme="secondary"
                                    className='lg:w-max'
                                    onClick={() => setDraft({ current_step: ClientCertificateStep.Service })}>
                                    <IoIosArrowBack /> Précédent
                                </Button>
                                <Button
                                    type='submit'
                                    className='lg:w-max'
                                    disabled={!values.certificate_type_id}>
                                    Suivant <IoIosArrowForward />
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ClientCertificationPartnerModal