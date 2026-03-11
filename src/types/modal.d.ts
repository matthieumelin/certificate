import type { ReactNode } from "react";

export interface ModalProps {
  content: ReactNode;
  onClose: () => void;
  title?: string | ReactNode;
  description?: string;
  processing?: boolean;
}
