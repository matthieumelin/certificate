import FileUpload from '@/components/UI/Form/FileUpload';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import FormRow from '@/components/UI/Form/Row';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateStore } from '@/stores/certificateStore';
import type { CertificateType } from '@/types/certificate';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    technical_weight_total_watch: number;
    technical_weight_case: number;
    technical_weight_bracelet: number;
    technical_weight_movement: number;
    technical_weight_power_reserve_observed: number;
    technical_weight_observed_amplitude: number;
    technical_weight_observed_daily_drift_action: string;
    technical_weight_observed_daily_drift_value: number;
    technical_weight_precision_score: number;
    technical_weight_images: string[];
}

interface PartnerCertificationReportTechnicalWeightModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportTechnicalWeightModal: FC<PartnerCertificationReportTechnicalWeightModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateStore();
    const { formData } = useCertificateReportFormStore();

    const initialValues: FormValues = {
        technical_weight_total_watch: formData.technical_weight_total_watch || 0,
        technical_weight_case: formData.technical_weight_case || 0,
        technical_weight_bracelet: formData.technical_weight_bracelet || 0,
        technical_weight_movement: formData.technical_weight_movement || 0,
        technical_weight_power_reserve_observed: formData.technical_weight_power_reserve_observed || 0,
        technical_weight_observed_amplitude: formData.technical_weight_observed_amplitude || 0,
        technical_weight_observed_daily_drift_action: formData.technical_weight_observed_daily_drift_action || "",
        technical_weight_observed_daily_drift_value: formData.technical_weight_observed_daily_drift_value || 0,
        technical_weight_precision_score: formData.technical_weight_precision_score || 0,
        technical_weight_images: formData.technical_weight_images || [],
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("technical_weight")) : []

    return (
        <div className="space-y-4">
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ errors, values, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <div className='space-y-4'>
                                    <h2 className="text-white text-xl font-semibold">Poids</h2>

                                    {!certificateTypeExcludedFormFields?.includes("technical_weight_total_watch") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_weight_total_watch' label='Poids total de la montre (g)'/>
                                            <Input
                                                error={errors.technical_weight_total_watch}
                                                id='technical_weight_total_watch'
                                                name='technical_weight_total_watch'
                                                placeholder='g'
                                                type='number'
                                            />
                                        </FormGroup>
                                    )}

                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("technical_weight_case") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_weight_case' label='Poids du boitier (g)' />
                                                <Input
                                                    error={errors.technical_weight_case}
                                                    id='technical_weight_case'
                                                    name='technical_weight_case'
                                                    placeholder='g'
                                                    type='number'
                                                />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("technical_weight_bracelet") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_weight_bracelet' label='Poids du bracelet (g)' />
                                                <Input
                                                    error={errors.technical_weight_bracelet}
                                                    id='technical_weight_bracelet'
                                                    name='technical_weight_bracelet'
                                                    placeholder='g'
                                                    type='number'
                                                />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("technical_weight_movement") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_weight_movement' label='Poids du mouvement (g)' />
                                                <Input
                                                    error={errors.technical_weight_movement}
                                                    id='technical_weight_movement'
                                                    name='technical_weight_movement'
                                                    placeholder='g'
                                                    type='number'
                                                />
                                            </FormGroup>
                                        )}
                                    </FormRow>

                                    <FormGroup>
                                        {!certificateTypeExcludedFormFields?.includes("technical_weight_images") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="technical_weight_images"
                                                    label="Photos des poids" />

                                                <FileUpload
                                                    bucketName="object_attributes"
                                                    uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                    value={values.technical_weight_images}
                                                    onChange={(paths) => setFieldValue('technical_weight_images', paths)}
                                                    acceptedFileTypes={[".jpg", ".png"]}
                                                />
                                            </FormGroup>
                                        )}
                                    </FormGroup>
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportTechnicalWeightModal;