import { Button } from '@/components/UI/Button';
import FormGroup from '@/components/UI/Form/Group';
import Input from '@/components/UI/Form/Input';
import Label from '@/components/UI/Form/Label';
import useAuth from '@/contexts/AuthContext';
import routes from '@/utils/routes';
import title from '@/utils/title'
import resetPasswordSchema from '@/validations/auth/resetPassword.schema';
import { Formik, Form, type FormikHelpers } from 'formik'
import { type FC, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ButtonLink from '@/components/UI/ButtonLink';
import { toast } from 'react-toastify';

interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

const ResetPasswordPage: FC = () => {
    const { user, isLoadingUser } = useAuth();
    const navigate = useNavigate();
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const [isCheckingToken, setIsCheckingToken] = useState(true);

    useEffect(() => {
        const checkRecoveryToken = async () => {
            try {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const type = hashParams.get('type');

                if (type !== 'recovery' || !accessToken) {
                    setIsValidToken(false);
                    setIsCheckingToken(false);
                    return;
                }

                const { data, error } = await supabase.auth.getSession();

                if (error || !data.session) {
                    setIsValidToken(false);
                } else {
                    setIsValidToken(true);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification du token:', error);
                setIsValidToken(false);
            } finally {
                setIsCheckingToken(false);
            }
        };

        checkRecoveryToken();
    }, []);

    const handleSubmit = async (
        values: ResetPasswordFormValues,
        helpers: FormikHelpers<ResetPasswordFormValues>
    ) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: values.password,
                data: {
                    has_password: true
                }
            });

            if (error) throw error;

            await supabase.auth.signOut();

            navigate(routes.Login);
            toast.success("Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
        } catch (error) {
            helpers.setStatus(
                error instanceof Error
                    ? error.message
                    : 'Une erreur est survenue lors de la réinitialisation'
            );
        }
    };

    if (isLoadingUser || isCheckingToken) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white">Chargement...</div>
            </div>
        );
    }

    if (user && isValidToken === null) {
        return <Navigate to={routes.Dashboard.Main} replace />
    }

    if (isValidToken === false) {
        return (
            <div>
                <title>{title("Lien expiré")}</title>

                <div className="min-h-screen flex items-center justify-center p-5">
                    <div className="max-w-md w-full">
                        <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>

                                <h1 className="text-2xl text-white font-semibold mb-2">
                                    Lien invalide ou expiré
                                </h1>

                                <p className="text-gray-400 mb-6">
                                    Ce lien de réinitialisation n'est plus valide.
                                    Les liens expirent après 1 heure pour des raisons de sécurité.
                                </p>

                                <div className="space-y-3">
                                    <ButtonLink to={routes.ForgotPassword}>
                                        Demander un nouveau lien
                                    </ButtonLink>

                                    <ButtonLink theme='secondary' to={routes.Login}>
                                        Retour à la connexion
                                    </ButtonLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <title>{title("Réinitialiser le mot de passe")}</title>

            <div className="min-h-screen flex items-center justify-center p-5">
                <div className="max-w-md w-full">
                    <Formik
                        initialValues={{
                            password: "",
                            confirmPassword: ""
                        }}
                        validationSchema={resetPasswordSchema}
                        validateOnBlur={false}
                        validateOnChange={false}
                        validateOnMount={false}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, status }) => (
                            <Form className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
                                <h1 className="text-2xl text-white text-center font-semibold">
                                    Nouveau mot de passe
                                </h1>

                                <p className="text-gray-400 text-center mt-2">
                                    Choisissez un nouveau mot de passe sécurisé
                                </p>

                                <div className="grid gap-6 mt-6">
                                    <FormGroup>
                                        <Label htmlFor="password" label="Nouveau mot de passe" required />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            error={touched.password ? errors.password : undefined}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label htmlFor="confirmPassword" label="Confirmer le mot de passe" required />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            error={touched.confirmPassword ? errors.confirmPassword : undefined}
                                        />
                                    </FormGroup>

                                    {status && (
                                        <p className="text-red-500 text-sm text-center">
                                            {status}
                                        </p>
                                    )}

                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Réinitialisation..." : "Réinitialiser"}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage