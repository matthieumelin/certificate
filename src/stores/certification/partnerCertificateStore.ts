import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    PartnerCertificateStep,
    type CertificateDraft,
} from "@/types/certificate.d";

interface PartnerCertificateStore {
    draft: Partial<CertificateDraft>;
    setDraft: (draft: Partial<CertificateDraft>) => void;
    clearDraft: () => void;
}

const initialPartnerDraft: Partial<CertificateDraft> = {
    current_step: PartnerCertificateStep.CustomerInfos,
};

export const usePartnerCertificateStore = create<PartnerCertificateStore>()(
    persist(
        (set) => ({
            draft: initialPartnerDraft,
            setDraft: (updates) => {
                set((state) => ({
                    draft: { ...state.draft, ...updates },
                }));
            },
            clearDraft: () => {
                set({ draft: initialPartnerDraft });
            },
        }),
        {
            name: "partner-certificate-draft",
            partialize: (state) => ({
                draft: state.draft,
            }),
        }
    )
);