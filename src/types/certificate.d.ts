import type { Object } from "@/types/object";
import type { UserProfile, UserProfileRole } from "./user";

export enum CertificateStatus {
  PendingPayment = "pending_payment",
  PaymentConfirmed = "payment_confirmed",
  InspectionCompleted = "inspection_completed",
  PendingCertification = "pending_certification",
  Completed = "completed",
  Cancelled = "cancelled",
}

export enum CertificateVerificationStatus {
  Registered = "registered",
  Authenticated = "authenticated",
  Certified = "certified",
}

export enum CertificateInspectionResult {
  InauthenticItem = "inauthentic_item",
  AuthenticItem = "authentic_item",
}

export enum PartnerCertificateStep {
  CustomerInfos = "customer_infos",
  ObjectInfos = "object_infos",
  Service = "service",
  Payment = "payment",
}

export enum ClientCertificateStep {
  CustomerInfos = "customer_infos",
  ObjectInfos = "object_infos",
  Service = "service",
  Partner = "partner",
  Payment = "payment",
}

export interface Certificate {
  id: string;
  customer_id: string;
  object_id: number;
  created_by: string;
  certificate_type_id: number | null;
  status: CertificateStatus;
  verification_status: CertificateVerificationStatus;
  payment_method_id?: number | null;
  created_at: string;
  updated_at: string;
  completed_at?: string;

  // Relations
  creator?: {
    role: UserProfileRole;
  };
  customer?: Partial<UserProfile>;
  object?: Object;
  inspection?: CertificateInspection;
}

export interface CertificateInspection {
  id: number;
  certificate_id: string;
  inspected_by: string;
  comment: string;
  result: CertificateInspectionResult;
  suspect_points: string[];
  photos: string[];
  created_at: string;
}

export interface CertificateDraft {
  id: string;
  created_by: string;
  customer_data: Partial<UserProfile>;
  object_type_id: number;
  object_brand: string;
  object_model: string;
  object_reference: string;
  object_serial_number: string;
  object_front_photo: string[];
  certificate_type_id: number;
  partner_id?: string;
  payment_method_id: number;
  stripe_session_id: string;
  current_step: ClientCertificateStep | PartnerCertificateStep;
  payment_link_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface CertificateTypeReportLimits {
  max_documents: number;
  max_repair_previous: number;
  max_history_previous_places: number;
}

export interface CertificateType {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  physical: boolean;
  is_active: boolean;
  is_recommended: boolean;
  excluded_report_form_fields: string[];
  goal: string;
  report_limits: CertificateTypeReportLimits;
  created_at: string;
  updated_at: string;
}

export interface CertificateDocument {
  id: number;
  certificate_id: number;
  type:
    | "invoice"
    | "warranty_card"
    | "certificate_of_authenticity"
    | "service_document";
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export interface CertificateHistory {
  id: number;
  certificate_id: number;
  status: CertificateStatus;
  verification_status: CertificateVerificationStatus;
  changed_by: string;
  notes?: string;
  created_at: string;
}

export interface CertificateFilters {
  status?: CertificateStatus;
  verification_status?: CertificateVerificationStatus;
  certificate_type_id?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface CertificateStats {
  total: number;
  draft: number;
  pending_payment: number;
  payment_confirmed: number;
  complete: number;
  cancelled: number;
  total_revenue: number;
}
