import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("Veuillez entrer votre prénom.")
    .min(2, "Le prénom complet doit contenir au moins 2 caractères."),

  lastName: Yup.string()
    .required("Veuillez entrer votre nom.")
    .min(2, "Le nom complet doit contenir au moins 2 caractères."),

  email: Yup.string()
    .email("Mauvais format d'email.")
    .required("Veuillez entrer votre email."),

  password: Yup.string()
    .required("Veuillez entrer un mot de passe.")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre."
    ),

  confirmPassword: Yup.string()
    .required("Veuillez confirmer votre mot de passe.")
    .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas."),
});

export default registerSchema;