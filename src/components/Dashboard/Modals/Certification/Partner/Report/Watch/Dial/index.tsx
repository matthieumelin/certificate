import { Form, Formik } from 'formik'
import { type FC } from 'react'
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import type { CertificateType } from '@/types/certificate';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { choiceOptions, colors, gemstones } from '@/utils/report';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import FormSelect from '@/components/UI/Form/Select';
import FormRow from '@/components/UI/Form/Row';
import Input from '@/components/UI/Form/Input';
import Score from '@/components/UI/Form/Score';
import FileUpload from '@/components/UI/Form/FileUpload';

interface FormValues {
    dial_type: string;
    dial_material: string;
    dial_color: string;
    dial_texture: string;
    dial_finishing: string;
    dial_signature: string;
    dial_patina: string;
    dial_patina_score: number;
    dial_score: number;
    dial_serial_number: string;
    dial_reference: string;
    dial_surname: string;
    dial_factory: string;
    dial_change: string;
    dial_change_date: string;
    dial_custom: string;
    dial_custom_date: string;
    dial_setting: string;
    dial_setting_date: string;
    dial_setting_type: string;
    dial_setting_factory: string;
    dial_comment: string;
    dial_images: string[];
}

interface PartnerCertificationReportDialModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportDialModal: FC<PartnerCertificationReportDialModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const dialTypes = [
        "Plein",
        "Squelette",
        "Ouvert",
        "Semi-squelette",
        "Coeur ouvert",
        "Décentré",
        "Mystérieux",
        "Régulateur",
        "Sandwich",
        "Éclaté",
        "Transparent"
    ]
    const dialMaterials = [
        "Laiton",
        "Acier Inoxydable",
        "Titane",
        "Bronze",
        "Cuivre",
        "Argent",
        "Platine",
        "Palladium",
        "Niobium",
        "Or jaune 24K",
        "Or jaune 18K",
        "Or jaune 14K",
        "Or rose",
        "Or blanc",
        "Or gris",
        "PVD",
        "DLC",
        "Nacre",
        "Fibre de carbone",
        "Céramique",
        "Émail",
        "Saphir",
        "Verre minéral",
        "Onyx",
        "Lapiz Lazuli",
        "Oeil de Tigre",
        "Malachite",
        "Aventurine",
        "Jade",
        "Sodalite",
        "Turquoise",
        "Agate",
        "Quartz",
        "Corail",
        "Hématite",
        "Météorite",
        "Matériaux composites"
    ];
    const dialTextures = [
        "Mat",
        "Sablé / Grainé",
        "Brossé Circulaire",
        "Brossé Vertical",
        "Brossé Horizontal",
        "Guilloché - Clous de Paris",
        "Guilloché - Crain d'Orge",
        "Guilloché - Vague / Soleil",
        "Guilloché - Côtes de Genève",
        "Guilloché - Rayon de Soleil",
        "Tapisserie",
        "Strié / Rainuré",
        "Tissé",
        "Nacre / MOP",
        "Damier / Quadrillé"
    ]
    const dialFinishings = [
        "Laqué",
        "Émaillé",
        "Poli / Miroir",
        "Mat / Opaque",
        "Soleil",
        "Fumé / Dégradé",
        "Givré / Flocon de Neige",
        "Galvanique / Métalissé",
        "Vernis Clair",
        "Non traité"
    ]
    const dialPatinas = [
        "Aucune",
        "Uniforme",
        "Tropicale",
        "Craquelée",
        "Délavée / Fantôme",
        "Marbrée",
        "Tachetée",
        "Brûlée",
        "Noircie",
        "Décoloration",
        "Fissurée"
    ]

    const initialValues: FormValues = {
        dial_type: formData.dial_type || "",
        dial_material: formData.dial_material || "",
        dial_color: formData.dial_color || "",
        dial_texture: formData.dial_texture || "",
        dial_finishing: formData.dial_finishing || "",
        dial_signature: formData.dial_signature || "",
        dial_patina: formData.dial_patina || "",
        dial_patina_score: formData.dial_patina_score || 0,
        dial_score: formData.dial_score || 0,
        dial_serial_number: formData.dial_serial_number || "",
        dial_reference: formData.dial_reference || "",
        dial_surname: formData.dial_surname || "",
        dial_factory: formData.dial_factory || choiceOptions[0],
        dial_change: formData.dial_change || choiceOptions[1],
        dial_change_date: formData.dial_change_date || "",
        dial_custom: formData.dial_custom || choiceOptions[1],
        dial_custom_date: formData.dial_custom_date || "",
        dial_setting: formData.dial_setting || choiceOptions[1],
        dial_setting_date: formData.dial_setting_date || "",
        dial_setting_type: formData.dial_setting_type || "",
        dial_setting_factory: formData.dial_setting_factory || "",
        dial_comment: formData.dial_comment || "",
        dial_images: formData.dial_images || []
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("dial")) : [];

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Cadran</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                {!certificateTypeExcludedFormFields?.includes("dial_type") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="dial_type"
                                            label="Type de cadran"
                                            required />
                                        <FormSelect
                                            error={errors.dial_type}
                                            value={values.dial_type}
                                            onChange={value => setFieldValue('dial_type', value)}
                                            id='dial_type'
                                            options={dialTypes.map((type: string) => (
                                                {
                                                    label: type,
                                                    value: type
                                                }
                                            ))}
                                            searchable />
                                    </FormGroup>
                                )}

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("dial_material") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_material"
                                                label="Matériau du cadran" />
                                            <FormSelect
                                                error={errors.dial_material}
                                                value={values.dial_material}
                                                onChange={value => setFieldValue('dial_material', value)}
                                                id='dial_material'
                                                options={dialMaterials.map((material: string) => (
                                                    {
                                                        label: material,
                                                        value: material
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("dial_color") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_color"
                                                label="Couleur du cadran"
                                                required />
                                            <FormSelect
                                                error={errors.dial_color}
                                                value={values.dial_color}
                                                onChange={value => setFieldValue('dial_color', value)}
                                                id='dial_color'
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

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("dial_texture") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_texture"
                                                label="Texture du cadran" />
                                            <FormSelect
                                                error={errors.dial_texture}
                                                value={values.dial_texture}
                                                onChange={value => setFieldValue('dial_texture', value)}
                                                id='dial_texture'
                                                options={dialTextures.map((texture: string) => (
                                                    {
                                                        label: texture,
                                                        value: texture
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("dial_finishing") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="dial_finishing"
                                                label="Finition du cadran" />
                                            <FormSelect
                                                error={errors.dial_finishing}
                                                value={values.dial_finishing}
                                                onChange={value => setFieldValue('dial_finishing', value)}
                                                id='dial_finishing'
                                                options={dialFinishings.map((finishing: string) => (
                                                    {
                                                        label: finishing,
                                                        value: finishing
                                                    }
                                                ))}
                                                searchable />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                {!certificateTypeExcludedFormFields?.includes("dial_signature") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="dial_signature"
                                            label="Signature ou gravure" />
                                        <Input
                                            error={errors.dial_signature}
                                            id='dial_signature'
                                            name='dial_signature'
                                            type='text'
                                        />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("dial_patina") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="dial_patina"
                                            label="Patine du cadran" />
                                        <FormSelect
                                            error={errors.dial_patina}
                                            value={values.dial_patina}
                                            onChange={value => setFieldValue('dial_patina', value)}
                                            id='dial_patina'
                                            options={dialPatinas.map((patina: string) => (
                                                {
                                                    label: patina,
                                                    value: patina
                                                }
                                            ))}
                                            searchable />
                                    </FormGroup>
                                )}

                                {!certificateTypeExcludedFormFields?.includes("dial_patina_score") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="dial_patina_score"
                                            label="Indice de condition (score de la patine)"
                                            required />
                                        <Score fieldName='dial_patina_score' score={values.dial_patina_score} />
                                    </FormGroup>
                                )}

                                <div className='space-y-4 border-t border-white/10 py-8'>
                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("dial_serial_number") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="dial_serial_number"
                                                    label="Numéro de série du cadran" />
                                                <Input
                                                    error={errors.dial_serial_number}
                                                    id='dial_serial_number'
                                                    name='dial_serial_number'
                                                    type='text'
                                                />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("dial_reference") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="dial_reference"
                                                    label="Référence du cadran" />
                                                <Input
                                                    error={errors.dial_reference}
                                                    id='dial_reference'
                                                    name='dial_reference'
                                                    type='text'
                                                />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("dial_surname") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="dial_surname"
                                                    label="Surnom du cadran" />
                                                <Input
                                                    error={errors.dial_surname}
                                                    id='dial_surname'
                                                    name='dial_surname'
                                                    placeholder='Exemple : Long E'
                                                    type='text'
                                                />
                                            </FormGroup>
                                        )}
                                    </FormRow>

                                    <div className='grid grid-cols-2 gap-4'>
                                        {!certificateTypeExcludedFormFields?.includes("dial_factory") && (
                                            <FormGroup className='mt-4'>
                                                <Label
                                                    htmlFor="dial_factory"
                                                    label="Cadran d'origine"
                                                    required />
                                                <FormSelect
                                                    error={errors.dial_factory}
                                                    value={values.dial_factory}
                                                    onChange={value => setFieldValue('dial_factory', value)}
                                                    id='dial_factory'
                                                    options={choiceOptions.map((option: string) => (
                                                        {
                                                            label: option,
                                                            value: option
                                                        }
                                                    ))} />
                                            </FormGroup>
                                        )}

                                        <FormGroup>
                                            {values.dial_factory !== choiceOptions[0] && (
                                                <FormGroup className='mt-4'>
                                                    {!certificateTypeExcludedFormFields?.includes("dial_change") && (
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="dial_change"
                                                                label="Cadran remplacé" />
                                                            <FormSelect
                                                                error={errors.dial_change}
                                                                value={values.dial_change}
                                                                onChange={value => setFieldValue('dial_change', value)}
                                                                id='dial_change'
                                                                options={choiceOptions.map((option: string) => (
                                                                    {
                                                                        label: option,
                                                                        value: option
                                                                    }
                                                                ))} />
                                                        </FormGroup>
                                                    )}

                                                    {values.dial_change === choiceOptions[0] && (
                                                        <FormGroup>
                                                            {!certificateTypeExcludedFormFields?.includes("dial_change_date") && (
                                                                <FormGroup>
                                                                    <Label
                                                                        htmlFor="dial_change_date"
                                                                        label="Date de remplacement" />
                                                                    <Input
                                                                        error={errors.dial_change_date}
                                                                        id='dial_change_date'
                                                                        name='dial_change_date'
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
                                                {!certificateTypeExcludedFormFields?.includes("dial_custom") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="dial_custom"
                                                            label="Cadran modifié" />
                                                        <FormSelect
                                                            error={errors.dial_custom}
                                                            value={values.dial_custom}
                                                            onChange={value => setFieldValue('dial_custom', value)}
                                                            id='dial_custom'
                                                            options={choiceOptions.map((option: string) => (
                                                                {
                                                                    label: option,
                                                                    value: option
                                                                }
                                                            ))} />
                                                    </FormGroup>
                                                )}

                                                {(values.dial_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("dial_custom_date")) && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="dial_custom_date"
                                                            label="Date de modification" />
                                                        <Input
                                                            error={errors.dial_custom_date}
                                                            id='dial_custom_date'
                                                            name='dial_custom_date'
                                                            placeholder={new Date().toLocaleDateString()}
                                                            type='text'
                                                        />
                                                    </FormGroup>
                                                )}
                                            </FormGroup>
                                        </FormGroup>
                                    </div>

                                    <div className='space-y-4 border-t border-white/10 pt-8'>
                                        {!certificateTypeExcludedFormFields?.includes("dial_setting") && (
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div>
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="dial_setting"
                                                            label="Sertissage"
                                                            required />
                                                        <FormSelect
                                                            error={errors.dial_setting}
                                                            value={values.dial_setting}
                                                            onChange={value => setFieldValue('dial_setting', value)}
                                                            id='dial_setting'
                                                            options={choiceOptions.map((option: string) => (
                                                                {
                                                                    label: option,
                                                                    value: option
                                                                }
                                                            ))} />
                                                    </FormGroup>

                                                    {values.dial_setting === choiceOptions[0] && (
                                                        <FormGroup className='mt-4'>
                                                            <Label
                                                                htmlFor="dial_setting_type"
                                                                label="Type de sertissage"
                                                                required />
                                                            <FormSelect
                                                                error={errors.dial_setting_type}
                                                                value={values.dial_setting_type}
                                                                onChange={value => setFieldValue('dial_setting_type', value)}
                                                                id='dial_setting_type'
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
                                                {values.dial_setting === choiceOptions[0] && (
                                                    <div>
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="dial_setting_factory"
                                                                label="Sertissage d'origine" />
                                                            <FormSelect
                                                                error={errors.dial_setting_factory}
                                                                value={values.dial_setting_factory}
                                                                onChange={value => setFieldValue('dial_setting_factory', value)}
                                                                id='dial_setting_factory'
                                                                options={choiceOptions.map((choiceOption: string) => (
                                                                    {
                                                                        label: choiceOption,
                                                                        value: choiceOption
                                                                    }
                                                                ))} />
                                                        </FormGroup>
                                                        <FormGroup className='mt-4'>
                                                            <Label
                                                                htmlFor="dial_setting_date"
                                                                label="Date de sertissage" />
                                                            <Input
                                                                error={errors.dial_setting_date}
                                                                id='dial_setting_date'
                                                                name='dial_setting_date'
                                                                placeholder={new Date().toLocaleDateString()}
                                                                type='text'
                                                            />
                                                        </FormGroup>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("dial_score") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="dial_score"
                                                    label="Indice de condition (score du cadran)"
                                                    required />
                                                <Score fieldName='dial_score' score={values.dial_score} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("dial_comment") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="dial_comment"
                                                    label="Commentaire - Cadran" />
                                                <Input type='textarea'
                                                    id='dial_comment'
                                                    name='dial_comment'
                                                    error={errors.dial_comment} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("dial_images") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="dial_images"
                                                    label="Photos du cadran"
                                                    required />

                                                <FileUpload
                                                    bucketName="object_attributes"
                                                    uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                    value={values.dial_images}
                                                    onChange={(paths) => setFieldValue('dial_images', paths)}
                                                    acceptedFileTypes={[".jpg", ".png"]}
                                                />
                                            </FormGroup>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default PartnerCertificationReportDialModal