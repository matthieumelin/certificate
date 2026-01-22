import { useCertificateReportFormStore } from "@/stores/certificateReportFormStore";
import { useCertificateReportStore } from "@/stores/certificateReportStore";
import type { CertificateType } from "@/types/certificate";
import type { FormValidationError } from "@/types/form";
import { createValidationSchema } from "@/validations/certificate/partner/report.schema";
import { ValidationError } from "yup";

const useValidateCertificateReport = (certificateTypes: CertificateType[]) => {
  const { getAllFormData, setValidationErrors } =
    useCertificateReportFormStore();
  const { selectedCertificate } = useCertificateReportStore();

  const normalizeFormData = (data: any) => {
    const normalized = { ...data };

    Object.keys(normalized).forEach((key) => {
      const value = normalized[key];

      if (
        Array.isArray(value) &&
        value.length === 1 &&
        typeof value[0] === "string"
      ) {
        try {
          const parsed = JSON.parse(value[0]);
          normalized[key] = parsed;
        } catch {
          normalized[key] = value[0];
        }
      }
    });

    return normalized;
  };

  const validateReport = async (): Promise<{
    isValid: boolean;
    errors: FormValidationError[];
  }> => {
    const rawFormData = getAllFormData();
    const formData = normalizeFormData(rawFormData);

    const certificateType = certificateTypes.find(
      (type) => type.id === selectedCertificate?.certificate_type_id
    );
    const excludedFields = certificateType?.excluded_report_form_fields || [];

    const validationSchema = createValidationSchema(excludedFields);

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setValidationErrors([]);
      return { isValid: true, errors: [] };
    } catch (err: any) {
      if (err instanceof ValidationError) {
        const validationErrors: FormValidationError[] = err.inner.map(
          (error: any) => {
            const fieldName = error.path;
            const section =
              fieldName.split("_").slice(0, -1).join("_") || "general";

            return {
              field: fieldName,
              message: error.message,
              section: section,
            };
          }
        );

        setValidationErrors(validationErrors);
        return { isValid: false, errors: validationErrors };
      }

      const genericError: FormValidationError = {
        field: "unknown",
        message: "Une erreur inattendue s'est produite lors de la validation",
        section: "general",
      };

      setValidationErrors([genericError]);
      return { isValid: false, errors: [genericError] };
    }
  };

  return { validateReport };
};

export default useValidateCertificateReport;
