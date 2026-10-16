"use client";

import React, { createContext, useContext, useMemo, useEffect } from "react";
import { WeddingInvitationData } from "@/types/wedding";
import { DEFAULT_INVITATION_DATA } from "@/lib/invitationStore";
import { getFontFamilyCss } from "@/lib/typography";

export function normalizeWeddingData(
  incoming?: Partial<WeddingInvitationData> | null
): WeddingInvitationData {
  if (!incoming) return DEFAULT_INVITATION_DATA;

  return {
    ...DEFAULT_INVITATION_DATA,
    ...incoming,
    couple: {
      groom: {
        ...DEFAULT_INVITATION_DATA.couple.groom,
        ...(incoming.couple?.groom || {}),
      },
      bride: {
        ...DEFAULT_INVITATION_DATA.couple.bride,
        ...(incoming.couple?.bride || {}),
      },
    },
    general: {
      ...DEFAULT_INVITATION_DATA.general,
      ...(incoming.general || {}),
      quote: {
        ...DEFAULT_INVITATION_DATA.general.quote,
        ...(incoming.general?.quote || {}),
      },
    },
    themePalette: {
      ...DEFAULT_INVITATION_DATA.themePalette,
      ...(incoming.themePalette || {}),
    },
    events:
      Array.isArray(incoming.events) && incoming.events.length > 0
        ? incoming.events
        : DEFAULT_INVITATION_DATA.events,
    stories:
      Array.isArray(incoming.stories) && incoming.stories.length > 0
        ? incoming.stories
        : DEFAULT_INVITATION_DATA.stories,
    gallery:
      Array.isArray(incoming.gallery) && incoming.gallery.length > 0
        ? incoming.gallery
        : DEFAULT_INVITATION_DATA.gallery,
    gifts: {
      accounts:
        Array.isArray(incoming.gifts?.accounts) &&
        incoming.gifts.accounts.length > 0
          ? incoming.gifts.accounts
          : DEFAULT_INVITATION_DATA.gifts.accounts,
      physicalGiftAddress: {
        ...DEFAULT_INVITATION_DATA.gifts.physicalGiftAddress,
        ...(incoming.gifts?.physicalGiftAddress || {}),
      },
    },
    dresscode: {
      description:
        incoming.dresscode?.description ||
        DEFAULT_INVITATION_DATA.dresscode.description,
      colors:
        Array.isArray(incoming.dresscode?.colors) &&
        incoming.dresscode.colors.length > 0
          ? incoming.dresscode.colors
          : DEFAULT_INVITATION_DATA.dresscode.colors,
    },
  };
}

const WeddingDataContext =
  createContext<WeddingInvitationData>(DEFAULT_INVITATION_DATA);

export function WeddingDataProvider({
  data,
  children,
}: {
  data: WeddingInvitationData;
  children: React.ReactNode;
}) {
  const normalizedData = useMemo(() => normalizeWeddingData(data), [data]);
  const coupleFontFamily = useMemo(
    () => getFontFamilyCss(normalizedData.themePalette?.fontStyle),
    [normalizedData.themePalette?.fontStyle]
  );

  useEffect(() => {
    if (typeof document !== "undefined" && coupleFontFamily) {
      document.documentElement.style.setProperty(
        "--font-couple-custom",
        coupleFontFamily
      );
    }
  }, [coupleFontFamily]);

  return (
    <WeddingDataContext.Provider value={normalizedData}>
      <div
        data-theme-root="true"
        style={
          {
            "--font-couple-custom": coupleFontFamily,
          } as React.CSSProperties
        }
        className="contents"
      >
        {children}
      </div>
    </WeddingDataContext.Provider>
  );
}

export function useWeddingData(): WeddingInvitationData {
  const context = useContext(WeddingDataContext);
  return context || DEFAULT_INVITATION_DATA;
}
