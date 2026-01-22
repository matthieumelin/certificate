import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import FormRow from '@/components/UI/Form/Row';
import Score from '@/components/UI/Form/Score';
import Select from '@/components/UI/Form/Select';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import type { CertificateType } from '@/types/certificate';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    technical_lubrification_movement: string;
    technical_lubrification_join: string;
    technical_lubrification_score: number;
}

interface PartnerCertificationReportTechnicalLubrificationModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportTechnicalLubrificationModal: FC<PartnerCertificationReportTechnicalLubrificationModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const choiceOptions = [
        "Présente",
        "Absente",
        "À refaire"
    ]

    const initialValues: FormValues = {
        technical_lubrification_movement: formData.technical_lubrification_movement || '',
        technical_lubrification_join: formData.technical_lubrification_join || '',
        technical_lubrification_score: formData.technical_lubrification_score || 0,
    };

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("technical_lubrification")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Lubrification</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("technical_lubrification_movement") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="technical_lubrification_movement"
                                                label="Lubrification du mouvement"
                                                required />
                                            <Select
                                                error={errors.technical_lubrification_movement}
                                                value={values.technical_lubrification_movement}
                                                onChange={value => setFieldValue('technical_lubrification_movement', value)}
                                                id='technical_lubrification_movement'
                                                options={choiceOptions
                                                    .map((option: string) => (
                                                        { label: option, value: option }
                                                    ))} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_lubrification_join") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="technical_lubrification_join"
                                                label="Lubrification des joints"
                                                required />
                                            <Select
                                                error={errors.technical_lubrification_join}
                                                value={values.technical_lubrification_join}
                                                onChange={value => setFieldValue('technical_lubrification_join', value)}
                                                id='technical_lubrification_join'
                                                options={choiceOptions
                                                    .map((option: string) => (
                                                        { label: option, value: option }
                                                    ))} />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                {!certificateTypeExcludedFormFields?.includes("technical_lubrification_score") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="technical_lubrification_score"
                                            label="Score de la lubrification"
                                            required />
                                        <Score fieldName='technical_lubrification_score'
                                            score={values.technical_lubrification_score} />
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

export default PartnerCertificationReportTechnicalLubrificationModal