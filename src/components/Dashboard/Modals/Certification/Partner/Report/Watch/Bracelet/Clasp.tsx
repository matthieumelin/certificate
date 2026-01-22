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
    bracelet_clasp_type: string;
    bracelet_clasp_material: string;
    bracelet_clasp_surface_plated: string;
    bracelet_clasp_hallmark: string;
    bracelet_clasp_signature: string;
    bracelet_clasp_serial_number: string;
    bracelet_clasp_reference: string;
    bracelet_clasp_factory: string;
    bracelet_clasp_change: string;
    bracelet_clasp_change_date: string;
    bracelet_clasp_custom: string;
    bracelet_clasp_custom_date: string;
    bracelet_clasp_setting: string;
    bracelet_clasp_setting_type: string;
    bracelet_clasp_setting_factory: string;
    bracelet_clasp_setting_date: string;
    bracelet_clasp_score: number;
    bracelet_clasp_comment: string;
    bracelet_clasp_images: string[];
}

interface PartnerCertificationReportBraceletClaspModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportBraceletClaspModal: FC<PartnerCertificationReportBraceletClaspModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const braceletClaspTypes = [
        "Aucun",
        "Boucle ardillon",
        "Boucle déployante simple",
        "Boucle déployante double",
        "Boucle déployante à poussoirs",
        "Boucle déployante à sécurisée (Flip lock)",
        "Fermoir à cliquet / Invisible",
        "Fermoir crochet (Jewelry clasp)",
        "Fermoir de rallonge de plongée",
        "Fermoir papillon (Butterfly clasp)",

    ];
    const braceletClaspMaterials = [
        "Or jaune 18K",
        "Or jaune 14K",
        "Or jaune 24K",
        "Or rose",
        "Or blanc",
        "Or gris",
        "Platine",
        "Titane",
        "Argent",
        "Bronze",
        "Aluminium",
        "Cuir",
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
        "Bois"
    ]

    const initialValues: FormValues = {
        bracelet_clasp_type: formData.bracelet_clasp_type || "",
        bracelet_clasp_material: formData.bracelet_clasp_material || braceletClaspMaterials[0],
        bracelet_clasp_surface_plated: formData.bracelet_clasp_surface_plated || treatments[0],
        bracelet_clasp_hallmark: formData.bracelet_clasp_hallmark || hallmarks[0],
        bracelet_clasp_factory: formData.bracelet_clasp_factory || choiceOptions[0],
        bracelet_clasp_setting: formData.bracelet_clasp_setting || choiceOptions[1],
        bracelet_clasp_setting_type: formData.bracelet_clasp_setting_type || "",
        bracelet_clasp_setting_factory: formData.bracelet_clasp_setting_factory || choiceOptions[1],
        bracelet_clasp_change: formData.bracelet_clasp_change || choiceOptions[0],
        bracelet_clasp_change_date: formData.bracelet_clasp_change_date || "",
        bracelet_clasp_custom: formData.bracelet_clasp_custom || choiceOptions[1],
        bracelet_clasp_custom_date: formData.bracelet_clasp_custom_date || "",
        bracelet_clasp_signature: formData.bracelet_clasp_signature || "",
        bracelet_clasp_serial_number: formData.bracelet_clasp_serial_number || "",
        bracelet_clasp_reference: formData.bracelet_clasp_reference || "",
        bracelet_clasp_setting_date: formData.bracelet_clasp_setting_date || "",
        bracelet_clasp_score: formData.bracelet_clasp_score || 0,
        bracelet_clasp_comment: formData.bracelet_clasp_comment || "",
        bracelet_clasp_images: formData.bracelet_clasp_images || [],
    }

    const formikRef = useRef<any>(null);

    useEffect(() => {
        if (formikRef.current) {
            const values = formikRef.current.values;
            if (values.bracelet_clasp_type.includes(braceletClaspTypes[0])) {
                formikRef.current.setFieldValue("bracelet_clasp_score", 0);
            }
        }
    }, [formikRef.current?.values?.bracelet_clasp_type]);

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("bracelet_clasp")) : []

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Fermoir</h2>
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
                                        {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_type") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="bracelet_clasp_type"
                                                    label="Type de fermoir"
                                                    required />
                                                <FormSelect
                                                    error={errors.bracelet_clasp_type}
                                                    value={values.bracelet_clasp_type}
                                                    onChange={value => setFieldValue('bracelet_clasp_type', value)}
                                                    id='bracelet_clasp_type'
                                                    options={braceletClaspTypes.map((type: string) => (
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
                                {values.bracelet_clasp_type !== braceletClaspTypes[0] && (
                                    <div className='space-y-4 border-t border-white/10 py-8'>
                                        {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_material") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="bracelet_clasp_material"
                                                    label="Matériau du fermoir"
                                                    required />
                                                <FormSelect
                                                    error={errors.bracelet_clasp_material}
                                                    value={values.bracelet_clasp_material}
                                                    onChange={value => setFieldValue('bracelet_clasp_material', value)}
                                                    id='bracelet_clasp_material'
                                                    options={braceletClaspMaterials.map((material: string) => (
                                                        {
                                                            label: material,
                                                            value: material
                                                        }
                                                    ))}
                                                    multiple />
                                            </FormGroup>
                                        )}

                                        <FormRow>
                                            {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_surface_plated") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="bracelet_clasp_surface_plated"
                                                        label="Placage et traitement de surface" />
                                                    <FormSelect
                                                        error={errors.bracelet_clasp_surface_plated}
                                                        value={values.bracelet_clasp_surface_plated}
                                                        onChange={value => setFieldValue('bracelet_clasp_surface_plated', value)}
                                                        id='bracelet_clasp_surface_plated'
                                                        options={treatments.map((treatment: string) => (
                                                            {
                                                                label: treatment,
                                                                value: treatment
                                                            }
                                                        ))} />
                                                </FormGroup>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_hallmark") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="bracelet_clasp_hallmark"
                                                        label="Poinçon" />
                                                    <FormSelect
                                                        error={errors.bracelet_clasp_hallmark}
                                                        value={values.bracelet_clasp_hallmark}
                                                        onChange={value => setFieldValue('bracelet_clasp_hallmark', value)}
                                                        id='bracelet_clasp_hallmark'
                                                        options={hallmarks.map((hallmark: string) => (
                                                            {
                                                                label: hallmark,
                                                                value: hallmark
                                                            }
                                                        ))} />
                                                </FormGroup>
                                            )}

                                        </FormRow>

                                        {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_signature") && (
                                            <FormGroup>
                                                <Label
                                                    htmlFor="bracelet_clasp_signature"
                                                    label="Signature ou gravure" />
                                                <Input
                                                    error={errors.bracelet_clasp_signature}
                                                    id='bracelet_clasp_signature'
                                                    name='bracelet_clasp_signature'
                                                    type='text'
                                                />
                                            </FormGroup>
                                        )}

                                        <div className='space-y-4 border-t border-white/10 py-8'>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div>
                                                    {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_serial_number") && (
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="bracelet_clasp_serial_number"
                                                                label="Numéro de série du fermoir" />
                                                            <Input
                                                                error={errors.bracelet_clasp_serial_number}
                                                                id='bracelet_clasp_serial_number'
                                                                name='bracelet_clasp_serial_number'
                                                                type='text'
                                                            />
                                                        </FormGroup>
                                                    )}

                                                    {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_factory") && (
                                                        <FormGroup className='mt-4'>
                                                            <Label
                                                                htmlFor="bracelet_clasp_factory"
                                                                label="Fermoir d'origine"
                                                                required />
                                                            <FormSelect
                                                                error={errors.bracelet_clasp_factory}
                                                                value={values.bracelet_clasp_factory}
                                                                onChange={value => setFieldValue('bracelet_clasp_factory', value)}
                                                                id='bracelet_clasp_factory'
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
                                                    {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_reference") && (
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="bracelet_clasp_reference"
                                                                label="Référence du bracelet" />
                                                            <Input
                                                                error={errors.bracelet_clasp_reference}
                                                                id='bracelet_clasp_reference'
                                                                name='bracelet_clasp_reference'
                                                                type='text'
                                                            />
                                                        </FormGroup>
                                                    )}

                                                    {values.bracelet_clasp_factory !== choiceOptions[0] && (
                                                        <FormGroup className='mt-4'>
                                                            {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_change") && (
                                                                <FormGroup>
                                                                    <Label
                                                                        htmlFor="bracelet_clasp_change"
                                                                        label="Fermoir remplacé" />
                                                                    <FormSelect
                                                                        error={errors.bracelet_clasp_change}
                                                                        value={values.bracelet_clasp_change}
                                                                        onChange={value => setFieldValue('bracelet_clasp_change', value)}
                                                                        id='bracelet_clasp_change'
                                                                        options={choiceOptions.map((option: string) => (
                                                                            {
                                                                                label: option,
                                                                                value: option
                                                                            }
                                                                        ))} />
                                                                </FormGroup>
                                                            )}

                                                            <FormGroup>
                                                                {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_change_date") && (
                                                                    <FormGroup>
                                                                        <Label
                                                                            htmlFor="bracelet_clasp_change_date"
                                                                            label="Date de remplacement" />
                                                                        <Input
                                                                            error={errors.bracelet_clasp_change_date}
                                                                            id='bracelet_clasp_change_date'
                                                                            name='bracelet_clasp_change_date'
                                                                            placeholder={new Date().toLocaleDateString()}
                                                                            type='text'
                                                                        />
                                                                    </FormGroup>
                                                                )}
                                                            </FormGroup>
                                                        </FormGroup>
                                                    )}
                                                    <FormGroup className='mt-4'>
                                                        {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_custom") && (
                                                            <FormGroup>
                                                                <Label
                                                                    htmlFor="bracelet_clasp_custom"
                                                                    label="Fermoir modifié" />
                                                                <FormSelect
                                                                    error={errors.bracelet_clasp_custom}
                                                                    value={values.bracelet_clasp_custom}
                                                                    onChange={value => setFieldValue('bracelet_clasp_custom', value)}
                                                                    id='bracelet_clasp_custom'
                                                                    options={choiceOptions.map((option: string) => (
                                                                        {
                                                                            label: option,
                                                                            value: option
                                                                        }
                                                                    ))} />
                                                            </FormGroup>
                                                        )}
                                                        {(values.bracelet_clasp_custom === choiceOptions[0] && !certificateTypeExcludedFormFields?.includes("bracelet_clasp_custom_date"))
                                                            && (
                                                                <FormGroup>
                                                                    <Label
                                                                        htmlFor="bracelet_clasp_custom_date"
                                                                        label="Date de modification" />
                                                                    <Input
                                                                        error={errors.bracelet_clasp_custom_date}
                                                                        id='bracelet_clasp_custom_date'
                                                                        name='bracelet_clasp_custom_date'
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
                                            {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_setting") && (
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <div>
                                                        <FormGroup>
                                                            <Label
                                                                htmlFor="bracelet_clasp_setting"
                                                                label="Sertissage"
                                                                required />
                                                            <FormSelect
                                                                error={errors.bracelet_clasp_setting}
                                                                value={values.bracelet_clasp_setting}
                                                                onChange={value => setFieldValue('bracelet_clasp_setting', value)}
                                                                id='bracelet_clasp_setting'
                                                                options={choiceOptions.map((option: string) => (
                                                                    {
                                                                        label: option,
                                                                        value: option
                                                                    }
                                                                ))} />
                                                        </FormGroup>
                                                        {values.bracelet_clasp_setting === choiceOptions[0] && (
                                                            <FormGroup className='mt-4'>
                                                                <Label
                                                                    htmlFor="bracelet_clasp_setting_type"
                                                                    label="Type de sertissage"
                                                                    required />
                                                                <FormSelect
                                                                    error={errors.bracelet_clasp_setting_type}
                                                                    value={values.bracelet_clasp_setting_type}
                                                                    onChange={value => setFieldValue('bracelet_clasp_setting_type', value)}
                                                                    id='bracelet_clasp_setting_type'
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
                                                    {values.bracelet_clasp_setting === choiceOptions[0] && (
                                                        <div>
                                                            <FormGroup>
                                                                <Label
                                                                    htmlFor="bracelet_clasp_setting_factory"
                                                                    label="Sertissage d'origine" />
                                                                <FormSelect
                                                                    error={errors.bracelet_clasp_setting_factory}
                                                                    value={values.bracelet_clasp_setting_factory}
                                                                    onChange={value => setFieldValue('bracelet_clasp_setting_factory', value)}
                                                                    id='bracelet_clasp_setting_factory'
                                                                    options={choiceOptions.map((choiceOption: string) => (
                                                                        {
                                                                            label: choiceOption,
                                                                            value: choiceOption
                                                                        }
                                                                    ))} />
                                                            </FormGroup>
                                                            <FormGroup className='mt-4'>
                                                                <Label
                                                                    htmlFor="bracelet_clasp_setting_date"
                                                                    label="Date de sertissage" />
                                                                <Input
                                                                    error={errors.bracelet_clasp_setting_date}
                                                                    id='bracelet_clasp_setting_date'
                                                                    name='bracelet_clasp_setting_date'
                                                                    placeholder={new Date().toLocaleDateString()}
                                                                    type='text'
                                                                />
                                                            </FormGroup>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_score") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="bracelet_clasp_score"
                                                        label="Score du fermoir"
                                                        required />
                                                    <Score fieldName='bracelet_clasp_score' score={values.bracelet_clasp_score} />
                                                </FormGroup>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_comment") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="bracelet_clasp_comment"
                                                        label="Commentaire - Fermoir" />
                                                    <Input type='textarea'
                                                        id='bracelet_clasp_comment'
                                                        name='bracelet_clasp_comment'
                                                        error={errors.bracelet_clasp_comment} />
                                                </FormGroup>
                                            )}

                                            {!certificateTypeExcludedFormFields?.includes("bracelet_clasp_images") && (
                                                <FormGroup>
                                                    <Label
                                                        htmlFor="bracelet_clasp_images"
                                                        label="Photos du fermoir"
                                                        required />
                                                    <FileUpload
                                                        bucketName="object_attributes"
                                                        uploadPath={`objects/${selectedCertificate?.object_id}`}
                                                        value={values.bracelet_clasp_images}
                                                        onChange={(paths) => setFieldValue('bracelet_clasp_images', paths)}
                                                        acceptedFileTypes={[".jpg", ".png"]}
                                                    />
                                                </FormGroup>
                                            )}
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

export default PartnerCertificationReportBraceletClaspModal