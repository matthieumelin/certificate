/** Transaction types */
export enum TransactionType {
  Sale = "sale",
  Purchase = "purchase",
  Transfer = "transfer"
}

export interface Transaction {
  id: number;
  type: TransactionType;
  date: number;
  price: number;
  seller_id: string;
  buyer_id: string;
  country: string;
}
