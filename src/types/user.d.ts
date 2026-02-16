export enum UserProfileType {
  Society = "society",
  Individual = "individual",
}

export enum UserProfileRole {
  User = "user",
  Partner = "partner",
  Admin = "admin",
}

export enum PartnerInfoAddressType {
  RepairShop = "repair_shop",
  Store = "store",
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserProfileRole;
  is_deleted: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  society: string;
  vat_number: string;
  type: UserProfileType;
}

export interface PartnerInfo {
  id: number;
  user_id: string;

  address: string;
  postal_code: string;
  city: string;
  country: string;
  address_type: PartnerInfoAddressType;

  delivery_address: string;
  delivery_postal_code: string;
  delivery_city: string;
  delivery_country: string;

  delivery_same_as_main: boolean;
  hide_delivery_address: boolean;

  show_hours: boolean;
  hours: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  by_appointment: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  profile?: UserProfile;
}

export interface DaySchedule {
  morning_start: string;
  morning_end: string;
  afternoon_start: string;
  afternoon_end: string;
}
