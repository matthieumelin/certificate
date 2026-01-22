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
import { choiceOptions, colors } from '@/utils/report';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    dial_hands_type: string;
    dial_hands_style: string;
    dial_hands_material: string;
    dial_hands_color: string;
    dial_hands_factory: string;
    dial_hands_score: number;
    dial_hands_comment: string;
    dial_hands_images: string[];
    dial_hands_luminescence: string;
    dial_hands_luminescence_type: string;
    dial_hands_luminescence_factory: string;
    dial_hands_luminescence_change: string;
    dial_hands_luminescence_change_date: string;
    dial_hands_luminescence_score: number;
    dial_hands_luminescence_comment: string;
    dial_hands_custom: string;
    dial_hands_custom_date: string;
    dial_hands_change: string;
    dial_hands_change_date: string;
}

interface PartnerCertificationReportDialHandsModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportDialHandsModal: FC<PartnerCertificationReportDialHandsModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const dialHandsTypes = [
        "Heures",
        "Minutes",
        "Secondes",
        "Petit seconde",
        "GMT / 24h",
        "Chronographe",
        "Compteur de chrono",
        "Réserve de Marche",
        "Rétrograde"
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
        "Diamants",
        "Rubis",
        "Saphirs",
        "Peinture lumineuse",
        "Laiton",
        "Céramique",
        "Carbone",
        "Peinture",
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
        dial_hands_type: formData.dial_hands_type || "",
        dial_hands_style: formData.dial_hands_style || "",
        dial_hands_material: formData.dial_hands_material || "",
        dial_hands_color: formData.dial_hands_color || "",
        dial_hands_factory: formData.dial_hands_factory || "",
        dial_hands_score: formData.dial_hands_score || 0,
        dial_hands_comment: formData.dial_hands_comment || "",
        dial_hands_images: formData.dial_hands_images || [],
        dial_hands_luminescence: formData.dial_hands_luminescence || choiceOptions[0],
        dial_hands_luminescence_type: formData.dial_hands_luminescence_type || "",
        dial_hands_luminescence_factory: formData.dial_hands_luminescence_factory || choiceOptions[0],
        dial_hands_luminescence_change: formData.dial_hands_luminescence_change || choiceOptions[1],
        dial_hands_luminescence_change_date: formData.dial_hands_luminescence_change_date || "",
        dial_hands_luminescence_score: formData.dial_hands_luminescence_score || 0,
        dial_hands_luminescence_comment: formData.dial_hands_luminescence_comment || "",
        dial_hands_custom: formData.dial_hands_custom || choiceOptions[1],
        dial_hands_custom_date: formData.dial_hands_custom_date || "",
        dial_hands_change: formData.dial_hands_change || choiceOptions[1],
        dial_hands_change_date: formData.dial_hands_change_date || "",
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("dial_hands")) : []

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
                                <h2 className="text-white text-xl font-semibold">Aiguilles</h2>
                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("dial_hands_type") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_hands_type"
                                                label="Type d'aiguilles"
                                                required />
                                            <Select
                                                error={errors.dial_hands_type}
                                                value={values.dial_hands_type}
                                                onChange={value => setFieldValue('dial_hands_type', value)}
                                                id='dial_hands_type'
                                                options={dialHandsTypes.map((type: string) => (
                                                    {
                                                        label: type,
                                                        value: type
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("dial_hands_style") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_hands_style"
                                                label="Style d'aiguilles"
                                                required />
                                            <Select
                                                error={errors.dial_hands_style}
                                                value={values.dial_hands_style}
                                                onChange={value => setFieldValue('dial_hands_style', value)}
                                                id='dial_hands_style'
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
                                    {!certificateTypeExcludedFormFields?.includes("dial_hands_material") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_hands_material"
                                                label="Matériau des aiguilles" />
                                            <Select
                                                error={errors.dial_hands_material}
                                                value={values.dial_hands_material}
                                                onChange={value => setFieldValue('dial_hands_material', value)}
                                                id='dial_hands_material'
                                                options={dialIndexMaterials.map((material: string) => (
                                                    {
                                                        label: material,
                                                        value: material
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("dial_hands_color") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_hands_color"
                                                label="Couleur des aiguilles" />
                                            <Select
                                                error={errors.dial_hands_color}
                                                value={values.dial_hands_color}
                                                onChange={value => setFieldValue('dial_hands_color', value)}
                                                id='dial_hands_color'
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
                                    {!certificateTypeExcludedFormFields?.includes("dial_hands_factory") && (
                                        <FormGroup className='mt-4'>
                                            <Label
                                                htmlFor="dial_hands_factory"
                                                label="Aiguilles d'origine"
                                                required />
                                            <Select
                                                error={errors.dial_hands_factory}
                                                value={values.dial_hands_factory}
                                                onChange={value => setFieldValue('dial_hands_factory', value)}
                                                id='dial_hands_factory'
                                                options={choiceOptions.map((option: string) => (
                                                    {
                                                        label: option,
                                                        value: option
                                                    }
                                                ))} />
                                        </FormGroup>
                                    )}

                                    <FormGroup>
                                        {values.dial_hands_factory !== choiceOptions[0] && (
                                            <FormGroup className='mt-4'>
                                                {!certificateTypeExcludedFormFields?.includes("dial_hands_change") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="dial_hands_change"
                                                            label="Aiguille remplacées" />
                                                        <Select
                                                            error={errors.dial_hands_change}
                                                            value={values.dial_hands_change}
                                                            onChange={value => setFieldValue('dial_hands_change', value)}
                                                            id='dial_hands_change'
                                                            options={choiceOptions.map((option: string) => (
                                                                {
                                                                    label: option,
                                                                    value: option
                                                                }
                                                            ))} />
                                                    </FormGroup>
                                                )}

                                                {values.dial_hands_change === choiceOptions[0] && (
                                                    <FormGroup>
                                                        {!certificateTypeExcludedFormFields?.includes("dial_hands_change_date") && (
                                                            <FormGroup>
                                                                <Label
                                                                    htmlFor="dial_hands_change_date"
                                                                    label="Date de remplacement" />
                                                                <Input
                                                                    error={errors.dial_hands_change_date}
                                                                    id='dial_hands_change_date'
                                                                    name='dial_hands_change_date'
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
                                            {!certificateTypeExcludedFormFields?.includes("dial_hands_custom") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="dial_hands_custom"
                                                        label="Aiguilles modifiées" />
                                                    <Select
                                                        error={errors.dial_hands_custom}
                                                        value={values.dial_hands_custom}
                                                        onChange={value => setFieldValue('dial_hands_custom', value)}
                                                        id='dial_hands_custom'
                                                        options={choiceOptions.map((option: string) => (
                                                            {
                                                                label: option,
                                                                value: option
                                                            }
                                                        ))} />
                                                </FormGroup>
                                            )}

                                            {(values.dial_hands_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("dial_hands_custom_date")) && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="dial_hands_custom_date"
                                                        label="Date de modification" />
                                                    <Input
                                                        error={errors.dial_hands_custom_date}
                                                        id='dial_hands_custom_date'
                                                        name='dial_hands_custom_date'
                                                        placeholder={new Date().toLocaleDateString()}
                                                        type='text'
                                                    />
                                                </FormGroup>
                                            )}
                                        </FormGroup>
                                    </FormGroup>
                                </div>

                                {!certificateTypeExcludedFormFields?.includes("dial_hands_score") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="dial_hands_score"
                                            label="Score des aiguilles"
                                            required />
                                        <Score fieldName='dial_hands_score' score={values.dial_hands_score} />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("dial_hands_comment") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="dial_hands_comment"
                                            label="Commentaire - Aiguilles" />
                                        <Input
                                            type='textarea'
                                            id='dial_hands_comment'
                                            name='dial_hands_comment'
                                            error={errors.dial_hands_comment} />
                                    </FormGroup>
                                )}

                                <div className='space-y-4 border-t border-white/10 pt-8'>
                                    <h2 className="text-white text-xl font-semibold">Luminescence des aiguilles</h2>
                                    {!certificateTypeExcludedFormFields?.includes("dial_hands_luminescence") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_hands_luminescence"
                                                label="Luminescence des aiguilles"
                                                required />
                                            <Select
                                                error={errors.dial_hands_luminescence}
                                                value={values.dial_hands_luminescence}
                                                onChange={value => setFieldValue('dial_hands_luminescence', value)}
                                                id='dial_hands_luminescence'
                                                options={choiceOptions.filter((option: string) => option !== choiceOptions[choiceOptions.length - 1]).map((option: string) => (
                                                    {
                                                        label: option,
                                                        value: option
                                                    }
                                                ))} />
                                        </FormGroup>
                                    )}

                                    {(values.dial_hands_luminescence === choiceOptions[0] &&
                                        !certificateTypeExcludedFormFields?.includes("dial_hands_luminescence_type")) && (
                                            <FormGroup>
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="dial_hands_luminescence_type"
                                                        label="Type de luminescence"
                                                        required />
                                                    <Select
                                                        error={errors.dial_hands_luminescence_type}
                                                        value={values.dial_hands_luminescence_type}
                                                        onChange={value => setFieldValue('dial_hands_luminescence_type', value)}
                                                        id='dial_hands_luminescence_type'
                                                        options={dialIndexLuminescenceTypes.map((settingType: string) => (
                                                            {
                                                                label: settingType,
                                                                value: settingType
                                                            }
                                                        ))}
                                                        searchable />
                                                </FormGroup>

                                                <div className='grid grid-cols-2 gap-4'>
                                                    {!certificateTypeExcludedFormFields?.includes("dial_hands_luminescence_factory") && (
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="dial_hands_luminescence_factory"
                                                                label="Luminescence d'origine" />
                                                            <Select
                                                                error={errors.dial_hands_luminescence_factory}
                                                                value={values.dial_hands_luminescence_factory}
                                                                onChange={value => setFieldValue('dial_hands_luminescence_factory', value)}
                                                                id='dial_hands_luminescence_factory'
                                                                options={choiceOptions.map((choiceOption: string) => (
                                                                    {
                                                                        label: choiceOption,
                                                                        value: choiceOption
                                                                    }
                                                                ))} />
                                                        </FormGroup>
                                                    )}

                                                    {values.dial_hands_luminescence_factory !== choiceOptions[0] && (
                                                        <FormGroup className='space-y-4'>
                                                            {!certificateTypeExcludedFormFields?.includes("dial_hands_luminescence_change") && (
                                                                <FormGroup>
                                                                    <Label htmlFor="dial_hands_luminescence_change" label="Luminescence remplacée" />
                                                                    <Select
                                                                        error={errors.dial_hands_luminescence_change}
                                                                        value={values.dial_hands_luminescence_change}
                                                                        onChange={value => setFieldValue('dial_hands_luminescence_change', value)}
                                                                        id="dial_hands_luminescence_change"
                                                                        options={choiceOptions.map(opt => ({ label: opt, value: opt }))}
                                                                    />
                                                                </FormGroup>
                                                            )}

                                                            {(values.dial_hands_luminescence_change === choiceOptions[0] &&
                                                                !certificateTypeExcludedFormFields?.includes("dial_hands_luminescence_change_date")) && (
                                                                    <FormGroup>
                                                                        <Label htmlFor="dial_hands_luminescence_change_date" label="Date de remplacement" />
                                                                        <Input
                                                                            id="dial_hands_luminescence_change_date"
                                                                            name="dial_hands_luminescence_change_date"
                                                                            type="text"
                                                                            placeholder={new Date().toLocaleDateString()}
                                                                            error={errors.dial_hands_luminescence_change_date}
                                                                        />
                                                                    </FormGroup>
                                                                )}
                                                        </FormGroup>
                                                    )}
                                                </div>

                                                {!certificateTypeExcludedFormFields?.includes("dial_hands_luminescence_score") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="dial_hands_luminescence_score"
                                                            label="Score de la luminescence des aiguilles"
                                                            required />
                                                        <Score fieldName='dial_hands_luminescence_score' score={values.dial_hands_luminescence_score} />
                                                    </FormGroup>
                                                )}

                                                {!certificateTypeExcludedFormFields?.includes("dial_hands_luminescence_comment") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="dial_hands_luminescence_comment"
                                                            label="Commentaire - Luminescence aiguilles" />
                                                        <Input type='textarea'
                                                            id='dial_hands_luminescence_comment'
                                                            name='dial_hands_luminescence_comment'
                                                            error={errors.dial_hands_luminescence_comment} />
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

export default PartnerCertificationReportDialHandsModal