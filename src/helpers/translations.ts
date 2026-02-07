import {
  PartnerCertificateStep,
  ClientCertificateStep,
  CertificateStatus,
  CertificateVerificationStatus,
} from "@/types/certificate.d";
import { ObjectDocumentType, ObjectStatus } from "@/types/object.d";
import { TransactionType } from "@/types/transaction.d";
import { UserProfileRole, UserProfileType } from "@/types/user.d";

// Steps
export const PartnerCertificateStepLabels: Record<
  PartnerCertificateStep,
  string
> = {
  [PartnerCertificateStep.CustomerInfos]: "Client",
  [PartnerCertificateStep.ObjectInfos]: "Objet",
  [PartnerCertificateStep.Service]: "Service",
  [PartnerCertificateStep.Payment]: "Paiement",
};

export const ClientCertificateStepLabels: Record<ClientCertificateStep, string> = {
  [ClientCertificateStep.CustomerInfos]: "Client",
  [ClientCertificateStep.ObjectInfos]: "Objet",
  [ClientCertificateStep.Service]: "Service",
  [ClientCertificateStep.Partner]: "Partenaire",
  [ClientCertificateStep.Payment]: "Paiement",
};

// Status
export const CertificateStatusLabels: Record<CertificateStatus, string> = {
  [CertificateStatus.PendingPayment]: "En attente de paiement",
  [CertificateStatus.PendingCertification]: "En attente de certification",
  [CertificateStatus.InspectionCompleted]: "Inspection complétée",
  [CertificateStatus.PaymentConfirmed]: "Paiement confirmé",
  [CertificateStatus.Completed]: "Complété",
  [CertificateStatus.Cancelled]: "Annulé",
};

export const CertificateVerificationStatusLabels: Record<
  CertificateVerificationStatus,
  string
> = {
  [CertificateVerificationStatus.Registered]: "Enregistré",
  [CertificateVerificationStatus.Authenticated]: "Authentifié",
  [CertificateVerificationStatus.Certified]: "Certifié",
};

// Objects
export const ObjectStatusLabels: Record<ObjectStatus, string> = {
  [ObjectStatus.Valid]: "Valide",
  [ObjectStatus.Stolen]: "Vol",
  [ObjectStatus.Loss]: "Perte",
  [ObjectStatus.Fraud]: "Fraude",
  [ObjectStatus.Destroyed]: "Détruit",
};

export const ObjectDocumentTypeLabels: Record<ObjectDocumentType, string> = {
  [ObjectDocumentType.WarrantyCard]: "Carte de garantie",
  [ObjectDocumentType.OriginInvoice]: "Facture d'origine",
  [ObjectDocumentType.BuyingInvoice]: "Facture d'achat",
  [ObjectDocumentType.SellingInvoice]: "Facture de vente",
  [ObjectDocumentType.OtherInvoice]: "Autre facture",
  [ObjectDocumentType.RepairDocuments]: "Documents de réparation",
  [ObjectDocumentType.InsuranceDocuments]: "Documents d'assurance",
  [ObjectDocumentType.OtherDocument]: "Autre document",
};

// Transactions
export const TransactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.Sale]: "Vente",
  [TransactionType.Purchase]: "Achat",
  [TransactionType.Transfer]: "Transfert",
};

// User types
export const UserTypeLabels: Record<UserProfileType, string> = {
  [UserProfileType.Society]: "Entreprise",
  [UserProfileType.Individual]: "Particulier",
};

// User Role
export const UserRoleLabels: Record<UserProfileRole, string> = {
  [UserProfileRole.Admin]: "Administrateur",
  [UserProfileRole.Partner]: "Partenaire",
  [UserProfileRole.User]: "Utilisateur",
};

// Functions
export const getCertificateStatusLabel = (
  status: CertificateStatus,
): string => {
  return CertificateStatusLabels[status] || status;
};

export const getUserProfileRoleLabel = (role: UserProfileRole): string => {
  return UserRoleLabels[role] || role;
};

export const getObjectStatusLabel = (status: ObjectStatus): string => {
  return ObjectStatusLabels[status] || status;
};
