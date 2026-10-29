"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ScrollMotionContext } from "@/components/ScrollMotionContext";
import { bindScrollMotion } from "./scrollMotion";
import "./invitation-motion.css";

const options = {
  selector: "[data-scroll-reveal]:not(:has([data-scroll-reveal])), section h1, section h2, section h3, section figure, section img[alt]:not([alt='']):not([aria-hidden='true'])",
  rootClass: "invitation-scroll-linked",
  itemClass: "invitation-scroll-reveal",
  prefix: "--invitation-scroll",
  photoSelector: "img, figure",
};

export function InvitationMotion({ children, disabled }: { children: React.ReactNode; disabled: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const enabled = !disabled && !reduced;
  useEffect(() => {
    const container = root.current;
    if (!container || !enabled) return;
    let cleanup = bindScrollMotion(container, options);
    const mutations = new MutationObserver(() => {
      cleanup();
      cleanup = bindScrollMotion(container, options);
    });
    mutations.observe(container, { childList: true, subtree: true });
    return () => { mutations.disconnect(); cleanup(); };
  }, [enabled]);
  return (
    <ScrollMotionContext.Provider value={Boolean(enabled)}>
      <div ref={root} className="invitation-motion contents">{children}</div>
    </ScrollMotionContext.Provider>
  );
}
