import { Form, Formik, type FormikProps } from 'formik'
import { useRef, type FC, useEffect } from 'react'
import { useCertificateReportStore } from '@/stores/certificateReportStore'
import type { CertificateType } from '@/types/certificate'
import { useCertificateReportFormStore } from '@/stores/certificateReportFormStore'
import { useCertificateReportForm } from '@/hooks/useCertificateReportForm'
import { withCurrentValueOption } from '@/helpers/select'
import { ObjectStatus, type ObjectBrand, type ObjectModel, type ObjectReference, type ObjectType } from '@/types/object.d'
import FormRow from '@/components/UI/Form/Row'
import FormGroup from '@/components/UI/Form/Group'
import Label from '@/components/UI/Form/Label'
import FormSelect from '@/components/UI/Form/Select'
import Input from '@/components/UI/Form/Input'
import { getObjectStatusLabel } from '@/helpers/translations'
import { hasMinimumRole } from '@/utils/user'
import useAuth from '@/contexts/AuthContext'
import { UserProfileRole } from '@/types/user.d'

interface FormValues {
    general_object_type: string;
    general_object_brand: string;
    general_object_model: string;
    general_object_reference: string;
    general_object_surname: string;
    general_object_serial_number: string;
    general_object_year: number;
    general_object_status: ObjectStatus;
}

interface PartnerCertificationReportGeneralModalProps {
    certificateTypes: CertificateType[];
    objectTypes: ObjectType[];
    objectModels: ObjectModel[];
    objectBrands: ObjectBrand[];
    objectReferences: ObjectReference[];
}

