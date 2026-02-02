import { Form, Formik } from 'formik'
import { type FC } from 'react'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import { choiceOptions, gemstones, treatments } from '@/utils/report'
import FormGroup from '@/components/UI/Form/Group'
import FormSelect from '@/components/UI/Form/Select'
import Label from '@/components/UI/Form/Label'
import FormRow from '@/components/UI/Form/Row'
import Input from '@/components/UI/Form/Input'
import Score from '@/components/UI/Form/Score'
import FileUpload from '@/components/UI/Form/FileUpload'
import { useCertificateStore } from '@/stores/certificateStore'

interface FormValues {
    case_bezel_type: string;
    case_bezel_material: string;
    case_bezel_texture: string;
    case_bezel_surface_plated: string;
    case_bezel_factory: string;
    case_bezel_change: string;
    case_bezel_change_date: string;
    case_bezel_custom: string;
    case_bezel_custom_date: string;
    case_bezel_score: number;
    case_bezel_comment: string;
    case_bezel_images: string[];
    case_bezel_setting: string;
    case_bezel_setting_type: string;
    case_bezel_setting_factory: string;
    case_bezel_setting_date: string;
}

interface PartnerCertificationReportCaseBezelModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportCaseBezelModal: FC<PartnerCertificationReportCaseBezelModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateStore();
    const { formData } = useCertificateReportFormStore();

    const bezelTypes = [
        "Fixe",
        "Rotative unidirectionnelle",
        "Rotative bidirectionnelle",
        "Tachymétrique",
        "Lunette GMT",
        "Compte à rebours",
        "Décompte",
        "Tournante interne",
        "Pulsomètre",
        "Télémétrique",
        "Heure universelle"
    ]
    const bezelMaterials = [
        "Acier",
        "Or jaune 24k",
        "Or jaune 18k",
        "Or jaune 14k",
        "Or rose",
        "Or blanc",
        "Or gris",
        "Platine",
        "Céramique",
        "Aluminium",
        "Carbone",
        "Titane",
        "Saphir",
        "Bakélite",
    ];
    const bezelTextures = [
        "Lisse",
        "Polie",
        "Brossée",
        "Satinée",
        "Cannelée",
        "Émailée",
        "Laquée"
    ]

    const initialValues: FormValues = {
        case_bezel_type: formData.case_bezel_type || "",
        case_bezel_material: formData.case_bezel_material || "",
        case_bezel_texture: formData.case_bezel_texture || "",
        case_bezel_surface_plated: formData.case_bezel_surface_plated || "",
        case_bezel_factory: formData.case_bezel_factory || choiceOptions[0],
        case_bezel_change: formData.case_bezel_change || choiceOptions[1],
        case_bezel_change_date: formData.case_bezel_change_date || "",
        case_bezel_custom: formData.case_bezel_custom || choiceOptions[1],
        case_bezel_custom_date: formData.case_bezel_custom_date || "",
        case_bezel_score: formData.case_bezel_score || 0,
        case_bezel_comment: formData.case_bezel_comment || "",
        case_bezel_images: formData.case_bezel_images || [],
        case_bezel_setting: formData.case_bezel_setting || choiceOptions[1],
        case_bezel_setting_type: formData.case_bezel_setting_type || "",
        case_bezel_setting_factory: formData.case_bezel_setting_factory || "",
        case_bezel_setting_date: formData.case_bezel_setting_date || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("case_bezel")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Lunette</h2>

            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className="space-y-6">
                                {!certificateTypeExcludedFormFields?.includes("case_bezel_type") && (
                                    <FormGroup>
                                        <Label htmlFor="case_bezel_type" label="Type de lunette" required />
                                        <FormSelect
                                            error={errors.case_bezel_type}
                                            value={values.case_bezel_type}
                                            onChange={value => setFieldValue('case_bezel_type', value)}
                                            id="case_bezel_type"
                                            searchable
                                            multiple
                                            options={bezelTypes.map(type => ({ label: type, value: type }))}
                                        />
                                    </FormGroup>
                                )}

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_material") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_material" label="Matériau de la lunette" required />
                                            <FormSelect
                                                error={errors.case_bezel_material}
                                                value={values.case_bezel_material}
                                                onChange={value => setFieldValue('case_bezel_material', value)}
                                                id="case_bezel_material"
                                                searchable
                                                multiple
                                                options={bezelMaterials.map(material => ({ label: material, value: material }))}
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_texture") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_texture" label="Texture de la lunette" />
                                            <FormSelect
                                                error={errors.case_bezel_texture}
                                                value={values.case_bezel_texture}
                                                onChange={value => setFieldValue('case_bezel_texture', value)}
                                                id="case_bezel_texture"
                                                searchable
                                                multiple
                                                options={bezelTextures.map(texture => ({ label: texture, value: texture }))}
                                            />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                {!certificateTypeExcludedFormFields?.includes("case_bezel_surface_plated") && (
                                    <FormGroup>
                                        <Label htmlFor="case_bezel_surface_plated" label="Placage et traitement de surface" />
                                        <FormSelect
                                            error={errors.case_bezel_surface_plated}
                                            value={values.case_bezel_surface_plated}
                                            onChange={value => setFieldValue('case_bezel_surface_plated', value)}
                                            id="case_bezel_surface_plated"
                                            searchable
                                            multiple
                                            options={treatments.map(treatment => ({ label: treatment, value: treatment }))}
                                        />
                                    </FormGroup>
                                )}

                                <div className="grid grid-cols-2 gap-6">
                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_factory") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_factory" label="Lunette d'origine" required />
                                            <FormSelect
                                                error={errors.case_bezel_factory}
                                                value={values.case_bezel_factory}
                                                onChange={value => setFieldValue('case_bezel_factory', value)}
                                                id="case_bezel_factory"
                                                options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                            />
                                        </FormGroup>
                                    )}

                                    <FormGroup>
                                        {values.case_bezel_factory !== choiceOptions[0] && (
                                            <div className="space-y-4">
                                                {!certificateTypeExcludedFormFields?.includes("case_bezel_change") && (
                                                    <FormGroup>
                                                        <Label htmlFor="case_bezel_change" label="Lunette remplacée" />
                                                        <FormSelect
                                                            error={errors.case_bezel_change}
                                                            value={values.case_bezel_change}
                                                            onChange={value => setFieldValue('case_bezel_change', value)}
                                                            id="case_bezel_change"
                                                            options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                        />
                                                    </FormGroup>
                                                )}

                                                {(values.case_bezel_change === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_bezel_change_date")) && (
                                                    <FormGroup>
                                                        <Label htmlFor="case_bezel_change_date" label="Date de remplacement" />
                                                        <Input
                                                            id="case_bezel_change_date"
                                                            name="case_bezel_change_date"
                                                            type="text"
                                                            placeholder={new Date().toLocaleDateString()}
                                                            error={errors.case_bezel_change_date}
                                                        />
                                                    </FormGroup>
                                                )}
                                            </div>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("case_bezel_custom") && (
                                            <FormGroup>
                                                <Label htmlFor="case_bezel_custom" label="Lunette modifiée" />
                                                <FormSelect
                                                    error={errors.case_bezel_custom}
                                                    value={values.case_bezel_custom}
                                                    onChange={value => setFieldValue('case_bezel_custom', value)}
                                                    id="case_bezel_custom"
                                                    options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                />
                                            </FormGroup>
                                        )}

                                        {(values.case_bezel_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("")) && (
                                            <FormGroup>
                                                <Label htmlFor="case_bezel_custom_date" label="Date de modification" />
                                                <Input
                                                    id="case_bezel_custom_date"
                                                    name="case_bezel_custom_date"
                                                    type="text"
                                                    placeholder={new Date().toLocaleDateString()}
                                                    error={errors.case_bezel_custom_date}
                                                />
                                            </FormGroup>
                                        )}
                                    </FormGroup>
                                </div>

                                {!certificateTypeExcludedFormFields?.includes("case_bezel_setting") && (
                                    <div className='space-y-4 border-t border-white/10 pt-8'>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="case_bezel_setting"
                                                        label="Sertissage"
                                                        required />
                                                    <FormSelect
                                                        error={errors.case_bezel_setting}
                                                        value={values.case_bezel_setting}
                                                        onChange={value => setFieldValue('case_bezel_setting', value)}
                                                        id='case_bezel_setting'
                                                        options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                    />
                                                </FormGroup>
                                                {values.case_bezel_setting === choiceOptions[0] && (
                                                    <FormGroup className='mt-4'>
                                                        <Label
                                                            htmlFor="case_bezel_setting_type"
                                                            label="Type de sertissage"
                                                            required />
                                                        <FormSelect
                                                            error={errors.case_bezel_setting_type}
                                                            value={values.case_bezel_setting_type}
                                                            onChange={value => setFieldValue('case_bezel_setting_type', value)}
                                                            id='case_bezel_setting_type'
                                                            options={gemstones.map(type => ({ label: type, value: type }))}
                                                            searchable />
                                                    </FormGroup>
                                                )}
                                            </div>
                                            {values.case_bezel_setting === choiceOptions[0] && (
                                                <div>
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="case_bezel_setting_factory"
                                                            label="Sertissage d'origine" />
                                                        <FormSelect
                                                            error={errors.case_bezel_setting_factory}
                                                            value={values.case_bezel_setting_factory}
                                                            onChange={value => setFieldValue('case_bezel_setting_factory', value)}
                                                            id='case_bezel_setting_factory'
                                                            options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className='mt-4'>
                                                        <Label
                                                            htmlFor="case_bezel_setting_date"
                                                            label="Date de sertissage" />
                                                        <Input
                                                            error={errors.case_bezel_setting_date}
                                                            id='case_bezel_setting_date'
                                                            name='case_bezel_setting_date'
                                                            placeholder={new Date().toLocaleDateString()}
                                                            type='text'
                                                        />
                                                    </FormGroup>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_score") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_score" label="Indice de condition (score de la lunette)" required />
                                            <Score fieldName="case_bezel_score" score={values.case_bezel_score} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_comment") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_comment" label="Commentaire - Lunette" />
                                            <Input
                                                id="case_bezel_comment"
                                                name="case_bezel_comment"
                                                type="textarea"
                                                error={errors.case_bezel_comment}
                                            />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_bezel_images") && (
                                        <FormGroup>
                                            <Label htmlFor="case_bezel_images" label="Photos de la lunette" required />
                                            <FileUpload
                                                bucketName="object_attributes"
                                                uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                value={values.case_bezel_images}
                                                onChange={(paths) => setFieldValue('case_bezel_images', paths)}
                                                acceptedFileTypes={[".jpg", ".png"]}
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

export default PartnerCertificationReportCaseBezelModal