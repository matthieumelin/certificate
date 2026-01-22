import { useCertificateReportFormStore } from "@/stores/certificateReportFormStore";

export const useFieldError = (fieldName: string) => {
  const { validationErrors } = useCertificateReportFormStore();
  const error = validationErrors.find((error) => error.field === fieldName);

  return {
    hasError: !!error,
    errorMessage: error?.message,
  };
};
