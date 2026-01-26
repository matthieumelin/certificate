import FileUpload from '@/components/UI/Form/FileUpload';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import FormRow from '@/components/UI/Form/Row';
import Score from '@/components/UI/Form/Score';
import Select from '@/components/UI/Form/Select';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import type { CertificateType } from '@/types/certificate';
import { choiceOptions } from '@/utils/report';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    technical_waterproofing_test: string;
    technical_waterproofing_test_date: string;
    technical_waterproofing_test_result: string[];
    technical_waterproofing_resistance: string;
    technical_waterproofing_tested_pressure: number;
    technical_waterproofing_observed_leak: string;
    technical_waterproofing_suspected_zones: string;
    technical_waterproofing_case_deformation_before_test: number;
    technical_waterproofing_case_deformation_after_test: number;
    technical_waterproofing_case_deformation_variation: number;
    technical_waterproofing_case_deformation_score: number;
}

interface PartnerCertificationReportTechnicalWaterproofingModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportTechnicalWaterproofingModal: FC<PartnerCertificationReportTechnicalWaterproofingModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const resistances = [
        "10m (1 ATM)",
        "20m (2 ATM)",
        "30m (3 ATM)",
        "50m (5 ATM)",
        "100m (10 ATM)",
        "200m (20 ATM)",
        "300m (30 ATM)",
        "500m (50 ATM)",
        "1000m (100 ATM)"
    ]
    const waterproofingTestChoices = [
        "PASS",
        "FAIL"
    ]
    const suspectedZones = [
        "N/A",
        "Aucune",
        "Boîtier",
        "Fond",
        "Couronne",
        "Poussoirs",
        "Verre"
    ]

    const initialValues: FormValues = {
        technical_waterproofing_resistance: formData.technical_waterproofing_resistance || "",
        technical_waterproofing_test: formData.technical_waterproofing_test || "",
        technical_waterproofing_test_date: formData.technical_waterproofing_test_date || "",
        technical_waterproofing_test_result: formData.technical_waterproofing_test_result || [],
        technical_waterproofing_tested_pressure: formData.technical_waterproofing_tested_pressure || 0,
        technical_waterproofing_observed_leak: formData.technical_waterproofing_observed_leak || "",
        technical_waterproofing_suspected_zones: formData.technical_waterproofing_suspected_zones || "",
        technical_waterproofing_case_deformation_before_test: formData.technical_waterproofing_case_deformation_before_test || 0,
        technical_waterproofing_case_deformation_after_test: formData.technical_waterproofing_case_deformation_after_test || 0,
        technical_waterproofing_case_deformation_variation: formData.technical_waterproofing_case_deformation_variation || 0,
        technical_waterproofing_case_deformation_score: formData.technical_waterproofing_case_deformation_score || 0,
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("technical_waterproofing")) : []

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
                                    <h2 className="text-white text-xl font-semibold">Étanchéité</h2>

                                    {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_resistance") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_waterproofing_resistance' label='Résistance annoncée' />
                                            <Select
                                                error={errors.technical_waterproofing_resistance}
                                                value={values.technical_waterproofing_resistance}
                                                onChange={value => setFieldValue('technical_waterproofing_resistance', value)}
                                                id='technical_waterproofing_resistance'
                                                options={resistances.map((resistance: string) => ({ label: resistance, value: resistance }))} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_test") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_waterproofing_test' label='Test étanchéité' required />
                                            <Select
                                                error={errors.technical_waterproofing_test}
                                                value={values.technical_waterproofing_test}
                                                onChange={value => setFieldValue('technical_waterproofing_test', value)}
                                                id='technical_waterproofing_test'
                                                options={waterproofingTestChoices.map((choice: string) => ({ label: choice, value: choice }))} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_test_date") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_waterproofing_test_date' label='Date du test' required />
                                            <Input error={errors.technical_waterproofing_test_date}
                                                id='technical_waterproofing_test_date'
                                                name='technical_waterproofing_test_date'
                                                type='text'
                                                placeholder={new Date().toLocaleDateString()} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_test_result") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_waterproofing_test_result' label='Résultat du test'/>
                                            <FileUpload
                                                bucketName="object_attributes"
                                                uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                value={values.technical_waterproofing_test_result}
                                                onChange={(paths) => setFieldValue('technical_waterproofing_test_result', paths)}
                                                acceptedFileTypes={[".jpg", ".png"]}
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_tested_pressure") && (
                                        <FormGroup>
                                            <Label htmlFor='technical_waterproofing_tested_pressure' label='Pression testée (bar)' required />
                                            <Input error={errors.technical_waterproofing_tested_pressure}
                                                id='technical_waterproofing_tested_pressure'
                                                name='technical_waterproofing_tested_pressure'
                                                type='number'
                                                placeholder='bar' />
                                        </FormGroup>
                                    )}

                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_observed_leak") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_waterproofing_observed_leak' label='Fuite observée' required />
                                                <Select
                                                    error={errors.technical_waterproofing_observed_leak}
                                                    value={values.technical_waterproofing_observed_leak}
                                                    onChange={value => setFieldValue('technical_waterproofing_observed_leak', value)}
                                                    id='technical_waterproofing_observed_leak'
                                                    options={choiceOptions
                                                        .filter((choice: string) => choice !== choiceOptions[choiceOptions.length - 1])
                                                        .map((choice: string) => ({ label: choice, value: choice }))} />
                                            </FormGroup>
                                        )}

                                        {(values.technical_waterproofing_observed_leak === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("technical_waterproofing_suspected_zones")) && (
                                            <FormGroup>
                                                <Label htmlFor='technical_waterproofing_suspected_zones' label='Zones suspectes identifiées' required />
                                                <Select
                                                    error={errors.technical_waterproofing_suspected_zones}
                                                    value={values.technical_waterproofing_suspected_zones}
                                                    onChange={value => setFieldValue('technical_waterproofing_suspected_zones', value)}
                                                    multiple id='technical_waterproofing_suspected_zones'
                                                    options={
                                                        suspectedZones.map((zone: string) => ({ label: zone, value: zone }))} />
                                            </FormGroup>
                                        )}
                                    </FormRow>
                                </div>

                                <div className='space-y-4'>
                                    <h2 className="text-white text-xl font-semibold">Déformation du boîtier</h2>

                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_case_deformation_before_test") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_waterproofing_case_deformation_before_test' label='Avant test' />
                                                <Input error={errors.technical_waterproofing_case_deformation_before_test}
                                                    id='technical_waterproofing_case_deformation_before_test'
                                                    name='technical_waterproofing_case_deformation_before_test'
                                                    type='number'
                                                    placeholder='µm' />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_case_deformation_after_test") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_waterproofing_case_deformation_after_test' label='Après test' />
                                                <Input error={errors.technical_waterproofing_case_deformation_after_test}
                                                    id='technical_waterproofing_case_deformation_after_test'
                                                    name='technical_waterproofing_case_deformation_after_test'
                                                    type='number'
                                                    placeholder='µm' />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_case_deformation_variation") && (
                                            <FormGroup>
                                                <Label htmlFor='technical_waterproofing_case_deformation_variation' label='Variation' />
                                                <Input error={errors.technical_waterproofing_case_deformation_variation}
                                                    id='technical_waterproofing_case_deformation_variation'
                                                    name='technical_waterproofing_case_deformation_variation'
                                                    type='number'
                                                    placeholder='µm' />
                                            </FormGroup>
                                        )}
                                    </FormRow>

                                    {!certificateTypeExcludedFormFields?.includes("technical_waterproofing_case_deformation_score") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="technical_waterproofing_case_deformation_score"
                                                label="Indice de condition (score de l'étanchéité)"
                                                required />
                                            <Score fieldName='technical_waterproofing_case_deformation_score' score={values.technical_waterproofing_case_deformation_score} />
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

export default PartnerCertificationReportTechnicalWaterproofingModal;