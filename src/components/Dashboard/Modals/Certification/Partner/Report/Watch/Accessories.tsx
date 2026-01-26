import { Form, Formik, type FormikProps } from 'formik'
import { useEffect, type FC, useRef } from 'react'
import { useCertificateReportStore } from '@/stores/certificateReportStore'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import FormSelect from '@/components/UI/Form/Select'
import Score from '@/components/UI/Form/Score'
import Input from '@/components/UI/Form/Input'
import FileUpload from '@/components/UI/Form/FileUpload'

interface FormValues {
    accessories_factory: string[];
    accessories_factory_not: string[];
    accessories_score: number;
    accessories_comment: string;
    accessories_images: string[]
}

interface PartnerCertificationReportAccessoriesModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportAccessoriesModal: FC<PartnerCertificationReportAccessoriesModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();
    const formRef = useRef<FormikProps<FormValues>>(null);

    const accessories = [
        "Aucun",
        "Boîte d'origine",
        "Écrin/Étui",
        "Carte de garantie",
        "Facture d'origine",
        "Documents d'origine",
        "Manuel d'utilisation",
        "Certificat d'authenticité",
        "Documents d'intervention",
        "Autre facture",
        "Maillons supplémentaires",
        "Attache/tag",
        "Outils"
    ];

    const initialValues: FormValues = {
        accessories_factory: formData.accessories_factory || [],
        accessories_factory_not: formData.accessories_factory_not || [],
        accessories_score: formData.accessories_score || 0,
        accessories_comment: formData.accessories_comment || "",
        accessories_images: formData.accessories_images || []
    }

    useEffect(() => {
        if (formRef.current && formRef.current.values.accessories_factory.includes(accessories[0])) {
            formRef.current.setFieldValue("accessories_score", 0);
        }
    }, [formRef.current?.values.accessories_factory]);

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("accessories")) : [];

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Accessoires</h2>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                {!certificateTypeExcludedFormFields?.includes("accessories_factory") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="accessories_factory"
                                            label="Quels sont les accessoires d'origines fournis avec la montre ?" />
                                        <FormSelect
                                            value={values.accessories_factory}
                                            onChange={value => setFieldValue('accessories_factory', value)}
                                            error={errors.accessories_factory}
                                            id='accessories_factory'
                                            options={accessories.map((accessory: string) => (
                                                {
                                                    label: accessory,
                                                    value: accessory
                                                }
                                            ))}
                                            multiple />
                                    </FormGroup>
                                )}

                                {!values.accessories_factory.includes(accessories[0]) && (
                                    <>
                                        {!certificateTypeExcludedFormFields?.includes("accessories_factory_not") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="accessories_factory_not"
                                                    label="Quels accessoires ne sont pas d'origines ?" />
                                                <FormSelect
                                                    value={values.accessories_factory_not}
                                                    onChange={value => setFieldValue('accessories_factory_not', value)}
                                                    error={errors.accessories_factory_not}
                                                    id='accessories_factory_not'
                                                    options={accessories.map((accessory: string) => (
                                                        {
                                                            label: accessory,
                                                            value: accessory
                                                        }
                                                    ))}
                                                    multiple />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("accessories_score") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="accessories_score"
                                                    label="Indice de condition (score des accessoires)"
                                                    required />
                                                <Score fieldName='accessories_score' score={values.accessories_score} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("accessories_comment") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="accessories_comment"
                                                    label="Commentaire - Accessoires" />
                                                <Input type='textarea'
                                                    id='accessories_comment'
                                                    name='accessories_comment'
                                                    error={errors.accessories_comment} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("accessories_images") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="accessories_images"
                                                    label="Photos des accessoires"
                                                    required />
                                                <FileUpload
                                                    bucketName="object_attributes"
                                                    uploadPath={`objects/${selectedCertificate?.object?.id}`}
                                                    value={values.accessories_images}
                                                    onChange={(paths) => setFieldValue('accessories_images', paths)}
                                                    acceptedFileTypes={[".jpg", ".png"]}
                                                />
                                            </FormGroup>
                                        )}
                                    </>
                                )}
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default PartnerCertificationReportAccessoriesModal