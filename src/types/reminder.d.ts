export enum ReminderType {
  // TODO: add more types
}

export enum ReminderStatus {
  Planified = "Planifié",
  Accepted = "Accepté",
  Declined = "Refusé",
  Pending = "En attente",
}

export interface Reminder {
  id: number;
  user_id: string;
  object_id: number;
  types: ReminderType[];
  price: number;
  date: Date;
  status: ReminderStatus;
  created_at: string;
  updated_at: string;
}
