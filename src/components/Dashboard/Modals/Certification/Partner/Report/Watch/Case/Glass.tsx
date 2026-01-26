import { Form, Formik } from 'formik'
import { type FC } from 'react'
import { useCertificateReportStore } from '@/stores/certificateReportStore'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import { choiceOptions } from '@/utils/report'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import FormSelect from '@/components/UI/Form/Select'
import Input from '@/components/UI/Form/Input'
import Score from '@/components/UI/Form/Score'

interface FormValues {
    case_glass_material: string;
    case_glass_factory: string;
    case_glass_change: string;
    case_glass_change_date: string;
    case_glass_score: number;
    case_glass_comment: string;
}

interface PartnerCertificationReportCaseGlassModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportCaseGlassModal: FC<PartnerCertificationReportCaseGlassModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const glassMaterials = [
        "N/A",
        "Saphir",
        "Minéral",
        "Hésalite",
        "Plexiglas",
        "Verre plastique",
        "Verre de laboratoire"
    ];

    const initialValues: FormValues = {
        case_glass_material: formData.case_glass_material || "N/A",
        case_glass_factory: formData.case_glass_factory || choiceOptions[0],
        case_glass_change: formData.case_glass_change || choiceOptions[1],
        case_glass_change_date: formData.case_glass_change_date || "",
        case_glass_score: formData.case_glass_score || 0,
        case_glass_comment: formData.case_glass_comment || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("case_glass")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Verre</h2>

            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className="space-y-6">
                                {!certificateTypeExcludedFormFields?.includes("case_glass_material") && (
                                    <FormGroup>
                                        <Label htmlFor="case_glass_material" label="Matériau du verre" required />
                                        <FormSelect
                                            error={errors.case_glass_material}
                                            value={values.case_glass_material}
                                            onChange={value => setFieldValue('case_glass_material', value)}
                                            id="case_glass_material"
                                            searchable
                                            multiple
                                            options={glassMaterials.map(material => ({ label: material, value: material }))}
                                        />
                                    </FormGroup>
                                )}

                                <div className="grid grid-cols-2 gap-6">
                                    {!certificateTypeExcludedFormFields?.includes("case_glass_factory") && (
                                        <FormGroup>
                                            <Label htmlFor="case_glass_factory" label="Verre d'origine" required />
                                            <FormSelect
                                                error={errors.case_glass_factory}
                                                value={values.case_glass_factory}
                                                onChange={value => setFieldValue('case_glass_factory', value)}
                                                id="case_glass_factory"
                                                options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                            />
                                        </FormGroup>
                                    )}

                                    <FormGroup>
                                        {!certificateTypeExcludedFormFields?.includes("case_glass_change") && (
                                            <FormGroup>
                                                <Label htmlFor="case_glass_change" label="Verre remplacé" />
                                                <FormSelect
                                                    error={errors.case_glass_change}
                                                    value={values.case_glass_change}
                                                    onChange={value => setFieldValue('case_glass_change', value)}
                                                    id="case_glass_change"
                                                    options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                />
                                            </FormGroup>
                                        )}

                                        {(values.case_glass_change === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_glass_change_date")) && (
                                            <FormGroup>
                                                <Label htmlFor="case_glass_change_date" label="Date de remplacement" />
                                                <Input
                                                    id="case_glass_change_date"
                                                    name="case_glass_change_date"
                                                    type="text"
                                                    placeholder={new Date().toLocaleDateString()}
                                                    error={errors.case_glass_change_date}
                                                />
                                            </FormGroup>
                                        )}
                                    </FormGroup>
                                </div>

                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    {!certificateTypeExcludedFormFields?.includes("case_glass_score") && (
                                        <FormGroup>
                                            <Label htmlFor="case_glass_score" label="Indice de condition (score du verre)" required />
                                            <Score fieldName="case_glass_score" score={values.case_glass_score} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_glass_comment") && (
                                        <FormGroup>
                                            <Label htmlFor="case_glass_comment" label="Commentaire - Verre" />
                                            <Input
                                                id="case_glass_comment"
                                                name="case_glass_comment"
                                                type="textarea"
                                                error={errors.case_glass_comment}
                                            />
                                        </FormGroup>
                                    )}
                                </div>
                            </div>
                        </Form >
                    )
                }}
            </Formik>
        </div>
    )
}

export default PartnerCertificationReportCaseGlassModal