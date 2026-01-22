import { useCertificateReportFormStore } from "@/stores/certificateReportFormStore"
import { useEffect } from "react";

export const useCertificateReportForm = <T extends Record<string, any>>(values: T) => {
    const { updateFormData } = useCertificateReportFormStore();

    useEffect(() => {
        updateFormData(values);
    }, [values, updateFormData]);
}