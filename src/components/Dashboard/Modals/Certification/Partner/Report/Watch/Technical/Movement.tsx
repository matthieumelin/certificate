import FileUpload from '@/components/UI/Form/FileUpload';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import Score from '@/components/UI/Form/Score';
import Select from '@/components/UI/Form/Select';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateStore } from '@/stores/certificateStore';
import type { CertificateType } from '@/types/certificate';
import { movementTypes } from '@/utils/report';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    technical_movement_power_reserve_observed: number;
    technical_movement_observed_amplitude: number;
    technical_movement_observed_daily_drift_action: string;
    technical_movement_observed_daily_drift_value: number;
    technical_movement_test_date: string;
    technical_movement_test_result: string[];
    technical_movement_precision_score: number;
}

interface PartnerCertificationReportTechnicalMovementModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportTechnicalMovementModal: FC<PartnerCertificationReportTechnicalMovementModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateStore();
    const { formData } = useCertificateReportFormStore();

    const initialValues: FormValues = {
        technical_movement_power_reserve_observed: formData.technical_movement_power_reserve_observed || 0,
        technical_movement_observed_amplitude: formData.technical_movement_observed_amplitude || 0,
        technical_movement_observed_daily_drift_action: formData.technical_movement_observed_daily_drift_action || "",
        technical_movement_observed_daily_drift_value: formData.technical_movement_observed_daily_drift_value || 0,
        technical_movement_test_date: formData.technical_movement_test_date || "",
        technical_movement_test_result: formData.technical_movement_test_result || [],
        technical_movement_precision_score: formData.technical_movement_precision_score || 0,
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("technical_movement")) : []

    return (
        <div className="space-y-4">
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <div className='space-y-4'>
                                    <h2 className="text-white text-xl font-semibold">Performance du mouvement</h2>

                                    {(formData.movement_type === movementTypes[0]
                                        || formData.movement_type === movementTypes[1]) && !certificateTypeExcludedFormFields?.includes("technical_movement_power_reserve_observed") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_movement_power_reserve_observed' label='Réserve de marche observée (H)' />
                                                <Input
                                                    error={errors.technical_movement_power_reserve_observed}
                                                    id='technical_movement_power_reserve_observed'
                                                    name='technical_movement_power_reserve_observed'
                                                    placeholder='H'
                                                    type='number'
                                                />
                                            </FormGroup>
                                        )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_movement_observed_amplitude") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_movement_observed_amplitude' label='Amplitude observée (°)' />
                                            <Input
                                                error={errors.technical_movement_observed_amplitude}
                                                id='technical_movement_observed_amplitude'
                                                name='technical_movement_observed_amplitude'
                                                placeholder='°'
                                                type='number'
                                            />
                                        </FormGroup>
                                    )}

                                    <div className='grid grid-cols-2 gap-4'>
                                        {!certificateTypeExcludedFormFields?.includes("technical_movement_observed_daily_drift_action") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_movement_observed_daily_drift_action' label='Dérive journalière observée' required />
                                                <Select
                                                    error={errors.technical_movement_observed_daily_drift_action}
                                                    value={values.technical_movement_observed_daily_drift_action}
                                                    onChange={value => setFieldValue('technical_movement_observed_daily_drift_action', value)}
                                                    searchable={false}
                                                    id='technical_movement_observed_daily_drift_action'
                                                    options={["+", "-"].map((value: string) => (
                                                        { label: value, value }
                                                    ))} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("technical_movement_observed_daily_drift_value") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_movement_observed_daily_drift_value' label='Dérive journalière observée (s/j)' required />
                                                <Input
                                                    error={errors.technical_movement_observed_daily_drift_value}
                                                    id='technical_movement_observed_daily_drift_value'
                                                    name='technical_movement_observed_daily_drift_value'
                                                    placeholder='s/j'
                                                    type='number'
                                                />
                                            </FormGroup>
                                        )}
                                    </div>
                                    {!certificateTypeExcludedFormFields?.includes("technical_movement_test_date") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_movement_test_date' label='Date du test' required />
                                            <Input error={errors.technical_movement_test_date}
                                                id='technical_movement_test_date'
                                                name='technical_movement_test_date'
                                                type='text'
                                                placeholder={new Date().toLocaleDateString()} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_movement_test_result") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_movement_test_result' label='Résultat du test (ticket de réglage)' required />
                                            <FileUpload
                                                bucketName="object_attributes"
                                                uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                value={values.technical_movement_test_result}
                                                onChange={(paths) => setFieldValue('technical_movement_test_result', paths)}
                                                acceptedFileTypes={[".png", ".jpg", ".pdf", ".doc", ".docx"]}
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_movement_precision_score") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="technical_movement_precision_score"
                                                label="Indice de condition (score de la précision)"
                                                required />
                                            <Score fieldName='technical_movement_precision_score' score={values.technical_movement_precision_score} />
                                        </FormGroup>
                                    )}
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportTechnicalMovementModal;
