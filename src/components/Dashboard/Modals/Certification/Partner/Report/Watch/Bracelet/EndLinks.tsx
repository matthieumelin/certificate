import { Form, Formik } from 'formik'
import { type FC } from 'react'
import { useCertificateReportStore } from '@/stores/certificateReportStore'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import FormSelect from '@/components/UI/Form/Select'
import { choiceOptions } from '@/utils/report'
import Input from '@/components/UI/Form/Input'

interface FormValues {
    bracelet_link_pump_type: string;
    bracelet_link_serial_number: string;
    bracelet_link_factory: string;
    bracelet_link_reference: string;
}

interface PartnerCertificationReportBraceletEndLinksModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportBraceletEndLinksModal: FC<PartnerCertificationReportBraceletEndLinksModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const pumpTypes = [
        "Aucun",
        "Standard",
        "Rapide",
        "À vis",
        "Fixe"
    ];

    const initialValues: FormValues = {
        bracelet_link_pump_type: formData.bracelet_link_pump_type || "",
        bracelet_link_serial_number: formData.bracelet_link_serial_number || "",
        bracelet_link_factory: formData.bracelet_link_factory || "",
        bracelet_link_reference: formData.bracelet_link_reference || ""
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("bracelet_link")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Maillons de fin (end-links) / Cache pompe</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <div className='space-y-4'>
                                    {!certificateTypeExcludedFormFields?.includes("bracelet_link_pump_type") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="bracelet_link_pump_type"
                                                label="Type de pompe"
                                                required />
                                            <FormSelect
                                                error={errors.bracelet_link_pump_type}
                                                value={values.bracelet_link_pump_type}
                                                onChange={value => setFieldValue('bracelet_link_pump_type', value)}
                                                id='bracelet_link_pump_type'
                                                options={pumpTypes.map((type: string) => (
                                                    {
                                                        label: type,
                                                        value: type
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}
                                </div>

                                {values.bracelet_link_pump_type !== pumpTypes[0] && (
                                    <div className='space-y-4 border-t border-white/10 py-8'>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <FormGroup>
                                                {!certificateTypeExcludedFormFields?.includes("bracelet_link_serial_number") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="bracelet_link_serial_number"
                                                            label="Numéro de série du maillon" />
                                                        <Input
                                                            error={errors.bracelet_link_serial_number}
                                                            id='bracelet_link_serial_number'
                                                            name='bracelet_link_serial_number'
                                                            type='text'
                                                        />
                                                    </FormGroup>
                                                )}

                                                {!certificateTypeExcludedFormFields?.includes("bracelet_link_factory") && (
                                                    <FormGroup className='mt-4'>
                                                        <Label
                                                            htmlFor="bracelet_link_factory"
                                                            label="Maillon d'origine"
                                                            required />
                                                        <FormSelect
                                                            error={errors.bracelet_link_factory}
                                                            value={values.bracelet_link_factory}
                                                            onChange={value => setFieldValue('bracelet_link_factory', value)}
                                                            id='bracelet_link_factory'
                                                            options={choiceOptions.map((option: string) => (
                                                                {
                                                                    label: option,
                                                                    value: option
                                                                }
                                                            ))} />
                                                    </FormGroup>
                                                )}
                                            </FormGroup>

                                            {!certificateTypeExcludedFormFields?.includes("bracelet_link_reference") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="bracelet_link_reference"
                                                        label="Référence du maillon" />
                                                    <Input
                                                        error={errors.bracelet_link_reference}
                                                        id='bracelet_link_reference'
                                                        name='bracelet_link_reference'
                                                        type='text'
                                                    />
                                                </FormGroup>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default PartnerCertificationReportBraceletEndLinksModal