import * as Yup from "yup";

const objectInfosSchema = Yup.object({
  type: Yup.string().required("Le type d'objet est requis"),
  brand: Yup.string().required("La marque est requise"),
  model: Yup.string().required("Le modèle est requis"),
  reference: Yup.string().required("La référence est requise"),
  serial_number: Yup.string()
    .required("Le numéro de série est requis")
    .matches(
      /^[A-Z0-9\-]+$/i,
      "Le numéro de série ne peut contenir que des lettres, chiffres et tirets"
    ),
  front_photo: Yup.array()
    .of(Yup.string())
    .min(1, "La photo de l'objet est requise")
    .required("La photo de l'objet est requise"),
});

export default objectInfosSchema;