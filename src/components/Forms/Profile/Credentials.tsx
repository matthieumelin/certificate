import Alert from '@/components/UI/Alert';
import { Button } from '@/components/UI/Button';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import Select from "@/components/UI/Form/Select";
import CompanyAutocomplete from '@/components/CompanyAutocomplete';
import useAuth from '@/contexts/AuthContext';
import { updateCredentialsSchema } from '@/validations/profile/updateCredentials.schema';
import { Form, Formik, type FormikHelpers } from 'formik';
import { useState, type FC, useRef } from 'react';
import FormRow from '@/components/UI/Form/Row';
import { UserProfileType } from '@/types/user.d';
import countries from '@/data/countries';

interface FormValues {
    email: string;
    first_name: string;
    last_name: string;
    society: string;
    vat_number: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    type: UserProfileType;
}

const ProfileCredentialsForm: FC = () => {
    const { userProfile, updateCredentials } = useAuth();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const isUpdatingRef = useRef(false);

    const initialValues: FormValues = {
        email: userProfile?.email || "",
        first_name: userProfile?.first_name || "",
        last_name: userProfile?.last_name || "",
        society: userProfile?.society || "",
        vat_number: userProfile?.vat_number || "",
        address: userProfile?.address || "",
        city: userProfile?.city || "",
        postal_code: userProfile?.postal_code || "",
        country: userProfile?.country || "",
        type: userProfile?.type || UserProfileType.Individual,
    };

    const handleSubmit = async (
        values: FormValues,
        helpers: FormikHelpers<FormValues>
    ) => {
        try {
            isUpdatingRef.current = true;
            setSuccessMessage(null);
            setErrorMessage(null);

            const result = await updateCredentials(
                values.email,
                values.first_name,
                values.last_name,
                values.society,
                values.vat_number,
                values.address,
                values.city,
                values.postal_code,
                values.country,
                values.type
            );

            if (result.success) {
                setSuccessMessage('Vos informations ont été mises à jour.');
            }

            setTimeout(() => {
                isUpdatingRef.current = false;
            }, 100);
        } catch (error) {
            console.error('Erreur:', error);
            isUpdatingRef.current = false;

            const message = error instanceof Error ? error.message : "Une erreur est survenue";

            if (message.includes('email')) {
                helpers.setFieldError('email', message);
            } else if (message.includes('pseudonyme')) {
                helpers.setFieldError('username', message);
            } else {
                setErrorMessage(message);
            }
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <div className='space-y-4'>
            {successMessage && <Alert type='success' message={successMessage} />}
            {errorMessage && <Alert type='error' message={errorMessage} />}

            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={updateCredentialsSchema}
                onSubmit={handleSubmit}>
                {({ errors, isSubmitting, setFieldValue, values }) => {
                    const handleCompanySelect = (company: {
                        name: string;
                        siren: string;
                        siret: string;
                        vat_number: string;
                        address: string;
                    }) => {
                        setSelectedCompany(company);
                        setFieldValue('society', company.name);
                        setFieldValue('vat_number', company.vat_number);
                    };

                    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const isChecked = (e.target as HTMLInputElement).checked;
                        setFieldValue(
                            'type',
                            isChecked ? UserProfileType.Society : UserProfileType.Individual
                        );
                    };

                    return (
                        <Form className='space-y-8'>
                            <FormGroup>
                                <Label label='Adresse e-mail' htmlFor='email' />
                                <Input
                                    error={errors.email}
                                    id='email'
                                    type='email'
                                    name='email'
                                    placeholder='Adresse e-mail' />
                            </FormGroup>

                            <FormRow>
                                <FormGroup>
                                    <Label label='Prénom' htmlFor='first_name' />
                                    <Input
                                        error={errors.first_name}
                                        id='first_name'
                                        type='text'
                                        name='first_name'
                                        placeholder='Prénom' />
                                </FormGroup>

                                <FormGroup>
                                    <Label label='Nom' htmlFor='last_name' />
                                    <Input
                                        error={errors.last_name}
                                        id='last_name'
                                        type='text'
                                        name='last_name'
                                        placeholder='Nom' />
                                </FormGroup>
                            </FormRow>

                            <FormGroup>
                                <Label label='Adresse' htmlFor='address' />
                                <Input
                                    error={errors.address}
                                    id='address'
                                    type='text'
                                    name='address'
                                    placeholder='Adresse' />
                            </FormGroup>

                            <FormRow>
                                <FormGroup>
                                    <Label label='Ville' htmlFor='city' />
                                    <Input
                                        error={errors.city}
                                        id='city'
                                        type='text'
                                        name='city'
                                        placeholder='Ville' />
                                </FormGroup>
                                <FormGroup>
                                    <Label label='Code postal' htmlFor='postal_code' />
                                    <Input
                                        error={errors.postal_code}
                                        id='postal_code'
                                        type='text'
                                        name='postal_code'
                                        placeholder='Code postal' />
                                </FormGroup>
                                <FormGroup>
                                    <Label label='Pays' htmlFor='country' />
                                    <Select id='country' options={countries.map((country) => (
                                        {
                                            label: "",
                                            value: "",
                                        }
                                    ))} />
                                    <Input
                                        error={errors.country}
                                        id='country'
                                        type='text'
                                        name='country'
                                        placeholder='Pays' />
                                </FormGroup>
                            </FormRow>

                            <FormGroup>
                                <Input
                                    id='type'
                                    name='type'
                                    type='checkbox'
                                    label='Je suis une entreprise'
                                    checked={values.type === UserProfileType.Society}
                                    onChange={handleCheckboxChange}
                                />
                            </FormGroup>

                            {values.type === UserProfileType.Society && (
                                <>
                                    <FormGroup>
                                        <Label label="Nom de l'entreprise" htmlFor='society' />
                                        <CompanyAutocomplete
                                            onSelect={handleCompanySelect}
                                            initialValue={values.society}
                                        />
                                        {errors.society && (
                                            <p className="text-red-400 text-sm mt-2">{errors.society}</p>
                                        )}
                                        {selectedCompany && (
                                            <div className="mt-2 p-3 bg-emerald-900/10 border border-emerald-900/30 rounded-lg">
                                                <p className="text-emerald-400 text-xs">
                                                    ✓ Entreprise sélectionnée
                                                </p>
                                                <p className="text-neutral-400 text-xs mt-1">
                                                    SIREN: {selectedCompany.siren} • SIRET: {selectedCompany.siret}
                                                </p>
                                            </div>
                                        )}
                                    </FormGroup>

                                    <FormGroup>
                                        <Label label="Numéro de TVA" htmlFor='vat_number' />
                                        <Input
                                            error={errors.vat_number}
                                            id='vat_number'
                                            type='text'
                                            name='vat_number'
                                            placeholder="FR12345678901"
                                            disabled={!!selectedCompany}
                                        />
                                    </FormGroup>
                                </>
                            )}

                            <FormGroup>
                                <Button
                                    disabled={isSubmitting}
                                    type='submit'
                                >
                                    {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                                </Button>
                            </FormGroup>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default ProfileCredentialsForm;