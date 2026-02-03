import { useRef, type FC } from 'react'
import { Form, Formik, type FormikProps } from 'formik';
import { toast } from 'react-toastify';
import useAuth from '@/contexts/AuthContext';
import { ClientCertificateStep } from '@/types/certificate.d';
import Steps from '@/components/Dashboard/Steps';
import customerInfosSchema from '@/validations/certificate/partner/customerInfos.schema';
import FormRow from '@/components/UI/Form/Row';
import FormGroup from '@/components/UI/Form/Group';
import Label from '@/components/UI/Form/Label';
import Input from '@/components/UI/Form/Input';
import { Button } from '@/components/UI/Button';
import { useClientCertificateStore } from '@/stores/certification/clientCertificateStore';
import { FaArrowDown } from "react-icons/fa";

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

const ClientCertificationCustomerInfosModal: FC = () => {
    const { user, userProfile } = useAuth();
    const { draft, setDraft } = useClientCertificateStore();

    const formikRef = useRef<FormikProps<FormValues>>(null);

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
                current_step: ClientCertificateStep.ObjectInfos
            });
        } catch (error) {
            console.error("Erreur sauvegarde infos:", error);
            toast.error("Erreur lors de la sauvegarde des informations");
        }
    }

    const handleUseCurrentInfos = () => {
        if (!user) {
            toast.error("Impossible de soumettre le formulaire");
            return;
        }

        const currentInfos = {
            address: userProfile?.address || "",
            city: userProfile?.city || "",
            country: userProfile?.country || "",
            email: userProfile?.email || "",
            first_name: userProfile?.first_name || "",
            last_name: userProfile?.last_name || "",
            phone: userProfile?.phone || "",
            postal_code: userProfile?.postal_code || "",
        };

        setDraft({
            ...draft,
            customer_data: currentInfos
        });


        if (formikRef.current) {
            const { setFieldValue } = formikRef.current;

            setFieldValue('address', currentInfos.address);
            setFieldValue('city', currentInfos.city);
            setFieldValue('country', currentInfos.country);
            setFieldValue('email', currentInfos.email);
            setFieldValue('first_name', currentInfos.first_name);
            setFieldValue('last_name', currentInfos.last_name);
            setFieldValue('phone', currentInfos.phone);
            setFieldValue('postal_code', currentInfos.postal_code);
        }
    }

    const steps = Object.values(ClientCertificateStep);

    return (
        <div>
            <Steps
                steps={steps} />
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={customerInfosSchema}
                validateOnBlur={false}
                validateOnChange={false}
                validateOnMount={false}
                onSubmit={handleSubmit}>
                {({ errors, isSubmitting }) => (
                    <Form className='space-y-4'>
                        <span onClick={handleUseCurrentInfos} className='text-sm text-emerald-400 hover:text-emerald-500 flex items-center gap-2 hover:cursor-pointer'>Utiliser mes informations actuelles <FaArrowDown /></span>
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

export default ClientCertificationCustomerInfosModal