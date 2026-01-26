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
import FormRow from '@/components/UI/Form/Row'
import Input from '@/components/UI/Form/Input'
import Score from '@/components/UI/Form/Score'

interface FormValues {
    case_bezel_insert_material: string;
    case_bezel_insert_serial_number: string;
    case_bezel_insert_reference: string;
    case_bezel_insert_factory: string;
    case_bezel_insert_change: string;
    case_bezel_insert_change_date: string;
    case_bezel_insert_custom: string;
    case_bezel_insert_custom_date: string;
    case_bezel_insert_score: number;
    case_bezel_insert_comment: string;
}

interface PartnerCertificationReportCaseBezelInsertModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportCaseBezelInsertModal: FC<PartnerCertificationReportCaseBezelInsertModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const bezelInsertMaterials = [
        "Céramique",
        "Aluminium",
        "Acier inoxydable",
        "Acier",
        "Or jaune 24k",
        "Or jaune 18k",
        "Or jaune 14k",
        "Or rose",
        "Or blanc",
        "Platine",
        "Titane",
        "Saphir",
        "Bakélite",
        "Acrylique (Plexiglas)",
        "Laiton",
        "Fibre de carbone",
        "Émail"
    ];

    const initialValues: FormValues = {
        case_bezel_insert_material: formData.case_bezel_insert_material || "",
        case_bezel_insert_serial_number: formData.case_bezel_insert_serial_number || "",
        case_bezel_insert_reference: formData.case_bezel_insert_reference || "",
        case_bezel_insert_factory: formData.case_bezel_insert_factory || choiceOptions[0],
        case_bezel_insert_change: formData.case_bezel_insert_change || choiceOptions[1],
        case_bezel_insert_change_date: formData.case_bezel_insert_change_date || "",
        case_bezel_insert_custom: formData.case_bezel_insert_custom || choiceOptions[1],
        case_bezel_insert_custom_date: formData.case_bezel_insert_custom_date || "",
        case_bezel_insert_score: formData.case_bezel_insert_score || 0,
        case_bezel_insert_comment: formData.case_bezel_insert_comment || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("case_bezel_insert")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Insert de lunette</h2>

            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className="space-y-6">
                                {!certificateTypeExcludedFormFields?.includes("case_bezel_insert_material") && (
                                    <FormGroup>
                                        <Label htmlFor="case_bezel_insert_material" label="Matériau de la lunette" required />
                                        <FormSelect
                                            error={errors.case_bezel_insert_material}
                                            value={values.case_bezel_insert_material}
                                            onChange={value => setFieldValue('case_bezel_insert_material', value)}
                                            id="case_bezel_insert_material"
                                            searchable
                                            multiple
                                            options={bezelInsertMaterials.map(material => ({ label: material, value: material }))}
                                        />
                                    </FormGroup>
                                )}

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_insert_serial_number") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_insert_serial_number" label="Numéro de série de l'insert" />
                                            <Input
                                                id="case_bezel_insert_serial_number"
                                                name="case_bezel_insert_serial_number"
                                                type="text"
                                                error={errors.case_bezel_insert_serial_number}
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_insert_reference") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_insert_reference" label="Référence de l'insert" />
                                            <Input
                                                id="case_bezel_insert_reference"
                                                name="case_bezel_insert_reference"
                                                type="text"
                                                error={errors.case_bezel_insert_reference}
                                            />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                <div className="grid grid-cols-2 gap-6">
                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_insert_factory") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_insert_factory" label="Insert d'origine" required />
                                            <FormSelect
                                                error={errors.case_bezel_insert_factory}
                                                value={values.case_bezel_insert_factory}
                                                onChange={value => setFieldValue('case_bezel_insert_factory', value)}
                                                id="case_bezel_insert_factory"
                                                options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                            />
                                        </FormGroup>
                                    )}

                                    <FormGroup>
                                        {values.case_bezel_insert_factory !== choiceOptions[0] && (
                                            <div className="space-y-4">
                                                {!certificateTypeExcludedFormFields?.includes("case_bezel_insert_change") && (
                                                    <FormGroup>
                                                        <Label htmlFor="case_bezel_insert_change" label="Insert remplacé" />
                                                        <FormSelect
                                                            error={errors.case_bezel_insert_change}
                                                            value={values.case_bezel_insert_change}
                                                            onChange={value => setFieldValue('case_bezel_insert_change', value)}
                                                            id="case_bezel_insert_change"
                                                            options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                        />
                                                    </FormGroup>
                                                )}

                                                {(values.case_bezel_insert_change === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_bezel_insert_change_date")) && (
                                                    <FormGroup>
                                                        <Label htmlFor="case_bezel_insert_change_date" label="Date de remplacement" />
                                                        <Input
                                                            id="case_bezel_insert_change_date"
                                                            name="case_bezel_insert_change_date"
                                                            type="text"
                                                            placeholder={new Date().toLocaleDateString()}
                                                            error={errors.case_bezel_insert_change_date}
                                                        />
                                                    </FormGroup>
                                                )}
                                            </div>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("case_bezel_insert_custom") && (
                                            <FormGroup>
                                                <Label htmlFor="case_bezel_insert_custom" label="Insert modifié" />
                                                <FormSelect
                                                    error={errors.case_bezel_insert_custom}
                                                    value={values.case_bezel_insert_custom}
                                                    onChange={value => setFieldValue('case_bezel_insert_custom', value)}
                                                    id="case_bezel_insert_custom"
                                                    options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                />
                                            </FormGroup>
                                        )}

                                        {(values.case_bezel_insert_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_bezel_insert_custom_date"))
                                            && (
                                                <FormGroup>
                                                    <Label htmlFor="case_bezel_insert_custom_date" label="Date de modification" />
                                                    <Input
                                                        id="case_bezel_insert_custom_date"
                                                        name="case_bezel_insert_custom_date"
                                                        type="text"
                                                        placeholder={new Date().toLocaleDateString()}
                                                        error={errors.case_bezel_insert_custom_date}
                                                    />
                                                </FormGroup>
                                            )}
                                    </FormGroup>
                                </div>

                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_insert_score") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_insert_score" label="Indice de condition (score de l'insert)" required />
                                            <Score fieldName="case_bezel_insert_score" score={values.case_bezel_insert_score} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_insert_comment") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_insert_comment" label="Commentaire - Insert" />
                                            <Input
                                                id="case_bezel_insert_comment"
                                                name="case_bezel_insert_comment"
                                                type="textarea"
                                                error={errors.case_bezel_insert_comment}
                                            />
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

export default PartnerCertificationReportCaseBezelInsertModal