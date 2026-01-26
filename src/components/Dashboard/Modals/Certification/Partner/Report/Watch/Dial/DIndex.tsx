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
import { choiceOptions, colors, gemstones } from '@/utils/report';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    dial_index_type: string;
    dial_index_style: string;
    dial_index_material: string;
    dial_index_color: string;
    dial_index_factory: string;
    dial_index_change: string;
    dial_index_change_date: string;
    dial_index_custom: string;
    dial_index_custom_date: string;
    dial_index_serial_number: string;
    dial_index_score: number;
    dial_index_comment: string;
    dial_index_luminescence: string;
    dial_index_luminescence_type: string;
    dial_index_luminescence_factory: string;
    dial_index_luminescence_change: string;
    dial_index_luminescence_change_date: string;
    dial_index_luminescence_score: number;
    dial_index_luminescence_comment: string;
}

interface PartnerCertificationReportDialIndexModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportDialIndexModal: FC<PartnerCertificationReportDialIndexModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const dialIndexTypes = [
        "Appliqué",
        "Peint",
        "Gravé"
    ]
    const dialIndexStyles = [
        "Bâton",
        "Dauphine",
        "Point",
        "Triangle",
        "Trapèze",
        "Chiffres romains",
        "Chiffres arabes",
        "Californien",
        "Track",
        "Pierres",
    ];
    const dialIndexMaterials = [
        "Acier inoxydable",
        "Or jaune",
        "Or blanc",
        "Or rose",
        "Plaqué or",
        "Platine",
        "Argent",
        "Peinture lumineuse",
        "Laiton",
        "Céramique",
        "Carbone",
        "Peinture",
        ...gemstones
    ]
    const dialIndexLuminescenceTypes = [
        "Radium",
        "Prométhium",
        "Tritium",
        "Luminova",
        "Super-Luminova",
        "Chromalight",
        "Micro-Tubes de tritium",
    ]

    const initialValues: FormValues = {
        dial_index_type: formData.dial_index_type || "",
        dial_index_style: formData.dial_index_style || "",
        dial_index_material: formData.dial_index_material || "",
        dial_index_color: formData.dial_index_color || "",
        dial_index_factory: formData.dial_index_factory || choiceOptions[0],
        dial_index_change: formData.dial_index_change || choiceOptions[1],
        dial_index_change_date: formData.dial_index_change_date || "",
        dial_index_custom: formData.dial_index_custom || choiceOptions[1],
        dial_index_custom_date: formData.dial_index_custom_date || "",
        dial_index_serial_number: formData.dial_index_serial_number || "",
        dial_index_score: formData.dial_index_score || 0,
        dial_index_comment: formData.dial_index_comment || "",
        dial_index_luminescence: formData.dial_index_luminescence || "",
        dial_index_luminescence_type: formData.dial_index_luminescence_type || "",
        dial_index_luminescence_factory: formData.dial_index_luminescence_factory || "",
        dial_index_luminescence_change: formData.dial_index_luminescence_change || "",
        dial_index_luminescence_change_date: formData.dial_index_luminescence_change_date || "",
        dial_index_luminescence_score: formData.dial_index_luminescence_score || 0,
        dial_index_luminescence_comment: formData.dial_index_luminescence_comment || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("dial_index")) : []

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
                                <h2 className="text-white text-xl font-semibold">Index</h2>
                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("dial_index_type") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_index_type"
                                                label="Type d'index"
                                                required />
                                            <Select
                                                error={errors.dial_index_type}
                                                value={values.dial_index_type}
                                                onChange={value => setFieldValue('dial_index_type', value)}
                                                id='dial_index_type'
                                                options={dialIndexTypes.map((type: string) => (
                                                    {
                                                        label: type,
                                                        value: type
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("dial_index_style") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_index_style"
                                                label="Style d'index"
                                                required />
                                            <Select
                                                error={errors.dial_index_style}
                                                value={values.dial_index_style}
                                                onChange={value => setFieldValue('dial_index_style', value)}
                                                id='dial_index_style'
                                                options={dialIndexStyles.map((type: string) => (
                                                    {
                                                        label: type,
                                                        value: type
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("dial_index_material") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_index_material"
                                                label="Matériau des index" />
                                            <Select
                                                error={errors.dial_index_material}
                                                value={values.dial_index_material}
                                                onChange={value => setFieldValue('dial_index_material', value)}
                                                id='dial_index_material'
                                                options={dialIndexMaterials.map((material: string) => (
                                                    {
                                                        label: material,
                                                        value: material
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("dial_index_color") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_index_color"
                                                label="Couleur des index" />
                                            <Select
                                                error={errors.dial_index_color}
                                                value={values.dial_index_color}
                                                onChange={value => setFieldValue('dial_index_color', value)}
                                                id='dial_index_color'
                                                options={colors.map((color: string) => (
                                                    {
                                                        label: color,
                                                        value: color
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                <div className='grid grid-cols-2 gap-4'>
                                    {!certificateTypeExcludedFormFields?.includes("dial_index_factory") && (
                                        <FormGroup className='mt-4'>
                                            <Label
                                                htmlFor="dial_index_factory"
                                                label="Index d'origine"
                                                required />
                                            <Select
                                                error={errors.dial_index_factory}
                                                value={values.dial_index_factory}
                                                onChange={value => setFieldValue('dial_index_factory', value)}
                                                id='dial_index_factory'
                                                options={choiceOptions.map((option: string) => (
                                                    {
                                                        label: option,
                                                        value: option
                                                    }
                                                ))} />
                                        </FormGroup>
                                    )}

                                    <FormGroup>
                                        {values.dial_index_factory !== choiceOptions[0] && (
                                            <FormGroup className='mt-4'>
                                                {!certificateTypeExcludedFormFields?.includes("dial_index_change") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="dial_index_change"
                                                            label="Index remplacé" />
                                                        <Select
                                                            error={errors.dial_index_change}
                                                            value={values.dial_index_change}
                                                            onChange={value => setFieldValue('dial_index_change', value)}
                                                            id='dial_index_change'
                                                            options={choiceOptions.map((option: string) => (
                                                                {
                                                                    label: option,
                                                                    value: option
                                                                }
                                                            ))} />
                                                    </FormGroup>
                                                )}

                                                {values.dial_index_change === choiceOptions[0] && (
                                                    <FormGroup>
                                                        {!certificateTypeExcludedFormFields?.includes("dial_index_change_date") && (
                                                            <FormGroup>
                                                                <Label
                                                                    htmlFor="dial_index_change_date"
                                                                    label="Date de remplacement" />
                                                                <Input
                                                                    error={errors.dial_index_change_date}
                                                                    id='dial_index_change_date'
                                                                    name='dial_index_change_date'
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
                                            {!certificateTypeExcludedFormFields?.includes("dial_index_custom") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="dial_index_custom"
                                                        label="Index modifié" />
                                                    <Select
                                                        error={errors.dial_index_custom}
                                                        value={values.dial_index_custom}
                                                        onChange={value => setFieldValue('dial_index_custom', value)}
                                                        id='dial_index_custom'
                                                        options={choiceOptions.map((option: string) => (
                                                            {
                                                                label: option,
                                                                value: option
                                                            }
                                                        ))} />
                                                </FormGroup>
                                            )}

                                            {(values.dial_index_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("dial_index_custom_date")) && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="dial_index_custom_date"
                                                        label="Date de modification" />
                                                    <Input
                                                        error={errors.dial_index_custom_date}
                                                        id='dial_index_custom_date'
                                                        name='dial_index_custom_date'
                                                        placeholder={new Date().toLocaleDateString()}
                                                        type='text'
                                                    />
                                                </FormGroup>
                                            )}
                                        </FormGroup>
                                    </FormGroup>
                                </div>

                                {!certificateTypeExcludedFormFields?.includes("dial_index_score") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="dial_index_score"
                                            label="Indice de condition (score des index)"
                                            required />
                                        <Score fieldName='dial_index_score' score={values.dial_index_score} />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("dial_index_comment") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="dial_index_comment"
                                            label="Commentaire - Index" />
                                        <Input
                                            type='textarea'
                                            id='dial_index_comment'
                                            name='dial_index_comment'
                                            error={errors.dial_index_comment} />
                                    </FormGroup>
                                )}

                                <div className='space-y-4 border-t border-white/10 pt-8'>
                                    <h2 className="text-white text-xl font-semibold">Luminescence des index</h2>
                                    {!certificateTypeExcludedFormFields?.includes("dial_index_luminescence") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_index_luminescence"
                                                label="Luminescence des index"
                                                required />
                                            <Select
                                                error={errors.dial_index_luminescence}
                                                value={values.dial_index_luminescence}
                                                onChange={value => setFieldValue('dial_index_luminescence', value)}
                                                id='dial_index_luminescence'
                                                options={choiceOptions.filter((option: string) => option !== choiceOptions[choiceOptions.length - 1]).map((option: string) => (
                                                    {
                                                        label: option,
                                                        value: option
                                                    }
                                                ))} />
                                        </FormGroup>
                                    )}

                                    {values.dial_index_luminescence === choiceOptions[0] && (
                                        <FormGroup>
                                            {!certificateTypeExcludedFormFields?.includes("dial_index_luminescence_type") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="dial_index_luminescence_type"
                                                        label="Type de luminescence"
                                                        required />
                                                    <Select
                                                        error={errors.dial_index_luminescence_type}
                                                        value={values.dial_index_luminescence_type}
                                                        onChange={value => setFieldValue('dial_index_luminescence_type', value)}
                                                        id='dial_index_luminescence_type'
                                                        options={dialIndexLuminescenceTypes.map((settingType: string) => (
                                                            {
                                                                label: settingType,
                                                                value: settingType
                                                            }
                                                        ))}
                                                        searchable />
                                                </FormGroup>
                                            )}

                                            <div className='grid grid-cols-2 gap-4'>
                                                <FormGroup>
                                                    {!certificateTypeExcludedFormFields?.includes("dial_index_luminescence_factory") && (
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="dial_index_luminescence_factory"
                                                                label="Luminescence d'origine" />
                                                            <Select
                                                                error={errors.dial_index_luminescence_factory}
                                                                value={values.dial_index_luminescence_factory}
                                                                onChange={value => setFieldValue('dial_index_luminescence_factory', value)}
                                                                id='dial_index_luminescence_factory'
                                                                options={choiceOptions.map((choiceOption: string) => (
                                                                    {
                                                                        label: choiceOption,
                                                                        value: choiceOption
                                                                    }
                                                                ))} />
                                                        </FormGroup>
                                                    )}
                                                </FormGroup>

                                                {values.dial_index_luminescence_factory !== choiceOptions[0] && (
                                                    <FormGroup className='space-y-4'>
                                                        {!certificateTypeExcludedFormFields?.includes("dial_index_luminescence_change") && (
                                                            <FormGroup>
                                                                <Label htmlFor="dial_index_luminescence_change" label="Luminescence remplacée" />
                                                                <Select
                                                                    error={errors.dial_index_luminescence_change}
                                                                    value={values.dial_index_luminescence_change}
                                                                    onChange={value => setFieldValue('dial_index_luminescence_change', value)}
                                                                    id="dial_index_luminescence_change"
                                                                    options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                                />
                                                            </FormGroup>
                                                        )}

                                                        {(values.dial_index_luminescence_change === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("dial_index_luminescence_change_date")) && (
                                                            <FormGroup>
                                                                <Label htmlFor="dial_index_luminescence_change_date" label="Date de remplacement" />
                                                                <Input
                                                                    id="dial_index_luminescence_change_date"
                                                                    name="dial_index_luminescence_change_date"
                                                                    type="text"
                                                                    placeholder={new Date().toLocaleDateString()}
                                                                    error={errors.dial_index_luminescence_change_date}
                                                                />
                                                            </FormGroup>
                                                        )}
                                                    </FormGroup>
                                                )}
                                            </div>

                                            {!certificateTypeExcludedFormFields?.includes("dial_index_luminescence_score") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="dial_index_luminescence_score"
                                                        label="Indice de condition (score de la luminescence des index)"
                                                        required />
                                                    <Score fieldName='dial_index_luminescence_score' score={values.dial_index_luminescence_score} />
                                                </FormGroup>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("dial_index_luminescence_comment") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="dial_index_luminescence_comment"
                                                        label="Commentaire - Luminescence index" />
                                                    <Input type='textarea'
                                                        id='dial_index_luminescence_comment'
                                                        name='dial_index_luminescence_comment'
                                                        error={errors.dial_index_luminescence_comment} />
                                                </FormGroup>
                                            )}
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

export default PartnerCertificationReportDialIndexModal