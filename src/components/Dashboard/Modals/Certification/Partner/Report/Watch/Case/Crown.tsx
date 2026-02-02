import { Form, Formik } from 'formik'
import { type FC } from 'react'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import FormSelect from '@/components/UI/Form/Select'
import Input from '@/components/UI/Form/Input'
import Score from '@/components/UI/Form/Score'
import FileUpload from '@/components/UI/Form/FileUpload'
import { useCertificateStore } from '@/stores/certificateStore'

interface FormValues {
    case_crown_type: string;
    case_crown_score: number;
    case_crown_pusher: number;
    case_crown_comment: string;
    case_crown_images: string[];
    case_crown_factory: string;
    case_crown_change: string;
    case_crown_change_date: string;
    case_crown_custom: string;
    case_crown_custom_date: string;
    case_crown_pusher_score: number;
    case_crown_pusher_comment: string;
    case_crown_pusher_images: string[];
    case_crown_pusher_factory: string;
    case_crown_pusher_change: string;
    case_crown_pusher_change_date: string;
    case_crown_pusher_custom: string;
    case_crown_pusher_custom_date: string;
}

interface PartnerCertificationReportCaseCrownModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportCaseCrownModal: FC<PartnerCertificationReportCaseCrownModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateStore();
    const { formData } = useCertificateReportFormStore();

    const crownTypes = [
        "Non Vissée",
        "Vissée",
        "Poussoir",
        "Cannelée",
        "Oignon",
        "Conique",
        "À cliquet",
        "Cylindrique",
        "Couronne intégrée / encastrée",
        "Couronne de gauche",
        "Couronne de droite",
        "Couronne double",
    ]
    const choiceOptions = [
        "Oui",
        "Non",
        "NA"
    ]

    const initialValues: FormValues = {
        case_crown_type: formData.case_crown_type || "",
        case_crown_score: formData.case_crown_score || 0,
        case_crown_pusher: formData.case_crown_pusher || 0,
        case_crown_comment: formData.case_crown_comment || "",
        case_crown_images: formData.case_crown_images || [],
        case_crown_factory: formData.case_crown_factory || choiceOptions[0],
        case_crown_change: formData.case_crown_change || choiceOptions[1],
        case_crown_custom: formData.case_crown_custom || choiceOptions[1],
        case_crown_change_date: formData.case_crown_change_date || "",
        case_crown_custom_date: formData.case_crown_custom_date || "",
        case_crown_pusher_score: formData.case_crown_pusher_score || 0,
        case_crown_pusher_comment: formData.case_crown_pusher_comment || "",
        case_crown_pusher_images: formData.case_crown_pusher_images || [],
        case_crown_pusher_factory: formData.case_crown_pusher_factory || choiceOptions[0],
        case_crown_pusher_change: formData.case_crown_pusher_change || choiceOptions[1],
        case_crown_pusher_custom: formData.case_crown_pusher_custom || choiceOptions[1],
        case_crown_pusher_change_date: formData.case_crown_pusher_change_date || "",
        case_crown_pusher_custom_date: formData.case_crown_pusher_custom_date || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("case_crown")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Couronne</h2>

            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className="space-y-6">
                                {!certificateTypeExcludedFormFields?.includes("case_crown_type") && (
                                    <FormGroup>
                                        <Label htmlFor="case_crown_type" label="Type de couronne" required />
                                        <FormSelect
                                            error={errors.case_crown_type}
                                            value={values.case_crown_type}
                                            onChange={value => setFieldValue('case_crown_type', value)}
                                            id="case_crown_type"
                                            searchable
                                            multiple
                                            options={crownTypes.map(type => ({ label: type, value: type }))}
                                        />
                                    </FormGroup>
                                )}

                                <div className="grid grid-cols-2 gap-6">
                                    {!certificateTypeExcludedFormFields?.includes("case_crown_factory") && (
                                        <FormGroup>
                                            <Label htmlFor="case_crown_factory" label="Couronne d'origine" required />
                                            <FormSelect
                                                error={errors.case_crown_factory}
                                                value={values.case_crown_factory}
                                                onChange={value => setFieldValue('case_crown_factory', value)}
                                                id="case_crown_factory"
                                                options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                            />
                                        </FormGroup>
                                    )}

                                    <FormGroup>
                                        {values.case_crown_factory !== choiceOptions[0] && (
                                            <div className="space-y-4">
                                                {!certificateTypeExcludedFormFields?.includes("case_crown_change") && (
                                                    <FormGroup>
                                                        <Label htmlFor="case_crown_change" label="Couronne remplacée" />
                                                        <FormSelect
                                                            error={errors.case_crown_change}
                                                            value={values.case_crown_change}
                                                            onChange={value => setFieldValue('case_crown_change', value)}
                                                            id="case_crown_change"
                                                            options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                        />
                                                    </FormGroup>
                                                )}

                                                {(values.case_crown_change === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_crown_change_date")) && (
                                                    <FormGroup>
                                                        <Label htmlFor="case_crown_change_date" label="Date de remplacement" />
                                                        <Input
                                                            id="case_crown_change_date"
                                                            name="case_crown_change_date"
                                                            type="text"
                                                            placeholder={new Date().toLocaleDateString()}
                                                            error={errors.case_crown_change_date}
                                                        />
                                                    </FormGroup>
                                                )}
                                            </div>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("case_crown_custom") && (
                                            <FormGroup>
                                                <Label htmlFor="case_crown_custom" label="Couronne modifiée" />
                                                <FormSelect
                                                    error={errors.case_crown_custom}
                                                    value={values.case_crown_custom}
                                                    onChange={value => setFieldValue('case_crown_custom', value)}
                                                    id="case_crown_custom"
                                                    options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                />
                                            </FormGroup>
                                        )}

                                        {(values.case_crown_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_crown_custom_date")) && (
                                            <FormGroup>
                                                <Label htmlFor="case_crown_custom_date" label="Date de modification" />
                                                <Input
                                                    id="case_crown_custom_date"
                                                    name="case_crown_custom_date"
                                                    type="text"
                                                    placeholder={new Date().toLocaleDateString()}
                                                    error={errors.case_crown_custom_date}
                                                />
                                            </FormGroup>
                                        )}
                                    </FormGroup>
                                </div>

                                {!certificateTypeExcludedFormFields?.includes("case_crown_score") && (
                                    <FormGroup>
                                        <Label htmlFor="case_crown_score" label="Indice de condition (score de la couronne)" required />
                                        <Score fieldName="case_crown_score" score={values.case_crown_score} />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("case_crown_comment") && (
                                    <FormGroup>
                                        <Label htmlFor="case_crown_comment" label="Commentaire - Couronne" />
                                        <Input
                                            id="case_crown_comment"
                                            name="case_crown_comment"
                                            type="textarea"
                                            error={errors.case_crown_comment}
                                        />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("case_crown_images") && (
                                    <FormGroup>
                                        <Label htmlFor="case_crown_images" label="Photos de la couronne" required />
                                        <FileUpload
                                            bucketName="object_attributes"
                                            uploadPath={`objects/${selectedCertificate?.object_id}`}
                                            value={values.case_crown_images}
                                            onChange={(paths) => setFieldValue('case_crown_images', paths)}
                                            acceptedFileTypes={[".jpg", ".png"]}
                                        />
                                    </FormGroup>
                                )}

                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    {!certificateTypeExcludedFormFields?.includes("case_crown_pusher") && (
                                        <FormGroup>
                                            <Label htmlFor="case_crown_pusher" label="Nombre de poussoir" />
                                            <Input
                                                id="case_crown_pusher"
                                                name="case_crown_pusher"
                                                type="number"
                                                error={errors.case_crown_pusher}
                                            />
                                        </FormGroup>
                                    )}

                                    {values.case_crown_pusher > 0 ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-6">
                                                {!certificateTypeExcludedFormFields?.includes("case_crown_pusher_factory") && (
                                                    <FormGroup>
                                                        <Label htmlFor="case_crown_pusher_factory" label="Poussoir(s) d'origine" required />
                                                        <FormSelect
                                                            error={errors.case_crown_pusher_factory}
                                                            value={values.case_crown_pusher_factory}
                                                            onChange={value => setFieldValue('case_crown_pusher_factory', value)}
                                                            id="case_crown_pusher_factory"
                                                            options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                        />
                                                    </FormGroup>
                                                )}

                                                <FormGroup>
                                                    {values.case_crown_pusher_factory !== choiceOptions[0] && (
                                                        <div className="space-y-4">
                                                            {!certificateTypeExcludedFormFields?.includes("case_crown_pusher_change") && (
                                                                <FormGroup>
                                                                    <Label htmlFor="case_crown_pusher_change" label="Poussoir(s) remplacé(s)" />
                                                                    <FormSelect
                                                                        error={errors.case_crown_pusher_change}
                                                                        value={values.case_crown_pusher_change}
                                                                        onChange={value => setFieldValue('case_crown_pusher_change', value)}
                                                                        id="case_crown_pusher_change"
                                                                        options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                                    />
                                                                </FormGroup>
                                                            )}

                                                            {(values.case_crown_pusher_change === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_crown_pusher_change_date")) && (
                                                                <FormGroup>
                                                                    <Label htmlFor="case_crown_pusher_change_date" label="Date de remplacement" />
                                                                    <Input
                                                                        id="case_crown_pusher_change_date"
                                                                        name="case_crown_pusher_change_date"
                                                                        type="text"
                                                                        placeholder={new Date().toLocaleDateString()}
                                                                        error={errors.case_crown_pusher_change_date}
                                                                    />
                                                                </FormGroup>
                                                            )}
                                                        </div>
                                                    )}

                                                    {!certificateTypeExcludedFormFields?.includes("case_crown_pusher_custom") && (
                                                        <FormGroup>
                                                            <Label htmlFor="case_crown_pusher_custom" label="Poussoir(s) modifié(s)" />
                                                            <FormSelect
                                                                error={errors.case_crown_pusher_custom}
                                                                value={values.case_crown_pusher_custom}
                                                                onChange={value => setFieldValue('case_crown_pusher_custom', value)}
                                                                id="case_crown_pusher_custom"
                                                                options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                            />
                                                        </FormGroup>
                                                    )}

                                                    {(values.case_crown_pusher_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_crown_pusher_custom_date")) && (
                                                        <FormGroup>
                                                            <Label htmlFor="case_crown_pusher_custom_date" label="Date de modification" />
                                                            <Input
                                                                id="case_crown_pusher_custom_date"
                                                                name="case_crown_pusher_custom_date"
                                                                type="text"
                                                                placeholder={new Date().toLocaleDateString()}
                                                                error={errors.case_crown_pusher_custom_date}
                                                            />
                                                        </FormGroup>
                                                    )}
                                                </FormGroup>
                                            </div>

                                            {!certificateTypeExcludedFormFields?.includes("case_crown_pusher_score") && (
                                                <FormGroup>
                                                    <Label htmlFor="case_crown_pusher_score" label="Indice de condition (score des poussoirs)" required />
                                                    <Score fieldName="case_crown_pusher_score" score={values.case_crown_pusher_score} />
                                                </FormGroup>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("case_crown_comment") && (
                                                <FormGroup>
                                                    <Label htmlFor="case_crown_comment" label="Commentaire - Poussoirs" />
                                                    <Input
                                                        id="case_crown_pusher_comment"
                                                        name="case_crown_pusher_comment"
                                                        type="textarea"
                                                        error={errors.case_crown_pusher_comment}
                                                    />
                                                </FormGroup>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("case_crown_pusher_images") && (
                                                <FormGroup>
                                                    <Label htmlFor="case_crown_pusher_images" label="Photos des poussoirs" required />
                                                    <FileUpload
                                                        bucketName="object_attributes"
                                                        uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                        value={values.case_crown_pusher_images}
                                                        onChange={(paths) => setFieldValue('case_crown_pusher_images', paths)}
                                                        acceptedFileTypes={[".jpg", ".png"]}
                                                    />
                                                </FormGroup>
                                            )}
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default PartnerCertificationReportCaseCrownModal