import * as Yup from "yup";

const customerInfosSchema = Yup.object({
  first_name: Yup.string()
    .required("Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),

  last_name: Yup.string()
    .required("Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),

  email: Yup.string()
    .required("L'email est requis")
    .email("L'email doit être valide"),

  phone: Yup.string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Le numéro doit être au format international (ex: +33612345678)"
    )
    .min(10, "Le numéro est trop court")
    .max(15, "Le numéro est trop long"),

  address: Yup.string().max(
    200,
    "L'adresse ne peut pas dépasser 200 caractères"
  ),

  city: Yup.string().max(100, "La ville ne peut pas dépasser 100 caractères"),

  postal_code: Yup.string().matches(
    /^\d{4,}$/,
    "Le code postal doit contenir au moins 4 chiffres"
  ),

  country: Yup.string().max(100, "Le pays ne peut pas dépasser 100 caractères"),
});

export default customerInfosSchema;
