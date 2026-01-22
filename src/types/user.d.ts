export enum UserProfileType {
  Business = "business",
  Individual = "individual",
}

export enum UserProfileRole {
  User = "user",
  Partner = "partner",
  Admin = "admin",
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
  vat_number;
}
