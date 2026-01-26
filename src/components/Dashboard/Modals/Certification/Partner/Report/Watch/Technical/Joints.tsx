import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import FormRow from '@/components/UI/Form/Row';
import Score from '@/components/UI/Form/Score';
import Select from '@/components/UI/Form/Select';
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm';
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore';
import { useCertificateReportStore } from '@/stores/certificateReportStore';
import type { CertificateType } from '@/types/certificate';
import { Form, Formik } from 'formik'
import { type FC } from 'react'

interface FormValues {
    technical_joint_presents: string;
    technical_joint_types: string;
    technical_joint_materials: string;
    technical_joint_states: string;
    technical_joint_flexibility: string;
    technical_joint_score: number;
}

interface PartnerCertificationReportTechnicalJointsModalProps {
    certificateTypes: CertificateType[];
}

const PartnerCertificationReportTechnicalJointsModal: FC<PartnerCertificationReportTechnicalJointsModalProps> = ({ certificateTypes }) => {
    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const jointPresents = [
        "Tous présents",
        "Partiellement présents",
        "Manquants",
        "D'origine",
        "Non d'origine"
    ]
    const jointTypes = [
        "Torique",
        "Plat",
    ]
    const jointMaterials = [
        "Caoutchouc",
        "Viton",
        "Silicone",
        "Téflon",
        "Plastique"
    ]
    const jointStates = [
        "Intactes",
        "Fissurés",
        "Contamintés",
        "Écrasés",
        "Secs"
    ]
    const jointFlexibility = [
        "Très Souple",
        "Souple",
        "Légèrement Ferme",
        "Ferme",
        "Sec",
        "Dégradé",
        "N/A"
    ]

    const initialValues: FormValues = {
        technical_joint_presents: formData.technical_joint_presents || "",
        technical_joint_types: formData.technical_joint_types || "",
        technical_joint_materials: formData.technical_joint_materials || "",
        technical_joint_states: formData.technical_joint_states || "",
        technical_joint_flexibility: formData.technical_joint_flexibility || "",
        technical_joint_score: formData.technical_joint_score || 0
    }

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("technical_joint")) : [];

    return (
        <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold">Joints</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);
                    return (
                        <Form>
                            <div className='space-y-4'>
                                {!certificateTypeExcludedFormFields?.includes("technical_joint_presents") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="technical_joint_presents"
                                            label="Joints présents"
                                            required />
                                        <Select
                                            multiple
                                            error={errors.technical_joint_presents}
                                            value={values.technical_joint_presents}
                                            onChange={value => setFieldValue('technical_joint_presents', value)}
                                            id='technical_joint_presents'
                                            options={jointPresents
                                                .map((present: string) => (
                                                    { label: present, value: present }
                                                ))} />
                                    </FormGroup>
                                )}

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("technical_joint_types") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="technical_joint_types"
                                                label="Type de joints" />
                                            <Select
                                                error={errors.technical_joint_types}
                                                value={values.technical_joint_types}
                                                onChange={value => setFieldValue('technical_joint_types', value)}
                                                id='technical_joint_types'
                                                options={jointTypes
                                                    .map((type: string) => (
                                                        { label: type, value: type }
                                                    ))} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_joint_materials") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="technical_joint_materials"
                                                label="Matériau des joints" />
                                            <Select
                                                error={errors.technical_joint_materials}
                                                value={values.technical_joint_materials}
                                                onChange={value => setFieldValue('technical_joint_materials', value)}
                                                id='technical_joint_materials'
                                                options={jointMaterials
                                                    .map((material: string) => (
                                                        { label: material, value: material }
                                                    ))} />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                <FormRow>
                                    {!certificateTypeExcludedFormFields?.includes("technical_joint_states") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="technical_joint_states"
                                                label="État des joints"
                                                required />
                                            <Select
                                                error={errors.technical_joint_states}
                                                value={values.technical_joint_states}
                                                onChange={value => setFieldValue('technical_joint_states', value)}
                                                id='technical_joint_states'
                                                options={jointStates
                                                    .map((state: string) => (
                                                        { label: state, value: state }
                                                    ))} />
                                        </FormGroup>
                                    )}

                                    {!certificateTypeExcludedFormFields?.includes("technical_joint_flexibility") && (
                                        <FormGroup>
                                            <Label
                                                htmlFor="technical_joint_flexibility"
                                                label="Souplesse des joints" />
                                            <Select
                                                error={errors.technical_joint_flexibility}
                                                value={values.technical_joint_flexibility}
                                                onChange={value => setFieldValue('technical_joint_flexibility', value)}
                                                id='technical_joint_flexibility'
                                                options={jointFlexibility
                                                    .map((flexibility: string) => (
                                                        { label: flexibility, value: flexibility }
                                                    ))} />
                                        </FormGroup>
                                    )}
                                </FormRow>

                                {!certificateTypeExcludedFormFields?.includes("technical_joint_score") && (
                                    <FormGroup>
                                        <Label
                                            htmlFor="technical_joint_score"
                                            label="Indice de condition (score des joints)"
                                            required />
                                        <Score fieldName='technical_joint_score'
                                            score={values.technical_joint_score} />
                                    </FormGroup>
                                )}
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default PartnerCertificationReportTechnicalJointsModal