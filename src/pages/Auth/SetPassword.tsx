import { Form, Formik, type FormikHelpers } from "formik";
import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import FormGroup from "@/components/UI/Form/Group";
import Label from "@/components/UI/Form/Label";
import Input from "@/components/UI/Form/Input";
import { Button } from "@/components/UI/Button";
import title from "@/utils/title";
import routes from "@/utils/routes";
import { toast } from "react-toastify";
import setPasswordSchema from "@/validations/auth/setPassword.schema";

interface SetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

const SetPasswordPage: FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string>("");

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                toast.error("Lien invalide ou expiré");
                navigate(routes.Login);
            } else {
                setUserEmail(data.session.user.email || "");
                setIsLoading(false);
            }
        });
    }, [navigate]);

    const handleSubmit = async (
        values: SetPasswordFormValues,
        helpers: FormikHelpers<SetPasswordFormValues>
    ) => {
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: values.password,
            });

            if (updateError) throw updateError;

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                await supabase
                    .from("profiles")
                    .update({ is_guest: false })
                    .eq("id", user.id);
            }

            toast.success("Compte activé avec succès !");
            navigate(routes.Dashboard.Certificates.Main);
        } catch (error: any) {
            console.error("Erreur activation compte:", error);
            helpers.setStatus(error.message || "Erreur lors de l'activation");
        } finally {
            helpers.setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white">Chargement...</p>
            </div>
        );
    }

    return (
        <div>
            <title>{title("Définir votre mot de passe")}</title>

            <div className="min-h-screen flex items-center justify-center p-5">
                <div className="max-w-md w-full">
                    <Formik
                        initialValues={{
                            password: "",
                            confirmPassword: "",
                        }}
                        validationSchema={setPasswordSchema}
                        validateOnBlur={false}
                        validateOnChange={false}
                        validateOnMount={false}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, isSubmitting, status }) => (
                            <Form className="bg-[#0a0a0a] p-6 rounded-xl border border-white/10">
                                <h1 className="text-2xl text-white text-center font-semibold">
                                    Bienvenue ! 🎉
                                </h1>

                                <p className="text-gray text-center mt-2">
                                    Votre certificat a été créé. Définissez votre mot de passe
                                    pour accéder à votre espace client.
                                </p>

                                {userEmail && (
                                    <p className="text-sm text-white/60 text-center mt-2">
                                        Compte : {userEmail}
                                    </p>
                                )}

                                <div className="grid gap-6 mt-6">
                                    <FormGroup>
                                        <Label htmlFor="password" label="Mot de passe" required />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="********"
                                            error={errors.password}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label
                                            htmlFor="confirmPassword"
                                            label="Confirmation"
                                            required
                                        />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="********"
                                            error={errors.confirmPassword}
                                        />
                                    </FormGroup>

                                    {status && (
                                        <p className="text-red-500 text-sm text-center">
                                            {status}
                                        </p>
                                    )}

                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Activation..." : "Activer mon compte"}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default SetPasswordPage;