import type { ReactNode } from "react";

export interface ModalProps {
  content: ReactNode;
  onClose: () => void;
  title?: string;
  description?: string;
  processing?: boolean;
}
