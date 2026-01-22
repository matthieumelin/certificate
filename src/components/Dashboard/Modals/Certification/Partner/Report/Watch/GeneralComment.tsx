import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import type { CertificateType } from '@/types/certificate';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    general_comment: string;
}

interface PartnerCertificationReportGeneralCommentModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportGeneralCommentModal: FC<PartnerCertificationReportGeneralCommentModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const initialValues: FormValues = {
        general_comment: formData.general_comment || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("general_comment")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Commentaire Général</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ errors, values }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                {!certificateTypeExcludedFormFields?.includes("general_comment") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="general_comment"
                                            label="Commentaire général de l'expert"
                                            required />
                                        <Input
                                            error={errors.general_comment}
                                            id='general_comment'
                                            name='general_comment'
                                            type='textarea'
                                        />
                                    </FormGroup>
                                )}
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportGeneralCommentModal