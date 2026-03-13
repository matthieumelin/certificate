import { useCertificateReportFormStore } from "@/stores/certificateReportFormStore";
import { useCertificateStore } from "@/stores/certificateStore";
import type { CertificateType } from "@/types/certificate";
import type { FormValidationError } from "@/types/form";
import { createValidationSchema } from "@/validations/certificate/partner/report.schema";
import { ValidationError } from "yup";

const getSectionFromField = (fieldName: string): string => {
  const sectionMap: Record<string, string> = {
    case_bezel_insert: "case_bezel_insert",
    case_bezel_setting: "case_bezel",
    case_bezel: "case_bezel",
    case_back: "case_back",
    case_crown_pusher: "case_crown_pusher",
    case_crown: "case_crown",
    case_glass: "case_glass",
    case_diameter: "case",
    case_setting: "case",
    case_lug: "case",
    case: "case",
    bracelet_clasp_setting: "bracelet_clasp",
    bracelet_clasp: "bracelet_clasp",
    bracelet_link_pump: "bracelet_link",
    bracelet_link: "bracelet_link",
    bracelet_diameter: "bracelet",
    bracelet_setting: "bracelet",
    bracelet: "bracelet",
    dial_index_luminescence: "dial_index",
    dial_index: "dial_index",
    dial_hands_luminescence: "dial_hands",
    dial_hands: "dial_hands",
    dial_setting: "dial",
    dial_patina: "dial",
    dial: "dial",
    movement_caliber: "movement",
    movement: "movement",
    technical_movement_observed: "technical_movement",
    technical_movement_test: "technical_movement",
    technical_movement: "technical_movement",
    technical_waterproofing_test: "technical_waterproofing",
    technical_waterproofing_observed: "technical_waterproofing",
    technical_waterproofing_suspected: "technical_waterproofing",
    technical_waterproofing_case: "technical_waterproofing",
    technical_waterproofing_tested: "technical_waterproofing",
    technical_waterproofing: "technical_waterproofing",
    technical_rust: "technical_rust_corrosion",
    technical_joint: "technical_joint",
    technical_lubrification: "technical_lubrification",
    technical_weight: "technical_weight",
    history: "history",
    value: "value",
    repair: "repair",
    accessories: "accessories",
  };

  const base = fieldName.split(".")[0];
  const sortedKeys = Object.keys(sectionMap).sort(
    (a, b) => b.length - a.length,
  );
  for (const prefix of sortedKeys) {
    if (base.startsWith(prefix)) {
      return sectionMap[prefix];
    }
  }

  return base.split("_").slice(0, -1).join("_") || "general";
};

const useValidateCertificateReport = (certificateTypes: CertificateType[]) => {
  const { getAllFormData, setValidationErrors, pendingFiles } =
    useCertificateReportFormStore();
  const { selectedCertificate } = useCertificateStore();

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
          if (typeof parsed === "object") {
            normalized[key] = parsed;
          }
        } catch {}
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

    for (const entry of pendingFiles) {
      const existing = (formData[entry.fieldName] as string[]) ?? [];
      formData[entry.fieldName] = [
        ...existing,
        ...entry.files.map((f) => f.name),
      ];
    }

    const certificateType = certificateTypes.find(
      (type) => type.id === selectedCertificate?.certificate_type_id,
    );
    const excludedFields = certificateType?.excluded_report_form_fields || [];
    const requiredFormFields =
      certificateType?.required_report_form_fields || [];

    for (const field of excludedFields) {
      if (field in formData) {
        delete formData[field];
      }
    }

    const validationSchema = createValidationSchema(
      excludedFields,
      requiredFormFields,
    );

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setValidationErrors([]);
      return { isValid: true, errors: [] };
    } catch (err: any) {
      if (err instanceof ValidationError) {
        const validationErrors: FormValidationError[] = err.inner.map(
          (error: any) => {
            const fieldName = error.path;
            const section = getSectionFromField(fieldName);
            return {
              field: fieldName,
              message: error.message,
              section,
            };
          },
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
