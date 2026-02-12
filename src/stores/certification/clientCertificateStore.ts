import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ClientCertificateStep,
  type CertificateDraft,
} from "@/types/certificate.d";

export interface ClientCertificateDraft extends Partial<CertificateDraft> {
  object_front_photo_file?: File | null;
}

interface ClientCertificateStore {
  draft: ClientCertificateDraft;
  setDraft: (draft: Partial<ClientCertificateDraft>) => void;
  clearDraft: () => void;
}

const initialClientDraft: ClientCertificateDraft = {
  current_step: ClientCertificateStep.CustomerInfos,
  object_front_photo_file: null,
};

export const useClientCertificateStore = create<ClientCertificateStore>()(
  persist(
    (set) => ({
      draft: initialClientDraft,
      setDraft: (updates) => {
        set((state) => ({
          draft: { ...state.draft, ...updates },
        }));
      },
      clearDraft: () => {
        set({ draft: initialClientDraft });
      },
    }),
    {
      name: "client-certificate-draft",
      partialize: (state) => {
        const { object_front_photo_file, ...draftWithoutFile } = state.draft;
        return {
          draft: draftWithoutFile,
        };
      },
    },
  ),
);
