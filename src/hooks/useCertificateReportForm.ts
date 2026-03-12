import { useCertificateReportFormStore } from "@/stores/certificateReportFormStore";
import { useEffect } from "react";

export const useCertificateReportForm = <T extends Record<string, any>>(
  values: T,
) => {
  const { updateFormData, clearValidationErrors } =
    useCertificateReportFormStore();

  useEffect(() => {
    clearValidationErrors();
    const sanitized = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        (key.endsWith("_images") ||
          key.endsWith("_factory") ||
          key.endsWith("_factory_not")) &&
        value === null
          ? []
          : value,
      ]),
    );
    updateFormData(sanitized);
  }, [values, updateFormData]);
};
