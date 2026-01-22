import { Button } from '@/components/UI/Button';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import useAuth from '@/contexts/AuthContext';
import routes from '@/utils/routes';
import title from '@/utils/title'
import forgotPasswordSchema from '@/validations/auth/forgotPassword.schema';
import { Formik, Form, type FormikHelpers } from 'formik'
import { type FC, useState } from 'react'
import { Navigate, Link } from 'react-router-dom';

interface ForgotPasswordFormValues {
    email: string;
}

const ForgotPasswordPage: FC = () => {
    const { user, resetPassword } = useAuth();
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (
        values: ForgotPasswordFormValues,
        helpers: FormikHelpers<ForgotPasswordFormValues>
    ) => {
        try {
            await resetPassword(values.email);
            setEmailSent(true);
        } catch (error) {
            helpers.setStatus(
                error instanceof Error
                    ? error.message
                    : 'Une erreur est survenue lors de l\'envoi de l\'email'
            );
        }
    };

    if (user) {
        return <Navigate to={routes.Home} />
    }

    if (emailSent) {
        return (
            <div>
                <title>{title("Email envoyé")}</title>

                <div className="min-h-screen flex items-center justify-center p-5">
                    <div className="max-w-md w-full">
                        <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <h1 className="text-2xl text-white font-semibold mb-2">
                                    Email envoyé !
                                </h1>

                                <p className="text-gray-400 mb-6">
                                    Un lien de réinitialisation a été envoyé à votre adresse email.
                                    Veuillez vérifier votre boîte de réception et suivre les instructions.
                                </p>

                                <Link to={routes.Login}>
                                    <Button theme="secondary" className="w-full">
                                        Retour à la connexion
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <title>{title("Mot de passe oublié")}</title>

            <div className="min-h-screen flex items-center justify-center p-5">
                <div className="max-w-md w-full">
                    <Formik
                        initialValues={{
                            email: "",
                        }}
                        validationSchema={forgotPasswordSchema}
                        validateOnBlur={false}
                        validateOnChange={false}
                        validateOnMount={false}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, status }) => (
                            <Form className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
                                <h1 className="text-2xl text-white text-center font-semibold">
                                    Mot de passe oublié ?
                                </h1>

                                <p className="text-gray-400 text-center mt-2">
                                    Veuillez saisir votre email de connexion afin de recevoir le lien de réinitialisation de votre mot de passe.
                                </p>

                                <div className="grid gap-6 mt-6">
                                    <FormGroup>
                                        <Label htmlFor="email" label="Adresse mail" required />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Saisir votre email"
                                            error={touched.email ? errors.email : undefined}
                                        />
                                    </FormGroup>

                                    {status && (
                                        <p className="text-red-500 text-sm text-center">
                                            {status}
                                        </p>
                                    )}

                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Envoi..." : "Recevoir un lien"}
                                    </Button>

                                    <Link
                                        to={routes.Login}
                                        className="text-emerald-500 hover:text-emerald-400 text-center text-sm transition-colors"
                                    >
                                        Retour à la connexion
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage