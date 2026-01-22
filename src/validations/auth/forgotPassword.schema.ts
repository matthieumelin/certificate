import * as Yup from "yup";

const forgotPasswordSchema = Yup.object({
  email: Yup.string().email("Email invalide").required("L'email est requis"),
});

export default forgotPasswordSchema;
