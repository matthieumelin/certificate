import FileUpload from '@/components/UI/Form/FileUpload';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import Select from '@/components/UI/Form/Select';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateStore } from '@/stores/certificateStore';
import type { CertificateType } from '@/types/certificate';
import { choiceOptions } from '@/utils/report';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    technical_rust_corrosion_presence: string;
    technical_rust_corrosion_zones: string;
    technical_rust_corrosion_images: string[];
}

interface PartnerCertificationReportTechnicalRustCorrosionModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportTechnicalRustCorrosionModal: FC<PartnerCertificationReportTechnicalRustCorrosionModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateStore();
    const { formData } = useCertificateReportFormStore();

    const rustedZones = [
        "Boîtier",
        "Mouvement",
        "Couronne",
        "Bracelet",
        "Fermoir"
    ]

    const initialValues: FormValues = {
        technical_rust_corrosion_presence: formData.technical_rust_corrosion_presence || "",
        technical_rust_corrosion_zones: formData.technical_rust_corrosion_zones || "",
        technical_rust_corrosion_images: formData.technical_rust_corrosion_images || [],
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("technical_rust_corrosion")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Rouille et corrosion</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                {!certificateTypeExcludedFormFields?.includes("technical_rust_corrosion_presence") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="technical_rust_corrosion_presence"
                                            label="Présence de corrosion"
                                            required />
                                        <Select
                                            error={errors.technical_rust_corrosion_presence}
                                            value={values.technical_rust_corrosion_presence}
                                            onChange={value => setFieldValue('technical_rust_corrosion_presence', value)}
                                            id='technical_rust_corrosion_presence'
                                            options={choiceOptions
                                                .filter((option: string) => option !== choiceOptions[choiceOptions.length - 1])
                                                .map((option: string) => (
                                                    { label: option, value: option }
                                                ))} />
                                    </FormGroup>
                                )}

                                {(values.technical_rust_corrosion_presence === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("technical_rust_corrosion_zones")) && (
                                    <FormGroup>
                                        <Label htmlFor='technical_rust_corrosion_zones' label='Zones atteintes' required />
                                        <Select
                                            error={errors.technical_rust_corrosion_zones}
                                            value={values.technical_rust_corrosion_zones}
                                            onChange={value => setFieldValue('technical_rust_corrosion_zones', value)}
                                            multiple
                                            id='technical_rust_corrosion_zones'
                                            options={
                                                rustedZones.map((zone: string) => ({ label: zone, value: zone }))} />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("technical_rust_corrosion_images") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="technical_rust_corrosion_images"
                                            label="Photos de la corrosion" />

                                        <FileUpload
                                            bucketName="object_attributes"
                                            uploadPath={`objects/${selectedCertificate?.object_id}`}
                                            value={values.technical_rust_corrosion_images}
                                            onChange={(paths) => setFieldValue('technical_rust_corrosion_images', paths)}
                                            acceptedFileTypes={[".jpg", ".png"]}
                                            maxFiles={10}
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

export default PartnerCertificationReportTechnicalRustCorrosionModal