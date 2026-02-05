import * as Yup from "yup";

export const updateCredentialsSchema = Yup.object({
  email: Yup.string()
    .required("L'email est requis")
    .email("Email invalide")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Format d'email invalide",
    )
    .trim()
    .lowercase(),

  first_name: Yup.string()
    .required("Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .matches(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets",
    )
    .trim(),

  last_name: Yup.string()
    .required("Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .matches(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets",
    )
    .trim(),

  phone: Yup.string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Le numéro doit être au format international (ex: +33612345678)",
    )
    .min(10, "Le numéro est trop court")
    .max(15, "Le numéro est trop long"),

  address: Yup.string()
    .nullable()
    .max(200, "L'adresse ne peut pas dépasser 200 caractères")
    .trim(),

  city: Yup.string()
    .nullable()
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .trim(),

  postal_code: Yup.string()
    .nullable()
    .max(20, "Le code postal ne peut pas dépasser 20 caractères")
    .trim(),

  country: Yup.string()
    .nullable()
    .max(100, "Le pays ne peut pas dépasser 100 caractères")
    .trim(),

  society: Yup.string()
    .nullable()
    .max(100, "Le nom de la société ne peut pas dépasser 100 caractères")
    .trim(),

  vat_number: Yup.string()
    .nullable()
    .matches(
      /^[A-Z]{2}[0-9A-Z]{2,13}$/,
      "Format de numéro de TVA invalide (ex: FR12345678901)",
    )
    .trim()
    .uppercase(),
});
