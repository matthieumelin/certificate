import * as Yup from "yup";

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .required("Le mot de passe est requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("La confirmation est requise"),
});

export default resetPasswordSchema;