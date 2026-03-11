import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PartnerCertificateStep,
  type CertificateDraft,
} from "@/types/certificate.d";

export interface PartnerCertificateDraft extends Partial<CertificateDraft> {
  object_front_photo_file?: File | null;
}

interface PartnerCertificateStore {
  draft: PartnerCertificateDraft;
  setDraft: (draft: Partial<PartnerCertificateDraft>) => void;
  clearDraft: () => void;
}

const initialPartnerDraft: PartnerCertificateDraft = {
  current_step: PartnerCertificateStep.CustomerInfos,
  object_front_photo_file: null,
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
      partialize: (state) => {
        const { object_front_photo_file, ...draftWithoutFile } = state.draft;
        return {
          draft: draftWithoutFile,
        };
      },
    },
  ),
);
