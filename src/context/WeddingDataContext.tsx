"use client";

import React, { createContext, useContext } from "react";
import { WeddingInvitationData } from "@/types/wedding";
import { DEFAULT_INVITATION_DATA } from "@/lib/invitationStore";

const WeddingDataContext = createContext<WeddingInvitationData>(DEFAULT_INVITATION_DATA);

export function WeddingDataProvider({
  data,
  children,
}: {
  data: WeddingInvitationData;
  children: React.ReactNode;
}) {
  return (
    <WeddingDataContext.Provider value={data || DEFAULT_INVITATION_DATA}>
      {children}
    </WeddingDataContext.Provider>
  );
}

export function useWeddingData(): WeddingInvitationData {
  const context = useContext(WeddingDataContext);
  return context || DEFAULT_INVITATION_DATA;
}
