import { create } from "zustand";
import {
  type Certificate,
} from "@/types/certificate.d";


interface CertificateReportStore {
  selectedCertificate: Certificate | null;
  setSelectedCertificate: (certificate: Certificate) => void;
}

export const useCertificateStore = create<CertificateReportStore>((set) => ({
  selectedCertificate: null,
  setSelectedCertificate: (certificate: Certificate) => set({ selectedCertificate: certificate }),
}));
