import { CertificateInspectionResult } from "@/types/certificate.d";
import * as Yup from "yup";

const certificateInspectionSchema = Yup.object({
  brand: Yup.string().required("La marque est requise"),
  model: Yup.string().required("Le modèle est requis"),
  reference: Yup.string().required("La référence est requise"),
  serialNumber: Yup.string().required("Le numéro de série est requis"),
  result: Yup.mixed<CertificateInspectionResult>()
    .oneOf(
      Object.values(CertificateInspectionResult),
      "Vous devez sélectionner un résultat"
    )
    .required("Le résultat est requis"),
  suspectPoints: Yup.array().of(Yup.string()),
  comment: Yup.string().when('result', {
    is: (result: CertificateInspectionResult) => result === CertificateInspectionResult.InauthenticItem,
    then: (schema) => schema.required("Le commentaire est requis pour une pièce inauthentique"),
    otherwise: (schema) => schema.notRequired(),
  }),
  photos: Yup.array()
    .min(5, "Vous devez ajouter au moins 5 photos")
    .required("Les photos sont requises"),
});

export default certificateInspectionSchema;