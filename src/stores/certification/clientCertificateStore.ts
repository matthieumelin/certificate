import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    ClientCertificateStep,
    type CertificateDraft,
} from "@/types/certificate.d";

interface ClientCertificateStore {
    draft: Partial<CertificateDraft>;
    setDraft: (draft: Partial<CertificateDraft>) => void;
    clearDraft: () => void;
}

const initialClientDraft: Partial<CertificateDraft> = {
    current_step: ClientCertificateStep.CustomerInfos,
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
            partialize: (state) => ({
                draft: state.draft,
            }),
        }
    )
);