const PartnerCertificationReportGeneralModal: FC<PartnerCertificationReportGeneralModalProps> = ({ certificateTypes, objectTypes, objectModels, objectBrands, objectReferences }) => {
    const { userProfile } = useAuth();

    const { selectedCertificate } = useCertificateReportStore();
    const { formData } = useCertificateReportFormStore();

    const formRef = useRef<FormikProps<FormValues>>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!formRef.current) return;

            if (!selectedCertificate) {
                console.log("Unable to retrieve selected certificate")
                return;
            }

            const object = selectedCertificate.object;
            if (object) {
                const objectType = objectTypes.find(value => value.id === object.type_id);

                const { setFieldValue } = formRef.current;

                setFieldValue("general_object_type", objectType?.name || '')
                setFieldValue('general_object_brand', object.brand || '');
                setFieldValue("general_object_model", object.model || '');
                setFieldValue('general_object_reference', object.reference || '')
                setFieldValue('general_object_serial_number', object.serial_number || '')
                setFieldValue('general_object_surname', object.surname || '')
                setFieldValue('general_object_year', object.year_manufacture || new Date().getFullYear())
                setFieldValue('general_object_status', object.status || ObjectStatus.Valid)
            }
        }
        loadInitialData();
    }, [])

    const certificateType = certificateTypes.find((certificateType: CertificateType) => certificateType.id === selectedCertificate?.certificate_type_id);
    const certificateTypeExcludedFormFields = certificateType?.excluded_report_form_fields ? certificateType?.excluded_report_form_fields.filter((excludedFormField: string) => excludedFormField.startsWith("general")) : [];

    const initialValues: FormValues = {
        general_object_type: formData.general_object_type || "",
        general_object_brand: formData.general_object_brand || "",
        general_object_model: formData.general_object_model || "",
        general_object_reference: formData.general_object_reference || "",
        general_object_surname: formData.general_object_surname || "",
        general_object_serial_number: formData.general_object_serial_number || "",
        general_object_year: formData.general_object_year || new Date().getFullYear(),
        general_object_status: formData.general_object_status || ObjectStatus.Valid,
    }

    return (
        <div className="space-y-4">
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                onSubmit={() => { }}>
                {({ values, errors, setFieldValue }) => {
                    useCertificateReportForm(values);

                    return (
                        <Form>
                            <div className='space-y-8'>
                                <div className="space-y-3">
                                    <h2 className="text-white text-xl font-semibold">Informations Générales</h2>
                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("general_object_type") && (
                                            <FormGroup>
                                                <Label htmlFor='general_object_type' label="Type d'objet" required />
                                                <FormSelect
                                                    onChange={value => setFieldValue('general_object_type', value)}
                                                    value={values.general_object_type}
                                                    error={errors.general_object_type}
                                                    id='general_object_type'
                                                    options={objectTypes.map((objectType: ObjectType) => (
                                                        {
                                                            label: objectType.label,
                                                            value: objectType.name
                                                        }
                                                    ))} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("general_object_brand") && (
                                            <FormGroup>
                                                <Label htmlFor='general_object_brand' label='Marque' required />
                                                <FormSelect
                                                    onChange={value => setFieldValue('general_object_brand', value)}
                                                    value={values.general_object_brand}
                                                    error={errors.general_object_brand}
                                                    allowAdd
                                                    id='general_object_brand'
                                                    options={withCurrentValueOption(objectBrands.map((objectBrand: ObjectBrand) => (
                                                        {
                                                            label: objectBrand.name,
                                                            value: objectBrand.name
                                                        }
                                                    )), values.general_object_brand)} />
                                            </FormGroup>
                                        )}
                                    </FormRow>

                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("general_object_model") && (
                                            <FormGroup>
                                                <Label htmlFor='general_object_model' label='Modèle' required />
                                                <FormSelect
                                                    onChange={value => setFieldValue('general_object_model', value)}
                                                    value={values.general_object_model}
                                                    error={errors.general_object_model}
                                                    allowAdd
                                                    id='general_object_model'
                                                    options={withCurrentValueOption(objectModels.map((objectModel: ObjectModel) => ({
                                                        label: objectModel.name,
                                                        value: objectModel.name
                                                    })), values.general_object_model)} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("general_object_reference") && (
                                            <FormGroup>
                                                <Label htmlFor='general_object_reference' label='Référence' required />
                                                <FormSelect
                                                    onChange={value => setFieldValue('general_object_reference', value)}
                                                    value={values.general_object_reference}
                                                    error={errors.general_object_reference}
                                                    allowAdd
                                                    id='general_object_reference'
                                                    options={withCurrentValueOption(objectReferences.map((objectReference: ObjectReference) => ({
                                                        label: objectReference.name,
                                                        value: objectReference.name
                                                    })), values.general_object_reference)} />
                                            </FormGroup>
                                        )}
                                    </FormRow>
                                    <FormRow>
                                        {!certificateTypeExcludedFormFields?.includes("general_object_surname") && (
                                            <FormGroup>
                                                <Label htmlFor='general_object_surname' label='Surnom' />
                                                <Input
                                                    id='general_object_surname'
                                                    name="general_object_surname"
                                                    placeholder='Ex: Rolex Submariner "Red"'
                                                    type='text'
                                                    error={errors.general_object_surname} />
                                            </FormGroup>
                                        )}

                                        {!certificateTypeExcludedFormFields?.includes("general_object_serial_number") && (
                                            <FormGroup>
                                                <Label htmlFor='general_object_serial_number' label='Numéro de série' required />
                                                <Input
                                                    id='general_object_serial_number'
                                                    name="general_object_serial_number"
                                                    placeholder='Ex: Z123456'
                                                    type='text'
                                                    error={errors.general_object_serial_number} />
                                            </FormGroup>
                                        )}
                                    </FormRow>

                                    {!certificateTypeExcludedFormFields?.includes("general_object_year") && (
                                        <FormGroup>
                                            <Label htmlFor='general_object_year' label='Année de fabrication' />
                                            <Input
                                                id='general_object_year'
                                                name="general_object_year"
                                                placeholder='Ex: 2020'
                                                type='number'
                                                error={errors.general_object_year} />
                                        </FormGroup>
                                    )}

                                    {hasMinimumRole(userProfile?.role, UserProfileRole.Admin) && (
                                        <FormRow className='items-center'>
                                            <Label htmlFor='general_object_status' label='Statut' />
                                            <FormSelect
                                                searchable={false}
                                                onChange={value => setFieldValue('general_object_status', value)}
                                                value={values.general_object_status}
                                                error={errors.general_object_status}
                                                id='general_object_status'
                                                options={withCurrentValueOption(Object.values(ObjectStatus).map((status: ObjectStatus) => ({
                                                    label: getObjectStatusLabel(status),
                                                    value: status
                                                })), values.general_object_status)} />
                                        </FormRow>
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

export default PartnerCertificationReportGeneralModal