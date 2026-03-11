/** Object types */
export interface ObjectType {
  id: number;
  name: string;
  label: string;
  icon: string;
  description: string;
  thumbnail: string;
  is_active: boolean;
  created_at: Date;
}

export interface ObjectCategory {
  id: number;
  type_id: number;
  name: string;
  display_name: string;
  position: number;
  created_at: Date;
}

export type ObjectAttributeValue = string | number | boolean | string[] | null;

export type ObjectAttributes = Record<string, ObjectAttributeValue>;

export interface ObjectAttribute {
  id: number;
  object_id: number;
  attributes: ObjectAttributes;
  created_at: Date;
  updated_at: Date;
}

export interface ObjectPhoto {
  id: number;
  object_id: number;
  path: string;
  type: ObjectPhotoType;
  created_at: Date;
}

export interface Object {
  id: number;
  type_id: number;
  owner_id: string;
  model: string;
  brand: string;
  reference: string;
  serial_number: string;
  surname: string;
  year_manufacture: string;
  status: ObjectStatus;
  object_photos: ObjectPhoto[];
  created_at: Date;
  updated_at: Date;
  
  // Relations
  photo_url?: string;
  object_type?: ObjectType;
}

export interface ObjectHistory {
  id: number;
  object_id: number;
  previous_place: string;
  seller: string;
  buying_date: string;
  buying_price: number;
}

export interface ObjectRepair {
  object_id: number;
  id: number;
  type: string;
  place: string;
  workshop: string;
  date: string;
}

export interface ObjectModel {
  id: number;
  name: string;
}

export interface ObjectBrand {
  id: number;
  name: string;
}

export interface ObjectReference {
  id: number;
  name: string;
}

export interface ObjectDocument {
  id: number;
  object_id: number;
  file_name: string;
  file_path: string;
  type: ObjectDocumentType;
  created_at: Date;
  updated_at: Date;
}

export enum ObjectDocumentType {
  WarrantyCard = "warranty_card",
  OriginInvoice = "origin_invoice",
  BuyingInvoice = "buying_invoice",
  SellingInvoice = "selling_invoice",
  OtherInvoice = "other_invoice",
  RepairDocuments = "repair_documents",
  InsuranceDocuments = "insurance_documents",
  OtherDocument = "other_document",
}

export enum ObjectAttributeVisibility {
  Partner = "partner",
  Customer = "customer",
  Both = "both",
}

export enum ObjectStatus {
  Valid = "valid",
  Stolen = "stolen",
  Loss = "loss",
  Fraud = "fraud",
  Destroyed = "destroyed",
}

export enum ObjectPhotoType {
  Front = "front",
}
