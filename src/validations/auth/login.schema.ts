import * as Yup from "yup";

const loginSchema = Yup.object().shape({
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
});

export default loginSchema;