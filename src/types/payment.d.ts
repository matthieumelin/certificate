export enum PaymentMethodType {
  Card = "card",
  InStore = "in_store"
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: PaymentMethodType;
  stripe_payment_link: string;
  is_active: boolean;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}
