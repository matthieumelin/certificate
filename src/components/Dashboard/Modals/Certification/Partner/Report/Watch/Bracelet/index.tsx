import { Form, Formik } from 'formik'
import { useEffect, type FC, useRef } from 'react'
import { useCertificateReportStore } from '@/stores/certificateReportStore'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import { choiceOptions, hallmarks, gemstones, treatments } from '@/utils/report'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import FormSelect from '@/components/UI/Form/Select'
import FormRow from '@/components/UI/Form/Row'
import Input from '@/components/UI/Form/Input'
import Score from '@/components/UI/Form/Score'
import FileUpload from '@/components/UI/Form/FileUpload'

interface FormValues {
    bracelet_type: string;
    bracelet_diameter: {
        length: string;
        width: string;
        thickness: string;
    },
    bracelet_material: string;
    bracelet_surface_plated: string;
    bracelet_hallmark: string;
    bracelet_signature: string;
    bracelet_serial_number: string;
    bracelet_reference: string;
    bracelet_factory: string;
    bracelet_change: string;
    bracelet_change_date: string;
    bracelet_custom: string;
    bracelet_custom_date: string;
    bracelet_setting: string;
    bracelet_setting_type: string;
    bracelet_setting_factory: string;
    bracelet_setting_date: string;
    bracelet_score: number;
    bracelet_comment: string;
    bracelet_images: string[];
}

interface PartnerCertificationReportBraceletModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportBraceletModal: FC<PartnerCertificationReportBraceletModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const braceletTypes = [
        "Aucun",
        "Jubilee",
        "Oyster",
        "President",
        "Milanese",
        "Beads of Rice",
        "Engineer",
        "H-Link",
        "Brice / Ladder",
        "Shark Mesh",
        "Stretch / Flex",
        "NATO",
        "Zulu",
        "Bung",
        "Tissu / Canvas"
    ];
    const braceletMaterials = [
        "Acier",
        "Or jaune 24K",
        "Or jaune 18K",
        "Or jaune 14K",
        "Or rose",
        "Or blanc",
        "Or gris",
        "Platine",
        "Titane",
        "Argent",
        "Bronze",
        "Aluminium",
        "Cuir",
        "Cuir synthétique",
        "Alligator / Crocodile",
        "Autruche",
        "Lézard",
        "Requin",
        "Galuchat",
        "Caoutchouc",
        "Silicone",
        "Nylon",
        "Tissu / Toile",
        "Perlon",
        "Fibre de carbone",
        "Céramique",
        "Bois",
        "Os",
        "Ivoire"
    ]

    const initialValues: FormValues = {
        bracelet_type: formData.bracelet_type || "",
        bracelet_diameter: {
            length: formData.bracelet_diameter.length || "",
            width: formData.bracelet_diameter.width || "",
            thickness: formData.bracelet_diameter.thickness || ""
        },
        bracelet_material: formData.bracelet_material || braceletMaterials[0],
        bracelet_surface_plated: formData.bracelet_surface_plated || treatments[0],
        bracelet_hallmark: formData.bracelet_hallmark || hallmarks[0],
        bracelet_factory: formData.bracelet_factory || choiceOptions[0],
        bracelet_setting: formData.bracelet_setting || choiceOptions[1],
        bracelet_setting_type: formData.bracelet_setting_type || "",
        bracelet_setting_factory: formData.bracelet_setting_factory || choiceOptions[1],
        bracelet_change: formData.bracelet_change || choiceOptions[0],
        bracelet_custom: formData.bracelet_custom || choiceOptions[1],
        bracelet_change_date: formData.bracelet_change_date || "",
        bracelet_signature: formData.bracelet_signature || "",
        bracelet_serial_number: formData.bracelet_serial_number || "",
        bracelet_reference: formData.bracelet_reference || "",
        bracelet_custom_date: formData.bracelet_custom_date || "",
        bracelet_setting_date: formData.bracelet_setting_date || "",
        bracelet_score: formData.bracelet_score || 0,
        bracelet_comment: formData.bracelet_comment || "",
        bracelet_images: formData.bracelet_images || [],
    }

    const formikRef = useRef<any>(null);

    useEffect(() => {
        if (formikRef.current) {
            const values = formikRef.current.values;
            if (values.bracelet_type.includes(braceletTypes[0])) {
                formikRef.current.setFieldValue("bracelet_score", 0);
            }
        }
    }, [formikRef.current?.values?.bracelet_type]);

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("bracelet")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Bracelet</h2>
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                <div className='space-y-4'>
                                    <div className='space-y-4'>
                                        {!certificateTypeExcludedFormFields?.includes("bracelet_type") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="bracelet_type"
                                                    label="Type de bracelet"
                                                    required />
                                                <FormSelect
                                                    error={errors.bracelet_type}
                                                    value={values.bracelet_type}
                                                    onChange={value => setFieldValue('bracelet_type', value)}
                                                    id='bracelet_type'
                                                    options={braceletTypes.map((type: string) => (
                                                        {
                                                            label: type,
                                                            value: type
                                                        }
                                                    ))}
                                                    searchable />
                                            </FormGroup>
                                        )}
                                    </div>
                                </div>
                                {values.bracelet_type !== braceletTypes[0] && (
                                    <div className='space-y-4 border-t border-white/10 py-8'>
                                        <h2 className="text-white text-lg font-semibold">Dimensions du bracelet</h2>
                                        <div className='space-y-4 mt-8'>
                                            {!certificateTypeExcludedFormFields?.includes("bracelet_diameter") && (
                                                <>
                                                    <FormRow>
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="bracelet_diameter.length"
                                                                label="Longueur" />
                                                            <Input
                                                                error={errors.bracelet_diameter?.length}
                                                                id='bracelet_diameter.length'
                                                                name='bracelet_diameter.length'
                                                                placeholder='mm'
                                                                type='text'
                                                            />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="bracelet_diameter.width"
                                                                label="Largeur" />
                                                            <Input
                                                                error={errors.bracelet_diameter?.width}
                                                                id='bracelet_diameter.width'
                                                                name='bracelet_diameter.width'
                                                                placeholder='mm'
                                                                type='text'
                                                            />
                                                        </FormGroup>
                                                    </FormRow>
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="bracelet_diameter.thickness"
                                                            label="Épaisseur"
                                                            required />
                                                        <Input
                                                            error={errors.bracelet_diameter?.thickness}
                                                            id='bracelet_diameter.thickness'
                                                            name='bracelet_diameter.thickness'
                                                            placeholder='mm'
                                                            type='text'
                                                        />
                                                    </FormGroup>
                                                </>
                                            )}
                                            <div className='space-y-4 border-t border-white/10 py-8'>
                                                {!certificateTypeExcludedFormFields?.includes("bracelet_material") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="bracelet_material"
                                                            label="Matériau du bracelet"
                                                            required />
                                                        <FormSelect
                                                            error={errors.bracelet_material}
                                                            value={values.bracelet_material}
                                                            onChange={value => setFieldValue('bracelet_material', value)}
                                                            id='bracelet_material'
                                                            options={braceletMaterials.map((material: string) => (
                                                                {
                                                                    label: material,
                                                                    value: material
                                                                }
                                                            ))}
                                                            multiple />
                                                    </FormGroup>
                                                )}

                                                <FormRow>
                                                    {!certificateTypeExcludedFormFields?.includes("bracelet_surface_plated") && (
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="bracelet_surface_plated"
                                                                label="Placage et traitement de surface" />
                                                            <FormSelect
                                                                error={errors.bracelet_surface_plated}
                                                                value={values.bracelet_surface_plated}
                                                                onChange={value => setFieldValue('bracelet_surface_plated', value)}
                                                                id='bracelet_surface_plated'
                                                                options={treatments.map((treatment: string) => (
                                                                    {
                                                                        label: treatment,
                                                                        value: treatment
                                                                    }
                                                                ))} />
                                                        </FormGroup>
                                                    )}

                                                    {!certificateTypeExcludedFormFields?.includes("bracelet_hallmark") && (
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="bracelet_hallmark"
                                                                label="Poinçon" />
                                                            <FormSelect
                                                                error={errors.bracelet_hallmark}
                                                                value={values.bracelet_hallmark}
                                                                onChange={value => setFieldValue('bracelet_hallmark', value)}
                                                                id='bracelet_hallmark'
                                                                options={hallmarks.map((hallmark: string) => (
                                                                    {
                                                                        label: hallmark,
                                                                        value: hallmark
                                                                    }
                                                                ))} />
                                                        </FormGroup>
                                                    )}
                                                </FormRow>

                                                {!certificateTypeExcludedFormFields?.includes("bracelet_signature") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="bracelet_signature"
                                                            label="Signature ou gravure" />
                                                        <Input
                                                            error={errors.bracelet_signature}
                                                            id='bracelet_signature'
                                                            name='bracelet_signature'
                                                            type='text'
                                                        />
                                                    </FormGroup>
                                                )}
                                            </div>
                                            <div className='space-y-4 border-t border-white/10 py-8'>
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <div>
                                                        {!certificateTypeExcludedFormFields?.includes("bracelet_serial_number") && (
                                                            <FormGroup>
                                                                <Label
                                                                    htmlFor="bracelet_serial_number"
                                                                    label="Numéro de série du bracelet" />
                                                                <Input
                                                                    error={errors.bracelet_serial_number}
                                                                    id='bracelet_serial_number'
                                                                    name='bracelet_serial_number'
                                                                    type='text'
                                                                />
                                                            </FormGroup>
                                                        )}

                                                        {!certificateTypeExcludedFormFields?.includes("bracelet_factory") && (
                                                            <FormGroup className='mt-4'>
                                                                <Label
                                                                    htmlFor="bracelet_factory"
                                                                    label="Bracelet d'origine"
                                                                    required />
                                                                <FormSelect
                                                                    error={errors.bracelet_factory}
                                                                    value={values.bracelet_factory}
                                                                    onChange={value => setFieldValue('bracelet_factory', value)}
                                                                    id='bracelet_factory'
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
                                                        {!certificateTypeExcludedFormFields?.includes("bracelet_reference") && (
                                                            <FormGroup>
                                                                <Label
                                                                    htmlFor="bracelet_reference"
                                                                    label="Référence du bracelet" />
                                                                <Input
                                                                    error={errors.bracelet_reference}
                                                                    id='bracelet_reference'
                                                                    name='bracelet_reference'
                                                                    type='text'
                                                                />
                                                            </FormGroup>
                                                        )}

                                                        {values.bracelet_factory !== choiceOptions[0] && (
                                                            <FormGroup className='mt-4'>
                                                                {!certificateTypeExcludedFormFields?.includes("bracelet_change") && (
                                                                    <FormGroup>
                                                                        <Label
                                                                            htmlFor="bracelet_change"
                                                                            label="Bracelet remplacé" />
                                                                        <FormSelect
                                                                            error={errors.bracelet_change}
                                                                            value={values.bracelet_change}
                                                                            onChange={value => setFieldValue('bracelet_change', value)}
                                                                            id='bracelet_change'
                                                                            options={choiceOptions.map((option: string) => (
                                                                                {
                                                                                    label: option,
                                                                                    value: option
                                                                                }
                                                                            ))} />
                                                                    </FormGroup>
                                                                )}

                                                                {values.bracelet_change === choiceOptions[0] && (
                                                                    <FormGroup>
                                                                        {!certificateTypeExcludedFormFields?.includes("bracelet_change") && (
                                                                            <FormGroup>
                                                                                <Label
                                                                                    htmlFor="bracelet_change_date"
                                                                                    label="Date de remplacement" />
                                                                                <Input
                                                                                    error={errors.bracelet_change_date}
                                                                                    id='bracelet_change_date'
                                                                                    name='bracelet_change_date'
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
                                                            {!certificateTypeExcludedFormFields?.includes("bracelet_custom") && (
                                                                <FormGroup>
                                                                    <Label
                                                                        htmlFor="bracelet_custom"
                                                                        label="Bracelet modifié" />
                                                                    <FormSelect
                                                                        error={errors.bracelet_custom}
                                                                        value={values.bracelet_custom}
                                                                        onChange={value => setFieldValue('bracelet_custom', value)}
                                                                        id='bracelet_custom'
                                                                        options={choiceOptions.map((option: string) => (
                                                                            {
                                                                                label: option,
                                                                                value: option
                                                                            }
                                                                        ))} />
                                                                </FormGroup>
                                                            )}

                                                            {(values.bracelet_custom === choiceOptions[0] &&
                                                                !certificateTypeExcludedFormFields?.includes("bracelet_custom_date")) && (
                                                                    <FormGroup>
                                                                        <Label
                                                                            htmlFor="bracelet_custom_date"
                                                                            label="Date de modification" />
                                                                        <Input
                                                                            error={errors.bracelet_custom_date}
                                                                            id='bracelet_custom_date'
                                                                            name='bracelet_custom_date'
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
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <div>
                                                        {!certificateTypeExcludedFormFields?.includes("bracelet_setting") && (
                                                            <FormGroup>
                                                                <Label
                                                                    htmlFor="bracelet_setting"
                                                                    label="Sertissage"
                                                                    required />
                                                                <FormSelect
                                                                    error={errors.bracelet_setting}
                                                                    value={values.bracelet_setting}
                                                                    onChange={value => setFieldValue('bracelet_setting', value)}
                                                                    id='bracelet_setting'
                                                                    options={choiceOptions.map((option: string) => (
                                                                        {
                                                                            label: option,
                                                                            value: option
                                                                        }
                                                                    ))} />
                                                            </FormGroup>
                                                        )}
                                                        {(values.bracelet_setting === choiceOptions[0] &&
                                                            !certificateTypeExcludedFormFields?.includes("bracelet_setting_type")) && (
                                                                <FormGroup className='mt-4'>
                                                                    <Label
                                                                        htmlFor="bracelet_setting_type"
                                                                        label="Type de sertissage"
                                                                        required />
                                                                    <FormSelect
                                                                        error={errors.bracelet_setting_type}
                                                                        value={values.bracelet_setting_type}
                                                                        onChange={value => setFieldValue('bracelet_setting_type', value)}
                                                                        id='bracelet_setting_type'
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
                                                    {values.bracelet_setting === choiceOptions[0] && (
                                                        <div>
                                                            {!certificateTypeExcludedFormFields?.includes("bracelet_setting_factory") && (
                                                                <FormGroup>
                                                                    <Label
                                                                        htmlFor="bracelet_setting_factory"
                                                                        label="Sertissage d'origine" />
                                                                    <FormSelect
                                                                        error={errors.bracelet_setting_factory}
                                                                        value={values.bracelet_setting_factory}
                                                                        onChange={value => setFieldValue('bracelet_setting_factory', value)}
                                                                        id='bracelet_setting_factory'
                                                                        options={choiceOptions.map((choiceOption: string) => (
                                                                            {
                                                                                label: choiceOption,
                                                                                value: choiceOption
                                                                            }
                                                                        ))} />
                                                                </FormGroup>
                                                            )}

                                                            {!certificateTypeExcludedFormFields?.includes("bracelet_setting_date") && (
                                                                <FormGroup className='mt-4'>
                                                                    <Label
                                                                        htmlFor="bracelet_setting_date"
                                                                        label="Date de sertissage" />
                                                                    <Input
                                                                        error={errors.bracelet_setting_date}
                                                                        id='bracelet_setting_date'
                                                                        name='bracelet_setting_date'
                                                                        placeholder={new Date().toLocaleDateString()}
                                                                        type='text'
                                                                    />
                                                                </FormGroup>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {!certificateTypeExcludedFormFields?.includes("bracelet_score") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="bracelet_score"
                                                            label="Score du bracelet"
                                                            required />
                                                        <Score fieldName='bracelet_score' score={values.bracelet_score} />
                                                    </FormGroup>
                                                )}

                                                {!certificateTypeExcludedFormFields?.includes("bracelet_comment") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="bracelet_comment"
                                                            label="Commentaire - Bracelet" />
                                                        <Input type='textarea'
                                                            id='bracelet_comment'
                                                            name='bracelet_comment'
                                                            error={errors.bracelet_comment} />
                                                    </FormGroup>
                                                )}

                                                {!certificateTypeExcludedFormFields?.includes("bracelet_images") && (
                                                    <FormGroup>
                                                        <Label
                                                            htmlFor="bracelet_images"
                                                            label="Photos du bracelet"
                                                            required />

                                                        <FileUpload
                                                            bucketName="object_attributes"
                                                            uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                            value={values.bracelet_images}
                                                            onChange={(paths) => setFieldValue('bracelet_images', paths)}
                                                            acceptedFileTypes={[".jpg", ".png"]}
                                                        />
                                                    </FormGroup>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default PartnerCertificationReportBraceletModal