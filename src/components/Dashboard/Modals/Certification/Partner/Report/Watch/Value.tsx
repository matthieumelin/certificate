import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import FormRow from '@/components/UI/Form/Row';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import type { CertificateType } from '@/types/certificate';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    value_market: number;
    value_real: number;
    value_estimated: number;
    value_liquidity_score: number;
}

interface PartnerCertificationReportValueModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportValueModal: FC<PartnerCertificationReportValueModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const initialValues: FormValues = {
        value_market: formData.value_market || 0,
        value_real: formData.value_real || 0,
        value_estimated: formData.value_estimated || 0,
        value_liquidity_score: formData.value_liquidity_score || 0
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("value")) : []

    return (
        <div className="space-y-4">
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ errors, values }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <h2 className="text-white text-xl font-semibold">Marché / Valeur</h2>
                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("value_market") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="value_market"
                                                label="Valeur intrinsèque du marché (€)" />
                                            <Input
                                                error={errors.value_market}
                                                id='value_market'
                                                name='value_market'
                                                placeholder={"Ex: 8000"}
                                                type='number'
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("value_real") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="value_real"
                                                label="Valuer réelle (€)" />
                                            <Input
                                                error={errors.value_real}
                                                id='value_real'
                                                name='value_real'
                                                placeholder={"Ex: 63"}
                                                type='number'
                                            />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("value_estimated") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="value_estimated"
                                                label="Valeur estimée par l'expert (€)" />
                                            <Input
                                                error={errors.value_estimated}
                                                id='value_estimated'
                                                name='value_estimated'
                                                placeholder={"Ex: 7200"}
                                                type='number'
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("value_liquidity_score") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="value_liquidity_score"
                                                label="Score de liquidité" />
                                            <Input
                                                error={errors.value_liquidity_score}
                                                id='value_liquidity_score'
                                                name='value_liquidity_score'
                                                placeholder={"Ex: 85"}
                                                type='number'
                                            />
                                        </FormGroup>
                                    )}
                                </FormRow>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportValueModal