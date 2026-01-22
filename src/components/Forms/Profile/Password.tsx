import Alert from '@/components/UI/Alert';
import { Button } from '@/components/UI/Button';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import useAuth from '@/contexts/AuthContext';
import { changePasswordSchema } from '@/validations/profile/changePassword.schema';
import { setPasswordSchema } from '@/validations/profile/setPassword.schema';
import { Form, Formik, type FormikHelpers } from 'formik';
import { useState, type FC } from 'react';

interface ChangePasswordFormValues {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

interface SetPasswordFormValues {
    new_password: string;
    confirm_password: string;
}

const ProfilePasswordForm: FC = () => {
    const { changePassword, setPassword, isOAuthUser, user } = useAuth();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const oauthProvider = user?.app_metadata?.provider;
    const providerName = oauthProvider === 'google' ?
        "Google" : 'réseau social';

    const handleChangePassword = async (
        values: ChangePasswordFormValues,
        helpers: FormikHelpers<ChangePasswordFormValues>
    ) => {
        try {
            setSuccessMessage(null);
            setErrorMessage(null);

            const success = await changePassword(values.current_password, values.new_password);

            if (success) {
                setSuccessMessage("Votre mot de passe a été modifié avec succès !");
                helpers.resetForm();
            }
        } catch (error) {
            console.error('Erreur:', error);

            const message = error instanceof Error ? error.message : "Une erreur est survenue";

            if (message.includes('mot de passe actuel')) {
                helpers.setFieldError('current_password', message);
            } else {
                setErrorMessage(message);
            }
        } finally {
            helpers.setSubmitting(false);
        }
    };

    const handleSetPassword = async (
        values: SetPasswordFormValues,
        helpers: FormikHelpers<SetPasswordFormValues>
    ) => {
        try {
            setSuccessMessage(null);
            setErrorMessage(null);

            const success = await setPassword(values.new_password);

            if (success) {
                setSuccessMessage("Votre mot de passe a été défini avec succès ! Vous pouvez maintenant vous connecter avec votre email et ce mot de passe.");
                helpers.resetForm();
            }
        } catch (error) {
            console.error('Erreur:', error);
            setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue lors de la définition du mot de passe");
        } finally {
            helpers.setSubmitting(false);
        }
    };

    if (isOAuthUser && !user?.user_metadata.has_password) {
        return (
            <div className='space-y-4'>
                <Alert type='info' message={`Vous êtes connecté via ${providerName}. Définissez un mot de passe pour pouvoir également vous connecter avec votre email.`} />

                {successMessage && <Alert type='success' message={successMessage} />}
                {errorMessage && <Alert type='error' message={errorMessage} />}

                <Formik<SetPasswordFormValues>
                    initialValues={{
                        new_password: "",
                        confirm_password: "",
                    }}
                    validationSchema={setPasswordSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validateOnMount={false}
                    onSubmit={handleSetPassword}>
                    {({ errors, isSubmitting }) => (
                        <Form className='space-y-8'>
                            <FormGroup>
                                <Label label='Nouveau mot de passe' htmlFor='new_password' />
                                <Input
                                    error={errors.new_password}
                                    type='password'
                                    id='new_password'
                                    name='new_password'
                                    placeholder='Votre nouveau mot de passe' />
                            </FormGroup>
                            <FormGroup>
                                <Label label='Confirmer le mot de passe' htmlFor='confirm_password' />
                                <Input
                                    error={errors.confirm_password}
                                    type='password'
                                    name='confirm_password'
                                    id='confirm_password'
                                    placeholder='Confirmez votre mot de passe' />
                            </FormGroup>
                            <FormGroup>
                                <Button disabled={isSubmitting} type='submit'>
                                    {isSubmitting ? 'Définition en cours...' : 'Définir un mot de passe'}
                                </Button>
                            </FormGroup>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            {successMessage && <Alert type='success' message={successMessage} />}
            {errorMessage && <Alert type='error' message={errorMessage} />}

            <Formik<ChangePasswordFormValues>
                initialValues={{
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                }}
                validationSchema={changePasswordSchema}
                validateOnBlur={false}
                validateOnChange={false}
                validateOnMount={false}
                onSubmit={handleChangePassword}>
                {({ errors, isSubmitting }) => (
                    <Form className='space-y-8'>
                        <FormGroup>
                            <Label label='Mot de passe actuel' htmlFor='current_password' />
                            <Input
                                error={errors.current_password}
                                type='password'
                                id='current_password'
                                name='current_password'
                                placeholder='Votre mot de passe actuel' />
                        </FormGroup>
                        <FormGroup>
                            <Label label='Nouveau mot de passe' htmlFor='new_password' />
                            <Input
                                error={errors.new_password}
                                type='password'
                                id='new_password'
                                name='new_password'
                                placeholder='Votre nouveau mot de passe' />
                        </FormGroup>
                        <FormGroup>
                            <Label label='Confirmer le mot de passe' htmlFor='confirm_password' />
                            <Input
                                error={errors.confirm_password}
                                id='confirm_password'
                                type='password'
                                name='confirm_password'
                                placeholder='Confirmez votre mot de passe' />
                        </FormGroup>
                        <FormGroup>
                            <Button disabled={isSubmitting} type='submit'>
                                {isSubmitting ? 'Modification en cours...' : 'Modifier le mot de passe'}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default ProfilePasswordForm;