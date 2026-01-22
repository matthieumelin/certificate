import * as Yup from "yup";

const detailsSchema = Yup.object({
  brand: Yup.string()
    .required("La marque est requise")
    .min(2, "La marque doit contenir au moins 2 caractères")
    .max(50, "La marque ne peut pas dépasser 50 caractères"),

  model: Yup.string()
    .required("Le modèle est requis")
    .min(2, "Le modèle doit contenir au moins 2 caractères")
    .max(100, "Le modèle ne peut pas dépasser 100 caractères"),

  ref: Yup.string().max(50, "La référence ne peut pas dépasser 50 caractères"),

  estimedPrice: Yup.number()
    .required("Le prix estimé est requis")
    .positive("Le prix doit être positif")
    .min(1, "Le prix doit être supérieur à 0")
    .max(10000000, "Le prix ne peut pas dépasser 10 000 000 €")
    .typeError("Le prix doit être un nombre valide"),

  ownOriginal: Yup.boolean().required(),

  notes: Yup.string().max(
    1000,
    "Les notes ne peuvent pas dépasser 1000 caractères"
  ),
});

export default detailsSchema;
