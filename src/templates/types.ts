import { WeddingInvitationData } from "@/types/wedding";

export interface TemplateProps {
  data: WeddingInvitationData;
  guestName?: string;
  isPreview?: boolean;
  onOpenChange?: (open: boolean) => void;
}
