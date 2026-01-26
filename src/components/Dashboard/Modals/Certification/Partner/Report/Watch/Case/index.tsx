import { Form, Formik } from 'formik'
import { type FC } from 'react'
import { useCertificateReportStore } from '@/stores/certificateReportStore'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import { choiceOptions, hallmarks, materials, gemstones, treatments } from '@/utils/report'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import FormSelect from '@/components/UI/Form/Select'
import FormRow from '@/components/UI/Form/Row'
import Input from '@/components/UI/Form/Input'
import Score from '@/components/UI/Form/Score'
import FileUpload from '@/components/UI/Form/FileUpload'

interface FormValues {
    case_shape: string;
    case_diameter: {
        length: string;
        width: string;
        diameter: string;
    },
    case_material: string;
    case_surface_plated: string;
    case_hallmark: string;
    case_signature: string;
    case_thickness: string;
    case_serial_number: string;
    case_reference: string;
    case_factory: string;
    case_change: string;
    case_change_date: string;
    case_custom: string;
    case_custom_date: string;
    case_setting: string;
    case_setting_type: string;
    case_setting_factory: string;
    case_setting_date: string;
    case_score: number;
    case_comment: string;
    case_images: string[];
    case_lug_width: string;
}

interface PartnerCertificationReportCaseModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportCaseModal: FC<PartnerCertificationReportCaseModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const forms = [
        "Rond",
        "Carré",
        "Rectangulaire",
        "Coussin",
        "Tonneau",
        "Ovale",
        "Polygon",
        "Octognal",
        "Asymétrique",
        "Bullhead",
        "Drapé / Libre",
        "Forme spéciale"
    ];

    const initialValues: FormValues = {
        case_shape: formData.case_shape || forms[0],
        case_diameter: {
            length: formData.case_diameter.length || "",
            width: formData.case_diameter.width || "",
            diameter: formData.case_diameter.diameter || ""
        },
        case_thickness: formData.case_thickness || "",
        case_material: formData.case_material || materials[0],
        case_surface_plated: formData.case_surface_plated || treatments[0],
        case_hallmark: formData.case_hallmark || hallmarks[0],
        case_factory: formData.case_factory || choiceOptions[0],
        case_setting: formData.case_setting || choiceOptions[1],
        case_setting_type: formData.case_setting_type || "",
        case_setting_factory: formData.case_setting_factory || choiceOptions[1],
        case_change: formData.case_change || choiceOptions[0],
        case_custom: formData.case_custom || choiceOptions[1],
        case_change_date: formData.case_change_date || "",
        case_signature: formData.case_signature || "",
        case_serial_number: formData.case_serial_number || "",
        case_reference: formData.case_reference || "",
        case_custom_date: formData.case_custom_date || "",
        case_setting_date: formData.case_setting_date || "",
        case_score: formData.case_score || 0,
        case_comment: formData.case_comment || "",
        case_images: formData.case_images || [],
        case_lug_width: formData.case_lug_width || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("case")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Boîtier</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <div className='space-y-4'>
                                    <div className='space-y-4'>
                                        {!certificateTypeExcludedFormFields?.includes("case_shape") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="case_shape"
                                                    label="Forme du boitier"
                                                    required />
                                                <FormSelect
                                                    error={errors.case_shape}
                                                    value={values.case_shape}
                                                    onChange={value => setFieldValue('case_shape', value)}
                                                    id='case_shape'
                                                    options={forms.map((form: string) => (
                                                        {
                                                            label: form,
                                                            value: form
                                                        }
                                                    ))}
                                                    searchable />
                                            </FormGroup>
                                        )}
                                    </div>
                                </div>

                                {!certificateTypeExcludedFormFields?.includes("case_diameter") && (
                                    <div className='space-y-4 border-t border-white/10 py-8'>
                                        <h2 className="text-white text-lg font-semibold">Dimensions du boîtier</h2>
                                        <div className='space-y-4 mt-8'>
                                            <FormRow>
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="case_diameter.length"
                                                        label="Longueur" />
                                                    <Input
                                                        error={errors.case_diameter?.length}
                                                        id='case_diameter.length'
                                                        name='case_diameter.length'
                                                        placeholder='mm'
                                                        type='text'
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="case_diameter.width"
                                                        label="Largeur" />
                                                    <Input
                                                        error={errors.case_diameter?.width}
                                                        id='case_diameter.width'
                                                        name='case_diameter.width'
                                                        placeholder='mm'
                                                        type='text'
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="case_diameter.diameter"
                                                        label="Diamètre"
                                                        required />
                                                    <Input
                                                        error={errors.case_diameter?.diameter}
                                                        id='case_diameter.diameter'
                                                        name='case_diameter.diameter'
                                                        placeholder='mm'
                                                        type='text'
                                                    />
                                                </FormGroup>
                                            </FormRow>
                                            <FormGroup>
                                                <Label
                                                    htmlFor="case_thickness"
                                                    label="Épaisseur"
                                                    required />
                                                <Input
                                                    error={errors.case_thickness}
                                                    id='case_thickness'
                                                    name='case_thickness'
                                                    placeholder='mm'
                                                    type='text'
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label
                                                    htmlFor="case_lug_width"
                                                    label="Largeur entre-cornes"
                                                    required />
                                                <Input
                                                    error={errors.case_lug_width}
                                                    id='case_lug_width'
                                                    name='case_lug_width'
                                                    placeholder='mm'
                                                    type='text'
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                )}

                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    {!certificateTypeExcludedFormFields?.includes("case_material") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="case_material"
                                                label="Matériau du boîtier"
                                                required />
                                            <FormSelect
                                                error={errors.case_material}
                                                value={values.case_material}
                                                onChange={value => setFieldValue('case_material', value)}
                                                id='case_material'
                                                options={materials.map((material: string) => (
                                                    {
                                                        label: material,
                                                        value: material
                                                    }
                                                ))}
                                                multiple />
                                        </FormGroup>
                                    )}

                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("case_surface_plated") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="case_surface_plated"
                                                    label="Placage et traitement de surface" />
                                                <FormSelect
                                                    error={errors.case_surface_plated}
                                                    value={values.case_surface_plated}
                                                    onChange={value => setFieldValue('case_surface_plated', value)}
                                                    id='case_surface_plated'
                                                    options={treatments.map((treatment: string) => (
                                                        {
                                                            label: treatment,
                                                            value: treatment
                                                        }
                                                    ))} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("case_hallmark") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="case_hallmark"
                                                    label="Poinçon" />
                                                <FormSelect
                                                    error={errors.case_hallmark}
                                                    value={values.case_hallmark}
                                                    onChange={value => setFieldValue('case_hallmark', value)}
                                                    id='case_hallmark'
                                                    multiple
                                                    options={hallmarks.map((hallmark: string) => (
                                                        {
                                                            label: hallmark,
                                                            value: hallmark
                                                        }
                                                    ))} />
                                            </FormGroup>
                                        )}
                                    </FormRow>

                                    {!certificateTypeExcludedFormFields?.includes("case_signature") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="case_signature"
                                                label="Signature ou gravure" />
                                            <Input
                                                error={errors.case_signature}
                                                id='case_signature'
                                                name='case_signature'
                                                type='text'
                                            />
                                        </FormGroup>
                                    )}
                                </div>
                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            {!certificateTypeExcludedFormFields?.includes("case_serial_number") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="case_serial_number"
                                                        label="Numéro de série du boîtier" />
                                                    <Input
                                                        error={errors.case_serial_number}
                                                        id='case_serial_number'
                                                        name='case_serial_number'
                                                        type='text'
                                                    />
                                                </FormGroup>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("case_factory") && (
                                                <FormGroup className='mt-4'>
                                                    <Label
                                                        htmlFor="case_factory"
                                                        label="Boîtier d'origine"
                                                        required />
                                                    <FormSelect
                                                        error={errors.case_factory}
                                                        value={values.case_factory}
                                                        onChange={value => setFieldValue('case_factory', value)}
                                                        id='case_factory'
                                                        options={choiceOptions.map((option: string) => (
                                                            {
                                                                label: option,
                                                                value: option
                                                            }
                                                        ))} />
                                                </FormGroup>
                                            )}
                                        </div>
                                        <div>
                                            {!certificateTypeExcludedFormFields?.includes("case_reference") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="case_reference"
                                                        label="Référence du boîtier" />
                                                    <Input
                                                        error={errors.case_reference}
                                                        id='case_reference'
                                                        name='case_reference'
                                                        type='text'
                                                    />
                                                </FormGroup>
                                            )}
                                            {values.case_factory !== choiceOptions[0] && (
                                                <FormGroup className='mt-4'>
                                                    {!certificateTypeExcludedFormFields?.includes("case_change") && (
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="case_change"
                                                                label="Boîtier remplacé" />
                                                            <FormSelect
                                                                error={errors.case_change}
                                                                value={values.case_change}
                                                                onChange={value => setFieldValue('case_change', value)}
                                                                id='case_change'
                                                                options={choiceOptions.map((option: string) => (
                                                                    {
                                                                        label: option,
                                                                        value: option
                                                                    }
                                                                ))} />
                                                        </FormGroup>
                                                    )}

                                                    {values.case_change !== choiceOptions[0] && (
                                                        <FormGroup>
                                                            {!certificateTypeExcludedFormFields?.includes("case_change_date") && (
                                                                <FormGroup>
                                                                    <Label
                                                                        htmlFor="case_change_date"
                                                                        label="Date de remplacement" />
                                                                    <Input
                                                                        error={errors.case_change_date}
                                                                        id='case_change_date'
                                                                        name='case_change_date'
                                                                        placeholder={new Date().toLocaleDateString()}
                                                                        type='text'
                                                                    />
                                                                </FormGroup>
                                                            )}
                                                        </FormGroup>
                                                    )}
                                                </FormGroup>
                                            )}
                                            <FormGroup className='mt-4'>
                                                {!certificateTypeExcludedFormFields?.includes("case_custom") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="case_custom"
                                                            label="Boîtier modifié" />
                                                        <FormSelect
                                                            error={errors.case_custom}
                                                            value={values.case_custom}
                                                            onChange={value => setFieldValue('case_custom', value)}
                                                            id='case_custom'
                                                            options={choiceOptions.map((option: string) => (
                                                                {
                                                                    label: option,
                                                                    value: option
                                                                }
                                                            ))} />
                                                    </FormGroup>
                                                )}

                                                {(values.case_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("case_custom_date")) && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="case_custom_date"
                                                            label="Date de modification" />
                                                        <Input
                                                            error={errors.case_custom_date}
                                                            id='case_custom_date'
                                                            name='case_custom_date'
                                                            placeholder={new Date().toLocaleDateString()}
                                                            type='text'
                                                        />
                                                    </FormGroup>
                                                )}
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                                <div className='space-y-4 border-t border-white/10 pt-8'>
                                    {!certificateTypeExcludedFormFields?.includes("case_setting") && (
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="case_setting"
                                                        label="Sertissage"
                                                        required />
                                                    <FormSelect
                                                        error={errors.case_setting}
                                                        value={values.case_setting}
                                                        onChange={value => setFieldValue('case_setting', value)}
                                                        id='case_setting'
                                                        options={choiceOptions.map((option: string) => (
                                                            {
                                                                label: option,
                                                                value: option
                                                            }
                                                        ))} />
                                                </FormGroup>
                                                {values.case_setting === choiceOptions[0] && (
                                                    <FormGroup className='mt-4'>
                                                        <Label
                                                            htmlFor="case_setting_type"
                                                            label="Type de sertissage"
                                                            required />
                                                        <FormSelect
                                                            error={errors.case_setting_type}
                                                            value={values.case_setting_type}
                                                            onChange={value => setFieldValue('case_setting_type', value)}
                                                            id='case_setting_type'
                                                            options={gemstones.map((settingType: string) => (
                                                                {
                                                                    label: settingType,
                                                                    value: settingType
                                                                }
                                                            ))}
                                                            searchable />
                                                    </FormGroup>
                                                )}
                                            </div>
                                            {values.case_setting === choiceOptions[0] && (
                                                <div>
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="case_setting_factory"
                                                            label="Sertissage d'origine" />
                                                        <FormSelect
                                                            error={errors.case_setting_factory}
                                                            value={values.case_setting_factory}
                                                            onChange={value => setFieldValue('case_setting_factory', value)}
                                                            id='case_setting_factory'
                                                            options={choiceOptions.map((choiceOption: string) => (
                                                                {
                                                                    label: choiceOption,
                                                                    value: choiceOption
                                                                }
                                                            ))} />
                                                    </FormGroup>
                                                    <FormGroup className='mt-4'>
                                                        <Label
                                                            htmlFor="case_setting_date"
                                                            label="Date de sertissage" />
                                                        <Input
                                                            error={errors.case_setting_date}
                                                            id='case_setting_date'
                                                            name='case_setting_date'
                                                            placeholder={new Date().toLocaleDateString()}
                                                            type='text'
                                                        />
                                                    </FormGroup>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_score") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="case_score"
                                                label="Indice de condition (score du boîtier)"
                                                required />
                                            <Score fieldName='case_score' score={values.case_score} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_comment") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="case_comment"
                                                label="Commentaire - Boîtier" />
                                            <Input type='textarea'
                                                id='case_comment'
                                                name='case_comment'
                                                error={errors.case_comment} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("case_images") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="case_images"
                                                label="Photos du boîtier"
                                                required />

                                            <FileUpload
                                                bucketName="object_attributes"
                                                uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                value={values.case_images}
                                                onChange={(paths) => setFieldValue('case_images', paths)}
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
        </div>
    )
}

export default PartnerCertificationReportCaseModal