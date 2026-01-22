import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PartnerCertificateStep,
  type CertificateDraft,
} from "@/types/certificate.d";

interface CertificateStore {
  draft: Partial<CertificateDraft>;
  setDraft: (draft: Partial<CertificateDraft>) => void;
  clearDraft: () => void;
}

const initialDraft: Partial<CertificateDraft> = {
  current_step: PartnerCertificateStep.CustomerInfos,
};

export const useCertificateStore = create<CertificateStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (updates) => {
        set((state) => ({
          draft: { ...state.draft, ...updates },
        }));
      },

      clearDraft: () => {
        set({ draft: initialDraft });
      },
    }),
    {
      name: "certificate-draft",
      partialize: (state) => ({
        draft: state.draft,
      }),
    }
  )
);
