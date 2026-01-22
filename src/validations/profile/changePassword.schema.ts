import * as Yup from "yup";

export const changePasswordSchema = Yup.object({
  current_password: Yup.string().required("Le mot de passe actuel est requis"),
  new_password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    )
    .required("Le nouveau mot de passe est requis"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password")], "Les mots de passe ne correspondent pas")
    .required("La confirmation du mot de passe est requise"),
});
