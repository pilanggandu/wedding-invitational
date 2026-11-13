import { WeddingInvitationData } from "@/types/wedding";

export interface TemplateProps {
  data: WeddingInvitationData;
  guestName?: string;
  guestItem?: {
    id: string;
    name: string;
    quota: number;
    token?: string;
    phone?: string;
  } | null;
  isPreview?: boolean;
  isEditor?: boolean;
  activeSection?: string;
  onOpenChange?: (open: boolean) => void;
}
