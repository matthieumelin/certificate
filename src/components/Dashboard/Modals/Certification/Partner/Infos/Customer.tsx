import { type FC } from 'react'
import { Form, Formik } from 'formik';
import { usePartnerCertificateStore } from '@/stores/certification/partnerCertificateStore';
import { toast } from 'react-toastify';
import useAuth from '@/contexts/AuthContext';
import { PartnerCertificateStep } from '@/types/certificate.d';
import Steps from '@/components/Dashboard/Steps';
import customerInfosSchema from '@/validations/certificate/partner/customerInfos.schema';
import FormRow from '@/components/UI/Form/Row';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import Input from '@/components/UI/Form/Input';
import { Button } from '@/components/UI/Button';

interface FormValues {
    address: string,
    city: string,
    country: string,
    email: string,
    first_name: string,
    last_name: string;
    phone: string;
    postal_code: string;
}

const PartnerCertificationCustomerInfosModal: FC = () => {
    const { user } = useAuth();
    const { draft, setDraft } = usePartnerCertificateStore();

    const initialValues: FormValues = {
        address: draft.customer_data?.address || "",
        city: draft.customer_data?.city || "",
        country: draft.customer_data?.country || "",
        email: draft.customer_data?.email || "",
        first_name: draft.customer_data?.first_name || "",
        last_name: draft.customer_data?.last_name || "",
        phone: draft.customer_data?.phone || "",
        postal_code: draft.customer_data?.postal_code || "",
    }

    const handleSubmit = async (values: FormValues) => {
        if (!user) {
            toast.error("Impossible de soumettre le formulaire");
            return;
        }
        try {
            setDraft({
                id: draft.id,
                customer_data: values,
                created_by: user.id,
                current_step: PartnerCertificateStep.ObjectInfos
            });
        } catch (error) {
            console.error("Erreur sauvegarde infos:", error);
            toast.error("Erreur lors de la sauvegarde des informations");
        }
    }

    const steps = Object.values(PartnerCertificateStep);

    return (
        <div>
            <Steps
                mode='partner'
                steps={steps} />
                
            <Formik
                initialValues={initialValues}
                validationSchema={customerInfosSchema}
                validateOnBlur={false}
                validateOnChange={false}
                validateOnMount={false}
                onSubmit={handleSubmit}>
                {({ errors, isSubmitting }) => (
                    <Form>
                        <div className='grid gap-4'>
                            <FormRow>
                                <FormGroup>
                                    <Label htmlFor='first_name' label='Prénom' required />
                                    <Input error={errors.first_name}
                                        id='first_name'
                                        name="first_name"
                                        type='text'
                                        placeholder='John'
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='last_name' label='Nom' required />
                                    <Input error={errors.last_name}
                                        id='last_name'
                                        name="last_name"
                                        type='text'
                                        placeholder='Doe'
                                    />
                                </FormGroup>
                            </FormRow>
                            <FormRow>
                                <FormGroup>
                                    <Label htmlFor='email' label='Email' required />
                                    <Input error={errors.email}
                                        id='email'
                                        name="email"
                                        type='email'
                                        placeholder='john.doe@example.com'
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='phone' label='Téléphone' />
                                    <Input error={errors.phone}
                                        id='phone'
                                        name="phone"
                                        type='tel'
                                        placeholder='+33 6 12 34 56 78'
                                    />
                                </FormGroup>
                            </FormRow>
                            <FormGroup>
                                <Label htmlFor='address' label='Adresse' />
                                <Input error={errors.address}
                                    id='address'
                                    name="address"
                                    type='text'
                                    placeholder='123 Rue de la Paix' />
                            </FormGroup>
                            <FormRow>
                                <FormGroup>
                                    <Label htmlFor='city' label='Ville' />
                                    <Input error={errors.city}
                                        id='city'
                                        name="city"
                                        type='text'
                                        placeholder='Paris' />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='postal_code' label='Code Postal' />
                                    <Input error={errors.postal_code}
                                        id='postal_code'
                                        name="postal_code"
                                        type='text'
                                        placeholder='75001' />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor='country' label='Pays' />
                                    <Input error={errors.country}
                                        id='country'
                                        name="country"
                                        type='text'
                                        placeholder='France' />
                                </FormGroup>
                            </FormRow>
                            <div className='flex justify-end'>
                                <Button className='mt-4 lg:w-max' disabled={isSubmitting} type='submit'>Suivant</Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div >
    )
}

export default PartnerCertificationCustomerInfosModal