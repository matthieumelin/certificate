import { Form, Formik } from 'formik'
import { type FC } from 'react'
import { useCertificateReportStore } from '@/stores/certificateReportStore'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import FormSelect from '@/components/UI/Form/Select'
import FormRow from '@/components/UI/Form/Row'
import { choiceOptions, hallmarks, materials } from '@/utils/report'
import Input from '@/components/UI/Form/Input'
import Score from '@/components/UI/Form/Score'
import FileUpload from '@/components/UI/Form/FileUpload'

interface FormValues {
    case_back_type: string;
    case_back_material: string;
    case_back_hallmark: string;
    case_back_signature: string;
    case_back_serial_number: string;
    case_back_reference: string;
    case_back_factory: string;
    case_back_change: string;
    case_back_change_date: string;
    case_back_custom: string;
    case_back_custom_date: string;
    case_back_score: number;
    case_back_comment: string;
    case_back_images: string[];
}

interface PartnerCertificationReportCaseBackModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportCaseBackModal: FC<PartnerCertificationReportCaseBackModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const caseBackTypes = [
        "Vissé",
        "Clipsé",
        "Emboîté",
        "Vissé à baïonnette",
        "Vissé par vis",
        "Fond Monobloc",
        "Transparent",
        "Squelette",
        "Plein"
    ]

    const initialValues: FormValues = {
        case_back_type: formData.case_back_type || "",
        case_back_material: formData.case_back_material || "",
        case_back_hallmark: formData.case_back_hallmark || "",
        case_back_signature: formData.case_back_signature || "",
        case_back_serial_number: formData.case_back_serial_number || "",
        case_back_reference: formData.case_back_reference || "",
        case_back_factory: formData.case_back_factory || choiceOptions[0],
        case_back_change: formData.case_back_change || choiceOptions[1],
        case_back_change_date: formData.case_back_change_date || "",
        case_back_custom: formData.case_back_custom || choiceOptions[1],
        case_back_custom_date: formData.case_back_custom_date || "",
        case_back_score: formData.case_back_score || 0,
        case_back_comment: formData.case_back_comment || "",
        case_back_images: formData.case_back_images || [],
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("case_back")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Fond de boîte</h2>

            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className="space-y-6">
                                {!certificateTypeExcludedFormFields?.includes("case_back_type") && (
                                    <FormGroup>
                                        <Label htmlFor="case_back_type" label="Type de fond" required />
                                        <FormSelect
                                            error={errors.case_back_type}
                                            value={values.case_back_type}
                                            onChange={value => setFieldValue('case_back_type', value)}
                                            id="case_back_type"
                                            searchable
                                            multiple
                                            options={caseBackTypes.map(type => ({ label: type, value: type }))}
                                        />
                                    </FormGroup>
                                )}

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("case_back_material") && (
                                        <FormGroup>
                                            <Label htmlFor="case_back_material" label="Matériau du fond" required />
                                            <FormSelect
                                                error={errors.case_back_material}
                                                value={values.case_back_material}
                                                onChange={value => setFieldValue('case_back_material', value)}
                                                id="case_back_material"
                                                searchable
                                                multiple
                                                options={materials.map(type => ({ label: type, value: type }))}
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_back_hallmark") && (
                                        <FormGroup>
                                            <Label htmlFor="case_back_hallmark" label="Poinçon" />
                                            <FormSelect
                                                error={errors.case_back_hallmark}
                                                value={values.case_back_hallmark}
                                                onChange={value => setFieldValue('case_back_hallmark', value)}
                                                id="case_back_hallmark"
                                                searchable
                                                multiple
                                                options={hallmarks.map(type => ({ label: type, value: type }))}
                                            />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                {!certificateTypeExcludedFormFields?.includes("case_back_signature") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="case_back_signature"
                                            label="Signature ou gravure" />
                                        <Input
                                            error={errors.case_back_signature}
                                            id='case_back_signature'
                                            name='case_back_signature'
                                            type='text'
                                        />
                                    </FormGroup>
                                )}

                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("case_back_serial_number") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="case_back_serial_number"
                                                    label="Numéro de série du fond" />
                                                <Input
                                                    error={errors.case_back_serial_number}
                                                    id='case_back_serial_number'
                                                    name='case_back_serial_number'
                                                    type='text'
                                                />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("case_back_reference") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="case_back_reference"
                                                    label="Référence du fond" />
                                                <Input
                                                    error={errors.case_back_reference}
                                                    id='case_back_reference'
                                                    name='case_back_reference'
                                                    type='text'
                                                />
                                            </FormGroup>
                                        )}
                                    </FormRow>
                                    <div className="grid grid-cols-2 gap-6">
                                        {!certificateTypeExcludedFormFields?.includes("case_back_factory") && (
                                            <FormGroup>
                                                <Label htmlFor="case_back_factory" label="Fond d'origine" required />
                                                <FormSelect
                                                    error={errors.case_back_factory}
                                                    value={values.case_back_factory}
                                                    onChange={value => setFieldValue('case_back_factory', value)}
                                                    id="case_back_factory"
                                                    options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                />
                                            </FormGroup>
                                        )}

                                        <FormGroup>
                                            {values.case_back_factory !== choiceOptions[0] && (
                                                <div className="space-y-4">
                                                    {!certificateTypeExcludedFormFields?.includes("case_back_change") && (
                                                        <FormGroup>
                                                            <Label htmlFor="case_back_change" label="Fond remplacé" />
                                                            <FormSelect
                                                                error={errors.case_back_change}
                                                                value={values.case_back_change}
                                                                onChange={value => setFieldValue('case_back_change', value)}
                                                                id="case_back_change"
                                                                options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                            />
                                                        </FormGroup>
                                                    )}

                                                    {(values.case_back_change === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_back_change_date")) && (
                                                        <FormGroup>
                                                            <Label htmlFor="case_back_change_date" label="Date de remplacement" />
                                                            <Input
                                                                id="case_back_change_date"
                                                                name="case_back_change_date"
                                                                type="text"
                                                                placeholder={new Date().toLocaleDateString()}
                                                                error={errors.case_back_change_date}
                                                            />
                                                        </FormGroup>)}
                                                </div>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("case_back_custom") && (
                                                <FormGroup>
                                                    <Label htmlFor="case_back_custom" label="Fond modifié" />
                                                    <FormSelect
                                                        error={errors.case_back_custom}
                                                        value={values.case_back_custom}
                                                        onChange={value => setFieldValue('case_back_custom', value)}
                                                        id="case_back_custom"
                                                        options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                    />
                                                </FormGroup>
                                            )}

                                            {(values.case_back_custom === choiceOptions[0] &&
                                                !certificateTypeExcludedFormFields?.includes("case_back_custom_date")) && (
                                                    <FormGroup>
                                                        <Label htmlFor="case_back_custom_date" label="Date de modification" />
                                                        <Input
                                                            id="case_back_custom_date"
                                                            name="case_back_custom_date"
                                                            type="text"
                                                            placeholder={new Date().toLocaleDateString()}
                                                            error={errors.case_back_custom_date}
                                                        />
                                                    </FormGroup>
                                                )}
                                        </FormGroup>
                                    </div>
                                </div>

                                {!certificateTypeExcludedFormFields?.includes("case_back_score") && (
                                    <FormGroup>
                                        <Label htmlFor="case_back_score" label="Indice de condition (score du fond)" required />
                                        <Score fieldName="case_back_score" score={values.case_back_score} />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("case_back_comment") && (
                                    <FormGroup>
                                        <Label htmlFor="case_back_comment" label="Commentaire - Fond" />
                                        <Input
                                            id="case_back_comment"
                                            name="case_back_comment"
                                            type="textarea"
                                            error={errors.case_back_comment}
                                        />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("case_back_images") && (
                                    <FormGroup>
                                        <Label htmlFor="case_back_images" label="Photos du fond" />
                                        <FileUpload
                                            bucketName="object_attributes"
                                            uploadPath={`objects/${selectedCertificate?.object_id}`}
                                            value={values.case_back_images}
                                            onChange={(paths) => setFieldValue('case_back_images', paths)}
                                            acceptedFileTypes={[".jpg", ".png"]}
                                        />
                                    </FormGroup>
                                )}
                            </div>
                        </Form>
                    )
                }
                }
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportCaseBackModal