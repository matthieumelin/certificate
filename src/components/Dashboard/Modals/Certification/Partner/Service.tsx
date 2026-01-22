import { type FC } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { toast } from 'react-toastify';
import { useCertificateStore } from '@/stores/certificateStore';
import { Form, Formik } from 'formik';
import { PartnerCertificateStep, type CertificateType } from '@/types/certificate.d';
import CertificateTypeCard from '@/components/Dashboard/Cards/Certificate/Type';
import Steps from '@/components/Dashboard/Steps';
import { Button } from '@/components/UI/Button';

interface PartnerCertificationServiceModalProps {
    certificateTypes: CertificateType[];
}

interface FormValues {
    certificate_type_id: number | null;
}

const PartnerCertificationServiceModal: FC<PartnerCertificationServiceModalProps> = ({
    certificateTypes,
}) => {
    const { draft, setDraft } = useCertificateStore();

    const steps = Object.values(PartnerCertificateStep);

    const filteredCertificateTypes = certificateTypes
        .filter((certificateType: CertificateType) => certificateType.physical)
        .sort((a: CertificateType, b: CertificateType) => a.price - b.price);

    const initialFormValues: FormValues = {
        certificate_type_id: draft.certificate_type_id || null,
    }

    const handleSubmit = async (values: FormValues) => {
        if (!draft.id) return;

        try {
            setDraft({
                certificate_type_id: values.certificate_type_id!,
                current_step: PartnerCertificateStep.Payment
            });
        } catch (error) {
            console.error("Erreur mise à jour draft:", error);
            toast.error("Erreur lors de la sauvegarde");
        }
    }

    return (
        <div>
            <Steps
                steps={steps} />

            <Formik
                initialValues={initialFormValues}
                onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <div>
                            <h2 className='text-white text-2xl font-semibold'>Choisissez le service de certification</h2>
                            <p className='mt-2 text-gray'>Sélectionnez le niveau de certification adapté aux besoins du client</p>
                            {filteredCertificateTypes && filteredCertificateTypes.length > 0 ? (
                                <div className='my-8 grid lg:grid-cols-2 gap-5'>
                                    {filteredCertificateTypes.map((certificateType: CertificateType) => (
                                        <CertificateTypeCard
                                            key={certificateType.id}
                                            data={certificateType}
                                            selected={values.certificate_type_id === certificateType.id}
                                            onSelect={() => setFieldValue("certificate_type_id", certificateType.id)} />
                                    ))}
                                </div>
                            ) : (
                                <p className='text-gray'>Aucun service n'est disponible.</p>
                            )}
                            <div className='flex justify-end gap-5'>
                                <Button
                                    theme="secondary"
                                    className='lg:w-max'
                                    onClick={() => setDraft({ current_step: PartnerCertificateStep.ObjectInfos })}>
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

export default PartnerCertificationServiceModal